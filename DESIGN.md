---
name: MoneyBee Payment OS
description: Cream paper, ink panels and honey gold; Inter Tight set tight and light; hexagons as the only ornament
colors:
  bg: "#F4EFE4"
  bg-2: "#EDE5D4"
  paper: "#FBF8F1"
  card: "#FFFDF8"
  ink: "#15130F"
  ink-2: "#2B2620"
  text: "#15130F"
  soft: "#6B6356"
  line: "#DCD2BF"
  gold: "#B8860B"
  gold-deep: "#8C6510"
  honey: "#D9B878"
  honey-hi: "#F0D49A"
  on-ink: "#F4EFE4"
  red: "#B5432F"
  green: "#2F7D53"
  dark-bg: "#0F0E0B"
  dark-card: "#1B1913"
  dark-panel: "#1A1810"
  dark-text: "#F2EDE2"
  dark-soft: "#9C9384"
  dark-line: "#2C2820"
typography:
  hero:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(46px, 8.6vw, 112px)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  h2:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.2vw, 54px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  lede:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "clamp(19px, 2vw, 23px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  body:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  section-lead:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  small:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  arabic-body:
    fontFamily: "Plex Arabic, Inter Tight, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  device: "38px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  section: "clamp(80px, 11vw, 150px)"
  gutter: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "12px"
    padding: "12px 22px"
  button-primary-lg:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "14px"
    padding: "16px 26px"
  button-ghost:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "12px"
    padding: "12px 22px"
  button-gold:
    backgroundColor: "{colors.honey}"
    textColor: "{colors.ink}"
    rounded: "14px"
    padding: "16px 26px"
  panel-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.lg}"
    padding: "36px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "22px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# MoneyBee design system

## Overview
A cream sheet of paper with a few deep ink panels on it, and honey gold used only where money moves. The site is editorial: one voice per heading, short leads, hairlines instead of boxes, and the product itself (phone screens, the console, code) doing the showing. Motion is the signature: a payment finding its route in the hero, a live marquee of rails, the honeycomb of modules, the game, the globe, the code typing itself. Everything else holds still.

Two themes share the same tokens: light (cream) is the default; dark swaps bg/card/text and lifts gold to honey. Arabic (/ar/) mirrors the layout right-to-left with Plex Arabic for prose and Inter Tight for the wordmark, amounts and code.

## Colors
- Surfaces: `bg` for the page, `card` for anything that sits on it, `bg-2` for table heads and quiet bands. Dark panels (`ink`, or `dark-panel` in dark theme) hold the hero stage, the game arena and the final call to action; never more than three per page.
- Gold: `honey` is the working gold (fills, bars, chips, pulses). `gold` is for strokes and icons on cream. `gold-deep` is for gold text on cream (4.6:1). `honey-hi` is a highlight for gradients inside dark panels only.
- Text: `text` on cream, `soft` for secondary copy (5.2:1 on bg). On dark panels use `dark-text` and `dark-soft`, never gray.
- Status: `green` approved and matched, `red` declined and failed, amber `#9A6A08` on `#C98A12` tint for review.
- Partner discs are flat: SoleAI `#E7B964`, ekka `#272338`, Substrate `#27413A`, Orki `#21708F`, Fracxn `#8F4232`, each with a 1px edge one step lighter.

## Typography
Inter Tight only, weights 300, 400, 500, 600, self-hosted woff2. Headings at 400, tight tracking, `text-wrap: balance`, a single colour: no second line in gray, no eyebrow or kicker above. The hero keeps its two-tone pair (ink then tinted ink) as the one exception. Section heads are a two-column grid: heading left (8/12), lead paragraph right (4/12) in `soft`, above a 1px `line`. Body measure 40 to 72ch. Numbers and amounts use `font-variant-numeric: tabular-nums`. Code is monospace only for code and API responses.

## Layout
Content width `min(1180px, 100% - 40px)`; 32px gutters under 560px. Sections are separated by `spacing.section` of air and begin with a hairline. Split sections are 1fr / 1.15fr with the copy first (reversed in the globe section). Grids collapse to one column at 980px; the honeycomb reflows to five-then-four at 560px. Fixed header is a full-width bar with blur, not a pill; it gains a bottom hairline after 40px of scroll.

## Elevation & Depth
Cream surfaces are flat with a 1px `line` border. Only objects that are physically "above" the page carry shadow: phones, the console browser, the code block, the ledger, the dark panels, with the site shadow `0 1px 2px rgba(40,30,10,.06), 0 18px 40px -18px rgba(60,45,15,.28)`. No glows, no zero-offset halos, no gradient text.

## Shapes
Radii scale: 6 (chips, status), 10 (inputs, small nodes), 12 to 14 (buttons), 16 (cards, browser, code, ledger), 24 (dark panels, bento tiles 18), 28 (final call to action). Devices use 38px with a 9px black bezel. The hexagon is the only ornament: the mark, the honeycomb cells, the marquee separators, the tick bullets, the honeycomb textures inside dark panels.

## Components
- Buttons: ink primary, ghost with `line` border, gold for the strongest call to action on dark. Arrow icons are drawn SVG, 18px, stroke 2, and slide 4px on hover.
- Section head (`.sh`): hairline, heading, lead; lead omitted only when the section is a centered play moment (the game).
- Lists: hairline rows (`.ways`, `.geo`, `.shield-grid`, `.facts`) rather than cards. Pills are reserved for live states inside animations (sources, routing rule) and for status.
- Dark panels: hero stage, arena, talk card; honeycomb texture at 7 to 8% stroke opacity; cursor glow at 9% honey.
- Partner discs: flat colour, mark + name + one line, domain link with an SVG arrow; on phones mark + name only.
- Forms: `bg` fields, `line` border, 10px radius, gold focus ring `0 0 0 4px` honey at 30%.
- Browser surfaces: selection honey on ink, gold focus outline, honey scrollbar thumb, gold caret.

## Do's and Don'ts
- Do let the real product carry the section; do write one heading in one colour; do use hairlines before boxes; do keep every figure honest and every acquirer unnamed until confirmed.
- Don't add eyebrows, kickers or section numbers; don't put a gray second line in a heading; don't reintroduce pill rows, same-size icon cards, gradient orbs, conic sheens or glow rings; don't use em dashes; don't use emoji or unicode arrows for icons; don't add a new animation unless it replaces one.
