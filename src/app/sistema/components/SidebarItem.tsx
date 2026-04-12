import React from "react";

export default function SidebarItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isDark: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm border focus:outline-none ${
        active 
          ? isDark 
              ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
              : 'bg-blue-50 text-blue-600 border-blue-200'
          : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent'
      }`}
    >
      <span className={`${active ? (isDark ? 'text-blue-500' : 'text-blue-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}
