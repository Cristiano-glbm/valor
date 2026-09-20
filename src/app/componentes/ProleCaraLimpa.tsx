"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rastrear } from "@/lib/tracking";

type Slide =
  | { tipo: "imagem"; src: string; alt: string }
  | { tipo: "video"; src: string; poster: string; alt: string };

const SLIDES: Slide[] = [
  {
    tipo: "video",
    src: "/videos/prole-04.mp4",
    poster: "/images/prole-video-04-poster.jpg",
    alt: "Vídeo dos bezerros filhos do Pontual caminhando no curral",
  },
  {
    tipo: "imagem",
    src: "/images/prole-01.jpg",
    alt: "Bezerros filhos do Pontual em vacas cara-limpa, de costas, no curral",
  },
  {
    tipo: "imagem",
    src: "/images/prole-02.jpg",
    alt: "Bezerros filhos do Pontual em vacas cara-limpa, de frente, no curral com pasto ao fundo",
  },
  {
    tipo: "video",
    src: "/videos/prole-01.mp4",
    poster: "/images/prole-video-01-poster.jpg",
    alt: "Vídeo dos bezerros filhos do Pontual em vacas cara-limpa, pastejando no pasto",
  },
  {
    tipo: "video",
    src: "/videos/prole-02.mp4",
    poster: "/images/prole-video-02-poster.jpg",
    alt: "Vídeo dos bezerros filhos do Pontual em vacas cara-limpa, reunidos no curral",
  },
  {
    tipo: "video",
    src: "/videos/prole-03.mp4",
    poster: "/images/prole-video-03-poster.jpg",
    alt: "Vídeo do lote de filhos do Pontual em vacas cara-limpa, a campo aberto",
  },
];

const DISTANCIA_SWIPE = 45;

