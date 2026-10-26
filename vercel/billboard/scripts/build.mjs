import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeTitle, htmlTitle } from "./page-title.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const AVATAR_FILE = /^\/assets\/(avatar\.(?:png|webp|jpe?g))$/;
const IMAGE_TYPE = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function unescapeJsString(raw) {
  let outText = "";
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] !== "\\") {
      outText += raw[i];
      continue;
    }
    const next = raw[++i];
    if (next === "n") outText += "\n";
    else if (next === "r") outText += "\r";
    else if (next === "t") outText += "\t";
    else if (next === "\\") outText += "\\";
    else if (next === '"') outText += '"';
    else if (next === "'") outText += "'";
    else if (next === "u") {
      const hex = raw.slice(i + 1, i + 5);
      if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail("billboard.js has a bad unicode escape");
      outText += String.fromCharCode(parseInt(hex, 16));
      i += 4;
    } else if (next === undefined) fail("billboard.js has a trailing escape");
    else outText += next;
  }
  return outText;
}

function readJsStringConst(source, name) {
  const marker = `const ${name} = "`;
  const start = source.indexOf(marker);
  if (start < 0) fail(`billboard.js is missing fill marker: ${marker}`);
  if (source.indexOf(marker, start + marker.length) !== -1) {
    fail(`billboard.js fill marker appears more than once: ${name}`);
  }
  let i = start + marker.length;
  let raw = "";
  while (i < source.length) {
    if (source[i] === "\\") {
      raw += source[i] + (source[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (source[i] === '"') break;
    raw += source[i];
    i++;
  }
  if (source[i] !== '"') fail(`billboard.js has an unterminated ${name} string`);
  return unescapeJsString(raw);
}

function isFillToken(value) {
  return /^__.+__$/.test(value.trim());
}

function oneLine(value) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeAttr(value) {
  return oneLine(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function imageKind(bytes, ext) {
  if (ext === "png") {
    return bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (ext === "jpg" || ext === "jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (ext === "webp") {
    return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

function unfurlTitle(pageTitle, displayName) {
  if (!isFillToken(pageTitle) && pageTitle.trim()) return oneLine(pageTitle);
  if (!isFillToken(displayName) && displayName.trim()) return oneLine(displayName);
  return pageTitle.trim() || "__" + "PAGE_TITLE__";
}

function unfurlBlock(tabTitle, ogTitle, description, image, imageType) {
  const lines = [tabTitle ? `    <title>${escapeTitle(tabTitle)}</title>` : "    <title></title>"];
  if (description) lines.push(`    <meta name="description" content="${escapeAttr(description)}" />`);
  lines.push(
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:title" content="${escapeAttr(ogTitle)}" />`,
  );
  if (description) lines.push(`    <meta property="og:description" content="${escapeAttr(description)}" />`);
  lines.push(`    <meta property="og:image" content="${escapeAttr(image)}" />`);
  if (imageType) lines.push(`    <meta property="og:image:type" content="${imageType}" />`);
  lines.push(
    `    <meta property="og:image:alt" content="${escapeAttr(ogTitle)}" />`,
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:title" content="${escapeAttr(ogTitle)}" />`,
  );
  if (description) lines.push(`    <meta name="twitter:description" content="${escapeAttr(description)}" />`);
  lines.push(
    `    <meta name="twitter:image" content="${escapeAttr(image)}" />`,
    `    <meta name="twitter:image:alt" content="${escapeAttr(ogTitle)}" />`,
  );
  return lines.join("\n");
}

function stampUnfurl(html, block) {
  const start = "<!-- unfurl -->";
  const end = "<!-- /unfurl -->";
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end);
  if (startIdx < 0 || endIdx < startIdx) fail("index.html is missing the unfurl markers");
  if (html.indexOf(start, startIdx + start.length) !== -1) fail("index.html has more than one unfurl block");
  return `${html.slice(0, startIdx + start.length)}\n${block}\n    ${html.slice(endIdx)}`;
}

function assertStamped(html, image) {
  const card = html.match(/<meta name="twitter:card" content="([^"]*)" \/>/);
  if (!card || card[1] !== "summary") fail("twitter:card must be summary");
  const images = [...html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]*)" \/>/g)];
  if (images.length < 2) fail("unfurl block is missing og:image or twitter:image");
  const expected = escapeAttr(image);
  for (const match of images) {
    if (match[1] !== expected) fail("og:image and twitter:image must both be this user's avatar URL");
    if (/silk-/i.test(match[1])) fail("unfurl image resolved to a silk plate");
  }
}

async function resolveOgImage(raw) {
  const image = raw.trim();
  if (!image) {
    fail("OG_IMAGE_URL is empty. Set it to the absolute https URL of this user's avatar file.");
  }
  if (isFillToken(image)) {
    console.log("unfurl og:image → placeholder (fill per deploy; no shared icon)");
    return { image, imageType: "" };
  }
  if (image.startsWith("data:")) {
    fail("OG_IMAGE_URL must be an absolute https:// URL. data: URIs are not valid og:image values.");
  }
  let parsed;
  try {
    parsed = new URL(image);
  } catch {
    fail("OG_IMAGE_URL must be an absolute https:// URL of this user's avatar (site origin + /assets/avatar.png, .webp, or .jpg).");
  }
  if (parsed.protocol !== "https:" || !parsed.hostname) {
    fail("OG_IMAGE_URL must be an absolute https:// URL. Relative paths and http:// URLs are not used as og:image.");
  }
  let pathname = parsed.pathname;
  try {
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    fail("OG_IMAGE_URL has a bad percent-encoding.");
  }
  if (/silk-/i.test(pathname)) {
    fail("OG_IMAGE_URL must be this user's avatar, not a silk plate.");
  }
  const asset = pathname.match(AVATAR_FILE);
  if (pathname.startsWith("/assets/") && !asset) {
    fail("On this site, OG_IMAGE_URL must point at /assets/avatar.png, /assets/avatar.webp, or /assets/avatar.jpg for this user.");
  }
  if (asset) {
    const filename = asset[1];
    const ext = filename.split(".").pop();
    const file = path.join(root, "assets", filename);
    let bytes;
    try {
      bytes = await readFile(file);
    } catch {
      fail(
        `OG_IMAGE_URL points at /assets/${filename} but that file is missing. Decode this user's AVATAR and write it there. Do not substitute a shared icon.`,
      );
    }
    if (bytes.length < 32 || bytes.length > 5 * 1024 * 1024 || !imageKind(bytes, ext)) {
      fail(`assets/${filename} must be this user's PNG, WebP, or JPEG avatar, under 5MB.`);
    }
    console.log(`unfurl og:image → ${image}`);
    return { image, imageType: IMAGE_TYPE[ext] };
  }
  console.log(`unfurl og:image → ${image} (not a local avatar file; the URL must still serve this user's avatar)`);
  const ext = path.posix.extname(parsed.pathname).slice(1).toLowerCase();
  return { image, imageType: IMAGE_TYPE[ext] || "" };
}

const syntax = spawnSync(process.execPath, ["--check", path.join(root, "billboard.js")], {
  stdio: "inherit",
});
if (syntax.status !== 0) process.exit(syntax.status ?? 1);

const source = await readFile(path.join(root, "billboard.js"), "utf8");
for (const token of [
  "const AVATAR",
  "const DISPLAY_NAME",
  "const HANDLE",
  "const BIO",
  "const FOOTER",
  "const APPEARANCE",
  "const STAGE",
  "const ACCENT",
  "const PAGE_TITLE",
  "const OG_IMAGE_URL",
  "const GA_MEASUREMENT_ID",
  "const META_PIXEL_ID",
  "const bots",
  "const links",
  'const LAYOUT = "billboard"',
]) {
  if (!source.includes(token)) fail(`billboard.js is missing fill marker: ${token}`);
}
for (const needle of ["outbound_click", "/api/hit", "sendBeacon", "function pageTitle", "function trackOutbound"]) {
  if (!source.includes(needle)) {
    console.error(`billboard.js is missing analytics marker: ${needle}`);
    process.exit(1);
  }
}
if (source.includes("preventDefault")) {
  console.error("billboard.js must not cancel tile or chip clicks");
  process.exit(1);
}

const pageTitle = readJsStringConst(source, "PAGE_TITLE");
const displayName = readJsStringConst(source, "DISPLAY_NAME");
const bio = readJsStringConst(source, "BIO");
const ogImage = await resolveOgImage(readJsStringConst(source, "OG_IMAGE_URL"));
const ogTitle = unfurlTitle(pageTitle, displayName);
const tabTitle = oneLine(htmlTitle(source));
const description = oneLine(bio);

const css = await readFile(path.join(root, "billboard.css"), "utf8");
if (!css.includes("max-width: 445px") || !css.includes("min-width: 480px")) {
  fail("billboard.css is missing the 445px desktop column");
}

const silks = ["silk-dark.jpg", "silk-day.jpg", "silk-ribbon.jpg", "silk-peach.jpg"];
for (const name of silks) {
  const file = path.join(root, "assets", name);
  const bytes = await readFile(file);
  if (bytes.length < 1000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    fail(`assets/${name} is not a JPEG`);
  }
}
for (const name of ["inter-regular.woff2", "inter-medium.woff2", "inter-semibold.woff2", "OFL.txt"]) {
  await access(path.join(root, "assets", name));
}

const hitApi = path.join(root, "api", "hit.js");
await access(hitApi);
const hitSource = await readFile(hitApi, "utf8");
if (!hitSource.includes("billboard/clicks.json") || !hitSource.includes("BLOB_READ_WRITE_TOKEN")) {
  console.error("api/hit.js is missing the Blob count store");
  process.exit(1);
}

const index = await readFile(path.join(root, "index.html"), "utf8");
if (/<title>[^<]*Billboard/i.test(index)) {
  console.error("index.html title must not contain Billboard");
  process.exit(1);
}
if (!index.includes("<title></title>")) {
  console.error("index.html is missing an empty <title> for PAGE_TITLE");
  process.exit(1);
}
for (const needle of ["window.va", "window.si", "/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"]) {
  if (!index.includes(needle)) {
    console.error(`index.html is missing analytics script: ${needle}`);
    process.exit(1);
  }
}
const stamped = stampUnfurl(index, unfurlBlock(tabTitle, ogTitle, description, ogImage.image, ogImage.imageType));
assertStamped(stamped, ogImage.image);
if (tabTitle) {
  if (!stamped.includes(`<title>${escapeTitle(tabTitle)}</title>`)) fail("filled build did not write PAGE_TITLE into <title>");
  if (stamped.includes("<title></title>")) fail("filled build left an empty title");
} else if (!stamped.includes("<title></title>")) {
  fail("unfilled build must keep an empty title");
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(path.join(out, "index.html"), stamped);
for (const file of ["billboard.css", "billboard.js"]) {
  await cp(path.join(root, file), path.join(out, file));
}
await cp(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });

const check = spawnSync(process.execPath, [path.join(root, "scripts", "check-hit.mjs")], {
  cwd: root,
  stdio: "inherit",
});
if (check.status !== 0) process.exit(check.status ?? 1);

console.log("billboard static export → out/");
