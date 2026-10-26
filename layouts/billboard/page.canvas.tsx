import { useGrokTheme, Image, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "grok/canvas";

/**
 * Pinned .me pack — billboard.
 * Link-tree column: avatar, name, handle, bio, full-width Install tiles, link chips, footer.
 * Header is those four fields only — no pack wordmark, no kicker.
 * Tiles and chips are a liqui lens (displacement + frost + specular + tint).
 * Avatar and icons stay solid. Install is a solid accent control, not a lens.
 * The stage is a dark field with hard rules so refraction has an edge to bend.
 * No photographed frost plates.
 * Replace the constants and the bots/links arrays. Leave the JSX alone. See README.md.
 *
 * Optics adapted from liqui (MIT), leefanv/liqui-design:
 * packages/glass/src/LiquiGlass.tsx, filterRegistry.ts, glass.css, tokens.ts
 * apps/www/registry/liqui/ui/button.tsx
 * apps/www/registry/liqui/components/media-player/player-backdrop.tsx
 * apps/www/registry/liqui/components/media-player/now-playing.tsx
 */

const AVATAR = "__AVATAR_DATA_URI__";
const DISPLAY_NAME = "__DISPLAY_NAME__";
const HANDLE = "__HANDLE__";
const BIO = "__BIO__";
const FOOTER = "__FOOTER__";

type Bot = {
  name: string;
  desc: string;
  src: string;
  href: string;
};

type Link = {
  label: string;
  href: string;
  display: string;
};

// Filler replaces this array from owner setup answers.
// Later entries use the same keys: __BOTn_NAME__, __BOTn_DESC__, __BOTn_ICON__, __BOTn_HREF__.
const bots: readonly Bot[] = [
  {
    name: "__BOT0_NAME__",
    desc: "__BOT0_DESC__",
    src: "__BOT0_ICON__",
    href: "__BOT0_HREF__",
  },
];

// Filler replaces this array from owner setup answers.
// Later entries use __LINKn_LABEL__, __LINKn_HREF__, __LINKn_DISPLAY__.
const links: readonly Link[] = [
  {
    label: "__LINK0_LABEL__",
    href: "__LINK0_HREF__",
    display: "__LINK0_DISPLAY__",
  },
];

export const LAYOUT = "billboard" as const;

const AVATAR_SIZE = 60;

/**
 * Plate = NowPlaying PLATE_GLASS. Chip = button BUTTON_GLASS.
 * frost/specular/saturation are the theme dials (Graphite/Noir, a step
 * above the shipped 0.35 / 0.7 so the rim and the tint actually read).
 */
const TILE_DIAL = { blur: 1, refraction: 110, bezel: 22, radius: 20, frost: 0.5, saturation: 1.7, specular: 0.9 };
const CHIP_DIAL = { blur: 1, refraction: 45, bezel: 11, radius: 999, frost: 0.4, saturation: 1.65, specular: 0.8 };

const TINT_GRAD_DARK = "linear-gradient(135deg, rgba(30,32,46,0.62), rgba(18,20,32,0.40))";
const TINT_GRAD_LIGHT = "linear-gradient(135deg, rgba(255,255,255,0.48), rgba(255,255,255,0.14))";
const CLEAR = "rgba(0,0,0,0)";

const SHINE_DARK = [
  "inset 0 1px 0 rgba(255,255,255,0.96)",
  "inset 2px -2px 1px -1px rgba(255,255,255,0.78)",
  "inset -2px 2px 1px -1px rgba(255,255,255,0.46)",
  "inset 6px -6px 1px -6px rgba(255,255,255,0.34)",
  "inset -6px 6px 1px -6px rgba(255,255,255,0.18)",
  "inset 0 0 3px rgba(0,0,0,0.78)",
].join(", ");
const SHINE_LIGHT = [
  "inset 0 1px 0 rgba(255,255,255,0.98)",
  "inset 2px -2px 1px -1px rgba(255,255,255,0.90)",
  "inset -2px 2px 1px -1px rgba(255,255,255,0.62)",
  "inset 6px -6px 1px -6px rgba(255,255,255,0.40)",
  "inset -6px 6px 1px -6px rgba(255,255,255,0.28)",
  "inset 0 0 2px rgba(0,0,0,0.28)",
].join(", ");
const ELEVATED_DARK = "0 28px 64px rgba(0,0,5,0.62), 0 4px 14px rgba(0,0,5,0.38)";
const ELEVATED_LIGHT = "0 24px 60px rgba(10,15,40,0.28), 0 4px 14px rgba(10,15,40,0.14)";
const CAUSTIC_EDGE = "1px solid rgba(0,0,0,0.90)";
const SHEEN =
  "linear-gradient(128deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 64%, rgba(255,255,255,0.62) 100%)";
const AVATAR_RING_DARK = "0 0 0 2px rgba(255,255,255,0.88), 0 10px 24px rgba(0,0,0,0.45)";
const AVATAR_RING_LIGHT = "0 0 0 2px rgba(16,16,20,0.88), 0 10px 24px rgba(16,16,20,0.16)";
const ICON_RING_DARK = "inset 0 0 0 1px rgba(255,255,255,0.28)";
const ICON_RING_LIGHT = "inset 0 0 0 1px rgba(16,16,20,0.16)";

const RULE_W50 = "rgba(255,255,255,0.50)";
const RULE_W40 = "rgba(255,255,255,0.40)";
const RULE_W30 = "rgba(255,255,255,0.30)";
const RULE_W25 = "rgba(255,255,255,0.25)";
const RULE_K50 = "rgba(0,0,0,0.50)";
const RULE_K40 = "rgba(0,0,0,0.40)";
const RULE_K30 = "rgba(0,0,0,0.30)";
const RULE_K22 = "rgba(0,0,0,0.22)";
const BAND_DARK = "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.92), rgba(255,255,255,0))";
const BAND_LIGHT = "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.55), rgba(0,0,0,0))";
const SCRIM_DARK = "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0) 38%, rgba(0,0,0,0.45))";
const SCRIM_LIGHT = "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0) 40%, rgba(16,16,24,0.16))";

const STAMP_NAME_DARK = "0 1px 0 rgba(0,0,0,0.96), 0 2px 0 rgba(0,0,0,0.72), 0 3px 0 rgba(0,0,0,0.42), 0 12px 28px rgba(0,0,0,0.55)";
const STAMP_NAME_LIGHT = "0 1px 0 rgba(255,255,255,0.94), 0 2px 0 rgba(16,16,20,0.22), 0 12px 28px rgba(16,16,20,0.18)";
const STAMP_TITLE_DARK = "0 1px 0 rgba(0,0,0,0.94), 0 2px 0 rgba(0,0,0,0.62), 0 8px 18px rgba(0,0,0,0.48)";
const STAMP_TITLE_LIGHT = "0 1px 0 rgba(255,255,255,0.92), 0 2px 0 rgba(16,16,20,0.2), 0 8px 16px rgba(16,16,20,0.14)";
const LEGIBLE_DARK = "0 1px 2px rgba(0,0,0,0.78), 0 0 14px rgba(0,0,0,0.38)";
const LEGIBLE_LIGHT = "0 1px 0 rgba(255,255,255,0.88), 0 1px 2px rgba(16,16,20,0.2)";
const PILL_LIP = "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.32)";
const PILL_GLOSS = "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))";
const FOCUS_NONE = "none";

const LAYER: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  pointerEvents: "none",
};

