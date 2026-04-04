import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind } from 'lucide-react';

export default function WeatherPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 text-gray-900 shadow-sm border border-gray-100 overflow-hidden relative group h-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sun className="w-24 h-24 text-amber-500" />
      </div>

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className="font-extrabold flex items-center gap-2 text-lg tracking-tight">
            <Sun className="w-5 h-5 text-amber-500" />
            Live Environment
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">BOM Const. Area</p>
        </div>
        <span className="text-3xl font-black tracking-tighter text-blue-600">24°</span>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 flex items-center gap-3">
           <CloudRain className="w-5 h-5 text-blue-500" />
           <div>
             <p className="text-[9px] text-blue-500/80 uppercase tracking-widest font-bold">Rain</p>
             <p className="font-bold text-xs text-blue-900">Low Risk</p>
           </div>
        </div>
        <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-2.5 flex items-center gap-3">
           <Wind className="w-5 h-5 text-cyan-500" />
           <div>
             <p className="text-[9px] text-cyan-500/80 uppercase tracking-widest font-bold">Wind</p>
             <p className="font-bold text-xs text-cyan-900">8 km/h</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
