import { motion } from 'framer-motion';
import { Sliders, Percent, HardHat } from 'lucide-react';

export default function SimulationPanel({ multipliers, setMultipliers }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg mt-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Sliders className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide">What-If Simulation Engine</h3>
          <p className="text-xs text-gray-400">Drag sliders to simulate market fluctuations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Material Cost Index */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
              <Percent className="w-4 h-4 text-orange-400" />
              Material Cost Index
            </label>
            <span className="text-sm font-bold bg-white/10 px-2 py-1 rounded-md text-orange-300">
              {multipliers.material.toFixed(2)}x
            </span>
          </div>
          <input 
            type="range" 
            min="0.5" max="2.0" step="0.05" 
            value={multipliers.material} 
            onChange={(e) => setMultipliers(p => ({ ...p, material: Number(e.target.value) }))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none" 
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>-50% Cost</span>
            <span>Base (1.0x)</span>
            <span>+100% Cost</span>
          </div>
        </div>

        {/* Labor Wage Index */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-green-400" />
              Labor Wage Index
            </label>
            <span className="text-sm font-bold bg-white/10 px-2 py-1 rounded-md text-green-300">
              {multipliers.labor.toFixed(2)}x
            </span>
          </div>
          <input 
            type="range" 
            min="0.5" max="2.0" step="0.05" 
            value={multipliers.labor} 
            onChange={(e) => setMultipliers(p => ({ ...p, labor: Number(e.target.value) }))}
            className="w-full accent-green-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none" 
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-medium">
            <span>Cheap Labor</span>
            <span>Standard Market</span>
            <span>Expensive Labor</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
