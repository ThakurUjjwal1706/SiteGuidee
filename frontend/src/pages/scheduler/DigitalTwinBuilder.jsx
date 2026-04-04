import { motion } from 'framer-motion';
import { Layers, Zap } from 'lucide-react';

const STATUS_COLORS = {
  'completed': 'rgba(16, 185, 129, 0.4)', // emerald
  'in-progress': 'rgba(245, 158, 11, 0.4)', // amber
  'pending': 'rgba(100, 116, 139, 0.2)', // slate
  'delayed': 'rgba(239, 68, 68, 0.5)' // red
};

const STATUS_BORDERS = {
  'completed': 'rgb(16, 185, 129)',
  'in-progress': 'rgb(245, 158, 11)',
  'pending': 'rgb(100, 116, 139)',
  'delayed': 'rgb(239, 68, 68)'
};

// Isometric SVG shape generator for floors
function IsometricFloor({ yPos, phase, isHovered, onHover, onLeave }) {
  const isGlowing = isHovered || phase.status === 'in-progress' || phase.status === 'delayed';

  return (
    <motion.g
      initial={{ opacity: 0, y: yPos - 50 }}
      animate={{ opacity: 1, y: yPos }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`cursor-pointer transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : ''}`}
    >
      {/* Top face */}
      <path
        d="M 120,0 L 240,60 L 120,120 L 0,60 Z"
        fill={STATUS_COLORS[phase.status]}
        stroke={STATUS_BORDERS[phase.status]}
        strokeWidth={isHovered ? "3" : "1.5"}
      />
      {/* Left face */}
      <path
        d="M 0,60 L 120,120 L 120,160 L 0,100 Z"
        fill={STATUS_COLORS[phase.status]}
        stroke={STATUS_BORDERS[phase.status]}
        strokeWidth={isHovered ? "3" : "1"}
        opacity="0.8"
      />
      {/* Right face */}
      <path
        d="M 120,120 L 240,60 L 240,100 L 120,160 Z"
        fill={STATUS_COLORS[phase.status]}
        stroke={STATUS_BORDERS[phase.status]}
        strokeWidth={isHovered ? "3" : "1"}
        opacity="0.6"
      />
      
      {/* Glow effect for active/delayed floors */}
      {isGlowing && (
         <path
          d="M 120,0 L 240,60 L 120,120 L 0,60 Z"
          fill="none"
          stroke={STATUS_BORDERS[phase.status]}
          strokeWidth="6"
          opacity="0.5"
          filter="blur(5px)"
        />
      )}

      {/* Label Tooltip shown naturally next to floor */}
      <g className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <rect x="250" y="40" width="120" height="40" rx="8" fill="#0F172A" stroke="#334155" />
        <text x="310" y="58" fill="#FFF" fontSize="10" textAnchor="middle" fontWeight="bold">
          {phase.name}
        </text>
        <text x="310" y="72" fill="#94A3B8" fontSize="9" textAnchor="middle">
          {phase.workers} Workers · {phase.status}
        </text>
        <path d="M 250,60 L 240,60 L 245,65 Z" fill="#0F172A" />
      </g>
    </motion.g>
  );
}

export default function DigitalTwinBuilder({ phases, activeHoverId, setActiveHoverId }) {
  // Mapping phases to y pos (bottom to top)
  // f_gf : lowest
  // f_1_2: mid
  // f_3_4: high
  // f_roof: highest
  
  const floorConfig = {
    'f_roof': { y: 20 },
    'f_3_4': { y: 80 },
    'f_1_2': { y: 140 },
    'f_gf': { y: 200 }
  };

  return (
    <div className="bg-[#0B1221] rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl h-full relative group">
      
      {/* Digital Twin BG */}
      <img
        src="/digital-twin.png"
        alt="Digital Twin Blueprint"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen scale-100 group-hover:scale-105 transition-transform duration-[6000ms]"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/80 to-transparent" />
      <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />

      {/* Header */}
      <div className="absolute top-5 left-5 z-20">
        <h3 className="text-white font-black flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          Building Visualizer
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-blue-400/60 font-bold mt-1">Live Architectural State</p>
      </div>

      <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
         {/* Badges for active workers and equipment */}
         <div className="bg-black/40 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl text-white text-[10px] font-bold flex items-center gap-2">
           <Zap className="w-3 h-3 text-yellow-400" /> {phases.reduce((acc, p) => p.status === 'in-progress' ? acc + p.workers : acc, 0)} Active Workers
         </div>
      </div>

      {/* Interactive Isometric Layers */}
      <div className="absolute inset-0 z-10 flex items-center justify-center mt-10">
        <motion.div
           animate={{ y: [-5, 5, -5] }}
           transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* viewBox setup handles the isometric space */}
          <svg width="400" height="400" viewBox="-40 0 450 400" className="overflow-visible">
            
            {/* Base shadow */}
            <ellipse cx="120" cy="360" rx="140" ry="45" fill="rgba(6, 182, 212, 0.15)" filter="blur(15px)" />
            <ellipse cx="120" cy="360" rx="90" ry="30" fill="rgba(0, 0, 0, 0.8)" filter="blur(10px)" />
            
            {/* Map phases in reverse chronological (bottom up visually) */}
            {['f_gf', 'f_1_2', 'f_3_4', 'f_roof'].reverse().map(id => {
              const phase = phases.find(p => p.id === id);
              if(!phase) return null;
              
              return (
                <IsometricFloor 
                  key={phase.id} 
                  phase={phase} 
                  yPos={floorConfig[phase.id].y} 
                  isHovered={activeHoverId === phase.id}
                  onHover={() => setActiveHoverId(phase.id)}
                  onLeave={() => setActiveHoverId(null)}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
