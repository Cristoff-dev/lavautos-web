import { Modal } from "../../components/UI/Modal";

interface VehiculoType {
    placa?: string;
    propietario?: string;
    servicio?: string;
    [key: string]: unknown;
}

interface VehiculoModalProps {
    isOpen: boolean;
    onClose: () => void;

    vehiculoToEdit?: VehiculoType | null;
}

export const VehiculoModal = ({ isOpen, onClose, vehiculoToEdit }: VehiculoModalProps) => {
    const isEditing = !!vehiculoToEdit;

    return (
        <Modal
            abierto={isOpen}
            alCerrar={onClose}
            titulo={isEditing ? "Editar Vehículo 🛠️" : "Nuevo Vehículo 🚘"}>
            <form className="flex flex-col gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Placa</label>
                    <input type="text" defaultValue={vehiculoToEdit?.placa || ""} className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500" placeholder="Ej. GTR-2026" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Propietario</label>
                    <input type="text" defaultValue={vehiculoToEdit?.propietario || ""} className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500" placeholder="Nombre del cliente" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Tipo de Servicio</label>
                    <select className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500">
                        <option>Lavado Sencillo</option>
                        <option>Lavado Full</option>
                    </select>
                </div>


                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors">Cancelar</button>
                    <button type="button" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors">
                        {isEditing ? "Guardar Cambios" : "Crear Vehículo"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};