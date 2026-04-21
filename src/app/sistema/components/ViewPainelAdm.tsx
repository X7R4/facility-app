import { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, ShieldAlert, ArrowRight } from "lucide-react";

export default function ViewPainelAdm({ isDark }: { isDark: boolean }) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem('facility_token');
    try {
      const res = await fetch("http://localhost:3000/admin/usuarios", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        const err = await res.json();
        setErrorMsg(err.mensagem || 'Você não tem permissão para acessar esta área.');
      }
    } catch (err) {
      console.error("Erro", err);
      setErrorMsg("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, payload: any) => {
     const token = localStorage.getItem('facility_token');
     try {
       const res = await fetch(`http://localhost:3000/admin/usuarios/${id}`, {
         method: 'PUT',
         headers: {
           "Authorization": `Bearer ${token}`,
           "Content-Type": "application/json"
         },
         body: JSON.stringify(payload)
       });
       if(res.ok) {
         fetchUsuarios();
       } else {
         const d = await res.json();
         alert("Erro: " + (d.mensagem || "Não foi possível alterar"));
       }
     } catch (e: any) {
       console.error("Erro ao atualizar usuário", e);
       alert("Erro de conexão com Admin API");
     }
  };

  if (errorMsg) {
    return (
      <div className={`p-8 border rounded-2xl ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
         <div className="flex items-center gap-3">
            <ShieldAlert size={24} />
            <h2 className="text-xl font-bold">Acesso Restrito</h2>
         </div>
         <p className="mt-4">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
           <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Painel do Administrador</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie níveis de acesso e autorizações de pontos de coleta.</p>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <th className="px-6 py-4">Usuário / Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Privilégio</th>
                <th className="px-6 py-4">Sem Pagamento?</th>
                <th className="px-6 py-4 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/0">
              {loading && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando usuários...</td></tr>}
              {!loading && usuarios.map((user) => (
                <tr key={user._id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.nome}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                     <select 
                        value={user.status}
                        onChange={(e) => updateUser(user._id, { status: e.target.value })}
                        className={`text-xs font-bold p-2 rounded-lg border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'} ${user.status === 'aprovado' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : ''} ${user.status === 'bloqueado' ? 'text-red-500 border-red-500/30 bg-red-500/5' : ''}`}
                     >
                        <option value="pendente">Pendente</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="bloqueado">Bloqueado</option>
                     </select>
                  </td>
                  <td className="px-6 py-4">
                     <select 
                        value={user.role}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                        className={`text-xs font-bold p-2 rounded-lg border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'} ${user.role === 'admin' ? 'text-purple-500 border-purple-500/30 bg-purple-500/5' : ''}`}
                     >
                        <option value="user">Usuário Comum</option>
                        <option value="admin">Administrador</option>
                     </select>
                  </td>
                  <td className="px-6 py-4">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={user.autorizadoSemPagamento} onChange={(e) => updateUser(user._id, { autorizadoSemPagamento: e.target.checked })} />
                        <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDark ? 'bg-slate-700 peer-checked:bg-emerald-500' : 'bg-slate-200 peer-checked:bg-emerald-500'}`}></div>
                     </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className={`p-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                        Ver Detalhes <ArrowRight size={14} />
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
