import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

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

export const LAYOUT = "terminal" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function commentLines(bio: string): readonly string[] {
  const lines = bio.split(/\r?\n/);
  return lines.length > 0 ? lines : [""];
}

function Rule(): JSX.Element {
  const theme = useGrokTheme();
  return (
    <div
      style={{
        width: "100%",
        borderTop: `1px dashed ${theme.text.success}`,
        opacity: 0.45,
      }}
    />
  );
}

function BotRow({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const row: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    boxSizing: "border-box",
    padding: "8px 0",
    textDecoration: "none",
    color: theme.text.success,
    fontFamily: theme.font.mono,
    ...theme.font.code,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={row}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
        <div
          style={{
            width: 18,
            height: 18,
            flex: "0 0 18px",
            borderRadius: 4,
            overflow: "hidden",
            background: theme.fill.secondary,
          }}
        >
          <Image src={bot.src} alt={`${bot.name} icon`} width={18} height={18} fit="cover" />
        </div>
        <span style={{ flex: "1 1 auto", minWidth: 0, overflowWrap: "anywhere" }}>
          |-- <span style={{ fontWeight: theme.weight.semibold }}>[install]</span> {bot.name}
        </span>
      </div>
      <span style={{ opacity: 0.72, minWidth: 0, overflowWrap: "anywhere" }}># {bot.desc}</span>
      <span style={{ minWidth: 0, overflowWrap: "anywhere", textDecoration: "underline" }}>{bot.href}</span>
    </a>
  );
}

function LinkRow({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 2,
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    boxSizing: "border-box",
    padding: "6px 0",
    textDecoration: "none",
    color: theme.text.success,
    fontFamily: theme.font.mono,
    ...theme.font.code,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>&gt; {link.label}</span>
      {showDisplay ? (
        <span style={{ opacity: 0.72, minWidth: 0, overflowWrap: "anywhere" }}># {link.display}</span>
      ) : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  const notes = commentLines(BIO);
  const page: CSSProperties = {
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.success,
    fontFamily: theme.font.mono,
    ...theme.font.code,
    boxSizing: "border-box",
  };
  const band: CSSProperties = {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(20px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(28px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14,
  };
  const line: CSSProperties = {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div
              style={{
                width: 22,
                height: 22,
                flex: "0 0 22px",
                borderRadius: theme.radius.full,
                overflow: "hidden",
                border: `1px solid ${theme.text.success}`,
              }}
            >
              <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={22} height={22} fit="cover" />
            </div>
            <p style={{ ...line, fontWeight: theme.weight.semibold }}>&gt; name: {DISPLAY_NAME}</p>
          </div>
          {handle.length > 0 ? <p style={line}>&gt; handle: {handle}</p> : null}
          {notes.map((note, index) => (
            <p key={index} style={{ ...line, opacity: 0.72 }}>
              # {note}
            </p>
          ))}
        </header>

        <Rule />

        {bots.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", minWidth: 0 }}>
            <p style={{ ...line, fontWeight: theme.weight.semibold }}>~ bots/</p>
            <p style={{ ...line, opacity: 0.72 }}># pick one.</p>
            {bots.map((bot, index) => (
              <BotRow key={`${bot.href}-${index}`} bot={bot} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
            <Rule />
            <p style={{ ...line, marginTop: 12 }}>&gt; links</p>
            {links.map((link, index) => (
              <LinkRow key={`${link.href}-${index}`} link={link} />
            ))}
          </section>
        ) : null}

        <Rule />
        <p style={{ ...line, opacity: 0.72 }}># {FOOTER}</p>
      </div>
    </div>
  );
}
