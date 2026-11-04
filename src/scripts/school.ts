// School portal demo: tabs and the three sample actions.
const root = document.querySelector<HTMLElement>('[data-school]');

if (root) {
  const { downloaded, paid, paidNote, confirmed } = root.dataset;
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'));

  function select(i: number) {
    tabs.forEach((other, k) => {
      other.setAttribute('aria-selected', String(k === i));
      other.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach((panel, k) => {
      panel.hidden = k !== i;
    });
  }

  // Arrow keys, Home and End move between tabs, as the tabs pattern expects.
  const keyTarget = (key: string, i: number) => {
    if (key === 'ArrowRight') return (i + 1) % tabs.length;
    if (key === 'ArrowLeft') return (i - 1 + tabs.length) % tabs.length;
    if (key === 'Home') return 0;
    if (key === 'End') return tabs.length - 1;
    return -1;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const target = keyTarget(event.key, i);
      if (target < 0) return;
      event.preventDefault();
      select(target);
      tabs[target].focus();
    });
  });

  root.querySelector('[data-download]')?.addEventListener('click', () => {
    const label = root.querySelector('[data-download-label]');
    if (label) label.textContent = downloaded ?? '';
  });

  const pay = root.querySelector<HTMLElement>('[data-pay]');
  pay?.addEventListener('click', () => {
    pay.textContent = paid ?? '';
    pay.classList.add('is-paid');
    const note = root.querySelector('[data-pay-note]');
    if (note) note.textContent = paidNote ?? '';
  });

  const confirm = root.querySelector<HTMLElement>('[data-confirm]');
  confirm?.addEventListener('click', () => {
    confirm.textContent = confirmed ?? '';
  });
}

export {};
