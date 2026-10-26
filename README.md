# .me layout packs

Pinned Grok Bot canvas templates for the `.me` link-tree bot.

When a new owner picks a pack in setup, the bot **fetches that file from this repo** and fills owner fields. It does **not** invent layout chrome for these packs.

Custom / "describe your own" is **not** in this repo. The bot invents a layout only for that case.

Stills are human reference for the intended look. The bot does not fetch them at fill time. Device chrome or a theme control in a capture is the host, not the pack. Do not add either to the file.

## Layout → path

| Pack | Path | Still |
|------|------|-------|
| Stack | `layouts/stack/page.canvas.tsx` | `stills/stack.jpg` |
| Billboard | `layouts/billboard/page.canvas.tsx` | `stills/billboard.jpg` |
| Magazine | `layouts/magazine/page.canvas.tsx` | `stills/magazine.jpg` |
| Terminal | `layouts/terminal/page.canvas.tsx` | `stills/terminal.jpg` |
| Bento | `layouts/bento/page.canvas.tsx` | `stills/bento.jpg` |
| Orbit | `layouts/orbit/page.canvas.tsx` | `stills/orbit.jpg` |
| Broadsheet | `layouts/broadsheet/page.canvas.tsx` | `stills/broadsheet.jpg` |
| Shelf | `layouts/shelf/page.canvas.tsx` | `stills/shelf.jpg` |
| Polaroid | `layouts/polaroid/page.canvas.tsx` | `stills/polaroid.jpg` |

Each file default-exports `App` and exports `const LAYOUT` matching the folder name (`"stack"`, `"billboard"`, `"magazine"`, `"terminal"`, `"bento"`, `"orbit"`, `"broadsheet"`, `"shelf"`, or `"polaroid"`).

## Fill procedure

1. Fetch `layouts/<pack>/page.canvas.tsx` and keep its JSX.
2. Confirm `LAYOUT` matches the pack the owner picked.
3. Replace these string initializers (they appear once each):

| Constant | Token | After fill |
|----------|--------|------------|
| `AVATAR` | `__AVATAR_DATA_URI__` | `data:image/...` URI |
| `DISPLAY_NAME` | `__DISPLAY_NAME__` | Owner display name |
| `HANDLE` | `__HANDLE__` | Handle, with or without `@` |
| `BIO` | `__BIO__` | Short bio. Newlines are kept (Terminal renders one `#` line per line) |
| `FOOTER` | `__FOOTER__` | Footer line |
| `APPEARANCE` | `__APPEARANCE__` | Billboard only. Ignored. The page follows the opener's device (`light` → day, `dark` → charcoal). `night` is not a mode. Filling the token does not lock the page |
| `STAGE` | `__STAGE__` | Billboard only. `graphite` or `color` (`colour` aliases `color`). Leave the token for graphite. `color` is the photographic liquid-silk field |
| `ACCENT` | `__ACCENT__` | Billboard only. `silver` (default), `rose`, `sage`, `violet`, `amber`, or `teal`. A named accent hue-shifts the silk stage and follows the device. Tiles and chips stay neutral. Leave the token for silver |

4. Replace the whole `bots` array. One object per bot, same keys, 0–N entries. The file ships a single example object so the shape is obvious.
5. Replace the whole `links` array the same way.

Do not leave the example placeholders in a filled page. Do not add a second source of bots (no `__BOTS_JSON__` string). The arrays are the structured form.

Billboard only — `APPEARANCE` is ignored (the page follows the device). `STAGE` and `ACCENT` still fill (other packs ignore all three):

- Appearance follows the opener. Host `light` is day: light paper, dense graphite type, smoked glass. Host `dark` is the charcoal field and the dark glass stack. A filled `night`, `dark`, `day`, or `light` does not lock the page. `night` is not a deeper mode.
- `graphite` — neutral blooms and a slow sheen when accent is silver. This is the default `STAGE`. No hairline grid.
- `color` — photoreal liquid-silk plates (teal folds, a cyan ribbon, a peach drop). Day and dark follow the device. `colour` is an alias. Not soft blooms, not lacquer, not a hairline grid, not accent blue.
- `silver` — device base only. On `graphite` the stage stays neutral. On `color` the silk keeps its own palette. Neutral glass, silver or graphite focus. Default `ACCENT`.
- `rose`, `sage`, `violet`, `amber`, `teal` — the same name hue-shifts the silk field (and turns the stage to silk even if `STAGE` is still graphite). Dark uses the studio plates. Day uses the light-key plate. Tiles, chips, and hover washes stay the neutral glass. The focus ring may use a quiet accent stroke. Not a chip fill, not lacquer, not accent blue. Teal is a restrained cyan.

The stage always loops a slow drift. A viewer who asks for reduced motion gets the resting pose. Do not add an on-page switch for these.

### Bot object

```ts
{
  name: "__BOT0_NAME__",
  desc: "__BOT0_DESC__",
  src: "__BOT0_ICON__",
  href: "__BOT0_HREF__",
}
```

| Field | Placeholder the example uses | After fill |
|-------|------------------------------|------------|
| `name` | `__BOTn_NAME__` | Bot title |
| `desc` | `__BOTn_DESC__` | One short line |
| `src` | `__BOTn_ICON__` | `data:image/...` icon |
| `href` | `__BOTn_HREF__` | Real `https://x.ai/bot/...` install URL |

