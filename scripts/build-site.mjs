// Builds the sandbox into dist/ from the same files the skill ships, so the
// sandbox can never drift from the library. No dependencies.
// Usage: node scripts/build-site.mjs, then open dist/index.html

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skill = join(root, 'skills/personal-styling');
const out = join(root, 'dist');
const read = (path) => readFileSync(path, 'utf8');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- Forced states -------------------------------------------------------
// Hover and focus can't be triggered from markup, so every selector using
// :hover or :focus-visible gets a twin using .force-hover / .force-focus.
// demo.html files put those classes on elements to show the state at rest.
function forceStates(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/([^{}]+)\{/g, (match, prelude) => {
    if (prelude.trim().startsWith('@')) return match;
    const selectors = prelude.split(',');
    const twins = selectors
      .filter((s) => /:hover|:focus-visible/.test(s))
      .map((s) => s.replace(/:hover/g, '.force-hover').replace(/:focus-visible/g, '.force-focus'));
    return twins.length ? `${[...selectors, ...twins].join(',')}{` : match;
  });
}

// ---- Markdown ------------------------------------------------------------
// Just enough for READMEs and SKILL.md: headings, paragraphs, lists, tables,
// fenced code, and inline code / bold / italic / links.
function inline(text) {
  const codes = [];
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, (_, code) => `\u0000${codes.push(code) - 1}\u0000`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="prose-link" href="$2">$1</a>')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

const LIST_ITEM = /^\s*(-|\d+\.)\s+/;
const BLOCK_START = /^(```|#{1,6}\s|\|)|^\s*(-|\d+\.)\s/;

function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith('```')) {
      const buf = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i]);
      i++;
      html.push(`<pre class="surface code"><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level} class="t-label">${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const [head, , ...body] = rows;
      html.push(`<div class="table-wrap"><table><thead><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`
        + `<tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const tag = /^\s*\d+\./.test(line) ? 'ol' : 'ul';
      const items = [];
      while (i < lines.length && (LIST_ITEM.test(lines[i]) || (/^\s+\S/.test(lines[i]) && items.length))) {
        if (LIST_ITEM.test(lines[i])) items.push(lines[i].replace(LIST_ITEM, ''));
        else items[items.length - 1] += ` ${lines[i].trim()}`;
        i++;
      }
      html.push(`<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</${tag}>`);
      continue;
    }

    const buf = [lines[i++].trim()];
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) buf.push(lines[i++].trim());
    html.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return html.join('\n');
}

// "# Title\n\nFirst paragraph.\n\nRest" → { title, summary, rest }
function splitReadme(src) {
  const [, title = '', body = ''] = src.match(/^#\s+(.+)\n([\s\S]*)$/) || [];
  const blocks = body.trim().split(/\n\s*\n/);
  return { title, summary: blocks[0] || '', rest: blocks.slice(1).join('\n\n') };
}

// ---- Collect -------------------------------------------------------------
const componentsDir = join(skill, 'components');
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map(({ name }) => {
    const dir = join(componentsDir, name);
    const file = (f) => (existsSync(join(dir, f)) ? read(join(dir, f)) : null);
    return {
      name,
      ...splitReadme(file('README.md') || `# ${name}\n`),
      html: file(`${name}.html`),
      css: file(`${name}.css`),
      js: file(`${name}.js`),
      demo: file('demo.html'),
    };
  });

// ---- Emit ----------------------------------------------------------------
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, 'tokens.css'), forceStates(read(join(skill, 'tokens.css'))));
copyFileSync(join(root, 'site/site.css'), join(out, 'site.css'));
copyFileSync(join(root, 'site/site.js'), join(out, 'site.js'));
for (const c of components) {
  mkdirSync(join(out, 'components', c.name), { recursive: true });
  if (c.css) writeFileSync(join(out, 'components', c.name, `${c.name}.css`), forceStates(c.css));
  if (c.js) writeFileSync(join(out, 'components', c.name, `${c.name}.js`), c.js);
}

// Every page loads every component, so demos can compose them.
const styles = components.filter((c) => c.css).map((c) => `<link rel="stylesheet" href="components/${c.name}/${c.name}.css">`).join('\n');
const scripts = components.filter((c) => c.js).map((c) => `<script src="components/${c.name}/${c.name}.js"></script>`).join('\n');

const page = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<script>try { const t = localStorage.getItem('ps-theme'); if (t) document.documentElement.dataset.theme = t; } catch {}</script>
<link rel="stylesheet" href="tokens.css">
${styles}
<link rel="stylesheet" href="site.css">
</head>
<body>
<div class="site container">
  <header class="site-header">
    <nav class="site-nav">
      <a class="t-label site-name" href="index.html">Personal styling</a>
      <a class="link-quiet t-control" href="rules.html">Rules</a>
    </nav>
    <button class="button surface surface--rest surface--pill t-control" type="button" id="theme-toggle">Dark</button>
  </header>
  <main class="site-main">
${body}
  </main>
</div>
${scripts}
<script src="site.js"></script>
</body>
</html>
`;

const section = (heading, content) => `<section class="site-section"><h2 class="t-label">${heading}</h2>${content}</section>`;

writeFileSync(join(out, 'index.html'), page('Personal styling', `
<div class="site-intro">
  <h1 class="t-display">Personal styling</h1>
  <p class="t-body">Every component in the library, rendered from the files the skill ships. Change a component in the skill, rebuild, and it changes here.</p>
</div>
<ul class="component-list">
${components.map((c) => `  <li><a class="component-row" href="${c.name}.html"><span class="t-label">${inline(c.title)}</span><span class="t-body component-summary">${inline(c.summary)}</span></a></li>`).join('\n')}
</ul>`));

const skillBody = read(join(skill, 'SKILL.md')).replace(/^---[\s\S]*?---\s*/, '').replace(/^#\s+.+\n/, '');
writeFileSync(join(out, 'rules.html'), page('Rules — Personal styling', `
<div class="site-intro">
  <h1 class="t-display">Rules</h1>
  <p class="t-body">The full skill, as an agent reads it.</p>
</div>
<div class="prose">${markdown(skillBody)}</div>`));

for (const c of components) {
  const sources = [[`${c.name}.html`, c.html], [`${c.name}.css`, c.css], [`${c.name}.js`, c.js]].filter(([, src]) => src);
  writeFileSync(join(out, `${c.name}.html`), page(`${c.title} — Personal styling`, `
<div class="site-intro">
  <h1 class="t-display">${inline(c.title)}</h1>
  <p class="t-body">${inline(c.summary)}</p>
</div>
${c.html ? section('As shipped', `<div class="surface demo">${c.html}</div>`) : ''}
${c.demo ? section('States', `<div class="surface demo">${c.demo}</div>`) : ''}
${c.rest ? section('Guidance', `<div class="prose">${markdown(c.rest)}</div>`) : ''}
${section('Source', sources.map(([name, src]) => `<div class="source"><h3 class="t-caption">${name}</h3><pre class="surface code"><code>${escapeHtml(src)}</code></pre></div>`).join(''))}`));
}

console.log(`build: ${components.length} components → ${out}`);
