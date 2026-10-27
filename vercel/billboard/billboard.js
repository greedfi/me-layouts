"use strict";

/**
 * Billboard static export for Vercel.
 * Look tracks layouts/billboard/page.canvas.tsx. Fill this file the same way
 * the canvas pack is filled: the string initializers below appear once each.
 * Replace the whole bots array and the whole links array. Leave the rest.
 * PAGE_TITLE is the browser tab and the unfurl title. Fill it with this user's username, or the display name.
 * OG_IMAGE_URL is an absolute https URL of this user's own avatar file, not a data URI and not a silk plate.
 * GA_MEASUREMENT_ID and META_PIXEL_ID stay placeholders unless the owner opts in later.
 * APPEARANCE is ignored. Day and dark follow prefers-color-scheme.
 * Silk plates are local files under assets/. Do not point them at a CDN.
 */

const AVATAR = "__AVATAR_DATA_URI__";
const DISPLAY_NAME = "__DISPLAY_NAME__";
const HANDLE = "__HANDLE__";
const BIO = "__BIO__";
const FOOTER = "__FOOTER__";
const APPEARANCE = "__APPEARANCE__";
const STAGE = "__STAGE__";
const ACCENT = "__ACCENT__";
const PAGE_TITLE = "__PAGE_TITLE__";
const OG_IMAGE_URL = "__OG_IMAGE_URL__";
const GA_MEASUREMENT_ID = "__GA_MEASUREMENT_ID__";
const META_PIXEL_ID = "__META_PIXEL_ID__";
/** Corner-mark href. Leave the placeholder until the share URL exists. Not an install URL. */
const LINKS_SHARE_HREF = "__LINKS_SHARE_HREF__";
/** Product chrome. Not a fill token and not this user's avatar. */
const LINKS_MARK = "assets/links-mark.png";
/** Static white pills on the sphere, as a fraction of the 36px face. They do not follow the pointer. */
const MARK_EYES = [
  { x: 0.1636, y: 0.2025, w: 0.0534, h: 0.1396, rot: 10 },
  { x: 0.6942, y: 0.1901, w: 0.0493, h: 0.1314, rot: 3 },
];

const bots = [
  {
    name: "__BOT0_NAME__",
    desc: "__BOT0_DESC__",
    src: "__BOT0_ICON__",
    href: "__BOT0_HREF__",
  },
  {
    name: "__BOT1_NAME__",
    desc: "__BOT1_DESC__",
    src: "__BOT1_ICON__",
    href: "__BOT1_HREF__",
  },
];

const links = [
  {
    label: "__LINK0_LABEL__",
    href: "__LINK0_HREF__",
    display: "__LINK0_DISPLAY__",
  },
  {
    label: "__LINK1_LABEL__",
    href: "__LINK1_HREF__",
    display: "__LINK1_DISPLAY__",
  },
  {
    label: "__LINK2_LABEL__",
    href: "__LINK2_HREF__",
    display: "__LINK2_DISPLAY__",
  },
  {
    label: "__LINK3_LABEL__",
    href: "__LINK3_HREF__",
    display: "__LINK3_DISPLAY__",
  },
  {
    label: "__LINK4_LABEL__",
    href: "__LINK4_HREF__",
    display: "__LINK4_DISPLAY__",
  },
];

const LAYOUT = "billboard";

const SILK_DARK = "assets/silk-dark.jpg";
const SILK_DAY = "assets/silk-day.jpg";
const SILK_RIBBON = "assets/silk-ribbon.jpg";
const SILK_PEACH = "assets/silk-peach.jpg";
const SILK_DAY_KEY = "contrast(0.22) brightness(1.62) saturate(2.15)";
const SILK_MASK_RIBBON = "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)";
const SILK_MASK_PEACH = "radial-gradient(72% 50% at 32% 74%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 72%)";

const TILE_DIAL = { blur: 1, refraction: 110, bezel: 15, radius: 20, frost: 0.46, saturation: 1.48, specular: 1 };
const CHIP_DIAL = { blur: 1, refraction: 52, bezel: 13, radius: 999, frost: 0.4, saturation: 1.42, specular: 0.96 };

const ACCENT_FOCUS = {
  rose: { dark: "#e8cfd4", light: "#73424c" },
  sage: { dark: "#d0dccf", light: "#3c5142" },
  violet: { dark: "#d8d0e6", light: "#4a3f64" },
  amber: { dark: "#e8d8b8", light: "#6a5230" },
  teal: { dark: "#c5e4e6", light: "#2f5960" },
};

const SILK_HUE = { rose: 128, sage: -28, violet: 48, amber: -118, teal: 0 };

const BLOOM_BOX = [
  { left: "-12%", top: "-18%", width: "78%", height: "52%" },
  { right: "-18%", top: "22%", width: "70%", height: "46%" },
  { left: "8%", bottom: "-20%", width: "84%", height: "48%" },
];
const BLOOM_BLUR = [90, 100, 110];
const BLOOM_DRIFT = ["a", "b", "c"];

const DRIFT_FRAMES = {
  a: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(14%, 9%, 0) scale(1.08)" }],
  b: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(-12%, 11%, 0) scale(1.06)" }],
  c: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(10%, -12%, 0) scale(0.94)" }],
  d: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(-8%, -7%, 0) scale(1.1)" }],
  bandA: [{ transform: "rotate(-6deg) translate3d(0%, 0, 0)" }, { transform: "rotate(-6deg) translate3d(8%, 0, 0)" }],
  bandB: [{ transform: "rotate(7deg) translate3d(0%, 0, 0)" }, { transform: "rotate(7deg) translate3d(-8%, 0, 0)" }],
  flowA: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(3.5%, 2.2%, 0) scale(1.035)" }],
  flowB: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(-4%, 3%, 0) scale(1.04)" }],
  flowC: [{ transform: "translate3d(0%, 0%, 0) scale(1)" }, { transform: "translate3d(3%, -2.6%, 0) scale(1.03)" }],
};

const DRIFT_MS = {
  a: 18000,
  b: 24000,
  c: 21000,
  d: 28000,
  bandA: 16000,
  bandB: 22000,
  flowA: 20000,
  flowB: 17000,
  flowC: 23000,
};

