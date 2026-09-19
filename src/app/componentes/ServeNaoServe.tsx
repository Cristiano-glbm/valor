export default function ServeNaoServe() {
  return (
    <section className="semen-section">
      <div className="inner">
        <h2>Para que ele serve, e para que não serve</h2>
        <p className="lead">
          Nenhum touro serve para tudo. Este aqui é de peso e de rendimento no osso, não de
          acabamento.
        </p>
        <div className="duas-colunas">
          <div>
            <h3>Use o Pontual se</h3>
            <ul className="lista-sim">
              <li>Você vende boi por peso e por rendimento de carcaça</li>
              <li>Seu sistema é cria ou recria a pasto, extensivo ou semi-intensivo</li>
              <li>Você precisa de mais quilo do desmame ao sobreano</li>
              <li>Você quer filha que pare mais cedo e fique mais tempo no rebanho</li>
              <li>Você quer musculosidade e estrutura corporal, com dado de 70 de acurácia</li>
            </ul>
          </div>
          <div>
            <h3>Procure outro touro se</h3>
            <ul className="lista-nao">
              <li>Você recebe bonificação por acabamento de carcaça: a DEP dele para gordura de cobertura é negativa, no decil 7</li>
              <li>Você vende para programa de carne com prêmio por marmoreio: decil 8, top 72%</li>
              <li>Você precisa de dado de eficiência alimentar: o Pontual não tem CAR medido</li>
              <li>Você exige avaliação da ANCP: ele é avaliado no PMGZ e no Geneplus, não na ANCP</li>
              <li>Você quer touro para primeira cria sem conversar com técnico antes: a DEP de peso ao nascer é positiva, então fale com seu veterinário</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
