import { useState, useRef } from "react";
import gsap from "gsap";
import { Package, Truck, Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Form states
  const [largura, setLargura] = useState("20");
  const [altura, setAltura] = useState("20");
  const [comprimento, setComprimento] = useState("20");
  const [peso, setPeso] = useState("500");
  const [cepOrigem, setCepOrigem] = useState("13206305");
  const [cepDestino, setCepDestino] = useState("");

  const API_BASE = "http://localhost:4000";

  const performQuote = async () => {
    if (!cepDestino || cepDestino.replace(/\D/g, "").length < 8) {
      alert("Por favor, preencha o CEP de destino corretamente.");
      return;
    }

    setIsLoading(true);
    setQuoted(false);

    try {
      const payload = {
        idLote: "1",
        parametrosProduto: [
          {
            coProduto: "03220", // SEDEX
            nuRequisicao: "1",
            nuContrato: "9912721364",
            nuDR: 20,
            cepOrigem: cepOrigem.replace(/\D/g, ""),
            cepDestino: cepDestino.replace(/\D/g, ""),
            psObjeto: peso,
            tpObjeto: "2",
            comprimento: comprimento,
            largura: largura,
            altura: altura,
            vlDeclarado: "0",
            dtEvento: new Date().toLocaleDateString('pt-BR')
          },
          {
            coProduto: "03298", // PAC
            nuRequisicao: "2",
            nuContrato: "9912721364",
            nuDR: 20,
            cepOrigem: cepOrigem.replace(/\D/g, ""),
            cepDestino: cepDestino.replace(/\D/g, ""),
            psObjeto: peso,
            tpObjeto: "2",
            comprimento: comprimento,
            largura: largura,
            altura: altura,
            vlDeclarado: "0",
            dtEvento: new Date().toLocaleDateString('pt-BR')
          }
        ]
      };

      const res = await fetch(`${API_BASE}/consulta/simularFrete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('facility_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (Array.isArray(data)) {
        setResults(data);
        setQuoted(true);
        setTimeout(() => {
          if (resultsRef.current) {
            gsap.fromTo(resultsRef.current.children, 
              { opacity: 0, scale: 0.9, y: 20 }, 
              { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }
            );
          }
        }, 50);
      } else {
        alert("Erro ao calcular frete: " + (data.mensagem || "Erro desconhecido"));
      }
    } catch (err) {
      console.error("Erro na cotação:", err);
      alert("Falha de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
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
                  <InputField placeholder="00" isDark={isDark} value={largura} onChange={(e: any) => setLargura(e.target.value)} />
               </div>
               <div>
                  <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Altura (cm)</label>
                  <InputField placeholder="00" isDark={isDark} value={altura} onChange={(e: any) => setAltura(e.target.value)} />
               </div>
               <div>
                  <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Compr. (cm)</label>
                  <InputField placeholder="00" isDark={isDark} value={comprimento} onChange={(e: any) => setComprimento(e.target.value)} />
               </div>
             </div>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Peso Estimado (g)</label>
                <InputField placeholder="Ex: 500" isDark={isDark} value={peso} onChange={(e: any) => setPeso(e.target.value)} />
             </div>
          </div>

          {/* DESTINO */}
          <div className="space-y-4">
             <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Truck size={16} /> Localidade
             </h3>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CEP Remetente</label>
                <InputField placeholder="00000-000" isDark={isDark} value={cepOrigem} onChange={(e: any) => setCepOrigem(e.target.value)} />
             </div>
             <div>
                <label className={`text-xs font-semibold mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CEP Destinatário</label>
                <InputField placeholder="00000-000" isDark={isDark} value={cepDestino} onChange={(e: any) => setCepDestino(e.target.value)} />
             </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-dashed flex justify-end items-center gap-4 border-slate-200 dark:border-slate-800">
           <button 
            onClick={performQuote} 
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 flex items-center gap-2`}
           >
             {isLoading && <Loader2 size={18} className="animate-spin" />}
             {isLoading ? "Calculando..." : "Calcular Fretes"}
           </button>
        </div>
      </div>

      {quoted && (
        <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
           {results.map((res: any) => (
             <QuoteCard 
                key={res.nuRequisicao}
                service={res.coProduto === "03220" ? "SEDEX - Correios" : "PAC - Correios"} 
                days={`${res.prazoEntrega || '?'} dias úteis`} 
                price={`R$ ${parseFloat(res.pcFinal || "0").toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                margin={`R$ ${(parseFloat(res.pcFinal || "0") - parseFloat(res.custoParaUsuario || res.pcFinal)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                isDark={isDark} 
                highlight={res.coProduto === "03220"} 
             />
           ))}
        </div>
      )}
    </div>
  );
}

