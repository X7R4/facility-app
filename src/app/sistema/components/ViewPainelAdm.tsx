import { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, ShieldAlert, ArrowRight, Settings2, X, Plus, Trash2, KeyRound, RefreshCw, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function ViewPainelAdm({ isDark }: { isDark: boolean }) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingRules, setEditingRules] = useState<any>(null);
  const [viewingDetails, setViewingDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Correios Token Status
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchTokenStatus();
  }, []);

  const fetchTokenStatus = async () => {
    setTokenLoading(true);
    try {
      const token = localStorage.getItem('facility_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/correios/token-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTokenStatus(await res.json());
    } catch (e) { /* silent */ } finally { setTokenLoading(false); }
  };

  const handleForceTokenRefresh = async () => {
    setTokenRefreshing(true);
    try {
      const token = localStorage.getItem('facility_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/correios/token-refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) { setTokenStatus(data); alert('Token renovado com sucesso!'); }
      else alert('Erro: ' + data.mensagem);
    } catch (e) { alert('Falha na renovação.'); } finally { setTokenRefreshing(false); }
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem('facility_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/usuarios`, {
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
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/usuarios/${id}`, {
         method: 'PUT',
         headers: {
           "Authorization": `Bearer ${token}`,
           "Content-Type": "application/json"
         },
         body: JSON.stringify(payload)
       });
       if(res.ok) {
         if (editingRules) setEditingRules(null);
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

  const handleAddRule = () => {
    setEditingRules({
      ...editingRules,
      regrasPreco: [...editingRules.regrasPreco, { de: 0, ate: 0, percentual: 0 }]
    });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...editingRules.regrasPreco];
    newRules.splice(index, 1);
    setEditingRules({ ...editingRules, regrasPreco: newRules });
  };

  const handleRuleChange = (index: number, field: string, value: number) => {
    const newRules = [...editingRules.regrasPreco];
    newRules[index] = { ...newRules[index], [field]: value };
    setEditingRules({ ...editingRules, regrasPreco: newRules });
  };

  const handleViewDetails = async (user: any) => {
    setViewingDetails(user);
    setLoadingDetails(true);
    setNewPassword('');
    const token = localStorage.getItem('facility_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/usuarios/${user._id}/detalhes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setUserDetails(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleResetPassword = async () => {
    if (!confirm("Tem certeza que deseja resetar a senha deste usuário? A nova senha será exibida na tela.")) return;
    const token = localStorage.getItem('facility_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/usuarios/${viewingDetails._id}/reset-senha`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNewPassword(data.novaSenha);
      } else {
        alert("Erro ao resetar senha.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro de conexão.");
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
    <div className="space-y-6 pb-8 relative">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
           <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Painel do Administrador</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie níveis de acesso e autorizações de pontos de coleta.</p>
        </div>
      </div>

      {/* ── Token dos Correios ── */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-5 ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
        <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
          <KeyRound size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Token de Acesso — API Correios</h3>
          {tokenLoading && <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Carregando status...</p>}
          {!tokenLoading && tokenStatus && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
              <div className="flex items-center gap-1.5">
                {tokenStatus.status === 'ativo'
                  ? <CheckCircle2 size={14} className="text-green-500" />
                  : tokenStatus.status === 'expirando'
                  ? <AlertTriangle size={14} className="text-amber-400" />
                  : <AlertTriangle size={14} className="text-red-400" />}
                <span className={`text-xs font-semibold ${tokenStatus.status === 'ativo' ? 'text-green-500' : tokenStatus.status === 'expirando' ? 'text-amber-400' : 'text-red-400'}`}>
                  {tokenStatus.status === 'ativo' ? 'Ativo' : tokenStatus.status === 'expirando' ? 'Expirando em breve' : tokenStatus.status === 'expirado' ? 'Expirado' : 'Não gerado'}
                </span>
              </div>
              {tokenStatus.generatedAt && (
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Gerado em: {new Date(tokenStatus.generatedAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
              {tokenStatus.expiresAt && (
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Expira em: {new Date(tokenStatus.expiresAt).toLocaleString('pt-BR')}
                    {tokenStatus.expiresInMinutes > 0 && ` (${tokenStatus.expiresInMinutes} min restantes)`}
                  </span>
                </div>
              )}
            </div>
          )}
          {!tokenLoading && !tokenStatus && (
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nenhum token encontrado. Clique em renovar para gerar um novo.</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={fetchTokenStatus} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
            <RefreshCw size={15} className={tokenLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleForceTokenRefresh}
            disabled={tokenRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <RefreshCw size={14} className={tokenRefreshing ? 'animate-spin' : ''} />
            {tokenRefreshing ? 'Renovando...' : 'Forçar Renovação'}
          </button>
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
                <th className="px-6 py-4 text-right">Ação</th>
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
                        value={user.role === 'admin' ? 'admin' : (user.isPontoColeta ? 'ponto_coleta' : 'user')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'admin') {
                            updateUser(user._id, { role: 'admin', isPontoColeta: true });
                          } else if (val === 'ponto_coleta') {
                            updateUser(user._id, { role: 'user', isPontoColeta: true });
                          } else {
                            updateUser(user._id, { role: 'user', isPontoColeta: false });
                          }
                        }}
                        className={`text-xs font-bold p-2 rounded-lg border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'} ${user.role === 'admin' ? 'text-purple-500 border-purple-500/30 bg-purple-500/5' : ''}`}
                     >
                        <option value="user">Usuário Comum</option>
                        <option value="ponto_coleta">Ponto de Coleta</option>
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
                     <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingRules(user)}
                          className={`p-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 ${isDark ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
                           <Settings2 size={14} /> Regras
                        </button>
                        <button onClick={() => handleViewDetails(user)} className={`p-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                           Detalhes <ArrowRight size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE REGRAS DE PREÇO */}
      {editingRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#121620] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <Settings2 size={20} className="text-amber-500" /> Regras de Preço: {editingRules.nome}
               </h3>
               <button onClick={() => setEditingRules(null)} className={`p-2 rounded-lg hover:bg-slate-500/10 transition-colors`}>
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className={`text-xs font-medium uppercase tracking-wider opacity-60`}>Defina faixas de valores e porcentagem de acréscimo</p>
              
              {editingRules.regrasPreco.map((regra: any, idx: number) => (
                <div key={idx} className={`grid grid-cols-12 gap-3 items-end p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-50">De (R$)</label>
                    <input 
                      type="number" 
                      value={regra.de} 
                      onChange={(e) => handleRuleChange(idx, 'de', parseFloat(e.target.value))}
                      className={`w-full p-2 rounded-lg text-sm font-bold border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700' : 'bg-white border-slate-200'}`} 
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-50">Até (R$)</label>
                    <input 
                      type="number" 
                      value={regra.ate} 
                      onChange={(e) => handleRuleChange(idx, 'ate', parseFloat(e.target.value))}
                      className={`w-full p-2 rounded-lg text-sm font-bold border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700' : 'bg-white border-slate-200'}`} 
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-50">Acréscimo (%)</label>
                    <input 
                      type="number" 
                      value={regra.percentual} 
                      onChange={(e) => handleRuleChange(idx, 'percentual', parseFloat(e.target.value))}
                      className={`w-full p-2 rounded-lg text-sm font-bold border outline-none ${isDark ? 'bg-[#0B0E14] border-slate-700' : 'bg-white border-slate-200'}`} 
                    />
                  </div>
                  <div className="col-span-2">
                    <button onClick={() => handleRemoveRule(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full flex justify-center">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddRule}
                className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${isDark ? 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'}`}
              >
                <Plus size={16} /> Adicionar Nova Faixa
              </button>
            </div>

            <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
               <button onClick={() => setEditingRules(null)} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                 Cancelar
               </button>
               <button 
                 onClick={() => updateUser(editingRules._id, { regrasPreco: editingRules.regrasPreco })}
                 className={`px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all`}
               >
                 Salvar Regras
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DO USUÁRIO */}
      {viewingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#121620] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <UserCheck size={20} className="text-blue-500" /> Detalhes do Usuário
               </h3>
               <button onClick={() => setViewingDetails(null)} className={`p-2 rounded-lg hover:bg-slate-500/10 transition-colors`}>
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                 <div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20 mb-3">
                   {viewingDetails.nome.charAt(0).toUpperCase()}
                 </div>
                 <h4 className="font-bold text-xl">{viewingDetails.nome}</h4>
                 <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{viewingDetails.email}</p>
                 <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>CPF: {viewingDetails.cpf}</p>
              </div>

              {loadingDetails ? (
                <div className="py-8 text-center text-slate-500 animate-pulse">Carregando informações...</div>
              ) : userDetails ? (
                <div className={`p-4 rounded-xl space-y-3 ${isDark ? 'bg-[#0B0E14] border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Data de Cadastro:</span>
                    <span className="font-bold">{new Date(userDetails.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Último Acesso:</span>
                    <span className="font-bold">
                      {userDetails.ultimoAcesso ? new Date(userDetails.ultimoAcesso).toLocaleString('pt-BR') : 'Nunca'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Etiquetas Geradas:</span>
                    <span className="font-bold text-emerald-500">{userDetails.etiquetasCount} envios</span>
                  </div>
                </div>
              ) : null}

              <div className={`p-4 rounded-xl border border-red-500/30 ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
                 <h5 className="text-sm font-bold text-red-500 mb-2">Ações de Segurança</h5>
                 <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                   Ao resetar a senha, uma nova senha aleatória será gerada e exibida abaixo. O usuário perderá o acesso com a senha antiga.
                 </p>
                 
                 {newPassword ? (
                   <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
                     <p className="text-xs font-bold text-emerald-500 mb-1">Nova Senha Gerada:</p>
                     <p className="text-xl font-black text-emerald-400 tracking-widest select-all">{newPassword}</p>
                     <p className="text-[10px] text-emerald-500/70 mt-2">Copie e envie para o usuário.</p>
                   </div>
                 ) : (
                   <button 
                     onClick={handleResetPassword}
                     className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20"
                   >
                     Resetar Senha do Usuário
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

