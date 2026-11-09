# Verificação 003-solicitar-emprestimo — rodada 1

Data: 2026-11-09
HEAD raiz: 2bed7ed58fa1cbb15896fb96c4e0426aec257530
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 52c13d2877757585efbc0a434ac39ee947c23897
Intervalos: raiz 221c469..HEAD · front nenhum · back nenhum
Árvore: limpa

| CA | veredito | evidência |
|---|---|---|
| CA-01 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-03 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-05 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-06 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-07 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-08 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-09 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-10 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-11 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-12 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-13 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-14 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-15 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-16 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-17 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-18 | SEM TESTE | nenhum código nem teste existe (o intervalo da raiz só traz spec, plan, tasks e handoff); tarefa prevista em tasks.md, todas [ ] |
| CA-02 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-04 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-19 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-20 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-21 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-22 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-23 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe evidência; tarefa prevista em tasks.md, [ ] |
| CA-24 | SEM TESTE | exige busca em back/src e resultado de SQL colado pelo operador; nada existe (T17 pendente). Ver A5 |
| CA-25 | SEM TESTE | busca de texto ainda acha 003-catalogo em AGENTS.md:11 e rules/spec-flow.md:22, e 002-catalogo em rules/tests.md:32 e rules/qualidade-codigo.md:73; T18 pendente |

## Estrutura (rules/spec-flow.md)
- Pasta `003-solicitar-emprestimo` com spec.md, plan.md e tasks.md: OK (o nome diverge de `003-catalogo` do spec-flow/AGENTS, mas a spec declara isso no Vínculo, em Q7 e na T18).
- Títulos e ordem: Objetivo, Vínculo, Regras, Critérios de aceitação, Contrato afetado, Dívida de processo, Fora de escopo / não decidido, Como sei que funcionou. Os cinco obrigatórios estão na ordem relativa correta e os três extras estão presentes. Observação: spec-flow diz "seis títulos" mas lista cinco, e a rule não diz onde os extras entram. Não conta como falha.
- CA numerados CA-01 a CA-25, cada um observável (API por teste, Tela por print, processo por busca ou consulta): OK.
- Vínculo cita PRD (itens 1 a 3; 4 e 5 excluídos; confere com docs/PRD.md:16-20), layout.md (§5.2, 5.3, 5.6, 6, 7), ADR-001 e ADR-003: OK.
- Perguntas abertas escritas na spec (Q1 a Q13, cada uma com proposta, "aguardam aprovação"): OK. Status: EM ABERTO.
- tasks.md: T0 a T19, todas citam CA-xx: nenhuma tarefa sem CA.
- Todo CA tem tarefa: CA-01 T7; 02 T13/T16; 03 T7; 04 T13/T16; 05 a 09 T8; 10 a 12 T9; 13 e 14 T5, T7, T8, T10; 15 T10; 16 T3, T7, T11; 17 e 18 T8; 19 e 20 T14/T16; 21 T15/T16; 22 T12, T13/T16; 23 T13/T16; 24 T17; 25 T18. Nenhum órfão.
- Nenhuma tarefa cita CA inexistente (máximo CA-25).
- Plano com Etapas 0 a 13. Mapa etapa para tarefa: E0=T0, E1=T1, E2=T2 a T6, E3=T7, E4=T8, E5=T9, E6=T10, E7=T11 e T12, E8=T13, E9=T14, E10=T15, E11=T16 e T17, E12=T18, E13=T19. Consistente.

## Lacunas e contradições internas
- A1 (contradição) Contagem "X de Y": R12 e CA-23 dizem que a contagem é "a da API", mas R2 não define campo de contagem na resposta e Q11 diz que busca e contagem são feitas na tela, com o front buscando todas as páginas. Falta decidir de onde vem o X/Y.
- A2 (lacuna) CA-16 exige `dueAt` criado = D+14 com relógio congelado, inclusive perto da meia-noite de America/Sao_Paulo; plan Etapa 4 e T8 não listam CA-16 entre os casos de `loans.controller.spec.ts` (T3 testa só as funções puras e T7 o `today`). O `dueAt` do POST com relógio congelado não tem tarefa que o prove.
- A3 (lacuna menor) CA-18 pede "ator, tenant, recurso loan" em audit_logs; a spec não diz como o ator é gravado nem quais colunas. O teste vai precisar decidir isso.
- A4 (discrepância de numeração) rules/tests.md:32 cita "Tarefa 9 da 003" como a que não instala biblioteca de teste de componente, mas a T9 deste tasks.md é a concorrência. rules/qualidade-codigo.md:73 cita "Tarefa 15" e `MeusEmprestimos.tsx`; a T15 existe, mas o arquivo planejado é `MeusEmprestimosPage.tsx`. A T18 e a Etapa 12 só preveem trocar o nome da fatia, não essas referências de tarefa.
- A5 (ambiguidade) CA-24 manda buscar `DATABASE_URL` em `*.spec.ts`, mas o plano (Etapas 2 e 5) faz os testes subirem o banco descartável e passarem a URL por variável; um spec que defina `process.env.DATABASE_URL` do container violaria a busca literal. Falta decidir se o helper em `back/src/testing/` (não é `.spec.ts`) fica fora da busca ou se o spec pode citar o nome.
- A6 (menor) CA-16 é rotulado "(API)", mas inclui busca de texto no `front/src`.
- A7 (menor) Etapa 0 exige resposta de Q1, Q2, Q3, Q5, Q6, Q7 e Q13 antes de código, mas Q4, Q8, Q9, Q10, Q11 e Q12 também alteram CA (CA-07, CA-18, CA-21, CA-02, CA-01) e não estão na lista que bloqueia.

Checks: código tocado = nenhum (o intervalo da raiz altera só docs; front e back "nenhum"); checks de rules/checks.md não se aplicam
Checks: back `npm run build` → não rodado (sem código)
Checks: back `npm test` → não rodado (sem código)
Checks: front `npm run build` → não rodado (sem código)
Fora de escopo: nada encontrado (nenhum código no intervalo)

Veredito: NÃO PRONTA — nenhum dos 25 CA tem implementação ou prova (todos SEM TESTE) e a spec tem pendências (Q1 a Q13 em aberto, contradição na contagem X de Y)
