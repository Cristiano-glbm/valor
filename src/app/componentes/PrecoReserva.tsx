"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TIERS,
  precoPorDose,
  TOURO,
  CONDICOES_ENTREGA,
  CONDICOES_COMERCIAIS,
} from "@/lib/produto-semen";
import { rastrear } from "@/lib/tracking";

/**
 * Simulador de pedido.
 *
 * Não existe checkout nem banco de dados: o visitante monta o pedido aqui,
 * vê o preço pela tabela de degraus e segue para o WhatsApp com tudo já
 * escrito. Quem fecha a venda é a pessoa do outro lado — o site só prepara
 * a conversa e evita o vai-e-vem de "quantas doses?" / "quanto fica?".
 */

const CHIPS = [60, 100, 200, 300, 500, 1000];
const QUANTIDADE_MAXIMA = 6500;

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function tierDe(q: number): (typeof TIERS)[number] {
  let atual: (typeof TIERS)[number] = TIERS[0];
  for (const t of TIERS) {
    if (q >= t.min) atual = t;
  }
  return atual;
}

/** Sugere o próximo degrau quando ele sai mais barato no total. */
function melhorSalto(q: number) {
  const atual = q * precoPorDose(q);
  let melhor: { qtd: number; economia: number } | null = null;
  for (const t of TIERS) {
    if (t.min <= q) continue;
    const custo = t.min * t.preco;
    if (custo < atual) {
      const economia = atual - custo;
      if (!melhor || economia > melhor.economia) melhor = { qtd: t.min, economia };
    }
  }
  return melhor;
}

