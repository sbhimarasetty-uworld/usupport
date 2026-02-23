
import React, { useState, useEffect } from 'react';
import { SupportTicket, TicketStatus } from '../types';

interface AdminDashboardProps {
  tickets: SupportTicket[];
  onReply: (ticketId: string, reply: string) => void;
  onClose: () => void;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tickets, onReply, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'emails' | 'guide'>('tickets');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    const logs: EmailLog[] = [];
    tickets.forEach(t => {
      logs.push({
        id: `admin-notif-${t.id}`,
        to: 'support-admin@uworld.com',
        subject: `[SYSTEM ALERT] New Ticket from ${t.name}`,
        body: `Urgency: ${t.priority.toUpperCase()}\nSubject: ${t.subject}\n\n${t.description}`,
        sentAt: t.createdAt
      });
      logs.push({
        id: `user-conf-${t.id}`,
        to: t.email,
        subject: `UWorld Support Case #${t.id} - Received`,
        body: `Dear ${t.name},\n\nWe have received your request regarding "${t.subject}". Our support team is reviewing your inquiry.\n\nPriority: ${t.priority.toUpperCase()}`,
        sentAt: t.createdAt
      });
      if (t.status === TicketStatus.RESPONDED && t.adminReply) {
        logs.push({
          id: `reply-sent-${t.id}`,
          to: t.email,
          subject: `RE: ${t.subject} (Case #${t.id})`,
          body: t.adminReply,
          sentAt: t.repliedAt || Date.now()
        });
      }
    });
    setEmailLogs(logs.sort((a, b) => b.sentAt - a.sentAt));
  }, [tickets]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.user === 'admin' && credentials.pass === 'uworld2025') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use: admin / uworld2025');
    }
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      onReply(selectedTicket.id, replyText);
      setIsSending(false);
      setReplyText('');
      setSelectedTicket(null);
      alert(`Success: Response captured and virtual email dispatched to ${selectedTicket.email}. Check Email History tab.`);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[2000] bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">U</div>
            <h2 className="text-2xl font-black text-gray-900">UWorld Admin Portal</h2>
            <p className="text-gray-500 mt-2 font-medium italic">Login required for ticket management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username (admin)" 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={credentials.user}
              onChange={e => setCredentials({...credentials, user: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Password (uworld2025)" 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={credentials.pass}
              onChange={e => setCredentials({...credentials, pass: e.target.value})}
            />
            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-2">
              Sign In to Dashboard
            </button>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
               <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest mb-1">Admin Access Credentials</p>
               <p className="text-sm text-blue-900">User: <span className="font-bold">admin</span> | Pass: <span className="font-bold">uworld2025</span></p>
            </div>
            <button type="button" onClick={onClose} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 mt-2">Close Portal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xs">UWORLD STAFF</span>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Support Console</h1>
          </div>
          <nav className="flex space-x-1">
            <button onClick={() => setActiveTab('tickets')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Tickets</button>
            <button onClick={() => setActiveTab('emails')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition ${activeTab === 'emails' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Email Logs</button>
            <button onClick={() => setActiveTab('guide')} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition ${activeTab === 'guide' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Backend Setup</button>
          </nav>
        </div>
        <button onClick={onClose} className="text-gray-400 font-bold hover:text-red-500 transition text-sm">Sign Out</button>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {activeTab === 'tickets' ? (
          <>
            <aside className="w-[380px] border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-6 border-b border-gray-50 font-black text-[10px] text-gray-400 uppercase tracking-widest flex justify-between">
                Incoming Inquiries
                <span className="bg-gray-100 text-gray-600 px-2 rounded">{tickets.length}</span>
              </div>
              {tickets.length === 0 ? (
                <div className="p-12 text-center text-gray-300 italic">No tickets in queue.</div>
              ) : (
                tickets.sort((a,b) => b.createdAt - a.createdAt).map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-6 border-b border-gray-50 transition-all ${selectedTicket?.id === t.id ? 'bg-blue-50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${t.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{t.priority}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(t.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 truncate text-sm">{t.subject}</h4>
                    <p className="text-xs text-gray-500 mt-1">{t.name}</p>
                  </button>
                ))
              )}
            </aside>
            <main className="flex-grow bg-slate-50 p-10 overflow-y-auto">
              {selectedTicket ? (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-gray-900">{selectedTicket.subject}</h2>
                      <p className="text-sm text-gray-500 font-medium mt-1">From: <span className="font-bold text-gray-700">{selectedTicket.name}</span> ({selectedTicket.email})</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl text-gray-700 leading-relaxed font-medium">
                      {selectedTicket.description}
                    </div>
                  </div>
                  <div className="p-8">
                    {selectedTicket.status === TicketStatus.RESPONDED ? (
                      <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                        <p className="text-xs font-black text-green-700 uppercase tracking-widest mb-3">Resolution Sent</p>
                        <p className="text-sm text-gray-600 italic">"{selectedTicket.adminReply}"</p>
                      </div>
                    ) : (
                      <>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Draft Response</label>
                        <textarea 
                          className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium h-40"
                          placeholder="Type response to customer..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={handleSendReply}
                            disabled={isSending || !replyText.trim()}
                            className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                            {isSending ? 'Sending Virtual Email...' : 'Send Reply'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <i className="fa fa-inbox text-6xl mb-4 opacity-20"></i>
                  <p className="font-bold italic">Select a ticket to begin resolution</p>
                </div>
              )}
            </main>
          </>
        ) : activeTab === 'emails' ? (
          <main className="flex-grow bg-slate-50 p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Virtual Mail Transfer Agent (MTA)</h2>
              <p className="text-gray-500 mb-8 font-medium">This log simulates the background processing of emails that would normally go to your real inbox.</p>
              <div className="space-y-4">
                {emailLogs.map(log => (
                  <div key={log.id} className="bg-white p-6 rounded-2xl border border-gray-200 flex space-x-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${log.to.includes('admin') ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <i className={`fa ${log.to.includes('admin') ? 'fa-building-shield' : 'fa-envelope-open'}`}></i>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-black text-gray-900 uppercase">To: {log.to}</span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(log.sentAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs font-bold text-blue-600 mb-2">Subject: {log.subject}</p>
                      <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-600 font-medium whitespace-pre-wrap">{log.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-grow bg-slate-50 p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-4xl mx-auto mb-8">
                <i className="fa fa-server"></i>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Production Email Implementation</h2>
              <p className="text-gray-600 mb-10 text-lg">Since this is a frontend prototype, real emails are "virtualized". To make them real, you need a backend server.</p>
              
              <div className="bg-white p-8 rounded-3xl border border-gray-200 text-left mb-8">
                <h3 className="font-black text-lg text-gray-900 mb-4">3 Steps to Real Emails</h3>
                <ol className="space-y-6">
                  <li className="flex items-start">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4 shrink-0">1</span>
                    <div>
                      <p className="font-bold text-gray-900">Setup a Node.js API</p>
                      <p className="text-sm text-gray-500 mt-1">Create an Express server that listens for `POST` requests from this frontend.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4 shrink-0">2</span>
                    <div>
                      <p className="font-bold text-gray-900">Configure SMTP/Transactional Service</p>
                      <p className="text-sm text-gray-500 mt-1">Sign up for SendGrid, AWS SES, or Mailgun to get an API Key.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4 shrink-0">3</span>
                    <div>
                      <p className="font-bold text-gray-900">Update Frontend Code</p>
                      <p className="text-sm text-gray-500 mt-1">Replace `setTimeout` with a real `fetch()` call to your server.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">End of Simulation Module</p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
