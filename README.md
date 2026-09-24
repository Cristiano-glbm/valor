# Pontual FIV St. Cruz — sêmen Nelore

Landing page de divulgação e venda de sêmen do touro **Pontual FIV St. Cruz**
(RGD GPO A5042), da Valor Assessoria Pecuária.

É uma **página só**, totalmente estática. O visitante monta o pedido num
simulador e segue para o WhatsApp com a mensagem já escrita; quem fecha a
venda é a pessoa do outro lado. Não existe banco de dados, gateway de
pagamento, envio de e-mail nem área administrativa — e, por isso, o site não
coleta nem guarda dado pessoal nenhum.

## Como está montada a página

Na ordem em que aparece:

1. Foto do touro (hero)
2. **Filhos do Pontual em campo** — carrossel com fotos e vídeos reais dos bezerros
3. Genealogia
4. Apresentação do touro
5. Fatos de destaque
6. Calculadora de retorno
7. Evolução das DEPs
8. Faixa sobre infertilidade
9. **Simulador de pedido** → botão "Prosseguir no WhatsApp"
10. FAQ
11. Confira na fonte (ABS Bull Search / ABCZ)

Os dados técnicos (DEPs, genealogia, preços por degrau) vêm do vault do
Obsidian preparado por Paulo Kamilo e estão centralizados em
`src/lib/produto-semen.ts` — mexer ali atualiza a página inteira.

## Tecnologia

Next.js 15 (App Router), React 19, TypeScript. Três dependências no total.
Sem ORM, sem SDK de pagamento, sem backend.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Variáveis de ambiente

**Todas são opcionais.** Sem nenhuma delas o site sobe e funciona: o WhatsApp
cai no número de fallback que está no código e a medição simplesmente não
carrega. A lista comentada está em `.env.example`.

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_TELEFONE` | Número do botão de WhatsApp (DDI + DDD, só números) |
| `NEXT_PUBLIC_WHATSAPP_RESPONSAVEL` | Nome de quem atende, exibido na página |
| `NEXT_PUBLIC_APP_URL` | Endereço público do site |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (só números) |

Nunca versione o `.env` — ele está no `.gitignore`.

## Publicar

O caminho completo, com print do que clicar, está em
[`docs/DEPLOY.md`](docs/DEPLOY.md). Para ligar um domínio próprio registrado na
HostGator, veja [`docs/DOMINIO.md`](docs/DOMINIO.md). Resumo:

1. Rode `publicar.ps1` (Windows) para limpar os restos da versão antiga e
   criar o commit inicial.
2. Suba o repositório para o GitHub.
3. Importe o repositório na hospedagem (Netlify ou Vercel). **Não preencha
   build command nem publish directory na mão** — o `netlify.toml` e o
   `vercel.json` já dizem tudo.
4. Cole as variáveis de ambiente que quiser usar e clique em **Deploy**.

A partir daí, todo `git push` na branch principal publica sozinho.

O build gera uma pasta **`out/`** com HTML puro (`output: "export"`): sem
servidor, sem função serverless, sem adaptador de plataforma. A mesma pasta
serve igual na Netlify, na Vercel, no Cloudflare Pages ou numa hospedagem
comum. Por causa disso, os cabeçalhos de segurança vêm do `netlify.toml` e do
`vercel.json`, não do `next.config.ts`.

## Segurança, privacidade e medição

Está documentado em [`docs/SEGURANCA.md`](docs/SEGURANCA.md): cabeçalhos de
segurança (CSP, HSTS e companhia, definidos em `next.config.ts`), o que a LGPD
exige do banner de cookies, o que "conformidade com a ISO 27001" realmente
significa, e quais eventos o GA4 e o Meta Pixel recebem.

Em resumo: a conversão medida é o **clique em "Prosseguir no WhatsApp"**.
Nenhum script de terceiro carrega antes do aceite no banner.

## Pendências que dependem de decisão do cliente

- Página de **Política de Privacidade** (o site usa cookies de medição e
  precisa explicar isso em algum lugar).
- **Canal de contato** para o titular exercer os direitos do art. 18 da LGPD.
- Conferir estoque de doses, prazo de entrega e estados atendidos em
  `src/lib/produto-semen.ts`.
