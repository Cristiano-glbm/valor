"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import {
  gravarConsentimento,
  lerConsentimento,
  revogarConsentimento,
  type Consentimento as Escolha,
} from "@/lib/consentimento";
import { atualizarConsentimentoNasTags, GA_ID, META_PIXEL_ID, rastrear } from "@/lib/tracking";

/**
 * Banner de consentimento + carregamento das tags (LGPD art. 8º).
 *
 * As tags de GA4 e Meta Pixel só entram na página DEPOIS do aceite — não é
 * "carrega e depois desliga o cookie", é não carregar mesmo. Quem recusa
 * navega sem nenhum script de terceiro.
 */
export default function Consentimento() {
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [decidiu, setDecidiu] = useState(true); // evita piscar o banner na hidratação
  const [detalhes, setDetalhes] = useState(false);

  useEffect(() => {
    const atual = lerConsentimento();
    setEscolha(atual);
    setDecidiu(atual !== null);
  }, []);

  const decidir = useCallback((analytics: boolean, marketing: boolean) => {
    const nova = gravarConsentimento(analytics, marketing);
    setEscolha(nova);
    setDecidiu(true);
    atualizarConsentimentoNasTags(analytics, marketing);
    if (analytics) {
      // primeira visualização depois do aceite
      setTimeout(() => rastrear("ver_pagina", { pagina: window.location.pathname }), 300);
    }
  }, []);

  const reabrir = useCallback(() => {
    revogarConsentimento();
    setEscolha(null);
    setDecidiu(false);
  }, []);

  const podeCarregarTags = escolha?.analytics === true;

  return (
    <>
      {podeCarregarTags && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: '${escolha?.marketing ? "granted" : "denied"}',
                ad_user_data: '${escolha?.marketing ? "granted" : "denied"}',
                ad_personalization: '${escolha?.marketing ? "granted" : "denied"}'
              });
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {podeCarregarTags && escolha?.marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {!decidiu && (
        <div className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-titulo">
          <div className="consent-conteudo">
            <div>
              <p className="consent-titulo" id="consent-titulo">
                Este site usa cookies de medição
              </p>
              <p className="consent-texto">
                Usamos para entender de onde vêm as visitas e melhorar a página. Nada disso é
                necessário para comprar, e você pode recusar sem perder nenhuma função.{" "}
                <button type="button" className="consent-link" onClick={() => setDetalhes((v) => !v)}>
                  {detalhes ? "Ver menos" : "O que é coletado?"}
                </button>
              </p>
              {detalhes && (
                <ul className="consent-lista">
                  <li>
                    <b>Necessários</b> — fazem o site funcionar (tema escolhido, sua sessão de
                    compra). Sempre ativos e não identificam você.
                  </li>
                  <li>
                    <b>Medição</b> — Google Analytics, com IP anonimizado: quantas pessoas
                    visitam e quais seções interessam.
                  </li>
                  <li>
                    <b>Publicidade</b> — Meta Pixel: mede o resultado dos anúncios no Instagram e
                    Facebook.
                  </li>
                </ul>
              )}
            </div>

            <div className="consent-botoes">
              <button type="button" className="consent-btn consent-btn-recusar" onClick={() => decidir(false, false)}>
                Recusar
              </button>
              <button type="button" className="consent-btn consent-btn-so-medicao" onClick={() => decidir(true, false)}>
                Só medição
              </button>
              <button type="button" className="consent-btn consent-btn-aceitar" onClick={() => decidir(true, true)}>
                Aceitar tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {decidiu && (
        <button type="button" className="consent-reabrir" onClick={reabrir}>
          Preferências de cookies
        </button>
      )}
    </>
  );
}
