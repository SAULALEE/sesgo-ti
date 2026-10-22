# Arquitectura

Basada en [ADR-001, ADR-002 y ADR-003](decisiones.md). Describe el diseño objetivo; lo implementado hoy se registra en [estado.md](estado.md).

## Componentes

| Componente | Tecnología | Función |
| --- | --- | --- |
| Sitio y rutas de servidor | Astro con `@astrojs/cloudflare` | Páginas de la landing y endpoint del formulario |
| Hosting | Cloudflare Workers con Static Assets | Sirve el sitio y ejecuta el endpoint |
| Base de datos | Supabase (Postgres) | Guarda los envíos del formulario |
| Correo | Resend | Notifica al dueño de cada lead nuevo |

## Flujo del formulario de contacto

```
Visitante
   │  envía el formulario
   ▼
Endpoint de Astro (Worker)
   │  valida los datos
   ├──► Supabase: inserta el registro
   └──► Resend: envía la notificación al dueño
```

El orden y el manejo de fallos (qué pasa si falla uno de los dos destinos) no están decididos; se definen al implementar el formulario.

## Variables de entorno

Valores nunca versionados. En local van en `.dev.vars`; en producción, con `wrangler secret`.

| Variable | Uso |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_*_KEY` | Clave de acceso; el tipo exacto se define al implementar |
| `RESEND_API_KEY` | Envío de correo |
| `CONTACT_TO_EMAIL` | Destinatario de las notificaciones |

## Riesgos conocidos

- **Pausa de Supabase por inactividad** (ADR-002): si el proyecto gratuito se pausa, el formulario falla sin aviso. Sin mitigación decidida.
- **Remitente de pruebas de Resend** (ADR-001): `onboarding@resend.dev` solo envía al correo de la cuenta de Resend. Debe cambiarse cuando exista un dominio propio.
- **Abuso del formulario:** sin protección antispam decidida.
