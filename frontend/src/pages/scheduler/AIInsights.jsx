import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AIInsights({ phases }) {
  const isDelayed = phases.some(p => p.status === 'delayed');

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg tracking-tight">
        <ShieldAlert className="w-5 h-5 text-indigo-500" />
        AI Engine
      </h3>
      
      <div className="flex-1 space-y-3">
        {isDelayed ? (
           <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-2xl border border-red-200 bg-red-50 flex gap-3"
            >
              <div className="p-2 rounded-xl h-fit bg-red-100 text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Structure Phase Delayed</h4>
                <p className="text-[10px] mt-0.5 leading-relaxed font-semibold opacity-80 text-red-700">
                  Delay triggered. Recommend shifting 15 workers from Finishing to structural support.
                </p>
              </div>
            </motion.div>
        ) : (
           <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50 flex gap-3"
            >
              <div className="p-2 rounded-xl h-fit bg-emerald-100 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Path Optimal</h4>
                <p className="text-[10px] mt-0.5 leading-relaxed font-semibold opacity-80 text-emerald-700">
                  Schedule alignment is 98% efficient. No bottlenecks detected.
                </p>
              </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}
