# Segurança, privacidade e medição — site do Pontual FIV St. Cruz

Documento técnico de referência, atualizado em 18/09/2026.

---

## O que este site é hoje

Uma landing page **totalmente estática**. Não existe banco de dados, gateway de
pagamento, envio de e-mail, área administrativa nem rota de API. O visitante
simula o pedido na própria página e segue para o WhatsApp com a mensagem já
escrita; a venda é fechada na conversa.

Essa decisão apagou, de uma vez, a maior parte da superfície de risco que o
projeto tinha antes:

| Antes | Agora |
|---|---|
| Dados pessoais (nome, e-mail, telefone, CPF/CNPJ) gravados em MySQL | **Nenhum dado pessoal é armazenado** |
| Gateway de pagamento, webhook, chaves de API | Nada disso existe |
| Rotas administrativas com segredo | Não existem |
| Envio de e-mail transacional | Não existe |
| Risco de vazamento, de cobrança indevida, de webhook forjado | Deixou de existir junto com o código |

O que sobrou de "dado do visitante" é o que ele mesmo digita no simulador
(quantidade, e opcionalmente nome e estado), que **não sai do navegador dele**:
vai direto para o texto da mensagem do WhatsApp. O site não recebe nem guarda
nada disso.

---

## Sobre "conformidade com a ISO 27001"

Registrando de novo para não gerar expectativa errada com clientes ou
parceiros: a **ISO/IEC 27001 certifica uma organização**, não um site. Ela exige
sistema de gestão, política aprovada pela direção, análise de risco, papéis
definidos, gestão de fornecedores, continuidade e auditoria externa por
organismo acreditado. Nenhum site é "certificado ISO 27001" sozinho.

O que se aplica a um site estático são poucos controles técnicos do Anexo A, e
eles estão implementados:

