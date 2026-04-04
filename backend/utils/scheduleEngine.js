/**
 * SiteGuide Schedule Engine
 * Critical Path Method (CPM) scheduler in pure JavaScript
 */

/**
 * Build a dependency graph and compute earliest start/finish for each task
 * @param {Array} tasks - Array of { name, duration, dependencies }
 * @param {Date} startDate - Project start date
 * @returns {Array} Enriched tasks with start, end, isCritical flags
 */
function computeCriticalPath(tasks, startDate = new Date()) {
  if (!tasks || tasks.length === 0) return [];

  // Create a map for fast lookup
  const taskMap = {};
  tasks.forEach((t, i) => {
    taskMap[t.name] = { ...t, index: i, earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0 };
  });

  // Forward pass: compute early start and early finish
  const resolved = new Set();
  const queue = [...tasks];

  let iterations = 0;
  while (resolved.size < tasks.length && iterations < tasks.length * tasks.length) {
    iterations++;
    for (const task of queue) {
      if (resolved.has(task.name)) continue;

      const t = taskMap[task.name];
      const deps = t.dependencies || [];

      // Check all dependencies are resolved
      if (!deps.every(dep => resolved.has(dep))) continue;

      // Early start = max early finish of all dependencies
      if (deps.length === 0) {
        t.earlyStart = 0;
      } else {
        t.earlyStart = Math.max(...deps.map(dep => taskMap[dep]?.earlyFinish || 0));
      }
      t.earlyFinish = t.earlyStart + t.duration;
      resolved.add(task.name);
    }
  }

  // Project duration = max earlyFinish
  const projectDuration = Math.max(...Object.values(taskMap).map(t => t.earlyFinish));

  // Backward pass: compute late start and late finish
  // Reset resolved for backward pass
  resolved.clear();

  // Find terminal tasks (not a dependency of anything)
  const isDependency = new Set(tasks.flatMap(t => t.dependencies || []));
  const terminalTasks = tasks.filter(t => !isDependency.has(t.name));

  terminalTasks.forEach(t => {
    taskMap[t.name].lateFinish = projectDuration;
    taskMap[t.name].lateStart = projectDuration - taskMap[t.name].duration;
  });

  // Process in reverse topological order
  const processedBackward = new Set(terminalTasks.map(t => t.name));
  iterations = 0;
  while (processedBackward.size < tasks.length && iterations < tasks.length * tasks.length) {
    iterations++;
    for (const task of [...tasks].reverse()) {
      if (processedBackward.has(task.name)) continue;
      const t = taskMap[task.name];

      // Find successors (tasks that depend on this task)
      const successors = tasks.filter(s => (s.dependencies || []).includes(task.name));

      // All successors must be processed first
      if (!successors.every(s => processedBackward.has(s.name))) continue;

      if (successors.length === 0) {
        t.lateFinish = projectDuration;
      } else {
        t.lateFinish = Math.min(...successors.map(s => taskMap[s.name].lateStart));
      }
      t.lateStart = t.lateFinish - t.duration;
      processedBackward.add(task.name);
    }
  }

  // Calculate float and determine critical path
  const d = new Date(startDate);

  return tasks.map(task => {
    const t = taskMap[task.name];
    const float = t.lateStart - t.earlyStart;
    const isCritical = float === 0;

    const startDt = new Date(d);
    startDt.setDate(startDt.getDate() + t.earlyStart);
    const endDt = new Date(startDt);
    endDt.setDate(endDt.getDate() + t.duration);

    return {
      ...task,
      earlyStart: t.earlyStart,
      earlyFinish: t.earlyFinish,
      lateStart: t.lateStart,
      lateFinish: t.lateFinish,
      float,
      isCritical,
      startDate: startDt.toISOString().split('T')[0],
      endDate: endDt.toISOString().split('T')[0],
    };
  });
}

/**
 * Generate risk predictions based on tasks and conditions
 * @param {Array} tasks
 * @param {Object} conditions - { weatherRisk, supplyRisk }
 * @returns {Array} Risk alerts
 */
function generateRisks(tasks, conditions = {}) {
  const risks = [];
  const { weatherRisk = 0.3, supplyRisk = 0.2 } = conditions;

  const criticalTasks = tasks.filter(t => t.isCritical);

  criticalTasks.forEach(task => {
    if (weatherRisk > 0.25 && ['Foundation', 'Structure', 'Roofing', 'Excavation'].some(k => task.name.includes(k))) {
      risks.push({
        severity: 'medium',
        task: task.name,
        reason: 'Weather conditions may impact outdoor work',
        estimatedDelay: Math.ceil(task.duration * weatherRisk * 0.3),
      });
    }
    if (supplyRisk > 0.15 && task.name.includes('Steel')) {
      risks.push({
        severity: 'high',
        task: task.name,
        reason: 'Steel supply chain disruption risk detected',
        estimatedDelay: Math.ceil(task.duration * supplyRisk * 0.5),
      });
    }
  });

  return risks;
}

module.exports = { computeCriticalPath, generateRisks };
