// Page-wide motion: stacked sheets, ribbon, reveals, scroll-linked steps, header tone, and the clock.
// Runs one requestAnimationFrame loop; other scripts join it through onFrame().

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const SHEET_DEPTH = 0.05;

const frameCallbacks: Array<() => void> = [];
export const onFrame = (callback: () => void) => {
  frameCallbacks.push(callback);
};

let prevY = -1;
/** Forces the scroll-driven state to recompute on the next frame. */
export const refreshScroll = () => {
  prevY = -1;
};

const stage = document.querySelector<HTMLElement>('[data-stage]');

export function stageVisible() {
  if (!stage) return false;
  const rect = stage.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
}

/** True when the given case scene is selected and on screen. */
export const isSceneActive = (scene: number) =>
  stage?.dataset.scene === String(scene) && stageVisible();

// Marquees loop by translating half their width, so each group needs a copy.
document.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
  const copy = group.cloneNode(true) as HTMLElement;
  copy.removeAttribute('data-group');
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll<HTMLElement>('button,a').forEach((el) => {
    el.tabIndex = -1;
  });
  group.parentNode?.appendChild(copy);
});

const sheets = Array.from(document.querySelectorAll<HTMLElement>('[data-sheet]'));
const footer = document.querySelector('footer');
const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-step]'));
const ribbon = document.querySelector<HTMLElement>('[data-ribbon]');
const header = document.querySelector<HTMLElement>('[data-header]');

// A sheet taller than the viewport sticks at a negative top so its end can be read.
function layoutSheets() {
  const vh = window.innerHeight;
  sheets.forEach((sheet) => {
    sheet.style.top = `${Math.min(0, vh - sheet.offsetHeight)}px`;
  });
}

// Titles below the fold stay clipped until a quarter of them is on screen. This reads the
// rect on scroll because IntersectionObserver counts the element's own clip-path as zero area.
let pendingReveals = reduced
  ? []
  : Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
pendingReveals.forEach((el) => {
  el.style.clipPath = 'inset(0 0 100% 0)';
});

function updateReveals(vh: number) {
  pendingReveals = pendingReveals.filter((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top + rect.height * 0.25 > vh) return true;
    el.style.clipPath = '';
    el.animate(
      [
        { clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(0,35%,0) skewY(4deg)' },
        { clipPath: 'inset(-10% -10% -25% -10%)', transform: 'none' },
      ],
      { duration: 1150, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
    return false;
  });
}

function updateTone() {
  if (!header) return;
  let tone = 'dark';
  if (header.dataset.menu === 'open') {
    tone = 'danube';
  } else {
    for (const el of document.elementsFromPoint(window.innerWidth / 2, 34)) {
      if (el.closest('header')) continue;
      const toned = el.closest('[data-tone]');
      if (toned) {
        tone = toned.getAttribute('data-tone') ?? tone;
        break;
      }
    }
  }
  header.dataset.logoTone = tone;
}

function updateScroll(vh: number) {
  sheets.forEach((sheet, i) => {
    const next = sheets[i + 1] ?? footer;
    const top = next ? next.getBoundingClientRect().top : vh;
    const progress = Math.max(0, Math.min(1, (vh - top) / vh));
    sheet.style.setProperty('--p', reduced ? '0' : progress.toFixed(3));
    sheet.style.setProperty('--d', String(SHEET_DEPTH));
  });
  steps.forEach((step) => {
    const top = step.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (vh * 0.98 - top) / (vh * 0.42)));
    step.style.setProperty('--s', reduced ? '1' : progress.toFixed(3));
  });
  updateReveals(vh);
  updateTone();
}

function relayout() {
  layoutSheets();
  refreshScroll();
}

layoutSheets();
window.addEventListener('resize', relayout);
window.addEventListener('load', relayout);
const resizeObserver = new ResizeObserver(relayout);
sheets.forEach((sheet) => resizeObserver.observe(sheet));
document.fonts?.ready.then(relayout);

const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
const clockFormat = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});
function tick() {
  const time = clockFormat.format(new Date());
  clocks.forEach((clock) => {
    clock.textContent = time;
  });
}
tick();
setInterval(tick, 1000);

let ribbonX = 0;
let velocity = 0;
let direction = 1;
let lastY = window.scrollY;
let lastVh = window.innerHeight;

function frame() {
  requestAnimationFrame(frame);
  const vh = window.innerHeight;
  const y = window.scrollY;
  const dy = y - lastY;
  lastY = y;
  velocity += (dy - velocity) * 0.12;
  if (Math.abs(dy) > 0.5) direction = dy > 0 ? 1 : -1;

  if (!reduced && ribbon) {
    ribbonX -= (0.7 + Math.min(Math.abs(velocity) * 0.35, 16)) * direction;
    const half = ribbon.scrollWidth / 2;
    if (half > 0) {
      while (ribbonX <= -half) ribbonX += half;
      while (ribbonX > 0) ribbonX -= half;
    }
    ribbon.style.transform = `translate3d(${ribbonX.toFixed(1)}px,0,0)`;
  }

  if (vh !== lastVh) {
    lastVh = vh;
    relayout();
  }
  if (y !== prevY) {
    prevY = y;
    updateScroll(vh);
  }
  frameCallbacks.forEach((callback) => callback());
}
requestAnimationFrame(frame);
