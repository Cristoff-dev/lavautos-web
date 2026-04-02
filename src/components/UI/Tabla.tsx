import React from "react";


interface Columna<T> {
  llave: keyof T | "acciones"; 
  etiqueta: string;
 
  render?: (dato: T) => React.ReactNode;
}

interface TablaProps<T> {
  columnas: Columna<T>[];
  datos: T[];
  mensajeVacio?: string;
  enFilaClick?: (dato: T) => void;
}


export const TablaGenerica = <T extends { id: string | number }>({
  columnas,
  datos,
  mensajeVacio = "No se encontraron registros",
  enFilaClick,
}: TablaProps<T>) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* ENCABEZADO */}
          <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              {columnas.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-4 ${col.llave === "acciones" ? "text-center" : ""}`}
                >
                  {col.etiqueta}
                </th>
              ))}
            </tr>
          </thead>

          {/* CUERPO */}
          <tbody className="divide-y divide-slate-800">
            {datos.length === 0 ? (
              <tr>
                <td
                  colSpan={columnas.length}
                  className="px-6 py-12 text-center text-slate-500 italic"
                >
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              datos.map((fila) => (
                <tr
                  key={fila.id}
                  onClick={() => enFilaClick?.(fila)}
                  className={`hover:bg-slate-800/30 transition-colors group ${
                    enFilaClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columnas.map((col, index) => (
                    <td 
                      key={index} 
                      className="px-6 py-4 text-sm"
                    >
                      {

                      }
                      {col.render ? (
                        col.render(fila)
                      ) : (
                        <span className="text-slate-200">
                          {String(fila[col.llave as keyof T] ?? "")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};