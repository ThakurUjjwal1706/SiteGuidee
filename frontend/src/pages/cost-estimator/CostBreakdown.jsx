import { useEffect, useRef } from 'react';
import { animate, motion } from 'framer-motion';
import { Building2, Layers, Paintbrush, Home, Zap, Clock } from 'lucide-react';

/* ─── Breakdown config ─────────────────────────────────────── */
const ITEMS = [
  { key: 'foundation', label: 'Foundation',            pct: 0.25, icon: Building2,  color: '#3B82F6' },
  { key: 'structure',  label: 'Structure',              pct: 0.30, icon: Layers,     color: '#7C3AED' },
  { key: 'finishing',  label: 'Painting & Plaster',     pct: 0.20, icon: Paintbrush, color: '#EA580C' },
  { key: 'flooring',   label: 'Flooring',               pct: 0.10, icon: Home,       color: '#059669' },
  { key: 'electrical', label: 'Electrical & Plumbing',  pct: 0.15, icon: Zap,        color: '#D97706' },
];

/* ─── Count-up animated number ─────────────────────────────── */
function CountUp({ value, prefix = '₹' }) {
  const ref = useRef(null);
  const prev = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prev.current, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        node.textContent = prefix + Math.round(v).toLocaleString('en-IN');
      },
    });
    prev.current = value;
    return controls.stop;
  }, [value, prefix]);

  return <span ref={ref}>{prefix}{value.toLocaleString('en-IN')}</span>;
}

/* ─── Completion time bar ──────────────────────────────────── */
function TimelineBar({ months }) {
  const maxMonths = 6;
  const pct = Math.min((months / maxMonths) * 100, 100);
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-blue-200 mb-1.5">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Completion Timeline</span>
        <span className="font-bold">{months} months</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #93C5FD, #FFFFFF)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ─── Single breakdown row ─────────────────────────────────── */
function BreakdownRow({ item, totalCost, index }) {
  const cost = Math.round(totalCost * item.pct);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ x: 5, scale: 1.01 }}
      className="flex items-center gap-3 rounded-xl p-3 border border-transparent hover:border-gray-100 hover:shadow-md transition-all cursor-default"
      style={{ background: `${item.color}0D` }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}22` }}
      >
        <Icon className="w-4 h-4" style={{ color: item.color }} />
      </div>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-gray-700 truncate">{item.label}</span>
          <span className="text-sm font-bold ml-2 tabular-nums" style={{ color: item.color }}>
            <CountUp value={cost} />
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: item.color }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.round(item.pct * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.07 }}
          />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400 w-8 text-right flex-shrink-0">
        {Math.round(item.pct * 100)}%
      </span>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function CostBreakdown({ totalCost, completionMonths }) {
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Hero total card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #5B21B6 50%, #6D28D9 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/5" />

        <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
          Total Estimated Cost
        </p>
        <div className="text-4xl font-extrabold tracking-tight">
          <CountUp value={totalCost} />
        </div>
        <p className="text-blue-300 text-xs mt-1">All-inclusive construction estimate</p>

        <TimelineBar months={completionMonths} />
      </div>

      {/* Breakdown list */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-1">
          Cost Breakdown
        </p>
        {ITEMS.map((item, i) => (
          <BreakdownRow key={item.key} item={item} totalCost={totalCost} index={i} />
        ))}
      </div>
    </div>
  );
}

export { ITEMS };
