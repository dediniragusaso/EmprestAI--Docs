# Verificação 002-dados-iniciais — rodada 4

Data: 2026-11-09
HEAD raiz: 4902cc2fd70bfcd5bc3b159cc050894edd3a91e5
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 52c13d2877757585efbc0a434ac39ee947c23897
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa (raiz, front e back sem modificações; HEAD idêntico no início e no fim)

Critério: ATENDIDO só quando a prova exigida pela spec existe e passou. evidencias-producao.md (registro de 2026-11-09) traz apenas declaração do operador, "a confirmar" e saídas não coladas; isso NÃO é prova. Onde a spec exige produção, o veredito é SEM TESTE para a parte de produção (a parte local está indicada).

| CA | veredito | evidência |
|---|---|---|
| CA-01 | SEM TESTE | Local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:32 e usuarios.spec.ts:139. Produção: SEM TESTE (contagem SQL "a confirmar"; só há declaração de execução, sem saída). |
| CA-02 | SEM TESTE | Local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:53. Produção: SEM TESTE (item 5.1, 12 URLs "a confirmar"; envio apenas declarado). |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (passou); spec prevê só teste local. |
| CA-04 | SEM TESTE | Local passa: back/prisma/dados-iniciais/equipamentos.spec.ts:94. Produção: SEM TESTE (enviar 2x e script 2x só declarados; saídas não coladas). |
| CA-05 | SEM TESTE | Local passa: back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132. Produção: SEM TESTE (usuário no Auth real "a confirmar"). |
| CA-06 | SEM TESTE | Spec prevê só produção; evidência 5.3 "a confirmar" (print ausente). Sem teste local por desenho. |
| CA-07 | SEM TESTE | Local passa: back/prisma/dados-iniciais/usuarios.spec.ts:94. Produção: SEM TESTE (contagem em loans "a confirmar"). |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79 (passaram) |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (passaram) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 e :33 (passaram); spec prevê só teste local (a migration no remoto está "a confirmar" na evidência, mas não é a prova exigida deste CA). |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 (passaram) |
| CA-12 | ATENDIDO | Sem teste automatizado (spec prevê busca de texto). "002-catalogo" fora da pasta da 002 só em docs/handoffs/2026-11-09-etapa1-verificador-hook.md (histórico listado) e em frases "antes chamada 002-catalogo" (docs/specs/001-login/spec.md, rules/qualidade-codigo.md, rules/tests.md). |
| CA-13 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 (passou); equipamentos.ts update sem status. |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103 (passou). |

Checks: back `npm test` (jest) → passou (Test Suites: 6 passed, 6 total; Tests: 30 passed, 30 total)
Checks: back `npm run build` (tsc -p tsconfig.build.json) → passou
Checks: back `npm run lint` → não existe
Checks: front (`build`, `lint`, `test`) → não rodados (front: nenhum nesta spec)
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-06 sem nenhuma prova e as provas de produção de CA-01, CA-02, CA-04, CA-05 e CA-07 são só declaração do operador, sem saída colada
