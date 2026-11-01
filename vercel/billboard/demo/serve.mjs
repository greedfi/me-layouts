/**
 * Serves the billboard pack with an in-memory fixture. Does not write billboard.js.
 * Query: ?bots=12&socials=7&open=1&q=Harbor
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyFixture } from "./fixture.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function fixtureOpts(params) {
  return {
    bots: Number(params.get("bots") ?? 3),
    socials: Number(params.get("socials") ?? 3),
    open: params.get("open") === "1",
    q: params.get("q") || "",
  };
}

export function startDemoServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      if (url.pathname === "/" || url.pathname === "/index.html") {
        let html = await readFile(path.join(root, "index.html"), "utf8");
        const q = url.search || "";
        html = html.replace('src="billboard.js"', `src="billboard.js${q}"`);
        res.writeHead(200, { "content-type": TYPES[".html"], "cache-control": "no-store" });
        res.end(html);
        return;
      }
      if (url.pathname === "/billboard.js") {
        const source = await readFile(path.join(root, "billboard.js"), "utf8");
        const js = applyFixture(source, fixtureOpts(url.searchParams));
        res.writeHead(200, { "content-type": TYPES[".js"], "cache-control": "no-store" });
        res.end(js);
        return;
      }
      const rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const file = path.resolve(root, rel);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const body = await readFile(file);
      const ext = path.extname(file);
      res.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": "no-store" });
      res.end(body);
    } catch (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(err && err.message ? err.message : err));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}
