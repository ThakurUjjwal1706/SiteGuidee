import { motion } from 'framer-motion';
import { Maximize2, ChevronDown } from 'lucide-react';

const FLOOR_BUTTONS = [
  { value: 1, label: 'GF',   sublabel: 'Ground only' },
  { value: 2, label: 'G+1',  sublabel: '2 Floors' },
  { value: 3, label: 'G+2',  sublabel: '3 Floors' },
  { value: 4, label: 'G+3',  sublabel: '4 Floors' },
];

const RATE_OPTIONS = [
  { value: 1500, label: 'Economy',  sub: '₹1,500/sq ft' },
  { value: 2000, label: 'Standard', sub: '₹2,000/sq ft' },
  { value: 2800, label: 'Premium',  sub: '₹2,800/sq ft' },
  { value: 4000, label: 'Luxury',   sub: '₹4,000/sq ft' },
];

export default function InputControls({ area, setArea, floors, setFloors, costPerSqft, setCostPerSqft }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur border border-white shadow-lg rounded-2xl px-6 py-5"
    >
      <div className="flex flex-wrap gap-6 items-start">

        {/* ── Build Area ── */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Build Area
          </label>
          <div className="relative">
            <Maximize2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              id="build-area-input"
              type="number"
              min="100"
              max="50000"
              step="50"
              value={area}
              onChange={e => setArea(Math.max(100, Number(e.target.value)))}
              className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
              sq ft
            </span>
          </div>
          {/* Slider */}
          <div className="mt-2">
            <input
              id="area-slider"
              type="range"
              min="100"
              max="10000"
              step="50"
              value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>100</span>
              <span className="text-blue-600 font-bold">{area.toLocaleString()} sq ft</span>
              <span>10,000</span>
            </div>
          </div>
        </div>

        {/* ── Floor Selector ── */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Number of Floors
          </label>
          <div className="flex gap-2">
            {FLOOR_BUTTONS.map(btn => (
              <motion.button
                key={btn.value}
                id={`floor-btn-${btn.label.toLowerCase().replace('+', 'plus')}`}
                onClick={() => setFloors(btn.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="flex flex-col items-center px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                style={{
                  borderColor: floors === btn.value ? '#3B82F6' : '#E5E7EB',
                  background: floors === btn.value
                    ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
                    : '#F9FAFB',
                  color: floors === btn.value ? 'white' : '#6B7280',
                  boxShadow: floors === btn.value ? '0 4px 14px rgba(59,130,246,0.35)' : 'none',
                }}
              >
                <span className="text-base leading-none">{btn.label}</span>
                <span className="text-[9px] font-medium mt-0.5 opacity-75">{btn.sublabel}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Construction Rate ── */}
        <div className="min-w-[160px]">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Build Quality
          </label>
          <div className="relative">
            <select
              id="cost-rate-selector"
              value={costPerSqft}
              onChange={e => setCostPerSqft(Number(e.target.value))}
              className="w-full appearance-none py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
            >
              {RATE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label} — {o.sub}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
