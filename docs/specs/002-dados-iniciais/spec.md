# 002 — Dados iniciais

Status: PRONTA

## Objetivo
Deixar o banco e o Storage com os dados de partida do EMPREST.AI: os 12 equipamentos do
tenant `suporte_ti`, cada um com a sua foto (800x600) aberta por URL pública e o crédito do autor,
e o usuário obrigatório `marcelo.grilo@institutojef.org.br`, sem nenhum empréstimo. Tudo
repetível: rodar de novo não duplica nada. Os dados iniciais vêm de um **script separado**
(`back/prisma/dados-iniciais.ts`, `npm run db:dados-iniciais`); o seed existente não muda. Não há
tela nem endpoint novo nesta fatia.

## Vínculo
- PRD item 2 ("Catálogo de equipamentos com a situação de cada um") e a regra "Equipamento em
  manutenção não aparece como disponível": esta fatia só entrega os dados que o catálogo vai
  mostrar. PRD item 1 ("Login"): o usuário obrigatório precisa conseguir entrar.
- PRD "O que NÃO entra nesta versão": importação da planilha atual (continua fora).
- layout.md: **não se aplica** (sem tela). O `layout.md` não define imagem de equipamento (Q9).
- docs/modelagem-banco.md §4.4 (`equipment`), §4.2 (`users`, espelho do Auth), §4.3
  (`memberships`) e §9 (seed). **Sem conflito com §9**: o seed continua só criando o tenant (C2).
- ADR-001 §5 (Prisma Migrate dono do schema; `DIRECT_URL` na migration), §7 (Supabase Auth,
  cadastro fechado, `service_role` só no backend), §8 (Jest e Testcontainers com Postgres real),
  §9 (env validado) e a linha "Seed idempotente" da tabela de decisões (continua valendo).
- ADR-004 (sharp só em script de preparo) e `docs/evidencias/orientacao-pixabay.md`.
- rules/restrictions.md ("Produção": o agente nunca escreve em produção), rules/migration.md,
  rules/secrets.md, rules/spec-flow.md, rules/tests.md.
