/**
 * Local render fixture. Not a pack default and not read by index.html.
 * billboard.js on disk stays placeholder tokens. The demo server rewrites a
 * copy in memory from the query string.
 */

const NAMES = [
  "Northstar",
  "Ledger",
  "Ribbon",
  "Harbor",
  "Kiln",
  "Marrow",
  "Sable",
  "Quill",
  "Vesper",
  "Orchard",
  "Bramble",
  "Cinder",
  "Fathom",
  "Grove",
  "Hinge",
  "Iris",
  "Juniper",
  "Keel",
  "Lumen",
  "Maple",
  "Nimbus",
  "Ochre",
  "Plover",
  "Quartz",
  "Reed",
  "Summit",
  "Thistle",
  "Umber",
  "Vale",
  "Wicket",
  "Yarrow",
  "Zenith",
  "Alder",
  "Bower",
  "Cobalt",
];

const LEAD_DESC = [
  "A trade journal that keeps the week's levels in one place.",
  "Inbox setup kit for a desk that actually ships.",
  "Launch films, stills, and the short version of the story.",
];

const SOCIALS = [
  { label: "X", href: "https://x.com/sample", display: "@sample" },
  { label: "GitHub", href: "https://github.com/sample", display: "sample" },
  { label: "Site", href: "https://example.com", display: "example.com" },
  { label: "Instagram", href: "https://instagram.com/sample", display: "@sample" },
  { label: "YouTube", href: "https://youtube.com/@sample", display: "@sample" },
  { label: "Threads", href: "https://threads.net/@sample", display: "@sample" },
  { label: "TikTok", href: "https://tiktok.com/@sample", display: "@sample" },
];

function svgUri(svg) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function iconUri(label, hue) {
  const letter = label.slice(0, 1);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="16" fill="hsl(${hue} 42% 46%)"/>` +
    `<text x="32" y="40" text-anchor="middle" font-family="sans-serif" font-size="26" fill="white">${letter}</text>` +
    `</svg>`;
  return svgUri(svg);
}

function avatarUri() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<circle cx="64" cy="64" r="64" fill="hsl(200 30% 42%)"/>` +
    `<circle cx="64" cy="52" r="18" fill="white"/>` +
    `<ellipse cx="64" cy="102" rx="28" ry="18" fill="white"/>` +
    `</svg>`;
  return svgUri(svg);
}

export function botsFor(count) {
  const n = Math.max(0, count);
  const bots = [];
  for (let i = 0; i < n; i++) {
    const name = NAMES[i] || `Template ${i + 1}`;
    const desc =
      i < LEAD_DESC.length
        ? LEAD_DESC[i]
        : `One-line note for ${name} that runs long enough to truncate inside the compact row on a phone.`;
    bots.push({
      name,
      desc,
      src: iconUri(name, (i * 47) % 360),
      href: `https://x.ai/bot/fixture-${i + 1}`,
    });
  }
  return bots;
}

export function linksFor(count) {
  const n = Math.max(0, Math.min(count, SOCIALS.length));
  return SOCIALS.slice(0, n);
}

function replaceConst(source, name, value) {
  const marker = `const ${name} = "`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`missing const ${name}`);
  const from = start + marker.length;
  let i = from;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === '"') break;
    i++;
  }
  if (source[i] !== '"') throw new Error(`unterminated ${name}`);
  const escaped = String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return source.slice(0, from) + escaped + source.slice(i);
}

function replaceArray(source, name, value) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  const end = source.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error(`missing array ${name}`);
  return source.slice(0, start) + `const ${name} = ` + JSON.stringify(value, null, 2) + ";" + source.slice(end + 3);
}

/**
 * @param {string} source billboard.js
 * @param {{ bots?: number, socials?: number, open?: boolean, q?: string }} opts
 */
export function applyFixture(source, opts) {
  const botCount = Number(opts.bots ?? 3);
  const socialCount = Number(opts.socials ?? 3);
  let js = source;
  js = replaceConst(js, "AVATAR", avatarUri());
  js = replaceConst(js, "DISPLAY_NAME", "Sample");
  js = replaceConst(js, "HANDLE", "sample");
  js = replaceConst(js, "BIO", "Local fixture for chip centering and a long bot catalog.");
  js = replaceConst(js, "FOOTER", "Fixture");
  js = replaceConst(js, "STAGE", "color");
  js = replaceArray(js, "bots", botsFor(botCount));
  js = replaceArray(js, "links", linksFor(socialCount));
  if (opts.open) {
    if (!js.includes("let botsOpen = false;")) throw new Error("missing botsOpen");
    js = js.replace("let botsOpen = false;", "let botsOpen = true;");
  }
  if (opts.q) {
    if (!js.includes('let botsQuery = "";')) throw new Error("missing botsQuery");
    js = js.replace('let botsQuery = "";', "let botsQuery = " + JSON.stringify(String(opts.q)) + ";");
  }
  return js;
}
