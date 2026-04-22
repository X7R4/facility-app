import { useState, useEffect } from "react";
import { ListChecks, LayoutDashboard, CheckSquare, Square, Info, Receipt } from "lucide-react";
import ViewReciboModal from "./ViewReciboModal";

export default function ViewEtiquetas({ isDark }: { isDark: boolean }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [etiquetas, setEtiquetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecibo, setSelectedRecibo] = useState<any>(null);
  const [pontoColetaNome, setPontoColetaNome] = useState("");

  useEffect(() => {
    const fetchEtiquetas = async () => {
      const token = localStorage.getItem('facility_token');
      if (token) {
        try {
          const profileRes = await fetch("http://localhost:3000/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setPontoColetaNome(profileData.nomePonto || profileData.nome || "Ponto de Coleta");
          }
        } catch (e) {}
      }
      try {
        const res = await fetch("http://localhost:3000/etiquetas", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setEtiquetas(data);
        }
      } catch (err) {
        console.error("Erro ao buscar etiquetas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEtiquetas();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === etiquetas.length && etiquetas.length > 0) setSelectedIds([]);
    else setSelectedIds(etiquetas.map(e => e.id));
  };

  const toggleSelect = (id: string) => {
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

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando etiquetas...</div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <th className="px-6 py-4 w-10">
                    <button onClick={handleSelectAll} className="text-blue-500">
                      {selectedIds.length > 0 && selectedIds.length === etiquetas.length ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="px-6 py-4">Remetente</th>
                  <th className="px-6 py-4">Destinatário</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Custo Plataforma</th>
                  <th className="px-6 py-4 text-right">Valor Cliente</th>
                  <th className="px-6 py-4 text-right">Seu Lucro</th>
                  <th className="px-6 py-4 text-right">Objeto</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/0">
                {etiquetas.length === 0 && (
                  <tr>
                     <td colSpan={7} className="px-6 py-8 text-center text-sm font-bold text-slate-500">Nenhuma etiqueta gerada ainda.</td>
                  </tr>
                )}
                {etiquetas.map((e) => (
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
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${e.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-500' : e.status === 'Falhou' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{e.tipo}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.valorBaseUsuario || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.valorFinal || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.lucroUsuario || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-blue-500">{e.codigoObjeto}</p>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedRecibo(e)}
                        className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isDark ? 'hover:bg-blue-900/30 text-blue-400 hover:text-blue-300' : 'hover:bg-blue-100 text-blue-600 hover:text-blue-800'}`}
                        title="Ver Recibo"
                      >
                        <Receipt size={18} />
                      </button>
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
      )}

      {selectedRecibo && (
        <ViewReciboModal 
          etiqueta={selectedRecibo} 
          pontoColetaNome={pontoColetaNome} 
          onClose={() => setSelectedRecibo(null)} 
        />
      )}
    </div>
  );
}
