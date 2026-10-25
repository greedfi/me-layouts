import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Tall vertical book-spine Install strips for bots; links as bookmark rows under.
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

function Spine({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const spine: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flex: "1 1 0",
    minWidth: 72,
    maxWidth: 120,
    minHeight: 280,
    boxSizing: "border-box",
    padding: "14px 10px",
    borderRadius: 10,
    border: `1px solid ${theme.border.default}`,
    background: theme.bg.elevated,
    textDecoration: "none",
    color: theme.text.primary,
  };
  const install: CSSProperties = {
    ...theme.font.caption,
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
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={spine}>
      <div
        style={{
          width: 44,
          height: 44,
          flex: "0 0 44px",
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${theme.border.subtle}`,
          background: theme.fill.secondary,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={44} height={44} fit="cover" />
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
        }}
      >
        <p
          style={{
            ...theme.font.body1,
            fontWeight: theme.weight.semibold,
            margin: 0,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.04em",
            overflowWrap: "anywhere",
            maxHeight: 180,
            textAlign: "center",
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

function Bookmark({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    minWidth: 0,
    minHeight: 48,
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: "0 0 12px 12px",
    border: `1px solid ${theme.border.subtle}`,
    borderTop: "none",
    background: theme.fill.secondary,
    textDecoration: "none",
    color: theme.text.primary,
    ...theme.font.subtext,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span
        style={{
          width: 8,
          height: 28,
          flex: "0 0 8px",
          borderRadius: 4,
          background: theme.text.accent,
        }}
      />
      <span style={{ fontWeight: theme.weight.semibold, overflowWrap: "anywhere", minWidth: 0 }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ color: theme.text.tertiary, overflowWrap: "anywhere", minWidth: 0, flex: "1 1 auto" }}>
          · {link.display}
        </span>
      ) : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const page: CSSProperties = {
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
  };
  const band: CSSProperties = {
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
    alignItems: "stretch",
    gap: 24,
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
          <div
            style={{
              width: 64,
              height: 64,
              flex: "0 0 64px",
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: `2px solid ${theme.border.default}`,
              background: theme.fill.secondary,
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={64} height={64} fit="cover" />
          </div>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h1
              style={{
                ...theme.font.heading2,
                fontWeight: theme.weight.semibold,
                letterSpacing: "-0.03em",
                margin: 0,
                overflowWrap: "anywhere",
              }}
            >
              {DISPLAY_NAME}
            </h1>
            {handle.length > 0 ? (
              <p style={{ ...theme.font.subtext, color: theme.text.accent, margin: "4px 0 0", overflowWrap: "anywhere" }}>{handle}</p>
            ) : null}
            <p
              style={{
                ...theme.font.subtext,
                color: theme.text.secondary,
                margin: "6px 0 0",
                overflowWrap: "anywhere",
              }}
            >
              {BIO}
            </p>
          </div>
        </header>

        {bots.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 12,
                width: "100%",
                minWidth: 0,
                overflowX: "auto",
                paddingBottom: 4,
                alignItems: "stretch",
              }}
            >
              {bots.map((bot, index) => (
                <Spine key={`${bot.href}-${index}`} bot={bot} />
              ))}
            </div>
            <div
              style={{
                marginTop: 8,
                height: 14,
                borderRadius: 8,
                background: theme.fill.secondary,
                border: `1px solid ${theme.border.subtle}`,
              }}
            />
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  ...theme.font.label,
                  letterSpacing: "0.14em",
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
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", minWidth: 0 }}>
              {links.map((link, index) => (
                <Bookmark key={`${link.href}-${index}`} link={link} />
              ))}
            </div>
          </section>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            color: theme.text.tertiary,
            margin: 0,
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