const HOST_KIND = [
  ["twitter.com", "x"],
  ["x.com", "x"],
  ["github.com", "github"],
  ["instagram.com", "instagram"],
  ["youtu.be", "youtube"],
  ["youtube.com", "youtube"],
  ["linkedin.com", "linkedin"],
  ["lnkd.in", "linkedin"],
  ["tiktok.com", "tiktok"],
  ["discord.gg", "discord"],
  ["discord.com", "discord"],
  ["t.me", "telegram"],
  ["telegram.me", "telegram"],
  ["telegram.org", "telegram"],
  ["facebook.com", "facebook"],
  ["fb.com", "facebook"],
  ["fb.me", "facebook"],
  ["twitch.tv", "twitch"],
  ["spotify.com", "spotify"],
  ["threads.net", "threads"],
  ["bsky.app", "bluesky"],
  ["reddit.com", "reddit"],
  ["wa.me", "whatsapp"],
  ["whatsapp.com", "whatsapp"],
];

const LABEL_KIND = {
  x: "x",
  twitter: "x",
  github: "github",
  instagram: "instagram",
  insta: "instagram",
  ig: "instagram",
  youtube: "youtube",
  yt: "youtube",
  linkedin: "linkedin",
  tiktok: "tiktok",
  discord: "discord",
  telegram: "telegram",
  facebook: "facebook",
  fb: "facebook",
  twitch: "twitch",
  spotify: "spotify",
  threads: "threads",
  bluesky: "bluesky",
  bsky: "bluesky",
  reddit: "reddit",
  whatsapp: "whatsapp",
  email: "email",
  mail: "email",
  site: "site",
  website: "site",
  web: "site",
  homepage: "site",
  home: "site",
};

const KIND_NAME = {
  x: "X",
  github: "GitHub",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  discord: "Discord",
  telegram: "Telegram",
  facebook: "Facebook",
  twitch: "Twitch",
  spotify: "Spotify",
  threads: "Threads",
  bluesky: "Bluesky",
  reddit: "Reddit",
  whatsapp: "WhatsApp",
  email: "Email",
  site: "Site",
};

