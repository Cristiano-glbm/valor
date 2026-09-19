# Colocar o site no ar

Guia do zero até o site respondendo num domínio. Feito em 19/09/2026.

---

## Antes de tudo: leia isto sobre a Vercel

A Vercel é a casa natural do Next.js e o deploy é o mais simples que existe.
Mas o plano gratuito dela (**Hobby**) **não permite uso comercial**. A própria
documentação diz, sem meio-termo, que o Hobby "restringe os usuários a uso
pessoal e não comercial".

Um site que vende sêmen é uso comercial. Na prática isso significa que, no
plano gratuito, a conta pode ser **pausada** — e o site sai do ar sem aviso
útil. Para usar a Vercel dentro das regras, é o plano **Pro: US$ 20 por mês**.

Você tem três saídas honestas:

| Opção | Custo | Observação |
|---|---|---|
| **Vercel Pro** | US$ 20/mês | Melhor integração com Next.js, domínio próprio incluído no 1º ano |
| **Netlify (plano gratuito)** | R$ 0 | O suporte oficial confirma que **pode usar para fins comerciais**. 100 GB de tráfego/mês — dá uns 6 mil visitantes que assistem a todos os vídeos |
| **Vercel Hobby mesmo assim** | R$ 0 | Funciona, mas é contra os termos e o risco de pausa é real. Não recomendo para o site de um cliente |

**Minha sugestão:** comece na **Netlify gratuita**. É um site estático, sem
banco e sem função de servidor — ela dá conta com folga, e você não coloca o
site do cliente na dependência de uma regra que pode ser cobrada a qualquer
momento. Se um dia precisar de mais, migrar para a Vercel é meia hora.

O passo do GitHub (abaixo) é **igual nas duas**. Então faça ele primeiro e
decida depois.

---

## Passo 1 — Subir o código para o GitHub

Na pasta do projeto, clique com o botão direito → **Abrir no Terminal**, e rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\publicar.ps1
```

O script faz tudo: apaga os restos da loja antiga, confere que o seu `.env`
(com as chaves) **não** vai junto, cria o commit e publica no GitHub.

Se você não tiver o GitHub CLI instalado, ele para no fim e mostra os dois
comandos que faltam — é só criar um repositório vazio em
<https://github.com/new> (sem README, sem .gitignore, sem licença) e colar.

**Repositório privado ou público?** Privado. Não há motivo para deixar o
código do cliente aberto.

---

## Passo 2A — Publicar na Netlify (gratuito, recomendado)

1. Entre em <https://app.netlify.com> e crie a conta com **Login com GitHub**.
2. **Add new site → Import an existing project → GitHub**.
3. Autorize e escolha o repositório `pontual-st-cruz`.
4. Ela reconhece o Next.js sozinha. Confira só:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Clique em **Add environment variables** e cole as da tabela mais abaixo
   (ou pule — o site sobe sem nenhuma).
6. **Deploy site**. Em uns 2 minutos ele responde num endereço tipo
   `nome-aleatorio.netlify.app`.

---

## Passo 2B — Publicar na Vercel

1. Entre em <https://vercel.com> e crie a conta com **Continue with GitHub**.
2. **Add New → Project**.
3. Em **Import Git Repository**, escolha `pontual-st-cruz` e clique em **Import**.
4. A Vercel detecta o Next.js sozinha. **Não mexa** em Framework Preset, Build
   Command nem Output Directory.
5. Abra **Environment Variables** e cole as da tabela abaixo.
6. **Deploy**. Em 1 a 2 minutos o site responde em `algo.vercel.app`.

Se for um site comercial, assine o **Pro** antes de apontar o domínio:
**Settings → Billing → Upgrade**.

---

## Variáveis de ambiente

Todas são **opcionais** — sem nenhuma o site sobe e funciona. Elas ficam
visíveis no navegador (por isso o prefixo `NEXT_PUBLIC_`), então nunca coloque
segredo nenhum aqui.

| Nome | Valor | Para quê |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_TELEFONE` | `5562998119850` | Número do botão de WhatsApp |
| `NEXT_PUBLIC_WHATSAPP_RESPONSAVEL` | `Paulo Kamilo` | Nome de quem atende |
| `NEXT_PUBLIC_APP_URL` | `https://seu-dominio.com.br` | Endereço público do site |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 — deixe vazio se ainda não tiver |
| `NEXT_PUBLIC_META_PIXEL_ID` | só números | Meta Pixel — deixe vazio se ainda não tiver |

Depois de mudar qualquer variável, é preciso **refazer o deploy** para ela
valer (na Vercel: Deployments → ⋯ → Redeploy; na Netlify: Deploys → Trigger
deploy).

---

## Passo 3 — Domínio próprio

Registre o domínio onde preferir (Registro.br para `.com.br`, ou a própria
plataforma). Depois:

- **Netlify:** Site settings → Domain management → Add a domain.
- **Vercel:** Settings → Domains → Add.

Nos dois casos ela mostra os registros de DNS para colar no painel do
registrador. O certificado HTTPS é emitido sozinho, de graça, em alguns
minutos. **Espere o HTTPS ficar ativo antes de divulgar o link** — o site manda
um cabeçalho HSTS de 2 anos, e navegador que visitar por HTTP antes do
certificado pode guardar o erro.

---

## Passo 4 — Conferir depois de no ar

Uma passada rápida, na ordem:

1. Abrir no **celular** — é de onde vem a maior parte do tráfego de pecuarista.
2. Rolar até **Filhos do Pontual em campo**: as fotos aparecem, os vídeos tocam
   e o áudio não se sobrepõe ao trocar de vídeo.
3. No **simulador**, mudar a quantidade e conferir se o preço por dose bate com
   a tabela.
4. Clicar em **Prosseguir no WhatsApp** e ver se a mensagem chega pronta, com
   quantidade, preço e total.
5. Recusar e depois aceitar no **banner de cookies** — sem aceite, nenhum
   script do Google ou da Meta pode carregar.
6. Conferir os cabeçalhos de segurança em
   <https://securityheaders.com> (deve dar A ou A+).

---

## Como atualizar o site depois

Não tem painel, nem FTP, nem upload. Você edita o arquivo, e:

```powershell
git add -A
git commit -m "o que mudou"
git push
```

A plataforma vê o push, constrói e publica sozinha em 1 a 2 minutos. Se o build
quebrar, ela **mantém a versão anterior no ar** e manda o erro por e-mail.

---

## Se o build falhar

O motivo quase certo é a loja antiga: se sobrou `src/app/api`, `prisma/`,
`middleware.ts` ou algum arquivo de `src/lib` da lista do `publicar.ps1`, o
build quebra porque eles importam coisas que não existem mais no projeto. Rode
o `publicar.ps1` de novo.

O `.gitignore` deste repositório já lista esses caminhos como rede de
segurança, então eles não chegam ao GitHub nem que fiquem no seu disco.
