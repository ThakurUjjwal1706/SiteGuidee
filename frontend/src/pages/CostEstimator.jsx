import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Building2 } from 'lucide-react';

import InputControls from './cost-estimator/InputControls';
import MaterialSelector, { MATERIAL_OPTIONS } from './cost-estimator/MaterialSelector';
import SimulationPanel from './cost-estimator/SimulationPanel';
import AdvancedVisualizer from './cost-estimator/AdvancedVisualizer';
import AdvancedBreakdown from './cost-estimator/AdvancedBreakdown';
import ChartComponent from './cost-estimator/ChartComponent';
import InsightsPanel from './cost-estimator/InsightsPanel';
import AIChat from './cost-estimator/AIChat';

export default function CostEstimator() {
  // Base Inputs
  const [area, setArea] = useState(1500);
  const [floors, setFloors] = useState(1);
  const [baseRate, setBaseRate] = useState(2000); 
  const [selectedVisualFloor, setSelectedVisualFloor] = useState(null);

  // Material Selections
  const [materials, setMaterials] = useState({
    cement: 'opc',
    steel: 'tmt',
    bricks: 'clay',
    finishing: 'standard'
  });

  // What-If Sliders
  const [multipliers, setMultipliers] = useState({
    material: 1.0,
    labor: 1.0
  });

  // Derived Values
  const costData = useMemo(() => {
    // Lookup multipliers
    const cementMult = MATERIAL_OPTIONS.cement.options.find(o => o.id === materials.cement).mult;
    const steelMult = MATERIAL_OPTIONS.steel.options.find(o => o.id === materials.steel).mult;
    const bricksMult = MATERIAL_OPTIONS.bricks.options.find(o => o.id === materials.bricks).mult;
    const finishingMult = MATERIAL_OPTIONS.finishing.options.find(o => o.id === materials.finishing).mult;

    const totalArea = area * floors;
    
    // Base logical split (before multipliers)
    const baseTotal = totalArea * baseRate;
    
    // Apply intelligence multipliers
    const calcCement = baseTotal * 0.15 * cementMult * multipliers.material;
    const calcSteel = baseTotal * 0.20 * steelMult * multipliers.material;
    const calcBricks = baseTotal * 0.15 * bricksMult * multipliers.material;
    const calcFinishing = baseTotal * 0.25 * finishingMult * multipliers.material;
    const calcLabor = baseTotal * 0.25 * multipliers.labor;

    const netCost = calcCement + calcSteel + calcBricks + calcFinishing + calcLabor;

    return {
      cement: calcCement,
      steel: calcSteel,
      bricks: calcBricks,
      finishing: calcFinishing,
      labor: calcLabor,
      total: netCost,
      months: 2 + floors
    };
  }, [area, floors, baseRate, materials, multipliers]);

  return (
    <div className="min-h-full space-y-8 pb-10 max-w-7xl mx-auto">
      
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Smart Estimator & Materials
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pro
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Real-time AI cost simulation driven by material intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* ── Base Input Controls ── */}
      <section>
        <InputControls
          area={area} setArea={setArea}
          floors={floors} setFloors={setFloors}
          costPerSqft={baseRate} setCostPerSqft={setBaseRate}
        />
      </section>

      {/* ── Visualizer & Breakdown Split ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col"
        >
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Dynamic Property Visualizer</h3>
            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Live Preview</span>
          </div>
          <div className="flex-1 min-h-[400px]">
            <AdvancedVisualizer 
              floors={floors} 
              finishingQuality={materials.finishing}
              selectedFloor={selectedVisualFloor}
              setSelectedFloor={setSelectedVisualFloor}
            />
          </div>
        </motion.div>

        <motion.div>
          <AdvancedBreakdown costs={costData} totalCost={costData.total} />
        </motion.div>
      </section>

      {/* ── Material Intelligence & Selection ── */}
      <section>
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900">Material Intelligence Sandbox</h2>
          <p className="text-sm text-gray-500">Pick materials to see real-time impact on cost and structural integrity.</p>
        </div>
        <MaterialSelector selections={materials} setSelections={setMaterials} />
        <SimulationPanel multipliers={multipliers} setMultipliers={setMultipliers} />
      </section>

      {/* ── AI & Insights Split ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <InsightsPanel selections={materials} />
        </div>
        <div className="lg:col-span-2 h-full">
          <AIChat />
        </div>
      </section>

      {/* ── Charts ── */}
      <section>
        <ChartComponent totalCost={costData.total} updatedCosts={costData} />
      </section>

    </div>
  );
}
