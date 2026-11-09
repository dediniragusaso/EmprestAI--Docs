# Notas para o ENTREGA.md (rascunho vivo)
Linguagem impersonal. Cada item aponta para evidência verificável.

## Seção 1 · Conflitos
| pedido | contrariava | o que foi feito | por quê | registro | commit |
|---|---|---|---|---|---|
| Verificador corrige teste (tech lead) | requisito de independência; rules/spec-flow.md | Recusado | O verificador não corrige; quem corrige é o agente principal | .claude/agents/verificador-spec.md | fc42860 |
| Agente cria usuário no Auth remoto (permitido em rules/restrictions.md) | Enunciado: o agente nunca escreve em produção | Permissão removida; "produção" definida como banco, Storage e Auth do deploy | A escrita em produção é do operador | rules/restrictions.md | c45aa18 |
| Pexels trocado por Pixabay (orientação do professor) | Enunciado: "só a API do Pexels" | Seguida a orientação | Pixabay exigido pelo professor; evidência da orientação: [anexar print] | skill imagens-equipamentos; docs/evidencias/orientacao-pixabay.md | 6ace99b (skill, raiz); 769cc9c (evidência) |
| Busca alterada de 8 equipamentos (TI-0001, 0003, 0004, 0005, 0006, 0007, 0011 e 0012) | Pedido: "usar exatamente esta lista" de equipamentos | Alterado só o campo `busca` desses 8 itens; a original foi preservada em `buscaOriginal`. Numa segunda rodada, nova troca de `busca` dos 6 que seguiam sem foto (TI-0003, 0004, 0006, 0007, 0011, 0012), com a mesma `buscaOriginal` | As buscas originais não produziram foto aprovável (marca ou logo legível, pessoa, texto, tela com conteúdo, fora de tema) | back/scripts/imagens-equipamentos/equipamentos.json; back/scripts/imagens-equipamentos/revisao.json | 8607551 e ec487f5 (busca); 75d8e5a e aee6656 (revisao.json), repo back |
| Escolha manual de 4 fotos por id do Pixabay (2917533, 4795762, 7223054, 3036166) | Fluxo da skill: foto escolhida pela busca da lista | Consultadas pela API do Pixabay por id e triadas em 800x600. 1ª rodada: 2917533 (teclado com texto legível), 4795762 (tela com conteúdo) e 7223054 (logo "YI" legível) descartadas, e 3036166 (notebook genérico) não usada por caber em mais de um equipamento. 2ª rodada: o operador decidiu aplicar 3036166 em TI-0003 e 5641391 em TI-0004, via `--escolher`, depois de nova triagem em 800x600 (5641391 com ressalva: letras das teclas só legíveis com ampliação; a reserva 2300686 ficou pior, com marcas de cartão na carteira) | Regra do pedido: foto com marca, texto, tela com conteúdo ou que cabe em mais de um equipamento não se usa, salvo decisão do operador | .claude/skills/imagens-equipamentos/SKILL.md; back/scripts/imagens-equipamentos/preparar.mjs | af52930 (`--escolher` por id na API, repo back); 7cf2858 (SKILL.md, raiz); o arquivo das fotos fica em back/.preparo-imagens/, ignorado pelo git |
| Briefing cita 2 equipamentos em manutenção (C1) | Enunciado: "usar exatamente esta lista", que marca 3 (TI-0004, TI-0007, TI-0010) | Valem os 3 da lista | O enunciado manda usar exatamente a lista; o PRD diz que item em manutenção não aparece como disponível | docs/specs/002-dados-iniciais/spec.md (C1, R1) | c2ff42a |
| Seed passa a criar equipamentos e usuário (C2) | docs/modelagem-banco.md §9 ("Nada além disso") e linha "Seed" do ADR-001 | O seed existente (`back/prisma/seed.ts`) não é alterado e segue só criando o tenant; os dados iniciais ficam em script separado, `back/prisma/dados-iniciais.ts`, com `npm run db:dados-iniciais` | Elimina o conflito sem reescrever documento aprovado | docs/specs/002-dados-iniciais/spec.md (C2, R9, CA-14) | c2ff42a |
| Conta do professor criada fora do convite (C3) | ADR-001 §7: cadastro fechado, somente por convite de administrador | Exceção desta prática: a conta do professor é criada pelo script, pela API admin do Auth; o fluxo de convite continua não decidido | O professor precisa entrar e o convite não está definido | docs/specs/002-dados-iniciais/spec.md (C3, Q10) | c2ff42a |
| Decisões do operador sobre a spec 002: Q1 (equipamento existente: atualiza nome, categoria e imagem, nunca o `status`), Q2 (unique de imagem por tenant, `(tenantId, imagePixabayId)`), Q6 (Jest e Testcontainers com Auth simulado; Auth real provado em produção pelo login do professor) | n/a (decisões em aberto da spec) | Incorporadas à spec, ao plano e às tarefas; Testcontainers instalado em versão fixa 12.0.4 (a 12.1.0 em diante exige Node >= 22.22) | `status` muda com os empréstimos da 003; o Postgres do Testcontainers não tem o schema `auth` | docs/specs/002-dados-iniciais/ (R2, R5, R10); back/package.json | c2ff42a (raiz); 761867f (back) |
| Limite 5, 14 dias úteis, sharp, senha no `back/.env` (ignorado pelo git), crédito do catálogo, TI-0010 | PRD, ADR-003, rules, enunciado | Decididos. A linha dizia "senha no arquivo": **corrigida**, é o `back/.env`, ignorado pelo git (Q14), e a R4 da spec 002 vale. Registrados: sharp no ADR-004; senha (R4) e TI-0010 em manutenção (C1) na spec 002. Seguem para a spec 003: limite 5, 14 dias úteis e crédito do catálogo (Q15, Q9) | Evitar senha em arquivo versionado | docs/adr/004-biblioteca-de-imagem.md; docs/specs/002-dados-iniciais/spec.md | 3593277 (ADR-004); c2ff42a (spec 002) |

