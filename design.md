# BidRank — Design System (Wise-inspired)

BidRank wears the Wise brand language: a single vivid lime-green CTA accent (`#9fe870`) set against a pale sage-tinted canvas (`#e8ebe6`), near-black warm ink (`#0e0f0c`), generously rounded 24 px cards and buttons, and an unusually heavy display sans (weight 900) for every hero headline. The result reads like a calm Scandinavian magazine, not a bank.

This document is the canonical spec. Implementation mapping to this codebase lives at the bottom.

---

## Colors

### Brand & Accent

| Token | Hex | Use |
|---|---|---|
| `colors.primary` | `#9fe870` | Wise Green — universal CTA color. Every primary button, logo accent, active indicator. |
| `colors.primary-active` | `#cdffad` | Lighter green for active/pressed state. |
| `colors.primary-neutral` | `#c5edab` | Mid-saturation green, neutral active fill. |
| `colors.primary-pale` | `#e2f6d5` | Lightest green — soft surface tints, badge backgrounds. |

### Surface

| Token | Hex | Use |
|---|---|---|
| `colors.canvas` | `#ffffff` | Pure white — card interiors. |
| `colors.canvas-soft` | `#e8ebe6` | Sage-tinted page background. The defining mood of the brand; the hero surface. |

### Text

| Token | Hex | Use |
|---|---|---|
| `colors.ink` | `#0e0f0c` | Near-black with olive warmth — default text and headings. |
| `colors.ink-deep` | `#163300` | Deep forest-green ink for positive-state surfaces and text on green. |
| `colors.body` | `#454745` | Secondary body text. |
| `colors.mute` | `#868685` | Lowest-priority text — captions, placeholder, fine print. |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `colors.positive` | `#2ead4b` | Success indicator. |
| `colors.positive-deep` | `#054d28` | Pressed positive / text on positive-pale surfaces. |
| `colors.warning` | `#ffd11a` | Caution indicator. |
| `colors.warning-deep` | `#b86700` | Pressed warning. |
| `colors.warning-content` | `#4a3b1c` | Text on warning surfaces. |
| `colors.negative` | `#d03238` | Destructive / error red. |
| `colors.negative-deep` | `#a72027` | Pressed destructive. |
| `colors.negative-darkest` | `#a7000d` | Highest-emphasis destructive text. |
| `colors.negative-bg` | `#320707` | Dark maroon for destructive callout backgrounds. |

### Tertiary accents (illustrative content only)

| Token | Hex | Use |
|---|---|---|
| `colors.accent-orange` | `#ffc091` | Bright peach inside illustrative content. |
| `colors.accent-cyan` | `#38c8ff` | Sky-blue tertiary illustration accent. |

**Never** repurpose Wise green as a success indicator — it is the brand CTA color; the semantic `positive` family handles status.

## Typography

Two faces ladder the system:

1. **Display face** — the brand's proprietary geometric sans at weight **900** carries all hero displays (Wise Sans; substituted here with **Manrope** 800/900). Always 900 on marketing surfaces, never lighter.
2. **Inter** — sub-displays at weight 600, all body, and form labels. Loaded with `font-feature-settings: "calt"`.