const GLYPH = {
  x: "M14.35 3.1h2.72l-5.94 6.8 7 9h-5.47l-4.28-5.6-4.9 5.6H1.76l6.36-7.28L1.4 3.1h5.61l3.87 5.12 3.47-5.12zm-1.05 14.7h1.51L6.78 4.72H5.16l8.14 13.08z",
  github:
    "M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5.02 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.95.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.58.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z",
  instagram:
    "M12 2.2c2.7 0 3.02.01 4.08.06 2.7.12 3.95 1.4 4.07 4.08.05 1.06.06 1.38.06 4.08s-.01 3.02-.06 4.08c-.12 2.67-1.38 3.95-4.07 4.07-1.06.05-1.38.06-4.08.06s-3.02-.01-4.08-.06c-2.7-.12-3.95-1.4-4.07-4.07C3.8 13.62 3.79 13.3 3.79 10.6s.01-3.02.06-4.08c.12-2.68 1.37-3.96 4.07-4.08C8.98 2.21 9.3 2.2 12 2.2zm0 1.8c-2.65 0-2.96.01-4 .06-1.9.08-2.78.99-2.86 2.88-.05 1.04-.06 1.35-.06 4.02s.01 2.98.06 4.02c.08 1.88.96 2.79 2.86 2.87 1.04.05 1.35.06 4 .06s2.96-.01 4-.06c1.9-.08 2.78-.99 2.86-2.87.05-1.04.06-1.35.06-4.02s-.01-2.98-.06-4.02c-.08-1.89-.96-2.8-2.86-2.88-1.04-.05-1.35-.06-4-.06zm0 3.07a5.13 5.13 0 1 1 0 10.26 5.13 5.13 0 0 1 0-10.26zm0 1.8a3.33 3.33 0 1 0 0 6.66 3.33 3.33 0 0 0 0-6.66zm5.34-2.16a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  youtube:
    "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81zM9.75 15.57V8.43L15.84 12l-6.09 3.57z",
  linkedin:
    "M4.98 3.5A2.5 2.5 0 1 1 2.5 1a2.5 2.5 0 0 1 2.48 2.5zM.5 8.4h4.5V23H.5V8.4zM9 8.4h4.3v2h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23H18.5v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V23H9V8.4z",
  tiktok:
    "M14.2 2h-2.7v12.2a2.55 2.55 0 1 1-2.2-2.52v-2.7a5.25 5.25 0 1 0 4.9 5.22V8.05a6.4 6.4 0 0 0 3.7 1.18V6.5a3.7 3.7 0 0 1-3.7-3.5V2z",
  discord:
    "M19.27 5.33A16.2 16.2 0 0 0 15.3 4.1l-.3.6a14.7 14.7 0 0 0-4.4 0l-.3-.6a16.1 16.1 0 0 0-3.96 1.23C3.1 8.9 2.4 12.4 2.7 15.85A16.4 16.4 0 0 0 7.6 18.3l.9-1.5a10.4 10.4 0 0 1-1.5-.72l.35-.27c3.2 1.48 6.7 1.48 9.86 0l.36.27c-.48.28-.98.52-1.5.72l.9 1.5a16.3 16.3 0 0 0 4.9-2.45c.4-4.2-.68-7.66-2.9-10.52zM9.1 14.1c-.85 0-1.55-.8-1.55-1.78s.68-1.78 1.55-1.78 1.57.8 1.55 1.78c0 .98-.68 1.78-1.55 1.78zm5.8 0c-.85 0-1.55-.8-1.55-1.78s.68-1.78 1.55-1.78 1.57.8 1.55 1.78c0 .98-.68 1.78-1.55 1.78z",
  telegram:
    "M20.7 4.3 3.4 10.9c-1.18.46-1.17 1.1-.2 1.39l4.45 1.39 10.3-6.5c.49-.3.93-.13.57.19l-8.34 7.52-.32 4.55c.46 0 .66-.21.92-.46l2.2-2.13 4.58 3.38c.84.46 1.45.22 1.66-.78l2.95-13.9c.28-1.12-.4-1.63-1.27-1.32z",
  facebook:
    "M14.2 8.4V6.7c0-.5.33-.61.56-.61h1.5V3.6l-2.1-.01c-2.15 0-2.64 1.62-2.64 2.66v2.15H9.2V11h2.32v9h2.7v-9h2.05l.28-2.6h-2.35z",
  twitch:
    "M5.2 2.2 3 4.5v13.2h4.1V22l3.4-3.3h2.7l5.8-5.8V2.2H5.2zm12.4 9.3-2.7 2.7H12l-2.4 2.4v-2.4H6.4V3.7h11.2v7.8zM11.2 6.2H9.8v4.4h1.4V6.2zm3.8 0h-1.4v4.4h1.4V6.2z",
  spotify:
    "M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4zm4.67 14.7a.64.64 0 0 1-.88.21c-2.4-1.47-5.43-1.8-9-.98a.64.64 0 1 1-.37-1.23c3.9-.9 7.24-.51 9.93 1.13.3.18.4.58.32.87zm1.22-2.8a.8.8 0 0 1-1.1.26c-2.75-1.69-6.95-2.18-10.2-1.19a.8.8 0 0 1-.46-1.53c3.72-1.13 8.34-.58 11.5 1.36.36.22.48.7.26 1.1zm.1-2.9C15.1 8.9 9.4 8.7 6.2 9.7a.96.96 0 0 1-.56-1.84c3.7-1.12 9.85-.9 13.74 1.45a.96.96 0 0 1-1.2 1.5z",
  threads:
    "M12.9 11.2c-.1-2.2-1.3-3.5-3.3-3.5-2.3 0-3.9 1.8-3.9 4.6 0 2.7 1.5 4.4 3.9 4.4 1.6 0 2.8-.6 3.5-1.7.3.9.4 1.6.4 2.2 0 2.3-1.5 4.3-4.6 4.3-3.6 0-5.7-2.4-5.7-6.6V8.2c0-4.1 2.2-6.5 6-6.5 2.4 0 4.2.8 5.4 2.1l-1.3 1.5c-.9-1-2.2-1.6-4-1.6-2.5 0-4 1.6-4 4.4v4.6c0 3 1.4 4.6 3.8 4.6 1.9 0 3-.9 3-2.6 0-.5-.1-1-.2-1.4-.7.8-1.8 1.3-3.1 1.3-2 0-3.3-1.3-3.3-3.4 0-2.2 1.4-3.6 3.4-3.6 1.5 0 2.5.8 2.7 2.1h2.2c-.1-.4-.2-1-.2-1.5z",
  bluesky:
    "M12 11.4c1.3-2.5 3.4-7.2 5.7-9.2 1.6-1.4 4.3-1.2 4.3 2.4 0 .7-.4 5.8-1.6 6.6-1.5 1-2.2.2-2.2.2 1.6 2.8 2.6 4.9 1.5 6.6-1.3 2-3.4 1.5-5.2-.2-1.4-1.3-2.1-2.8-2.5-3.6-.4.8-1.1 2.3-2.5 3.6-1.8 1.7-3.9 2.2-5.2.2-1.1-1.7-.1-3.8 1.5-6.6 0 0-.7.8-2.2-.2C2.4 10.4 2 5.3 2 4.6c0-3.6 2.7-3.8 4.3-2.4C8.6 4.2 10.7 8.9 12 11.4z",
  reddit:
    "M14.5 3.2a1.35 1.35 0 1 0 1.2 2.05l2.55.54a1.15 1.15 0 1 0 .12-.86l-2.9-.62a1.35 1.35 0 0 0-.97-1.11zM12 6.1c-3.6 0-6.6 2.4-6.6 5.4 0 1.7.8 3.2 2.1 4.2-.2.7-.5 1.6-.7 2.1 0 .05 1.3-.2 2.5-1 .8.3 1.7.4 2.7.4s1.9-.1 2.7-.4c1.2.8 2.5 1.05 2.5 1-.2-.5-.5-1.4-.7-2.1 1.3-1 2.1-2.5 2.1-4.2 0-3-3-5.4-6.6-5.4zm-3.2 4.3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zm6.5 0a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zm-5.7 3.5c.4.4 1.3.8 2.4.8s2-.4 2.4-.8c.2-.2.5-.2.7 0 .2.2.2.5 0 .7-.6.6-1.8 1-3.1 1s-2.5-.4-3.1-1c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0z",
  whatsapp:
    "M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.6-2.86-1.24-4.72-4.12-4.86-4.31-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.4 1.02-.4h.73c.23 0 .54-.09.85.64.32.76 1.08 2.62 1.17 2.81.1.19.16.41.03.66-.13.24-.2.4-.39.61-.19.22-.4.48-.57.65-.19.19-.39.4-.17.77.22.38 1 1.64 2.14 2.66 1.47 1.31 2.71 1.72 3.1 1.91.38.19.61.16.83-.1.23-.26.96-1.12 1.22-1.5.26-.39.51-.32.85-.19.35.13 2.2 1.04 2.58 1.23.38.19.63.28.72.44.1.16.1.94-.14 1.62z",
  email:
    "M3.2 6.2h17.6c.7 0 1.2.5 1.2 1.2v9.2c0 .7-.5 1.2-1.2 1.2H3.2c-.7 0-1.2-.5-1.2-1.2V7.4c0-.7.5-1.2 1.2-1.2zm.4 1.6 8.4 5.5 8.4-5.5H3.6zm0 2.1v6.5h16.8V9.9l-7.7 5.1c-.3.2-.8.2-1.1 0L3.6 9.9z",
  site: "M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6zm0 1.7c.9 0 2.2.9 3.1 3.1H8.9C9.8 4.8 11.1 3.9 12 3.9zm-4.7 4.7h9.4c.2.8.3 1.7.3 2.6s-.1 1.8-.3 2.6H7.3A11 11 0 0 1 7 11.2c0-.9.1-1.8.3-2.6zM12 20.1c-.9 0-2.2-.9-3.1-3.1h6.2c-.9 2.2-2.2 3.1-3.1 3.1zM4.1 12.8a8.1 8.1 0 0 1 0-3.2h2.5a13.4 13.4 0 0 0 0 3.2H4.1zm13.3 0a13.4 13.4 0 0 0 0-3.2h2.5a8.1 8.1 0 0 1 0 3.2h-2.5z",
};

