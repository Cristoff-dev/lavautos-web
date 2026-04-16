import { useState } from "react";
import { FacturaModal } from "./FacturaModal"; 
import { TablaGenerica } from "../../components/UI/Tabla"; 


interface Factura {
    id: string;
    tipo: string;
    comisiones: string;
    trabajador: string;
    vehiculo: string;
    insumos: string;
}

export const FacturacionPage = () => {
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [isFacturaModalOpen, setIsFacturaModalOpen] = useState(false);


    const datosFacturas: Factura[] = [
        {
            id: "1",
            tipo: "Facturacion-Entero",
            comisiones: "20% - 2$",
            trabajador: "keiber ochoa",
            vehiculo: "GTX-2026",
            insumos: "JABON-LIQUIDO / LIMPIA-Parabrisas"
        }
    ];

    // 3. Configuramos las columnas usando el componente TablaGenerica
    const columnasFacturacion = [
        { 
            llave: "tipo" as keyof Factura, 
            etiqueta: "Facturacion",
            render: (f: Factura) => (
                <span className="font-mono text-cyan-400 font-bold tracking-widest uppercase text-xs">
                    {f.tipo}
                </span>
            )
        },
        { llave: "comisiones" as keyof Factura, etiqueta: "Comisiones" },
        { 
            llave: "trabajador" as keyof Factura, 
            etiqueta: "Trabajador",
            render: (f: Factura) => (
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase">
                    {f.trabajador}
                </span>
            )
        },
        
        { 
            llave: "vehiculo" as keyof Factura, 
            etiqueta: "Vehiculo",
            render: (f: Factura) => (
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase italic">
                    {f.vehiculo}
                </span>
            )
        },
        { 
            llave: "insumos" as keyof Factura, 
            etiqueta: "Insumos",
            render: (f: Factura) => (
                <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-[10px] font-bold uppercase italic">
                    {f.insumos}
                </span>
            )
        },
        {
            llave: "acciones" as const,
            etiqueta: "Acciones",
            render: () => (
                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsFacturaModalOpen(true)}
                        className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-cyan-500 hover:text-slate-900 transition-all"
                    >
                        Crear Factura
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header igual a como lo tenías */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter">
                        Gestión de <span className="text-cyan-400">Facturación</span>
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

            {
                
            }
            <TablaGenerica 
                columnas={columnasFacturacion} 
                datos={datosFacturas} 
                mensajeVacio="No hay facturas registradas en esta vista."
            />

            <FacturaModal 
                isOpen={isFacturaModalOpen} 
                onClose={() => setIsFacturaModalOpen(false)} 
            />
        </div>
    );
}

export default FacturacionPage;