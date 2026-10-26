import { useGrokTheme, Image, useEffect, useState, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — billboard.
 * Link-tree column: avatar, name, handle, bio, full-width Install tiles, link chips, footer.
 * Header is those four fields only — no pack wordmark, no kicker.
 * Tiles and chips are a liquid-glass lens: faint tint, light frost, top-bright specular rim,
 * diagonal sheen, and (where the host allows backdrop-filter url) an inline SVG displacement
 * map drawn on a canvas. No photographed frost plates.
 * Replace the constants and the bots/links arrays. Leave the JSX alone. See README.md.
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

const TILE_FILTER = "billboard-lens-tile";
const CHIP_FILTER = "billboard-lens-chip";

/** Light frost. Refraction replaces this only when backdrop-filter url() is supported. */
const FROST = "blur(6px) saturate(1.5) brightness(1.08)";
const TINT_DARK = "rgba(255,255,255,0.07)";
const TINT_LIGHT = "rgba(255,255,255,0.38)";
const EDGE_DARK = "rgba(255,255,255,0.28)";
const EDGE_LIGHT = "rgba(0,0,0,0.08)";
const STAMP_DARK = "0 1px 0 rgba(0,0,0,0.92), 1px 2px 0 rgba(0,0,0,0.55)";
const STAMP_LIGHT = "0 1px 0 rgba(255,255,255,0.92), 1px 2px 0 rgba(16,16,20,0.2)";
const SHEEN =
  "linear-gradient(122deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0.72) 24%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0) 58%)";

/** Lens-button 6-pass, brightest on the top lip, softer sides and bottom. */
const RIM_DARK = [
  "inset 0 1px 0 rgba(255,255,255,0.94)",
  "inset 1px 8px 2px -5px rgba(255,255,255,0.5)",
  "inset -3px 0 1px -2px rgba(255,255,255,0.2)",
  "inset 0 -3px 2px -1px rgba(255,255,255,0.08)",
  "inset 0 0 2px rgba(0,0,0,0.4)",
  "0 8px 18px rgba(0,0,0,0.28)",
].join(", ");
const RIM_LIGHT = [
  "inset 0 1px 0 rgba(255,255,255,0.96)",
  "inset 1px 6px 2px -4px rgba(255,255,255,0.62)",
  "inset -3px 0 1px -2px rgba(255,255,255,0.32)",
  "inset 0 -2px 2px rgba(0,0,0,0.06)",
  "inset 0 0 1px rgba(0,0,0,0.12)",
  "0 6px 14px rgba(0,0,0,0.08)",
].join(", ");

const FORE: CSSProperties = { position: "relative", zIndex: 1, minWidth: 0 };

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function stampShadow(theme: ReturnType<typeof useGrokTheme>): string {
  return theme.kind === "dark" ? STAMP_DARK : STAMP_LIGHT;
}

/**
 * Rounded-rect bezel as a displacement map. 128 is rest; the rim shifts along
 * the outward normal so backdrop-filter url() bends the field like a lens.
 * One channel pair — no chromatic split.
 */
function lensMap(width: number, height: number, radius: number, bezel: number): string | null {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(width, height);
    const data = image.data;
    const cx = width / 2;
    const cy = height / 2;
    const rr = Math.max(1, Math.min(radius, cx - 1, cy - 1));
    const bx = cx - rr;
    const by = cy - rr;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = x + 0.5;
        const py = y + 0.5;
        const qx = Math.abs(px - cx) - bx;
        const qy = Math.abs(py - cy) - by;
        const ox = Math.max(qx, 0);
        const oy = Math.max(qy, 0);
        const outside = Math.hypot(ox, oy);
        const inside = Math.min(Math.max(qx, qy), 0);
        const d = outside + inside - rr;
        let nx = 0;
        let ny = 0;
        if (outside > 0.001) {
          nx = ox / outside;
          ny = oy / outside;
        } else if (qx > qy) {
          nx = 1;
        } else {
          ny = 1;
        }
        if (px < cx) nx = -nx;
        if (py < cy) ny = -ny;
        let mag = 0;
        if (d <= 0 && d >= -bezel) {
          const t = -d / bezel;
          mag = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
        }
        const i = (y * width + x) * 4;
        data[i] = 128 + nx * mag * 127;
        data[i + 1] = 128 + ny * mag * 127;
        data[i + 2] = 128;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function useLensMaps(): { tile: string | null; chip: string | null } {
  const [maps, setMaps] = useState<{ tile: string | null; chip: string | null }>({ tile: null, chip: null });
  useEffect(() => {
    const tile = lensMap(300, 176, 30, 42);
    const chip = lensMap(240, 64, 32, 16);
    if (tile && chip) setMaps({ tile, chip });
  }, []);
  return maps;
}

function LensDefs({ tile, chip }: { tile: string | null; chip: string | null }): JSX.Element | null {
  if (!tile || !chip) return null;
  const css = `@supports (backdrop-filter: url("#${TILE_FILTER}")) or (-webkit-backdrop-filter: url("#${TILE_FILTER}")) {
    #${LAYOUT} [data-lens="tile"] {
      -webkit-backdrop-filter: url(#${TILE_FILTER}) saturate(1.45) brightness(1.06) !important;
      backdrop-filter: url(#${TILE_FILTER}) saturate(1.45) brightness(1.06) !important;
    }
    #${LAYOUT} [data-lens="chip"] {
      -webkit-backdrop-filter: url(#${CHIP_FILTER}) saturate(1.35) brightness(1.05) !important;
      backdrop-filter: url(#${CHIP_FILTER}) saturate(1.35) brightness(1.05) !important;
    }
  }`;
  return (
    <>
      <svg aria-hidden width={0} height={0} style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id={TILE_FILTER} colorInterpolationFilters="sRGB" x="-12%" y="-12%" width="124%" height="124%">
            <feImage href={tile} xlinkHref={tile} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="22" xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feGaussianBlur in="bent" stdDeviation="0.4" />
          </filter>
          <filter id={CHIP_FILTER} colorInterpolationFilters="sRGB" x="-12%" y="-20%" width="124%" height="140%">
            <feImage href={chip} xlinkHref={chip} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="12" xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feGaussianBlur in="bent" stdDeviation="0.3" />
          </filter>
        </defs>
      </svg>
      <style>{css}</style>
    </>
  );
}

function glassBox(theme: ReturnType<typeof useGrokTheme>, radius: number, extra?: CSSProperties): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    boxSizing: "border-box",
    color: theme.text.primary,
    ...extra,
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    borderRadius: radius,
    background: dark ? TINT_DARK : TINT_LIGHT,
    backdropFilter: FROST,
    WebkitBackdropFilter: FROST,
    boxShadow: dark ? RIM_DARK : RIM_LIGHT,
    border: `1px solid ${dark ? EDGE_DARK : EDGE_LIGHT}`,
  };
}

