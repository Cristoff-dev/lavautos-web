import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { useServicios, type Servicio } from "../../hooks/useServicios";

export const Servicios = () => {
    const { listar: obtenerServicios, registrar: crearServicio, actualizar: actualizarServicio, eliminar: eliminarServicioApi, exportarReporte } = useServicios();

    const [servicios, asignarServicios] = useState<Servicio[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [error, asignarError] = useState<string | null>(null);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [servicioEditando, asignarServicioEditando] = useState<Servicio | null>(null);
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [errorFormulario, asignarErrorFormulario] = useState<string | null>(null);

    const [formulario, asignarFormulario] = useState<{nombre: string, precio: number | "", duracionMinutos: number | "", descripcion: string, tipoVehiculo: string, activo: boolean}>({
        nombre: "",
        precio: "",
        duracionMinutos: "",
        descripcion: "",
        tipoVehiculo: "SEDAN",
        activo: true,
    });

    const columnas: { llave: keyof Servicio; etiqueta: string }[] = [
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "tipoVehiculo", etiqueta: "Tipo de Vehículo" },
        { llave: "precio", etiqueta: "Precio ($)" },
        { llave: "duracionMinutos", etiqueta: "Duraci\u00f3n (min)" },
        { llave: "descripcion", etiqueta: "Descripci\u00f3n" },
    ];

    const cargarServicios = async () => {
        try {
            asignarCargando(true);
            asignarError(null);
            const datos = await obtenerServicios();
            asignarServicios(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            asignarError("No se pudo conectar con el servidor. Verifique que el backend esté activo.");
            console.error(err);
        } finally {
            asignarCargando(false);
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        asignarErrorFormulario(null);

        if (!formulario.nombre.trim()) {
            asignarErrorFormulario("Por favor, ingresa el nombre del servicio.");
            return;
        }
        if (formulario.precio === "") {
            asignarErrorFormulario("Debes indicar un precio. Si es gratuito, coloca 0.");
            return;
        }
        if (Number(formulario.precio) < 0) {
            asignarErrorFormulario("El precio del servicio no puede ser un valor negativo.");
            return;
        }
        if (formulario.duracionMinutos === "") {
            asignarErrorFormulario("No olvides indicar el tiempo estimado que tomará este servicio.");
            return;
        }
        if (Number(formulario.duracionMinutos) <= 0) {
            asignarErrorFormulario("La duración debe ser al menos de 1 minuto.");
            return;
        }
        if (Number(formulario.duracionMinutos) > 1440) {
            asignarErrorFormulario("La duración del servicio es demasiado larga (máximo 24 horas - 1440 minutos).");
            return;
        }
        if (!formulario.descripcion.trim()) {
            asignarErrorFormulario("Es necesario dejar una breve descripción explicando en qué consiste el servicio.");
            return;
        }

        try {
            const datosGuardar = {
                ...formulario,
                precio: Number(formulario.precio) || 0,
                duracionMinutos: Number(formulario.duracionMinutos) || 0
            };
            if (servicioEditando) {
                await actualizarServicio(servicioEditando.id, datosGuardar as any);
            } else {
                await crearServicio(datosGuardar as any);
            }
            asignarModalAbierto(false);
            const datos = await obtenerServicios();
            asignarServicios(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            console.error(err);
            asignarErrorFormulario("Error al guardar el servicio. Intente de nuevo.");
        }
    };

    const abrirModalCrear = () => {
        asignarErrorFormulario(null);
        asignarServicioEditando(null);
        asignarFormulario({ nombre: "", precio: "", duracionMinutos: "", descripcion: "", tipoVehiculo: "SEDAN", activo: true });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (servicio: Servicio) => {
        asignarErrorFormulario(null);
        asignarServicioEditando(servicio);
        asignarFormulario({
            nombre: servicio.nombre,
            precio: servicio.precio,
            duracionMinutos: servicio.duracionMinutos,
            descripcion: servicio.descripcion ?? "",
            tipoVehiculo: servicio.tipoVehiculo,
            activo: servicio.activo,
        });
        asignarModalAbierto(true);
    };

    const manejarEliminar = async (id: string) => {
        if (!confirm("¿Seguro que desea eliminar este servicio?")) return;
        try {
            await eliminarServicioApi(id);
            const datos = await obtenerServicios();
            asignarServicios(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            console.error(err);
            alert("Error al eliminar el servicio.");
        }
    };

    const cambiarActivo = async (servicio: Servicio, activo: boolean) => {
        try {
            await actualizarServicio(servicio.id, { ...servicio, activo });
            await cargarServicios();
        } catch (err) {
            console.error(err);
            alert("Error al cambiar el estado del servicio.");
        }
    };

    const serviciosFiltrados = servicios.filter(s => {
        const coincideEstado = view === 'activos' ? s.activo : !s.activo;
        if (!coincideEstado) return false;
        if (busqueda.trim() === "") return true;
        const searchLow = busqueda.toLowerCase();
        
        return (
            (s.id?.toLowerCase() || "").includes(searchLow) ||
            (s.nombre?.toLowerCase() || "").includes(searchLow)
        );
    });

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Gesti&oacute;n de <span className="text-cyan-400">Servicios</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Buscar servicio..." 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" 
                    />
                    <button
                        onClick={exportarReporte}
                        className="bg-slate-700 text-cyan-400 px-6 py-2 rounded-xl font-bold hover:bg-slate-600 transition-all border border-cyan-500/30"
                    >
                        REPORTE PDF
                    </button>
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
                        {serviciosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                    No hay servicios para mostrar
                                </td>
                            </tr>
                        ) : (
                            serviciosFiltrados.map((servicio) => (
                                <tr key={servicio.id} className="hover:bg-slate-800/30 transition-colors group">
                                    {columnas.map((columna) => (
                                        <td key={columna.llave} className={`px-6 py-4 ${columna.llave === "nombre" ? "font-mono text-cyan-400 font-bold tracking-widest" : "text-slate-200"}`}>
                                            {(() => {
                                                const valor = servicio[columna.llave];
                                                if (columna.llave === "tipoVehiculo") {
                                                    const dict: Record<string, string> = { SEDAN: "Sedán", CAMIONETA: "Camioneta", MOTO: "Moto", CAMION: "Camión" };
                                                    return (
                                                        <span className="bg-slate-800 text-cyan-300 px-2 py-1 rounded text-xs font-bold tracking-wider">
                                                            {dict[valor as string] || valor}
                                                        </span>
                                                    );
                                                }
                                                return String(valor ?? "");
                                            })()}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            {view === 'activos' ? (
                                                <>
                                                    <button onClick={() => abrirModalEditar(servicio)} title="Editar" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                                                    <button onClick={() => cambiarActivo(servicio, false)} title="Mover a papelera" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => cambiarActivo(servicio, true)} title="Restaurar" className="p-2 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-all text-lg">♻️</button>
                                                    <button onClick={() => manejarEliminar(servicio.id)} title="Eliminar Definitivamente" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">❌</button>
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
                titulo={servicioEditando ? "Editar Servicio" : "Nuevo Servicio"}
            >
                {errorFormulario && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                        {errorFormulario}
                    </div>
                )}
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Lavado Básico"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.nombre}
                            onChange={(e) => asignarFormulario({ ...formulario, nombre: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Vehículo</label>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.tipoVehiculo}
                            onChange={(e) => asignarFormulario({ ...formulario, tipoVehiculo: e.target.value })}
                        >
                            <option value="SEDAN">Sedán</option>
                            <option value="CAMIONETA">Camioneta</option>
                            <option value="MOTO">Moto</option>
                            <option value="CAMION">Camión</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Precio ($)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ej: 500"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.precio}
                            onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
                            onChange={(e) => asignarFormulario({ ...formulario, precio: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Duraci&oacute;n (minutos)</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="1440"
                            placeholder="Ej: 45"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.duracionMinutos}
                            onKeyDown={(e) => { if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault(); }}
                            onChange={(e) => asignarFormulario({ ...formulario, duracionMinutos: e.target.value === "" ? "" : parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Descripci&oacute;n</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Lavado exterior e interior..."
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.descripcion}
                            onChange={(e) => asignarFormulario({ ...formulario, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => asignarModalAbierto(false)}
                            className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 font-medium transition-colors cursor-pointer"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
