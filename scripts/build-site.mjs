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
// fenced code, and inline code / bold / italic / links. A library path in
// inline code — `components/table/` — becomes a link to that page.
const pageNames = new Set();
const codeSpan = (code) => {
  const page = code.match(/^(?:components|patterns)\/([a-z-]+)\/$/);
  return page && pageNames.has(page[1])
    ? `<a class="prose-link" href="${page[1]}.html"><code>${code}</code></a>`
    : `<code>${code}</code>`;
};
const slug = (text) => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(text) {
  const codes = [];
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, (_, code) => `\u0000${codes.push(code) - 1}\u0000`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="prose-link" href="$2">$1</a>')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => codeSpan(codes[i]));
}

const LIST_ITEM = /^\s*(-|\d+\.)\s+/;
const BLOCK_START = /^(```|#{1,6}\s|\|)|^\s*(-|\d+\.)\s/;

// shift: how many levels a "#" heading drops (1 inside a page section, 0
// when the markdown is the page). toc: collects top-level headings.
function markdown(src, { shift = 1, toc = null } = {}) {
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
      const level = Math.min(heading[1].length - 1 + shift + 1, 4);
      const text = inline(heading[2]);
      const id = slug(heading[2]);
      if (toc && level === 2) toc.push({ id, text });
      html.push(`<h${level} class="t-label" id="${id}">${text}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const [head, , ...body] = rows;
      html.push(`<div class="table-wrap"><table class="table"><thead><tr>${cells(head).map((c) => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead>`
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
const collect = (tier) => {
  const tierDir = join(skill, tier);
  if (!existsSync(tierDir)) return [];
  return readdirSync(tierDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map(({ name }) => {
    const dir = join(tierDir, name);
    const file = (f) => (existsSync(join(dir, f)) ? read(join(dir, f)) : null);
    return {
      name,
      tier,
      ...splitReadme(file('README.md') || `# ${name}\n`),
      html: file(`${name}.html`),
      css: file(`${name}.css`),
      js: file(`${name}.js`),
      demo: file('demo.html'),
    };
  });
};
const components = collect('components');
const patterns = collect('patterns');
const all = [...components, ...patterns];
all.forEach((c) => pageNames.add(c.name));
const titleOf = Object.fromEntries(all.map((c) => [c.name, c.title]));

// ---- Emit ----------------------------------------------------------------
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, 'tokens.css'), forceStates(read(join(skill, 'tokens.css'))));
copyFileSync(join(root, 'site/site.css'), join(out, 'site.css'));
copyFileSync(join(root, 'site/site.js'), join(out, 'site.js'));
for (const c of all) {
  mkdirSync(join(out, c.tier, c.name), { recursive: true });
  if (c.css) writeFileSync(join(out, c.tier, c.name, `${c.name}.css`), forceStates(c.css));
  if (c.js) writeFileSync(join(out, c.tier, c.name, `${c.name}.js`), c.js);
}

// Every page loads every component and pattern, so demos can compose them.
// Pattern CSS comes after component CSS, so a pattern can arrange them.
const styles = all.filter((c) => c.css).map((c) => `<link rel="stylesheet" href="${c.tier}/${c.name}/${c.name}.css">`).join('\n');
const scripts = all.filter((c) => c.js).map((c) => `<script src="${c.tier}/${c.name}/${c.name}.js"></script>`).join('\n');

// ---- Chrome, built from the library itself -------------------------------
const CHEVRON = '<svg class="accordion-chevron" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const INFO = '<svg class="intro-info-glyph" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4.25" r="1.25" fill="currentColor"/><path d="M8 7.25v5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';

// The nav is the segmented control at its default size: one truth at a time.
const navOption = (label, href, on) => `<a class="segmented-option t-control${on ? ' is-active' : ''}" href="${href}"${on ? ' aria-current="page"' : ''}>${label}</a>`;
const nav = (active) => `<nav class="segmented" aria-label="Site">
      <span class="segmented-indicator" aria-hidden="true"></span>
      ${navOption('Library', 'index.html', active === 'library')}
      ${navOption('Rules', 'rules.html', active === 'rules')}
    </nav>`;

// Every page opens with the artifact intro pattern.
const intro = (title, description) => `<header class="intro">
  <div class="intro-title-row">
    <h1 class="t-display">${title}</h1>
    <button class="intro-info surface surface--rest surface--pill" type="button" aria-label="About this page" aria-expanded="false" aria-controls="page-about" data-tooltip-toggle="page-about">${INFO}</button>
    <div class="intro-about tooltip tooltip--anchored" id="page-about" hidden><p class="tooltip-text t-mono">${description}</p></div>
  </div>
</header>`;

// One accordion item. Used for source files and the rules contents.
const accordionItem = (id, title, body, { open = false, level = 3 } = {}) => `<div class="accordion-item${open ? ' is-open' : ''}">
  <h${level} class="accordion-heading"><button class="accordion-trigger" type="button" id="${id}-trigger" aria-expanded="${open}" aria-controls="${id}"><span class="t-label">${title}</span>${CHEVRON}</button></h${level}>
  <div class="accordion-panel" id="${id}" role="region" aria-labelledby="${id}-trigger"${open ? '' : ' inert'}><div class="accordion-content"><div class="accordion-body">${body}</div></div></div>
</div>`;

const page = (title, body, active = 'library') => `<!doctype html>
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
    <a class="t-body link-quiet" href="index.html">Personal styling</a>
    <div class="site-actions">
    ${nav(active)}
    <button class="button-text link-quiet t-control" type="button" id="theme-toggle">Dark</button>
    </div>
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

const list = (items) => `<ul class="component-list">
${items.map((c) => `  <li><a class="component-row" href="${c.name}.html"><span class="t-label">${inline(c.title)}</span><span class="t-body component-summary">${inline(c.summary)}</span></a></li>`).join('\n')}
</ul>`;

const section = (heading, content) => `<section class="site-section"><h2 class="t-label">${heading}</h2>${content}</section>`;

writeFileSync(join(out, 'index.html'), page('Personal styling', `
${intro('Library', 'Every pattern and component in the skill, rendered from the files it ships. Patterns arrange components; components are single controls.')}
${section('Patterns', list(patterns))}
${section('Components', list(components))}`));

const skillBody = read(join(skill, 'SKILL.md')).replace(/^---[\s\S]*?---\s*/, '').replace(/^#\s+.+\n/, '');
const toc = [];
const rulesHtml = markdown(skillBody, { shift: 0, toc });
// The contents are a docked control panel holding a segmented list: one
// section is current at a time, so it takes the gliding fill. Beside the
// rules on wide screens; a pill bottom right on narrow ones.
const contents = `<nav class="segmented segmented--list" aria-label="Sections">
      <span class="segmented-indicator" aria-hidden="true"></span>
      ${toc.map((h, i) => `<a class="segmented-option t-control${i === 0 ? ' is-active' : ''}" href="#${h.id}"${i === 0 ? ' aria-current="true"' : ''}>${h.text}</a>`).join('\n      ')}
    </nav>`;
writeFileSync(join(out, 'rules.html'), page('Rules — Personal styling', `
${intro('Rules', 'The full skill, as an agent reads it: foundations, the indexes of patterns and components, motion and voice.')}
<div class="control-dock">
  <div class="prose prose--page">${rulesHtml}</div>
  <section class="control-panel control-panel--docked surface accordion rules-contents" aria-label="Contents">
    <div class="accordion-item is-open" data-closed-below="630">
      <h2 class="accordion-heading"><button class="accordion-trigger" type="button" id="toc-trigger" aria-expanded="true" aria-controls="toc"><span class="t-mono">Contents</span>${CHEVRON}</button></h2>
      <div class="accordion-panel" id="toc" role="region" aria-labelledby="toc-trigger"><div class="accordion-content"><div class="accordion-body">${contents}</div></div></div>
    </div>
  </section>
</div>`, 'rules'));

// A pattern is page-sized, so it renders on the page between dividers
// rather than inside a demo surface — a control panel in a card in a card
// would be the defect the rules warn about.
const stage = (c, html) => (c.tier === 'patterns'
  ? `<div class="pattern-stage">${html}</div>`
  : `<div class="surface demo">${html}</div>`);

for (const c of all) {
  const sources = [[`${c.name}.html`, c.html], [`${c.name}.css`, c.css], [`${c.name}.js`, c.js]].filter(([, src]) => src);
  // "Requires: a, b" links to each component's page.
  const rest = c.rest.replace(/^Requires: (.+)$/m, (_, names) => `Requires: ${names.split(',').map((n) => n.trim()).map((n) => `[${titleOf[n] || n}](${n}.html)`).join(', ')}`);
  writeFileSync(join(out, `${c.name}.html`), page(`${c.title} — Personal styling`, `
${intro(inline(c.title), inline(c.summary))}
${c.html ? section('As shipped', stage(c, c.html)) : ''}
${c.demo ? section('States', stage(c, c.demo)) : ''}
${rest ? section('Guidance', `<div class="prose">${markdown(rest)}</div>`) : ''}
${section('Source', `<div class="accordion">${sources.map(([name, src], i) => accordionItem(`source-${i}`, name, `<pre class="surface code"><code>${escapeHtml(src)}</code></pre>`)).join('')}</div>`)}`));
}

console.log(`build: ${components.length} components, ${patterns.length} patterns → ${out}`);
