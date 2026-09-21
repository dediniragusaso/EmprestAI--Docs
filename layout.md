# EMPREST.AI â€” EspecificaÃ§Ã£o de layout (v1)

Documento de handoff para reproduzir o layout do app de emprÃ©stimo de equipamentos de TI.
Base visual: design system **Nocturne** (interface escura, densa, acento usado como linha e brilho â€” nunca como preenchimento sÃ³lido), com o acento e a tipografia substituÃ­dos pela marca EMPREST.AI.

---

## 1. Cores

### Tokens de base (ground escuro)

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#161826` | fundo de toda pÃ¡gina |
| `--color-surface` | `#232532` | cards, tabela, modal, inputs |
| `--color-text` | `#e9e9ed` | texto principal |
| `--color-divider` | `color-mix(in srgb, #e9e9ed 16%, transparent)` | bordas e rÃ©guas |
| `--color-neutral-900` | `#292b31` | avatares neutros na tabela |

### Acento da marca (substitui o acento do Nocturne)

PrimÃ¡ria: **`#2fb8ac`** (teal). Rampa 100â†’900:

```
100 #e6faf7 Â· 200 #c2f1eb Â· 300 #93e3da Â· 400 #5fcfc4
500 #2fb8ac (base) Â· 600 #26978e Â· 700 #1d746d Â· 800 #15534e Â· 900 #0f3733
```

Uso: 500 para bordas/linhas/Ã­cones e nÃºmeros de destaque; 300 para texto em tamanho de parÃ¡grafo sobre o fundo escuro (contraste); 900 para preenchimentos tintados (avatar do usuÃ¡rio, toast); 700 para bordas desses preenchimentos.
Tints por transparÃªncia usados no layout: `rgba(47,184,172,0.10)` (chip de filtro ativo), `0.12` (hover do botÃ£o primÃ¡rio e fundo de pill "DisponÃ­vel"), `0.22` (pressed).

### Cores semÃ¢nticas de situaÃ§Ã£o (pills, bordas, prazos)

| Estado | Texto (`fg`) | Fundo (`bg`) | Borda (`bd`) |
|---|---|---|---|
| DisponÃ­vel / Em dia | `#5fcfc4` | `rgba(47,184,172,0.12)` | `rgba(47,184,172,0.40)` |
| Emprestado / a vencer | `#c9a25f` | `rgba(201,162,95,0.12)` | `rgba(201,162,95,0.38)` |
| Em atraso / erro | `#e88b8b` | `rgba(200,90,90,0.14)` | `rgba(200,90,90,0.40)` |
| Em manutenÃ§Ã£o / inativo | `#9aa0ad` | `rgba(154,160,173,0.10)` | `rgba(154,160,173,0.30)` |

Banner de bloqueio por atraso: borda `#7a3b3b`, fundo `rgba(122,59,59,0.14)`, texto `#e88b8b`.

### Texto secundÃ¡rio

Sempre por transparÃªncia sobre `--color-text`, nunca um cinza novo:

- 72% â†’ texto de apoio em painÃ©is
- 70% â†’ labels de formulÃ¡rio
- 62% â†’ corpo de diÃ¡logo
- 55% â†’ subtÃ­tulos de pÃ¡gina, metadados
- 45% â†’ kickers, patrimÃ´nio, dicas de KPI
- 40% â†’ rodapÃ©s discretos

### Regras de cor

- Nunca preto puro nem branco puro.
- Nunca inundar Ã¡reas grandes com o acento: botÃ£o primÃ¡rio Ã© **contorno** de 1px sobre transparente.
- Cromia baixa fora do acento; superfÃ­cies e bordas vÃªm dos neutros.

---

## 2. Tipografia

- FamÃ­lia Ãºnica: **Raleway** (Google Fonts, pesos 400/500/600/700), aplicada a `--font-heading` e `--font-body`.
- Peso de tÃ­tulos: **600**. Corpo: 400.
- `line-height` de tÃ­tulos â‰ˆ 1.12, `letter-spacing: -0.015em`. Corpo: 1.55.
- `text-wrap: pretty` em tÃ­tulos longos.

### Escala usada

