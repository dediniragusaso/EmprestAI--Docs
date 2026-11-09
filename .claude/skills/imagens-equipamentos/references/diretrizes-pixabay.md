# Diretrizes do Pixabay para esta skill

Lido em 2026-11-09 em `pixabay.com/api/docs/`, `/service/license-summary/` e
`/service/terms/` (Termos atualizados em 20/10/2026). Os Termos são revisáveis:
releia antes de uma entrega nova.

## API

- Endpoint: `GET https://pixabay.com/api/`. Autenticação: parâmetro `key` na query string
  (por isso a URL com a chave nunca é impressa nem gravada).
- Parâmetros usados: `q` (até 100 caracteres), `image_type=photo`, `orientation=horizontal`,
  `min_width=800`, `min_height=600`, `safesearch=true`, `order=popular`, `per_page=30`
  (aceita 3–200).
- Campos por foto: `id`, `pageURL`, `user`, `user_id`, `tags`, `type`, `previewURL`,
  `webformatURL` (até 640 px, URL válida por 24 h), `largeImageURL` (até 1280 px).
  `fullHDURL`, `imageURL` e `vectorURL` exigem conta aprovada para acesso completo à API;
  esta skill usa a `largeImageURL`, que basta para 800x600 sem ampliar.
- Limite: 100 requisições por 60 s por chave (cabeçalhos `X-RateLimit-*`; excedeu → HTTP 429).
- **Respostas da API devem ficar em cache por 24 h** (o `preparar` faz isso). "Downloads
  sistemáticos em massa não são permitidos": por isso o teto de 10 downloads por equipamento.

## Licença

- Conteúdo sob a Pixabay Content License: uso comercial e não comercial, com modificação
  permitida. Fotos publicadas antes de 09/01/2019 são CC0.
- Proibido: vender ou distribuir o conteúdo isoladamente; usar de forma enganosa; usar
  conteúdo com pessoa reconhecível de forma ilegal ou imoral; usar como marca; conteúdo que
  mostre marca ou logo não pode ser usado comercialmente em relação a bens e serviços.
  É a origem dos critérios de reprovação.
- A API não devolve um campo de licença: o manifesto grava o texto fixo
  "Pixabay Content License".

## Hotlink e armazenamento

- "O uso permanente de hotlink não é permitido... baixe as imagens para o seu servidor":
  **baixar e guardar é o caminho previsto**. Por isso as fotos vão para o Storage do projeto
  e a aplicação nunca aponta para URL do Pixabay.

## Crédito

- Os Termos dizem que **não é obrigatório** creditar autor nem Pixabay; é apreciado. A
  documentação da API pede que se mostre aos usuários de onde vêm as imagens quando
  resultados de busca são exibidos. Formato sugerido: "by [Autor] via Pixabay".
- O crédito "Fotos: Pexels" do enunciado deixa de valer (orientação do professor). Se e como
  creditar o Pixabay na tela é decisão do time: ainda não registrada. O manifesto guarda
  `user`, `user_id` e `pageURL` para isso.
- Atenção: os Termos proíbem coletar dados pessoais de outros usuários (nomes/perfis). Guardar
  o nome de autor para crédito é o uso previsto, mas fica registrado como ponto a observar.
