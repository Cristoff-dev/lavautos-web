import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import {
    type Proveedor,
    obtenerProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor as eliminarProveedorApi,
} from "../../api/apiProveedores";

export const Proveedores = () => {
    const [proveedores, asignarProveedores] = useState<Proveedor[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [error, asignarError] = useState<string | null>(null);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [proveedorEditando, asignarProveedorEditando] = useState<Proveedor | null>(null);
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [errorFormulario, asignarErrorFormulario] = useState<string | null>(null);

    const [formulario, asignarFormulario] = useState({
        rif: "",
        nombre: "",
        telefono: "",
        email: "",
        activo: true,
    });

    const columnas: { llave: keyof Proveedor; etiqueta: string }[] = [
        { llave: "rif", etiqueta: "RIF" },
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "telefono", etiqueta: "Teléfono" },
        { llave: "email", etiqueta: "Email" },
    ];

    const cargarProveedores = async () => {
        try {
            asignarCargando(true);
            asignarError(null);
            const datos = await obtenerProveedores();
            asignarProveedores(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            asignarError("No se pudo conectar con el servidor. Verifique que el backend esté activo.");
            console.error(err);
        } finally {
            asignarCargando(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        asignarErrorFormulario(null);
        
        if (!formulario.rif.trim()) {
            asignarErrorFormulario("Por favor ingresa el RIF o documento de identidad del proveedor.");
            return;
        }
        const primeraLetraRif = formulario.rif.trim().charAt(0).toUpperCase();
        if (!/^[JVEGC]$/.test(primeraLetraRif)) {
            asignarErrorFormulario("La inicial del RIF no es válida. Solo se permite comenzar con: J, V, E, G o C.");
            return;
        }
        if (!/^[JVEGC]+[0-9\-]*$/i.test(formulario.rif.trim())) {
            asignarErrorFormulario("El RIF debe comenzar obligatoriamente con J, V, E, G o C seguida únicamente de números (se permiten guiones).");
            return;
        }
        if (formulario.rif.length < 6) {
            asignarErrorFormulario("El RIF ingresado es demasiado corto. Verifica su longitud.");
            return;
        }
        if (!formulario.nombre.trim()) {
            asignarErrorFormulario("Es imperativo colocar la razón social o nombre comercial del proveedor.");
            return;
        }
        if (!formulario.telefono.trim()) {
            asignarErrorFormulario("El teléfono de contacto del proveedor es un campo obligatorio.");
            return;
        }
        if (!/^[0-9]+$/.test(formulario.telefono.trim())) {
            asignarErrorFormulario("El teléfono solo puede contener números, no letras ni caracteres especiales.");
            return;
        }
        if (formulario.telefono.length < 10) {
            asignarErrorFormulario("El número de teléfono ingresado está incompleto, faltan dígitos.");
            return;
        }
        if (!formulario.email.trim()) {
            asignarErrorFormulario("El correo electrónico es indispensable para registrar al proveedor.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
            asignarErrorFormulario("El correo electrónico ingresado tiene un formato inválido. Revisa que tenga un '@' y un dominio válido.");
            return;
        }

        try {
            if (proveedorEditando) {
                await actualizarProveedor(proveedorEditando.id, formulario);
            } else {
                await crearProveedor(formulario);
            }
            asignarModalAbierto(false);
            await cargarProveedores();
        } catch (err) {
            console.error(err);
            asignarErrorFormulario("Error al guardar el proveedor. Intente de nuevo.");
        }
    };

    const abrirModalCrear = () => {
        asignarErrorFormulario(null);
        asignarProveedorEditando(null);
        asignarFormulario({ rif: "", nombre: "", telefono: "", email: "", activo: true });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (proveedor: Proveedor) => {
        asignarErrorFormulario(null);
        asignarProveedorEditando(proveedor);
        asignarFormulario({
            rif: proveedor.rif,
            nombre: proveedor.nombre,
            telefono: proveedor.telefono,
            email: proveedor.email,
            activo: proveedor.activo,
        });
        asignarModalAbierto(true);
    };

    const manejarEliminar = async (id: string) => {
        if (!confirm("¿Seguro que desea eliminar este proveedor?")) return;
        try {
            await eliminarProveedorApi(id);
            await cargarProveedores();
        } catch (err) {
            console.error(err);
            alert("Error al eliminar el proveedor.");
        }
    };

    const cambiarActivo = async (proveedor: Proveedor, activo: boolean) => {
        try {
            await actualizarProveedor(proveedor.id, { ...proveedor, activo });
            await cargarProveedores();
        } catch (err) {
            console.error(err);
            alert("Error al cambiar el estado del proveedor.");
        }
    };

    const proveedoresFiltrados = proveedores.filter(p => {
        const coincideEstado = view === 'activos' ? p.activo : !p.activo;
        if (!coincideEstado) return false;
        if (busqueda.trim() === "") return true;
        const searchLow = busqueda.toLowerCase();
        return (
            (p.rif?.toLowerCase() || "").includes(searchLow) ||
            (p.nombre?.toLowerCase() || "").includes(searchLow) ||
            (p.telefono?.toLowerCase() || "").includes(searchLow) ||
            (p.email?.toLowerCase() || "").includes(searchLow)
        );
    });

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Gestión de <span className="text-cyan-400">Proveedores</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Buscar proveedor..." 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" 
                    />
                    <button
                        onClick={abrirModalCrear}
                        className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-all"
                    >
                        NUEVO
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible shadow-2xl relative">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            {columnas.map((columna) => (
                                <th key={columna.llave} className="px-6 py-4">
                                    {columna.etiqueta}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {proveedoresFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                    No hay proveedores para mostrar
                                </td>
                            </tr>
                        ) : (
                            proveedoresFiltrados.map((proveedor) => (
                                <tr key={proveedor.id} className="hover:bg-slate-800/30 transition-colors group">
                                    {columnas.map((columna) => (
                                        <td key={columna.llave} className={`px-6 py-4 ${columna.llave === "nombre" ? "font-mono text-cyan-400 font-bold tracking-widest" : "text-slate-200"}`}>
                                            {String(proveedor[columna.llave] ?? "")}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {view === 'activos' ? (
                                                <>
                                                    <button onClick={() => abrirModalEditar(proveedor)} title="Editar" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                                                    <button onClick={() => cambiarActivo(proveedor, false)} title="Mover a papelera" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => cambiarActivo(proveedor, true)} title="Restaurar" className="p-2 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-all text-lg">♻️</button>
                                                    <button onClick={() => manejarEliminar(proveedor.id)} title="Eliminar Definitivamente" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">❌</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                abierto={modalAbierto}
                alCerrar={() => asignarModalAbierto(false)}
                titulo={proveedorEditando ? "Editar Proveedor" : "Nuevo Proveedor"}
            >
                {errorFormulario && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                        {errorFormulario}
                    </div>
                )}
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">RIF</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: J-12345678-9"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.rif}
                            onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                // Remove letters that are not at the start
                                const formatted = val.replace(/(?!^)[A-Z]/g, '');
                                asignarFormulario({ ...formulario, rif: formatted });
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                        <input required type="text" placeholder="Ej: Distribuidora Automotriz CA" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.nombre} onChange={(e) => asignarFormulario({ ...formulario, nombre: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                        <input required type="text" placeholder="Ej: 04141234567" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.telefono} onChange={(e) => asignarFormulario({ ...formulario, telefono: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input required type="email" placeholder="Ej: ventas@distribuidora.com" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.email} onChange={(e) => asignarFormulario({ ...formulario, email: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={() => asignarModalAbierto(false)} className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-800 font-medium transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 font-medium transition-colors cursor-pointer">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
