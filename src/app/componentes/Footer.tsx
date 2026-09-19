import { TOURO, CONDICOES_COMERCIAIS } from "@/lib/produto-semen";

function formatarTelefone(bruto: string) {
  const d = String(bruto).replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return bruto;
}

export default function Footer() {
  return (
    <footer id="contato">
      <img
        src="/images/logo-navbar.png"
        alt="Valor Assessoria Pecuária"
        className="logo-mono"
        width={160}
        height={56}
        style={{ height: 56, width: "auto", display: "block", margin: "0 auto 0.5rem" }}
      />
      <span className="footer-linha-ouro"></span>
      Comercialização exclusiva do sêmen do touro {TOURO.nome} (RGD {TOURO.rgd}).
      <br />
      Responsável: {CONDICOES_COMERCIAIS.responsavel} · WhatsApp{" "}
      <a className="link-fonte" href={`https://wa.me/${CONDICOES_COMERCIAIS.whatsappTelefone}`} target="_blank" rel="noopener noreferrer">
        {formatarTelefone(CONDICOES_COMERCIAIS.whatsappTelefone)}
      </a>
      <div style={{ marginTop: "0.8rem", fontSize: "0.8rem" }}>
        Dados técnicos conforme sumários oficiais PMGZ/ABCZ e Geneplus/Embrapa. Consulte as fontes
        públicas indicadas nesta página antes de comprar.
      </div>
      <div style={{ marginTop: "0.8rem" }}>© 2026 Valor Assessoria Pecuária. Todos os direitos reservados.</div>
    </footer>
  );
}
