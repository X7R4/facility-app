import { useState, useRef, useEffect } from "react";
import { Barcode } from "lucide-react";

export default function ViewReversa({ isDark }: { isDark: boolean }) {
  const [typedCode, setTypedCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus effect to look like an operational tool
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8 pb-8 text-center">
      <div className="mb-10">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30 text-white'}`}>
           <Barcode size={36} className="text-white" />
        </div>
        <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Logística Reversa</h2>
        <p className={`text-base mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bipe ou digite o código de autorização.</p>
      </div>

      <div className="relative max-w-lg mx-auto">
         <input 
            ref={inputRef}
            type="text" 
            value={typedCode}
            onChange={(e) => setTypedCode(e.target.value)}
            placeholder="Aguardando Bipagem..." 
            className={`w-full py-6 text-center text-2xl tracking-[0.2em] font-bold rounded-2xl border-2 transition-all outline-none focus:ring-4 focus:border-indigo-500 ${isDark ? 'bg-[#121620] border-slate-700 text-white placeholder:text-slate-600 focus:ring-indigo-500/20' : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-300 focus:ring-indigo-500/20'}`}
         />
      </div>

      <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg border border-slate-800 hover:scale-[0.98] transition-all">
         Validar Código Reversa ↵
      </button>

      <div className={`text-xs font-semibold p-4 rounded-xl mt-10 opacity-70 ${isDark ? 'bg-[#121620] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
        Seu leitor de código de barras deve simular a tecla "Enter" após a bipagem.
      </div>
    </div>
  );
}
