"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Mail, Lock, User, Phone, FileText, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/auth";

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Elegant entrance animation for the main card container
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", delay: 0.3 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("Senhas não são semelhantes!");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      // Based on the provided backend logic, it returns HTTP 200 with { message: '...' } inside
      // So we need to check the message string, or simply check if res.ok
      if (!res.ok || (data.message && data.message !== 'Usuário registrado com sucesso!')) {
        setError(data.message || data.error || "Erro ao realizar o cadastro.");
        setLoading(false);
        return;
      }

      // Success transition
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          x: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setIsSuccess(true);
            setLoading(false);
          }
        });
      } else {
        setIsSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setError("Erro de conexão com o servidor. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }
      );
    }
  }, [isSuccess]);

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
        <Link href="/" onClick={() => setIsSuccess(false)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        {isSuccess ? (
          <div ref={successRef} className="w-full flex flex-col items-center justify-center py-8 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-teal-100 to-emerald-50 border-2 border-teal-200 shadow-[0_0_30px_rgba(20,184,166,0.2)] flex items-center justify-center">
              <CheckCircle size={48} className="text-teal-500 stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3 bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
              Cadastro Concluído!
            </h1>
            <p className="text-slate-500 text-sm font-medium mb-10 px-4">
              Usuário cadastrado com sucesso. Seja bem-vindo à operação inteligente da Facility Envios.
            </p>
            <Link 
              href="/auth/login" 
              className="w-full relative group overflow-hidden bg-slate-900 border border-slate-800 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_18px_48px_rgba(20,184,166,0.25)] flex items-center justify-center"
            >
              <span className="relative z-10">Acessar minha conta</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          </div>
        ) : (
          <div ref={formRef} className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Criar nova conta
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Junte-se à operação inteligente para pontos de coleta.
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome" 
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000" 
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">CNPJ / CPF</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00" 
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Repetir Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                  />
                </div>
              </div>

              <button disabled={loading} type="submit" className="mt-4 w-full relative group overflow-hidden bg-slate-900 border border-slate-800 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_18px_48px_rgba(11,87,208,0.22)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
                <span className="relative z-10">{loading ? "Processando..." : "Finalizar Cadastro"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            </form>
          </div>
        )}

        {!isSuccess && (
          <div className="mt-8 pt-6 border-t border-slate-200/50 text-center relative z-20">
            <p className="text-slate-500 text-sm font-medium">
              Já possui uma conta?
              <Link 
                href="/auth/login" 
                className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer outline-none"
              >
                Fazer login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
