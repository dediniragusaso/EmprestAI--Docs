---
name: imagens-equipamentos
description: Prepara as fotos dos equipamentos do EMPREST.AI (800x600, JPEG) a partir da API do Pixabay, valida o resultado e as envia ao Storage do Supabase. Use quando for criar, trocar, revisar ou publicar a foto de um equipamento, ou ao mexer na lista de equipamentos com foto.
---

# imagens-equipamentos

Fonte única: **API do Pixabay** (orientação do professor em 09/11/2026, no lugar do
Pexels; ver `docs/evidencias/orientacao-pixabay.md`). Biblioteca de imagem: **sharp**
(`docs/adr/004-biblioteca-de-imagem.md`). Nenhuma outra origem de imagem.

Os scripts ficam em `back/scripts/imagens-equipamentos/` e rodam **a partir de `back/`**.
Só usam recursos nativos do Node e o sharp. A chave vem de `back/.env` via
`node --env-file` e nunca é impressa.

## Fluxo

1. **Preparar** — `cd back && npm run imagens:preparar`
   Para cada item de `equipamentos.json`: busca no Pixabay (cache de 24 h), baixa a
   `largeImageURL`, recusa origem menor que 800x600, recorta em "cover" e redimensiona para
   800x600 com o sharp, grava em `back/.preparo-imagens/final/<patrimonio>.jpg` e
   atualiza `back/.preparo-imagens/manifesto.json`. Rodar de novo mantém as fotos já
   escolhidas; só troca a que foi reprovada. Opções (depois de `--`):
   - `--escolher=TI-0002:<id>` (repetível) fixa a foto de um equipamento e passa pelas mesmas
     checagens (origem ≥ 800x600, id não reprovado, id não repetido). Se o id não estiver no
     resultado da busca, ele é consultado na mesma API do Pixabay (parâmetro `id`), então
     serve também para uma foto escolhida à mão. Cada id só pode servir a um equipamento.
   - `--posicao=TI-0011:left` (repetível) muda a posição do recorte "cover" do sharp
     (`centre` é o padrão; aceita `left`, `right`, `top`, `bottom`, `west`, `east`, `north`,
     `south`, as diagonais, `entropy` e `attention`). O recorte só **desloca** o
     enquadramento: a escala é uniforme e a imagem nunca é esticada (conferido por comparação
     de pixels). A folga depende da proporção da origem: em foto 3:2 (1280x853) sobram 100 px na
     horizontal e 0 na vertical, ou seja, o enquadramento se desloca até 50 px para cada
     lado a partir do centro; em 16:9 sobram cerca de 265 px; em 4:3 não sobra nada. Só serve
     para tirar do quadro uma marca que esteja a menos de 50 px da borda lateral do recorte
     centralizado. Repetir o comando com outro `--posicao` refaz o recorte da mesma foto;
     o manifesto guarda a posição em `recorte`.
   - `--pular=TI-0005,TI-0006` deixa os equipamentos sem foto (e sem arquivo) quando nenhuma
     candidata presta, em vez de aceitar uma foto já julgada ruim. O `validar` acusa
     "sem entrada no manifesto" para eles.
   Faça a triagem visual **no tamanho final (800x600)**: em miniatura somem marcas pequenas
   (ASUS, Logitech, Nikon, texto em caneta).
2. **Validar** — `npm run imagens:validar` (`-- --exigir-revisao` para exigir revisão completa)
   Confere manifesto, arquivo (JPEG, **exatamente 800x600**), id único e revisão. Sai com
   erro se algo falhar.
3. **Revisão humana** — a pessoa responsável olha cada foto contra
   `references/criterios-reprovacao.md` e registra em
   `back/scripts/imagens-equipamentos/revisao.json`:
   ```json
   {
     "<id da foto no Pixabay>": { "status": "aprovada" },
     "<outro id>": { "status": "reprovada", "motivo": "marca legível no tampo" }
   }
   ```
   O agente **não** escreve esse arquivo. Depois de reprovar, rode `preparar` de novo: a foto
   reprovada é trocada e nunca mais volta a ser escolhida.
