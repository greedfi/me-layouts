/**
 * Local demo only. Rewrites a temp copy of the pack — never the source
 * tokens — and screenshots bot counts 3, 4, 5, 12, 35 with 1, 7, and 30
 * socials at 390px and 1440px. Not part of the Vercel build.
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(root, "../..");
const artifacts = process.env.BILLBOARD_ARTIFACTS || "/opt/cursor/artifacts";
const work = "/tmp/billboard-demo";
const port = 4173;
const chromePort = 9333;

const BOT_COUNTS = [3, 4, 5, 12, 35];
const SOCIAL_COUNTS = [1, 7, 30];
const WIDTHS = [390, 1440];

function svgIcon(label, hue) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<rect width="128" height="128" rx="28" fill="hsl(${hue} 42% 46%)"/>` +
    `<text x="64" y="74" text-anchor="middle" font-size="42" font-family="sans-serif" fill="white">${label}</text>` +
    `</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function jsString(value) {
  return JSON.stringify(value);
}

function makeBots(count) {
  const bots = [];
  for (let i = 0; i < count; i++) {
    const n = String(i + 1).padStart(2, "0");
    const long = i === count - 1 ? " A longer note that must stay inside the column and not spill sideways." : "";
    bots.push({
      name: i % 9 === 0 ? `.bot ${n}` : `Bot ${n}`,
      desc: `Short line for bot ${n}.${long}`,
      src: svgIcon(n, (i * 37) % 360),
      href: `https://x.ai/bot/demo-${n}`,
    });
  }
  return bots;
}

const SOCIAL_KINDS = [
  ["X", "https://x.com/ada", "@ada"],
  ["GitHub", "https://github.com/ada", "ada"],
  ["Site", "https://ada.example", "ada.example"],
  ["YouTube", "https://youtube.com/@ada", "@ada"],
  ["LinkedIn", "https://www.linkedin.com/in/ada", "ada"],
  ["Instagram", "https://instagram.com/ada", "@ada"],
  ["TikTok", "https://www.tiktok.com/@ada", "@ada"],
  ["Discord", "https://discord.gg/ada", "ada"],
  ["Telegram", "https://t.me/ada", "ada"],
  ["Email", "mailto:ada@example.com", "ada@example.com"],
  ["Facebook", "https://facebook.com/ada", "ada"],
  ["Twitch", "https://twitch.tv/ada", "ada"],
  ["Spotify", "https://open.spotify.com/user/ada", "ada"],
  ["Threads", "https://www.threads.net/@ada", "@ada"],
  ["Bluesky", "https://bsky.app/profile/ada", "@ada"],
  ["Reddit", "https://reddit.com/user/ada", "ada"],
  ["WhatsApp", "https://wa.me/15550001111", "ada"],
];

function makeLinks(count) {
  const links = [];
  for (let i = 0; i < count; i++) {
    const kind = SOCIAL_KINDS[i % SOCIAL_KINDS.length];
    links.push({ label: kind[0], href: kind[1], display: kind[2] });
  }
  return links;
}

function replaceStringConst(source, name, value) {
  const marker = `const ${name} = "`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("missing " + name);
  let i = start + marker.length;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === '"') break;
    i++;
  }
  if (source[i] !== '"') throw new Error("unterminated " + name);
  return source.slice(0, start) + `const ${name} = ${jsString(value)}` + source.slice(i + 1);
}

function replaceArray(source, name, value) {
  const marker = `const ${name} = [`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("missing array " + name);
  const end = source.indexOf("];", start);
  if (end < 0) throw new Error("unterminated array " + name);
  const body = JSON.stringify(value, null, 2)
    .replace(/"([A-Za-z0-9_]+)":/g, "$1:")
    .replace(/"/g, '"');
  return source.slice(0, start) + `const ${name} = ${body}` + source.slice(end + 2);
}

function fillSource(source, bots, links) {
  let next = source;
  next = replaceStringConst(next, "DISPLAY_NAME", "Ada Lane");
  next = replaceStringConst(next, "HANDLE", "ada");
  next = replaceStringConst(next, "BIO", "A short journal line.");
  next = replaceStringConst(next, "FOOTER", "Ada");
  next = replaceStringConst(next, "STAGE", "color");
  next = replaceStringConst(next, "AVATAR", svgIcon("A", 200));
  next = replaceArray(next, "bots", bots);
  next = replaceArray(next, "links", links);
  if (!next.includes('const LINKS_SHARE_HREF = "https://x.ai/bot/iAAjk66qgHyqOys2TEC-K"')) {
    throw new Error("fixture changed LINKS_SHARE_HREF");
  }
  return next;
}

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function startServer(dir) {
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const rel = decodeURIComponent(url.pathname);
    const file = path.join(dir, rel === "/" ? "index.html" : rel);
    if (!file.startsWith(dir)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const stream = createReadStream(file);
    stream.on("error", () => {
      res.writeHead(404);
      res.end("missing");
    });
    stream.on("open", () => {
      res.writeHead(200, { "content-type": contentType(file), "cache-control": "no-store" });
    });
    stream.pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.next = 1;
    this.pending = new Map();
    this.waiters = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const pending = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) pending.reject(new Error(msg.error.message));
        else pending.resolve(msg.result);
        return;
      }
      this.waiters = this.waiters.filter((waiter) => {
        if (waiter.method !== msg.method) return true;
        waiter.resolve(msg.params);
        return false;
      });
    });
  }
  send(method, params = {}, sessionId) {
    const id = this.next++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  once(method) {
    return new Promise((resolve) => this.waiters.push({ method, resolve }));
  }
}

async function waitForChrome() {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      const res = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
      if (res.ok) return res.json();
    } catch {
      /* chrome is still booting */
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("chrome did not open a debugging port");
}

