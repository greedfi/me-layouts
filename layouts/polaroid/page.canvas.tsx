import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — Polaroid.
 * A hand of Instant-film prints: real paper frames (data:image), square photo
 * windows, and the bot name + Install on the thick caption strip. Featured
 * print (bots[0]) lies on top. Quiet links and the footer sit below the fan.
 * NO pack wordmark — header is avatar + display name + handle + bio only.
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

/**
 * Instant-film sheet, in px. The photo window and caption strip are placed
 * from these so the paper image and the overlays stay aligned.
 * Side/top border is thin; the caption band is the deep white well.
 */
const FRAME_W = 400;
const FRAME_H = 526;
const PAD_X = 26;
const PAD_TOP = 24;
const PHOTO = 348;

/** Ink on the film caption. Paper white is the material; this is the ink. */
const FILM_INK = "#1a1918";
/** Emulsion under the photo, visible only until the icon paints. */
const FILM_WELL = "#141311";

/** Warm Instant-film sheets. Decorative materials only — not theme surfaces. */
const FILM: readonly string[] = ["data:image/jpeg;base64,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", "data:image/jpeg;base64,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", "data:image/jpeg;base64,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"];

function pct(part: number, whole: number): string {
  return `${(part / whole) * 100}%`;
}

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

type Pose = {
  rotate: number;
  left: number;
  top: number;
  z: number;
};

/** Featured print (index 0) is front-left and on top. Later prints fan out behind it. */
function poseFor(index: number, count: number): Pose {
  if (count <= 1) return { rotate: -7, left: 12, top: 8, z: 2 };
  if (count === 2) {
    return index === 0
      ? { rotate: -8, left: 6, top: 18, z: 4 }
      : { rotate: 8.5, left: 36, top: 8, z: 1 };
  }
  if (count === 3) {
    const hand: readonly Pose[] = [
      { rotate: -8.5, left: 6, top: 22, z: 6 },
      { rotate: 8.5, left: 36, top: 10, z: 3 },
      { rotate: 2.5, left: 20, top: 0, z: 1 },
    ];
    return hand[index] ?? hand[0];
  }
  if (index === 0) return { rotate: -8, left: 4, top: 22, z: count + 4 };
  const span = count - 1;
  const t = (index - 1) / span;
  const rots = [8.5, -3.5, 6, -6.5, 3];
  return {
    rotate: rots[(index - 1) % rots.length] ?? 4,
    left: 12 + t * 26,
    top: index % 2 === 0 ? 0 : 8,
    z: count - index,
  };
}

function FilmCard({ bot, index, count }: { bot: Bot; index: number; count: number }): JSX.Element {
  const theme = useGrokTheme();
  const pose = poseFor(index, count);
  const single = count <= 1;
  const paper = FILM[index % FILM.length] ?? FILM[0];
  const card: CSSProperties = {
    position: "absolute",
    display: "block",
    width: single ? "74%" : "56%",
    left: single ? "50%" : `${pose.left}%`,
    top: pose.top,
    zIndex: pose.z,
    aspectRatio: `${FRAME_W} / ${FRAME_H}`,
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    textDecoration: "none",
    color: FILM_INK,
    lineHeight: 0,
    background: "#e0dfdd",
    transform: single ? `translateX(-50%) rotate(${pose.rotate}deg)` : `rotate(${pose.rotate}deg)`,
    transformOrigin: "center center",
    boxShadow: "0 14px 28px rgba(0,0,0,0.48), 0 2px 6px rgba(0,0,0,0.38)",
    borderRadius: 2,
  };
  const captionTop = PAD_TOP + PHOTO;
  const captionH = FRAME_H - captionTop;
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 2, pointerEvents: "none" }}>
        <Image src={paper} alt="" width="100%" />
      </div>
      <div
        style={{
          position: "absolute",
          left: pct(PAD_X, FRAME_W),
          top: pct(PAD_TOP, FRAME_H),
          width: pct(PHOTO, FRAME_W),
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: FILM_WELL,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.55)",
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width="100%" fit="cover" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: pct(captionTop, FRAME_H),
          height: pct(captionH, FRAME_H),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: "0 10%",
          boxSizing: "border-box",
          lineHeight: 1.15,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: theme.font.family,
            fontSize: "clamp(13px, 3.8vw, 16px)",
            fontWeight: theme.weight.semibold,
            letterSpacing: "-0.02em",
            color: FILM_INK,
            maxWidth: "100%",
            overflow: "hidden",
            overflowWrap: "anywhere",
          }}
        >
          {bot.name}
        </span>
        <span
          style={{
            fontFamily: theme.font.family,
            fontSize: "clamp(12px, 3.4vw, 15px)",
            fontWeight: theme.weight.medium,
            letterSpacing: "-0.01em",
            color: FILM_INK,
          }}
        >
          Install
        </span>
      </div>
    </a>
  );
}

function QuietLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  const row: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    minWidth: 0,
    minHeight: 48,
    boxSizing: "border-box",
    padding: "6px 2px",
    textDecoration: "none",
    color: theme.text.primary,
  };
  const mark = link.label.trim().slice(0, 1) || "·";
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={row}>
      <span
        style={{
          ...theme.font.subtext,
          width: 36,
          height: 36,
          flex: "0 0 36px",
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px solid ${theme.border.strong}`,
          background: "transparent",
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
  const bio = BIO.trim();
  const count = bots.length;
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
    paddingTop: "max(32px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(36px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  };

  return (
    <div id={LAYOUT} style={page}>
      <div style={band}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: theme.radius.full,
              overflow: "hidden",
              flex: "0 0 96px",
              background: theme.fill.secondary,
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={96} height={96} fit="cover" />
          </div>
          <h1
            style={{
              ...theme.font.heading1,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: "16px 0 0",
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p
              style={{
                ...theme.font.subtext,
                color: theme.text.secondary,
                margin: "8px 0 0",
                overflowWrap: "anywhere",
              }}
            >
              {handle}
            </p>
          ) : null}
          {bio.length > 0 ? (
            <p
              style={{
                ...theme.font.subtext,
                color: theme.text.secondary,
                margin: "6px 0 0",
                maxWidth: 360,
                width: "100%",
                minWidth: 0,
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap",
              }}
            >
              {bio}
            </p>
          ) : null}
        </header>

        {count > 0 ? (
          <section
            style={{
              position: "relative",
              width: "100%",
              minWidth: 0,
              height: 0,
              paddingBottom: count <= 1 ? "108%" : "90%",
              overflow: "visible",
            }}
          >
            {bots.map((bot, index) => ({ bot, index })).reverse().map(({ bot, index }) => (
              <FilmCard key={`${bot.href}-${index}`} bot={bot} index={index} count={count} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <section style={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
              <span
                style={{
                  ...theme.font.subtext,
                  fontWeight: theme.weight.semibold,
                  color: theme.text.primary,
                  flexShrink: 0,
                }}
              >
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
