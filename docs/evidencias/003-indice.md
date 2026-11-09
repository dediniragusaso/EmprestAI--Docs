# Evidências de tela — 003-solicitar-emprestimo (índice)

Provas manuais dos CA de "Tela" (sem Playwright, decisão do operador). **O agente não tem navegador
nesta sessão e não tirou nenhum print**: a captura é do operador, no ambiente **local**. Preencha a
data, o ambiente e o nome do arquivo de cada linha. Os arquivos ficam nesta pasta
(`docs/evidencias/003-<ca>-<descrição>.png`).

## Preparação (local)
1. `supabase start` (Docker) na raiz.
2. Banco local pronto: migrations aplicadas, `npm run db:seed` e `npm run db:dados-iniciais` no
   `back/`, **com as variáveis apontando para o banco local, definidas só no terminal** (host
   `127.0.0.1`). Defina também `SEED_TESTE_EMAIL` e `SEED_TESTE_PASSWORD` para criar a conta de teste.
3. `back/`: `npm run start:dev` com `DATABASE_URL` e `SUPABASE_*` locais. `front/`: `npm run dev`
   com `VITE_API_URL` apontando para o back local. Entre com a **conta de teste**, nunca com a do
   professor.
4. Cenários de banco (só local): `cenarios-locais.sql` em `docs/specs/003-solicitar-emprestimo/`
   (`limpar`, `um`, `limite`, `atraso`).

## Prints
| CA | O que mostrar | Como chegar | Arquivo | Data | Ambiente |
|---|---|---|---|---|---|
| CA-02 | 12 cards com foto 4:3 do mesmo tamanho, nome, categoria, patrimônio e pill | cenário `limpar`, `/catalogo` | | | |
| CA-04 | cards em manutenção (Indisponível) e emprestado (Emprestado · devolução prevista até…, Está com você) | cenário `um`, depois peça outro item com outra conta | | | |
| CA-19 | modal com "Devolver até" (hoje + 14 do servidor), toast e card "Está com você"; item em Meus empréstimos | cenário `limpar`, clique "Solicitar" e confirme | | | |
| CA-20 | com 3 empréstimos: "Limite de 3 itens" em todos os cards | cenário `limite` | | | |
| CA-20 | com atraso: banner vermelho e "Bloqueado por atraso" | cenário `atraso` | | | |
| CA-20 | recusa 409 em texto na tela | abra o catálogo em duas abas, peça o mesmo item nas duas | | | |
| CA-21 | Meus empréstimos com 0, 1 e 3 itens, e com um em atraso; sem botão "Devolver" | cenários `limpar`, `um`, `limite`, `atraso` | | | |
| CA-22 | rodapé "Fotos: Pixabay" com o link | rodapé do catálogo | | | |
| CA-23 | busca por parte do nome/patrimônio, chips exclusivos e contagem "X de Y" | digite "dell" e troque os chips | | | |

CA-26 e o placeholder (CA-22) já têm a busca de texto em `front/src` registrada na T11 e na T15.
