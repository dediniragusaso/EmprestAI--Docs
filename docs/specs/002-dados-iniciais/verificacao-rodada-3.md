# Verificação 002-dados-iniciais — rodada 3

Data: 2026-11-09
HEAD raiz: 5815318205b0322478bb6bfa9bbc08698a193932
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 52c13d2877757585efbc0a434ac39ee947c23897
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa (raiz, front e back sem modificações; HEAD idêntico no início e no fim)

Critério usado em todos os CA: "prova local atendida, produção pendente" = SEM TESTE (mesmo critério da rodada 2). ATENDIDO só quando a spec prevê apenas prova local e ela passou. O erro plantado da rodada 2 (commit 37b4b70) foi desfeito em 52c13d2: o `update` do upsert em back/prisma/dados-iniciais/equipamentos.ts:53 não tem mais `status`.

| CA | veredito | evidência |
|---|---|---|
| CA-01 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:32 (e usuarios.spec.ts:139, tenant ausente). Prova de produção (contagem por situação) pendente: evidencias-producao.md é modelo vazio. |
| CA-02 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:53 (montagem da URL). Prova de produção (HTTP 200, image/jpeg, 800x600 das 12 URLs) pendente; o 200 sem login não tem teste local por desenho da spec. |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (passou) |
| CA-04 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:94. Prova de produção (enviar 2x, script 2x) pendente. |
| CA-05 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132. Prova de produção (usuário no Auth real) pendente. |
| CA-06 | SEM TESTE | Spec prevê só produção (login do professor e GET /v1/me); sem evidência do operador. |
| CA-07 | SEM TESTE | Parte local passa: back/prisma/dados-iniciais/usuarios.spec.ts:94. Prova de produção (contagem em loans) pendente. |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79 (passaram) |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (passaram) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 e :33 (passaram) |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 (passaram) |
| CA-12 | ATENDIDO | Sem teste automatizado (a spec prevê busca de texto). Busca feita nesta rodada: "002-catalogo" fora da pasta da 002 só aparece em docs/handoffs/2026-11-09-etapa1-verificador-hook.md:77 (histórico listado na spec) e em frases "antes chamada 002-catalogo" (docs/specs/001-login/spec.md:71, rules/qualidade-codigo.md:73, rules/tests.md:32). |
| CA-13 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 (passou); código: equipamentos.ts:53, update sem status, create com status (:51). |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103 (passou); git diff 9e151db..HEAD em prisma/seed.ts vazio; db:seed = "prisma db seed". |

Checks: back `npm test` (jest) → passou (Test Suites: 6 passed, 6 total; Tests: 30 passed, 30 total)
Checks: back `npm run build` (tsc -p tsconfig.build.json) → passou (não compila prisma/; saída sem erro)
Checks: back `npm run lint` → não existe
Checks: front (`build`, `lint`, `test`) → não rodados (front: nenhum nesta spec)
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-06 sem prova e as provas de produção de CA-01, CA-02, CA-04, CA-05 e CA-07 pendentes do operador (evidencias-producao.md vazio); todos os testes locais passam, incluindo CA-13
