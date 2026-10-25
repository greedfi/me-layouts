import { useGrokTheme, Image, useEffect, useRef, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Vertical book-spine Install blocks on a wood ledge; links hang as ribbons under.
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

export const LAYOUT = "shelf" as const;

/** Serif stack for still-matching name, spine titles, and pack wordmark. */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/** Leather / wood face washes per spine index (hex only inside SpineWash). */
const SPINE_TONES: readonly { dark: readonly [string, string, string]; light: readonly [string, string, string] }[] = [
  { dark: ["#6e4528", "#4a2e1a", "#2e1a10"], light: ["#c4a078", "#a88258", "#8a6840"] },
  { dark: ["#5c2a2e", "#3d1a1e", "#241014"], light: ["#b88880", "#9a6860", "#7a4848"] },
  { dark: ["#3e3428", "#2a2218", "#1a1510"], light: ["#b8a888", "#988868", "#786848"] },
  { dark: ["#4a3820", "#322414", "#1e160c"], light: ["#c8ae78", "#a88e58", "#887038"] },
  { dark: ["#4a2838", "#321820", "#1e1014"], light: ["#b89098", "#987078", "#785058"] },
  { dark: ["#2e3828", "#1e2618", "#121810"], light: ["#98a888", "#788868", "#586848"] },
];

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function Down({ color }: { color: string }): JSX.Element {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dark wood-grain wall + vignette. Hex only inside this 2D paint (BrandWash pattern). */
function ShelfWash(): JSX.Element {
  const theme = useGrokTheme();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const kind = theme.kind;

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

      if (kind === "dark") {
        const base = ctx.createLinearGradient(0, 0, width * 0.15, height);
        base.addColorStop(0, "#3d2418");
        base.addColorStop(0.45, "#2c1a12");
        base.addColorStop(1, "#1a100c");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < Math.ceil(width / 3); i += 1) {
          const x = i * 3 + (i % 5) * 0.4;
          const alpha = 0.03 + (i % 7) * 0.008;
          ctx.fillStyle = `rgba(10, 6, 4, ${alpha})`;
          ctx.fillRect(x, 0, 1 + (i % 2), height);
        }
        for (let i = 0; i < Math.ceil(width / 11); i += 1) {
          const x = i * 11 + 2;
          ctx.fillStyle = `rgba(90, 58, 36, ${0.04 + (i % 3) * 0.015})`;
          ctx.fillRect(x, 0, 1, height);
        }

        const glow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.08,
          0,
          width * 0.5,
          height * 0.18,
          Math.max(width, height) * 0.7,
        );
        glow.addColorStop(0, "rgba(90, 55, 32, 0.55)");
        glow.addColorStop(0.4, "rgba(40, 24, 14, 0.2)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        const vig = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          Math.min(width, height) * 0.2,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.75,
        );
        vig.addColorStop(0, "rgba(0, 0, 0, 0)");
        vig.addColorStop(1, "rgba(0, 0, 0, 0.55)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, width, height);
      } else {
        const base = ctx.createLinearGradient(0, 0, 0, height);
        base.addColorStop(0, "#e8d9c8");
        base.addColorStop(0.5, "#d4c0a8");
        base.addColorStop(1, "#c4a88c");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < Math.ceil(width / 4); i += 1) {
          ctx.fillStyle = `rgba(80, 50, 30, ${0.03 + (i % 5) * 0.01})`;
          ctx.fillRect(i * 4, 0, 1, height);
        }
        const vig = ctx.createRadialGradient(
          width * 0.5,
          height * 0.35,
          Math.min(width, height) * 0.15,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.7,
        );
        vig.addColorStop(0, "rgba(0, 0, 0, 0)");
        vig.addColorStop(1, "rgba(60, 35, 20, 0.28)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, width, height);
      }
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
  }, [kind]);

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
      }}
    />
  );
}

