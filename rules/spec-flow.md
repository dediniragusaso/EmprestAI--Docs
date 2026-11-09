---
description: O ciclo spec → plano → tarefas de qualquer funcionalidade nova
globs: []
alwaysApply: true
---

# Abrir funcionalidade nova
> leitor: agente

## Quando
Ao iniciar qualquer funcionalidade nova do PRD, ou ao mexer numa
funcionalidade que ainda não tem spec. Vale para as duas pontas: a tela no
`front/` e o endpoint no `back/`.

As specs vivem na raiz do workspace, que é um repositório próprio:
`docs/specs/<NNN-nome-curto>/`. `front/` e `back/` têm cada um o seu `.git` e
não guardam spec; spec escrita dentro deles não é lida pelo verificador nem
pelo hook de "Gatilho obrigatório".

## Procedimento
1. Crie `docs/specs/<NNN-nome-curto>/` — três dígitos, nome curto em
   kebab-case, na ordem do PRD (`001-login`, `002-dados-iniciais`, `003-solicitar-emprestimo`, ...). Sem
   pasta de spec fora desse padrão.
2. `spec.md` primeiro, com os seis títulos, sempre nesta ordem: Objetivo,
   Vínculo, Regras, Critérios de aceitação, Fora de escopo. Quando a fatia
   tocar código, acrescente Contrato afetado, Dívida de processo e Como sei
   que funcionou.
   Critério de aceitação é numerado `CA-01`, `CA-02`… e é observável de
   fora — "funciona bem" não é critério. O Vínculo cita o item numerado do
   `docs/PRD.md` (itens 1–5 da v1), a seção do `layout.md` (5.x, 6,
   7.x) e o ADR-001 que restringe a fatia.
3. Antes de escrever a spec, liste as perguntas que o PRD e o layout não
   respondem. Elas ficam escritas na própria spec ("Fora de escopo / não
   decidido") e você ESPERA. Não preencha silêncio com suposição: na spec
   001 a origem de `nome` e `papel` foi deduzida do e-mail e virou a Q1 —
   exatamente o que este passo existe para evitar.
4. `plan.md` sai da spec e cita os ADRs que a restringem: etapas em ordem,
   cada uma com objetivo, arquivos que nascem ou mudam e a verificação.
5. `tasks.md` sai do plano. Cada tarefa cita o `CA-xx` que atende e cabe num
   commit. `[ ]` pendente, `[x]` feito com a evidência (o commit, o check).
6. Uma tarefa por vez: execute, rode o `rules/checks.md`, gere o handoff
   datado (`rules/handoff.md`), mostre o resultado e pare. "Pode implementar"
   não libera o plano inteiro.
7. Se o código e a spec discordarem, quem manda é a spec até que alguém mude
   a spec (`rules/restrictions.md`).

## Verificação
Existem `spec.md`, `plan.md` e `tasks.md` na mesma pasta `NNN-nome-curto`, e
nenhuma tarefa do `tasks.md` está sem `CA-xx`. Nenhum arquivo de código foi
criado antes de o `plan.md` existir. Funcionalidade entregue sem spec não é
tarefa concluída — é dívida, e ela se registra na seção "Dívida de processo"
da spec da fatia.

## Não faça
- Não escreva código antes do plano aprovado.
- Não crie pasta de spec fora do padrão `NNN-nome-curto` nem numere fora da
  ordem (a próxima é a seguinte à última que existe em `docs/specs/`).
- Não escreva a spec de uma tela sem citar a seção do `layout.md` que a
  define, nem a de um comportamento sem citar o item do `docs/PRD.md`.
- Não trate o PRD e o layout como a spec da fatia: eles são a fonte, não o
  recorte. A spec diz o que ESTA fatia faz e como sei que funcionou.

## Antes de declarar uma spec pronta
- Delegue ao subagente verificador-spec (.claude/agents/verificador-spec.md),
  passando o caminho da spec e um intervalo de commits por repositório
  (raiz, front, back; `nenhum` quando o repositório não participa).
- O verificador só lê e roda teste. Ele salva o resultado em
  `docs/specs/<NNN-nome-curto>/verificacao-rodada-<N>.md`, com uma tabela
  `CA | veredito | evidência`, o HEAD de cada repositório no momento da
  verificação e a última linha `Veredito: PRONTA` ou `Veredito: NÃO PRONTA — <motivo>`.
- A spec só é pronta com "Veredito: PRONTA". Qualquer outro resultado
  volta para as tarefas — quem corrige é o agente principal, nunca o
  verificador — e a próxima verificação gera a rodada seguinte (nunca se
  sobrescreve uma rodada).
- Commitar a própria `verificacao-rodada-<N>.md` na raiz não invalida a rodada.
  Qualquer outro commit depois dela, em qualquer um dos três repositórios,
  invalida: é preciso outra rodada.

## Gatilho obrigatório
Mecanismo: hook `PreToolUse` do harness, em `.claude/settings.json`, que
executa `.claude/hooks/exige-verificacao.mjs` (casos de teste em
`.claude/hooks/exige-verificacao.test.mjs`: `node .claude/hooks/exige-verificacao.test.mjs`).

**Marca de estado.** Toda spec registra no `spec.md` uma linha `Status: EM ABERTO`
ou `Status: PRONTA`. Só `Status: PRONTA` aciona o hook; spec em aberto, ou sem
a linha, não bloqueia nada.

O hook bloqueia (exit 2) duas ações:
1. **`git push`** (em qualquer repositório), se existir alguma spec marcada
   `Status: PRONTA` (em `spec.md`, `plan.md` ou `tasks.md`, no disco) sem
   evidência válida.
2. **Marcar uma spec como PRONTA** sem evidência válida: gravar a linha
   `Status: PRONTA` pelas ferramentas Write/Edit/MultiEdit, ou por um comando
   Bash que cite `docs/specs/`.

"Evidência válida" = a rodada de maior `<N>` da pasta da spec
(`verificacao-rodada-<N>.md`) existe, termina em `Veredito: PRONTA` e os HEADs
que ela registra batem com os atuais:
- `front` e `back`: o HEAD atual é igual ao registrado.
- raiz: igual, ou posterior com diferença só em `verificacao-rodada-*.md` e na
  linha `Status:` do `spec.md` (a raiz guarda a própria evidência).

Ordem de trabalho: verificar (rodada com `Veredito: PRONTA`) → só então gravar
`Status: PRONTA` → commitar → push. Uma rodada `NÃO PRONTA` não bloqueia o
push da spec que continua `Status: EM ABERTO`: ela bloqueia a marcação.

Limitações conhecidas — leia antes de confiar:
- **O agente pode forjar o arquivo de evidência.** O hook confere o texto e os
  HEADs, não quem escreveu o arquivo: nada impede o agente principal de criar
  um `verificacao-rodada-<N>.md` com `Veredito: PRONTA` e os HEADs corretos sem
  rodar o verificador. Ele também pode editar `.claude/settings.json` ou o
  script do hook. O mecanismo detecta esquecimento, não má-fé.
- **Só barra push depois da marcação.** Spec que nunca recebe a linha
  `Status:` (ou que fica `EM ABERTO`) segue para o push sem verificação; a
  disciplina de marcar o estado é de quem escreve a spec.
- Só vale dentro do harness: `git push` no terminal, por fora do Claude Code,
  não passa pelo hook.
- Trabalho não commitado não entra no HEAD; o verificador registra a árvore
  como `limpa` ou `suja`, mas o hook não a confere.
- O bloqueio de "marcar PRONTA" por Bash é por texto (`docs/specs/` e a linha
  de status no comando) e não pega comando montado de outro jeito.
