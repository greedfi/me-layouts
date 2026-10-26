import { useGrokTheme, Image, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "grok/canvas";

/**
 * Pinned .me pack — billboard.
 * Link-tree column: avatar, name, handle, bio, full-width Install tiles, link chips, footer.
 * Header is those four fields only — no pack wordmark, no kicker.
 * Tiles and chips are a liqui lens (displacement + frost + specular + tint).
 * Avatar and icons stay solid. The whole tile is the install link.
 * A trailing emoji run on the display name sits beside the hero at half size.
 * Long names, dense chips, and blank fields stay inside the column for any owner.
 * Type is one see-through face: silver at 0.82 on night and dark, graphite at
 * 0.82 on day, plus the now-playing legibility shadow. The field still shows
 * through the strokes. Same face for the hero, the handle, the bio, tile titles,
 * descriptions, chips, and the footer. No forced uppercase, no wide tracking.
 * The display name is those letterforms only — no pane, tile, or pill behind it.
 * Weight and size carry the hierarchy: name, then handle, then bio.
 * Tiles and chips lift, wash, and press. The rim is one rounded rect: a soft
 * specular lip and a milky body, not a second corner stroke.
 * The stage is an animated lumen field: slow blooms and a drifting sheen.
 * The glass edge comes from blooms, diagonal bands, and the scrim. Graphite blooms stay neutral.
 * Color is muted blooms under the same glass, not the loud liquid ribbons, not lacquer.
 * APPEARANCE is night, dark, or day (unset follows the viewer; a dark viewer
 * stays on the charcoal field). STAGE is graphite or color (unset stays graphite).
 * Night is a deeper, cooler field.
 * ACCENT is silver, rose, sage, violet, amber, or teal (unset stays silver).
 * Silver keeps the current focus ring, hover wash, and chip tint.
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
/** Owner appearance: night, dark, or day. light aliases day. Unset follows the viewer. */
const APPEARANCE = "__APPEARANCE__";
/** Stage palette: graphite or color. colour aliases color. Unset stays graphite. */
const STAGE = "__STAGE__";
/** Owner accent: silver, rose, sage, violet, amber, or teal. Unset stays silver. */
const ACCENT = "__ACCENT__";

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

// Filler replaces this whole array (0–N). Two examples so an unfilled preview
// shows a stack. Same keys: __BOTn_NAME__, __BOTn_DESC__, __BOTn_ICON__, __BOTn_HREF__.
const bots: readonly Bot[] = [
  {
    name: "__BOT0_NAME__",
    desc: "__BOT0_DESC__",
    src: "__BOT0_ICON__",
    href: "__BOT0_HREF__",
  },
  {
    name: "__BOT1_NAME__",
    desc: "__BOT1_DESC__",
    src: "__BOT1_ICON__",
    href: "__BOT1_HREF__",
  },
];

// Filler replaces this whole array (0–N). Five slots stand in for a new owner:
// X, GitHub, site, YouTube, LinkedIn. Same keys: __LINKn_LABEL__, __LINKn_HREF__, __LINKn_DISPLAY__.
const links: readonly Link[] = [
  {
    label: "__LINK0_LABEL__",
    href: "__LINK0_HREF__",
    display: "__LINK0_DISPLAY__",
  },
  {
    label: "__LINK1_LABEL__",
    href: "__LINK1_HREF__",
    display: "__LINK1_DISPLAY__",
  },
  {
    label: "__LINK2_LABEL__",
    href: "__LINK2_HREF__",
    display: "__LINK2_DISPLAY__",
  },
  {
    label: "__LINK3_LABEL__",
    href: "__LINK3_HREF__",
    display: "__LINK3_DISPLAY__",
  },
  {
    label: "__LINK4_LABEL__",
    href: "__LINK4_HREF__",
    display: "__LINK4_DISPLAY__",
  },
];

export const LAYOUT = "billboard" as const;

const AVATAR_SIZE = 60;

/**
 * Plate = NowPlaying PLATE_GLASS. Chip = button BUTTON_GLASS.
 * frost/specular/saturation are the theme dials (Graphite/Noir, a step
 * above the shipped 0.35 / 0.7 so the rim and the tint actually read).
 */
/**
 * Bezel stays inside the corner radius. A bezel wider than the radius cusps
 * the rim and reads as a stepped second corner.
 */
const TILE_DIAL = { blur: 1, refraction: 110, bezel: 15, radius: 20, frost: 0.58, saturation: 1.75, specular: 0.95 };
const CHIP_DIAL = { blur: 1, refraction: 52, bezel: 13, radius: 999, frost: 0.5, saturation: 1.7, specular: 0.88 };

/**
 * Top-lit volume. White milk at the crown, a clearer mid, a darker foot.
 * A flat grey slab reads as glassmorphism; this lets the stage bend through.
 */
const TINT_GRAD_DARK = "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(36,38,48,0.18) 38%, rgba(8,10,16,0.50) 100%)";
const TINT_GRAD_LIGHT = "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.26) 42%, rgba(255,255,255,0.12) 100%)";
const MILK_DARK = "radial-gradient(92% 78% at 50% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 44%, rgba(255,255,255,0) 72%)";
const MILK_LIGHT = "radial-gradient(92% 78% at 50% 0%, rgba(255,255,255,0.72), rgba(255,255,255,0.16) 46%, rgba(255,255,255,0) 74%)";
const CLEAR = "rgba(0,0,0,0)";
const WHITE = "rgba(255,255,255,1)";
/** Faint liqui highlight wash. White at 13% sits in the asked 10–15% band. */
const HOVER_WASH = `color-mix(in srgb, ${WHITE} 13%, ${CLEAR})`;

/**
 * Concentric falloff only. A 1px ring doubles the baked specular, and an
 * offset inset draws a second arc at the corner. The lip lives in the map.
 */
const SHINE_DARK = "inset 0 0 28px rgba(255,255,255,0.12)";
const SHINE_LIGHT = "inset 0 0 20px rgba(255,255,255,0.42)";
const ELEVATED_DARK = "0 28px 64px rgba(0,0,5,0.62), 0 4px 14px rgba(0,0,5,0.38)";
const ELEVATED_LIGHT = "0 24px 60px rgba(16,16,20,0.28), 0 4px 14px rgba(16,16,20,0.14)";
const ELEVATED_HOVER_DARK = "0 40px 78px rgba(0,0,5,0.76), 0 14px 28px rgba(0,0,5,0.5)";
const ELEVATED_HOVER_LIGHT = "0 34px 70px rgba(16,16,20,0.36), 0 12px 24px rgba(16,16,20,0.2)";
const SHEEN =
  "linear-gradient(118deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0) 48%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.26) 100%)";
const SHEEN_BLUR = "blur(5px)";
const AVATAR_RING_DARK = "0 0 0 2px rgba(255,255,255,0.88), 0 10px 24px rgba(0,0,0,0.45)";
const AVATAR_RING_LIGHT = "0 0 0 2px rgba(16,16,20,0.88), 0 10px 24px rgba(16,16,20,0.16)";
const ICON_RING_DARK = "inset 0 0 0 1px rgba(255,255,255,0.28)";
const ICON_RING_LIGHT = "inset 0 0 0 1px rgba(16,16,20,0.16)";

const BAND_DARK = "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.92), rgba(255,255,255,0))";
const BAND_LIGHT = "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.55), rgba(0,0,0,0))";
const SCRIM_DARK = "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0) 38%, rgba(0,0,0,0.45))";
const SCRIM_LIGHT = "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0) 40%, rgba(16,16,24,0.16))";
const SCRIM_NIGHT = "linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0) 40%, rgba(0,0,0,0.55))";
const SCRIM_COLOR_DARK = "linear-gradient(180deg, rgba(0,0,0,0.46), rgba(0,0,0,0) 28%, rgba(0,0,0,0.50))";
const SCRIM_COLOR_LIGHT = "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 30%, rgba(255,255,255,0.50))";
/** Deeper than the charcoal field. The cool cast is the veil, not an accent wash. */
const NIGHT_FIELD = "#000000";
/** Charcoal used when dark is forced on a light host. */
const DARK_FIELD = "#141418";
/** Paper used when day is forced on a dark host. */
const DAY_FIELD = "#f4f5f7";
const NIGHT_BLOOM = "rgba(198, 214, 228, 1)";
const NIGHT_BLOOM_DIM = "rgba(154, 172, 190, 1)";
const NIGHT_VEIL = "radial-gradient(90% 52% at 50% -8%, rgba(92, 112, 132, 0.22), rgba(2, 3, 8, 0) 62%)";
const FORCED_WELL_DARK = "rgba(255,255,255,0.10)";
const FORCED_WELL_LIGHT = "rgba(18,18,20,0.06)";
const FORCED_DIM_DARK = "rgba(186, 190, 198, 1)";
const FORCED_DIM_LIGHT = "rgba(70, 72, 78, 1)";
/** Muted stage hues. Never theme.accent, never tile lacquer. */
const COLOR_NIGHT = ["rgba(168, 120, 188, 1)", "rgba(90, 140, 168, 1)", "rgba(176, 96, 120, 1)", "rgba(140, 160, 184, 1)"] as const;
const COLOR_DARK = ["rgba(186, 110, 140, 1)", "rgba(110, 156, 120, 1)", "rgba(170, 120, 110, 1)", "rgba(130, 140, 176, 1)"] as const;
const COLOR_DAY = ["rgba(232, 150, 168, 1)", "rgba(140, 190, 150, 1)", "rgba(176, 160, 214, 1)", "rgba(150, 186, 204, 1)"] as const;
const COLOR_NIGHT_OPACITY = [0.55, 0.46, 0.4, 0.28] as const;
const COLOR_DARK_OPACITY = [0.62, 0.5, 0.44, 0.3] as const;
const COLOR_DAY_OPACITY = [0.55, 0.48, 0.42, 0.32] as const;
/** now-playing micro labels: 0 1px 3px rgba(0,0,0,0.45). Light is the inverted lift. */
const SOFT_SHADOW_DARK = "0 1px 3px rgba(0,0,0,0.45)";
const SOFT_SHADOW_LIGHT = "0 1px 2px rgba(255,255,255,0.78)";
/**
 * Conic button hover moves the label shadow onto a slight diagonal
 * (0.025em 0.025em 0.025em). Same shift, kept strong enough to read on glass.
 */
const SOFT_SHADOW_HOVER_DARK = "0.025em 0.025em 0.05em rgba(0,0,0,0.55)";
const SOFT_SHADOW_HOVER_LIGHT = "0.025em 0.025em 0.04em rgba(255,255,255,0.9)";
/** Focus ring. Silver uses silver on dark and graphite on light. Never the host accent. */
const SILVER = "#f4f5f7";
const GRAPHITE = "#121214";
/**
 * One see-through ink. 0.82 of silver on night/dark, 0.82 of graphite on day.
 * 0.55 went ghost-faint on graphite; opaque theme.text.primary stamps the glass.
 * The same mix is the hero, the handle, the bio, tiles, chips, and the footer.
 */
const SEE_MIX = "82%";
const SEE_DARK = `color-mix(in srgb, ${SILVER} ${SEE_MIX}, ${CLEAR})`;
const SEE_DAY = `color-mix(in srgb, ${GRAPHITE} ${SEE_MIX}, ${CLEAR})`;
const FOCUS_NONE = "none";
type AccentName = "silver" | "rose" | "sage" | "violet" | "amber" | "teal";
/**
 * Named accents only. Pale on dark glass, deep on day paper.
 * Silver is not here — it keeps SILVER / GRAPHITE and the current washes.
 */
const ACCENT_FOCUS = {
  rose: { dark: "#e8cfd4", light: "#73424c" },
  sage: { dark: "#d0dccf", light: "#3c5142" },
  violet: { dark: "#d8d0e6", light: "#4a3f64" },
  amber: { dark: "#e8d8b8", light: "#6a5230" },
  teal: { dark: "#c5e4e6", light: "#2f5960" },
} as const;
/** Chip tint in the same opacity band as TINT_GRAD. Silver keeps that gradient. */
const ACCENT_CHIP = {
  rose: { dark: "rgba(92, 48, 58, 0.70)", light: "rgba(255, 228, 232, 0.62)" },
  sage: { dark: "rgba(44, 62, 50, 0.70)", light: "rgba(228, 240, 230, 0.62)" },
  violet: { dark: "rgba(58, 48, 82, 0.70)", light: "rgba(236, 230, 248, 0.62)" },
  amber: { dark: "rgba(82, 62, 36, 0.70)", light: "rgba(248, 236, 214, 0.62)" },
  teal: { dark: "rgba(36, 70, 76, 0.70)", light: "rgba(214, 240, 242, 0.62)" },
} as const;
/** liqui button: transition-[transform,box-shadow] duration-150. */
const MOTION = "150ms ease";

const LAYER: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  pointerEvents: "none",
};

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

