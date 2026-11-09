# Verificação 002-dados-iniciais — rodada 1

Data: 2026-11-09
HEAD raiz: 8adde85c4497281180ac9b488700cc3e5d1b922a
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: da2dbb8b7263301d5b814b82faa7832fda9725b0
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa (raiz, front e back sem modificações)

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO (local); produção pendente | back/prisma/dados-iniciais/equipamentos.spec.ts:32 (12 itens, 3 MANUTENCAO, 9 DISPONIVEL, 0 EMPRESTADO) e usuarios.spec.ts:139 (tenant ausente). Falta a contagem por situação no remoto em evidencias-producao.md (modelo não preenchido). |
| CA-02 | ATENDIDO só na parte local (montagem da URL); produção pendente | back/prisma/dados-iniciais/equipamentos.spec.ts:53. HTTP 200, image/jpeg e 800x600 das 12 URLs no Storage real: sem prova (evidencias-producao.md em branco). |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (créditos = creditos.json, 12 ids distintos, P2002 no mesmo tenant, aceito em outro tenant, linhas 80-91) |
| CA-04 | ATENDIDO (local); produção pendente | back/prisma/dados-iniciais/equipamentos.spec.ts:94 (12 equipamentos, segunda execução só atualiza) e usuarios.spec.ts:60 (script completo 2x: 1 usuário, 1 membership, 12 equipamentos; teste nomeado CA-05). Falta `enviar` 2x e script 2x no remoto. |
| CA-05 | ATENDIDO (local); Auth real pendente | back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132 (Auth simulado: membership COLABORADOR única). Existência no Auth real só em produção, não preenchida. |
| CA-06 | SEM TESTE | Spec exige prova só de produção (login do professor + GET /v1/me 200); não há prova local possível e evidencias-producao.md é modelo vazio. |
| CA-07 | ATENDIDO (local); produção pendente | back/prisma/dados-iniciais/usuarios.spec.ts:94 e equipamentos.spec.ts:50. Contagem de `loans` no remoto não preenchida. |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79 |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (script real com host remoto falso sai com erro sem escrever) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 (migrations do zero, 5 colunas) e :33 (unique composto recusa repetido) |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 |
| CA-12 | ATENDIDO | Sem teste automatizado (a spec prevê busca de texto na T12). Busca feita nesta rodada: AGENTS.md:11 e :45, rules/spec-flow.md:22, rules/tests.md:32 e :54, rules/qualidade-codigo.md:73 e docs/specs/001-login/spec.md:71 já apontam para a 003; "002-catalogo" restante só em docs/handoffs/2026-11-09-etapa1-verificador-hook.md:77 (histórico, listado na spec) e na própria 002. |
| CA-13 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103; conferido também `git diff 9e151db HEAD -- prisma/seed.ts` vazio e `db:seed` inalterado no package.json |

Checks: back `npm test` → passou (Test Suites: 6 passed, 6 total; Tests: 30 passed, 30 total; Time: 21.65 s)
Checks: back `npm run build` → passou (tsc -p tsconfig.build.json, sem erro; não compila prisma/)
Checks: back `npm run lint` → não existe
Checks: front (`lint`, `test`, `build`) → não rodado: front fora desta spec (nenhum)
Checks: `prisma migrate reset` (rules/checks.md passo 2) → não executado (Prisma recusa por agente de IA; registrado na Dívida de processo; coberto pelo teste do CA-10)
Fora de escopo: nada encontrado (diff do back: só scripts de dados iniciais, testes, migration, schema, creditos.json e npm scripts; nenhum endpoint ou tela)

Pendências de produção (operador): preencher docs/specs/002-dados-iniciais/evidencias-producao.md (migrate deploy, db:seed, imagens:enviar 2x, db:dados-iniciais 2x, 12 URLs com 200/image/jpeg/800x600, contagens, login do professor e GET /v1/me). Sem isso, CA-06 não tem prova e CA-01, CA-02, CA-04, CA-05 e CA-07 não têm a parte de produção exigida pela spec.

Veredito: NÃO PRONTA — CA-06 sem prova (só produção, evidencias-producao.md não preenchido) e provas de produção de CA-01, CA-02, CA-04, CA-05 e CA-07 pendentes
