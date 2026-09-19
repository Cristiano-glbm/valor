# ============================================================================
#  PUBLICAR O SITE
#
#  Este script publica o site. Ele faz, em ordem:
#
#    1. Apaga os restos da loja antiga (checkout, Asaas, Prisma, e-mail).
#       Esses arquivos importam coisas que nao existem mais e quebram o build.
#    2. Confere que o .env (com as suas chaves) NAO vai para o GitHub.
#    3. Cria o repositorio git e o primeiro commit.
#    4. Envia para o GitHub — e o push faz a Netlify publicar sozinha.
#
#  COMO RODAR:
#    1. Clique com o botao direito na pasta do projeto > "Abrir no Terminal"
#    2. Cole e execute:
#         powershell -ExecutionPolicy Bypass -File .\publicar.ps1
#
#  Pode rodar quantas vezes quiser. Ele nao apaga nada alem do que lista.
# ============================================================================

$ErrorActionPreference = "Stop"

function Titulo($t) { Write-Host ""; Write-Host "=== $t ===" -ForegroundColor Cyan }
function Ok($t)     { Write-Host "  [ok] $t" -ForegroundColor Green }
function Aviso($t)  { Write-Host "  [!] $t" -ForegroundColor Yellow }
function Erro($t)   { Write-Host "  [ERRO] $t" -ForegroundColor Red }

Write-Host ""
Write-Host "  Publicacao do site Pontual FIV St. Cruz" -ForegroundColor White
Write-Host "  Pasta: $(Get-Location)" -ForegroundColor DarkGray

if (-not (Test-Path "package.json")) {
    Erro "nao encontrei o package.json aqui."
    Write-Host "  Rode este script de dentro da pasta do projeto."
    exit 1
}

# ---------------------------------------------------------------- 1. limpeza
Titulo "1. Limpando os restos da loja antiga"

$pastas = @("src/app/api", "prisma")
$arquivos = @(
    "src/middleware.ts",
    "src/app/componentes/CheckoutModal.tsx",
    "src/lib/prisma.ts",
    "src/lib/asaas.ts",
    "src/lib/email.ts",
    "src/lib/seguranca.ts",
    "src/lib/pedidos-status.ts",
    "src/lib/webhook-idempotencia.ts",
    "src/lib/tracking-servidor.ts",
    "src/lib/env-load.ts"
)

$encontrados = @()
foreach ($p in $pastas)   { if (Test-Path $p) { $encontrados += "[pasta]   $p" } }
foreach ($a in $arquivos) { if (Test-Path $a) { $encontrados += "[arquivo] $a" } }

if ($encontrados.Count -eq 0) {
    Ok "nada a remover, a pasta ja esta limpa."
} else {
    Write-Host "  Vou remover:" -ForegroundColor Yellow
    $encontrados | ForEach-Object { Write-Host "     $_" }
    Write-Host ""
    $r = Read-Host "  Confirma? (s/n)"
    if ($r -ne "s" -and $r -ne "S") {
        Aviso "cancelado. Nada foi alterado."
        exit 0
    }
    foreach ($p in $pastas)   { if (Test-Path $p) { Remove-Item -Recurse -Force $p;  Ok "removida a pasta $p" } }
    foreach ($a in $arquivos) { if (Test-Path $a) { Remove-Item -Force $a;           Ok "removido $a" } }
}

# o cache de build guarda tipos das rotas antigas e confunde o proximo build
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next"; Ok "removido o cache .next" }

# ------------------------------------------------------------------- 2. git
Titulo "2. Preparando o repositorio"

# Daqui para baixo o roteiro e todo git. O git escreve mensagens normais de
# progresso no stderr (o "git push" faz isso sempre), e com
# ErrorActionPreference = "Stop" o PowerShell trata isso como erro e aborta o
# script no meio. Entao passamos para "Continue" e conferimos o resultado de
# cada comando pelo codigo de saida, que e o sinal confiavel.
$ErrorActionPreference = "Continue"

function ConfereGit($descricao) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Erro "$descricao falhou (codigo $LASTEXITCODE)."
        Write-Host "  A mensagem do git esta logo acima. Nada foi enviado."
        exit 1
    }
}

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Erro "o git nao esta instalado."
    Write-Host "  Instale em https://git-scm.com/download/win, feche e reabra o terminal,"
    Write-Host "  e rode este script de novo."
    exit 1
}
Ok "git encontrado"

if (-not (Test-Path ".git")) {
    git init -b main | Out-Null
    Ok "repositorio criado (branch main)"
} else {
    Ok "repositorio ja existia"
}

if (-not (git config user.email)) {
    Write-Host ""
    Aviso "o git ainda nao sabe quem e voce."
    $nome  = Read-Host "  Seu nome"
    $email = Read-Host "  Seu e-mail"
    git config user.name  "$nome"
    git config user.email "$email"
    Ok "identidade configurada"
}

