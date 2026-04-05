import { useState } from "react";
import { VehiculoModal } from './VehiculoModal';
import { TablaGenerica } from "../../components/UI/Tabla";

export const VehiculoPage = () => {
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehiculo, setSelectedVehiculo] = useState<Record<string, unknown> | null>(null);

    const handleOpenCreate = () => {
        setSelectedVehiculo(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (vehiculo: Record<string, unknown>) => {
        setSelectedVehiculo(vehiculo);
        setIsModalOpen(true);
    };
    const columnasVehiculos = [
    { 
        llave: "placa" as const, 
        etiqueta: "Placa",
        render: (v: any) => <span className="font-mono text-cyan-400 font-bold uppercase">{v.placa}</span>
    },
    { llave: "propietario" as const, etiqueta: "Propietario" },
    { 
        llave: "servicio" as const, 
        etiqueta: "Tipo Servicio",
        render: (v: any) => <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase">{v.servicio}</span>
    },
    { 
        llave: "estadoPago" as const, 
        etiqueta: "Estado Pago",
        render: (v: any) => (
            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase italic">Pagado</span>
        )
    },
    {
        llave: "acciones" as const,
        etiqueta: "Acciones",
        render: (v: any) => (
            <div className="flex justify-center gap-2">
                <button onClick={() => handleOpenEdit(v)} className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                <button className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
            </div>
        )
    }
];

// Datos de prueba (mientras conectas la DB)
const datosVehiculos = [
    { id: 1, placa: 'GTR-2026', propietario: 'Michael Buble', servicio: 'LAVADO FULL', estadoPago: 'Pagado' }
];
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
           
                <VehiculoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    vehiculoToEdit={selectedVehiculo} />
            </div>
            <TablaGenerica 
    columnas={columnasVehiculos} 
    datos={datosVehiculos} 
    mensajeVacio="No hay vehículos registrados"
/>
        </div>
    );
}

export default VehiculoPage;