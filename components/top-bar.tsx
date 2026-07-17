'use client';

import { useState } from 'react';
import { Search, Bell, Calendar, Menu, X, Crown } from 'lucide-react';
import { useSidebar } from './sidebar-context';

export function TopBar() {
  const { collapsed, toggleMobile } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
  });

  const sidebarOffset = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  return (
    <header
      className={`fixed top-0 right-0 left-0 ${sidebarOffset} z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080808]/90 backdrop-blur-sm border-b border-[#1a1a1a] transition-all duration-300`}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile/tablet) */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 text-[#555] hover:text-[#c8a55a] transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search — desktop inline */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            type="text"
            placeholder="Buscar clientes, citas..."
            className="input-dark !pl-9 pr-4 py-2 text-sm w-56 lg:w-72"
          />
        </div>

        {/* Search — mobile toggle */}
        <button
          className="md:hidden p-2 text-[#555] hover:text-[#c8a55a] transition-colors"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date — hidden on small screens */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#888] border border-[#333] rounded-sm px-2.5 py-1.5 font-[family-name:var(--font-body)] uppercase tracking-wider">
          <Calendar size={13} className="text-[#c8a55a]" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-[#888] hover:text-[#c8a55a] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#c8a55a] text-[#0a0a0a] text-[9px] font-bold rounded-sm flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#1a1a1a]">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c8a55a] to-[#a88a3e] flex items-center justify-center text-xs font-bold text-[#0a0a0a]">
            BP
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-white leading-tight uppercase tracking-wide font-[family-name:var(--font-body)] flex items-center gap-1">
              Barbero Pro <Crown size={12} className="text-[#c8a55a] fill-[#c8a55a]/20" />
            </p>
            <p className="text-[10px] text-[#888] uppercase tracking-wider">Dueño</p>
          </div>
        </div>
      </div>

      {/* Mobile search expanded */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 bg-[#080808] border-b border-[#1a1a1a] md:hidden">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              placeholder="Buscar..."
              className="input-dark !pl-9 pr-4 py-2.5 text-sm w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
