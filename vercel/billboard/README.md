# Billboard — Vercel static export

Static port of `layouts/billboard/page.canvas.tsx` for a Vercel deploy. The canvas pack stays the Pages source. `.links` fills this tree when an owner picks the Vercel route. Do not invent layout JSX on top of it.

`STAGE` `color` (and any named accent) paints the pack’s photographic liquid-silk plates — dark studio still, day paper key, cyan ribbon, peach drop — and runs the same slow `flowA` / `flowB` / `flowC` drift (20s / 17s / 23s, alternate, ease-in-out). `prefers-reduced-motion` holds the resting pose. Graphite plus silver is the only field that uses blooms. Day and dark follow the device. Tiles are the milky glass, the desktop column is **445px** from **480px**, and socials are icon chips.

## Fill contract for `.links`

`.links` fetches this directory from `main` when an owner picks the Vercel route. The tokens below stay placeholders on `main`. Each deploy is that owner only. Do not bake a username, a bio, or an avatar into the template.

1. Fetch this directory from `main` (`vercel/billboard/`).
2. Confirm `const LAYOUT = "billboard"` in `billboard.js`.
3. Replace these string initializers in `billboard.js` (they appear once each). Write this user's avatar file in step 6. Leave the renderer, the CSS, and the silk plates alone.

| Constant | Token | After fill |
|----------|--------|------------|
| `AVATAR` | `__AVATAR_DATA_URI__` | `data:image/...` URI of **this user's** picture |
| `DISPLAY_NAME` | `__DISPLAY_NAME__` | Owner display name |
| `HANDLE` | `__HANDLE__` | Handle, with or without `@` |
| `BIO` | `__BIO__` | Short bio. Newlines are kept. Also the unfurl description |
| `FOOTER` | `__FOOTER__` | Footer line |
| `APPEARANCE` | `__APPEARANCE__` | Ignored. The page follows `prefers-color-scheme` (light → day, dark → charcoal). Filling the token does not lock the page. `night` is not a mode |
| `STAGE` | `__STAGE__` | `graphite` or `color` (`colour` aliases `color`). Leave the token for graphite |
| `ACCENT` | `__ACCENT__` | `silver` (default), `rose`, `sage`, `violet`, `amber`, or `teal`. Leave the token for silver |
| `PAGE_TITLE` | `__PAGE_TITLE__` | **This user's username** (or the display name). Browser tab and unfurl title (`og:title`, `twitter:title`). Leave the placeholder and the shipped `<title>` stays blank (the script then uses a filled display name, then a filled handle). Never the word Billboard |
| `OG_IMAGE_URL` | `__OG_IMAGE_URL__` | Absolute `https://` URL of **this user's** avatar file from step 6 |
| `GA_MEASUREMENT_ID` | `__GA_MEASUREMENT_ID__` | Optional later. Leave the placeholder. `.me` does not ask for this at setup. A real `G-…` id loads GA4. Empty or still `__…__` injects nothing |
| `META_PIXEL_ID` | `__META_PIXEL_ID__` | Optional later. Leave the placeholder. `.me` does not ask for this at setup. A numeric Pixel id loads a minimal PageView pixel. Empty or still `__…__` injects nothing |
| `LINKS_SHARE_HREF` | `__LINKS_SHARE_HREF__` | Href of the corner mark. Leave the placeholder until .links publishes the template-to-share URL. Do not invent one. The chip is always rendered. Empty, `#`, or the placeholder does not navigate. `assets/links-mark.png` is product chrome (transparent sphere, static white pill eyes), not this user's avatar and not the unfurl image |

4. Replace the whole `bots` array. One object per bot, same keys, 0–N entries.
5. Replace the whole `links` array the same way.
6. Write **this user's** unfurl image, then point `OG_IMAGE_URL` at it. See [Unfurl](#unfurl).

Values are JavaScript double-quoted string literals. Escape `\`, `"`, and newlines (`\n` in `BIO` and `PAGE_TITLE`). Do not leave the example placeholders in a filled page. Two exceptions stay placeholders unless the owner opts in later: `GA_MEASUREMENT_ID` and `META_PIXEL_ID`. Do not ask for those at setup. Do not add a second bots source.

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

