# Plano — 002-dados-iniciais
Restringido por ADR-001 §5 (Prisma Migrate dono do schema; `DIRECT_URL` na migration), §7
(Supabase Auth, cadastro fechado, `service_role` só no backend), §8 (testes) e §9 (env), por
ADR-004 (sharp só em script de preparo), `docs/modelagem-banco.md` §4.4 e §9, e por
`rules/migration.md`, `rules/secrets.md`, `rules/restrictions.md` ("Produção") e `rules/tests.md`.

**Nada abaixo começa antes de o operador aprovar a spec e responder Q1, Q2, Q6 e Q11**, que
bloqueiam as etapas 1, 2 e 5. Todo comando do agente roda contra banco e Supabase **locais**, com
`DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` locais definidos no
próprio comando (o ambiente do processo vence o `back/.env`, que aponta para o remoto).

## Etapa 0 — Decisões (sem código)
Objetivo: fechar o que a spec deixou em "não decidido" e a errata de C2.
Saída: respostas do operador a Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q11, Q14 anotadas na spec; errata
de `docs/modelagem-banco.md` §9 e da linha do ADR-001 feita pelo operador (o agente não escreve
ADR). Verificação: nenhuma pergunta que bloqueie fica sem resposta na seção "Fora de escopo / não
decidido".

## Etapa 1 — Migration (CA-10, CA-03)
Objetivo: `equipment` ganha as colunas de imagem.
- `back/prisma/schema.prisma`: em `Equipment`, `imageUrl String? @map("image_url") @db.Text`,
  `imagePixabayId Int? @unique @map("image_pixabay_id")`, `imageAuthor String? @map("image_author")
  @db.Text`, `imagePageUrl String? @map("image_page_url") @db.Text`, `imageLicense String?
  @map("image_license") @db.Text`. O alcance do `unique` depende de Q2 (global ou
  `@@unique([tenantId, imagePixabayId])`).
- Migration nova em `back/prisma/migrations/<timestamp>_equipment_image/`, gerada com
  `npx prisma migrate dev --name equipment_image --create-only` e só então aplicada. SQL esperado:
  `ALTER TABLE "equipment" ADD COLUMN ...` (5 colunas, nulas) e o índice único. Sem tabela nova,
  logo sem policy nova; a migration não mexe no RLS da `init`. Linhas existentes: ficam com as
  colunas nulas, sem passo de preenchimento (rules/migration.md, passo 4).
- Verificação: `npx prisma migrate reset` no banco **local** sobe do zero (checks.md, passo 2) e
  `\d equipment` mostra as colunas. A migration não é aplicada no remoto pelo agente (R6).

## Etapa 2 — Seed dos equipamentos (CA-01, CA-03, CA-04)
Objetivo: gravar os 12 itens com créditos e `imageUrl`, repetível.
- `back/prisma/seed.ts` passa a orquestrar; a lógica nova vai em módulos ao lado
  (`back/prisma/seed/equipamentos.ts`), sem lógica de negócio no arquivo principal.
- Leitura de `back/scripts/imagens-equipamentos/equipamentos.json` e `creditos.json` com `fs` e
  validação com Zod (já é dependência): categoria e situação mapeadas por tabela fechada, id de
  patrimônio obrigatório, equipamento sem crédito derruba o seed.
- `imageUrl` = `${SUPABASE_URL}/storage/v1/object/public/imagens/equipamentos/<patrimonio>.jpg`,
  com `SUPABASE_URL` sem barra final.
- Upsert por `tenantId_patrimonio`; o conteúdo do `update` é o que Q1 decidir.
- Verificação: duas execuções seguidas em banco local, com contagem igual; teste do CA-01/03/04.

## Etapa 3 — Guarda de produção do seed (CA-09)
Objetivo: o seed local nunca escreve no remoto por acidente (R8).
- Antes de qualquer escrita, o seed olha o host de `DATABASE_URL` e o de `SUPABASE_URL`; se algum
  não for `127.0.0.1` ou `localhost`, exige `SEED_CONFIRMO_PRODUCAO=sim` (nome proposto, Q13) e
  imprime só o host, nunca a URL completa.
