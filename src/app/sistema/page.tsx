"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { 
  LayoutDashboard, 
  Calculator, 
  PackageSearch, 
  RotateCcw, 
  Settings as SettingsIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Users,
  ListChecks,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// COMPONENTES EXTRAÍDOS
import SidebarItem from "./components/SidebarItem";
import ViewDashboard from "./components/ViewDashboard";
import ViewEtiquetas from "./components/ViewEtiquetas";
import ViewCotacao from "./components/ViewCotacao";
import ViewPrePostagem from "./components/ViewPrePostagem";
import ViewClientes from "./components/ViewClientes";
import ViewReversa from "./components/ViewReversa";
import ViewConfiguracoes from "./components/ViewConfiguracoes";

// TABS ENUM
type Tab = 'dashboard' | 'etiquetas' | 'cotacao' | 'pre-postagem' | 'clientes' | 'reversa' | 'configuracoes';

export default function SistemaDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile responsiveness
  const [userRole, setUserRole] = useState<string>('user');

  const contentRef = useRef<HTMLDivElement>(null);

  // Verificação de Auth JWT
  useEffect(() => {
    const token = localStorage.getItem('facility_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      // Decode JWT minimal manual info
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const parsedToken = JSON.parse(jsonPayload);
      setUserRole(parsedToken.role || 'user');
    } catch(e) {
      console.warn("Token inválido");
      localStorage.removeItem('facility_token');
      router.push('/auth/login');
    }
  }, [router]);

  // Smooth switch animation for tabs
  const handleTabChange = (newTab: Tab) => {
    if (newTab === activeTab) return;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveTab(newTab);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
          );
        }
      });
    } else {
      setActiveTab(newTab);
    }
  };

  const handleLogout = () => {
     localStorage.removeItem('token');
     router.push('/auth/login');
  };

  useLayoutEffect(() => {
    // Initial entrance animation
    gsap.fromTo(
      ".sidebar-item",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }
    );
    gsap.fromTo(
      ".header-anim",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div className={`flex h-[100svh] w-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0B0E14] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR */}
      <aside className={`flex flex-col w-64 border-r transition-colors duration-500 ${isDark ? 'bg-[#0f111a] border-slate-800/50' : 'bg-white border-slate-200'}`}>
        <div className="h-20 flex items-center px-6">
           <Link href="/" className="flex items-center gap-2 cursor-pointer header-anim">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter shadow-lg shadow-blue-500/20">
                FE
              </div>
              <span className={`font-extrabold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Facility Envios</span>
           </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
           <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => handleTabChange('dashboard')} 
              isDark={isDark} 
           />
           <SidebarItem 
              icon={<ListChecks size={18} />} 
              label="Minhas Etiquetas" 
              active={activeTab === 'etiquetas'} 
              onClick={() => handleTabChange('etiquetas')} 
              isDark={isDark} 
           />
           <SidebarItem 
              icon={<Calculator size={18} />} 
              label="Cotação Rápida" 
              active={activeTab === 'cotacao'} 
              onClick={() => handleTabChange('cotacao')} 
              isDark={isDark} 
           />
           <SidebarItem 
              icon={<PackageSearch size={18} />} 
              label="Pré Postagem" 
              active={activeTab === 'pre-postagem'} 
              onClick={() => handleTabChange('pre-postagem')} 
              isDark={isDark} 
           />
           <SidebarItem 
              icon={<Users size={18} />} 
              label="Clientes" 
              active={activeTab === 'clientes'} 
              onClick={() => handleTabChange('clientes')} 
              isDark={isDark} 
           />
           <SidebarItem 
              icon={<RotateCcw size={18} />} 
              label="Logística Reversa" 
              active={activeTab === 'reversa'} 
              onClick={() => handleTabChange('reversa')} 
              isDark={isDark} 
           />
        </div>

        <div className={`p-3 border-t transition-colors duration-500 ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
           <SidebarItem 
              icon={<SettingsIcon size={18} />} 
              label="Configurações" 
              active={activeTab === 'configuracoes'} 
              onClick={() => handleTabChange('configuracoes')} 
              isDark={isDark} 
           />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* HEADER */}
        <header className={`h-20 flex items-center justify-between px-8 border-b transition-colors duration-500 ${isDark ? 'bg-[#0B0E14] border-slate-800/50' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md w-full header-anim hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Pesquisar objeto, remessa, cliente..." 
                  className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDark ? 'bg-[#161a22] border-transparent text-slate-300 placeholder:text-slate-500' : 'bg-slate-100 border-transparent text-slate-700 placeholder:text-slate-400'}`}
               />
             </div>
          </div>

          <div className="flex items-center gap-4 header-anim">
            <button 
               onClick={() => setIsDark(!isDark)} 
               className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
               aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`p-2 rounded-xl transition-all relative ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-current"></span>
            </button>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 p-[2px] ml-2`}>
               <div className="w-full h-full rounded-full bg-slate-900 border-2 border-transparent flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
            <button onClick={handleLogout} className={`p-2 rounded-xl transition-all relative ${isDark ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-500' : 'hover:bg-red-50 text-slate-500 hover:text-red-500'}`} title="Sair do Sistema">
               <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* SCROLLABLE VIEW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div ref={contentRef} className="max-w-6xl mx-auto w-full h-full">
            {activeTab === 'dashboard' && <ViewDashboard isDark={isDark} />}
            {activeTab === 'etiquetas' && <ViewEtiquetas isDark={isDark} />}
            {activeTab === 'cotacao' && <ViewCotacao isDark={isDark} />}
            {activeTab === 'pre-postagem' && <ViewPrePostagem isDark={isDark} />}
            {activeTab === 'clientes' && <ViewClientes isDark={isDark} />}
            {activeTab === 'reversa' && <ViewReversa isDark={isDark} />}
            {activeTab === 'configuracoes' && <ViewConfiguracoes isDark={isDark} isDarkGlobal={isDark} setIsDarkGlobal={setIsDark} />}
          </div>
        </div>
      </main>

    </div>
  );
}
