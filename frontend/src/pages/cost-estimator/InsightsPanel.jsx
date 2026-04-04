import { motion } from 'framer-motion';
import { Lightbulb, Info, TrendingDown, ArrowUpRight } from 'lucide-react';
import { MATERIAL_OPTIONS } from './MaterialSelector';

export default function InsightsPanel({ selections }) {
  const getInsights = () => {
    const insights = [];

    // Bricks insight
    if (selections.bricks === 'clay') {
      insights.push({
        id: 1,
        type: 'save',
        text: 'Switch to Fly Ash bricks to save ~5% on masonry cost and reduce environmental impact.',
        icon: TrendingDown,
        color: 'text-green-600',
        bg: 'bg-green-50'
      });
    } else if (selections.bricks === 'aac') {
      insights.push({
        id: 1,
        type: 'info',
        text: 'AAC Blocks selected. This increases initial cost but reduces dead load, potentially saving structural steel costs.',
        icon: Info,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      });
    }

    // Cement insight
    if (selections.cement === 'premium') {
      insights.push({
        id: 2,
        type: 'warn',
        text: 'Premium cement increases cost by 15%. Consider PPC for non-structural elements to optimize budget.',
        icon: ArrowUpRight,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      });
    } else if (selections.cement === 'opc') {
      insights.push({
        id: 2,
        type: 'info',
        text: 'OPC selected for fast setting. Ideal for columns and slabs requiring quick formwork removal.',
        icon: Info,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      });
    }

    // Steel insight
    if (selections.steel === 'tmt') {
      insights.push({
        id: 3,
        type: 'good',
        text: 'TMT Bars selected. Excellent choice for seismic resistance and longevity.',
        icon: Lightbulb,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      });
    }

    // Finishing insight
    if (selections.finishing === 'premium') {
      insights.push({
        id: 4,
        type: 'warn',
        text: 'Premium finishing drives up total cost by 30%. You can limit premium finishes to living areas to save budget.',
        icon: ArrowUpRight,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-800 text-sm">Smart Insights</h3>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {insights.length === 0 ? (
          <p className="text-sm text-gray-500">No specific insights for the current combination.</p>
        ) : (
          insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <motion.div 
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex gap-3 p-3 rounded-xl ${insight.bg} border border-transparent hover:border-gray-200 transition-colors cursor-default`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <p className={`text-xs font-semibold leading-relaxed ${insight.color} opacity-90`}>
                  {insight.text}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
