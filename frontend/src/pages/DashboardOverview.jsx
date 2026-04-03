import { motion } from 'framer-motion';
import { TrendingUp, Users, HardHat, DollarSign, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', cost: 4000 },
  { name: 'Feb', cost: 3000 },
  { name: 'Mar', cost: 2000 },
  { name: 'Apr', cost: 2780 },
  { name: 'May', cost: 1890 },
  { name: 'Jun', cost: 2390 },
  { name: 'Jul', cost: 3490 },
];

export default function DashboardOverview() {
  const stats = [
    { label: 'Total Budget', value: '$2.4M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Projects', value: '12', icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Labor Force', value: '145', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Risk Alerts', value: '2', icon: CloudRain, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
          >
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
               <stat.icon className={`w-7 h-7 ${stat.color}`} />
             </div>
             <div>
               <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
               <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Chart & Weather Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Cost Analysis</h3>
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
              <TrendingUp className="w-4 h-4" /> -12% this month
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dx={-10} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weather Widget */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-3xl shadow-lg shadow-blue-500/30 text-white flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div>
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-xl font-bold mb-1">Site Weather</h3>
                 <p className="text-blue-100">Downtown Project</p>
               </div>
               <CloudRain className="w-10 h-10 text-white" />
            </div>
            
            <div className="mt-8">
              <span className="text-6xl font-light">24°</span>
              <p className="text-lg font-medium mt-2">Light Rain</p>
            </div>
          </div>

          <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-400 blink"></div>
               <p className="text-sm font-medium">Delay Warning: Concrete pouring might be affected today.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