const CHECKS = `(() => {
  const fails = [];
  const fail = (message) => fails.push(message);
  const bots = document.querySelectorAll(".bot-cell").length;
  const tiles = document.querySelectorAll(".bots .glass-tile").length;
  const descs = document.querySelectorAll(".tile-desc").length;
  const chips = document.querySelectorAll("nav.links .glass-chip").length;
  const expectBots = window.__expectBots;
  const expectLinks = window.__expectLinks;
  const wide = window.innerWidth >= 480;
  if (expectBots <= 4) {
    if (tiles !== expectBots) fail("full tiles " + tiles + " != " + expectBots);
    if (bots !== 0) fail("grid rendered for " + expectBots + " bots");
    if (descs !== expectBots) fail("descriptions " + descs + " != " + expectBots);
  } else {
    if (bots !== expectBots) fail("grid cells " + bots + " != " + expectBots);
    if (tiles !== 0) fail("full tiles rendered for " + expectBots + " bots");
    if (descs !== 0) fail("grid showed a description");
    const cells = [...document.querySelectorAll(".bot-cell")];
    const rows = [];
    for (const cell of cells) {
      const box = cell.getBoundingClientRect();
      let row = rows.find((entry) => Math.abs(entry.top - box.top) < 6);
      if (!row) rows.push((row = { top: box.top, n: 0, left: Infinity, right: -Infinity }));
      row.n += 1;
      row.left = Math.min(row.left, box.left);
      row.right = Math.max(row.right, box.right);
    }
    const per = wide ? 6 : 4;
    if (rows[0] && rows[0].n !== Math.min(per, expectBots)) fail("first grid row " + (rows[0] && rows[0].n) + " expected " + Math.min(per, expectBots));
    const host = document.querySelector(".bot-grid").getBoundingClientRect();
    for (const row of rows) {
      const mid = (row.left + row.right) / 2;
      const hostMid = (host.left + host.right) / 2;
      if (Math.abs(mid - hostMid) > 3) fail("grid row off center by " + (mid - hostMid).toFixed(1));
    }
  }
  if (chips !== expectLinks) fail("chips " + chips + " != " + expectLinks);
  const nav = document.querySelector("nav.links");
  if (nav) {
    const chipNodes = [...nav.querySelectorAll(".glass-chip")];
    const rows = [];
    for (const chip of chipNodes) {
      const box = chip.getBoundingClientRect();
      let row = rows.find((entry) => Math.abs(entry.top - box.top) < 4);
      if (!row) rows.push((row = { top: box.top, left: Infinity, right: -Infinity }));
      row.left = Math.min(row.left, box.left);
      row.right = Math.max(row.right, box.right);
      const path = chip.querySelector("path");
      if (!path) {
        fail("chip missing glyph");
        continue;
      }
      const ink = path.getBoundingClientRect();
      const dx = (ink.left + ink.right) / 2 - (box.left + box.right) / 2;
      const dy = (ink.top + ink.bottom) / 2 - (box.top + box.bottom) / 2;
      if (Math.abs(dx) > 1.25 || Math.abs(dy) > 1.25) fail("glyph off center dx " + dx.toFixed(2) + " dy " + dy.toFixed(2));
    }
    const host = nav.getBoundingClientRect();
    for (const row of rows) {
      const mid = (row.left + row.right) / 2;
      const hostMid = (host.left + host.right) / 2;
      if (Math.abs(mid - hostMid) > 2) fail("chip row off center by " + (mid - hostMid).toFixed(1));
    }
  }
  const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (scrollWidth > document.documentElement.clientWidth + 1) fail("horizontal overflow " + scrollWidth + " > " + document.documentElement.clientWidth);
  const stage = document.querySelector(".stage");
  if (stage) {
    const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const viewW = document.documentElement.clientWidth;
    if (stage.offsetHeight < docH - 2) fail("stage shorter than the page " + stage.offsetHeight + " < " + docH);
    if (stage.offsetWidth < viewW - 2) fail("stage narrower than the viewport");
    const topBox = stage.getBoundingClientRect();
    if (topBox.left > 1 || topBox.right < viewW - 2) fail("side gutter at top");
    window.scrollTo(0, Math.max(0, docH - window.innerHeight));
    const bottomBox = stage.getBoundingClientRect();
    if (bottomBox.left > 1 || bottomBox.right < viewW - 2) fail("side gutter when scrolled");
    if (bottomBox.top > 1) fail("stage starts below the viewport when scrolled");
    if (bottomBox.bottom < window.innerHeight - 1) fail("stage ends above the viewport when scrolled");
    window.scrollTo(0, 0);
  }
  const names = document.querySelector(".bot-cell-name");
  if (names) {
    const ink = getComputedStyle(document.querySelector(".handle") || document.body).color;
    const nameInk = getComputedStyle(names).color;
    if (nameInk !== ink) fail("grid name ink " + nameInk + " != body ink " + ink);
    const shadow = getComputedStyle(names).textShadow;
    if (!shadow || shadow === "none") fail("grid name has no text shadow");
  }
  return fails;
})()`;

