import { motion } from 'framer-motion';
import { GripVertical, Clock, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TaskList({ tasks, setTasks }) {
  // Simple non-functional drag handle just for visual cue
  
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/40 shadow-xl h-full flex flex-col">
      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-indigo-500" />
        Execution List
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-2xl border flex items-center gap-3 bg-white/50 cursor-pointer shadow-sm
              ${task.critical ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-bold text-gray-800 truncate">{task.name}</h4>
                <StatusBadge status={task.status} />
              </div>
              
              <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
                <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" /> {task.duration} Days
                </span>
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md">
                  <Users className="w-3 h-3" /> {task.workers} Men
                </span>
                {task.critical && (
                  <span className="flex items-center gap-1 text-red-500">
                    <AlertCircle className="w-3 h-3" /> Critical
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Completed': 'bg-emerald-100 text-emerald-700',
    'Ongoing': 'bg-amber-100 text-amber-700 animate-pulse',
    'Pending': 'bg-gray-100 text-gray-600'
  };
  
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
