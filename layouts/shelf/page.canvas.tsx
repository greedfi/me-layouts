import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";


/**
 * Pinned .me pack — Shelf.
 * Still-faithful materials: wall / spine / ledge faces are JPEG data:image crops
 * from the Shelf still (dark wood grain), not flat theme panels. Page-edge is a
 * light paper strip. Soft shadows under books and ribbons.
 * NO pack wordmark — header starts at avatar + display name (owner lock).
 * Replace the constants and the bots/links arrays. Leave the JSX alone. See README.md.
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
const bots: readonly Bot[] = [
  {
    name: "__BOT0_NAME__",
    desc: "__BOT0_DESC__",
    src: "__BOT0_ICON__",
    href: "__BOT0_HREF__",
  },
];

// Filler replaces this array from owner setup answers.
const links: readonly Link[] = [
  {
    label: "__LINK0_LABEL__",
    href: "__LINK0_HREF__",
    display: "__LINK0_DISPLAY__",
  },
];

export const LAYOUT = "shelf" as const;

/** Serif stack for still-matching name and spine titles. */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/** Still-cropped wood / paper tiles (data:image JPEG). Decorative materials only. */
const WOOD_WALL = "data:image/jpeg;base64,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";

const WOOD_SPINES: readonly string[] = [
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,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",
];

const WOOD_LEDGE_TOP = "data:image/jpeg;base64,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";
const WOOD_LEDGE_FACE = "data:image/jpeg;base64,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";
const PAGE_EDGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCACgABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABgAHAQL/xAAhEAACAQMEAwEAAAAAAAAAAAAAASIFIZECAxITIzGhMv/EABUBAQEAAAAAAAAAAAAAAAAAAAAE/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0upLTK4OqS0ykMqm1KLB9TalFkagV31o7Xcju+12uLyQGtVLlL1gH1PnL1gX1Nfqf0H1Jfqf0Axv8+12WCPO8vK/J9IDWKm9ErPAPqfC9ngY1JuUUD6m3eKyAW3uHa7PBHd5vtcUQGs1Ja5XB9TWu92LaktEroH1JaJXWADW+tfa7sjxvrR2u/wgNaqbUosH1NqUWMalyl6wD6nzl6wAV32u1xeSPW/z7XZYIDV6mv1P6D6kv1P6L6m9ErPAPqfC9ngAvvLyvyfSLe4drs8EBrNSblFA+pt3isjGpLXK4Pqa13uwC2832uKI7vrX2u7IDVaktEroH1JaJXWBlU2pRYPqbUosArvrR2u/wju+12uLyQGtVLlL1gH1PnL1gX1Nfqf0H1Jfqf0Axv8APtdlgjzvLyvyfSA1ipvRKzwD6nwvZ4GNSblFA+pt3isgFt7h2uzwR3fb7XFEB//Z";


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

/** Split "Writer.promo" → base + accent suffix; ".promo" → empty base + suffix. */
function splitBotName(name: string): { base: string; suffix: string } {
  const i = name.indexOf(".");
  if (i === -1) return { base: name, suffix: "" };
  if (i === 0) return { base: "", suffix: name };
  return { base: name.slice(0, i), suffix: name.slice(i) };
}

function woodBg(uri: string, extra?: CSSProperties): CSSProperties {
  return {
    backgroundImage: `url(${uri})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    ...extra,
  };
}

function Spine({ bot, index = 0 }: { bot: Bot; index?: number }): JSX.Element {
  const theme = useGrokTheme();
  const wood = WOOD_SPINES[index % WOOD_SPINES.length];
  const { base, suffix } = splitBotName(bot.name);
  const accent = theme.text.accent;
  const spine: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flex: "0 1 78px",
    width: 78,
    minWidth: 68,
    maxWidth: 88,
    minHeight: 300,
    height: 300,
    boxSizing: "border-box",
    padding: "12px 7px 10px",
    borderRadius: 6,
    border: `1px solid ${theme.border.strong}`,
    ...woodBg(wood, { backgroundColor: theme.bg.elevated }),
    boxShadow: `2px 12px 22px ${theme.border.subtle}, 0 2px 0 ${theme.border.default}`,
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
    gap: 3,
    width: "100%",
    minHeight: 52,
    boxSizing: "border-box",
    padding: "7px 4px",
    borderRadius: 7,
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.base,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
    position: "relative",
    zIndex: 2,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={spine}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 5,
          ...woodBg(PAGE_EDGE, { backgroundColor: theme.fill.secondary, backgroundSize: "100% 100%" }),
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${theme.border.subtle} 0%, transparent 14%, transparent 78%, ${theme.border.strong} 100%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          flex: "0 0 38px",
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${theme.border.strong}`,
          background: theme.fill.secondary,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={38} height={38} fit="cover" />
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
          minHeight: 140,
          position: "relative",
          zIndex: 2,
          paddingRight: 4,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 15,
            fontWeight: theme.weight.semibold,
            writingMode: "vertical-rl",
            letterSpacing: "0.05em",
            overflowWrap: "anywhere",
            maxHeight: 190,
            textAlign: "center",
            color: theme.text.primary,
          }}
        >
          {base.length > 0 ? <span>{base}</span> : null}
          {suffix.length > 0 ? <span style={{ color: accent }}>{suffix}</span> : null}
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
    flex: "0 1 46px",
    width: 46,
    minWidth: 40,
    maxWidth: 54,
    minHeight: 148,
    height: 148,
    boxSizing: "border-box",
    padding: "16px 6px 28px",
    background: `linear-gradient(90deg, ${theme.text.accent} 0%, ${theme.text.accent} 45%, ${theme.text.accent} 100%)`,
    color: theme.bg.base,
    textDecoration: "none",
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), 50% 100%, 0 calc(100% - 16px))",
    boxShadow: `2px 12px 18px ${theme.border.subtle}, 0 4px 8px ${theme.border.default}`,
    ...theme.font.caption,
    fontFamily: theme.font.family,
    fontWeight: theme.weight.semibold,
    position: "relative",
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={ribbon} title={text}>
      <span
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.06em",
          overflowWrap: "anywhere",
          maxHeight: 110,
          textAlign: "center",
          color: theme.bg.base,
          fontSize: 11,
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
    <div style={{ width: "100%", minWidth: 0, position: "relative", zIndex: 2 }}>
      <div
        style={{
          position: "relative",
          height: 14,
          borderRadius: "4px 4px 0 0",
          overflow: "hidden",
          border: `1px solid ${theme.border.strong}`,
          borderBottom: "none",
          ...woodBg(WOOD_LEDGE_TOP, { backgroundColor: theme.fill.secondary }),
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 36,
          padding: "10px 14px",
          boxSizing: "border-box",
          borderRadius: "0 0 5px 5px",
          overflow: "hidden",
          ...woodBg(WOOD_LEDGE_FACE, { backgroundColor: theme.bg.elevated, backgroundSize: "cover" }),
          boxShadow: `0 16px 28px ${theme.border.subtle}, 0 4px 8px ${theme.border.default}`,
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
                letterSpacing: "0.2em",
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
                width: 7,
                height: 7,
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
    ...woodBg(WOOD_WALL, { backgroundColor: theme.bg.base }),
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
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 28%, ${theme.border.subtle} 0%, transparent 55%, ${theme.border.strong} 100%)`,
          zIndex: 0,
        }}
      />
      <div style={band}>
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
