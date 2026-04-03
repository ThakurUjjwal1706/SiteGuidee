import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, MapPin, Ruler, Building2, Wallet } from 'lucide-react';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', location: '', area: '', budget: '', buildingType: 'Residential'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', formData);
      setIsModalOpen(false);
      fetchProjects();
      setFormData({ name: '', location: '', area: '', budget: '', buildingType: 'Residential' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage all your construction sites.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <motion.div 
             key={proj._id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
          >
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{proj.name}</h3>
               <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{proj.buildingType}</span>
             </div>
             
             <div className="space-y-3 mb-6">
               <div className="flex items-center gap-3 text-gray-500 text-sm">
                 <MapPin className="w-4 h-4 text-blue-500" /> {proj.location}
               </div>
               <div className="flex items-center gap-3 text-gray-500 text-sm">
                 <Ruler className="w-4 h-4 text-blue-500" /> {proj.area} sq ft
               </div>
               <div className="flex items-center gap-3 text-gray-500 text-sm">
                 <Wallet className="w-4 h-4 text-blue-500" /> Budget: ${proj.budget.toLocaleString()}
               </div>
             </div>

             <div className="pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
               <span className="text-sm font-medium text-gray-500">Est. Cost: <span className="text-gray-900">${proj.estimatedCost?.total?.toLocaleString()}</span></span>
               <button className="text-blue-600 font-semibold text-sm hover:underline">View Details</button>
             </div>
          </motion.div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                  <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Building Type</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.buildingType} onChange={e => setFormData({...formData, buildingType: e.target.value})}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700">Create Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