const SQUIRCLE = { cornerShape: "squircle" } as CSSProperties;

type Dial = typeof TILE_DIAL;

type GlassShot = {
  w: number;
  h: number;
  map: string;
  specular: string;
  specularDark: string;
};

const LUT_SIZE = 128;
const LIGHT_SPREAD = 1.08;
const DIFFUSE_SPREAD = LIGHT_SPREAD * 0.65;
const SIDE_SPREAD = 0.98;

type SurfaceLUTs = { mag: Float32Array; slope: Float32Array };
let squircleLut: SurfaceLUTs | null = null;

function sat(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Squircle slab: Snell bend along the bezel. Port of surfaceLUTs('squircle'). */
function surfaceLUTs(): SurfaceLUTs {
  if (squircleLut) return squircleLut;
  const mag = new Float32Array(LUT_SIZE);
  const slope = new Float32Array(LUT_SIZE);
  const n = 1.5;
  const thickness = 0.6;
  const heightAt = (t: number): number => Math.pow(1 - Math.pow(1 - t, 4), 0.25);
  const eps = 1 / 1024;
  let max = 0;
  for (let i = 0; i < LUT_SIZE; i++) {
    const t = Math.max(i / (LUT_SIZE - 1), eps);
    const hi = Math.min(t + eps, 1);
    const lo = Math.max(t - eps, 0);
    slope[i] = ((heightAt(hi) - heightAt(lo)) / (hi - lo)) * thickness;
    const thetaI = Math.atan(Math.abs(slope[i]));
    const delta = thetaI - Math.asin(Math.sin(thetaI) / n);
    mag[i] = heightAt(t) * thickness * Math.tan(delta);
    max = Math.max(max, mag[i]);
  }
  if (max > 0) {
    for (let i = 0; i < LUT_SIZE; i++) mag[i] /= max;
  }
  squircleLut = { mag, slope };
  return squircleLut;
}

type SurfaceField = { sd: number; nx: number; ny: number };

/** Squircle outline SDF. Port of surfaceField. */
function surfaceField(px: number, py: number, bx: number, by: number, r: number, out: SurfaceField): void {
  const qx = Math.abs(px) - bx;
  const qy = Math.abs(py) - by;
  if (qx > 0 && qy > 0) {
    const x3 = qx * qx * qx;
    const y3 = qy * qy * qy;
    const q = Math.pow(qx * x3 + qy * y3, 0.25);
    const len = Math.hypot(x3, y3) || 1;
    out.sd = ((q - r) * q * q * q) / len;
    out.nx = (Math.sign(px) * x3) / len;
    out.ny = (Math.sign(py) * y3) / len;
  } else {
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);
    out.sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
    if (qx > qy) {
      out.nx = Math.sign(px);
      out.ny = 0;
    } else {
      out.nx = 0;
      out.ny = Math.sign(py);
    }
  }
}

