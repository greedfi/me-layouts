import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — Polaroid.
 * A hand of Instant-film prints. Each sheet is a real paper Image (fiber,
 * warm stock, a hard emulsion well, a thick coated caption). The print in
 * front sits on the others. Quiet links and the footer sit below the fan.
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
 * Print size in CSS px. Fixed, so a 440-wide column does not blow the fan up.
 * Previous pack was 56% of the column (~184px at 360, ~228px at 440).
 * Photo window and caption are placed in this same pixel grid as the sheet Image.
 */
const CARD_W = 146;
const CARD_H = 192;
const PAD_X = 10;
const PAD_TOP = 9;
const PHOTO = 126;
const REBATE = 3;
const INNER = PHOTO - REBATE * 2;
const FAN_H = 258;

/** Ink on the film caption. */
const FILM_INK = "#1c1b19";
/** Emulsion in the rebate around the photo. */
const FILM_WELL = "#0c0b0a";
/** Warm paper, visible only until the sheet Image paints. */
const FILM_PAPER_FALLBACK = "#e1ddd6";
/** Cardboard core peeking past the sheet — the print's thickness. */
const FILM_SLAB = "#6e6961";
/** Front print: contact line, near shade, then a longer cast. */
const FILM_SHADOW =
  "0 1px 0 rgba(0,0,0,0.62), 0 3px 3px rgba(0,0,0,0.46), 0 10px 14px rgba(0,0,0,0.40), 0 18px 26px rgba(0,0,0,0.26)";
/** Prints under the front one. Tighter, so the top sheet is the one that lifts. */
const FILM_SHADOW_REAR =
  "0 1px 0 rgba(0,0,0,0.55), 0 2px 2px rgba(0,0,0,0.38), 0 8px 12px rgba(0,0,0,0.32)";
/** Sharp lip of the emulsion well. No blur — the rebate stays a hard edge. */
const FILM_WELL_INSET =
  "inset 0 1px 0 rgba(255,250,242,0.45), inset 0 -1px 0 rgba(0,0,0,0.75), inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.55)";

/**
 * Sheet bitmaps, 2× the CSS print (nearest-neighbor of a crisp 146×192 design)
 * so fiber and the well edge stay sharp at phone width without a giant URI.
 */
