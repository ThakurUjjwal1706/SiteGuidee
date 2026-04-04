const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true }, // days
  dependencies: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'blocked'], default: 'pending' },
});

const materialBreakdownSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  percentage: Number,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true },       // sq ft
  budget: { type: Number, required: true },      // USD
  buildingType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Mixed'],
    required: true,
  },
  floors: { type: Number, default: 1 },
  startDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  estimatedDurationDays: { type: Number, default: 0 },

  // Cost breakdown from costEngine
  estimatedCost: {
    materials: Number,
    labor: Number,
    overhead: Number,
    contingency: Number,
    total: Number,
  },
  costBreakdown: {
    baseRatePerSqFt: Number,
    effectiveArea: Number,
    materialFactor: { type: Number, default: 1.0 },
    laborFactor: { type: Number, default: 1.0 },
    floorsCount: Number,
  },
  materialBreakdown: [materialBreakdownSchema],

  // Schedule
  tasks: [taskSchema],
});

module.exports = mongoose.model('Project', projectSchema);
