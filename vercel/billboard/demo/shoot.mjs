/**
 * Render the local fixture and write screenshots.
 * Usage: node demo/shoot.mjs [artifactDir]
 * Does not modify billboard.js.
 */
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { startDemoServer } from "./serve.mjs";

const artifactDir = process.argv[2] || "/opt/cursor/artifacts";
const CHROME = process.env.CHROME || "/usr/bin/google-chrome";

const CASES = [];
for (const bots of [3, 12, 35]) {
  for (const socials of [1, 3, 7]) {
    CASES.push({ bots, socials, open: false, q: "", name: `billboard_bots${bots}_socials${socials}` });
  }
}
for (const bots of [12, 35]) {
  CASES.push({ bots, socials: 3, open: true, q: "", name: `billboard_bots${bots}_socials3_open` });
}
CASES.push({ bots: 35, socials: 3, open: false, q: "Harbor", name: "billboard_bots35_socials3_filter" });

const WIDTHS = [
  { id: "mobile", width: 390, height: 844, mobile: true },
  { id: "desktop", width: 1280, height: 900, mobile: false },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function launchChrome() {
  await rm("/tmp/billboard-chrome-shot", { recursive: true, force: true });
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--remote-debugging-port=0",
      "--remote-allow-origins=*",
      "--user-data-dir=/tmp/billboard-chrome-shot",
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let buf = "";
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("chrome did not expose a debugging port")), 20000);
    const onData = (chunk) => {
      buf += chunk.toString();
      const match = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    };
    chrome.stderr.on("data", onData);
    chrome.stdout.on("data", onData);
    chrome.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error("chrome exited " + code + "\n" + buf));
    });
  });
  return { chrome, url };
}

const MEASURE = `(() => {
  const band = document.querySelector(".band");
  const nav = document.querySelector("nav.links");
  const col = band.getBoundingClientRect();
  const chips = nav ? [...nav.querySelectorAll("a.glass-chip")] : [];
  const rows = [];
  for (const chip of chips) {
    const r = chip.getBoundingClientRect();
    let row = rows.find((item) => Math.abs(item.top - r.top) < 4);
    if (!row) {
      row = { top: r.top, chips: [] };
      rows.push(row);
    }
    row.chips.push(r);
  }
  const rowDelta = rows.map((row) => {
    const left = Math.min(...row.chips.map((r) => r.left));
    const right = Math.max(...row.chips.map((r) => r.right));
    return +(((left + right) / 2) - ((col.left + col.right) / 2)).toFixed(2);
  });
  const glyphs = chips.map((chip) => {
    const path = chip.querySelector("svg path");
    const pr = path.getBoundingClientRect();
    const cr = chip.getBoundingClientRect();
    return {
      label: chip.getAttribute("aria-label"),
      dx: +(((pr.left + pr.right) / 2) - ((cr.left + cr.right) / 2)).toFixed(2),
      dy: +(((pr.top + pr.bottom) / 2) - ((cr.top + cr.bottom) / 2)).toFixed(2),
    };
  });
  const tiles = [...document.querySelectorAll("a.glass-tile")];
  const loud = tiles.filter((node) => !node.querySelector(".tile-body-compact")).length;
  const compact = document.querySelectorAll(".tile-body-compact").length;
  const toggle = document.querySelector(".bots-toggle");
  const filter = document.querySelector(".bots-filter");
  return {
    rowDelta,
    glyphs,
    loud,
    compact,
    toggle: toggle && !toggle.hidden ? (toggle.getAttribute("aria-label") || "") : "",
    filter: !!filter,
    chipCount: chips.length,
    appearance: document.documentElement.dataset.appearance,
    field: document.documentElement.dataset.field,
  };
})()`;

function pageUrl(base, item) {
  const q = new URLSearchParams({ bots: String(item.bots), socials: String(item.socials) });
  if (item.open) q.set("open", "1");
  if (item.q) q.set("q", item.q);
  return `${base}/?${q}`;
}