const FILM: readonly string[] = [
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8KCw0LCQ8NDA0REA8RFiUYFhQUFi0gIhslNS84NzQvNDM7QlVIOz9QPzM0SmRLUFdaX2BfOUdob2dcblVdX1v/2wBDARARERYTFisYGCtbPTQ9W1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1v/wAARCAGAASQDAREAAhEBAxEB/8QAGwABAQADAQEBAAAAAAAAAAAAAAECBQYHBAP/xABDEAACAAQCBAgLBgYDAQEAAAAAAQIDESESoRMiMVEEBRQWUmHR8AYHI0FicYGjscLSMjM0c4OiU1RjcpHhJETxwZL/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/AO4jx4nr5GGmOv08gGv08gGv08gGv08gLr9PIBr9PIDGFzHCnFFhe6iYBKZibc2qexYVYC6/TyAa/TyAa/TyAa/TyAa/TyAa/TyAa/TyAa/TyAa/TyAuv08gLFibtFRbqATX6eQDX6eQEekpaOvsAa/TyAa/TyAi0jV4qPdQBCpiV5lXvwgZa/TyAa/TyAa/TyAa/TyAa/TyAmv08gGv08gGv08gExxNNqKi3UA10zHjevkB98c/WermBFwhUepffUqGn9HMimn9HMBp/RzAaf0cwGn9HMBp/RzAaf0cwGn9HMCKe2rwU9oF0/o5gNP6OYDT+jmBHPaVoKv1gXTqj1MwGn9HMBFO1tW6WYDT+jmA0/o5gZRzkoqKHMDHT+jmA0/o5gRzU2m4LrZcC6f0cwGn9HMBp/RzAaf0cwGn9HMBp/RzAaf0cwC4QmqqG3rAaf0cwGn9HMCQzmoUolV7wEc/VermBr5k/XermB9kcMzE7AYuVMjgacNV57gcn4bcbcYcUzeC8jn6LS48WpDFWmGm1Pey4jmn4Xcdp05d7qD6SwXnZx42/wDnU/Sg7BBF4XcebeXV6tFB9IgnO7j3by235UH0iC87eO1F+OqvyYPpEDndx2nR8O91B9Igc7eO6qvDqL8qD6RAXhXx1CrcOpD5vIwdggc7uPKfjb/lQfSIHO7jyjfLfdQfSIEXhbx5S3DvbooPpEE538d/zvuoPpEF53cdtfj/AHMH0iBzu47Tpy2r/Kg+kQTndx5hvw6j/Kg+kQZc7uO6/jvZooPpEGPO7jyn42/5UH0iDJeF3HkUX46r/Kg+kQF4W8eUX/O9fkoOwQYweFfHcEKhXDbflQdggr8LePKV5d7NFB2CA/C7juia4b7qD6RBed3HbuuHe6g+kQTndx24bcNv+VB9Igc7ePLU4bX9KD6RA53cefzvuoPpEDndx5Z8ss/6UH0iA/C7jy1OHW/Jg+kQXnbx5X8d7qD6RBH4W8eUtw726KDsEBeF3HmJLl23atFB9Ig9QlQTNGrGVHLjhgolYD4JkMzG7AbCOZMxPWyAxU6NtrHdbbAcR4xYnFN4Fii2aTzf2lxHGlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2W2+cD2eVNmaNa2RlVjmzML1sgPgmTZmN62QGxjUeJ+UyAxpH/EyA4jxiKLTcCrFX7zzf2lxHHIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABH1ecD2eUpmjXlMjKrGpmF+UyA18xTMb8pkBu4/tMCAcJ4yUtLwGv9T5C4jiSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9HSxUe3yvu0YaWP7LA18z7bA2UcbxMCY2BwXjLirM4Cns8p8hcRxSVEaRSKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA06KjuwPbZUb0aMqscbwsDXzI3jYGwjWs7gSiorgcL4yHSZwFba6T5C4jjK1vWpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwputdiKPZpbUOFOL7X2VQwrONaruBr5i13cDZRxQ43rZAFFDasVE/PQDhfGO4YpvAaXppPkNYjjFsuBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjd6Ae0yo4dGr5GVIpkDUSUV1tsB8EyOHG75AbqOXDidgMdHDuA4PxlKGCfxe1b7y/sgLiOKd/PUoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKuvUB7dKlw6NWMqscuHC7Aa+ZLhxuwH3Ry3idswJo3uzA4bxjQ4ZnAsSp958pcRxr2lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF6WA9nlS3o1Yyqxy3hdgNfMlvG7Ab+OVHiflP2gY6KP8AiftA4HxnQuCbwCsdfvPN/YXEcQUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKjpvA9ylSotGvKftMqscqLC/KftA18yVFjflP2gfVHGsT1cwMca6OYHD+MeJRTeAKlKaT5C4jjCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEdHVVKj2uVGtGtXMw0scawvVzA18yNY3q5gbWOKXidwJil7wOE8ZLhczgOH+p8hcRxfrKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKt3tKPbZUUvRq5hWUcUvBt+IGvmRS8buBsZkMtRtOHMDGkvdmwOG8ZFFM4E4LfeV/YXEcVShQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRsD2yCCVFKScNV62ZVlGpeF2zYGvmKXjds2Bto4tZ2AwbdVu863gcH4yq6fgLrbylFTqgLiOKVfOaQIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsB7hLdZaTRlViidHa3rA+CZFruwH0TJkKmYW7vYBMS3gcP4xX5XgNP6nylxHHFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFK+cD2iVEtGrmVSZEooIoYYqRLz0A+GZEsbuBsJkuFzFE1eHYBMIHEeMWimcCW/H8pcRx20oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHTYB7RKh8mjKrHDqsDXzIddgbSOCLE7AYqGOr1beZ12gcP4xU1O4DiW3SfKXEcbkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl1V09pUe0y4I8EO4w0yjgjwVoBr5kEWN2A3UaWJgY0QHBeMteW4A/wAz5DWI4qtbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlG6pXA9xlJaNGVWNLCwNbOgic10jot1ANnFEnNihTvDSoBKgHB+MpNzeAX/ifIXEcT7KFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGx1SA9vl4sMNNl6vcZVlGnhdwNZOgmOa2plFuwgbWOY8T1cwMdI+jmBwfjLeKbwCsP8Tz/ANhcRxVvMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAedAe3ypj0a1czKrHMeF6uYGvmTHjermBsJktYusDBQptql0BwvjIhhU7gNbV0nyGsRxa2WKikUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbZX6gPaoYWpScMFXuqZVlHBqu2YHwTINd2zA2EcGs7AYKW8TbunsW4Dh/GNClO4C3ZeU+U1iONTqqlQIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACSq6oqPaZUHk1Yw0scGq7Aa+ZBruwG5jihxO4Ecabq4r+oDgvGVeZwCjq1pL/wD4LiOJWwooAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARunr8xUe6SoodGrmGljihwu4GvmRQ43cD7I452J3+AH5ubNuldrzWA4bxkuOKbwFRv+J8hcRxistxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABR7fMgPb5UU7Rp12eoypHHOwu/wA+CZHOxu/wA+9uJurs9wEvvA4XxjxVmcBda/eU/YXEcY9pRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe3yq6NXMqsdcLuBr5lcbuBsY5cWJ6+QE0cXTyA4PxkwRQzuA1j/AInm/sLiOLapYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS21KPb5UDcFMd1tsYVlHLip9q2+gHwTJcWN6+QGzjjhxO+QGGKBNuu0Dg/GZEnM4Dhf8T5C4jiaUKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHDWnWB7pKjh0avkZVY44cLvkBrJ3CJUM1px0fqYH3xwazAmADg/GVC4ZvAaf1PkLiOLKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE70qB7fKghaW+EyqqGsqrYHwzINdgbGZNSmKF7XsAmPqA4PxlvFN4Db+J8hcRxJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWrRu5Ue3ypicNFtW0w0kLSltpXe0D4pkeu7AbGNvE9TMDGr6GYHCeMp1m8BtR+U8/9hcRxdKWKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANrVgPbJTejWrmZVjBE9F9ij9YHxTG8b1cwNjHLl4n5X9oE0cv+L+0DhPGPClP4EoYsX3l6U80BcRxr22KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL13rcB7VKlS9GvK/tMqxhlS9F97+0D4pkqXjflf2gbCOQsT18gMdAunkBynhpxLw3jGbwZ8ClabR48WsoaVw02vqZcRzUPgnx1V14F72DtLQh8FOO714F72DtFB+CfHX8lX9WDtFE5qcd3XIq/qwdoovNPjqlORe9g7RROanHULouA6z2PSwdoovNTjpv8FT9WDtFDmpx1X8F72DtFEXgpx0tnAvewdooq8FOO704Fd/1YO0UYrwT47WzgVf1YO0UZLwU47S/A+9g7RROaXHdKci9ulg7RReanHf8AJV/Vg7RQfgpx5s5FX9WDtFDmlx3T8F72DtFB+CfHf8j7NNB2ihzT47p+Bp+rB2ihzT48bq+B+9g7RROaXHa/6Vf1YO0UXmnx09vArbtLB2igvBPjmn4P3sHaKD8E+Omvwd/zYO0UH4Jccv8A6XvYO0UXmnx1V/8AC9ulg7RQ5qcdfyFOrTQdooxfglx1T8FX9WDtFBeCXHaf4Kv6sHaKK/BPjr+Rt+bB2ihzV46atwK35sHaKJzU47vTgNP1YO0UenSpC0a18jKouD0lfbyA+GZIWN6+QG/jkysT/wBhGCkSU26XfrCroZXeoBypVbL4gNDK71AaCVDanxAaGVu+IDQyt3xAaGVu+IGLkylVpVftAuhld6gNDK71AaGV3qBVJlV/9AuhlbviA0Mrd8QGhlbviA0UrvUBoZW74gNDK3fECKVKpdU/yBdDK3fEBoZXeoEUmW3SnxAmhlJWVf8AIF0MrvUC6GTRf7KiaGV3qRTQyt3xAaGVu+IDQyt3xAOVKXdgYqTKTa83tAy0MrvUCORJao1b2gY6KVo9nxA+CZJlY3/sDaRzHiermBNI+jmA0j6OYE0jq7ZgXSPo5gNK+jmA0r6OYDSvo5gNK+jmBNI+jmA0jp9jMBpH0cwGkfRzAKY6/ZzAukdfs5gXSPo5gNI+jmBHHVp4brrAukfRzAaR9HMCKbE1eCntAKa6XhzAaR9HMBpH0cwGkfRzAaR9HMBpH0cwGkfRzAjjqqOG3rAukfRzAaR9HMBpH0cwJpH0cwGkfRzAaR9HMDDSPR/ZzA+GZMeN6uYH3zIkom2wJUBUBUBUCwxUdQFQFQFQJUBUBUCWbT3AWoCoCoCoCoFqAqAqAqAqBFE2r2AtQI6NUewBUBUBUCuq2gSoCoFqArfaAqBjE6QAfBMeuwNhHC8TuBjhe8Bhe8Bhe8C4XvAYXvAYXvARQRK2Kj9QDDF0sgJhe8Ak2qp5AML3gXC6bQJhe/IC4XvyAYXvyAYXvyAYXvyAYXvyAYXvyAYXvyAYXvyANOtMW3qAYXvAYXvAYXvAOF1tFkBML35AHDE1aKj9QFpF0sgJhe/IBhe/IC4XvAYXvAKBpUTAkcLwu4GvmQvG7gbOOuJ3AxuAuA1qq4FuAuAuAuAeKlgJcBcBV1a3ALgKOtQFwFwFwFwLcBcBcBcBeiuBNarsBbgLgLgS4C4FrFRLcBLgLgW4C4C4EjrhYGvmVxsDYxqZif8AoDGkzvQC+VpTsAlJnegCkzvQC0mATytXb4AWkwBSYBKTAHlau3wAUmAKTAFJgCkwBSYApMAUmAWkwA1Npa3+AFJgCkwBSYApMAUmAKTAFJgEpMAUmAKTAFJgFekrZUANTWrW/wAAKTAFJvmdH7AJGpmFgaydC9K67QNtHXGwJRgKMA3RVewBRgWjAiUVr+vrAX3AWjAlHWoCjAUYESiq723AXz03AKMBRgKMBRgGm1Z0YFowIqtXVALRgKMAk26IBRgKMBRgSjAUYCjqwFGAowLRgKMBRgSNPCwNfMTxsD7Y/tVAxoqp7gFgDSaowFgCsruoFsAsAsBLUAVQCqAXUTTVKALALALASJ0VlV7gLW4FsAsAsAsAsAsAsAdnRgE1W6AlUBLVb3gG7q1vO9wFqgFUBbALAKgSOmFga+ZTGwNpGliYEogFEBNVtrcBaQ7gJRAKIBRAXCkBKQ1AtIdwEogDghbTpdAMKqwFEAogFEAogFEAogFEAogDSAlEAcKatYC0VGt4EogKkgFEBWoQDo3VgSiAJJOqAjUKVWAogJGlhYGvmJY2Bs44XjAmGwDB1gMHWAwdYDD1gMPWAw9YEwXbrtAqhVb3AmDrAYOsA4LWdPYAwdYDB1gMHWAwdYDB1gMHWAwdYDB1gMHWAcHWBMHWAwdYDB1gMHWBVBbaBcHWAwdYDB1gRwO25gMHWBMKTSrt6gLg6wJHC8FK7OoDXzINd3A2caWJgSiAUQCiAUVNgEogFEAogFEAotwCi3ATCqp02AFhaqtgFotwCiAYVStAIsLVVsAtEAogFEAogFEAaQEogFEAogFEAwp0dNgFogJCk0BaIBRASiAuG1abAJRAYxUaa3AfBMSxsDZRrWdwMdsTtReYBRUdwFOsA0Ad3VsBTrAlLq+QFp1gSnWAp1gKdYC1doCnWAp1gKdYCnWBcNm9wEpcCtKtnUBTrAU6wI0qbQMftQ6sXtoBadYCgFaAJW2gWnWBjClTaBlTrAU6wIq3XmANKtmAp1gYxrVdwPgmLXdwNvGtZ2Axp1AKdQCnUAp1AKdQCnUBEklRIBarW4CgAAAAAAAAAEhhoqAWnUApbYAp1AH6gIBPOrAUCAVbNgBqqtZ7wJCrbAMvYAeyyqBitr1bb6gMKs2qtAVbLw39YEjSo6XA18z7bsB+sXCZKiotntAnKpXeoDlUrvUByqV3qA5VK71Acqld6gR8KlUt/wDQLyqV3qA5VK71Acqld6gR8KlJf+gOVSu9QHKZNa7vWAfCpKu//oF5VK71Acrld6gOVSu9QD4VK71Acqld6gR8KlUs6f5AvKpXeoDlUrvUA+FSu9QJyqV3qA5VK71Acqld6gOVSu9QKuFSu9QHKpXeoEh4VKp/6BeVSu9QHKpXeoE5VK71APhUpWTt7QHKpXeoGMfC5OGjd3sVwPgmcKlY3/sD/9k=",
  "data:image/jpeg;base64,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"
];

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
  x: number;
  top: number;
  z: number;
};

