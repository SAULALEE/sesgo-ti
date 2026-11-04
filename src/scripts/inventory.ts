// Inventory demo: sells on its own while visible, and on tap.
import { isSceneActive, reduced } from './motion';

interface Item {
  n: string;
  s: number;
  max: number;
  min: number;
  ordered?: boolean;
}

const root = document.querySelector<HTMLElement>('[data-inventory]');

if (root) {
  const items = JSON.parse(root.dataset.items ?? '[]') as Item[];
  const strings = JSON.parse(root.dataset.strings ?? '{}') as Record<string, string>;
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-row]'));
  const salesEl = root.querySelector<HTMLElement>('[data-sales]');
  const logEl = root.querySelector<HTMLElement>('[data-log]');
  let sales = 0;
  let flashTimer: ReturnType<typeof setTimeout>;

  const format = (template: string, values: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

  function renderRow(i: number) {
    const item = items[i];
    const row = rows[i];
    const low = item.s <= item.min;
    row.classList.toggle('is-low', low);
    const bar = row.querySelector<HTMLElement>('[data-bar]');
    const stock = row.querySelector<HTMLElement>('[data-stock]');
    const chip = row.querySelector<HTMLElement>('[data-chip]');
    if (bar) bar.style.transform = `scaleX(${(item.s / item.max).toFixed(3)})`;
    if (stock) stock.textContent = String(item.s);
    if (chip) chip.textContent = low ? strings.statusLow : strings.statusOk;
  }

  function sell(i: number) {
    const item = items[i];
    let log: string;
    if (item.s <= 1) {
      item.s = item.max;
      item.ordered = false;
      log = format(strings.restock, { n: item.n, max: item.max });
    } else {
      item.s -= 1;
      sales += 1;
      log = format(strings.sold, { n: item.n, s: item.s });
      if (item.s <= item.min && !item.ordered) {
        item.ordered = true;
        log = format(strings.reorder, { n: item.n, s: item.s, q: item.max - item.s });
      }
    }
    renderRow(i);
    if (salesEl) salesEl.textContent = String(sales);
    if (logEl) logEl.textContent = log;

    rows.forEach((row, k) => row.classList.toggle('is-flash', k === i));
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => rows[i].classList.remove('is-flash'), 650);
  }

  items.forEach((_, i) => renderRow(i));
  rows.forEach((row, i) => row.addEventListener('click', () => sell(i)));

  setInterval(() => {
    if (!reduced && isSceneActive(0)) sell(Math.floor(Math.random() * items.length));
  }, 1700);
}
