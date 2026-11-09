# Verificação 002-dados-iniciais — rodada 6

Data: 2026-11-09
HEAD raiz: 45f2d3b52818b740026218dca6040b4621128545
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 52c13d2877757585efbc0a434ac39ee947c23897
Intervalos: raiz 49a4a24..HEAD · front nenhum · back 6f99c10..HEAD
Árvore: limpa

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:32 e usuarios.spec.ts:139 (passaram). Produção: SAÍDA COLADA (SQL 5.2: total=12, disponivel=9, manutencao=3). A spec pede "contagem por situação": satisfeito. |
| CA-02 | ATENDIDO | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:53 (passou). Produção: SAÍDA COLADA (evidencias-producao.md, "5.1"): 12 linhas "TI-00NN 200 image/jpeg 800x600". Satisfaz a spec (status, tipo e dimensões das 12 URLs). |
| CA-03 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:65 (passou); prova prevista só local. Reforço: SQL colada, imagens_distintas=12. |
| CA-04 | ATENDIDO | Local: back/prisma/dados-iniciais/equipamentos.spec.ts:94 (passou; duas execuções, mesmas contagens). Produção: SAÍDA COLADA de imagens:enviar 2x (12 objetos, sem duplicata) e de db:dados-iniciais 2x ("0 criados, 12 atualizados") + SQL após as repetições (12 equipamentos, 12 fotos, 1 linha de professor COLABORADOR). Ver nota abaixo sobre "0 criados". |
| CA-05 | ATENDIDO | Local: back/prisma/dados-iniciais/usuarios.spec.ts:60, :79, :132 (passaram). Produção: SAÍDA COLADA (SQL 5.2: papel_professor=COLABORADOR; 2ª execução: "professor: ja existia no Auth") + PRINT do login real. |
| CA-06 | ATENDIDO | Só produção. PRINT docs/evidencias/002-ca06-login-professor-producao.png.jpeg (visto): URL emprest-ai-six.vercel.app, "Sessão ativa como marcelo.grilo@institutojef.org.br", e-mail no cabeçalho, sem senha nem token. O e-mail vem de GET /v1/me (front/src/pages/HomePage.tsx, front/src/lib/api.ts), logo prova indireta do 200 com o e-mail; o print não mostra a resposta HTTP bruta. Julgado suficiente (mesmo critério da rodada 5). |
| CA-07 | ATENDIDO | Local: back/prisma/dados-iniciais/usuarios.spec.ts:94 (passou). Produção: SAÍDA COLADA (SQL 5.2: total_emprestimos=0). |
| CA-08 | ATENDIDO | back/prisma/repositorio.spec.ts:33, :38, :47, :63, :79, :97 (passaram) |
| CA-09 | ATENDIDO | back/prisma/dados-iniciais/guarda.spec.ts:21, :25, :37, :41, :47, :52 (passaram) |
| CA-10 | ATENDIDO | back/prisma/migrations.spec.ts:18 e :33 (passaram); prova prevista é local. Reforço: migrate status remoto "up to date" (saída colada). |
| CA-11 | ATENDIDO | back/prisma/dados-iniciais/usuarios.spec.ts:104 e :119 (passaram) |
| CA-12 | ATENDIDO | Sem teste automatizado (spec prevê busca de texto na T12). Verificado na rodada 5; desde então a raiz só mudou evidencias-producao.md e verificacao-rodada-5.md (git diff 0e6049b..HEAD). |
| CA-13 | ATENDIDO | back/prisma/dados-iniciais/equipamentos.spec.ts:103 (passou) |
| CA-14 | ATENDIDO | back/prisma/repositorio.spec.ts:103 (passou) |

Classificação das provas de produção (o agente não acessou produção; não posso autenticar a origem das saídas coladas, só o que está registrado no arquivo):
- Saída colada pelo operador: 12 URLs com dimensão (CA-02); imagens:enviar 2x (CA-04); db:dados-iniciais 2x (CA-01, CA-04, CA-05); SQL 5.2 (CA-01, CA-03, CA-05, CA-07); migrate status remoto (CA-10).
- Print: login do professor (CA-06, apoia CA-05).
- Declaração do operador, sem saída: apenas a 1ª população de produção ("12 criados"), feita antes das duas execuções coladas. A spec não a exige em nenhum CA.

Nota sobre CA-04 / CA-01 e "0 criados, 12 atualizados": o texto do CA-04 pede "rodar o script duas vezes deixa 12 equipamentos, 1 usuário obrigatório e 1 membership dele; nada duplica" e, como prova de produção, "duas execuções de enviar e duas do script". Não exige que a 1ª execução crie; exige que a repetição não duplique. As duas execuções coladas dão 0 criados / 12 atualizados e o SQL posterior dá 12 equipamentos e 12 fotos distintas: idempotência demonstrada (R5). O "1ª: 12 criados" aparece só como "Esperado" no modelo de evidencias-producao.md (seção 4), não na spec. Que a criação inicial (CA-01 em produção) nunca foi vista em saída é irrelevante para CA-01 (que pede o estado final, contagem por situação) e para CA-04. Não muda o veredito. Ressalva menor: o SQL colado mostra o professor como uma linha ("papel_professor=COLABORADOR") e não um count explícito; a "1 membership" é inferida desse formato.

Checks: back `npm test` (jest) → passou (Test Suites: 6 passed, 6 total; Tests: 30 passed, 30 total)
Checks: back `npm run build` (tsc -p tsconfig.build.json) → passou
Checks: back `npm run lint` → não existe
Checks: front (`build`, `lint`, `test`) → não rodados (front: nenhum nesta spec; lint e test não existem)
Fora de escopo: nada encontrado

Veredito: PRONTA