| Token | Size | Weight | Line height | Letter spacing | Use |
|---|---|---|---|---|---|
| `typography.display-mega` | 126px | 900 | 107.1px | 0 | Hero stencil at maximum scale. |
| `typography.display-xxl` | 96px | 900 | 81.6px | 0 | Sub-hero scale. |
| `typography.display-xl` | 64px | 900 | 54.4px | 0 | Standard hero headline. |
| `typography.display-lg` | 47px | 400 | 70.5px | -0.108px | Lighter sub-display. |
| `typography.display-md` | 40px | 900 | 34px | 0 | Section / card headlines. |
| `typography.display-sm` | 32px | 600 | 38.4px | -0.96px | Inter-rendered section headings. |
| `typography.display-xs` | 24px | 600 | 31.2px | -0.48px | Sub-section displays. |
| `typography.body-lg` | 20px | 400 | 30px | 0 | Lead paragraphs. |
| `typography.body-md` | 16px | 400 | 24px | 0 | Default body. |
| `typography.body-md-strong` | 16px | 600 | 24px | 0 | Bold inline body. |
| `typography.body-sm` | 14px | 400 | 20px | 0 | Secondary body. |
| `typography.body-sm-strong` | 14px | 600 | 20px | 0 | Bold caption / nav link. |
| `typography.caption` | 12px | 400 | 16px | 0 | Fine print. |
| `typography.button-md` | 16px | 600 | 24px | 0 | Button label. |

Principles: **weight 900 for hero, 600 for everything else**; **display face for the brand voice, Inter for utility**.

