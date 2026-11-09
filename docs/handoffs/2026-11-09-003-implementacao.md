# Handoff 2026-11-09 — 003-solicitar-emprestimo, implementação (T5 a T18)

Fatia: `docs/specs/003-solicitar-emprestimo/` (`Status: EM ABERTO`). Implementados: `GET /v1/equipment`,
`POST /v1/loans`, `GET /v1/loans/mine` (back) e as telas Catálogo e Meus empréstimos (front). CA
atendidos por teste automatizado: CA-01, 03, 05 a 18 (back). **Pendentes do operador**: prints de tela
(CA-02, 04, 19 a 23) e a prova de produção (CA-24; CA-02/05/19/21/22 em produção).

Commits, `back`: `ce107cf` T1 · `d68291a` T2 · `4975e61` T3 · `b7896a3` T4 · `d32c459` T5 ·
`7833375` T6 · `68a56d6` T7 · `05ed533` T8 · `5219a89` T9 · `b045830` T10 · `49900af` `openedOn`.
`front`: `46978e5` T11 · `f15993e` T12 · `6ef8744` T13 · `862cb90` T14 · `1436d72` T15 · `3e11337` ajuste.
Raiz: `65ba3cc` T17 · `59544cf` T18 · `732f81b` e `cbc2b66` preparo da T16 · `862e66f` tarefas ·
`519e03b` notas.

Checks (última linha, `rules/checks.md`):
- back `npm test` → `Ran all test suites.` (14 suítes, 80 testes)
- back `npm run build` → exit 0 (`tsconfig.build.json` exclui `src/testing`)
- front `npm run build` → `built in …ms` (`tsc --noEmit && vite build`, exit 0)
- `lint` não existe no back nem no front; migration: não se aplica (sem migration)
- `git status --short` das três raízes → vazio

## Onde parei
Back e front completos e commitados; os testes de API rodam em Postgres do Testcontainers (inclui
corrida: 10 pessoas no mesmo item, 5 pedidos de uma pessoa, índice único). Falta o que só o operador
faz: os prints locais (`docs/evidencias/003-indice.md`, cenários em `cenarios-locais.sql`) e o
roteiro de produção (`evidencias-producao.md`, com o SQL de limpeza). Falta a verificação final.

## Decisões não óbvias
- A ordem de lock é pessoa, depois equipamento (`pg_advisory_xact_lock` + `FOR UPDATE`); o índice
  único parcial é rede de segurança e vira 409. Já está na spec (R9); não repito.
- Sem `@nestjs/testing`: a raiz de teste usa módulos globais substituíveis (`back/src/testing/app.ts`).
- `DATABASE_URL` é obrigatória no boot: **a Vercel do back precisa tê-la antes do próximo deploy**.
- O hook `exige-verificacao.mjs` bloqueia `git push` pelo harness enquanto a evidência da 002 estiver
  velha (os HEADs do front e do back mudaram); push pelo terminal do operador não passa pelo hook.

## O que tentei e não funcionou
- Heredocs longos no shell do harness falharam com "unexpected EOF"; passei a escrever os arquivos
  pela ferramenta de escrita.
- O primeiro SQL de cenários não inseria `id` (as tabelas não têm default no banco; o Prisma gera o
  uuid no cliente); o teste em Postgres descartável pegou o erro antes do commit.
- Prints de tela: sem navegador nesta sessão e sem Playwright (decisão do operador); ficou para ele.

## Próximo passo exato
Rodar o `verificador-spec` sobre a 003 (rodada 3) com os intervalos por repositório e salvar
`docs/specs/003-solicitar-emprestimo/verificacao-rodada-3.md`; depois o operador tira os prints do
`docs/evidencias/003-indice.md`.

## Arquivos relevantes
- `back/src/modules/{equipment,loans,tenancy,prisma}/`, `back/src/common/clock.ts`, `back/src/testing/app.ts`
- `front/src/{lib/api.ts,lib/situacao.ts,pages/CatalogoPage.tsx,pages/MeusEmprestimosPage.tsx,components/}`
- `docs/specs/003-solicitar-emprestimo/` e `docs/evidencias/003-indice.md`
