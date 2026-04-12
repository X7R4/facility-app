"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, PlayCircle, ShieldCheck, Tags, Store, TrendingUp } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoZoneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Entrada da animação hero
    if (!prefersReducedMotion && heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.set(els, { autoAlpha: 0, y: 20 });
      gsap.to(els, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.2,
      });
    }



    // Video Proximity Logic
    const video = videoRef.current;
    const videoZone = videoZoneRef.current;
    const PROXIMITY_MARGIN = 110;
    let videoNearActive = false;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;

    if (video) {
        video.muted = true;
        video.playsInline = true;
    }

    const setVideoPlaying = (shouldPlay: boolean) => {
      if (!video || prefersReducedMotion) return;
      if (shouldPlay === videoNearActive) return;
      videoNearActive = shouldPlay;
      if (shouldPlay) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const isPointerNearVideoZone = (clientX: number, clientY: number) => {
      if (!videoZone) return false;
      const r = videoZone.getBoundingClientRect();
      const left = r.left - PROXIMITY_MARGIN;
      const right = r.right + PROXIMITY_MARGIN;
      const top = r.top - PROXIMITY_MARGIN;
      const bottom = r.bottom + PROXIMITY_MARGIN;
      return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
    };

    const onPointerMove = (ev: PointerEvent | MouseEvent) => {
      lastPointerX = ev.clientX;
      lastPointerY = ev.clientY;
      setVideoPlaying(isPointerNearVideoZone(ev.clientX, ev.clientY));
    };

    if (video && videoZone && !prefersReducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      videoZone.addEventListener("pointerenter", () => setVideoPlaying(true));
      videoZone.addEventListener("pointerleave", () => {
        requestAnimationFrame(() => {
          if (lastPointerX == null || lastPointerY == null) {
            setVideoPlaying(false);
            return;
          }
          setVideoPlaying(isPointerNearVideoZone(lastPointerX, lastPointerY));
        });
      });
      window.addEventListener("blur", () => setVideoPlaying(false));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) setVideoPlaying(false);
      });
      document.documentElement.addEventListener("mouseleave", () => setVideoPlaying(false));
    }

    const primeVideoFirstFrame = () => {
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        const playAttempt = video.play();
        if (playAttempt !== undefined) {
             playAttempt.catch(() => {
                 try {
                     video.currentTime = 0.001;
                 } catch (e2) {}
             })
        }
    }
    
    if (video) {
        video.addEventListener('loadedmetadata', primeVideoFirstFrame, { once: true });
        primeVideoFirstFrame(); // trigger immediately 
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative z-[2] flex flex-col justify-center min-h-[100svh] snap-center" ref={heroRef} id="hero">
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-10 px-4 pb-10 pt-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-16 lg:pt-28">
        {/* Coluna de texto */}
        <div className="relative z-[3] lg:col-span-6 mt-8 sm:mt-0">
          <div className="hero-pill mb-6 lg:mb-8" data-hero-el>
            <span className="pulse-dot" aria-hidden="true"></span>
            Operação inteligente para pontos de Coleta
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" id="heroHeadline">
            <span className="hero-headline-line">Envie mais.</span>
            <span className="hero-headline-line">Lucre mais.</span>
            <span className="hero-headline-line">Sem complicação.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl" data-hero-el>
            Gere etiquetas, organize coletas e envios no mesmo painel e ganhe eficiência para escalar sua margem — feito
            para quem vive de volume e precisa de confiança.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" data-hero-el>
            <div className="btn-beam-container w-full sm:w-auto justify-center sm:justify-start">
              <div className="beam-border" aria-hidden="true"></div>
              <a className="btn-inner-primary w-full justify-center sm:w-auto" href="#cadastro">
                Testar agora
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </div>
            <a className="btn-ghost w-full justify-center sm:w-auto" href="#como">
              Ver como funciona
              <PlayCircle className="h-[18px] w-[18px] text-ds-blue" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Coluna do vídeo */}
        <div className="relative z-[2] lg:col-span-6 w-full flex justify-center">
          <div className="hero-device relative w-full max-w-lg lg:max-w-none" id="videoProximityZone" ref={videoZoneRef}>
            <div
              className="hero-device__screen cursor-pointer"
              id="videoFrame"
              title="Clique para reproduzir ou pausar"
              onClick={toggleVideo}
            >
              <video
                ref={videoRef}
                id="heroVideo"
                className="hero-video-el"
                playsInline
                muted
                loop
                autoPlay
                preload="auto"
                tabIndex={-1}
              >
                <source src="/video.mp4" type="video/mp4" />
              </video>
              <div className="hero-device__glass-shine" aria-hidden="true"></div>
            </div>

            <div className="video-badge-row absolute -left-2 top-6 hidden sm:block lg:-left-4" aria-hidden="true">
              <div className="rounded-full border border-white/50 bg-white/90 px-4 py-2 text-xs font-extrabold shadow-lg shadow-slate-900/5 backdrop-blur-md">
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  + margem
                </span>
                <span className="text-slate-600"> operacional</span>
              </div>
            </div>
            <div className="video-badge-row absolute -right-1 bottom-10 hidden sm:block lg:-right-2" aria-hidden="true">
              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Confiança</p>
                  <p className="text-sm font-bold text-slate-800">Ganhos Garantidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carrossel */}
        <div className="relative z-[3] col-span-1 lg:col-span-12 w-full mt-4 lg:mt-6 mb-8 lg:mb-0">
          <div
            className="w-full overflow-hidden rounded-full border border-slate-200/90 bg-white/60 py-3 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md trust-marquee-mask"
            aria-label="Destaques da plataforma"
          >
            <div className="trust-marquee-track" data-marquee-track>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div
                  key={i}
                  className="trust-marquee-group text-sm font-semibold text-slate-600 whitespace-nowrap sm:text-[0.9375rem]"
                  aria-hidden={i !== 1}
                >
                  <span className="inline-flex items-center gap-2">
                    <Tags className="h-4 w-4 shrink-0 text-teal-500" aria-hidden="true" />
                    Emissão Rápida de etiquetas
                  </span>
                  <span className="select-none text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Store className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                    Pensado para Pontos de coleta
                  </span>
                  <span className="select-none text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    Mais margem
                  </span>
                  <span className="select-none text-slate-300" aria-hidden="true">
                    ·
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