`n` is the zero-based index (`__BOT0_*__`, `__BOT1_*__`, …). Adding or removing objects is the way to change the count. Do not clone JSX per bot.

How packs use the array:

- **Stack** and **Billboard** and **Terminal** render every bot the same way, in order.
- **Magazine** renders `bots[0]` as the featured hero (88px icon) and `bots.slice(1)` as compact rows (48px icon). One bot means a hero and no compact rows. Zero bots omits the block.
- **Bento** — bots[0] featured large; rest as compact mosaic chips.
- **Orbit** — avatar center; bots as ring satellites; links outer quiet chips.
- **Broadsheet** — masthead name; bots[0] above fold; rest compact.
- **Shelf** — vertical spine strips for bots; bookmark link rows.
- **Polaroid** — stacked/tilted cards for bots; caption Install; links below.

### Link object

```ts
{
  label: "__LINK0_LABEL__",
  href: "__LINK0_HREF__",
  display: "__LINK0_DISPLAY__",
}
```

| Field | Placeholder | After fill |
|-------|-------------|------------|
| `label` | `__LINKn_LABEL__` | Short name, e.g. `X` |
| `href` | `__LINKn_HREF__` | Real URL |
| `display` | `__LINKn_DISPLAY__` | Secondary text, e.g. a handle or domain. May match `label` |

**Stack** and **Magazine** map the array (0–N). Zero links omits the links block. Billboard and Terminal also map the array; they just render it as a short row list instead of a titled section with rules.

### Handle

Templates normalize at render: a missing `@` is added, an existing `@` is kept. Pass either `owner` or `@owner`.

## What each pack is

- **Stack** — centered header (avatar, name, handle, bio), equal bot cards (64px icon, Install pill), Quiet Links, footer. A subtle `BrandWash` canvas sits behind the column. That paint function is the only place hex is allowed.
- **Billboard** — small avatar, oversized display name, handle, bio, full-width loud Install tiles, a short link row, footer. No pack wordmark and no kicker. The display name is the same see-through face as the tile copy, in the case it was filled, with no pane behind it. Tiles and link chips are liquid-glass panes (frost, specular rim, blur) over an animated field, no hairline grid. `STAGE` `graphite` with silver keeps neutral blooms and a drifting sheen. `STAGE` `color`, or any named accent, swaps in photoreal liquid-silk plates. Appearance follows the opener's device (light is day, dark is the charcoal field); a filled `APPEARANCE` is ignored, and `night` is not a mode. `ACCENT` `silver` does not force a hue. `rose`, `sage`, `violet`, `amber`, and `teal` hue-shift the silk and leave tiles and chips neutral. Unset stage stays graphite; unset accent stays silver.
- **Magazine** — left editorial header, first bot as the featured Install hero, later bots as compact rows, Links, footer.
- **Terminal** — monospace page (`theme.font.mono` + `theme.font.code`), `#` comment bio, dense `[install]` rows, minimal chrome.
- **Bento** — asymmetric mosaic: avatar/name in one cell, bio in another, bots[0] as a large featured Install tile, later bots as compact chips, links as thin bars in a mosaic cell, footer.
- **Orbit** — avatar at the center of a ring, bots as Install satellites around the ring, name/handle/bio below, quiet link chips outer, footer.
- **Broadsheet** — newspaper masthead with name as the title, bio between rules, bots[0] as the above-the-fold Install hero, later bots compact, Classifieds link list, footer.
- **Shelf** — header with avatar/name/bio, tall vertical book-spine Install strips for each bot, bookmark-style link rows under a shelf ledge, footer.
- **Polaroid** — centered avatar/name/bio, stacked tilted polaroid cards for bots (featured top = bots[0]) with Install on the caption strip, Quiet Links below, footer.

## Hard rules

- Import only from `grok/canvas`.
- No on-page theme switcher (`Segmented` or otherwise).
- No Duo frame and no phone chrome (no status bar, no home indicator, no device bezel).
- No `fetch`, no network, no remote image URLs. Avatars and icons are `data:image/...` after fill. Until fill, the placeholders are not fetched.
- Mobile-first: width 100%, max width 440–520 centered, `env(safe-area-inset-*)` padding, touch targets at least 44px, no horizontal overflow at 320px. Text wrappers use `minWidth: 0` and `overflowWrap`.
- Colors come from `useGrokTheme()`. Stack's `BrandWash` canvas may use hex. Billboard's liquid-glass panes keep module-level material constants (rgba). Its default graphite blooms use theme ink. `STAGE` `color` and a named `ACCENT` use baked silk plates on the stage only, hue-shifted per accent — never `theme.accent`, never lacquer, never a chip wash, never a stage grid. Appearance follows `theme.kind` (light is day, dark is the charcoal field); a baked `APPEARANCE` does not override it. `ACCENT` (`silver`, `rose`, `sage`, `violet`, `amber`, `teal`; unset `silver`) leaves tiles and chips on the neutral glass. A named accent hue-shifts the silk and may tint the focus ring. Do not add a theme toggle, device chrome, or a second copy of the fill tokens.
- Install hrefs must be real `https://x.ai/bot/...` URLs after fill.
- Leave `export default function App` and `export const LAYOUT` in place.
