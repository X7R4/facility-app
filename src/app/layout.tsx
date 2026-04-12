import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facility Envios — Plataforma para pontos de coleta",
  description: "Etiquetas dos Correios, operação simplificada e mais margem para o seu ponto de coleta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth snap-y snap-mandatory">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans text-[#1a1a1a] bg-gradient-to-br from-[#ffffff] via-[#f0f9ff] to-[#f0fdf4]">
        {children}
      </body>
    </html>
  );
}
