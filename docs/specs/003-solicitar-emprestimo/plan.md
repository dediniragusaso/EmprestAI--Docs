# Plano — 003-solicitar-emprestimo
Restringido por ADR-001 §3 (Controller → Service → Repository, pastas por domínio), §4 (REST, `/v1`,
Problem Details, cursor), §6 (`tenant_id` em toda query, tenant nunca do body), §7 (JWT por JWKS),
§8 (Jest, Testcontainers com Postgres real, supertest, isolamento por endpoint) e §9 (env validado);
por ADR-003 §5.2, §5.3, §5.6 e §7 (telas, rótulos e habilitação dos botões); por
`docs/modelagem-banco.md` §4.5, §6 e §7; e por `rules/restrictions.md` ("Produção"), `rules/tests.md`,
`rules/checks.md`, `rules/secrets.md` e `rules/spec-flow.md`.

Nenhuma etapa escreve em produção. Todo comando do agente roda contra Postgres descartável
(Testcontainers) ou banco local, com as variáveis definidas no próprio comando (o ambiente do
processo vence o `back/.env`, que aponta para o remoto). Os `.env` não são lidos nem editados.
**Nada daqui vira código antes da Etapa 0** (spec aprovada e perguntas Q1 a Q13 respondidas).

## Etapa 0 — Decisões (sem código) — FEITA
Objetivo: o operador aprova a spec e responde Q1 a Q13. **Feita em 09/11/2026**: todas aceitas, com
as precisões registradas na spec (Q3 privacidade, Q11 contagem na tela, Q12 ordem, Q13 prova local e
um único pedido em produção). Cada pergunta trava as etapas abaixo; com as 13 respondidas, nenhuma
está bloqueada:

| Pergunta | Trava |
|---|---|
| Q1 tenant pelo vínculo | Etapa 2 (`TenantGuard`) e todas as rotas |
| Q2 fuso `America/Sao_Paulo` | Etapa 2 (`Clock`), Etapas 3 e 4 (CA-16) |
| Q3 sem nome de pessoa | Etapa 3 (resposta) e Etapa 8 (card) |
| Q4 frases das recusas | Etapa 4 (`detail`) e Etapa 9 (toast) |
| Q5 cliente à mão e Zod direto | Etapa 7 e todo o back |
| Q6 `supertest` | Etapa 1 |
| Q7 nome da pasta | Etapa 12 |
| Q8 auditoria `loan.open` | Etapa 4 (CA-18) |
| Q9 sem "A vencer" e sem "Devolver" | Etapa 10 |
| Q10 quadro neutro sem foto | Etapa 8 (CA-02) |
| Q11 cursor e contagem na tela | Etapa 3 (cursor), Etapa 7 (percorre as páginas), Etapa 8 (CA-23) |
| Q12 ordem das verificações | Etapa 4 |
| Q13 prova em produção | Etapa 11 |

Arquivos: só `spec.md`. Atende: libera CA-01 a CA-26.

## Etapa 1 — Dependência de teste do back (Q6)
Objetivo: `supertest` e `@types/supertest`, versões fixas, mostradas antes de instalar (rules/tests.md
passo 2). Arquivos: `back/package.json`, `back/package-lock.json`. Verificação: `npm run build` e
`npm test` continuam passando; o lockfile só acrescenta pacotes. Atende: base de CA-01 a CA-18.
Sem outra dependência nova, no back ou no front (nada de `nestjs-zod`, orval, shadcn/ui, Zustand).

## Etapa 2 — Fundação do back (CA-14, CA-16)
Objetivo: o que as três rotas precisam em comum.
- `back/src/modules/prisma/prisma.module.ts` e `prisma.service.ts`: `PrismaClient` como provider
  global do Nest, ligado em `DATABASE_URL` (runtime pelo pooler com `connection_limit=1`, ADR-001 §5).
- `back/src/config/env.ts`: `DATABASE_URL` entra no schema Zod do boot (ADR-001 §9). O
  `.env.example` do back já lista a variável; **o agente não toca em `.env`**.
- `back/src/common/clock.ts`: interface `Clock` (`now()`), `SystemClock`, e funções puras
  `todayInSaoPaulo(now)` e `addDays(dateISO, n)` sobre data civil `YYYY-MM-DD` (R8, Q2). Token de
  injeção do Nest para o teste congelar a data.
- `back/src/common/problem-details.filter.ts`: o filtro passa a repassar `code` quando a exceção o
  traz (e `type` = `about:blank` continua). Teste do filtro.
- `back/src/modules/tenancy/`: `tenant.guard.ts`, que roda depois do `AuthGuard`, busca o
  `membership` da pessoa no tenant de slug `suporte_ti` (Q1) e põe `tenantId` e `role` no request;
  sem vínculo, 403. Tipo `TenantRequest` e decorator de parâmetro.
