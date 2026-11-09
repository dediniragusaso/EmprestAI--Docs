# 002 — Dados iniciais

Status: EM ABERTO (aguardando aprovação do operador; nenhum código escrito)

## Objetivo
Deixar o banco e o Storage com os dados de partida do EMPREST.AI: os 12 equipamentos do
tenant `suporte_ti`, cada um com a sua foto (800x600) aberta por URL pública e o crédito do autor,
e o usuário obrigatório `marcelo.grilo@institutojef.org.br`, sem nenhum empréstimo. Tudo
repetível: rodar de novo não duplica nada. Não há tela nem endpoint novo nesta fatia.

## Vínculo
- PRD item 2 ("Catálogo de equipamentos com a situação de cada um") e a regra "Equipamento em
  manutenção não aparece como disponível": esta fatia só entrega os dados que o catálogo vai
  mostrar. PRD item 1 ("Login"): o usuário obrigatório precisa conseguir entrar.
- PRD "O que NÃO entra nesta versão": importação da planilha atual (continua fora).
- layout.md: **não se aplica** (sem tela). O `layout.md` não define imagem de equipamento (ver Q9).
- docs/modelagem-banco.md §4.4 (`equipment`), §4.2 (`users`, espelho do Auth), §4.3
  (`memberships`), §9 (seed). **Conflito com §9**: ver "Conflitos registrados".
- ADR-001 §5 (Prisma Migrate dono do schema; runtime pelo pooler, migration pela conexão
  direta), §7 (Supabase Auth, cadastro fechado, `service_role` só no backend), §8 (testes), §9
  (env validado) e a linha "Seed idempotente" da tabela de decisões.
- ADR-004 (sharp nos scripts de imagem) e `docs/evidencias/orientacao-pixabay.md`.
- rules/restrictions.md ("Produção": o agente nunca escreve em produção), rules/migration.md,
  rules/secrets.md, rules/spec-flow.md.
