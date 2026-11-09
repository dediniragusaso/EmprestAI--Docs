# ADR 004 — Biblioteca de processamento de imagem

- Status: Aceito
- Data: 2026-11-09

## Contexto

A skill imagens-equipamentos precisa entregar todas as imagens em 800x600 e garantir essa dimensão. A fonte de imagens passou a ser o Pixabay, por orientação do professor dada em sala em 09/11/2026 (docs/evidencias/orientacao-pixabay.md). A orientação contraria o trecho do enunciado "só a API do Pexels" e foi verbal, sem registro escrito. O Pixabay entrega a imagem em tamanho próprio, sem opção de 800x600, o que exige redimensionar e recortar localmente. O ADR-001 não prevê biblioteca de imagem, e rules/restrictions.md exige decisão registrada antes de dependência nova. O uso é só em script de preparo, fora do runtime da API e do front.

## Decisão

Adotar o sharp como devDependency de back/, usado somente em scripts de preparo de imagens. Os scripts ficam em back/scripts/ e a skill, em .claude/skills/imagens-equipamentos/, os referencia.

## Alternativas consideradas

- jimp: JavaScript puro, sem binário nativo. Descartado por qualidade de reamostragem menor, desempenho inferior e API menos adotada.
- ImageMagick (linha de comando): instalação fora do package.json, versão divergente entre máquinas, PATH e conflito histórico do comando convert no Windows. Descartado por quebrar a reprodutibilidade.

## Consequências

- Recorte e redimensionamento por fit "cover" em uma chamada, com leitura de dimensões do arquivo final para validar 800x600 em código.
- O npm instala o binário pré-compilado por plataforma (Windows e Linux), sem compilador.
- O build na Vercel instala a dependência; o custo é só tempo de npm install.

## Riscos

- Instalação com --omit=optional quebra o pacote.
- O lockfile gerado no Windows precisa continuar instalável em Linux; conferir com o build.
- Biblioteca na faixa 0.x: possível mudança de API entre versões menores. Fixar a versão.