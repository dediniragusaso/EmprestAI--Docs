# Plano — 002-dados-iniciais
Restringido por ADR-001 §5 (Prisma Migrate dono do schema; `DIRECT_URL` na migration), §7
(Supabase Auth, cadastro fechado, `service_role` só no backend), §8 (Jest e Testcontainers com
Postgres real) e §9 (env validado), por ADR-004 (sharp só em script de preparo), por
`docs/modelagem-banco.md` §4.4 e §9 (o §9 não muda), e por `rules/migration.md`,
`rules/secrets.md`, `rules/restrictions.md` ("Produção") e `rules/tests.md`.

O operador aprovou a spec e as propostas conservadoras das perguntas abertas (Q3, Q4, Q5, Q7,
Q8, Q9, Q10, Q12, Q13, Q15, Q16 e Q17); as respostas adotadas estão na seção "Fora de escopo /
não decidido" da spec e orientam as etapas abaixo. Todo comando do agente roda
contra Postgres descartável (Testcontainers) ou banco local, com `DATABASE_URL`, `DIRECT_URL`,
`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` definidos no próprio comando; o ambiente do processo
vence o `back/.env`, que aponta para o remoto.

## Etapa 0 — Decisões (sem código)
Objetivo: o operador aprova a spec e decide as perguntas abertas.
Saída: respostas anotadas na seção "Fora de escopo / não decidido" da spec. Verificação: nenhuma
pergunta que trave código fica sem resposta.

## Etapa 1 — Dependência de teste (feita)
Testcontainers como devDependency do `back`, versão fixa `12.0.4` (`testcontainers` e
`@testcontainers/postgresql`): commit `761867f`. A 12.0.4 é a mais nova sem exigência de Node
>= 22.22. Verificação feita: 111 pacotes novos no lockfile, nenhum removido ou alterado;
`npm run build` exit 0; `npm run test` 4 testes verdes.

## Etapa 2 — Migration (CA-10, CA-03)
Objetivo: `equipment` ganha as colunas de imagem e o unique por tenant.
- `back/prisma/schema.prisma`, em `Equipment`: `imageUrl String? @map("image_url") @db.Text`,
  `imagePixabayId Int? @map("image_pixabay_id")`, `imageAuthor String? @map("image_author")
  @db.Text`, `imagePageUrl String? @map("image_page_url") @db.Text`, `imageLicense String?
  @map("image_license") @db.Text` e `@@unique([tenantId, imagePixabayId])`.
- Migration nova em `back/prisma/migrations/<timestamp>_equipment_image/`, gerada com
  `npx prisma migrate dev --name equipment_image --create-only` e só então aplicada no banco
  **local**. SQL esperado: `ALTER TABLE "equipment" ADD COLUMN ...` (5 colunas nulas) e
  `CREATE UNIQUE INDEX`. Sem tabela nova, sem policy nova, sem mexer no RLS da `init`. Linhas
  existentes ficam com as colunas nulas, sem passo de preenchimento (rules/migration.md, passo 4).
- Verificação: `prisma migrate reset` local sobe do zero (`rules/checks.md`, passo 2) e o teste do
  CA-10 sobe um Postgres descartável (Testcontainers, imagem `postgres:17`, a mesma versão
  maior de `supabase/config.toml`) e confere colunas e unique. A migration **não** é aplicada no
  remoto pelo agente (R6).

## Etapa 3 — Script de dados iniciais: equipamentos (CA-01, CA-02, CA-03, CA-04, CA-13)
Objetivo: gravar os 12 itens com créditos e `imageUrl`, repetível.
- Arquivos novos: `back/prisma/dados-iniciais.ts` (ponto de entrada, sem lógica de negócio) e
  módulos ao lado (`back/prisma/dados-iniciais/equipamentos.ts`, `.../auth.ts`, `.../guarda.ts`).
  `back/prisma/seed.ts` **não é tocado** (R9, CA-14).
- Npm script novo em `back/package.json`: `db:dados-iniciais`, carregando o `.env` explicitamente
  como os scripts de imagem (variável já definida no ambiente vence o arquivo).
- Leitura de `equipamentos.json` e `creditos.json` com `fs` e validação com Zod (já é
  dependência): categoria e situação por tabela fechada; equipamento sem crédito derruba o script.
- `imageUrl` = `${SUPABASE_URL}/storage/v1/object/public/imagens/equipamentos/<patrimonio>.jpg`,
  com `SUPABASE_URL` sem barra final.
- Upsert por `tenantId_patrimonio`. **`create`:** todos os campos, inclusive `status`. **`update`:**
  só `name`, `category` e os cinco campos de imagem; `status` fica de fora (R5, CA-13).
- Tenant ausente (Q16, decidido): o script **exige** o tenant e falha com mensagem dizendo para
  rodar `db:seed` antes; não cria o tenant.
- Verificação: duas execuções contra Postgres descartável, contagens iguais; teste muda o
  `status` de um item para `EMPRESTADO` e confere que a segunda execução o preserva.

