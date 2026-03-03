import { PublicHeader } from "../../features/auth/components/layout/HeaderPublic";
import { Button } from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";

import carlogo from '../../assets/car2.webp';
import portada from '../../assets/portadainicio.webp';
import promo1 from '../../assets/promo1.webp';
import promo2 from '../../assets/promo2.webp';
import promo3 from '../../assets/promo3.webp';
import promo4 from '../../assets/promo4.webp';
import ubicacion from '../../assets/ubicacion.webp';

export const PaginaInicioP = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            <PublicHeader />

            <main className="pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
                    EL MEJOR <span className="text-cyan-500">LAVADO</span> <br />
                    PARA TU MÁQUINA
                </h1>
                
                <p className="text-slate-400 text-lg max-w-2xl mb-6 font-medium">
                    Sistema de gestión profesional para autolavados. Controla tus ingresos, 
                    vehículos y personal con la tecnología de Acuático Soft.
                </p>

                <p className="text-cyan-500/80 text-sm max-w-2xl mb-10 italic font-semibold">
                    "Si puedes imaginarlo, puedes programarlo uwu"
                </p>

                <div className="flex gap-4">
                    <Button onClick={() => navigate('/login')}>
                        Probar Sistema Ahora
                    </Button>
                </div>
            </main>

            {/* SECCIÓN GRID: 3 Columnas */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
                
                {/* IZQUIERDA: Dueño (Ocupa 3 columnas) */}
                <section className="lg:col-span-3 space-y-6 text-center lg:text-left bg-sky-950 p-8 rounded-3xl border border-slate-800/50 h-fit hover:border-cyan-500/50 transition-all group">
                    <img 
                        src={carlogo} 
                        alt="Dueño" 
                        className="w-32 h-32 mx-auto lg:mx-0 rounded-full object-cover border-4 border-cyan-500/20 shadow-xl" 
                    />
                    <h2 className="text-2xl font-black text-cyan-500 uppercase tracking-widest">Ricardo Tapia</h2>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                        "Llevamos la limpieza automotriz a otro nivel, combinando pasión por los fierros con la mejor tecnología de gestión."
                    </p>
                </section>

                {/* CENTRO: Combos (Ocupa 6 columnas - La más abarcada) */}
                <section className="lg:col-span-6 space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <img src={portada} alt="Promo" className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/30" />
                        <h2 className="text-3xl font-black tracking-tight">NUESTROS <span className="text-cyan-500">COMBOS</span></h2>
                    </div>

                    {/* Lista de Combos uno debajo del otro */}
                    <div className="grid gap-6">
                        {[
                            { img: promo4, title: "Lavado y Aspirado", desc: "Limpieza profunda de interiores y exteriores.", price: "4500 BS", ref: "10$" },
                            { img: promo1, title: "Pulido y Encerado", desc: "Brillo espejo y protección de pintura.", price: "11025 BS", ref: "25$" },
                            { img: promo3, title: "Lavado de Vestiduras", desc: "Eliminación de manchas y olores en asientos.", price: "18000 BS", ref: "40$" },
                            { img: promo2, title: "Lavado de Motor", desc: "Limpieza técnica con productos especializados.", price: "6750 BS", ref: "15$" }
                        ].map((combo, index) => (
                            <div key={index} className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all group">
                                <img src={combo.img} alt={combo.title} className="w-24 h-24 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white uppercase">{combo.title}</h3>
                                    <p className="text-slate-500 text-sm">{combo.desc}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-cyan-500 font-black">{combo.price}</p>
                                    <p className="text-slate-600 text-xs">REF: {combo.ref}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DERECHA: Ubicación (Ocupa 3 columnas) */}
                <section className="lg:col-span-3 space-y-6 text-center lg:text-right ">
                    <div className="bg-sky-950 p-8 rounded-3xl border border-slate-800/50 space-y-4 hover:border-cyan-500/50 transition-all group">
                        <img 
                            src={ubicacion} 
                            alt="Ubicación" 
                            className="w-full h-48 rounded-2xl object-cover border border-slate-700 shadow-lg" 
                        />
                        <h2 className="text-xl font-black text-cyan-500 uppercase">Sede Principal</h2>
                        <p className="text-slate-400 text-sm">
                            Calle Principal con Carrera 15, <br />
                            Edificio Acuático Soft, Piso 1. <br />
                            <span className="text-cyan-500/50 font-bold">Barquisimeto, Lara.</span>
                        </p>
                    </div>
                </section>

            </div>

            <footer className=" py-10 border-t border-slate-900 text-center bg-slate-600 text-slate-950  text-xs uppercase tracking-widest">
                © 2026 Acuático Soft - Todos los derechos reservados uwu
            </footer>
        </div>
    );
};

export default PaginaInicioP;