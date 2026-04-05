import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carlogo from '../../assets/car2.webp';
import { PublicHeader } from '../../features/auth/components/layout/HeaderPublic';
import { login } from '../../api/apiAuth';

function LoginPage() {
    const navigate = useNavigate();
    const [email, asignarEmail] = useState('');
    const [password, asignarPassword] = useState('');
    const [errorMsg, asignarError] = useState('');
    const [cargando, asignarCargando] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        asignarError('');
        asignarCargando(true);
        try {
            const resultado = await login(email, password);
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('usuario', JSON.stringify(resultado.user));
            navigate('/inicioprivado');
        } catch (err: unknown) {
            const mensaje = err instanceof Error ? err.message : 'Error desconocido';
            asignarError(mensaje);
        } finally {
            asignarCargando(false);
        }
    };

    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-20">
                <form onSubmit={handleLogin} className="bg-slate-900 w-full max-w-md flex flex-col p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>

                    <img src={carlogo} alt="Logo" className="w-28 h-28 mx-auto mb-6 rounded-full object-cover border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" />

                    <h2 className="text-cyan-400 text-2xl font-black uppercase tracking-widest text-center mb-8">
                        Login <span className="text-white">Acuático</span>
                    </h2>

                    {errorMsg && (
                        <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="flex flex-col mb-5">
                        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                            Email
                        </label>
                        <input
                            className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            type="text"
                            required
                            placeholder="Ej: admin"
                            value={email}
                            onChange={(e) => asignarEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col mb-8">
                        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                            Contraseña
                        </label>
                        <input
                            className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => asignarPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                        {cargando ? 'Verificando...' : 'Ingresar'}
                    </button>

                    <a href="#" className="text-slate-500 text-sm text-center mt-6 hover:text-cyan-400 transition-colors">
                        ¿Olvidaste tu contraseña?
                    </a>
                </form>
            </div>
        </>
    );
}

export default LoginPage;