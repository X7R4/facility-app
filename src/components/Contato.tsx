"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MessageCircle, MessageSquareText } from "lucide-react";

export default function Contato() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.from("[data-contato-el]", {
        scrollTrigger: {
          trigger: "#contato",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1.2,
        ease: "expo.out",
      });
    }
  }, []);

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="relative z-10 min-h-[100svh] flex flex-col justify-center snap-center py-24 lg:py-32 overflow-hidden bg-slate-50 border-t border-slate-200"
    >
      {/* Fundo Decorativo */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -ml-96 -mt-96 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/60 to-teal-100/50 rounded-full blur-[120px] opacity-80 border border-white"></div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center" data-contato-el>
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-white shadow-xl shadow-slate-200/50 mb-8 transform -rotate-3 hover:rotate-0 transition-transform">
          <MessageCircle className="h-10 w-10 text-blue-600 drop-shadow-md" />
        </div>

        <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl tracking-tight text-slate-900 mb-6 leading-tight">
          Pronto para <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">escalar seu Ponto?</span>
        </h2>

        <p className="text-lg text-slate-600 leading-relaxed font-semibold mb-12 max-w-2xl mx-auto tracking-wide">
          Fale diretamente com nossa equipe via WhatsApp. Entenda como podemos transformar sua operação logística e sua margem hoje mesmo.
        </p>

        <a
          href="https://wa.me/+5511975085859"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-black text-white bg-slate-900 overflow-hidden rounded-full shadow-[0_15px_40px_-10px_rgba(15,23,42,0.4)] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.6)] hover:scale-105 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20"
        >
          {/* Efeito Beam Light (Reflexo passando pelo botão) */}
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-15deg)_translateX(-150%)] group-hover:[transform:skew(-15deg)_translateX(150%)] transition-transform duration-1000 ease-in-out">
            <div className="w-16 h-full bg-white/20 blur-md"></div>
          </div>

          <MessageSquareText className="w-6 h-6 relative z-10 group-hover:-rotate-12 transition-transform" />
          <span className="relative z-10 text-lg uppercase tracking-widest whitespace-nowrap">Chamar no WhatsApp</span>
        </a>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          Equipe disponível agora
        </div>
      </div>
    </section>
  );
}
