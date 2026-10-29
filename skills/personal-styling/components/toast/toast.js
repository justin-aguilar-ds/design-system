/* personal-styling · toast · v0.3.0 */

// A click on [data-toast] shows that message in the .toast beside it, in the
// same .toast-anchor. Add data-copy to copy text to the clipboard first.
const TOAST_VISIBLE_MS = 1500;
const toastTimers = new WeakMap();

// execCommand fallback for non-secure contexts (plain HTTP), where
// navigator.clipboard doesn't exist.
function copyWithFallback(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => copyWithFallback(text));
  }
  return copyWithFallback(text);
}

function showToast(toast, message) {
  clearTimeout(toastTimers.get(toast));
  toast.textContent = message; // role="status" announces the new text
  toast.classList.add('is-visible');
  toastTimers.set(toast, setTimeout(() => toast.classList.remove('is-visible'), TOAST_VISIBLE_MS));
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast]');
  const toast = trigger?.closest('.toast-anchor')?.querySelector('.toast');
  if (!toast) return;
  if (!trigger.dataset.copy) {
    showToast(toast, trigger.dataset.toast);
    return;
  }
  copyText(trigger.dataset.copy).then(
    () => showToast(toast, trigger.dataset.toast),
    () => showToast(toast, 'Couldn’t copy'),
  );
});
