import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  CornerDownLeft, 
  Loader2,
  HelpCircle,
  TrendingUp,
  Coins,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am the GREENScore AI Municipal Intelligence Assistant for Lucknow Municipal Corporation. I can provide grounded insights on zone risk profiles, budget portfolio optimization, 30-day forecasting, and what-if intervention modeling. How can I assist municipal planning today?',
      source: 'GreenScore AI Knowledge Graph (Grounded)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

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
          text: 'I apologize, I encountered a temporary connection issue while querying municipal telemetry. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1322] border border-[#1F293D] rounded-2xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F293D] bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-glow-emerald">
              <Bot className="h-5 w-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">AI Municipal Decision Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Grounded In Active Data
                </span>
              </div>
              <p className="text-xs text-slate-400">Zero Hallucination • Real-time telemetry & optimization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#131B2E] border border-[#1F293D] text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/40 text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.source && <span className="font-mono">{m.source}</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing municipal knowledge graph & optimizing telemetry...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Presets:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1F293D] bg-slate-900 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g. 'What should we do with ₹10 lakh budget?')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-glow-emerald"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
