"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";
import ViewPainelAdm from "../sistema/components/ViewPainelAdm";

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('facility_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const parsedToken = JSON.parse(jsonPayload);
      
      if (parsedToken.role !== 'admin') {
        router.push('/sistema'); // Se não for admin, volta pro dashboard comum
      } else {
        setIsAuthorized(true);
      }
    } catch(e) {
      localStorage.removeItem('facility_token');
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('facility_token');
    router.push('/auth/login');
  };

  if (!isAuthorized) {
    return <div className="h-screen flex items-center justify-center bg-[#0B0E14] text-white">Verificando Credenciais...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0B0E14] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* HEADER EXCLUSIVO ADMIN */}
      <header className={`h-20 flex items-center justify-between px-8 border-b transition-colors duration-500 ${isDark ? 'bg-[#0f111a] border-slate-800/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold tracking-tighter shadow-lg shadow-purple-500/20">
             ADM
           </div>
           <div>
              <h1 className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Central Administrativa</h1>
              <p className="text-xs text-purple-500 font-bold uppercase tracking-wider">Facility Envios</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsDark(!isDark)} 
             className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all text-sm">
            <LogOut size={16} /> Sair do Painel
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (VIEW) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-6xl mx-auto w-full h-full">
            <ViewPainelAdm isDark={isDark} />
        </div>
      </main>

    </div>
  );
}
