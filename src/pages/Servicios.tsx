import { useState, useEffect } from "react";
import { Tabla } from "../components/UI/Tabla";
import { Modal } from "../components/UI/Modal";

interface Servicio {
    id: string;
    nombre: string;
    precio: number;
    duracionMinutos: number;
}

export const Servicios = () => {
    const [servicios, asignarServicios] = useState<Servicio[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [servicioEditando, asignarServicioEditando] = useState<Servicio | null>(null);

    const [formulario, asignarFormulario] = useState({
        nombre: "",
        precio: 0,
        duracionMinutos: 0,
    });

    const columnas: { llave: keyof Servicio; etiqueta: string }[] = [
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "precio", etiqueta: "Precio ($)" },
        { llave: "duracionMinutos", etiqueta: "Duración (min)" },
    ];

    const cargarServicios = async () => {
        try {
            asignarCargando(true);
            const datosFalsos: Servicio[] = [
                { id: "1", nombre: "Lavado de Motor, Aspirado profundo", precio: 25.0, duracionMinutos: 45 },
                { id: "2", nombre: "Encerado y Pulido Exterior", precio: 40.0, duracionMinutos: 90 },
            ];
            setTimeout(() => {
                asignarServicios(datosFalsos);
                asignarCargando(false);
            }, 500);
        } catch (error) {
            console.error(error);
            asignarCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarServicios();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            asignarModalAbierto(false);
            cargarServicios();
        } catch (error) {
            console.error(error);
        }
    };

    const abrirModalCrear = () => {
        asignarServicioEditando(null);
        asignarFormulario({ nombre: "", precio: 0, duracionMinutos: 0 });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (servicio: Servicio) => {
        asignarServicioEditando(servicio);
        asignarFormulario({
            nombre: servicio.nombre,
            precio: servicio.precio,
            duracionMinutos: servicio.duracionMinutos,
        });
        asignarModalAbierto(true);
    };

    const eliminarServicio = async (_id: string) => {
        if (confirm("¿Seguro que desea eliminar este servicio?")) {
            cargarServicios();
        }
    };

    if (cargando) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;

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
                        <button onClick={() => eliminarServicio(fila.id)} className="text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer">
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
