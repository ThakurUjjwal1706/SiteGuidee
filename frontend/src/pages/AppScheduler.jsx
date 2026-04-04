import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GripVertical, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { schedulerApi, projectsApi } from '../api';

const STATUS_COLORS = {
  completed: 'bg-green-500',
  'in-progress': 'bg-blue-500',
  pending: 'bg-gray-300',
  blocked: 'bg-red-400',
};

const SEVERITY_COLORS = {
  high: 'border-red-200 bg-red-50 text-red-800',
  medium: 'border-orange-200 bg-orange-50 text-orange-800',
  low: 'border-yellow-200 bg-yellow-50 text-yellow-800',
};

export default function AppScheduler() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load project list on mount
  useEffect(() => {
    projectsApi.getAll()
      .then(data => setProjects(data))
      .catch(() => {});
  }, []);

  const loadSchedule = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await schedulerApi.getForProject(projectId);
      setScheduleData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) loadSchedule(selectedProjectId);
  }, [selectedProjectId, loadSchedule]);

  // Demo tasks when no project selected
  const demoTasks = [
    { name: 'Site Preparation', duration: 7, status: 'completed', earlyStart: 0, earlyFinish: 7, isCritical: false, startDate: '2026-04-01', endDate: '2026-04-08' },
    { name: 'Foundation', duration: 14, status: 'in-progress', earlyStart: 7, earlyFinish: 21, isCritical: true, startDate: '2026-04-08', endDate: '2026-04-22' },
    { name: 'Structure', duration: 30, status: 'pending', earlyStart: 21, earlyFinish: 51, isCritical: true, startDate: '2026-04-22', endDate: '2026-05-22' },
    { name: 'Electrical & Plumbing', duration: 20, status: 'pending', earlyStart: 51, earlyFinish: 71, isCritical: false, startDate: '2026-05-22', endDate: '2026-06-11' },
    { name: 'Finishing', duration: 25, status: 'pending', earlyStart: 71, earlyFinish: 96, isCritical: true, startDate: '2026-06-11', endDate: '2026-07-06' },
  ];

  const displayTasks = scheduleData?.tasks || demoTasks;
  const totalDays = scheduleData?.totalDays || demoTasks[demoTasks.length - 1]?.earlyFinish || 96;
  const criticalPath = scheduleData?.criticalPath || ['Foundation', 'Structure', 'Finishing'];
  const risks = scheduleData?.risks || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Scheduler</h1>
          <p className="text-gray-500">Critical Path Method (CPM) schedule with AI risk detection.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
          >
            <option value="">Demo schedule</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {selectedProjectId && (
            <button
              onClick={() => loadSchedule(selectedProjectId)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">⚠️ {error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Loader2 className="animate-spin w-8 h-8 mr-3" /> Computing schedule...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <span className="font-bold text-gray-900">Task List</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{displayTasks.length} tasks</span>
            </div>

            {displayTasks.map((task) => (
              <motion.div
                key={task.name}
                className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-3 ${task.isCritical ? 'border-red-200' : 'border-gray-100'}`}
                whileHover={{ scale: 1.01 }}
              >
                <GripVertical className="text-gray-300 w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{task.name}</h4>
                    {task.isCritical && (
                      <span className="shrink-0 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{task.duration}d · {task.startDate} → {task.endDate}</p>
                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[task.status] || 'bg-gray-300'}`} />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Summary */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl text-white">
              <p className="text-gray-400 text-xs mb-1">Project Duration</p>
              <p className="text-3xl font-bold">{totalDays} <span className="text-lg font-normal text-gray-400">days</span></p>
              <p className="text-xs text-gray-400 mt-2">Critical path: {criticalPath.join(' → ')}</p>
            </div>
          </div>

          {/* Gantt Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Gantt Timeline</h3>
                <span className="ml-auto text-xs text-red-400 font-medium">— Critical Path</span>
              </div>

              <div className="space-y-4 min-w-[400px]">
                {displayTasks.map((task, i) => {
                  const widthPct = Math.max((task.duration / totalDays) * 100, 3);
                  const leftPct = (task.earlyStart / totalDays) * 100;

                  return (
                    <div key={task.name} className="relative flex items-center gap-3 z-10">
                      <div className="w-1/3 pr-2 text-xs font-medium text-gray-600 truncate text-right">{task.name}</div>
                      <div className="w-2/3 relative h-8 bg-gray-50 rounded-xl overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPct}%` }}
                          transition={{ duration: 0.7, delay: i * 0.08 }}
                          style={{ left: `${leftPct}%` }}
                          className={`absolute h-full rounded-lg flex items-center px-2 ${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'in-progress' ? 'bg-blue-500 shadow-blue-500/30 shadow-md' :
                            task.isCritical ? 'bg-red-300' : 'bg-gray-300'
                          }`}
                        >
                          <span className="text-[10px] text-white font-bold whitespace-nowrap overflow-hidden">
                            {task.status !== 'pending' ? `${task.startDate?.slice(5)}` : ''}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                {[
                  { color: 'bg-green-500', label: 'Completed' },
                  { color: 'bg-blue-500', label: 'In Progress' },
                  { color: 'bg-red-300', label: 'Critical' },
                  { color: 'bg-gray-300', label: 'Pending' },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded ${color}`} /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk Alerts */}
            {risks.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-sm">AI Risk Alerts</h4>
                {risks.map((risk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`border p-4 rounded-xl flex gap-3 ${SEVERITY_COLORS[risk.severity]}`}
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">{risk.severity.toUpperCase()} — {risk.task}</h4>
                      <p className="text-sm mt-0.5">{risk.reason}</p>
                      <p className="text-xs mt-1 font-medium">Est. delay: +{risk.estimatedDelay} days</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 text-orange-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">AI Schedule Insight</h4>
                  <p className="text-sm mt-1">
                    {scheduleData
                      ? `No critical risks detected. Total project duration: ${totalDays} days. Critical path runs through ${criticalPath.join(', ')}.`
                      : 'Load a project to see AI-powered risk predictions based on your schedule and building type.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
