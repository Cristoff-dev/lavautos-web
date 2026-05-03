import { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { useModuloContable } from "../../hooks/useModuloContable";
import type { TransaccionContable, TransaccionDTO } from "../../models/modulocontable";

const CATEGORIAS_INGRESO = ['INGRESO_LAVADO', 'OTRO_INGRESO'];

export default function ModuloContable() {
    const { listar, obtenerResumen, registrar, actualizar, eliminar, loading, error } = useModuloContable();

    const [transacciones, setTransacciones] = useState<TransaccionContable[]>([]);
    const [resumen, setResumen] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0 });
    const [modalAbierto, setModalAbierto] = useState(false);
    const [transaccionEditando, setTransaccionEditando] = useState<TransaccionContable | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

    const [formulario, setFormulario] = useState<TransaccionDTO>({
        categoria: "OTRO_INGRESO",
        monto: 0,
        descripcion: "",
        vehiculoId: null
    });

    const cargarDatos = async () => {
        try {
            const [transData, resData] = await Promise.all([
                listar(),
                obtenerResumen()
            ]);
            setTransacciones(transData);
            setResumen(resData);
        } catch (err) {
            console.error("Error cargando datos del módulo contable", err);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorFormulario(null);

        if (!formulario.monto || isNaN(formulario.monto) || formulario.monto <= 0) {
            setErrorFormulario("El monto debe ser un número válido mayor a 0.");
            return;
        }
        if (!formulario.descripcion.trim()) {
            setErrorFormulario("La descripción es obligatoria.");
            return;
        }

        try {
            if (transaccionEditando) {
                await actualizar(transaccionEditando.id, formulario);
            } else {
                await registrar(formulario);
            }
            setModalAbierto(false);
            await cargarDatos();
        } catch (err: any) {
            setErrorFormulario(err.message || "Error al guardar el asiento contable.");
        }
    };

    const abrirModalCrear = () => {
        setErrorFormulario(null);
        setTransaccionEditando(null);
        setFormulario({ categoria: "OTRO_INGRESO", monto: 0, descripcion: "", vehiculoId: null });
        setModalAbierto(true);
    };

    const abrirModalEditar = (t: TransaccionContable) => {
        setErrorFormulario(null);
        setTransaccionEditando(t);
        setFormulario({
            categoria: t.categoria,
            monto: t.monto,
            descripcion: t.descripcion,
            vehiculoId: t.vehiculoId || null
        });
        setModalAbierto(true);
    };

    const manejarEliminar = async (id: number) => {
        if (!window.confirm("¿Seguro que desea anular este asiento contable? Esta acción es irreversible.")) return;
        try {
            await eliminar(id);
            await cargarDatos();
        } catch (err: any) {
            alert("Error al anular la transacción.");
        }
    };

    const transaccionesFiltradas = transacciones.filter(t => {
        if (busqueda.trim() === "") return true;
        const searchLow = busqueda.toLowerCase();
        return (
            (t.descripcion?.toLowerCase() || "").includes(searchLow) ||
            (t.categoria?.toLowerCase() || "").includes(searchLow) ||
            t.id.toString().includes(searchLow)
        );
    });

    const esIngreso = (categoria: string) => CATEGORIAS_INGRESO.includes(categoria);

    const formatearMoneda = (monto: number) => {
        return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(monto);
    };

    if (loading && transacciones.length === 0) return <div className="p-8 text-center text-slate-400">Cargando libro mayor...</div>;
    if (error && transacciones.length === 0) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Libro Mayor <span className="text-cyan-400">Contable</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Registro de Asientos (Ingresos y Egresos)</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar concepto o ID..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64 shadow-inner"
                    />
                    <button
                        onClick={abrirModalCrear}
                        className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap"
                    >
                        NUEVO ASIENTO
                    </button>
                </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
                    <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Total Ingresos (Debe)</h3>
                    <p className="text-3xl font-black text-green-400">{formatearMoneda(resumen.totalIngresos)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-red-500/20"></div>
                    <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Total Egresos (Haber)</h3>
                    <p className="text-3xl font-black text-red-400">{formatearMoneda(resumen.totalEgresos)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/20"></div>
                    <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Balance Neto</h3>
                    <p className={`text-3xl font-black ${resumen.balance >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                        {formatearMoneda(resumen.balance)}
                    </p>
                </div>
            </div>

            {/* Tabla Libro Mayor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Código</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Centro / Categoría</th>
                            <th className="px-6 py-4">Descripción / Concepto</th>
                            <th className="px-6 py-4 text-right">Debe (Ingreso)</th>
                            <th className="px-6 py-4 text-right">Haber (Egreso)</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {transaccionesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                                    No hay asientos contables registrados.
                                </td>
                            </tr>
                        ) : (
                            transaccionesFiltradas.map((t) => {
                                const ingreso = esIngreso(t.categoria);
                                return (
                                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-cyan-500/70 text-xs">#{t.id.toString().padStart(6, '0')}</td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">{new Date(t.fecha).toLocaleDateString('es-VE')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${ingreso ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {t.categoria.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-200 text-sm max-w-xs truncate" title={t.descripcion}>
                                            {t.descripcion}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-green-400 font-medium">
                                            {ingreso ? formatearMoneda(t.monto) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-red-400 font-medium">
                                            {!ingreso ? formatearMoneda(t.monto) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => abrirModalEditar(t)} title="Editar Minuta" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all">📝</button>
                                                <button onClick={() => manejarEliminar(t.id)} title="Anular Asiento" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all">❌</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Asiento Contable */}
            <Modal
                abierto={modalAbierto}
                alCerrar={() => setModalAbierto(false)}
                titulo={transaccionEditando ? "Editar Asiento Contable" : "Nuevo Asiento Contable"}
            >
                {errorFormulario && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                        {errorFormulario}
                    </div>
                )}
                <form onSubmit={manejarEnvio} className="flex flex-col gap-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Centro / Categoría</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner"
                                value={formulario.categoria}
                                onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                            >
                                <optgroup label="Ingresos (Debe)">
                                    <option value="INGRESO_LAVADO">Ingreso por Lavado</option>
                                    <option value="OTRO_INGRESO">Otro Ingreso</option>
                                </optgroup>
                                <optgroup label="Egresos (Haber)">
                                    <option value="GASTO_OPERATIVO">Gasto Operativo</option>
                                    <option value="PAGO_COMISION">Pago de Comisión</option>
                                    <option value="COMPRA_INSUMO">Compra de Insumo</option>
                                    <option value="OTRO_EGRESO">Otro Egreso</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Importe (Monto)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">Bs</span>
                                <input
                                    required
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all font-mono shadow-inner"
                                    value={formulario.monto || ""}
                                    onChange={(e) => setFormulario({ ...formulario, monto: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Concepto / Descripción</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Pago de factura #123, Venta de servicios..."
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner"
                            value={formulario.descripcion}
                            onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">ID Vehículo Relacionado (Opcional)</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Dejar en blanco si no aplica"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner"
                            value={formulario.vehiculoId || ""}
                            onChange={(e) => setFormulario({ ...formulario, vehiculoId: e.target.value ? parseInt(e.target.value) : null })}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setModalAbierto(false)}
                            className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 font-bold transition-colors text-sm"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] text-sm"
                        >
                            GUARDAR ASIENTO
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}