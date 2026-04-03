import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GripVertical, AlertTriangle } from 'lucide-react';
import { addDays, format } from 'date-fns';

const initialTasks = [
  { id: 1, name: 'Site Preparation', days: 7, status: 'completed' },
  { id: 2, name: 'Foundation', days: 14, status: 'in-progress' },
  { id: 3, name: 'Structure', days: 30, status: 'pending' },
  { id: 4, name: 'Electrical & Plumbing', days: 20, status: 'pending' },
  { id: 5, name: 'Finishing', days: 25, status: 'pending' },
];

export default function AppScheduler() {
  const [tasks, setTasks] = useState(initialTasks);
  const startDate = new Date();

  let currentDate = startDate;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Scheduler</h1>
        <p className="text-gray-500">Gantt-style timeline and dependency tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900">Project Tasks</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{tasks.length} total</span>
          </div>
          
          {tasks.map((task) => (
            <motion.div 
               key={task.id}
               className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 cursor-move hover:border-blue-300 transition"
               whileHover={{ scale: 1.02 }}
            >
               <GripVertical className="text-gray-300 w-5 h-5" />
               <div className="flex-1">
                 <h4 className="font-semibold text-gray-900">{task.name}</h4>
                 <div className="flex justify-between items-center mt-1">
                   <p className="text-sm text-gray-500">{task.days} days</p>
                   <span className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500 blink' : 'bg-gray-300'}`}></span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline View */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
           <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
             <Calendar className="w-5 h-5 text-blue-600" />
             <h3 className="font-bold text-lg">Timeline View</h3>
           </div>
           
           <div className="space-y-6 relative">
             <div className="absolute left-[30%] top-0 bottom-0 w-px bg-red-400 border-l border-dashed z-0">
               <div className="bg-red-400 text-white text-[10px] px-2 py-0.5 rounded-full absolute -top-4 -left-6">Today</div>
             </div>

             {tasks.map((task, i) => {
               const width = (task.days / 100) * 100; // Simplified scale
               const startOffset = i === 0 ? 0 : (tasks.slice(0, i).reduce((acc, t) => acc + t.days, 0) / 100) * 100;
               
               const start = format(currentDate, 'MMM dd');
               currentDate = addDays(currentDate, task.days);
               const end = format(currentDate, 'MMM dd');

               return (
                 <div key={task.id} className="relative z-10 flex items-center mb-4">
                    <div className="w-1/3 pr-4 text-sm font-medium text-gray-600 truncate">{task.name}</div>
                    <div className="w-2/3 relative h-10 bg-gray-50 flex items-center rounded-xl px-2">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(width, 100)}%` }}
                         transition={{ duration: 0.8, delay: i * 0.1 }}
                         style={{ left: `${startOffset}%` }}
                         className={`absolute h-6 rounded-lg ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500 shadow-lg shadow-blue-500/40' : 'bg-gray-300'} flex items-center px-3`}
                       >
                         {task.status !== 'pending' && <span className="text-[10px] text-white font-bold whitespace-nowrap">{start} - {end}</span>}
                       </motion.div>
                    </div>
                 </div>
               )
             })}
           </div>
           
           <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 text-orange-800">
             <AlertTriangle className="w-5 h-5 shrink-0" />
             <div>
               <h4 className="font-bold text-sm">AI Prediction</h4>
               <p className="text-sm mt-1">Based on upcoming weather forecasts and current material supply chain data, "Structure" phase may face a 4-day delay.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