# ------------------------------------------------- 3. checagem de seguranca
Titulo "3. Conferindo que nenhum segredo vai junto"

$vazando = @()
foreach ($segredo in @(".env", ".env.local", ".env.production")) {
    if (Test-Path $segredo) {
        git check-ignore -q $segredo
        if ($LASTEXITCODE -ne 0) { $vazando += $segredo }
    }
}

if ($vazando.Count -gt 0) {
    Erro "estes arquivos com chaves NAO estao sendo ignorados pelo git:"
    $vazando | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    Write-Host "  Parei aqui de proposito. Confira o .gitignore antes de continuar."
    exit 1
}
Ok ".env e variantes estao fora do commit"

# ----------------------------------------- 3b. arquivos versionados por engano
Titulo "3b. Limpando o que nao devia estar versionado"

# Pergunta ao proprio git quais arquivos ele ainda rastreia APESAR de o
# .gitignore mandar ignorar — caso da midia do WhatsApp em public/images, que
# entrou no commit antes de a regra existir. Acrescentar ao .gitignore nao
# desfaz o rastreamento: e preciso "git rm --cached", que tira do repositorio
# e NAO apaga do disco.
$ignoradosMasVersionados = @(git ls-files --cached --ignored --exclude-standard)

if ($ignoradosMasVersionados.Count -eq 0) {
    Ok "nada versionado contra o .gitignore"
} else {
    foreach ($f in $ignoradosMasVersionados) {
        git rm --cached --quiet -- $f
        Write-Host "  tirado do repositorio (continua no disco): $f" -ForegroundColor DarkGray
    }
    Ok "$($ignoradosMasVersionados.Count) arquivo(s) saiu(ram) do repositorio"
}

# ---------------------------------------------------------------- 4. commit
Titulo "4. Criando o commit"

git add -A
ConfereGit "o 'git add'"

$mudou = @(git status --porcelain)
if ($mudou.Count -eq 0) {
    Ok "nada mudou desde o ultimo commit"
} else {
    $n = @(git diff --cached --name-only).Count
    git commit -m "Atualizacao do site do Pontual FIV St. Cruz" | Out-Null
    ConfereGit "o 'git commit'"
    Ok "commit criado com $n arquivo(s) alterado(s)"
}

Write-Host ""
Write-Host "  Arquivos que vao para o GitHub:" -ForegroundColor DarkGray
git ls-files | ForEach-Object { Write-Host "     $_" -ForegroundColor DarkGray }

# ---------------------------------------------------------------- 5. GitHub
Titulo "5. Publicando no GitHub"

$temRemote = @(git remote)
if ($temRemote.Count -gt 0) {
    Ok "remote configurado ($($temRemote -join ', '))"
    Write-Host "  Enviando..."
    git push -u origin main
    ConfereGit "o 'git push'"
    Ok "enviado"
} else {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if ($gh) {
        Write-Host "  Encontrei o GitHub CLI. Posso criar o repositorio e enviar agora."
        $nomeRepo = Read-Host "  Nome do repositorio (enter para 'pontual-st-cruz')"
        if (-not $nomeRepo) { $nomeRepo = "pontual-st-cruz" }
        $vis = Read-Host "  Privado ou publico? (p = privado, u = publico) [p]"
        $flagVis = if ($vis -eq "u") { "--public" } else { "--private" }
        gh repo create $nomeRepo $flagVis --source=. --remote=origin --push
        ConfereGit "a criacao do repositorio no GitHub"
        Ok "repositorio criado e enviado"
    } else {
        Write-Host ""
        Aviso "o GitHub CLI nao esta instalado. Faltam so dois passos manuais:"
        Write-Host ""
        Write-Host "     1) Crie um repositorio vazio em https://github.com/new" -ForegroundColor White
        Write-Host "        (sem README, sem .gitignore, sem licenca)" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "     2) Volte aqui e cole os dois comandos que o GitHub mostrar," -ForegroundColor White
        Write-Host "        que sao parecidos com:" -ForegroundColor White
        Write-Host ""
        Write-Host "        git remote add origin https://github.com/SEU-USUARIO/pontual-st-cruz.git" -ForegroundColor Cyan
        Write-Host "        git push -u origin main" -ForegroundColor Cyan
        Write-Host ""
    }
}

Titulo "Pronto"
Write-Host "  A Netlify ve o push sozinha e publica em 1 a 2 minutos."
Write-Host "  Acompanhe em: https://app.netlify.com  (aba Deploys)"
Write-Host "  Se algo der errado, o passo a passo esta em docs/DEPLOY.md"
Write-Host ""
