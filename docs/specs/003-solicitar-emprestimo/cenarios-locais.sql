-- Cenarios para as provas de TELA da spec 003 (CA-19 a CA-23). SO PARA O BANCO LOCAL.
-- NUNCA rode contra o Supabase remoto: este arquivo escreve em loans e equipment.
--
-- Pre-requisitos (local): `supabase start`; a conta de teste ja existe no Auth local e em
-- public.users/memberships (rode `npm run db:dados-iniciais` no banco local com SEED_TESTE_EMAIL e
-- SEED_TESTE_PASSWORD definidos no terminal, e os 12 equipamentos da spec 002).
--
-- Uso, sem psql na maquina, pelo conteiner do Supabase local (PowerShell, na raiz do repositorio):
--   Get-Content docs/specs/003-solicitar-emprestimo/cenarios-locais.sql -Raw |
--     docker exec -i supabase_db_Empresitmo-TI psql -U postgres -d postgres `
--       -v "local='sim'" -v "email='teste@local.dev'" -v "cenario='atraso'" -f -
-- `local='sim'` e obrigatorio: e a sua confirmacao de que o destino e o conteiner LOCAL. O nome do
-- conteiner e supabase_db_<project_id>; o project_id esta em supabase/config.toml.
-- Cenarios: 'limpar' (volta ao estado inicial), 'limite' (3 emprestimos em dia),
--           'atraso' (1 emprestimo com prazo vencido ha 3 dias), 'um' (1 emprestimo em dia).

\set ON_ERROR_STOP on

-- Guarda: sem a confirmacao `local='sim'` o script nao faz nada.
\if :{?local}
\else
  \echo ABORTADO: informe -v local=SIM entre aspas simples (so para o conteiner LOCAL do Supabase).
  \quit
\endif
select :local = 'sim' as confirmou_local \gset
\if :confirmou_local
\else
  \echo 'ABORTADO: local deve ser sim.'
  \quit
\endif

begin;

-- Sempre comeca limpando os emprestimos abertos da conta de teste e devolvendo os itens.
update equipment set status = 'DISPONIVEL', updated_at = now()
 where id in (
   select l.equipment_id from loans l join users u on u.id = l.user_id
    where u.email = :email and l.returned_at is null);
delete from loans
 where user_id = (select id from users where email = :email) and returned_at is null;

\if :{?cenario}
\else
  \set cenario '''limpar'''
\endif

-- 'limite': 3 emprestimos em dia (vencem em 14 dias).  'um': 1 em dia.  'atraso': 1 vencido.
with alvo as (
  select e.id, row_number() over (order by e.patrimonio) as n
    from equipment e join tenants t on t.id = e.tenant_id
   where t.slug = 'suporte_ti' and e.status = 'DISPONIVEL'
),
escolha as (
  select id, n from alvo
   where n <= case :cenario when 'limite' then 3 when 'um' then 1 when 'atraso' then 1 else 0 end
),
novos as (
  -- O id do loan e gerado aqui: no banco as tabelas nao tem default (o Prisma gera o uuid no cliente).
  insert into loans (id, tenant_id, equipment_id, user_id, opened_at, due_at)
  select gen_random_uuid(), (select id from tenants where slug = 'suporte_ti'), escolha.id,
         (select id from users where email = :email),
         case :cenario when 'atraso' then now() - interval '17 days' else now() end,
         case :cenario when 'atraso' then current_date - 3 else current_date + 14 end
    from escolha
  returning equipment_id
)
update equipment set status = 'EMPRESTADO', updated_at = now()
 where id in (select equipment_id from novos);

commit;

-- Conferencia
select e.patrimonio, e.status, l.due_at
  from equipment e left join loans l on l.equipment_id = e.id and l.returned_at is null
  join tenants t on t.id = e.tenant_id where t.slug = 'suporte_ti' order by e.patrimonio;