| Elemento | Tamanho |
|---|---|
| H1 do login | 44px |
| H1 de tela interna | 30px |
| NÃºmero de KPI | 30px |
| H2 "Entrar" | 26px |
| TÃ­tulo de modal | 20px |
| TÃ­tulo de painel/seÃ§Ã£o | 17px |
| TÃ­tulo de card | 16.5px |
| Nome de item em lista | 16px |
| SubtÃ­tulo de pÃ¡gina / lead do login | 14â€“16px |
| Corpo, cÃ©lula de tabela, input, botÃ£o | 13.5â€“14px |
| Nota, metadado, chip | 12â€“13px |
| Kicker / cabeÃ§alho de tabela | 11â€“11.5px, `letter-spacing: 0.08â€“0.09em`, `text-transform: uppercase` |
| Micro-rÃ³tulo (patrimÃ´nio, dica) | 11â€“12px |

Marca: `EMPREST` peso 700 + `.AI` no acento, `letter-spacing: 0.02em` â€” 17px na tela de login, 15px na barra de navegaÃ§Ã£o.

---

## 3. EspaÃ§amento, raios e elevaÃ§Ã£o

Escala do Nocturne (densidade 0.70Ã—): `2.8 Â· 5.6 Â· 8.4 Â· 11.2 Â· 16.8 Â· 22.4px`.
Raios: `--radius-sm 4px`, `--radius-md 8px` (botÃµes, inputs, linhas de lista), `--radius-lg 14px` (cards, painÃ©is, modal, moldura).
ElevaÃ§Ã£o: `--shadow-sm/md/lg` do sistema; nunca sombras empilhadas.

### Medidas aplicadas

- Padding de conteÃºdo das telas internas: `36px 40px 64px`.
- Larguras mÃ¡ximas de conteÃºdo: CatÃ¡logo 1240px Â· Meus emprÃ©stimos 1000px Â· OperaÃ§Ãµes 1320px Â· Equipamentos 1160px.
- Login: `64px 56px` em ambas as colunas.
- Barra de navegaÃ§Ã£o: altura **60px**, padding lateral 40px, `gap: 32px` entre marca e abas.
- Card do catÃ¡logo: padding 18px, `gap: 12px` interno.
- Grade do catÃ¡logo: `repeat(auto-fill, minmax(292px, 1fr))`, `gap: 16px`.
- Linha de "Meus emprÃ©stimos": padding `18px 20px`, `gap: 20px` entre colunas.
- Grade de KPIs: 4 colunas, `gap: 14px`, padding `16px 18px`.
- Tabela: cabeÃ§alho `12px 18px`, cÃ©lula `13px 18px`.
- Modal: largura **420px**, padding 26px.
- FormulÃ¡rio de cadastro: grade 2 colunas, `gap: 14px`; coluna direita de regras com 300px.
- Layout sempre em flex/grid com `gap` â€” nunca margens por elemento para espaÃ§ar irmÃ£os.

### Alturas de controles

Input/select 36px (padding `6px 10px`) Â· botÃ£o padrÃ£o 36px Â· botÃ£o do login 40px Â· avatar 28px (26px na tabela) Â· pill de status 3px/9px, `border-radius: 999px` Â· traÃ§os do limite de 3 itens: 5px de altura, largura flex igual, `border-radius: 999px`.

---

## 4. Componentes (classes do Nocturne)

- `.btn` + `.btn-primary` (contorno acento) Â· `.btn-secondary` (contorno divider) Â· `.btn-ghost` (texto acento) Â· `.btn-block`.
- `.tag` + `.tag-outline` para etiquetas de papel/seÃ§Ã£o.
- `.card` (+ `.card-kicker`, `.card-title`) e `.elev-sm/md/lg`.
- `.field` + `label` + `.input` (inclui `select` e `textarea`).
- `.radio` + `.dot` para a situaÃ§Ã£o inicial no cadastro.
- `.nav` + `.nav-brand` para a barra de topo.
- `.table` para a lista de OperaÃ§Ãµes.
- `.dialog-backdrop` + `.dialog` (+ `-title`, `-body`, `-actions`).
- Estados: hover tintado do acento, pressed um passo alÃ©m, foco `outline: 2px solid var(--color-accent); outline-offset: 2px`. Desabilitado: `opacity .45` + `cursor: not-allowed`.
- Ãcones, quando houver: Phosphor Icons.
- Marca desenhada como quadrado de 22â€“26px com borda 1.5px do acento, raio 6â€“7px, e um quadradinho preenchido de 8â€“9px (raio 2px) centralizado.
- RÃ©gua de seÃ§Ã£o: `height:1px; background: linear-gradient(90deg, transparent, var(--color-divider) 48px, var(--color-divider) calc(100% - 48px), transparent)` â€” as rÃ©guas desaparecem nas pontas.

---

## 5. PÃ¡ginas