- O agente nunca define essa variável. Verificação: execução com host remoto falso e chaves
  falsas sai com erro, sem tocar em banco (CA-09).

## Etapa 4 — Seed do usuário obrigatório e da conta de teste (CA-05, CA-06, CA-07, CA-11)
Objetivo: criar a conta no Auth, o espelho e a membership, sem empréstimo.
- Cliente do Auth com `fetch` nativo (nenhuma biblioteca nova): `GET /auth/v1/admin/users`
  paginado e filtrado por e-mail para ver se existe (alternativa: consulta a `auth.users` pelo
  Prisma; a primeira evita depender de permissão no schema `auth`) e `POST /auth/v1/admin/users`
  com `email_confirm: true`. Resposta 422 de e-mail já existente conta como "existe".
- O trigger `on_auth_user_changed` (migration `init`) cria a linha em `public.users`; o seed
  confere a linha antes de criar a membership e falha com mensagem clara se não aparecer.
- Membership por `userId_tenantId`, papel `COLABORADOR`. Nenhuma escrita em `loans`.
- Senha vem de `SEED_PROFESSOR_PASSWORD` (conta de teste: `SEED_TESTE_PASSWORD`); mensagens de
  erro e logs passam por uma função que remove valores de segredo, como a `redigir` dos scripts
  de imagem. Conta de teste só se as duas variáveis `SEED_TESTE_*` existirem.
- Verificação: duas execuções com contagens iguais; login real no Auth local com a senha da
  variável de teste; `GET /v1/me` com o token devolve o e-mail.

## Etapa 5 — Teste automatizado local (CA-01 a CA-11)
Objetivo: cada CA "teste local" tem caso com o `CA-xx` no nome (rules/tests.md).
- Estratégia depende de Q6. Proposta: Jest contra `supabase start`, com um tenant isolado por
  execução e limpeza no fim. `back/package.json` hoje tem `rootDir: src`; incluir `prisma/` exige
  mudar a configuração do Jest, e a mudança é mostrada antes de aplicada.
- Os testes nunca falam com o remoto (rules/tests.md, item 7).
- Verificação: `cd back && npm run test` com a última linha colada; CA sem teste é dito em voz alta.

## Etapa 6 — Envs e segredos (CA-08)
- `back/.env.example`: acrescentar `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD`, sem valor.
  `rules/secrets.md`: inventário com os dois nomes e quem lê cada um. Os três lugares da regra:
  `.env` local, `.env.example`, painel da Vercel; os scripts não rodam na Vercel, então o painel
  não muda, e isso é dito na resposta.
- Teste do CA-08: verificação sobre `git ls-files` e busca de padrões nos três repositórios.

## Etapa 7 — Para o operador (R6)
- Modelo de `docs/specs/002-dados-iniciais/evidencias-producao.md` com a ordem: `migrate deploy`,
  `enviar` ×2, `db:seed` ×2, e, para cada passo, o que colar (contagens, status HTTP, sem segredo).
- O agente **não** executa nada disso. Quem cola a evidência é o operador.

## Etapa 8 — Renumeração (CA-12)
- Atualizar as referências a "002-catalogo" listadas no Vínculo, sem reescrever handoff antigo.
  Atualizar também `docs/modelagem-banco.md` §4.4 e §9 e a linha do ADR-001 apenas por errata do
  operador (Etapa 0).

## Etapa 9 — Verificação da spec
- Depois das tarefas, delegar ao `verificador-spec` (rules/spec-flow.md) com um intervalo de
  commits por repositório (raiz, back; front `nenhum`). Só vira `Status: PRONTA` com
  `Veredito: PRONTA`. Os CA de produção só ficam provados quando o operador cola a evidência.
