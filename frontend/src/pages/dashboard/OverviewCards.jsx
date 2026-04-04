import { motion } from 'framer-motion';
import { DollarSign, PieChart, Clock, CheckSquare, AlertTriangle, TrendingUp } from 'lucide-react';

export default function OverviewCards() {
  const cards = [
    {
      title: 'Total Project Cost',
      value: '₹30,00,000',
      subtitle: '+2.4% from original estimate',
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-500/20 text-blue-200',
      trend: '+2.4%',
      bar: 65,
    },
    {
      title: 'Budget Utilized',
      value: '65%',
      subtitle: '₹19,50,000 spent',
      icon: PieChart,
      color: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-500/20 text-violet-200',
      trend: 'On Track',
      bar: 65,
    },
    {
      title: 'Est. Completion',
      value: 'Dec 15',
      subtitle: '45 Days Remaining',
      icon: Clock,
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/20 text-emerald-200',
      trend: '-3 Days',
      bar: 40,
    },
    {
      title: 'Active Tasks',
      value: '14 / 24',
      subtitle: 'Currently in progress',
      icon: CheckSquare,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20 text-amber-200',
      trend: 'Active',
      bar: 58,
    },
    {
      title: 'Risk Level',
      value: 'Medium',
      subtitle: 'Weather delays expected',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600',
      iconBg: 'bg-rose-500/20 text-rose-200',
      trend: 'Elevated',
      bar: 75,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-3xl p-5 text-white shadow-lg bg-gradient-to-br ${card.color} cursor-pointer group`}
          >
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-black opacity-10 blur-xl" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-xl ${card.iconBg} backdrop-blur-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-black/20 px-2 py-1 rounded-lg backdrop-blur-md">
                {card.trend}
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl font-black tracking-tight mb-1">
                {card.value}
              </h3>
              <p className="text-white/70 text-xs font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-4 relative z-10">
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.bar}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