### 5.1 Login
Grade `1.05fr 0.95fr`, altura mÃ­nima 820px.
- **Esquerda** (fundo `linear-gradient(160deg,#1b1f2e,#161826 60%)` + brilho radial `rgba(47,184,172,0.16)` de 520px, deslocado `left:-160px; top:120px`): marca no topo, tÃ­tulo 44px em duas linhas, lead 16px em 60% de opacidade, e uma faixa de 3 estatÃ­sticas (`3 itens por pessoa`, `14 dias de prazo`, `0 linhas para preencher`) acima de uma borda superior; rodapÃ© "OperaÃ§Ãµes Â· TI interno" em 12px/40%.
- **Direita**: coluna de 340px centralizada verticalmente â€” H2 "Entrar", lead, campo E-mail, campo Senha, botÃ£o primÃ¡rio `btn-block` (40px), botÃ£o ghost "Entrar como OperaÃ§Ãµes â†’", nota "Cada pessoa vÃª apenas os prÃ³prios emprÃ©stimos".

### 5.2 CatÃ¡logo
CabeÃ§alho: H1 "CatÃ¡logo" + contagem "X de Y equipamentos disponÃ­veis agora"; busca de 260px alinhada Ã  direita.
Banner de bloqueio (condicional). Linha de chips de filtro: Todos Â· DisponÃ­veis Â· Emprestados Â· Em manutenÃ§Ã£o.
Grade de cards. Card = kicker de categoria (uppercase 11px) Â· nome 16.5px Â· patrimÃ´nio 12px Â· pill de situaÃ§Ã£o Ã  direita Â· linha de detalhe (min-height 18px: "Pronto para retirada no balcÃ£o" / "Com {pessoa} Â· devolver atÃ© {data}" / observaÃ§Ã£o de manutenÃ§Ã£o) Â· botÃ£o de largura total.

### 5.3 Meus emprÃ©stimos
H1 + "N de 3 itens em seu nome Â· prazo padrÃ£o de 14 dias".
Barra de 3 traÃ§os (ocupados no acento, atraso em vermelho, vazios em `text 12%`).
Linhas de emprÃ©stimo com borda esquerda de 3px na cor do estado, em 5 colunas de flex: item (1.4) Â· Retirada (1) Â· Devolver atÃ© (1, na cor do estado) Â· pill (0.9) Â· botÃ£o "Devolver".
Estado vazio: caixa tracejada, padding 48px, centralizada, com botÃ£o "Ir ao catÃ¡logo".
RodapÃ© de regras em trÃªs itens de 12.5px.

### 5.4 OperaÃ§Ãµes Â· emprÃ©stimos em aberto
H1 + lead; busca de 230px + botÃ£o primÃ¡rio "Cadastrar equipamento".
4 KPIs: Em aberto Â· Em atraso (vermelho) Â· DisponÃ­veis (acento) Â· ManutenÃ§Ã£o (cinza), cada um com rÃ³tulo uppercase, nÃºmero 30px e dica.
Tabela dentro de contÃªiner com raio `lg` e overflow hidden: Pessoa (avatar + nome) Â· Equipamento Â· PatrimÃ´nio Â· Retirada Â· Prazo (na cor do estado) Â· SituaÃ§Ã£o (pill) Â· aÃ§Ã£o "Registrar devoluÃ§Ã£o" alinhada Ã  direita. CabeÃ§alho com fundo `text 5%`; linhas separadas por borda superior de 1px.
Estado sem resultados: texto centralizado, padding 40px.

### 5.5 Equipamentos (cadastro, OperaÃ§Ãµes)
Grade `1fr 300px`, `gap: 34px`, alinhada ao topo.
- FormulÃ¡rio em card: Nome (2 colunas) Â· Categoria (select: Notebook, Monitor, Cabo, CÃ¢mera, AcessÃ³rio) Â· PatrimÃ´nio Â· ObservaÃ§Ãµes (textarea, 2 colunas) Â· rÃ¡dios de situaÃ§Ã£o inicial (DisponÃ­vel / Em manutenÃ§Ã£o) Â· rodapÃ© com borda superior e aÃ§Ãµes "Cadastrar equipamento" (primÃ¡rio) + "Cancelar" (ghost).
- Coluna direita: painel "Regras em vigor" (4 itens com travessÃ£o no acento) e painel "Fora desta versÃ£o" (Reserva com data futura, NotificaÃ§Ã£o por e-mail, ImportaÃ§Ã£o da planilha â€” em 42% de opacidade).

