"use client";

import { useMemo, useRef, useState } from "react";
import { rastrear } from "@/lib/tracking";
import { DEP_DESMAMA_KG } from "@/lib/produto-semen";

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
function num(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

/**
 * No Brasil se digita "14,60". Com type="number" o navegador devolve ""
 * e o valor virava 0 sem avisar ninguém — por isso os campos são de texto
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

export default function Calculadora({ precoDoseInicial }: { precoDoseInicial: number }) {
  const [vacas, setVacas] = useState("200");
  const [prenhez, setPrenhez] = useState("50");
  const [kg, setKg] = useState("14,60");
  const [dose, setDose] = useState(String(precoDoseInicial));
  const [dv, setDv] = useState("1,45");

  const resultado = useMemo(() => {
    const nVacas = limitar(paraNumero(vacas), 0, 1_000_000);
    const nPrenhez = limitar(paraNumero(prenhez), 0, 100);
    const nKg = Math.max(0, paraNumero(kg));
    const nDose = Math.max(0, paraNumero(dose));
    const nDv = limitar(paraNumero(dv), 0, 10);

    const bezerros = nVacas * (nPrenhez / 100);
    const kgExtra = bezerros * DEP_DESMAMA_KG;
    const receita = kgExtra * nKg;
    const custo = nVacas * nDv * nDose;
    const res = receita - custo;
    return { bezerros, kgExtra, receita, custo, res };
  }, [vacas, prenhez, kg, dose, dv]);

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

  return (
    <section className="semen-section" id="calculadora">
      <div className="inner">
        <h2>Quanto essa dose devolve na sua fazenda</h2>
        <p className="lead">A conta é aberta. Mexa nos números com a realidade do seu rebanho e veja o resultado.</p>
        <div className="calc">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="campo">
              <label htmlFor="vacas">Vacas que você vai inseminar</label>
              <input id="vacas" {...campoNumero} value={vacas} onChange={(e) => setVacas(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="prenhez">
                Taxa de prenhez que você costuma fazer
                <small id="prenhez-ajuda">Em IATF, a média de mercado fica entre 45% e 55%</small>
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
            <div className="campo">
              <label htmlFor="dose">
                Preço da dose
                <small>Começa no preço do degrau de 100 doses. Veja a tabela completa em &ldquo;Preço e reserva&rdquo; e ajuste aqui se quiser</small>
              </label>
              <input id="dose" {...campoNumero} value={dose} onChange={(e) => setDose(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="dv">
                Doses por vaca
                <small>55% das matrizes recebem 1 dose e 45% são ressincronizadas com 2. Média do mercado: 1,45</small>
              </label>
              <input id="dv" {...campoNumero} value={dv} onChange={(e) => setDv(e.target.value)} />
            </div>
          </form>

          <div className="calc-saida" aria-live="polite">
            <div className="linha">
              <span>Bezerros nascidos</span>
              <span>{num(resultado.bezerros)}</span>
            </div>
            <div className="linha">
              <span>Quilos a mais na desmama, no total</span>
              <span>{num(resultado.kgExtra)} kg</span>
            </div>
            <div className="linha">
              <span>Receita a mais na venda dos bezerros</span>
              <span>{brl(resultado.receita)}</span>
            </div>
            <div className="linha">
              <span>Custo do sêmen</span>
              <span>{resultado.custo > 0 ? brl(resultado.custo) : "informe o preço da dose"}</span>
            </div>
            <div className={`linha grande ${resultado.custo > 0 && resultado.res < 0 ? "negativa" : ""}`}>
              <span>Resultado</span>
              <span>{resultado.custo > 0 ? brl(resultado.res) : "—"}</span>
            </div>
            {resultado.custo > 0 && resultado.res < 0 && (
              <p className="calc-alerta">
                Com esses números a conta fecha no negativo. Reveja o preço do quilo do bezerro, a
                taxa de prenhez ou a quantidade de doses por vaca.
              </p>
            )}
          </div>
        </div>
        <p className="nota-calc">
          Como a conta é feita: o Pontual tem DEP de <b>+9,83 kg</b> para peso à desmama, com
          acurácia 71, no sumário PMGZ 2024/4. DEP significa a diferença esperada nos filhos
          comparada com a média da raça. A conta multiplica esse ganho pelo número de bezerros
          nascidos e pelo preço do quilo. Não entra na conta ganho de sobreano, permanência da
          matriz nem antecipação do primeiro parto, que também têm valor. Nenhum número aqui foi
          inventado: confira a DEP na ficha da ABS.
        </p>
      </div>
    </section>
  );
}
