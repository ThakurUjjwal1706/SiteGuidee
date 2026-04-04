import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Calculator, CalendarClock, Bot, Settings, Bell, Search, Menu, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end={to === '/dashboard'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-gray-500 hover:bg-gray-100/50 hover:text-blue-600'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="h-full bg-white border-r border-[#E2E8F0] flex flex-col glass relative z-20"
      >
        <div className="h-20 flex items-center px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl">
               <Bot className="w-6 h-6 text-white" />
             </div>
             {sidebarOpen && <span className="font-bold text-xl tracking-tight text-gray-900">SiteGuide</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={FolderKanban} label="Projects" to="/dashboard/projects" />
          <SidebarItem icon={Calculator} label="Cost Estimator" to="/dashboard/cost-estimator" />
          <SidebarItem icon={CalendarClock} label="Scheduler" to="/dashboard/scheduler" />
          <SidebarItem icon={Bot} label="AI Copilot" to="/dashboard/ai-copilot" />
          <SidebarItem icon={Map} label="Site Map" to="/dashboard/map" />
        </div>

        <div className="p-4 border-t border-[#E2E8F0]">
           <SidebarItem icon={Settings} label="Settings" to="/dashboard/settings" />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#E2E8F0] flex items-center justify-between px-8 z-10">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
               <Menu className="w-5 h-5" />
             </button>
             <div className="relative w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search projects..." 
                 className="w-full bg-gray-100/50 border-none rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all placeholder:text-gray-400"
               />
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform">
               US
             </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
