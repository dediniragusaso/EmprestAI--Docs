# Tarefas — 003-solicitar-emprestimo
`[ ]` pendente, `[x]` feito com a evidência. Uma tarefa por vez; cada uma cabe num commit **no
repositório indicado** (raiz, `back` ou `front`). Nenhuma tarefa começa antes da T0. Checks de cada
tarefa de código (`rules/checks.md`): back `cd back && npm run build` (exit 0) e `npm test`; front
`cd front && npm run build` (`tsc --noEmit && vite build`). `lint`, `typecheck` e `test` do front, e
`lint` do back, **não existem** (declarar em cada tarefa, não pular). Migration: nenhuma nesta fatia,
então o `migrate reset` não se aplica. Nenhuma tarefa escreve em produção nem lê `.env`.

- [x] T0 Aprovar a spec e responder Q1 a Q13, gravando as respostas na `spec.md`. Sem código.
  (bloqueia CA-01 a CA-26) — raiz. Evidência: decidido pelo operador em 09/11/2026; commit `2642daa`.
- [ ] T1 Instalar `supertest` e `@types/supertest` no back, versões fixas, mostrando a versão antes
  (Q6; ADR-001 §8). (base de CA-01, CA-03, CA-05 a CA-18) — back.
- [ ] T2 `PrismaModule` e `PrismaService` globais e `DATABASE_URL` no schema Zod do boot, em
  `back/src/modules/prisma/` e `back/src/config/env.ts`; sem tocar em `.env`. (base de CA-05, CA-10,
  CA-11, CA-13) — back.
- [ ] T3 `Clock` injetável e `todayInSaoPaulo`/`addDays` sobre data civil, com `clock.spec.ts`
  incluindo a virada da meia-noite de Brasília, em `back/src/common/clock.ts`. (CA-16) — back.
- [ ] T4 Filtro de Problem Details passa a repassar `code`, com teste do filtro, em
  `back/src/common/problem-details.filter.ts`. (CA-07, CA-08, CA-09, CA-10) — back.
- [ ] T5 `TenantGuard` (membership no tenant `suporte_ti`, 403 sem vínculo) e `TenantRequest`, com
  `tenant.guard.spec.ts` em Postgres do Testcontainers, em `back/src/modules/tenancy/`. (CA-14,
  CA-13) — back.
- [ ] T6 Helper de teste `back/src/testing/app.ts`: app Nest sobre o Postgres descartável (reusa
  `subirBanco()` de `prisma/dados-iniciais/banco-teste.ts`), com verificador de JWT falso e dados
  base (12 equipamentos, dois tenants, usuários). (base de CA-01 a CA-18) — back.
- [ ] T7 `GET /v1/equipment`: controller, service, repository, schemas, cursor e bloco `viewer`, com
  `equipment.controller.spec.ts`. (CA-01, CA-03, CA-13, CA-14, CA-16) — back.
- [ ] T8 `POST /v1/loans`: regras (R6, R7), atomicidade, auditoria `loan.open` e as quatro recusas
  com `code`, com `loans.controller.spec.ts`, incluindo o caso do relógio congelado
  (`dueAt` = D + 14, às 23:59 e às 00:01 de Brasília). (CA-05, CA-06, CA-07, CA-08, CA-09, CA-13,
  CA-14, CA-16, CA-17, CA-18) — back.
- [ ] T9 Concorrência: lock por pessoa (`pg_advisory_xact_lock`), `FOR UPDATE` no equipamento,
  tradução do `P2002` do índice parcial para 409, e `loans.concurrency.spec.ts` com 20 repetições.
  (CA-10, CA-11, CA-12) — back.
- [ ] T10 `GET /v1/loans/mine`: só os abertos da pessoa, `state` e cursor, com os casos no
  `loans.controller.spec.ts`. (CA-15, CA-13, CA-14) — back.
- [ ] T11 Front: camada de API (`getEquipment` com todas as páginas, `postLoan`, `getMyLoans`,
  `ApiProblem`) em `front/src/lib/api.ts` e `front/src/lib/dates.ts` sem `new Date()`. (CA-26) — front.
- [ ] T12 Front: `AppShell` com as abas, rotas `/catalogo` e `/meus-emprestimos`, `/` redireciona,
  remoção de `HomePage` e do placeholder, e as classes do ADR-003 §4 que faltam em `index.css`.
  (CA-22) — front.
- [ ] T13 Front: `CatalogoPage` e `EquipmentCard` (foto 4:3, pill, detalhe, rótulo e habilitação do
  botão, busca, chips, contagem, banner de atraso e rodapé "Fotos: Pixabay"), com
  `front/src/lib/situacao.ts`. (CA-02, CA-04, CA-22, CA-23) — front.
- [ ] T14 Front: `SolicitarModal`, `Toast` e o `useMutation` do pedido, com recusa 409 mostrada em
  texto e recarga do catálogo, e botão desabilitado durante a requisição. (CA-19, CA-20) — front.
- [ ] T15 Front: `MeusEmprestimosPage` (cabeçalho, barra de 3 traços, linhas, estado vazio, sem
  botão "Devolver"). (CA-21) — front.
- [ ] T16 Evidências manuais no ambiente local (Supabase local, back e front em dev, empréstimos
  semeados por SQL no banco local): prints em `docs/evidencias/003-<ca>-<descrição>.png` com data e
  ambiente, e um índice em `docs/evidencias/003-indice.md`. (CA-02, CA-04, CA-19, CA-20, CA-21,
  CA-22, CA-23) — raiz.
- [ ] T17 Modelo `docs/specs/003-solicitar-emprestimo/evidencias-producao.md`: roteiro do operador
  com a conta de teste (nunca a do professor), a consulta do CA-24 e o SQL de limpeza (voltar o item
  para `DISPONIVEL` e apagar o empréstimo de teste), para **um** pedido de **um** item. Só prepara; **o operador executa**. (CA-24) — raiz.
- [ ] T18 Atualizar `AGENTS.md`, `rules/spec-flow.md`, `rules/tests.md` e `rules/qualidade-codigo.md`
  para o nome da fatia (Q7); em `rules/tests.md`, trocar "a Tarefa 9 da 003" (biblioteca de teste de
  componente, que não é desta fatia) e a "Q4 da 003 … Tarefa 12" do `HOJE_DEMO`; em
  `rules/qualidade-codigo.md`, `MeusEmprestimos.tsx` → `MeusEmprestimosPage.tsx`. A spec 002 **não** é
  editada. (CA-25) — raiz.
- [ ] T19 Rodar o `verificador-spec` (`rules/spec-flow.md`) com um intervalo por repositório e salvar
  `verificacao-rodada-<N>.md`; corrigir o que ele apontar (quem corrige é o agente principal); só com
  `Veredito: PRONTA` gravar `Status: PRONTA`. (CA-01 a CA-26) — raiz.
