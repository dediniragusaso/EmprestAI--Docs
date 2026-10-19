# Plano — 001-login
Restringido por ADR-001 §2, §3, §4, §7, §9 e rules/secrets.md.

1. Repositórios (CA-10): primeiro commit em `back/` e `git init` em `front/`.
   Verificação: `git log` não vazio nos dois.
2. API (CA-01..04): NestJS com Express, prefixo `/v1`, env validado com Zod,
   guard que valida JWT via JWKS usando `node:crypto` (sem lib fora do ADR),
   filtro de erro RFC 9457, helmet, CORS por allowlist, entrada serverless
   para a Vercel. Verificação: `npm run build` e chamadas curl aos CAs.
3. Front (CA-05..09): Vite + React + TS strict + Tailwind + RHF/Zod +
   React Router + supabase-js. Tokens do ADR-003. Verificação: `npm run build`
   e fluxo manual contra Supabase local.
4. Envs (CA-10): `.env`/`.env.example` por pasta; `VITE_API_URL` aponta para a
   API e `CORS_ORIGIN` para o front.
