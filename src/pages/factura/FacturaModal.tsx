import { Modal } from "../../components/UI/Modal";

interface FacturaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FacturaModal = ({ isOpen, onClose }: FacturaModalProps) => {
return (
    <Modal abierto={isOpen} alCerrar={onClose} titulo="Generar Factura 💰">
        <div className="text-center space-y-4">
        <p className="text-slate-300">Aquí irá el detalle de los servicios, insumos usados y el total a pagar.</p>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Servicio:</span> <span className="text-white">Lavado Full</span></div>
            <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Insumos:</span> <span className="text-white">Jabón, Cera</span></div>
            <hr className="border-slate-700 my-3" />
            <div className="flex justify-between font-bold text-lg"><span className="text-cyan-400">TOTAL:</span> <span className="text-white">$15.00</span></div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors">Cancelar</button>
        <button className="px-5 py-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-xl transition-colors">Emitir Factura</button>
        </div>
    </div>
    </Modal>
);
};