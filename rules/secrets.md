---
description: Onde cada variável de ambiente vive e qual chave usar
globs: ["**/.env*", "front/src/lib/**", "back/src/config/**"]
alwaysApply: false
---

# Variáveis de ambiente e chaves
> leitor: agente

## Quando
Ao criar ou usar qualquer variável de ambiente, ao instanciar o client
do Supabase ou o client da API, ou ao escrever código que lê
configuração.

## Inventário atual
Conferido em `back/.env.example`, `front/.env.example` e
`back/src/config/env.ts`. O `.env.example` de cada repositório é a lista
versionada de nomes; este quadro é o mapa de quem lê o quê.

| Arquivo | Variável | Natureza |
|---|---|---|
| `back/.env` | `NODE_ENV`, `PORT` | configuração |
| `back/.env` | `SUPABASE_URL` | público |
| `back/.env` | `SUPABASE_JWKS_URL` | público |
| `back/.env` | `CORS_ORIGIN` | público |
| `back/.env` | `DATABASE_URL` | secreto (pooler) |
| `back/.env` | `DIRECT_URL` | secreto (migrations) |
| `back/.env` | `SUPABASE_SERVICE_ROLE_KEY` | **secreto** — lido por `back/scripts/imagens-equipamentos/enviar.mjs`, só no terminal do operador; nome no `.env.example` |
| `back/.env` | `PIXABAY_API_KEY` | **secreto** — lido por `back/scripts/imagens-equipamentos/preparar.mjs` (`node --env-file`); nome no `.env.example`. Substitui `PEXELS_API_KEY` (ADR-004) |
| `back/.env` | `SEED_PROFESSOR_PASSWORD` | **secreto** — nome no `.env.example` |
| `front/.env` | `VITE_SUPABASE_URL` | público |
| `front/.env` | `VITE_SUPABASE_ANON_KEY` | público |
| `front/.env` | `VITE_API_URL` | público |

Os três nomes entraram no `.env.example` de `back/` só como nome, sem
valor (passo 3 abaixo). `PEXELS_API_KEY` saiu do inventário: a fonte de imagens
passou a ser o Pixabay. Ainda falta, à mão: cadastrar os nomes que o deploy
precisar no painel da Vercel (os scripts de imagem não rodam na Vercel).

`ENVIAR_CONFIRMO_PRODUCAO=sim` não é segredo nem vai em `.env`: o operador a define no
próprio terminal, na hora de enviar fotos ao Supabase remoto.

Nenhum código lê o `.env` nem o `.env.example` da raiz, nem `back/.env.remote`.

### Quem carrega o arquivo
- Front: o Vite lê `front/.env` (sem `envDir` em `front/vite.config.ts`).
- Prisma: a versão instalada é a 6.19.3 (`back/package.json`, sem
  `prisma.config.ts`). Ela carrega `back/.env` sozinha nos comandos da CLI
  (`migrate`, `db seed`). A 7 deixa de fazer isso: ao atualizar, reverifique.
- API Nest: `back/src/config/env.ts` lê só `process.env` e não há `dotenv` no
  projeto — o `.env` precisa chegar ao processo por fora (na Vercel, pelo painel).

## Procedimento
1. Chave pública (anon): só ela pode aparecer em código que roda no
   navegador. A proteção dela são as políticas de acesso do banco (RLS).
   Neste projeto o front usa a anon key apenas para a sessão
   (supabase-js) — dados nunca vêm do Supabase direto no navegador.
2. Chave de serviço (service_role): ignora todas as políticas. Só no
   backend, nunca em código do `front/`, nunca em variável com
   prefixo `VITE_` — tudo com `VITE_` vai embutido no bundle e chega
   ao navegador.
3. Variável nova existe em TRÊS lugares ou em nenhum:
   `.env` do repositório correspondente (sua máquina) ·
   `.env.example` do mesmo repositório (versionado, sem valor) ·
   painel da Vercel, no projeto daquele repositório (preview e
   production — são dois projetos, um por repositório).
   Se o `.env.example` ainda não existir no scaffold, criá-lo faz
   parte da tarefa.
4. Ao criar uma variável, diga na resposta em quais dos três lugares
   você já a colocou e o que falta eu fazer à mão (o painel da Vercel
   sempre é manual).

## Verificação
Uma busca por `SERVICE_ROLE` no `front/` não retorna nada, e nenhum
valor de chave aparece em arquivo versionado. `.env.example` de cada
repositório tem todas as chaves que o projeto usa, sem nenhum valor real.

## Não faça
- Não escreva valor de chave em resposta, commit, log ou comentário.
- Não crie variável só no `.env` local. Ela quebra o deploy e o erro
  só aparece no build da Vercel.
- Não contorne uma política de acesso trocando de chave. Se a política
  atrapalha, a política está errada — pare e me avise.
