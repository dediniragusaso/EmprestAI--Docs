# 001 — Login

Status: EM ABERTO

## Objetivo
Pessoa com conta entra com e-mail e senha, chega a uma área autenticada e sai.
A API reconhece quem é a pessoa a partir do token. Nesta fatia não existem
catálogo, empréstimo nem tabela de domínio.

## Vínculo
- PRD item 1 ("Login. Cada pessoa vê os próprios empréstimos").
- layout.md seção 5.1 (Login) e seção 6 (navegação, "Sair" → Login).
- ADR-001 §7 (Supabase Auth e-mail/senha, cadastro fechado, token no header,
  JWT validado por JWKS), §4 (`/v1`, erro RFC 9457), §2 (stack do front),
  §3 (stack da API), §9 (env validado com Zod).
- rules/secrets.md (envs por repositório; `service_role` nunca no front).

## Regras
1. Autenticação é Supabase Auth com e-mail e senha. Não há cadastro na tela.
2. O front usa supabase-js somente para sessão. Dados vêm sempre da API.
3. A API só confia no JWT depois de validar assinatura (JWKS), expiração e `sub`.
4. Rotas internas do front exigem sessão; sem sessão vão para o login.
5. Erro de credencial mostra mensagem única, sem dizer se o e-mail existe.

## Critérios de aceitação
- CA-01: `GET /v1/health` responde 200 sem token.
- CA-02: `GET /v1/me` sem token responde 401 em formato Problem Details.
- CA-03: `GET /v1/me` com token válido responde 200 com `id` e `email`.
- CA-04: `GET /v1/me` com token adulterado ou expirado responde 401.
- CA-05: A tela de login reproduz o layout.md 5.1 (duas colunas, campos E-mail
  e Senha, botão "Entrar", nota sobre empréstimos próprios).
- CA-06: Credencial válida leva à área autenticada; credencial inválida mostra
  "E-mail ou senha incorretos." e permanece na tela.
- CA-07: Campos vazios ou e-mail malformado mostram erro de validação sem
  chamar o Supabase.
- CA-08: Acessar a rota interna sem sessão redireciona para o login.
- CA-09: "Sair" encerra a sessão e volta ao login.
- CA-10: Cada pasta (`back/`, `front/`) tem `.env` e `.env.example` com as
  mesmas chaves; o `.env` não é versionado.

## Contrato afetado
Novo: `GET /v1/health`, `GET /v1/me`. Cliente HTTP do front escrito à mão
nesta fatia (apenas `/v1/me`) porque o `openapi.json` e o orval ainda não
existem — **dívida**, ver abaixo.

## Dívida de processo
- Cliente da API sem orval/OpenAPI (ADR-001 §2/§4). Pagar na primeira fatia
  com mais de um endpoint de negócio.
- Sem Prisma, Sentry, pino e rate limit nesta fatia.
- Spec escrita junto com o código a pedido do time ("faça tudo rápido").
- CAs sem teste que os cite (`verificacao-rodada-1.md`, NÃO PRONTA):
  - CA-01 a CA-04: sem teste HTTP (supertest não instalado). O Jest só cobre o
    verificador de JWT (`back/src/modules/auth/jwt-verifier.service.spec.ts`),
    sem citar CA e sem exercitar `/v1/health` nem `/v1/me`.
  - CA-05 a CA-09: o front não tem runner de teste; a biblioteca de render de
    componente depende de decisão do time (`rules/tests.md`, ADR 002 reservado).
  - CA-10: só conferência de arquivo, sem teste.
- Fora de escopo desta spec, vindo depois: `back/prisma/` (schema, migration
  `init`, seed) e o `postinstall` com `prisma generate` (commit `9e151db`,
  modelagem aprovada em 2026-10-19), e `back/src/modules/root/root.controller.ts`
  (`GET /`, commit `24b9609`). Contrariam "Sem Prisma" acima e não foram
  revertidos; pertencem às fatias seguintes.

## Fora de escopo / não decidido
- Q1: origem de `nome` e `papel` (Colaborador/Operações). Depende da tabela
  `memberships` (modelagem-banco.md ainda é proposta). `/v1/me` não devolve
  papel nesta fatia.
- Q2: botão "Entrar como Operações →" do layout é atalho do protótipo. Não é
  implementado: o papel virá da membership, não de um botão.
- Q3: recuperação de senha e convite de usuário.
- Q4: menu/aba da área autenticada (vem com 002-catalogo). A área autenticada
  desta fatia é uma tela mínima com e-mail e "Sair".

## Como sei que funcionou
Com `supabase start` ativo, um usuário criado no Auth local entra pela tela,
vê a área autenticada com o próprio e-mail (vindo de `/v1/me`) e sai.