/**
 * Rounded-rect outline SDF. The corner arc matches CSS border-radius.
 * A squircle plan against that radius left a second curve at the corner.
 */
function surfaceField(px: number, py: number, bx: number, by: number, r: number, out: SurfaceField): void {
  const qx = Math.abs(px) - bx;
  const qy = Math.abs(py) - by;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  out.sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(qx, qy) || 1;
    out.nx = (Math.sign(px) * qx) / len;
    out.ny = (Math.sign(py) * qy) / len;
  } else if (qx > qy) {
    out.nx = Math.sign(px);
    out.ny = 0;
  } else {
    out.nx = 0;
    out.ny = Math.sign(py);
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
    // Stay inside the corner. A bezel past the radius pinches a second edge.
    const safeBezel = Math.min(fullBezel, Math.max(1, fullRadius * 0.85));
    const bezel = Math.max(1, safeBezel * scale);
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
    // Highlight feathers inward across the bezel on this same outline.
    // No second dark stroke — that read as a stepped rim.
    const lip = Math.max(8, safeBezel * 0.8);
    const reach = 7 + safeBezel * 0.4;
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
        const coverage = sat(0.55 - sd);
        const vertical = Math.abs(field.ny);
        const directional = Math.pow(sat((vertical - cosLight) / (1 - cosLight)), 1.15);
        const diffuseDir = Math.pow(sat((vertical - cosDiffuse) / (1 - cosDiffuse)), 1.15);
        const into = sat(-sd / lip);
        // One lip. A dark hairline beside this feather reads as a second stroke.
        const feather = sat(0.65 - sd) * Math.pow(1 - into, 1.7);
        let specAmount = directional * feather;
        specAmount = specAmount / (1 + 0.35 * (1 - specAmount));
        const glow = 1 - sat(-sd / reach);
        const diffuse = diffuseDir * 0.34 * glow * glow * coverage;
        const i = (y * specW + x) * 4;
        compose(lightImage.data, i, specAmount, diffuse, 0, 1, 0.9, 0);
        compose(darkImage.data, i, specAmount, diffuse, 0, 0.92, 0.42, 0);
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
  const look = useBillboardLook();
  const dark = look.dark;
  const dial: Dial = kind === "tile" ? TILE_DIAL : CHIP_DIAL;
  const ref = useRef<HTMLAnchorElement | null>(null);
  const idRef = useRef("");
  if (idRef.current.length === 0) {
    lensSeq += 1;
    idRef.current = `billboard-lens-${lensSeq}`;
  }
  const filterId = idRef.current;
  const [shot, setShot] = useState<GlassShot | null>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

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
  const clip = `inset(0 round ${radius}px)`;
  const lift = kind === "tile" ? "-3px" : "-2px";
  const transform = pressed ? "translateY(0) scale(0.97)" : hovered ? `translateY(${lift}) scale(1)` : "translateY(0) scale(1)";
  const inkShadow = hovered ? (dark ? SOFT_SHADOW_HOVER_DARK : SOFT_SHADOW_HOVER_LIGHT) : dark ? SOFT_SHADOW_DARK : SOFT_SHADOW_LIGHT;
  const hotVars = {
    "--bb-ink-shadow": inkShadow,
  } as CSSProperties;
  const destination = href.trim();

  return (
    <a
      ref={ref}
      href={destination.length > 0 ? destination : undefined}
      target={destination.length > 0 ? "_blank" : undefined}
      rel={destination.length > 0 ? "noreferrer" : undefined}
      onFocus={onFocus}
      onBlur={(): void => {
        setPressed(false);
        onBlur();
      }}
      onMouseEnter={(): void => setHovered(true)}
      onMouseLeave={(): void => setHovered(false)}
      onPointerDown={(event: PointerEvent<HTMLAnchorElement>): void => {
        setPressed(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event: PointerEvent<HTMLAnchorElement>): void => {
        setPressed(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(): void => setPressed(false)}
      style={{
        position: "relative",
        isolation: "isolate",
        display: kind === "tile" ? "flex" : "inline-flex",
        width: kind === "tile" ? "100%" : undefined,
        flex: kind === "chip" ? "0 1 auto" : undefined,
        alignSelf: kind === "chip" ? "center" : undefined,
        overflow: kind === "chip" ? "hidden" : undefined,
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: radius,
        textDecoration: "none",
        color: look.ink,
        cursor: "pointer",
        transform,
        transformOrigin: "center",
        transition: `transform ${MOTION}, box-shadow ${MOTION}`,
        boxShadow: hovered && !pressed ? (dark ? ELEVATED_HOVER_DARK : ELEVATED_HOVER_LIGHT) : dark ? ELEVATED_DARK : ELEVATED_LIGHT,
        WebkitTapHighlightColor: CLEAR,
        outline: focused ? `2px solid ${look.accentFocus}` : FOCUS_NONE,
        outlineOffset: 3,
        ...hotVars,
      }}
    >
      <div aria-hidden style={{ ...LAYER, overflow: "hidden", borderRadius: radius, clipPath: clip }}>
        <div style={{ ...LAYER, zIndex: 0, backdropFilter: frostFilter, WebkitBackdropFilter: frostFilter, background: CLEAR }} />
        {shot ? (
          <div style={{ ...LAYER, zIndex: 0, backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})`, background: CLEAR }} />
        ) : null}
        <div
          style={{
            ...LAYER,
            zIndex: 1,
            background: kind === "chip" ? look.accentChip : dark ? TINT_GRAD_DARK : TINT_GRAD_LIGHT,
            opacity: tintOpacity,
          }}
        />
        <div style={{ ...LAYER, zIndex: 1, background: dark ? MILK_DARK : MILK_LIGHT }} />
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
            filter: SHEEN_BLUR,
            opacity: dark ? 0.72 : 0.4,
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
      <div aria-hidden style={{ ...LAYER, zIndex: 3, background: look.accentWash, opacity: hovered ? 1 : 0, transition: `opacity ${MOTION}` }} />
      <div style={{ position: "relative", zIndex: 4, boxSizing: "border-box", minWidth: 0, ...contentStyle }}>{children}</div>
    </a>
  );
}

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed === "@") return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function filled(raw: string): string {
  return raw.trim();
}

/**
 * One emoji cluster: a flag, a keycap, or a pictograph with optional
 * variation selector, skin tone, flag tags, and ZWJ continuations.
 */
const EMOJI_CLUSTER =
  "(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?\\p{Emoji_Modifier}?(?:[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?\\p{Emoji_Modifier}?(?:[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*)";
const TRAILING_EMOJI = new RegExp(`(?:\\s*${EMOJI_CLUSTER})+\\s*$`, "u");

function emojiClusters(run: string): string[] {
  return run.match(new RegExp(EMOJI_CLUSTER, "gu")) ?? [];
}

/**
 * Split a trailing emoji run off a display name. Each cluster is its own
 * inline box so a long name can still wrap, and a ZWJ sequence stays intact.
 * No trailing emoji returns an empty cluster list — the hero renders text only.
 */
function splitTrailingEmoji(raw: string): { text: string; clusters: readonly string[] } {
  const match = TRAILING_EMOJI.exec(raw);
  if (!match) return { text: raw.trim(), clusters: [] };
  const clusters = emojiClusters(match[0]);
  if (clusters.length === 0) return { text: raw.trim(), clusters: [] };
  return { text: raw.slice(0, match.index).trim(), clusters };
}

/** Half the hero. A lead margin of 0.32em of this glyph is ~0.16em of the h1. */
const HERO_EMOJI: CSSProperties = {
  display: "inline-block",
  fontSize: "0.5em",
  lineHeight: 1,
  verticalAlign: "middle",
  letterSpacing: "0",
  whiteSpace: "nowrap",
  textTransform: "none",
  maxWidth: "100%",
};

function heroEmojiStyle(index: number, hasText: boolean, color: string): CSSProperties {
  const marginLeft = index === 0 ? (hasText ? "0.32em" : "0") : "0.16em";
  return { ...HERO_EMOJI, marginLeft, color };
}

type Appearance = "night" | "dark" | "day";
type StageMood = "graphite" | "color";

type BillboardLook = {
  theme: ReturnType<typeof useGrokTheme>;
  appearance: Appearance;
  stage: StageMood;
  /** Night and dark share the dark glass stack. Day uses the light stack. */
  dark: boolean;
  ink: string;
  bg: string;
  well: string;
  accentFocus: string;
  accentWash: string;
  accentChip: string;
};

function resolveAppearance(raw: string, host: "light" | "dark"): Appearance {
  const value = raw.trim().toLowerCase();
  if (value === "night") return "night";
  if (value === "dark") return "dark";
  if (value === "day" || value === "light") return "day";
  return host === "light" ? "day" : "dark";
}

function resolveStage(raw: string): StageMood {
  const value = raw.trim().toLowerCase();
  if (value === "color" || value === "colour") return "color";
  return "graphite";
}

function resolveAccent(raw: string): AccentName {
  const value = raw.trim().toLowerCase();
  if (value === "rose" || value === "sage" || value === "violet" || value === "amber" || value === "teal") return value;
  return "silver";
}

/** Silver returns the shipped ring, wash, and chip tint. Other names swap those three. */
function accentSpots(name: AccentName, dark: boolean): { focus: string; wash: string; chip: string } {
  if (name === "silver") {
    return {
      focus: dark ? SILVER : GRAPHITE,
      wash: HOVER_WASH,
      chip: dark ? TINT_GRAD_DARK : TINT_GRAD_LIGHT,
    };
  }
  const side = dark ? "dark" : "light";
  const focus = ACCENT_FOCUS[name][side];
  return {
    focus,
    wash: `color-mix(in srgb, ${focus} 13%, ${CLEAR})`,
    chip: ACCENT_CHIP[name][side],
  };
}

/**
 * Fill tokens win when they name a mode. Anything else, including an
 * unreplaced token, follows the viewer, stays on graphite, and stays silver —
 * so a page that never set these still looks like the shipped charcoal field.
 */
function useBillboardLook(): BillboardLook {
  const theme = useGrokTheme();
  const appearance = resolveAppearance(APPEARANCE, theme.kind);
  const stage = resolveStage(STAGE);
  const dark = appearance !== "day";
  const hostDark = theme.kind === "dark";
  const matched = dark === hostDark;
  // See-through body ink. theme.text.primary stays near-black in both kinds and stamps the glass.
  const ink = dark ? SEE_DARK : SEE_DAY;
  const bg = appearance === "night" ? NIGHT_FIELD : appearance === "day" ? (hostDark ? DAY_FIELD : theme.bg.base) : hostDark ? theme.bg.base : DARK_FIELD;
  const well = matched ? theme.fill.secondary : dark ? FORCED_WELL_DARK : FORCED_WELL_LIGHT;
  const spots = accentSpots(resolveAccent(ACCENT), dark);
  return {
    theme,
    appearance,
    stage,
    dark,
    ink,
    bg,
    well,
    accentFocus: spots.focus,
    accentWash: spots.wash,
    accentChip: spots.chip,
  };
}

function useFocusRing(): { focused: boolean; onFocus: () => void; onBlur: () => void } {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    onFocus: (): void => setFocused(true),
    onBlur: (): void => setFocused(false),
  };
}

function iconWell(size: number, radius: number, look: BillboardLook): CSSProperties {
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: radius,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    background: look.well,
    boxShadow: look.dark ? ICON_RING_DARK : ICON_RING_LIGHT,
  };
}

function avatarRing(look: BillboardLook): CSSProperties {
  return {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    flex: `0 0 ${AVATAR_SIZE}px`,
    borderRadius: 9999,
    overflow: "hidden",
    background: look.well,
    boxShadow: look.dark ? AVATAR_RING_DARK : AVATAR_RING_LIGHT,
  };
}

type DriftName = "a" | "b" | "c" | "d" | "bandA" | "bandB";

/**
 * Transform only, so the glass displacement maps are not rebuilt each frame.
 * The first keyframe is the resting pose (reduced motion, and the frame
 * before animate() starts). Durations are long on purpose.
 */
const DRIFT_FRAMES: Record<DriftName, [{ transform: string }, { transform: string }]> = {
  a: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(14%, 9%, 0) scale(1.08)" }],
  b: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(-12%, 11%, 0) scale(1.06)" }],
  c: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(10%, -12%, 0) scale(0.94)" }],
  d: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(-8%, -7%, 0) scale(1.1)" }],
  bandA: [{ transform: "rotate(-6deg) translate3d(0%, 0, 0)" }, { transform: "rotate(-6deg) translate3d(8%, 0, 0)" }],
  bandB: [{ transform: "rotate(7deg) translate3d(0%, 0, 0)" }, { transform: "rotate(7deg) translate3d(-8%, 0, 0)" }],
};

const DRIFT_MS: Record<DriftName, number> = {
  a: 18000,
  b: 24000,
  c: 21000,
  d: 28000,
  bandA: 16000,
  bandB: 22000,
};

function ensureDriftCss(): void {
  if (typeof document === "undefined" || !document.head) return;
  if (document.getElementById("billboard-drift")) return;
  const style = document.createElement("style");
  style.id = "billboard-drift";
  const names = Object.keys(DRIFT_FRAMES) as DriftName[];
  const body = names
    .map((name) => {
      const [from, to] = DRIFT_FRAMES[name];
      return `@keyframes bb-drift-${name}{from{transform:${from.transform}}to{transform:${to.transform}}}`;
    })
    .join("");
  style.textContent = `${body}@media (prefers-reduced-motion:reduce){[data-bb-drift]{animation:none!important}}`;
  document.head.appendChild(style);
}

/**
 * Slow drift via the Web Animations API so React does not re-render the
 * glass. A stylesheet is the fallback when animate() is missing.
 */
function Drift({ name, style, children }: { name: DriftName; style: CSSProperties; children?: ReactNode }): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce =
      typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const frames = DRIFT_FRAMES[name];
    const duration = DRIFT_MS[name];
    if (typeof node.animate === "function") {
      const anim = node.animate(frames, {
        duration,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
        fill: "both",
      });
      return (): void => {
        anim.cancel();
      };
    }
    ensureDriftCss();
    node.style.animation = `bb-drift-${name} ${duration}ms ease-in-out infinite alternate`;
    return (): void => {
      node.style.animation = "";
    };
  }, [name]);
  return (
    <div ref={ref} data-bb-drift={name} style={style}>
      {children}
    </div>
  );
}

type BloomSpec = {
  key: string;
  drift: DriftName;
  color: string;
  opacity: number;
  blur: number;
  box: CSSProperties;
};

const BLOOM_BOX: readonly CSSProperties[] = [
  { left: "-12%", top: "-18%", width: "78%", height: "52%" },
  { right: "-18%", top: "22%", width: "70%", height: "46%" },
  { left: "8%", bottom: "-20%", width: "84%", height: "48%" },
  { left: "28%", top: "34%", width: "50%", height: "38%" },
];
const BLOOM_BLUR = [90, 100, 110, 80] as const;
const BLOOM_DRIFT: readonly DriftName[] = ["a", "b", "c", "d"];

function stageBlooms(look: BillboardLook): BloomSpec[] {
  if (look.stage === "color") {
    const palette = look.appearance === "night" ? COLOR_NIGHT : look.appearance === "day" ? COLOR_DAY : COLOR_DARK;
    const opacity = look.appearance === "night" ? COLOR_NIGHT_OPACITY : look.appearance === "day" ? COLOR_DAY_OPACITY : COLOR_DARK_OPACITY;
    return palette.map((color, index) => ({
      key: `color-${index}`,
      drift: BLOOM_DRIFT[index],
      color,
      opacity: opacity[index],
      blur: BLOOM_BLUR[index],
      box: BLOOM_BOX[index],
    }));
  }
  const opacity = look.appearance === "night" ? ([0.18, 0.28, 0.12] as const) : look.appearance === "day" ? ([0.34, 0.22, 0.2] as const) : ([0.2, 0.34, 0.16] as const);
  const hostDark = look.theme.kind === "dark";
  let primary = look.theme.text.primary;
  let secondary = look.theme.text.secondary;
  if (look.appearance === "night") {
    primary = NIGHT_BLOOM;
    secondary = NIGHT_BLOOM_DIM;
  } else if (look.dark !== hostDark) {
    primary = look.dark ? SILVER : GRAPHITE;
    secondary = look.dark ? FORCED_DIM_DARK : FORCED_DIM_LIGHT;
  }
  const colors = [primary, secondary, primary];
  return colors.map((color, index) => ({
    key: `graphite-${index}`,
    drift: BLOOM_DRIFT[index],
    color,
    opacity: opacity[index],
    blur: BLOOM_BLUR[index],
    box: BLOOM_BOX[index],
  }));
}

const STAGE_FRAME: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  overflow: "hidden",
};

/**
 * Lumen field from before the glossy color pass. Soft blooms and drifting
 * sheen bands. Graphite blooms stay neutral ink. Color mode swaps in muted
 * hues. No hairline grid — the edge comes from the blooms, the bands, and the scrim.
 */
function Stage(): JSX.Element {
  const look = useBillboardLook();
  const dark = look.dark;
  const night = look.appearance === "night";
  const band = dark ? BAND_DARK : BAND_LIGHT;
  const scrim = !dark ? (look.stage === "color" ? SCRIM_COLOR_LIGHT : SCRIM_LIGHT) : look.stage === "color" ? SCRIM_COLOR_DARK : night ? SCRIM_NIGHT : SCRIM_DARK;
  const bandOpacityA = look.stage === "color" ? (dark ? 0.18 : 0.14) : night ? 0.32 : dark ? 0.42 : 0.28;
  const bandOpacityB = look.stage === "color" ? (dark ? 0.12 : 0.1) : night ? 0.24 : dark ? 0.34 : 0.22;
  return (
    <div aria-hidden style={STAGE_FRAME}>
      {night ? <div style={{ position: "absolute", inset: 0, background: NIGHT_VEIL, pointerEvents: "none" }} /> : null}
      {stageBlooms(look).map((bloom) => (
        <Drift
          key={bloom.key}
          name={bloom.drift}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: bloom.color,
            filter: `blur(${bloom.blur}px)`,
            opacity: bloom.opacity,
            pointerEvents: "none",
            ...bloom.box,
          }}
        />
      ))}
      <Drift
        name="bandA"
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "10%",
          height: 96,
          background: band,
          opacity: bandOpacityA,
          transform: "rotate(-6deg)",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
      <Drift
        name="bandB"
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          top: "48%",
          height: 72,
          background: band,
          opacity: bandOpacityB,
          transform: "rotate(7deg)",
          transformOrigin: "left center",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: scrim, pointerEvents: "none" }} />
    </div>
  );
}

function pageStyle(look: BillboardLook): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: look.bg,
    color: look.ink,
    fontFamily: look.theme.font.family,
    fontSynthesis: "none",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
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

const FORE: CSSProperties = { position: "relative", zIndex: 1, minWidth: 0 };

/** Chip copy wraps, then ellipsizes, so a long label stays inside the row. */
const CHIP_LINE: CSSProperties = {
  ...FORE,
  flex: "0 1 auto",
  maxWidth: "100%",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  textOverflow: "ellipsis",
};

function InstallTile({ bot }: { bot: Bot }): JSX.Element {
  const look = useBillboardLook();
  const theme = look.theme;
  const ring = useFocusRing();
  const name = filled(bot.name);
  const desc = filled(bot.desc);
  const icon = filled(bot.src);
  return (
    <GlassPane
      kind="tile"
      href={filled(bot.href)}
      focused={ring.focused}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 14,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: 18,
      }}
      children={[
        <div key="row" style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
          <div style={iconWell(64, 16, look)}>
            {icon.length > 0 ? <Image src={icon} alt={name.length > 0 ? `${name} icon` : "Bot icon"} width={64} height={64} fit="cover" /> : null}
          </div>
          {name.length > 0 ? (
            <p
              style={{
                ...theme.font.heading1,
                ...FORE,
                fontFamily: theme.font.family,
                color: look.ink,
                // 22px floor: a title beside the 64px icon stays inside a 320–390px column. Desktop still caps at 30.
                fontSize: "clamp(22px, 5.6vw, 30px)",
                lineHeight: 1.05,
                fontWeight: theme.weight.semibold,
                letterSpacing: "-0.03em",
                textTransform: "none",
                textShadow: "var(--bb-ink-shadow)",
                transition: `text-shadow ${MOTION}`,
                margin: 0,
                flex: "1 1 auto",
                minWidth: 0,
                maxWidth: "100%",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {name}
            </p>
          ) : null}
        </div>,
        desc.length > 0 ? (
          <p
            key="desc"
            style={{
              ...theme.font.body1,
              ...FORE,
              fontFamily: theme.font.family,
              color: look.ink,
              fontSize: 14,
              lineHeight: 1.35,
              fontWeight: theme.weight.medium,
              letterSpacing: "0",
              textTransform: "none",
              textShadow: "var(--bb-ink-shadow)",
              transition: `text-shadow ${MOTION}`,
              margin: 0,
              maxWidth: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {desc}
          </p>
        ) : null,
      ]}
    />
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const look = useBillboardLook();
  const theme = look.theme;
  const ring = useFocusRing();
  const href = filled(link.href);
  const display = filled(link.display);
  const givenLabel = filled(link.label);
  const label = givenLabel.length > 0 ? givenLabel : display.length > 0 ? "" : href;
  const showDisplay = display.length > 0 && display !== label;
  return (
    <GlassPane
      kind="chip"
      href={href}
      focused={ring.focused}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      contentStyle={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "0 14px",
        ...theme.font.subtext,
        fontFamily: theme.font.family,
        letterSpacing: "0",
        color: look.ink,
      }}
      children={[
        label.length > 0 ? (
          <span
            key="label"
            style={{
              ...CHIP_LINE,
              fontFamily: theme.font.family,
              color: look.ink,
              fontWeight: theme.weight.semibold,
              letterSpacing: "0",
              textShadow: "var(--bb-ink-shadow)",
              transition: `text-shadow ${MOTION}`,
            }}
          >
            {label}
          </span>
        ) : null,
        showDisplay ? (
          <span
            key="display"
            style={{
              ...CHIP_LINE,
              fontFamily: theme.font.family,
              color: look.ink,
              letterSpacing: "0",
              textShadow: "var(--bb-ink-shadow)",
              transition: `text-shadow ${MOTION}`,
            }}
          >
            {display}
          </span>
        ) : null,
      ]}
    />
  );
}

export default function App(): JSX.Element {
  const look = useBillboardLook();
  const theme = look.theme;
  const handle = atHandle(HANDLE);
  const hero = splitTrailingEmoji(DISPLAY_NAME);
  const bio = filled(BIO);
  const footer = filled(FOOTER);
  const avatar = filled(AVATAR);
  const shownBots = bots.filter((bot) => filled(bot.name).length > 0 || filled(bot.desc).length > 0 || filled(bot.href).length > 0 || filled(bot.src).length > 0);
  const shownLinks = links.filter((link) => filled(link.label).length > 0 || filled(link.display).length > 0 || filled(link.href).length > 0);
  const showHero = hero.text.length > 0 || hero.clusters.length > 0;
  const dark = look.dark;
  return (
    <div id={LAYOUT} style={pageStyle(look)}>
      <Stage />
      <div style={bandStyle()}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 0,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          <div style={avatarRing(look)}>
            {avatar.length > 0 ? (
              <Image src={avatar} alt={hero.text.length > 0 ? `${hero.text} avatar` : "Profile avatar"} width={AVATAR_SIZE} height={AVATAR_SIZE} fit="cover" />
            ) : null}
          </div>
          {showHero ? (
          <h1
            style={{
              fontFamily: theme.font.family,
              color: look.ink,
              fontSize: "clamp(46px, 13vw, 72px)",
              lineHeight: 0.96,
              fontWeight: theme.weight.semibold,
              letterSpacing: "-0.034em",
              textTransform: "none",
              textAlign: "center",
              textShadow: dark ? SOFT_SHADOW_DARK : SOFT_SHADOW_LIGHT,
              margin: "10px 0 0",
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {hero.text.length > 0 ? hero.text : null}
            {hero.clusters.map((cluster, index) => (
              <span key={`hero-emoji-${index}`} style={heroEmojiStyle(index, hero.text.length > 0, dark ? SILVER : GRAPHITE)}>
                {cluster}
              </span>
            ))}
          </h1>
          ) : null}
          {handle.length > 0 ? (
            <p
              style={{
                fontFamily: theme.font.family,
                color: look.ink,
                fontSize: 15,
                lineHeight: 1.25,
                fontWeight: theme.weight.medium,
                letterSpacing: "0",
                textAlign: "center",
                textShadow: dark ? SOFT_SHADOW_DARK : SOFT_SHADOW_LIGHT,
                margin: "4px 0 0",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {handle}
            </p>
          ) : null}
          {bio.length > 0 ? (
          <p
            style={{
              fontFamily: theme.font.family,
              color: look.ink,
              fontSize: 15,
              lineHeight: 1.45,
              fontWeight: theme.weight.regular,
              letterSpacing: "0",
              textTransform: "none",
              textAlign: "center",
              textShadow: dark ? SOFT_SHADOW_DARK : SOFT_SHADOW_LIGHT,
              margin: "8px 0 0",
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {bio}
          </p>
          ) : null}
        </header>

        {shownBots.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {shownBots.map((bot, index) => (
              <InstallTile key={`${bot.href}-${index}`} bot={bot} />
            ))}
          </section>
        ) : null}

        {shownLinks.length > 0 ? (
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              gap: 8,
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
            }}
          >
            {shownLinks.map((link, index) => (
              <MiniLink key={`${link.href}-${link.label}-${index}`} link={link} />
            ))}
          </nav>
        ) : null}

        {footer.length > 0 ? (
        <p
          style={{
            fontFamily: theme.font.family,
            color: look.ink,
            fontSize: 12,
            lineHeight: 1.4,
            fontWeight: theme.weight.medium,
            letterSpacing: "0",
            textTransform: "none",
            textShadow: dark ? SOFT_SHADOW_DARK : SOFT_SHADOW_LIGHT,
            textAlign: "center",
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {footer}
        </p>
        ) : null}
      </div>
    </div>
  );
}
