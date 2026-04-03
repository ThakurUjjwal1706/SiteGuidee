import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am SiteGuide AI. I can help you with cost estimations, material alternative suggestions, and delay predictions. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { prompt: userMsg.text });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am facing an issue right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <Bot className="text-blue-600" /> AI Copilot
             <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-sm ml-2 font-bold uppercase tracking-wider flex items-center gap-1">
               <Sparkles className="w-4 h-4 text-purple-500" /> Beta
             </span>
          </h1>
          <p className="text-gray-500">Your intelligent construction engineering assistant.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {messages.map((msg, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`}>
                   {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6 text-blue-600" />}
                 </div>
                 <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'} shadow-sm`}>
                   <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                 </div>
               </div>
             </motion.div>
           ))}
           {loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                   <Bot className="w-6 h-6 text-blue-600" />
                 </div>
                 <div className="p-4 rounded-2xl bg-gray-50 rounded-tl-none border border-gray-100 flex gap-2 items-center">
                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                 </div>
               </div>
             </motion.div>
           )}
         </div>

         {/* Input Area */}
         <div className="p-4 border-t border-gray-100 bg-gray-50">
           <div className="flex gap-3 bg-white p-2 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
             <input 
               type="text" 
               className="flex-1 bg-transparent border-none px-4 outline-none"
               placeholder="Ask about material costs, potential delays, or regulatory compliance..."
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyPress={e => e.key === 'Enter' && sendMessage()}
             />
             <button 
               onClick={sendMessage}
               disabled={loading || !input.trim()}
               className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:bg-blue-700 transition"
             >
               <Send className="w-5 h-5" />
             </button>
           </div>
         </div>
      </div>
    </div>
  );
}
