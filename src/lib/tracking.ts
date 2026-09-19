import { lerConsentimento } from "./consentimento";

/**
 * Camada única de tracking do site.
 *
 * O resto do código chama `rastrear("clicar_whatsapp", {...})` e não precisa
 * saber se por baixo é GA4, Meta Pixel ou nenhum dos dois. Assim, trocar de
 * ferramenta (ou desligar tudo) é mexer só neste arquivo — e nenhum evento
 * escapa da checagem de consentimento.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** Eventos do funil. Nome em português no código, mapeado para o padrão de cada ferramenta. */
export type EventoTracking =
  | "ver_pagina"
  | "ver_filhos"
  | "usar_calculadora"
  | "escolher_quantidade"
  | "clicar_whatsapp"
  | "copiar_resumo";

type Parametros = Record<string, string | number | boolean | undefined>;

/** evento nosso -> (evento GA4, evento padrão do Meta) */
const MAPA: Record<EventoTracking, { ga4: string; meta?: string; metaPadrao?: boolean }> = {
  ver_pagina: { ga4: "page_view" },
  ver_filhos: { ga4: "view_item", meta: "ViewContent", metaPadrao: true },
  usar_calculadora: { ga4: "calculadora_usada", meta: "CalculadoraUsada" },
  escolher_quantidade: { ga4: "select_item", meta: "AddToCart", metaPadrao: true },
  // o "Prosseguir no WhatsApp" é a conversão do site: vale como Lead
  clicar_whatsapp: { ga4: "generate_lead", meta: "Lead", metaPadrao: true },
  copiar_resumo: { ga4: "share", meta: "CopiarResumo" },
};

function podeRastrear(): boolean {
  if (typeof window === "undefined") return false;
  return lerConsentimento()?.analytics === true;
}

/** Dispara o evento nas ferramentas ativas. Silencioso se não houver consentimento. */
export function rastrear(evento: EventoTracking, parametros: Parametros = {}) {
  if (!podeRastrear()) return;

  const destino = MAPA[evento];
  const limpos = Object.fromEntries(
    Object.entries(parametros).filter(([, v]) => v !== undefined && v !== ""),
  );

  try {
    if (GA_ID && typeof window.gtag === "function") {
      window.gtag("event", destino.ga4, { ...limpos, currency: "BRL" });
    }
  } catch {
    /* tracking nunca pode quebrar a página */
  }

  try {
    if (META_PIXEL_ID && typeof window.fbq === "function" && destino.meta) {
      const metodo = destino.metaPadrao ? "track" : "trackCustom";
      window.fbq(metodo, destino.meta, { ...limpos, currency: "BRL" });
    }
  } catch {
    /* idem */
  }
}

/**
 * Concede/revoga o consentimento nas ferramentas já carregadas
 * (Consent Mode v2 do Google e LDU do Meta).
 */
export function atualizarConsentimentoNasTags(analytics: boolean, marketing: boolean) {
  try {
    window.gtag?.("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  } catch {
    /* ignora */
  }
}
