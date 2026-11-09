# 003 — Catálogo e solicitar empréstimo

Status: EM ABERTO

## Objetivo
Trocar o placeholder "O catálogo chega na próxima fatia" por três coisas que funcionam ponta a ponta,
no front e na API: (1) o **catálogo** dos equipamentos do tenant `suporte_ti`, com foto; (2)
**solicitar empréstimo** de um item disponível, com as regras do PRD aplicadas no servidor; (3)
**Meus empréstimos**, com os itens que estão em nome da pessoa logada. A fatia entrega só o que
abre um empréstimo; devolver, renovar e a visão de Operações ficam para outras fatias. Nenhuma
migration: o schema de `loans`, os índices e `equipment` já existem (001 e 002).

## Vínculo
- **PRD** — item 1 ("Login. Cada pessoa vê os próprios empréstimos"), item 2 (catálogo com a
  situação de cada item), item 3 (solicitar empréstimo de um item disponível). Regras do PRD:
  máximo de 3 itens por pessoa, prazo padrão de 14 dias, atraso bloqueia novo empréstimo, item em
  manutenção não aparece como disponível. Itens 4 (devolver) e 5 (Operações) **não** entram.
- **layout.md** — §5.2 (Catálogo), §5.3 (Meus empréstimos), §5.6 (modal e toast), §6 (abas
  Catálogo e Meus empréstimos), §7 regras 1, 4, 5, 6, 7, 8, 9 e 11. O `layout.md` não tem foto no
  card nem crédito de imagem: esta spec os acrescenta (R3, R4); o `layout.md` e o ADR-003 não mudam.
- **ADR-003** — §5.2, §5.3, §5.6 e §7 (rótulos e habilitação dos botões, cores de situação,
  modal, toast).
- **ADR-001** — §3 (Controller → Service → Repository; pastas por domínio), §4 (REST, `/v1`, erro
  RFC 9457, paginação por cursor), §6 (`tenant_id` em toda query; tenant nunca vem do body), §7
  (JWT por JWKS; cadastro fechado), §8 (Jest, Testcontainers com Postgres real, supertest, um teste
  de isolamento por endpoint).
- **docs/modelagem-banco.md** — §4.5 (`loans` e índices), §6 (onde cada regra é garantida), §7
  (derivações de tela), Apêndice A.
- **Specs anteriores** — 001-login (sessão e `/v1/me`) e 002-dados-iniciais (os 12 equipamentos, as
  fotos e a conta do professor, sem empréstimo).