const IMAGE_CACHE_MAX = 48;
const imageCache = new Map<string, { map: string; specular: string; specularDark: string }>();

function cacheGet(key: string): { map: string; specular: string; specularDark: string } | undefined {
  const hit = imageCache.get(key);
  if (!hit) return undefined;
  imageCache.delete(key);
  imageCache.set(key, hit);
  return hit;
}

/**
 * Displacement map (R = x, B = y, 128 = rest) plus a baked specular rim.
 * Port of glassImages. Large maps are half-resolution; the rim stays full-res.
 */
function glassImages(
  fullW: number,
  fullH: number,
  fullRadius: number,
  fullBezel: number,
): { map: string; specular: string; specularDark: string } | null {
  if (typeof document === "undefined") return null;
  const key = `${fullW}x${fullH}r${fullRadius}b${fullBezel}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  try {
    const scale = fullW * fullH > 32000 ? 0.5 : 1;
    const w = Math.ceil(fullW * scale);
    const h = Math.ceil(fullH * scale);
    const radius = fullRadius * scale;
    const bezel = Math.max(1, fullBezel * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(w, h);
    const data = image.data;
    const { mag: lut } = surfaceLUTs();
    const field: SurfaceField = { sd: 0, nx: 0, ny: 0 };
    const r = Math.min(radius, w / 2, h / 2);
    const bx = w / 2 - r;
    const by = h / 2 - r;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5 - w / 2;
        const py = y + 0.5 - h / 2;
        surfaceField(px, py, bx, by, r, field);
        const depth = -field.sd;
        const d = depth / bezel;
        const inRim = d < 1 && d >= 0;
        const idx = inRim ? Math.min(Math.round(d * (LUT_SIZE - 1)), LUT_SIZE - 1) : 0;
        const mag = inRim ? lut[idx] : 0;
        const i = (y * w + x) * 4;
        data[i] = Math.round(128 - field.nx * mag * 127);
        data[i + 1] = 128;
        data[i + 2] = Math.round(128 - field.ny * mag * 127);
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);

    const specW = fullW;
    const specH = fullH;
    const specR = Math.min(fullRadius, specW / 2, specH / 2);
    const specBx = specW / 2 - specR;
    const specBy = specH / 2 - specR;
    const lightCanvas = document.createElement("canvas");
    const darkCanvas = document.createElement("canvas");
    lightCanvas.width = specW;
    lightCanvas.height = specH;
    darkCanvas.width = specW;
    darkCanvas.height = specH;
    const lightCtx = lightCanvas.getContext("2d");
    const darkCtx = darkCanvas.getContext("2d");
    if (!lightCtx || !darkCtx) return null;
    const lightImage = lightCtx.createImageData(specW, specH);
    const darkImage = darkCtx.createImageData(specW, specH);
    const cosLight = Math.cos(LIGHT_SPREAD);
    const cosDiffuse = Math.cos(DIFFUSE_SPREAD);
    const cosSide = Math.cos(SIDE_SPREAD);
    const reach = 4.5 + fullBezel * 0.15;
    const compose = (
      out: Uint8ClampedArray,
      i: number,
      specAmount: number,
      diffuse: number,
      shadeBase: number,
      specScale: number,
      diffuseScale: number,
      shadeStrength: number,
    ): void => {
      const highlight = sat(specAmount * specScale + diffuse * diffuseScale);
      const shade = shadeBase * shadeStrength;
      const alpha = highlight + shade * (1 - highlight);
      if (alpha <= 0) return;
      const value = Math.min((specScale * highlight) / alpha, 1);
      const v = Math.round(value * 255);
      out[i] = v;
      out[i + 1] = v;
      out[i + 2] = v;
      out[i + 3] = Math.round(Math.min(alpha, 1) * 255);
    };
    for (let y = 0; y < specH; y++) {
      for (let x = 0; x < specW; x++) {
        const px = x + 0.5 - specW / 2;
        const py = y + 0.5 - specH / 2;
        surfaceField(px, py, specBx, specBy, specR, field);
        const sd = field.sd;
        if (sd > 1 || sd < -(reach + 1)) continue;
        const coverage = sat(0.5 - sd);
        const vertical = Math.abs(field.ny);
        const directional = Math.pow(sat((vertical - cosLight) / (1 - cosLight)), 1.25);
        const diffuseDir = Math.pow(sat((vertical - cosDiffuse) / (1 - cosDiffuse)), 1.25);
        const stroke = sat(sd + 1.4) * sat(0.5 - sd);
        let specAmount = directional * stroke;
        specAmount = specAmount / (1 + 0.5 * (1 - specAmount));
        const glow = 1 - sat(-sd / reach);
        const diffuse = diffuseDir * 0.18 * glow * glow * coverage;
        const wL = sat((field.nx - cosSide) / (1 - cosSide)) * stroke;
        const wR = sat((-field.nx - cosSide) / (1 - cosSide)) * stroke;
        const shadeBase = wL / (1 + 0.4 * (1 - wL)) + wR / (1 + 0.4 * (1 - wR));
        const i = (y * specW + x) * 4;
        compose(lightImage.data, i, specAmount, diffuse, shadeBase, 1, 1, 0.48);
        compose(darkImage.data, i, specAmount, diffuse, shadeBase, 0.82, 0.4, 0.6);
      }
    }
    lightCtx.putImageData(lightImage, 0, 0);
    darkCtx.putImageData(darkImage, 0, 0);
    const shot = {
      map: canvas.toDataURL(),
      specular: lightCanvas.toDataURL(),
      specularDark: darkCanvas.toDataURL(),
    };
    imageCache.set(key, shot);
    if (imageCache.size > IMAGE_CACHE_MAX) {
      const oldest = imageCache.keys().next().value;
      if (oldest) imageCache.delete(oldest);
    }
    return shot;
  } catch {
    return null;
  }
}

/** Tone curve from filterRegistry: lift shadows, roll highlights, spare the mids. */
function toneTable(frost: number): string {
  const toneLift = Math.round(180 * (1 - 0.45 * frost)) / 1000;
  const toneRoll = Math.round(140 * (1 - 0.45 * frost)) / 1000;
  const steps = 17;
  const samples: string[] = [];
  for (let i = 0; i < steps; i++) {
    const v = i / (steps - 1);
    const lifted = v + toneLift * (1 - v) ** 3;
    samples.push(String(Math.round((lifted - toneRoll * lifted ** 3) * 1000) / 1000));
  }
  return samples.join(" ");
}

let lensSeq = 0;

function GlassPane({
  kind,
  href,
  focused,
  onFocus,
  onBlur,
  contentStyle,
  children,
}: {
  kind: "tile" | "chip";
  href: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  contentStyle: CSSProperties;
  children: ReactNode;
}): JSX.Element {
  const theme = useGrokTheme();
  const dark = theme.kind === "dark";
  const dial: Dial = kind === "tile" ? TILE_DIAL : CHIP_DIAL;
  const ref = useRef<HTMLAnchorElement | null>(null);
  const idRef = useRef("");
  if (idRef.current.length === 0) {
    lensSeq += 1;
    idRef.current = `billboard-lens-${lensSeq}`;
  }
  const filterId = idRef.current;
  const [shot, setShot] = useState<GlassShot | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let dead = false;
    const paint = (): void => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      if (w < 2 || h < 2) return;
      const radius = dial.radius >= 999 ? Math.min(w, h) / 2 : dial.radius;
      const images = glassImages(w, h, radius, dial.bezel);
      if (!images || dead) return;
      setShot((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h, ...images }));
    };
    paint();
    const observer = new ResizeObserver((): void => {
      paint();
    });
    observer.observe(el);
    return (): void => {
      dead = true;
      observer.disconnect();
    };
  }, [dial]);

  const effectiveBlur = Math.round((dial.blur + dial.frost * 14) * 100) / 100;
  const frostFilter = `blur(${effectiveBlur}px) saturate(${dial.saturation})`;
  const tintOpacity = 0.25 + 0.75 * dial.frost;
  const radius = dial.radius >= 999 ? 999 : dial.radius;
  const tone = toneTable(dial.frost);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        position: "relative",
        isolation: "isolate",
        display: kind === "tile" ? "flex" : "inline-flex",
        width: kind === "tile" ? "100%" : undefined,
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: radius,
        textDecoration: "none",
        color: theme.text.primary,
        boxShadow: dark ? ELEVATED_DARK : ELEVATED_LIGHT,
        outline: focused ? `2px solid ${theme.text.accent}` : FOCUS_NONE,
        outlineOffset: 3,
        ...SQUIRCLE,
      }}
    >
      <div aria-hidden style={{ ...LAYER, overflow: "hidden", borderRadius: radius, ...SQUIRCLE }}>
        <div style={{ ...LAYER, zIndex: 0, backdropFilter: frostFilter, WebkitBackdropFilter: frostFilter, background: CLEAR }} />
        {shot ? (
          <div style={{ ...LAYER, zIndex: 0, backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})`, background: CLEAR }} />
        ) : null}
        <div
          style={{
            ...LAYER,
            zIndex: 1,
            background: dark ? TINT_GRAD_DARK : TINT_GRAD_LIGHT,
            opacity: tintOpacity,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            top: "22%",
            bottom: "16%",
            borderRadius: radius,
            border: CAUSTIC_EDGE,
            filter: "blur(8px)",
            opacity: dark ? 0.7 : 0.28,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {shot ? (
          <div
            style={{
              ...LAYER,
              zIndex: 2,
              backgroundImage: `url("${dark ? shot.specularDark : shot.specular}")`,
              backgroundSize: "100% 100%",
              opacity: dial.specular,
            }}
          />
        ) : null}
        <div style={{ ...LAYER, zIndex: 2, boxShadow: dark ? SHINE_DARK : SHINE_LIGHT }} />
        <div
          style={{
            ...LAYER,
            zIndex: 2,
            background: SHEEN,
            mixBlendMode: "screen",
            filter: "blur(4px)",
            opacity: dark ? 0.92 : 0.45,
          }}
        />
        {shot ? (
          <svg aria-hidden width={0} height={0} style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={shot.w}
              height={shot.h}
              colorInterpolationFilters="sRGB"
            >
              <feImage href={shot.map} xlinkHref={shot.map} x={0} y={0} width={shot.w} height={shot.h} preserveAspectRatio="none" result="map" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale={dial.refraction} xChannelSelector="R" yChannelSelector="B" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues={tone} />
                <feFuncG type="table" tableValues={tone} />
                <feFuncB type="table" tableValues={tone} />
              </feComponentTransfer>
            </filter>
          </svg>
        ) : null}
      </div>
      <div style={{ position: "relative", zIndex: 3, boxSizing: "border-box", minWidth: 0, ...contentStyle }}>{children}</div>
    </a>
  );
}

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function useFocusRing(): { focused: boolean; onFocus: () => void; onBlur: () => void } {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    onFocus: (): void => setFocused(true),
    onBlur: (): void => setFocused(false),
  };
}

