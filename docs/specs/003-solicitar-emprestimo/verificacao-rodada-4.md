# Verificação 003-solicitar-emprestimo — rodada 4

Data: 2026-11-09
HEAD raiz: 36c7d9e3f0afe73ee0376cb3856ce0f3794c662c
HEAD front: 3e1133778098eccd40be1af18f635a02f7ca81f5
HEAD back: 49900af796cf70ead6862f3b8f0eddb1b2d0b6a0
Intervalos: raiz 221c469..HEAD · front e1a8475..HEAD · back 52c13d2..HEAD
Árvore: limpa (raiz, front e back sem modificação nem arquivo novo; este arquivo é criado depois da conferência)

Critério: ATENDIDO só quando a prova exigida pela spec existe e passou. Código igual ao da rodada 3; mudou a prova. Abri os 5 prints de produção (Read de imagem). Tipo de prova por CA: teste = automatizado (Jest/Testcontainers); print; saída colada = resultado de SQL informado pelo operador em evidencias-producao.md; declaração = só palavra do operador.

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO | teste: back/src/modules/equipment/equipment.controller.spec.ts:20 (também :41, :65, :93). npm test passou |
| CA-02 | REPROVADO | print: docs/evidencias/003-prod-catalogo.png mostra 6 dos 12 cards (TI-0001 a 0003 completos, 3 cortados), foto 4:3 igual, nome, categoria, patrimônio, pill; 003-prod-rodape.png mostra TI-0010 a 0012. Os cards TI-0004 a 0009 não aparecem completos em print nenhum, e o caso do quadro neutro sem foto não tem print (os 12 têm foto). A spec pede os 12 cards: prova incompleta |
| CA-03 | ATENDIDO | teste: back/src/modules/equipment/equipment.controller.spec.ts:74 |
| CA-04 | SEM TESTE | print ausente (003-local-ca04-*.png não existem). Em produção há TI-0010 "Em manutenção"/"Indisponível" (003-prod-rodape.png) e TI-0001 "Está com você · devolução prevista até 23/11/2026" com botão desabilitado (003-prod-ca19-resultado.png), mas falta o caso EMPRESTADO de outra pessoa ("Emprestado · devolução prevista até…", sem nome), que só existe nos prints locais pendentes |
| CA-05 | ATENDIDO | teste: back/src/modules/loans/loans.controller.spec.ts:29. Reforço em produção: saída colada (total_emprestimos 1, disponivel 8) |
| CA-06 | ATENDIDO | teste: loans.controller.spec.ts:46 |
| CA-07 | ATENDIDO | teste: loans.controller.spec.ts:59 |
| CA-08 | ATENDIDO | teste: loans.controller.spec.ts:79 e :94 |
| CA-09 | ATENDIDO | teste: loans.controller.spec.ts:102 e :115 (:136 ordem Q12) |
| CA-10 | ATENDIDO | teste: back/src/modules/loans/loans.concurrency.spec.ts:26 |
| CA-11 | ATENDIDO | teste: loans.concurrency.spec.ts:39 e :50 |
| CA-12 | ATENDIDO | teste: loans.concurrency.spec.ts:65 |
| CA-13 | ATENDIDO | teste: equipment.controller.spec.ts:105 e :116; loans.controller.spec.ts:144, :158, :288; tenant.guard.spec.ts:44 |
| CA-14 | ATENDIDO | teste: equipment.controller.spec.ts:127; loans.controller.spec.ts:169, :299; tenant.guard.spec.ts:55, :60, :65 |
| CA-15 | ATENDIDO | teste: loans.controller.spec.ts:226, :253, :265 |
| CA-16 | ATENDIDO | teste: loans.controller.spec.ts:180 e equipment.controller.spec.ts:138; back/src/common/clock.spec.ts |
| CA-17 | ATENDIDO | teste: loans.controller.spec.ts:191 |
| CA-18 | ATENDIDO | teste: loans.controller.spec.ts:205. Reforço em produção: auditorias_loan_open = 2 (saída colada; inclui o do professor, ver CA-24) |
| CA-19 | ATENDIDO | print (produção, conta de teste, 09/11/2026; prints locais dispensados pelo operador): docs/evidencias/003-prod-ca19-modal.png (modal "Solicitar empréstimo", Notebook 14 polegadas, "Devolver até 23/11/2026"), 003-prod-ca19-resultado.png (toast "Empréstimo registrado: Notebook 14 polegadas. Devolver até 23/11/2026.", card TI-0001 "Está com você · devolução prevista até 23/11/2026" com botão "Está com você" desabilitado, contagem 9 para 8) e 003-prod-meus.png (item TI-0001 em Meus empréstimos). Observações: toast e resultado estão no mesmo print; que a data do modal vem da API não se vê no print (vem do código, R8), mas coincide com o resultado e com due_at 2026-11-23 da saída colada |
| CA-20 | SEM TESTE | print ausente: os três (limite, atraso com banner, recusa 409) não existem; atraso só se reproduz no banco local |
| CA-21 | REPROVADO | print: docs/evidencias/003-prod-meus.png cobre só o caso de 1 empréstimo ("1 de 3 itens em seu nome · prazo padrão de 14 dias", barra com 1 traço ocupado e 2 vazios, linha "Em dia", sem botão "Devolver"). A spec pede também sem empréstimo (vazio com "Ir ao catálogo"), com 3 e com atraso (cor vermelha): 003-local-ca21-*.png não existem. Prova parcial |
| CA-22 | ATENDIDO | print: docs/evidencias/003-prod-rodape.png ("Fotos: Pixabay", Pixabay sublinhado como link); busca de texto: placeholder inexistente em front/src (rc=1); href https://pixabay.com em front/src/pages/CatalogoPage.tsx:119 (vem do código, não se vê no print) |
| CA-23 | SEM TESTE | print ausente (003-local-ca23-*.png não existem). Em produção só se vê "9 de 12 equipamentos disponíveis agora" sem filtro (003-prod-catalogo.png): não prova busca nem chips exclusivos |
| CA-24 | AMBÍGUO | Parte automática ATENDIDA (buscas abaixo). Parte de produção: saída colada do operador (evidencias-producao.md, passo 6: professor 0 empréstimos, 9 DISPONIVEL, 3 MANUTENCAO, 0 empréstimos) cumpre o texto literal do CA, mas: (a) a consulta rodada é a composta, não literalmente o count(*) da spec (equivalente, coluna emprestimos_do_professor); (b) é resultado informado, sem print; (c) a R14 (nunca a conta do professor) foi desrespeitada: houve um loan.open do professor (auditorias_loan_open = 2, permanece, append-only), o SQL da limpeza dele não foi registrado e a R14 não tem imposição técnica. O CA fala só do estado final; a spec não diz se o desvio da R14 invalida. Falta decidir: o estado final basta, ou o desvio reprova? Não interpreto |
| CA-25 | ATENDIDO | busca de texto: sem ocorrência em AGENTS.md e rules/ (rc=1) |
| CA-26 | ATENDIDO | busca de texto: sem ocorrência em front/src (rc=1) |

