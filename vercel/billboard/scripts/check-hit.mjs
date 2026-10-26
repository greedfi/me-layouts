import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { escapeTitle, htmlTitle, jsConst } from "./page-title.mjs";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hit = require("../api/hit.js");

let failed = 0;

function assert(cond, message) {
  if (cond) return;
  failed += 1;
  console.error("FAIL " + message);
}

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end(payload) {
      this.body = payload;
      return this;
    },
  };
}

function mockReq(method, body) {
  return {
    method,
    body,
    async *[Symbol.asyncIterator]() {},
  };
}

async function withEnv(vars, fn) {
  const keys = ["BLOB_READ_WRITE_TOKEN", "VERCEL_OIDC_TOKEN", "BLOB_STORE_ID", "BLOB_ACCESS"];
  const prev = {};
  for (const key of keys) prev[key] = process.env[key];
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, vars);
  hit.resetForTests();
  const prevFetch = global.fetch;
  try {
    await fn();
  } finally {
    global.fetch = prevFetch;
    for (const key of keys) {
      if (prev[key] === undefined) delete process.env[key];
      else process.env[key] = prev[key];
    }
    hit.resetForTests();
  }
}

function jsonBody(res) {
  return JSON.parse(res.body);
}

async function main() {
  assert(hit.parseHit({ kind: "bot", label: "  Ada  ", href: "https://x.ai/bot/ada", ts: 5 }).label === "Ada", "label is trimmed");
  assert(hit.parseHit({ kind: "link", label: "Mail", href: "mailto:a@b.c", ts: 1 }).kind === "link", "mailto is a link hit");
  assert(hit.parseHit({ kind: "bot", href: "javascript:alert(1)", label: "x" }) === null, "javascript href is rejected");
  assert(hit.parseHit({ kind: "tile", href: "https://example.com", label: "x" }) === null, "kind must be bot or link");
  assert(hit.parseHit('{"kind":"bot","href":"__BOT0_HREF__","label":"x"}') === null, "placeholder href is rejected");
  let threw = false;
  try {
    hit.parseHit("{");
  } catch (err) {
    threw = true;
  }
  assert(threw, "bad json throws");

  const once = hit.applyClick(hit.emptyDoc(), { kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", ts: 10 });
  const twice = hit.applyClick(once, { kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", ts: 11 });
  const other = hit.applyClick(twice, { kind: "link", label: "Site", href: "https://x.ai/bot/ada", ts: 12 });
  assert(twice.total === 2 && twice.clicks.length === 1 && twice.clicks[0].count === 2, "same target increments");
  assert(other.clicks.length === 2 && other.total === 3, "bot and link stay separate");

  let doc = hit.emptyDoc();
  for (let i = 0; i < hit.MAX_ROWS + 3; i++) {
    doc = hit.applyClick(doc, { kind: "link", label: "L" + i, href: "https://example.com/" + i, ts: i + 1 });
  }
  assert(doc.clicks.length === hit.MAX_ROWS, "row cap stays bounded");
  assert(doc.total === hit.MAX_ROWS + 3, "total still counts past the row cap");
  assert(!doc.clicks.some((row) => row.href === "https://example.com/0"), "oldest row is dropped");

  assert(htmlTitle('const PAGE_TITLE = "__PAGE_TITLE__";\n') === "", "placeholder title is blank");
  assert(jsConst('const PAGE_TITLE = "Ada \\"A\\"";\n', "PAGE_TITLE") === 'Ada "A"', "escaped title parses");
  assert(escapeTitle(htmlTitle('const PAGE_TITLE = "Ada & <Co>";\n')) === "Ada &amp; &lt;Co&gt;", "title is escaped");

  const logs = [];
  const errors = [];
  const origLog = console.log;
  const origErr = console.error;
  console.log = (line) => logs.push(String(line));
  console.error = (line) => errors.push(String(line));
  try {
    await withEnv({}, async () => {
      let fetches = 0;
      global.fetch = async () => {
        fetches += 1;
        throw new Error("should not fetch");
      };
      const res = mockRes();
      await hit(mockReq("GET"), res);
      assert(res.statusCode === 200 && jsonBody(res).storage === "unconfigured", "GET without Blob is unconfigured");
      assert(fetches === 0, "unconfigured GET does not call Blob");
      const post = mockRes();
      await hit(mockReq("POST", { kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", ts: 4 }), post);
      assert(post.statusCode === 204, "POST without Blob still returns 204");
      assert(logs.some((line) => line.includes("outbound_click") && line.includes("https://x.ai/bot/ada")), "POST logs the click");
      assert(fetches === 0, "unconfigured POST does not call Blob");
    });

    await withEnv({}, async () => {
      const bad = mockRes();
      await hit(mockReq("POST", { kind: "bot", href: "javascript:alert(1)", label: "x" }), bad);
      assert(bad.statusCode === 400, "bad click is 400");
      const huge = mockRes();
      await hit(mockReq("POST", "x".repeat(9000)), huge);
      assert(huge.statusCode === 413, "large body is 413");
      const nope = mockRes();
      await hit(mockReq("PUT", ""), nope);
      assert(nope.statusCode === 405, "PUT is 405");
    });

    await withEnv({ BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_storeid_secret" }, async () => {
      assert(hit.blobAuth().storeId === "storeid", "store id comes from the read-write token");
      let state = null;
      const calls = [];
      global.fetch = async (url, init) => {
        const method = (init && init.method) || "GET";
        calls.push(method + " " + url);
        if (method === "PUT") {
          const doc = JSON.parse(init.body);
          if (state && init.headers["x-if-match"] && init.headers["x-if-match"] !== state.etag) {
            return new Response("{}", { status: 412 });
          }
          state = { doc, etag: '"t' + doc.total + '"' };
          return new Response(JSON.stringify({ etag: state.etag }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        if (!String(url).includes("storeid.private.blob.vercel-storage.com/billboard/clicks.json")) {
          return new Response("wrong url", { status: 500 });
        }
        if (!state) return new Response("missing", { status: 404 });
        return new Response(JSON.stringify(state.doc), {
          status: 200,
          headers: { etag: state.etag, "content-type": "application/json" },
        });
      };
      const first = mockRes();
      await hit(mockReq("POST", { kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", ts: 1 }), first);
      const second = mockRes();
      await hit(mockReq("POST", { kind: "link", label: "Site", href: "https://example.com", ts: 2 }), second);
      assert(first.statusCode === 204 && second.statusCode === 204, "counted posts return 204");
      hit.resetForTests();
      const got = mockRes();
      await hit(mockReq("GET"), got);
      const body = jsonBody(got);
      assert(body.storage === "blob" && body.total === 2 && body.clicks.length === 2, "GET returns both counts");
      assert(body.clicks[0].count === 1 && body.clicks[1].count === 1, "each target was counted once");
      assert(calls.some((line) => line.startsWith("PUT ")), "counts are written with PUT");
    });

    await withEnv({ BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_storeid_secret" }, async () => {
      let state = {
        doc: {
          version: 1,
          total: 1,
          updatedAt: 1,
          clicks: [{ kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", count: 1, lastTs: 1 }],
        },
        etag: '"old"',
      };
      let puts = 0;
      global.fetch = async (url, init) => {
        const method = (init && init.method) || "GET";
        if (method === "PUT") {
          puts += 1;
          if (puts === 1) {
            state = { ...state, etag: '"new"' };
            return new Response("{}", { status: 412 });
          }
          assert(init.headers["x-if-match"] === '"new"', "retry uses the fresh etag");
          state = { doc: JSON.parse(init.body), etag: '"done"' };
          return new Response(JSON.stringify({ etag: state.etag }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(JSON.stringify(state.doc), {
          status: 200,
          headers: { etag: state.etag, "content-type": "application/json" },
        });
      };
      const res = mockRes();
      await hit(mockReq("POST", { kind: "bot", label: "Ada", href: "https://x.ai/bot/ada", ts: 9 }), res);
      assert(res.statusCode === 204 && puts === 2 && state.doc.total === 2, "etag conflict retries once");
    });

    await withEnv({ VERCEL_OIDC_TOKEN: "oidc-token", BLOB_STORE_ID: "store_abc" }, async () => {
      const seen = [];
      global.fetch = async (url) => {
        seen.push(String(url));
        if (String(url).includes(".private.")) return new Response("the access must be public for this store", { status: 403 });
        return new Response("missing", { status: 404 });
      };
      const res = mockRes();
      await hit(mockReq("GET"), res);
      assert(jsonBody(res).storage === "blob", "public store is accepted after a private mismatch");
      assert(seen.some((url) => url.includes("abc.public.blob.vercel-storage.com")), "OIDC store id is normalized");
    });
  } finally {
    console.log = origLog;
    console.error = origErr;
  }

  const html = await readFile(path.join(root, "out", "index.html"), "utf8");
  const js = await readFile(path.join(root, "billboard.js"), "utf8");
  // Pack source on main still has the token. A .links fill replaces it.
  const template = /const PAGE_TITLE = "__PAGE_TITLE__"\s*;/.test(js);
  assert(!/<title>[^<]*Billboard/i.test(html), "shipped title does not say Billboard");
  assert(html.includes("/_vercel/insights/script.js"), "insights script is in out/");
  assert(html.includes("/_vercel/speed-insights/script.js"), "speed insights script is in out/");
  if (js.includes("__GA_MEASUREMENT_ID__")) {
    assert(!html.includes("googletagmanager.com"), "GA is not injected while the token is a placeholder");
  }
  if (js.includes("__META_PIXEL_ID__")) {
    assert(!html.includes("fbevents.js"), "Meta is not injected while the token is a placeholder");
  }
  if (template) {
    assert(html.includes("<title></title>"), "unfilled build keeps an empty title");
    for (const token of ["__PAGE_TITLE__", "__GA_MEASUREMENT_ID__", "__META_PIXEL_ID__", "__DISPLAY_NAME__", "__AVATAR_DATA_URI__", "__LINKS_SHARE_HREF__"]) {
      assert(js.split(token).length === 2, token + " stays a single placeholder");
    }
  } else {
    const shipped = html.match(/<title>([^<]*)<\/title>/);
    const text = shipped ? shipped[1].trim() : "";
    const page = htmlTitle(js);
    assert(text.length > 0, "filled build writes a non-empty title");
    assert(page.length > 0, "filled PAGE_TITLE is non-empty");
    assert(!/billboard/i.test(page), "filled title is not the word Billboard");
  }

  if (failed > 0) {
    console.error(failed + " assertion(s) failed");
    process.exit(1);
  }
  console.log(template ? "hit checks ok (template)" : "hit checks ok (filled)");
}

await main();
