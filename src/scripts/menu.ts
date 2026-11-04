// Full-screen menu: circular reveal is CSS; this toggles it and manages focus.
import { refreshScroll } from './motion';

const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const toggleLabel = document.querySelector<HTMLElement>('[data-menu-label]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const background = document.querySelectorAll<HTMLElement>('main, footer');

function setMenu(open: boolean) {
  if (!header || !toggle || !toggleLabel || !menu) return;
  menu.toggleAttribute('data-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggleLabel.textContent = (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '';
  header.dataset.menu = open ? 'open' : '';
  background.forEach((el) => {
    el.inert = open;
  });
  refreshScroll();
  if (open) {
    setTimeout(() => menu.querySelector<HTMLElement>('nav a')?.focus({ preventScroll: true }), 350);
  }
}

const isOpen = () => menu?.hasAttribute('data-open') ?? false;

toggle?.addEventListener('click', () => setMenu(!isOpen()));

menu?.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isOpen()) {
    setMenu(false);
    toggle?.focus();
  }
});