## Buscas de texto (rodadas por mim)
- CA-25: grep dos termos 003-catalogo, 002-catalogo, "Tarefa 9 da 003" e MeusEmprestimos.tsx em AGENTS.md e rules/ → sem resultado (rc=1).
- CA-26 e CA-22 (placeholder): grep de HOJE_DEMO, new Date( e "chega na próxima fatia" (com e sem acento) em front/src → sem resultado (rc=1).
- CA-24 (automática): *.spec.ts de back/src só têm URLs falsas (localhost:5432, localhost:54321); back/src/testing/app.ts:4 só tem comentário; nenhum supabase.co nem leitura de .env. DATABASE_URL em código de produção só em src/config/env.ts e src/modules/prisma/prisma.service.ts. Não li .env nem .env.remote; não escrevi em produção.

## Tipo de prova por CA
- Teste automatizado: CA-01, 03, 05 a 18.
- Print de produção: CA-19, CA-22 (e parte de CA-02, CA-04, CA-21, que ficam incompletos).
- Saída de SQL colada pelo operador: CA-24 (parte de produção; reforço em CA-05 e CA-18).
- Declaração do operador: dispensa dos prints locais do CA-19; a limpeza do professor (SQL não registrado).
- Busca de texto rodada por mim: CA-25, CA-26, parte automática do CA-24, placeholder do CA-22.
- Pendentes (print local inexistente): CA-04 (parcial), CA-20, CA-21 (parcial), CA-23; CA-02 (parcial, 12 cards).

Checks: back npm run build → passou (exit 0)
Checks: back npm test → passou (14 suítes, 80 testes, "Ran all test suites.")
Checks: back npm run lint → não existe
Checks: front npm run build → passou (exit 0; aviso de chunk, não é erro)
Checks: front lint, typecheck, test → não existem
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-02 e CA-21 com prova parcial, CA-04, CA-20 e CA-23 sem print e CA-24 ambíguo (R14 desrespeitada); CA-01, 03, 05 a 19, 22, 25 e 26 atendidos
