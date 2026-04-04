import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, FileText } from 'lucide-react';

const TREND_DATA = [
  { month: 'Jul', actual: 12000, estimated: 12000 },
  { month: 'Aug', actual: 35000, estimated: 30000 },
  { month: 'Sep', actual: 61000, estimated: 55000 },
  { month: 'Oct', actual: 95000, estimated: 80000 },
  { month: 'Nov', actual: 124000, estimated: 115000 },
  { month: 'Dec', actual: 140000, estimated: 145000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/90 backdrop-blur border border-white/10 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-bold text-white mb-2">{label} Spending</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between gap-4 mb-1">
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="font-bold text-white" style={{ color: entry.color }}>
              ₹{(entry.value / 100).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-blue-600" />
             Cumulative Expenditure Trend
          </h3>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Actual vs Estimated costs over the project timeline.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <FileText className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div style={{ height: 300, width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEst" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `₹${val/1000}k`}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="estimated" 
              stroke="#94A3B8" 
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorEst)" 
              name="Estimated"
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorActual)" 
              name="Actual"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