- **rules/** — restrictions, spec-flow, tests, checks, handoff, secrets.
- **Nome da pasta.** A spec 002 registrou (Q7) que a 003 se chamaria `003-catalogo`. Esta pasta é
  `003-solicitar-emprestimo`, nome dado pelo operador no pedido desta etapa. `AGENTS.md`,
  `rules/spec-flow.md` e `rules/tests.md` ainda dizem "003-catalogo"; atualizar é a T18 (CA-25).

## Regras
Cada regra traz o motivo. Onde a resposta depende de uma pergunta aberta, a regra remete a ela.

**R1 — Quem usa.** Só usuário autenticado (JWT válido) com `membership` no tenant `suporte_ti`.
Papéis `COLABORADOR` e `OPERACOES` têm o mesmo acesso nesta fatia. Sem token: 401. Com token mas
sem vínculo ao tenant: 403. Todo acesso a `equipment` e `loans` leva `tenantId` resolvido no
servidor (Q1), nunca do body, da query ou de header do cliente. *Motivo:* ADR-001 §6 e §7;
modelagem §6 ("Todas as queries levam o `tenant_id`…").

**R2 — Catálogo.** Lista todos os equipamentos do tenant, qualquer situação, com: `id`,
`patrimonio`, `name`, `category`, `status` (`DISPONIVEL`, `EMPRESTADO`, `MANUTENCAO`) e `imageUrl`.
Para item `EMPRESTADO`, devolve também a data de devolução prevista (`loan.dueAt`) e se o
empréstimo é da própria pessoa (`loan.isMine`); **não devolve o nome de quem está com o item** (Q3).
Ordem fixa: patrimônio crescente, itens sem patrimônio por último, desempate por `id`. Resposta
paginada por cursor (Q11). A resposta traz um bloco `viewer` com o que a tela precisa para
habilitar ou desabilitar os botões: `openLoans` (quantos empréstimos abertos a pessoa tem),
`maxLoans` (3), `overdue` (a pessoa tem empréstimo aberto com `dueAt` anterior a hoje?) e `today`
e `proposedDueAt` (hoje e hoje + 14, do servidor). *Motivo:* o botão de cada card é derivado no
render (ADR-003 §7); a data não pode vir do relógio do navegador (R8).

**R3 — Foto no card.** Todo card mostra a foto `imageUrl` na proporção 4:3 (as imagens são 800x600),
sempre com o mesmo enquadramento (`object-fit: cover`, mesma altura em todos os cards). Item sem
`imageUrl` mostra um quadro neutro do mesmo tamanho, nunca outro tamanho de card. *Motivo:* pedido
do operador ("tamanho único 800x600, mesmo enquadramento"); a 002 gravou 12 fotos 800x600.

**R4 — Crédito das fotos.** O rodapé do catálogo traz o texto "Fotos: Pixabay" com um link discreto
para `https://pixabay.com`. Sem crédito por foto na tela. *Motivo:* decisão do operador: o contrato
(o texto de crédito) prevalece sobre o item 9 do briefing. A orientação do professor de trocar o
Pexels pelo Pixabay está em `docs/evidencias/orientacao-pixabay.md`.

**R5 — Item indisponível aparece, sem botão de solicitar.** Item `MANUTENCAO` mostra a pill cinza e
o motivo "Em manutenção"; item `EMPRESTADO` mostra a pill âmbar e "Emprestado · devolução prevista
até DD/MM/AAAA"; item emprestado à própria pessoa mostra "Está com você". Nenhum dos dois tem botão
de solicitar: no lugar fica o rótulo desabilitado da ADR-003 §7 ("Indisponível", "Emprestado" ou
"Está com você"). *Motivo:* PRD ("manutenção não aparece como disponível"); layout §7 regras 6 e 7.

**R6 — Solicitar empréstimo (`POST /v1/loans`).** Corpo: `{ "equipmentId": uuid }`. Numa **única
transação**, nesta ordem: (1) o equipamento existe **neste tenant** (senão 404); (2) o equipamento
está `DISPONIVEL` (senão recusa, R7); (3) a pessoa não tem empréstimo aberto com `dueAt` anterior a
hoje (senão recusa); (4) a pessoa tem menos de 3 empréstimos abertos (senão recusa); (5) cria o
`loan` com `userId` da pessoa logada, `openedAt` do servidor e `dueAt` = hoje + 14 dias corridos;
(6) muda `equipment.status` para `EMPRESTADO`; (7) registra a auditoria `loan.open` (Q8). Qualquer
falha desfaz tudo: nunca existe empréstimo sem o status mudar, nem o contrário. Resposta: 201 com o
empréstimo criado. A pessoa só pede empréstimo para si; não existe parâmetro de "outra pessoa".
*Motivo:* modelagem §6 ("`status = EMPRESTADO` ⇔ empréstimo aberto", atualizado na mesma
transação); PRD itens 3 e regras.

**R7 — Recusas e seus motivos.** Toda recusa é HTTP 409, no formato Problem Details (ADR-001 §4),
com `code` estável e `detail` em português que a tela mostra como texto. Quatro casos, e a
mensagem parte do rótulo da ADR-003 §7 (as frases completas são proposta, Q4):

| `code` | quando | rótulo (ADR-003 §7) |
|---|---|---|
| `equipment-unavailable` | equipamento em `MANUTENCAO` | Indisponível |
| `equipment-already-loaned` | equipamento `EMPRESTADO` (inclusive o perdedor de uma corrida) | Emprestado / Está com você |
| `loan-overdue` | a pessoa tem empréstimo aberto em atraso | Bloqueado por atraso |
| `loan-limit-reached` | a pessoa já tem 3 empréstimos abertos | Limite de 3 itens |

Ordem de verificação: a da R6 (equipamento antes da pessoa). Em recusa, nada é gravado. Equipamento
inexistente ou de outro tenant: 404 (não 409, para não confirmar que o id existe em outro tenant).
Corpo inválido (sem `equipmentId`, ou que não é uuid): 400 Problem Details. *Motivo:* o operador
pediu que recusa sempre mostre o motivo em texto; ADR-001 §4.

**R8 — "Hoje" é do servidor.** "Hoje", o atraso (`dueAt` anterior a hoje; `dueAt` igual a hoje **não**
é atraso) e o prazo (hoje + 14) são calculados no servidor, na data civil de `America/Sao_Paulo`
(Q2). O front não lê `new Date()` nem `HOJE_DEMO` (`src/data/demo.ts`) para nenhuma dessas contas:
mostra o que a API devolveu (`today`, `proposedDueAt`, `dueAt`). O relógio é injetável no servidor,
para o teste congelar a data. *Motivo:* pedido do operador; `rules/tests.md` (teste com relógio real
quebra sozinho).

**R9 — Concorrência.** (a) *Mesmo equipamento:* duas ou mais solicitações simultâneas resultam em
**um** empréstimo e as demais recebem a recusa `equipment-already-loaned`. A transação trava a
linha do equipamento antes de ler o `status`, e o índice único parcial `loans_one_open_per_equipment`
é a rede de segurança: se uma violação dele chegar ao serviço, vira 409 `equipment-already-loaned`,
nunca 500. (b) *Limite de 3:* o banco não impõe o limite, então a transação **serializa por
pessoa** (lock por `tenantId` + `userId`, tomado antes de contar), de modo que, com N pedidos
simultâneos da mesma pessoa, no máximo 3 empréstimos abertos existem ao final. A ordem de lock é
sempre pessoa, depois equipamento, para não haver deadlock. *Motivo:* o operador pediu os dois
testes; modelagem §6 manda tratar o limite "na transação, com lock" e diz que o banco só impede o
caso de dois empréstimos do mesmo item.

**R10 — Meus empréstimos (`GET /v1/loans/mine`).** Devolve só os empréstimos **abertos** da pessoa
logada, no tenant, em ordem de `dueAt` crescente. Cada linha: `id`, `equipment` (`id`, `name`,
`patrimonio`, `category`, `imageUrl`), `openedAt`, `dueAt` e `state` (`EM_DIA` ou `EM_ATRASO`,
calculado na leitura, R8). Mais `openLoans` e `maxLoans`. Nenhum empréstimo de outra pessoa
aparece, nem para `OPERACOES` nesta rota (a visão completa é da fatia de Operações). *Motivo:* PRD
item 1; layout §7 regra 11; modelagem §6.

**R11 — Tela Meus empréstimos.** Cabeçalho "N de 3 itens em seu nome · prazo padrão de 14 dias";
barra de 3 traços (ocupados no acento, em atraso em vermelho, vazios em `text 12%`); uma linha por
empréstimo com borda esquerda na cor do estado, item, "Retirada", "Devolver até" (na cor do estado)
e a pill. **Sem botão "Devolver"** (a devolução é de outra fatia; botão sem função não entra).
Estado vazio: caixa tracejada com o botão "Ir ao catálogo". Só existem os estados "Em dia" e "Em
atraso"; "A vencer" não entra porque o limite de dias não está definido (Q9). *Motivo:* layout §5.3
e modelagem §10 pergunta 8.

**R12 — Tela do catálogo.** Cabeçalho "Catálogo" e a contagem "X de Y equipamentos disponíveis
agora"; busca por nome e patrimônio (sem diferenciar maiúscula, a cada tecla, com estado vazio
próprio); chips exclusivos Todos, Disponíveis, Emprestados, Em manutenção; grade
`repeat(auto-fill, minmax(292px, 1fr))`. Botão de cada card, por prioridade, para item
`DISPONIVEL`: "Bloqueado por atraso" (a pessoa está em atraso, e o banner vermelho aparece no topo
com atalho para Meus empréstimos), "Limite de 3 itens" (secundário) ou "Solicitar" (primário). Para
item não disponível vale a R5. O clique em "Solicitar" abre o modal da §5.6 com "Devolver até" =
`proposedDueAt`; confirmar chama `POST /v1/loans`; sucesso fecha o modal, mostra o toast
(2600 ms) e atualiza catálogo e Meus empréstimos; recusa (409) fecha o modal, mostra o `detail` da
API em texto visível (toast de erro, cor de erro da ADR-003 §1.3) e recarrega o catálogo, porque
uma recusa por corrida significa que a tela estava velha. *Motivo:* layout §5.2 e §7; ADR-003.

**R13 — Navegação.** Abas "Catálogo" e "Meus empréstimos" na barra do topo; `/` leva ao catálogo.
O texto "O catálogo chega na próxima fatia" deixa de existir. A barra continua mostrando o e-mail e
"Sair" como hoje; etiqueta de papel e avatar do `layout.md` §6 ficam fora (o papel não muda nada
nesta fatia). *Motivo:* layout §6; evitar escopo que ninguém usa nesta fatia.

**R14 — O professor chega com zero empréstimo.** Nenhum teste automatizado abre empréstimo em banco
que não seja o Postgres descartável do Testcontainers (nada lê `DATABASE_URL`, `DIRECT_URL` nem
`.env`). Os testes manuais em produção usam a **conta de teste** criada na 002 e nunca
`marcelo.grilo@institutojef.org.br`. O agente não escreve em produção (rules/restrictions.md): quem
roda a prova em produção e a limpeza é o operador (Q13). *Motivo:* pedido do operador; a conta do
professor deve chegar à correção sem empréstimo (CA-07 da 002 continua verdadeiro).

## Critérios de aceitação
Observáveis de fora. "API" = teste automatizado do back (Jest, supertest e Testcontainers com o
schema real). "Tela" = evidência manual: print em `docs/evidencias/003-…png` e a data da execução,
sem Playwright (decisão do operador), porque o front não tem runner e a biblioteca de teste de
componente ainda não foi decidida (ADR 002 reservado).

- **CA-01 (API)** — Com os 12 equipamentos da 002 no banco, `GET /v1/equipment` devolve os 12, cada
  um com `id`, `patrimonio`, `name`, `category`, `status` e `imageUrl`, em ordem de patrimônio
  crescente, e o bloco `viewer` com `maxLoans` 3, `today` e `proposedDueAt` = `today` + 14.
- **CA-02 (Tela)** — O catálogo mostra os 12 cards, cada um com foto 4:3 do mesmo tamanho, nome,
  categoria, patrimônio e a pill de situação; item sem foto mostra o quadro neutro do mesmo tamanho.
  Print do catálogo com as fotos carregadas.
- **CA-03 (API)** — Um equipamento `MANUTENCAO` e um `EMPRESTADO` aparecem no `GET /v1/equipment` com
  o `status` real; o `EMPRESTADO` traz `loan.dueAt` e `loan.isMine`; a resposta **não contém** o
  nome nem o e-mail de quem está com o item.
- **CA-04 (Tela)** — Cards `MANUTENCAO` e `EMPRESTADO` aparecem sem botão de solicitar, com o motivo
  em texto (R5): "Indisponível", "Emprestado · devolução prevista até DD/MM/AAAA" e "Está com você"
  para o próprio. Print.
- **CA-05 (API)** — `POST /v1/loans` com um equipamento `DISPONIVEL` devolve 201 e, no banco:
  existe um `loan` aberto da pessoa com `dueAt` = hoje + 14 e `equipment.status` = `EMPRESTADO`.
- **CA-06 (API)** — A abertura é atômica: se a gravação falhar depois de criar o `loan` (falha
  injetada na auditoria), não resta `loan` nem o `status` mudado.
- **CA-07 (API)** — Com 3 empréstimos abertos, o 4º pedido devolve 409 `loan-limit-reached`, com o
  `detail` em texto, e nada é gravado (continuam 3 `loans` abertos; o equipamento segue `DISPONIVEL`).
- **CA-08 (API)** — Com um empréstimo aberto com `dueAt` anterior a hoje, o pedido devolve 409
  `loan-overdue` e nada é gravado. Com `dueAt` igual a hoje, o pedido é aceito (não é atraso).
- **CA-09 (API)** — Pedido de equipamento `MANUTENCAO` devolve 409 `equipment-unavailable`; de
  equipamento `EMPRESTADO` devolve 409 `equipment-already-loaned`. Nada é gravado em nenhum.
- **CA-10 (API, corrida no equipamento)** — 10 pedidos simultâneos do mesmo equipamento, de 10
  pessoas diferentes, resultam em **exatamente 1** resposta 201 e 9 respostas 409
  `equipment-already-loaned`; no banco há **1** `loan` aberto desse equipamento e o status é
  `EMPRESTADO`.
- **CA-11 (API, corrida no limite)** — Uma pessoa com 0 empréstimos faz 5 pedidos simultâneos de 5
  equipamentos diferentes: **exatamente 3** respostas 201 e 2 respostas 409 `loan-limit-reached`;
  no banco, 3 `loans` abertos dela. Com 2 abertos e 3 pedidos simultâneos: 1 sucesso e 2 recusas.
- **CA-12 (API, rede de segurança)** — Com o banco deliberadamente inconsistente (equipamento
  `DISPONIVEL` que já tem um `loan` aberto), o pedido devolve 409 `equipment-already-loaned`, não 500,
  e continua existindo um só `loan` aberto desse equipamento.
- **CA-13 (API, multi-tenant)** — Com dois tenants no banco: `GET /v1/equipment` de uma pessoa do
  tenant A não traz nenhum equipamento do tenant B; `POST /v1/loans` com o id de um equipamento do
  B devolve 404 e não grava nada; `GET /v1/loans/mine` não traz empréstimo do B; um `tenantId` no
  corpo do POST é ignorado. Um caso por endpoint (ADR-001 §8).
- **CA-14 (API, autenticação)** — Os três endpoints devolvem 401 sem token e 403 com token válido
  de quem não tem `membership` no tenant.
- **CA-15 (API)** — `GET /v1/loans/mine` devolve só os empréstimos abertos da pessoa logada, por
  `dueAt` crescente, com `state` `EM_DIA` ou `EM_ATRASO` e `openLoans`/`maxLoans`; empréstimo de
  outra pessoa do mesmo tenant não aparece, nem para quem tem papel `OPERACOES`.
- **CA-16 (API)** — Com o relógio do servidor congelado em uma data D, o `dueAt` criado é D + 14 e o
  `today` do catálogo é D, inclusive perto da meia-noite de `America/Sao_Paulo` (Q2). O código do
  front não importa `HOJE_DEMO` nem chama `new Date()` para essas datas (busca de texto no `front/src`).
- **CA-17 (API)** — Corpo inválido em `POST /v1/loans` (sem `equipmentId`, id que não é uuid)
  devolve 400 em Problem Details e não grava nada.
- **CA-18 (API)** — Cada abertura grava uma linha `loan.open` em `audit_logs` (ator, tenant, recurso
  `loan`) na mesma transação do empréstimo; recusa não grava (Q8).
- **CA-19 (Tela)** — Fluxo feliz: "Solicitar" abre o modal com o "Devolver até" que a API devolveu;
  confirmar fecha o modal, mostra o toast, o card passa a "Está com você" e o item aparece em Meus
  empréstimos. Prints do modal, do toast e do resultado.
- **CA-20 (Tela)** — Recusas à vista: com 3 empréstimos, todos os cards disponíveis mostram "Limite
  de 3 itens" desabilitado; com empréstimo em atraso, mostram "Bloqueado por atraso" e o banner
  vermelho aparece; uma recusa 409 vinda da API aparece em texto na tela. Três prints. (O atraso só
  se reproduz com um empréstimo semeado no banco **local**: a API nunca cria `dueAt` no passado.)
- **CA-21 (Tela)** — Meus empréstimos: "N de 3 itens em seu nome · prazo padrão de 14 dias", barra
  de 3 traços, as linhas com as cores de estado e sem botão "Devolver"; sem empréstimo, o estado
  vazio com "Ir ao catálogo". Prints.
- **CA-22 (Tela)** — Rodapé do catálogo com "Fotos: Pixabay" e link para `https://pixabay.com`; o
  placeholder "O catálogo chega na próxima fatia" não existe mais (busca de texto no `front/src`).
  Print do rodapé.
- **CA-23 (Tela e API)** — Busca e chips: digitar parte do nome ou do patrimônio filtra a cada tecla
  sem diferenciar maiúscula; os chips são exclusivos; a contagem "X de Y" é a da API. Print.
- **CA-24 (processo)** — Nenhum teste automatizado lê `.env`, `DATABASE_URL` ou fala com Supabase
  remoto (busca de texto em `back/src` e `back/prisma` por esses nomes nos `*.spec.ts`); nenhum
  comando do agente escreve em produção; depois dos testes manuais em produção, a consulta
  `select count(*) from loans l join users u on u.id = l.user_id where u.email =
  'marcelo.grilo@institutojef.org.br'` devolve 0 (resultado colado pelo operador).
- **CA-25 (processo)** — Nenhum documento ativo (`AGENTS.md`, `rules/`) chama esta fatia de
  `003-catalogo` nem de `002-catalogo` (busca de texto; históricos e a spec 002 ficam como estão).

## Contrato afetado
- **Endpoints novos** em `back/src/modules/`: `GET /v1/equipment`, `POST /v1/loans`,
  `GET /v1/loans/mine`. `GET /v1/me` não muda.
- **Erros novos** (Problem Details, 409): `equipment-unavailable`, `equipment-already-loaned`,
  `loan-overdue`, `loan-limit-reached`; mais 400 (corpo inválido), 401, 403, 404.
- **Banco:** nenhuma migration. `loans`, os índices parciais e o trigger de `audit_logs` já existem.
- **Env:** `DATABASE_URL` entra no schema Zod do boot do back (já está no inventário de
  `rules/secrets.md` e em `back/.env.example`); o runtime hoje não abre conexão com o banco.
- **Front:** troca `HomePage` por duas telas e adiciona a camada de chamada à API em `src/lib/api.ts`.
  Cliente escrito à mão (Q5).
- **`openapi.json`:** não é gerado nesta fatia (Q5).

## Dívida de processo
- **Cliente HTTP à mão no front e Zod direto no Nest.** O ADR-001 §2 e §4 mandam cliente gerado por
  orval a partir de OpenAPI, e o §3 manda `nestjs-zod`; nenhum deles está instalado, e instalar
  biblioteca fora do que o operador aprovou é decisão dele (Q5). A fatia segue o caminho da 001
  (`src/lib/api.ts` escrito à mão). A dívida vira tarefa própria quando o operador decidir.
- **Front sem teste automatizado.** Sem runner nem biblioteca de componente (ADR 002 reservado), a
  prova das telas é manual (print). O CA que só se observa com clique, toast e CSS fica "Tela".
- **`npm run lint` não existe no back nem no front** (declarar em cada tarefa, não pular).
- **Folha de estilo e componentes.** O ADR-001 §2 manda shadcn/ui; o front de hoje usa as classes do
  Nocturne (`.btn`, `.nav`). A fatia usa as classes que existem em `front/src/index.css` e não
  instala shadcn/ui.

## Fora de escopo / não decidido

### Fora de escopo
- **Devolver** (PRD item 4, layout §5.3 botão "Devolver", §7 regra 2) e **Registrar devolução** em
  Operações (regra 3). Sem devolução, um item emprestado nesta fatia só volta a `DISPONIVEL` por SQL
  do operador (Q13).
- **Renovar** o empréstimo.
- **Tela de Operações** (PRD item 5, layout §5.4), **cadastro de equipamento** (§5.5) e as abas de
  Operações. Papel `OPERACOES` usa as mesmas duas telas do colaborador.
- Reserva com data futura, notificação por e-mail e importação da planilha (PRD, "O que NÃO entra").
- Pill "A vencer" (R11, Q9), etiqueta de papel e avatar na barra (R13), CASL (nenhuma regra por
  papel nesta fatia), rate limit (ADR-001 §10), OpenAPI e orval (Q5), Playwright e qualquer teste de
  front (decisão do operador).
- Crédito por foto na tela; o crédito do autor continua só no banco (002).
- Qualquer escrita em produção feita pelo agente (rules/restrictions.md).

### Perguntas Q1 a Q13 — Decidido pelo operador em 09/11/2026
**Decidido pelo operador em 09/11/2026:** a spec e as propostas de Q1 a Q13 foram aceitas, com as
precisões abaixo. As propostas seguem escritas porque são o texto que o código obedece.
- **Q3 (decisão de privacidade).** Sem nome de pessoa no catálogo: "Emprestado · devolução prevista
  até DD/MM/AAAA" e "Está com você". **Diferença registrada do `layout.md` §5.2**, que mostra "Com
  {pessoa} · devolver até {data}": o layout continua como está; esta fatia segue a decisão de
  privacidade (cada pessoa vê só os próprios empréstimos).
- **Q11.** A contagem "X de Y" é feita **na tela**, a partir dos itens carregados (a API não devolve
  contagem).
- **Q12.** Ordem das verificações: equipamento, depois atraso, depois limite.
- **Q13.** Limite de 3 e atraso são provados no banco **local**. Em produção, só **um** pedido, com a
  conta de teste (nunca a do professor). O SQL de limpeza (voltar o item para `DISPONIVEL` e apagar o
  empréstimo de teste) fica documentado e **o operador o executa** no Supabase.
- **Q6.** Instalar `supertest` está autorizado (T1); nenhuma outra dependência nova.
- T0 aprovada. Questões Q1 a Q13 já não estão em aberto.

Texto original das perguntas, com a proposta de cada uma:
- **Q1 — Origem do tenant.** O ADR-001 §6 diz "claim do JWT, resolvido no guard", mas o JWT do
  Supabase de hoje não traz tenant e o guard só devolve `id` e `email`. *Proposta:* o guard consulta
  `memberships` (usuário → tenant `suporte_ti`) e coloca `tenantId` no contexto do request; sem
  vínculo, 403. Nunca do body. Não contraria o ADR (o tenant continua vindo do servidor, não do
  cliente), mas a letra do §6 pede claim; confirmar.
- **Q2 — Fuso de "hoje".** O Supabase roda em UTC; perto da meia-noite de Brasília o "hoje" muda. *Proposta:*
  data civil de `America/Sao_Paulo`, calculada no servidor (o usuário e a regra de 14 dias "corridos"
  são do Brasil).
- **Q3 — Nome de quem está com o item.** O layout §5.2 mostra "Com {pessoa}", mas o layout e o PRD
  dizem que cada pessoa vê só os próprios empréstimos. *Proposta:* o catálogo **não** mostra o nome;
  mostra "Emprestado · devolução prevista até DD/MM/AAAA" e "Está com você" para o próprio.
- **Q4 — Texto das recusas.** A ADR-003 §7 só define rótulos de botão. *Proposta de `detail`:*
  "Limite de 3 itens: devolva um item antes de pedir outro." · "Bloqueado por atraso: devolva o item
  vencido antes de pedir outro." · "Indisponível: este equipamento está em manutenção." · "Emprestado:
  outra pessoa acabou de ficar com este equipamento." (quando o item é da própria pessoa: "Está com
  você.").
- **Q5 — Cliente à mão e Zod direto.** Seguir o caminho da 001 (R/Dívida) ou abrir uma fatia antes
  para `nestjs-zod`, OpenAPI e orval. *Proposta:* seguir à mão e registrar a dívida.
- **Q6 — Dependência de teste no back.** `supertest` (e `@types/supertest`) estão no ADR-001 §8 mas
  não no `package.json`. *Proposta:* instalar na T1, versões fixas, mostrando antes; nenhuma outra
  dependência nova no back nem no front.
- **Q7 — Nome da pasta.** `003-solicitar-emprestimo` (pedido do operador) em vez de `003-catalogo`
  (Q7 da 002). Mantive o pedido; confirmar e atualizar `AGENTS.md` e `rules/` (T18).
- **Q8 — Auditoria.** A pergunta 6 da modelagem (quais ações auditar) está aberta. *Proposta:*
  registrar só `loan.open` nesta fatia, na mesma transação.
- **Q9 — Estados e botão em Meus empréstimos.** Sem "A vencer" (a modelagem pergunta 8 está aberta) e
  sem o botão "Devolver" (outra fatia).
- **Q10 — Item sem `imageUrl`.** Quadro neutro do mesmo tamanho. Os 12 itens da 002 têm foto.
- **Q11 — Cursor com 12 itens.** O ADR-001 §4 manda cursor nas listas. *Proposta:* `limit` padrão 50
  e máximo 100, `nextCursor` opaco; o front busca as páginas seguintes até acabar, porque busca e
  contagem "X de Y" são feitas na tela.
- **Q12 — Ordem das verificações.** Equipamento antes da pessoa (R6): é a mesma prioridade dos
  rótulos da tela (item não disponível ganha de "Limite" e de "Atraso"). Entre as duas da pessoa,
  atraso vem antes do limite.
- **Q13 — Prova manual em produção e seus restos.** Cada empréstimo aberto na produção deixa um item
  `EMPRESTADO` que só volta por SQL (não há devolução). *Proposta:* as provas de limite e de atraso
  (CA-20) são feitas no banco **local**; em produção, um único empréstimo de um único item, com a
  conta de teste; o agente prepara o SQL de limpeza e **o operador o executa**. Atraso não se
  reproduz em produção sem SQL de escrita.

## Como sei que funcionou
- Back (`cd back`): `npm run build` (exit 0) e `npm test` com a última linha "Ran all test suites."
  e os casos de CA-01, 03, 05 a 18 passando, cada nome de caso citando o `CA-xx`. `lint` não existe.
- Front (`cd front`): `npm run build` (`tsc --noEmit && vite build`) com exit 0. `lint`, `typecheck`
  e `test` não existem (declarar). Os CA de "Tela" ficam com print em `docs/evidencias/` e a
  data/ambiente da execução (local, e produção só com a conta de teste).
- Busca de texto: o aviso "O catálogo chega na próxima fatia", `HOJE_DEMO` e `new Date()` no código
  de datas do front não aparecem em `front/src` (CA-16, CA-22).
- `git status --short` nos três repositórios: só arquivos do escopo da tarefa.
- Verificador (`rules/spec-flow.md`): a spec só vira `Status: PRONTA` com `Veredito: PRONTA`. Esta
  etapa entrega só a spec, o plano e as tarefas; **nada foi implementado**.
