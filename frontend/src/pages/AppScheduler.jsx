import { useState } from 'react';
import { Network, Activity, Cpu } from 'lucide-react';
import DigitalTwinBuilder from './scheduler/DigitalTwinBuilder';
import TwinTimeline from './scheduler/TwinTimeline';
import AIInsights from './scheduler/AIInsights';
import WeatherPanel from './scheduler/WeatherPanel';
import SimulationPanel from './scheduler/SimulationPanel';

const INITIAL_PHASES = [
  { id: 'f_gf', name: 'Foundation & Ground', workers: 25, status: 'completed', duration: 15, equipment: 'Excavators x2', start: 0, critical: false },
  { id: 'f_1_2', name: 'Structure Floors 1-2', workers: 40, status: 'in-progress', duration: 25, equipment: 'Crane A', start: 15, critical: true },
  { id: 'f_3_4', name: 'Structure Floors 3-4', workers: 40, status: 'pending', duration: 30, equipment: 'Crane A', start: 40, critical: true },
  { id: 'f_roof', name: 'Roofing & Finish', workers: 15, status: 'pending', duration: 20, equipment: 'Hoist', start: 70, critical: false }
];

export default function AppScheduler() {
  const [phases, setPhases] = useState(INITIAL_PHASES);
  const [activeHoverId, setActiveHoverId] = useState(null); // Links hovering between building & timeline
  
  const simulateDelay = () => {
    // Delay everything except Foundation
    setPhases(prev => prev.map(p => {
      if (p.id !== 'f_gf') {
        const delaysRed = { ...p, start: p.start + 10 };
        // If it's in-progress and delayed, turn it to delayed status (red)
        if (p.status === 'in-progress') delaysRed.status = 'delayed';
        return delaysRed;
      }
      return p;
    }));
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* ── Header ── */}
      <div className="flex items-start justify-between bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -z-10" />
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Digital Twin Scheduler
            <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-indigo-100 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Live Sync
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> AI-driven visual building representation & timeline matrix.
          </p>
        </div>
      </div>

      {/* ── Main UI Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        
        {/* Left: Digital Twin Building (Takes 5 cols) */}
        <div className="lg:col-span-5 h-full">
          <DigitalTwinBuilder 
            phases={phases} 
            activeHoverId={activeHoverId} 
            setActiveHoverId={setActiveHoverId} 
          />
        </div>

        {/* Center: Linked Timeline (Takes 4 cols) */}
        <div className="lg:col-span-4 h-full">
          <TwinTimeline 
            phases={phases} 
            activeHoverId={activeHoverId} 
            setActiveHoverId={setActiveHoverId} 
          />
        </div>

        {/* Right side: Intelligence & Simulation (Takes 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-[0.4] min-h-0">
            <WeatherPanel />
          </div>
          <div className="flex-[0.3] min-h-0">
            <AIInsights phases={phases} />
          </div>
          <div className="flex-[0.3] min-h-0">
            <SimulationPanel onDelayTrigger={simulateDelay} />
          </div>
        </div>
      </div>

    </div>
  );
}
