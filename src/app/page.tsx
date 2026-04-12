import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Porque from "@/components/Porque";
import ComoFunciona from "@/components/ComoFunciona";
import Totem from "@/components/Totem";
import Contato from "@/components/Contato";
import LenisProvider from "@/components/LenisProvider";

export default function Home() {
  return (
    <LenisProvider>
      <div className="relative flex flex-col overflow-hidden min-h-screen">
        {/* Fundo: blobs animados DS1 */}
        <div className="hero-bg-blobs" aria-hidden="true">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <Navbar />
        
        <main className="flex-1 w-full relative z-[1]">
          <Hero />
          <Porque />
          <ComoFunciona />
          <Totem />
          <Contato />
          {/* Âncoras invisíveis */}
          <span id="cadastro" className="sr-only">Cadastro</span>
        </main>
      </div>
    </LenisProvider>
  );
}