const EMOJI_CLUSTER =
  "(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?\\p{Emoji_Modifier}?(?:[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?\\p{Emoji_Modifier}?(?:[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*)";
const TRAILING_EMOJI = new RegExp("(?:\\s*" + EMOJI_CLUSTER + ")+\\s*$", "u");

const LUT_SIZE = 128;
const LIGHT_SPREAD = 1.08;
const DIFFUSE_SPREAD = LIGHT_SPREAD * 0.65;
let squircleLut = null;
const imageCache = new Map();
const IMAGE_CACHE_MAX = 48;
let lensSeq = 0;
let observers = [];

function sat(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function surfaceLUTs() {
  if (squircleLut) return squircleLut;
  const mag = new Float32Array(LUT_SIZE);
  const slope = new Float32Array(LUT_SIZE);
  const n = 1.5;
  const thickness = 0.6;
  const heightAt = (t) => Math.pow(1 - Math.pow(1 - t, 4), 0.25);
  const eps = 1 / 1024;
  let max = 0;
  for (let i = 0; i < LUT_SIZE; i++) {
    const t = Math.max(i / (LUT_SIZE - 1), eps);
    const hi = Math.min(t + eps, 1);
    const lo = Math.max(t - eps, 0);
    slope[i] = ((heightAt(hi) - heightAt(lo)) / (hi - lo)) * thickness;
    const thetaI = Math.atan(Math.abs(slope[i]));
    const delta = thetaI - Math.asin(Math.sin(thetaI) / n);
    mag[i] = heightAt(t) * thickness * Math.tan(delta);
    max = Math.max(max, mag[i]);
  }
  if (max > 0) {
    for (let i = 0; i < LUT_SIZE; i++) mag[i] /= max;
  }
  squircleLut = { mag, slope };
  return squircleLut;
}

function surfaceField(px, py, bx, by, r, out) {
  const qx = Math.abs(px) - bx;
  const qy = Math.abs(py) - by;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  out.sd = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(qx, qy) || 1;
    out.nx = (Math.sign(px) * qx) / len;
    out.ny = (Math.sign(py) * qy) / len;
  } else if (qx > qy) {
    out.nx = Math.sign(px);
    out.ny = 0;
  } else {
    out.nx = 0;
    out.ny = Math.sign(py);
  }
}

function cacheGet(key) {
  const hit = imageCache.get(key);
  if (!hit) return undefined;
  imageCache.delete(key);
  imageCache.set(key, hit);
  return hit;
}

function glassImages(fullW, fullH, fullRadius, fullBezel) {
  const key = fullW + "x" + fullH + "r" + fullRadius + "b" + fullBezel;
  const cached = cacheGet(key);
  if (cached) return cached;
  try {
    const scale = fullW * fullH > 32000 ? 0.5 : 1;
    const w = Math.ceil(fullW * scale);
    const h = Math.ceil(fullH * scale);
    const radius = fullRadius * scale;
    const safeBezel = Math.min(fullBezel, Math.max(1, fullRadius * 0.85));
    const bezel = Math.max(1, safeBezel * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(w, h);
    const data = image.data;
    const lut = surfaceLUTs().mag;
    const field = { sd: 0, nx: 0, ny: 0 };
    const r = Math.min(radius, w / 2, h / 2);
    const bx = w / 2 - r;
    const by = h / 2 - r;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const px = x + 0.5 - w / 2;
        const py = y + 0.5 - h / 2;
        surfaceField(px, py, bx, by, r, field);
        const depth = -field.sd;
        const d = depth / bezel;
        const inRim = d < 1 && d >= 0;
        const idx = inRim ? Math.min(Math.round(d * (LUT_SIZE - 1)), LUT_SIZE - 1) : 0;
        const mag = inRim ? lut[idx] : 0;
        const i = (y * w + x) * 4;
        data[i] = Math.round(128 - field.nx * mag * 127);
        data[i + 1] = 128;
        data[i + 2] = Math.round(128 - field.ny * mag * 127);
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);

    const specW = fullW;
    const specH = fullH;
    const specR = Math.min(fullRadius, specW / 2, specH / 2);
    const specBx = specW / 2 - specR;
    const specBy = specH / 2 - specR;
    const lightCanvas = document.createElement("canvas");
    const darkCanvas = document.createElement("canvas");
    lightCanvas.width = specW;
    lightCanvas.height = specH;
    darkCanvas.width = specW;
    darkCanvas.height = specH;
    const lightCtx = lightCanvas.getContext("2d");
    const darkCtx = darkCanvas.getContext("2d");
    if (!lightCtx || !darkCtx) return null;
    const lightImage = lightCtx.createImageData(specW, specH);
    const darkImage = darkCtx.createImageData(specW, specH);
    const cosLight = Math.cos(LIGHT_SPREAD);
    const cosDiffuse = Math.cos(DIFFUSE_SPREAD);
    const lip = Math.max(5, safeBezel * 0.5);
    const reach = 4 + safeBezel * 0.24;
    const compose = (out, i, specAmount, diffuse, shadeBase, specScale, diffuseScale, shadeStrength) => {
      const highlight = sat(specAmount * specScale + diffuse * diffuseScale);
      const shade = shadeBase * shadeStrength;
      const alpha = highlight + shade * (1 - highlight);
      if (alpha <= 0) return;
      const value = Math.min((specScale * highlight) / alpha, 1);
      const v = Math.round(value * 255);
      out[i] = v;
      out[i + 1] = v;
      out[i + 2] = v;
      out[i + 3] = Math.round(Math.min(alpha, 1) * 255);
    };
    for (let y = 0; y < specH; y++) {
      for (let x = 0; x < specW; x++) {
        const px = x + 0.5 - specW / 2;
        const py = y + 0.5 - specH / 2;
        surfaceField(px, py, specBx, specBy, specR, field);
        const sd = field.sd;
        if (sd > 1 || sd < -(reach + 1)) continue;
        const coverage = sat(0.42 - sd);
        const vertical = Math.abs(field.ny);
        const directional = Math.pow(sat((vertical - cosLight) / (1 - cosLight)), 1.15);
        const diffuseDir = Math.pow(sat((vertical - cosDiffuse) / (1 - cosDiffuse)), 1.15);
        const into = sat(-sd / lip);
        const feather = sat(0.38 - sd) * Math.pow(1 - into, 2.15);
        const edge = sat(0.72 - sd) * Math.pow(1 - into, 2.45);
        let specAmount = directional * feather + edge * 0.82 * (1 - directional * 0.4);
        specAmount = specAmount / (1 + 0.2 * (1 - specAmount));
        const glow = 1 - sat(-sd / reach);
        const diffuse = diffuseDir * 0.2 * glow * glow * coverage;
        const i = (y * specW + x) * 4;
        compose(lightImage.data, i, specAmount, diffuse, 0, 1.04, 0.7, 0);
        compose(darkImage.data, i, specAmount, diffuse, 0, 1.14, 0.5, 0);
      }
    }
    lightCtx.putImageData(lightImage, 0, 0);
    darkCtx.putImageData(darkImage, 0, 0);
    const shot = {
      map: canvas.toDataURL(),
      specular: lightCanvas.toDataURL(),
      specularDark: darkCanvas.toDataURL(),
    };
    imageCache.set(key, shot);
    if (imageCache.size > IMAGE_CACHE_MAX) {
      const oldest = imageCache.keys().next().value;
      if (oldest) imageCache.delete(oldest);
    }
    return shot;
  } catch (err) {
    return null;
  }
}

