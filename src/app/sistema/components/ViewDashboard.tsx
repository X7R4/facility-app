import { useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { Package, DollarSign, TrendingUp } from "lucide-react";

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

export default function ViewDashboard({ isDark }: { isDark: boolean }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('facility_token');
      try {
        const res = await fetch("http://localhost:3000/dashboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Erro ao buscar stats do dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useLayoutEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".dash-stagger",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
      );
      gsap.fromTo(
        ".chart-bar",
        { height: 0 },
        { height: (i: number, target: any) => target.dataset.h + "%", duration: 1, stagger: 0.02, ease: "power3.out", delay: 0.4 }
      );
    }
  }, [loading, stats]);

  if (loading) {
    return <div className="flex justify-center p-8 text-slate-500">Carregando dashboard...</div>;
  }

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Calcula os valores maximos para a altura do grafico (0 a 100%)
  const maxChartVal = stats?.chartData?.reduce((max: number, d: any) => Math.max(max, d.pac + d.sedex), 1) || 1;

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
        <MetricCard isDark={isDark} title="Etiquetas Geradas" value={stats?.totalEtiquetas.toString() || "0"} change="" icon={<Package size={18} />} color="blue" />
        <MetricCard isDark={isDark} title="Margem Total (R$)" value={formatMoney(stats?.margemTotal || 0)} change="" icon={<DollarSign size={18} />} color="teal" />
        <MetricCard isDark={isDark} title="Margem Média/Etiq." value={formatMoney(stats?.margemMedia || 0)} change="" icon={<TrendingUp size={18} />} color="indigo" />
        <MetricCard isDark={isDark} title="Lucro Líquido" value={formatMoney(stats?.lucroLiquido || 0)} change="" icon={<DollarSign size={18} />} color="emerald" />
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
          {stats?.chartData?.map((data: any, i: number) => {
            const pacPercent = ((data.pac / maxChartVal) * 100) || 0;
            const sedexPercent = ((data.sedex / maxChartVal) * 100) || 0;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 h-full group">
                <div className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-slate-500 mb-1">
                  {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                </div>
                <div className="w-full relative h-[80%] flex flex-col justify-end rounded-t-sm overflow-hidden gap-[1px]">
                  {/* SEDEX BAR */}
                  <div 
                    className={`chart-bar w-full rounded-t-sm transition-all duration-300 ${isDark ? 'bg-teal-500/80' : 'bg-teal-400'}`}
                    data-h={sedexPercent}
                    title={`SEDEX: ${data.sedex}`}
                  />
                  {/* PAC BAR */}
                  <div 
                    className={`chart-bar w-full rounded-t-sm transition-all duration-300 ${isDark ? 'bg-blue-500/80' : 'bg-blue-500'}`}
                    data-h={pacPercent}
                    title={`PAC: ${data.pac}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
