import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { useTipoVehiculos } from "../../hooks/useTipoVehiculos";
import type { TipoVehiculo, TipoVehiculoDTO } from "../../models/tipoVehiculo";

export const TipoVehiculoPage = () => {
    const { listar, registrar, actualizar, desactivar, reactivar, exportarReporte } = useTipoVehiculos();

    const [tipos, asignarTipos] = useState<TipoVehiculo[]>([]);
    const [cargando, asignarCargando] = useState(true);
    const [error, asignarError] = useState<string | null>(null);
    const [modalAbierto, asignarModalAbierto] = useState(false);
    const [vehiculoEditando, asignarVehiculoEditando] = useState<TipoVehiculo | null>(null);
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [errorFormulario, asignarErrorFormulario] = useState<string | null>(null);

    const [formulario, asignarFormulario] = useState<{
        placa: string;
        marca: string;
        modelo: string;
        color: string;
        clase: string;
        clienteId: number | "";
    }>({
        placa: "",
        marca: "",
        modelo: "",
        color: "",
        clase: "CARRO",
        clienteId: ""
    });

    const columnas: { llave: keyof TipoVehiculo; etiqueta: string }[] = [
        { llave: "placa", etiqueta: "Placa" },
        { llave: "marca", etiqueta: "Marca" },
        { llave: "modelo", etiqueta: "Modelo" },
        { llave: "color", etiqueta: "Color" },
        { llave: "clase", etiqueta: "Clase" },
    ];

    const cargarVehiculos = async () => {
        try {
            asignarCargando(true);
            asignarError(null);
            const datos = await listar();
            asignarTipos(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            asignarError("No se pudo conectar con el servidor. Verifique que el backend esté activo.");
            console.error(err);
        } finally {
            asignarCargando(false);
        }
    };

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        asignarErrorFormulario(null);

        if (!formulario.placa.trim()) {
            asignarErrorFormulario("Por favor ingresa la placa del vehículo.");
            return;
        }
        if (!formulario.marca.trim() || !formulario.modelo.trim() || !formulario.color.trim()) {
            asignarErrorFormulario("La marca, modelo y color son obligatorios.");
            return;
        }
        if (formulario.clienteId === "" || Number(formulario.clienteId) <= 0) {
            asignarErrorFormulario("El ID de cliente es obligatorio y debe ser un número válido.");
            return;
        }

        try {
            const dataToSave: TipoVehiculoDTO = {
                placa: formulario.placa.trim().toUpperCase(),
                marca: formulario.marca.trim(),
                modelo: formulario.modelo.trim(),
                color: formulario.color.trim(),
                clase: formulario.clase as any,
                clienteId: Number(formulario.clienteId)
            };

            if (vehiculoEditando) {
                await actualizar(vehiculoEditando.id, dataToSave);
            } else {
                await registrar(dataToSave);
            }

            asignarModalAbierto(false);
            await cargarVehiculos();
        } catch (err: any) {
            console.error(err);
            if (err?.response?.data?.message === "La placa ya está registrada.") {
                asignarErrorFormulario("La placa ingresada ya se encuentra registrada en el sistema.");
            } else {
                asignarErrorFormulario("Error al guardar el vehículo. Intente de nuevo.");
            }
        }
    };

    const abrirModalCrear = () => {
        asignarErrorFormulario(null);
        asignarVehiculoEditando(null);
        asignarFormulario({ placa: "", marca: "", modelo: "", color: "", clase: "CARRO", clienteId: "" });
        asignarModalAbierto(true);
    };

    const abrirModalEditar = (vehiculo: TipoVehiculo) => {
        asignarErrorFormulario(null);
        asignarVehiculoEditando(vehiculo);
        asignarFormulario({
            placa: vehiculo.placa,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            color: vehiculo.color,
            clase: vehiculo.clase,
            clienteId: vehiculo.clienteId,
        });
        asignarModalAbierto(true);
    };

    const cambiarActivo = async (vehiculo: TipoVehiculo, esActivo: boolean) => {
        try {
            if (esActivo) {
                await reactivar(vehiculo.id);
            } else {
                await desactivar(vehiculo.id);
            }
            await cargarVehiculos();
        } catch (err) {
            console.error(err);
            alert("Error al cambiar el estado del vehículo.");
        }
    };

    const vehiculosFiltrados = tipos.filter(v => {
        const coincideEstado = view === 'activos' ? v.activo : !v.activo;
        if (!coincideEstado) return false;
        if (busqueda.trim() === "") return true;
        const searchLow = busqueda.toLowerCase();

        return (
            (v.placa?.toLowerCase() || "").includes(searchLow) ||
            (v.marca?.toLowerCase() || "").includes(searchLow) ||
            (v.modelo?.toLowerCase() || "").includes(searchLow) ||
            (v.color?.toLowerCase() || "").includes(searchLow)
        );
    });

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Catálogo de <span className="text-cyan-400">Vehículos</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar por placa, marca..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64"
                    />
                    <button
                        onClick={exportarReporte}
                        className="bg-slate-700 text-cyan-400 px-6 py-2 rounded-xl font-bold hover:bg-slate-600 transition-all border border-cyan-500/30 whitespace-nowrap"
                    >
                        REPORTE PDF
                    </button>
                    <button
                        onClick={abrirModalCrear}
                        className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-all whitespace-nowrap"
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
                        {vehiculosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                    No hay vehículos para mostrar
                                </td>
                            </tr>
                        ) : (
                            vehiculosFiltrados.map((vehiculo) => (
                                <tr key={vehiculo.id} className="hover:bg-slate-800/30 transition-colors group">
                                    {columnas.map((columna) => (
                                        <td key={columna.llave} className={`px-6 py-4 ${columna.llave === "placa" ? "font-mono text-cyan-400 font-bold tracking-widest uppercase" : "text-slate-200"}`}>
                                            {(() => {
                                                const valor = vehiculo[columna.llave];
                                                if (columna.llave === "clase") {
                                                    const dict: Record<string, string> = { CARRO: "Carro", MOTO: "Moto", CAMION: "Camión" };
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
                                                    <button onClick={() => abrirModalEditar(vehiculo)} title="Editar" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                                                    <button onClick={() => cambiarActivo(vehiculo, false)} title="Mover a papelera" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => cambiarActivo(vehiculo, true)} title="Restaurar" className="p-2 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-all text-lg">♻️</button>
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
                titulo={vehiculoEditando ? "Editar Vehículo" : "Nuevo Vehículo"}
            >
                {errorFormulario && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                        {errorFormulario}
                    </div>
                )}
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Placa</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: ABC-123"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow font-mono uppercase"
                            value={formulario.placa}
                            onChange={(e) => asignarFormulario({ ...formulario, placa: e.target.value.toUpperCase().replace(/\s/g, '') })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Marca</label>
                            <input
                                required
                                type="text"
                                placeholder="Ej: Toyota"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                                value={formulario.marca}
                                onChange={(e) => asignarFormulario({ ...formulario, marca: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Modelo</label>
                            <input
                                required
                                type="text"
                                placeholder="Ej: Corolla"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                                value={formulario.modelo}
                                onChange={(e) => asignarFormulario({ ...formulario, modelo: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Color</label>
                            <input
                                required
                                type="text"
                                placeholder="Ej: Rojo"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                                value={formulario.color}
                                onChange={(e) => asignarFormulario({ ...formulario, color: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Clase de Vehículo</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                                value={formulario.clase}
                                onChange={(e) => asignarFormulario({ ...formulario, clase: e.target.value })}
                            >
                                <option value="CARRO">Carro</option>
                                <option value="MOTO">Moto</option>
                                <option value="CAMION">Camión</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID del Cliente (Propietario)</label>
                        <input
                            required
                            type="number"
                            min="1"
                            placeholder="Ej: 1"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            value={formulario.clienteId}
                            onKeyDown={(e) => { if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault(); }}
                            onChange={(e) => asignarFormulario({ ...formulario, clienteId: e.target.value === "" ? "" : parseInt(e.target.value) })}
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

export default TipoVehiculoPage;
