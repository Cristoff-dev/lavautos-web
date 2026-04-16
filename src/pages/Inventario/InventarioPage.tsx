import { useState } from "react";
import { TablaGenerica } from "../../components/UI/Tabla";

export const InventarioPage = () => {
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');

    const columnasInventario = [
    { 
        llave: "nombre" as const, 
        etiqueta: "Nombre",
        render: (v: any) => <span className="font-mono text-cyan-400 font-bold uppercase tracking-widest">{v.nombre}</span>
    },
    { 
        llave: "cantidad" as const, 
        etiqueta: "Cantidad",
        render: (v: any) => <span className="text-slate-200">{v.cantidad} {v.unidad}</span>
    },
    { 
        llave: "precioBs" as const, // Cambio de "precio" a "precioBs" (que sí existe en el objeto)
        etiqueta: "Precio",
        render: (v: any) => (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold">
                {v.precioBs} BS / {v.precioUsd}$
            </span>
        )
    },
    { 
        llave: "id" as const, // Cambio de "otros" a "id" (llave existente)
        etiqueta: "Otros",
        render: () => <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase">Otros</span>
    },
    {
        llave: "id" as const, // Cambio de "acciones" a "id" (llave existente)
        etiqueta: "Acciones",
        render: (v: any) => (
            <div className="flex justify-center gap-2">
                <button onClick={() => console.log(v)} title="Editar" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                <button title="Eliminar" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
            </div>
        )
    }
  ];

  
  const datosInventario = [
    { id: 1, nombre: "JABON LIQUIDO", cantidad: 60, unidad: "LITROS", precioBs: 500, precioUsd: 1 }
  ];

    return (
        <div className="animate-fadeIn">

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter">
                        Gestión de <span className="text-cyan-400">Inventario</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Buscar nombre o id..." className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64" />
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 text-sm uppercase">Nuevo</button>
                </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <TablaGenerica 
                    columnas={columnasInventario} 
                    datos={datosInventario} 
                    mensajeVacio="No hay facturas registradas en esta vista."
                />
            </div>
        </div>
    );
}

export default InventarioPage;