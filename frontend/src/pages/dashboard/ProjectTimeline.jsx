import { motion } from 'framer-motion';
import { Layers, Zap } from 'lucide-react';

export default function ProjectTimeline() {
  const phases = [
    { name: 'Foundation', status: 'completed', value: 100 },
    { name: 'Structural', status: 'ongoing', value: 65 },
    { name: 'Plumbing', status: 'pending', value: 0 },
    { name: 'Finishing', status: 'pending', value: 0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 h-full"
    >
      <h3 className="text-gray-900 font-black flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-indigo-500" />
        Phase Timeline
      </h3>

      <div className="relative">
        {/* Background track line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full" />
        
        <div className="relative flex justify-between items-center w-full">
          {phases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isOngoing = phase.status === 'ongoing';
            return (
              <div key={phase.name} className="flex flex-col items-center w-24 relative z-10 group cursor-default">
                {/* Node */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3 transition-transform group-hover:scale-125
                  ${isCompleted ? 'bg-emerald-500' : isOngoing ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}
                `}>
                  {isCompleted && <Zap className="w-2.5 h-2.5 text-white" />}
                </div>

                <span className={`text-[11px] font-bold uppercase tracking-wider mb-0.5
                  ${isCompleted ? 'text-emerald-700' : isOngoing ? 'text-blue-700' : 'text-gray-400'}
                `}>
                  {phase.name}
                </span>

                <span className={`text-[10px] font-medium
                  ${isCompleted ? 'text-emerald-500/80' : isOngoing ? 'text-blue-500/80' : 'text-gray-300'}
                `}>
                  {phase.value}%
                </span>
                
                {/* Connector active line for ongoing */}
                {isOngoing && (
                  <div className="absolute top-3 left-[-50%] w-[100%] h-1.5 bg-blue-500 -z-10 rounded-full origin-left animate-[scaleX_1s_ease-out]" />
                )}
                {isCompleted && idx !== phases.length - 1 && (
                  <div className="absolute top-3 left-3 w-[200%] h-1.5 bg-emerald-500 -z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
