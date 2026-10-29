// Checks the component library and the sandbox against the rules that can be
// checked mechanically. tokens.css is the source of truth, so it is exempt.
// Usage: node scripts/lint.mjs   (exits 1 on any problem)

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'skills/personal-styling');

const SPACE_STEPS = new Set([0, 4, 8, 16, 24, 48]);
const RADII = /^(0|20px|999px|50%|var\(--radius-[a-z]+\))$/;
const WEIGHTS = new Set(['500', '600', 'inherit']);

const problems = [];
const report = (file, line, message) => problems.push(`${relative(root, file)}:${line}  ${message}`);

// Blank out comments but keep line numbers, so findings point at real lines.
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

// Patterns arrange components; type comes from the type roles, never from
// a pattern's own CSS.
const PATTERN_BANNED = /^\s*(font(-[a-z]+)?|letter-spacing|line-height|text-transform)\s*:/;

function lintCss(file, { pattern = false } = {}) {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/\btransition(-property)?\s*:[^;]*\ball\b/.test(line)) report(file, n, 'animate named properties, never `all`');
    if (/\b(transition|animation)(-duration|-delay)?\s*:[^;]*\b\d+(\.\d+)?m?s\b/.test(line)) report(file, n, 'use a --duration-* token, not a literal duration');
    if (/cubic-bezier\(/.test(line)) report(file, n, 'use var(--ease-out), not a literal curve');
    if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i.test(line)) report(file, n, 'colours come from --color-* tokens');

    const weight = line.match(/font-weight\s*:\s*([^;]+)/);
    if (weight && !WEIGHTS.has(weight[1].trim())) report(file, n, `font-weight ${weight[1].trim()} — 500, or 600 on interactive`);

    const space = line.match(/\b(padding|margin|gap|row-gap|column-gap)(-[a-z]+)?\s*:\s*([^;]+)/);
    if (space && !space[3].includes('calc(')) {
      for (const [, px] of space[3].matchAll(/(-?\d*\.?\d+)px/g)) {
        if (!SPACE_STEPS.has(Math.abs(Number(px)))) report(file, n, `${px}px is off the 4 / 8 / 16 / 24 / 48 scale`);
      }
    }

    if (pattern && PATTERN_BANNED.test(line)) report(file, n, 'patterns take type from the type roles, not their own CSS');

    const radius = line.match(/border(-[a-z-]+)?-radius\s*:\s*([^;]+)/);
    if (radius && !radius[2].trim().split(/\s+/).every((v) => RADII.test(v))) report(file, n, `radius ${radius[2].trim()} — 20px or fully round`);
  });
}

// Every shipped file opens with "personal-styling · <name> · v<version>",
// and all files in one component agree on the version.
function lintHeaders(dir, name, files) {
  const versions = new Set();
  for (const file of files) {
    const first = readFileSync(file, 'utf8').split('\n')[0];
    const m = first.match(new RegExp(`personal-styling · ${name} · v(\\d+\\.\\d+\\.\\d+)`));
    if (!m) report(file, 1, `first line must be the header "personal-styling · ${name} · v0.0.0"`);
    else versions.add(m[1]);
  }
  if (versions.size > 1) report(dir, 0, `files disagree on version: ${[...versions].join(', ')}`);
}

const skillText = readFileSync(join(skill, 'SKILL.md'), 'utf8');
const folders = (tier) => {
  const dir = join(skill, tier);
  return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
};
const components = folders('components');
const patterns = folders('patterns');

for (const [tier, names] of [['components', components], ['patterns', patterns]]) {
  for (const name of names) {
    const dir = join(skill, tier, name);
    for (const required of ['README.md', `${name}.html`, `${name}.css`]) {
      if (!existsSync(join(dir, required))) report(dir, 0, `missing ${required}`);
    }
    const shipped = readdirSync(dir).filter((f) => f.startsWith(`${name}.`)).map((f) => join(dir, f));
    lintHeaders(dir, name, shipped);
    shipped.filter((f) => extname(f) === '.css').forEach((f) => lintCss(f, { pattern: tier === 'patterns' }));
    if (!skillText.includes(`${tier}/${name}/`)) report(join(skill, 'SKILL.md'), 0, `${tier.slice(0, -1)} "${name}" is missing from the index`);

    // A pattern names the components it's built from, and they must exist.
    if (tier === 'patterns' && existsSync(join(dir, 'README.md'))) {
      const requires = readFileSync(join(dir, 'README.md'), 'utf8').match(/^Requires: (.+)$/m);
      if (!requires) report(join(dir, 'README.md'), 0, 'missing a "Requires: …" line');
      else requires[1].split(',').map((s) => s.trim()).filter((c) => !components.includes(c))
        .forEach((c) => report(join(dir, 'README.md'), 0, `requires unknown component "${c}"`));
    }
  }
}

readdirSync(join(root, 'site')).filter((f) => f.endsWith('.css')).forEach((f) => lintCss(join(root, 'site', f)));

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}`);
  process.exit(1);
}
console.log(`lint: ${components.length} components, ${patterns.length} patterns clean`);
