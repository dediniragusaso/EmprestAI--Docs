# Evidências de tela — 003-solicitar-emprestimo (índice)

Provas manuais dos CA de "Tela" (sem Playwright, decisão do operador). **O agente não tem navegador
nesta sessão e não tirou nenhum print**: a captura é do operador. Todos os arquivos ficam **nesta
pasta** (`docs/evidencias/`), com o nome exato da coluna "Arquivo". Preencha data e ambiente.

**CA-19 = prints de produção (itens 3 e 4).** Os prints locais 9, 10 e 11 foram dispensados pelo operador em 09/11/2026.

Windows: `Win + Shift + S` (recorte) ou `Win + PrtScn` (salva em Imagens\Capturas de tela). O toast
dura 2,6 s: dispare `Win + PrtScn` logo depois de clicar.

## Situação em 09/11/2026
- **Existem** (conferidos pelo agente): os 5 prints de produção, itens 1 a 5, com os nomes exatos, e o
  print extra `003-prod-catalogo-2.png` (item 1b). CA-02: `003-prod-catalogo.png` mostra os cards 1 a 6,
  `003-prod-catalogo-2.png` os cards 7 a 9 (o arquivo, reduzido, mostra na verdade os 12 cards juntos,
  TI-0001 a TI-0012, em grade 3x4) e `003-prod-rodape.png` os cards 10 a 12; juntos provam os 12. O item 6 (textos do SQL) está
  registrado no `evidencias-producao.md`, com a nota do engano com a conta do professor.
- **Dispensados** pelo operador: os locais 9, 10 e 11 (CA-19).
- **PENDENTES** (prints locais, nenhum arquivo existe ainda):
  - CA-04: item 7 `003-local-ca04-esta-com-voce.png`, item 8 `003-local-ca04-emprestado-outra-pessoa.png`
  - CA-20: item 12 `003-local-ca20-limite.png`, item 13 `003-local-ca20-atraso.png`, item 14 `003-local-ca20-recusa-409.png`
  - CA-21: item 15 `003-local-ca21-vazio.png`, item 16 `003-local-ca21-um.png`, item 17 `003-local-ca21-tres.png`, item 18 `003-local-ca21-atraso.png`
  - CA-23: item 19 `003-local-ca23-busca.png`, item 20 `003-local-ca23-chip.png`

## Produção (Vercel, conta de teste; nunca a do professor)
| # | CA | Arquivo | O que precisa estar visível | Data | Ambiente |
|---|---|---|---|---|---|
| 1 | CA-02 | `003-prod-catalogo.png` | 12 cards com foto 4:3, nome, categoria, patrimônio, pill; "9 de 12 equipamentos disponíveis agora"; chips; e-mail da conta de teste | 09/11/2026 | Produção (Vercel), conta de teste |
| 1b | CA-02 | `003-prod-catalogo-2.png` | os cards TI-0007 a TI-0009 (o arquivo, reduzido, traz os 12 cards em grade 3x4) | 09/11/2026 | Produção (Vercel), conta de teste |
| 2 | CA-22 | `003-prod-rodape.png` | rodapé "Fotos: Pixabay" com o link | 09/11/2026 | Produção (Vercel), conta de teste |
| 3 | CA-19 (prova) | `003-prod-ca19-modal.png` | modal "Solicitar empréstimo" com o equipamento e "Devolver até" (hoje + 14) | 09/11/2026 | Produção (Vercel), conta de teste |
| 4 | CA-19 (prova) | `003-prod-ca19-resultado.png` | toast "Empréstimo registrado…"; se perder o toast, repita (limpeza 5.2 do `evidencias-producao.md` e novo pedido) ou registre o card "Está com você" como resultado | 09/11/2026 | Produção (Vercel), conta de teste |
| 5 | CA-21 | `003-prod-meus.png` | "1 de 3 itens em seu nome · prazo padrão de 14 dias", uma linha "Em dia", sem botão "Devolver" | 09/11/2026 | Produção (Vercel), conta de teste |
| 6 | CA-24 | (texto) | resultado das consultas, colado em `docs/specs/003-solicitar-emprestimo/evidencias-producao.md` (passos 4 a 6) | 09/11/2026 | Produção (SQL Editor), texto no `evidencias-producao.md` |

## Local (back e front locais; banco local; cenários de `cenarios-locais.sql`)
| # | CA | Cenário | Arquivo | O que precisa estar visível | Data |
|---|---|---|---|---|---|
| 7 | CA-04 | `um`, conta de teste | `003-local-ca04-esta-com-voce.png` | TI-0001 "Está com você · devolução prevista até…" e um card em manutenção com "Indisponível" | |
| 8 | CA-04 | `um`, professor **local** | `003-local-ca04-emprestado-outra-pessoa.png` | TI-0001 "Emprestado · devolução prevista até…", botão "Emprestado", sem nome de pessoa | |
| 9 | CA-19 | — | ~~`003-local-ca19-modal.png`~~ | **DISPENSADO** pelo operador em 09/11/2026: o CA-19 é provado pelos prints de produção 3 e 4 | |
| 10 | CA-19 | — | ~~`003-local-ca19-toast.png`~~ | **DISPENSADO** (idem) | |
| 11 | CA-19 | — | ~~`003-local-ca19-resultado.png`~~ | **DISPENSADO** (idem) | |
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
