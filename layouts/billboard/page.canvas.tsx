import { useGrokTheme, Image, useEffect, useRef, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — billboard.
 * Small avatar, oversized name, full-width Install tiles, link row. Liquid glass panes.
 * Header is avatar, display name, handle, and bio only — no pack wordmark, no kicker.
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

type OrbSpec = {
  x: number;
  y: number;
  r: number;
  slot: "accent" | "warning" | "success";
  gain: number;
};

/**
 * Physical glass. Module-level so the pane is a material, not a theme tint card.
 * Frost and sheen are generated photographs (data:image), tiled and stretched.
 */
const GLASS_FILL_DARK =
  "linear-gradient(185deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 24%, rgba(8,6,16,0.46) 100%)";
const GLASS_FILL_LIGHT =
  "linear-gradient(185deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.40) 46%, rgba(255,255,255,0.26) 100%)";
const GLASS_BLUR = "blur(18px) saturate(1.8)";
const GLASS_EDGE = "rgba(255,255,255,0.55)";
const GLASS_EDGE_SOFT = "rgba(255,255,255,0.18)";
const SPEC = "rgba(255,255,255,0.82)";
const CHROMA_CYAN = "rgba(70,220,255,0.72)";
const CHROMA_MAGENTA = "rgba(255,70,180,0.64)";
const GLASS_SHADE = "rgba(0,0,0,0.40)";
const GLASS_SHADE_SOFT = "rgba(36,24,64,0.18)";
const CLEAR = "rgba(0,0,0,0)";
const VIGNETTE_DARK = "rgba(0,0,0,0.58)";
const VIGNETTE_LIGHT = "rgba(36,24,58,0.14)";
const PILL_SHEEN =
  "linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.06) 44%, rgba(0,0,0,0.18) 100%)";
const PILL_QUIET_DARK = "rgba(255,255,255,0.14)";
const PILL_QUIET_LIGHT = "rgba(255,255,255,0.62)";
const CATCH =
  "radial-gradient(80% 90% at 22% 0%, rgba(255,255,255,0.62), rgba(255,255,255,0) 50%)";
const FRESNEL =
  "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.18) 100%)";
const RIM_GRAD =
  "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(90,220,255,0.65) 20%, rgba(255,255,255,0.06) 46%, rgba(255,80,180,0.62) 78%, rgba(255,255,255,0.72) 100%)";
const RIM_MASK = "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)";
const TEXT_LIFT = "0 1px 2px rgba(0,0,0,0.48)";
const GLASS_SHADOW_DARK = `0 18px 42px ${GLASS_SHADE}, inset 0 1px 0 ${SPEC}, inset 1px 0 1px ${CHROMA_CYAN}, inset -1px 0 1px ${CHROMA_MAGENTA}`;
const GLASS_SHADOW_LIGHT = `0 14px 32px ${GLASS_SHADE_SOFT}, inset 0 1px 0 ${SPEC}, inset 1px 0 1px ${CHROMA_CYAN}, inset -1px 0 1px ${CHROMA_MAGENTA}`;
const FROST = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABsklEQVR42u2bS5LEIAhAuYlH4SgcxSvParY9NV2pmp6qfFD5qgs26U4ITySIAl/fr3IIHkIfcnZNQrBTJHW87YYbAKgEAIMAwE8AaARA2+hmfXCjVBKAteF3eskawOnccwJAPQAyBDxxD8CEUb87Bjy5i3fkH3mnx+dlA4DCOv8B0Ex8PCCwngFKxkaZCo/3WgMgRy84/U9mAJgRADoBoAgAkLtCM0qSTAHgAACt9zADcGVkYV6fDoBFDSAMAM2g1wsOrWIAOotbELQa4RQAqNE4bkGDMgCQ9JbW+93yAI21u6puEB5haQDqSRoIjrLEy5saLwEAjWqKYQB4VHY3gKxTYFoAtHIMaAGxNADaABYBkF5+AdRDNBY70aWuDKD2AphFlgdAG8AG8Adg6c8gbQC5BVcGgLMD4O4ZLAFApf4AVxlSgBF2AVCZonmMNYwHaBidAsAVjIxdIyYAqiEAl0SoDv4eeo8BknzipgOAKwPgGmpSZY5wVLYwttyXBGByWBKMq7zcU6NmPYtgvKPjAaC5cXKozDwAoETpHJ3JA1gAivM00MwBhrrHo7XPS+t42/0DGjnD/ucY1AcAAAAASUVORK5CYII=";
const SHEEN = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA4CAYAAAACRf2iAAAB9klEQVR42u2Wy42EMBAFSYM4SIM4SIMEOK9EGsTBiRy4bQ678x/DYOwZuvsZ5lkqcfRTFRJkP79/fzHwvHmaIYqMAT4+4yrNEAUDxAqd0gdphhDd+XkOMHo4SgBZsU+6Va6CQzwC9A6LQVZG70HsKCZ2mfaFZgjhDbCIM3BMlF5JcvsB9ekDu8ZigM7DPEAsCLEWkusoBANc8AzvwXRw0VOqB82wRDBAu8BagBgsxFqKrqIQDHBhYXiXCK2i8OpDypPcOdEB6huhAGugJeu+3a5oHwIBJtwGtomDE24UYM6eZOsKfw1QOLwdoIoMYBWm3oCV9GKCQACXeqMEayykF6sIB5gP3rtwHemGAdBBqk2/iJriQQE0o1QC2EgXDlBuDICmhIi/kp8k39kU4AHFR0h3UQjgchTp8uKNAqBjlALoiAcEsIhSCqIrPpEAKWIjngHE/2jely8YoLhB8eAA90HfIH2beOUALkeTLiffKAAqSJG0eGAA6TCFEbkKCQVIlVwVBgCJZwCw+GeAjAEQ4q9kkgHyHQbIYeLvCAdwL6H0kHzlAHO+VbhfvnEAiyh5omRewAGOThaEAYDyGQAongHA4hkgAfkMABTPAGDxDACUzgAJiGcAoHQGAEtnALB0xQDzCygcHMDH94lOLABhAAYgDLCfAP9KR5V/+8UyzAAAAABJRU5ErkJggg==";

const FORE: CSSProperties = { position: "relative", zIndex: 1, minWidth: 0 };

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function glassBox(
  theme: ReturnType<typeof useGrokTheme>,
  radius: number,
  extra?: CSSProperties,
): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    boxSizing: "border-box",
    color: theme.text.primary,
    ...extra,
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    borderRadius: radius,
    background: dark ? GLASS_FILL_DARK : GLASS_FILL_LIGHT,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    boxShadow: dark ? GLASS_SHADOW_DARK : GLASS_SHADOW_LIGHT,
    border: `1px solid ${GLASS_EDGE}`,
  };
}

