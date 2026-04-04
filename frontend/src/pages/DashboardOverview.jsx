import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import OverviewCards from './dashboard/OverviewCards';
import BuildingHero from './dashboard/BuildingHero';
import AnalyticsCharts from './dashboard/AnalyticsCharts';
import InsightsAlerts from './dashboard/InsightsAlerts';
import ProjectTimeline from './dashboard/ProjectTimeline';
import QuickSimulation from './dashboard/QuickSimulation';

export default function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Site Command Center
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> System live. Intelligence active.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <select className="bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-xl px-4 py-2 outline-none hover:border-gray-300 transition-colors shadow-sm cursor-pointer">
            <option>Project Alpha (Phase 1)</option>
            <option>Sector B Commercial</option>
          </select>
        </div>
      </div>

      {/* ── Top Overview Stats ── */}
      <OverviewCards />

      {/* ── Main Hero Row (Building Live View + Timeline + Sim) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BuildingHero />
        </div>
        
        <div className="flex flex-col gap-6 h-[400px]">
          <div className="flex-1 min-h-0">
            <ProjectTimeline />
          </div>
          <div className="flex-1 min-h-0">
            <QuickSimulation />
          </div>
        </div>
      </div>

      {/* ── Mid Row (Insights & Charts) ── */}
      <InsightsAlerts />
      <AnalyticsCharts />

    </div>
  );
}
