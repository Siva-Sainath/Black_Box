# Black Box — Design System

Machine-readable rules for humans and AI agents editing this UI.

## Principles

1. **One focal region per screen** — Prober = full-bleed brain; chrome is progressive disclosure (drawers).
2. **Glass on chrome only** — nav, drawers, transport dock. Never glass on tables, timeline pills, or chart data.
3. **No HUD inside WebGL** — labels and controls live in HTML overlays outside the canvas.
4. **No particle star fields** without explicit approval (max ~200 subtle cortex points if needed).
5. **Motion** — use defined easing; avoid browser default `ease`.

## Colors (dark app)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-base` | `#000000` | Page background |
| `--surface-solid` | `rgba(17, 25, 40, 0.92)` | Tables, step pills, dense data |
| `--glass-fill` | `rgba(255, 255, 255, 0.08)` | Drawer/dock background |
| `--glass-border` | `rgba(255, 255, 255, 0.12)` | Frosted panels |
| `--text-primary` | `#f4f4f5` | Headings, body |
| `--text-muted` | `#a1a1aa` | Secondary |
| `--accent-cyan` | `#38bdf8` | ElevenLabs-adjacent accent |
| `--accent-purple` | `#a855f7` | Freshworks accent |
| `--accent-amber` | `#fbbf24` | Dodo accent |
| `--signal-red` | `#ef4444` | Flagged |
| `--signal-green` | `#10b981` | Verified / pass |

## Typography

- **UI / body:** Inter, 15px (`text-sm`), line-height 1.5
- **Nav labels:** 16px (`text-base`), font-medium
- **Display:** Inter 600–700, tracking `-0.03em`, `text-display` utility
- **Mono:** JetBrains Mono — IDs, metrics, JSON (min 12px)

## Spacing (8px grid)

Use `4`, `6`, `8` Tailwind spacing only: `p-4`, `p-6`, `gap-4`, `gap-6`.

## Glass

```css
backdrop-filter: blur(16px);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.12);
```

Place gradient orbs **behind** glass panels (Prober ambient layer).

## Motion tokens

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--duration-fast` | `150ms` |
| `--duration-panel` | `280ms` |

Drawer slide: `--duration-panel` + `--ease-out`.

## Component states

Every interactive element: default, hover, focus-visible, active, disabled. Flagged states use red border/glow sparingly.

## Screen-specific

### Prober

- Brain canvas: full area, no border, no on-canvas controls.
- Drawers: default closed; agent drawer opens on Run.
- Transport dock: bottom center, glass-card, max-width ~48rem.

### Evals / Insights

- Glass: hero, sponsor platform cards, outer chrome.
- Solid: table rows, chart interiors, incident list body.
