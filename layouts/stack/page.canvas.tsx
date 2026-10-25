import { useGrokTheme, Image, useEffect, useRef, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
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

export const LAYOUT = "stack" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function BrandWash(): JSX.Element {
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
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.06,
        0,
        width * 0.5,
        height * 0.2,
        Math.max(width, height) * 0.62,
      );
      if (kind === "dark") {
        glow.addColorStop(0, "#3a3428");
        glow.addColorStop(0.42, "#16140f");
        glow.addColorStop(1, "#00000000");
      } else {
        glow.addColorStop(0, "#f3eee6");
        glow.addColorStop(0.5, "#f7f4ef");
        glow.addColorStop(1, "#00000000");
      }
      ctx.fillStyle = glow;
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

function RuledLabel({ label }: { label: string }): JSX.Element {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
      <span
        style={{
          ...theme.font.subtext,
          fontWeight: theme.weight.semibold,
          color: theme.text.primary,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ flex: "1 1 auto", height: 1, background: theme.border.subtle, minWidth: 0 }} />
    </div>
  );
}

function Chevron({ color }: { color: string }): JSX.Element {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M6 3.5 10.5 8 6 12.5"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BotCard({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const card: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: 14,
    borderRadius: 18,
    border: `1px solid ${theme.border.default}`,
    background: theme.bg.elevated,
    textDecoration: "none",
    color: theme.text.primary,
  };
  const pill: CSSProperties = {
    ...theme.font.subtext,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    minHeight: 44,
    padding: "0 16px",
    boxSizing: "border-box",
    borderRadius: theme.radius.full,
    border: `1px solid ${theme.border.strong}`,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div
        style={{
          width: 64,
          height: 64,
          flex: "0 0 64px",
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${theme.border.subtle}`,
          background: theme.fill.secondary,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={64} height={64} fit="cover" />
      </div>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <p
          style={{
            ...theme.font.heading3,
            fontWeight: theme.weight.semibold,
            margin: 0,
            overflowWrap: "anywhere",
          }}
        >
          {bot.name}
        </p>
        <p
          style={{
            ...theme.font.subtext,
            color: theme.text.secondary,
            margin: "4px 0 0",
            overflowWrap: "anywhere",
          }}
        >
          {bot.desc}
        </p>
      </div>
      <span style={pill}>Install</span>
    </a>
  );
}

function LinkRow({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const mark = link.label.trim().slice(0, 1) || "·";
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    boxSizing: "border-box",
    padding: "8px 2px",
    textDecoration: "none",
    color: theme.text.primary,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span
        style={{
          ...theme.font.subtext,
          width: 40,
          height: 40,
          flex: "0 0 40px",
          borderRadius: 12,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.fill.secondary,
          color: theme.text.primary,
          fontWeight: theme.weight.semibold,
        }}
      >
        {mark}
      </span>
      <span style={{ ...theme.font.body1, flex: "0 1 auto", minWidth: 0, overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? (
        <span
          style={{
            ...theme.font.subtext,
            color: theme.text.tertiary,
            flex: "1 1 auto",
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {link.display}
        </span>
      ) : (
        <span style={{ flex: "1 1 auto" }} />
      )}
      <Chevron color={theme.text.tertiary} />
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
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
    maxWidth: 480,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(28px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  };

  return (
    <div id={LAYOUT} style={page}>
      <BrandWash />
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, gap: 10, textAlign: "center" }}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: `2px solid ${theme.border.default}`,
              flex: "0 0 104px",
              background: theme.fill.secondary,
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={104} height={104} fit="cover" />
          </div>
          <h1
            style={{
              ...theme.font.heading1,
              fontSize: "40px",
              lineHeight: 1.05,
              fontWeight: theme.weight.semibold,
              letterSpacing: "-0.04em",
              margin: "8px 0 0",
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p style={{ ...theme.font.body1, color: theme.text.secondary, margin: 0, overflowWrap: "anywhere" }}>{handle}</p>
          ) : null}
          <p
            style={{
              ...theme.font.body1,
              color: theme.text.secondary,
              margin: "4px 0 0",
              maxWidth: 420,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {BIO}
          </p>
        </header>

        {bots.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <RuledLabel label="Bots" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", minWidth: 0 }}>
              {bots.map((bot, index) => (
                <BotCard key={`${bot.href}-${index}`} bot={bot} />
              ))}
            </div>
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <RuledLabel label="Quiet Links" />
            <div style={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
              {links.map((link, index) => (
                <LinkRow key={`${link.href}-${index}`} link={link} />
              ))}
            </div>
          </section>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            color: theme.text.tertiary,
            margin: 0,
            textAlign: "center",
            width: "100%",
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
