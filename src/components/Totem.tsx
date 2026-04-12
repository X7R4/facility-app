"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PackageCheck, Truck, MousePointerClick } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the model-viewer component wrapper so it only runs on the client
const ModelViewer = dynamic(() => import("./ModelViewerWrapper").then(m => m.default), {
  ssr: false,
});

export default function Totem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.from("[data-totem-el]", {
        scrollTrigger: {
          trigger: "#totem",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section
      id="totem"
      ref={sectionRef}
      className="relative z-10 min-h-[100svh] flex flex-col justify-center snap-center py-24 lg:py-32 overflow-hidden bg-[#0f172a] border-t border-slate-800 text-white"
    >
      {/* Fundo Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Texto / Explicação */}
          <div className="lg:col-span-5 order-2 lg:order-1" data-totem-el>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Para Moradores
            </div>

            <h2 className="text-3xl font-black sm:text-4xl lg:text-4xl xl:text-5xl tracking-tight text-white mb-6 leading-tight">
              A revolução logística <br />
              no seu{" "}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent italic">
                Condomínio.
              </span>
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">
              Nossa solução vai até onde você está. Evite filas e trânsito para devolver encomendas do{" "}
              <strong>Mercado Livre</strong> e <strong>Shopee</strong>. É só ir até a portaria.
            </p>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-md shadow-lg shadow-black/20 hover:border-blue-500/30 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-teal-400">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-100 mb-1">Postagem Simples</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Deposite devoluções de forma segura na portaria.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-md shadow-lg shadow-black/20 hover:border-teal-500/30 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-blue-400">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-100 mb-1">Coleta Garantida</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    O parceiro Facility mais próximo fará o recolhimento com velocidade.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem de Contexto */}
          <div className="lg:col-span-3 order-3 lg:order-2 hidden md:block" data-totem-el>
            <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-[480px] rounded-[2rem] overflow-hidden border border-slate-700/50 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
              <img
                src="/Gemini_Generated_Image_kb6b3kkb6b3kkb6b.png"
                alt="Totem operando no condomínio"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-slate-600/50 shadow-xl shadow-black/50">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest whitespace-nowrap">
                  Em operação
                </span>
              </div>
            </div>
          </div>

          {/* Totem 3D Viewer */}
          <div className="lg:col-span-4 order-1 lg:order-3 w-full flex justify-center" data-totem-el>
            <div className="relative w-full max-w-[280px] lg:max-w-full aspect-[4/5] lg:h-[540px] rounded-[3rem] p-1 bg-gradient-to-br from-slate-700 to-slate-900 shadow-[0_0_80px_rgba(11,87,208,0.15)] group mt-8 lg:mt-0 lg:-ml-6 z-20">
              <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-[#0a0f1c] relative shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-700"></div>

                <ModelViewer />

                {/* Dica visual flutuante */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700/50 px-3 py-1.5 text-[10px] font-bold text-slate-300 flex items-center gap-2 pointer-events-none tracking-wide uppercase whitespace-nowrap">
                  <MousePointerClick className="w-3 h-3 text-blue-400" />
                  Arraste para girar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