function expect(item, measure) {
  const errors = [];
  if (measure.appearance !== "dark") errors.push("appearance " + measure.appearance);
  if (measure.field !== "silk") errors.push("field " + measure.field);
  if (measure.chipCount !== item.socials) errors.push("chips " + measure.chipCount);
  for (const delta of measure.rowDelta) {
    if (Math.abs(delta) > 1.5) errors.push("row off by " + delta);
  }
  for (const glyph of measure.glyphs) {
    if (Math.abs(glyph.dx) > 0.8 || Math.abs(glyph.dy) > 0.8) {
      errors.push(`${glyph.label} glyph dx ${glyph.dx} dy ${glyph.dy}`);
    }
  }
  const querying = item.q.length > 0;
  if (item.bots <= 3) {
    if (measure.loud !== item.bots) errors.push("loud " + measure.loud);
    if (measure.compact !== 0) errors.push("compact leaked");
    if (measure.toggle) errors.push("toggle on a short list");
    if (measure.filter) errors.push("filter on a short list");
  } else if (querying) {
    if (measure.loud !== 0) errors.push("loud still showing while filtering");
    if (measure.toggle) errors.push("toggle still showing while filtering");
    if (measure.compact < 1) errors.push("filter matched nothing");
    if (!measure.filter) errors.push("filter missing");
  } else if (!item.open) {
    if (measure.loud !== 3) errors.push("loud " + measure.loud);
    if (measure.compact !== 0) errors.push("compact visible while collapsed");
    if (measure.toggle !== "Show all " + item.bots) errors.push("toggle " + measure.toggle);
    if (measure.filter !== (item.bots >= 16)) errors.push("filter " + measure.filter);
  } else {
    if (measure.loud !== 3) errors.push("loud " + measure.loud);
    if (measure.compact !== item.bots - 3) errors.push("compact " + measure.compact);
    if (measure.toggle !== "Show less") errors.push("toggle " + measure.toggle);
    if (measure.filter !== (item.bots >= 16)) errors.push("filter " + measure.filter);
  }
  return errors;
}

async function shot(cdp, file, clip) {
  const params = clip ? { format: "png", clip } : { format: "png" };
  const result = await cdp.send("Page.captureScreenshot", params);
  await writeFile(file, Buffer.from(result.data, "base64"));
}

async function main() {
  await mkdir(artifactDir, { recursive: true });
  const demo = await startDemoServer();
  const { chrome, url: wsUrl } = await launchChrome();
  const failures = [];
  const written = [];
  try {
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve);
      ws.addEventListener("error", reject);
    });
    const cdp = new Cdp(ws);
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${new URL(wsUrl).port}/json/list`)).json().then((list) =>
      list.find((item) => item.id === targetId),
    );
    ws.close();
    const pageWs = new WebSocket(webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      pageWs.addEventListener("open", resolve);
      pageWs.addEventListener("error", reject);
    });
    const page = new Cdp(pageWs);
    await page.send("Page.enable");
    await page.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: "dark" }],
    });

    for (const width of WIDTHS) {
      for (const item of CASES) {
        await page.send("Emulation.setDeviceMetricsOverride", {
          width: width.width,
          height: width.height,
          deviceScaleFactor: 1,
          mobile: width.mobile,
        });
        const target = pageUrl(demo.url, item);
        await page.send("Page.navigate", { url: target });
        await page.send("Runtime.evaluate", {
          expression: `new Promise((resolve) => {
            if (document.readyState === "complete") resolve();
            else addEventListener("load", () => resolve(), { once: true });
          })`,
          awaitPromise: true,
        });
        await page.send("Runtime.evaluate", {
          expression: `Promise.all([
            document.fonts.ready,
            ...[...document.images].map((img) => img.complete ? Promise.resolve() : img.decode().catch(() => {}))
          ]).then(() => new Promise((r) => setTimeout(r, 180)))`,
          awaitPromise: true,
        });
        const height = await page.send("Runtime.evaluate", {
          expression: "Math.ceil(document.documentElement.scrollHeight)",
          returnByValue: true,
        });
        const full = Math.max(width.height, Math.min(Number(height.result.value) || width.height, 7000));
        await page.send("Emulation.setDeviceMetricsOverride", {
          width: width.width,
          height: full,
          deviceScaleFactor: 1,
          mobile: width.mobile,
        });
        await sleep(120);
        const measured = await page.send("Runtime.evaluate", { expression: MEASURE, returnByValue: true });
        const data = measured.result.value;
        const errors = expect(item, data);
        const label = `${item.name}_${width.id}`;
        if (errors.length) {
          failures.push(label + ": " + errors.join("; ") + " :: " + JSON.stringify(data));
          console.error("FAIL", label, errors.join("; "));
          console.error(JSON.stringify(data));
        } else {
          console.log("ok", label, "rows", data.rowDelta.join(","), "glyphs", data.glyphs.map((g) => g.dx + "," + g.dy).join(" "));
        }
        const file = path.join(artifactDir, `${item.name}_${width.id}.png`);
        await shot(page, file);
        written.push(file);
        if (item.bots === 3 && !item.q) {
          const box = await page.send("Runtime.evaluate", {
            expression: `(() => {
              const nav = document.querySelector("nav.links");
              const r = nav.getBoundingClientRect();
              return { x: Math.max(0, r.x - 12), y: Math.max(0, r.y - 16), width: r.width + 24, height: r.height + 32 };
            })()`,
            returnByValue: true,
          });
          const clip = box.result.value;
          const crop = path.join(artifactDir, `${item.name}_${width.id}_chips.png`);
          await shot(page, crop, { ...clip, scale: 3 });
          written.push(crop);
        }
      }
    }
    pageWs.close();
  } finally {
    chrome.kill("SIGKILL");
    await demo.close();
  }
  if (failures.length) {
    console.error(failures.length + " case(s) failed");
    process.exit(1);
  }
  console.log("wrote", written.length);
  for (const file of written) console.log(file);
}

await main();
