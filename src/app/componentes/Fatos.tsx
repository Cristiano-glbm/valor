const FATOS = [
  {
    dt: "211",
    titulo: "filhos avaliados, em 12 rebanhos",
    desc: "153 com peso à desmama e 117 com peso aos 450 dias. Não é touro de catálogo: é touro com progênie no chão.",
  },
  {
    dt: "70",
    titulo: "de acurácia no peso ao sobreano",
    desc: "Acurácia é o grau de confiança da DEP. Em 2023, com 28 filhos, era 41. Hoje é 70.",
  },
  {
    dt: "2%",
    titulo: "melhores da raça no índice geral",
    desc: "iABCZ 20,62 no PMGZ e IQG 27,59 no Geneplus. Decil 1 nos dois programas oficiais.",
  },
  {
    dt: "22",
    titulo: "dias a menos na idade ao primeiro parto",
    desc: "DEP de −21,88 dias. As filhas dele começam a parir mais cedo, o que antecipa a vida produtiva da matriz.",
  },
];

export default function Fatos() {
  return (
    <section className="semen-section" id="sobre">
      <div className="inner">
        <h2>O que sustenta esse número</h2>
        <p className="lead">Quatro dados que você pode conferir sozinho, sem falar com vendedor nenhum.</p>
        <dl className="facts">
          {FATOS.map((f) => (
            <div className="fact" key={f.titulo}>
              <dt>{f.dt}</dt>
              <dd>
                <b>{f.titulo}</b>
                <span>{f.desc}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
