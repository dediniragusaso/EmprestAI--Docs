# Verificação 002-dados-iniciais — rodada 5

Data: 2026-11-09
HEAD raiz: 0e6049b8f226f5bac3e20109551d2038e5599e02
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 52c13d2877757585efbc0a434ac39ee947c23897
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:32 e usuarios.spec.ts:139 (passaram). Produção: SAÍDA COLADA pelo operador (SQL 5.2: total=12, disponivel=9, manutencao=3). A spec pede "contagem por situação": satisfeito. |
| CA-02 | SEM TESTE | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:53 (passou). Produção: só DECLARAÇÃO do operador ("200 image/jpeg" nas 12, sem saída bruta); a dimensão 800x600, exigida pela spec, não foi informada. Sem print. Não satisfaz. |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (passou); prova só local. Reforço em produção: SQL colada, imagens_distintas=12. |
| CA-04 | SEM TESTE | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:94 (passou). Produção: só DECLARAÇÃO do operador (enviar 2x e script 2x; "12 criados / 0 criados e 12 atualizados"), nenhuma saída colada. A spec exige a execução dupla em produção; sem saída, não satisfaz. |
| CA-05 | ATENDIDO | Local: back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132 (passaram). Produção: SAÍDA COLADA (SQL 5.2: papel_professor=COLABORADOR em users+memberships) + PRINT do login real no front publicado (prova que o usuário existe no Auth real). |
| CA-06 | ATENDIDO | Só produção, como a spec prevê. PRINT docs/evidencias/002-ca06-login-professor-producao.png.jpeg: sessão ativa como marcelo.grilo@institutojef.org.br, e-mail no cabeçalho. O e-mail exibido vem de GET /v1/me (front/src/pages/HomePage.tsx:18,29 usa `data` de front/src/lib/api.ts:13), então o print prova indiretamente o 200 com o e-mail; o print não mostra a resposta HTTP bruta. Julgado suficiente. |
| CA-07 | ATENDIDO | Local: back/prisma/dados-iniciais/usuarios.spec.ts:94 (passou). Produção: SAÍDA COLADA (SQL 5.2: total_emprestimos=0). |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79, :97 (passaram) |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (passaram) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 e :33 (passaram); prova prevista é local. Reforço: migrate status no remoto "up to date" (saída colada). |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 (passaram) |
| CA-12 | ATENDIDO | Sem teste automatizado (spec prevê busca de texto na T12). Busca: restam "002-catalogo" só em frases "antes chamada 002-catalogo" (rules/qualidade-codigo.md:73, rules/tests.md:32) e em histórico listado; AGENTS.md sem ocorrência. |
| CA-13 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 (passou) |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103 (passou) |

Classificação das provas de produção (o agente não acessou produção):
- Saída colada pelo operador: SQL 5.2 (CA-01, CA-03, CA-05, CA-07) e migrate status remoto (CA-10).
- Print: login do professor (CA-06, apoia CA-05).
- Só declaração do operador, sem saída: imagens:enviar 2x, db:dados-iniciais 2x (CA-04) e as 12 URLs (CA-02, sem dimensões).

Checks: back `npm test` (jest) → passou (Test Suites: 6 passed, 6 total; Tests: 30 passed, 30 total)
Checks: back `npm run build` (tsc -p tsconfig.build.json) → passou
Checks: back `npm run lint` → não existe
Checks: front (`build`, `lint`, `test`) → não rodados (front: nenhum nesta spec)
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-02 e CA-04 têm prova de produção só declarada (sem saída colada; dimensões 800x600 não informadas)
