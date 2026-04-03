import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Calculator, CalendarClock, ChartPie, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: Calculator, title: 'Smart Estimations', desc: 'AI-driven cost analysis and automated material calculation' },
    { icon: CalendarClock, title: 'Dynamic Scheduling', desc: 'Auto-adjusting timelines based on real-world constraints' },
    { icon: Bot, title: 'AI Copilot', desc: 'Your 24/7 engineering assistant for critical project queries' },
    { icon: ChartPie, title: 'Real-time Analytics', desc: 'Live dashboards for tracking budget and progress instantly' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">SiteGuide</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
          <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-8 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-70"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
            <Zap className="w-4 h-4" /> Introducing AI for Construction
          </span>
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AI Construction</span> Copilot
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual calculations, prevent timeline delays, and bring disconnected workflows into one powerful, intelligent dashboard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 hover:scale-105">
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all hover:scale-105">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to manage sites</h2>
            <p className="text-gray-500 text-lg">Powerful tools designed specifically for modern construction teams.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
               >
                 <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                   <feat.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                 <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 text-center text-gray-500">
        <p>&copy; 2026 SiteGuide. All rights reserved.</p>
      </footer>
    </div>
  );
}