function toneTable(frost) {
  const toneLift = Math.round(180 * (1 - 0.45 * frost)) / 1000;
  const toneRoll = Math.round(140 * (1 - 0.45 * frost)) / 1000;
  const steps = 17;
  const samples = [];
  for (let i = 0; i < steps; i++) {
    const v = i / (steps - 1);
    const lifted = v + toneLift * (1 - v) ** 3;
    samples.push(String(Math.round((lifted - toneRoll * lifted ** 3) * 1000) / 1000));
  }
  return samples.join(" ");
}

function filled(raw) {
  return String(raw ?? "").trim();
}

/** Placeholders are not URLs. A filled avatar or icon is a data URI (or any real src). */
function imageSrc(raw) {
  const value = filled(raw);
  if (value.length === 0 || value.startsWith("__")) return "";
  return value;
}

function atHandle(raw) {
  const trimmed = filled(raw);
  if (trimmed.length === 0 || trimmed === "@") return "";
  return trimmed.startsWith("@") ? trimmed : "@" + trimmed;
}

/** A real share URL. A placeholder, blank, or "#" does not navigate. */
function shareHref(raw) {
  const value = filled(raw);
  if (value.length === 0 || value === "#" || /^__.+__$/.test(value)) return "";
  return value;
}

/** A fill token still equal to its placeholder, or blank, is unset. */
function optedToken(raw) {
  const value = filled(raw);
  if (value.length === 0 || /^__.+__$/.test(value)) return "";
  return value;
}

/**
 * Browser tab. PAGE_TITLE (username, or display name) wins.
 * Otherwise a filled display name, then a filled handle.
 * Placeholders never become the title.
 */
function pageTitle() {
  const page = optedToken(PAGE_TITLE);
  if (page.length > 0) return page;
  const hero = splitTrailingEmoji(filled(DISPLAY_NAME));
  if (hero.text.length > 0 && !/^__.+__$/.test(hero.text)) return hero.text;
  const handle = optedToken(HANDLE);
  if (handle.length === 0) return "";
  return handle.startsWith("@") ? handle : "@" + handle;
}

function applyTabTitle() {
  const title = pageTitle();
  if (title.length > 0) document.title = title;
}

function emojiClusters(run) {
  return run.match(new RegExp(EMOJI_CLUSTER, "gu")) ?? [];
}

function splitTrailingEmoji(raw) {
  const match = TRAILING_EMOJI.exec(raw);
  if (!match) return { text: raw.trim(), clusters: [] };
  const clusters = emojiClusters(match[0]);
  if (clusters.length === 0) return { text: raw.trim(), clusters: [] };
  return { text: raw.slice(0, match.index).trim(), clusters };
}

function resolveAppearance(_raw) {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return dark ? "dark" : "day";
}

function resolveStage(raw) {
  const value = filled(raw).toLowerCase();
  if (value === "color" || value === "colour") return "color";
  return "graphite";
}

function resolveAccent(raw) {
  const value = filled(raw).toLowerCase();
  if (value === "rose" || value === "sage" || value === "violet" || value === "amber" || value === "teal") return value;
  return "silver";
}

function silkFilter(accent) {
  if (accent === "silver") return "none";
  const hue = SILK_HUE[accent];
  return hue === 0 ? "saturate(1.08)" : "hue-rotate(" + hue + "deg) saturate(1.08)";
}

