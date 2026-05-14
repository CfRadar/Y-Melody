import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onToggleNotifications }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Mobile TopBar */}
      <header className="md:hidden bg-surface/60 backdrop-blur-2xl text-primary sticky top-0 border-b border-white/10 flex justify-between items-center w-full px-container-margin py-base z-30">
        <div className="flex items-center gap-xs">
          <span className="font-display-md text-display-md font-bold text-primary tracking-tight">Y-Melodies</span>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant w-full justify-end ml-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-surface-container rounded-full px-3 py-1 text-sm border-none focus:ring-1 focus:ring-tertiary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button onClick={onToggleNotifications} className="hover:bg-white/5 transition-colors duration-300 p-2 rounded-full relative shrink-0">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(104,211,255,0.8)]"></span>
          </button>
          <img alt="User profile" className="w-8 h-8 rounded-full object-cover ml-1 shrink-0" src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop"/>
        </div>
      </header>

      {/* Desktop TopBar */}
      <header className="hidden md:flex justify-between items-center w-full px-container-margin py-base max-w-[1440px] mx-auto sticky top-0 bg-surface/60 backdrop-blur-2xl border-b border-white/10 z-30 h-20">
        <div className="flex-1 max-w-md">
          <div className="relative flex items-center w-full h-12 rounded-full bg-surface-container/50 border border-white/5 overflow-hidden group hover:border-white/10 transition-colors focus-within:border-tertiary focus-within:ring-1 focus-within:ring-tertiary/50">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-tertiary transition-colors">search</span>
            <input 
              className="w-full h-full bg-transparent border-none pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 font-body-md text-body-md" 
              placeholder="Search artists, moods, or frequencies..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-end">
          <button onClick={onToggleNotifications} className="w-10 h-10 rounded-full flex items-center justify-center text-tertiary font-bold bg-white/5 relative hover:bg-white/10 transition-colors duration-300">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(104,211,255,0.8)]"></span>
          </button>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors duration-300">
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <div className="w-10 h-10 rounded-full ml-2 border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
            <img alt="User profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop"/>
          </div>
        </div>
      </header>
    </>
  );
}
