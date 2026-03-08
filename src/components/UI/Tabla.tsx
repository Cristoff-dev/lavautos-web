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
        <div className="w-full bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
                <button
                    onClick={alCrearNuevo}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                >
                    Nuevo
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            {columnas.map((columna) => (
                                <th key={String(columna.llave)} className="px-6 py-4">
                                    {columna.etiqueta}
                                </th>
                            ))}
                            {acciones && <th className="px-6 py-4">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {datos.length === 0 ? (
                            <tr>
                                <td colSpan={columnas.length + (acciones ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            datos.map((fila, indice) => (
                                <tr key={fila.id || indice} className="hover:bg-gray-50 transition-colors">
                                    {columnas.map((columna) => (
                                        <td key={String(columna.llave)} className="px-6 py-4 whitespace-nowrap">
                                            {fila[columna.llave] as ReactNode}
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
