import { TOURO } from "@/lib/produto-semen";

export default function ConfiraFonte() {
  return (
    <section className="semen-section faixa">
      <div className="inner">
        <h2>Confira na fonte antes de comprar</h2>
        <p className="lead">
          O Pontual fica alojado na central ABS. A ficha dele é pública: DEPs, acurácia,
          percentil e genealogia, no site da própria ABS. Não somos nós dizendo que ele é bom.
        </p>
        <p>
          <a className="link-fonte" href={TOURO.linkAbsBullSearch} target="_blank" rel="noopener">
            Ver a ficha do touro {TOURO.codigoSemen} no ABS Bull Search
          </a>{" "}
          ·{" "}
          <a className="link-fonte" href={TOURO.linkAbczConsultaPublica} target="_blank" rel="noopener">
            Consultar o RGD {TOURO.rgd} na ABCZ
          </a>
        </p>
        <p style={{ marginTop: "1.6rem", fontSize: "0.95rem", color: "var(--cinza-texto)" }}>
          A ABS aloja o touro, mas não vende o sêmen dele. A comercialização é exclusiva da
          Valor Assessoria Pecuária. Não tem esse sêmen em loja de central nem em marketplace.
        </p>
      </div>
    </section>
  );
}
