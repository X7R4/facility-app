"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
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
  TrendingUp,
  Package,
  DollarSign,
  Barcode,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  Users,
  ListChecks,
  History,
  Info,
  Edit2,
  CheckSquare,
  Square,
  ChevronRight,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// TABS ENUM
type Tab = 'dashboard' | 'etiquetas' | 'cotacao' | 'pre-postagem' | 'clientes' | 'reversa' | 'configuracoes';

// --- SVGs & MOCKS ---
const BAR_DATA = [12, 19, 14, 22, 28, 25, 30, 26, 40, 36, 45, 55, 42, 60, 50, 70]; // Mock throughput data

export default function SistemaDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile responsiveness

  const contentRef = useRef<HTMLDivElement>(null);

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

        <div className="p-3 border-t transition-colors duration-500 ${isDark ? 'border-slate-800/50' : 'border-slate-200'}">
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

// ------------------------------
// SUB-COMPONENTS
// ------------------------------

function SidebarItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isDark: boolean }) {
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

// ============== VIEWS ==============

function ViewDashboard({ isDark }: { isDark: boolean }) {
  
  useLayoutEffect(() => {
    gsap.fromTo(
      ".dash-stagger",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
    );
    gsap.fromTo(
      ".chart-bar",
      { height: 0 },
      { height: (i, target) => target.dataset.h + "%", duration: 1, stagger: 0.02, ease: "power3.out", delay: 0.4 }
    );
  }, []);

  return (
    <div className="space-y-8 pb-8">
      <div className="dash-stagger">
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Visão Geral
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Bem vindo de volta, confira como está a sua operação hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 dash-stagger">
        <MetricCard isDark={isDark} title="Etiquetas Geradas" value="1,202" change="+12%" icon={<Package size={18} />} color="blue" />
        <MetricCard isDark={isDark} title="Margem Total (R$)" value="R$ 14.500,80" change="+5.4%" icon={<DollarSign size={18} />} color="teal" />
        <MetricCard isDark={isDark} title="Margem Média/Etiq." value="R$ 12,05" change="+1.2%" icon={<TrendingUp size={18} />} color="indigo" />
        <MetricCard isDark={isDark} title="Lucro Líquido" value="R$ 4.250,00" change="+8.1%" icon={<DollarSign size={18} />} color="emerald" />
      </div>

      {/* Chart Section */}
      <div className={`dash-stagger p-6 rounded-2xl border transition-colors duration-500 ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Volume de Produção (Últimos 14 dias)</h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Baseado no histórico de envios PAC e SEDEX.</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500" /> PAC</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-teal-400" /> SEDEX</span>
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-1 sm:gap-2">
          {BAR_DATA.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 h-full group">
              <div className="w-full relative h-[80%] flex flex-col justify-end rounded-t-sm overflow-hidden">
                {/* Simulated Chart Bars */}
                <div 
                  className={`chart-bar w-full rounded-t-sm transition-all duration-300 ${isDark ? 'bg-slate-700/50 group-hover:bg-blue-500/80' : 'bg-slate-200 group-hover:bg-blue-500'}`}
                  data-h={val}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, color, isDark }: { title: string, value: string, change: string, icon: React.ReactNode, color: string, isDark: boolean }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    teal: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 duration-300 shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
       <div className="flex items-center justify-between mb-4">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
            {icon}
         </div>
         <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${change.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
           {change} ↗
         </span>
       </div>
       <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
       <h4 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
    </div>
  );
}

// ============== MINHAS ETIQUETAS ==============
function ViewEtiquetas({ isDark }: { isDark: boolean }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const etiquetasMock = [
    { id: 1, remetente: "Ponto de Coleta (FIXO)", destinatario: "Marcos Oliveira", valorPonto: 5.00, valorFinal: 25.00, lucro: 20.00, tipo: "SEDEX", status: "Aprovado" },
    { id: 2, remetente: "Loja do Pedro", destinatario: "Alice Sousa", valorPonto: 8.50, valorFinal: 32.00, lucro: 23.50, tipo: "PAC", status: "Pendente" },
    { id: 3, remetente: "Ana Maria", destinatario: "Carlos Mendes", valorPonto: 4.20, valorFinal: 18.00, lucro: 13.80, tipo: "PAC", status: "Aprovado" },
    { id: 4, remetente: "Ponto de Coleta (FIXO)", destinatario: "Roberto Lima", valorPonto: 6.00, valorFinal: 45.00, lucro: 39.00, tipo: "SEDEX", status: "Pendente" },
  ];

  const handleSelectAll = () => {
    if (selectedIds.length === etiquetasMock.length) setSelectedIds([]);
    else setSelectedIds(etiquetasMock.map(e => e.id));
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Minhas Etiquetas</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Acompanhe o status e lucro de todos os seus envios.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2 rounded-lg border transition-all ${viewMode === 'list' ? (isDark ? 'bg-blue-600/20 text-blue-500 border-blue-500/40' : 'bg-blue-50 text-blue-600 border-blue-200') : (isDark ? 'bg-slate-800 border-transparent text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}
           >
             <ListChecks size={20} />
           </button>
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? (isDark ? 'bg-blue-600/20 text-blue-500 border-blue-500/40' : 'bg-blue-50 text-blue-600 border-blue-200') : (isDark ? 'bg-slate-800 border-transparent text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}
           >
             <LayoutDashboard size={20} />
           </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className={`p-4 rounded-xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
           <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{selectedIds.length} etiquetas selecionadas</span>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Pagar agora</button>
        </div>
      )}

      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <th className="px-6 py-4 w-10">
                  <button onClick={handleSelectAll} className="text-blue-500">
                    {selectedIds.length === etiquetasMock.length ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th className="px-6 py-4">Remetente</th>
                <th className="px-6 py-4">Destinatário</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Lucro</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/0">
              {etiquetasMock.map((e) => (
                <tr key={e.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(e.id)} className={selectedIds.includes(e.id) ? 'text-blue-500' : (isDark ? 'text-slate-700' : 'text-slate-300')}>
                      {selectedIds.includes(e.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{e.remetente}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{e.destinatario}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${e.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{e.tipo}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-emerald-500">R$ {e.lucro.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isDark ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'}`}>
                      <Info size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============== COTAÇÃO RÁPIDA ==============
function ViewCotacao({ isDark }: { isDark: boolean }) {
  const [quoted, setQuoted] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const performQuote = () => {
    setQuoted(true);
    setTimeout(() => {
      if (resultsRef.current) {
        gsap.fromTo(resultsRef.current.children, 
          { opacity: 0, scale: 0.9, y: 20 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }
        );
      }
    }, 50);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Cotação Rápida de Frete</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Simule preços e confira sua margem de lucro oculta de forma simplificada.</p>
      </div>

      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PACOTE */}
          <div className="space-y-4">
             <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Package size={16} /> Dimensões do Pacote
             </h3>
             <div className="grid grid-cols-3 gap-3">
               <div>
                  <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Largura (cm)</label>
                  <InputField placeholder="00" isDark={isDark} />
               </div>
               <div>
                  <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Altura (cm)</label>
                  <InputField placeholder="00" isDark={isDark} />
               </div>
               <div>
                  <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Compr. (cm)</label>
                  <InputField placeholder="00" isDark={isDark} />
               </div>
             </div>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Peso Estimado (kg)</label>
                <InputField placeholder="Ex: 1.5" isDark={isDark} />
             </div>
          </div>

          {/* DESTINO */}
          <div className="space-y-4">
             <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Truck size={16} /> Localidade
             </h3>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CEP Remetente</label>
                <InputField placeholder="00000-000" isDark={isDark} defaultValue="01001-000" />
             </div>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CEP Destinatário</label>
                <InputField placeholder="00000-000" isDark={isDark} />
             </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-dashed flex justify-end items-center gap-4 border-slate-200 dark:border-slate-800">
           <button onClick={performQuote} className={`px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 focus:ring-4 focus:ring-blue-500/20`}>
             Calcular Fretes
           </button>
        </div>
      </div>

      {quoted && (
        <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
           <QuoteCard 
              service="PAC - Correios" 
              days="5 a 7 dias úteis" 
              price="R$ 32,50" 
              margin="R$ 8,00" 
              isDark={isDark} 
              highlight={false} 
           />
           <QuoteCard 
              service="SEDEX - Correios" 
              days="1 a 2 dias úteis" 
              price="R$ 54,90" 
              margin="R$ 14,50" 
              isDark={isDark} 
              highlight={true} 
           />
        </div>
      )}
    </div>
  );
}

function QuoteCard({ service, days, price, margin, isDark, highlight }: any) {
  return (
    <div className={`relative p-6 rounded-2xl border transition-all shadow-sm flex flex-col justify-between overflow-hidden ${
      highlight 
        ? isDark ? 'bg-gradient-to-br from-[#121620] to-[#1a2333] border-blue-500/40' : 'bg-gradient-to-br from-white to-blue-50 border-blue-300'
        : isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'
    }`}>
      {highlight && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">Mais Rápido</div>}
      
      <div>
        <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{service}</h4>
        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{days}</p>
      </div>

      <div className="mt-8 flex items-end justify-between">
         <div>
            <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Valor Cliente</p>
            <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{price}</span>
         </div>
         <div className={`px-3 py-2 rounded-lg border text-right group cursor-help transition-all ${isDark ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
            <p className={`text-[10px] font-bold uppercase opacity-50 group-hover:opacity-100 transition-opacity ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Sua Margem</p>
            <span className={`text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{margin}</span>
            <span className={`text-sm font-bold opacity-100 group-hover:opacity-0 absolute right-6 transition-opacity ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>•••</span>
         </div>
      </div>
    </div>
  );
}

// ============== PRÉ POSTAGEM ==============
function ViewPrePostagem({ isDark }: { isDark: boolean }) {
  const [senderType, setSenderType] = useState<'fixed' | 'new' | 'existing'>('fixed');

  return (
    <div className="max-w-5xl space-y-6 pb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Emissão de Pré-Postagem</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Preencha os dados completos para gerar a etiqueta oficial.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800/50">
         <button 
           onClick={() => setSenderType('fixed')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'fixed' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
         >
           Endereço Fixo (Ponto)
         </button>
         <button 
           onClick={() => setSenderType('existing')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'existing' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 '}`}
         >
           Cliente Cadastrado
         </button>
         <button 
           onClick={() => setSenderType('new')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'new' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
         >
           Novo Cliente
         </button>
      </div>

      <div className={`p-8 rounded-2xl border shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
        
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Remetente Lógica */}
            <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-400">
               <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">1</div>
                <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Remetente</h3>
              </div>

              {senderType === 'fixed' && (
                <div className={`p-4 rounded-xl border border-dashed text-sm flex flex-col gap-2 ${isDark ? 'bg-blue-500/5 border-blue-500/20 text-slate-400' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                  <p className="font-bold flex items-center gap-2"><CheckCircle2 size={16} /> Ponto de Coleta Facility</p>
                  <p>Avenida Paulista, 1000 - São Paulo, SP</p>
                  <p>CNPJ: 00.000.000/0001-00</p>
                </div>
              )}

              {senderType === 'existing' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Buscar cliente por nome ou CPF..." className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-[#0B0E14] border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div className={`p-4 rounded-xl border text-sm flex flex-col gap-2 opacity-50 ${isDark ? 'bg-slate-900 border-slate-800 italic' : 'bg-slate-50 border-slate-100 italic font-medium'}`}>
                    Selecione um cliente para carregar os dados...
                  </div>
                </div>
              )}

              {senderType === 'new' && (
                <div className="space-y-4">
                  <InputField label="Nome Completo" placeholder="João Exemplo" isDark={isDark} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="CPF / CNPJ" placeholder="000.000..." isDark={isDark} />
                    <InputField label="Telefone" placeholder="(00)..." isDark={isDark} />
                  </div>
                  <InputField label="Logradouro" placeholder="Rua..." isDark={isDark} />
                </div>
              )}

              {/* Destinatário */}
              <div className="pt-4 space-y-5">
                <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">2</div>
                  <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Destinatário</h3>
                </div>
                <InputField label="Nome Completo" placeholder="Ex: João da Silva" isDark={isDark} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="CPF / CNPJ" placeholder="000.000.000-00" isDark={isDark} />
                  <InputField label="Telefone" placeholder="(00) 00000-0000" isDark={isDark} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <InputField label="CEP" placeholder="00000-000" isDark={isDark} />
                   <div className="col-span-2">
                     <InputField label="Logradouro" placeholder="Rua exemplo..." isDark={isDark} />
                   </div>
                </div>
              </div>
            </div>

            {/* Pacote e Declaração */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">3</div>
                <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Pacote & Conteúdo</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                 <InputField label="Larg. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Alt. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Comp. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Peso (kg)" placeholder="0" isDark={isDark} />
              </div>

              <div className={`p-4 rounded-xl border mt-2 ${isDark ? 'bg-[#0B0E14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Declaração de Conteúdo</h4>
                <div className="space-y-4">
                  <InputField label="Descrição do Item principal" placeholder="Ex: Camiseta de Algodão" isDark={isDark} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Quantidade" placeholder="1" type="number" isDark={isDark} />
                    <InputField label="Valor Unitário (R$)" placeholder="50,00" isDark={isDark} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between border-slate-200 dark:border-slate-800">
             <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-lg border flex items-center gap-3 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                  <input type="checkbox" id="av" className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                  <label htmlFor="av" className={`text-sm font-semibold cursor-pointer select-none ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Desejo Aviso de Recebimento (AR)</label>
                </div>
             </div>
             
             <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[0.98] transition-transform">
               Gerar Etiqueta & Resumo
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ============== CLIENTES ==============
function ViewClientes({ isDark }: { isDark: boolean }) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const clientsMock = [
    { id: 1, nome: "Marcos Oliveira", cpf: "123.456.789-00", telefone: "(11) 98888-7777", email: "marcos@email.com", endereco: "Rua das Flores, 123 - Centro, SP", etiquetas: 12, pref: "SEDEX" },
    { id: 2, nome: "Alice Sousa", cpf: "987.654.321-11", telefone: "(21) 97777-6666", email: "alice@site.com", endereco: "Av. Brasil, 500 - Rio de Janeiro, RJ", etiquetas: 5, pref: "PAC" },
    { id: 3, nome: "Marcos Oliveira", cpf: "123.456.789-00", telefone: "(11) 98888-7777", email: "marcos@email.com", endereco: "Rua das Flores, 123 - Centro, SP", etiquetas: 2, pref: "SEDEX" },
  ];

  if (isAdding) {
    return (
      <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
        <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft size={16} /> Voltar para lista
        </button>
        <div className={`p-8 rounded-2xl border ${isDark ? 'bg-[#121620] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Novo Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nome Completo" placeholder="Ex: Pedro Silva" isDark={isDark} />
            <InputField label="CPF / CNPJ" placeholder="000.000.000-00" isDark={isDark} />
            <InputField label="Telefone" placeholder="(00) 00000-0000" isDark={isDark} />
            <InputField label="Email" placeholder="pedro@email.com" type="email" isDark={isDark} />
            <div className="md:col-span-2">
              <InputField label="Endereço Completo" placeholder="Rua, número, bairro, cidade, estado..." isDark={isDark} />
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[0.98] transition-all">
              Cadastrar Cliente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
        <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all">
          <ArrowLeft size={16} /> Voltar para lista
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-8 rounded-2xl border ${isDark ? 'bg-[#121620] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-8">
               <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dados do Cliente</h2>
               <button className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}><Edit2 size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div><p className="text-xs font-bold text-slate-500 uppercase">Nome</p><p className="font-bold mt-1">{selectedClient.nome}</p></div>
               <div><p className="text-xs font-bold text-slate-500 uppercase">CPF</p><p className="font-bold mt-1">{selectedClient.cpf}</p></div>
               <div><p className="text-xs font-bold text-slate-500 uppercase">Telefone</p><p className="font-bold mt-1">{selectedClient.telefone}</p></div>
               <div><p className="text-xs font-bold text-slate-500 uppercase">Email</p><p className="font-bold mt-1">{selectedClient.email}</p></div>
               <div className="md:col-span-2"><p className="text-xs font-bold text-slate-500 uppercase">Endereço</p><p className="font-bold mt-1">{selectedClient.endereco}</p></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
               <p className="text-xs font-bold text-blue-500 uppercase">Total de Etiquetas</p>
               <p className="text-4xl font-black mt-1 text-blue-600">{selectedClient.etiquetas}</p>
            </div>
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121620] border-slate-800' : 'bg-white border-slate-200'}`}>
               <p className="text-xs font-bold text-slate-500 uppercase">Preferência</p>
               <p className="text-xl font-bold mt-1 text-teal-500">{selectedClient.pref}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Clientes</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie sua base de clientes frequentes.</p>
        </div>
        <button 
           onClick={() => setIsAdding(true)}
           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[0.98] transition-all"
        >
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      <div className={`rounded-2xl border ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'} shadow-sm divide-y transition-colors`}>
         {clientsMock.map((c, i) => (
           <div 
             key={i} 
             onClick={() => setSelectedClient(c)}
             className={`p-5 flex items-center justify-between group cursor-pointer transition-colors ${i === 0 ? 'rounded-t-2xl' : ''} ${i === clientsMock.length - 1 ? 'rounded-b-2xl' : ''} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
           >
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                  {c.nome.charAt(0)}
                </div>
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{c.nome}</h4>
                  <p className={`text-xs mt-0.5 truncate max-w-[200px] sm:max-w-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{c.endereco}</p>
                </div>
             </div>
             <div className="hidden sm:flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Telefone</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{c.telefone}</p>
                </div>
                <div className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-slate-500 group-hover:text-white' : 'bg-slate-100 text-slate-300 group-hover:text-blue-600'}`}>
                   <ChevronRight size={20} />
                </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

// ============== LOGISTICA REVERSA ==============
function ViewReversa({ isDark }: { isDark: boolean }) {
  const [typedCode, setTypedCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus effect to look like an operational tool
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8 pb-8 text-center">
      <div className="mb-10">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30 text-white'}`}>
           <Barcode size={36} className="text-white" />
        </div>
        <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Logística Reversa</h2>
        <p className={`text-base mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bipe ou digite o código de autorização.</p>
      </div>

      <div className="relative max-w-lg mx-auto">
         <input 
            ref={inputRef}
            type="text" 
            value={typedCode}
            onChange={(e) => setTypedCode(e.target.value)}
            placeholder="Aguardando Bipagem..." 
            className={`w-full py-6 text-center text-2xl tracking-[0.2em] font-bold rounded-2xl border-2 transition-all outline-none focus:ring-4 focus:border-indigo-500 ${isDark ? 'bg-[#121620] border-slate-700 text-white placeholder:text-slate-600 focus:ring-indigo-500/20' : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-300 focus:ring-indigo-500/20'}`}
         />
      </div>

      <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg border border-slate-800 hover:scale-[0.98] transition-all">
         Validar Código Reversa ↵
      </button>

      <div className={`text-xs font-semibold p-4 rounded-xl mt-10 opacity-70 ${isDark ? 'bg-[#121620] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
        Seu leitor de código de barras deve simular a tecla "Enter" após a bipagem.
      </div>
    </div>
  );
}

// ============== CONFIGURAÇÕES ==============
function ViewConfiguracoes({ isDark, isDarkGlobal, setIsDarkGlobal }: any) {
  const [marginSetting, setMarginSetting] = useState(5.00);

  return (
    <div className="max-w-4xl space-y-8 pb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações do Painel</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ajuste suas preferências operacionais e aparência.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* APARÊNCIA */}
        <div className={`p-8 rounded-2xl border shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
           <h3 className={`font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
             <Sun size={20} className="text-amber-500" /> Tema e Aparência
           </h3>

           <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#0B0E14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                 <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Modo Escuro (Dark Mode)</p>
                 <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Ative para reduzir o brilho da tela.</p>
              </div>
              <button 
                onClick={() => setIsDarkGlobal(!isDarkGlobal)}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${isDarkGlobal ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${isDarkGlobal ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
           </div>
        </div>

        {/* MARGEM DE LUCRO */}
        <div className={`p-8 rounded-2xl border shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
           <h3 className={`font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
             <DollarSign size={20} className="text-emerald-500" /> Precificação e Margem
           </h3>

           <div className={`p-6 rounded-xl border flex flex-col items-center justify-center relative shadow-inner ${isDark ? 'bg-[#0B0E14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Margem Padrão por Envios (R$)</p>
              
              <div className="flex items-center gap-6">
                 <button 
                   onClick={() => setMarginSetting(prev => Math.max(0, prev - 1.00))}
                   className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors border ${isDark ? 'bg-[#121620] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'}`}
                 >
                   <Minus size={20} />
                 </button>
                 
                 <div className={`text-4xl font-black tabular-nums transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                   {marginSetting.toFixed(2)}
                 </div>

                 <button 
                   onClick={() => setMarginSetting(prev => prev + 1.00)}
                   className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors border ${isDark ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700'}`}
                 >
                   <Plus size={20} />
                 </button>
              </div>

              <div className="mt-8 flex items-center gap-2 w-full pt-6 border-t border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Salvo automaticamente. Aplicado em Cotações.</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// ============== REUSABLE INPUT ==============
function InputField({ label, placeholder, type = "text", isDark, defaultValue }: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>}
      <input 
         type={type} 
         placeholder={placeholder}
         defaultValue={defaultValue}
         className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 font-medium ${
            isDark 
              ? 'bg-[#0B0E14] border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20' 
              : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20'
         }`} 
      />
    </div>
  );
}