function linkHost(href) {
  const trimmed = filled(href);
  if (trimmed.length === 0 || trimmed.startsWith("__")) return "";
  const withoutScheme = trimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const hostPort = withoutScheme.split(/[/?#]/)[0] ?? "";
  return (hostPort.split(":")[0] ?? "").replace(/^www\./i, "").toLowerCase();
}

function linkKind(link) {
  const href = filled(link.href);
  if (/^mailto:/i.test(href)) return "email";
  const host = linkHost(href);
  if (host.length > 0) {
    for (let i = 0; i < HOST_KIND.length; i++) {
      const domain = HOST_KIND[i][0];
      const kind = HOST_KIND[i][1];
      if (host === domain || host.endsWith("." + domain)) return kind;
    }
  }
  const words = (filled(link.label) + " " + filled(link.display)).toLowerCase().split(/[^a-z0-9]+/);
  for (let i = 0; i < words.length; i++) {
    const kind = LABEL_KIND[words[i] ?? ""];
    if (kind) return kind;
  }
  return "site";
}

function linkName(link, kind) {
  const kindName = KIND_NAME[kind];
  const label = filled(link.label);
  const display = filled(link.display);
  const href = filled(link.href);
  const handle =
    display.length > 0
      ? display
      : label.length > 0 && LABEL_KIND[label.toLowerCase().replace(/[^a-z0-9]+/g, "")] !== kind
        ? label
        : "";
  if (handle.length > 0 && handle.toLowerCase() !== kindName.toLowerCase()) return kindName + ", " + handle;
  if (label.length > 0) return kindName;
  if (href.length > 0) return kindName + ", " + href;
  return kindName;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function drift(name, extra) {
  const node = el("div");
  node.dataset.bbDrift = name;
  if (extra) Object.assign(node.style, extra);
  return node;
}

/**
 * Same loops as the canvas pack. The first keyframe is the resting pose.
 * Web Animations keeps the glass maps from rebuilding each frame. The
 * stylesheet is only the fallback when animate() is missing.
 */
function ensureDriftCss() {
  if (document.getElementById("billboard-drift")) return;
  const style = document.createElement("style");
  style.id = "billboard-drift";
  const names = Object.keys(DRIFT_FRAMES);
  const body = names
    .map((name) => {
      const from = DRIFT_FRAMES[name][0];
      const to = DRIFT_FRAMES[name][1];
      return "@keyframes bb-drift-" + name + "{from{transform:" + from.transform + "}to{transform:" + to.transform + "}}";
    })
    .join("");
  style.textContent = body + "@media (prefers-reduced-motion:reduce){[data-bb-drift]{animation:none!important}}";
  document.head.appendChild(style);
}

function startDrift(node) {
  const name = node.dataset.bbDrift;
  if (!name) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const frames = DRIFT_FRAMES[name];
  const duration = DRIFT_MS[name];
  if (!frames) return;
  if (typeof node.animate === "function") {
    node.animate(frames, {
      duration,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
      fill: "both",
    });
    return;
  }
  ensureDriftCss();
  node.style.animation = "bb-drift-" + name + " " + duration + "ms ease-in-out infinite alternate";
}

function silkImage(src, objectPosition, extra) {
  const img = el("img", "silk-img");
  img.alt = "";
  img.src = src;
  img.style.objectPosition = objectPosition;
  if (extra) Object.assign(img.style, extra);
  return img;
}

function applyBlend(node, blend) {
  node.style.mixBlendMode = "screen";
  node.style.opacity = blend.opacity;
  node.style.maskImage = blend.mask;
  node.style.webkitMaskImage = blend.mask;
}

function buildStage(look) {
  const stage = el("div", "stage" + (look.silk ? " stage-silk" : " stage-graphite"));
  stage.dataset.bbStage = "1";
  stage.setAttribute("aria-hidden", "true");
  stage.classList.add(look.dark ? "stage-dark" : "stage-day");
  if (!look.silk) {
    const dayOp = [0.34, 0.22, 0.2];
    const darkOp = [0.2, 0.34, 0.16];
    const opacity = look.dark ? darkOp : dayOp;
    const colors = look.dark ? ["#f3f4f6", "#b4bac3", "#f3f4f6"] : ["#141416", "#6d7380", "#141416"];
    for (let i = 0; i < colors.length; i++) {
      const bloom = drift(BLOOM_DRIFT[i], {
        position: "absolute",
        borderRadius: "50%",
        background: colors[i],
        filter: "blur(" + BLOOM_BLUR[i] + "px)",
        opacity: String(opacity[i]),
        pointerEvents: "none",
      });
      Object.assign(bloom.style, BLOOM_BOX[i]);
      stage.append(bloom);
    }
    const band = look.dark
      ? "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.92), rgba(255,255,255,0))"
      : "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.55), rgba(0,0,0,0))";
    const bandA = drift("bandA", {
      position: "absolute",
      left: "-20%",
      right: "-20%",
      top: "10%",
      height: "96px",
      background: band,
      opacity: look.dark ? "0.42" : "0.28",
      transform: "rotate(-6deg)",
      transformOrigin: "left center",
      pointerEvents: "none",
    });
    const bandB = drift("bandB", {
      position: "absolute",
      left: "-20%",
      right: "-20%",
      top: "48%",
      height: "72px",
      background: band,
      opacity: look.dark ? "0.34" : "0.22",
      transform: "rotate(7deg)",
      transformOrigin: "left center",
      pointerEvents: "none",
    });
    const scrim = el("div");
    Object.assign(scrim.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      background: look.dark
        ? "linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0) 38%, rgba(0,0,0,0.45))"
        : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0) 40%, rgba(16,16,24,0.16))",
    });
    stage.append(bandA, bandB, scrim);
    return stage;
  }

  const stack = el("div", "silk-stack");
  const filter = silkFilter(look.accent);
  if (filter !== "none") stack.style.filter = filter;
  const ribbon = {
    opacity: look.dark ? "0.78" : "0.9",
    mask: SILK_MASK_RIBBON,
  };
  const peach = {
    opacity: look.dark ? "0.5" : "0.62",
    mask: SILK_MASK_PEACH,
  };
  const ground = silkImage(look.dark ? SILK_DARK : SILK_DAY, look.dark ? "68% 46%" : "center", look.dark ? null : { filter: SILK_DAY_KEY });
  const flowA = drift("flowA", { position: "absolute", inset: "0" });
  flowA.append(ground);

  const ribbonImg = silkImage(SILK_RIBBON, "center 28%");
  const flowB = drift("flowB", { position: "absolute", inset: "0" });
  if (look.dark) applyBlend(ribbonImg, ribbon);
  else applyBlend(flowB, ribbon);
  flowB.append(ribbonImg);

  const peachImg = silkImage(SILK_PEACH, "28% 72%");
  const flowC = drift("flowC", { position: "absolute", inset: "0" });
  if (look.dark) applyBlend(peachImg, peach);
  else applyBlend(flowC, peach);
  flowC.append(peachImg);

  const veil = el("div", "silk-veil");
  stack.append(flowA, flowB, flowC);
  stage.append(stack, veil);
  return stage;
}

function glyph(kind) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "glyph");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", GLYPH[kind]);
  svg.append(path);
  return svg;
}

