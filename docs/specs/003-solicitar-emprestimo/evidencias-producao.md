# Evidências de produção — 003-solicitar-emprestimo

Roteiro do **operador**. O agente não executa nada disto (rules/restrictions.md, "Produção"): ele só
preparou os comandos. Nenhum valor de segredo aqui; cole só contagens, status e saídas curtas,
**nunca** senha, chave, token nem URL de banco. Em produção só se faz **um** pedido de **um** item,
com a **conta de teste** (a criada pela 002 em `SEED_TESTE_EMAIL`), e **nunca** com
`marcelo.grilo@institutojef.org.br`. Limite de 3 e atraso foram provados no banco local (CA-07, CA-08,
CA-20) e não se reproduzem em produção sem SQL de escrita.

Data da execução: ____/____/______   Quem executou: ______________________

## 0. Antes de começar
- [ ] O `back/` e o `front/` com os commits da 003 foram publicados (push é seu: o agente não fez).
- [ ] O projeto da Vercel do **back** tem a variável `DATABASE_URL` (a 003 a exige no boot; sem ela
  a API não sobe). Confira só que existe; não cole o valor.
- [ ] Estado inicial conferido com a consulta do passo 4 (esperado: 9 DISPONIVEL, 3 MANUTENCAO, 0
  empréstimos).

## 1. Login e catálogo (CA-02, CA-22)
Abra o front publicado (`https://emprest-ai-six.vercel.app`), entre com a **conta de teste** e vá a
**Catálogo**. Esperado: 12 cards com foto, "9 de 12 equipamentos disponíveis agora", rodapé "Fotos:
Pixabay" com link.
- [ ] Prints: `docs/evidencias/003-prod-catalogo.png` (12 cards) e `docs/evidencias/003-prod-rodape.png` (rodapé "Fotos: Pixabay"): ____

## 2. Um pedido, de um item (CA-05, CA-19)
**Estes prints são a prova do CA-19**: o operador dispensou os prints locais equivalentes em 09/11/2026.
Clique em "Solicitar" em **um** equipamento disponível (sugestão: o de menor patrimônio) e confirme.
Esperado: modal com "Devolver até" = hoje + 14, toast de confirmação, e o card passa a "Está com você".
- [ ] Equipamento pedido (patrimônio): ____   "Devolver até" mostrado: ____
- [ ] Prints: `docs/evidencias/003-prod-ca19-modal.png` (modal aberto, antes de confirmar) e `docs/evidencias/003-prod-ca19-resultado.png` (toast "Empréstimo registrado…"; se perder o toast, rode a limpeza do passo 5 e repita o pedido, ou registre o card "Está com você"): ____

## 3. Meus empréstimos (CA-21)
Esperado: "1 de 3 itens em seu nome · prazo padrão de 14 dias", uma linha "Em dia", sem botão "Devolver".
- [ ] Print em `docs/evidencias/003-prod-meus.png`: ____

## 4. Conferência no SQL Editor do Supabase (somente leitura)
```sql
select
  (select count(*) from equipment e join tenants t on t.id = e.tenant_id
     where t.slug = 'suporte_ti')                                         as total_equipamentos,
  (select count(*) from equipment e join tenants t on t.id = e.tenant_id
     where t.slug = 'suporte_ti' and e.status = 'DISPONIVEL')             as disponivel,
  (select count(*) from equipment e join tenants t on t.id = e.tenant_id
     where t.slug = 'suporte_ti' and e.status = 'MANUTENCAO')             as manutencao,
  (select count(*) from equipment e join tenants t on t.id = e.tenant_id
     where t.slug = 'suporte_ti' and e.status = 'EMPRESTADO')             as emprestado,
  (select count(*) from loans)                                            as total_emprestimos,
  (select count(*) from loans l join users u on u.id = l.user_id
     where u.email = 'marcelo.grilo@institutojef.org.br')                 as emprestimos_do_professor,
  (select count(*) from audit_logs where action = 'loan.open')            as auditorias_loan_open;
```
- [ ] **Depois do pedido** (passo 2), esperado: `12 | 8 | 3 | 1 | 1 | 0 | 1`. Resultado: ____

## 5. Limpeza (você executa; o agente não)
Os testes deixam um item `EMPRESTADO` que o app ainda não sabe devolver (a devolução é de outra
fatia). Rode **no SQL Editor** (troque só o e-mail da conta de teste). Primeiro confira o que será
apagado; depois execute o bloco em transação. A linha de `audit_logs` do pedido **fica** (a
auditoria é append-only e não tem FK para o empréstimo).

```sql
-- 5.1 CONFIRA antes de apagar: deve listar só o(s) empréstimo(s) da conta de teste.
select l.id, e.patrimonio, e.status, l.opened_at, l.due_at, u.email
  from loans l
  join users u on u.id = l.user_id
  join equipment e on e.id = l.equipment_id
 where u.email = '<EMAIL-DA-CONTA-DE-TESTE>' and l.returned_at is null;
```
```sql
-- 5.2 LIMPEZA (só depois de conferir o 5.1; o e-mail aparece duas vezes).
begin;
update equipment
   set status = 'DISPONIVEL', updated_at = now()
 where status = 'EMPRESTADO'
   and id in (select l.equipment_id from loans l join users u on u.id = l.user_id
               where u.email = '<EMAIL-DA-CONTA-DE-TESTE>' and l.returned_at is null);
delete from loans
 where returned_at is null
   and user_id = (select id from users where email = '<EMAIL-DA-CONTA-DE-TESTE>');
commit;
```
- [ ] Limpeza executada. Linhas afetadas (update / delete): ____ / ____

## 6. Confirmação final (CA-24): 9 DISPONIVEL, 3 MANUTENCAO, 0 empréstimos do professor
Rode de novo a consulta do passo 4. Esperado: `12 | 9 | 3 | 0 | 0 | 0 | 1` (a auditoria do pedido
permanece: 1).
- [ ] Resultado: `total_equipamentos` ____ · `disponivel` ____ · `manutencao` ____ · `emprestado` ____ ·
  `total_emprestimos` ____ · `emprestimos_do_professor` ____ · `auditorias_loan_open` ____
- [ ] O professor entra e vê Meus empréstimos vazio (opcional, sem pedir nada): ____

## Resultado por CA
| CA | Atendido em produção? | Onde está a prova |
|---|---|---|
| CA-02 | | 1 |
| CA-05 | | 2 e 4 |
| CA-19 | | 2 (prints de produção; os locais foram dispensados pelo operador em 09/11/2026) |
| CA-21 | | 3 |
| CA-22 | | 1 |
| CA-24 | | 4 e 6 |
