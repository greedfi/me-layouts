import { useGrokTheme, Image, useEffect, useRef, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Tall vertical book-spine Install strips on a wood ledge; links hang as ribbons under.
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

function Spine({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const spine: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flex: "1 1 64px",
    minWidth: 64,
    maxWidth: 100,
    minHeight: 260,
    boxSizing: "border-box",
    padding: "12px 8px",
    borderRadius: "8px 8px 4px 4px",
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.elevated,
    boxShadow: `0 8px 16px ${theme.border.subtle}`,
    textDecoration: "none",
    color: theme.text.primary,
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
    borderRadius: 8,
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.base,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={spine}>
      <div
        style={{
          width: 40,
          height: 40,
          flex: "0 0 40px",
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${theme.border.default}`,
          background: theme.fill.secondary,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={40} height={40} fit="cover" />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
          minHeight: 110,
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
            maxHeight: 170,
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
      <div
        style={{
          height: 10,
          borderRadius: "4px 4px 0 0",
          background: theme.fill.secondary,
          border: `1px solid ${theme.border.default}`,
          borderBottom: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          minHeight: 28,
          padding: "6px 14px",
          boxSizing: "border-box",
          borderRadius: "0 0 6px 6px",
          background: theme.bg.elevated,
          boxShadow: `0 12px 20px ${theme.border.subtle}`,
          border: `1px solid ${theme.border.strong}`,
          borderTop: "none",
        }}
      >
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
                  gap: 10,
                  width: "100%",
                  minWidth: 0,
                  alignItems: "stretch",
                  justifyContent: "center",
                  paddingBottom: 0,
                  marginBottom: -2,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {bots.map((bot, index) => (
                  <Spine key={`${bot.href}-${index}`} bot={bot} />
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
