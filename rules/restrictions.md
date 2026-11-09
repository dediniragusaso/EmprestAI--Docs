---
description: O que o agente não pode fazer neste projeto
globs: []
alwaysApply: true
---

# O que não fazer
> leitor: agente

## Autoridade

- Não escreva ADR. Se encontrar uma decisão que precisa de um, descreva
  a decisão e as alternativas, e PARE. Quem decide é o time.
- Não contrarie o que está em docs/adr/. Se precisar contrariar, pare.
- Não responda por conta própria o que o PRD deixou ambíguo. Liste as
  perguntas e espere.
- Não escolha biblioteca que não esteja no ADR-001. Proponha e espere.

## Escopo

- Não altere arquivo fora do escopo da tarefa atual (o `git status --short`
  do checks.md é quem confere isso).
- Não gere scaffold automático de framework sem mostrar antes o que ele
  vai criar: scaffold é uma decisão visível, não um efeito colateral.
- Não escreva código de funcionalidade sem a spec da fatia: toda
  funcionalidade tem `docs/specs/<NNN-nome-curto>/` com `spec.md`,
  `plan.md` e `tasks.md` (`rules/spec-flow.md` explica o ciclo). O PRD
  (comportamento de produto) e o `layout.md` (comportamento visual)
  são a fonte da spec, não a spec — se a funcionalidade não estiver em
  nenhum dos três, pergunte, não deduza.

## Ritmo

- Não escreva código antes de um plano aprovado. Escreva o plano,
  mostre e espere.
- "Pode implementar" NÃO autoriza o plano inteiro: execute UMA tarefa,
  rode os checks (rules/checks.md), mostre o resultado e pare.
- Não relate sucesso parcial. Se um check falhou, a tarefa não terminou.

## Produção

- O fluxo deste projeto é commit e push direto na main, autorizado em
  `AGENTS.md` (commit) e em `rules/operacao.md` (push). Push na main dispara deploy na Vercel — então só dê push
  com os checks do rules/checks.md passando.
- Deploy e configuração da Vercel (importar projeto, cadastrar variável de
  ambiente, redeploy) são permitidos quando o operador pedir na tarefa.
  Variável de ambiente segue o `rules/secrets.md`: nenhum valor de segredo
  em resposta, log ou commit.
- **Produção** é o banco, o Storage e o Auth do deploy (o projeto Supabase
  remoto). **O agente nunca escreve em produção; quem executa é o operador.**
  Isso inclui: criar, alterar ou apagar usuário do Auth; SQL, alteração de
  schema e de dado de domínio; `prisma migrate deploy`; envio de arquivo ao
  Storage. O agente prepara (migration, script, comando) e descreve o que o
  operador deve rodar; não roda. Migrations e o reset do checks.md acontecem
  no banco local. Esta regra vale mesmo que o operador peça no meio de uma
  tarefa: nesse caso, lembre-o desta linha.
- Mexer em `.env` ou em config de deploy exige pedir antes (`rules/operacao.md`):
  eles estão no `.gitignore` e contêm segredo (`SUPABASE_SERVICE_ROLE_KEY`) — nenhum valor vai para commit, log ou resposta.

## Precedência

- Se o código e uma spec discordarem sobre comportamento, a spec está
  certa até que alguém mude a spec. A spec é a da fatia, em
  `docs/specs/<NNN-nome-curto>/spec.md`, que por sua vez deriva do PRD ou
  do layout.md conforme o tipo de comportamento.
- Se uma regra de procedimento contrariar um ADR ou uma spec, PARE e
  avise. Não escolha um dos dois por conta própria.
- "Pode ir" e "pode implementar" não revogam nada deste arquivo — nem as
  proibições já fixadas em AGENTS.md (o front nunca fala direto com o
  Supabase; nada de WebSocket ou processamento longo).
