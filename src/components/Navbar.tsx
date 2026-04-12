"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onWinScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 8) setIsScrolled(true);
      else setIsScrolled(false);
    };
    onWinScroll();
    window.addEventListener("scroll", onWinScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onWinScroll);
    };
  }, []);

  return (
    <header className={`site-nav ${isScrolled ? "is-scrolled" : ""}`} id="siteNav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="flex shrink-0 items-center no-underline outline-none focus-visible:ring-2 focus-visible:ring-ds-blue/40 focus-visible:ring-offset-2 rounded-sm relative"
        >
          <img
            src="/assets/facility_envios_logo_v2-removebg-preview.png"
            alt="Facility Envios Logo"
            className="h-16 w-auto sm:h-20 md:h-24 object-contain object-left absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none"
            decoding="async"
          />
          {/* Espaçador invisível para manter o clique no link sem bugar o layout da nav */}
          <div className="h-9 w-32 sm:h-10 sm:w-40 md:h-11 md:w-48"></div>
        </a>

        <nav
          className="flex max-w-[48vw] items-center gap-3 overflow-x-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-none sm:gap-6 md:gap-8 [&::-webkit-scrollbar]:hidden"
          aria-label="Principal"
        >
          <a className="nav-link shrink-0" href="#porque">Porque escolher</a>
          <a className="nav-link shrink-0" href="#como">Como funciona</a>
          <a className="nav-link shrink-0" href="#totem">Solução para o seu Condomínio</a>
          <a className="nav-link shrink-0" href="#contato">Fale Conosco</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-login text-center inline-flex justify-center items-center no-underline">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
