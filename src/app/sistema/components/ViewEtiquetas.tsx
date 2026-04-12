import { useState } from "react";
import { ListChecks, LayoutDashboard, CheckSquare, Square, Info } from "lucide-react";

export default function ViewEtiquetas({ isDark }: { isDark: boolean }) {
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
