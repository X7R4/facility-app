import { useState } from "react";
import { Sun, DollarSign, Minus, Plus, CheckCircle2 } from "lucide-react";

export default function ViewConfiguracoes({ isDark, isDarkGlobal, setIsDarkGlobal }: any) {
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