`STAGE` / `ACCENT` behavior matches the root README: `color` is the photographic liquid-silk field; a named accent hue-shifts that silk and leaves tiles and chips neutral; `silver` does not force a hue. Silk files are `assets/silk-dark.jpg`, `assets/silk-day.jpg`, `assets/silk-ribbon.jpg`, and `assets/silk-peach.jpg`. Leave those paths alone. Silk is the page stage. It is not the share image.

## Unfurl

iMessage, X, and Slack read the Open Graph and Twitter tags in `index.html`. They do not use the on-page data URI. `twitter:card` is `summary` (small icon beside the title). The build writes that card type into `out/index.html`. Leave it as `summary`.

The share image is **this deploy's own avatar**, the same person as `AVATAR` (`__AVATAR_DATA_URI__`). One owner, one file, one URL. A shared icon, a `.links` mark, a product logo, or another owner's face is the wrong image.

At fill time, for this user:

1. Decode the data URI just written to `AVATAR`. Use the MIME type to pick the file:
   - `image/png` → `assets/avatar.png`
   - `image/webp` → `assets/avatar.webp`
   - `image/jpeg` → `assets/avatar.jpg` (`.jpeg` is accepted too)
2. Write those bytes. Square, face centered, at least 144×144 (400×400 is a good size), under 5MB. A centered square still reads as an icon when a client shows the image large.
3. Set `OG_IMAGE_URL` to the absolute URL of that file on **this** deployment: `https://<origin>/assets/avatar.png` (match the filename). `<origin>` is this owner's site, not a shared host. A query string is fine when the picture changes (`https://<origin>/assets/avatar.png?v=2`) so clients refetch. The build checks the path, not the query.

`PAGE_TITLE` is this user's username. `og:title` and `twitter:title` use it. While that constant is still the placeholder, the shipped `<title>` stays empty, and the card title uses a filled display name when there is one. After `PAGE_TITLE` is filled, the shipped `<title>` and the card title are that username. Set `PAGE_TITLE` to the username whenever the unfurl title should be the username.

`BIO` is `og:description` and `twitter:description` when it is non-empty. The card text is that bio on one line. An empty bio omits those description tags. The page still keeps newlines in the bio.

The build stamps the `<!-- unfurl -->` block in `out/index.html` from `PAGE_TITLE`, `BIO`, and `OG_IMAGE_URL` in `billboard.js`. Those constants are the source of truth. Editing `index.html` and leaving the constants as placeholders does not survive the build.

On-page the avatar stays the data URI. The `assets/avatar.*` file exists so a crawler can fetch an `https://` image. `data:` URIs, `http://` URLs, and relative paths are rejected once `OG_IMAGE_URL` is filled, because crawlers drop them and then pick a silk plate. A filled URL whose path is `/assets/avatar.png`, `/assets/avatar.webp`, `/assets/avatar.jpg`, or `/assets/avatar.jpeg` must have that file in the deploy, or the build fails. Any other `/assets/` path fails the build. An `https://` URL on another host is allowed only when it is still **this user's** avatar.

Do not add `assets/avatar.*` to `main`. The template has no default unfurl image.

Do not edit `layouts/billboard/page.canvas.tsx` for this route. Do not swap the glass, type, or silk.

Name the Vercel project after the username only. Never `*-billboard-*`. `billboard.js`, `api/hit.js`, and the `vercel/billboard/` folder are internal paths, not the public URL and not the browser tab.

## Analytics

No analytics UI on the silk page. The owner reads numbers in the Vercel dashboard, or with `GET /api/hit`. Hobby is enough. Do not add a paid plan, Speed Insights Plus, or a marketplace database for a new owner.

| What | Where the owner looks | Plan |
|------|------------------------|------|
| Page views | Vercel Web Analytics | Hobby. Enable Web Analytics on the project |
| Per-link clicks | `GET /api/hit` | Hobby. This is the default click path |
| Vercel custom events | Web Analytics → Events | Pro or Enterprise only. The page still sends them; Hobby can ignore them |
| GA4 events | GA, only if the token was filled later | Not asked at setup |
| Speed | Speed Insights, free tier | Hobby, optional. Do not enable Plus |

