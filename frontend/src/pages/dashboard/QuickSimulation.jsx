import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';

export default function QuickSimulation() {
  const [markup, setMarkup] = useState(1.15);
  const [quality, setQuality] = useState(1.0);

  const baseCost = 3000000;
  const simulatedCost = baseCost * markup * quality;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-gray-900 font-black flex items-center gap-2">
          <Sliders className="w-5 h-5 text-orange-500" />
          Live Simulator
        </h3>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Simulated Cost</p>
          <motion.p 
            key={simulatedCost}
            initial={{ scale: 1.1, color: '#f97316' }}
            animate={{ scale: 1, color: '#0f172a' }}
            className="text-xl font-black tabular-nums transition-colors"
          >
            ₹{simulatedCost.toLocaleString('en-IN')}
          </motion.p>
        </div>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {/* Slider 1 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-600">Material Inflation</label>
            <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md">
              {(markup - 1) > 0 ? '+' : ''}{((markup - 1) * 100).toFixed(0)}%
            </span>
          </div>
          <input 
            type="range" min="0.8" max="1.5" step="0.05" 
            value={markup} onChange={e => setMarkup(Number(e.target.value))}
            className="w-full accent-orange-500 bg-gray-100 rounded-lg h-1.5 appearance-none cursor-pointer"
          />
        </div>

        {/* Slider 2 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-600">Finishing Grade</label>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
              {quality === 0.8 ? 'Basic' : quality === 1.0 ? 'Premium' : 'Ultra'}
            </span>
          </div>
          <input 
            type="range" min="0.8" max="1.2" step="0.2" 
            value={quality} onChange={e => setQuality(Number(e.target.value))}
            className="w-full accent-blue-500 bg-gray-100 rounded-lg h-1.5 appearance-none cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
}