### 5.6 SobreposiÃ§Ãµes
- **Modal** (420px): tÃ­tulo Â· corpo Â· bloco resumo com borda (raio `md`, padding `14px 16px`) contendo duas linhas rÃ³tulo/valor (o valor em destaque no acento) Â· aÃ§Ãµes Ã  direita: "Cancelar" (secundÃ¡rio) + confirmaÃ§Ã£o (primÃ¡rio). Backdrop `rgba(10,11,18,0.68)`, clique fora fecha, clique dentro nÃ£o propaga.
- **Toast**: fixo, `left:50%` com `translateX(-50%)`, `bottom: 28px`, padding `12px 20px`, `border-radius: 999px`, fundo `--color-accent-900`, borda `--color-accent-700`, texto `--color-accent-200`, 13.5px. Sai automaticamente em **2600ms**.

---

## 6. NavegaÃ§Ã£o

- PapÃ©is: **Colaborador** â†’ abas `CatÃ¡logo`, `Meus emprÃ©stimos`. **OperaÃ§Ãµes** â†’ `CatÃ¡logo`, `OperaÃ§Ãµes`, `Equipamentos`, `Meus emprÃ©stimos`.
- Aba ativa: `border-bottom: 2px solid var(--color-accent)` e texto em 100%; inativa: linha transparente e texto em 55%. BotÃµes de aba com altura total da barra (60px), padding lateral 14px, sem raio.
- Barra Ã© `position: sticky; top: 0`, fundo `--color-bg`, `z-index: 20`; Ã  direita: etiqueta do papel (`.tag-outline`), avatar com iniciais (fundo `accent-900`, borda `accent-700`, texto `accent-300`), nome e "Sair".
- Entradas: "Entrar" â†’ CatÃ¡logo (papel Colaborador); "Entrar como OperaÃ§Ãµes" â†’ OperaÃ§Ãµes (papel OperaÃ§Ãµes). "Sair" â†’ Login.
- Atalhos internos: banner de atraso â†’ Meus emprÃ©stimos; estado vazio â†’ CatÃ¡logo; "Cadastrar equipamento" â†’ Equipamentos; "Cancelar" no cadastro â†’ OperaÃ§Ãµes; apÃ³s cadastrar â†’ OperaÃ§Ãµes + toast.
- Todas as transiÃ§Ãµes sÃ£o troca de tela na mesma janela; nÃ£o hÃ¡ rotas aninhadas nem modais empilhados.

---

## 7. InteraÃ§Ãµes e regras de negÃ³cio

1. **Solicitar emprÃ©stimo** (card disponÃ­vel): abre modal com "Devolver atÃ© = hoje + 14 dias". Confirmar â†’ item passa a `emprestado` com o nome da pessoa, sai do disponÃ­vel, entra em Meus emprÃ©stimos e na tabela de OperaÃ§Ãµes; toast de confirmaÃ§Ã£o.
2. **Devolver** (Meus emprÃ©stimos): modal "DevoluÃ§Ã£o em {hoje}". Confirmar â†’ item volta a `disponivel`, libera um slot, sai da tabela de OperaÃ§Ãµes; toast.
3. **Registrar devoluÃ§Ã£o** (OperaÃ§Ãµes, balcÃ£o): mesmo efeito, com "Pessoa" no lugar da data no resumo do modal.
4. **Limite de 3 itens**: com 3 emprÃ©stimos ativos, todo botÃ£o de solicitar fica desabilitado com o rÃ³tulo "Limite de 3 itens" e vira `btn-secondary`.
5. **Atraso bloqueia**: com qualquer item em atraso, os botÃµes viram "Bloqueado por atraso" (desabilitados) e o banner vermelho aparece no topo do catÃ¡logo com atalho para o item pendente.
6. **ManutenÃ§Ã£o**: nunca conta como disponÃ­vel; card com pill cinza, detalhe com a observaÃ§Ã£o e botÃ£o "IndisponÃ­vel" desabilitado.
7. **Item jÃ¡ com o usuÃ¡rio**: botÃ£o "EstÃ¡ com vocÃª" (desabilitado); com outra pessoa: "Emprestado" (desabilitado) e o detalhe mostra quem e o prazo.
8. **Busca**: catÃ¡logo filtra por nome + patrimÃ´nio; OperaÃ§Ãµes filtra por pessoa + item; ambas case-insensitive, filtragem imediata a cada tecla, com estado vazio prÃ³prio.
9. **Filtros de situaÃ§Ã£o**: exclusivos (Todos / DisponÃ­veis / Emprestados / Em manutenÃ§Ã£o); ativo ganha borda e texto no acento e fundo `rgba(47,184,172,0.10)`.
10. **Cadastro**: nome obrigatÃ³rio (sem nome â†’ toast "Informe o nome do equipamento"); patrimÃ´nio vazio cai para `TI-â€”`; item entra no topo da lista.
11. **Escopo por pessoa**: cada usuÃ¡rio vÃª somente os prÃ³prios emprÃ©stimos; a visÃ£o completa existe apenas em OperaÃ§Ãµes.

