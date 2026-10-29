// Theme toggle. The button names the theme it switches to. The choice is a
// per-viewer convenience, so storage failures are ignored.
const toggle = document.getElementById('theme-toggle');
const current = () => document.documentElement.dataset.theme
  || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const render = () => { toggle.textContent = current() === 'dark' ? 'Light' : 'Dark'; };

toggle.addEventListener('click', () => {
  const next = current() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ps-theme', next); } catch {}
  render();
});
render();
