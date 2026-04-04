import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Ruler, Building2, Wallet, Trash2, Loader2, Bot, X, Check, Copy, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { projectsApi, aiApi } from '../api';

const TYPE_COLORS = {
  Residential: 'bg-green-100 text-green-700',
  Commercial: 'bg-blue-100 text-blue-700',
  Industrial: 'bg-orange-100 text-orange-700',
  Mixed: 'bg-purple-100 text-purple-700',
};

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '', location: '', area: '', budget: '', buildingType: 'Residential', floors: 1,
  });

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectsApi.create({
        ...formData,
        area: Number(formData.area),
        budget: Number(formData.budget),
        floors: Number(formData.floors),
      });
      setIsModalOpen(false);
      setFormData({ name: '', location: '', area: '', budget: '', buildingType: 'Residential', floors: 1 });
      fetchProjects();
    } catch (err) {
      alert('Error creating project: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleAIAnalysis = async (project) => {
    setIsAnalyzing(project._id);
    try {
      const result = await aiApi.analyzeProject(project);
      setAnalysisResult({ projectName: project.name, analysis: result.analysis });
    } catch (err) {
      alert('AI analysis failed: ' + err.message);
    } finally {
      setIsAnalyzing(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage and analyze your construction sites.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Loader2 className="animate-spin w-8 h-8 mr-3" /> Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Building2 className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No projects yet</h3>
          <p className="text-sm">Create your first project to activate AI Site Monitoring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <motion.div
              key={proj._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1">{proj.name}</h3>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${TYPE_COLORS[proj.buildingType] || 'bg-gray-100 text-gray-600'}`}>
                    {proj.buildingType}
                  </span>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" /> {proj.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                    <Ruler className="w-4 h-4 text-blue-400 shrink-0" /> {proj.area.toLocaleString()} sq ft · {proj.floors || 1} floor{proj.floors > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                    <Wallet className="w-4 h-4 text-blue-400 shrink-0" /> Budget: <span className="font-semibold text-gray-900">${proj.budget.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cost Summary Overlay */}
                <div className="bg-linear-to-tr from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 relative overflow-hidden mb-3">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Bot className="w-12 h-12" />
                  </div>
                  <p className="text-xs text-blue-500 font-bold mb-1 uppercase tracking-wider">AI Analysis Result</p>
                  <p className="text-2xl font-black text-blue-700">${proj.estimatedCost?.total?.toLocaleString()}</p>
                  
                  <div className="flex gap-4 mt-2 pt-2 border-t border-blue-100/50">
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Materials</p>
                      <p className="text-xs font-bold text-blue-600">${proj.estimatedCost?.materials?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Labor</p>
                      <p className="text-xs font-bold text-blue-600">${proj.estimatedCost?.labor?.toLocaleString()}</p>
                    </div>
                    {proj.estimatedDurationDays > 0 && (
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Timeline</p>
                        <p className="text-xs font-bold text-blue-600">{proj.estimatedDurationDays}d</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50 px-6 py-3.5 flex justify-between items-center bg-[#FAFBFE] group-hover:bg-[#F4F7FF] transition-colors">
                <button
                  onClick={() => handleAIAnalysis(proj)}
                  disabled={isAnalyzing === proj._id}
                  className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition disabled:opacity-50"
                >
                  {isAnalyzing === proj._id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Bot className="w-4 h-4" />}
                  {isAnalyzing === proj._id ? 'Analyzing...' : 'Generate AI Report'}
                </button>
                <button
                  onClick={() => handleDelete(proj._id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition rounded-xl hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-3xl font-black text-gray-900 mb-2">New Project</h2>
              <p className="text-gray-500 mb-8">Initialize your site parameters.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Project Name</label>
                  <input required type="text" placeholder="e.g. Skyline Heights" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/10 outline-none transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                  <input required type="text" placeholder="Ghazibad, UP" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/10 outline-none transition" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Area</label>
                    <input required type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Budget</label>
                    <input required type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Floors</label>
                    <input required type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Building Type</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 outline-none" value={formData.buildingType} onChange={e => setFormData({...formData, buildingType: e.target.value})}>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                    <option>Mixed</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-4 mt-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/20 active:scale-95 disabled:opacity-50">
                   {submitting ? 'Initializing...' : 'Launch Project'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {analysisResult && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 lg:p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
            >
              {/* Decorative Header */}
              <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-gray-50 relative z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Bot className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Report</h2>
                    <p className="text-sm font-bold text-purple-600 uppercase tracking-tighter">Project: {analysisResult.projectName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysisResult(null)} 
                  className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Analysis Content */}
              <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar bg-[#FBFCFF]">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <ReactMarkdown 
                    className="analysis-reports-content"
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-black text-gray-900 mb-8 mt-4 border-l-8 border-purple-600 pl-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-black text-gray-800 mt-12 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4 bg-gray-50 px-4 py-2 rounded-xl inline-block" {...props} />,
                      p: ({node, ...props}) => <p className="leading-relaxed text-gray-600 mb-4 text-[15px]" {...props} />,
                      ul: ({node, ...props}) => <ul className="space-y-3 mb-8 ml-2" {...props} />,
                      li: ({node, ...props}) => <li className="flex gap-3 text-gray-600"><span className="text-purple-500 font-black mt-1">•</span><span className="flex-1">{props.children}</span></li>,
                      table: ({node, ...props}) => (
                        <div className="my-8 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                          <table className="w-full text-left border-collapse" {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead className="bg-[#1C1C1E] text-white" {...props} />,
                      th: ({node, ...props}) => <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase" {...props} />,
                      td: ({node, ...props}) => <td className="px-6 py-4 border-b border-gray-100 text-gray-600 font-medium text-sm" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <div className="my-8 bg-blue-50/50 border-l-8 border-blue-500 p-6 rounded-r-3xl italic text-blue-800 text-lg shadow-sm" {...props} />
                      ),
                      strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900" {...props} />,
                      hr: () => <hr className="my-10 border-gray-100" />
                    }}
                  >
                    {analysisResult.analysis}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white border-t border-gray-50 flex justify-between items-center shrink-0">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">SiteGuide AI Analysis Engine v2.0</p>
                <div className="flex gap-3">
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(analysisResult.analysis);
                       alert('Analysis copied to clipboard!');
                     }}
                     className="px-6 py-3 bg-gray-100 text-gray-600 text-sm font-black rounded-2xl hover:bg-gray-200 transition"
                   >
                     Copy Data
                   </button>
                   <button 
                     onClick={() => setAnalysisResult(null)}
                     className="px-8 py-3 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
                   >
                     Archive Report
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
