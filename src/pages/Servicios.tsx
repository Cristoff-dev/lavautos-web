import { useState, useEffect } from "react";
import { Tabla } from "../components/UI/Tabla";
import { Modal } from "../components/UI/Modal";
import {
    type Servicio,
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio as eliminarServicioApi,
} from "../api/apiServicios";

export const Servicios = () => {
    const [servicios, asignarServicios] = useState<Servicio[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [error, asignarError] = useState<string | null>(null);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [servicioEditando, asignarServicioEditando] = useState<Servicio | null>(null);

    const [formulario, asignarFormulario] = useState({
        nombre: "",
        precio: 0,
        duracionMinutos: 0,
        descripcion: "",
    });

    const columnas: { llave: keyof Servicio; etiqueta: string }[] = [
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "precio", etiqueta: "Precio ($)" },
        { llave: "duracionMinutos", etiqueta: "Duración (min)" },
    ];

    const cargarServicios = async () => {
        try {
            asignarCargando(true);
            asignarError(null);
            const datos = await obtenerServicios();
            asignarServicios(datos);
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
            if (servicioEditando) {
                await actualizarServicio(servicioEditando.id, formulario);
            } else {
                await crearServicio(formulario);
            }
            asignarModalAbierto(false);
            await cargarServicios();
        } catch (err) {
            console.error(err);
            alert("Error al guardar el servicio. Intente de nuevo.");
        }
    };

    const abrirModalCrear = () => {
        asignarServicioEditando(null);
        asignarFormulario({ nombre: "", precio: 0, duracionMinutos: 0, descripcion: "" });
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
            await cargarServicios();
        } catch (err) {
            console.error(err);
            alert("Error al eliminar el servicio.");
        }
    };

    if (cargando) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <Tabla
                titulo="Servicios"
                columnas={columnas}
                datos={servicios}
                alCrearNuevo={abrirModalCrear}
                acciones={(fila) => (
                    <div className="flex gap-3">
                        <button onClick={() => abrirModalEditar(fila)} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer">
                            Editar
                        </button>
                        <button onClick={() => manejarEliminar(fila.id)} className="text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer">
                            Eliminar
                        </button>
                    </div>
                )}
            />

            <Modal
                abierto={modalAbierto}
                alCerrar={() => asignarModalAbierto(false)}
                titulo={servicioEditando ? "Editar Servicio" : "Nuevo Servicio"}
            >
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.nombre}
                            onChange={(e) => asignarFormulario({ ...formulario, nombre: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.precio}
                            onChange={(e) => asignarFormulario({ ...formulario, precio: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                        <input
                            required
                            type="number"
                            min="1"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.duracionMinutos}
                            onChange={(e) => asignarFormulario({ ...formulario, duracionMinutos: parseInt(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.descripcion}
                            onChange={(e) => asignarFormulario({ ...formulario, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => asignarModalAbierto(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors cursor-pointer"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
