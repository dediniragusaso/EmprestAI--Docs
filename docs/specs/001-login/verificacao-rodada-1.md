# Verificação 001-login — rodada 1

Data: 2026-11-09
HEAD raiz: 221a8dd969d9f3420e73b9065e5d508b1b0db735
HEAD front: e1a8475b719909766b9f1caf85a75669bdbe1b6f
HEAD back: 9e151dbd89cd7827af10d5600e7d213ea7d96a99
Intervalos: raiz b726744..HEAD · front 478f354..e1a8475 · back 260fd64..9e151db (inclui 260fd64)
Árvore: limpa

| CA | veredito | evidência |
|---|---|---|
| CA-01 | SEM TESTE | back/src/modules/health/health.controller.ts existe, mas nenhum teste cita CA-01 (nenhum supertest) |
| CA-02 | SEM TESTE | back/src/modules/auth/auth.guard.ts e common/problem-details.filter.ts existem; nenhum teste cita CA-02 |
| CA-03 | SEM TESTE | back/src/modules/auth/jwt-verifier.service.spec.ts:31 prova o verificador, mas o nome não cita CA-03 e não exercita GET /v1/me |
| CA-04 | SEM TESTE | back/src/modules/auth/jwt-verifier.service.spec.ts:38 e :44 (expirado, adulterado) provam o serviço, sem citar CA-04 e sem exercitar o 401 HTTP |
| CA-05 | SEM TESTE | front/src/pages/LoginPage.tsx existe; front não tem runner de teste |
| CA-06 | SEM TESTE | front/src/pages/LoginPage.tsx; sem teste |
| CA-07 | SEM TESTE | front/src/pages/LoginPage.tsx; sem teste |
| CA-08 | SEM TESTE | front/src/auth/RequireAuth.tsx; sem teste |
| CA-09 | SEM TESTE | front/src/pages/HomePage.tsx, front/src/auth/session.tsx; sem teste |
| CA-10 | SEM TESTE | back/.env.example e front/.env.example versionados; .env reais não lidos por restrição; sem teste |

Checks: back `npm run test` → passou (4 testes, nenhum cita CA-xx)
Checks: back `npm run build` → passou
Checks: front `npm run build` → passou
Checks: back `npm run lint` → não existe
Checks: front `npm run lint` → não existe
Checks: front typecheck (`npx tsc -b` separado) → não existe como script; coberto por `tsc --noEmit` dentro do build
Checks: front `npm run test` → não existe
Fora de escopo: back/prisma (schema.prisma, migration init, seed.ts) e script postinstall `prisma generate` — spec diz "Sem Prisma ... nesta fatia"; back/src/modules/root/root.controller.ts — endpoint não pedido pela spec; front/docs/ (PRD, ADR, handoff copiados), front/layout.md, front/docs/stacks.md — cópias de documentação dentro do repositório do front.

Veredito: NÃO PRONTA — nenhum CA tem teste que o cite (10 SEM TESTE) e há código fora de escopo (Prisma/seed/migration, root controller).