Fora da v1: reserva com data futura, notificaÃ§Ã£o por e-mail, importaÃ§Ã£o de planilha.

---

## 8. AnimaÃ§Ãµes

Discretas e curtas â€” a interface Ã© quieta.

```css
@keyframes fadeUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
```

- Cards do catÃ¡logo: `fadeUp .25s ease both` ao renderizar.
- Modal: `fadeUp .18s ease both`; backdrop aparece sem animaÃ§Ã£o.
- Toast: `fadeUp .2s ease both` na entrada, remoÃ§Ã£o apÃ³s 2600ms.
- Hover/pressed de botÃµes e bordas de input: transiÃ§Ã£o implÃ­cita do design system; nenhum efeito de escala, sombra pulsante ou parallax.
- Nada de animaÃ§Ã£o em nÃºmeros de KPI, tabela ou navegaÃ§Ã£o.

---

## 9. Dados de exemplo (para reproduzir as telas fielmente)

UsuÃ¡rio: **Ana Ribeiro** (iniciais AR). Data de referÃªncia: **31/08/2026**.

Equipamentos: Notebook Dell Latitude 5450 (TI-0142, disponÃ­vel) Â· MacBook Pro 14 M3 (TI-0088, com Marcos Lemos atÃ© 07/09) Â· Monitor LG 27" 4K (TI-0231, disponÃ­vel) Â· Monitor Dell 24" FHD (TI-0233, manutenÃ§Ã£o â€” "Painel com falha, retorna em 05/09") Â· CÃ¢mera Sony ZV-1 (TI-0301, com Ana atÃ© 12/09) Â· Cabo HDMI 2.1 3m (TI-0455, disponÃ­vel) Â· Dock Thunderbolt 4 (TI-0512, com Ana atÃ© 05/09) Â· TripÃ© Manfrotto Befree (TI-0318, manutenÃ§Ã£o â€” "Trava do centro quebrada") Â· Headset Jabra Evolve2 (TI-0402, disponÃ­vel).

EmprÃ©stimos em aberto: Ana Ribeiro/Sony ZV-1 (29/08â†’12/09) Â· Ana Ribeiro/Dock (22/08â†’05/09) Â· Marcos Lemos/MacBook (24/08â†’07/09) Â· JÃºlia Prado/Notebook Lenovo T14 TI-0119 (26/08â†’09/09) Â· Rafael Souza/Monitor AOC 24" TI-0244 (18/08â†’01/09) Â· Camila Nunes/CÃ¢mera GoPro Hero 12 TI-0307 (05/08â†’19/08, **em atraso**).

Assim, por padrÃ£o: 2 de 3 slots da Ana ocupados e em dia, 4 itens disponÃ­veis, 2 em manutenÃ§Ã£o, 6 emprÃ©stimos em aberto, 1 em atraso.

---

## 10. Notas de implementaÃ§Ã£o

- Uma Ãºnica folha do design system (`styles.css` do Nocturne) + override de `:root` com a rampa teal e Raleway; todos os valores restantes vÃªm de `var(--*)`.
- Estilos aplicados inline no markup (sem classes prÃ³prias alÃ©m das do design system), o que mantÃ©m a estrutura legÃ­vel e editÃ¡vel elemento por elemento.
- Estado da aplicaÃ§Ã£o em memÃ³ria: `view`, `role`, `query`, `opsQuery`, `filter`, `modal`, `toast`, `items[]`, `loans[]`, campos do formulÃ¡rio.
- Toda mudanÃ§a de dados Ã© derivada no render: contagens, KPIs, cores de estado, rÃ³tulo e habilitaÃ§Ã£o de cada botÃ£o.
- Controles de protÃ³tipo Ãºteis: `startView` (login, catalogo, meus, operaÃ§Ãµes, cadastro) e `demoState` (none, modal-solicitar, modal-devolver, sem-emprestimos, atraso-bloqueado, toast).
- Altura mÃ­nima das telas: 820px; larguras de referÃªncia do desenho: 1360â€“1440px.
- Idioma da interface: portuguÃªs do Brasil; datas em `DD/MM/AAAA`; tom de copy direto e operacional, sem exclamaÃ§Ãµes e sem emoji.