import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

interface ToolbarProps {
    onMenuClick: () => void;
}

export const Toolbar = ({ onMenuClick }: ToolbarProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-2xl sticky top-0 z-50 h-16">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick} 
                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-all active:scale-90">
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24">

                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                <h1 className="text-cyan-400 font-black text-xl tracking-widest uppercase italic ml-2">
                    Acuático <span className="text-white">App</span>
                </h1>
            </div>

            <Button 
                onClick={handleLogout}
                className="bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-xs"
            >
                Cerrar Sesión
            </Button>
        </nav>
    );
};