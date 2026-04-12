import { useState, useRef } from "react";
import gsap from "gsap";
import { Package, Truck } from "lucide-react";
import InputField from "./InputField";

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

export default function ViewCotacao({ isDark }: { isDark: boolean }) {
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
