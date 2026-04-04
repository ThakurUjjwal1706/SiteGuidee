import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS  = ['#3B82F6', '#7C3AED', '#EA580C', '#059669', '#D97706'];
const LABELS  = ['Cement', 'Steel', 'Bricks', 'Finishing', 'Labor'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 backdrop-blur shadow-xl rounded-xl px-4 py-2.5 border border-gray-100 text-sm">
        <p className="font-bold text-gray-700">{payload[0].name}</p>
        <p className="font-black mt-0.5" style={{ color: payload[0].fill || COLORS[0] }}>
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if(percent < 0.05) return null; // Don't show labels for tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ChartComponent({ totalCost, updatedCosts }) {
  // Use passed specific costs
  const dataMap = [
    { name: LABELS[0], value: updatedCosts?.cement || 0 },
    { name: LABELS[1], value: updatedCosts?.steel || 0 },
    { name: LABELS[2], value: updatedCosts?.bricks || 0 },
    { name: LABELS[3], value: updatedCosts?.finishing || 0 },
    { name: LABELS[4], value: updatedCosts?.labor || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ── Donut Pie ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Cost Distribution</p>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataMap}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                labelLine={false}
                label={CustomLabel}
              >
                {dataMap.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
          {LABELS.map((l, i) => (
            <span key={l} className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
              <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
              {l}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Bar Chart ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col"
      >
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category Comparison</p>
        <div className="flex-1" style={{ minHeight: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataMap} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
                barSize={40}
              >
                {dataMap.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