- `back/src/app.module.ts`: importa os módulos novos.
- Teste de infraestrutura: `back/src/modules/tenancy/tenant.guard.spec.ts` (Postgres do
  Testcontainers, vínculo existente e ausente; CA-14 parte do 403) e
  `back/src/common/clock.spec.ts` (CA-16: data civil e virada da meia-noite de Brasília).
- Teste de ponta a ponta da app: um helper `back/src/testing/app.ts` sobe o módulo Nest com o
  Postgres descartável, e troca o `JwtVerifierService` por um falso que lê o `sub` e o e-mail do
  token de teste (o verificador real já tem o seu spec). O helper reaproveita `subirBanco()` de
  `back/prisma/dados-iniciais/banco-teste.ts` (migrations por `psql -f`).
Verificação: `npm run build` (exit 0) e `npm test`.

## Etapa 3 — `GET /v1/equipment` (CA-01, CA-03, CA-13, CA-14, CA-16)
Objetivo: o catálogo na API.
- `back/src/modules/equipment/equipment.controller.ts` (rota, `AuthGuard` + `TenantGuard`),
  `equipment.service.ts` (monta `viewer`: `openLoans`, `maxLoans`, `overdue`, `today`,
  `proposedDueAt`), `equipment.repository.ts` (consulta com `tenant_id`, `LEFT JOIN` no empréstimo
  aberto para `loan.dueAt` e `loan.isMine`; ordem patrimônio crescente, nulos por último, `id`) e
  `equipment.schemas.ts` (Zod da query e do formato de resposta; `limit` 50 padrão, 100 máximo;
  cursor opaco em base64url com `{patrimonio, id}`, Q11).
- A resposta **não** inclui nome nem e-mail de quem está com o item (Q3).
- `back/src/modules/equipment/equipment.controller.spec.ts` (supertest): seed local dos 12 itens e
  de um segundo tenant; casos nomeados `CA-01`, `CA-03`, `CA-13` (catálogo do A sem itens do B),
  `CA-14` (401 e 403), `CA-16` (`today` com relógio congelado), e a paginação (cursor percorre os
  12 sem repetir nem pular).
Verificação: `npm run build` e `npm test`.

## Etapa 4 — `POST /v1/loans`: regras e atomicidade (CA-05 a CA-09, CA-16, CA-17, CA-18, CA-13, CA-14)
Objetivo: abrir empréstimo com as quatro recusas, sem concorrência ainda.
- `back/src/modules/loans/loans.controller.ts` (`POST /loans`, corpo `{ equipmentId }` validado
  por Zod; ignora qualquer `tenantId` do corpo), `loans.service.ts` (`openLoan`),
  `loans.repository.ts` (SQL e Prisma sempre com `tenant_id`) e `loan-refusal.exception.ts`
  (409 com `code`: `equipment-unavailable`, `equipment-already-loaned`, `loan-overdue`,
  `loan-limit-reached`, `detail` do Q4).
- `openLoan` roda numa transação interativa do Prisma, na ordem da R6: equipamento do tenant (404)
  → `status` (409) → atraso (409) → limite (409) → `INSERT` em `loans` com `due_at` = hoje + 14
  → `UPDATE equipment SET status = 'EMPRESTADO'` → `INSERT` em `audit_logs` (`action` `loan.open`, `resource_type` `loan`, `resource_id` do `loan`, `tenant_id` do guard, `actor_user_id` = `sub` do JWT). O
  relógio vem do `Clock` injetado. Falha em qualquer passo desfaz tudo.
- Ponto de injeção de falha só para teste (o repositório de auditoria é um provider substituível),
  para o CA-06.
- `back/src/modules/loans/loans.controller.spec.ts` (supertest): casos `CA-05` (201 e estado do
  banco), `CA-06` (auditoria falha, nada resta), `CA-07` (4º pedido), `CA-08` (atraso, e `dueAt`
  igual a hoje aceito), `CA-09` (manutenção e emprestado), `CA-17` (corpo inválido), `CA-18`
  (auditoria só no sucesso), `CA-13` (id de outro tenant dá 404 e corpo com `tenantId` é ignorado),
  `CA-14` (401 e 403), `CA-16` (relógio congelado em D, inclusive às 23:59 e às 00:01 de
  `America/Sao_Paulo`: o `dueAt` criado é D + 14). O atraso é semeado por `INSERT` direto no banco descartável.
Verificação: `npm run build` e `npm test`.

