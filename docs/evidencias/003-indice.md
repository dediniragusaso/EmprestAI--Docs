# Evidências de tela — 003-solicitar-emprestimo (índice)

Provas manuais dos CA de "Tela" (sem Playwright, decisão do operador). **O agente não tem navegador
nesta sessão e não tirou nenhum print**: a captura é do operador. Todos os arquivos ficam **nesta
pasta** (`docs/evidencias/`), com o nome exato da coluna "Arquivo". Preencha data e ambiente.

Windows: `Win + Shift + S` (recorte) ou `Win + PrtScn` (salva em Imagens\Capturas de tela). O toast
dura 2,6 s: dispare `Win + PrtScn` logo depois de clicar.

## Produção (Vercel, conta de teste; nunca a do professor)
| # | CA | Arquivo | O que precisa estar visível | Data | Ambiente |
|---|---|---|---|---|---|
| 1 | CA-02 | `003-prod-catalogo.png` | 12 cards com foto 4:3, nome, categoria, patrimônio, pill; "9 de 12 equipamentos disponíveis agora"; chips; e-mail da conta de teste | | |
| 2 | CA-22 | `003-prod-rodape.png` | rodapé "Fotos: Pixabay" com o link | | |
| 3 | CA-19 | `003-prod-ca19-modal.png` | modal "Solicitar empréstimo" com o equipamento e "Devolver até" (hoje + 14) | | |
| 4 | CA-19 | `003-prod-ca19-resultado.png` | toast "Empréstimo registrado…" (ou, se perder o toast, o card "Está com você") | | |
| 5 | CA-21 | `003-prod-meus.png` | "1 de 3 itens em seu nome · prazo padrão de 14 dias", uma linha "Em dia", sem botão "Devolver" | | |
| 6 | CA-24 | (texto) | resultado das consultas, colado em `docs/specs/003-solicitar-emprestimo/evidencias-producao.md` (passos 4 a 6) | | |

## Local (back e front locais; banco local; cenários de `cenarios-locais.sql`)
| # | CA | Cenário | Arquivo | O que precisa estar visível | Data |
|---|---|---|---|---|---|
| 7 | CA-04 | `um`, conta de teste | `003-local-ca04-esta-com-voce.png` | TI-0001 "Está com você · devolução prevista até…" e um card em manutenção com "Indisponível" | |
| 8 | CA-04 | `um`, professor **local** | `003-local-ca04-emprestado-outra-pessoa.png` | TI-0001 "Emprestado · devolução prevista até…", botão "Emprestado", sem nome de pessoa | |
| 9 | CA-19 | `limpar` | `003-local-ca19-modal.png` | modal aberto com "Devolver até" | |
| 10 | CA-19 | `limpar` | `003-local-ca19-toast.png` | toast verde de confirmação | |
| 11 | CA-19 | (após o pedido) | `003-local-ca19-resultado.png` | card "Está com você" no catálogo | |
| 12 | CA-20 | `limite` | `003-local-ca20-limite.png` | "Limite de 3 itens" desabilitado nos cards disponíveis | |
| 13 | CA-20 | `atraso` | `003-local-ca20-atraso.png` | banner vermelho de atraso e "Bloqueado por atraso" | |
| 14 | CA-20 | duas janelas | `003-local-ca20-recusa-409.png` | toast vermelho com o motivo em texto ("Emprestado: outra pessoa acabou de ficar com este equipamento.") | |
| 15 | CA-21 | `limpar` | `003-local-ca21-vazio.png` | caixa tracejada com "Ir ao catálogo" | |
| 16 | CA-21 | `um` | `003-local-ca21-um.png` | "1 de 3 itens…", sem botão "Devolver" | |
| 17 | CA-21 | `limite` | `003-local-ca21-tres.png` | "3 de 3 itens…" e os 3 traços ocupados | |
| 18 | CA-21 | `atraso` | `003-local-ca21-atraso.png` | linha vermelha "Em atraso" e traço vermelho | |
| 19 | CA-23 | `limpar` | `003-local-ca23-busca.png` | "monitor" digitado e só os 3 monitores listados | |
| 20 | CA-23 | `limpar` | `003-local-ca23-chip.png` | chip "Em manutenção" ativo e os 3 cards em manutenção | |

## Subir o ambiente local (sem ler `.env`)
As variáveis ficam **só nessa janela do PowerShell** e vencem o `back/.env` e o `front/.env`, que
apontam para o remoto. Chaves e senhas locais não vão para arquivo nem para commit.

1. Docker Desktop aberto. Na raiz: `supabase start` (sem a CLI: `npx supabase start`). Anote da saída
   a `anon key` e a `service_role key` (`supabase status` mostra de novo).
2. Janela A, em `back/`:
   ```
   $env:DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
   $env:DIRECT_URL = $env:DATABASE_URL
   $env:SUPABASE_URL = 'http://127.0.0.1:54321'
   $env:SUPABASE_JWKS_URL = 'http://127.0.0.1:54321/auth/v1/.well-known/jwks.json'
   $env:CORS_ORIGIN = 'http://localhost:5173'
   $env:SUPABASE_SERVICE_ROLE_KEY = '<service_role do supabase start>'
   $env:SEED_PROFESSOR_PASSWORD = '<senha local à sua escolha>'
   $env:SEED_TESTE_EMAIL = 'teste@local.dev'
   $env:SEED_TESTE_PASSWORD = '<senha local à sua escolha>'
   ([uri]$env:DIRECT_URL).Host     # deve mostrar 127.0.0.1
   npx prisma migrate deploy
   npm run db:seed
   npm run imagens:validar -- --exigir-revisao
   npm run imagens:enviar
   npm run db:dados-iniciais
   npm run start:dev
   ```
   Confira `http://localhost:3000/v1/health` → `{"status":"ok"}` e deixe a janela aberta.
3. Janela B, em `front/`:
   ```
   $env:VITE_API_URL = 'http://localhost:3000/v1'
   $env:VITE_SUPABASE_URL = 'http://127.0.0.1:54321'
   $env:VITE_SUPABASE_ANON_KEY = '<anon key do supabase start>'
   npm run dev
   ```
   Abra `http://localhost:5173` e entre com `teste@local.dev` e a senha local.
4. Janela C, na **raiz**, para trocar de cenário (o contêiner é `supabase_db_<project_id>`, aqui
   `supabase_db_Empresitmo-TI`; confira com `docker ps`):
   ```
   function Cenario($c, $e = 'teste@local.dev') {
     Get-Content docs/specs/003-solicitar-emprestimo/cenarios-locais.sql -Raw |
       docker exec -i supabase_db_Empresitmo-TI psql -U postgres -d postgres `
         -v "local='sim'" -v "email='$e'" -v "cenario='$c'" -f -
   }
   Cenario limpar     # também: um, limite, atraso
   ```
   Depois de cada cenário, recarregue a página (`F5`): o catálogo e Meus empréstimos ficam em cache.
5. Se o login funcionar mas o catálogo disser "Não foi possível carregar" e a janela A registrar 401
   "Algoritmo nao aceito", o Auth local assina com HS256 e a API só aceita ES256/RS256 (JWKS). Avise
   o agente: é uma decisão de configuração do Supabase local, e não do front.

CA-26 e o placeholder (CA-22) já têm a busca de texto em `front/src` registrada nas T11 e T15.