function quietFill(theme: ReturnType<typeof useGrokTheme>): string {
  return theme.kind === "dark" ? PILL_QUIET_DARK : PILL_QUIET_LIGHT;
}

function pillFace(
  theme: ReturnType<typeof useGrokTheme>,
  fill: string,
  label: string,
  extra?: CSSProperties,
): CSSProperties {
  return {
    ...theme.font.subtext,
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    gap: 8,
    minHeight: 48,
    boxSizing: "border-box",
    padding: "0 16px",
    borderRadius: 999,
    backgroundColor: fill,
    backgroundImage: PILL_SHEEN,
    color: label,
    border: `1px solid ${GLASS_EDGE}`,
    boxShadow: `inset 0 1px 0 ${SPEC}, 0 8px 16px ${GLASS_SHADE}`,
    fontWeight: theme.weight.semibold,
    letterSpacing: "0.04em",
    ...extra,
  };
}

function iconWell(size: number, radius: number, theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: radius,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    background: theme.fill.secondary,
    boxShadow: `inset 0 1px 0 ${SPEC}, 0 0 0 1px ${GLASS_EDGE_SOFT}`,
  };
}

function avatarRing(size: number): CSSProperties {
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: 9999,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    boxShadow: `0 10px 24px ${GLASS_SHADE}, inset 0 1px 0 ${SPEC}, inset 1px 0 0 ${CHROMA_CYAN}, inset -1px 0 0 ${CHROMA_MAGENTA}, 0 0 0 1.5px ${GLASS_EDGE}`,
  };
}

