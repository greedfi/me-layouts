import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Avatar at center; bots as Install satellites on a ring; quiet link chips outer.
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

export const LAYOUT = "orbit" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function Satellite({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const card: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    width: "100%",
    minWidth: 0,
    maxWidth: 160,
    boxSizing: "border-box",
    padding: 12,
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
    minHeight: 44,
    padding: "0 14px",
    boxSizing: "border-box",
    borderRadius: theme.radius.full,
    border: `1px solid ${theme.border.strong}`,
    fontWeight: theme.weight.medium,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${theme.border.subtle}`,
          background: theme.fill.secondary,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={48} height={48} fit="cover" />
      </div>
      <p
        style={{
          ...theme.font.body1,
          fontWeight: theme.weight.semibold,
          margin: 0,
          textAlign: "center",
          overflowWrap: "anywhere",
          width: "100%",
          minWidth: 0,
        }}
      >
        {bot.name}
      </p>
      <span style={pill}>Install</span>
      <p
        style={{
          ...theme.font.caption,
          color: theme.text.secondary,
          margin: 0,
          textAlign: "center",
          overflowWrap: "anywhere",
          width: "100%",
          minWidth: 0,
        }}
      >
        {bot.desc}
      </p>
    </a>
  );
}

function QuietChip({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const chip: CSSProperties = {
    ...theme.font.subtext,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "0 16px",
    boxSizing: "border-box",
    borderRadius: theme.radius.full,
    border: `1px solid ${theme.border.default}`,
    background: theme.bg.elevated,
    textDecoration: "none",
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
    overflowWrap: "anywhere",
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={chip}>
      {link.label}
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
    alignItems: "center",
    gap: 24,
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "8%",
              borderRadius: theme.radius.full,
              border: `1px solid ${theme.border.strong}`,
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "22%",
              borderRadius: theme.radius.full,
              border: `1px solid ${theme.border.subtle}`,
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: 104,
              height: 104,
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: `2px solid ${theme.border.default}`,
              background: theme.fill.secondary,
              flex: "0 0 104px",
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={104} height={104} fit="cover" />
          </div>
          {bots.length > 0 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                pointerEvents: "none",
              }}
            >
              {bots.map((bot, index) => {
                const count = Math.max(bots.length, 1);
                const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
                const radius = 42;
                const left = 50 + radius * Math.cos(angle);
                const top = 50 + radius * Math.sin(angle);
                return (
                  <div
                    key={`${bot.href}-${index}`}
                    style={{
                      position: "absolute",
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "auto",
                      width: "42%",
                      maxWidth: 150,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Satellite bot={bot} />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, gap: 8, textAlign: "center" }}>
          <h1
            style={{
              ...theme.font.heading1,
              fontWeight: theme.weight.semibold,
              letterSpacing: "-0.04em",
              margin: 0,
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
              margin: 0,
              maxWidth: 420,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {BIO}
          </p>
        </header>

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
              <span style={{ flex: "1 1 auto", height: 1, background: theme.border.subtle, minWidth: 0 }} />
              <span style={{ ...theme.font.subtext, fontWeight: theme.weight.semibold, color: theme.text.primary, flexShrink: 0 }}>
                Quiet Links
              </span>
              <span style={{ flex: "1 1 auto", height: 1, background: theme.border.subtle, minWidth: 0 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", width: "100%", minWidth: 0 }}>
              {links.map((link, index) => (
                <QuietChip key={`${link.href}-${index}`} link={link} />
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
