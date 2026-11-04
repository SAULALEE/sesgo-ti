// Custom cursor, magnetic buttons, and the letter tilt. Only runs with a fine pointer.
import { fine, onFrame, reduced } from './motion';

const ring = document.querySelector<HTMLElement>('[data-ring]');
const label = document.querySelector<HTMLElement>('[data-ring-label]');

if (fine && ring && label) {
  const cursorRing = ring;
  const cursorLabel = label;
  cursorRing.style.display = 'flex';
  document.documentElement.setAttribute('data-cursor', 'on');

  const mouse = { x: -300, y: -300, moved: false };
  const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]')).map(
    (el) => ({ el, x: 0, y: 0 }),
  );
  const letters = Array.from(document.querySelectorAll<HTMLElement>('[data-l]')).map((el) => ({
    el,
    t: 0,
  }));
  let cx = -300;
  let cy = -300;
  let scale = 0.16;
  let hoverScale = 0.16;
  let currentTone = '';
  const palette = getComputedStyle(document.documentElement);
  const ink = palette.getPropertyValue('--color-text').trim();
  const paper = palette.getPropertyValue('--color-bg').trim();

  window.addEventListener(
    'pointermove',
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.moved = true;
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    mouse.x = -300;
    mouse.y = -300;
  });

  document.addEventListener('pointerover', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const el = target?.closest('[data-cursor-label],a,button,input,textarea');
    if (!el) {
      hoverScale = 0.16;
      cursorLabel.style.opacity = '0';
      return;
    }
    if (el.matches('input,textarea')) {
      hoverScale = 0.08;
      cursorLabel.style.opacity = '0';
      return;
    }
    const text = el.getAttribute('data-cursor-label');
    if (text) {
      hoverScale = 1;
      cursorLabel.textContent = text;
      cursorLabel.style.opacity = '1';
    } else {
      hoverScale = 0.45;
      cursorLabel.style.opacity = '0';
    }
  });

  function updateTone() {
    let tone = 'dark';
    for (const el of document.elementsFromPoint(mouse.x, mouse.y)) {
      const toned = el.closest('[data-tone]');
      if (toned) {
        tone = toned.getAttribute('data-tone') ?? tone;
        break;
      }
    }
    if (tone === currentTone) return;
    currentTone = tone;
    const dark = tone === 'dark';
    cursorRing.style.background = dark ? ink : paper;
    cursorLabel.style.color = dark ? paper : ink;
  }

  function updateMagnets() {
    magnets.forEach((magnet) => {
      const rect = magnet.el.getBoundingClientRect();
      const dx = mouse.x - (rect.left + rect.width / 2 - magnet.x);
      const dy = mouse.y - (rect.top + rect.height / 2 - magnet.y);
      const inside = Math.hypot(dx, dy) < Math.max(rect.width, rect.height) / 2 + 70;
      magnet.x += ((inside ? dx * 0.3 : 0) - magnet.x) * 0.18;
      magnet.y += ((inside ? dy * 0.3 : 0) - magnet.y) * 0.18;
      if (!inside && Math.abs(magnet.x) < 0.05 && Math.abs(magnet.y) < 0.05) {
        magnet.el.style.transform = '';
        return;
      }
      magnet.el.style.transform = `translate3d(${magnet.x.toFixed(2)}px,${magnet.y.toFixed(2)}px,0)`;
    });
  }

  function updateLetters() {
    const vh = window.innerHeight;
    letters.forEach((letter) => {
      const rect = letter.el.getBoundingClientRect();
      let target = 0;
      if (rect.bottom > 0 && rect.top < vh) {
        const distance = Math.hypot(
          mouse.x - (rect.left + rect.width / 2),
          mouse.y - (rect.top + rect.height / 2),
        );
        target = Math.max(0, 1 - distance / (rect.height * 1.3)) ** 2;
      }
      const next = letter.t + (target - letter.t) * 0.14;
      if (Math.abs(next - letter.t) < 0.0005 && target === 0 && letter.t < 0.001) return;
      letter.t = next;
      letter.el.style.transform = `translate3d(0,${(-next * 9).toFixed(2)}%,0) skewX(${(-next * 18).toFixed(2)}deg) scale(${(1 + next * 0.07).toFixed(3)})`;
    });
  }

  onFrame(() => {
    const follow = reduced ? 1 : 0.2;
    cx += (mouse.x - cx) * follow;
    cy += (mouse.y - cy) * follow;
    scale += (hoverScale - scale) * (reduced ? 1 : 0.18);
    cursorRing.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
    if (mouse.moved) {
      mouse.moved = false;
      updateTone();
    }
    if (reduced) return;
    updateMagnets();
    updateLetters();
  });
}
