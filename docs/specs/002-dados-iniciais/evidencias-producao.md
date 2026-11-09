# Evidências de produção — 002-dados-iniciais

Modelo para o **operador** preencher. O agente não executa nada disto (rules/restrictions.md,
"Produção"). Cole contagens, status e saídas; **nunca** cole senha, chave, token nem URL de banco
(a `DATABASE_URL` carrega a senha). O que o agente não consegue provar localmente está aqui:
Auth real (CA-06), Storage real (CA-02, parte do CA-04) e a contagem final no banco remoto.

Data da execução: ____/____/______   Quem executou: ______________________

## Antes de começar
Terminal aberto em `back/`. Defina as variáveis **só neste terminal** (PowerShell), com os valores
do painel do Supabase e do seu gerenciador de senhas. Os nomes:

```
$env:DATABASE_URL = '...'            # remoto, pelo pooler
$env:DIRECT_URL = '...'              # remoto, conexão direta (migration)
$env:SUPABASE_URL = '...'            # https://<ref>.supabase.co
$env:SUPABASE_SERVICE_ROLE_KEY = '...'
$env:SEED_PROFESSOR_PASSWORD = '...' # a senha do professor
```

As variáveis do terminal vencem o `back/.env`. Confira o destino sem mostrar segredo:

```
([uri]$env:SUPABASE_URL).Host
([uri]$env:DIRECT_URL).Host
```
Os dois hosts devem ser os do projeto remoto, **não** `127.0.0.1` nem `localhost`.

- [ ] Hosts conferidos: SUPABASE_URL → `________________`  DIRECT_URL → `________________`
- [ ] As fotos estão nesta máquina: `npm run imagens:validar -- --exigir-revisao` termina com
  `validar OK` (12 aprovadas). Última linha: `________________`

## 1. Migration (CA-10, no remoto)
```
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate status
```
- [ ] 1º `status` lista pendente `20261109150000_equipment_image`: ______
- [ ] `deploy`: última linha da saída: `________________`
- [ ] 2º `status`: `Database schema is up to date!`: ______

## 2. Tenant (só se faltar; idempotente)
```
npm run db:seed
```
- [ ] Saída sem erro (cole a última linha): `________________`

## 3. Fotos no Storage, duas vezes (CA-02, CA-04)
```
$env:ENVIAR_CONFIRMO_PRODUCAO = 'sim'
npm run imagens:enviar
npm run imagens:enviar
```
Esperado em cada execução: `Objetos em imagens/equipamentos: 12 (esperado 12) OK, sem duplicata`.
- [ ] 1ª execução, linha da contagem: `________________`
- [ ] 2ª execução, linha da contagem: `________________`

## 4. Dados iniciais, duas vezes (CA-01, CA-03, CA-04, CA-05, CA-07)
```
$env:DADOS_INICIAIS_CONFIRMO_PRODUCAO = 'sim'
npm run db:dados-iniciais
npm run db:dados-iniciais
```
Esperado: 1ª `equipamentos: 12 criados, 0 atualizados` e `professor: criado no Auth`; 2ª
`equipamentos: 0 criados, 12 atualizados` e `professor: ja existia no Auth`.
- [ ] 1ª execução (3 linhas `destino:`, `equipamentos:`, `professor:`): `________________`
- [ ] 2ª execução (as mesmas linhas): `________________`

Depois, **limpe a confirmação** do terminal: `Remove-Item Env:DADOS_INICIAIS_CONFIRMO_PRODUCAO, Env:ENVIAR_CONFIRMO_PRODUCAO`.

## 5. Conferências no remoto
**5.1 — URLs públicas sem login (CA-02).** Não leva cabeçalho de autorização:
```
node -e "const s=require('sharp');(async()=>{for(let i=1;i<=12;i++){const p='TI-'+String(i).padStart(4,'0');const r=await fetch(process.env.SUPABASE_URL+'/storage/v1/object/public/imagens/equipamentos/'+p+'.jpg');const m=await s(Buffer.from(await r.arrayBuffer())).metadata();console.log(p,r.status,r.headers.get('content-type'),m.width+'x'+m.height)}})()"
```
Esperado: 12 linhas `TI-00NN 200 image/jpeg 800x600`.
- [ ] Cole as 12 linhas: `________________`

**5.2 — Contagens no banco (SQL Editor do Supabase).** (CA-01, CA-03, CA-05, CA-07)
```sql
select count(*) from equipment e join tenants t on t.id = e.tenant_id where t.slug = 'suporte_ti';
select status, count(*) from equipment e join tenants t on t.id = e.tenant_id
  where t.slug = 'suporte_ti' group by status order by status;
select count(distinct image_pixabay_id) from equipment e join tenants t on t.id = e.tenant_id
  where t.slug = 'suporte_ti';
select count(*) from loans;
select u.email, m.role from users u join memberships m on m.user_id = u.id
  join tenants t on t.id = m.tenant_id
  where t.slug = 'suporte_ti' and u.email = 'marcelo.grilo@institutojef.org.br';
```
Esperado: `12`; `DISPONIVEL 9` e `MANUTENCAO 3`; `12`; `0`; uma linha com `COLABORADOR`.
- [ ] Equipamentos: ____  Situações: ____  Fotos distintas: ____  Empréstimos: ____  Professor/papel: ____

