# EMPREST.AI

Sistema de emprestimo de equipamentos internos de TI (notebooks, monitores, cabos, cameras) que substitui a planilha compartilhada: colaborador ve o catalogo, pede um item e devolve; Operacoes cadastra equipamento e controla quem esta com o que. Negocio em docs/PRD.md. Stack decidida em docs/adr/001-stack.md; design system em docs/adr/003-design-system.md (status: Proposto).

## Onde olhar

- docs/PRD.md — o que o negocio precisa. Nao e spec.
- docs/adr/ — decisoes tecnicas ja tomadas e o motivo delas: 001-stack (aceito) e 003-design-system (proposto). O numero 002 esta reservado para a biblioteca de teste de componente.
- docs/modelagem-banco.md — modelagem do banco, aprovada em 2026-10-19; implementada em back/prisma/.
- layout.md (raiz; ha copia em front/layout.md) — spec visual das telas.
- docs/specs/<NNN-funcionalidade>/ — spec, plano e tarefas de cada feature. Existe 001-login; a proxima e 002-catalogo.
- rules/ — como se trabalha aqui (9 arquivos: checks, handoff, migration, operacao, qualidade-codigo, restrictions, secrets, spec-flow, tests). Leia rules/restrictions.md sempre.

## Comandos

Os scripts abaixo existem nos package.json; este arquivo nao registra que algum deles foi executado com sucesso. Nao invente comando que nao esteja listado: se faltar, diga que nao existe.

- front/: `dev`, `build` (`tsc --noEmit && vite build`), `preview`. Nao existem `lint`, `typecheck` nem `test`.
- back/: `build`, `start`, `start:dev`, `test` (Jest), `db:migrate`, `db:reset`, `db:seed`. Nao existe `lint`.
- Banco local: `supabase start` a partir da raiz (supabase/config.toml).
- Os checks de fim de tarefa estao em rules/checks.md.

## Ambiente

- Banco: Supabase. O desenvolvimento acontece no banco LOCAL, subido com Supabase CLI + Docker (`supabase start`; banco em localhost:54322, Auth em localhost:54321). Prisma Migrate e o unico dono do schema — Supabase CLI nao gerencia migrations.
- Deploy: Vercel, ligada ao repositorio remoto de cada projeto. Push publica.
- Configuracao vem de variavel de ambiente. Inventario em rules/secrets.md; os nomes versionados estao em front/.env.example e back/.env.example.
- Repositorios: tres, cada um com o seu .git.
  - Raiz (docs, rules, agents, supabase, AGENTS.md, layout.md): sem remote configurado.
  - front/: remote `origin` github.com/dediniragusaso/EmprestAI.
  - back/: remote `origin` github.com/dediniragusaso/EmprestAI--Back.
  - A raiz ignora back/ no .gitignore; front/ ainda aparece como nao rastreado na raiz.

## Precedencia

Se dois artefatos discordarem sobre comportamento, a spec vence o codigo.
Se algo nao estiver escrito em lugar nenhum, pergunte — nao decida.

## Estado atual do projeto

- Existe documentacao na raiz: PRD, modelagem-banco, stacks, ADR 001 e ADR 003, layout.md, spec/plano/tarefas de 001-login.
- front/ (Vite + React + Tailwind): tela de login, rota protegida e sessao via supabase-js (001-login). Dependencias de dados ja instaladas: TanStack Query, React Hook Form, Zod, React Router. Sem runner de teste, sem lint e sem typecheck como script.
- back/ (NestJS): config de ambiente validada com Zod, verificacao de JWT por JWKS, guard de auth, filtro Problem Details e os endpoints `GET /`, `GET /v1/health` e `GET /v1/me` (back/src). Jest configurado; ha um spec do verificador de JWT.
- back/prisma/: schema (Tenant, User, Membership, Equipment, Loan, AuditLog), migration `init` com RLS `deny_all`, indices parciais e trigger de auditoria, e seed que cria so o tenant `suporte_ti`. O commit 9e151db registra a migration verificada com `migrate reset` no banco local.
- Ainda nao existe: spec 002 em diante, endpoints de equipamento e de emprestimo, cliente gerado por orval, teste de componente (biblioteca nao decidida), E2E.
- ADR 003 esta como Proposto: o design system ainda nao foi aceito pelo time.

## Procedimentos

## Subagentes
- Ficam em agents/<nome>.md. O frontmatter diz quando delegar; o
  corpo e a instrucao completa do subagente.
- Subagente nao herda esta conversa: ao delegar, passe tudo que o
  arquivo dele pede como entrada.
- Se o harness nao tiver subagentes, abra uma sessao nova e comece
  com: "Aja conforme agents/<nome>.md." e as entradas pedidas.
