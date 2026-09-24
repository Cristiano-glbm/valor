# Ligar o domínio da HostGator ao site

Guia escrito em 24/09/2026, para o caso deste projeto:

- domínio **registrado na HostGator**
- site publicado na **Netlify**
- **sem e-mail profissional** nesse domínio

Esse último ponto é o que define o caminho. Sem e-mail para preservar, o
melhor é entregar o DNS inteiro para a Netlify, trocando os *nameservers*. Se
um dia você quiser e-mail no domínio, dá para fazer do mesmo jeito: veja a
última seção.

---

## Por que o site fica na Netlify (e quando valeria mudar)

A escolha foi feita com os dois lados na mesa.

**A favor da Netlify, neste projeto:**

- **Publicação automática.** `git push` e o site atualiza em 2 minutos, com o
  build validado antes de publicar: se quebrar, a versão anterior fica no ar.
  Na HostGator cada alteração vira build local, zipar a pasta `out/`, subir por
  cPanel, extrair e apagar os arquivos velhos.
- **Menos risco de descompasso.** Já aconteceu de o site no ar ficar atrás do
  repositório porque a publicação não tinha rodado. Upload manual aumenta essa
  chance, não diminui.
- **Cabeçalhos de segurança e regras de cache** já escritos e testados no
  `netlify.toml`. Na HostGator seria preciso replicar tudo num `.htaccess` e
  manter os dois em sincronia.

**A favor da HostGator, com honestidade:**

- **Servidor no Brasil.** O público é pecuarista brasileiro, e a página tem
  15 MB de vídeo. Dependendo da rota, um servidor em São Paulo entrega mais
  rápido que a CDN.
- **Suporte em português**, por telefone e chat. A Netlify é fórum em inglês.
- **Uma conta só** para domínio, e-mail e site.
- **É contrato pago**, não plano gratuito de empresa estrangeira que pode mudar
  de regra.
- **Se um dia precisar de servidor** (formulário que grava dados, um WordPress
  ao lado), a HostGator faz; a Netlify estática não.

**O que decide:** com que frequência o site muda. Enquanto estiver sendo
ajustado com frequência, a publicação automática compensa ter dois
fornecedores. Quando estabilizar, a HostGator resolve bem e simplifica a
administração.

E não é porta de sentido único: mudar depois é devolver os nameservers para os
da HostGator e subir a pasta `out/` uma vez.

O plano que você pagou não é desperdício: ele segue servindo o registro do
domínio e qualquer outro site que você venha a ter.

---

## Antes de começar

