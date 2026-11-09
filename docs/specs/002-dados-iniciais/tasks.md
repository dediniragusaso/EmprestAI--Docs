# Tarefas — 002-dados-iniciais
`[ ]` pendente, `[x]` feito com a evidência. Uma tarefa por vez; cada uma cabe num commit no
repositório indicado. Nenhuma começa antes de o operador aprovar a spec.

- [ ] T0 Aprovar a spec e responder Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q11 e Q14; errata de
  `docs/modelagem-banco.md` §9 e do ADR-001 (feita pelo operador). Sem código. (bloqueia CA-01 a CA-12)
- [ ] T1 Migration `equipment_image` e `schema.prisma` (CA-10, CA-03) — repo back
- [ ] T2 Seed: leitura e validação de `equipamentos.json` e `creditos.json` (CA-01, CA-03) — repo back
- [ ] T3 Seed: upsert dos 12 equipamentos com `imageUrl` e créditos (CA-01, CA-02, CA-03, CA-04) — repo back
- [ ] T4 Seed: guarda de produção, confirmação explícita para host remoto (CA-09) — repo back
- [ ] T5 Seed: usuário obrigatório via API admin, espelho e membership `COLABORADOR` (CA-05, CA-07) — repo back
- [ ] T6 Seed: conta de teste opcional (CA-11) — repo back
- [ ] T7 `.env.example` com `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` (CA-08) — repo back
- [ ] T8 `rules/secrets.md` com os nomes novos (CA-08) — repo raiz
- [ ] T9 Teste local: equipamentos, créditos e idempotência do seed e do `enviar` (CA-01, CA-02, CA-03, CA-04, CA-10) — repo back
- [ ] T10 Teste local: usuário, login, `GET /v1/me`, zero empréstimos, conta de teste e guarda (CA-05, CA-06, CA-07, CA-09, CA-11) — repo back
- [ ] T11 Teste local: nenhum segredo no git (CA-08) — repo back
- [ ] T12 Renumeração: atualizar referências a "002-catalogo" (CA-12) — repo raiz
- [ ] T13 Modelo de `evidencias-producao.md` para o operador (CA-02, CA-04, CA-05, CA-06, CA-07) — repo raiz
- [ ] T14 **Operador:** `migrate deploy`, `enviar` ×2 e `db:seed` ×2 no remoto, com evidência colada em `evidencias-producao.md` (CA-01, CA-02, CA-04, CA-05, CA-06, CA-07). O agente não executa.
- [ ] T15 Verificação por `verificador-spec` e, só com `Veredito: PRONTA`, `Status: PRONTA` (CA-01 a CA-12) — repo raiz
