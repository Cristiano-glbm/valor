// Sumário PMGZ / ABCZ, edição 2024/4
const PMGZ = [
  { destaque: true, carac: "Peso ao sobreano", sub: "peso ajustado por volta dos 550 dias", dep: "+26,20 kg", ac: "70", decil: "1", top: "0,1%", barra: 80 },
  { destaque: true, carac: "Peso ao ano", sub: "peso ajustado aos 365 dias", dep: "+21,07 kg", ac: "69", decil: "1", top: "0,1%", barra: 80 },
  { destaque: true, carac: "Musculosidade ao sobreano", dep: "+4,25", ac: "70", decil: "1", top: "1%", barra: 79 },
  { destaque: true, carac: "Estrutura corporal ao sobreano", dep: "+2,95", ac: "70", decil: "1", top: "1%", barra: 79 },
  { destaque: true, carac: "Peso à desmama", sub: "efeito direto do touro", dep: "+9,83 kg", ac: "71", decil: "1", top: "2%", barra: 78 },
  { carac: "Índice geral iABCZ", dep: "20,62", ac: "—", decil: "1", top: "2%", barra: 78 },
  { carac: "Idade ao primeiro parto", sub: "negativo é melhor: antecipa o parto", dep: "−21,88 dias", ac: "20", decil: "1", top: "4%", barra: 76 },
  { carac: "Área de olho de lombo", sub: "o tamanho do contrafilé", dep: "+2,17 cm²", ac: "27", decil: "1", top: "7%", barra: 74 },
  { carac: "Permanência no rebanho", dep: "+36,89", ac: "20", decil: "1", top: "7%", barra: 74 },
  { carac: "Precocidade ao sobreano", dep: "+3,08", ac: "70", decil: "1", top: "8%", barra: 73 },
  { carac: "Habilidade materna", sub: "peso materno, efeito materno", dep: "+2,30", ac: "23", decil: "1", top: "10%", barra: 72 },
  { carac: "Perímetro escrotal aos 365 dias", dep: "+0,43", ac: "55", decil: "3", top: "—", barra: 56 },
  { carac: "Acabamento de carcaça", sub: "gordura de cobertura", dep: "−0,40", ac: "18", decil: "7", top: "—", barra: 24, fraca: true },
  { carac: "Marmoreio", sub: "gordura entremeada na carne", dep: "−0,57", ac: "18", decil: "8", top: "—", barra: 16, fraca: true },
  { carac: "Peso ao nascer", sub: "menor tende a facilitar o parto", dep: "+0,63 kg", ac: "69", decil: "10", top: "—", barra: 8, fraca: true },
];

// Sumário Geneplus / Embrapa, edição outubro de 2024
const GENEPLUS = [
  { destaque: true, carac: "Ganho da desmama ao sobreano", dep: "+16,37 g/dia", ac: "70", pos: "top 0,1%" },
  { destaque: true, carac: "Peso ao sobreano", dep: "+26,20 kg", ac: "70", pos: "top 0,5%" },
  { destaque: true, carac: "Conformação frigorífica ao sobreano", dep: "+8,01", ac: "23", pos: "top 0,5%" },
  { destaque: true, carac: "Conformação frigorífica à desmama", dep: "+6,15", ac: "30", pos: "top 0,5%" },
  { carac: "Índice geral IQG", dep: "27,59", ac: "—", pos: "top 2%" },
  { carac: "Peso à desmama", dep: "+9,83 kg", ac: "71", pos: "top 3%" },
  { carac: "Total materno à desmama", dep: "+8,54 kg", ac: "—", pos: "top 3%" },
  { carac: "Idade ao primeiro parto", dep: "−21,88 dias", ac: "20", pos: "top 5%" },
  { carac: "Área de olho de lombo", dep: "+2,17 cm²", ac: "27", pos: "top 10%" },
  { carac: "Habilidade de permanência", dep: "+36,89%", ac: "20", pos: "top 10%" },
  { carac: "Perímetro escrotal ao sobreano", dep: "+0,88 cm", ac: "54", pos: "top 15%" },
  { carac: "Espessura de gordura", dep: "−0,40 mm", ac: "18", pos: "top 66%" },
  { carac: "Marmoreio", dep: "−0,57", ac: "18", pos: "top 72%" },
];

export default function FichaCompleta() {
  return (
    <section className="semen-section" id="ficha">
      <div className="inner">
        <h2>A ficha completa, sem esconder nada</h2>
        <p className="lead">
          Sumário PMGZ / ABCZ, edição 2024/4. A barra mostra a posição dele na raça: quanto mais
          cheia, melhor.
        </p>
        <div className="tabela-scroll" tabIndex={0} role="region" aria-label="DEPs no sumário PMGZ / ABCZ">
          <table className="tabela-semen">
            <caption>Decil 1 significa estar entre os 10% melhores. Top % é a posição exata.</caption>
            <thead>
              <tr>
                <th scope="col">Característica</th>
                <th scope="col">DEP</th>
                <th scope="col">Acurácia</th>
                <th scope="col">Decil</th>
                <th scope="col">Top %</th>
                <th scope="col" style={{ minWidth: 88 }}>Posição</th>
              </tr>
            </thead>
            <tbody>
              {PMGZ.map((r) => (
                <tr className={r.destaque ? "destaque" : ""} key={r.carac}>
                  <td className="carac">
                    {r.carac}
                    {r.sub && <small>{r.sub}</small>}
                  </td>
                  <td>{r.dep}</td>
                  <td>{r.ac}</td>
                  <td>{r.decil}</td>
                  <td>{r.top}</td>
                  <td>
                    <span className={`barra ${r.fraca ? "fraca" : ""}`} style={{ width: r.barra }}></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tabela-dica">Arraste a tabela para o lado para ver todas as colunas.</p>

        <div className="tabela-scroll" style={{ marginTop: "2.4rem" }} tabIndex={0} role="region" aria-label="DEPs no sumário Geneplus / Embrapa">
          <table className="tabela-semen">
            <caption>
              Sumário Geneplus / Embrapa, edição outubro de 2024. Mesma base de 211 filhos, outro
              programa oficial.
            </caption>
            <thead>
              <tr>
                <th scope="col">Característica</th>
                <th scope="col">DEP</th>
                <th scope="col">Acurácia</th>
                <th scope="col">Posição na raça</th>
              </tr>
            </thead>
            <tbody>
              {GENEPLUS.map((r) => (
                <tr className={r.destaque ? "destaque" : ""} key={r.carac}>
                  <td className="carac">{r.carac}</td>
                  <td>{r.dep}</td>
                  <td>{r.ac}</td>
                  <td>{r.pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tabela-dica">Arraste a tabela para o lado para ver todas as colunas.</p>
      </div>
    </section>
  );
}
