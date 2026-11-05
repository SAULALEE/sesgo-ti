// Keeps the reading position when switching language: the target page restores the same
// section and the same offset inside it, instead of starting at the top.
const KEY = 'sg-lang-scroll';

const sheets = Array.from(document.querySelectorAll<HTMLElement>('[data-sheet]'));

// Sheets are sticky and move with scroll, so positions come from the static .anchor before each one.
// The hero and the problems sheet have no anchor, so that opening stretch is restored by absolute offset.
function topOf(index: number) {
  const anchor = sheets[index]?.previousElementSibling;
  if (!anchor?.classList.contains('anchor')) return 0;
  return anchor.getBoundingClientRect().top + window.scrollY;
}

function currentPosition() {
  let index = 0;
  for (let i = 0; i < sheets.length; i++) {
    if (topOf(i) <= window.scrollY + 1) index = i;
  }
  return { index, offset: window.scrollY - topOf(index) };
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLAnchorElement>('a[hreflang]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = new URL(link.href, window.location.href).pathname;
    sessionStorage.setItem(KEY, JSON.stringify({ ...currentPosition(), target }));
    const plain = event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
    if (reduced || !plain) return;
    // Wipe the page out first, then navigate; the new page wipes back in (see sgWipeIn/sgWipeOut in global.css).
    event.preventDefault();
    document.documentElement.classList.add('lang-leaving');
    setTimeout(() => {
      window.location.href = link.href;
    }, 700);
  });
});

// Back/forward restores this page from cache with the wipe still applied.
window.addEventListener('pageshow', () => document.documentElement.classList.remove('lang-leaving'));

if (document.documentElement.hasAttribute('data-lang-enter')) {
  setTimeout(() => document.documentElement.removeAttribute('data-lang-enter'), 1000);
}

const saved = sessionStorage.getItem(KEY);
if (saved) {
  sessionStorage.removeItem(KEY);
  const { index, offset, target } = JSON.parse(saved) as { index: number; offset: number; target: string };
  if (target === window.location.pathname) {
    const restore = () => window.scrollTo({ top: topOf(index) + offset, behavior: 'instant' });
    restore();
    // Fonts and images shift the layout after the first pass.
    window.addEventListener('load', restore, { once: true });
  }
}
