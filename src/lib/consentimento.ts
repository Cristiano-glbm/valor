/**
 * Consentimento de cookies/rastreio (LGPD art. 8º).
 *
 * Regras que este módulo implementa:
 *  - nada de terceiros carrega antes do aceite (não existe "consentimento
 *    presumido por continuar navegando");
 *  - recusar é tão fácil quanto aceitar;
 *  - a escolha fica registrada com data e versão do texto, porque a lei exige
 *    que o consentimento seja demonstrável e revogável.
 */

export const VERSAO_CONSENTIMENTO = 1;
const CHAVE = "valor-consentimento";

export type Consentimento = {
  versao: number;
  analytics: boolean;
  marketing: boolean;
  em: string;
};

export function lerConsentimento(): Consentimento | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dado = JSON.parse(bruto) as Consentimento;
    // texto novo = consentimento precisa ser pedido de novo
    if (dado?.versao !== VERSAO_CONSENTIMENTO) return null;
    return dado;
  } catch {
    return null;
  }
}

export function gravarConsentimento(analytics: boolean, marketing: boolean): Consentimento {
  const dado: Consentimento = {
    versao: VERSAO_CONSENTIMENTO,
    analytics,
    marketing,
    em: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dado));
  } catch {
    /* navegador sem armazenamento: vale só para esta visita */
  }
  window.dispatchEvent(new CustomEvent("valor:consentimento", { detail: dado }));
  return dado;
}

export function revogarConsentimento() {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new CustomEvent("valor:consentimento", { detail: null }));
}

export function temConsentimentoMarketing(): boolean {
  return lerConsentimento()?.marketing === true;
}