## Seção 2 · Onde o agente tentou decidir
- Convenção `Status: PRONTA` criada pelo agente sem estar escrita (reportada por ele) | commit 8169e71
- Frase extra em rules/restrictions.md além do pedido (reportada por ele) | commit c45aa18
- O agente criou a convenção do hook e, ao ser testada, barrava todo push por uma spec fora da prática; escopo corrigido | commit 3f39782
- Num teste de `--posicao`, o `preparar` rodou sem `--pular` para TI-0011 e TI-0012 e escolheu foto sozinho, contra a instrução de não aplicar nenhuma; o agente notou na tabela do `validar` (ids 3480569 e 551287) e desfez com `--pular`. Sem commit: as fotos ficam em área ignorada pelo git (reportado pelo agente)

## Seção 3 · Candidata a ADR
- Mecanismo para tornar o verificador obrigatório: hook do harness, git hook ou CI (alternativas e limitações levantadas pelo agente). Decidir se virou ADR.
- ADR da biblioteca de imagem (Pixabay não entrega 800x600): escrito pelo time, docs/adr/004-biblioteca-de-imagem.md | commit 3593277
- **A decisão que virou ADR é a 004 (biblioteca de imagem).** As decisões desta prática sobre a spec 002 (C1, C2, C3, Q1, Q2, Q6, Q14) ficaram registradas na spec, não em ADR. O C2 foi resolvido justamente para não contrariar a tabela do ADR-001 nem a modelagem §9; o C3 **é** uma exceção declarada pelo operador ao ADR-001 §7 (cadastro por convite), limitada a esta prática, e o fluxo de convite segue não decidido | docs/specs/002-dados-iniciais/spec.md | commit c2ff42a

