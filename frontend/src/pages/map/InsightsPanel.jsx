import { motion } from 'framer-motion';
import { Brain, TrendingUp, CloudRain, Package, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

function generateInsights(selectedSite, suppliers) {
  const insights = [];

  if (!selectedSite) {
    return [
      { id: 'start', icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Intelligence Ready', body: 'Select any coordinate on the site map to generate location-specific construction intelligence and supplier analysis.' },
      { id: 'cost', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', title: 'Market Trends', body: 'NCR metro pricing is currently seeing a 4% quarterly increase. Locking in large-scale material contracts now is recommended.' },
      { id: 'supply', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', title: 'Supply Forecast', body: 'Cement availability in the Okhla-Noida corridor is high, with average delivery times under 24 hours for verified vendors.' },
    ];
  }

  const { rate, zone, risk, lat, lng } = selectedSite;
  const nearestCement = suppliers.filter(s => s.type === 'cement')[0];
  const nearestSteel = suppliers.filter(s => s.type === 'steel')[0];

  // Price comparison
  const avg = 2000;
  const diff = Math.round(((rate - avg) / avg) * 100);
  if (diff !== 0) {
    insights.push({
      id: 'price',
      icon: TrendingUp,
      color: diff > 0 ? 'text-rose-400' : 'text-emerald-400',
      bg: diff > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10',
      border: diff > 0 ? 'border-rose-500/20' : 'border-emerald-500/20',
      title: `Price Analysis: ${diff > 0 ? 'High Command' : 'Discount Zone'}`,
      body: `The rate for ${zone} (₹${rate}/sq.ft) is ${Math.abs(diff)}% ${diff > 0 ? 'higher' : 'lower'} than market baseline. ${diff > 0 ? 'Negotiate for bulk delivery.' : 'Ideal for immediate mobilization.'}`,
    });
  }

  // Logistics & Risk
  insights.push({
    id: 'risk',
    icon: risk.level === 'Low' ? CheckCircle : AlertTriangle,
    color: risk.level === 'Low' ? 'text-emerald-400' : risk.level === 'Medium' ? 'text-amber-400' : 'text-rose-400',
    bg: risk.level === 'Low' ? 'bg-emerald-500/10' : risk.level === 'Medium' ? 'bg-amber-500/10' : 'bg-rose-500/10',
    border: risk.level === 'Low' ? 'border-emerald-500/20' : risk.level === 'Medium' ? 'border-amber-500/20' : 'border-rose-500/20',
    title: `${risk.level} Logistics Risk`,
    body: `${risk.reason}. Recommend ${risk.level === 'High' ? 'premium logistics insurance' : 'standard site mobilization'}.`,
  });

  // Critical Suppliers
  if (nearestCement) {
    insights.push({
      id: 'cement',
      icon: Package,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      title: `Strategic Sourcing: Cement`,
      body: `Nearest high-rating silo is ${nearestCement.dist?.toFixed(1)} km away. ${nearestCement.name} offers pre-verified quality at ${nearestCement.price}.`,
    });
  }

  // Env Impact
  const isRain = lat > 28.5 && lat < 28.7;
  insights.push({
    id: 'env',
    icon: CloudRain,
    color: isRain ? 'text-cyan-400' : 'text-sky-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: isRain ? 'Rain Protection Protocol' : 'Weather Optimal',
    body: isRain 
      ? 'Current zone shows high precipitation risk. Foundation excavation requires immediate water-mesh shielding.' 
      : 'Low humidity forecast. Preferred for slab-casting and exterior finishing work in the next 72 hours.',
  });

  return insights;
}

export default function InsightsPanel({ selectedSite, suppliers }) {
  const insights = generateInsights(selectedSite, suppliers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">AI Intelligence Core</span>
        </div>
        <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 text-[9px] font-bold text-blue-300">Live Stream</div>
      </div>

      <div className="space-y-4">
        {insights.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', damping: 20 }}
            className={`group relative overflow-hidden rounded-3xl border p-6 transition-all hover:bg-white/5 ${item.bg} ${item.border}`}
          >
            {/* Background sparkle effect */}
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <item.icon className="w-24 h-24" />
            </div>

            <div className="relative flex gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} border ${item.border} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className={`text-base font-bold mb-1.5 ${item.color}`}>{item.title}</h4>
                <p className="text-gray-400 text-[13px] leading-relaxed font-medium">
                  {item.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
