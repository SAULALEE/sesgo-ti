// Public contact details. Anything left empty is not rendered on the site.
export const site = {
  email: '',
  // Mexican number without country code; the link adds +52. Empty hides it.
  whatsapp: '5580163085',
  city: '',
  responseTime: { es: '', en: '' },
  // Katedra, the maintainer's own deployed project, linked as real work.
  // The URL is not translatable, so it lives here instead of in i18n/landing.ts.
  project: {
    app: 'https://katedra-client.vercel.app',
  },
};

/** "55 8016 3085" for display. */
export const whatsappDisplay = () =>
  site.whatsapp.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1 $2 $3');

/** wa.me link that opens the chat with the message already typed. */
export const whatsappUrl = (message: string) =>
  `https://wa.me/52${site.whatsapp}?text=${encodeURIComponent(message)}`;