## Etapa 5 — Concorrência e rede de segurança (CA-10, CA-11, CA-12)
Objetivo: R9, provada em Postgres real.
- Em `openLoan`, antes de contar, `SELECT pg_advisory_xact_lock(hashtextextended(tenant || ':' ||
  user, 0))` (lock de transação, compatível com o pooler em modo transação, e liberado no fim da
  transação); depois do lock da pessoa, `SELECT … FROM equipment WHERE id = … AND tenant_id = …
  FOR UPDATE`. Ordem de lock sempre pessoa → equipamento (sem deadlock).
- A violação do índice `loans_one_open_per_equipment` (Prisma `P2002`) é traduzida para o 409
  `equipment-already-loaned`; nunca vaza como 500.
- `back/src/modules/loans/loans.concurrency.spec.ts`, com o pool do Prisma maior que 1 (a URL do
  teste não leva `connection_limit=1`): `CA-10` (10 pessoas, 1 equipamento, `Promise.all`: 1
  sucesso, 9 recusas, 1 `loan`), `CA-11` (uma pessoa, 5 equipamentos: 3 sucessos e 2 recusas por
  limite; e 2 abertos mais 3 pedidos: 1 e 2), `CA-12` (equipamento `DISPONIVEL` com `loan` aberto
  criado por SQL direto: 409, não 500, um só `loan`). Os casos rodam várias vezes (laço de 20
  repetições) para a corrida não passar por sorte.
Verificação: `npm run build` e `npm test`. Risco aceito e declarado: o teste prova o Postgres
puro; o pooler (Supavisor) em produção não é exercitado (Etapa 11 só faz fumaça).

## Etapa 6 — `GET /v1/loans/mine` (CA-15, CA-13, CA-14)
Objetivo: Meus empréstimos na API.
- Mesmo `loans.controller.ts`, `loans.service.ts` e `loans.repository.ts`: só `returned_at IS NULL`,
  `user_id` da pessoa, `tenant_id`, `ORDER BY due_at, id`; `state` calculado na leitura contra o
  "hoje" do servidor; `openLoans` e `maxLoans`; cursor (Q11).
- Casos em `loans.controller.spec.ts`: `CA-15` (só os da pessoa; de outra pessoa do mesmo tenant não
  aparece, nem para `OPERACOES`; `state` e ordem), `CA-13` (empréstimo do tenant B não aparece),
  `CA-14` (401 e 403).
Verificação: `npm run build` e `npm test`.

## Etapa 7 — Front: camada de API e navegação (CA-22 parte, CA-26)
Objetivo: base das telas, sem tela nova ainda.
- `front/src/lib/api.ts`: `getEquipment()` (percorre as páginas até `nextCursor` acabar),
  `postLoan(equipmentId)`, `getMyLoans()` e a classe `ApiProblem` (`status`, `code`, `detail`), todas
  com o token do `supabase-js` (cliente escrito à mão, Q5). Os tipos das respostas são `interface`s
  escritas à mão, iguais ao contrato.
- `front/src/lib/dates.ts`: `formatDate('YYYY-MM-DD')` → `DD/MM/AAAA` **sem** `new Date()` (a string
  vem do servidor, R8).
- `front/src/components/AppShell.tsx`: barra do topo (marca, abas Catálogo e Meus empréstimos, e-mail,
  "Sair") com `Outlet`.
- `front/src/main.tsx`: rotas `/catalogo` e `/meus-emprestimos` dentro do `RequireAuth` e do
  `AppShell`; `/` redireciona para `/catalogo`. `HomePage.tsx` é removida (e com ela o texto do
  placeholder).
- `front/src/index.css`: só as classes do ADR-003 §4 que faltarem (`.tag`, `.card`, `.dialog`,
  toast), reaproveitando os tokens existentes; nada de cor nova.
Verificação: `cd front && npm run build` (exit 0). Busca: "O catálogo chega na próxima fatia" não
existe em `front/src` (CA-22), e `HOJE_DEMO` e `new Date()` não aparecem no código de datas (CA-26). Sem lint/typecheck/test (declarar).

## Etapa 8 — Front: catálogo (CA-02, CA-04, CA-22, CA-23)
Objetivo: a tela do catálogo, só de leitura.
- `front/src/pages/CatalogoPage.tsx`: cabeçalho, contagem "X de Y", busca, chips, grade, rodapé
  "Fotos: Pixabay" com link para `https://pixabay.com` (R4), banner de atraso (aparece quando
  `viewer.overdue`).
- `front/src/components/EquipmentCard.tsx`: foto 4:3 com `object-fit: cover` e quadro neutro (R3),
  kicker, nome, patrimônio, pill, linha de detalhe e botão (rótulo e habilitação derivados de
  `status` e `viewer`, R5 e R12). `front/src/lib/situacao.ts` concentra a tabela status → cor e
  rótulo (o padrão do `Pill` do ADR-003).
