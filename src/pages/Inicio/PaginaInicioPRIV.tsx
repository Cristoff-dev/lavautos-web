import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export const PaginaInicioPRIV = () => {
  const dataInsumos = [
    { name: "Jabón", stock: 45 },
    { name: "Cloro", stock: 15 },
    { name: "Limpiaparabrisas", stock: 30 },
    { name: "Brisol", stock: 8 },
  ];

  const dataServicios = [
    { name: "Lavado Sencillo", value: 400 },
    { name: "Lavado General", value: 300 },
    { name: "Pulitura", value: 100 },
    { name: "Lavado de Motor", value: 50 },
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
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
            <p className="text-slate-400 text-xs font-bold uppercase">{stat.label}</p>
            <p className="text-white text-4xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/*  ZONA DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/*grafico 1: Stock de Insumos (Barras) */}
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-sm mb-4">Stock de Insumos</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataInsumos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
                <Bar dataKey="stock" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* grafico 2: Servicios Más Solicitados (Pastel) */}
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-2xl h-80 flex flex-col">
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-sm mb-4">Servicios Top</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataServicios}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {dataServicios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaginaInicioPRIV;