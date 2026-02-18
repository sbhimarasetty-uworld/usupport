
import React, { useState } from 'react';
import { FAQ_DATABASE } from '../constants';
import { CategoryType } from '../types';

interface FAQListProps {
  onNoResults?: (searchTerm: string) => void;
}

const FAQList: React.FC<FAQListProps> = ({ onNoResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = FAQ_DATABASE.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '' && filteredFAQs.length === 0) {
      onNoResults?.(searchTerm);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== '' && filteredFAQs.length === 0) {
      onNoResults?.(searchTerm);
    }
  };

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-8">How can we help you?</h2>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <i 
            className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={handleSearchClick}
          ></i>
          <input 
            type="text" 
            placeholder="Search FAQs (e.g., NCLEX, reset subscription...)" 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition outline-none shadow-sm bg-white cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
        >
          <option value="All">All Categories</option>
          {Object.values(CategoryType).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <button 
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{faq.category}</span>
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                </div>
                <i className={`fa fa-chevron-down text-gray-400 transition-transform duration-200 ${expandedId === faq.id ? 'rotate-180' : ''}`}></i>
              </button>
              {expandedId === faq.id && (
                <div className="px-6 py-4 border-t border-gray-50 text-gray-600 leading-relaxed bg-blue-50/30">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-300 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-magnifying-glass text-2xl opacity-20"></i>
            </div>
            <p className="font-bold text-gray-800 mb-2">No local matches found</p>
            <p className="text-sm mb-6 max-w-xs mx-auto">Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 text-[10px] font-sans">Enter</kbd> or click below to ask our AI Assistant.</p>
            <button 
              onClick={handleSearchClick}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition active:scale-95"
            >
              Ask AI Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQList;
