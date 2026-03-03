import { useNavigate } from "react-router-dom";
import cochellave from '../../../../assets/coche-clave.webp';
import { Button } from "../../../../components/UI/Button";

export const PublicHeader = () => {

const navigate = useNavigate(); 
    return (
    <header className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        

        <div className="text-cyan-500 font-black text-xl tracking-tighter flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/paginainicio")}>
        <img 
        src={cochellave} 
        alt="Logo-del-coche-con-llave" 
        className="w-10 h-10   rounded-full object-cover border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
        />

            ACUÁTICO <span className="text-white">SOFT</span>
        </div>

      <nav className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/paginainicio")}
            className="text-slate-400 hover:text-white font-medium transition-colors"
          >
            Sitio Web
          </button>
          
          <Button onClick={() => navigate("/login")}>
            Entrar al Sistema
          </Button>
        </nav>
      </div>
    </header>
);
};