// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Set SITE_URL at build time once a production domain exists; enables canonical and hreflang URLs.
  site: process.env.SITE_URL || undefined,
  adapter: cloudflare(),
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
});
