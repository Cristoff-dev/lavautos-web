import { useState } from "react";
import { FacturaModal } from "./FacturaModal"; 

export const FacturacionPage = () => {
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [isFacturaModalOpen, setIsFacturaModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter">
                        Gestión de <span className="text-cyan-400">Facturacion</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Buscar trabajador o servicio..." className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" />
                    <button 
                        onClick={() => setIsFacturaModalOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 text-sm uppercase">Nuevo</button>
                </div>
            </div>


            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Facturacion</th>
                            <th className="px-6 py-4">comisiones</th>
                            <th className="px-6 py-4">trabajador</th>
                            <th className="px-6 py-4">Vehiculo</th>
                            <th className="px-6 py-4">Insumos</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-mono text-cyan-400 font-bold tracking-widest">Facturacion-Entero</td>
                            <td className="px-6 py-4 text-slate-200">20% - 2$</td>
                            <td className="px-6 py-4 text-slate-400">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold">keiber ochoa</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase italic">GTX-2026</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase italic">JABON-LIQUIDO / LIMPIA-Parabrisas</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center">
                                    <button 
                                        onClick={() => setIsFacturaModalOpen(true)}
                                        className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-cyan-500 hover:text-slate-900 transition-all"
                                    >
                                        Crear Factura
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <FacturaModal 
                isOpen={isFacturaModalOpen} 
                onClose={() => setIsFacturaModalOpen(false)} 
            />
        </div>
    );
}

export default FacturacionPage;