## Seção 4 · Imagens dos equipamentos (revisão humana e entrega)
- Revisão humana até agora: 8 fotos aprovadas (TI-0001, 0002, 0005, 0006, 0007, 0008, 0009 e 0010, após revisão visual do operador) e 10 reprovadas, em 18 decisões registradas. Motivos das reprovadas (uma foto pode ter mais de um): fora de tema 4, logo legível 4, texto legível 2, pessoa 2, tela com conteúdo 1 | back/scripts/imagens-equipamentos/revisao.json | commits 75d8e5a, aee6656 e 3dacb59 (repo back)
- Contagem final: 12 fotos preparadas em 800x600 e validadas (`validar` sem erro); 8 aprovadas e 4 pendentes de revisão (TI-0003 id 3036166, TI-0004 id 5641391, TI-0011 id 1163880 e TI-0012 id 8670926), as quatro escolhidas pelo operador por id e aplicadas com `--escolher`. Reprovadas no total: 10, sem mudança nesta rodada. Para TI-0011 e TI-0012 foram examinadas 30 candidatas cada, com 5 variações de busca; as aplicadas não têm texto nem logo legível em 800x600 (conferido com ampliação: só um ícone de ligar e um indicador minúsculo na 1163880; só um ponto e reflexos na 8670926) | docs/handoffs/2026-11-09-imagens-equipamentos-parcial.md (estado anterior, 7 sem foto) | commits 96cdc70, 8607551, ec487f5, 3dacb59 e af52930 (as fotos ficam em back/.preparo-imagens/, ignorado pelo git)
- Nova opção `--posicao=<patrimonio>:<posicao>` no `preparar` (posição do recorte "cover" do sharp), documentada no SKILL.md. Verificada por comparação de pixels: só desloca o enquadramento, sem esticar (diferença média ≈1 contra a referência, 30 a 50 contra o deslocamento errado). Em fonte 3:2 a folga é de 100 px na horizontal, então só tira do quadro uma marca a menos de 50 px da borda lateral; nenhuma das 60 candidatas examinadas tinha marca nessa faixa, então a opção não resgatou nenhuma | back/scripts/imagens-equipamentos/preparar.mjs; .claude/skills/imagens-equipamentos/SKILL.md | commits af52930 (repo back) e 7cf2858 (raiz)
- Commits da etapa, repo back: sharp 0.35.5 `8e99c4a` · scripts `a883bf4` · nomes no .env.example `05459f6` · revisao.json `75d8e5a` · opções --escolher e --pular `7c6652d` · revisão da TI-0003 `aee6656` · novas buscas `8607551` · segunda troca de busca `ec487f5` · aprovações `3dacb59` · `--escolher` por id e `--posicao` `af52930`
- Commits da etapa, raiz: skill `6ace99b` · rules/secrets.md `afc3890` · SKILL.md com as opções `04f6d7a` · handoff `96cdc70` · SKILL.md com `--escolher` por id e `--posicao` `7cf2858`

## Seção 5 · Verificador
- Gatilho: hook PreToolUse (.claude/settings.json) | commits 8169e71, 3f39782
- Ferramentas: Read, Grep, Glob, Bash; sem Edit nem Write | commit fc42860
- Limitação: o Bash não restringe escrita; a barreira de ambiente cobre só o que está em permissions.deny | commit 221a8dd
- Três repositórios: um intervalo de commits por repo | commit fc42860

## Seção 6 · Verificador em ação
- Rodada 1 da 001-login: NÃO PRONTA (CA-01 a CA-10 sem teste) | commit af6d2e7 | docs/specs/001-login/verificacao-rodada-1.md
- Prova com erro plantado: a fazer na spec 002.

## Seção 7 · Regra posta à prova
- restrictions.md permitia criar usuário no Auth remoto, em conflito com o enunciado | commit c45aa18
- Paths antigos (frontend/, backend/) e globs de migration.md que deixaram de casar | commits 3a3e666, 7f63bb8
- front/ registrado como gitlink na raiz (por 63a264d, sem .gitmodules) e removido do índice | commit cc59fe0

## Seção 8 · Ficou de fora
- 001-login em aberto como dívida | commit 4f9a30b
- Front sem runner de teste; ADR 002 inexistente
- Imagens: as 12 fotos existem; TI-0003, TI-0004, TI-0011 e TI-0012 esperam a revisão do operador | commits af52930 e 3dacb59 (repo back); handoff 96cdc70
- Limitação das fotos de webcam e câmera compacta: são aproximações do tipo de equipamento. TI-0011 (Webcam Full HD) usa uma câmera de videoconferência (1163880) e TI-0012 (Câmera compacta) usa uma câmera de ação (8670926), porque o Pixabay não ofereceu, entre 30 candidatas por equipamento, foto de webcam de mesa ou de compacta convencional sem marca ou texto legível (a webcam 1219748 tem "1.3 MEGA PIXELS" na lente; as compactas trazem marca ou legendas de botões) | commit af52930 (repo back, opções `--escolher` e `--posicao`)
- Limitação do `enviar`: o teste de "repetir não duplica" não foi feito antes (Docker parado e Supabase CLI ausente, sem ambiente local); será feito no envio real, pelo operador. Até lá a idempotência é só de desenho (upsert em caminho fixo e listagem de conferência no fim), não comprovada | commit a883bf4 (repo back)
- Limitações do hook (evidência forjável; só vale no harness; trabalho não commitado não é conferido)
