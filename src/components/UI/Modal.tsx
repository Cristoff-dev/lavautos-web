import { ReactNode } from "react";
import { TfiClose } from "react-icons/tfi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">
            {title}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-cyan-400 transition-colors">
            <TfiClose size={20} />
        </button>
        </div>


        <div className="p-6">
        {children}
        </div>
        
    </div>
    </div>
);
};