import { access, cp, mkdir, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  "const bots",
  "const links",
  'const LAYOUT = "billboard"',
]) {
  if (!source.includes(token)) {
    console.error(`billboard.js is missing fill marker: ${token}`);
    process.exit(1);
  }
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

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of ["index.html", "billboard.css", "billboard.js"]) {
  await cp(path.join(root, file), path.join(out, file));
}
await cp(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });
console.log("billboard static export → out/");
