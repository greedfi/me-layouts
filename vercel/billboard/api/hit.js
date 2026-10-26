"use strict";

/**
 * Hobby click counts for the static Billboard export.
 * POST /api/hit  { kind: "bot"|"link", label, href, ts }
 * GET  /api/hit  { total, clicks: [{ kind, label, href, count, lastTs }] }
 *
 * Counts live in one private Blob object, billboard/clicks.json.
 * Blob is included on Hobby within the free allowance (no Pro, no charge).
 * Connect a private store to the project so BLOB_READ_WRITE_TOKEN
 * (or VERCEL_OIDC_TOKEN + BLOB_STORE_ID) is present. No npm package.
 * Until a store is connected, POST still returns 204 and the event is logged.
 */

const COUNTS_PATH = "billboard/clicks.json";
const BLOB_API = "https://vercel.com/api/blob";
const API_VERSION = "13";
const MAX_BODY = 8192;
const MAX_LABEL = 160;
const MAX_HREF = 2000;
const MAX_ROWS = 400;

let cache = null;
let detectedAccess = "";

function emptyDoc() {
  return { version: 1, total: 0, updatedAt: 0, clicks: [] };
}

function resetForTests() {
  cache = null;
  detectedAccess = "";
}

function blobAuth() {
  const rw = String(process.env.BLOB_READ_WRITE_TOKEN || "").trim();
  if (rw) {
    const storeId = rw.split("_")[3] || "";
    if (storeId) return { token: rw, storeId };
  }
  const oidc = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
  const fromEnv = String(process.env.BLOB_STORE_ID || "").trim();
  if (oidc && fromEnv) {
    const storeId = fromEnv.startsWith("store_") ? fromEnv.slice("store_".length) : fromEnv;
    if (storeId) return { token: oidc, storeId };
  }
  return null;
}

function preferredAccess() {
  if (detectedAccess) return detectedAccess;
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}

function authHeaders(auth) {
  return {
    authorization: "Bearer " + auth.token,
    "x-vercel-blob-store-id": auth.storeId,
    "x-api-version": API_VERSION,
  };
}

function blobError(status, detail) {
  const err = new Error("blob " + status);
  err.status = status;
  err.detail = String(detail || "").slice(0, 300);
  return err;
}

function accessMismatch(err) {
  if (!err || process.env.BLOB_ACCESS) return false;
  if (err.status !== 400 && err.status !== 403) return false;
  const text = String(err.detail || "").toLowerCase();
  return text.includes("access") && (text.includes("public") || text.includes("private"));
}

function normalizeDoc(raw) {
  const doc = emptyDoc();
  if (!raw || typeof raw !== "object") return doc;
  const total = Number(raw.total);
  if (Number.isFinite(total) && total > 0) doc.total = Math.trunc(total);
  const updatedAt = Number(raw.updatedAt);
  if (Number.isFinite(updatedAt)) doc.updatedAt = Math.trunc(updatedAt);
  if (!Array.isArray(raw.clicks)) return doc;
  for (const row of raw.clicks) {
    if (!row || (row.kind !== "bot" && row.kind !== "link")) continue;
    if (typeof row.href !== "string" || row.href.length === 0 || row.href.length > MAX_HREF) continue;
    const count = Number(row.count);
    const lastTs = Number(row.lastTs);
    doc.clicks.push({
      kind: row.kind,
      label: typeof row.label === "string" ? row.label.slice(0, MAX_LABEL) : "",
      href: row.href,
      count: Number.isFinite(count) && count > 0 ? Math.trunc(count) : 0,
      lastTs: Number.isFinite(lastTs) ? Math.trunc(lastTs) : 0,
    });
  }
  return doc;
}

function applyClick(doc, event) {
  const next = normalizeDoc(doc);
  let row = null;
  for (const item of next.clicks) {
    if (item.kind === event.kind && item.href === event.href) {
      row = item;
      break;
    }
  }
  if (!row) {
    if (next.clicks.length >= MAX_ROWS) {
      let oldest = 0;
      for (let i = 1; i < next.clicks.length; i++) {
        if (next.clicks[i].lastTs < next.clicks[oldest].lastTs) oldest = i;
      }
      next.clicks.splice(oldest, 1);
    }
    row = { kind: event.kind, label: event.label, href: event.href, count: 0, lastTs: event.ts };
    next.clicks.push(row);
  }
  if (event.label) row.label = event.label;
  row.count += 1;
  row.lastTs = event.ts;
  next.total += 1;
  next.updatedAt = event.ts;
  next.version = 1;
  return next;
}

function parseHit(raw) {
  let data = raw;
  if (Buffer.isBuffer(data)) data = data.toString("utf8");
  if (typeof data === "string") {
    const text = data.trim();
    if (text.length === 0) return null;
    data = JSON.parse(text);
  }
  if (!data || typeof data !== "object") return null;
  if (data.kind !== "bot" && data.kind !== "link") return null;
  const href = typeof data.href === "string" ? data.href.trim() : "";
  if (href.length === 0 || href.length > MAX_HREF || href.startsWith("__")) return null;
  if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) return null;
  const label = typeof data.label === "string" ? data.label.replace(/\s+/g, " ").trim().slice(0, MAX_LABEL) : "";
  const tsNumber = Number(data.ts);
  const ts = Number.isFinite(tsNumber) ? Math.trunc(tsNumber) : Date.now();
  return { kind: data.kind, label, href, ts };
}

