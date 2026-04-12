"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { UserPlus, Layers, Rocket } from "lucide-react";

export default function ComoFunciona() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.from("[data-como-header]", {
        scrollTrigger: {
          trigger: "#como",
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      });

      const stepTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#como",
          start: "top 60%",
        },
      });

      stepTimeline
        .to("#stepLineProgress", {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        })
        .from(
          "[data-step-el]",
          {
            opacity: 0,
            y: 40,
            stagger: 0.3,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=1.2"
        );
    }
  }, []);

  return (
    <section
      id="como"
      ref={sectionRef}
      className="relative z-10 min-h-[100svh] flex flex-col justify-center snap-center py-24 lg:py-32 overflow-hidden bg-slate-50/50 border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header da Seção */}
        <div className="text-center mb-20 lg:mb-32" data-como-header>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
            Simples e Eficiente
          </div>
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight text-slate-900 mb-6">
            Logística simplificada em{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent italic">
              3 passos.
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed font-medium">
            Nossa plataforma foi desenhada para que você possa focar no que importa: o crescimento e a rentabilidade do
            seu negócio.
          </p>
        </div>

        {/* Timeline / Passos */}
        <div className="relative">
          {/* Linha Conectora (Desktop) */}
          <div className="absolute top-12 left-0 w-full h-[3px] bg-slate-200/60 hidden md:block" aria-hidden="true">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 scale-x-0 origin-left transition-transform duration-1000 ease-out"
              id="stepLineProgress"
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            {/* Passo 1: Conta */}
            <div className="flex flex-col items-center text-center group" data-step-el>
              <div className="step-node relative mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-slate-100 shadow-xl shadow-slate-900/5 group-hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white shadow-lg ring-4 ring-white">
                  01
                </div>
                <UserPlus className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="step-card flashlight-card rounded-[2.5rem] p-8 border border-slate-200/50 bg-white/40 shadow-lg shadow-slate-900/5 cursor-default">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Crie sua Conta</h3>
                <p className="text-slate-600 font-semibold leading-relaxed">
                  Cadastre seu ponto de coleta em poucos minutos. Nossa equipe valida seus dados rapidamente para
                  liberação imediata.
                </p>
              </div>
            </div>

            {/* Passo 2: Plano */}
            <div className="flex flex-col items-center text-center group" data-step-el>
              <div className="step-node relative mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-slate-100 shadow-xl shadow-slate-900/5 group-hover:border-teal-500/30 transition-all duration-500">
                <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-xs font-black text-white shadow-lg ring-4 ring-white">
                  02
                </div>
                <Layers className="h-10 w-10 text-teal-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="step-card flashlight-card rounded-[2.5rem] p-8 border border-slate-200/50 bg-white/40 shadow-lg shadow-slate-900/5 cursor-default">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Escolha seu Plano</h3>
                <p className="text-slate-600 font-semibold leading-relaxed">
                  Selecione a modalidade ideal para o volume de envios do seu balcão. Taxas competitivas que garantem
                  sua margem.
                </p>
              </div>
            </div>

            {/* Passo 3: Lucro */}
            <div className="flex flex-col items-center text-center group" data-step-el>
              <div className="step-node relative mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 border-4 border-slate-800 shadow-2xl shadow-blue-900/20 group-hover:border-blue-400 ripple-effect transition-all duration-500">
                <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white shadow-lg ring-4 ring-white">
                  03
                </div>
                <Rocket className="h-10 w-10 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div className="step-card flashlight-card rounded-[2.5rem] p-8 border border-slate-200/60 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-blue-500/10 cursor-default">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Gere e Lucre</h3>
                <p className="text-slate-600 font-semibold leading-relaxed">
                  Emita etiquetas oficiais, organize coletas e veja sua receita crescer em tempo real com transparência
                  total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
