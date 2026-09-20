import { TOURO } from "@/lib/produto-semen";

export default function Genealogia() {
  return (
    <section className="semen-section">
      <div className="inner">
        <h2>Genealogia</h2>
        <p className="lead">
          Sangue REM pelo pai. Naviraí e S. Nice pela mãe: as mesmas marcas que sustentam os
          preços mais altos de sêmen Nelore no país.
        </p>
        <div className="ped">
          <ul>
            <li>
              <span className="nome-ped">{TOURO.nome}</span>
              <span className="rgd-ped">, RGD {TOURO.rgd}, nascido em 22/08/2019</span>
              <ul>
                <li>
                  <span className="selo">pai</span>
                  <span className="nome-ped">REM USP</span>
                  <ul>
                    <li>
                      <span className="selo">avô</span>REM QUISCO
                      <ul>
                        <li className="rgd-ped">Moyne × Minala</li>
                      </ul>
                    </li>
                    <li>
                      <span className="selo">avó</span>REM REGIS
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="selo">mãe</span>
                  <span className="nome-ped">FARPA FIV HV</span>
                  <ul>
                    <li>
                      <span className="selo">avô</span>HEROI DE NAVIRAÍ
                      <ul>
                        <li className="rgd-ped">Donato de Naviraí × Taquira da SM</li>
                      </ul>
                    </li>
                    <li>
                      <span className="selo">avó</span>FAIRANI FIV YC
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <p className="nota-calc">
          Genealogia conforme o quadro de pedigree do ABS Bull Search para o touro{" "}
          {TOURO.codigoSemen}.
        </p>
      </div>
    </section>
  );
}
