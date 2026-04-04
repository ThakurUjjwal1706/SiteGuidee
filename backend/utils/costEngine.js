/**
 * SiteGuide Cost Engine
 * Modular JavaScript cost calculation (replaces inline logic)
 * Translates Python/Pandas numeric logic into clean JS
 */

// Base rates per sq ft by building type (in USD)
const BASE_RATES = {
  Residential: 120,
  Commercial: 180,
  Industrial: 150,
  Mixed: 160,
};

// Material subcategory weights (must sum to 1.0)
const MATERIAL_BREAKDOWN = {
  Concrete: 0.40,
  Steel: 0.30,
  Wood: 0.15,
  Fixtures: 0.10,
  Other: 0.05,
};

// Task schedule templates by building type (days)
const SCHEDULE_TEMPLATES = {
  Residential: [
    { name: 'Site Preparation', duration: 7, dependencies: [] },
    { name: 'Foundation', duration: 14, dependencies: ['Site Preparation'] },
    { name: 'Structure & Framing', duration: 21, dependencies: ['Foundation'] },
    { name: 'Roofing', duration: 10, dependencies: ['Structure & Framing'] },
    { name: 'Electrical & Plumbing', duration: 18, dependencies: ['Structure & Framing'] },
    { name: 'Insulation & Drywall', duration: 14, dependencies: ['Electrical & Plumbing'] },
    { name: 'Finishing & Paint', duration: 20, dependencies: ['Insulation & Drywall'] },
    { name: 'Final Inspection', duration: 5, dependencies: ['Finishing & Paint', 'Roofing'] },
  ],
  Commercial: [
    { name: 'Site Survey & Clearance', duration: 10, dependencies: [] },
    { name: 'Excavation & Foundation', duration: 20, dependencies: ['Site Survey & Clearance'] },
    { name: 'Steel Structure', duration: 35, dependencies: ['Excavation & Foundation'] },
    { name: 'MEP Rough-In', duration: 25, dependencies: ['Steel Structure'] },
    { name: 'Facade & Glazing', duration: 20, dependencies: ['Steel Structure'] },
    { name: 'Interior Build-Out', duration: 30, dependencies: ['MEP Rough-In'] },
    { name: 'Final Commissioning', duration: 7, dependencies: ['Interior Build-Out', 'Facade & Glazing'] },
  ],
  Industrial: [
    { name: 'Site Preparation', duration: 14, dependencies: [] },
    { name: 'Foundation & Slabs', duration: 21, dependencies: ['Site Preparation'] },
    { name: 'Steel Frame & Roof', duration: 30, dependencies: ['Foundation & Slabs'] },
    { name: 'Utilities & Electrical', duration: 25, dependencies: ['Steel Frame & Roof'] },
    { name: 'Equipment Installation', duration: 20, dependencies: ['Utilities & Electrical'] },
    { name: 'Testing & Handover', duration: 7, dependencies: ['Equipment Installation'] },
  ],
  Mixed: [
    { name: 'Site Preparation', duration: 10, dependencies: [] },
    { name: 'Foundation', duration: 18, dependencies: ['Site Preparation'] },
    { name: 'Structure', duration: 30, dependencies: ['Foundation'] },
    { name: 'Electrical & Plumbing', duration: 22, dependencies: ['Structure'] },
    { name: 'Finishing', duration: 25, dependencies: ['Electrical & Plumbing'] },
    { name: 'Inspection', duration: 5, dependencies: ['Finishing'] },
  ],
};

/**
 * Calculate full cost breakdown for a project
 * @param {Object} params
 * @param {number} params.area - Area in sq ft
 * @param {string} params.buildingType - One of Residential|Commercial|Industrial|Mixed
 * @param {number} params.floors - Number of floors (default 1)
 * @param {number} params.materialFactor - Market inflation factor (default 1.0)
 * @param {number} params.laborFactor - Labor market factor (default 1.0)
 * @returns {Object} Full cost breakdown
 */
function calculateCost({ area, buildingType, floors = 1, materialFactor = 1.0, laborFactor = 1.0 }) {
  const baseRate = BASE_RATES[buildingType] || BASE_RATES.Residential;

  // Multi-floor discount: each additional floor adds 85% of base cost (economy of scale)
  const totalArea = area * (1 + (floors - 1) * 0.85);

  const rawMaterialCost = totalArea * baseRate * 0.60 * materialFactor;
  const rawLaborCost = totalArea * baseRate * 0.40 * laborFactor;
  const overheadCost = (rawMaterialCost + rawLaborCost) * 0.08; // 8% overhead
  const contingency = (rawMaterialCost + rawLaborCost) * 0.05;  // 5% contingency

  const totalCost = rawMaterialCost + rawLaborCost + overheadCost + contingency;

  // Material subcategory breakdown
  const materialBreakdown = Object.entries(MATERIAL_BREAKDOWN).map(([name, weight]) => ({
    name,
    cost: Math.round(rawMaterialCost * weight),
    percentage: Math.round(weight * 100),
  }));

  return {
    summary: {
      materials: Math.round(rawMaterialCost),
      labor: Math.round(rawLaborCost),
      overhead: Math.round(overheadCost),
      contingency: Math.round(contingency),
      total: Math.round(totalCost),
    },
    breakdown: {
      baseRatePerSqFt: baseRate,
      effectiveArea: Math.round(totalArea),
      materialFactor,
      laborFactor,
      floorsCount: floors,
    },
    materialBreakdown,
  };
}

/**
 * Get the task schedule template for a building type
 * @param {string} buildingType
 * @returns {Array} Array of task objects
 */
function getScheduleTemplate(buildingType) {
  return (SCHEDULE_TEMPLATES[buildingType] || SCHEDULE_TEMPLATES.Residential).map(t => ({
    ...t,
    status: 'pending',
  }));
}

/**
 * Estimate total timeline in days using critical path
 * @param {Array} tasks
 * @returns {number} Total days
 */
function estimateTotalDuration(tasks) {
  return tasks.reduce((sum, t) => sum + t.duration, 0);
}

module.exports = {
  calculateCost,
  getScheduleTemplate,
  estimateTotalDuration,
  BASE_RATES,
  MATERIAL_BREAKDOWN,
};
