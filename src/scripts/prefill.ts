// Links with data-prefill carry their text into the contact form; the anchor does the scrolling.
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const link = target?.closest<HTMLElement>('[data-prefill]');
  if (!link) return;
  window.dispatchEvent(new CustomEvent('contact:prefill', { detail: link.dataset.prefill ?? '' }));
});
