// ==========================================================================
// Dados do produto "Pontual FIV St. Cruz" — sêmen Nelore.
// Fonte: dossiê do touro (ABS Bull Search 29NE5134, RGD GPO A5042, PMGZ
// 2024/4 e Geneplus out/2024) e a página de vendas já validada por
// Paulo Kamilo (Valor Assessoria Pecuária).
//
// Ainda restam poucas pendências reais (endereço final da página, link de
// cobrança em produção etc.) — ver vault-pontual/03 - Pendências.md.
// ==========================================================================

export const TOURO = {
  nome: "PONTUAL FIV ST. CRUZ",
  rgd: "GPO A5042",
  codigoSemen: "29NE5134",
  nascimento: "2019-08-22",
  raca: "Nelore",
  criador: "Gil Pereira — Nelore Santa Cruz e DH Agropecuária",
  central: "ABS",
  centralTelefone: "(34) 3319-5400",
  pesoAtualKg: 1050,
  perimetroToracicoCm: 233,
  circunferenciaEscrotalCm: 42,
  linkAbsBullSearch:
    "https://absbullsearch.absglobal.com/details/bull/29NE5134/ZB/BRA/NELORE/PT/BR/BRA?lang=pt-BR",
  linkAbczConsultaPublica:
    "https://www.abcz.org.br/produtos-e-servicos/consulta-publica-de-animais",
};

// DEPs de destaque (decil 1 / top 1% ou melhor) — sumário PMGZ 2024/4
export const DEPS_DESTAQUE = [
  { caracteristica: "Ganho da desmama ao sobreano (Geneplus)", dep: "+16,37 g/dia", ac: 70, topPct: "0,1%" },
  { caracteristica: "Peso ao sobreano", dep: "+26,20 kg", ac: 70, topPct: "0,1%" },
  { caracteristica: "Peso ao ano", dep: "+21,07 kg", ac: 69, topPct: "0,1%" },
  { caracteristica: "Conformação frigorífica ao sobreano", dep: "+8,01", ac: 23, topPct: "0,5%" },
  { caracteristica: "Conformação frigorífica à desmama", dep: "+6,15", ac: 30, topPct: "0,5%" },
  { caracteristica: "Musculosidade ao sobreano", dep: "+4,25", ac: 70, topPct: "1%" },
  { caracteristica: "Estrutura ao sobreano", dep: "+2,95", ac: 70, topPct: "1%" },
];

// DEPs "boas" (top 2% a 15%)
export const DEPS_BOAS = [
  { caracteristica: "Peso à desmama", dep: "+9,83 kg", ac: 71, topPct: "2%" },
  { caracteristica: "Índice iABCZ", dep: "20,62", ac: null, topPct: "2%" },
  { caracteristica: "Idade ao primeiro parto", dep: "−21,88 dias", ac: 20, topPct: "4%" },
  { caracteristica: "Permanência no rebanho", dep: "+36,89", ac: 20, topPct: "7%" },
  { caracteristica: "Área de olho de lombo", dep: "+2,17 cm²", ac: 27, topPct: "7%" },
  { caracteristica: "Precocidade ao sobreano", dep: "+3,08", ac: 70, topPct: "8%" },
  { caracteristica: "Habilidade materna", dep: "+2,30", ac: 23, topPct: "10%" },
  { caracteristica: "Perímetro escrotal ao sobreano", dep: "+0,88 cm", ac: 54, topPct: "15%" },
];

// O que ele NÃO é — transparência proposital (decil 7+)
export const DEPS_LIMITACOES = [
  { caracteristica: "Espessura de gordura / acabamento", dep: "−0,40", ac: 18, posicao: "top 66%, decil 7" },
  { caracteristica: "Marmoreio", dep: "−0,57", ac: 18, posicao: "top 72%, decil 8" },
  { caracteristica: "Peso ao nascer", dep: "+0,63 kg", ac: 69, posicao: "decil 10" },
];

// Evolução das DEPs entre PMGZ 2023-2 (28 filhos) e PMGZ 2024/4 (211 filhos)
export const EVOLUCAO_DEPS = [
  { caracteristica: "Peso ao sobreano", antes: "+18,30 kg", depois: "+26,20 kg", variacao: "+7,90 kg" },
  { caracteristica: "Peso ao ano", antes: "+15,29 kg", depois: "+21,07 kg", variacao: "+5,78 kg" },
  { caracteristica: "Musculosidade", antes: "+2,43", depois: "+4,25", variacao: "+1,82" },
  { caracteristica: "Área de olho de lombo", antes: "+0,78 cm²", depois: "+2,17 cm²", variacao: "+1,39 cm²" },
  { caracteristica: "iABCZ", antes: "17,60", depois: "20,62", variacao: "+3,02" },
  { caracteristica: "Acurácia do sobreano", antes: "41", depois: "70", variacao: "+29" },
];