/** Book-cover face: warm leather / wood grain, tone by index. Hex only here. */
function SpineWash({ index }: { index: number }): JSX.Element {
  const theme = useGrokTheme();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const kind = theme.kind;
  const tone = SPINE_TONES[index % SPINE_TONES.length];

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

      const stops = kind === "dark" ? tone.dark : tone.light;
      const base = ctx.createLinearGradient(0, 0, width, height * 0.15);
      base.addColorStop(0, stops[0]);
      base.addColorStop(0.55, stops[1]);
      base.addColorStop(1, stops[2]);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < Math.ceil(width / 2); i += 1) {
        const x = i * 2 + (i % 3) * 0.3;
        const alpha = kind === "dark" ? 0.04 + (i % 5) * 0.012 : 0.05 + (i % 5) * 0.01;
        ctx.fillStyle = `rgba(20, 10, 6, ${alpha})`;
        ctx.fillRect(x, 0, 1, height);
      }

      const topHi = ctx.createLinearGradient(0, 0, 0, 18);
      topHi.addColorStop(0, kind === "dark" ? "rgba(255,220,180,0.18)" : "rgba(255,255,240,0.35)");
      topHi.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topHi;
      ctx.fillRect(0, 0, width, 18);

      const leftHi = ctx.createLinearGradient(0, 0, 6, 0);
      leftHi.addColorStop(0, kind === "dark" ? "rgba(255,210,160,0.14)" : "rgba(255,255,240,0.28)");
      leftHi.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = leftHi;
      ctx.fillRect(0, 0, 6, height);

      const bottomShade = ctx.createLinearGradient(0, height - 28, 0, height);
      bottomShade.addColorStop(0, "rgba(0,0,0,0)");
      bottomShade.addColorStop(1, kind === "dark" ? "rgba(0,0,0,0.35)" : "rgba(40,20,10,0.22)");
      ctx.fillStyle = bottomShade;
      ctx.fillRect(0, height - 28, width, 28);

      // Lighter page-edge strip on the right — thickness cue
      const edgeW = Math.max(3, Math.round(width * 0.06));
      const edge = ctx.createLinearGradient(width - edgeW, 0, width, 0);
      edge.addColorStop(0, kind === "dark" ? "rgba(210,180,140,0.22)" : "rgba(255,245,220,0.55)");
      edge.addColorStop(0.45, kind === "dark" ? "rgba(190,160,120,0.45)" : "rgba(245,230,200,0.85)");
      edge.addColorStop(1, kind === "dark" ? "rgba(160,130,95,0.55)" : "rgba(230,210,175,0.95)");
      ctx.fillStyle = edge;
      ctx.fillRect(width - edgeW, 0, edgeW, height);
      ctx.fillStyle = kind === "dark" ? "rgba(0,0,0,0.25)" : "rgba(80,50,30,0.18)";
      ctx.fillRect(width - edgeW, 0, 1, height);
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
  }, [kind, tone]);

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
      }}
    />
  );
}

/** Shelf plank face. Hex only inside this 2D paint. */
function LedgeWash(): JSX.Element {
  const theme = useGrokTheme();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const kind = theme.kind;

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

      if (kind === "dark") {
        const base = ctx.createLinearGradient(0, 0, 0, height);
        base.addColorStop(0, "#5a3a24");
        base.addColorStop(0.35, "#3e2818");
        base.addColorStop(1, "#2a1a10");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < Math.ceil(width / 5); i += 1) {
          ctx.fillStyle = `rgba(12, 6, 2, ${0.06 + (i % 4) * 0.02})`;
          ctx.fillRect(i * 5, 0, 1 + (i % 2), height);
        }
        const top = ctx.createLinearGradient(0, 0, 0, 8);
        top.addColorStop(0, "rgba(200,150,100,0.28)");
        top.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = top;
        ctx.fillRect(0, 0, width, 8);
      } else {
        const base = ctx.createLinearGradient(0, 0, 0, height);
        base.addColorStop(0, "#d4b898");
        base.addColorStop(0.4, "#b89068");
        base.addColorStop(1, "#987048");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < Math.ceil(width / 5); i += 1) {
          ctx.fillStyle = `rgba(60, 35, 15, ${0.05 + (i % 4) * 0.015})`;
          ctx.fillRect(i * 5, 0, 1, height);
        }
      }
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
  }, [kind]);

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
      }}
    />
  );
}

