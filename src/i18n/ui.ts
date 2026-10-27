export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const ui = {
  es: {
    'site.title': 'SESGO TI | Ingeniería de software, IA y diseño de producto',
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
    'services.title': 'Servicios',
    'services.lead':
      'Cada servicio se aborda desde la arquitectura, la resolución de problemas y el impacto en su negocio.',
    'services.software.title': 'Desarrollo de software multiplataforma',
    'services.software.body':
      'Aplicaciones web, móviles y de escritorio construidas sobre una arquitectura clara, pensada para mantenerse y crecer.',
    'services.erp.title': 'ERPs a medida',
    'services.erp.body':
      'Sistemas de gestión que reflejan cómo opera su empresa, en lugar de obligarla a adaptarse a un producto genérico.',
    'services.ai.title': 'Integración de IA y automatizaciones',
    'services.ai.body':
      'Inteligencia artificial y flujos automatizados aplicados donde reducen trabajo repetitivo o mejoran decisiones.',
    'services.design.title': 'Diseño de producto (UX/UI)',
    'services.design.body':
      'Interfaces precisas y sobrias que hacen que el sistema sea claro de usar y coherente de principio a fin.',
    'process.title': 'Proceso',
    'process.diagnosis.title': 'Diagnóstico',
    'process.diagnosis.body':
      'Entendemos el problema, el contexto y las restricciones antes de proponer una solución.',
    'process.design.title': 'Diseño',
    'process.design.body': 'Definimos la arquitectura y la interfaz que resuelven ese problema.',
    'process.engineering.title': 'Ingeniería',
    'process.engineering.body':
      'Construimos con foco en calidad, mantenibilidad y verificación.',
    'process.deployment.title': 'Despliegue',
    'process.deployment.body':
      'Ponemos el sistema en producción y lo dejamos preparado para evolucionar.',
  },
  en: {
    'site.title': 'SESGO TI | Software engineering, AI, and product design',
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
    'services.title': 'Services',
    'services.lead':
      'Each service is approached through architecture, problem solving, and the impact on your business.',
    'services.software.title': 'Cross-platform software development',
    'services.software.body':
      'Web, mobile, and desktop applications built on a clear architecture, designed to be maintained and to grow.',
    'services.erp.title': 'Custom ERPs',
    'services.erp.body':
      'Management systems that reflect how your company operates, instead of forcing it to adapt to a generic product.',
    'services.ai.title': 'AI integration and automation',
    'services.ai.body':
      'Artificial intelligence and automated workflows applied where they reduce repetitive work or improve decisions.',
    'services.design.title': 'Product design (UX/UI)',
    'services.design.body':
      'Precise, restrained interfaces that make the system clear to use and consistent from end to end.',
    'process.title': 'Process',
    'process.diagnosis.title': 'Diagnosis',
    'process.diagnosis.body':
      'We understand the problem, the context, and the constraints before proposing a solution.',
    'process.design.title': 'Design',
    'process.design.body': 'We define the architecture and the interface that solve that problem.',
    'process.engineering.title': 'Engineering',
    'process.engineering.body':
      'We build with a focus on quality, maintainability, and verification.',
    'process.deployment.title': 'Deployment',
    'process.deployment.body':
      'We put the system into production and leave it ready to evolve.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}
