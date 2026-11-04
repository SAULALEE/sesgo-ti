---
name: styling-and-visual-design
description: Rules for writing and organizing CSS and for the visual and motion style of the SESGO TI site. Use when creating or editing components, styles, animations, colors, typography, or any visible UI.
---

# Styling and Visual Design

The brand source is `docs/es/contexto-marca.md` (§8 visual identity) and ADR-007. This skill defines how styles are written and the visual language the landing currently uses. If code and brand docs disagree, report it (see `05-project-context-and-continuity`); do not edit one to match the other silently.

## 1. Where styles live

- **No `<style>` blocks in `.astro` files.** Each component has its own file in `src/styles/components/<component-name>.css` (kebab-case, for example `site-header.css`, `chat-demo.css`).
- Import it in the component frontmatter: `import '../styles/components/site-header.css';` (adjust the relative path).
- Shared rules live in `src/styles/global.css`: design tokens in `:root`, the base reset, the sheet system, shared case classes, keyframes, and the reduced-motion block. Add to it only what two or more components need.
- Pages (`src/pages/`) and layouts contain no styling.
- Inline `style=` is allowed only for values computed per element (`--i`, `animation-delay`, `scaleX(...)`) or state a script changes at runtime (`visibility`). Anything static goes in a CSS file.

## 2. Naming: CSS is global

Astro no longer scopes these files, so every selector must be unique across the project.

- Name classes `block__element` with a prefix unique to the component (`hero__title`, `chat__msg`, `school__note-kicker`). Reusing a class name in two files with different rules is a bug.
- Shared classes (`case-card`, `case-cta`, `case-note`, `case-kicker`, `.anchor`, `.sheet`) live in `global.css` only. A component adjusts them through its own prefixed class.
- No selectors that start with a bare element (`label`, `input`, `span`). Qualify with a class (`.contact__field`, `textarea.contact__control`). Descendant elements under a prefixed class are fine (`.hero__lead strong`).
- No `:global()`. No `!important` in component files; the only uses are in `global.css` (`[hidden]`, the hidden system cursor, and reduced motion).
- Before adding a class, search for it: `grep -rn "\.name\b" src/styles`.
- A scripted state is a class or data attribute set by the script (`.is-low`, `[aria-pressed]`), styled in the component file.

## 3. Tokens

- Use the variables in `:root`; never repeat a hex value in a component file or in a script. Scripts that need a color read it with `getComputedStyle`.
- Palette (§8): `--color-bg` Mirage `#1b2232`, `--color-accent` Danube `#5b83d3`, `--color-text` Westar `#dfdddb`. The derived shades (`--color-shade`, `--color-surface`, `--color-field`, `--color-deep`, `--color-flash`, `--color-paper`, `--color-bubble`, `--color-text-soft`, `--color-ink-soft`) already exist. Add a new one to `:root` with a comment on why, rather than a local literal.
- Fonts: `--font-display` (Instrument Serif) and `--font-body` (Inter). Both come from `astro.config.mjs`; do not add a font without a decision.
- Easings: `--ease-out`, `--ease-soft`, `--ease-inout`. Radius of the stacked sheets: `--sheet-radius`.

## 4. Visual language

- **Contrast.** Westar for all small text on Mirage (11.73:1). Danube (4.26:1) only for large headings and UI elements, never for body text. Check contrast when a new color pair appears.
- **Sections as stacked sheets.** Sections are `.sheet` cards that stick and slide over the previous one, with rounded top corners and a darkening veil. A new section uses `data-sheet`, a `sheet__veil` child and a `data-tone`.
- **Tone.** Each sheet declares `data-tone="dark"`, `"light"` or `"danube"`. The header and the custom cursor read it to change color. A new colored block needs one.
- **Type.** Display type is large and fluid (`clamp(...)` up to several hundred px), tight (`line-height` around 1 or below, negative letter-spacing). One or two key words per title use the italic style. Body copy is Inter, 14 to 17 px.
- **Shapes.** Pills (`border-radius: 999px`) for buttons and chips, 24 to 32 px for cards, `--sheet-radius` for sheets. The current UI has no hard corners and no decorative borders; keep it that way unless the brand changes.
- **Demos.** Case demos are tappable and animated while visible, and always have a call to action that prefills the contact form.
- **Voice in the interface.** Spanish uses **tú**, first person, short and direct (ADR-007). No startup jargon. Every visible string is added in both `es` and `en`.

## 5. Motion

- Animate `transform`, `opacity`, `clip-path` and `filter`; avoid animating layout properties.
- Use the shared easings and keyframes (`sgBuild`, `sgUp`, `sgIn`, `sgMarq`, `sgPulse`) before writing a new one.
- Every animation must respect `prefers-reduced-motion`: CSS animations are disabled in `global.css`, and scripts check `reduced` from `scripts/motion.ts`.
- Scripts only toggle state or set custom properties; the look stays in CSS.

## 6. Accessibility and responsiveness

- Interactive elements are real `button` or `a` elements, keep `:focus-visible`, and expose state with ARIA (`aria-pressed`, `aria-selected`, `aria-expanded`).
- Decorative duplicates and effects use `aria-hidden="true"`.
- Mobile first: use `clamp()` and `min()` for sizes, and check 375 px and 768 px for overflow.
- Custom cursor and hover effects only apply with `(hover: hover) and (pointer: fine)`.

## 7. Verification

Before closing a styling change, run `bun run check` and `bun run build`, confirm that no `<style>` remains (`grep -rn "<style" src`), and that no class is defined in two files. State whether the result was seen in a browser or only compiled (`04-quality-and-verification`).
