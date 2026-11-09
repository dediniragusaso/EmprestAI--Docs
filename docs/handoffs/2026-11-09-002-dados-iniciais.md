# Handoff 2026-11-09 — 002-dados-iniciais (implementação PARCIAL: falta a produção)

Fatia: `docs/specs/002-dados-iniciais/` (`Status: EM ABERTO`). CA atendidos por teste local: CA-03,
CA-08, CA-09, CA-10, CA-11, CA-12, CA-13, CA-14. CA com parte local feita e **produção pendente do
operador**: CA-01, CA-02, CA-04, CA-05, CA-07. CA-06: só produção, sem prova.

Commits, repo `back` (do mais antigo ao mais novo): `761867f` Testcontainers 12.0.4 · `399517d`
migration e schema (T2) · `ebf49ce` leitura dos JSON (T3) · `236eca1` upsert dos equipamentos (T4) ·
`a4188a6` guarda de produção (T5) · `17254e0` usuário obrigatório e conta de teste (T6 e T7) ·
`9e0d17f` `.env.example` (T8) · `aea2f9f` Jest e Testcontainers 12.0.1, teste da migration (T10) ·
`2eba579` (T11) · `36d9442` (T12) · `da2dbb8` (T13) · `37b4b70` erro plantado · `52c13d2` desfaz.
Commits, raiz: `8706843` decisões do operador (T0) · `e651ad3` secrets.md (T9) · `bc93f86`
renumeração (T14) · `6f364c7` modelo de evidências (T15) · `8adde85` tarefas marcadas ·
`f2dde1d`, `5815318`, `2163aea` rodadas 1, 2 e 3 do verificador.

Checks (última linha de cada, `rules/checks.md`):
- back `npm test` → `Ran all test suites.` (6 suítes, 30 testes passaram, rodada 3 do verificador)
- back `npm run build` → exit 0 (**não compila `prisma/`**: o `tsconfig.json` só inclui `src` e `api`)
- back `lint` → não existe (declarado). `front/` não foi tocado.
- migration: `prisma validate` ok; `migrate reset` local **não executado** (ver "O que tentei").
- `node .claude/hooks/exige-verificacao.test.mjs` → `Todos os casos passaram`.
- `git status --short` da raiz e do back → vazio antes deste arquivo.

## Onde parei
O script `back/prisma/dados-iniciais.ts` (`npm run db:dados-iniciais`) grava os 12 equipamentos com
foto e crédito, cria o usuário obrigatório e a conta de teste opcional, tem guarda de produção e 30
testes com Postgres descartável e Auth simulado. O `seed.ts` não mudou. **O que falta é só do
operador**: rodar a sequência de produção e preencher
`docs/specs/002-dados-iniciais/evidencias-producao.md`. Sem isso a spec não chega a `PRONTA` (três
rodadas do verificador deram `NÃO PRONTA` pelo mesmo motivo).

## Decisões não óbvias
- O `@prisma/client` carrega o `back/.env` **na importação**, antes de qualquer código do script;
  por isso a guarda julga os valores efetivos (os mesmos que o Prisma usa). Não estava em rule.
- A `imageUrl` guarda a URL absoluta do ambiente em que o script rodou; mudar o `SUPABASE_URL` exige
  rodar o script de novo (o `update` não toca no `status`).
- `DADOS_INICIAIS_CONFIRMO_PRODUCAO` está **comentada** no `.env.example` (não deve morar num
  `.env`); diverge do plano, que a listava como linha normal.
- T6 e T7 saíram num commit só (`17254e0`), porque a conta de teste vive no mesmo arquivo.
- Decisões do operador, Q3 a Q17 e C1 a C3: já estão na spec; não se repetem aqui.

## O que tentei e não funcionou
- `prisma migrate dev --create-only`: `P4002` (FK de `public.users` para o schema `auth` do
  Supabase). O SQL veio de `prisma migrate diff` entre o schema anterior e o atual.
- `prisma migrate reset` (`checks.md`, passo 2): o Prisma recusou — "detected that it was invoked
  by Claude Code" — e exige consentimento do usuário para a ação destrutiva. Não contornei. O banco
  local ficou como estava; a prova de "aplica do zero" é o teste do CA-10 em Postgres descartável.
- `testcontainers@12.0.4`: o Jest quebrava na importação (`undici@8` exige Node >= 22.19 e a máquina
  tem 22.13.1). Fixei a 12.0.1 (`aea2f9f`), a mais nova cujo `undici` 7 roda aqui.
- Teste "sem `DATABASE_URL`" da guarda: o `.env` foi carregado na importação e o teste passou pela
  guarda; o teste válido é o do destino remoto falso (exit 1).

## Próximo passo exato
O operador executa a sequência da Etapa 8 do `plan.md` em produção, na ordem de
`docs/specs/002-dados-iniciais/evidencias-producao.md` (migrate deploy, `db:seed`, `imagens:enviar`
×2, `db:dados-iniciais` ×2, conferências e login do professor) e cola o resultado nesse arquivo; só
então se roda a rodada 4 do verificador.

## Arquivos relevantes
- `docs/specs/002-dados-iniciais/` (`spec.md`, `plan.md`, `tasks.md`, `evidencias-producao.md`,
  `verificacao-rodada-1.md` a `-3.md`)
- `back/prisma/dados-iniciais.ts` e `back/prisma/dados-iniciais/*.ts`
- `back/prisma/migrations/20261109150000_equipment_image/migration.sql`, `back/prisma/schema.prisma`
- `back/prisma/migrations.spec.ts`, `back/prisma/repositorio.spec.ts`
- `back/scripts/imagens-equipamentos/creditos.json`, `back/.env.example`, `rules/secrets.md`
