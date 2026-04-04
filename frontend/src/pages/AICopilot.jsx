import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { aiApi, projectsApi } from '../api';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am **SiteGuide AI** — your expert construction engineering assistant.\n\nI can help you with:\n- 💰 Cost estimation & budget optimization\n- 📅 Construction timeline planning\n- ⚠️ Risk assessment & mitigation\n- 🏗️ Material selection & alternatives\n\nSelect a project from the dropdown to get context-aware answers, or ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    projectsApi.getAll().then(setProjects).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    const history = messages.slice(1); // skip initial greeting
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = selectedProject
        ? {
          name: selectedProject.name,
          location: selectedProject.location,
          area: selectedProject.area,
          buildingType: selectedProject.buildingType,
          budget: selectedProject.budget,
          estimatedCost: selectedProject.estimatedCost,
          tasks: selectedProject.tasks?.map(t => ({ name: t.name, duration: t.duration, status: t.status })),
        }
        : null;

      const res = await aiApi.chat(input, context, history);
      setMessages(prev => [...prev, { role: 'assistant', text: res.text }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ Error: ${err.message}. Please check that the backend is running on port 5000.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  const QUICK_PROMPTS = [
    'What are the main risks for a commercial project?',
    'How can I reduce material costs by 15%?',
    'Explain Critical Path Method in construction',
    'What permits do I need for a residential build?',
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bot className="text-blue-600" /> AI Copilot
            <span className="text-sm font-bold tracking-wider text-purple-500 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Gemini
            </span>
          </h1>
          <p className="text-gray-500">Your intelligent construction engineering assistant.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Project Context Selector */}
          <select
            className="bg-gray-100 border-none rounded-xl px-4 py-2 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selectedProject?._id || ''}
            onChange={e => setSelectedProject(projects.find(p => p._id === e.target.value) || null)}
          >
            <option value="">🔍 No project context</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.buildingType})</option>
            ))}
          </select>
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-sm text-blue-600 flex items-center gap-2"
        >
          <Bot className="w-4 h-4" />
          <span>
            Context set to <strong>{selectedProject.name}</strong> — {selectedProject.buildingType},
            {' '}{selectedProject.area.toLocaleString()} sq ft,
            budget ${selectedProject.budget.toLocaleString()}
          </span>
        </motion.div>
      )}

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[82%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="group relative">
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(msg.text, i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition"
                    >
                      {copied === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 rounded-tl-none border border-gray-100 flex gap-1.5 items-center">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <span key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setInput(prompt); }}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
            <textarea
              rows={1}
              className="flex-1 bg-transparent border-none px-4 py-2 outline-none resize-none text-sm placeholder:text-gray-400"
              placeholder="Ask about material costs, delays, code compliance..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              id="ai-send-btn"
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-blue-700 active:scale-95 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">Powered by Gemini 1.5 Flash · Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
