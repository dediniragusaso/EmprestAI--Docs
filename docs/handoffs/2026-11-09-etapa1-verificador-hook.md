# Handoff 2026-11-09 — Etapa 1: rules, produção, verificador e hook

Fatia: sem spec própria — **dívida de processo** (trabalho de processo e
ferramenta, não de funcionalidade). Não atende nenhum `CA-xx`. A única spec
tocada é `docs/specs/001-login/` (registro de dívida, sem código).

Commits na raiz, do mais antigo ao mais novo (`git log`):
`3a3e666` rules com paths reais e inventário de `.env` ·
`08a1d9b` AGENTS.md · `c45aa18` regra de produção · `fc42860` verificador-spec ·
`8169e71` hook · `bd223c1` AGENTS.md após `63a264d` · `cc59fe0` gitlink do front ·
`7f63bb8` rules restantes · `221a8dd` permissions.deny · `af6d2e7` rodada 1 ·
`3f39782` hook só barra spec PRONTA · `4f9a30b` Status e dívida da 001-login.
(`63a264d` é do operador: ADR-003 Aceito e `front` entrando como gitlink.)

Checks desta etapa (só docs e configuração; sem código de aplicação):
- `node .claude/hooks/exige-verificacao.test.mjs` → `Todos os casos passaram` (18 casos)
- `git status --short` → vazio
- lint, test, typecheck e build de `front/` e `back/`: **não rodados** — nenhum
  arquivo de código foi tocado. Na rodada 1 o verificador rodou
  `npm run test` (back, 4 testes) e `npm run build` (back e front) e passaram;
  `lint` não existe nos dois, e o front não tem `test`.

## Onde parei
Rules, AGENTS.md e regra de produção estão alinhados ao repositório real
(3 repos, `front/`/`back/`, `layout.md` na raiz, `DIRECT_URL`); o verificador
`.claude/agents/verificador-spec.md` é único, e o hook `PreToolUse` mais o
`permissions.deny` estão em `.claude/settings.json`. A rodada 1 da `001-login`
deu **NÃO PRONTA** (CA-01 a CA-10 sem teste) e a dívida está registrada na
spec, que segue `Status: EM ABERTO`. Ainda não existem: spec 002, runner de
teste no front, ADR 002, e o push da raiz (`origin` está configurado; o
operador faz o push).

## Decisões não óbvias
- Convenção `Status: EM ABERTO | PRONTA` no `spec.md` e tolerância do HEAD da
  raiz ao commit da própria evidência: já em `rules/spec-flow.md` ("Gatilho
  obrigatório"). Foi criada pelo agente, sem estar escrita antes (`8169e71`).
- Produção = banco, Storage e Auth do deploy; o agente nunca escreve nela:
  já em `rules/restrictions.md` (`c45aa18`). A frase "vale mesmo que o operador
  peça no meio de uma tarefa" foi acréscimo do agente além do pedido.
- Verificador (`fc42860`): `tools: Read, Grep, Glob, Bash`, sem Edit nem Write.
  Para salvar `verificacao-rodada-<N>.md` só existe o `Bash`, que não se limita
  a um arquivo: a única escrita permitida é regra de texto, não barreira do
  ambiente. Detalhe no próprio `.claude/agents/verificador-spec.md`.
- Hook (`8169e71`, `3f39782`): bloqueia `git push` e a marcação `Status: PRONTA`
  só para spec marcada PRONTA sem rodada válida (Veredito PRONTA e HEADs de raiz,
  front e back batendo). Spec em aberto não bloqueia. Evidência forjável, só vale
  no harness e árvore não commitada não conferida: ver `rules/spec-flow.md`.
- `permissions.deny` (`221a8dd`): `prisma migrate deploy`, `prisma db push`,
  `supabase db push` (com ou sem `npx`) e leitura dos `.env` reais; `.env.example`
  livre. Cobre só o que está listado; regra de `Bash` casa pelo começo do
  comando e `Read` negado não impede `cat` por `Bash` (`rules/restrictions.md`).
  A sintaxe não foi exercitada no harness (não há CLI `claude` nesta máquina);
  o que se testou foi o hook, não o deny.
- A definição do subagente editada na sessão não foi recarregada pelo harness;
  a rodada 1 foi chamada mandando o subagente ler `.claude/agents/verificador-spec.md`
  primeiro. Em sessão nova a definição deve carregar sozinha (não verificado).
- Mecanismo de obrigatoriedade (hook × git hook × CI): alternativas e limites
  foram levantados na conversa, sem escolha registrada em ADR. Candidato a ADR.
- Rodada 1 (`af6d2e7`) apontou como fora de escopo da `001-login`: `back/prisma/`,
  `postinstall prisma generate` e `root.controller.ts`; registrados como dívida
  em `4f9a30b`. Também apontou cópias de docs em `front/docs/` e `front/layout.md`
  (não registradas na dívida).

## O que tentei e não funcionou
- Primeira versão do hook (`8169e71`) barrava todo `git push` enquanto a spec
  de maior número (`001-login`) não tivesse rodada PRONTA, mesmo sem ela estar
  marcada: escopo corrigido em `3f39782`.
- `git push -u origin main` na raiz (`https://github.com/dediniragusaso/EmprestAI--Docs.git`):
  `Invalid username or token. Password authentication is not supported`.
  O `gh` não está instalado, então a existência do repositório e a visibilidade
  não foram conferidas.
- AGENTS.md escrito em `08a1d9b` ficou errado com o `63a264d` do operador
  (ADR-003 Aceito, `front` como gitlink): corrigido em `bd223c1`; o gitlink saiu
  do índice em `cc59fe0`.

## Próximo passo exato
Abrir `docs/specs/002-catalogo/spec.md` listando primeiro as perguntas que o PRD
e o `layout.md` não respondem (`rules/spec-flow.md`, passos 1 a 3), sem escrever
código; o push da raiz fica com o operador antes ou depois disso.

## Arquivos relevantes
- `.claude/settings.json`
- `.claude/hooks/exige-verificacao.mjs`
- `.claude/hooks/exige-verificacao.test.mjs`
- `.claude/agents/verificador-spec.md`
- `rules/spec-flow.md`, `rules/restrictions.md`, `rules/secrets.md`, `rules/checks.md`
- `AGENTS.md`
- `docs/specs/001-login/spec.md`, `docs/specs/001-login/verificacao-rodada-1.md`
