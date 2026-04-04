import { motion } from 'framer-motion';
import { AlertCircle, Zap, ShieldAlert, Sparkles, CloudRain, Clock } from 'lucide-react';

export default function InsightsAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      icon: CloudRain,
      title: 'Heavy Rain Forecast',
      message: 'Expected delays in foundation curing for Sector B.',
      time: 'Just now',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      title: 'Labor Shortage Alert',
      message: 'Masonry team is currently running at 60% capacity.',
      time: '2 hours ago',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    }
  ];

  const insights = [
    {
      id: 1,
      icon: Zap,
      title: 'Cost Optimization Found',
      message: 'Switching to Fly Ash Bricks on Level 3 can save ₹45,000.',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 2,
      icon: Sparkles,
      title: 'AI Timeline Suggestion',
      message: 'Parallelizing electrical & plumbing tasks saves 4 days.',
      color: 'text-violet-600 bg-violet-100',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* ── AI Insights ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-6 shadow-lg border border-[#334155] relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20" />
        
        <h3 className="text-white font-black flex items-center gap-2 mb-5 relative z-10">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          SiteGuide AI Intelligence
        </h3>
        
        <div className="space-y-4 relative z-10">
          {insights.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm cursor-default">
                <div className={`p-2 rounded-xl h-fit ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Live Alerts & Risks ── */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-gray-900 font-black flex items-center gap-2 mb-5">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          Live Risks & Alerts
        </h3>
        
        <div className="space-y-3">
          {alerts.map(alert => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={`flex gap-4 p-4 rounded-2xl border ${alert.color}`}>
                <div className="mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">{alert.title}</h4>
                    <span className="text-[10px] uppercase font-bold opacity-70 tracking-wider text-right">{alert.time}</span>
                  </div>
                  <p className="text-xs mt-1 font-medium opacity-80 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
          View All Logs
        </button>
      </motion.div>

    </div>
  );
}
