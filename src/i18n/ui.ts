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
    'home.title': 'SESGO TI',
    'home.placeholder': 'Hablemos de su siguiente arquitectura.',
  },
  en: {
    'site.description':
      'Software engineering, artificial intelligence, and product design studio.',
    'nav.language': 'Language',
    'nav.switchTo': 'Español',
    'footer.rights': 'All rights reserved.',
    'home.title': 'SESGO TI',
    'home.placeholder': "Let's talk about your next architecture.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}
