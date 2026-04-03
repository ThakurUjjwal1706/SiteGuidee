import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#f97316', '#10b981'];

export default function CostEstimator() {
  const [area, setArea] = useState(1500);
  const [buildingType, setBuildingType] = useState('Residential');
  const [materialFactor, setMaterialFactor] = useState(1);

  const baseRate = buildingType === 'Residential' ? 120 : (buildingType === 'Commercial' ? 180 : 150);
  
  const materialsCost = area * baseRate * 0.6 * materialFactor;
  const laborCost = area * baseRate * 0.4;
  const totalCost = materialsCost + laborCost;

  const pieData = [
    { name: 'Materials', value: materialsCost },
    { name: 'Labor', value: laborCost },
  ];

  const barData = [
    { name: 'Concrete', cost: materialsCost * 0.4 },
    { name: 'Steel', cost: materialsCost * 0.3 },
    { name: 'Wood', cost: materialsCost * 0.15 },
    { name: 'Other', cost: materialsCost * 0.15 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cost Estimator Engine</h1>
        <p className="text-gray-500">Calculate and simulate project costs instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3 mb-4 text-blue-600 font-semibold border-b border-gray-100 pb-4">
             <Calculator className="w-5 h-5" /> Calculation Params
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft): {area}</label>
             <input type="range" min="500" max="10000" step="100" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full accent-blue-600" />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
             <select value={buildingType} onChange={e => setBuildingType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none">
               <option>Residential</option>
               <option>Commercial</option>
               <option>Industrial</option>
             </select>
           </div>

           <div className="pt-4 border-t border-gray-100">
             <label className="block text-sm font-medium text-gray-700 mb-2">Market Material Cost Factor: {materialFactor}x</label>
             <input type="range" min="0.8" max="1.5" step="0.1" value={materialFactor} onChange={e => setMaterialFactor(Number(e.target.value))} className="w-full accent-orange-500" />
             <p className="text-xs text-gray-400 mt-2">Adjust based on current market inflation for materials.</p>
           </div>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           {/* Total Output */}
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-tr from-gray-900 to-gray-800 p-8 rounded-3xl text-white flex justify-between items-center shadow-xl">
              <div>
                <p className="text-gray-400 font-medium mb-1">Total Estimated Cost</p>
                <h2 className="text-5xl font-bold tracking-tight">${totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
              </div>
              <div className="text-right space-y-2">
                 <p className="text-gray-300">Materials: <span className="text-white font-bold">${materialsCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></p>
                 <p className="text-gray-300">Labor: <span className="text-white font-bold">${laborCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></p>
              </div>
           </motion.div>

           {/* Charts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                 <h3 className="text-lg font-bold w-full text-left mb-4 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-gray-400" /> Cost Distribution</h3>
                 <div className="h-[200px] w-full">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex gap-4 text-sm font-medium mt-4">
                   <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Materials</span>
                   <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Labor</span>
                 </div>
             </motion.div>
             
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-gray-400" /> Material Breakdown</h3>
                 <div className="h-[220px] w-full">
                    <ResponsiveContainer>
                      <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={70} tick={{ fontSize: 13, fill: '#64748b' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="cost" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
             </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}
