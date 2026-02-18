
import React from 'react';
import { APP_THEME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          
          <span className="text-xl font-bold tracking-tight" style={{ color: APP_THEME.primary }}>
            UWorld <span className="text-gray-500 font-medium">Support</span>
          </span>
        </div>      

        
      </div>
    </header>
  );
};

export default Header;
