# Critérios de reprovação (revisão humana)

Olhe a foto **final** (`back/.preparo-imagens/final/<patrimonio>.jpg`, já em 800x600 e
recortada), não a página do Pixabay: o recorte pode ter cortado algo ou deixado algo à vista.
Reprove se houver **qualquer** um dos itens abaixo, mesmo pequeno ou ao fundo.

| Critério | Reprovar quando | Por quê |
|---|---|---|
| Pessoa | aparece rosto, corpo ou parte reconhecível de pessoa (mãos sem rosto, ao fundo e desfocadas podem passar: anote o motivo se aprovar com dúvida) | licença restringe pessoa reconhecível; privacidade |
| Marca ou logo legível | se lê o nome ou logotipo de um fabricante (tampa do notebook, moldura do monitor, etiqueta do cabo) | licença restringe marca/logo; o item do estoque é genérico |
| Texto | há texto legível: legenda, placa, teclado com teclas nítidas em primeiro plano, etiqueta | texto não pertence ao equipamento do estoque e pode ser marca |
| Tela com conteúdo | a tela de notebook, monitor ou câmera mostra imagem, interface, site ou código (tela desligada, preta ou com cor lisa passa) | conteúdo da tela é outra obra e pode trazer marca e pessoa |

Também reprove, registrando o motivo, quando:
- o recorte 4:3 cortou o objeto principal;
- a foto não é do equipamento que a busca pedia (ex.: ilustração, outro aparelho);
- a qualidade está ruim (borrada, escura, com marca d'água).

## Como registrar

Em `back/scripts/imagens-equipamentos/revisao.json`, chave = id da foto no Pixabay:

```json
{
  "1234567": { "status": "aprovada" },
  "7654321": { "status": "reprovada", "motivo": "logo legível na tampa" }
}
```

`motivo` é obrigatório na reprovação (o `validar` falha sem ele). Depois de reprovar, rode
`npm run imagens:preparar` em `back/`: a foto reprovada é trocada e nunca volta.
