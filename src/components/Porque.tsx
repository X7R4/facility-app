"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Zap, MapPin, TrendingUp } from "lucide-react";

export default function Porque() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && sectionRef.current) {
      // Fade in do header
      gsap.from("[data-benefit-header]", {
        scrollTrigger: {
          trigger: "#porque",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });

      // Stagger entrance nos cards
      gsap.from("[data-benefit-el]", {
        scrollTrigger: {
          trigger: "#porque",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 60,
        scale: 0.95,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
      });
    }

    // Flashlight Effect (Mouse tracking)
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".benefit-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="porque"
      ref={sectionRef}
      className="relative z-10 min-h-[100svh] flex flex-col justify-center snap-center py-24 lg:py-32 overflow-hidden bg-white/30 backdrop-blur-sm border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header da Seção */}
        <div className="text-center mb-16 lg:mb-24" data-benefit-header>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Vantagens Exclusivas
          </div>
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight text-slate-900 mb-6">
            Porque escolher a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent italic">
              Facility?
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Uma plataforma completa, desenvolvida para simplificar sua logística e maximizar a lucratividade do seu
            ponto de coleta através de tecnologia de ponta.
          </p>
        </div>

        {/* Grid de Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Card 1: Emissão Rápida */}
          <div
            className="benefit-card flashlight-card rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/50 bg-white/40 shadow-xl shadow-slate-900/5 cursor-default group"
            data-benefit-el
          >
            <div className="relative z-10">
              <div className="benefit-icon-wrapper mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Zap className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Emissão Rápida de Etiquetas
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Gere etiquetas oficiais em segundos. Nossa interface é desenhada para alta performance, poupando o que
                você tem de mais precioso: tempo.
              </p>
            </div>
          </div>

          {/* Card 2: Pontos de Coleta */}
          <div
            className="benefit-card flashlight-card rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/50 bg-white/40 shadow-xl shadow-slate-900/5 cursor-default group"
            data-benefit-el
          >
            <div className="relative z-10">
              <div className="benefit-icon-wrapper mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <MapPin className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Pensado para Pontos de Coleta
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Fluxos exclusivos para quem opera balcão. Controle total de recebimento e triagem com ferramentas de
                gestão que o mercado não oferece.
              </p>
            </div>
          </div>

          {/* Card 3: Margem de Lucro */}
          <div
            className="benefit-card flashlight-card rounded-[2.5rem] p-8 lg:p-10 border border-slate-200/50 bg-white/40 shadow-xl shadow-slate-900/5 cursor-default group"
            data-benefit-el
          >
            <div className="relative z-10">
              <div className="benefit-icon-wrapper mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-600/25">
                <TrendingUp className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Mais Margem de Lucro</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Escalabilidade real. Reduza custos de operação e aproveite as melhores taxas de repasse do setor,
                transformando seu ponto em uma máquina de lucro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
