import type { ReactNode } from "react";

interface Columna<T> {
    llave: keyof T;
    etiqueta: string;
}

interface PropiedadesTabla<T> {
    titulo: string;
    columnas: Columna<T>[];
    datos: T[];
    alCrearNuevo: () => void;
    acciones?: (fila: T) => ReactNode;
}

export const Tabla = <T extends { id?: string | number }>({ titulo, columnas, datos, alCrearNuevo, acciones }: PropiedadesTabla<T>) => {
    return (
        <div className="w-full bg-slate-800 shadow-sm rounded-lg border border-slate-700 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">{titulo}</h2>
                <button
                    onClick={alCrearNuevo}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                >
                    Nuevo
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-700 text-slate-200 font-medium border-b border-slate-600">
                        <tr>
                            {columnas.map((columna) => (
                                <th key={String(columna.llave)} className="px-6 py-4">
                                    {columna.etiqueta}
                                </th>
                            ))}
                            {acciones && <th className="px-6 py-4">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {datos.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + (acciones ? 1 : 0)} className="px-6 py-8 text-center text-slate-500">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            datos.map((fila, indice) => (
                                <tr key={fila.id || indice} className="hover:bg-slate-700 transition-colors">
                                    {columnas.map((columna) => (
                                        <td key={String(columna.llave)} className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const valor = fila[columna.llave];
                                                if (typeof valor === 'boolean') {
                                                    return (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${valor
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {valor ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    );
                                                } else if (typeof valor === 'string' && (valor === 'Activo' || valor === 'Inactivo')) {
                                                    return (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${valor === 'Activo'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {valor}
                                                        </span>
                                                    );
                                                } else {
                                                    return valor as ReactNode;
                                                }
                                            })()}
                                        </td>
                                    ))}
                                    {acciones && <td className="px-6 py-4 whitespace-nowrap">{acciones(fila)}</td>}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
