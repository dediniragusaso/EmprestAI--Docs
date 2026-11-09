# Verificação 003-solicitar-emprestimo — rodada 5

Data: 2026-11-09
HEAD raiz: f686008d2f36654f65326bad7b279c5cc04c5b33
HEAD front: 3e1133778098eccd40be1af18f635a02f7ca81f5
HEAD back: 49900af796cf70ead6862f3b8f0eddb1b2d0b6a0
Intervalos: raiz 221c469..HEAD · front e1a8475..HEAD · back 52c13d2..HEAD
Árvore: limpa (raiz, front e back sem modificação nem arquivo novo; este arquivo é criado depois da conferência)

Critério: ATENDIDO só quando a prova exigida pela spec existe e passou; nada relaxado. Código igual ao das rodadas 3 e 4; mudou a prova. Abri (Read de imagem) os 7 prints novos e o 003-prod-catalogo-2.png. Tipo de prova: teste = automatizado (Jest/Testcontainers); print = captura do operador; saída colada = SQL informado pelo operador (evidencias-producao.md); decisão = do operador; busca = rodada por mim.

| CA | veredito | evidência |
|---|---|---|
| CA-01 | ATENDIDO | teste: back/src/modules/equipment/equipment.controller.spec.ts:20 (também :41, :65, :93) |
| CA-02 | ATENDIDO | print: docs/evidencias/003-prod-catalogo-2.png mostra os 12 cards (TI-0001 a TI-0012) com foto de mesmo tamanho 4:3, categoria, nome, patrimônio e pill (Disponível/Em manutenção). Reduzido, mas legível; 003-prod-catalogo.png e 003-prod-rodape.png complementam. Sem print do quadro neutro sem foto (os 12 itens têm foto; a spec pede "print do catálogo com as fotos carregadas") |
| CA-03 | ATENDIDO | teste: equipment.controller.spec.ts:74 |
| CA-04 | ATENDIDO | print: 003-prod-rodape.png e 003-prod-catalogo-2.png (MANUTENCAO: pill "Em manutenção", texto "Em manutenção", botão "Indisponível" desabilitado); 003-local-ca04-emprestado-outra-pessoa.png (TI-0001 "Emprestado · devolução prevista até 23/11/2026", botão "Emprestado" desabilitado, sem nome de pessoa); 003-prod-ca19-resultado.png e 003-local-ca21-tres.png ("Está com você · devolução prevista até 23/11/2026") |
| CA-05 | ATENDIDO | teste: back/src/modules/loans/loans.controller.spec.ts:29 |
| CA-06 | ATENDIDO | teste: loans.controller.spec.ts:46 |
| CA-07 | ATENDIDO | teste: loans.controller.spec.ts:59 |
| CA-08 | ATENDIDO | teste: loans.controller.spec.ts:79 e :94 |
| CA-09 | ATENDIDO | teste: loans.controller.spec.ts:102 e :115 |
| CA-10 | ATENDIDO | teste: back/src/modules/loans/loans.concurrency.spec.ts:26 |
| CA-11 | ATENDIDO | teste: loans.concurrency.spec.ts:39 e :50 |
| CA-12 | ATENDIDO | teste: loans.concurrency.spec.ts:65 |
| CA-13 | ATENDIDO | teste: equipment.controller.spec.ts:105 e :116; loans.controller.spec.ts:144, :158, :288; tenant.guard.spec.ts:44 |
| CA-14 | ATENDIDO | teste: equipment.controller.spec.ts:127; loans.controller.spec.ts:169, :299; tenant.guard.spec.ts:55, :60, :65 |
| CA-15 | ATENDIDO | teste: loans.controller.spec.ts:226, :253, :265 |
| CA-16 | ATENDIDO | teste: loans.controller.spec.ts:180; equipment.controller.spec.ts:138; back/src/common/clock.spec.ts |
| CA-17 | ATENDIDO | teste: loans.controller.spec.ts:191 |
| CA-18 | ATENDIDO | teste: loans.controller.spec.ts:205 |
| CA-19 | ATENDIDO | print (produção, conta de teste): 003-prod-ca19-modal.png, 003-prod-ca19-resultado.png, 003-prod-meus.png |
| CA-20 | SEM TESTE | A spec pede três prints. Limite: 003-local-ca21-tres.png (nome diz CA-21, mostra o Catálogo com 3 "Está com você" e "Limite de 3 itens" nos disponíveis) existe. Atraso: 003-local-ca20-atraso.png (banner vermelho "Você tem um empréstimo em atraso…", "Bloqueado por atraso") existe. Recusa 409 vinda da API em texto na tela: print inexistente (índice e spec admitem SEM PROVA, por prazo do operador). Prova exigida incompleta |
| CA-21 | SEM TESTE | Existem 003-prod-meus.png (1 item, "Em dia", sem "Devolver") e 003-prod-ca21-vazio.png ("0 de 3 itens em seu nome · prazo padrão de 14 dias", barra de 3 traços vazios, caixa tracejada "Ir ao catálogo"). Faltam Meus empréstimos com 3 itens e com atraso (cor vermelha): sem print (o arquivo 003-local-ca21-tres.png mostra o Catálogo, não Meus empréstimos). Prova exigida incompleta |
| CA-22 | ATENDIDO | print: 003-prod-rodape.png, 003-prod-ca23-busca.png ("Fotos: Pixabay" com link sublinhado); busca: placeholder inexistente em front/src; href pixabay.com em front/src/pages/CatalogoPage.tsx:119 |
| CA-23 | ATENDIDO | print (produção): 003-prod-ca23-busca.png ("monitor" minúsculo filtra só Monitor 24, 27 e 22 polegadas; contagem "9 de 12" mantida); 003-prod-ca23-chip.png (chip "Em manutenção" ativo, só os outros inativos, mostra TI-0004, 0007, 0010); 003-prod-catalogo-2.png (sem filtro: "9 de 12" e 9 cards com "Solicitar"). Limites: sem print de busca por patrimônio nem de maiúscula; a spec pede "Print" |
| CA-24 | ATENDIDO | buscas: *.spec.ts e back/src/testing só têm URLs falsas (localhost), sem supabase.co nem leitura de .env; DATABASE_URL em produção só em config/env.ts e modules/prisma/prisma.service.ts (config/env.spec.ts e jwt-verifier.service.spec.ts são spec, com URL falsa). Produção: saída colada do operador (evidencias-producao.md): professor 0 empréstimos, 9 DISPONIVEL, 3 MANUTENCAO. Desvio da R14 (professor com empréstimo, limpo por SQL) não reprova, por decisão do operador, registrada na spec "Estado da entrega". Consulta é a composta, não literalmente o count(*) da spec |
| CA-25 | ATENDIDO | busca: 003-catalogo, 002-catalogo, "Tarefa 9 da 003" e MeusEmprestimos.tsx sem ocorrência em AGENTS.md e rules/ (só rules/qualidade-codigo.md:73 cita MeusEmprestimosPage.tsx, já acertado) |
| CA-26 | ATENDIDO | busca: HOJE_DEMO, new Date( e "próxima fatia" sem ocorrência em front/src |

## Tipo de prova por CA
- Teste automatizado: CA-01, 03, 05 a 18.
- Print de produção: CA-02, 19, 22, 23; parte de CA-04, CA-21.
- Print local: parte de CA-04, CA-20 (limite e atraso).
- Saída de SQL colada pelo operador + decisão do operador: CA-24 (parte de produção).
- Busca de texto rodada por mim: CA-25, CA-26, parte automática de CA-24, placeholder de CA-22.
- Sem prova: CA-20 (recusa 409 em texto); CA-21 (3 itens e atraso em Meus empréstimos).

Checks: back npm test → passou (14 suítes, 80 testes, "Ran all test suites.")
Checks: back npm run build → passou
Checks: back npm run lint → não existe
Checks: front npm run build → passou (aviso de chunk, não é erro)
Checks: front lint, typecheck, test → não existem
Fora de escopo: nada encontrado

Veredito: NÃO PRONTA — CA-20 sem print da recusa 409 em texto e CA-21 sem print de Meus empréstimos com 3 itens e com atraso (prova exigida pela spec não existe)