- **Renumeração.** Esta spec é a **002** (dados iniciais). A fatia que o PRD e o `AGENTS.md`
  chamavam de `002-catalogo` (catálogo e pedido de empréstimo) passa a ser a **003**. O nome da
  pasta da 003 não foi definido (proposta: `003-catalogo`; ver Q7). Referências que ainda dizem
  "002-catalogo" ou "002" no sentido de catálogo: `AGENTS.md` (linhas sobre a próxima spec),
  `rules/spec-flow.md` (exemplo de numeração), `rules/tests.md` ("Tarefa 9 da 002", "Q4 da
  002"), `rules/qualidade-codigo.md` ("Tarefa 15 da fatia 002"), `docs/entrega-notas.md` e o
  handoff `2026-11-09-etapa1-verificador-hook.md` (histórico, não se reescreve). A atualização é
  a tarefa T12.

## Conflitos registrados
- **C1 — lista de equipamentos em manutenção.** O enunciado manda "usar exatamente esta lista", e
  ela marca **3** em manutenção (TI-0004, TI-0007, TI-0010). O briefing cita só **2**. Decisão do
  operador: vale a lista, 3 em manutenção (R1).
- **C2 — o seed passa a fazer mais do que o documentado.** `docs/modelagem-banco.md` §9 diz que o
  seed só cria o tenant ("Nada além disso — usuários nascem no Supabase Auth"), e a tabela do
  ADR-001 diz "cria o tenant `suporte_ti`". Esta spec manda o seed criar equipamentos e um usuário
  no Auth. Não contraria "idempotente", mas contraria o texto de §9. **Pede aprovação**: errata em
  §9 e na linha do ADR-001, ou ADR novo (Q11). Até lá nenhum código é escrito.
- **C3 — usuário criado fora do convite.** ADR-001 §7 diz "cadastro fechado, somente por convite de
  administrador", e a modelagem (§10, pergunta 7) deixa em aberto quem cria a conta. O seed cria a
  conta pela API admin do Auth: compatível com "cadastro fechado" (não há cadastro pela tela), mas
  não é o fluxo de convite, que continua não decidido (Q10).

## Regras
Cada regra traz o motivo. Onde o motivo vem de um documento, ele é citado.

**R1 — Os 12 equipamentos.** O seed grava no tenant `suporte_ti` os 12 itens de
`back/scripts/imagens-equipamentos/equipamentos.json`, com `nome` → `name`, `patrimonio`,
`categoria` → `category` (`notebook` → `NOTEBOOK`, `monitor` → `MONITOR`, `cabo` → `CABO`,
`camera` → `CAMERA`) e `situacao` → `status` (`disponivel` → `DISPONIVEL`, `manutencao` →
`MANUTENCAO`). Em manutenção: TI-0004, TI-0007 e TI-0010. Disponíveis: os outros 9. Nenhum
empréstimo é criado e nenhum item nasce `EMPRESTADO`. Os campos `busca` e `buscaOriginal` são
ignorados (são da skill de imagem). Valor de categoria ou situação desconhecido derruba o seed.
*Motivo:* o enunciado manda usar exatamente essa lista (C1); o PRD diz que item em manutenção
não aparece como disponível; sem empréstimo, nenhum item pode estar emprestado.

**R2 — Imagem na tabela `equipment`.** Nova migration em `Equipment` com cinco colunas:
`imageUrl`, `imagePixabayId` (**unique**), `imageAuthor`, `imagePageUrl` e `imageLicense`
(colunas `image_url`, `image_pixabay_id`, `image_author`, `image_page_url`, `image_license`).
Tipos propostos: texto para as quatro de texto, inteiro para `imagePixabayId`; todas anuláveis,
porque a tabela já pode ter linhas sem foto (o catálogo futuro cadastra item sem foto). A
migration roda **só no banco local** pelo agente; no remoto quem roda `migrate deploy` é o
operador. Não cria tabela, então não nasce policy nova: o RLS `deny_all` da `init` continua
valendo para `equipment` (rules/migration.md, passo 3, diz que tabela nova leva policy; aqui não
há tabela nova).
*Motivo:* guardar de onde veio cada foto e a licença a que ela obedece; o `unique` impede que a
mesma foto do Pixabay seja usada em dois equipamentos (regra da skill de imagem).

**R3 — Créditos e URL da imagem.** A fonte dos créditos é
`back/scripts/imagens-equipamentos/creditos.json` (versionado, sem segredo, gerado por
`npm run imagens:creditos`; commit `7310f8e`). Para cada equipamento o seed lê dele
`pixabayId`, `autor`, `pageURL` e `licenca` e grava em `imagePixabayId`, `imageAuthor`,
`imagePageUrl` e `imageLicense`. A `imageUrl` é montada pelo seed como
`<SUPABASE_URL>/storage/v1/object/public/imagens/equipamentos/<patrimonio>.jpg`. O bucket é
**`imagens`, público**, e o caminho é fixo, `equipamentos/<patrimonio>.jpg` (**nome do bucket:
decisão do operador**). Falta de equipamento no `creditos.json` derruba o seed. O seed não
verifica se o arquivo existe no Storage (isso é o CA-02).
*Motivo:* o `creditos.json` é versionado, então o seed não depende da pasta de preparo, que o git
ignora; o bucket é público porque a URL precisa abrir sem login. Consequência: a `imageUrl`
gravada depende do `SUPABASE_URL` do ambiente em que o seed rodou (local ≠ remoto).

**R4 — Usuário obrigatório.** `marcelo.grilo@institutojef.org.br` é criado pelo seed pela **API
admin do Auth** (`service_role`, só no backend), **somente se ainda não existir**. A senha vem da
variável `SEED_PROFESSOR_PASSWORD`: nunca em código, nunca no git, nunca em log. O usuário tem
`membership` `COLABORADOR` no tenant `suporte_ti` e **zero empréstimos**. Se o usuário já existe,
o seed não altera a senha. Uma **conta de teste, separada e opcional**, é criada com a mesma
lógica quando `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` existem; sem elas, o seed não cria nada
e não falha por isso. Sem `SEED_PROFESSOR_PASSWORD`, o seed falha antes de tocar no Auth (Q8).
*Motivo:* cadastro fechado (ADR-001 §7): conta só nasce por administrador; a `service_role`
ignora RLS e por isso só roda no backend e no terminal do operador (rules/secrets.md); senha em
variável evita segredo no git.

**R5 — Idempotência.** Equipamento: upsert por `(tenantId, patrimonio)` (o `@@unique` que já
existe). Usuário: por e-mail. Membership: por `(userId, tenantId)`. Tenant: por `slug`. Rodar
duas vezes, ou cem, deixa as mesmas contagens: 12 equipamentos, 1 usuário obrigatório, 1
membership dele, 0 empréstimos. **O que o upsert faz com uma linha que já existe não está
decidido** (Q1).
*Motivo:* "seed que só funciona em banco vazio não serve para ambiente de teste que roda várias
vezes" (ADR-001, seção de seed).

**R6 — Produção é do operador.** O agente **não** executa seed, `migrate deploy` nem `enviar`
contra o Supabase remoto (rules/restrictions.md, "Produção"). O agente prepara e descreve; o
operador roda, na ordem:
1. `cd back && npx prisma migrate deploy` (com a `DIRECT_URL` do remoto no ambiente do operador);
2. `npm run imagens:enviar`, **duas vezes** (com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e
   `ENVIAR_CONFIRMO_PRODUCAO=sim` no terminal dele);
3. `npm run db:seed`, **duas vezes** (com as variáveis do remoto no ambiente dele e a confirmação
   de produção do seed, a definir no plano).
A ordem importa: a migration cria as colunas, o `enviar` cria o bucket e sobe as fotos, o seed
grava as URLs e o usuário. Cada passo repetido prova a idempotência em produção. O operador cola
contagens e saídas (sem valores de segredo) em
`docs/specs/002-dados-iniciais/evidencias-producao.md`, que esta spec prevê.
*Motivo:* a regra de produção do projeto; `service_role` e senhas ficam só com o operador.

**R7 — Fora de escopo** (do briefing): tela de catálogo, cadastro de equipamento pela
interface e importação da planilha. Ver a seção "Fora de escopo".

**R8 — O seed local nunca escreve no remoto por acidente.** `prisma db seed` carrega `back/.env`
sozinho, e esse arquivo aponta para o Supabase remoto. Por isso o seed recusa host que não seja
local sem uma confirmação explícita, como já faz o `enviar` (`ENVIAR_CONFIRMO_PRODUCAO=sim`). O
nome da variável do seed fica para o plano (CA-09).
*Motivo:* sem isso, rodar "o seed de teste" na máquina escreveria em produção.

## Critérios de aceitação
Cada CA diz onde está a prova: **teste local** (automatizado, contra banco e Supabase locais; o
agente roda) ou **produção** (evidência colada pelo operador em `evidencias-producao.md`).

- CA-01: No tenant `suporte_ti` existem exatamente 12 equipamentos, com patrimônios `TI-0001` a
  `TI-0012`, nomes e categorias iguais aos de `equipamentos.json`; `MANUTENCAO` em TI-0004,
  TI-0007 e TI-0010, `DISPONIVEL` nos outros 9; nenhum `EMPRESTADO`.
  Prova: teste local + produção (contagem por situação).
- CA-02: Para cada equipamento, a `imageUrl` aberta **sem login** (sem cabeçalho de autorização)
  responde HTTP 200, `image/jpeg` e imagem de **800x600**.
  Prova: teste local (Storage local) + produção (status e dimensões de pelo menos os 12, sem chave).
- CA-03: As 12 linhas têm `imagePixabayId` distinto, e `imageAuthor`, `imagePageUrl` e
  `imageLicense` iguais ao `creditos.json`; uma tentativa de gravar o mesmo `imagePixabayId` em
  outro equipamento é rejeitada pelo banco.
  Prova: teste local.
- CA-04: Rodar `enviar` duas vezes e o seed duas vezes deixa 12 equipamentos, 12 objetos em
  `imagens/equipamentos/`, 1 usuário obrigatório e 1 membership dele; nada duplica.
  Prova: teste local (duas execuções, mesmas contagens) + produção (duas execuções de cada).
- CA-05: O usuário `marcelo.grilo@institutojef.org.br` existe no Auth, tem linha em
  `public.users` e `membership` `COLABORADOR` em `suporte_ti`.
  Prova: teste local + produção.
- CA-06: Esse usuário entra com e-mail e a senha da variável `SEED_PROFESSOR_PASSWORD` e
  `GET /v1/me` com o token dele responde 200 com o e-mail dele.
  Prova: teste local (a senha da variável de teste); produção: login pelo operador, com o
  resultado colado **sem** a senha nem o token.
- CA-07: O tenant `suporte_ti` tem **zero** empréstimos, e o usuário obrigatório tem zero.
  Prova: teste local + produção (contagem em `loans`).
- CA-08: Nenhum segredo no git: `.env*` fora de `.env.example` não está versionado; os
  `.env.example` trazem `SEED_PROFESSOR_PASSWORD`, `SEED_TESTE_EMAIL`, `SEED_TESTE_PASSWORD` e
  `SUPABASE_SERVICE_ROLE_KEY` **sem valor**; nenhum arquivo versionado dos três repositórios
  contém a senha do seed, chave `service_role` nem JWT.
  Prova: teste local (verificação sobre `git ls-files` e busca de padrões nos três repositórios).
- CA-09: O seed apontado para um host remoto, sem a confirmação de produção, sai com erro e não
  escreve nada.
  Prova: teste local (execução com URL remota falsa e chaves falsas).
- CA-10: A migration aplica do zero (`prisma migrate reset` local) e a tabela `equipment` ganha
  as cinco colunas; `imagePixabayId` repetido é recusado.
  Prova: teste local (`rules/checks.md`, passo 2).
- CA-11: Com `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` definidos, a conta de teste existe com
  membership e zero empréstimos; sem elas, nenhuma conta de teste é criada e o seed termina sem
  erro.
  Prova: teste local (duas execuções, com e sem as variáveis).
- CA-12: Após a renumeração, as referências a "002-catalogo" nos arquivos listados no Vínculo
  apontam para a 003 (ou estão listadas como histórico que não se reescreve).
  Prova: teste local (busca de texto) na tarefa T12.

## Contrato afetado
- **Banco:** `equipment` ganha 5 colunas e 1 unique (migration nova; sem tabela nova, sem policy
  nova). `docs/modelagem-banco.md` §4.4 precisa refletir isso depois (junto com a errata de §9).
- **Storage:** bucket público `imagens`, objetos `equipamentos/<patrimonio>.jpg`.
- **Envs (nomes):** `SEED_PROFESSOR_PASSWORD` (já no `.env.example`), `SEED_TESTE_EMAIL` e
  `SEED_TESTE_PASSWORD` (novos), `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` lidos pelo seed.
  Inventário em `rules/secrets.md`.
- **HTTP:** nenhum endpoint novo ou alterado; sem mudança de OpenAPI.

## Dívida de processo
- Spec escrita **antes** do código, como manda o `rules/spec-flow.md`; nenhuma linha de código
  existe para esta fatia.
- A prova automatizada local depende de Supabase local (Docker) e da estratégia de teste do
  seed, que **não está decidida** (Q6). Hoje o Docker está parado e o Supabase CLI não está
  instalado nesta máquina; sem isso os CA marcados "teste local" não rodam.
- As fotos finais estão em `back/.preparo-imagens/`, que o git ignora: o `enviar` só roda na
  máquina onde elas estão. Regerar exige `preparar` com `--escolher` dos ids do `creditos.json`.
- A `imageUrl` gravada é específica do ambiente (local ≠ remoto); mudar o `SUPABASE_URL` exige
  rodar o seed de novo (e isso depende de Q1).
- Falta o limite 5, 14 dias úteis e crédito do catálogo, que `docs/entrega-notas.md` já aponta
  para as specs 002 e 003: só a parte que couber aqui entra aqui; o resto vai para a 003.

## Fora de escopo / não decidido
Fora de escopo (briefing): tela de catálogo; cadastro de equipamento pela interface; importação
da planilha atual; empréstimo de qualquer item; qualquer endpoint novo.

Não decidido — o PRD e o briefing não respondem, e nada foi preenchido com suposição:
- **Q1 — Linha já existente.** Quando o seed roda e o equipamento já existe, ele deixa a linha
  como está, atualiza só os campos de imagem, ou reescreve tudo? Risco real: depois da fatia 003,
  reescrever `status` voltaria um item `EMPRESTADO` para `DISPONIVEL` em produção.
- **Q2 — Alcance do `unique` de `imagePixabayId`.** Global (uma foto, um equipamento no banco
  inteiro) ou por tenant (`tenantId` + `imagePixabayId`)? O briefing diz só "unique".
- **Q3 — Nome do usuário obrigatório.** `public.users.name` vem de `raw_user_meta_data->>'name'`
  e, se faltar, do e-mail (migration `init`). Que nome vai nos metadados do Auth? Não foi dito.
- **Q4 — Papel da conta de teste.** O briefing diz "mesma lógica", o que sugere `COLABORADOR`,
  mas não diz o papel.
- **Q5 — Observação dos itens em manutenção.** A lista não traz motivo nem previsão de retorno
  para TI-0004, TI-0007 e TI-0010; `observacao` fica vazia. Isso é o desejado?
- **Q6 — Estratégia de teste do seed.** O ADR-001 §8 manda Testcontainers com Postgres real, mas
  um Postgres puro não tem o schema `auth` nem a API admin do Auth. Proposta (não decidida):
  teste de integração contra o Supabase local (`supabase start`). Dependência de teste nova: não
  entra sem mostrar e esperar (rules/tests.md).
- **Q7 — Nome da pasta da 003.** Proposta `003-catalogo`.
- **Q8 — Sem `SEED_PROFESSOR_PASSWORD`.** O seed falha antes de tocar no Auth (proposto) ou pula o
  usuário e termina? A palavra "obrigatório" sugere falhar.
- **Q9 — Imagem e crédito na tela.** O `layout.md` não define foto de equipamento nem onde
  creditar o autor. Herdado da skill de imagem, onde o crédito na tela segue não decidido.
- **Q10 — Convite de administrador.** Como se cria a próxima conta depois desta (ADR-001 §7 e
  pergunta 7 da modelagem) está fora desta fatia.
- **Q11 — Errata de C2.** Corrigir `docs/modelagem-banco.md` §9 e a linha do ADR-001 por errata, ou
  abrir ADR? A escolha é do operador (rules/restrictions.md: o agente não escreve ADR).
- **Q12 — Troca de senha.** O seed não altera a senha de usuário que já existe (R4). Como
  trocá-la depois fica fora desta fatia.
- **Q13 — Nome da variável de confirmação de produção do seed.** Proposta no plano.
- **Q14 — "Senha no arquivo".** A Seção 1 do `docs/entrega-notas.md` lista "senha no arquivo" entre
  as decisões a registrar nas specs 002 e 003. A R4 diz que a senha vem de variável de ambiente e
  nunca de arquivo versionado. Se "no arquivo" quer dizer o `back/.env` (ignorado pelo git), as
  duas coisas combinam; se quer dizer um arquivo versionado, conflita com o CA-08. Confirmar.
- **Q15 — "Limite 5" e "14 dias úteis".** A mesma linha cita "Limite 5" e "14 dias úteis", que
  divergem do PRD ("máximo 3 itens", "prazo de 14 dias"). Não afetam esta fatia (não há empréstimo
  nela) e seguem para a 003; ficam aqui só para não se perderem.

## Como sei que funcionou
Com `supabase start` ativo e as variáveis locais no ambiente: aplicar a migration, rodar `enviar`
e o seed duas vezes, e ver as contagens do CA-04; abrir as 12 URLs públicas; entrar como o
usuário obrigatório. No remoto, o operador repete a sequência da R6 e cola a evidência.
