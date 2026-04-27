import { useState, useEffect } from "react";
import { Sun, DollarSign, Minus, Plus, CheckCircle2, Loader2, Save, Trash2, Info } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function ViewConfiguracoes({ isDark, isDarkGlobal, setIsDarkGlobal }: any) {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('facility_token')}` }
      });
      const data = await res.json();
      if (data.regrasPonto) {
        setRules(data.regrasPonto);
      }
    } catch (e) {
      console.error("Erro ao buscar dados do usuário", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRule = () => {
    setRules([...rules, { de: 0, ate: 0, percentual: 0 }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleUpdateRule = (index: number, field: string, value: number) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const saveRules = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/regras-ponto`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('facility_token')}`
        },
        body: JSON.stringify({ regrasPonto: rules })
      });
      if (res.ok) {
        setMessage("Configurações salvas com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error("Erro ao salvar regras", e);
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* REGRAS DE PRECIFICAÇÃO (MARKUP) */}
        <div className={`p-8 rounded-2xl border shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
           <div className="flex items-center justify-between mb-6">
             <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
               <DollarSign size={20} className="text-emerald-500" /> Suas Margens de Lucro
             </h3>
             <button 
               onClick={handleAddRule}
               className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
             >
               + Nova Regra
             </button>
           </div>

           <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
             <p className={`text-xs flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
               <Info size={14} /> 
               Estas regras definem quanto você cobrará a mais dos seus clientes em cima do custo da plataforma.
             </p>
           </div>

           {isLoading ? (
             <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
           ) : (
             <div className="space-y-4">
               {rules.map((rule, idx) => (
                 <div key={idx} className={`grid grid-cols-10 gap-3 p-3 rounded-xl border ${isDark ? 'bg-[#0B0E14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                   <div className="col-span-3">
                     <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">De (R$)</label>
                     <input 
                       type="number" 
                       value={rule.de} 
                       onChange={(e) => handleUpdateRule(idx, 'de', Number(e.target.value))}
                       className={`w-full px-3 py-2 rounded-lg border text-sm font-bold ${isDark ? 'bg-[#121620] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                     />
                   </div>
                   <div className="col-span-3">
                     <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Até (R$)</label>
                     <input 
                       type="number" 
                       value={rule.ate} 
                       onChange={(e) => handleUpdateRule(idx, 'ate', Number(e.target.value))}
                       className={`w-full px-3 py-2 rounded-lg border text-sm font-bold ${isDark ? 'bg-[#121620] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                     />
                   </div>
                   <div className="col-span-3">
                     <label className="text-[10px] font-bold uppercase text-emerald-500 mb-1 block">Markup (%)</label>
                     <input 
                       type="number" 
                       value={rule.percentual} 
                       onChange={(e) => handleUpdateRule(idx, 'percentual', Number(e.target.value))}
                       className={`w-full px-3 py-2 rounded-lg border text-sm font-bold ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}
                     />
                   </div>
                   <div className="col-span-1 flex items-end">
                     <button 
                       onClick={() => handleRemoveRule(idx)}
                       className={`w-full aspect-square flex items-center justify-center rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-red-500' : 'hover:bg-red-50 text-red-500'}`}
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
               ))}
               
               {rules.length === 0 && (
                 <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                   <p className="text-sm text-slate-400">Nenhuma regra configurada. O custo será o padrão.</p>
                 </div>
               )}

               <button 
                 onClick={saveRules}
                 disabled={isSaving}
                 className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSaving ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
               >
                 {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                 {isSaving ? 'Salvando...' : 'Salvar Alterações'}
               </button>

               {message && (
                 <p className="text-center text-xs font-bold text-emerald-500 animate-pulse">{message}</p>
               )}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
