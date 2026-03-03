import { useNavigate} from 'react-router-dom';
import carlogo from '../../assets/car2.webp';
import { PublicHeader } from '../../features/auth/components/layout/HeaderPublic';


function LoginPage(){

    const navigate = useNavigate();

const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ... tu lógica

        console.log("hackeando la nasa mi amor!!!!.... okey iniciado sesion xd");

        navigate('/inicioprivado');
    }

    return (
        <>
        <PublicHeader />{/*mirame mama si estoy pudiendo con react*/}


<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-20">

{/*el que me cambien el onsubmit sabe que peco*/}
        <form onSubmit={handleLogin }  className="bg-slate-900 w-full max-w-md flex flex-col p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>

    <img 
        src={carlogo} 
        alt="Logo" 
        className="w-28 h-28 mx-auto mb-6 rounded-full object-cover border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
    />
    
    <h2 className="text-cyan-400 text-2xl font-black uppercase tracking-widest text-center mb-8">
    Login <span className="text-white">Acuático</span>
    </h2>

    <div className="flex flex-col mb-5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
        Usuario
    </label>
    <input 
        className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600" 
        type="text" 
        placeholder="Ingrese su usuario"
    />
    </div>

    <div className="flex flex-col mb-8">
    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
        Password
    </label>
            <input 
        className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600" 
        type="password" 
        placeholder="••••••••"
    />
    </div>

    <button 
        type="submit" 
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 cursor-pointer uppercase tracking-wider">
    Ingresar
    </button>

    <a href="#" className="text-slate-500 text-sm text-center mt-6 hover:text-cyan-400 transition-colors">
    ¿Olvidaste tu contraseña?
    </a>
        </form>
</div>

        </>
    )
}

export default LoginPage