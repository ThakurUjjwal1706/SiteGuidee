const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  duration: Number, // in days
  dependencies: [String],
  status: { type: String, default: 'pending' }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true }, // in sq ft
  budget: { type: Number, required: true },
  buildingType: { type: String, required: true },
  tasks: [taskSchema],
  createdAt: { type: Date, default: Date.now },
  estimatedCost: {
    materials: Number,
    labor: Number,
    total: Number
  }
});

module.exports = mongoose.model('Project', projectSchema);