Wise Sans is proprietary — substitutes: display = *Inter* 900 or *Manrope* 800/900 (this repo uses Manrope); body = *Inter* (the brand's actual second face).

## Layout

- **Spacing**: base unit 4 px. Tokens: `xxs` 2 · `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `2xl` 32 · `3xl` 48. Section bands pad `3xl` 48 top/bottom on desktop; card interiors pad `xl` 24.
- **Container**: marketing content centres at ~1200 px (Tailwind `max-w-6xl` ≈ 1152 px is the accepted approximation).
- **Hero**: split layout (headline left, bid widget right) at desktop; stacked on mobile.
- **Grids**: 2-up / 3-up at desktop, 1-up mobile, 2-up tablet.

### Breakpoints

| Name | Width | Key changes |
|---|---|---|
| Mobile | < 768px | Hero stacks; grids 1-up. |
| Tablet | 768–1023px | Grids 2-up. |
| Desktop | ≥ 1024px | Hero split; full grids. |

Touch targets: buttons ~48 px tall. Photography is sparse — prefer illustrative SVGs and product mockups inside cards.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border. | Default. |
| 1 — Hairline on Dark | 1 px solid `colors.ink` border. | Tertiary outline buttons, form inputs. |
| 2 — Soft Card | Borderless white card on sage canvas — surface contrast IS the elevation. | Cards on the sage hero band. |

The brand uses surface contrast (`canvas-soft` background vs `canvas` cards) as the primary elevation cue. Shadows are reserved for genuinely floating layers (dialogs, toasts).

## Shapes

| Token | Value | Use |
|---|---|---|
| `rounded.none` | 0px | Full-bleed bands. |
| `rounded.sm` | 8px | Inline pills, small badges. |
| `rounded.md` | 12px | Form inputs, smaller chrome. |
| `rounded.lg` | 16px | Mid-size cards. |
| `rounded.xl` | **24px** | The brand's canonical button + card radius. |
| `rounded.pill` / `rounded.full` | 9999px | Status pills, circular icon containers. |

The brand never uses sharp corners on UI elements.

## Components

### Buttons
- **`button-primary`** — background `primary`, text `ink-deep` (on-primary), label `button-md`, padding `md`/`xl`, shape `rounded.xl` 24 px. Hover `primary-active`.
- **`button-secondary`** — background `canvas-soft`, text `ink`; same type/padding/shape.
- **`button-tertiary`** — background `canvas`, text `ink`, 1 px solid `ink` border; same type/padding/shape.
- **`button-inverse`** — background `canvas`, text `ink`, for CTAs placed on `ink`/dark surfaces.
- **`button-destructive`** — background `negative`, text white.
- **`button-icon-circular`** — background `canvas`, ink icon, shape `full`.
- Ghost/link variants exist for low-emphasis utility actions (still pill-shaped).

### Cards & containers
- **`card-content`** — `canvas` bg, `ink` text, padding `xl`, radius `xl`, no border, sits on sage canvas.
- **`card-feature-sage`** — `canvas-soft` bg variant.
- **`card-feature-green`** — `primary-pale` bg variant.
- **`card-feature-dark`** — `ink` bg, `primary` text — the polarity-flipped promotional card.
- **`bid-converter-card`** (signature widget) — `canvas` bg, 1 px `ink` border, radius `xl`; hosts the amount input and action row (BidRank's analogue of Wise's currency converter).

### Inputs & forms
- **`text-input`** — `canvas` bg, `ink` text, 1 px solid `ink` border, `body-md`, padding `md`/`lg`, radius `md`. Focus ring in `primary`.

### Navigation
- **`nav-bar`** — sticky, `canvas` bg, `ink` text, padding `md`/`xl`.
- **`nav-link`** — `ink`, `body-sm-strong`.
- **`footer`** — `ink` bg, `canvas-soft` text, padding `3xl`/`xl`, body `body-sm`.

### Signature components
- **`hero-band`** — `canvas-soft` bg, `ink` text, padding `3xl`/`xl`; headline in `display-mega`/`display-xl` at weight 900.
- **`hero-band-dark`** — `ink` bg, **`primary` text** — the polarity-flipped dark hero.
- **`content-band`** — `canvas` bg band following the hero; section headline `display-md`.
- **`badge-positive`** — `primary-pale` bg, `positive-deep` text, `body-sm-strong`, pill.
- **`badge-negative`** — `negative-bg` bg, white text, `body-sm-strong`, pill.

### Example surfaces (`ex-*`)
Kit-mirror demonstration surfaces — pricing tiers (default uses `card-feature-sage` chrome; featured flips polarity to `card-feature-dark`), product selector, cart/subscription drawer with item dividers, app-shell rows (active indicator = `primary`), data table (mono-caps eyebrow header, `body-sm` cells), auth form card, modal card, empty-state card, and toast — all re-skin the same ten surfaces with the primitives above.

## Do's
- Reserve `primary` Wise green for every primary CTA — the lime-green pill IS the conversion signature.
- Hero headlines at `display-mega`/`display-xl`, weight 900. Never lighter.
- `rounded.xl` 24 px for buttons and cards.
- Cycle surfaces: `canvas-soft` sage band → `canvas` white cards. Surface contrast carries elevation.
- Use the semantic palette for status; never repurpose Wise green as success.

## Don'ts
- No second brand accent. Wise green is the sole identity colour.
- No hero weight below 900.
- No sharp-rectangle CTAs — the 24 px pill geometry is non-negotiable.
- Never pair the green CTA with a green background — always sage / white / ink surfaces.
- Don't replace the display face with a generic geometric sans.

---

## Implementation map (this codebase)

- **Tokens**: `src/app/globals.css` — light + dark `:root` custom properties and the Tailwind v4 `@theme inline` block. Raw brand tokens use the names above (`--wise-*`); app tokens (`--background`, `--primary`, …) alias them so `dark:` polarity flips cleanly.
- **Fonts**: `src/app/layout.tsx` loads **Manrope** (variable → `--font-display`) and **Inter** (→ `--font-sans`). Display utilities: `font-display font-black`.
- **Primitives**: `src/components/ui/*` — `button.tsx` (primary/secondary/tertiary/inverse/destructive/ghost/link + icon sizes), `card.tsx` (`card-content` default; `sage|green|dark` prop variants), `input.tsx`, `select.tsx`, `textarea.tsx`, `badge.tsx` (`positive|negative|dark` variants), `tabs.tsx` (pill tabs), `dialog.tsx`, `label.tsx`.
- **Chrome**: `src/components/navbar.tsx` (nav-bar/nav-link), `src/components/footer.tsx` (dark footer band), `src/components/logo.tsx` (ink tile + Wise-green bars).
- **Pages**: `src/app/page.tsx` (sage `hero-band` + dark `hero-band-dark` + white `content-band`), plus all route pages under `src/app/**`.