**Publique as alterações pendentes.** Na pasta do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\publicar.ps1
```

Há uma correção de cache esperando para subir. Sem ela, quem já visitou o site
continua vendo a foto antiga do touro. Não faz sentido apontar o domínio para
uma versão desatualizada.

---

## Passo 1 — Adicionar o domínio na Netlify e pegar os nameservers

1. Entre em <https://app.netlify.com> e abra o site `pontual-st-cruz`.
2. **Domain management → Add a domain**.
3. Digite o domínio **sem `www`** (por exemplo `pontualstcruz.com.br`) e
   confirme. A Netlify adiciona o `www` sozinha.
4. Quando ela perguntar como configurar, escolha **Netlify DNS** (aparece como
   "Set up Netlify DNS" ou "Use Netlify DNS").
5. Ela vai mostrar **quatro nameservers**, no formato:

   ```
   dns1.p0X.nsone.net
   dns2.p0X.nsone.net
   dns3.p0X.nsone.net
   dns4.p0X.nsone.net
   ```

   **Copie os quatro exatamente como aparecem na sua tela.** O número no meio
   (`p01`, `p04`, etc.) muda de domínio para domínio. Não use os do exemplo
   acima, nem os de outro site: se errar, o domínio não resolve.

   Se precisar reencontrá-los depois: no painel da Netlify, **DNS** na barra
   lateral → seu domínio → painel **Name servers**.

---

## Passo 2 — Colar os nameservers na HostGator

Agora sim, aquela tela:

**Escolha a plataforma de site → Outra plataforma de hospedagem**

| Campo | Valor |
|---|---|
| Servidor 1 | `dns1.p0X.nsone.net` |
| Servidor 2 | `dns2.p0X.nsone.net` |
| Servidor 3 | `dns3.p0X.nsone.net` |
| Servidor 4 | `dns4.p0X.nsone.net` |

Use **"Adicionar mais um servidor"** duas vezes para caber os quatro. Se o
formulário aceitar só dois, os dois primeiros funcionam, mas coloque os quatro
quando der: é o que dá redundância se um deles cair.

Salve e pronto. A HostGator avisa que a partir daí *"a criação de site,
registros na Zona de DNS, apontamentos de e-mail e outras configurações deverão
ser feitas no outro provedor"* — isso está correto e é o esperado. A Netlify
passa a ser a dona da zona.

---

## Passo 3 — Esperar e conferir

A propagação leva de alguns minutos a 24 horas.

1. Na Netlify, em **Domain management**, o aviso de DNS pendente vira um visto
   verde quando os nameservers novos forem enxergados.
2. O certificado HTTPS é emitido sozinho, de graça, e com Netlify DNS ele cobre
   o domínio raiz e os subdomínios de uma vez.
3. Escolha qual endereço é o **primary domain** (com ou sem `www`). O outro
   passa a redirecionar para ele.
4. Ligue **Force HTTPS**.

Para acompanhar a propagação de fora: <https://dnschecker.org>, consultando o
tipo **NS** do seu domínio. Quando aparecerem os `nsone.net`, terminou.

**Espere o HTTPS ficar ativo antes de divulgar o link.** O site manda um
cabeçalho HSTS de 2 anos: um navegador que visitar por HTTP antes do
certificado pode guardar o erro.

---

## Passo 4 — Atualizar o endereço no projeto

Na Netlify, em **Site configuration → Environment variables**, ajuste:

```
NEXT_PUBLIC_APP_URL = https://seudominio.com.br
```

Depois **Deploys → Trigger deploy → Deploy site**, porque variável de ambiente
só vale em build novo.

---

## Passo 5 — Conferir depois de no ar

1. Abrir `https://seudominio.com.br` e `https://www.seudominio.com.br`: os dois
   respondem, um redirecionando para o outro.
2. Cadeado de HTTPS nos dois.
3. Abrir no celular e conferir a foto do touro, o carrossel e o botão do
   WhatsApp.
4. Rodar <https://securityheaders.com> no domínio novo (deve dar A ou A+).

---

## Se algo der errado

**O site não abre depois de 24 horas.** Confira em <https://dnschecker.org>, no
tipo NS, se os quatro `nsone.net` já aparecem. Se ainda mostram os da
HostGator, a alteração não foi salva; refaça o passo 2.

**A Netlify não reconhece o domínio.** Quase sempre é nameserver digitado
errado, ou o número do meio (`p01` × `p04`) copiado de outro lugar. Confira
contra o painel **DNS → seu domínio → Name servers**.

**Quer voltar tudo para a HostGator.** Na mesma tela, escolha de novo a
hospedagem da HostGator, que ela repõe os nameservers padrão. Depois é subir a
pasta `out/` na `public_html` e criar um `.htaccess` com os cabeçalhos que hoje
estão no `netlify.toml`. É só pedir que eu preparo.

---

## Se um dia quiser e-mail nesse domínio

Com a zona na Netlify, o e-mail da HostGator **não funciona sozinho**: os
registros MX deixaram de existir quando os nameservers mudaram. Para ter
`contato@seudominio.com.br` depois, há dois caminhos:

1. **Recriar os registros na Netlify.** Em **DNS → seu domínio → Add new
   record**, criar os MX que a HostGator informar, mais os TXT de SPF e DKIM.
   São uns 5 registros e leva 10 minutos.
2. **Voltar para o Editor de Zona da HostGator.** Devolver os nameservers para
   os deles e, no **cPanel → Zone Editor** (ou **Portal do Cliente → Domínios →
   Configurar Domínio → Editar Zona Avançada de DNS**), apontar só o site para
   a Netlify:

   | Registro | Tipo | Valor |
   |---|---|---|
   | domínio raiz (`@`) | A | `75.2.60.5` |
   | `www` | CNAME | `pontual-st-cruz.netlify.app` |

   Assim o e-mail fica na HostGator e só o site vai para a Netlify. É o
   caminho mais conservador, e a própria Netlify o chama de alternativa menos
   resiliente que o DNS dela, porque prende um IP fixo no registro A.