/** Featured print (index 0) is front-left and on top. Later prints fan out behind it. */
function poseFor(index: number, count: number): Pose {
  if (count <= 1) return { rotate: -6, x: 0, top: 16, z: 2 };
  if (count === 2) {
    return index === 0
      ? { rotate: -8, x: -30, top: 28, z: 4 }
      : { rotate: 7.5, x: 34, top: 16, z: 1 };
  }
  if (count === 3) {
    const hand: readonly Pose[] = [
      { rotate: -8, x: -32, top: 32, z: 6 },
      { rotate: 7.5, x: 36, top: 18, z: 3 },
      { rotate: 2.5, x: 6, top: 12, z: 1 },
    ];
    return hand[index] ?? hand[0];
  }
  const span = Math.max(count - 1, 1);
  const t = index / span;
  const rots = [-8, 7.5, 2.5, -4, 5];
  return {
    rotate: rots[index % rots.length] ?? 0,
    x: Math.round(-34 + t * 68),
    top: index === 0 ? 32 : 14 + (index % 2) * 4,
    z: count - index + 1,
  };
}

function FilmCard({ bot, index, count }: { bot: Bot; index: number; count: number }): JSX.Element {
  const theme = useGrokTheme();
  const pose = poseFor(index, count);
  const paper = FILM[index % FILM.length] ?? FILM[0];
  const card: CSSProperties = {
    position: "absolute",
    display: "block",
    width: CARD_W,
    height: CARD_H,
    left: "50%",
    top: pose.top,
    marginLeft: pose.x - CARD_W / 2,
    zIndex: pose.z,
    boxSizing: "border-box",
    padding: 0,
    textDecoration: "none",
    color: FILM_INK,
    lineHeight: 0,
    background: FILM_PAPER_FALLBACK,
    transform: `rotate(${pose.rotate}deg)`,
    transformOrigin: "center center",
    boxShadow: index === 0 ? FILM_SHADOW : FILM_SHADOW_REAR,
    borderRadius: 2,
  };
  const slab: CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: "translate(3px, 4px)",
    background: FILM_SLAB,
    borderRadius: 2,
    zIndex: 0,
    pointerEvents: "none",
  };
  const captionTop = PAD_TOP + PHOTO;
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={card}>
      <div aria-hidden style={slab} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: 2,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Image src={paper} alt="" width={CARD_W} height={CARD_H} fit="cover" />
      </div>
      <div
        style={{
          position: "absolute",
          left: PAD_X,
          top: PAD_TOP,
          width: PHOTO,
          height: PHOTO,
          boxSizing: "border-box",
          padding: REBATE,
          overflow: "hidden",
          background: FILM_WELL,
          boxShadow: FILM_WELL_INSET,
          zIndex: 2,
        }}
      >
        <Image src={bot.src} alt={`${bot.name} icon`} width={INNER} height={INNER} fit="cover" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: captionTop,
          height: CARD_H - captionTop,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          padding: "0 12px",
          boxSizing: "border-box",
          lineHeight: 1.15,
          textAlign: "center",
          overflow: "hidden",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontFamily: theme.font.family,
            fontSize: 13,
            fontWeight: theme.weight.semibold,
            letterSpacing: "-0.03em",
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
            fontSize: 12,
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
              height: FAN_H,
              overflow: "visible",
            }}
          >
            {bots.map((bot, index) => (
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
