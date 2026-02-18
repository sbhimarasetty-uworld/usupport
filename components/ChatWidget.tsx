
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { APP_THEME } from '../constants';

interface ChatWidgetProps {
  externalOpen?: boolean;
  setExternalOpen?: (open: boolean) => void;
  initialQuery?: string;
  clearInitialQuery?: () => void;
}

const InlineText: React.FC<{ text: string }> = ({ text }) => {
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const tokens = text.split(regex);

  return (
    <>
      {tokens.map((token, idx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-slate-900">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith('[') && token.includes('](')) {
          const match = token.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a 
                key={idx} 
                href={match[2]} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-xs border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all m-0.5"
              >
                {match[1]}
                <i className="fa fa-arrow-up-right-from-square ml-1.5 scale-75"></i>
              </a>
            );
          }
        }
        return token;
      })}
    </>
  );
};

const FormattedMessage: React.FC<{ content: string; isUser: boolean; isTyping?: boolean }> = ({ content, isUser, isTyping }) => {
  if (isUser) return <span className="whitespace-pre-wrap leading-snug">{content}</span>;

  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${key}`} className="space-y-2 my-3 ml-1">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|')) {
        flushList(idx);
        blocks.push(
          <div key={idx} className="overflow-x-auto my-3 rounded-xl border border-slate-100 shadow-sm bg-white">
            <table className="min-w-full text-[13px] text-left">
              <tbody className="divide-y divide-slate-50">
                <tr className="flex">
                  {line.split('|').filter(c => c.trim()).map((cell, i) => (
                    <td key={i} className="px-3 py-2.5 font-medium text-slate-700 flex-1 whitespace-nowrap">{cell.trim()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
    } else if (trimmed.startsWith('###')) {
      flushList(idx);
      blocks.push(<h4 key={idx} className="text-xs font-bold text-slate-500 mt-5 mb-1.5 uppercase tracking-widest border-l-2 border-blue-600 pl-2.5"><InlineText text={trimmed.replace(/^###\s*/, '')} /></h4>);
    } else if (trimmed.startsWith('##')) {
      flushList(idx);
      blocks.push(<h3 key={idx} className="text-lg font-bold text-slate-900 mt-5 mb-2 leading-tight tracking-tight">{<InlineText text={trimmed.replace(/^##\s*/, '')} />}</h3>);
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || (trimmed.match(/^\d+\.\s/) && !isUser)) {
      const text = trimmed.replace(/^([\*\-]\s*|\d+\.\s*)/, '');
      currentList.push(
        <li key={idx} className="flex items-start">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2.5 mt-2 shrink-0"></div>
          <span className="leading-relaxed text-slate-700 font-medium"><InlineText text={text} /></span>
        </li>
      );
    } else if (trimmed === '') {
      flushList(idx);
    } else {
      flushList(idx);
      blocks.push(<p key={idx} className="leading-relaxed mb-3 text-slate-700 font-medium"><InlineText text={line} /></p>);
    }
  });

  flushList(lines.length);

  return (
    <div className={`text-[14px] md:text-[15px] ${isTyping ? 'animate-pulse' : ''}`}>
      {blocks}
    </div>
  );
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ externalOpen, setExternalOpen, initialQuery, clearInitialQuery }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (setExternalOpen) setExternalOpen(val);
    else setInternalOpen(val);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim() !== '') {
      handleSend(initialQuery);
      clearInitialQuery?.();
    }
  }, [isOpen, initialQuery]);

  const handleSend = async (customInput?: string) => {
    const messageText = customInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: messageText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(messageText, messages.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to UWorld assistant. Please try again or contact support directly.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      setMessages([]);
      setReactions({});
      setInput('');
      setIsLoading(false);
    }
  };

  const handleReaction = (msgIdx: number, emoji: string) => {
    setReactions(prev => ({ ...prev, [msgIdx]: emoji }));
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] font-sans antialiased">
      {isOpen ? (
        <div className="bg-white w-[92vw] sm:w-[420px] h-[640px] max-h-[85vh] rounded-3xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300">
          
          {/* Professional Header */}
          <div className="px-6 py-5 flex items-center justify-between text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${APP_THEME.primary} 0%, #003366 100%)` }}>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-center space-x-4 z-10">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform">
                <i className="fa fa-user-md text-blue-900 text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-tight tracking-tight">Support Specialist</h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Available Now</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 z-10">
              {messages.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <i className="fa fa-trash-can text-xs opacity-80"></i>
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close chat"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <i className="fa fa-times text-sm"></i>
              </button>
            </div>
          </div>

          {/* Message List */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 md:p-6 space-y-6 bg-slate-50/40 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col h-full animate-in fade-in duration-700">
                <div className="mb-8 mt-2">
                  <h4 className="text-2xl font-bold text-slate-900 leading-tight mb-2">Welcome to <span className="text-blue-700">UWorld Help</span></h4>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Our specialists are here to guide you through your academic journey. How can we help?</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { icon: 'book-open', label: 'Browse Medical Products', query: 'Show me all Medical exam products.' },
                    { icon: 'graduation-cap', label: 'Nursing Exam Info', query: 'Tell me about Nursing/NCLEX exam prep.' },
                    { icon: 'user-gear', label: 'Account Activation', query: 'How do I activate my new subscription?' },
                    { icon: 'shield-halved', label: 'Terms & Security', query: 'What is your refund policy?' }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(item.query)} 
                      className="group flex items-center w-full p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-9 h-9 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <i className={`fa fa-${item.icon} text-sm`}></i>
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 group-hover:text-blue-800">{item.label}</span>
                    </button>
                  ))}
                </div>
                
                <p className="mt-auto pt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Global leader in high-stakes prep</p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} group`}>
                  <div className={`max-w-[88%] px-4 py-3.5 rounded-2xl relative shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none ring-1 ring-slate-900/[0.02]'
                  }`}>
                    <FormattedMessage content={m.content} isUser={m.role === 'user'} />
                    
                    {m.role === 'assistant' && !isLoading && (
                      <div className="absolute -bottom-8 left-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleReaction(idx, '👍')} className={`w-6 h-6 rounded-md flex items-center justify-center bg-white border border-slate-100 shadow-sm text-[10px] hover:text-blue-600 transition-colors ${reactions[idx] === '👍' ? 'text-blue-600' : 'text-slate-300'}`}>
                          <i className="fa fa-thumbs-up"></i>
                        </button>
                        <button onClick={() => handleReaction(idx, '👎')} className={`w-6 h-6 rounded-md flex items-center justify-center bg-white border border-slate-100 shadow-sm text-[10px] hover:text-red-500 transition-colors ${reactions[idx] === '👎' ? 'text-red-500' : 'text-slate-300'}`}>
                          <i className="fa fa-thumbs-down"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase mt-1.5 tracking-wider px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-center space-x-2 px-1">
                <div className="flex space-x-1 bg-white border border-slate-100 px-3 py-2.5 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Professional Input Area */}
          <div className="p-4 md:p-5 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="How can we assist you?"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-[14px] md:text-[15px] transition-all font-medium placeholder:text-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isLoading} 
                className="absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 text-white shadow-md active:scale-95 bg-blue-600 hover:bg-blue-700"
              >
                <i className={`fa ${isLoading ? 'fa-spinner animate-spin' : 'fa-arrow-up'} text-sm`}></i>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-bold uppercase tracking-wider">
              UWorld Confidential Support Assistant
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.75rem] flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-blue-600 group relative"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-black animate-pulse shadow-md">1</div>
          <i className="fa fa-comment-medical text-white text-2xl md:text-3xl"></i>
          <span className="absolute -bottom-8 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Help Center</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
