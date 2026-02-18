
import React, { useState, useEffect } from 'react';
import { CategoryType, SupportTicket, TicketStatus } from '../types';
import { APP_THEME } from '../constants';
import { analyzeTicketPriority } from '../services/geminiService';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticket: SupportTicket) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: CategoryType.GENERAL,
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasAnalyzed(false);
    }
  }, [isOpen]);

  const runPriorityAnalysis = async () => {
    if (formData.subject.length < 5 || formData.description.length < 10 || isAnalyzing || hasAnalyzed) return;

    setIsAnalyzing(true);
    const analyzedPriority = await analyzeTicketPriority(formData.subject, formData.description);
    setFormData(prev => ({ ...prev, priority: analyzedPriority }));
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const newTicket: SupportTicket = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: TicketStatus.NEW,
      createdAt: Date.now()
    };

    setTimeout(() => {
      onTicketCreated(newTicket);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({
          name: '',
          email: '',
          category: CategoryType.GENERAL,
          subject: '',
          description: '',
          priority: 'medium'
        });
      }, 4000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-blue-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/20">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
        >
          <i className="fa fa-times text-xl"></i>
        </button>

        {status === 'success' ? (
          <div className="p-16 text-center animate-in zoom-in slide-in-from-top-4 duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-200">
              <i className="fa fa-check-circle text-5xl"></i>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Request Received!</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                 <p className="text-blue-900 font-bold flex items-center justify-center">
                   <i className="fa fa-envelope-open-text mr-3"></i>
                   Email confirmation sent to {formData.email}
                 </p>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed px-4">
                Our administrative team has been notified of your request. Priority level: <span className="font-bold uppercase">{formData.priority}</span>.
              </p>
            </div>
            <div className="mt-8 flex justify-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse [animation-delay:0.2s]"></div>
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10">
            <div className="mb-6">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Support Request</h3>
              <p className="text-gray-500 mt-2 font-medium">Get rapid assistance from our expert team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Name</label>
                <input 
                  required
                  disabled={status === 'submitting'}
                  type="text" 
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Email</label>
                <input 
                  required
                  disabled={status === 'submitting'}
                  type="email" 
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Category</label>
                <select 
                  disabled={status === 'submitting'}
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none bg-white transition-all font-semibold appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as CategoryType})}
                >
                  {Object.values(CategoryType).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Priority</label>
                  {isAnalyzing && <span className="text-[10px] text-blue-500 font-bold animate-pulse">AI Analyzing...</span>}
                  {hasAnalyzed && !isAnalyzing && <span className="text-[10px] text-green-500 font-bold"><i className="fa fa-robot mr-1"></i> Smart Detected</span>}
                </div>
                <select 
                  disabled={status === 'submitting'}
                  className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black uppercase text-sm cursor-pointer ${
                    formData.priority === 'high' ? 'bg-red-50 border-red-100 text-red-600' : 
                    formData.priority === 'medium' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                    'bg-gray-50 border-gray-100 text-gray-600'
                  }`}
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mb-4 space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Subject</label>
              <input 
                required
                disabled={status === 'submitting'}
                type="text" 
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="mb-6 space-y-1.5">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Description</label>
              <textarea 
                required
                disabled={status === 'submitting'}
                rows={4}
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none resize-none transition-all font-medium"
                placeholder="Tell us what happened..."
                value={formData.description}
                onBlur={runPriorityAnalysis}
                onChange={e => {
                  setFormData({...formData, description: e.target.value});
                  if (hasAnalyzed) setHasAnalyzed(false); // Reset analysis if they keep typing
                }}
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-2xl font-black text-white shadow-xl hover:brightness-110 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 flex items-center justify-center space-x-3 text-lg"
              style={{ backgroundColor: APP_THEME.primary }}
            >
              {status === 'submitting' ? (
                <>
                  <i className="fa fa-spinner animate-spin"></i>
                  <span>Dispatching Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Ticket</span>
                  <i className="fa fa-arrow-right text-sm opacity-60"></i>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-4 font-bold uppercase tracking-tighter">
              AI Sentiment analysis helps us respond to urgent issues faster.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketModal;
