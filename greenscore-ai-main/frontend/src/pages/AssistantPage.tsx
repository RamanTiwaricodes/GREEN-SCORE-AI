import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  HelpCircle,
  TrendingUp,
  Coins,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
}

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am the GREENScore AI Municipal Intelligence Assistant for Lucknow Municipal Corporation.\n\nI can analyze zone vulnerability, prioritize urban risks via MCDA, compute multi-objective budget allocations, and simulate what-if scenarios based on active physical telemetry. What municipal question can I solve for you today?',
      source: 'GreenScore AI Knowledge Graph',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'Which zone needs attention today?',
    'What should we do with ₹10 lakh budget?',
    'Why is Chowk score decreasing?',
    'What happens if waste collection increases by 20%?',
    'Which intervention gives the highest impact per rupee?'
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAssistant(q);
      const botMsg: Message = {
        sender: 'assistant',
        text: res.reply,
        source: res.source_attribution,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I apologize, an error occurred while accessing the municipal database. Please verify backend connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">AI Municipal Decision Assistant</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ZERO HALLUCINATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Conversational municipal decision support grounded exclusively in real-time sensor streams and optimization models.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 h-[640px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald'
                }`}
              >
                {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#131B2E] border border-[#1F293D] text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-700/40 text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.source && <span className="font-mono text-emerald-400">{m.source}</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Querying urban knowledge graph & solving decision equations...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Sample Questions:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g. 'Why is Hazratganj score decreasing?')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-glow-emerald"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
