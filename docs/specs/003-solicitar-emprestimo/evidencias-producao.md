# Evidências de produção — 003-solicitar-emprestimo

Roteiro do **operador**. O agente não executa nada disto (rules/restrictions.md, "Produção"): ele só
preparou os comandos. Nenhum valor de segredo aqui; cole só contagens, status e saídas curtas,
**nunca** senha, chave, token nem URL de banco. Em produção só se faz **um** pedido de **um** item,
com a **conta de teste** (a criada pela 002 em `SEED_TESTE_EMAIL`), e **nunca** com
`marcelo.grilo@institutojef.org.br`. Limite de 3 e atraso foram provados no banco local (CA-07, CA-08,
CA-20) e não se reproduzem em produção sem SQL de escrita.

Data da execução: 09/11/2026   Quem executou: o operador, com a conta de teste (ragusasophi@gmail.com). Registrado pelo agente a partir do que o operador informou; o agente viu os cinco prints e não acessou produção.

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
- [x] Prints: `docs/evidencias/003-prod-catalogo.png` e `docs/evidencias/003-prod-rodape.png`. O de catálogo mostra "9 de 12 equipamentos disponíveis agora", os 4 chips, o e-mail da conta de teste e **6 dos 12 cards** (TI-0001 a TI-0003 com foto, e o início de outros três); o de rodapé mostra TI-0010 ("Em manutenção", "Indisponível"), TI-0011 e TI-0012 e o texto "Fotos: Pixabay" com o link sublinhado. Os 12 cards não aparecem juntos em um só print.

## 2. Um pedido, de um item (CA-05, CA-19)
**Estes prints são a prova do CA-19**: o operador dispensou os prints locais equivalentes em 09/11/2026.
Clique em "Solicitar" em **um** equipamento disponível (sugestão: o de menor patrimônio) e confirme.
Esperado: modal com "Devolver até" = hoje + 14, toast de confirmação, e o card passa a "Está com você".
- [x] Equipamento pedido: TI-0001 (Notebook 14 polegadas)   "Devolver até" mostrado: 23/11/2026
- [ ] Prints: `docs/evidencias/003-prod-ca19-modal.png` (modal aberto, antes de confirmar) e `docs/evidencias/003-prod-ca19-resultado.png` (toast "Empréstimo registrado…"; se perder o toast, rode a limpeza do passo 5 e repita o pedido, ou registre o card "Está com você"): existem os dois. O modal mostra o equipamento e "Devolver até 23/11/2026"; o resultado mostra o toast "Empréstimo registrado: Notebook 14 polegadas. Devolver até 23/11/2026.", o card com a pill "Emprestado", "Está com você · devolução prevista até 23/11/2026" e "8 de 12 equipamentos disponíveis agora".

## 3. Meus empréstimos (CA-21)
Esperado: "1 de 3 itens em seu nome · prazo padrão de 14 dias", uma linha "Em dia", sem botão "Devolver".
- [x] Print em `docs/evidencias/003-prod-meus.png`: "1 de 3 itens em seu nome · prazo padrão de 14 dias", barra com 1 traço ocupado, linha de Notebook 14 polegadas (TI-0001), Retirada 09/11/2026, Devolver até 23/11/2026, pill "Em dia", sem botão "Devolver".

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
- [x] **Depois do pedido** (passo 2), esperado: `12 | 8 | 3 | 1 | 1 | 0 | 1`. Resultado informado pelo operador, com 5 colunas: `total | disponivel | manutencao | total_emprestimos | emprestimos_do_professor` = `12 | 8 | 3 | 1 | 0`. (A consulta rodada não trouxe as colunas `emprestado` e `auditorias_loan_open`.)

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
- [x] 5.1 (antes da limpeza), 1 linha: patrimônio TI-0001, status EMPRESTADO, `opened_at` 2026-11-09 21:41:50 UTC, `due_at` 2026-11-23, e-mail da conta de teste.
- [x] 5.2 (limpeza em transação): "Success. No rows returned". O editor não mostra linhas afetadas; o efeito está provado pela consulta final do passo 6.

## 6. Confirmação final (CA-24): 9 DISPONIVEL, 3 MANUTENCAO, 0 empréstimos do professor
Rode de novo a consulta do passo 4. Esperado: `12 | 9 | 3 | 0 | 0 | 0 | 1` (a auditoria do pedido
permanece: 1). **Veio 2** por causa do engano registrado abaixo.
- [x] Resultado informado pelo operador: `total_equipamentos` 12 · `disponivel` 9 · `manutencao` 3 · `emprestado` 0 ·
  `total_emprestimos` 0 · `emprestimos_do_professor` 0 · `auditorias_loan_open` 2
- [ ] O professor entra e vê Meus empréstimos vazio (opcional, sem pedir nada): não informado

## Nota do operador: o professor teve um empréstimo por engano (desvio da R14)
Segundo o operador, **antes** do teste com a conta de teste, o TI-0001 ficou emprestado, por engano, à
conta do professor (`marcelo.grilo@institutojef.org.br`). Ele limpou no SQL (o texto do SQL usado
nessa limpeza não foi registrado) e o professor voltou a **0 empréstimos**, confirmado na consulta final
(`emprestimos_do_professor` = 0). Por isso `auditorias_loan_open` = 2: uma do professor e uma da conta
de teste; as duas **permanecem**, porque `audit_logs` é append-only. O agente não tem como conferir
essa parte além da consulta final. Isto contraria a R14 ("nunca com a do professor"): o **estado final**
cumpre o CA-24, mas o histórico de auditoria em produção guarda um `loan.open` do professor.

## Resultado por CA
| CA | Atendido em produção? | Onde está a prova |
|---|---|---|
| CA-02 | Parcial: print com o cabeçalho e 6 dos 12 cards, mais o rodapé com os 3 últimos; os 12 não aparecem juntos | 1 |
| CA-05 | Sim: TI-0001 pedido, `total_emprestimos` 1, `disponivel` 8 (resultado informado) | 2, 4 e 5.1 |
| CA-19 | Sim: modal com "Devolver até 23/11/2026", toast e card "Está com você" | 2 (prints de produção; os locais foram dispensados pelo operador em 09/11/2026) |
| CA-21 | Parcial: só o caso de 1 empréstimo em produção; vazio, 3 e atraso são dos prints locais (pendentes) | 3 |
| CA-22 | Sim: rodapé "Fotos: Pixabay" com link; o placeholder não existe (busca de texto) | 1 |
| CA-24 | Sim no estado final (professor com 0 empréstimos, 9 DISPONIVEL, 3 MANUTENCAO); com o desvio da nota acima | 4, 5 e 6 |
