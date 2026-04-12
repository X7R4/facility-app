import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Altere a porta 3000 abaixo se o seu backend rodar em outra porta!
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