function buildFilter(filterId, w, h, map, dial) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("class", "glass-filter");
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", filterId);
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", String(w));
  filter.setAttribute("height", String(h));
  filter.setAttribute("color-interpolation-filters", "sRGB");
  const feImage = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
  feImage.setAttribute("href", map);
  feImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", map);
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("width", String(w));
  feImage.setAttribute("height", String(h));
  feImage.setAttribute("preserveAspectRatio", "none");
  feImage.setAttribute("result", "map");
  const disp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
  disp.setAttribute("in", "SourceGraphic");
  disp.setAttribute("in2", "map");
  disp.setAttribute("scale", String(dial.refraction));
  disp.setAttribute("xChannelSelector", "R");
  disp.setAttribute("yChannelSelector", "B");
  const transfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
  const tone = toneTable(dial.frost);
  for (const channel of ["feFuncR", "feFuncG", "feFuncB"]) {
    const fn = document.createElementNS("http://www.w3.org/2000/svg", channel);
    fn.setAttribute("type", "table");
    fn.setAttribute("tableValues", tone);
    transfer.append(fn);
  }
  filter.append(feImage, disp, transfer);
  svg.append(filter);
  return svg;
}

function paintGlass(anchor) {
  const dial = anchor.dataset.kind === "tile" ? TILE_DIAL : CHIP_DIAL;
  const w = Math.round(anchor.clientWidth);
  const h = Math.round(anchor.clientHeight);
  if (w < 2 || h < 2) return;
  const dark = document.documentElement.dataset.appearance === "dark";
  const key = w + "x" + h + (dark ? "d" : "l");
  if (anchor.dataset.shot === key) return;
  const radius = dial.radius >= 999 ? Math.min(w, h) / 2 : dial.radius;
  const images = glassImages(w, h, radius, dial.bezel);
  if (!images) return;
  anchor.dataset.shot = key;
  const spec = anchor.querySelector(".glass-spec");
  spec.style.backgroundImage = 'url("' + (dark ? images.specularDark : images.specular) + '")';
  const layers = anchor.querySelector(".glass-layers");
  const prev = layers.querySelector("svg.glass-filter");
  if (prev) prev.remove();
  layers.append(buildFilter(anchor.dataset.filterId, w, h, images.map, dial));
  const displace = anchor.querySelector(".glass-displace");
  const ref = "url(#" + anchor.dataset.filterId + ")";
  displace.style.backdropFilter = ref;
  displace.style.webkitBackdropFilter = ref;
}

function watchGlass(anchor) {
  paintGlass(anchor);
  if (typeof ResizeObserver !== "function") return;
  const observer = new ResizeObserver(() => paintGlass(anchor));
  observer.observe(anchor);
  observers.push(observer);
}

function layer(className) {
  return el("div", "glass-layer " + className);
}

function glassPane(kind, href, name, content) {
  lensSeq += 1;
  const anchor = el("a", "glass glass-" + kind);
  anchor.dataset.kind = kind;
  anchor.dataset.filterId = "billboard-lens-" + lensSeq;
  const destination = filled(href);
  if (destination.length > 0) {
    anchor.href = destination;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  if (name) {
    anchor.setAttribute("aria-label", name);
    anchor.title = name;
  }
  const layers = el("div", "glass-layers");
  layers.append(layer("glass-frost"), layer("glass-displace"), layer("glass-tint"), layer("glass-milk"), layer("glass-spec"), layer("glass-shine"), layer("glass-sheen"));
  const hover = el("div", "glass-hover");
  const body = el("div", "glass-content");
  body.append(content);
  anchor.append(layers, hover, body);
  return anchor;
}

function installTile(bot) {
  const name = filled(bot.name);
  const desc = filled(bot.desc);
  const icon = imageSrc(bot.src);
  const body = el("div", "tile-body");
  const row = el("div", "tile-row");
  const well = el("div", "icon-well");
  if (icon.length > 0) {
    const img = el("img");
    img.src = icon;
    img.alt = name.length > 0 ? name + " icon" : "Bot icon";
    img.width = 64;
    img.height = 64;
    well.append(img);
  }
  row.append(well);
  if (name.length > 0) {
    const title = el("p", "glass-copy tile-name");
    title.textContent = name;
    row.append(title);
  }
  body.append(row);
  if (desc.length > 0) {
    const copy = el("p", "glass-copy tile-desc");
    copy.textContent = desc;
    body.append(copy);
  }
  return glassPane("tile", bot.href, "", body);
}

function miniLink(link) {
  const kind = linkKind(link);
  const chip = glassPane("chip", link.href, linkName(link, kind), glyph(kind));
  return chip;
}

/** Rest placement on the sphere. No yaw, pitch, or pointer nudge. */
function markEyeRest(eye) {
  const radius = 18;
  const x = Math.round(eye.x * radius * 1000) / 1000;
  const y = Math.round(-eye.y * radius * 1000) / 1000;
  return "translate(-50%, -50%) translate(" + x + "px, " + y + "px) rotate(" + eye.rot + "deg)";
}

/** Default corner control. Same chip glass as the social row. Always rendered. */
function linksMark() {
  const face = el("div", "mark-face");
  const img = el("img");
  img.src = LINKS_MARK;
  img.alt = "";
  img.width = 36;
  img.height = 36;
  face.append(img);
  for (let i = 0; i < MARK_EYES.length; i++) {
    const eye = MARK_EYES[i];
    const pill = el("div", "mark-eye");
    pill.setAttribute("aria-hidden", "true");
    pill.style.width = eye.w * 36 + "px";
    pill.style.height = eye.h * 36 + "px";
    pill.style.opacity = "1";
    pill.style.transform = markEyeRest(eye);
    face.append(pill);
  }
  const chip = glassPane("chip", shareHref(LINKS_SHARE_HREF), "Links", face);
  chip.classList.add("product-mark");
  // Outside the social row. Outbound counts stay on tile and chip kinds only.
  chip.dataset.kind = "mark";
  return chip;
}

function lookNow() {
  const appearance = resolveAppearance(APPEARANCE);
  const stage = resolveStage(STAGE);
  const accent = resolveAccent(ACCENT);
  const dark = appearance === "dark";
  return {
    appearance,
    stage,
    accent,
    dark,
    silk: stage === "color" || accent !== "silver",
  };
}

function applyDocument(look) {
  const root = document.documentElement;
  root.dataset.appearance = look.dark ? "dark" : "day";
  root.dataset.field = look.silk ? "silk" : "graphite";
  if (look.accent === "silver") root.style.removeProperty("--bb-focus");
  else {
    const focus = look.dark ? ACCENT_FOCUS[look.accent].dark : ACCENT_FOCUS[look.accent].light;
    root.style.setProperty("--bb-focus", focus);
  }
  const ground = getComputedStyle(root).getPropertyValue("--bb-ground").trim();
  root.style.background = ground;
  document.body.style.background = ground;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.append(meta);
  }
  meta.setAttribute("content", ground);
}