function iconWell(size: number, radius: number, theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: radius,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    background: theme.fill.secondary,
    boxShadow: dark ? ICON_RING_DARK : ICON_RING_LIGHT,
  };
}

function avatarRing(theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    flex: `0 0 ${AVATAR_SIZE}px`,
    borderRadius: 9999,
    overflow: "hidden",
    boxShadow: dark ? AVATAR_RING_DARK : AVATAR_RING_LIGHT,
  };
}

/**
 * What the lens looks at. Port of PlayerBackdrop: soft blooms for colour,
 * 1px rules and a hard-edged diagonal band for evidence, a bottom scrim
 * for type. Neutral ink only — no accent tile wash.
 */
function Stage(): JSX.Element {
  const theme = useGrokTheme();
  const dark = theme.kind === "dark";
  const ruleA = dark ? RULE_W50 : RULE_K50;
  const ruleB = dark ? RULE_W30 : RULE_K30;
  const ruleC = dark ? RULE_W40 : RULE_K40;
  const ruleD = dark ? RULE_W25 : RULE_K22;
  const band = dark ? BAND_DARK : BAND_LIGHT;
  const hair = (top: string, left: string, length: "h" | "v"): CSSProperties =>
    length === "h"
      ? { position: "absolute", left: 0, right: 0, top, height: 1, pointerEvents: "none" }
      : { position: "absolute", top: 0, bottom: 0, left, width: 1, pointerEvents: "none" };
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "-12%",
          top: "-18%",
          width: "78%",
          height: "52%",
          borderRadius: "50%",
          background: theme.text.primary,
          filter: "blur(90px)",
          opacity: dark ? 0.2 : 0.34,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-18%",
          top: "22%",
          width: "70%",
          height: "46%",
          borderRadius: "50%",
          background: theme.text.secondary,
          filter: "blur(100px)",
          opacity: dark ? 0.34 : 0.22,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "8%",
          bottom: "-20%",
          width: "84%",
          height: "48%",
          borderRadius: "50%",
          background: theme.text.primary,
          filter: "blur(110px)",
          opacity: dark ? 0.16 : 0.2,
          pointerEvents: "none",
        }}
      />
      <div style={{ ...hair("18%", "0", "h"), background: ruleB }} />
      <div style={{ ...hair("38%", "0", "h"), background: ruleA }} />
      <div style={{ ...hair("62%", "0", "h"), background: ruleB }} />
      <div style={{ ...hair("82%", "0", "h"), background: ruleD }} />
      <div style={{ ...hair("0", "22%", "v"), background: ruleC }} />
      <div style={{ ...hair("0", "48%", "v"), background: ruleD }} />
      <div style={{ ...hair("0", "70%", "v"), background: ruleC }} />
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "28%",
          width: "130%",
          height: 1,
          background: ruleA,
          transform: "rotate(-14deg)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "70%",
          width: "130%",
          height: 1,
          background: ruleC,
          transform: "rotate(11deg)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "10%",
          height: 96,
          background: band,
          opacity: dark ? 0.42 : 0.28,
          transform: "rotate(-6deg)",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "48%",
          height: 72,
          background: band,
          opacity: dark ? 0.34 : 0.22,
          transform: "rotate(7deg)",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: dark ? SCRIM_DARK : SCRIM_LIGHT, pointerEvents: "none" }} />
    </div>
  );
}

