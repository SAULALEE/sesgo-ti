// Idea demo: the questions echo what the visitor types, and the link carries it to the form.
import { shorten } from '../lib/text';

const root = document.querySelector<HTMLElement>('[data-idea]');
const input = root?.querySelector<HTMLInputElement>('[data-idea-input]');
const intro = root?.querySelector<HTMLElement>('[data-idea-intro]');
const send = root?.querySelector<HTMLElement>('[data-idea-send]');

if (root && input && intro && send) {
  const { intro: template = '', fallback = '', prefix = '' } = root.dataset;

  const render = () => {
    const idea = input.value.trim();
    intro.textContent = template.replace('{idea}', idea ? shorten(idea) : fallback);
    send.dataset.prefill = `${prefix}${idea}`;
  };

  input.addEventListener('input', render);
  root.querySelectorAll<HTMLElement>('[data-example]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.example ?? '';
      render();
    });
  });
}
