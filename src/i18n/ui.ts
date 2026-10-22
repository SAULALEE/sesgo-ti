export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const ui = {
  es: {
    'site.description':
      'Estudio de ingeniería de software, inteligencia artificial y diseño de producto.',
    'nav.language': 'Idioma',
    'nav.switchTo': 'English',
    'footer.rights': 'Todos los derechos reservados.',
    'hero.eyebrow': 'Ingeniería de software, inteligencia artificial y diseño de producto',
    'hero.title': 'Ingeniería de precisión, inteligencia artificial y diseño de autor.',
    'hero.lead':
      'Resolvemos problemas de software complejos con estrategia e ingenio arquitectónico: productos elegantes, mantenibles y preparados para escalar.',
    'hero.cta': 'Hablemos de su siguiente arquitectura',
  },
  en: {
    'site.description':
      'Software engineering, artificial intelligence, and product design studio.',
    'nav.language': 'Language',
    'nav.switchTo': 'Español',
    'footer.rights': 'All rights reserved.',
    'hero.eyebrow': 'Software engineering, artificial intelligence, and product design',
    'hero.title': 'Precision engineering, artificial intelligence, and signature design.',
    'hero.lead':
      'We solve complex software problems with strategy and architectural ingenuity: elegant, maintainable products ready to scale.',
    'hero.cta': "Let's talk about your next architecture",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}
