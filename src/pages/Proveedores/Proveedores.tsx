import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { DropdownMenu } from "../../components/UI/DropdownMenu";
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
        { llave: "activo", etiqueta: "Estado" },
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
            alert("Error al guardar el proveedor. Intente de nuevo.");
        }
    };

    const abrirModalCrear = () => {
        asignarProveedorEditando(null);
        asignarFormulario({ rif: "", nombre: "", telefono: "", email: "", activo: true });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (proveedor: Proveedor) => {
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

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Gestión de <span className="text-cyan-400">Proveedores</span>
                    </h2>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Buscar proveedor..." className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" />
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
                        {proveedores.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                    No hay proveedores disponibles
                                </td>
                            </tr>
                        ) : (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.id} className={`hover:bg-slate-800/30 transition-colors group ${!proveedor.activo ? "bg-slate-800/20" : ""}`}>
                                    {columnas.map((columna) => (
                                        <td key={columna.llave} className={`px-6 py-4 ${!proveedor.activo && columna.llave !== "activo" ? "opacity-50" : ""} ${columna.llave === "nombre" ? "font-mono text-cyan-400 font-bold tracking-widest" : "text-slate-200"}`}>
                                            {(() => {
                                                const valor = proveedor[columna.llave];
                                                if (columna.llave === "activo") {
                                                    const esActivo = valor as boolean;
                                                    return (
                                                        <select
                                                            value={esActivo ? "Activo" : "Inactivo"}
                                                            onChange={(e) => cambiarActivo(proveedor, e.target.value === "Activo")}
                                                            className={`bg-slate-800 border ${esActivo ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"} rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-cyan-500 transition-colors text-sm font-medium`}
                                                        >
                                                            <option value="Activo" className="text-green-400 bg-slate-900">Activo</option>
                                                            <option value="Inactivo" className="text-red-400 bg-slate-900">Inactivo</option>
                                                        </select>
                                                    );
                                                }
                                                return String(valor ?? "");
                                            })()}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <DropdownMenu
                                                trigger={
                                                    <div className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer p-2 rounded hover:bg-slate-700 transition-colors">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </div>
                                                }
                                                items={[
                                                    {
                                                        label: "Editar",
                                                        onClick: () => abrirModalEditar(proveedor),
                                                        className: "text-cyan-400 hover:text-cyan-300"
                                                    },
                                                    {
                                                        label: "Eliminar",
                                                        onClick: () => manejarEliminar(proveedor.id),
                                                        className: "text-red-400 hover:text-red-300"
                                                    }
                                                ]}
                                            />
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
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">RIF</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: J-12345678-9"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.rif}
                            onChange={(e) => asignarFormulario({ ...formulario, rif: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                        <input required type="text" placeholder="Ej: Distribuidora Automotriz CA" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.nombre} onChange={(e) => asignarFormulario({ ...formulario, nombre: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                        <input type="text" placeholder="Ej: 0414-1234567" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.telefono} onChange={(e) => asignarFormulario({ ...formulario, telefono: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input type="email" placeholder="Ej: ventas@distribuidora.com" className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" value={formulario.email} onChange={(e) => asignarFormulario({ ...formulario, email: e.target.value })} />
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
