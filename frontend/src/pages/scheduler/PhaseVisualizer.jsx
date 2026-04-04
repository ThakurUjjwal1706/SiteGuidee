import { motion } from 'framer-motion';
import { Target, Pickaxe, Box, Paintbrush } from 'lucide-react';

const PHASES = [
  { id: 'p1', name: 'Foundation', progress: 100, icon: Target, image: 'https://images.unsplash.com/photo-1541888081603-519da6d42065?q=80&w=200&auto=format&fit=crop' },
  { id: 'p2', name: 'Structure', progress: 65, icon: Pickaxe, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop' },
  { id: 'p3', name: 'Plumbing', progress: 0, icon: Box, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' },
  { id: 'p4', name: 'Finishing', progress: 0, icon: Paintbrush, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=200&auto=format&fit=crop' }
];

export default function PhaseVisualizer() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm col-span-full">
      <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
        Macro Phase Tracker
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = phase.progress > 0 && phase.progress < 100;
          const isDone = phase.progress === 100;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-2xl overflow-hidden group border border-gray-200 cursor-pointer h-32"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${phase.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDone ? 'from-emerald-900/90' : isActive ? 'from-blue-900/90' : 'from-gray-900/90'} to-transparent`} />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">{phase.name}</h4>
                  </div>
                  <span className="text-white font-black text-sm">{phase.progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`h-full rounded-full ${isDone ? 'bg-emerald-400' : 'bg-blue-400'}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