function Spine({ bot, index }: { bot: Bot; index: number }): JSX.Element {
  const theme = useGrokTheme();
  const spine: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flex: "0 1 72px",
    width: 72,
    minWidth: 64,
    maxWidth: 84,
    minHeight: 280,
    boxSizing: "border-box",
    padding: "14px 6px 10px",
    borderRadius: 5,
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.elevated,
    boxShadow: `2px 10px 18px ${theme.border.subtle}, 0 2px 0 ${theme.border.default}`,
    textDecoration: "none",
    color: theme.text.primary,
    overflow: "hidden",
  };
  const install: CSSProperties = {
    ...theme.font.caption,
    fontFamily: theme.font.family,
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    minHeight: 56,
    boxSizing: "border-box",
    padding: "8px 4px",
    borderRadius: 6,
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.base,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
    position: "relative",
    zIndex: 1,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={spine}>
      <SpineWash index={index} />
      <div
        style={{
          width: 36,
          height: 36,
          flex: "0 0 36px",
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${theme.border.default}`,
          background: theme.fill.secondary,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={36} height={36} fit="cover" />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
          minHeight: 120,
          position: "relative",
          zIndex: 1,
          paddingRight: 2,
        }}
      >
        <p
          style={{
            ...theme.font.body1,
            fontFamily: SERIF,
            fontWeight: theme.weight.semibold,
            margin: 0,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.06em",
            overflowWrap: "anywhere",
            maxHeight: 180,
            textAlign: "center",
            color: theme.text.primary,
          }}
        >
          {bot.name}
        </p>
      </div>
      <span style={install}>
        <Down color={theme.text.primary} />
        Install
      </span>
    </a>
  );
}

function Ribbon({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const text = showDisplay ? `${link.label} · ${link.display}` : link.label;
  const ribbon: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    flex: "0 1 44px",
    width: 44,
    minWidth: 40,
    maxWidth: 52,
    minHeight: 132,
    boxSizing: "border-box",
    padding: "14px 6px 22px",
    background: theme.text.accent,
    color: theme.bg.base,
    textDecoration: "none",
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), 50% 100%, 0 calc(100% - 14px))",
    boxShadow: `0 10px 18px ${theme.border.subtle}`,
    ...theme.font.caption,
    fontFamily: theme.font.family,
    fontWeight: theme.weight.semibold,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={ribbon} title={text}>
      <span
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          letterSpacing: "0.04em",
          overflowWrap: "anywhere",
          maxHeight: 96,
          textAlign: "center",
        }}
      >
        {text}
      </span>
    </a>
  );
}

function Ledge({ showLinksLabel }: { showLinksLabel: boolean }): JSX.Element {
  const theme = useGrokTheme();
  return (
    <div style={{ width: "100%", minWidth: 0, position: "relative", zIndex: 1 }}>
      {/* Top shelf surface (plank thickness cue) */}
      <div
        style={{
          position: "relative",
          height: 12,
          borderRadius: "3px 3px 0 0",
          overflow: "hidden",
          border: `1px solid ${theme.border.strong}`,
          borderBottom: "none",
          background: theme.fill.secondary,
        }}
      >
        <LedgeWash />
      </div>
      {/* Front face of the plank */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          minHeight: 32,
          padding: "8px 14px",
          boxSizing: "border-box",
          borderRadius: "0 0 4px 4px",
          overflow: "hidden",
          background: theme.bg.elevated,
          boxShadow: `0 14px 22px ${theme.border.subtle}`,
          border: `1px solid ${theme.border.strong}`,
          borderTop: "none",
        }}
      >
        <LedgeWash />
        {showLinksLabel ? (
          <>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: theme.weight.semibold,
                color: theme.text.primary,
                position: "relative",
                zIndex: 1,
              }}
            >
              Links
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: theme.radius.full,
                background: theme.text.accent,
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const hasShelf = bots.length > 0 || links.length > 0;
  const page: CSSProperties = {
    position: "relative",
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
  };
  const band: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 440,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(28px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 22,
  };

  return (
    <div id={LAYOUT} style={page}>
      <ShelfWash />
      <div style={band}>
        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 18,
            letterSpacing: "0.04em",
            color: theme.text.accent,
            textAlign: "center",
          }}
        >
          Shelf
        </p>

        <header style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
          <div
            style={{
              width: 64,
              height: 64,
              flex: "0 0 64px",
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: `2px solid ${theme.text.accent}`,
              background: theme.fill.secondary,
              boxShadow: `0 4px 12px ${theme.border.subtle}`,
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={64} height={64} fit="cover" />
          </div>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h1
              style={{
                ...theme.font.heading2,
                fontFamily: SERIF,
                fontWeight: theme.weight.semibold,
                letterSpacing: "-0.02em",
                margin: 0,
                overflowWrap: "anywhere",
                color: theme.text.primary,
              }}
            >
              {DISPLAY_NAME}
            </h1>
            {handle.length > 0 ? (
              <p
                style={{
                  ...theme.font.subtext,
                  fontFamily: theme.font.family,
                  color: theme.text.accent,
                  margin: "4px 0 0",
                  overflowWrap: "anywhere",
                }}
              >
                {handle}
              </p>
            ) : null}
            <p
              style={{
                ...theme.font.subtext,
                fontFamily: theme.font.family,
                color: theme.text.secondary,
                margin: "6px 0 0",
                overflowWrap: "anywhere",
              }}
            >
              {BIO}
            </p>
          </div>
        </header>

        {hasShelf ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {bots.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  width: "100%",
                  minWidth: 0,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 0,
                  marginBottom: -2,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {bots.map((bot, index) => (
                  <Spine key={`${bot.href}-${index}`} bot={bot} index={index} />
                ))}
              </div>
            ) : null}

            <Ledge showLinksLabel={links.length > 0} />

            {links.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  width: "100%",
                  minWidth: 0,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingTop: 0,
                  marginTop: -2,
                  position: "relative",
                  zIndex: 0,
                }}
              >
                {links.map((link, index) => (
                  <Ribbon key={`${link.href}-${index}`} link={link} />
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            fontFamily: theme.font.family,
            color: theme.text.tertiary,
            margin: 0,
            width: "100%",
            minWidth: 0,
            overflowWrap: "anywhere",
            textAlign: "center",
          }}
        >
          {FOOTER}
        </p>
      </div>
    </div>
  );
}
