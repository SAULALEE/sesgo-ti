# Brand and Product Context

> Spanish source: [`../es/contexto-marca.md`](../es/contexto-marca.md). The Spanish version is canonical; this file mirrors it.

> **Partial draft.** What follows was provided by the project owner. Points marked _Pending_ are not decided.

Technical context (ADR-001): SESGO TI needs a landing page to attract external clients, built by a single person.

## 1. What SESGO TI is

Presents itself as a **studio / agency**, although development is currently done by a single person (ADR-001). _Pending: description in one or two sentences._

## 2. Target audience

**SMBs** (small and medium-sized businesses). _Pending: industry and role of the decision maker._

## 3. Services

**What is shown:**

- Cross-platform software development.
- Custom ERPs.
- AI integration and automation.
- Product design (UX/UI).

**Focus of the detail:** architecture, problem solving, and business impact, rather than generic technology lists. Services are shown through the process: **Diagnosis → Design → Engineering → Deployment**.

**Pricing and packages:** no public prices and no rigid packages. Engagement models:

- Fixed-fee Discovery Sprints.
- Custom projects at a closed budget.
- Retainer (ongoing cells) for software evolution.

## 4. Value proposition

Convergence of precision engineering, artificial intelligence, and signature design. Complex software problems are solved through strategy and architectural ingenuity (the "bias", *sesgo*), creating elegant, maintainable products ready to scale toward future ecosystems (physical, educational, or SaaS).

## 5. Conversion goal

The main action is **submitting the contact form** (ADR-001). _Pending: how success is measured._

## 6. Tone and voice

Sober, cultured, precise, mature, and direct. Avoids inflated startup jargon ("disruptive", "synergy") and an aggressive sales tone. Speaks with elegance and technical solidity. The reader is addressed formally (**usted** in Spanish). Example register: "Hablemos de su siguiente arquitectura" ("Let's talk about your next architecture").

## 7. Site language(s)

**Spanish and English.** Spanish by default at the root (`/`), English under `/en` (ADR-004).

## 8. Visual identity

- **Logo:** abstract, fluid mark with soft edges, with a hidden idea of a lens / cyclops eye, cut by a clean 45° line that symbolizes the "bias" (*sesgo*). _Pending: logo files._
- **Palette:**

  | Role | Name | Value |
  | --- | --- | --- |
  | Background | Mirage | `#1b2232` |
  | Primary accent | Danube | `#5b83d3` |
  | Secondary accent | Westar | `#dfdddb` |

  Contrast measured against the Mirage background (WCAG): Westar 11.73:1; Danube 4.26:1. Danube does not reach 4.5:1 for normal body text; it is suitable for large headings and interface elements (3:1 minimum). For small text on the background, use Westar.

- **Typography:** Instrument Serif for wordmark and headings (classic, signature character); Inter for technical subheads, body, and subtitles (precision and engineering).

## 9. Content and proof

- **Case studies:** structured as engineering and design essays: Problem → Applied bias → Architecture / Interface → Impact.
- **Testimonials:** short quotes from decision makers (CEOs, CTOs) focused on the system's reliability and elegance.
- **Thought leadership:** articles and publications on software architecture and design in the age of AI, to build intellectual authority.

_Pending: state whether real case studies, testimonials, or articles already exist. Sample content will not be published as if it were real._
