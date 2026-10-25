import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Newspaper masthead (name as title); bots[0] above-the-fold hero; rest compact.
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

export const LAYOUT = "broadsheet" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function Down({ color }: { color: string }): JSX.Element {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" style={{ display: "block", flexShrink: 0 }}>
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

function Rule({ thick }: { thick?: boolean }): JSX.Element {
  const theme = useGrokTheme();
  return (
    <div
      style={{
        width: "100%",
        height: thick ? 3 : 1,
        background: theme.text.primary,
        opacity: thick ? 0.85 : 0.35,
      }}
    />
  );
}

function Featured({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const card: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: 16,
    border: `2px solid ${theme.border.strong}`,
    background: theme.bg.elevated,
    textDecoration: "none",
    color: theme.text.primary,
  };
  const install: CSSProperties = {
    ...theme.font.body1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    minHeight: 48,
    boxSizing: "border-box",
    padding: "0 16px",
    border: `1px solid ${theme.border.strong}`,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%", minWidth: 0 }}>
        <div
          style={{
            width: 80,
            height: 80,
            flex: "0 0 80px",
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid ${theme.border.subtle}`,
            background: theme.fill.secondary,
          }}
        >
          <Image src={bot.src} alt={`${bot.name} icon`} width={80} height={80} fit="cover" />
        </div>
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <p
            style={{
              ...theme.font.label,
              color: theme.text.secondary,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: theme.weight.semibold,
              margin: 0,
            }}
          >
            Featured bot
          </p>
          <p
            style={{
              ...theme.font.heading2,
              fontWeight: theme.weight.semibold,
              letterSpacing: "-0.02em",
              margin: "6px 0 0",
              overflowWrap: "anywhere",
            }}
          >
            {bot.name}
          </p>
          <p
            style={{
              ...theme.font.body1,
              color: theme.text.secondary,
              margin: "8px 0 0",
              overflowWrap: "anywhere",
            }}
          >
            {bot.desc}
          </p>
        </div>
      </div>
      <span style={install}>
        <Down color={theme.text.primary} />
        Install
      </span>
    </a>
  );
}

function Compact({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const row: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    minWidth: 0,
    minHeight: 64,
    boxSizing: "border-box",
    padding: "10px 12px",
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
    padding: "0 14px",
    boxSizing: "border-box",
    border: `1px solid ${theme.border.strong}`,
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={row}>
      <div
        style={{
          width: 44,
          height: 44,
          flex: "0 0 44px",
          borderRadius: 6,
          overflow: "hidden",
          border: `1px solid ${theme.border.subtle}`,
          background: theme.fill.secondary,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={44} height={44} fit="cover" />
      </div>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <p style={{ ...theme.font.body1, fontWeight: theme.weight.semibold, margin: 0, overflowWrap: "anywhere" }}>{bot.name}</p>
        <p style={{ ...theme.font.caption, color: theme.text.secondary, margin: "2px 0 0", overflowWrap: "anywhere" }}>{bot.desc}</p>
      </div>
      <span style={pill}>Install</span>
    </a>
  );
}

function Classified({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    boxSizing: "border-box",
    padding: "8px 0",
    borderBottom: `1px solid ${theme.border.subtle}`,
    textDecoration: "none",
    color: theme.text.primary,
    ...theme.font.body1,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
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
  const featured = bots[0];
  const rest = bots.slice(1);
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
    maxWidth: 500,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(28px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 18,
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%", minWidth: 0, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
            <div
              style={{
                width: 56,
                height: 56,
                flex: "0 0 56px",
                borderRadius: theme.radius.full,
                overflow: "hidden",
                border: `2px solid ${theme.border.default}`,
                background: theme.fill.secondary,
              }}
            >
              <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={56} height={56} fit="cover" />
            </div>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <h1
                style={{
                  ...theme.font.heading1,
                  fontWeight: theme.weight.semibold,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {DISPLAY_NAME}
              </h1>
              {handle.length > 0 ? (
                <p style={{ ...theme.font.subtext, color: theme.text.secondary, margin: "4px 0 0", overflowWrap: "anywhere" }}>{handle}</p>
              ) : null}
            </div>
          </div>
          <Rule thick />
          <Rule />
          <p
            style={{
              ...theme.font.body1,
              color: theme.text.secondary,
              margin: 0,
              textAlign: "center",
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {BIO}
          </p>
          <Rule />
        </header>

        {featured ? (
          <section style={{ width: "100%", minWidth: 0 }}>
            <Featured bot={featured} />
          </section>
        ) : null}

        {rest.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", minWidth: 0 }}>
            {rest.map((bot, index) => (
              <Compact key={`${bot.href}-${index}`} bot={bot} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span
                style={{
                  ...theme.font.label,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: theme.weight.semibold,
                  color: theme.text.primary,
                }}
              >
                Classifieds
              </span>
              <span style={{ flex: "1 1 auto", height: 2, background: theme.text.primary, opacity: 0.55, minWidth: 0 }} />
            </div>
            <div style={{ width: "100%", minWidth: 0 }}>
              {links.map((link, index) => (
                <Classified key={`${link.href}-${index}`} link={link} />
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
            textAlign: "center",
          }}
        >
          {FOOTER}
        </p>
      </div>
    </div>
  );
}
