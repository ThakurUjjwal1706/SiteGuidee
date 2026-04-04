import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, TrendingUp, AlertTriangle, Package, Brain, Building2, Users, Clock, ChevronRight } from 'lucide-react';
import SupplierList from './SupplierList';
import InsightsPanel from './InsightsPanel';
import { haversine } from '../MapDashboard';

const STATUS_BADGE = {
  ongoing:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Ongoing' },
  completed: { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Completed' },
  delayed:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Delayed' },
};

export default function InfoPanel({
  selectedSite, selectedProject,
  suppliers, supplierFilter, setSupplierFilter,
  panelTab, setPanelTab,
  projects, onProjectClick,
}) {
  const nearbySuppliers = selectedSite
    ? suppliers
        .map(s => ({ ...s, dist: haversine(selectedSite.lat, selectedSite.lng, s.lat, s.lng) }))
        .sort((a, b) => a.dist - b.dist)
    : [];

  return (
    <motion.aside
      initial={{ x: 560 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-[560px] flex-shrink-0 h-full bg-[#0B1221] backdrop-blur-3xl border-l border-white/10 flex flex-col overflow-hidden z-30 shadow-[-30px_0_80px_rgba(0,0,0,0.5)]"
    >
      {/* Header - Premium Minimalist */}
      <div className="px-8 py-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Construction Intelligence</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter mb-2 relative z-10">Site Intelligence</h2>
        <p className="text-sm text-gray-400 font-medium opacity-70">Interactive site analysis & logistics core</p>
      </div>

      {/* Tab bar - Spacious & Modern */}
      <div className="flex border-b border-white/10 px-8 pt-4 gap-8">
        {[
          { key: 'site',     label: 'Analysis', Icon: MapPin },
          { key: 'project',  label: 'Projects', Icon: Building2 },
          { key: 'insights', label: 'AI Insights', Icon: Brain },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setPanelTab(key)}
            className={`flex items-center gap-2 pb-5 text-sm font-bold transition-all relative ${
              panelTab === key
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${panelTab === key ? 'text-blue-500' : 'text-gray-600'}`} />
            {label}
            {panelTab === key && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_12px_rgba(59,130,246,0.4)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content - Scrollable with character */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 scroll-smooth custom-scrollbar">
        
        <AnimatePresence mode="wait">
          {/* ── SITE TAB ── */}
          {panelTab === 'site' && (
            <motion.div key="site" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="space-y-10">
              {selectedSite ? (
                <>
                  {/* Location Header Unit */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Selected Site</p>
                         <h3 className="text-white font-black text-2xl tracking-tight">{selectedSite.locationName}</h3>
                      </div>
                      <div
                        className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border"
                        style={{ background: selectedSite.risk.color + '15', color: selectedSite.risk.color, borderColor: selectedSite.risk.color + '30' }}
                      >
                        {selectedSite.risk.level} Risk
                      </div>
                    </div>
                    <div className="flex items-center gap-2 py-3 px-4 bg-white/5 rounded-2xl border border-white/10">
                       <MapPin className="w-4 h-4 text-blue-500" />
                       <span className="text-gray-400 text-xs font-mono tracking-tight">
                         {selectedSite.lat.toFixed(6)}° N, {selectedSite.lng.toFixed(6)}° E
                       </span>
                    </div>
                  </div>

                  {/* Primary Metrics Grid */}
                  <div className="grid gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/5 border border-blue-500/20 rounded-[32px] p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                      <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp className="w-32 h-32 text-blue-500" />
                      </div>
                      <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">Construction Rate</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-4xl font-black text-white tracking-tighter">₹{selectedSite.rate.toLocaleString()}</span>
                         <span className="text-blue-400/60 font-bold">/ sq.ft</span>
                      </div>
                      <div className="mt-6 flex items-center gap-2 bg-blue-500/10 w-fit px-3 py-1.5 rounded-full border border-blue-500/20">
                         <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                         <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Market Value: {selectedSite.zone}</span>
                      </div>
                    </div>

                    {selectedSite.weather && (
                      <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-[32px] p-8 group hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center justify-between mb-6">
                           <div>
                             <p className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.2em]">Environment</p>
                             <h4 className="text-white font-black text-2xl capitalize mt-1">{selectedSite.weather.desc}</h4>
                           </div>
                           <div className="text-4xl font-black text-white">{selectedSite.weather.temp}°</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                             <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Humidity</p>
                             <p className="text-white font-black">{selectedSite.weather.humidity}%</p>
                           </div>
                           <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                             <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Wind Speed</p>
                             <p className="text-white font-black">{selectedSite.weather.wind} m/s</p>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState icon="🗺️" title="Site Intelligence Ready" sub="Select a point on the map to initialize deep site selection, cost analysis, and local supply chain mapping." />
              )}

              {/* Supplier Section (ALWAYS SHOWN) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Top Suppliers
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedSite ? nearbySuppliers.length : suppliers.length} Verified Sources</p>
                </div>
                <SupplierList suppliers={selectedSite ? nearbySuppliers : suppliers} filter={supplierFilter} setFilter={setSupplierFilter} />
              </div>
            </motion.div>
          )}

          {/* ── PROJECTS TAB ── */}
          {panelTab === 'project' && (
            <motion.div key="project" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="space-y-6">
              {/* Existing Project implementation expanded for more room */}
              <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-4">Active Deployments</p>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => onProjectClick(p)}
                  className={`w-full text-left bg-white/5 hover:bg-white/10 border transition-all ${selectedProject?.id === p.id ? 'border-blue-500' : 'border-white/10'} rounded-[24px] p-6 flex items-center gap-4 group`}
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_12px] group-hover:scale-125 transition-transform`} style={{ background: STATUS_BADGE[p.status].text.replace('text-', ''), color: STATUS_BADGE[p.status].text.replace('text-', ''), boxShadow: `0 0 12px currentColor` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-lg font-bold truncate tracking-tight">{p.name}</p>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{p.city} · <span className="text-emerald-500">{p.cost}</span></p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </motion.div>
          )}

          {/* ── AI INSIGHTS TAB ── */}
          {panelTab === 'insights' && (
            <motion.div key="insights" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <InsightsPanel selectedSite={selectedSite} suppliers={nearbySuppliers} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </motion.aside>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center px-8 bg-white/5 border border-white/5 rounded-[40px] shadow-inner"
    >
      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-5xl mb-8 border border-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        {icon}
      </div>
      <h3 className="text-white font-black text-2xl tracking-tight mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] font-medium mx-auto opacity-70 italic">{sub}</p>
    </motion.div>
  );
}
