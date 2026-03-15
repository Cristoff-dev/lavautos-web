import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { DropdownMenu } from "../../components/UI/DropdownMenu";
import {
    type Servicio,
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio as eliminarServicioApi,
} from "../../api/apiServicios";

export const Servicios = () => {
    const [servicios, asignarServicios] = useState<Servicio[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [error, asignarError] = useState<string | null>(null);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [servicioEditando, asignarServicioEditando] = useState<Servicio | null>(null);

    const [formulario, asignarFormulario] = useState<{ nombre: string, precio: number | "", duracionMinutos: number | "", descripcion: string }>({
        nombre: "",
        precio: "",
        duracionMinutos: "",
        descripcion: "",
    });

    const columnas: { llave: keyof Servicio; etiqueta: string }[] = [
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "precio", etiqueta: "Precio ($)" },
        { llave: "duracionMinutos", etiqueta: "Duraci\u00f3n (min)" },
        { llave: "descripcion", etiqueta: "Descripci\u00f3n" },
    ];

    const cargarServicios = async () => {
        try {
            asignarCargando(true);
            asignarError(null);
            const datos = await obtenerServicios();
            asignarServicios(datos.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
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
            asignarServicios(datos.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
        } catch (err) {
            console.error(err);
            alert("Error al guardar el servicio. Intente de nuevo.");
        }
    };

    const abrirModalCrear = () => {
        asignarServicioEditando(null);
        asignarFormulario({ nombre: "", precio: "", duracionMinutos: "", descripcion: "" });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (servicio: Servicio) => {
        asignarServicioEditando(servicio);
        asignarFormulario({
            nombre: servicio.nombre,
            precio: servicio.precio,
            duracionMinutos: servicio.duracionMinutos,
            descripcion: servicio.descripcion ?? "",
        });
        asignarModalAbierto(true);
    };

    const manejarEliminar = async (id: string) => {
        if (!confirm("¿Seguro que desea eliminar este servicio?")) return;
        try {
            await eliminarServicioApi(id);
            const datos = await obtenerServicios();
            asignarServicios(datos.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
        } catch (err) {
            console.error(err);
            alert("Error al eliminar el servicio.");
        }
    };

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Gesti&oacute;n de <span className="text-cyan-400">Servicios</span>
                    </h2>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Buscar servicio..." className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" />
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
                        {servicios.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                    No hay servicios disponibles
                                </td>
                            </tr>
                        ) : (
                            servicios.map((servicio) => (
                                <tr key={servicio.id} className="hover:bg-slate-800/30 transition-colors group">
                                    {columnas.map((columna) => (
                                        <td key={columna.llave} className={`px-6 py-4 ${columna.llave === "nombre" ? "font-mono text-cyan-400 font-bold tracking-widest" : "text-slate-200"}`}>
                                            {servicio[columna.llave]}
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
                                                        onClick: () => abrirModalEditar(servicio),
                                                        className: "text-cyan-400 hover:text-cyan-300"
                                                    },
                                                    {
                                                        label: "Eliminar",
                                                        onClick: () => manejarEliminar(servicio.id),
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
                titulo={servicioEditando ? "Editar Servicio" : "Nuevo Servicio"}
            >
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Precio ($)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ej: 500"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.precio}
                            onChange={(e) => asignarFormulario({ ...formulario, precio: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Duraci&oacute;n (minutos)</label>
                        <input
                            required
                            type="number"
                            min="1"
                            placeholder="Ej: 45"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.duracionMinutos}
                            onChange={(e) => asignarFormulario({ ...formulario, duracionMinutos: e.target.value === "" ? "" : parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Descripci&oacute;n (opcional)</label>
                        <input
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
