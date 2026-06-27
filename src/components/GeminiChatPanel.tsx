import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, MessageSquare, Terminal, ChevronRight, HelpCircle, AlertCircle } from 'lucide-react';
import { InvestigationCase, AuditEvent, PolicyRule } from '../types';

interface GeminiChatPanelProps {
  currentCase: InvestigationCase;
  events: AuditEvent[];
  policies: PolicyRule[];
  analysis?: any;
  demoChatMessage?: string | null;
  onClearDemoChatMessage?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function GeminiChatPanel({ 
  currentCase, 
  events, 
  policies, 
  analysis,
  demoChatMessage,
  onClearDemoChatMessage
}: GeminiChatPanelProps) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggestions list
  const suggestions = [
    "Why is this high priority?",
    "What evidence supports this?",
    "Could this be a false positive?",
    "What should we verify first?",
    "Summarize for executives.",
    "Explain in Japanese.",
    "What happens if we ignore this?"
  ];

  // Get current case messages
  const currentMessages = messages[currentCase.id] || [];

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  // Initial welcome message when switching cases
  useEffect(() => {
    if (!messages[currentCase.id]) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `### NexusGuard Co-Pilot Investigation Ready
Hello! I am your AI Co-Pilot assigned to investigation **Case ${currentCase.id}**. 

I have synchronized with:
- **Active Incident Context**: "${currentCase.title}"
- **Employee Subject**: ${currentCase.subject?.name} (Risk Tier: ${currentCase.subject?.riskTier})
- **Normalized Logs**: ${events.length} aggregated security audit events
- **Company Policies**: ${policies.length} corporate compliance rules
${analysis ? "- **Gemini Forensic Synthesis Report**: Successfully completed & loaded." : "- **Gemini Forensic Synthesis**: Offline (Click *Analyze with Gemini* to generate initial synthesis report)."}

Use the quick action prompts below or type custom investigative queries. How can I assist you with this analysis?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [currentCase.id]: [welcomeMessage]
      }));
    }
  }, [currentCase.id, analysis]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setError('');
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message
    const updatedMessages = [...currentMessages, userMsg];
    setMessages(prev => ({
      ...prev,
      [currentCase.id]: updatedMessages
    }));
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCase,
          events,
          policies,
          analysis,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.details || 'Chat processing failed');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [currentCase.id]: [...updatedMessages, assistantMsg]
      }));
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || 'An error occurred while connecting to the model.');
    } finally {
      setIsLoading(false);
    }
  };

  // Programmatic demo trigger handler
  useEffect(() => {
    if (demoChatMessage) {
      handleSendMessage(demoChatMessage);
      if (onClearDemoChatMessage) {
        onClearDemoChatMessage();
      }
    }
  }, [demoChatMessage]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Custom high-fidelity lightweight markdown rendering
  const renderMarkdown = (text: string) => {
    const parseInline = (inlineText: string) => {
      const parts = [];
      let current = inlineText;
      let keyIdx = 0;
      
      while (current.includes('**') || current.includes('`')) {
        const boldIdx = current.indexOf('**');
        const codeIdx = current.indexOf('`');
        
        if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
          if (boldIdx > 0) parts.push(current.substring(0, boldIdx));
          const endBold = current.indexOf('**', boldIdx + 2);
          if (endBold !== -1) {
            parts.push(<strong key={keyIdx++} className="text-slate-800 font-bold font-sans">{current.substring(boldIdx + 2, endBold)}</strong>);
            current = current.substring(endBold + 2);
          } else {
            parts.push(current.substring(boldIdx));
            current = '';
          }
        } else if (codeIdx !== -1) {
          if (codeIdx > 0) parts.push(current.substring(0, codeIdx));
          const endCode = current.indexOf('`', codeIdx + 1);
          if (endCode !== -1) {
            parts.push(<code key={keyIdx++} className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[10.5px]">{current.substring(codeIdx + 1, endCode)}</code>);
            current = current.substring(endCode + 1);
          } else {
            parts.push(current.substring(codeIdx));
            current = '';
          }
        } else {
          break;
        }
      }
      if (current) parts.push(current);
      return parts.length > 0 ? parts : inlineText;
    };

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-blue-700 mt-4 mb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">{line.slice(4)}</h4>;
      }
      if (line.startsWith('## ') || line.startsWith('# ')) {
        const title = line.startsWith('## ') ? line.slice(3) : line.slice(2);
        return <h3 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 font-display flex items-center gap-2 border-b border-slate-100 pb-1">{title}</h3>;
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="list-disc list-inside ml-3 text-slate-600 text-xs my-1 leading-relaxed pl-1 font-medium">
            {parseInline(content)}
          </li>
        );
      }
      const olMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (olMatch) {
        return (
          <li key={idx} className="list-decimal list-inside ml-3 text-slate-600 text-xs my-1 leading-relaxed pl-1 font-medium">
            {parseInline(olMatch[2])}
          </li>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-xs text-slate-600 leading-relaxed my-1.5 font-medium">{parseInline(line)}</p>;
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col h-[650px] shadow-sm overflow-hidden" id="nexus-gemini-chat">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-mono text-blue-600 uppercase tracking-widest font-bold flex items-center gap-1">
              Gemini 3.5 Flash Active
            </h3>
            <h2 className="text-sm font-bold text-slate-800 font-display mt-0.5">Investigation Co-Pilot Chat</h2>
          </div>
        </div>
        <div className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded font-mono font-bold uppercase">
          Case: {currentCase.id}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {currentMessages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex flex-col max-w-[85%] rounded-lg p-3 text-left ${
              msg.role === 'user' 
                ? 'bg-blue-50 border border-blue-200 text-slate-800 self-end ml-auto shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-700 self-start mr-auto shadow-sm'
            }`}
          >
            {/* Role Header */}
            <div className="flex items-center justify-between gap-4 font-mono text-[9px] text-slate-400 pb-1.5 border-b border-slate-100 mb-1.5 font-bold">
              <span className={msg.role === 'user' ? 'text-blue-600 font-bold' : 'text-slate-500 font-bold'}>
                {msg.role === 'user' ? 'ANALYST FINDINGS' : 'GEMINI SECURITY CORE'}
              </span>
              <span>{msg.timestamp}</span>
            </div>
            
            {/* Message Text Content with custom Markdown */}
            <div className="space-y-1">
              {renderMarkdown(msg.content)}
            </div>
          </div>
        ))}
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 max-w-[70%] mr-auto text-left shadow-sm">
            <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-200 shrink-0">
              <Terminal className="w-3 h-3 text-blue-600 animate-spin" />
            </div>
            <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider font-bold animate-pulse">
              Gemini is digesting logs, evaluating risk metrics, drafting response...
            </span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left flex items-start gap-2 max-w-[90%] mr-auto">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-red-700">Co-Pilot Pipeline Timeout</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom suggestions & input */}
      <div className="bg-slate-50 border-t border-slate-200 p-3.5 space-y-3 shrink-0">
        
        {/* Quick Suggestions scrollable panel */}
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-mono font-semibold uppercase text-slate-400 tracking-wider">Suggested Queries</span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                disabled={isLoading}
                className="bg-white border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 transition-all text-[10.5px] px-2.5 py-1 rounded-md font-mono cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none select-none font-bold shadow-sm"
              >
                <span>{s}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Query incident timeline, specific users, or company policy compliance..."
            className="flex-1 bg-white border border-slate-200 rounded p-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 disabled:opacity-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-4 rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:pointer-events-none shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Co-Pilot</span>
          </button>
        </form>

      </div>

    </div>
  );
}