async function readWithAccess(auth, access) {
  const url = "https://" + auth.storeId + "." + access + ".blob.vercel-storage.com/" + COUNTS_PATH + "?cache=0";
  const res = await fetch(url, { headers: { authorization: "Bearer " + auth.token } });
  if (res.status === 404) return { doc: emptyDoc(), etag: "" };
  if (!res.ok) throw blobError(res.status, await res.text());
  const etag = res.headers.get("etag") || "";
  let json = null;
  try {
    json = await res.json();
  } catch (err) {
    json = null;
  }
  return { doc: normalizeDoc(json), etag };
}

async function readCounts(auth) {
  if (cache) return { doc: cache.doc, etag: cache.etag };
  const access = preferredAccess();
  try {
    const loaded = await readWithAccess(auth, access);
    if (!detectedAccess) detectedAccess = access;
    cache = loaded;
    return loaded;
  } catch (err) {
    if (!accessMismatch(err)) throw err;
    const other = access === "private" ? "public" : "private";
    const loaded = await readWithAccess(auth, other);
    detectedAccess = other;
    cache = loaded;
    return loaded;
  }
}

async function writeCounts(auth, doc, etag) {
  const access = preferredAccess();
  const headers = {
    ...authHeaders(auth),
    "x-vercel-blob-access": access,
    "x-content-type": "application/json",
    "x-add-random-suffix": "0",
    "x-allow-overwrite": etag ? "1" : "0",
    "x-cache-control-max-age": "0",
  };
  if (etag) headers["x-if-match"] = etag;
  const params = new URLSearchParams({ pathname: COUNTS_PATH });
  const res = await fetch(BLOB_API + "/?" + params.toString(), {
    method: "PUT",
    headers,
    body: JSON.stringify(doc),
  });
  if (res.status === 412 || res.status === 409) {
    cache = null;
    return { ok: false, conflict: true };
  }
  if (!res.ok) {
    const detail = await res.text();
    cache = null;
    if (accessMismatch(blobError(res.status, detail))) {
      detectedAccess = access === "private" ? "public" : "private";
      return { ok: false, conflict: true };
    }
    throw blobError(res.status, detail);
  }
  let etagNext = "";
  try {
    const payload = await res.json();
    etagNext = payload && payload.etag ? String(payload.etag) : "";
  } catch (err) {
    etagNext = "";
  }
  if (!detectedAccess) detectedAccess = access;
  cache = etagNext ? { doc, etag: etagNext } : null;
  return { ok: true };
}

async function recordClick(auth, hit) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await readCounts(auth);
    const next = applyClick(current.doc, hit);
    const wrote = await writeCounts(auth, next, current.etag);
    if (wrote.ok) return;
  }
  throw new Error("blob conflict");
}

function publicCounts(doc) {
  const clicks = doc.clicks.map((row) => ({
    kind: row.kind,
    label: row.label,
    href: row.href,
    count: row.count,
    lastTs: row.lastTs,
  }));
  clicks.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label) || a.href.localeCompare(b.href));
  return { ok: true, storage: "blob", total: doc.total, updatedAt: doc.updatedAt, clicks };
}

function unconfiguredBody() {
  return {
    ok: true,
    storage: "unconfigured",
    total: 0,
    updatedAt: 0,
    clicks: [],
    hint: "Connect a private Vercel Blob store to this project. Blob is included on Hobby within the free allowance. Counts are stored at billboard/clicks.json.",
  };
}

async function readRaw(req) {
  if (req.body != null && req.body !== "") {
    if (typeof req.body === "string") {
      if (req.body.length > MAX_BODY) {
        const err = new Error("body too large");
        err.statusCode = 413;
        throw err;
      }
      return req.body;
    }
    if (Buffer.isBuffer(req.body)) {
      if (req.body.length > MAX_BODY) {
        const err = new Error("body too large");
        err.statusCode = 413;
        throw err;
      }
      return req.body;
    }
    if (typeof req.body === "object") return req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > MAX_BODY) {
      const err = new Error("body too large");
      err.statusCode = 413;
      throw err;
    }
    chunks.push(buf);
  }
  return chunks.length === 0 ? "" : Buffer.concat(chunks).toString("utf8");
}

function sendJson(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(status).end(JSON.stringify(payload));
}

async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const method = req.method || "GET";
  if (method === "GET") {
    const auth = blobAuth();
    if (!auth) {
      sendJson(res, 200, unconfiguredBody());
      return;
    }
    try {
      const current = await readCounts(auth);
      sendJson(res, 200, publicCounts(current.doc));
    } catch (err) {
      console.error(JSON.stringify({ source: "page-hit", name: "hit_read_error", message: String(err && err.message || err) }));
      sendJson(res, 200, {
        ok: false,
        storage: "error",
        total: 0,
        updatedAt: 0,
        clicks: [],
        hint: "Blob read failed. Check the function logs and that a private Blob store is connected.",
      });
    }
    return;
  }
  if (method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).end();
    return;
  }
  let hit = null;
  try {
    hit = parseHit(await readRaw(req));
  } catch (err) {
    res.status(err && err.statusCode === 413 ? 413 : 400).end();
    return;
  }
  if (!hit) {
    res.status(400).end();
    return;
  }
  console.log(JSON.stringify({ source: "page-hit", name: "outbound_click", kind: hit.kind, label: hit.label, href: hit.href, ts: hit.ts }));
  const auth = blobAuth();
  if (auth) {
    try {
      await recordClick(auth, hit);
    } catch (err) {
      console.error(JSON.stringify({ source: "page-hit", name: "hit_write_error", message: String(err && err.message || err) }));
    }
  }
  res.status(204).end();
}

module.exports = handler;
module.exports.parseHit = parseHit;
module.exports.applyClick = applyClick;
module.exports.emptyDoc = emptyDoc;
module.exports.resetForTests = resetForTests;
module.exports.blobAuth = blobAuth;
module.exports.MAX_ROWS = MAX_ROWS;