async function main() {
  const source = await readFile(path.join(root, "billboard.js"), "utf8");
  if (!source.includes('const LINKS_SHARE_HREF = "https://x.ai/bot/iAAjk66qgHyqOys2TEC-K"')) {
    throw new Error("source LINKS_SHARE_HREF changed");
  }
  await rm(work, { recursive: true, force: true });
  await mkdir(work, { recursive: true });
  await cp(path.join(root, "index.html"), path.join(work, "index.html"));
  await cp(path.join(root, "billboard.css"), path.join(work, "billboard.css"));
  await cp(path.join(root, "assets"), path.join(work, "assets"), { recursive: true });
  const server = await startServer(work);

  const profile = "/tmp/billboard-chrome";
  await rm(profile, { recursive: true, force: true });
  const chrome = spawn(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--disable-dev-shm-usage",
      "--force-device-scale-factor=1",
      `--remote-debugging-port=${chromePort}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  const failures = [];
  try {
    const version = await waitForChrome();
    const browser = await new Promise((resolve, reject) => {
      const ws = new WebSocket(version.webSocketDebuggerUrl);
      ws.addEventListener("open", () => resolve(new Cdp(ws)));
      ws.addEventListener("error", () => reject(new Error("chrome websocket failed")));
    });
    const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
    await browser.send("Page.enable", {}, sessionId);
    await browser.send("Runtime.enable", {}, sessionId);
    await mkdir(artifacts, { recursive: true });

    for (const botsN of BOT_COUNTS) {
      for (const linksN of SOCIAL_COUNTS) {
        const filled = fillSource(source, makeBots(botsN), makeLinks(linksN));
        await writeFile(path.join(work, "billboard.js"), filled);
        for (const width of WIDTHS) {
          const height = width === 390 ? 844 : 900;
          await browser.send(
            "Emulation.setDeviceMetricsOverride",
            { width, height, deviceScaleFactor: 1, mobile: width < 600 },
            sessionId,
          );
          await browser.send(
            "Emulation.setEmulatedMedia",
            { features: [{ name: "prefers-color-scheme", value: "dark" }] },
            sessionId,
          );
          const loaded = browser.once("Page.loadEventFired");
          await browser.send("Page.navigate", { url: `http://127.0.0.1:${port}/?b=${botsN}&s=${linksN}&w=${width}` }, sessionId);
          await loaded;
          await browser.send(
            "Runtime.evaluate",
            {
              expression: `window.__expectBots = ${botsN}; window.__expectLinks = ${linksN}; new Promise((resolve) => {
                const started = Date.now();
                const tick = () => {
                  const glasses = [...document.querySelectorAll("#billboard .glass")];
                  const ready = glasses.length > 0 && glasses.every((node) => node.dataset.shot);
                  if (ready || Date.now() - started > 8000) resolve(ready);
                  else requestAnimationFrame(tick);
                };
                tick();
              })`,
              awaitPromise: true,
            },
            sessionId,
          );
          const checked = await browser.send(
            "Runtime.evaluate",
            { expression: CHECKS, returnByValue: true },
            sessionId,
          );
          const fails = checked.result.value || ["checks did not return"];
          const label = `b${botsN}_s${linksN}_${width}`;
          if (fails.length) {
            failures.push(label + ": " + fails.join("; "));
            console.error("FAIL", label, fails);
          } else {
            console.log("ok", label);
          }
          const metrics = await browser.send(
            "Runtime.evaluate",
            {
              expression: `Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)`,
              returnByValue: true,
            },
            sessionId,
          );
          const fullHeight = Math.ceil(metrics.result.value || height);
          const shot = await browser.send(
            "Page.captureScreenshot",
            {
              format: "png",
              captureBeyondViewport: true,
              clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 },
            },
            sessionId,
          );
          const file = path.join(artifacts, `billboard_${label}.png`);
          await writeFile(file, Buffer.from(shot.data, "base64"));
          console.log("shot", file, fullHeight);
        }
      }
    }

    // Narrow phone: 35 bots and 30 socials must not overflow at 320.
    await browser.send(
      "Emulation.setDeviceMetricsOverride",
      { width: 320, height: 700, deviceScaleFactor: 1, mobile: true },
      sessionId,
    );
    const loaded = browser.once("Page.loadEventFired");
    await browser.send("Page.navigate", { url: `http://127.0.0.1:${port}/?narrow=1` }, sessionId);
    await loaded;
    await browser.send(
      "Runtime.evaluate",
      {
        expression: `window.__expectBots = 35; window.__expectLinks = 30; new Promise((resolve) => setTimeout(resolve, 400))`,
        awaitPromise: true,
      },
      sessionId,
    );
    const narrow = await browser.send("Runtime.evaluate", { expression: CHECKS, returnByValue: true }, sessionId);
    const narrowFails = narrow.result.value || ["narrow checks did not return"];
    if (narrowFails.length) failures.push("320: " + narrowFails.join("; "));
    else console.log("ok 320");
  } finally {
    chrome.kill("SIGKILL");
    server.close();
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("demo fixture ok");
}

await main();