## Etapa 4 — Guarda de produção (CA-09)
Objetivo: o script nunca escreve no remoto por acidente (R8).
- Antes de qualquer escrita, olha o host de `DATABASE_URL` e o de `SUPABASE_URL`; se algum não for
  `127.0.0.1` ou `localhost`, exige `DADOS_INICIAIS_CONFIRMO_PRODUCAO=sim` (Q13, decidido) e
  imprime só o host, nunca a URL completa. O Postgres do Testcontainers é `localhost`, então os testes passam pela
  guarda sem desligá-la.
- O agente nunca define a variável de confirmação. Verificação: execução com host remoto falso e
  chaves falsas sai com erro sem tocar em banco.

## Etapa 5 — Usuário obrigatório e conta de teste (CA-05, CA-07, CA-11; CA-06 só em produção)
Objetivo: criar a conta no Auth, o espelho e a membership, sem empréstimo.
- **Cliente do Auth injetado.** O script recebe uma interface pequena (`existePorEmail`,
  `criar`). A implementação real usa `fetch` nativo (nenhuma biblioteca nova):
  `GET /auth/v1/admin/users` paginado e filtrado por e-mail, e `POST /auth/v1/admin/users` com
  `email_confirm: true`; resposta 422 de e-mail existente conta como "existe". A simulada, usada
  nos testes, guarda os usuários em memória e **insere a linha em `public.users`**, que é o efeito
  do trigger `on_auth_user_changed` (a `init` só o cria quando o schema `auth` existe, o que não é
  o caso no Postgres descartável).
- Em produção, o trigger cria a linha em `public.users`; o script confere a linha antes de criar a
  membership e falha com mensagem clara se ela não aparecer.
- Membership por `userId_tenantId`, papel `COLABORADOR`. Nenhuma escrita em `loans`.
- Senhas vêm de `SEED_PROFESSOR_PASSWORD` e `SEED_TESTE_PASSWORD`; mensagens de erro e logs passam
  por uma função que remove valores de segredo, como a `redigir` dos scripts de imagem. A conta de
  teste só nasce se as duas variáveis `SEED_TESTE_*` existirem.
- Verificação: duas execuções com contagens iguais, com e sem as variáveis de teste. O login real
  é o CA-06, provado em produção pelo operador.

## Etapa 6 — Testes automatizados locais (CA-01, 02, 03, 04, 05, 07, 09, 10, 11, 13, 14)
Objetivo: cada CA "teste local" tem caso com o `CA-xx` no nome (rules/tests.md).
- Jest com `testcontainers` e `@testcontainers/postgresql` (Postgres 17 descartável), um contêiner
  por suíte e limpeza no fim. Os testes nunca falam com o remoto.
- O `back/package.json` hoje tem `rootDir: src` e `testRegex .*\.spec\.ts`; testar `prisma/`
  exige mudar a configuração do Jest (por exemplo `roots`), e a mudança é mostrada antes de
  aplicada.
- Como aplicar as migrations no contêiner (Q17, decidido): copiar os `migration.sql` para o
  contêiner e executá-los em ordem com `psql -f` por `container.exec`, sem dependência nova e sem
  usar o comando que o harness nega.
- Verificação: `cd back && npm run test` com a última linha colada. Precisa de Docker rodando.
  CA sem teste é dito em voz alta (CA-06 só em produção; CA-02 e CA-04 só em parte).

## Etapa 7 — Envs e segredos (CA-08)
- `back/.env.example`: acrescentar `SEED_TESTE_EMAIL`, `SEED_TESTE_PASSWORD` e
  `DADOS_INICIAIS_CONFIRMO_PRODUCAO` (Q13), sem valor. `rules/secrets.md`: inventário com os nomes novos e quem
  lê cada um. Os três lugares da regra: `.env` local, `.env.example`, painel da Vercel; os scripts
  não rodam na Vercel, então o painel não muda, e isso é dito na resposta.
- Teste do CA-08: verificação sobre `git ls-files` e busca de padrões nos três repositórios.

## Etapa 8 — Para o operador (R6)
- Modelo de `docs/specs/002-dados-iniciais/evidencias-producao.md` com a ordem: `migrate deploy`,
  `db:seed` (se o tenant faltar), `enviar` ×2, `db:dados-iniciais` ×2, o login do professor e
  `GET /v1/me`, e, para cada passo, o que colar (contagens, status HTTP, **sem** segredo, senha
  nem token).
- O agente **não** executa nada disso. Quem cola a evidência é o operador.

## Etapa 9 — Renumeração (CA-12)
- Atualizar as referências a "002-catalogo" listadas no Vínculo, sem reescrever handoff antigo.
  `docs/modelagem-banco.md` §9 **não** muda (C2). §4.4 ganha as colunas novas junto da migration.

## Etapa 10 — Verificação da spec
- Depois das tarefas, delegar ao `verificador-spec` (rules/spec-flow.md) com um intervalo de
  commits por repositório (raiz e back; front `nenhum`). Só vira `Status: PRONTA` com
  `Veredito: PRONTA`. Os CA de produção só ficam provados quando o operador cola a evidência.
