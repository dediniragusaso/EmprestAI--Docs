# Handoff 2026-11-09 — 003-solicitar-emprestimo (só spec, plano e tarefas)

Fatia: `docs/specs/003-solicitar-emprestimo/` (`Status: EM ABERTO`). **Nenhum código foi escrito**:
a etapa pedia só `spec.md`, `plan.md` e `tasks.md`. CA definidos: CA-01 a CA-25, nenhum atendido (nada
implementado). A 002 está `PRONTA` (rodada 6, commit `1a3fd14`), registrada antes de começar.

Commits (raiz): `0cc810a` spec · `2c59eb9` spec com CA-25 · `047eb89` plano · `1c219f7` tarefas.
`front/` e `back/` não foram tocados (HEAD `e1a8475` e `52c13d2`).

Checks (última linha, `rules/checks.md`):
- back e front: **não rodados**, porque nenhum arquivo de código mudou (declarado).
- `node .claude/hooks/exige-verificacao.test.mjs` → `Todos os casos passaram`.
- `git status --short` da raiz → vazio antes deste arquivo.

## Onde parei
Existem a spec (CA-01 a CA-25, R1 a R14, Q1 a Q13), o plano (Etapas 0 a 13) e as tarefas T0 a T19, cada
uma com o `CA-xx` e o repositório do commit. O que falta é a T0: o operador aprovar a spec e responder
Q1 a Q13. Nada de back nem de front existe ainda.

## Decisões não óbvias
- A pasta é `003-solicitar-emprestimo` (pedido do operador), mas a 002 (Q7) e `AGENTS.md` dizem
  `003-catalogo`. A T18 acerta os documentos; a spec 002 **não** pode ser editada (está `PRONTA` e o
  hook confere a evidência dela).
- O tenant não vem de claim do JWT, como o ADR-001 §6 descreve: o JWT do Supabase de hoje não traz
  tenant. A spec propõe resolver pelo `membership` (Q1) e pede confirmação.
- Cliente HTTP à mão e Zod direto no Nest (dívida registrada); `supertest` é a única dependência nova
  proposta (Q5, Q6).
- O catálogo não mostra o nome de quem está com o item (Q3), diferente do `layout.md` §5.2.
- Prova manual em produção deixa itens `EMPRESTADO` sem como devolver (não há devolução): provas de
  limite e de atraso ficam no banco local, e o SQL de limpeza em produção é do operador (Q13).

## O que tentei e não funcionou
- Nada foi implementado, então não há tentativa falha. O plano evita o `migrate reset` porque a
  fatia não tem migration.

## Próximo passo exato
O operador responde Q1 a Q13 em `docs/specs/003-solicitar-emprestimo/spec.md` (T0). Só depois a T1
(`supertest` no `back/package.json`) começa, mostrando a versão antes de instalar.

## Arquivos relevantes
- `docs/specs/003-solicitar-emprestimo/` (`spec.md`, `plan.md`, `tasks.md`)
- `docs/modelagem-banco.md` §4.5 e §6, `layout.md` §5.2, §5.3, §5.6 e §7, `docs/adr/003-design-system.md` §7
- `back/prisma/schema.prisma` (`Loan`, `Equipment`), `back/src/modules/auth/auth.guard.ts`,
  `back/src/common/problem-details.filter.ts`, `front/src/pages/HomePage.tsx`
