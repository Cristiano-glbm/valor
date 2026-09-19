const PERGUNTAS = [
  {
    q: "Nelore PO não é gado de pista?",
    a: "PO é registro de origem, não é destino. O que separa touro de pista de touro de produção é ter DEP publicada em sumário oficial e ter filhos avaliados a campo. O Pontual tem 211 filhos avaliados em 12 rebanhos, com acurácia de 70 nas características de crescimento, no PMGZ e no Geneplus. Está tudo na ficha pública da ABS, com o RGD dele.",
  },
  {
    q: "Ele tem CEIP?",
    a: "Não localizamos CEIP para este animal e não vamos afirmar que ele tem. O CEIP é um selo do Ministério da Agricultura que certifica de 20% a 40% dos animais de cada safra. É um bom filtro, mas não é a mesma coisa que DEP com acurácia alta e progênie avaliada — e é isso que o Pontual tem. Se o CEIP for requisito fechado para você, diga isso na conversa e a gente é honesto sobre o que temos.",
  },
  {
    q: "Como sei que essas DEPs são verdadeiras?",
    a: "Você confere sem falar com a gente. A ficha completa está no ABS Bull Search sob o código 29NE5134, e o registro GPO A5042 pode ser consultado na Consulta Pública de Animais da ABCZ. Os dois links estão nesta página. Se algum número aqui não bater com a fonte, o erro é nosso e a gente corrige.",
  },
  {
    q: "Se ele está na ABS, por que não compro direto da ABS?",
    a: "O Pontual fica alojado na central ABS, que faz a coleta e o controle sanitário. Mas a ABS não comercializa o sêmen dele. A comercialização é exclusiva da Valor Assessoria Pecuária. Você tem o controle de central e a garantia de origem, com atendimento direto de quem conhece o touro.",
  },
  {
    q: "E se a prenhez vier baixa?",
    a: "Não há troca do sêmen. A garantia que oferecemos é de que o sêmen entregue atende aos padrões do Ministério da Agricultura, porque a central que aloja o Pontual é credenciada e certificada. A taxa de prenhez depende de vários fatores de manejo da sua fazenda, além da genética do touro.",
  },
  {
    q: "Vocês entregam na minha região?",
    a: "Sim, atendemos todo o Brasil. O frete é negociado conforme o volume do pedido e a distância até a fazenda, e fica por conta do vendedor: você não precisa providenciar transporte, só estar disponível para receber o sêmen quando ele chegar. O prazo de entrega é de 7 a 30 dias após a confirmação do pedido.",
  },
  {
    q: "Serve para novilha de primeira cria?",
    a: "A DEP de peso ao nascer do Pontual é positiva, de +0,63 kg, o que significa bezerro um pouco mais pesado ao nascer que a média. Isso não o descarta para novilha, mas é uma decisão que depende do porte das suas fêmeas e do seu manejo de parto. Converse com o seu veterinário antes, e a gente conversa junto se quiser.",
  },
];

export default function Faq() {
  return (
    <section className="semen-section">
      <div className="inner">
        <h2>Perguntas que todo mundo faz</h2>
        {PERGUNTAS.map((p) => (
          <details className="faq-item" key={p.q}>
            <summary>{p.q}</summary>
            <p>{p.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
