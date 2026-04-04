import { motion } from 'framer-motion';
import { Box, Shield, Crown, AlignJustify, CheckCircle, Anchor, Square, Leaf, Grid, Circle, Paintbrush, Gem } from 'lucide-react';

export const MATERIAL_OPTIONS = {
  cement: {
    title: 'Cement Type',
    options: [
      { id: 'opc', label: 'OPC', desc: 'Low cost, fast set', icon: Box, mult: 1.0 },
      { id: 'ppc', label: 'PPC', desc: 'Balanced, durable', icon: Shield, mult: 1.05 },
      { id: 'premium', label: 'Premium', desc: 'Ultra strength', icon: Crown, mult: 1.15 }
    ]
  },
  steel: {
    title: 'Steel Quality',
    options: [
      { id: 'standard', label: 'Standard', desc: 'Basic structural', icon: AlignJustify, mult: 1.0 },
      { id: 'tmt', label: 'TMT Bars', desc: 'Recommended', icon: CheckCircle, mult: 1.1 },
      { id: 'high_strength', label: 'High-strength', desc: 'Heavy loads', icon: Anchor, mult: 1.2 }
    ]
  },
  bricks: {
    title: 'Brick / Block Type',
    options: [
      { id: 'clay', label: 'Clay Bricks', desc: 'Traditional', icon: Square, mult: 1.0 },
      { id: 'fly_ash', label: 'Fly Ash', desc: 'Eco-friendly', icon: Leaf, mult: 0.95 },
      { id: 'aac', label: 'AAC Blocks', desc: 'Modern & light', icon: Grid, mult: 1.1 }
    ]
  },
  finishing: {
    title: 'Finishing Grade',
    options: [
      { id: 'basic', label: 'Basic', desc: 'Simple paint', icon: Circle, mult: 0.8 },
      { id: 'standard', label: 'Standard', desc: 'Quality finish', icon: Paintbrush, mult: 1.0 },
      { id: 'premium', label: 'Premium', desc: 'Luxury interior', icon: Gem, mult: 1.3 }
    ]
  }
};

export default function MaterialSelector({ selections, setSelections }) {
  const handleSelect = (category, id) => {
    setSelections(prev => ({ ...prev, [category]: id }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {Object.entries(MATERIAL_OPTIONS).map(([category, data], idx) => (
        <motion.div 
          key={category}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-5"
        >
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {data.title}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {data.options.map(opt => {
              const Icon = opt.icon;
              const isSelected = selections[category] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(category, opt.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId={`glow-${category}`}
                      className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"
                    />
                  )}
                  <div className={`p-2 rounded-lg mb-2 transition-colors z-10 ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold z-10 text-center ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] font-semibold text-gray-500 mt-1 text-center leading-tight z-10">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