function pageStyle(theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
  };
}

function bandStyle(): CSSProperties {
  return {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(24px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(28px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 22,
    minWidth: 0,
  };
}

function Arrow({ color }: { color: string }): JSX.Element {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M4 9h10M10 5l4 4-4 4"
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NARROW_TILE = 400;

function useNarrowTile(): { narrow: boolean; ref: (node: HTMLDivElement | null) => void } {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [narrow, setNarrow] = useState(true);
  useEffect(() => {
    if (!node) return;
    const measure = (): void => {
      setNarrow(node.clientWidth < NARROW_TILE);
    };
    measure();
    const observer = new ResizeObserver((): void => {
      measure();
    });
    observer.observe(node);
    return (): void => {
      observer.disconnect();
    };
  }, [node]);
  return { narrow, ref: setNode };
}

const FORE: CSSProperties = { position: "relative", zIndex: 1, minWidth: 0 };

function InstallTile({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const pane = useNarrowTile();
  const ring = useFocusRing();
  const dark = theme.kind === "dark";
  const label = theme.text.onColor;
  return (
    <div ref={pane.ref} style={{ width: "100%", minWidth: 0 }}>
      <GlassPane
        kind="tile"
        href={bot.href}
        focused={ring.focused}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        contentStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 14,
          width: "100%",
          padding: 18,
        }}
        children={[
          <div key="row" style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
            <div style={iconWell(64, 16, theme)}>
              <Image src={bot.src} alt={`${bot.name} icon`} width={64} height={64} fit="cover" />
            </div>
            <p
              style={{
                ...theme.font.heading1,
                ...FORE,
                color: theme.text.primary,
                fontSize: "clamp(32px, 9vw, 48px)",
                lineHeight: 0.88,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                textTransform: "uppercase",
                textShadow: dark ? STAMP_TITLE_DARK : STAMP_TITLE_LIGHT,
                margin: 0,
                flex: "1 1 auto",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {bot.name}
            </p>
          </div>,
          <p
            key="desc"
            style={{
              ...theme.font.body1,
              ...FORE,
              color: theme.text.primary,
              fontSize: 17,
              lineHeight: 1.35,
              fontWeight: theme.weight.medium,
              letterSpacing: "0",
              textTransform: "none",
              textShadow: dark ? LEGIBLE_DARK : LEGIBLE_LIGHT,
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {bot.desc}
          </p>,
          <span
            key="install"
            style={{
              ...theme.font.subtext,
              ...FORE,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              alignSelf: pane.narrow ? "stretch" : "flex-end",
              width: pane.narrow ? "100%" : "auto",
              minWidth: pane.narrow ? 0 : 200,
              minHeight: 48,
              boxSizing: "border-box",
              padding: "0 22px",
              borderRadius: 999,
              backgroundColor: theme.fill.accent,
              color: label,
              boxShadow: PILL_LIP,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "52%",
                pointerEvents: "none",
                background: PILL_GLOSS,
              }}
            />
            <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Install
              <Arrow color={label} />
            </span>
          </span>,
        ]}
      />
    </div>
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const ring = useFocusRing();
  const dark = theme.kind === "dark";
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  return (
    <GlassPane
      kind="chip"
      href={link.href}
      focused={ring.focused}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      contentStyle={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        maxWidth: "100%",
        padding: "0 14px",
        ...theme.font.subtext,
        color: theme.text.primary,
      }}
      children={[
        <span key="label" style={{ ...FORE, fontWeight: theme.weight.semibold, overflowWrap: "anywhere" }}>
          {link.label}
        </span>,
        showDisplay ? (
          <span key="display" style={{ ...FORE, color: theme.text.secondary, textShadow: dark ? LEGIBLE_DARK : LEGIBLE_LIGHT, overflowWrap: "anywhere" }}>
            {link.display}
          </span>
        ) : null,
      ]}
    />
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const dark = theme.kind === "dark";
  return (
    <div id={LAYOUT} style={pageStyle(theme)}>
      <Stage />
      <div style={bandStyle()}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 8,
            width: "100%",
            minWidth: 0,
          }}
        >
          <div style={avatarRing(theme)}>
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={AVATAR_SIZE} height={AVATAR_SIZE} fit="cover" />
          </div>
          <h1
            style={{
              fontFamily: theme.font.family,
              color: theme.text.primary,
              fontSize: "clamp(72px, 20vw, 108px)",
              lineHeight: 0.8,
              fontWeight: 800,
              letterSpacing: "-0.065em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
              textShadow: dark ? STAMP_NAME_DARK : STAMP_NAME_LIGHT,
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p
              style={{
                fontFamily: theme.font.family,
                color: theme.text.secondary,
                fontSize: 20,
                lineHeight: 1.25,
                fontWeight: theme.weight.semibold,
                letterSpacing: "0.01em",
                textAlign: "center",
                textShadow: dark ? LEGIBLE_DARK : LEGIBLE_LIGHT,
                margin: 0,
                width: "100%",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {handle}
            </p>
          ) : null}
          <p
            style={{
              fontFamily: theme.font.family,
              color: theme.text.primary,
              fontSize: 17,
              lineHeight: 1.4,
              fontWeight: theme.weight.medium,
              letterSpacing: "0",
              textTransform: "none",
              textAlign: "center",
              textShadow: dark ? LEGIBLE_DARK : LEGIBLE_LIGHT,
              margin: "4px 0 0",
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {BIO}
          </p>
        </header>

        {bots.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", minWidth: 0 }}>
            {bots.map((bot, index) => (
              <InstallTile key={`${bot.href}-${index}`} bot={bot} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, width: "100%", minWidth: 0 }}>
            {links.map((link, index) => (
              <MiniLink key={`${link.href}-${index}`} link={link} />
            ))}
          </nav>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            color: theme.text.secondary,
            fontWeight: theme.weight.semibold,
            letterSpacing: "0.08em",
            textTransform: "none",
            textAlign: "center",
            margin: "8px 0 0",
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {FOOTER}
        </p>
      </div>
    </div>
  );
}
