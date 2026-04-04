import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, Circle, TrendingUp, Zap } from 'lucide-react';

const PHASES = [
  {
    label: 'Foundation & Ground Floor',
    floors: 'Floors 1–2',
    status: 'completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/40',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  {
    label: 'Upper Structural Frame',
    floors: 'Floors 3–6',
    status: 'in-progress',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border-amber-500/40',
    dot: 'bg-amber-400',
    icon: Clock3,
  },
  {
    label: 'Exterior Glazing & MEP',
    floors: 'Floors 7–10',
    status: 'pending',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10 border-gray-500/20',
    dot: 'bg-gray-500',
    icon: Circle,
  },
];

const STATS = [
  { label: 'Overall Progress', value: '58%', icon: TrendingUp, color: 'text-blue-400' },
  { label: 'Days Remaining', value: '47', icon: Clock3, color: 'text-amber-400' },
  { label: 'Active Workers', value: '134', icon: Zap, color: 'text-emerald-400' },
];

export default function BuildingHero() {
  return (
    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">

      {/* ── Real Building Photo ── */}
      <img
        src="/building-hero.png"
        alt="Live Construction Site"
        className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[4000ms] ease-out"
      />

      {/* ── Gradient Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-[#050D1A]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/70 via-transparent to-transparent" />

      {/* ── LIVE Badge ── */}
      <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full z-20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-bold text-white tracking-widest uppercase">Live Feed</span>
      </div>

      {/* ── Title & subtitle ── */}
      <div className="absolute top-5 left-6 z-20">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-white tracking-tight drop-shadow-lg"
        >
          Site Command Center
        </motion.h2>
        <p className="text-sm text-gray-300 font-medium mt-0.5 drop-shadow">Project Alpha — Phase 1 Active</p>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5">
        
        {/* Phase Status Cards */}
        <div className="flex gap-3 mb-4">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border backdrop-blur-md flex-1 min-w-0 ${phase.bg}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${phase.color} ${phase.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate ${phase.color}`}>{phase.label}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{phase.floors}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats ribbon */}
        <div className="flex items-center gap-3">
          <div className="flex gap-4 flex-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`flex items-center gap-2 ${i > 0 ? 'pl-4 border-l border-white/10' : ''}`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${stat.color}`} />
                  <div>
                    <p className="text-white font-black text-lg leading-none">{stat.value}</p>
                    <p className="text-gray-400 text-[10px] font-medium mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-900/50 backdrop-blur transition-colors whitespace-nowrap border border-blue-400/30"
          >
            Open Site Report →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
