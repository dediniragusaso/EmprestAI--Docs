# Notas para o ENTREGA.md (rascunho vivo)
Linguagem impersonal. Cada item aponta para evidência verificável.

## Seção 1 · Conflitos
| pedido | contrariava | o que foi feito | por quê | registro | commit |
|---|---|---|---|---|---|
| Verificador corrige teste (tech lead) | requisito de independência; rules/spec-flow.md | Recusado | O verificador não corrige; quem corrige é o agente principal | .claude/agents/verificador-spec.md | fc42860 |
| Agente cria usuário no Auth remoto (permitido em rules/restrictions.md) | Enunciado: o agente nunca escreve em produção | Permissão removida; "produção" definida como banco, Storage e Auth do deploy | A escrita em produção é do operador | rules/restrictions.md | c45aa18 |
| Pexels trocado por Pixabay (orientação do professor) | Enunciado: "só a API do Pexels" | Seguida a orientação | Pixabay exigido pelo professor; evidência da orientação: [anexar print] | skill imagens-equipamentos; docs/evidencias/orientacao-pixabay.md | 6ace99b (skill, raiz); 769cc9c (evidência) |
| Busca alterada de 8 equipamentos (TI-0001, 0003, 0004, 0005, 0006, 0007, 0011 e 0012) | Pedido: "usar exatamente esta lista" de equipamentos | Alterado só o campo `busca` desses 8 itens; a original foi preservada em `buscaOriginal` | As buscas originais não produziram foto aprovável (marca ou logo legível, pessoa, texto, tela com conteúdo, fora de tema) | back/scripts/imagens-equipamentos/equipamentos.json; back/scripts/imagens-equipamentos/revisao.json | 8607551 (busca); 75d8e5a e aee6656 (revisao.json), repo back |
| Limite 5, 14 dias úteis, sharp, senha no arquivo, crédito do catálogo, TI-0010 | PRD, ADR-003, rules, enunciado | Decididos, a registrar nas specs 002 e 003 | Ver specs | pendente | pendente |

## Seção 2 · Onde o agente tentou decidir
- Convenção `Status: PRONTA` criada pelo agente sem estar escrita (reportada por ele) | commit 8169e71
- Frase extra em rules/restrictions.md além do pedido (reportada por ele) | commit c45aa18
- O agente criou a convenção do hook e, ao ser testada, barrava todo push por uma spec fora da prática; escopo corrigido | commit 3f39782

## Seção 3 · Candidata a ADR
- Mecanismo para tornar o verificador obrigatório: hook do harness, git hook ou CI (alternativas e limitações levantadas pelo agente). Decidir se virou ADR.
- ADR da biblioteca de imagem (Pixabay não entrega 800x600): escrito pelo time, docs/adr/004-biblioteca-de-imagem.md | commit 3593277

## Seção 4 · Imagens dos equipamentos (revisão humana e entrega)
- Revisão humana até agora: 10 fotos reprovadas e 1 aprovada (TI-0010), em 11 decisões registradas. Motivos (uma foto pode ter mais de um): fora de tema 4, logo legível 4, texto legível 2, pessoa 2, tela com conteúdo 1 | back/scripts/imagens-equipamentos/revisao.json | commits 75d8e5a e aee6656 (repo back)
- Situação após as novas buscas e a pré-triagem do agente (800x600, até 8 candidatas por equipamento): 6 fotos preparadas (1 aprovada, 5 pendentes de revisão) e 6 equipamentos ainda sem foto (TI-0003, TI-0004, TI-0006, TI-0007, TI-0011, TI-0012), porque nenhuma candidata passou (marca ou logo legível, pessoa, texto, tela com conteúdo, fora de tema ou equipamento ausente) | docs/handoffs/2026-11-09-imagens-equipamentos-parcial.md (estado anterior, 7 sem foto) | commit 96cdc70; novas buscas 8607551
- Commits da etapa, repo back: sharp 0.35.5 `8e99c4a` · scripts `a883bf4` · nomes no .env.example `05459f6` · revisao.json `75d8e5a` · opções --escolher e --pular `7c6652d` · revisão da TI-0003 `aee6656` · novas buscas `8607551`
- Commits da etapa, raiz: skill `6ace99b` · rules/secrets.md `afc3890` · SKILL.md com as opções `04f6d7a` · handoff `96cdc70`

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
- Imagens: 6 equipamentos seguem sem foto aceitável e a revisão final das fotos preparadas é do operador | commit 8607551 (repo back); handoff 96cdc70
- Limitação do `enviar`: o teste de "repetir não duplica" não foi feito antes (Docker parado e Supabase CLI ausente, sem ambiente local); será feito no envio real, pelo operador. Até lá a idempotência é só de desenho (upsert em caminho fixo e listagem de conferência no fim), não comprovada | commit a883bf4 (repo back)
- Limitações do hook (evidência forjável; só vale no harness; trabalho não commitado não é conferido)
