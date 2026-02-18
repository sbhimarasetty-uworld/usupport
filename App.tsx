
import React, { useState } from 'react';
import Header from './components/Header';
import FAQList from './components/FAQList';
import ChatWidget from './components/ChatWidget';
import { APP_THEME } from './constants';

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');

  const handleTriggerChat = (query: string) => {
    setChatQuery(query);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="text-white py-24 px-4 overflow-hidden"
          style={{ backgroundColor: APP_THEME.primary }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              Empowering your <br/><span className="text-yellow-400">Success Story.</span>
            </h1>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Welcome to the UWorld Official Help Center. Explore our comprehensive FAQs or chat with our assistant for immediate guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="bg-white text-blue-900 px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-gray-100 transition transform hover:-translate-y-1 active:translate-y-0"
              >
                Browse Knowledge Base
              </button>
              <button
  onClick={() => window.open("https://uworld.com", "_blank")}
  className="bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition backdrop-blur-sm"
>
  About Our Products
</button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex items-start space-x-5 transition-all hover:shadow-2xl">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
              <i className="fa fa-user-graduate text-2xl"></i>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-2">Student Centric</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Resources optimized for your high-stakes exam preparation.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex items-start space-x-5 transition-all hover:shadow-2xl">
            <div className="bg-yellow-100 p-4 rounded-2xl text-yellow-600">
              <i className="fa fa-bolt text-2xl"></i>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-2">Instant Guidance</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Get immediate answers to common questions about your account.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex items-start space-x-5 transition-all hover:shadow-2xl">
            <div className="bg-green-100 p-4 rounded-2xl text-green-600">
              <i className="fa fa-shield-halved text-2xl"></i>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-2">Secure Information</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Your account privacy is our top priority during your study journey.</p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="bg-white/50 py-10">
          <FAQList onNoResults={handleTriggerChat} />
        </div>

        {/* Quick Contact Footer Section */}
        <section className="bg-slate-50 py-20 border-t border-gray-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-black mb-6 text-gray-900">Still can't find the answer?</h3>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              If your question isn't covered in our knowledge base, our dedicated support team is available via email to assist you.
            </p>
            <div className="inline-block bg-blue-600 text-white px-12 py-5 rounded-2xl font-black shadow-xl">
              Email: support@uworld.com
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-gray-800 pb-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
  <a 
    href="https://uworld.com" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <img 
      src="https://www.uworld.com/assets/media/images/uworld-logo-white.svg" 
      alt="UWorld Logo" 
      className="h-8 w-auto"
    />
  </a>
</div>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">Leading the way in high-stakes exam preparation. Helping students succeed since 2003.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-gray-400 font-bold uppercase text-xs tracking-widest">
              <a href="https://www.uworld.com/privacy_policy.aspx" className="hover:text-white transition">Privacy Policy</a>
              <a href="https://www.uworld.com/terms_conditions.aspx" className="hover:text-white transition">Terms of Service</a>
              <a href="https://www.uworld.com/terms_conditions.aspx" className="hover:text-white transition">Accessibility</a>
              <span className="opacity-50 flex items-center">
                <i className="fa fa-clock mr-2"></i> Support: Mon-Fri 9AM-6PM EST
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2025 UWorld, LLC. Global Leaders in Education.</p>
            <div className="flex space-x-6 text-2xl">
              <a href="https://www.facebook.com/uworldnursing/" className="text-gray-600 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-facebook"></i></a>
              <a href="https://twitter.com/Uworldnursing" className="text-gray-600 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/uworldnursing" className="text-gray-600 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/channel/UCQbHTnFCDtpYgJYboFOks1Q" className="text-gray-600 hover:text-white transition-all transform hover:-translate-y-1"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Assistant */}
      <ChatWidget 
        externalOpen={chatOpen} 
        setExternalOpen={setChatOpen} 
        initialQuery={chatQuery} 
        clearInitialQuery={() => setChatQuery('')}
      />
    </div>
  );
};

export default App;
