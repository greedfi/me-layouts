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

/** Serif stack for still-matching name and spine titles. */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/** Still-cropped wood / paper tiles (data:image JPEG). Decorative materials only. */
const WOOD_WALL = "data:image/jpeg;base64,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";
const WOOD_SPINES: readonly string[] = [
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBUODAsLDBkSEw8VHhsgHx4bHR0hJTApISMtJB0dKjkqLTEzNjY2ICg7Pzo0PjA1NjP/2wBDAQkJCQwLDBgODhgzIh0iMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzP/wAARCACgAEADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAwQAAQIGBQf/xAA1EAABAwIFAgIHBwUAAAAAAAABAAIRAyEEBRIxQSJREzMGFEJxcoGxFSMkMjRhoSVSkcHx/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIEAAMF/8QAIxEAAgIBBAICAwAAAAAAAAAAAAECMUIEETJDA0ESISMzcf/aAAwDAQACEQMRAD8A+Q4S1MnkCUXPp9VoSL7wEPBbG0mFrPQBh6UOJjkqPNF2DCYAgYVh7DfsmaTNdGq4OHdKYIhuBaT023TbenCapu7/AAllY8aQ+0+JkmaVNvw7bLk2H7qn8I+i62nByDNTAnwBsuRb5VP4B9FRpcjjqcS1SiisJh3Bgmk9wMRZFz79LQm8EhDwNw5toIRM+tg6APckFeauaLetlYZv9NDp24TjzGBYCSATyk6FstZHPZOYgtODpReTt2Suxo0ehb7EzQAm2HbsVyLDNJnwj6LrRJyXN5O1BouuRp+Uz4R9FRpcjhqMTSpRWrSccwTtLrdkf0hgUKOnZAwAmoGASXNgIufkGhRjeLheYuaLOtmcKYy6nIkak7W8kWEAgjhJ4S+XtB3glOVemmzcSAbXSysaND7IORZ0S6HCk2AuRZ5TPhC61p1ZDnIIGrwm3K5JnlM+EKnS5HHUYmlFSkqsn3HstluIa4CY4lEz61KjxvKxlv5z/tTPXOdTpcgE3XnZos62EwI1YVo3lpF0y52qi19+m0JTBkMw7Hg3HBTVaznU9mkyBPKV2NGj1crb60zMcDDS/E4Z2j93AWC48Asb4bhpezpc07gixXQUa9Sg9ldr/DdTcCCNweEzm2UtzvVmWV0wMYROKwbbF0e2zvO5HcldPDP4S+/Ynlg5LdejlVFRPUWmWvbYtIghXf8A4r/4SbHo5b5gkcrOdg+Eyd9RMfJTLjpqEwLXRM+tSYLTK85c0WP9ZnDD7hhaYdGyaqddcg2vclL4QA4dk2sLpgHVU1RubQldjRolQE0SZAIIHvRjUfSq0qrHOY4EEOBgtPcINYglgv1fsiPOqnA3DYKDCj0auPoZjU0Ztl9HGui2I8ur83Df5pH7J9H34osnMqTSLBr2Oj+FR0iqzTEaR1BRs+uGJNuQsm40zOMXaPMy9wY/U4S2bhGz9pFGlI5OyXwo4PI3TPpA4OoUTJgmyZc0J1sxhTGHZc/ltZNUTqe88tb2SmBI8Om0xJ2TNIkPqSZtsUJWFUZ1aqbNVtgCjSPWHNaRpLY/hDp3otGwg3K0116feIkBAbYumeuWmWgXAVn9Q50EHRIlZiKhbcRzstk6/EGxazdYx5+DgPbMovpAT4eHuCY42QcGS1+reOO6N6QginQBECLAcJ80JgzGXdVIDmLSmKT56nC53KXwEikCO3ZMUWk1HAiSCllYY0iNcQxkQCdoWwQaTHe0HIbTJaYveERwiiNO5KAyIIdXInpN1Zhz6sCDoWGQHBwgQeFt0eK47EjkLG9CGDAe4glFz900qMiCBcIWBu+BFyiZ6dVCk6eqSDKbNCYGMDajbfTZNAzWdvc7j3JbBXoA2gNR2uPiAcG6ErYY0i6ZgNdP5SQtuGmjcySZCxAa4gXB3hadBpMtaVhjRGnp432UfGtjhEe5W4wZN4EQFUlrLGTKBmJ5e4MqBx2F5V54C3D0mkQRKxg4gA26rovpCSQ2TuZBTrmhMAWHMYQEHiEy6G1wBMaUrQ/SU7b7pqrau0TYCCg7DGi3ybT1iBC06PEhvstv71ThZn7gEFQQ6pUNiLIBN1CQRNi4XWatngCLiSVHklrdvl2WapAqARMBBGbFMENTiAYKLnztTWniELA3e4fyt544OpMeBvaydc0Lv+NmaA1YVreRFkzUMV5i+0JbDEimwgHhMVmgYwiJBMlB2GNBT0uc2JtYDhYonqcQJBMFb9vVF9ojhDpjS5xH90wUBjTrOIB2UqyC08jchXIGJJIEEdkN0NdIEGb+5ZAZ/9k=",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBUODAsLDBkSEw8VHhsgHx4bHR0hJTApISMtJB0dKjkqLTEzNjY2ICg7Pzo0PjA1NjP/2wBDAQkJCQwLDBgODhgzIh0iMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzP/wAARCACgAEADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAQIAAwcGBAX/xABDEAABAgUCAgYFCQMNAAAAAAABAhEAAwQFIRIxBkEHIlFhgdETFBcycUJVdJGTlKGxsggjZBUlNURFVGJzgoTC0vD/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQMCBAX/xAAeEQEAAgIDAQEBAAAAAAAAAAAAAQISUREhMRMDQf/aAAwDAQACEQMRAD8A9Vm4F4f4Jov5Y4krKeoqZYdK5uJMs9iEbrV3xzHFPSrX3YTKOyhdBRKwqcpvTTR+SB3COJu96uN+rzW3SrmVM75Or3UDsSnYR4vjHZN+OoVm2lmol3JJJcqJdz3xAYR4IjDLZegn3Lt/nyR+MZLdT/PFw+lTf1GNY6CC8u6D+IlfnGT3T+mbj9Lm/qMUnyGpeRs5giBl+2C4BibKkf8AmgvGp+xCu+fqb7suJ7EK759pvuy4187abwllogg5jUvYlXfP1P8AdlxPYnWj+3Kc/wC1mQfOxYS+j0DKzdE9k+UfxjKLri8XAfxc39Rjb7NT2Xom4fqZ9bXpn1UxXpCDhc5Q91CEbs/PvjBqieqpqZ9QoMqdNXM09mou0av11J2B+yI/fCvmIDE2A9bqXzVT/tT5xPWqg/1mf9qrzih/hBEZ5C8VNQN6if8Aaq84YVVR/eZ/2qvOPOO6D8YfI5k5UVK1qKlL7VFz9cSFEF4DGIIHwgwBTiCIHgYngYRGHxiQOex+qD4QEI23gwPCD4GGY84kQOcNB2ycDtMAfbNmsAS4q7sS+co8oY2WwCboVV3ZmcEGX5RUFEuXZ8GCmYdS+sdmHfHm53268KaMmy2B1aqm7s7BlS8/hBTZbCwJqbuElTDrS/KE1gStJVjVhoIJTLDnZW0Gd9jCmjKsljCSE1V2J71I8oZNjsKpYIqLw52GuX5QylHS76gzOcNDSFnQhKnwrGO6F9L7PCulUqx2FctKjU3cPy1y/KGlWuxJUAKWrqTuDUTsfUmDJXplAq2EMgaZwyD2Zgm9tiKV08KXCSnOkKyYIdxgKI79oVyHQWAUX3ghOoAcweUIHUWls2oE4Jh04lYAIfYc4Q5AZQ1cw8MggBSQHDP4wBYSBKyAzbPzhgrQJSx8p3hCB6vgO/gxiAgyUDI0FoRmQCkAbBsh4s1aaoK90s0UghS0BWOqxiyYpXptTNiAcupmcBW8qC1cfcNuMAFWfzj61t6G7jdKYT6LiO01FOSR6SXLWY0mk4G4A4IkevVNJQSVDeruKwov3FeAfgBHyL304cPUIMqzSJ10mJxrQPRyk/6juPgI6MKx65c7T44fpQ4WoeE7dwxR00pCqgS5wqKhKWM5QSMnx2jPArdQYtyEdBxdxvdeM6qnXckUslFOVehlU4LDUGLk5Mc9L6yTpw+NoleYmelqRPHa5ak5BOFZbsMB9EpDnBU8K7kBnLDMFZ/dOORzGVP6smB6k9jQZvWAVsohoWcUmcVhmABzDTB1UHfVkMIQ281wn1NdXrmXKfUT6wHrmqJMwfHVkRUHdufdGyS6DpEuMtEjirgK136SGAmzZ8iVPA7lhflF07oQp7jRpq7fOr7JUKB1UNatFSlJ7ApJLDxMWn85lzx+kR6xZ+s7pJJZm2hkkhClDABjouMOCLvwXNp03NVPMlVJIlTadRIUQHIYgERzoACCDgKOInMcerVnI6gxDts+IMw/ulEMxZg8BAJ6ucO8AF5ZSBsecJpct21AA4zBSXkoUrYHEDOhSAX7okstTrRkNkOd4A05X7Qdy+TwtT/fj/0hD+0DeNxwzSN9MUf+MeDiLospKbh9d64Zvou9PITqqZZUhRA5qSU7N2GM3ABYjYiLTe1Zc8UpbxpvSrxha+LbHw1VW+qlGeDMVUUyVOqQpSA4OORcRmgJ0ntOxMIEpIUvSH7QN4IVhKhyO0TtPKlK4rkuFkjdt4APUWn5RODAUevMIbZ4kt1JURszxltcSQCd8sQYBAMtLHY8oTW4UAMM+IcEEIHLfOIDal0a9H9+sNdcbzfZYttu9Smyp0gzATOBG5AwAGfMZKdIK9B6vpF6T/h1FvwaOq4g6UOKeK6JduqpsmnpFZmyqRBBWOxR3bujk9mYYaKXnyIRpE8zMmBGhQJfsJMQFiN8iAAQMjPdBJCWJ3B8YwoZQIJJ5CIg4A93sPbEUWY7jm8RBA082MAMVKSpTbMMRYoaZgBbAwIrUHSou6tsmLZj+ly4DB4Rv//Z",
  "data:image/jpeg;base64,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",
];
const WOOD_LEDGE_TOP = "data:image/jpeg;base64,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";
const WOOD_LEDGE_FACE = "data:image/jpeg;base64,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";
const PAGE_EDGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCACgABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABwAGAQL/xAAhEAABAwQCAwEAAAAAAAAAAAABAAUiAgQhkRITIzGhMv/EABcBAQEBAQAAAAAAAAAAAAAAAAABBAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBkexRLKPnsUSkkJ8IlEo/fCJxK57UxF0KO+rKl26I76onakDu985etI/fOcvWlv3wfqf1H72P15PqDF3XPvqwNKXm6Hmq8n1SB1fDRLB0j984SwdJBeyZRCP3wmURtBibrh3VYOlLt0T3VRCkDu9iuWUfPgrlkrevYolkI/exRLI0gxt0K++rJUvF0KO+rPxSB3fCJRKP3wicSkF75y9aR++c5etIMRdEd9UTtS9XXPvqwNKVDo+D9T+o/ex+vJ9W/fDRLB0j984SwdKDFXQ81Xk+qVdcO6rB0pA7PZMohH74TKI2kJ7Fcso+fBXLJQYm6J7qohS7dCvvqyVIHJ7FEshH72KJZGkhPhEolH74ROJQYi6FHfVn4pduiO+qJ2pUO73zl60j985y9aW/fB+p/UfvY/Xk+qDF3XPvqwNKXm6Hmq8n1SB1fDRLB0j984SwdJBeyZRCP3wmURtBibrh3VYOlLt0T31RCkH//2Q==";

