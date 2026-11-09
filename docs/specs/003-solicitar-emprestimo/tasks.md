# Tarefas — 003-solicitar-emprestimo
`[ ]` pendente, `[x]` feito com a evidência. Uma tarefa por vez; cada uma cabe num commit **no
repositório indicado** (raiz, `back` ou `front`). Nenhuma tarefa começa antes da T0. Checks de cada
tarefa de código (`rules/checks.md`): back `cd back && npm run build` (exit 0) e `npm test`; front
`cd front && npm run build` (`tsc --noEmit && vite build`). `lint`, `typecheck` e `test` do front, e
`lint` do back, **não existem** (declarar em cada tarefa, não pular). Migration: nenhuma nesta fatia,
então o `migrate reset` não se aplica. Nenhuma tarefa escreve em produção nem lê `.env`.
- [x] T0 Aprovar a spec e responder Q1 a Q13, gravando as respostas na `spec.md`. Sem código.
  (bloqueia CA-01 a CA-26) — raiz. Evidência: decidido pelo operador em 09/11/2026; commit `2642daa`.
- [x] T1 Instalar `supertest` e `@types/supertest` no back, versões fixas, mostrando a versão antes
  (Q6; ADR-001 §8). (base de CA-01, CA-03, CA-05 a CA-18) — back. Evidência: `ce107cf` (back); `supertest` 7.3.2 e `@types/supertest` 7.2.1 fixos; lockfile com 23 pacotes novos e um existente atualizado (`qs` 6.16.1 → 6.17.1, dependência do express); build exit 0; `npm test` "Ran all test suites." (6 suítes, 30 testes).
- [x] T2 `PrismaModule` e `PrismaService` globais e `DATABASE_URL` no schema Zod do boot, em
  `back/src/modules/prisma/` e `back/src/config/env.ts`; sem tocar em `.env`. (base de CA-05, CA-10,
  CA-11, CA-13) — back. Evidência: `d68291a` (back); `env.spec.ts` novo; build exit 0; `npm test` "Ran all test suites." (7 suítes, 32 testes). Atenção: `DATABASE_URL` agora é obrigatória no boot; o projeto da Vercel do back precisa tê-la antes do próximo deploy.
- [x] T3 `Clock` injetável e `todayInSaoPaulo`/`addDays` sobre data civil, com `clock.spec.ts`
  incluindo a virada da meia-noite de Brasília, em `back/src/common/clock.ts`. (CA-16) — back. Evidência: `4975e61` (back); build exit 0; `npm test` "Ran all test suites." (8 suítes, 37 testes).
- [x] T4 Filtro de Problem Details passa a repassar `code`, com teste do filtro, em
  `back/src/common/problem-details.filter.ts`. (CA-07, CA-08, CA-09, CA-10) — back. Evidência: `b7896a3` (back); build exit 0; `npm test` "Ran all test suites." (9 suítes, 41 testes).
- [x] T5 `TenantGuard` (membership no tenant `suporte_ti`, 403 sem vínculo) e `TenantRequest`, com
  `tenant.guard.spec.ts` em Postgres do Testcontainers, em `back/src/modules/tenancy/`. (CA-14,
  CA-13) — back. Evidência: `d32c459` (back); build exit 0; `tenant.guard.spec.ts` 4 casos em Postgres do Testcontainers.
- [x] T6 Helper de teste `back/src/testing/app.ts`: app Nest sobre o Postgres descartável (reusa
  `subirBanco()` de `prisma/dados-iniciais/banco-teste.ts`), com verificador de JWT falso e dados
  base (12 equipamentos, dois tenants, usuários). (base de CA-01 a CA-18) — back. Evidência: `7833375` (back); build exit 0; `npm test` "Ran all test suites." (11 suítes, 48 testes). Sem `@nestjs/testing` (dependência não aprovada): a raiz de teste é montada à mão.
- [x] T7 `GET /v1/equipment`: controller, service, repository, schemas, cursor e bloco `viewer`, com
  `equipment.controller.spec.ts`. (CA-01, CA-03, CA-13, CA-14, CA-16) — back. Evidência: `68a56d6` (back); build exit 0; `npm test` "Ran all test suites." (12 suítes, 57 testes).
- [x] T8 `POST /v1/loans`: regras (R6, R7), atomicidade, auditoria `loan.open` e as quatro recusas
  com `code`, com `loans.controller.spec.ts`, incluindo o caso do relógio congelado
  (`dueAt` = D + 14, às 23:59 e às 00:01 de Brasília). (CA-05, CA-06, CA-07, CA-08, CA-09, CA-13,
  CA-14, CA-16, CA-17, CA-18) — back. Evidência: `05ed533` (back); build exit 0; `npm test` "Ran all test suites." (13 suítes, 71 testes).
- [x] T9 Concorrência: lock por pessoa (`pg_advisory_xact_lock`), `FOR UPDATE` no equipamento,
  tradução do `P2002` do índice parcial para 409, e `loans.concurrency.spec.ts` com 20 repetições.
  (CA-10, CA-11, CA-12) — back. Evidência: `5219a89` (back); os 4 casos de concorrência falhavam antes do lock e passam depois (20 repetições, 3 execuções seguidas); build exit 0; `npm test` "Ran all test suites." (14 suítes, 75 testes).
