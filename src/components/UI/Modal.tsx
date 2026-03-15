import type { ReactNode } from "react";

interface PropiedadesModal {
    abierto: boolean;
    alCerrar: () => void;
    titulo: string;
    children: ReactNode;
}

export const Modal = ({ abierto, alCerrar, titulo, children }: PropiedadesModal) => {
    if (!abierto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
            <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-700">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">{titulo}</h3>
                    <button
                        onClick={alCerrar}
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};