Page views use the vanilla scripts in `index.html` (`window.va` plus `/_vercel/insights/script.js`). Enable **Web Analytics** on the project or those requests do nothing. Route support is not available on the plain HTML snippet. Custom events (`va('event', …)`) are a Pro/Enterprise feature, so click counts do not depend on them.

Speed Insights uses the matching free script (`window.si` plus `/_vercel/speed-insights/script.js`). The free tier is on Hobby at no charge (Real Experience Score, included events, collection pauses at the cap instead of billing). **Speed Insights Plus is paid** (`vercel project speed-insights enable` upgrades to Plus). Do not turn Plus on.

A bot tile or social chip click does not cancel navigation. The listener sends three things:

1. `POST /api/hit` with `{ kind: "bot"|"link", label, href, ts }` via `sendBeacon` (fetch only if the beacon cannot queue). This always runs. `label` is the chip's accessible name, or the bot name.
2. `va('event', { name: 'outbound_click', data: { kind, label, href } })` when `window.va` exists, so a Pro project can see the event. Skipped when `va` is missing.
3. `gtag('event', 'outbound_click', …)` only when `GA_MEASUREMENT_ID` was filled with a real `G-…` id.

`/api/hit` is `api/hit.js` in this directory. With the project **Root Directory** set to `vercel/billboard`, the route is `/api/hit`. It is a normal Hobby function (no npm install). The static build does not copy it into `out/`; Vercel deploys it beside the static output.

Counts are one private Blob object, `billboard/clicks.json`. Blob is included on Hobby within the free allowance (storage, simple operations, advanced operations). Over that allowance Blob pauses until the window resets. Hobby is not billed for the extra use. Each counted click is one read and one write, so the advanced-operation allowance is the practical cap (a couple of thousand clicks in the window). The page itself keeps working either way.

Connect a **private** Blob store to the project at deploy. Vercel injects `BLOB_READ_WRITE_TOKEN` and/or `BLOB_STORE_ID`. There is no fill token for that, and no question for the owner. A public store also works (`BLOB_ACCESS=public` only if you created one). Until a store is connected, `POST /api/hit` still returns 204 and writes one JSON line to the function logs. Those logs are short-lived on Hobby. Durable totals show up only after the store is connected.

`GET /api/hit` returns `{ total, updatedAt, clicks: [{ kind, label, href, count, lastTs }] }`. It is not linked from the page. The numbers are aggregates of the public links. No visitor id, IP, or user agent is stored.

`layouts/billboard/page.canvas.tsx` is unchanged. Vercel Web Analytics, Speed Insights, and `/api/hit` do not run on the Pages canvas. The GA and Meta tokens live only in this static file. They could be shared later. Do not add them to the canvas file.

## Deploy

From this directory (`vercel/billboard`), or with the Vercel project **Root Directory** set to `vercel/billboard`:

| Setting | Value |
|---------|--------|
| Framework preset | Other |
| Root directory | `vercel/billboard` |
| Build command | `node scripts/build.mjs` |
| Output directory | `out` |
| Install command | empty (no dependencies) |

`vercel.json` already sets the framework, build command, and output directory. `node scripts/build.mjs` checks `billboard.js`, writes the tab title from `PAGE_TITLE`, stamps the unfurl tags into `out/index.html`, and copies the static site into `out/`. `npx vercel` from this directory uses that config. `api/hit.js` stays outside `out/` and deploys as `/api/hit`.

On the new project: enable Web Analytics, and connect a private Blob store (Hobby, included, no charge inside the allowance). Leave Speed Insights Plus off. The free Speed Insights script is already in the page. Do not ask for a GA or Meta id.

Root Directory deploy runs this build after fill and does not need a prebuilt `out/`. While `const PAGE_TITLE = "__PAGE_TITLE__"` is still in `billboard.js`, the build checks the pack placeholders: an empty `<title>`, and one each of `__PAGE_TITLE__`, `__DISPLAY_NAME__`, and `__AVATAR_DATA_URI__` (plus the GA and Meta tokens). After `PAGE_TITLE` is filled, those template checks are skipped. The shipped tab title must be non-empty and must not be the word Billboard. `/api/hit` checks still run either way, and the command exits 0 for a filled page.
