const LINHAS = [
  { destaque: true, carac: "Peso ao sobreano", antes: "+18,30 kg", depois: "+26,20 kg", variacao: "+7,90 kg" },
  { destaque: true, carac: "Peso ao ano", antes: "+15,29 kg", depois: "+21,07 kg", variacao: "+5,78 kg" },
  { destaque: true, carac: "Musculosidade ao sobreano", antes: "+2,43", depois: "+4,25", variacao: "+1,82" },
  { carac: "Estrutura ao sobreano", antes: "+1,24", depois: "+2,95", variacao: "+1,71" },
  { carac: "Área de olho de lombo", antes: "+0,78 cm²", depois: "+2,17 cm²", variacao: "+1,39 cm²" },
  { carac: "Índice geral iABCZ", antes: "17,60", depois: "20,62", variacao: "+3,02" },
  { carac: "Permanência no rebanho", antes: "+33,08", depois: "+36,89", variacao: "+3,81" },
  { destaque: true, carac: "Acurácia do peso ao sobreano", antes: "41", depois: "70", variacao: "+29 pontos" },
];

export default function EvolucaoDeps() {
  return (
    <section className="semen-section">
      <div className="inner">
        <h2>As DEPs subiram quando entraram os filhos</h2>
        <p className="lead">
          O normal é o contrário. Touro jovem tem DEP inflada por pedigree, e o número recua
          quando a progênie chega. No Pontual ele subiu, com sete vezes mais filhos avaliados.
        </p>
        <div className="tabela-scroll" tabIndex={0} role="region" aria-label="Evolução das DEPs entre os sumários">
          <table className="tabela-semen">
            <thead>
              <tr>
                <th scope="col">Característica</th>
                <th scope="col">
                  PMGZ 2023-2
                  <br />
                  <span style={{ fontWeight: 400 }}>28 filhos</span>
                </th>
                <th scope="col">
                  PMGZ 2024/4
                  <br />
                  <span style={{ fontWeight: 400 }}>211 filhos</span>
                </th>
                <th scope="col">Variação</th>
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((l) => (
                <tr className={l.destaque ? "destaque" : ""} key={l.carac}>
                  <td className="carac">{l.carac}</td>
                  <td>{l.antes}</td>
                  <td>{l.depois}</td>
                  <td>{l.variacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tabela-dica">Arraste a tabela para o lado para ver todas as colunas.</p>
        <p className="nota-calc">
          Comparação entre o sumário PMGZ 2023-2, publicado no catálogo Corte Zebu 2023-3 da ABS
          Pecplan, e o PMGZ 2024/4, na ficha atual do ABS Bull Search.
        </p>
      </div>
    </section>
  );
}
