"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#prole", label: "Os filhos" },
  { href: "#sobre", label: "Sobre o Touro" },
  { href: "#reservar", label: "Valores" },
  { href: "#contato", label: "Contato" },
];

export default function TopBar() {
  const [comFundo, setComFundo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const barraRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function aoRolar() {
      setComFundo(window.scrollY > 40);
    }
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // sair do menu pelo teclado ou clicando fora (controle e liberdade do usuário)
  useEffect(() => {
    if (!menuAberto) return;

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuAberto(false);
        botaoRef.current?.focus();
      }
    }
    function aoClicarFora(e: MouseEvent) {
      if (barraRef.current && !barraRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("mousedown", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("mousedown", aoClicarFora);
    };
  }, [menuAberto]);

  return (
    <div className={`navbar-valor${comFundo ? " com-fundo" : ""}`} ref={barraRef}>
      <div className="navbar-valor-inner">
        <a href="#top" className="navbar-logo" aria-label="Valor Assessoria Pecuária: voltar ao topo">
          <img
            src="/images/logo-navbar.png"
            alt="Valor Assessoria Pecuária"
            className="logo-mono"
            width={120}
            height={42}
          />
        </a>

        <nav className="navbar-links" aria-label="Navegação principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-extra">
          <ThemeToggle />
          <button
            type="button"
            ref={botaoRef}
            className="navbar-hamburger"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="navbar-mobile" id="menu-mobile" aria-label="Navegação móvel">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuAberto(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
