# Verificação 002-dados-iniciais — rodada 2

Data: 2026-11-09
HEAD raiz: f2dde1de2eb7456c2f85e63b861d729da58746a4
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 37b4b70f110d7439228774180aebf53c4e04496d
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa (raiz, front e back sem modificações; HEAD idêntico no início e no fim)

Observação: o HEAD do back é o commit 37b4b70 "TESTE: erro plantado para provar o verificador". Ele acrescenta `status: item.status` ao `update` do upsert em back/prisma/dados-iniciais/equipamentos.ts (linha 54), o que viola a R5/CA-13. O teste do CA-13 falhou na execução desta rodada por causa disso.

| CA | veredito | evidência |
|---|---|---|
| CA-01 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:32 (e usuarios.spec.ts:139, tenant ausente). Prova de produção (contagem por situação) pendente: evidencias-producao.md é modelo vazio. |
| CA-02 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:53 (montagem da URL). Prova de produção (HTTP 200, image/jpeg, 800x600 das 12 URLs) pendente; o 200 sem login não tem teste local por desenho da spec. |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (passou nesta execução) |
| CA-04 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:94. Prova de produção (enviar 2x, script 2x) pendente. |
| CA-05 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132. Prova de produção (usuário no Auth real) pendente. |
| CA-06 | SEM TESTE | Spec prevê só produção (login do professor e GET /v1/me); sem evidência do operador. |
| CA-07 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/usuarios.spec.ts:94. Prova de produção (contagem em loans) pendente. |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79 (passaram) |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (passaram) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 e :33 (passaram) |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 (passaram) |
| CA-12 | ATENDIDO | Sem teste automatizado (a spec prevê busca de texto). Busca feita nesta rodada: "002-catalogo" só aparece, fora da pasta da 002, em docs/handoffs/2026-11-09-etapa1-verificador-hook.md:77 (histórico listado na spec) e em frases "antes chamada 002-catalogo" (docs/specs/001-login/spec.md:71, rules/qualidade-codigo.md:73, rules/tests.md:32). |
| CA-13 | REPROVADO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 FALHOU em :118 (esperado "EMPRESTADO", recebido "DISPONIVEL"): o update do upsert regrava o status (back/prisma/dados-iniciais/equipamentos.ts:54, commit 37b4b70). |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103 (passou) |

Checks: back `npm test` (jest) → falhou (Test Suites: 1 failed, 5 passed, 6 total; Tests: 1 failed, 29 passed, 30 total)
Checks: back `npm run build` (tsc -p tsconfig.build.json) → passou (não compila prisma/; saída sem erro)
Checks: back `npm run lint` → não existe
Checks: front (`build`, `lint`, `test`) → não rodados (front: nenhum nesta spec)
Fora de escopo: nada encontrado além do erro plantado em back/prisma/dados-iniciais/equipamentos.ts:54 (status no update, contrário à R5)

Veredito: NÃO PRONTA — CA-13 reprovado (teste falha: o update regrava o status, commit 37b4b70) e as provas de produção de CA-01, CA-02, CA-04, CA-05, CA-06 e CA-07 seguem pendentes
