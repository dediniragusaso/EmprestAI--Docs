# EMPREST.AI

Sistema de emprestimo de equipamentos internos de TI (notebooks, monitores, cabos, cameras) que substitui a planilha compartilhada: colaborador ve o catalogo, pede um item e devolve; Operacoes cadastra equipamento e controla quem esta com o que. Negocio em docs/PRD.md. Stack decidida em docs/adr/001-stack.md.

## Onde olhar

- docs/PRD.md — o que o negocio precisa. Nao e spec.
- docs/adr/ — decisoes tecnicas ja tomadas e o motivo delas.
- docs/specs/<NNN-funcionalidade>/ — spec, plano e tarefas de cada feature. (Pasta ainda nao existe.)
- rules/ — como se trabalha aqui. Leia rules/restrictions.md sempre. (Pasta existe, ainda vazia.)

## Comandos

Nenhum comando foi executado nesta maquina ainda: nao existe comando verificado para subir o banco, rodar o projeto, rodar os testes ou buildar. Nao invente comandos — pergunte antes de executar qualquer coisa.

## Ambiente

- Banco: Supabase. O desenvolvimento acontece no banco LOCAL, subido com Supabase CLI + Docker (`supabase start`; banco em localhost:54322, Auth em localhost:54321). Prisma Migrate e o unico dono do schema — Supabase CLI nao gerencia migrations.
- Deploy: Vercel, ligada ao repositorio remoto. Push publica.
- Configuracao vem de variavel de ambiente. Ver .env.example.
- Repositorios: back/ e front/ sao repos independentes (back remoto: EmprestAI--Back no GitHub). A raiz (docs, rules, AGENTS.md) e um repositorio proprio.

## Precedencia

Se dois artefatos discordarem sobre comportamento, a spec vence o codigo.
Se algo nao estiver escrito em lugar nenhum, pergunte — nao decida.

## Estado atual do projeto

- Existe: documentacao (PRD, stacks, ADR 001), layout.md (spec visual), .env/.env.example, .gitignore. Nada mais.
- NAO existe codigo de aplicacao: nem front, nem API.
- NAO existem migrations, schema Prisma, seed nem testes.
- O banco local nunca foi criado (nenhum `supabase start` executado).
- docs/specs/ nao existe. rules/ esta vazia.
- back/ tem repositorio git vazio (nenhum commit) com remote GitHub configurado. front/ esta vazia e sem repositorio.

## Procedimentos

## Subagentes
- Ficam em agents/<nome>.md. O frontmatter diz quando delegar; o
  corpo e a instrucao completa do subagente.
- Subagente nao herda esta conversa: ao delegar, passe tudo que o
  arquivo dele pede como entrada.
- Se o harness nao tiver subagentes, abra uma sessao nova e comece
  com: "Aja conforme agents/<nome>.md." e as entradas pedidas.
