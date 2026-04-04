import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, HardHat, DollarSign, CloudRain, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsApi } from '../api';

const COLORS = ['#2563eb', '#f97316', '#10b981', '#a855f7'];

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsApi.getSummary()
      .then(data => setAnalytics(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mr-3" />
        Loading dashboard...
      </div>
    );
  }

  // Fallback to demo data if no projects exist yet
  const statsData = analytics || {
    totalProjects: 0, totalBudget: 0, totalEstimatedCost: 0,
    activeProjects: 0, taskStats: { completed: 0, 'in-progress': 0, pending: 0 },
    byType: {}, trendData: [
      { name: 'Jan', cost: 0 }, { name: 'Feb', cost: 0 },
      { name: 'Mar', cost: 0 }, { name: 'Apr', cost: 0 },
    ],
  };

  const stats = [
    {
      label: 'Total Budget',
      value: `$${(statsData.totalBudget / 1_000_000).toFixed(2)}M`,
      icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100',
      sub: `${statsData.budgetUtilization ?? 0}% utilized`,
    },
    {
      label: 'Total Projects',
      value: statsData.totalProjects,
      icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-100',
      sub: `${statsData.activeProjects} active`,
    },
    {
      label: 'Tasks Complete',
      value: statsData.taskStats.completed,
      icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100',
      sub: `${statsData.taskStats['in-progress']} in progress`,
    },
    {
      label: 'Pending Tasks',
      value: statsData.taskStats.pending,
      icon: CloudRain, color: 'text-red-600', bg: 'bg-red-100',
      sub: 'awaiting scheduling',
    },
  ];

  const pieData = Object.entries(statsData.byType).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500">Welcome back! Here's your live project intelligence dashboard.</p>
        {error && (
          <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg inline-block">
            ⚠️ Could not connect to backend — {error}. Showing empty state.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Pie Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Estimated Cost Trend</h3>
            <span className="text-sm text-gray-400">Last 6 months</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.trendData.length ? statsData.trendData : [{ name: 'No data', cost: 0 }]}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dx={-10}
                  tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
                <Tooltip
                  formatter={v => [`$${v.toLocaleString()}`, 'Est. Cost']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Types Pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projects by Type</h3>
          {pieData.length > 0 ? (
            <>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {pieData.map((entry, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {entry.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm text-center gap-2">
              <HardHat className="w-10 h-10 text-gray-200" />
              <p>No projects yet.</p>
              <p className="text-xs">Create your first project to see analytics.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
