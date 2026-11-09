// Hook PreToolUse (.claude/settings.json). Lê o JSON do harness na entrada padrão.
// Bloqueia (exit 2) duas ações se a spec não tiver verificacao-rodada-<N>.md
// com "Veredito: PRONTA" cujos HEADs (raiz, front, back) batam com os atuais:
//   1. `git push`;
//   2. marcar a spec como PRONTA (linha `Status: PRONTA` em spec.md/plan.md/tasks.md).
// Procedimento e limitações: rules/spec-flow.md, seção "Gatilho obrigatório".
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.env.EXIGE_VERIFICACAO_ROOT || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const SPECS = join(ROOT, 'docs', 'specs');

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const tool = input.tool_name;
const ti = input.tool_input ?? {};

function git(dir, ...args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function head(dir) {
  try {
    if (!existsSync(join(dir, '.git'))) return 'sem commits';
    return git(dir, 'rev-parse', 'HEAD');
  } catch {
    return 'sem commits';
  }
}

function isGitPush(command) {
  for (const seg of command.split(/&&|\|\||;|\n|\|/)) {
    const tokens = seg.trim().match(/"[^"]*"|'[^']*'|\S+/g);
    if (!tokens || tokens[0] !== 'git') continue;
    let i = 1;
    while (i < tokens.length && tokens[i].startsWith('-')) {
      i += ['-C', '-c', '--git-dir', '--work-tree'].includes(tokens[i]) ? 2 : 1;
    }
    if (tokens[i] === 'push') return true;
  }
  return false;
}

const MARCA = /^\s*Status:\s*PRONTA\s*$/im;
const SPEC_MD = /docs[\\/]specs[\\/]([^\\/]+)[\\/](spec|plan|tasks)\.md$/;

function novoConteudo(t) {
  const partes = [t.content, t.new_string];
  for (const e of t.edits ?? []) partes.push(e.new_string);
  return partes.filter((p) => typeof p === 'string').join('\n');
}

function maiorRodada(dir) {
  let max = 0;
  for (const f of readdirSync(dir)) {
    const m = /^verificacao-rodada-(\d+)\.md$/.exec(f);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

// Retorna null se a spec pode seguir, ou o motivo do bloqueio.
function validar(nomeSpec) {
  const dir = join(SPECS, nomeSpec);
  const n = existsSync(dir) ? maiorRodada(dir) : 0;
  if (n === 0) return `docs/specs/${nomeSpec}/ não tem verificacao-rodada-<N>.md. Rode o verificador-spec.`;
  const arq = `verificacao-rodada-${n}.md`;
  const txt = readFileSync(join(dir, arq), 'utf8');
  if (!/^Veredito:\s*PRONTA\s*$/m.test(txt)) return `${arq} (rodada mais recente) não termina em "Veredito: PRONTA".`;

  const registrado = {};
  for (const repo of ['raiz', 'front', 'back']) {
    const m = new RegExp(`^HEAD ${repo}:\\s*(\\S.*?)\\s*$`, 'm').exec(txt);
    if (!m) return `${arq} não registra a linha "HEAD ${repo}: <hash>".`;
    registrado[repo] = m[1];
  }

  for (const repo of ['front', 'back']) {
    const atual = head(join(ROOT, repo));
    if (atual !== registrado[repo]) {
      return `HEAD de ${repo} mudou desde a verificação (${registrado[repo].slice(0, 8)} → ${atual.slice(0, 8)}). Rode outra rodada.`;
    }
  }

  const atualRaiz = head(ROOT);
  if (atualRaiz !== registrado.raiz) {
    // A raiz guarda a própria evidência: só são aceitos commits posteriores que
    // toquem verificacao-rodada-*.md ou a linha `Status:` do spec.md.
    try {
      git(ROOT, 'merge-base', '--is-ancestor', registrado.raiz, 'HEAD');
      const arquivos = git(ROOT, 'diff', '--name-only', `${registrado.raiz}..HEAD`).split('\n').filter(Boolean);
      for (const f of arquivos) {
        if (/^docs\/specs\/[^/]+\/verificacao-rodada-\d+\.md$/.test(f)) continue;
        if (/^docs\/specs\/[^/]+\/spec\.md$/.test(f)) {
          const linhas = git(ROOT, 'diff', '-U0', `${registrado.raiz}..HEAD`, '--', f)
            .split('\n')
            .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
          if (linhas.every((l) => /^[+-]\s*Status:/i.test(l))) continue;
        }
        return `HEAD da raiz mudou desde a verificação e o commit posterior toca ${f}. Rode outra rodada.`;
      }
    } catch {
      return `HEAD da raiz (${atualRaiz.slice(0, 8)}) não descende do verificado (${registrado.raiz.slice(0, 8)}). Rode outra rodada.`;
    }
  }
  return null;
}

function especAtiva() {
  if (!existsSync(SPECS)) return null;
  const nomes = readdirSync(SPECS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
    .map((d) => d.name)
    .sort();
  return nomes.length ? nomes[nomes.length - 1] : null;
}

function bloquear(acao, motivo) {
  process.stderr.write(`Bloqueado: ${acao}. ${motivo}\nVer rules/spec-flow.md ("Gatilho obrigatório").\n`);
  process.exit(2);
}

if (tool === 'Bash' && typeof ti.command === 'string') {
  if (isGitPush(ti.command)) {
    const ativa = especAtiva();
    if (ativa) {
      const motivo = validar(ativa);
      if (motivo) bloquear('git push', motivo);
    }
  } else if (/docs[\\/]specs[\\/]/.test(ti.command) && MARCA.test(ti.command.replace(/\\n/g, '\n'))) {
    const m = /docs[\\/]specs[\\/]([^\\/\s"']+)/.exec(ti.command);
    const motivo = m && validar(m[1]);
    if (motivo) bloquear('marcar a spec como PRONTA', motivo);
  }
} else if (['Write', 'Edit', 'MultiEdit'].includes(tool) && typeof ti.file_path === 'string') {
  const m = SPEC_MD.exec(ti.file_path);
  if (m && MARCA.test(novoConteudo(ti))) {
    const motivo = validar(m[1]);
    if (motivo) bloquear('marcar a spec como PRONTA', motivo);
  }
}
process.exit(0);
