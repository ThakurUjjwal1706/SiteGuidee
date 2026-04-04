import { motion } from 'framer-motion';
import { AlignLeft, ChevronRight, Activity } from 'lucide-react';

export default function GanttChart({ tasks }) {
  const totalDays = 100; // Total timeline span

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full flex flex-col relative">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-extrabold text-gray-900 flex items-center gap-2 text-lg tracking-tight">
          <Activity className="w-5 h-5 text-indigo-500" />
          Interactive Master Schedule
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Critical Path
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Planned
          </div>
        </div>
      </div>

      <div className="flex flex-1 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 relative">
        
        {/* Left Column: Task Names */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_15px_rgba(0,0,0,0.03)]">
          <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Assignments
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0 custom-scrollbar py-2">
            {tasks.map(task => (
              <div key={task.id} className="h-12 px-4 py-2 flex flex-col justify-center border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                <span className="text-xs font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                  {task.name}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">
                  {task.phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline Grid */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
          
          {/* Timeline Grid Background */}
          <div className="absolute inset-0 top-10 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-gray-100 last:border-r-0 h-full relative">
                {/* Minor grid lines */}
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="border-r border-dashed border-gray-100/50 h-full col-start-2 col-span-1" style={{gridColumnStart: j+2}} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Today Indicator Line */}
          <div className="absolute top-10 bottom-0 left-[35%] w-px bg-red-400 z-10 pointer-events-none shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
          <div className="absolute top-7 left-[35%] -translate-x-1/2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
            TODAY
          </div>

          {/* Timeline Header */}
          <div className="h-10 border-b border-gray-200 flex bg-gray-50 sticky top-0 z-20">
            {[1, 2, 3, 4, 5].map((month) => (
              <div key={month} className="flex-1 flex items-center justify-center border-r border-gray-200 last:border-0">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Month {month}
                </span>
              </div>
            ))}
          </div>

          {/* Task Bars Area */}
          <div className="flex-1 overflow-y-auto relative pt-2">
            {tasks.map((task, idx) => {
              const startPercent = (task.start / totalDays) * 100;
              const widthPercent = (task.duration / totalDays) * 100;

              return (
                <div key={task.id} className="relative h-12 w-full flex items-center group px-2">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${widthPercent}%`, opacity: 1 }}
                    transition={{ duration: 0.7, delay: idx * 0.1, type: 'spring', bounce: 0.2 }}
                    className={`absolute h-7 rounded-lg cursor-ew-resize flex items-center px-3 shadow-md border transition-all z-10
                      ${task.critical ? 'bg-gradient-to-r from-red-500 to-rose-400 border-red-600 shadow-red-500/20 text-white' : 
                        task.status === 'Completed' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-600 shadow-emerald-500/20 text-white' :
                        'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-600 shadow-blue-500/20 text-white'}
                    `}
                    style={{ left: `${startPercent}%` }}
                    whileHover={{ scaleY: 1.1, zIndex: 30, filter: 'brightness(1.1)' }}
                  >
                    {/* Glass overlay shine */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg" />
                    
                    {/* Mini avatar indicating workers */}
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[8px] font-black mr-2 backdrop-blur-sm border border-white/30 truncate px-1">
                      {task.workers}
                    </div>

                    <span className="text-[10px] font-extrabold tracking-wider truncate flex-1 drop-shadow-md">
                      {task.duration} Days
                    </span>
                    
                    <ChevronRight className="w-3 h-3 opacity-50" />
                  </motion.div>

                  {/* Visual Dependency Arrow (simplified) */}
                  {idx > 0 && task.critical && (
                     <div className="absolute h-px bg-red-400 border-t border-dashed border-red-400 opacity-60 pointer-events-none" 
                          style={{ left: `${(tasks[idx-1].start + tasks[idx-1].duration) / totalDays * 100}%`, width: `${(task.start - (tasks[idx-1].start + tasks[idx-1].duration)) / totalDays * 100}%` }} 
                     />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
