const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { computeCriticalPath, generateRisks } = require('../utils/scheduleEngine');

/**
 * GET /api/scheduler/:projectId
 * Compute CPM schedule for an existing project
 */
router.get('/:projectId', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const startDate = project.startDate || new Date();
    const scheduledTasks = computeCriticalPath(project.tasks, startDate);
    const risks = generateRisks(scheduledTasks);

    const criticalPath = scheduledTasks.filter(t => t.isCritical).map(t => t.name);
    const totalDays = Math.max(...scheduledTasks.map(t => t.earlyFinish));

    res.json({
      projectId: project._id,
      projectName: project.name,
      startDate: new Date(startDate).toISOString().split('T')[0],
      totalDays,
      tasks: scheduledTasks,
      criticalPath,
      risks,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/scheduler/compute
 * Compute CPM for arbitrary task list (no project needed — for live preview)
 */
router.post('/compute', async (req, res, next) => {
  try {
    const { tasks, startDate } = req.body;
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: 'tasks array is required' });
    }

    const scheduledTasks = computeCriticalPath(tasks, startDate || new Date());
    const risks = generateRisks(scheduledTasks);
    const criticalPath = scheduledTasks.filter(t => t.isCritical).map(t => t.name);
    const totalDays = Math.max(...scheduledTasks.map(t => t.earlyFinish));

    res.json({ tasks: scheduledTasks, criticalPath, totalDays, risks });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
