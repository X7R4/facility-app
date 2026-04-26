import { useState, useEffect } from "react";
import { Search, UserPlus, Edit2, ChevronRight, ArrowLeft } from "lucide-react";
import InputField from "./InputField";

export default function ViewClientes({ isDark }: { isDark: boolean }) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('facility_token');
      try {
        const res = await fetch("http://localhost:4000/clientes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
           const data = await res.json();
           const dbClientes = data.map((c: any) => ({
             id: c._id,
             nome: c.nome,
             cpf: c.cpfCnpj,
             telefone: c.telefone,
             email: c.email || 'Não informado',
             endereco: `${c.endereco.logradouro}, ${c.endereco.numero} - ${c.endereco.bairro}, ${c.endereco.cidade}/${c.endereco.uf}`,
             etiquetas: c.etiquetas || 0,
             pref: 'N/A'
           }));
           setClientes(dbClientes);
        }
      } catch (err) {
        console.error("Erro ao buscar clientes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

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
         {loading && <div className="p-8 text-center text-sm font-bold text-slate-500">Carregando clientes...</div>}
         {!loading && clientes.length === 0 && <div className="p-8 text-center text-sm font-bold text-slate-500">Nenhum cliente cadastrado.</div>}
         {!loading && clientes.map((c, i) => (
           <div 
             key={c.id} 
             onClick={() => setSelectedClient(c)}
             className={`p-5 flex items-center justify-between group cursor-pointer transition-colors ${i === 0 ? 'rounded-t-2xl' : ''} ${i === clientes.length - 1 ? 'rounded-b-2xl' : ''} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
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
