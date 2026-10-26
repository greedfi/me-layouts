/** Read one double-quoted const initializer from billboard.js. */
export function jsConst(source, name) {
  const re = new RegExp("const " + name + " = (\"(?:\\\\.|[^\"\\\\])*\")\\s*;");
  const match = source.match(re);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export function usableToken(value) {
  const text = String(value ?? "").trim();
  if (text.length === 0 || /^__.+__$/.test(text)) return "";
  return text;
}

/** Shipped <title>. Only PAGE_TITLE. Placeholders stay blank. */
export function htmlTitle(source) {
  return usableToken(jsConst(source, "PAGE_TITLE"));
}

export function escapeTitle(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
