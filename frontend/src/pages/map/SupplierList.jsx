import { motion } from 'framer-motion';
import { Truck, Star, MapPin, ChevronRight, Package, Clock } from 'lucide-react';

const TYPE_IMAGES = {
  cement: 'https://images.unsplash.com/photo-1541888085-78de46da77f8?q=80&w=800&auto=format&fit=crop',
  steel: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  bricks: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
};

const FILTERS = [
  { key: 'all', label: 'ALL SOURCES' },
  { key: 'cement', label: 'CEMENT' },
  { key: 'steel', label: 'STEEL' },
  { key: 'bricks', label: 'BRICKS' }
];

export default function SupplierList({ suppliers, filter, setFilter }) {
  const visible = filter === 'all' ? suppliers : suppliers.filter(s => s.type === filter);

  return (
    <div className="space-y-6">
      {/* STEP 1: RESTORE FILTER SYSTEM EXACTLY */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all duration-300 ${
              filter === f.key
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_5px_15px_rgba(37,99,235,0.4)] scale-105'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* STEP 2: UPGRADE SUPPLIER UI (Large Visual Cards) */}
      <div className="space-y-4 overflow-y-auto pr-2 pb-10 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 380px)' }}>
        {visible.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group flex flex-row bg-gradient-to-br from-[#1c2333] to-[#111827] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-blue-500/30 border border-transparent h-[140px]"
          >
            {/* LEFT: Image */}
            <div className="w-[35%] relative overflow-hidden shrink-0">
              <img 
                src={TYPE_IMAGES[s.type]} 
                alt={s.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c2333]" />
            </div>

            {/* RIGHT: Info */}
            <div className="flex-1 p-4 flex flex-col justify-between relative pl-2">
              
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  {/* Material type badge */}
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    {s.type}
                  </span>
                  {/* Supplier name */}
                  <h4 className="text-white font-bold text-lg leading-tight tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {s.name}
                  </h4>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 shrink-0">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold">{s.rating}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-gray-400 text-xs mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{s.dist !== undefined && s.dist !== null ? `${s.dist.toFixed(1)} km` : '- km'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{s.delivery}</span>
                </div>
              </div>

              {/* Footer: Price */}
              <div className="flex items-end justify-between mt-auto">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-400">{s.price.split('/')[0]}</span>
                  <span className="text-xs text-gray-500 font-medium">/{s.price.split('/')[1]}</span>
                </div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {visible.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 shadow-inner"
        >
          <div className="text-5xl mb-4 opacity-40">📦</div>
          <p className="text-gray-400 font-bold tracking-wide uppercase text-xs">No suppliers found for this category</p>
        </motion.div>
      )}
    </div>
  );
}
