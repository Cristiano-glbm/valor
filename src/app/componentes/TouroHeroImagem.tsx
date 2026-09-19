export default function TouroHeroImagem() {
  return (
    <header id="top" className="hero-valor">
      <div
        className="hero-valor-foto"
        role="img"
        aria-label="Pontual FIV St. Cruz, touro Nelore, de perfil no pasto"
      />

      <div className="hero-valor-conteudo">
        <div className="hero-valor-texto">
          <h1 className="hero-valor-titulo">
            <span className="l1">Pontual</span>
            <span className="l2">St. Cruz</span>
          </h1>

          <p className="hero-valor-sub">
            Qualidade de alto padrão para multiplicar seu rebanho com <u>excelência</u>.
          </p>

          <a href="#reservar" className="hero-valor-cta">
            Reservar doses
          </a>
        </div>
      </div>
    </header>
  );
}
