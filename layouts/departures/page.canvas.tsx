import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Airport board: TIME | BOT | GATE(Install) | STATUS rows from bots; quiet footnote links.
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

export const LAYOUT = "departures" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function padTime(index: number): string {
  const hour = 8 + Math.floor(index / 4);
  const minute = (index % 4) * 15;
  const hh = hour.toString().padStart(2, "0");
  const mm = minute.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function BoardRow({ bot, index }: { bot: Bot; index: number }): JSX.Element {
  const theme = useGrokTheme();
  const mono = { fontFamily: theme.font.mono, ...theme.font.code };
  const row: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "56px minmax(0, 1fr) auto minmax(64px, auto)",
    alignItems: "center",
    gap: 8,
    width: "100%",
    minWidth: 0,
    minHeight: 56,
    boxSizing: "border-box",
    padding: "8px 0",
    borderBottom: `1px solid ${theme.border.subtle}`,
    textDecoration: "none",
    color: theme.text.primary,
  };
  const gate: CSSProperties = {
    ...mono,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 72,
    padding: "0 12px",
    boxSizing: "border-box",
    borderRadius: theme.radius.full,
    background: theme.fill.accent,
    color: theme.text.onColor,
    fontWeight: theme.weight.semibold,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={row}>
      <span style={{ ...mono, color: theme.text.accent, fontWeight: theme.weight.semibold }}>{padTime(index)}</span>
      <span style={{ ...mono, overflowWrap: "anywhere", minWidth: 0, fontWeight: theme.weight.medium }}>{bot.name}</span>
      <span style={gate}>Install</span>
      <span
        style={{
          ...mono,
          color: theme.text.accent,
          textAlign: "right",
          overflowWrap: "anywhere",
          minWidth: 0,
          fontSize: "11px",
          lineHeight: 1.2,
        }}
      >
        {bot.desc.trim().length > 0 ? bot.desc : "ON TIME"}
      </span>
    </a>
  );
}

function FootLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    padding: "4px 0",
    textDecoration: "none",
    color: theme.text.accent,
    fontFamily: theme.font.mono,
    ...theme.font.code,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span>{">"}</span>
      <span style={{ overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? <span style={{ color: theme.text.tertiary, overflowWrap: "anywhere" }}>· {link.display}</span> : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const mono = { fontFamily: theme.font.mono, ...theme.font.code };
  const page: CSSProperties = {
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.mono,
    boxSizing: "border-box",
  };
  const band: CSSProperties = {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(28px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 20,
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
            <div
              style={{
                width: 48,
                height: 48,
                flex: "0 0 48px",
                borderRadius: theme.radius.full,
                overflow: "hidden",
                border: `2px solid ${theme.border.default}`,
                background: theme.fill.secondary,
              }}
            >
              <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={48} height={48} fit="cover" />
            </div>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <h1
                style={{
                  ...mono,
                  fontSize: "22px",
                  lineHeight: 1.1,
                  fontWeight: theme.weight.semibold,
                  margin: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  overflowWrap: "anywhere",
                }}
              >
                {DISPLAY_NAME}
              </h1>
              {handle.length > 0 ? (
                <p style={{ ...mono, color: theme.text.secondary, margin: "4px 0 0", overflowWrap: "anywhere" }}>{handle}</p>
              ) : null}
            </div>
          </div>
          <p
            style={{
              ...mono,
              color: theme.text.accent,
              margin: 0,
              textAlign: "center",
              fontSize: "28px",
              lineHeight: 1.1,
              fontWeight: theme.weight.semibold,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              overflowWrap: "anywhere",
            }}
          >
            Departures
          </p>
          <p style={{ ...mono, color: theme.text.secondary, margin: 0, overflowWrap: "anywhere", width: "100%", minWidth: 0 }}>
            {BIO}
          </p>
        </header>

        {bots.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px minmax(0, 1fr) auto minmax(64px, auto)",
                gap: 8,
                width: "100%",
                minWidth: 0,
                paddingBottom: 8,
                borderBottom: `1px solid ${theme.border.default}`,
                ...mono,
                color: theme.text.secondary,
                fontWeight: theme.weight.semibold,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontSize: "11px",
              }}
            >
              <span>Time</span>
              <span>Bot</span>
              <span>Gate</span>
              <span style={{ textAlign: "right" }}>Status</span>
            </div>
            <div style={{ width: "100%", minWidth: 0 }}>
              {bots.map((bot, index) => (
                <BoardRow key={`${bot.href}-${index}`} bot={bot} index={index} />
              ))}
            </div>
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", minWidth: 0 }}>
            {links.map((link, index) => (
              <FootLink key={`${link.href}-${index}`} link={link} />
            ))}
          </section>
        ) : null}

        <p
          style={{
            ...mono,
            color: theme.text.tertiary,
            margin: 0,
            width: "100%",
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          # {FOOTER}
        </p>
      </div>
    </div>
  );
}