/** Purple ribbon / accent from still (decorative). */
const RIBBON_PURPLE = "#6b4f9a";
const RIBBON_PURPLE_DEEP = "#4a3470";

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

/** Split "Writer.promo" → base + accent suffix; ".promo" → empty base + suffix. */
function splitBotName(name: string): { base: string; suffix: string } {
  const i = name.indexOf(".");
  if (i === -1) return { base: name, suffix: "" };
  if (i === 0) return { base: "", suffix: name };
  return { base: name.slice(0, i), suffix: name.slice(i) };
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

function woodBg(uri: string, extra?: CSSProperties): CSSProperties {
  return {
    backgroundImage: `url(${uri})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    ...extra,
  };
}

function Spine({ bot, index }: { bot: Bot; index: number }): JSX.Element {
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
    border: "1px solid rgba(0,0,0,0.45)",
    ...woodBg(wood, { backgroundColor: "#3a2418" }),
    boxShadow:
      "2px 12px 22px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,220,180,0.12)",
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
    border: "1px solid rgba(0,0,0,0.55)",
    background: "rgba(12,10,14,0.92)",
    color: "#f2efe8",
    fontWeight: theme.weight.medium,
    position: "relative",
    zIndex: 2,
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.55)",
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={spine}>
      {/* Page-edge thickness cue on the right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 5,
          ...woodBg(PAGE_EDGE, { backgroundColor: "#d8c8a8", backgroundSize: "100% 100%" }),
          boxShadow: "inset 1px 0 0 rgba(0,0,0,0.25)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Soft top highlight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,220,180,0.14) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.28) 100%)",
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
          border: "1px solid rgba(0,0,0,0.5)",
          background: RIBBON_PURPLE_DEEP,
          position: "relative",
          zIndex: 2,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.55)",
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
            color: "#f4f0ea",
            textShadow: "0 1px 2px rgba(0,0,0,0.55)",
          }}
        >
          {base.length > 0 ? <span>{base}</span> : null}
          {suffix.length > 0 ? <span style={{ color: accent }}>{suffix}</span> : null}
        </p>
      </div>
      <span style={install}>
        <Down color="#f2efe8" />
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
    background: `linear-gradient(90deg, ${RIBBON_PURPLE_DEEP} 0%, ${RIBBON_PURPLE} 45%, ${RIBBON_PURPLE_DEEP} 100%)`,
    color: "#f7f4ff",
    textDecoration: "none",
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), 50% 100%, 0 calc(100% - 16px))",
    boxShadow: "2px 12px 18px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.3)",
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
          color: "#f7f4ff",
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
      {/* Top shelf surface */}
      <div
        style={{
          position: "relative",
          height: 14,
          borderRadius: "4px 4px 0 0",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.4)",
          borderBottom: "none",
          ...woodBg(WOOD_LEDGE_TOP, { backgroundColor: "#4a3020" }),
          boxShadow: "inset 0 1px 0 rgba(255,210,160,0.22)",
        }}
      />
      {/* Front face of the plank */}
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
          ...woodBg(WOOD_LEDGE_FACE, { backgroundColor: "#2e1e14", backgroundSize: "cover" }),
          boxShadow: "0 16px 28px rgba(0,0,0,0.55), 0 4px 8px rgba(0,0,0,0.35)",
          border: "1px solid rgba(0,0,0,0.45)",
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
                color: "#f0ebe3",
                position: "relative",
                zIndex: 1,
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
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
                boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
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
    ...woodBg(WOOD_WALL, {
      backgroundColor: "#1a100c",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
  };
  const band: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(32px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(18px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(36px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(18px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 26,
  };

  return (
    <div id={LAYOUT} style={page}>
      {/* Vignette over wood wall */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(70,42,24,0.25) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.62) 100%)",
          zIndex: 0,
        }}
      />
      <div style={band}>
        {/* Header — no pack wordmark */}
        <header style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%", minWidth: 0 }}>
          <div
            style={{
              width: 68,
              height: 68,
              flex: "0 0 68px",
              borderRadius: theme.radius.full,
              overflow: "hidden",
              border: "2px solid rgba(20,16,24,0.9)",
              background: "#0a0a0c",
              boxShadow: "0 4px 14px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={68} height={68} fit="cover" />
          </div>
          <div style={{ flex: "1 1 auto", minWidth: 0, paddingTop: 2 }}>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                lineHeight: 1.15,
                fontWeight: theme.weight.semibold,
                letterSpacing: "-0.02em",
                margin: 0,
                overflowWrap: "anywhere",
                color: "#f5f1ea",
                textShadow: "0 1px 2px rgba(0,0,0,0.45)",
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
                  margin: "5px 0 0",
                  overflowWrap: "anywhere",
                  fontSize: 14,
                }}
              >
                {handle}
              </p>
            ) : null}
            <p
              style={{
                ...theme.font.subtext,
                fontFamily: theme.font.family,
                color: "rgba(240,235,228,0.82)",
                margin: "8px 0 0",
                overflowWrap: "anywhere",
                lineHeight: 1.4,
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
                  gap: 12,
                  width: "100%",
                  minWidth: 0,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 0,
                  marginBottom: -3,
                  position: "relative",
                  zIndex: 3,
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
                  gap: 14,
                  width: "100%",
                  minWidth: 0,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingTop: 0,
                  marginTop: -4,
                  position: "relative",
                  zIndex: 1,
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
            color: "rgba(220,210,200,0.45)",
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
