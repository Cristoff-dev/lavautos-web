import { useState } from "react";
import { VehiculoModal } from './VehiculoModal';

export const VehiculoPage = () => {
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehiculo, setSelectedVehiculo] = useState<any | null>(null);

    const handleOpenCreate = () => {
    setSelectedVehiculo(null);
    setIsModalOpen(true);
};

    const handleOpenEdit = (vehiculo: any) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
};

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter">
                        Gestión de <span className="text-cyan-400">Vehículos</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Buscar placa o cliente..." className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" />
                    <button 
                    onClick={handleOpenCreate}
                    className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-all">NUEVO</button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Placa</th>
                            <th className="px-6 py-4">Propietario</th>
                            <th className="px-6 py-4">Tipo Servicio</th>
                            <th className="px-6 py-4">Estado Pago</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-mono text-cyan-400 font-bold tracking-widest">GTR-2026</td>
                            <td className="px-6 py-4 text-slate-200">Michael Buble</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold">LAVADO FULL</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase italic">Pagado</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button 
                                    onClick={() => handleOpenEdit({ 
                                    placa: 'GTR-2026', 
                                    propietario: 'Michael Buble', 
                                    servicio: 'LAVADO FULL' 
                                                                })}
                                    title="Editar" 
                                    className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                                    <button title="Eliminar" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <VehiculoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehiculoToEdit={selectedVehiculo}/>
            </div>
        </div>
    );
}

export default VehiculoPage;