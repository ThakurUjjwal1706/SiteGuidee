import { motion } from 'framer-motion';
import { AlignLeft, Activity } from 'lucide-react';

const BAR_STYLES = {
  'completed': 'bg-[#34C759] border-[#34C759] shadow-sm text-white',
  'in-progress': 'bg-[#FF9500] border-[#FF9500] shadow-sm text-white',
  'pending': 'bg-[#007AFF] border-[#007AFF] shadow-sm text-white',
  'delayed': 'bg-[#FF3B30] border-[#FF3B30] shadow-[0_2px_8px_rgba(255,59,48,0.3)] text-white'
};

export default function TwinTimeline({ phases, activeHoverId, setActiveHoverId }) {
  const totalDays = 100;

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-neutral-200/60 h-full flex flex-col relative font-sans">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="font-semibold flex items-center gap-2 text-xl tracking-tight text-neutral-800">
          <Activity className="w-5 h-5 text-[#007AFF]" />
          Project Timeline
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" /> Done
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-pulse" /> Active
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" /> Delayed
          </div>
        </div>
      </div>

      <div className="flex flex-1 rounded-2xl overflow-hidden bg-neutral-50/50 border border-neutral-200/50 relative">
        
        {/* Left Column: Task Names */}
        <div className="w-48 bg-white/60 backdrop-blur-md border-r border-neutral-200/60 flex flex-col z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <div className="h-10 border-b border-neutral-200/60 flex items-center px-4 bg-transparent">
            <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-widest flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Assignments
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0 py-2">
            {phases.map(phase => (
              <div 
                key={phase.id} 
                className={`h-12 px-4 py-1 flex flex-col justify-center transition-all cursor-pointer 
                  ${activeHoverId === phase.id ? 'bg-[#007AFF]/10' : 'hover:bg-neutral-100/50'}`}
                onMouseEnter={() => setActiveHoverId(phase.id)}
                onMouseLeave={() => setActiveHoverId(null)}
              >
                <span className={`text-[13px] font-medium truncate transition-colors ${activeHoverId === phase.id ? 'text-[#007AFF]' : 'text-neutral-700'}`}>
                  {phase.name}
                </span>
                <span className="text-[10px] font-medium text-neutral-400">
                  {phase.workers} workers
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline Grid */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
          
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 top-10 flex border-b border-neutral-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-neutral-200/40 h-full relative" />
            ))}
          </div>

          {/* Today Line */}
          <div className="absolute top-10 bottom-0 left-[35%] w-px bg-[#FF3B30] opacity-30 z-10 pointer-events-none" />

          {/* Header */}
          <div className="h-10 border-b border-neutral-200/60 flex bg-white/40 backdrop-blur-sm sticky top-0 z-20">
            {[1, 2, 3, 4, 5].map((month) => (
              <div key={month} className="flex-1 flex items-center justify-center border-r border-neutral-200/40 last:border-0">
                <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                  Month {month}
                </span>
              </div>
            ))}
          </div>

          {/* Task Bars Area */}
          <div className="flex-1 relative pt-3">
            {phases.map((phase, idx) => {
              const startPercent = (phase.start / totalDays) * 100;
              const widthPercent = (phase.duration / totalDays) * 100;
              const isHovered = activeHoverId === phase.id;

              return (
                <div key={phase.id} className="relative h-12 w-full flex items-center group px-1">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${widthPercent}%`, opacity: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }} // Apple-like ease
                    onMouseEnter={() => setActiveHoverId(phase.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className={`absolute h-[26px] rounded-full cursor-pointer flex items-center px-3 transition-all z-10 overflow-hidden
                      ${BAR_STYLES[phase.status]}
                      ${isHovered ? 'scale-[1.02] z-30 ring-2 ring-offset-1 ring-[#007AFF]/30' : 'opacity-95'}
                    `}
                    style={{ left: `${startPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    
                    <span className="text-[11px] font-semibold tracking-wide truncate flex-1 z-10 relative drop-shadow-sm">
                      {phase.duration}d
                    </span>
                  </motion.div>

                  {/* Connectors */}
                  {idx > 0 && phase.critical && (
                     <div className="absolute h-px bg-neutral-300 pointer-events-none transition-all duration-300" 
                          style={{ 
                            left: `${(phases[idx-1].start + phases[idx-1].duration) / totalDays * 100}%`, 
                            width: `${(phase.start - (phases[idx-1].start + phases[idx-1].duration)) / totalDays * 100}%`,
                            opacity: isHovered ? 1 : 0.6
                          }} 
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
