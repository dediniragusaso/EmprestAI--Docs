# Tarefas — 002-dados-iniciais
`[ ]` pendente, `[x]` feito com a evidência. Uma tarefa por vez; cada uma cabe num commit no
repositório indicado. Nenhuma começa antes de o operador aprovar a spec e decidir as perguntas
que travam código.

- [ ] T0 Aprovar a spec e decidir as perguntas abertas (Q3, Q4, Q5, Q7, Q8, Q9, Q10, Q12, Q13, Q15,
  Q16, Q17). Sem código. (bloqueia CA-01 a CA-14)
- [x] T1 Instalar `testcontainers` e `@testcontainers/postgresql` `12.0.4` como devDependencies
  (CA-10, CA-01) — repo back. Evidência: commit `761867f`; 111 pacotes novos, nenhum removido ou
  alterado; `npm run build` exit 0; `npm run test` 4 testes verdes.
- [ ] T2 Migration `equipment_image` e `schema.prisma`, com unique `(tenantId, imagePixabayId)`
  (CA-10, CA-03) — repo back
- [ ] T3 Script: leitura e validação de `equipamentos.json` e `creditos.json`, em
  `back/prisma/dados-iniciais.ts` (CA-01, CA-03) — repo back
- [ ] T4 Script: upsert dos 12 equipamentos, `imageUrl` e créditos, sem alterar `status` de linha
  existente, e npm script `db:dados-iniciais` (CA-01, CA-02, CA-03, CA-04, CA-13) — repo back
- [ ] T5 Script: guarda de produção, confirmação explícita para host remoto (CA-09) — repo back
- [ ] T6 Script: usuário obrigatório com cliente do Auth injetado, espelho e membership
  `COLABORADOR` (CA-05, CA-07) — repo back
- [ ] T7 Script: conta de teste opcional (CA-11) — repo back
- [ ] T8 `.env.example` com `SEED_TESTE_EMAIL`, `SEED_TESTE_PASSWORD` e a variável de confirmação
  (CA-08) — repo back
- [ ] T9 `rules/secrets.md` com os nomes novos (CA-08) — repo raiz
- [ ] T10 Configuração do Jest para `prisma/` (mostrar antes de aplicar) e teste local: migration
  do zero e colunas (CA-10) — repo back
- [ ] T11 Teste local: equipamentos, créditos, idempotência e `status` preservado (CA-01, CA-02,
  CA-03, CA-04, CA-13) — repo back
- [ ] T12 Teste local: usuário com Auth simulado, zero empréstimos, conta de teste e guarda
  (CA-05, CA-07, CA-09, CA-11) — repo back
- [ ] T13 Teste local: nenhum segredo no git e seed inalterado (CA-08, CA-14) — repo back
- [ ] T14 Renumeração: atualizar referências a "002-catalogo" (CA-12) — repo raiz
- [ ] T15 Modelo de `evidencias-producao.md` para o operador (CA-02, CA-04, CA-05, CA-06, CA-07)
  — repo raiz
- [ ] T16 **Operador:** `migrate deploy`, `db:seed` (se faltar o tenant), `enviar` ×2 e
  `db:dados-iniciais` ×2 no remoto, o login do professor e `GET /v1/me`, com evidência colada em
  `evidencias-producao.md` (CA-01, CA-02, CA-04, CA-05, CA-06, CA-07). O agente não executa.
- [ ] T17 Verificação por `verificador-spec` e, só com `Veredito: PRONTA`, a marca de pronta
  (CA-01 a CA-14) — repo raiz
