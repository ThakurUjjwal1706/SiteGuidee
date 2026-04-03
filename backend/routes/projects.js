const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new project (calculate cost here)
router.post('/', async (req, res) => {
  const { name, location, area, budget, buildingType } = req.body;

  // Simple cost calculation logic
  let baseRate = 100; // Base arbitrary rate per sq ft depending on type
  if (buildingType === 'Residential') baseRate = 120;
  if (buildingType === 'Commercial') baseRate = 180;
  if (buildingType === 'Industrial') baseRate = 150;

  const materialsCost = area * baseRate * 0.6; // 60% is material
  const laborCost = area * baseRate * 0.4; // 40% is labor
  const totalCost = materialsCost + laborCost;

  const project = new Project({
    name, location, area, budget, buildingType,
    estimatedCost: {
      materials: materialsCost,
      labor: laborCost,
      total: totalCost
    },
    tasks: [
      { name: 'Site Preparation', duration: 7, dependencies: [] },
      { name: 'Foundation', duration: 14, dependencies: ['Site Preparation'] },
      { name: 'Structure', duration: 30, dependencies: ['Foundation'] },
      { name: 'Electrical & Plumbing', duration: 20, dependencies: ['Structure'] },
      { name: 'Finishing', duration: 25, dependencies: ['Electrical & Plumbing'] }
    ]
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
