
import React from 'react';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-2xl font-black text-white tracking-tighter italic">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          LUMINA
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl">
          <h4 className="text-white text-sm font-bold mb-1">AI Credits</h4>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-indigo-500 h-full w-[65%]"></div>
          </div>
          <p className="text-xs text-indigo-300">1,240 / 2,000 remaining</p>
        </div>
        
        <div className="mt-4 flex items-center gap-3 px-4 py-3 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Dev Alpha</p>
            <p className="text-xs text-slate-500 truncate">Enterprise Plan</p>
          </div>
          <button className="text-slate-500 hover:text-white">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