function Sheen(): JSX.Element {
  const theme = useGrokTheme();
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: theme.kind === "dark" ? 0.95 : 0.5,
        background: SHEEN,
      }}
    />
  );
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
    boxShadow: `inset 0 0 0 1px ${dark ? EDGE_DARK : EDGE_LIGHT}`,
  };
}

const AVATAR_SIZE = 60;

function avatarRing(theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    flex: `0 0 ${AVATAR_SIZE}px`,
    borderRadius: 9999,
    overflow: "hidden",
    boxShadow: `0 0 0 1px ${dark ? EDGE_DARK : EDGE_LIGHT}`,
  };
}

/** Quiet dark field with neutral catches so a lens has edges to bend. No accent washes. */
function Stage(): JSX.Element {
  const theme = useGrokTheme();
  const dark = theme.kind === "dark";
  const ink = theme.text.primary;
  const mute = theme.text.secondary;
  const bloom = (style: CSSProperties): JSX.Element => (
    <div aria-hidden style={{ position: "absolute", pointerEvents: "none", borderRadius: "50%", ...style }} />
  );
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {bloom({
        left: "-18%",
        top: "-8%",
        width: "136%",
        height: "42%",
        background: ink,
        filter: "blur(36px)",
        opacity: dark ? 0.2 : 0.45,
      })}
      {bloom({
        right: "-8%",
        top: "18%",
        width: "54%",
        height: "28%",
        background: mute,
        filter: "blur(28px)",
        opacity: dark ? 0.34 : 0.28,
      })}
      {bloom({
        left: "-12%",
        top: "48%",
        width: "46%",
        height: "26%",
        background: ink,
        filter: "blur(22px)",
        opacity: dark ? 0.16 : 0.22,
      })}
      {bloom({
        left: "58%",
        top: "70%",
        width: "48%",
        height: "24%",
        background: mute,
        filter: "blur(26px)",
        opacity: dark ? 0.28 : 0.2,
      })}
      {bloom({
        left: "12%",
        top: "30%",
        width: 72,
        height: 160,
        background: ink,
        filter: "blur(8px)",
        opacity: dark ? 0.22 : 0.16,
        transform: "rotate(16deg)",
      })}
      {bloom({
        right: "10%",
        top: "46%",
        width: 110,
        height: 110,
        background: ink,
        filter: "blur(10px)",
        opacity: dark ? 0.2 : 0.14,
      })}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-20%",
          top: "6%",
          width: "80%",
          height: "34%",
          pointerEvents: "none",
          background:
            "linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0) 74%)",
          filter: "blur(16px)",
          opacity: dark ? 0.16 : 0.4,
          transform: "rotate(-8deg)",
        }}
      />
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

