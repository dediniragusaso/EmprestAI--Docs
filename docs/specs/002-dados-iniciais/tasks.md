# Tarefas — 002-dados-iniciais
`[ ]` pendente, `[x]` feito com a evidência. Uma tarefa por vez; cada uma cabe num commit no
repositório indicado. Spec aprovada e perguntas decididas pelo operador (T0).
Checks de cada tarefa de código (`rules/checks.md`): `cd back && npm run build` (exit 0) e
`npm test`; `lint` não existe no back (declarado, não pulado). O `front/` não foi tocado.

- [x] T0 Aprovar a spec e decidir as perguntas abertas (Q3, Q4, Q5, Q7, Q8, Q9, Q10, Q12, Q13, Q15,
  Q16, Q17). Sem código. (bloqueia CA-01 a CA-14) Evidência: o operador aprovou as propostas
  conservadoras em 2026-11-09; respostas na spec; commit `8706843` (raiz).
- [x] T1 Instalar `testcontainers` e `@testcontainers/postgresql` como devDependencies (CA-10,
  CA-01) — repo back. Evidência: `761867f` (12.0.4) e `aea2f9f` (trocada para 12.0.1, porque a
  12.0.4 não carrega no Node 22.13: ver "Dívida de processo" da spec). Lockfile: 111 pacotes novos,
  nenhum removido ou alterado.
- [x] T2 Migration `equipment_image` e `schema.prisma`, com unique `(tenantId, imagePixabayId)`
  (CA-10, CA-03) — repo back. Evidência: `399517d`; `prisma validate` ok; build exit 0; teste
  `Ran all test suites.` (4 testes). O `migrate reset` local não foi executado (Prisma exige
  consentimento do usuário para agente de IA); a prova de "aplica do zero" é o teste da T10.
- [x] T3 Script: leitura e validação de `equipamentos.json` e `creditos.json`, em
  `back/prisma/dados-iniciais/dados.ts` (CA-01, CA-03) — repo back. Evidência: `ebf49ce`; execução
  real: 12 itens, 9 `DISPONIVEL` e 3 `MANUTENCAO` (TI-0004, TI-0007, TI-0010), 12 fotos distintas.
- [x] T4 Script: upsert dos 12 equipamentos, `imageUrl` e créditos, sem alterar `status` de linha
  existente, e npm script `db:dados-iniciais` (CA-01, CA-02, CA-03, CA-04, CA-13) — repo back.
  Evidência: `236eca1`; testes na T11.
- [x] T5 Script: guarda de produção, confirmação explícita para host remoto
  (`DADOS_INICIAIS_CONFIRMO_PRODUCAO`) (CA-09) — repo back. Evidência: `a4188a6`; execução com
  destino remoto falso saiu com exit 1, listou só os hosts e não imprimiu a senha; testes na T12.
- [x] T6 Script: usuário obrigatório com cliente do Auth injetado, espelho e membership
  `COLABORADOR` (CA-05, CA-07) — repo back. Evidência: `17254e0` (junto com a T7, mesmo arquivo).
- [x] T7 Script: conta de teste opcional (CA-11) — repo back. Evidência: `17254e0` (entregue no
  mesmo commit da T6, porque a lógica está em `principal.ts`).
- [x] T8 `.env.example` com `SEED_TESTE_EMAIL`, `SEED_TESTE_PASSWORD` e, comentada,
  `DADOS_INICIAIS_CONFIRMO_PRODUCAO` (CA-08) — repo back. Evidência: `9e0d17f`.
- [x] T9 `rules/secrets.md` com os nomes novos (CA-08) — repo raiz. Evidência: `e651ad3`.
- [x] T10 Configuração do Jest para `prisma/` e teste local: migration do zero e colunas (CA-10) —
  repo back. Evidência: `aea2f9f`; 2 testes novos; `npm test` verde.
- [x] T11 Teste local: equipamentos, créditos, idempotência e `status` preservado (CA-01, CA-02,
  CA-03, CA-04, CA-13) — repo back. Evidência: `2eba579`; 5 testes novos.
- [x] T12 Teste local: usuário com Auth simulado, zero empréstimos, conta de teste e guarda
  (CA-05, CA-07, CA-09, CA-11) — repo back. Evidência: `36d9442`; 13 testes novos.
- [x] T13 Teste local: nenhum segredo no git e seed inalterado (CA-08, CA-14) — repo back.
  Evidência: `da2dbb8`; 30 testes no total, `Ran all test suites.`
- [x] T14 Renumeração: atualizar referências a "002-catalogo" (CA-12) — repo raiz. Evidência:
  `bc93f86`; a busca por `002-catalogo` só acha notas "antes chamada 002-catalogo".
- [x] T15 Modelo de `evidencias-producao.md` para o operador (CA-02, CA-04, CA-05, CA-06, CA-07)
  — repo raiz. Evidência: `6f364c7`.
- [ ] T16 **Operador:** `migrate deploy`, `db:seed` (se faltar o tenant), `enviar` ×2 e
  `db:dados-iniciais` ×2 no remoto, o login do professor e `GET /v1/me`, com evidência colada em
  `evidencias-producao.md` (CA-01, CA-02, CA-04, CA-05, CA-06, CA-07). O agente não executa.
- [ ] T17 Verificação por `verificador-spec` e, só com `Veredito: PRONTA`, a marca de pronta
  (CA-01 a CA-14) — repo raiz
