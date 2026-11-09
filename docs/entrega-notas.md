# Notas para o ENTREGA.md (rascunho vivo)
Linguagem impersonal. Cada item aponta para evidência verificável.

## Seção 1 · Conflitos
| pedido | contrariava | o que foi feito | por quê | registro | commit |
|---|---|---|---|---|---|
| Verificador corrige teste (tech lead) | requisito de independência; rules/spec-flow.md | Recusado | O verificador não corrige; quem corrige é o agente principal | .claude/agents/verificador-spec.md | fc42860 |
| Agente cria usuário no Auth remoto (permitido em rules/restrictions.md) | Enunciado: o agente nunca escreve em produção | Permissão removida; "produção" definida como banco, Storage e Auth do deploy | A escrita em produção é do operador | rules/restrictions.md | c45aa18 |
| Pexels trocado por Pixabay (orientação do professor) | Enunciado: "só a API do Pexels" | Seguida a orientação | Pixabay exigido pelo professor; evidência da orientação: [anexar print] | skill imagens-equipamentos | pendente |
| Limite 5, 14 dias úteis, sharp, senha no arquivo, crédito do catálogo, TI-0010 | PRD, ADR-003, rules, enunciado | Decididos, a registrar nas specs 002 e 003 | Ver specs | pendente | pendente |

## Seção 2 · Onde o agente tentou decidir
- Convenção `Status: PRONTA` criada pelo agente sem estar escrita (reportada por ele) | commit 8169e71
- Frase extra em rules/restrictions.md além do pedido (reportada por ele) | commit c45aa18
- O agente criou a convenção do hook e, ao ser testada, barrava todo push por uma spec fora da prática; escopo corrigido | commit 3f39782

## Seção 3 · Candidata a ADR
- Mecanismo para tornar o verificador obrigatório: hook do harness, git hook ou CI (alternativas e limitações levantadas pelo agente). Decidir se virou ADR.
- ADR da biblioteca de imagem (Pixabay não entrega 800x600): ADR a escrever.

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
- Limitações do hook (evidência forjável; só vale no harness; trabalho não commitado não é conferido)
