import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança (ISO 27001 A.8.9 gestão de configuração,
 * A.8.23 filtragem web, A.5.14 transferência segura).
 *
 * A Content-Security-Policy libera exatamente os domínios de que o site
 * precisa — Google Fonts, GA4 e Meta Pixel — e nada além disso.
 *
 * Nota honesta sobre `'unsafe-inline'` em script-src: o Next injeta scripts
 * inline de hidratação e as tags de analytics também são inline. Tirar isso
 * exige CSP com nonce gerado por middleware em toda requisição de página.
 * Está anotado como próximo passo no documento de segurança; o restante da
 * política (object-src, base-uri, form-action, frame-ancestors) já fecha os
 * vetores mais explorados.
 */
const ehDesenvolvimento = process.env.NODE_ENV === "development";

// Em desenvolvimento o Next precisa de 'unsafe-eval' e de websocket para o
// hot reload. Sem essa exceção o React nem hidrata em dev — e a página fica
// estática, sem menu, sem carrossel e sem checkout. Em produção, nada disso
// é liberado.
const scriptDev = ehDesenvolvimento ? " 'unsafe-eval'" : "";
const conexaoDev = ehDesenvolvimento ? " ws://localhost:* http://localhost:*" : "";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${scriptDev} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  "media-src 'self'",
  `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://connect.facebook.net https://graph.facebook.com${conexaoDev}`,
  "frame-src https://www.facebook.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(ehDesenvolvimento ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const CABECALHOS_SEGURANCA = [
  { key: "Content-Security-Policy", value: CSP },
  // HSTS: só faz efeito em HTTPS; 2 anos, subdomínios incluídos
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    // Em produção remove console.log de depuração, mas PRESERVA a trilha de
    // auditoria (info/warn/error), que é exigência de A.8.15 — sem esse
    // exclude, os registros de segurança sumiriam do build de produção.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn", "info"] } : false,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: CABECALHOS_SEGURANCA,
      },
      {
        // mídia é imutável: nome do arquivo muda quando o conteúdo muda
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
