import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const SUGGESTIONS = [
  "Best material for low budget?",
  "Strongest steel option?",
  "How to reduce cost by 10%?"
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your SiteGuide AI. Ask me about materials, cost reduction, or best practices for your project." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Connect to the backend AI route we saw earlier
      const res = await axios.post('/api/ai/chat', { prompt: text, history: messages.map(m => ({ role: m.role, text: m.text })) });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ Sorry, I'm having trouble connecting to the AI. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px] overflow-hidden relative"
    >
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-bold text-white tracking-wide">Material AI Assistant</p>
        </div>
        <Sparkles className="w-4 h-4 text-blue-200" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-xs text-gray-500 font-medium">AI is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>

      {messages.length === 1 && !loading && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#F8FAFC]">
          {SUGGESTIONS.map(sug => (
            <button 
              key={sug}
              onClick={() => sendMessage(sug)}
              className="bg-white border border-gray-200 text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 bg-white border-t border-gray-100">
        <form 
          className="relative flex items-center"
          onSubmit={e => { e.preventDefault(); sendMessage(input); }}
        >
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about materials or costs..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-1.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