function installOptionalTrackers() {
  const ga = optedToken(GA_MEASUREMENT_ID);
  if (/^G-[A-Z0-9]+$/i.test(ga) && !document.getElementById("bb-ga")) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement("script");
    script.id = "bb-ga";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga);
    document.head.append(script);
  }
  const meta = optedToken(META_PIXEL_ID);
  if (/^\d{5,20}$/.test(meta) && !document.getElementById("bb-meta")) {
    const script = document.createElement("script");
    script.id = "bb-meta";
    script.textContent =
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','" +
      meta +
      "');fbq('track','PageView');";
    document.head.append(script);
  }
}

function outboundHit(anchor) {
  const kind = anchor.dataset.kind === "tile" ? "bot" : anchor.dataset.kind === "chip" ? "link" : "";
  if (!kind) return null;
  const href = anchor.getAttribute("href") || "";
  if (href.length === 0 || href.startsWith("__")) return null;
  let label = anchor.getAttribute("aria-label") || "";
  if (label.trim().length === 0) {
    const name = anchor.querySelector(".tile-name");
    label = name && name.textContent ? name.textContent : "";
  }
  label = label.replace(/\s+/g, " ").trim();
  return { kind, label, href };
}

/** Click listener only. Navigation is left to the browser. */
function trackOutbound(anchor) {
  const hit = outboundHit(anchor);
  if (!hit) return;
  const data = { kind: hit.kind, label: hit.label, href: hit.href };
  if (typeof window.va === "function") {
    window.va("event", { name: "outbound_click", data: data });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", "outbound_click", { kind: hit.kind, label: hit.label, href: hit.href, link_url: hit.href });
  }
  const payload = JSON.stringify({ kind: hit.kind, label: hit.label, href: hit.href, ts: Date.now() });
  try {
    if (typeof navigator.sendBeacon === "function") {
      const body = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/hit", body)) return;
    }
  } catch (err) {
    /* fall through to fetch */
  }
  try {
    fetch("/api/hit", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(function () {});
  } catch (err) {
    /* the link still navigates */
  }
}

function installOutboundTracking() {
  if (document.documentElement.dataset.bbClicks === "1") return;
  document.documentElement.dataset.bbClicks = "1";
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!target || typeof target.closest !== "function") return;
    const anchor = target.closest("a.glass");
    if (!anchor) return;
    trackOutbound(anchor);
  });
}

function render() {
  applyTabTitle();
  for (const observer of observers) observer.disconnect();
  observers = [];
  document.querySelector("[data-bb-stage]")?.remove();
  const root = document.getElementById(LAYOUT);
  root.replaceChildren();

  const look = lookNow();
  applyDocument(look);
  const stage = buildStage(look);
  document.body.insertBefore(stage, root);

  const hero = splitTrailingEmoji(DISPLAY_NAME);
  const handle = atHandle(HANDLE);
  const bio = filled(BIO);
  const footer = filled(FOOTER);
  const avatar = imageSrc(AVATAR);
  const showHero = hero.text.length > 0 || hero.clusters.length > 0;

  const band = el("div", "band");
  band.append(linksMark());
  const mast = el("header", "mast");
  const avatarRing = el("div", "avatar");
  if (avatar.length > 0) {
    const img = el("img");
    img.src = avatar;
    img.alt = hero.text.length > 0 ? hero.text + " avatar" : "Profile avatar";
    img.width = 60;
    img.height = 60;
    avatarRing.append(img);
  }
  mast.append(avatarRing);
  if (showHero) {
    const h1 = el("h1", "hero-name");
    if (hero.text.length > 0) h1.append(document.createTextNode(hero.text));
    hero.clusters.forEach((cluster, index) => {
      const span = el("span", "hero-emoji");
      span.textContent = cluster;
      span.style.marginLeft = index === 0 ? (hero.text.length > 0 ? "0.32em" : "0") : "0.16em";
      h1.append(span);
    });
    mast.append(h1);
  }
  if (handle.length > 0) {
    const p = el("p", "handle");
    p.textContent = handle;
    mast.append(p);
  }
  if (bio.length > 0) {
    const p = el("p", "bio");
    p.textContent = bio;
    mast.append(p);
  }
  band.append(mast);

  const shownBots = bots.filter((bot) => filled(bot.name).length > 0 || filled(bot.desc).length > 0 || filled(bot.href).length > 0 || filled(bot.src).length > 0);
  if (shownBots.length > 0) {
    const section = el("section", "bots");
    for (const bot of shownBots) section.append(installTile(bot));
    band.append(section);
  }

  const shownLinks = links.filter((link) => filled(link.label).length > 0 || filled(link.display).length > 0 || filled(link.href).length > 0);
  if (shownLinks.length > 0) {
    const nav = el("nav", "links");
    for (const link of shownLinks) nav.append(miniLink(link));
    band.append(nav);
  }

  if (footer.length > 0) {
    const p = el("p", "site-footer");
    p.textContent = footer;
    band.append(p);
  }

  root.append(band);
  stage.querySelectorAll("[data-bb-drift]").forEach(startDrift);
  root.querySelectorAll(".glass").forEach(watchGlass);
}

function boot() {
  applyTabTitle();
  installOptionalTrackers();
  installOutboundTracking();
  render();
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => render();
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", onChange);
  else if (typeof mq.addListener === "function") mq.addListener(onChange);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
