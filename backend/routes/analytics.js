const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

/**
 * GET /api/analytics/summary
 * Returns aggregated stats for the dashboard overview
 */
router.get('/summary', async (req, res, next) => {
  try {
    const projects = await Project.find();

    const totalProjects = projects.length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalEstimatedCost = projects.reduce((sum, p) => sum + (p.estimatedCost?.total || 0), 0);

    // Count tasks by status across all projects
    const taskStats = { completed: 0, 'in-progress': 0, pending: 0 };
    projects.forEach(p => {
      p.tasks.forEach(t => {
        if (taskStats[t.status] !== undefined) taskStats[t.status]++;
      });
    });

    // Budget utilization
    const budgetUtilization = totalBudget > 0 ? ((totalEstimatedCost / totalBudget) * 100).toFixed(1) : 0;

    // Projects by building type
    const byType = {};
    projects.forEach(p => {
      byType[p.buildingType] = (byType[p.buildingType] || 0) + 1;
    });

    // Monthly cost trend (created in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const costTrend = {};
    projects
      .filter(p => new Date(p.createdAt) >= sixMonthsAgo)
      .forEach(p => {
        const month = monthNames[new Date(p.createdAt).getMonth()];
        costTrend[month] = (costTrend[month] || 0) + (p.estimatedCost?.total || 0);
      });

    const trendData = Object.entries(costTrend).map(([name, cost]) => ({ name, cost }));

    res.json({
      totalProjects,
      totalBudget,
      totalEstimatedCost,
      budgetUtilization: parseFloat(budgetUtilization),
      taskStats,
      byType,
      trendData,
      activeProjects: projects.filter(p =>
        p.tasks.some(t => t.status === 'in-progress')
      ).length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
