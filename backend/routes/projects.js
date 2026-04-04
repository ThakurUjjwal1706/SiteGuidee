const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { calculateCost, getScheduleTemplate, estimateTotalDuration } = require('../utils/costEngine');

// GET all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET single project
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// POST new project — uses costEngine for full breakdown
router.post('/', async (req, res, next) => {
  const { name, location, area, budget, buildingType, floors = 1, materialFactor = 1.0, laborFactor = 1.0 } = req.body;

  if (!name || !location || !area || !budget || !buildingType) {
    return res.status(400).json({ message: 'Missing required fields: name, location, area, budget, buildingType' });
  }

  const costResult = calculateCost({ area: Number(area), buildingType, floors, materialFactor, laborFactor });
  const tasks = getScheduleTemplate(buildingType);
  const totalDays = estimateTotalDuration(tasks);

  const project = new Project({
    name,
    location,
    area: Number(area),
    budget: Number(budget),
    buildingType,
    floors,
    estimatedCost: costResult.summary,
    costBreakdown: costResult.breakdown,
    materialBreakdown: costResult.materialBreakdown,
    tasks,
    estimatedDurationDays: totalDays,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
});

// PUT update project status or task status
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH update a specific task's status within a project
router.patch('/:id/tasks/:taskIndex', async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const taskIdx = parseInt(req.params.taskIndex);
    if (taskIdx < 0 || taskIdx >= project.tasks.length) {
      return res.status(400).json({ message: 'Invalid task index' });
    }

    project.tasks[taskIdx].status = status;
    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// DELETE project
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST estimate cost without saving (for the live cost estimator UI)
router.post('/estimate', async (req, res, next) => {
  try {
    const { area, buildingType, floors = 1, materialFactor = 1.0, laborFactor = 1.0 } = req.body;

    if (!area || !buildingType) {
      return res.status(400).json({ message: 'area and buildingType are required' });
    }

    const result = calculateCost({ area: Number(area), buildingType, floors, materialFactor, laborFactor });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
