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

type TileTone = {
  wash: string;
  ink: string;
  button: string;
  label: string;
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

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function tileTone(theme: ReturnType<typeof useGrokTheme>, index: number): TileTone {
  if (index % 2 === 0) {
    return {
      wash: theme.fill.accentSubtle,
      ink: theme.text.accent,
      button: theme.fill.accent,
      label: theme.text.onColor,
    };
  }
  return {
    wash: theme.fill.warningSubtle,
    ink: theme.text.warning,
    button: theme.text.warning,
    label: theme.bg.base,
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

function InstallTile({ bot, index }: { bot: Bot; index: number }): JSX.Element {
  const theme = useGrokTheme();
  const tone = tileTone(theme, index);
  const card: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: 18,
    borderRadius: 22,
    border: `1px solid ${theme.border.default}`,
    background: tone.wash,
    textDecoration: "none",
    color: theme.text.primary,
  };
  const button: CSSProperties = {
    ...theme.font.subtext,
    alignSelf: "flex-end",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    padding: "0 22px",
    boxSizing: "border-box",
    borderRadius: 14,
    background: tone.button,
    color: tone.label,
    fontWeight: theme.weight.semibold,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0 }}>
        <div
          style={{
            width: 64,
            height: 64,
            flex: "0 0 64px",
            borderRadius: 16,
            overflow: "hidden",
            background: theme.bg.elevated,
            border: `1px solid ${theme.border.subtle}`,
          }}
        >
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
          color: tone.ink,
          fontWeight: theme.weight.semibold,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: 0,
          minWidth: 0,
          overflowWrap: "anywhere",
        }}
      >
        {bot.desc}
      </p>
      <span style={button}>
        Install
        <Arrow color={tone.label} />
      </span>
    </a>
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    textDecoration: "none",
    color: theme.text.secondary,
    ...theme.font.subtext,
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span style={{ overflowWrap: "anywhere", minWidth: 0 }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ color: theme.text.tertiary, overflowWrap: "anywhere", minWidth: 0 }}>{link.display}</span>
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
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12, width: "100%", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 40,
                height: 40,
                flex: "0 0 40px",
                borderRadius: theme.radius.full,
                overflow: "hidden",
                border: `1px solid ${theme.border.default}`,
                background: theme.fill.secondary,
              }}
            >
              <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={40} height={40} fit="cover" />
            </div>
            <span
              style={{
                ...theme.font.label,
                color: theme.text.accent,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: theme.weight.semibold,
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              Creator bot by
            </span>
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
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", width: "100%", minWidth: 0 }}>
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