export default function PrecoReserva() {
  // texto, para o campo poder ficar vazio enquanto o visitante redigita
  const [doses, setDoses] = useState("100");
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("");
  const [copiado, setCopiado] = useState<"ok" | "falhou" | null>(null);

  const q = Math.min(
    QUANTIDADE_MAXIMA,
    Math.max(1, Math.floor(Number(doses.replace(/\D/g, "")) || 0)),
  );
  const precoUnit = precoPorDose(q);
  const total = q * precoUnit;
  // quanto a quantidade escolhida derruba em relação ao preço de tabela
  // (R$ 50/dose, o degrau de quem compra até 60 doses)
  const precoBase = TIERS[0].preco;
  const descontoPorQuantidade = q * precoBase - total;
  const salto = useMemo(() => melhorSalto(q), [q]);

  const mensagem = useMemo(() => {
    const linhas = [
      "Olá! Fiz uma simulação no site e quero seguir com o pedido:",
      "",
      `• Touro: ${TOURO.nome} (RGD ${TOURO.rgd})`,
      `• Quantidade: ${q.toLocaleString("pt-BR")} doses`,
      `• Preço por dose: ${brl(precoUnit)}`,
      `• Total estimado: ${brl(total)}`,
    ];
    if (descontoPorQuantidade > 0) {
      linhas.push(
        `• Desconto por quantidade: ${brl(descontoPorQuantidade)} (comparado a ${brl(precoBase)}/dose)`,
      );
    }
    if (nome.trim()) linhas.push(`• Meu nome: ${nome.trim()}`);
    if (estado.trim()) linhas.push(`• Estado: ${estado.trim().toUpperCase()}`);
    linhas.push("", "Pode me confirmar a disponibilidade e o frete?");
    return linhas.join("\n");
  }, [q, precoUnit, total, descontoPorQuantidade, precoBase, nome, estado]);

  const linkWhatsapp = `https://wa.me/${CONDICOES_COMERCIAIS.whatsappTelefone}?text=${encodeURIComponent(mensagem)}`;

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(null), 3200);
    return () => clearTimeout(t);
  }, [copiado]);

  async function copiarSimulacao() {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado("ok");
      rastrear("copiar_resumo", { doses: q, valor: total });
    } catch {
      setCopiado("falhou");
    }
  }

  return (
    <section className="semen-section semen-price" id="reservar">
      <div className="inner">
        <h2>Simule o seu pedido</h2>
        <p className="lead">
          Escolha a quantidade e veja o preço na hora. O fechamento é direto com{" "}
          {CONDICOES_COMERCIAIS.responsavel}, pelo WhatsApp — sem cadastro e sem pagamento pelo
          site.
        </p>

        <div className="picker">
          <div>
            <div className="campo-qtd" style={{ marginBottom: "1rem" }}>
              <label htmlFor="doses">Quantas doses você quer?</label>
              <input
                id="doses"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={doses}
                onChange={(e) => setDoses(e.target.value.replace(/\D/g, "").slice(0, 5))}
                onBlur={() => setDoses(String(q))}
                aria-describedby="doses-ajuda"
              />
              <p className="form-ajuda" id="doses-ajuda">
                O preço por dose cai conforme a quantidade, segundo a tabela abaixo.
              </p>
            </div>

            <div className="chips-qtd" role="group" aria-label="Quantidades comuns">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip-qtd ${q === c ? "ativo" : ""}`}
                  aria-pressed={q === c}
                  onClick={() => {
                    setDoses(String(c));
                    rastrear("escolher_quantidade", { doses: c, valor: c * precoPorDose(c) });
                  }}
                >
                  {c.toLocaleString("pt-BR")}
                </button>
              ))}
            </div>

            <div
              className="tabela-scroll"
              style={{ marginTop: "0.4rem" }}
              tabIndex={0}
              role="region"
              aria-label="Tabela de preço por quantidade de doses"
            >
              <table className="tabela-semen tabela-tiers">
                <caption>Tabela cheia. O degrau da sua quantidade fica marcado.</caption>
                <thead>
                  <tr>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Por dose</th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((t) => (
                    <tr key={t.min} className={t.min === tierDe(q).min ? "ativa" : ""}>
                      <td>
                        {t.rotulo}
                        {t.min === tierDe(q).min && <span className="marca-degrau">seu degrau</span>}
                      </td>
                      <td>{brl(t.preco)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="resumo-pedido">
              <p className="unidade">
                <b>{brl(precoUnit)}</b> <span>por dose</span>
              </p>
              <div className="resumo-lista">
                <div className="linha">
                  <span>Doses</span>
                  <span>{q.toLocaleString("pt-BR")} doses</span>
                </div>
                <div className="linha">
                  <span>Total estimado</span>
                  <span>{brl(total)}</span>
                </div>
                {descontoPorQuantidade > 0 && (
                  <div className="linha">
                    <span>
                      Desconto por quantidade
                      <small>comparado a {brl(precoBase)} por dose, o preço até 60 doses</small>
                    </span>
                    <span>{brl(descontoPorQuantidade)}</span>
                  </div>
                )}
                <div className="linha">
                  <span>Frete</span>
                  <span>A negociar</span>
                </div>
              </div>

              {/* opcionais: só deixam a mensagem do WhatsApp mais completa */}
              <div className="simulador-campos">
                <div className="campo-simples">
                  <label htmlFor="sim-nome">
                    Seu nome <span className="opcional">(opcional)</span>
                  </label>
                  <input
                    id="sim-nome"
                    type="text"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value.slice(0, 80))}
                    placeholder="Como devemos te chamar"
                  />
                </div>
                <div className="campo-simples campo-uf">
                  <label htmlFor="sim-estado">
                    Estado <span className="opcional">(opcional)</span>
                  </label>
                  <input
                    id="sim-estado"
                    type="text"
                    maxLength={2}
                    value={estado}
                    onChange={(e) =>
                      setEstado(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
                    }
                    placeholder="GO"
                  />
                </div>
              </div>

              <button type="button" className="btn-copiar" onClick={copiarSimulacao}>
                {copiado === "ok" ? "✓ Simulação copiada" : "Copiar a simulação"}
              </button>
              <p
                className="aviso-inline falhou"
                role="status"
                aria-live="polite"
                hidden={copiado !== "falhou"}
              >
                Não deu para copiar automaticamente. Selecione o texto e copie à mão.
              </p>
            </div>

            {salto && (
              <div className="aviso-degrau ativo">
                Com <b>{salto.qtd.toLocaleString("pt-BR")} doses</b> você paga{" "}
                <b>{brl(salto.economia)} a menos</b> do que com {q.toLocaleString("pt-BR")}. São{" "}
                {(salto.qtd - q).toLocaleString("pt-BR")}{" "}
                {salto.qtd - q === 1 ? "dose" : "doses"} a mais por um total menor, porque a
                quantidade muda o degrau da tabela.
                <br />
                <button type="button" onClick={() => setDoses(String(salto.qtd))}>
                  Passar para {salto.qtd.toLocaleString("pt-BR")} doses
                </button>
              </div>
            )}

            <div className="botoes-compra">
              <a
                className="btn-primario btn-whatsapp"
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  rastrear("clicar_whatsapp", { origem: "simulador", doses: q, valor: total })
                }
              >
                Prosseguir no WhatsApp
                <span className="sr-only"> (abre a conversa em uma nova aba)</span>
              </a>
            </div>

            <p className="nota-cta">
              A mensagem já vai pronta com a quantidade e o valor da sua simulação. Você fala
              direto com {CONDICOES_COMERCIAIS.responsavel}, que confirma disponibilidade, frete e
              forma de pagamento.
            </p>
          </div>
        </div>

        <p className="stock-linha">
          <b>{CONDICOES_ENTREGA.estoqueDoses}</b>&nbsp;doses disponíveis desta partida.
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--cinza-texto)", marginTop: "0.9rem" }}>
          A estação de monta na região começa entre setembro e novembro. Para inseminar em
          outubro, o pedido precisa estar fechado com antecedência. Entrega em{" "}
          {CONDICOES_ENTREGA.prazoEntregaDias} dias a partir da confirmação. Atendemos:{" "}
          {CONDICOES_ENTREGA.estadosAtendidos}.
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--cinza-medio)", marginTop: "0.6rem", lineHeight: 1.7 }}>
          Frete: {CONDICOES_ENTREGA.freteInfo}. Transporte: {CONDICOES_ENTREGA.botijaoPorContaDe}.
        </p>
      </div>
    </section>
  );
}
