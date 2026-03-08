import { useState, useEffect } from "react";
import { Tabla } from "../components/UI/Tabla";
import { Modal } from "../components/UI/Modal";

interface Proveedor {
    id: string;
    nombre: string;
    contacto: string;
    telefono: string;
    estado: string;
}

export const Proveedores = () => {
    const [proveedores, asignarProveedores] = useState<Proveedor[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [proveedorEditando, asignarProveedorEditando] = useState<Proveedor | null>(null);

    const [formulario, asignarFormulario] = useState({
        nombre: "",
        contacto: "",
        telefono: "",
        estado: "Activo",
    });

    const columnas: { llave: keyof Proveedor; etiqueta: string }[] = [
        { llave: "nombre", etiqueta: "Nombre" },
        { llave: "contacto", etiqueta: "Contacto" },
        { llave: "telefono", etiqueta: "Teléfono" },
        { llave: "estado", etiqueta: "Estado" },
    ];

    const cargarProveedores = async () => {
        try {
            asignarCargando(true);
            const datosFalsos: Proveedor[] = [
                { id: "1", nombre: "Químicos 3M", contacto: "Carlos Ruiz", telefono: "555-0123", estado: "Activo" },
                { id: "2", nombre: "Distribuidora AutoBrillo", contacto: "María López", telefono: "555-0199", estado: "Activo" },
            ];
            setTimeout(() => {
                asignarProveedores(datosFalsos);
                asignarCargando(false);
            }, 500);
        } catch (error) {
            console.error(error);
            asignarCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarProveedores();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            asignarModalAbierto(false);
            cargarProveedores();
        } catch (error) {
            console.error(error);
        }
    };

    const abrirModalCrear = () => {
        asignarProveedorEditando(null);
        asignarFormulario({ nombre: "", contacto: "", telefono: "", estado: "Activo" });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (proveedor: Proveedor) => {
        asignarProveedorEditando(proveedor);
        asignarFormulario({
            nombre: proveedor.nombre,
            contacto: proveedor.contacto,
            telefono: proveedor.telefono,
            estado: proveedor.estado,
        });
        asignarModalAbierto(true);
    };

    const eliminarProveedor = async (_id: string) => {
        if (confirm("¿Seguro que desea eliminar este proveedor?")) {
            cargarProveedores();
        }
    };

    if (cargando) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <Tabla
                titulo="Proveedores"
                columnas={columnas}
                datos={proveedores}
                alCrearNuevo={abrirModalCrear}
                acciones={(fila) => (
                    <div className="flex gap-3">
                        <button onClick={() => abrirModalEditar(fila)} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer">
                            Editar
                        </button>
                        <button onClick={() => eliminarProveedor(fila.id)} className="text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer">
                            Eliminar
                        </button>
                    </div>
                )}
            />

            <Modal
                abierto={modalAbierto}
                alCerrar={() => asignarModalAbierto(false)}
                titulo={proveedorEditando ? "Editar Proveedor" : "Nuevo Proveedor"}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.contacto}
                            onChange={(e) => asignarFormulario({ ...formulario, contacto: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.telefono}
                            onChange={(e) => asignarFormulario({ ...formulario, telefono: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            value={formulario.estado}
                            onChange={(e) => asignarFormulario({ ...formulario, estado: e.target.value })}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
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
