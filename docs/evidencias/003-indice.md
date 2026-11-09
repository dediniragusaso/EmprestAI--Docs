# Evidências de tela — 003-solicitar-emprestimo (índice, estado real em 09/11/2026)

Provas manuais dos CA de "Tela" (sem Playwright, decisão do operador). O agente não tem navegador e
**não tirou nenhum print**: todos são do operador. Em 09/11/2026 o operador decidiu **não produzir mais
prints, por prazo**. Este índice lista só o que existe em `docs/evidencias/` (conferido com `ls`) e
o que o agente viu abrindo cada arquivo. Ambiente "produção" = Vercel, conta de teste; "local" = back e
front locais, banco local.

## O que existe (arquivos da 003)
| # | Arquivo | Ambiente | O que mostra | CA |
|---|---|---|---|---|
| 1 | `003-prod-catalogo.png` | produção | cabeçalho "9 de 12 equipamentos disponíveis agora", 4 chips, e-mail da conta de teste, cards TI-0001 a TI-0003 | CA-02 |
| 2 | `003-prod-catalogo-2.png` | produção | os 12 cards juntos, reduzidos (grade 3x4, TI-0001 a TI-0012) | CA-02 |
| 3 | `003-prod-rodape.png` | produção | TI-0010 (Em manutenção, "Indisponível"), TI-0011, TI-0012 e "Fotos: Pixabay" com link | CA-02, CA-22, CA-04 ("Indisponível") |
| 4 | `003-prod-ca19-modal.png` | produção | modal "Solicitar empréstimo", Notebook 14 polegadas, "Devolver até 23/11/2026" | CA-19 |
| 5 | `003-prod-ca19-resultado.png` | produção | toast "Empréstimo registrado…", TI-0001 "Está com você · devolução prevista até 23/11/2026", "8 de 12" | CA-19, CA-04 ("Está com você") |
| 6 | `003-prod-meus.png` | produção | Meus empréstimos: "1 de 3 itens", linha "Em dia", sem "Devolver" | CA-19, CA-21 (1 item) |
| 7 | `003-prod-ca21-vazio.png` | produção | Meus empréstimos: "0 de 3 itens", barra vazia, caixa tracejada "Ir ao catálogo" | CA-21 (vazio) |
| 8 | `003-prod-ca23-busca.png` | produção | "monitor" digitado: só Monitor 24, 27 e 22 polegadas | CA-23 |
| 9 | `003-prod-ca23-chip.png` | produção | chip "Em manutenção" ativo: TI-0004, TI-0007 e TI-0010 | CA-23 |
| 10 | `003-local-ca04-emprestado-outra-pessoa.png` | local | TI-0001 "Emprestado · devolução prevista até 23/11/2026", botão "Emprestado", sem nome de pessoa | CA-04 |
| 11 | `003-local-ca20-atraso.png` | local | banner vermelho de atraso, TI-0001 "Está com você · … 06/11/2026", "Bloqueado por atraso" nos disponíveis | CA-20 (atraso) |
| 12 | `003-local-ca21-tres.png` | local | **O nome diz CA-21, mas o arquivo mostra o Catálogo**: 3 itens "Está com você" e "Limite de 3 itens" nos disponíveis. Prova o CA-20 (limite); **não** prova o CA-21 ("3 de 3" em Meus empréstimos) | CA-20 (limite) |

Fora desta lista, sem relação com a 003: `002-ca06-login-professor-producao.png.jpeg` e `orientacao-pixabay.md`.
O CA-24 não tem print: o resultado do SQL está em `docs/specs/003-solicitar-emprestimo/evidencias-producao.md`.
Dispensados pelo operador em 09/11/2026 (o CA-19 é provado pelos prints 4 a 6): os prints locais de CA-19.

## Por CA
| CA | Prova que existe | O que falta |
|---|---|---|
| CA-02 | 1, 2 e 3 | nada pedido (o quadro neutro sem foto não tem print; os 12 itens têm foto) |
| CA-04 | 3 ("Indisponível"), 5 ("Está com você"), 10 ("Emprestado", sem nome) | nada |
| CA-19 | 4, 5 e 6 | nada |
| CA-20 | 11 (atraso) e 12 (limite) | **SEM PROVA: o operador decidiu não produzir, por prazo** — recusa 409 em texto na tela |
| CA-21 | 6 (1 item) e 7 (vazio) | **SEM PROVA: o operador decidiu não produzir, por prazo** — Meus empréstimos com 3 itens e com atraso |
| CA-22 | 3 | nada |
| CA-23 | 8 e 9 | nada |

## SEM PROVA: o operador decidiu não produzir, por prazo
- **CA-20:** recusa 409 vinda da API aparecendo em texto na tela (arquivo previsto `003-local-ca20-recusa-409.png`, não existe).
- **CA-21:** Meus empréstimos com 3 empréstimos (previsto `003-local-ca21-tres.png`; o arquivo com esse nome mostra o catálogo) e com um empréstimo em atraso (previsto `003-local-ca21-atraso.png`, não existe).

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
