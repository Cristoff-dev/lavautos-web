import { Link } from "react-router-dom";
import { TfiHome, TfiTruck, TfiPackage, TfiReceipt, TfiWallet, TfiMoney, TfiTag, TfiShoppingCart } from "react-icons/tfi";

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
    const menuItems = [
        { name: "Inicio", path: "/inicioprivado", icon: <TfiHome /> },
        { name: "Vehículo(s)", path: "/vehiculos", icon: <TfiTruck /> },
        { name: "Tipo Vehículo(s)", path: "/tipovehiculos", icon: <TfiTruck /> },
        { name: "Inventario", path: "/inventario", icon: <TfiPackage /> },
        { name: "Recepcion", path: "/recepcion", icon: <TfiReceipt /> },
        { name: "Servicios", path: "/servicios", icon: <TfiTag /> },
        { name: "Proveedores", path: "/proveedores", icon: <TfiShoppingCart /> },
        { name: "Facturacion", path: "/factura", icon: <TfiWallet /> },
        { name: "Contabilidad", path: "/contable", icon: <TfiMoney /> },
    ];

    return (
        <aside className={`fixed left-0 top-16 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 ${isOpen ? "w-64" : "w-20"}`}>
            <div className="flex flex-col p-4 gap-2">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-all group">
                        <span className="text-xl">{item.icon}</span>
                        {isOpen && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
                    </Link>
                ))}
            </div>
        </aside>
    );
};