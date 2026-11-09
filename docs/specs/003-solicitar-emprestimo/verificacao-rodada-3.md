# Verificação 003-solicitar-emprestimo — rodada 3

Data: 2026-11-09
HEAD raiz: 111c0e35ae8a57c6370b82d0e723443d88205090
HEAD front: 3e1133778098eccd40be1af18f635a02f7ca81f5
HEAD back: 49900af796cf70ead6862f3b8f0eddb1b2d0b6a0
Intervalos: raiz 221c469..HEAD · front e1a8475..HEAD · back 52c13d2..HEAD
Árvore: limpa (raiz, front e back sem modificação nem arquivo novo; este arquivo de verificação é criado depois da conferência)

Critério: ATENDIDO só quando a prova exigida pela spec existe e passou. Nenhuma prova foi inventada.

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO | back/src/modules/equipment/equipment.controller.spec.ts:20 (12 itens, campos, ordem, viewer); também :41, :65, :93. `npm test` passou |
| CA-02 | SEM TESTE | CA de Tela: exige print em docs/evidencias/003-*.png; não existe (só 003-indice.md com a tabela vazia). Aguarda o operador (T16 pendente) |
| CA-03 | ATENDIDO | back/src/modules/equipment/equipment.controller.spec.ts:74 (status real, dueAt, isMine, sem nome/e-mail) |
| CA-04 | SEM TESTE | CA de Tela: print ausente (T16 pendente do operador). Código em front/src/lib/situacao.ts e EquipmentCard.tsx existe, mas não conta como prova |
| CA-05 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:29 |
| CA-06 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:46 (falha injetada, sem loan nem status) |
| CA-07 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:59 |
| CA-08 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:79 (atraso) e :94 (dueAt = hoje aceito) |
| CA-09 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:102 (MANUTENCAO) e :115 (EMPRESTADO); :136 ordem Q12 |
| CA-10 | ATENDIDO | back/src/modules/loans/loans.concurrency.spec.ts:26 (10 pedidos, 1x201 + 9x409, 20 repetições) |
| CA-11 | ATENDIDO | back/src/modules/loans/loans.concurrency.spec.ts:39 (5 pedidos: 3+2) e :50 (2 abertos, 3 pedidos: 1+2) |
| CA-12 | ATENDIDO | back/src/modules/loans/loans.concurrency.spec.ts:65 |
| CA-13 | ATENDIDO | equipment.controller.spec.ts:105 e :116; loans.controller.spec.ts:144, :158 (POST) e :288 (mine); tenant.guard.spec.ts:44. Um caso por endpoint |
| CA-14 | ATENDIDO | equipment.controller.spec.ts:127; loans.controller.spec.ts:169 (POST) e :299 (mine); tenant.guard.spec.ts:55, :60, :65 |
| CA-15 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:226, :253 (OPERACOES), :265 |
| CA-16 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:180 (dueAt = D+14, virada de Brasília) e back/src/modules/equipment/equipment.controller.spec.ts:138 (today = D); back/src/common/clock.spec.ts |
| CA-17 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:191 |
| CA-18 | ATENDIDO | back/src/modules/loans/loans.controller.spec.ts:205 (loan.open, ator, tenant, recurso; recusa não grava) |
| CA-19 | SEM TESTE | CA de Tela: prints do modal, toast e resultado ausentes (T16 pendente do operador) |
| CA-20 | SEM TESTE | CA de Tela: três prints ausentes (T16 pendente do operador; atraso só no banco local, cenarios-locais.sql) |
| CA-21 | SEM TESTE | CA de Tela: prints ausentes (T16 pendente do operador) |
| CA-22 | SEM TESTE | Busca de texto da parte "placeholder" passou (abaixo) e o rodapé existe em front/src/pages/CatalogoPage.tsx:119 (link https://pixabay.com), mas o print do rodapé que a spec exige não existe |
| CA-23 | SEM TESTE | CA de Tela: print ausente (T16 pendente do operador) |
| CA-24 | SEM TESTE | Parte automática conferida e OK (abaixo). Falta o resultado colado pelo operador da consulta `count(*)` = 0 em produção: docs/specs/003-solicitar-emprestimo/evidencias-producao.md é só roteiro, sem resultado |
| CA-25 | ATENDIDO | Busca de texto abaixo, sem ocorrência em AGENTS.md e rules/ |
| CA-26 | ATENDIDO | Busca de texto abaixo, sem ocorrência em front/src (a spec define a prova do CA-26 como essa busca) |

## Buscas de texto (rodadas por mim)
- CA-25: `grep -rnE "003-catalogo|002-catalogo|Tarefa 9 da 003|MeusEmprestimos\.tsx" AGENTS.md rules/` → sem resultado (rc=1).
- CA-26 e CA-22 (placeholder): `grep -rnE "HOJE_DEMO|new Date\(|chega na próxima fatia|chega na proxima fatia" front/src` → sem resultado (rc=1). `front/src/data/` não existe mais. Outras ocorrências de "Date" em front/src: só `formatDate` (formatação do que a API devolveu).
- CA-24 (parte automática): em `back/src`, `*.spec.ts` e `src/testing/` só têm URLs falsas (`postgresql://u:p@localhost:5432/x`, `localhost:54321`) e um comentário em src/testing/app.ts:4; nenhuma leitura de `.env` nem host `supabase.co`. `DATABASE_URL` em código de produção só em `src/config/env.ts` e `src/modules/prisma/prisma.service.ts`. Em `back/prisma/`, três specs da 002 (`repositorio.spec.ts`, `dados-iniciais/guarda.spec.ts`, `equipamentos.spec.ts`) citam `.env`, mas fora de `back/src` e como verificação de que `.env` não é versionado (CA-08 da 002); não li `.env` nem `.env.remote`.

## Dependências e fora de escopo
- back/package.json no intervalo: só `supertest` 7.3.2 e `@types/supertest` 7.2.1 (autorizado, Q6). front/package.json: sem mudança.
- Rotas novas no back: só `GET /v1/equipment`, `POST /v1/loans`, `GET /v1/loans/mine` (além das existentes). Sem devolução, renovação, Operações nem migration.
- Front: "Devolver" só aparece como texto "Devolver até" (data); não há botão Devolver, "A vencer", etiqueta de papel nem avatar.
- Os testes usam Postgres descartável do Testcontainers; nada tocou produção.

## Consistência spec, plano e tarefas
- tasks.md: T0 a T15, T17 e T18 [x] com evidência (commits conferem com o intervalo); T16 [ ] parcial e T19 [ ] pendentes, ambas coerentes com o que a spec registra. Cada CA tem tarefa; nenhum CA inexistente citado. Sem divergência encontrada.
- Observação: a evidência da T10 cita `49900af` (openedOn acrescentado), que está no intervalo.
- `Status: EM ABERTO` na spec permanece correto.

Checks: back `npm run build` → passou (exit 0)
Checks: back `npm test` → passou (14 suítes, 80 testes, "Ran all test suites.")
Checks: back `npm run lint` → não existe
Checks: front `npm run build` → passou (exit 0; aviso de chunk > 500 kB, não é erro)
Checks: front `lint`, `typecheck`, `test` → não existem
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-02, 04, 19 a 23 sem print (T16 do operador) e CA-24 sem o resultado colado pelo operador; os CA automatizados (01, 03, 05 a 18), CA-25 e CA-26 estão atendidos
