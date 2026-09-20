"use client";

import { useMemo, useRef, useState } from "react";
import { rastrear } from "@/lib/tracking";
import { DEP_DESMAMA_KG, IATF, TIERS, precoPorDose } from "@/lib/produto-semen";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
function num(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

/**
 * No Brasil se digita "14,60". Com type="number" o navegador devolve ""
 * e o valor virava 0 sem avisar ninguém, por isso os campos são de texto
 * com inputMode e o número é lido aqui, aceitando vírgula ou ponto.
 */
function paraNumero(valor: string): number {
  const limpo = valor.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(limpo);
  return Number.isFinite(n) ? n : 0;
}
function limitar(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Rótulo do degrau da tabela em que uma quantidade de doses cai. */
function degrauDe(doses: number): string {
  let atual: string = TIERS[0].rotulo;
  for (const t of TIERS) {
    if (doses >= t.min) atual = t.rotulo;
  }
  return atual;
}

export default function Calculadora() {
  const [vacas, setVacas] = useState("200");
  // começa na média observada com o Pontual
  const [prenhez, setPrenhez] = useState(String(IATF.pontualPct));
  const [kg, setKg] = useState("14,60");
  const [dv, setDv] = useState("1,45");

  const conta = useMemo(() => {
    const nVacas = limitar(paraNumero(vacas), 0, 1_000_000);
    const nPrenhez = limitar(paraNumero(prenhez), 0, 100);
    const nKg = Math.max(0, paraNumero(kg));
    const nDv = limitar(paraNumero(dv), 0, 10);

    // O preço não é digitado: sai da tabela de degraus, pela quantidade de
    // doses que o rebanho do visitante exige. Dose é item inteiro, por isso
    // arredonda para cima.
    const doses = Math.ceil(nVacas * nDv);
    const precoDose = precoPorDose(doses);
    const degrau = degrauDe(doses);

    const bezerros = nVacas * (nPrenhez / 100);
    const kgExtra = bezerros * DEP_DESMAMA_KG;
    const receita = kgExtra * nKg;
    const custo = doses * precoDose;

    return { nVacas, doses, precoDose, degrau, bezerros, kgExtra, receita, custo, res: receita - custo };
  }, [vacas, prenhez, kg, dv]);

  const mediuRef = useRef(false);
  function medirUso() {
    if (mediuRef.current) return;
    mediuRef.current = true;
    rastrear("usar_calculadora", {});
  }

  const campoNumero = {
    type: "text" as const,
    inputMode: "decimal" as const,
    autoComplete: "off",
    onFocus: medirUso,
  };

  const semRebanho = conta.nVacas < 1;

  return (
    <section className="semen-section" id="calculadora">
      <div className="inner">
        <h2>Quanto essa dose devolve na sua fazenda</h2>
        <p className="lead">A conta é aberta. Mexa nos números com a realidade do seu rebanho e veja o resultado.</p>

        {/* Eficiência em IATF: o número que mais muda a conta, logo antes dela. */}
        <div className="iatf-destaque">
          <div className="iatf-numero">
            <strong>{IATF.pontualPct}%</strong>
            <span>de prenhez em IATF</span>
          </div>
          <p className="iatf-texto">
            Essa é a <b>média do Pontual nas propriedades em que temos essa mensuração</b>. Não é
            promessa: prenhez também depende de manejo, nutrição e protocolo, mas é o número que
            vimos na prática, e é com ele que a conta abaixo começa.
          </p>
        </div>

        <div className="calc">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="campo">
              <label htmlFor="vacas">Vacas que você vai inseminar</label>
              <input id="vacas" {...campoNumero} value={vacas} onChange={(e) => setVacas(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="dv">
                Doses por vaca
                <small>55% das matrizes recebem 1 dose e 45% são ressincronizadas com 2. Média do mercado: 1,45</small>
              </label>
              <input id="dv" {...campoNumero} value={dv} onChange={(e) => setDv(e.target.value)} />
            </div>

            {/* O preço da dose não é campo: vem da tabela de degraus, pela
                quantidade que o próprio rebanho exige. */}
            <div className="campo-auto">
              <span className="campo-auto-rotulo">Preço da dose</span>
              <p className="campo-auto-valor">
                <b>{brl(conta.precoDose)}</b> por dose
              </p>
              <p className="campo-auto-nota">
                {semRebanho ? (
                  <>Informe quantas vacas você vai inseminar: o preço sai sozinho da tabela.</>
                ) : (
                  <>
                    {num(conta.doses)} doses para {num(conta.nVacas)} vacas, o que cai no degrau
                    &ldquo;{conta.degrau}&rdquo; da tabela. Quanto maior o pedido, mais barata fica
                    a dose.
                  </>
                )}
              </p>
            </div>

            <div className="campo">
              <label htmlFor="prenhez">
                Taxa de prenhez
                <small id="prenhez-ajuda">
                  Começa em {IATF.pontualPct}%, a média do Pontual nas propriedades em que temos
                  essa mensuração. Troque pelo seu número se quiser.
                </small>
              </label>
              <input
                id="prenhez"
                {...campoNumero}
                value={prenhez}
                onChange={(e) => setPrenhez(e.target.value)}
                aria-describedby="prenhez-ajuda"
              />
              {paraNumero(prenhez) > 100 && (
                <p className="erro-campo">A taxa de prenhez não passa de 100%. Usamos 100% na conta.</p>
              )}
            </div>
            <div className="campo">
              <label htmlFor="kg">
                Preço do quilo do bezerro na desmama
                <small>Referência de reposição no Tocantins em 04/09/2026: R$ 14,60/kg (Datagro)</small>
              </label>
              <input id="kg" {...campoNumero} value={kg} onChange={(e) => setKg(e.target.value)} />
            </div>
          </form>

          <div className="calc-saida" aria-live="polite">
            <div className="linha">
              <span>Doses necessárias</span>
              <span>{num(conta.doses)} doses</span>
            </div>
            <div className="linha">
              <span>Bezerros nascidos</span>
              <span>{num(conta.bezerros)}</span>
            </div>
            <div className="linha">
              <span>Quilos a mais na desmama, no total</span>
              <span>{num(conta.kgExtra)} kg</span>
            </div>
            <div className="linha">
              <span>Receita a mais na venda dos bezerros</span>
              <span>{brl(conta.receita)}</span>
            </div>
            <div className="linha">
              <span>Custo do sêmen</span>
              <span>{brl(conta.custo)}</span>
            </div>
            <div className={`linha grande ${conta.res < 0 ? "negativa" : ""}`}>
              <span>Resultado</span>
              <span>{brl(conta.res)}</span>
            </div>
            {semRebanho && (
              <p className="calc-alerta">
                Comece informando quantas vacas você vai inseminar: o resto da conta se ajusta
                sozinho.
              </p>
            )}
            {!semRebanho && conta.res < 0 && (
              <p className="calc-alerta">
                Com esses números a conta fecha no negativo. Reveja o preço do quilo do bezerro,
                a taxa de prenhez ou a quantidade de doses por vaca.
              </p>
            )}
          </div>
        </div>

        <p className="nota-calc">
          Como a conta é feita: o Pontual tem DEP de <b>+9,83 kg</b> para peso à desmama, com
          acurácia 71, no sumário PMGZ 2024/4. DEP significa a diferença esperada nos filhos
          comparada com a média da raça. A conta multiplica esse ganho pelo número de bezerros
          nascidos e pelo preço do quilo. O preço da dose vem da tabela de degraus, pela
          quantidade que o seu rebanho exige, e é a mesma tabela que está em &ldquo;Simule o seu
          pedido&rdquo;. Os {IATF.pontualPct}% de prenhez são a média apurada nas propriedades em
          que acompanhamos a mensuração. Não entra na conta ganho de sobreano, permanência da
          matriz nem antecipação do primeiro parto, que também têm valor. Nenhum número aqui foi
          inventado: confira a DEP na ficha da ABS.
        </p>
      </div>
    </section>
  );
}