- [x] T10 `GET /v1/loans/mine`: só os abertos da pessoa, `state` e cursor, com os casos no
  `loans.controller.spec.ts`. (CA-15, CA-13, CA-14) — back. Evidência: `b045830` e `49900af` (back, `openedOn` acrescentado para a tela não converter fuso); build exit 0; `npm test` "Ran all test suites." (14 suítes, 80 testes).
- [x] T11 Front: camada de API (`getEquipment` com todas as páginas, `postLoan`, `getMyLoans`,
  `ApiProblem`) em `front/src/lib/api.ts` e `front/src/lib/dates.ts` sem `new Date()`. Ao fim, rodar a busca de texto do CA-26 em `front/src` (`HOJE_DEMO`, `new Date(`) e
  colar o resultado (vazio para datas de produto) na evidência desta tarefa. (CA-26) — front. Evidência: `46978e5` e `3e11337` (front); `npm run build` ok; busca do CA-26 (`HOJE_DEMO`, `new Date(`) em `front/src`: nenhuma ocorrência.
- [x] T12 Front: `AppShell` com as abas, rotas `/catalogo` e `/meus-emprestimos`, `/` redireciona,
  remoção de `HomePage` e do placeholder, e as classes do ADR-003 §4 que faltam em `index.css`.
  (CA-22) — front. Evidência: `f15993e` (front); `npm run build` ok; busca "chega na próxima fatia" em `front/src`: nenhuma ocorrência.
- [x] T13 Front: `CatalogoPage` e `EquipmentCard` (foto 4:3, pill, detalhe, rótulo e habilitação do
  botão, busca, chips, contagem, banner de atraso e rodapé "Fotos: Pixabay"), com
  `front/src/lib/situacao.ts`. (CA-02, CA-04, CA-22, CA-23) — front. Evidência: `6ef8744` (front); `npm run build` ok. Os prints (CA-02, 04, 22, 23) dependem da T16.
- [x] T14 Front: `SolicitarModal`, `Toast` e o `useMutation` do pedido, com recusa 409 mostrada em
  texto e recarga do catálogo, e botão desabilitado durante a requisição. (CA-19, CA-20) — front. Evidência: `862cb90` (front); `npm run build` ok. Os prints (CA-19, 20) dependem da T16.
- [x] T15 Front: `MeusEmprestimosPage` (cabeçalho, barra de 3 traços, linhas, estado vazio, sem
  botão "Devolver"). (CA-21) — front. Evidência: `1436d72` (front); `npm run build` ok; buscas do CA-22 e do CA-26 sem ocorrência. Os prints (CA-21) dependem da T16.
- [ ] T16 Evidências manuais no ambiente local (Supabase local, back e front em dev, empréstimos
  semeados por SQL no banco local): prints em `docs/evidencias/003-<ca>-<descrição>.png` com data e
  ambiente, e um índice em `docs/evidencias/003-indice.md`. (CA-02, CA-04, CA-19, CA-20, CA-21,
  CA-22, CA-23) — raiz. Evidência: PARCIAL, **os prints são do operador** (o agente não tem navegador e não instala Playwright). Preparado: `cbc2b66` (`cenarios-locais.sql`, validado em Postgres descartável: limite, atraso, um, limpar, e a guarda de porta) e `732f81b` (`docs/evidencias/003-indice.md`, tabela de prints a preencher).
- [x] T17 Modelo `docs/specs/003-solicitar-emprestimo/evidencias-producao.md`: roteiro do operador
  com a conta de teste (nunca a do professor), a consulta do CA-24 e o SQL de limpeza (voltar o item
  para `DISPONIVEL` e apagar o empréstimo de teste), para **um** pedido de **um** item. Só prepara; **o operador executa**. (CA-24) — raiz. Evidência: `65ba3cc` (raiz); as consultas e a limpeza foram validadas em Postgres descartável; nada executado em produção.
- [x] T18 Atualizar `AGENTS.md`, `rules/spec-flow.md`, `rules/tests.md` e `rules/qualidade-codigo.md`
  para o nome da fatia (Q7); em `rules/tests.md`, trocar "a Tarefa 9 da 003" (biblioteca de teste de
  componente, que não é desta fatia) e a "Q4 da 003 … Tarefa 12" do `HOJE_DEMO`; em
  `rules/qualidade-codigo.md`, `MeusEmprestimos.tsx` → `MeusEmprestimosPage.tsx`. A spec 002 **não** é
  editada. (CA-25) — raiz. Evidência: `59544cf` (raiz); busca CA-25 em `AGENTS.md` e `rules/` sem ocorrência; spec 002 não editada.
- [ ] T19 Rodar o `verificador-spec` (`rules/spec-flow.md`) com um intervalo por repositório e salvar
  `verificacao-rodada-<N>.md`; corrigir o que ele apontar (quem corrige é o agente principal); só com
  `Veredito: PRONTA` gravar `Status: PRONTA`. (CA-01 a CA-26) — raiz.
