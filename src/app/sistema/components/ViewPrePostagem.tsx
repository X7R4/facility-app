import { useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import InputField from "./InputField";

export default function ViewPrePostagem({ isDark }: { isDark: boolean }) {
  const [senderType, setSenderType] = useState<'fixed' | 'new' | 'existing'>('fixed');

  return (
    <div className="max-w-5xl space-y-6 pb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Emissão de Pré-Postagem</h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Preencha os dados completos para gerar a etiqueta oficial.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800/50">
         <button 
           onClick={() => setSenderType('fixed')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'fixed' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
         >
           Endereço Fixo (Ponto)
         </button>
         <button 
           onClick={() => setSenderType('existing')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'existing' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 '}`}
         >
           Cliente Cadastrado
         </button>
         <button 
           onClick={() => setSenderType('new')}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${senderType === 'new' ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
         >
           Novo Cliente
         </button>
      </div>

      <div className={`p-8 rounded-2xl border shadow-sm ${isDark ? 'bg-[#121620] border-slate-800/80' : 'bg-white border-slate-200'}`}>
        
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Remetente Lógica */}
            <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-400">
               <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">1</div>
                <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Remetente</h3>
              </div>

              {senderType === 'fixed' && (
                <div className={`p-4 rounded-xl border border-dashed text-sm flex flex-col gap-2 ${isDark ? 'bg-blue-500/5 border-blue-500/20 text-slate-400' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                  <p className="font-bold flex items-center gap-2"><CheckCircle2 size={16} /> Ponto de Coleta Facility</p>
                  <p>Avenida Paulista, 1000 - São Paulo, SP</p>
                  <p>CNPJ: 00.000.000/0001-00</p>
                </div>
              )}

              {senderType === 'existing' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Buscar cliente por nome ou CPF..." className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-[#0B0E14] border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div className={`p-4 rounded-xl border text-sm flex flex-col gap-2 opacity-50 ${isDark ? 'bg-slate-900 border-slate-800 italic' : 'bg-slate-50 border-slate-100 italic font-medium'}`}>
                    Selecione um cliente para carregar os dados...
                  </div>
                </div>
              )}

              {senderType === 'new' && (
                <div className="space-y-4">
                  <InputField label="Nome Completo" placeholder="João Exemplo" isDark={isDark} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="CPF / CNPJ" placeholder="000.000..." isDark={isDark} />
                    <InputField label="Telefone" placeholder="(00)..." isDark={isDark} />
                  </div>
                  <InputField label="Logradouro" placeholder="Rua..." isDark={isDark} />
                </div>
              )}

              {/* Destinatário */}
              <div className="pt-4 space-y-5">
                <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">2</div>
                  <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Destinatário</h3>
                </div>
                <InputField label="Nome Completo" placeholder="Ex: João da Silva" isDark={isDark} />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="CPF / CNPJ" placeholder="000.000.000-00" isDark={isDark} />
                  <InputField label="Telefone" placeholder="(00) 00000-0000" isDark={isDark} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <InputField label="CEP" placeholder="00000-000" isDark={isDark} />
                   <div className="col-span-2">
                     <InputField label="Logradouro" placeholder="Rua exemplo..." isDark={isDark} />
                   </div>
                </div>
              </div>
            </div>

            {/* Pacote e Declaração */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">3</div>
                <h3 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Pacote & Conteúdo</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                 <InputField label="Larg. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Alt. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Comp. (cm)" placeholder="0" isDark={isDark} />
                 <InputField label="Peso (kg)" placeholder="0" isDark={isDark} />
              </div>

              <div className={`p-4 rounded-xl border mt-2 ${isDark ? 'bg-[#0B0E14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Declaração de Conteúdo</h4>
                <div className="space-y-4">
                  <InputField label="Descrição do Item principal" placeholder="Ex: Camiseta de Algodão" isDark={isDark} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Quantidade" placeholder="1" type="number" isDark={isDark} />
                    <InputField label="Valor Unitário (R$)" placeholder="50,00" isDark={isDark} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between border-slate-200 dark:border-slate-800">
             <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-lg border flex items-center gap-3 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                  <input type="checkbox" id="av" className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                  <label htmlFor="av" className={`text-sm font-semibold cursor-pointer select-none ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Desejo Aviso de Recebimento (AR)</label>
                </div>
             </div>
             
             <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[0.98] transition-transform">
               Gerar Etiqueta & Resumo
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}