export const PROGENIE = {
  filhosTotais: 211,
  rebanhos: 12,
  filhosComPesoDesmama: 153,
  filhosComPeso450Dias: 117,
};

// DEP usada na calculadora de retorno (peso à desmama, PMGZ 2024/4)
export const DEP_DESMAMA_KG = 9.83;

/**
 * Eficiência em IATF.
 *
 * `pontual` é a média de prenhez observada com o Pontual nas propriedades em
 * que a Valor acompanha essa mensuração — é média apurada, não promessa: a
 * prenhez depende também de manejo, nutrição e protocolo.
 *
 * `mercado` é o meio da faixa de 45% a 55% citada como média de IATF no país,
 * e serve de base de comparação na calculadora.
 */
export const IATF = {
  pontualPct: 62,
  mercadoPct: 50,
  mercadoFaixa: "45% a 55%",
};

// Genealogia
export const GENEALOGIA = {
  pai: { nome: "REM USP", avo: { nome: "REM QUISCO", origem: "Moyne × Minala" }, avoMaterna: { nome: "REM REGIS" } },
  mae: { nome: "FARPA FIV HV", avo: { nome: "HEROI DE NAVIRAÍ", origem: "Donato de Naviraí × Taquira da SM" }, avoMaterna: { nome: "FAIRANI FIV YC" } },
};

// Tabela de preços por degrau (real, validada em 04/09/2026 — ver
// vault-pontual/04 - Preços.md). min = quantidade mínima de doses.
export const TIERS = [
  { min: 1, preco: 50, rotulo: "Até 60 doses" },
  { min: 61, preco: 40, rotulo: "61 a 99 doses" },
  { min: 100, preco: 38, rotulo: "100 a 199 doses" },
  { min: 200, preco: 36, rotulo: "200 a 299 doses" },
  { min: 300, preco: 34, rotulo: "300 a 399 doses" },
  { min: 400, preco: 32, rotulo: "400 a 499 doses" },
  { min: 500, preco: 30, rotulo: "500 a 999 doses" },
  { min: 1000, preco: 28, rotulo: "1.000 doses ou mais" },
] as const;

export function precoPorDose(quantidade: number): number {
  let atual: number = TIERS[0].preco;
  for (const t of TIERS) {
    if (quantidade >= t.min) atual = t.preco;
  }
  return atual;
}

// ==========================================================================
// CONDIÇÕES DE ENTREGA E GARANTIA — respondidas em 10/09/2026 (ver
// vault-pontual/03 - Pendências.md, 04 - Preços.md e
// 07 - Formulário para responder.md). Dado real, não é exemplo.
// ==========================================================================
export const CONDICOES_ENTREGA = {
  estoqueDoses: "6.500", // total de doses do Pontual disponíveis nesta partida
  prazoEntregaDias: "7 a 30", // dias da confirmação até a dose chegar na fazenda
  estadosAtendidos: "Todo o Brasil", // frete a negociar conforme volume e distância
  freteInfo: "A negociar, conforme volume do pedido e distância até a fazenda",
  botijaoPorContaDe:
    "Por conta do vendedor — o cliente só precisa estar disponível para receber, não precisa providenciar transporte",
  politicaPrenhezBaixa:
    "Não há troca do sêmen. A garantia é de que o sêmen entregue atende aos padrões do Ministério da Agricultura, porque a central que aloja o Pontual é credenciada e certificada.",
};

export const CONDICOES_COMERCIAIS = {
  // à vista ou parcelado em até 6x, a depender do volume do pedido — não
  // confirmado se as parcelas saem sem juros (ver 04 - Preços.md)
  parcelasMax: 6,
  // NEXT_PUBLIC_ é obrigatório aqui: este módulo é importado por componentes
  // "use client", e variável sem o prefixo chega como undefined no navegador
  // (era por isso que o número sempre caía no fallback).
  responsavel: process.env.NEXT_PUBLIC_WHATSAPP_RESPONSAVEL || "Paulo Kamilo",
  whatsappTelefone: process.env.NEXT_PUBLIC_WHATSAPP_TELEFONE || "5562998119850",
};
