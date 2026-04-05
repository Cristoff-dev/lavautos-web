import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { TablaGenerica } from "../../components/UI/Tabla";

export const PaginaInicioPRIV = () => {

  // Nueva data: Ingreso de vehículos por mes
  const dataVehiculosMensual = [
    { mes: "Ene", cantidad: 110 },
    { mes: "Feb", cantidad: 145 },
    { mes: "Mar", cantidad: 132 },
    { mes: "Abr", cantidad: 160 },
    { mes: "May", cantidad: 185 },
    { mes: "Jun", cantidad: 210 },
    { mes: "Jul", cantidad: 240 },
    { mes: "Ago", cantidad: 220 },
    { mes: "Sep", cantidad: 195 },
    { mes: "Oct", cantidad: 205 },
    { mes: "Nov", cantidad: 230 },
    { mes: "Dic", cantidad: 280 },
  ];

  const dataInsumos = [
    { name: "Jabón", stock: 45, min: 10 },
    { name: "Cloro", stock: 15, min: 20 },
    { name: "Limpia", stock: 30, min: 15 },
    { name: "Brisol", stock: 8, min: 12 },
  ];

  const dataServicios = [
    { name: "Lavado Sencillo", value: 400 },
    { name: "Lavado General", value: 300 },
    { name: "Pulitura", value: 150 },
    { name: "Lavado de Motor", value: 80 },
  ];

  const dataFinanzas = [
    { dia: "Lun", ingresos: 800, gastos: 400 },
    { dia: "Mar", ingresos: 1200, gastos: 600 },
    { dia: "Mie", ingresos: 900, gastos: 500 },
    { dia: "Jue", ingresos: 1500, gastos: 700 },
    { dia: "Vie", ingresos: 2100, gastos: 900 },
    { dia: "Sab", ingresos: 2800, gastos: 1200 },
    { dia: "Dom", ingresos: 2400, gastos: 1100 },
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  const vehiculosRecientes = [
    { id: 1, placa: "AA123BB", cliente: "Juan Pérez", hora: "08:30 AM", estado: "Listo" },
    { id: 2, placa: "CC456DD", cliente: "Ana García", hora: "09:15 AM", estado: "Lavando" },
  ];

  const columnasHome = [
    { 
      llave: "placa" as const, 
      etiqueta: "Placa",
      render: (v: any) => <span className="font-mono text-cyan-400 font-bold uppercase">{v.placa}</span>
    },
    { llave: "cliente" as const, etiqueta: "Cliente" },
    { llave: "hora" as const, etiqueta: "Entrada" },
    { 
      llave: "estado" as const, 
      etiqueta: "Estado",
      render: (v: any) => (
        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
          v.estado === 'Listo' ? 'bg-green-500/10 text-green-400' : 'bg-cyan-500/10 text-cyan-400'
        }`}>{v.estado}</span>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn p-2 bg-slate-950 min-h-screen">
      <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
        Panel de <span className="text-cyan-400">Control</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Vehículos Hoy", value: "45", color: "from-cyan-500/20" },
          { label: "Ingresos", value: "$1,200", color: "from-blue-500/20" },
          { label: "Pendientes", value: "12", color: "from-purple-500/20" },
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-900 p-6 rounded-2xl border border-slate-800 bg-gradient-to-br ${stat.color} to-transparent shadow-xl`}>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <p className="text-white text-4xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICA CAMBIADA: INGRESOS POR MES */}
        <div className="lg:col-span-2 bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-4">Ingreso Anual de Vehículos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataVehiculosMensual}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="mes" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px' }} 
              />
              <Bar 
                dataKey="cantidad" 
                fill="url(#colorBar)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-4">Servicios Top</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataServicios} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {dataServicios.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-4">Balance Financiero Semanal</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataFinanzas}>
              <defs>
                <linearGradient id="colorIng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="ingresos" stroke="#06b6d4" fill="url(#colorIng)" />
              <Area type="monotone" dataKey="gastos" stroke="#f43f5e" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-4">Stock de Insumos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataInsumos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                {dataInsumos.map((entry, index) => (
                  <Cell key={index} fill={entry.stock < entry.min ? '#ef4444' : '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-slate-300 font-bold uppercase tracking-widest text-xs">Monitoreo de Actividad</h3>
        <TablaGenerica columnas={columnasHome} datos={vehiculosRecientes} mensajeVacio="Sin actividad reciente" />
      </div>
    </div>
  );
};

export default PaginaInicioPRIV;