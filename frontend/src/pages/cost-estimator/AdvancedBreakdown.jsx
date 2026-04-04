import { motion, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Building2, Layers, Paintbrush, Home, Zap, Download } from 'lucide-react';

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

/* ─── Single breakdown row ─────────────────────────────────── */
function BreakdownRow({ item, index, totalCost }) {
  const Icon = item.icon;
  const pct = item.cost / totalCost;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5, scale: 1.01 }}
      className="flex items-center gap-3 rounded-xl p-3 border border-transparent hover:border-gray-100 hover:shadow-md transition-all cursor-default"
      style={{ background: `${item.color}0A` }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}1A`, color: item.color }}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-gray-700 truncate">{item.label}</span>
          <span className="text-sm font-bold ml-2 tabular-nums" style={{ color: item.color }}>
            <CountUp value={item.cost} />
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: item.color }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.round(pct * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400 w-9 text-right flex-shrink-0">
        {Math.round(pct * 100)}%
      </span>
    </motion.div>
  );
}

export default function AdvancedBreakdown({ costs, totalCost }) {
  const items = [
    { label: 'Cement & Concrete', cost: costs.cement, icon: Building2, color: '#3B82F6' },
    { label: 'Steel & Reinforcement', cost: costs.steel, icon: Layers, color: '#7C3AED' },
    { label: 'Bricks & Masonry', cost: costs.bricks, icon: Home, color: '#EA580C' },
    { label: 'Finishing & Painting', cost: costs.finishing, icon: Paintbrush, color: '#059669' },
    { label: 'Labor & Workforce', cost: costs.labor, icon: Zap, color: '#D97706' },
  ];

  const handleDownload = () => {
    alert("Downloading Cost Estimation Report (PDF) - Mocked Action for now");
  };

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Hero total card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md shadow-blue-900/10"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)' }}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-blue-500/10 blur-xl" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1.5">
              Net Estimated Cost
            </p>
            <div className="text-5xl font-black tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              <CountUp value={totalCost} />
            </div>
            <p className="text-blue-300 text-xs mt-2 font-medium">Includes labor, materials, and multipliers</p>
          </div>
          
          <button 
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-colors px-3 py-2 rounded-xl flex items-center gap-2 group"
          >
             <Download className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-bold text-blue-50 hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-1 mb-3">
          Deep Cost Breakdown
        </p>
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          {items.map((item, i) => (
            <BreakdownRow key={i} item={item} index={i} totalCost={totalCost} />
          ))}
        </div>
      </div>
    </div>
  );
}
