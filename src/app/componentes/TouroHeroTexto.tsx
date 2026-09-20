import { TOURO } from "@/lib/produto-semen";

export default function TouroHeroTexto() {
  return (
    <div className="touro-hero">
      <div className="txt">
        <h2>Ele está entre os 0,1% que mais botam peso do desmame ao sobreano.</h2>
        <p className="sub">
          Não é estimativa de pedigree. São 211 filhos avaliados em 12 rebanhos, no sumário do
          PMGZ e no Geneplus.
        </p>

        <div className="ruler">
          <p className="lab">
            Ganho da desmama ao sobreano, posição na raça Nelore: <b>top 0,1%</b>
          </p>
          <div className="track">
            <i style={{ width: "99.9%" }}></i>
            <u style={{ left: "calc(99.9% - 1.5px)" }}></u>
          </div>
          <p className="ends">
            <span>média da raça</span>
            <span>melhor 0,1%</span>
          </p>
        </div>

        <p className="idline">
          <span>
            Nasc. <b>22/08/2019</b>
          </span>
          <span>
            Código de sêmen <b>{TOURO.codigoSemen}</b>
          </span>
          <span>
            Alojado na <b>central {TOURO.central}</b>
          </span>
          <span>
            Criador <b>Nelore Santa Cruz</b>
          </span>
        </p>
      </div>
    </div>
  );
}