export default function ProleCaraLimpa() {
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(true);
  const [movimentoReduzido, setMovimentoReduzido] = useState(false);
  const [tocando, setTocando] = useState(false);
  // os navegadores só deixam o vídeo começar sozinho sem som; o visitante
  // liga o áudio no botão e a escolha vale para os vídeos seguintes
  const [comSom, setComSom] = useState(false);

  // Referência para TODOS os vídeos, e não só para o ativo. Antes o ref era
  // anexado apenas ao slide atual, então o vídeo anterior perdia a referência
  // e nunca era pausado — era isso que causava o áudio sobreposto.
  const videosRef = useRef<Array<HTMLVideoElement | null>>([]);
  const telaRef = useRef<HTMLDivElement>(null);
  const toqueXRef = useRef<number | null>(null);
  const houveSwipeRef = useRef(false);
  const mediuRef = useRef(false);

  const irPara = useCallback((i: number) => {
    setIndice((i + SLIDES.length) % SLIDES.length);
  }, []);

  const proximo = useCallback(() => setIndice((i) => (i + 1) % SLIDES.length), []);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  // respeita quem pediu menos animação no sistema
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setMovimentoReduzido(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  // não gasta dados nem bateria com vídeo rodando fora da tela
  useEffect(() => {
    const el = telaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        setVisivel(entrada.isIntersecting);
        if (entrada.isIntersecting && !mediuRef.current) {
          mediuRef.current = true;
          rastrear("ver_filhos", { secao: "prole" });
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /**
   * Ao trocar de slide: pausa e rebobina TODOS os outros vídeos.
   * É o que impede dois áudios tocando ao mesmo tempo.
   */
  useEffect(() => {
    videosRef.current.forEach((video, i) => {
      if (!video || i === indice) return;
      video.pause();
      video.currentTime = 0;
    });
  }, [indice]);

  /** Toca o vídeo do slide atual (mudo, como o navegador exige). */
  useEffect(() => {
    const video = videosRef.current[indice];
    if (!video) {
      setTocando(false);
      return;
    }
    if (!visivel || movimentoReduzido) {
      video.pause();
      setTocando(false);
      return;
    }
    video.muted = !comSom;
    video.currentTime = 0;
    video
      .play()
      .then(() => setTocando(true))
      .catch(() => {
        // navegador recusou tocar com som: volta para mudo e tenta de novo
        video.muted = true;
        setComSom(false);
        video.play().then(() => setTocando(true)).catch(() => setTocando(false));
      });
    // comSom de propósito fora das dependências: mudar o som não deve
    // reiniciar o vídeo do começo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, visivel, movimentoReduzido]);

  /** Liga/desliga o som sem reiniciar o que já está tocando. */
  useEffect(() => {
    const video = videosRef.current[indice];
    if (video) video.muted = !comSom;
  }, [comSom, indice]);

  /** Clique ou toque na tela do vídeo pausa; clicando de novo, volta. */
  const alternarReproducao = useCallback(() => {
    const video = videosRef.current[indice];
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setTocando(true)).catch(() => setTocando(false));
    } else {
      video.pause();
      setTocando(false);
    }
  }, [indice]);

  function aoTeclar(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      proximo();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      anterior();
    } else if (e.key === " " || e.key === "Enter") {
      if (SLIDES[indice].tipo !== "video") return;
      e.preventDefault();
      alternarReproducao();
    }
  }

  const atual = SLIDES[indice];
  const ehVideo = atual.tipo === "video";

  return (
    <section className="semen-section" id="prole">
      <div className="inner">
        <h2>Filhos do Pontual a campo, em vacas cara-limpa</h2>
        <p className="lead">
          Fotos e vídeos reais, direto do curral e sem maquiagem. Bezerros uniformes, precoces,
          funcionais e bem conformados, mostrando na prática a consistência da genética do pai.
        </p>

        <div className="prole-carrossel">
          <div
            className="prole-tela"
            ref={telaRef}
            role="group"
            aria-roledescription="carrossel"
            aria-label="Fotos e vídeos dos filhos do Pontual"
            tabIndex={0}
            onKeyDown={aoTeclar}
            onTouchStart={(e) => {
              toqueXRef.current = e.changedTouches[0].clientX;
              houveSwipeRef.current = false;
            }}
            onTouchEnd={(e) => {
              const inicio = toqueXRef.current;
              if (inicio === null) return;
              const delta = e.changedTouches[0].clientX - inicio;
              if (Math.abs(delta) > DISTANCIA_SWIPE) {
                houveSwipeRef.current = true;
                if (delta < 0) proximo();
                else anterior();
              }
              toqueXRef.current = null;
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className={`prole-slide${i === indice ? " ativo" : ""}`}
                aria-hidden={i !== indice}
              >
                {slide.tipo === "imagem" ? (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : (
                  <video
                    ref={(el) => {
                      videosRef.current[i] = el;
                    }}
                    src={slide.src}
                    poster={slide.poster}
                    muted={!comSom}
                    playsInline
                    controls={movimentoReduzido}
                    preload="none"
                    aria-label={slide.alt}
                    onClick={() => {
                      // um swipe não deve pausar o vídeo junto
                      if (houveSwipeRef.current) {
                        houveSwipeRef.current = false;
                        return;
                      }
                      alternarReproducao();
                    }}
                    onPlay={() => i === indice && setTocando(true)}
                    onPause={() => i === indice && setTocando(false)}
                    onEnded={() => i === indice && setTocando(false)}
                  />
                )}
              </div>
            ))}

            {/* selo central de play: aparece quando o vídeo está parado */}
            {ehVideo && !tocando && !movimentoReduzido && (
              <button
                type="button"
                className="prole-play"
                aria-label="Reproduzir o vídeo"
                onClick={alternarReproducao}
              >
                <span aria-hidden="true">▶</span>
              </button>
            )}

            {ehVideo && (
              <button
                type="button"
                className="prole-som"
                aria-pressed={comSom}
                aria-label={comSom ? "Desligar o som do vídeo" : "Ligar o som do vídeo"}
                onClick={() => setComSom((v) => !v)}
              >
                <span aria-hidden="true">{comSom ? "🔊" : "🔇"}</span>
                <span className="prole-som-texto">{comSom ? "Som ligado" : "Ativar som"}</span>
              </button>
            )}

            <button
              type="button"
              className="prole-seta prole-seta-prev"
              aria-label="Item anterior"
              onClick={anterior}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="prole-seta prole-seta-next"
              aria-label="Próximo item"
              onClick={proximo}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="prole-dots">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ver item ${i + 1} de ${SLIDES.length}`}
                aria-current={i === indice}
                className={`prole-dot${i === indice ? " ativo" : ""}`}
                onClick={() => irPara(i)}
              />
            ))}
          </div>

          <p className="prole-contador" role="status" aria-live="polite">
            {indice + 1} de {SLIDES.length}
            {ehVideo ? (tocando ? " · vídeo tocando, toque para pausar" : " · vídeo pausado") : " · foto"}
          </p>
        </div>

        <p className="prole-legenda">{atual.alt}</p>
      </div>
    </section>
  );
}
