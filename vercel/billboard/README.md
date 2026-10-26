# Billboard — Vercel static export

Static port of `layouts/billboard/page.canvas.tsx` for a Vercel deploy. The canvas pack stays the Pages source. This tree is what `.me` fills when an owner picks the Vercel route. Do not invent layout JSX on top of it.

`STAGE` `color` (and any named accent) paints the pack’s photographic liquid-silk plates — dark studio still, day paper key, cyan ribbon, peach drop — and runs the same slow `flowA` / `flowB` / `flowC` drift (20s / 17s / 23s, alternate, ease-in-out). `prefers-reduced-motion` holds the resting pose. Graphite plus silver is the only field that uses blooms. Day and dark follow the device. Tiles are the milky glass, the desktop column is **445px** from **480px**, and socials are icon chips.

## Fill contract for `.me`

1. Fetch this directory from `main` (`vercel/billboard/`).
2. Confirm `const LAYOUT = "billboard"` in `billboard.js`.
3. Edit **only** `billboard.js`. Replace these string initializers (they appear once each):

| Constant | Token | After fill |
|----------|--------|------------|
| `AVATAR` | `__AVATAR_DATA_URI__` | `data:image/...` URI |
| `DISPLAY_NAME` | `__DISPLAY_NAME__` | Owner display name |
| `HANDLE` | `__HANDLE__` | Handle, with or without `@` |
| `BIO` | `__BIO__` | Short bio. Newlines are kept |
| `FOOTER` | `__FOOTER__` | Footer line |
| `APPEARANCE` | `__APPEARANCE__` | Ignored. The page follows `prefers-color-scheme` (light → day, dark → charcoal). Filling the token does not lock the page. `night` is not a mode |
| `STAGE` | `__STAGE__` | `graphite` or `color` (`colour` aliases `color`). Leave the token for graphite |
| `ACCENT` | `__ACCENT__` | `silver` (default), `rose`, `sage`, `violet`, `amber`, or `teal`. Leave the token for silver |

4. Replace the whole `bots` array. One object per bot, same keys, 0–N entries.
5. Replace the whole `links` array the same way.

Values are JavaScript double-quoted string literals. Escape `\`, `"`, and newlines (`\n` in `BIO`). Do not leave the example placeholders in a filled page. Do not add a second bots source.

Bot object:

```js
{
  name: "__BOT0_NAME__",
  desc: "__BOT0_DESC__",
  src: "__BOT0_ICON__",
  href: "__BOT0_HREF__",
}
```

`src` is a `data:image/...` icon. `href` is a real `https://x.ai/bot/...` URL. The whole tile is that link.

Link object:

```js
{
  label: "__LINK0_LABEL__",
  href: "__LINK0_HREF__",
  display: "__LINK0_DISPLAY__",
}
```

Chips are `<a href>` elements. The icon comes from the label and the href host (X, GitHub, YouTube, LinkedIn, and the same set as the canvas pack). The words stay on the accessible name.

`STAGE` / `ACCENT` behavior matches the root README: `color` is the photographic liquid-silk field; a named accent hue-shifts that silk and leaves tiles and chips neutral; `silver` does not force a hue. Silk files are `assets/silk-dark.jpg`, `assets/silk-day.jpg`, `assets/silk-ribbon.jpg`, and `assets/silk-peach.jpg`. Leave those paths alone.

Do not edit `layouts/billboard/page.canvas.tsx` for this route. Do not swap the glass, type, or silk.

## Deploy

From this directory (`vercel/billboard`), or with the Vercel project **Root Directory** set to `vercel/billboard`:

| Setting | Value |
|---------|--------|
| Framework preset | Other |
| Root directory | `vercel/billboard` |
| Build command | `node scripts/build.mjs` |
| Output directory | `out` |
| Install command | empty (no dependencies) |

`vercel.json` already sets the framework, build command, and output directory. `node scripts/build.mjs` checks `billboard.js` and copies the static site into `out/`. `npx vercel` from this directory uses that config.

The build still succeeds after the tokens are filled. It does not require the placeholders to remain.