- **Renumeração.** Esta spec é a **002** (dados iniciais). A fatia que o PRD e o `AGENTS.md`
  chamavam de `002-catalogo` (catálogo e pedido de empréstimo) passa a ser a **003**. O nome da
  pasta da 003 é `003-catalogo` (decidido, Q7). Referências que ainda dizem
  "002-catalogo" ou "002" no sentido de catálogo: `AGENTS.md` (linhas sobre a próxima spec),
  `rules/spec-flow.md` (exemplo de numeração), `rules/tests.md` ("Tarefa 9 da 002", "Q4 da
  002"), `rules/qualidade-codigo.md` ("Tarefa 15 da fatia 002"), `docs/entrega-notas.md` e o
  handoff `2026-11-09-etapa1-verificador-hook.md` (histórico, não se reescreve). A atualização é
  a tarefa T12.

## Conflitos registrados e decididos
- **C1 — lista de equipamentos em manutenção.** O enunciado manda "usar exatamente esta lista", e
  ela marca **3** em manutenção (TI-0004, TI-0007, TI-0010). O briefing cita só **2**.
  **Decidido pelo operador:** valem os 3 da lista. *Motivo:* o enunciado manda usar exatamente a
  lista (R1).
- **C2 — o seed fazia mais do que o documentado.** A `docs/modelagem-banco.md` §9 diz que o seed
  só cria o tenant ("Nada além disso") e a tabela do ADR-001 diz "cria o tenant `suporte_ti`".
  **Decidido pelo operador:** o seed existente (`back/prisma/seed.ts`) **não é alterado** e
  continua só criando o tenant; os dados iniciais ficam em script separado,
  `back/prisma/dados-iniciais.ts`, com o npm script `db:dados-iniciais`. *Motivo:* elimina o
  conflito com a §9 e com o ADR-001 sem reescrever documento aprovado (R9).
- **C3 — usuário criado fora do convite.** O ADR-001 §7 diz "cadastro fechado, somente por convite
  de administrador". **Decidido pelo operador:** a conta do professor é criada fora do fluxo de
  convite, como **exceção desta prática**; o fluxo de convite **continua não decidido** (Q10).
  *Motivo:* o professor precisa entrar, e o convite não está definido.

## Regras
Cada regra traz o motivo. Onde o motivo vem de um documento, ele é citado.

**R1 — Os 12 equipamentos.** O script de dados iniciais grava no tenant `suporte_ti` os 12 itens
de `back/scripts/imagens-equipamentos/equipamentos.json`, com `nome` → `name`, `patrimonio`,
`categoria` → `category` (`notebook` → `NOTEBOOK`, `monitor` → `MONITOR`, `cabo` → `CABO`,
`camera` → `CAMERA`) e `situacao` → `status` (`disponivel` → `DISPONIVEL`, `manutencao` →
`MANUTENCAO`). Em manutenção: TI-0004, TI-0007 e TI-0010. Disponíveis: os outros 9. Nenhum
empréstimo é criado e nenhum item nasce `EMPRESTADO`. Os campos `busca` e `buscaOriginal` são
ignorados (são da skill de imagem). Valor de categoria ou situação desconhecido derruba o script.
*Motivo:* o enunciado manda usar exatamente essa lista (C1); o PRD diz que item em manutenção
não aparece como disponível; sem empréstimo, nenhum item pode estar emprestado.

**R2 — Imagem na tabela `equipment`.** Nova migration em `Equipment` com cinco colunas:
`imageUrl`, `imagePixabayId`, `imageAuthor`, `imagePageUrl` e `imageLicense` (colunas
`image_url`, `image_pixabay_id`, `image_author`, `image_page_url`, `image_license`) e
**unique por tenant em `(tenantId, imagePixabayId)`** (`@@unique([tenantId, imagePixabayId])`).
Tipos propostos: texto para as quatro de texto, inteiro para `imagePixabayId`; todas anuláveis,
porque a tabela já pode ter linhas sem foto. A migration roda **só no banco local** pelo agente;
no remoto quem roda `migrate deploy` é o operador. Não cria tabela, então não nasce policy nova:
o RLS `deny_all` da `init` continua valendo para `equipment` (rules/migration.md, passo 3, exige
policy para tabela nova; aqui não há tabela nova).
*Motivo:* guardar de onde veio cada foto e a licença a que ela obedece. O `unique` é por tenant
porque o projeto é multi-tenant por coluna e o unique que já existe na tabela também é por tenant
(`(tenantId, patrimonio)`, ADR-001 e modelagem): a duplicidade que importa é a de dentro do tenant,
e a mesma foto do Pixabay pode servir a outro tenant. Como `imagePixabayId` é anulável, o Postgres
não colide itens sem foto.

**R3 — Créditos e URL da imagem.** A fonte dos créditos é
`back/scripts/imagens-equipamentos/creditos.json` (versionado, sem segredo, gerado por
`npm run imagens:creditos`; commit `7310f8e`). Para cada equipamento o script lê dele
`pixabayId`, `autor`, `pageURL` e `licenca` e grava em `imagePixabayId`, `imageAuthor`,
`imagePageUrl` e `imageLicense`. A `imageUrl` é montada pelo script como
`<SUPABASE_URL>/storage/v1/object/public/imagens/equipamentos/<patrimonio>.jpg`. O bucket é
**`imagens`, público**, e o caminho é fixo, `equipamentos/<patrimonio>.jpg` (**nome do bucket:
decisão do operador**). Falta de equipamento no `creditos.json` derruba o script. O script não
verifica se o arquivo existe no Storage (isso é o CA-02).
*Motivo:* o `creditos.json` é versionado, então o script não depende da pasta de preparo, que o
git ignora; o bucket é público porque a URL precisa abrir sem login. Consequência: a `imageUrl`
gravada depende do `SUPABASE_URL` do ambiente em que o script rodou (local ≠ remoto).

**R4 — Usuário obrigatório.** `marcelo.grilo@institutojef.org.br` é criado pelo script pela **API
admin do Auth** (`service_role`, só no backend), **somente se ainda não existir**. A senha vem da
variável `SEED_PROFESSOR_PASSWORD`, definida no `back/.env` (ignorado pelo git) ou no ambiente do
operador: nunca em código, nunca em arquivo versionado, nunca em log. O usuário tem `membership`
`COLABORADOR` no tenant `suporte_ti` e **zero empréstimos**. Se o usuário já existe, o script não
altera a senha. Uma **conta de teste, separada e opcional**, é criada com a mesma lógica quando
`SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` existem; sem elas, o script não cria nada e não falha
por isso. Sem `SEED_PROFESSOR_PASSWORD`, o script falha antes de tocar no Auth (Q8).
*Motivo:* cadastro fechado (ADR-001 §7): conta só nasce por administrador (exceção C3); a
`service_role` ignora RLS e por isso só roda no backend e no terminal do operador
(rules/secrets.md). **"Senha no arquivo"**, na Seção 1 do `docs/entrega-notas.md`, significa o
`back/.env`, ignorado pelo git; portanto a regra acima vale e não há conflito com o CA-08.

**R5 — Idempotência e o que o script faz com linha existente.** Equipamento: upsert por
`(tenantId, patrimonio)` (o `@@unique` que já existe). Usuário: por e-mail. Membership: por
`(userId, tenantId)`. Rodar duas vezes, ou cem, deixa as mesmas contagens: 12 equipamentos, 1
usuário obrigatório, 1 membership dele, 0 empréstimos. **Se o equipamento já existe, o script
atualiza `name`, `category` e os campos de imagem (`imageUrl`, `imagePixabayId`, `imageAuthor`,
`imagePageUrl`, `imageLicense`), mas NUNCA o `status`.** O `status` só é gravado quando a linha é
criada.
*Motivo:* "seed que só funciona em banco vazio não serve para ambiente de teste que roda várias
vezes" (ADR-001); e o `status` passa a mudar com os empréstimos da fatia 003: reescrevê-lo
devolveria um item `EMPRESTADO` para `DISPONIVEL` em produção.

**R6 — Produção é do operador.** O agente **não** executa `migrate deploy`, `enviar` nem o script
de dados iniciais contra o Supabase remoto (rules/restrictions.md, "Produção"). O agente prepara
e descreve; o operador roda, na ordem:
1. `cd back && npx prisma migrate deploy` (com a `DIRECT_URL` do remoto no ambiente do operador);
2. `npm run db:seed` (só cria o tenant `suporte_ti`, idempotente; necessário se o tenant ainda não
   existir no remoto, porque o script de dados iniciais **exige** o tenant e falha se faltar, Q16);
3. `npm run imagens:enviar`, **duas vezes** (com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e
   `ENVIAR_CONFIRMO_PRODUCAO=sim` no terminal dele);
4. `npm run db:dados-iniciais`, **duas vezes** (com as variáveis do remoto no ambiente dele e
   `DADOS_INICIAIS_CONFIRMO_PRODUCAO=sim`, Q13).
A ordem importa: a migration cria as colunas, o seed cria o tenant, o `enviar` cria o bucket e
sobe as fotos, o script grava as URLs e o usuário. Cada passo repetido prova a idempotência em
produção. O operador cola contagens e saídas (sem valores de segredo) em
`docs/specs/002-dados-iniciais/evidencias-producao.md`, que esta spec prevê.
*Motivo:* a regra de produção do projeto; `service_role` e senhas ficam só com o operador.

**R7 — Fora de escopo** (do briefing): tela de catálogo, cadastro de equipamento pela
interface e importação da planilha. Ver a seção "Fora de escopo".

**R8 — O script local nunca escreve no remoto por acidente.** O `back/.env` aponta para o Supabase
remoto, e o cliente Prisma o carrega sozinho. Por isso o script de dados iniciais recusa host que
não seja local sem uma confirmação explícita, como já faz o `enviar`
(`ENVIAR_CONFIRMO_PRODUCAO=sim`). A variável é `DADOS_INICIAIS_CONFIRMO_PRODUCAO=sim` (Q13, CA-09).
*Motivo:* sem isso, rodar o script "de teste" na máquina escreveria em produção.

**R9 — O seed existente não muda.** `back/prisma/seed.ts` continua exatamente como está (cria só
o tenant `suporte_ti`, idempotente) e `db:seed` não ganha nenhum passo novo (CA-14).
*Motivo:* decisão C2: não contrariar a modelagem §9 nem o ADR-001.

**R10 — Como se testa.** O script é testado com **Jest e Testcontainers** (Postgres descartável),
como manda o ADR-001 §8. O **cliente do Auth é injetado** no script e, nos testes, **simulado**; o
simulado reproduz o efeito do trigger do Auth, inserindo a linha em `public.users`. Os testes
provam a lógica de banco (equipamentos, créditos, idempotência, `status` preservado, membership,
zero empréstimos, guarda de produção, migration). O **Auth real** e o **Storage real** não são
testados localmente: o Auth real é provado em produção pelo **login do professor**, e o Storage
(abrir as URLs, `enviar` duas vezes) pela evidência de produção. `testcontainers` e
`@testcontainers/postgresql` entram no `back` como devDependencies em versão fixa `12.0.1`
(instaladas em `761867f` como 12.0.4 e trocadas em `aea2f9f`: ver "Dívida de processo").
*Motivo:* o Postgres do Testcontainers não tem o schema `auth` nem a API admin do Auth; injetar o
cliente permite provar a lógica sem depender de Auth, e a prova do que só o ambiente real tem fica
em produção.

## Critérios de aceitação
Cada CA diz onde está a prova: **teste local** (automatizado, Jest com Testcontainers; o agente
roda, e precisa de Docker) ou **produção** (evidência colada pelo operador em
`evidencias-producao.md`). O Auth e o Storage reais só têm prova de produção.

- CA-01: No tenant `suporte_ti` existem exatamente 12 equipamentos, com patrimônios `TI-0001` a
  `TI-0012`, nomes e categorias iguais aos de `equipamentos.json`; `MANUTENCAO` em TI-0004,
  TI-0007 e TI-0010, `DISPONIVEL` nos outros 9; nenhum `EMPRESTADO`.
  Prova: teste local + produção (contagem por situação).
- CA-02: Cada equipamento tem `imageUrl` no formato da R3, e a URL aberta **sem login** (sem
  cabeçalho de autorização) responde HTTP 200, `image/jpeg` e imagem de **800x600**.
  Prova: teste local (montagem da URL; os arquivos de origem já têm as dimensões conferidas pelo
  `npm run imagens:validar`) + produção (status e dimensões das 12 URLs, sem chave).
- CA-03: As 12 linhas têm `imagePixabayId` distinto, e `imageAuthor`, `imagePageUrl` e
  `imageLicense` iguais ao `creditos.json`; gravar o mesmo `imagePixabayId` em outro equipamento
  **do mesmo tenant** é rejeitado pelo banco, e em outro tenant é aceito.
  Prova: teste local.
- CA-04: Rodar o script duas vezes deixa 12 equipamentos, 1 usuário obrigatório e 1 membership
  dele; nada duplica. Rodar o `enviar` duas vezes deixa 12 objetos em `imagens/equipamentos/`.
  Prova: teste local (duas execuções do script, mesmas contagens) + produção (duas execuções de
  `enviar` e duas do script).
- CA-05: O usuário `marcelo.grilo@institutojef.org.br` existe no Auth, tem linha em
  `public.users` e `membership` `COLABORADOR` em `suporte_ti`.
  Prova: teste local (cliente do Auth simulado: membership `COLABORADOR`, uma só) + produção (o
  usuário existe no Auth real).
- CA-06: Esse usuário entra com e-mail e a senha de `SEED_PROFESSOR_PASSWORD`, e `GET /v1/me` com
  o token dele responde 200 com o e-mail dele.
  Prova: **só produção** (login pelo operador, com o resultado colado **sem** a senha nem o
  token). Não há prova local: o Auth é simulado nos testes.
- CA-07: O tenant `suporte_ti` tem **zero** empréstimos, e o usuário obrigatório tem zero.
  Prova: teste local + produção (contagem em `loans`).
- CA-08: Nenhum segredo no git: `.env*` fora de `.env.example` não está versionado; os
  `.env.example` trazem `SEED_PROFESSOR_PASSWORD`, `SEED_TESTE_EMAIL`, `SEED_TESTE_PASSWORD` e
  `SUPABASE_SERVICE_ROLE_KEY` **sem valor**; nenhum arquivo versionado dos três repositórios
  contém a senha do script, chave `service_role` nem JWT.
  Prova: teste local (verificação sobre `git ls-files` e busca de padrões nos três repositórios).
- CA-09: O script apontado para um host remoto, sem a confirmação de produção, sai com erro e não
  escreve nada.
  Prova: teste local (execução com URL remota falsa e chaves falsas).
- CA-10: As migrations aplicam do zero num Postgres descartável e a tabela `equipment` ganha as
  cinco colunas; `(tenantId, imagePixabayId)` repetido é recusado. O teste não exercita a FK e o
  trigger do Auth (a `init` os cria só se o schema `auth` existir).
  Prova: teste local (Testcontainers; como aplicar as migrations: Q17).
- CA-11: Com `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` definidos, a conta de teste existe com
  membership e zero empréstimos; sem elas, nenhuma conta de teste é criada e o script termina sem
  erro.
  Prova: teste local (duas execuções, com e sem as variáveis; Auth simulado).
- CA-12: Após a renumeração, as referências a "002-catalogo" nos arquivos listados no Vínculo
  apontam para a 003 (ou estão listadas como histórico que não se reescreve).
  Prova: teste local (busca de texto) na tarefa T12.
- CA-13: Se um equipamento já existe e seu `status` foi mudado (por exemplo para `EMPRESTADO`),
  rodar o script de novo **não altera o `status`**, e restaura `name`, `category` e os campos de
  imagem quando divergem.
  Prova: teste local.
- CA-14: `back/prisma/seed.ts` e o npm script `db:seed` permanecem como estão (o seed continua
  criando só o tenant `suporte_ti`).
  Prova: teste local (o arquivo é igual ao do commit `9e151db` e `db:seed` não mudou).

## Contrato afetado
- **Banco:** `equipment` ganha 5 colunas e 1 unique composto `(tenant_id, image_pixabay_id)`
  (migration nova; sem tabela nova, sem policy nova). `docs/modelagem-banco.md` §4.4 precisa
  refletir isso depois; §9 não muda.
- **Storage:** bucket público `imagens`, objetos `equipamentos/<patrimonio>.jpg`.
- **npm scripts (`back/package.json`):** novo `db:dados-iniciais`; `db:seed` não muda.
  devDependencies: `testcontainers` e `@testcontainers/postgresql`, `12.0.1`.
- **Envs (nomes):** `SEED_PROFESSOR_PASSWORD` (já no `.env.example`), `SEED_TESTE_EMAIL` e
  `SEED_TESTE_PASSWORD` (novos), `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` lidos pelo script,
  e `DADOS_INICIAIS_CONFIRMO_PRODUCAO` (Q13). Inventário em `rules/secrets.md`.
- **HTTP:** nenhum endpoint novo ou alterado; sem mudança de OpenAPI.

## Dívida de processo
- Spec escrita **antes** do código, como manda o `rules/spec-flow.md`; nenhuma linha de código da
  002 existe. A única mudança de código desta etapa é a dependência de teste (commit `761867f`).
- Os CA marcados "teste local" precisam de **Docker** rodando (Testcontainers). Hoje o Docker
  Desktop está instalado mas parado nesta máquina. O Supabase CLI deixou de ser necessário.
- `testcontainers` ficou em **12.0.1** e não na última (12.2.1). A 12.1.0 em diante exige Node >=
  22.22 e a 12.0.2 em diante traz o `undici` 8, que exige Node >= 22.19; a máquina tem 22.13.1.
  Foi preciso descer até a 12.0.1 (o `undici` 7 roda no Node 22.13). Atualizar o Node permite
  subir a versão. Erro registrado: a primeira escolha (12.0.4) só olhou o `engines` do pacote
  principal e não o da dependência transitiva.
- O `npm run build` (`tsc -p tsconfig.build.json`) **não compila `prisma/`** (o `tsconfig.json` só
  inclui `src` e `api`): o código do script é tipado pelo `ts-node` e pelo `ts-jest` na execução.
- O `migrate reset` local do `rules/checks.md` (passo 2) **não foi executado**: o Prisma recusa o
  comando quando o invoca um agente de IA sem consentimento explícito do usuário para a ação
  destrutiva. O `migrate dev --create-only` também falhou (`P4002`, FK de `public.users` para o
  schema `auth`). O SQL da migration veio de `prisma migrate diff` e a prova de "aplica do zero"
  é o teste do CA-10 (Postgres descartável).
- Prova de produção do **Auth real** e do **Storage real** depende do operador (CA-02, CA-04,
  CA-05, CA-06).
- As fotos finais estão em `back/.preparo-imagens/`, que o git ignora: o `enviar` só roda na
  máquina onde elas estão. Regerar exige `preparar` com `--escolher` dos ids do `creditos.json`.
- A `imageUrl` gravada é específica do ambiente (local ≠ remoto); mudar o `SUPABASE_URL` exige
  rodar o script de novo (o que a R5 permite: atualiza a imagem e nunca o `status`).
- "Limite 5" e "14 dias úteis" da Seção 1 do `docs/entrega-notas.md` seguem para a 003 (Q15).

## Fora de escopo / não decidido
Fora de escopo (briefing): tela de catálogo; cadastro de equipamento pela interface; importação
da planilha atual; empréstimo de qualquer item; qualquer endpoint novo.

Decididas pelo operador e já incorporadas acima: C1, C2, C3, Q1 (atualiza nome, categoria e
imagem, nunca o status), Q2 (unique por tenant), Q6 (Jest e Testcontainers com Auth simulado) e
Q14 ("senha no arquivo" é o `back/.env`).

**Decididas pelo operador em 2026-11-09: aprovou as propostas conservadoras** de Q3, Q4, Q5, Q7,
Q8, Q9, Q10, Q12, Q13, Q15, Q16 e Q17. Resposta adotada em cada uma:
- **Q3 — Nome do usuário obrigatório.** O script **não envia `name`** nos metadados do Auth; o
  `public.users.name` fica com o e-mail (fallback do trigger da migration `init`).
- **Q4 — Papel da conta de teste.** `COLABORADOR`, a mesma lógica da conta do professor.
- **Q5 — Observação dos itens em manutenção.** `observacao` fica vazia para TI-0004, TI-0007 e
  TI-0010 (a lista não traz motivo nem previsão).
- **Q7 — Nome da pasta da 003.** `003-catalogo`.
- **Q8 — Sem `SEED_PROFESSOR_PASSWORD`.** O script **falha antes de tocar no Auth**, com mensagem
  que cita o nome da variável (nunca o valor). Não pula o usuário em silêncio.
- **Q9 — Imagem e crédito na tela.** Nada é implementado na 002; o `layout.md` segue sem definir
  foto nem crédito. O `creditos.json` e as colunas guardam o que a 003 vai precisar.
- **Q10 — Convite de administrador.** Fora da 002; segue não decidido.
- **Q12 — Troca de senha.** O script **não altera** a senha de usuário que já existe.
- **Q13 — Variável de confirmação de produção.** `DADOS_INICIAIS_CONFIRMO_PRODUCAO=sim`, no
  padrão do `ENVIAR_CONFIRMO_PRODUCAO`. O agente nunca a define.
- **Q15 — "Limite 5" e "14 dias úteis".** Divergem do PRD (3 itens; 14 dias); **seguem para a
  003**, fora desta fatia.
- **Q16 — Tenant ausente.** O script **exige que o tenant `suporte_ti` já exista** e, se faltar,
  falha com mensagem dizendo para rodar `db:seed` antes. Não duplica a criação do tenant.
- **Q17 — Migrations no contêiner de teste.** Copiar os `migration.sql` para o contêiner e
  executá-los em ordem com `psql -f` por `container.exec`: sem dependência nova e sem usar o
  comando que o `permissions.deny` nega ao agente.

Ainda não decidido: nada que trave código. Fica sem decisão só o que está declarado "fora de
escopo" ou "segue para a 003" (Q9, Q10, Q15).

## Como sei que funcionou
Com o Docker ativo: `cd back && npm run test` roda os casos dos CA "teste local" contra Postgres
descartável (Testcontainers) e termina verde. No remoto, o operador repete a sequência da R6 e
cola a evidência, inclusive o login do professor (CA-06).
