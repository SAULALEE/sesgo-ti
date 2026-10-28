# Arquitectura

Basada en [ADR-001 a ADR-006](decisiones.md). Describe el diseño; lo implementado y verificado hoy se registra en [estado.md](estado.md).

## Componentes

| Componente | Tecnología | Función |
| --- | --- | --- |
| Sitio y rutas de servidor | Astro con `@astrojs/cloudflare` | Páginas estáticas de la landing y un único endpoint de servidor, `POST /api/contact` (ADR-006) |
| Hosting | Cloudflare Workers con Static Assets | Sirve el sitio y ejecuta el endpoint |
| Antispam | Cloudflare Turnstile | Verifica que el envío proviene de una persona (ADR-005) |
| Base de datos | Supabase (Postgres) | Guarda los envíos del formulario |
| Correo | Resend | Notifica al dueño de cada lead nuevo |

## Flujo del formulario de contacto

```
Visitante
   │  completa el formulario y el widget de Turnstile
   ▼
POST /api/contact (Worker)
   │  1. valida los campos
   │  2. verifica el token de Turnstile en el servidor
   ├──► 3a. Supabase: inserta el registro   ┐ en paralelo
   └──► 3b. Resend: notifica al dueño        ┘
```

**Respuestas del endpoint** (JSON `{ ok, error? }`):

| Código | `error` | Causa |
| --- | --- | --- |
| 200 | — | Al menos uno de los dos destinos (Supabase o Resend) tuvo éxito |
| 400 | `invalid` | Campos ausentes o fuera de los límites, o cuerpo que no es un formulario |
| 400 | `captcha` | Token de Turnstile ausente, vencido o inválido |
| 502 | `unavailable` | Fallaron Supabase y Resend |
| 500 | `unavailable` | Falta alguna variable de entorno |

**Manejo de fallos parciales.** Supabase y Resend se intentan a la vez. Si uno falla y el otro funciona, el visitante recibe éxito y el fallo se registra en los logs del Worker. Así, un proyecto de Supabase pausado (ADR-002) no hace perder el contacto mientras el correo siga funcionando. La solicitud falla solo si fallan ambos.

**Límites de validación:** nombre hasta 100 caracteres, correo hasta 254, mensaje de 10 a 2000, idioma `es` o `en`.

## Esquema de datos

Definido en `supabase/contact_messages.sql`: tabla `contact_messages` con `id`, `created_at`, `name`, `email`, `message` y `locale`, con las mismas restricciones de longitud que el endpoint. Tiene Row Level Security activado y ninguna política, de modo que los roles `anon` y `authenticated` no pueden leer ni escribir. Solo el servidor inserta filas, con la clave secreta de Supabase, que omite RLS.

## Variables de entorno

Valores nunca versionados. Las de servidor van en `.dev.vars` en local y en producción con `wrangler secret`; la variable pública de build va en `.env`.

| Variable | Dónde | Uso |
| --- | --- | --- |
| `SUPABASE_URL` | Servidor | URL del proyecto de Supabase |
| `SUPABASE_SECRET_KEY` | Servidor | Clave secreta (`sb_secret_...`), enviada en el encabezado `apikey` |
| `RESEND_API_KEY` | Servidor | Envío de correo |
| `CONTACT_TO_EMAIL` | Servidor | Destinatario de las notificaciones |
| `CONTACT_FROM_EMAIL` | Servidor, opcional | Remitente; por defecto `SESGO TI <onboarding@resend.dev>` |
| `TURNSTILE_SECRET_KEY` | Servidor | Verificación del token de Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build (`.env`) | Clave pública del widget; sin ella el formulario se muestra sin widget y el endpoint rechaza los envíos |
| `SITE_URL` | Build, opcional | Dominio de producción; habilita `canonical` y `hreflang` |

## Riesgos conocidos

- **Pausa de Supabase por inactividad** (ADR-002): si el proyecto gratuito se pausa, los contactos solo llegan por correo y el fallo queda únicamente en los logs. No hay alerta ni mitigación decidida.
- **Remitente de pruebas de Resend** (ADR-001): `onboarding@resend.dev` solo envía al correo de la cuenta de Resend. Debe cambiarse cuando exista un dominio propio.
- **Dependencia de JavaScript:** el formulario se envía con JavaScript; sin él, el navegador recibiría la respuesta JSON del endpoint.
- **Sin verificar de extremo a extremo:** la integración real con Turnstile, Supabase y Resend no se ha probado (faltan credenciales). La ruta REST de Supabase (`/rest/v1/contact_messages`) y el reinicio del widget con `turnstile.reset()` no se confirmaron en la documentación.
- **Límite de CPU de Workers gratuito** (ADR-006): 10 ms por invocación; no se ha medido el endpoint.
