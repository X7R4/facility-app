"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Elegant entrance animation for the main card container
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Erro ao realizar login.");
        setLoading(false);
        return;
      }

      if (data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("facility_token", data.token);
        }
        router.push("/sistema");
      } else {
        setError("Retorno inválido do servidor.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erro de conexão com o banco de dados. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden px-4 py-20 bg-gradient-to-br from-[#ffffff] via-[#f0f9ff] to-[#f0fdf4]">
      {/* Background blobs simulating the aesthetic logic of ds1.html */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[min(400px,70vw)] h-[min(400px,70vw)] bg-blue-500 rounded-full blur-[80px] opacity-20 -top-[100px] -left-[100px] animate-[blob-move_20s_infinite_alternate]" />
        <div className="absolute w-[min(500px,85vw)] h-[min(500px,85vw)] bg-teal-500 rounded-full blur-[80px] opacity-20 -bottom-[150px] -right-[150px] animate-[blob-move_20s_infinite_alternate_reverse]" />
      </div>

      <div 
        ref={containerRef}
        className="relative z-10 w-full max-w-[440px] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.05)] rounded-[32px] p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(20,184,166,0.15)] hover:border-teal-400/40"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        {/* Dynamic Form Container */}
        <div ref={formRef} className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Acesse seu painel Facility Envios.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                />
              </div>
            </div>

            <div className="flex justify-end mt-[-4px]">
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Esqueceu a senha?</a>
            </div>

            <button disabled={loading} type="submit" className="mt-4 w-full relative group overflow-hidden bg-slate-900 border border-slate-800 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_18px_48px_rgba(11,87,208,0.22)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
              <span className="relative z-10">{loading ? "Entrando..." : "Entrar na plataforma"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/50 text-center relative z-20">
          <p className="text-slate-500 text-sm font-medium">
            Não possui uma conta?
            <Link 
              href="/auth/register" 
              className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer outline-none"
            >
              Criar conta agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
