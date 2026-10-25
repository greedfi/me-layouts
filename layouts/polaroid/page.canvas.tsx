import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack. Replace the constants and the bots/links arrays.
 * Leave the JSX alone. See README.md.
 * Stacked tilted polaroid cards (featured top = bots[0]); Install on caption strip; quiet links below.
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

export const LAYOUT = "polaroid" as const;

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
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

function tiltFor(index: number): number {
  const pattern = [-6, 5, -3, 7, -5, 4];
  return pattern[index % pattern.length] ?? 0;
}

function PolaroidCard({ bot, index, featured }: { bot: Bot; index: number; featured: boolean }): JSX.Element {
  const theme = useGrokTheme();
  const card: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: featured ? "100%" : "92%",
    maxWidth: 280,
    minWidth: 0,
    boxSizing: "border-box",
    padding: 12,
    paddingBottom: 14,
    borderRadius: 4,
    border: `1px solid ${theme.border.default}`,
    background: theme.bg.elevated,
    textDecoration: "none",
    color: theme.text.primary,
    transform: `rotate(${tiltFor(index)}deg)`,
    boxShadow: `0 8px 24px ${theme.border.subtle}`,
  };
  const install: CSSProperties = {
    ...theme.font.subtext,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minHeight: 44,
    minWidth: 120,
    marginTop: 10,
    padding: "0 18px",
    boxSizing: "border-box",
    borderRadius: 8,
    border: `1px solid ${theme.border.strong}`,
    background: theme.fill.secondary,
    fontWeight: theme.weight.semibold,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          overflow: "hidden",
          background: theme.fill.secondary,
          border: `1px solid ${theme.border.subtle}`,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={256} height={256} fit="cover" />
      </div>
      <p
        style={{
          ...theme.font.body1,
          fontWeight: theme.weight.semibold,
          margin: "12px 4px 0",
          textAlign: "center",
          overflowWrap: "anywhere",
        }}
      >
        {bot.name}
      </p>
      {bot.desc.trim().length > 0 ? (
        <p
          style={{
            ...theme.font.caption,
            color: theme.text.secondary,
            margin: "4px 4px 0",
            textAlign: "center",
            overflowWrap: "anywhere",
          }}
        >
          {bot.desc}
        </p>
      ) : null}
      <span style={install}>Install</span>
    </a>
  );
}

function QuietLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
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
  const mark = link.label.trim().slice(0, 1) || "·";
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
          fontWeight: theme.weight.semibold,
        }}
      >
        {mark}
      </span>
      <span style={{ ...theme.font.body1, flex: "0 1 auto", minWidth: 0, overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ ...theme.font.subtext, color: theme.text.tertiary, flex: "1 1 auto", minWidth: 0, overflowWrap: "anywhere" }}>
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
    maxWidth: 440,
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
      <div style={band}>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, gap: 8, textAlign: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: `2px solid ${theme.border.default}`,
              flex: "0 0 88px",
              background: theme.fill.secondary,
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={88} height={88} fit="cover" />
          </div>
          <h1
            style={{
              ...theme.font.heading1,
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
              margin: 0,
              maxWidth: 400,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {BIO}
          </p>
        </header>

        {bots.length > 0 ? (
          <section
            style={{
              position: "relative",
              width: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            {bots.map((bot, index) => (
              <div
                key={`${bot.href}-${index}`}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: index === 0 ? 0 : -12,
                  zIndex: bots.length - index,
                  position: "relative",
                }}
              >
                <PolaroidCard bot={bot} index={index} featured={index === 0} />
              </div>
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
              <span style={{ ...theme.font.subtext, fontWeight: theme.weight.semibold, color: theme.text.primary, flexShrink: 0 }}>
                Quiet Links
              </span>
              <span style={{ flex: "1 1 auto", height: 1, background: theme.border.subtle, minWidth: 0 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
              {links.map((link, index) => (
                <QuietLink key={`${link.href}-${index}`} link={link} />
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