function GlassLayers({ tint, tintAlpha = 0.26 }: { tint?: string; tintAlpha?: number }): JSX.Element {
  return (
    <>
      {tint ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: tint,
            opacity: tintAlpha,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ) : null}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url("${FROST}")`,
          backgroundSize: "96px 96px",
          opacity: 0.55,
          mixBlendMode: "overlay",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "62%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          mixBlendMode: "screen",
          opacity: 0.95,
        }}
      >
        <Image src={SHEEN} alt="" width="100%" height={140} fit="cover" />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: CATCH,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: FRESNEL,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: 1.5,
          background: RIM_GRAD,
          mask: RIM_MASK,
          maskComposite: "exclude",
          WebkitMask: RIM_MASK,
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </>
  );
}

function Lumen(): JSX.Element {
  const theme = useGrokTheme();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const kind = theme.kind;
  const accent = theme.text.accent;
  const warning = theme.text.warning;
  const success = theme.text.success;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = (): void => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? 0;
      const height = parent?.clientHeight ?? 0;
      if (width === 0 || height === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const dark = kind === "dark";
      for (const spec of FIELD) {
        const color = spec.slot === "accent" ? accent : spec.slot === "warning" ? warning : success;
        const radius = spec.r * Math.max(width, height);
        const glow = ctx.createRadialGradient(spec.x * width, spec.y * height, 0, spec.x * width, spec.y * height, radius);
        glow.addColorStop(0, color);
        glow.addColorStop(1, CLEAR);
        ctx.globalAlpha = (dark ? 0.72 : 0.38) * spec.gain;
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.32,
        Math.min(width, height) * 0.12,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.75,
      );
      vignette.addColorStop(0, CLEAR);
      vignette.addColorStop(1, dark ? VIGNETTE_DARK : VIGNETTE_LIGHT);
      ctx.globalAlpha = 1;
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    paint();
    const parent = canvas.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver((): void => {
      paint();
    });
    observer.observe(parent);
    return (): void => {
      observer.disconnect();
    };
  }, [kind, accent, warning, success]);

  return (
    <canvas
      ref={ref}
      role="presentation"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function FieldGrain(): JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `url("${FROST}")`,
        backgroundSize: "128px 128px",
        opacity: 0.28,
        mixBlendMode: "overlay",
      }}
    />
  );
}

function pageStyle(theme: ReturnType<typeof useGrokTheme>, extra?: CSSProperties): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
    ...extra,
  };
}

function bandStyle(
  max: number,
  gap: number,
  align: "stretch" | "center",
  extra?: CSSProperties,
): CSSProperties {
  return {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: max,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(24px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(28px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    gap,
    minWidth: 0,
    ...extra,
  };
}

const FIELD: readonly OrbSpec[] = [
  { x: 1.08, y: 0.4, r: 0.62, slot: "accent", gain: 1 },
  { x: -0.12, y: 0.62, r: 0.55, slot: "warning", gain: 0.95 },
  { x: 0.75, y: 1.02, r: 0.42, slot: "success", gain: 0.4 },
  { x: 0.12, y: 0.98, r: 0.34, slot: "accent", gain: 0.28 },
];

function tileTone(theme: ReturnType<typeof useGrokTheme>, index: number): { ink: string; button: string; label: string } {
  if (index % 2 === 0) {
    return { ink: theme.text.accent, button: theme.fill.accent, label: theme.text.onColor };
  }
  return { ink: theme.text.warning, button: theme.text.warning, label: theme.bg.base };
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

function InstallTile({ bot, index }: { bot: Bot; index: number }): JSX.Element {
  const theme = useGrokTheme();
  const tone = tileTone(theme, index);
  return (
    <a
      href={bot.href}
      target="_blank"
      rel="noreferrer"
      style={glassBox(theme, 28, {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 14,
        width: "100%",
        minWidth: 0,
        padding: 18,
        textDecoration: "none",
      })}
    >
      <GlassLayers tint={tone.button} tintAlpha={0.34} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0, ...FORE }}>
        <div style={iconWell(64, 16, theme)}>
          <Image src={bot.src} alt={`${bot.name} icon`} width={64} height={64} fit="cover" />
        </div>
        <p
          style={{
            ...theme.font.heading1,
            fontSize: "clamp(28px, 8vw, 40px)",
            lineHeight: 0.95,
            fontWeight: theme.weight.semibold,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
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
          ...theme.font.subtext,
          ...FORE,
          color: tone.ink,
          fontWeight: theme.weight.semibold,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: 0,
          overflowWrap: "anywhere",
        }}
      >
        {bot.desc}
      </p>
      <span
        style={pillFace(theme, tone.button, tone.label, {
          alignSelf: "flex-end",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        })}
      >
        Install
        <Arrow color={tone.label} />
      </span>
    </a>
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      style={glassBox(theme, 999, {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        maxWidth: "100%",
        padding: "0 14px",
        textDecoration: "none",
        color: theme.text.secondary,
        ...theme.font.subtext,
      })}
    >
      <GlassLayers />
      <span style={{ ...FORE, overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ ...FORE, color: theme.text.tertiary, overflowWrap: "anywhere" }}>{link.display}</span>
      ) : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  return (
    <div id={LAYOUT} style={pageStyle(theme)}>
      <Lumen />
      <FieldGrain />
      <div style={bandStyle(500, 22, "stretch")}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12, width: "100%", minWidth: 0 }}>
          <div style={avatarRing(40)}>
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={40} height={40} fit="cover" />
          </div>
          <h1
            style={{
              fontFamily: theme.font.family,
              fontSize: "clamp(44px, 14vw, 72px)",
              lineHeight: 0.86,
              fontWeight: theme.weight.semibold,
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
              margin: 0,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
              textShadow: TEXT_LIFT,
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p style={{ ...theme.font.subtext, color: theme.text.tertiary, margin: 0, overflowWrap: "anywhere" }}>{handle}</p>
          ) : null}
          <p
            style={{
              ...theme.font.subtext,
              color: theme.text.accent,
              fontWeight: theme.weight.semibold,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
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
              <InstallTile key={`${bot.href}-${index}`} bot={bot} index={index} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%", minWidth: 0 }}>
            {links.map((link, index) => (
              <MiniLink key={`${link.href}-${index}`} link={link} />
            ))}
          </nav>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            color: theme.text.accent,
            fontWeight: theme.weight.semibold,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
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