| Controle | O que exige | Onde está |
|---|---|---|
| A.5.14 Transferência de informação | Proteger dados em trânsito | HSTS + `upgrade-insecure-requests` (`netlify.toml` / `vercel.json`) |
| A.8.9 Gestão de configuração | Configuração endurecida | CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false` |
| A.8.23 Filtragem web | Controlar conteúdo externo | CSP com allowlist: só Google Fonts, GA4 e Meta Pixel |
| A.8.26 Requisitos da aplicação | Validar entrada | Quantidade limitada a 1–6.500; campos livres com tamanho máximo |
| A.5.34 Privacidade e dados pessoais | Minimizar coleta | O site deixou de coletar e armazenar dado pessoal |

O que continua sendo responsabilidade da organização, se a certificação for
buscada um dia: política de segurança, inventário de ativos, análise de risco,
conscientização da equipe, acordos com fornecedores (hospedagem, Google, Meta),
resposta a incidentes e auditoria interna.

---

## Cabeçalhos de segurança

Definidos em `netlify.toml` e `vercel.json` e aplicados a todas as páginas.

Por que não no `next.config.ts`: o site é exportado como HTML puro
(`output: "export"`), e nesse modo o Next não serve as páginas — o `headers()`
dele seria ignorado em silêncio. Quem aplica cabeçalho passou a ser a
hospedagem. A constante `CSP` continua escrita no `next.config.ts` como
referência da política; **se mexer nela, replique nos dois arquivos.**


- **Content-Security-Policy** — libera apenas os domínios necessários (Google
  Fonts, GA4, Meta Pixel) e bloqueia o resto. Inclui `frame-ancestors 'none'`
  (anti-clickjacking), `object-src 'none'`, `base-uri 'self'` e
  `form-action 'self'`.
- **Strict-Transport-Security** — 2 anos, subdomínios incluídos.
- **X-Content-Type-Options: nosniff**, **X-Frame-Options: DENY**,
  **Referrer-Policy: strict-origin-when-cross-origin**,
  **Permissions-Policy** (câmera, microfone, localização e pagamento bloqueados),
  **Cross-Origin-Opener-Policy: same-origin**.

Uma ressalva honesta: `script-src` ainda usa `'unsafe-inline'`, porque o Next
injeta scripts inline de hidratação e as tags de medição também são inline.
Remover isso exige CSP com nonce gerado por middleware em toda requisição de
página. Numa página sem formulário que envia dados e sem área logada, o risco
residual é baixo — mas fica anotado como melhoria possível.

Em desenvolvimento o Next precisa de `'unsafe-eval'` e do websocket de
`localhost` para o hot reload; como em produção quem manda é o `netlify.toml`,
nada disso vaza para o site publicado.

---

## Dados pessoais e LGPD

**O site não coleta e não armazena dados pessoais.** O que o visitante digita no
simulador fica no navegador dele e vai para o WhatsApp por iniciativa dele.

O que ainda envolve a LGPD são os **cookies de medição**:

- Nenhum script de terceiro carrega antes do aceite. Quem recusa navega sem
  nenhum script do Google ou da Meta — não é "carrega e desliga o cookie".
- O banner tem três opções (recusar / só medição / aceitar tudo), e recusar é
  tão fácil quanto aceitar.
- A escolha fica registrada com data e versão do texto, porque a lei exige que
  o consentimento seja demonstrável (art. 8º, §1º).
- Dá para mudar de ideia depois, pelo link "Preferências de cookies".

**Pendências que dependem de decisão do cliente:**

1. **Página de Política de Privacidade** — mesmo sem armazenar dados, o site usa
   cookies de medição e precisa explicar isso em algum lugar.
2. **Canal de contato** para o titular exercer os direitos do art. 18.

Observação sobre o WhatsApp: a partir do momento em que a conversa começa, os
dados que o cliente mandar ficam no aparelho e na conta de WhatsApp de quem
atende. Isso é tratamento de dado pessoal fora do site, e a boa prática é não
pedir documento por lá sem necessidade, e não deixar a conta de atendimento em
aparelho compartilhado.

---

## Medição (GA4 + Meta Pixel)

**Conversão do site = clique em "Prosseguir no WhatsApp".** Como não existe mais
pagamento online, não há evento de compra: o site mede intenção, e o fechamento
acontece na conversa.

Eventos disparados (`src/lib/tracking.ts`):

| Evento no código | GA4 | Meta |
|---|---|---|
| `ver_filhos` | `view_item` | `ViewContent` |
| `usar_calculadora` | `calculadora_usada` | `CalculadoraUsada` |
| `escolher_quantidade` | `select_item` | `AddToCart` |
| `clicar_whatsapp` | `generate_lead` | `Lead` |
| `copiar_resumo` | `share` | `CopiarResumo` |

Todos levam a quantidade e o valor simulado, então dá para ver quais faixas de
pedido mais interessam antes mesmo da conversa começar.

**Para ativar**, preencha no painel da hospedagem: `NEXT_PUBLIC_GA_ID` e
`NEXT_PUBLIC_META_PIXEL_ID`. Em branco, o site funciona igual e não carrega
nenhum script de terceiro.

A medição server-side (Conversions API e Measurement Protocol) saiu junto com o
backend — ela existia para capturar a compra confirmada no gateway, e não há
mais gateway. Como consequência, quem usa bloqueador de anúncio não é contado.
É o preço de não ter servidor, e para medir intenção é aceitável.

---

## Publicar

1. `npm install`
2. `npm run build`
3. Subir a pasta `out/`. Como o site é estático, serve em qualquer lugar —
   Netlify, Vercel, Cloudflare Pages, ou até hospedagem comum.
   O passo a passo completo está em `docs/DEPLOY.md`.

Variáveis de ambiente (todas opcionais, veja `.env.example`):
`NEXT_PUBLIC_WHATSAPP_TELEFONE`, `NEXT_PUBLIC_WHATSAPP_RESPONSAVEL`,
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.

Sem nenhuma delas o site sobe e funciona — o WhatsApp cai no número de fallback
que está no código, e a medição simplesmente não carrega.