- Ainda sem o clique de "Solicitar" (vem na Etapa 9).
A contagem "X de Y" é calculada aqui, na tela, com os itens carregados (Q11). Verificação:
`npm run build`. Evidência manual local (Etapa 11): prints dos CA-02, CA-04, CA-22, CA-23.

## Etapa 9 — Front: solicitar e recusas (CA-19, CA-20)
Objetivo: o fluxo de pedido, com o motivo da recusa em texto.
- `front/src/components/SolicitarModal.tsx` (§5.6: resumo com equipamento e "Devolver até" =
  `viewer.proposedDueAt`; clique fora fecha) e `front/src/components/Toast.tsx` (2600 ms; variante de
  erro com a cor de erro da ADR-003 §1.3).
- `CatalogoPage.tsx`: `useMutation` de `postLoan`; sucesso → toast, invalida as consultas de catálogo
  e de Meus empréstimos; `ApiProblem` 409 → toast de erro com o `detail` e recarrega o catálogo (R12).
  O botão fica desabilitado enquanto a requisição está em andamento (evita pedido duplo).
Verificação: `npm run build`. Evidência manual local: prints do modal, do toast, do estado "Está com
você", do "Limite de 3 itens", do "Bloqueado por atraso" com o banner, e de uma recusa 409 real.

## Etapa 10 — Front: Meus empréstimos (CA-21)
Objetivo: a segunda tela.
- `front/src/pages/MeusEmprestimosPage.tsx`: cabeçalho "N de 3 itens…", barra de 3 traços, linhas com
  borda e cores de estado, estado vazio com "Ir ao catálogo". Sem botão "Devolver" (R11, Q9).
Verificação: `npm run build`. Evidência manual local: prints com 0, 1 e 3 empréstimos, e com um
atrasado (semeado no banco local).

## Etapa 11 — Evidências manuais e prova do operador (CA-02, CA-04, CA-19 a CA-24)
Objetivo: fechar os CA de "Tela" e a prova de produção, sem o agente escrever em produção.
- **Local (agente):** `supabase start`, `npm run start:dev` no back, `npm run dev` no front,
  variáveis só no terminal. Dados: os da 002 mais empréstimos semeados por SQL no banco local (o
  atraso e o limite de 3). Prints em `docs/evidencias/003-<ca>-<descrição>.png`.
- **Produção (operador):** `docs/specs/003-solicitar-emprestimo/evidencias-producao.md`, modelo
  criado na T17 (sem valor de segredo): login com a **conta de teste**, um pedido de um item, print do
  card "Está com você" e de Meus empréstimos; a consulta do CA-24 (zero empréstimos do professor) e o
  **SQL de limpeza** (voltar o item para `DISPONIVEL` e apagar o empréstimo de teste) preparado pelo
  agente e rodado pelo operador no Supabase (Q13). Em produção, **um** pedido de **um** item. O agente não executa nada
  em produção e não usa a conta do professor.
Verificação: um print por CA de tela, com data e ambiente; CA-24 com o resultado colado pelo operador.

## Etapa 12 — Renumeração e referências antigas (Q7, CA-25)
Objetivo: os documentos que ainda dizem `003-catalogo` passam a apontar para esta pasta, e duas
referências antigas são acertadas: em `rules/tests.md`, "a Tarefa 9 da 003" (biblioteca de teste de
componente, que **não** é tarefa desta fatia: vira "a tarefa de teste de componente, ainda sem
fatia, ADR 002 reservado") e a "Q4 da 003 … Tarefa 12" do `HOJE_DEMO` (a data agora vem do servidor,
R8); em `rules/qualidade-codigo.md`, `MeusEmprestimos.tsx` passa a `MeusEmprestimosPage.tsx`. Arquivos: `AGENTS.md`, `rules/spec-flow.md`, `rules/tests.md`,
`rules/qualidade-codigo.md`. A `docs/specs/002-dados-iniciais/spec.md` **não** é editada: está
`Status: PRONTA`, e qualquer mudança nela fora da linha de status invalida a evidência que o hook
confere antes do push (`rules/spec-flow.md`); a frase do Q7 dela fica como histórico. Verificação:
busca de texto por `003-catalogo` fora dos históricos e da 002.

## Etapa 13 — Verificação da spec
Objetivo: `rules/spec-flow.md`, "Antes de declarar uma spec pronta". O agente principal passa o
caminho da spec e um intervalo por repositório (raiz, front e back); o `verificador-spec` salva
`verificacao-rodada-<N>.md`; só `Veredito: PRONTA` autoriza `Status: PRONTA`; quem corrige é o
agente principal; qualquer commit depois da rodada, em qualquer repositório, pede outra rodada.