function useNarrowTile(): { narrow: boolean; ref: (node: HTMLAnchorElement | null) => void } {
  const [node, setNode] = useState<HTMLAnchorElement | null>(null);
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

function InstallTile({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const pane = useNarrowTile();
  const ring = useFocusRing();
  const label = theme.text.onPrimary;
  return (
    <a
      ref={pane.ref}
      href={bot.href}
      target="_blank"
      rel="noreferrer"
      data-lens="tile"
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      style={glassBox(theme, 26, {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 14,
        width: "100%",
        minWidth: 0,
        padding: 18,
        textDecoration: "none",
        outline: ring.focused ? `2px solid ${theme.text.accent}` : "none",
        outlineOffset: 3,
      })}
    >
      <Sheen />
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0, ...FORE }}>
        <div style={iconWell(64, 16, theme)}>
          <Image src={bot.src} alt={`${bot.name} icon`} width={64} height={64} fit="cover" />
        </div>
        <p
          style={{
            ...theme.font.heading1,
            ...FORE,
            color: theme.text.primary,
            fontSize: "clamp(30px, 8.5vw, 44px)",
            lineHeight: 0.9,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            textShadow: stampShadow(theme),
            margin: 0,
            flex: "1 1 auto",
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {bot.name}
        </p>
      </div>
      <p
        style={{
          ...theme.font.body1,
          ...FORE,
          color: theme.text.primary,
          fontWeight: theme.weight.regular,
          letterSpacing: "0",
          textTransform: "none",
          margin: 0,
          overflowWrap: "anywhere",
        }}
      >
        {bot.desc}
      </p>
      <span
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
          backgroundColor: theme.fill.primary,
          color: label,
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -8px 12px rgba(0,0,0,0.16)",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.01em",
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
            height: "55%",
            pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))",
          }}
        />
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          Install
          <Arrow color={label} />
        </span>
      </span>
    </a>
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const ring = useFocusRing();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      data-lens="chip"
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      style={glassBox(theme, 999, {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        maxWidth: "100%",
        padding: "0 14px",
        textDecoration: "none",
        color: theme.text.primary,
        outline: ring.focused ? `2px solid ${theme.text.accent}` : "none",
        outlineOffset: 3,
        ...theme.font.subtext,
      })}
    >
      <Sheen />
      <span style={{ ...FORE, overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ ...FORE, color: theme.text.secondary, overflowWrap: "anywhere" }}>{link.display}</span>
      ) : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const lenses = useLensMaps();
  return (
    <div id={LAYOUT} style={pageStyle(theme)}>
      <LensDefs tile={lenses.tile} chip={lenses.chip} />
      <Stage />
      <div style={bandStyle()}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
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
              fontSize: "clamp(56px, 16vw, 84px)",
              lineHeight: 0.84,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
              textShadow: stampShadow(theme),
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p
              style={{
                ...theme.font.body1,
                color: theme.text.secondary,
                fontWeight: theme.weight.medium,
                letterSpacing: "0.01em",
                textAlign: "center",
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
              ...theme.font.body1,
              color: theme.text.primary,
              fontWeight: theme.weight.regular,
              letterSpacing: "0",
              textTransform: "none",
              textAlign: "center",
              margin: 0,
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
            fontWeight: theme.weight.medium,
            letterSpacing: "0.04em",
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
