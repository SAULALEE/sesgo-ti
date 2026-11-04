export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const ui = {
  es: {
    'site.title': 'SESGO TI | Software a la medida para negocios y escuelas de México',
    'site.description':
      'Diseño y programo software a la medida: aplicaciones, sitios web, sistemas de gestión y automatización con IA para negocios, empresas y escuelas de México.',
    'nav.language': 'Idioma',
    'nav.switchTo': 'English',
    'contact.titleStart': 'Escríbe',
    'contact.titleEnd': 'me.',
    'contact.lead':
      'Aquí no hay agencia ni vendedor. Te contesta la misma persona que va a diseñar y programar tu sistema.',
    'contact.info.email': 'Correo',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.city': 'Desde',
    'contact.info.country': 'México',
    'contact.name': '¿Cómo te llamas?',
    'contact.email': 'Correo',
    'contact.message': '¿Qué te duele?',
    'contact.messagePlaceholder': 'Cuéntamelo como se lo contarías a un amigo.',
    'contact.submit': 'Enviar',
    'contact.sending': 'Enviando…',
    'contact.responseTime': 'Te contesto en {time}.',
    'contact.privacy': 'Tus datos solo se usan para responderte.',
    'contact.thanks': 'Gracias.',
    'contact.thanksName': 'Gracias, {name}.',
    'contact.reply': 'Te escribo a {email}.',
    'contact.replyIn': 'Te escribo a {email} en {time}.',
    'contact.again': 'Escribir otro mensaje',
    'contact.error.invalid':
      'Revisa tus datos: todos los campos son obligatorios y el mensaje debe tener al menos 10 caracteres.',
    'contact.error.captcha': 'No pude verificar que seas una persona. Inténtalo de nuevo.',
    'contact.error.unavailable': 'No se pudo enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
  },
  en: {
    'site.title': 'SESGO TI | Custom software for businesses and schools in Mexico',
    'site.description':
      'I design and build custom software: apps, websites, management systems, and AI automation for businesses, companies, and schools in Mexico.',
    'nav.language': 'Language',
    'nav.switchTo': 'Español',
    'contact.titleStart': 'Write ',
    'contact.titleEnd': 'me.',
    'contact.lead':
      'No agency, no salespeople. You hear back from the same person who will design and build your system.',
    'contact.info.email': 'Email',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.city': 'From',
    'contact.info.country': 'Mexico',
    'contact.name': 'What’s your name?',
    'contact.email': 'Email',
    'contact.message': 'What hurts?',
    'contact.messagePlaceholder': 'Tell me the way you’d tell a friend.',
    'contact.submit': 'Send',
    'contact.sending': 'Sending…',
    'contact.responseTime': 'I reply within {time}.',
    'contact.privacy': 'Your details are only used to reply to you.',
    'contact.thanks': 'Thank you.',
    'contact.thanksName': 'Thank you, {name}.',
    'contact.reply': 'I’ll write to you at {email}.',
    'contact.replyIn': 'I’ll write to you at {email} within {time}.',
    'contact.again': 'Write another message',
    'contact.error.invalid':
      'Please check your details: all fields are required and the message must be at least 10 characters.',
    'contact.error.captcha': 'I could not verify that you are a person. Please try again.',
    'contact.error.unavailable': 'Your message could not be sent. Please try again in a few minutes.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}