4. **Enviar** — `npm run imagens:enviar`, **só pelo operador**, no terminal dele, com
   `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` do projeto e
   `ENVIAR_CONFIRMO_PRODUCAO=sim`. Faz upsert em `equipamentos/<patrimonio>.jpg` no bucket
   público `imagens` (criado se não existir); rodar duas vezes não duplica. O agente só testa
   contra o Supabase **local** (`--ignorar-revisao` é aceito só no local).
5. **Créditos** — `npm run imagens:creditos` (a partir de `back/`) gera
   `back/scripts/imagens-equipamentos/creditos.json`, **versionado**, a partir do
   `manifesto.json`. Só roda se o `validar` passar com revisão completa (as 12 aprovadas). Para
   cada equipamento grava `patrimonio`, `pixabayId`, `autor` (campo `user` do Pixabay),
   `pageURL` e `licenca` ("Pixabay Content License"). Não leva `user_id` nem outro dado pessoal,
   nem segredo, nem data (rodar de novo sobre o mesmo manifesto não gera diff). Foi pensado
   para o seed ler dele (spec `docs/specs/002-dados-iniciais/`). Gere de novo e commite sempre
   que uma foto mudar.

## Requisito do contrato → mecanismo

| Requisito | Mecanismo | Tipo |
|---|---|---|
| Fonte só pela API do Pixabay | `preparar` só chama `pixabay.com/api` e só baixa de `*.pixabay.com` em https; outra origem é recusada | código |
| Imagem final 800x600 | `sharp.resize(800, 600, { fit: 'cover' })` | código |
| Dimensão final confere | `preparar` relê o arquivo gravado e falha se ≠ 800x600; `validar` repete, e confere formato JPEG | código |
| Origem com pelo menos 800x600 | `min_width`/`min_height` na busca **e** conferência das dimensões do arquivo baixado (considera rotação EXIF) | código |
| Foto repetida é rejeitada | comparação pelo `id` do Pixabay no `preparar` e no `validar` | código |
| Manifesto com id, pageURL, autor, user_id e licença por equipamento | `preparar` grava; `validar` falha se faltar campo ou se a pageURL não for do Pixabay | código |
| Arquivos em área de preparo fora do git | `back/.preparo-imagens/` em `back/.gitignore` | configuração |
| Cache de 24 h das respostas e sem download em massa | cache em `.preparo-imagens/cache/`; no máximo 10 downloads por equipamento | código |
| Sem pessoa, marca/logo legível, texto ou tela com conteúdo | olhar a foto e registrar em `revisao.json` | **revisão humana** |
| Foto reprovada nunca volta | `preparar` ignora ids reprovados em `revisao.json`; `validar` falha se uma reprovada estiver no manifesto | código |
| Só envia foto revisada e aprovada | `enviar` roda `validar --exigir-revisao` antes | código |
| Envio idempotente, caminho fixo | upsert (`x-upsert`) em `equipamentos/<patrimonio>.jpg` + listagem final que confere a contagem | código |
| Produção só pelo operador | `enviar` recusa host remoto sem `ENVIAR_CONFIRMO_PRODUCAO=sim` e exige a service role no terminal; `rules/restrictions.md` proíbe o agente | código + regra |
| Nenhum segredo em log | `redigir()` limpa as chaves de qualquer mensagem; a chave nunca vai na URL impressa nem no cache | código |
| Crédito do autor na tela | **não decidido** (ver `references/diretrizes-pixabay.md`); o manifesto guarda autor e pageURL para quando for | pendente |

## Quando parar

- Documentação do Pixabay mudar para proibir baixar e guardar: pare e avise.
- `preparar` não achar foto aproveitável: mude a `busca` em `equipamentos.json` (decisão
  humana), não relaxe um critério.
- Nunca escreva em produção, nunca imprima valor de segredo (`rules/secrets.md`).
