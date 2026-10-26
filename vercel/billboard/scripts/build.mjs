import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeTitle, htmlTitle } from "./page-title.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");

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
  "const GA_MEASUREMENT_ID",
  "const META_PIXEL_ID",
  "const bots",
  "const links",
  'const LAYOUT = "billboard"',
]) {
  if (!source.includes(token)) {
    console.error(`billboard.js is missing fill marker: ${token}`);
    process.exit(1);
  }
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

const css = await readFile(path.join(root, "billboard.css"), "utf8");
if (!css.includes("max-width: 445px") || !css.includes("min-width: 480px")) {
  console.error("billboard.css is missing the 445px desktop column");
  process.exit(1);
}

const silks = ["silk-dark.jpg", "silk-day.jpg", "silk-ribbon.jpg", "silk-peach.jpg"];
for (const name of silks) {
  const file = path.join(root, "assets", name);
  const bytes = await readFile(file);
  if (bytes.length < 1000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    console.error(`assets/${name} is not a JPEG`);
    process.exit(1);
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

let html = await readFile(path.join(root, "index.html"), "utf8");
if (/<title>[^<]*Billboard/i.test(html)) {
  console.error("index.html title must not contain Billboard");
  process.exit(1);
}
if (!html.includes("<title></title>")) {
  console.error("index.html is missing an empty <title> for PAGE_TITLE");
  process.exit(1);
}
for (const needle of ["window.va", "window.si", "/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"]) {
  if (!html.includes(needle)) {
    console.error(`index.html is missing analytics script: ${needle}`);
    process.exit(1);
  }
}
html = html.replace("<title></title>", "<title>" + escapeTitle(htmlTitle(source)) + "</title>");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(path.join(out, "index.html"), html);
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