**5.3 — Login do professor (CA-06).** No front publicado, entre com `marcelo.grilo@institutojef.org.br`
e a senha, digitada à mão.
- [ ] Entrou? sim / não   O e-mail aparece na área autenticada (vem de `GET /v1/me`)? sim / não
- [ ] Observação (sem senha e sem token): `________________`

## Registro de 2026-11-09 (declaração do operador; o agente não acessou produção)
O operador autorizou o registro com o que segue. **Nenhuma saída de comando foi colada**, então nada
abaixo é saída verificada; é declaração do operador ou "a confirmar". Sem senha, chave nem URL de banco.

| Item | Situação | Origem |
|---|---|---|
| 3. `imagens:enviar` duas vezes (CA-02, CA-04) | Saída colada pelo operador (execuções de 2026-11-09 em produção): ver "Saídas coladas" abaixo, 1ª e 2ª idênticas, 12 objetos, sem duplicata | Saída colada |
| 4. `db:dados-iniciais` duas vezes (CA-01, CA-04, CA-05) | Saída colada pelo operador das duas execuções de 2026-11-09: ambas `0 criados, 12 atualizados`, pois a produção já havia sido populada antes. A primeira população (12 criados) segue como declaração do operador, sem saída | Saída colada (repetições); declaração (1ª população) |
| 5.1 12 URLs públicas (CA-02) | Saída colada pelo operador, com dimensão: ver "Saídas coladas" abaixo | Saída colada |
| 5.2 Contagens SQL (CA-01, CA-03, CA-05, CA-07) | Resultado colado pelo operador (SQL somente leitura, rodado por ele no Supabase): `total_equipamentos=12 \| disponivel=9 \| manutencao=3 \| imagens_distintas=12 \| total_emprestimos=0 \| papel_professor=COLABORADOR` | Saída colada pelo operador |
| 5.3 Login do professor (CA-06) | Login funcionando em https://emprest-ai-six.vercel.app. O print mostra "Sessão ativa como marcelo.grilo@institutojef.org.br" e o e-mail no cabeçalho. Arquivo: `docs/evidencias/002-ca06-login-professor-producao.png.jpeg` (o nome real tem a extensão dupla `.png.jpeg`). Visto pelo agente | Print no repositório |
| 1. Migration no remoto (CA-10) | `npx prisma migrate status` rodado pelo operador em `back/`: "2 migrations found in prisma/migrations" / "Database schema is up to date!" (linha do endereço do banco omitida de propósito) | Saída colada pelo operador |

## Saídas coladas pelo operador (2026-11-09, produção; sem senha, chave nem URL de banco)
**5.1 — 12 URLs públicas**
```
TI-0001 200 image/jpeg 800x600
TI-0002 200 image/jpeg 800x600
TI-0003 200 image/jpeg 800x600
TI-0004 200 image/jpeg 800x600
TI-0005 200 image/jpeg 800x600
TI-0006 200 image/jpeg 800x600
TI-0007 200 image/jpeg 800x600
TI-0008 200 image/jpeg 800x600
TI-0009 200 image/jpeg 800x600
TI-0010 200 image/jpeg 800x600
TI-0011 200 image/jpeg 800x600
TI-0012 200 image/jpeg 800x600
```
**3 — `npm run imagens:enviar`, 1ª e 2ª execução (saídas idênticas)**
```
Destino: REMOTO, confirmado pelo operador; revisao exigida
Bucket "imagens": ja existia
  equipamentos/TI-0001.jpg ... TI-0012.jpg: ok (12 linhas "ok")
Objetos em imagens/equipamentos: 12 (esperado 12) OK, sem duplicata
```
**4 — `npm run db:dados-iniciais`, 1ª e 2ª execução (saídas idênticas)**
```
destino: REMOTO confirmado pelo operador
equipamentos: 0 criados, 12 atualizados
professor: ja existia no Auth; membership COLABORADOR garantida
conta de teste: ja existia
```
Nota do operador: "0 criados" porque a produção já tinha sido populada antes; a primeira população
(12 criados) é declaração do operador, sem saída colada.

**5.2 — SQL após as repetições**
`total_equipamentos=12 | disponivel=9 | manutencao=3 | imagens_distintas=12 | total_emprestimos=0 | papel_professor=COLABORADOR`

## Resultado por CA
| CA | Atendido em produção? | Onde está a prova |
|---|---|---|
| CA-01 | Sim: 12 equipamentos, 9 DISPONIVEL e 3 MANUTENCAO (5.2); execução declarada | 4 e 5.2 |
| CA-02 | Sim: 12 URLs com 200, image/jpeg e 800x600 (saída colada) | 3 e 5.1 |
| CA-03 | Sim: 12 imagens distintas (5.2) | 5.2 |
| CA-04 | Sim: 2 execuções de `imagens:enviar` (12 objetos, sem duplicata) e 2 de `db:dados-iniciais` (0 criados, 12 atualizados), mais 5.2 após as repetições: 12 equipamentos, 12 fotos distintas. Ressalva: a 1ª população (12 criados) é só declaração | 3, 4 e 5.2 |
| CA-05 | Sim: professor com papel COLABORADOR (5.2); execução declarada | 4 e 5.2 |
| CA-06 | Sim, com print (login e e-mail na área autenticada). O print não mostra a resposta de `GET /v1/me` | 5.3 |
| CA-07 | Sim: 0 empréstimos (5.2) | 5.2 |
| CA-10 | Sim: migrate status no remoto "up to date" | 1 |
