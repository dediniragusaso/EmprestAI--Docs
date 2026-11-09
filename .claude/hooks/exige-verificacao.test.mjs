// Testa .claude/hooks/exige-verificacao.mjs em repositórios descartáveis (raiz, front, back).
// Uso: node .claude/hooks/exige-verificacao.test.mjs [pasta-temporaria]
// Sai com 1 se algum caso falhar. Não toca no repositório real.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hook = join(dirname(fileURLToPath(import.meta.url)), 'exige-verificacao.mjs');
const base = process.argv[2] ?? tmpdir();
mkdirSync(base, { recursive: true });
const R = mkdtempSync(join(base, 'hook-fx-'));
const FRONT = join(R, 'front');
const BACK = join(R, 'back');

const g = (d, ...a) =>
  execFileSync('git', ['-C', d, '-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'core.autocrlf=false', ...a], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
const repo = (d) => {
  mkdirSync(d, { recursive: true });
  g(d, 'init', '-q');
  writeFileSync(join(d, 'a.txt'), '1');
  g(d, 'add', 'a.txt');
  g(d, 'commit', '-q', '-m', 'c1');
};
repo(R);
repo(FRONT);
repo(BACK);
writeFileSync(join(R, '.gitignore'), 'front/\nback/\n');

const spec1 = join(R, 'docs', 'specs', '001-x');
mkdirSync(spec1, { recursive: true });
const SPEC1 = join(spec1, 'spec.md');
const wr = (f, c) => writeFileSync(f, c);
wr(SPEC1, '# spec\n');
g(R, 'add', '.gitignore', 'docs');
g(R, 'commit', '-q', '-m', 'spec');

let falhas = 0;
const run = (nome, payload, esperado) => {
  const r = spawnSync('node', [hook], {
    input: JSON.stringify(payload),
    env: { ...process.env, EXIGE_VERIFICACAO_ROOT: R },
    encoding: 'utf8',
  });
  const ok = r.status === esperado;
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome} (exit ${r.status}, esperado ${esperado})${r.stderr ? ' :: ' + r.stderr.split('\n')[0].slice(0, 100) : ''}`);
};
const bash = (command) => ({ tool_name: 'Bash', tool_input: { command } });
const PUSH = 'git ' + 'push -u origin main';
const escreve = (file, content) => ({ tool_name: 'Write', tool_input: { file_path: file, content } });
const heads = () => ({ raiz: g(R, 'rev-parse', 'HEAD'), front: g(FRONT, 'rev-parse', 'HEAD'), back: g(BACK, 'rev-parse', 'HEAD') });
const verif = (dir, n, h, veredito) =>
  wr(join(dir, `verificacao-rodada-${n}.md`), `# V\n\nHEAD raiz: ${h.raiz}\nHEAD front: ${h.front}\nHEAD back: ${h.back}\n\n${veredito}\n`);

// --- spec em aberto não bloqueia
run('1 push com a spec sem Status', bash(PUSH), 0);
wr(SPEC1, '# spec\nStatus: EM ABERTO\n');
run('2 push com Status: EM ABERTO e sem verificacao', bash(PUSH), 0);
run('3 escrever Status: EM ABERTO não é marcar PRONTA', escreve(SPEC1, '# spec\nStatus: EM ABERTO\n'), 0);
run('4 commit com a palavra no texto', bash('git commit -m "ajusta push"'), 0);
run('5 ferramenta qualquer', { tool_name: 'Read', tool_input: { file_path: 'x' } }, 0);

// --- marcar PRONTA sem evidência bloqueia
run('6 marcar PRONTA sem verificacao (Write)', escreve(SPEC1, '# spec\nStatus: PRONTA\n'), 2);
run('7 marcar PRONTA sem verificacao (Edit)', { tool_name: 'Edit', tool_input: { file_path: SPEC1, old_string: 'x', new_string: 'Status: PRONTA' } }, 2);
wr(SPEC1, '# spec\nStatus: PRONTA\n');
run('8 spec marcada PRONTA no disco, sem evidência: push bloqueia', bash(PUSH), 2);

// --- rodada que não vale
let h = heads();
verif(spec1, 1, h, 'Veredito: NÃO PRONTA — falta teste');
run('9 rodada NÃO PRONTA: push bloqueia', bash(PUSH), 2);

// --- rodada que vale
verif(spec1, 2, h, 'Veredito: PRONTA');
run('10 rodada PRONTA com HEADs iguais: push libera', bash(PUSH), 0);
run('11 idem com -C e &&', bash(`echo ok && git -C front ${'pu' + 'sh'}`), 0);
run('12 marcar PRONTA com evidência libera', escreve(SPEC1, '# spec\nStatus: PRONTA\n'), 0);
g(R, 'add', '.gitignore', 'docs');
g(R, 'commit', '-q', '-m', 'verificacao e status');
run('13 commit só da evidência e da linha Status não invalida', bash(PUSH), 0);

// --- HEAD que mudou invalida
writeFileSync(join(R, 'a.txt'), '2');
g(R, 'add', 'a.txt');
g(R, 'commit', '-q', '-m', 'outro');
run('14 commit de outro arquivo na raiz invalida', bash(PUSH), 2);
h = heads();
verif(spec1, 3, h, 'Veredito: PRONTA');
run('15 nova rodada PRONTA libera', bash(PUSH), 0);
writeFileSync(join(FRONT, 'a.txt'), '2');
g(FRONT, 'add', 'a.txt');
g(FRONT, 'commit', '-q', '-m', 'f2');
run('16 commit novo no front invalida', bash(PUSH), 2);

// --- outra spec em aberto não atrapalha; outra marcada PRONTA sem evidência atrapalha
h = heads();
verif(spec1, 4, h, 'Veredito: PRONTA');
const spec2 = join(R, 'docs', 'specs', '002-y');
mkdirSync(spec2, { recursive: true });
wr(join(spec2, 'spec.md'), '# spec 2\nStatus: EM ABERTO\n');
run('17 spec 002 em aberto não bloqueia', bash(PUSH), 0);
wr(join(spec2, 'spec.md'), '# spec 2\nStatus: PRONTA\n');
run('18 spec 002 marcada PRONTA sem evidência bloqueia', bash(PUSH), 2);

rmSync(R, { recursive: true, force: true });
console.log(falhas ? `\n${falhas} caso(s) falharam` : '\nTodos os casos passaram');
process.exit(falhas ? 1 : 0);
