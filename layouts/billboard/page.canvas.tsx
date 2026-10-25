import { useGrokTheme, Image, useEffect, useRef, useState, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — billboard.
 * Centered poster column: avatar, oversized name, handle, bio, then full-width Install tiles.
 * Header is those four fields only — no pack wordmark, no kicker.
 * Tiles are neutral liquid glass. Frost, speckle, and sheen are photographed plates (Image),
 * over a restrained neutral field. No accent or warning wash.
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

export const LAYOUT = "billboard" as const;

type OrbSpec = {
  x: number;
  y: number;
  r: number;
  gain: number;
};

/**
 * Physical glass. Module-level so the pane is a material, not a theme tint card.
 * FROST, SPECKLE, and SHEEN are photographs. Panes paint them with Image.
 */
const GLASS_FILL_DARK =
  "linear-gradient(185deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 28%, rgba(16,16,20,0.58) 100%)";
const GLASS_FILL_LIGHT =
  "linear-gradient(185deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.58) 46%, rgba(255,255,255,0.42) 100%)";
const GLASS_BLUR = "blur(18px) saturate(1.15)";
const GLASS_EDGE = "rgba(255,255,255,0.55)";
const GLASS_EDGE_SOFT = "rgba(255,255,255,0.18)";
const SPEC = "rgba(255,255,255,0.82)";
const GLASS_SHADE = "rgba(0,0,0,0.40)";
const GLASS_SHADE_SOFT = "rgba(20,20,28,0.16)";
const CLEAR = "rgba(0,0,0,0)";
const VIGNETTE_DARK = "rgba(0,0,0,0.36)";
const VIGNETTE_LIGHT = "rgba(24,24,28,0.08)";
const FIELD_INK_DARK = "rgba(255,255,255,0.9)";
const FIELD_INK_LIGHT = "rgba(28,28,34,0.9)";
const PILL_QUIET_DARK = "rgba(255,255,255,0.14)";
const GEL_SHADE = "rgba(0,0,0,0.34)";
const PILL_QUIET_LIGHT = "rgba(255,255,255,0.62)";
const CATCH =
  "radial-gradient(80% 90% at 22% 0%, rgba(255,255,255,0.62), rgba(255,255,255,0) 50%)";
const FRESNEL =
  "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.18) 100%)";
const RIM_GRAD =
  "linear-gradient(155deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.32) 28%, rgba(255,255,255,0.05) 54%, rgba(255,255,255,0.28) 100%)";
const RIM_MASK = "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)";
const STAMP_DARK = "0 1px 0 rgba(0,0,0,0.92), 0 2px 0 rgba(0,0,0,0.42)";
const STAMP_LIGHT = "0 1px 0 rgba(255,255,255,0.96), 0 1px 1px rgba(16,16,20,0.22)";
const GLASS_SHADOW_DARK = `0 18px 42px ${GLASS_SHADE}, inset 0 1px 0 ${SPEC}`;
const GLASS_SHADOW_LIGHT = `0 14px 32px ${GLASS_SHADE_SOFT}, inset 0 1px 0 ${SPEC}`;
const FROST = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQoJBwwKCQoNDAwOER0TERAQESMZGxUdKiUsKyklKCguNEI4LjE/MigoOk46P0RHSktKLTdRV1FIVkJJSkf/2wBDAQwNDREPESITEyJHMCgwR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCADAAMADASEAAhEBAxEB/8QAGwAAAwEBAQEBAAAAAAAAAAAABAUGAwIBBwD/xAA/EAACAgECBAUDAgQFAgMJAAABAgMEBQAREiExUQYTIkFhFDJxI0IVM1KBQ2KxwdEkkQc04RYlRFNykqHC8P/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AMq2EpUpvrcv+r5fqSvv9x/zaDnmtZ/LrNaPDCh2jj9lGurCveOBKiGNSyRL/djpLbcQD63LyFR/g116n+2g7WWrPjjasQIrseGJdLssXgpCvW2iMg3mk6HbsNBp4f8ADgZUMilFfnz6kdzp9dhWzXNekqx1YBs0jcl30Erk7dfG12p4rimt2eUtgDnt2XsNb4XBQ42JMtn0J2/8tT/c7dz2GgtcRkbVmE7hYw3M8I2CjsNJ7sk+TzHk1lYpHyLnpoCMniXsY/yYpPQTs5B5nUzeP8NjGNxagSvykdf9NBU+GqYx1Jaw9Vqf1TyH9q9tcPj3y+VDTbmBD6I++gY5Kg54MdSAR3G8sntGuoLxdl0nlTw/ht/pK5/Vcf4r99Qa4vBTNV5qxG3MDpobK5ODw+pigKvdYdRzEY/51QL4fxuWzYlyNjjFdd+Et+466rYCJ7slq5u0EJ4nJ6H4Giuq96fxBn1SP0wRelEX7UXVtlbs8ePTGYpShZeGSUdT8DRCubHmtS82/JvK3MrvpfXAiDXLI8uun2r0LnQF0M3PYkYwLxueSrtyUaWvTnzOYdrM5WtXHHZnY8lHYaDXGS/x3MDyUMWOrjZB3A99ORTSey1+4pMKN+lF/W3toGpUw02sXX8riG7AftX2GphprfiOdi0n8OwFP75CduM9vk6B14fs4yxZMWDxwmmXkJ5huEHc9td5+jJ9ckQY2LLffIRyX4A1AcLeNwVVYbsnHO428tTzGlGUzG0JhxsBjD/cQN2b41RnBcTHIgyU21mX7IAeaDudELHRUmalG0snVpXHIH40BdRzRhezdbaSQbJGep+Tpz4f/UgayRsW5AnoNSgbxJYaGhNBS3Mso/Ul+NRODwaQtJbs89juAPc6QfvEXiKenW+lqDhkbkEXU/ifDrzucjmuIoTuIt/VIf8AjVVdYQ2cjIYV2irxptwryVBqd8XW2vzDE4r9KjCdpJPeRtA48NYyrhKCyTLws439XU/Ov13xB50xgxcPE7cuJR/vohhZhgrVh5zGxP12689Td7H3stbSI+iP326KNBRVMXDRoCCvtHuNmkbqdSnifKROi4DDAmPi3ndern50FD4cx8eJxP1GQIhRx6U6E6OlzNVmQxRgkco1PQfOgJeKvex5a5IxUHikC+/xqSvwZHxLdFSrGtLF1uYJ9McY92Pc6A3H5WOKzFgvDSlKyt+tbI9Up9zqm8U5WvgqIliTzrrIFiXqd++oPn0FZ4pv4v4kmZGk9UcRPrYfj2HzrOfxpYnlMOHoBAOSFV3Ynvqj2rhZa0n8U8TWTHJJ6hGT6tvxp3S8StMNqkC16kfKNdvU57nQM6WLu5SYTWmaKH7pJH7dhqhrOLEgjrgx0oOQP9WoBfFFmKvUjgXZXk/b76UTWUpYP9FPNsyH079BqhXhsTCkxtXT9VelO/D1CDTHI1wuxtOsSDoug6jlnnotQxMfkxN/OsNyAH50sklxOJIEJ+snT7dvt4u/zoMvo8jl3NnJzCpXPsx25aNqyV4HWng4OOQ/dORoGriOs6CReKRuex0dGqyMERApA4pCB0Ggl83avZTIDG4sMWY8JYftGtqWLxPhqAvJtcue/uOL/fQTueytyzcUzkvPIf04V6KNO8HiDHGLOUnEQI3O59vjQHXPF2NhVaWPrCRN9t25ltez1ctnqfAE+loqN2VBwhtB34fxMWLV7TgIF5KT0Glmf8aY+tYaPHVEt216zy+oKfgaCVbGZnOTm7k5jBFId3nnO3p+B/tomLNQY2UUPDVUHg5PakXd3bv8DRRhweTyJFi4zyzSnfif2GqjD4Sti0SSdRPKo3VduS6IpEhkmiE2Sfyoj9kI5bj51zby9OjBwQopI+1fYagjZ/rMtlR1eWQ9fZR30FnsjxX48RjGB8v0yS/66ofUnixOPUQp51qQcieZ1hYqx10ORz85LHmkAPM/20COxeyeecxwr9DjI+ZC8t/ydCz5rHYKLetEtu6w9LP9qDvtoM6kuQyn/VZCYpD7u3IfgDVJh8hAv/S41N3b75Op20DYRbSPbk9bk+nfoNHRqYcTI7k+ZMeFQOraAeWi2Kx3BXQC5a+9vcDtoGTHR06pkl2lsEbjfougUVKNbGwz5/KkEA7R8XVz2HxqUyebv5q0I04gJD6Y16ntoKKhjqfhWqt/NbT5GQfoVevB8sNVvhm5eysL2LDFYftCjkCT7D40E3/4h5yRLSYXGgtJ0YL1J1PlK3heJFliS3lnHGytzWHfpv3bQNKeLyWai8/JWSjSDcBj0HwPbTXB4XFYtvMfhdgfQDzLHQPGknuWEghXhX3O22w0ynv4/HlTLwkoNvljoJvL+ILFyyIaUTSSv9qjntr2jUgrP5uYn82c9IUPv86g3z1hcdjJDWUV3lX1yHqi6+f+Hle/lGaupFaM7tIerHVV9BqzVa7cTyK1gr6Qf2jSu/NQMzWshI1lhySJehOiEObs5K/GtapW8uM/bEg2H99CQYOvhoDlPET+ZJ1irKebH5+NFLvMyfiW8safpQ77KickQavfD1WCjw06K8ZUbyzH30FOYGuETyqKtNB6F921pErPOjRR8TDknF0Qd9RAOTyi2Mh9PVPmlPSzjnz+NdWVq1oA2Rl5nn5S9T+dUfPvGd6zk7UYaMrBH6YK46f30TQireDsV/E74WXK2BvEh/wh320Avh7FZHxVlvrbrMIieIs/bX0OrdhS3FjcWnEsI2BHTfudAsTFVcZes3pis+Q4SwJ58J1MYPDJkM/JdyL7orFvUfubQM8zZkqIUrqZJ5TsAvsOw0vhux4YefkXElsjfgJ3Ef5+fjQU2LvZG7jhNDEV87+X7FtZDw/YNhpshN6l5nc8k0A89sVx9HgoT9RMdmsEerb47aJx2PTHyrJbPmz+yk9D3OgT+N/Py1uPHwMSvIyMO+lmWsx+HqSUKwAcDdgvUt20UR4cxeQu1HvW38mJ+Zkc7f8AbRTTUKtlUqQnIW+i7jdV/t76IdQXIscijIyobUh/loB6fjUr4jpPl8yqsSIlPpXvoHkOJShXSnTTjsOo4yByUdtOsZTr0q5+ql4VP3bdW0BtN3mgW/mZQiHmkXQf9tFObWVgZa4+kqEff0Zx8agU21iwlfgowmSzJyU7dPnWOOxqQ+ZezUpkm4SzAn0xjVE5DJBfy8t51/6eHdhy6gaQlJPEvicvYJdQ2yxjptoL/harQ+jqkQoBtLIOX9td4qaOhRsWq6elBwq56ux0CbKXGw+BlvWd5r987RR/0r30loWThqS3su+88vqjg3//ACdA3gyN29j2uJWVWYbRvwc/7aRNiYcdIMr4kcugPFFUB9Uze2/YaCi8LXslkrL5a+61YF9MK9FiXsBqqM1fOVXjpzFasbfrTsPv+AdQKpbcNCQ18PXM1qT0q225Hz8a4kgjxUBtZe0r2D6vLU77HVE/j8jJlc55dOMKm+7SH2GuGrY+34hPG3nAP6mPPfQPL9C1k51SaQVaEPJIxy5aV3LkdGN4cJXPGfSZ2G7H4GgUkpgla/knNjIuN4oidxGO5+daeFY7uYtSZG05jgU/ceQ/toKPK56Gkgq0lHmOPU5666x88dOoMnkt5XblXhP7j3/GgZ042yMzZLIDy6UR2ij6cXYDR9jJtGEMi+p/5UC9vYnUAuRy1WiyvdKGztvwj9o7an8jPf8AEf6deM1sep3dzy4/ydUS2eykcEX8Iw442PKSQe50+8M42PAYv6iyR9XONyx/aNFbG1JlJxFEreQDsFXq50xv2UhEGMQqzjnIB0TRG17HQ37sUzjihrxjr+4gdBqbtYAS3ny2eYrAp/Th927ADtoGFOzenb6qSLyIVHDXrqNgB7E6FtYVZZTlM7KeBeYUnmfgaAFTf8UZKOhTVq9CM7bJy9Or1Y6VGilBXCxRDby09z3OgR3M0sDtXxEYWRv5k55kDtvpI+PvZeUvs7ov7mPLQLsvlIMDSfHY2QSW5eU0q9FHYa28G4ydFbKZN/KiX7A3Ik6KrpslVeNY2V3kl6DfoNeWUSGAvDAE4ByPXnoiNrYKx4kzTIz8FZTxTzE9ANOMnk4IEWjiY+GpWHCgHV27nQD4TFefJJkMixaOPnIf/wBRpjjQc1lnvWv06NUcgOw6AaC0lessMXEOPyxtHCvue+p3M5I4tJLDbSZCblGvUR/+ugnIqwgk+sy7NNYf1eUT/ro5zksvEELCvXPpjjHpB/toCKHhWtjpDLOA7p6mHXc6DmrXs5kzFCpEe+3wBoGU0kOJh+ixYEtkDaWfqE+B8/OhcZjSgfI32YQqd9z1lPbQdQ5CzavoVQ7sdoYV9h3OmqCtPd2uN9RJHzYk+kHtoCY3hkaSyUWOvEOXzqdmhn8SZPhO4rRnkPY6B9BHFjan0mMQea/J5Nug0otCWaQ1axJA/mSn3+BoNUqUsbEDZ9cjHlEP99A5jI5DJAY7Gp5ECj1lBtoA8N4OSOf6mypkkY7qG/10dnHSqoMp4li+2MdCdFe4Cr5ML5fKENPLyggH7RpplPqLNCOBf01c7u/f4GiEuXyMeLxoxmPHrk+8jq3xrDD4Sa0VadhEnV3PRRoNsndOWtx4DARkVYjs8n9R76p46NbHUocVDs7ghpmHfQYZHJR4tVpUyLGQkGzP1Ef40PUxgjRsjdYT2P8ADVuinvoFNob2yka/UWnO7MeaprI5qDHSlYmFu8RsNjusegf4tpvoHktvxSzjmTppTpNJUaKn+mrcnk99vfQfoMJCp2WPdQen9R7nQviKNII0SZgSo9MY6aBbT4aOLntoB9RL6Fc/tHvtrjGxqajsm7lm2J7n30HWbmavXjpBt5H2LKvtoqKI0KMdKHZJJAGmk9wO2gZ1aPm1iYwViA5t7toeeFKFYyBRxn7QPbQKYaTsWu3DwluSA9dtHqYKlcJFEOJjv03LHQcPK+5aZwigbtt7DtqVl+r8QZc+Snk0YTuZH6fnQez52KXKRY3Fq05Q7GTbfVVLaqw11fKWY1lVeGGup5k/OgTrRrQytfuOJZW5hR9qDWa/xPP8UVFGhpg7NKeQP40DKE4/wxWWnRK2MjMPU68wnzrim1u5Z8quD19b9zoFeOgtyT8XAWsznkPcDTXNZKhga6VbVnzr7j+Uh34PzoIm3mL+WmOPwsTIr/zGTq35OmWJxVfEsomIs3DzYDmE/PzoqxxlCzbH1VwmOuvQdC2qSqD9OQo4Ixoge9klpQGQ9APSO+o2eSxkbLWJ22UncseijQJ8lkZcrkocTjt/LQ7MR7fnVjWiFWKKnXACwrvI/c++gEqwRi/JkbQLRxern+4+w15ifMzeWlnsPw109T7dNu2ge2skfICVUCRn0p+O+hvra4r7zbOqdWPue2gxlKSkWrG5Y8ooew7nQ8JM00krMI44/ulboPxoB5sljpV8iGOScuf/ALtD5qnPJTFVHhrKw/khwD/fQSdu7U8LV2q4plnyc38yx1EYPsvzoPCQN9QcpmLLLCOfE53Zz/lH++iqaj4gqZWRljp7VYzt69yX0TYyWRyUwr1k8irFyWJBsDohrjsFDQga1kpws8vXfmwGvMjmoKFIx0I+BTyB/c50AXijxFFgK7wYpA96UbNKf2D41HYjBz5FJcplZ2SIk8Urcyx7DvoLDF4yRqq1sVXFOB/ukb73/vo+CtisRJs7CaUHYnrudAVdzYDRV41Mk8n2xL7ac1ZRBABkJVRjseDfQJ/EM9IEz2Z18pRuEU9dRr2sj4hnaHGReTWXkH6Ko776CkxGJx3huiXDixbk6t868hzkEFkxOBNM/wDhj2/Og6yUV6/AqJH5UbHYKBrZUXHVYsXX5M+zTMOp+NARkQ01iKhSHFIFHGw6IPfSSw/nZBakJ3hhPqPc6BhdkWpWLynZ2G3P2HxqcsTWsrtEG8ihFzYk7BvydAnv+JY8cHixGxmI4fPI6f8A064wdO5Oj38lc+nik5iWZjxP+Bor24PD2JDWkd8ncf7FYbIp7nvpRWhyHiLIEM5Kjm7nkka/7fjUH0Tw3Ux1ZUp1ouMbeqVvfudN79mtjIitKIb+7nqT8aqFFSG3lrw80u568I9hp/B4bjV/q8gQqoP04/nU0R1XBtmr72rr+VTRt5JD7/Gn0UNW9YWecLWxVMfpRnkG29zqhD4g8dRReZBhh5kh9PmbclHYazwOMtLXGZ8QWBBG38hJDzc/jQMZ/EOPw0bNjYzZyU3WaTpGPjS6hJlMtbDFpJdzuW9tAbl4cbTTzM5e4lUf+Xibcse2+ltPL3MtZjqY6t9PWB9EUY9u50DrJ17kNfghUvMRsD7DSJLVfw2pJIt5OXmT1Cf+ugsMBNbNRb2UkPmzDaCE/wCu2tWovXmktW5BxdWPsPjQYVL4MNuaP9KBVIeU9XPYaX4qVPN8xIyzuf009z8nQaZsQ1m8zJTeZMeawIdyNQ2Yyd3I2BRqRkbnYRR+w/8A730VmaFPB7SZDht3uq1wfQh7sff8awrwZPxNkCZGZkHU/tUdgNQVcHg+q8KrPKsUQHqPUn8a3erGsP0mIrGOpGeZ25yN3OqimweLhw+PNq+3mWZRuqD20DNBay2SCKvCN9lUe3ydQOGlr4KJaFICS1J/Mk1jkbsixfqOXdV6ew0COxfkthFSAxwf4NdR1Hc6RZStm87aXHVwYqyfzDvsBqgZf4RgLAiqRrkbsXMu38uM/wC51zVq5vxPkGuWPNlA5ITyVfwNA9hwuJxQM2Ysea68zFGebHsToXM+JJq1AvVgWrG/phiQcz2J76Cfp4iaypyecmMUO+44+p+ANNq+fgqRmLGRCMHkW/cdFMo7mYy6rUrAxx7epidth3J1+p4jF0bTTyyDIWU6KvNA3yffRDrGVblu2chkZPIhHPiblsOw0RlZnya8FVG+mXkD7udAh8T2ocPShpyHzJ22IgTv869rSzYfELZl2F60PQP6F0H6DEzy1vPl3ktWPtLfOupsQuGrtHWXjuSDeWX3X4GgX0fCosN591uHzO/Xbvp9SGNpQvBUjC1oVJd/dzoAKc5yeR8s+t2PpiXoq9zqqShGsSuWSOpD9xH7joN69Sa/vNw+XGeSFu2sblyHExtVxUZsW35M4G+2oOMLgLCcd7JPvZk+1d/t1zloKlWAvclEcKndtj6nPYaCYxOUs2LZZUWEsNyfaNfk6d3f/e2Okjx9iOCDoxB4TIffn21Qnx/hvH1HWHh8+RjxSN+0D8++nWTuWDVFTFwCvAo4RwLsWOgT1cJDBOk2XkLyud1h6n++i7uLo2LhtzrtBWTjYHoPjQfO8pdt+JMz5cCkRKeGKNftRe+qjCY3F0I+KwDYkQcgOm+ivbtjJ5WcY3FJ9PE5/UkHIKNPcXFQw9Uu54aVYbyzsPVM3x/fRAtPIWPE16S/fY1MTAd1TpuPbTOfxJAYilCJESMcj20ELQD5rxJJafd44ju0r9ABpiuRhyniLYHzVjICgdABoKO9k0pHzFIaZhwxgdFHxrh76rBGlpgCTxuT1PxoBcvf2h41Qgv6Yox1PbSDMTW68MWLqgvcsEFwv7fjQFQ24fDsK4qkwmyE231U/Ug/0DX0TF1OKnXhvHdgOPyv+dQa3PMkYrLMK8C9SO3Ya5x09T1Ljq4Kr90rDmdMG5SxO/FxDl0G+pPxAlatI17Mz8aRfya6ncufxoPnmWz4lZqmMVo6+/t90h+dU/h+KPGUUu+IbHAu28dcHn+Tqh9HmIrFc2YawghY7IDzLaLGXeOuIYIhLZYcvTvw6AA03hmM92TjsPz2J5jQueaxfxq4nFg7zNvPN3HbQIrVGLBwrisYnm3ZP58o9vjT/A4eOuoa8QSq8UhJ5IO350BOIu1bV+Z0jEdCIHfbkX17lK9LJRLYv244aiH9KtHzJ+T86CTy9y7lbEeMw8LQUYztuP3Hue+qCHwy8OKWsHCySD1sx22GglvEuRr0IDgsI24/+JnXqx7D40V4Hw7iGS5KRDBvzkbkW/GimOXv0qEnnL+vP/hL7L86E8PQT5G0+QvsWRDuq+2+iKeLGMC+UvFVVB+kp9tJmhNSGxlvLJmfdYC3U/OgxwuOiwFb/wBoM4PNuSkmpXPuf6jqh8O5W1O092zIFGxMjnoB2GoNLJs5MNbsuatAHkznYv8AgaX2PFES2FxmJQ8CD1bdT+Tqjf8AiOTnK1KpbzpPuI/aNA5HG1w3HkLqLHCN3YtxEn40CZcPUwivkbaKoj+wN+5tTcNix4gzyGbikUtuE0V9HTGzbIHKhlXpv6YxoCfPV6DPHSPEQdml93b40RvUiu32UHiMs3NiT9q6Y2L1el5VGpsSpClh1ZtBz9LBDlFghUNYkPFI5/aNEZmpJbiNKl+nBv8AqOT9x0EVnMkIZosDhg0h3Hmsg3Lt2/GiaMlTGWViybfWXOQaJTusX+Un3OgtaQo8Su0McEgTi8tfb86nJpL+cuTRVGMddTs8p/00CseG4frkr10Lu7epz1OuPFGWSjNHjKh81o/SsSdAfnQZYzw9ZukT35RGG5yMf2jsNVuOqrPJHXqR+Tj6/Vm6ue+gdRxx5RyXBNaLkqjodd369F3VppFaOEbiNeg20ELl3sZnMGRVIjB4I/gdgNPmkxvh3HxjI7zSgcS1l9z/AJtQTN3I5fxFeG4PG3phrp9sS9z86pMP4ar4qmRJIolb1TzNzP40E/4k8YwY5JKOBXeRuUk3v/30uxWAyWWqCzkZHWJuaR/1aqlvizJWcvkUh9TEnaOJR7/jRFeaLwrF5CFZMrKP1WHMQD+n86gP+vv2seIoePaY+pz1bRGHwqQyi7kztHF9kZ9zqoZz5+adXqYtNi/J3UdB21+rQJhYmyeRPHY22gh6nfudB1WknoUHyd/cWrZ/SjPUA++jq8Vl6SiWXypZx6Q3UDvoEmUSt4eher4fia3l7XKS0V3Kb/09j86UNAnhiJGtlZsrJzWPr5W/u3+bQNKMtmpQLXHZrt0ckPVEPUnsTqipmOrjQpOwHNgOrHQKbGSkq17GRfaIbFYt/f50j8KYqS5PJkpIyxY7h39z8aC4r1IlI+o3kYdI16aZLXWSPynkEYY81X2GgByN+R2THYpCkS8i/ux0xgwxSjwSMWcjd9zqBXfSHB12uSKrWCNoY/Zf8x1GUKt7xLl3WuSRxbzWH6L31RWo9DAwfTY5eOYj9Sc9W/HbUtn8xZtxvGkhWJfZT10AGCwCrH/FssvlVVO8aHk0p1QY7Ml7D2nGyRjaNPYDQCtjhjo5b9aJfrJRwxOw/ljuPnSnA+FXyF1p7Jd4Ebikc9ZG7aD6BHRq1IAEgD2mG0aDog+dIclQuZG0KcTcK7/qP7DQMKdaKkFoYiDzJNvXMR177f8AOiI8fWFsTW2+ssKd1jHNQfnvoNWx/m3TfyREjr/LhHRe2+sYqlm5YksysUj93I2/sNBhZtRY0FcfADafkrkbt+fjSyrgFpO2Wyi/VX5TvFEeYB7nQZSVpkvhJW8y7MeJ29kGnc4gq1FjY8ZP/djoFNjDzZi1H9YTHUj5leg03q3IHYUseqqkQ24h0XQdfWccwrUBxMTzf3Y6d1KIhqPJI/E/7mP+mg1x9KKEef6Wmf7B2+dFSTpEDEJOnOR9QQPiaeTNZIUqp2Uts79hp4EqYLw8lSmANxu7Dlxf31RKJJLk7ZhrHcsdmYe2n9Dw7VLqrr5iRc2A/cfnQJfFk7S2VQjfb0xQr9qjXWNxB+i8y1II4gNz7cR7aB3fMTem26hupVeijtrOjkZbTfTY2JYayHbj26nQPIAkELRQeueT+ZK3trnfH06zNPJxOf2r1OgXTTTSQFKqrVic7ySt12/Ol/8AFEjkFPFqW/qlPVj/ALDQM6VjjlSsrgs3OSQ+w99vjRNnLRSwTmEBalccKnpxNoE2AljuXpJhs5HN5D0UaIymapUI5LcrB3UbRKepPfQTWHtTXLE12Y8KblpZD7DsNNqNqGxZNqbmq8o0+NAm8S+IrFidMTigWmmbZivXXli6MPXhwOO/XyExH1Eg57H+nfQWuIx8WGoBrL8Vpl4pG/oHb866gnsZmfl/0+Oh9+nGdAdLcjhQujAADZQOupbKZuaaT6HHI007nmR0XQb4zEChXe7k5uBF5u2/Nj2GpbxBnLecvx47FxmNJG4UA67aCkxdOLFJHjKY864w/Wcc9j7jfTGzcFSJolk4UjG8j9z20EnXkfK5QyIpSEH7j1b8aplro0imVTIsfKOIe57nQD2Mb5dNfXxvIfUxOto/Kx9QDcDYbnQe15rVqLijUojHZR7nXtlIMcvm3mLFefB7k/PbQJXnyGakaQkRRb7KOiIO+u1SOtEYKKs4/wASUj1SHsPjQFLHNUgEI9d21yKj9i6UeI7TyPDhKcmyIR5rD9ze+gDzWcXEUkxGN9PLeaTfmx7aGx2Omyaizck8uunNnboPx30HN/Im9MuPxiFKMJ5kdZD3OnWOxtySqREvCSObtyCjQBWnp+GopGp/9Vk5vT5u2/Dv/T/zpv4K8OPj0/jua/8ANTn9CJuZ5++iq7KwQxVRLfmEUX3OP3OdT319zLTrVxtdkgB2RB27sdENTjYX4ab3VefbeXg58PxpljMTRpK3kKqqPudup1BFeLshZyt1cfjI2kAOygdNe0cXF4YrsSws5mcbMy8xCD7D51Q+xmPfGY1rFo8FiwPf7gP+dKMnVlufpqrLCvPb+o6DbH1IsenHLs05HojHRB86AGVnuZA1aHMg+uTtoHscTXJDLM3l0aw2Lf1ntoeOnLmLvG6mCmh3Jb3GgooyIouCjAOIDZCR0+dJZ8O920fPZpADu567nQbT4wKqrZYVq6jki9SP+dZNNRrbMyiKNeUUY5s57nQBX76wJJ9DGZLkq+uU8/LHYdtTIWPC1ZcxkjxTvuK0J6s39R+NFT2GpyZrKvauvwwR/qTP8dhpw88+ftfS0l8ihF6VC++grsP4Ygi8urAgMh5u59ho+9TmsualUmOpDyZhyDHRH7F+H6kVoWHhFiYcwX+1NNtoFna7YkFidBtFEvTf4GpQtt44y75HxFY4R1SBT0HbS02715GixMIpUxyMh5E/JOgBs52ngK30uOP1NuU7PMee57DR8NyzDj1Fpy1qwvpTfki9zqhniKK1aT2IuFZX5eaf2/OvKkdSGczcPGE5mR+rHQdSWxMz3JwZWHKGIdBpFmsz/Dk4HYPbk/avRNAoymQmp4xK6Etet82PuB7DTfE4o4ijDWI4rtgB5T/SO2gp7UleQxQBC3P9Kun+ra6ntUcanDckVpV5mJOi/GoNGyTLRE0wWusvKNP3Ed9CJlHWNhUURxpzaVtBIeIPFaVnMVQm1ckO3Eee340ui46q/wAQz9jgbbdId+Z1R0PFY8jhq11UOfSvDuW0lfG5jxLlyZAQiD1O32xrorTL2K9CkMVjW/RB/Wm/+Y3/ABp74Ki8xA6IfLTpy6nRF1ETShaxdlFdW9t/UR21hHnIZpCeAJWT7V/qOgAyuZvXZBRxUJ4368I5KNG1mq+HIl+tmE19xuQTvwDUHDX6WWdrNkMa0XM8+THtqazmZtZFvJqx+VWXlHFGNt/zoMcdhocVEc1nmXjUbwVz7n2J+NeY6a3mbrWn3igZty7dWHYaorWLPCkUIJRQOvQfJ0jyGRHnpSrt5srHYhemgYX7UeLxYDOFdRuxPXfUfi673LE2buoTXiJMYb97e2g38PBLueOQuHznDekew58tfQKlRXaa5eby1c7fJHYaCazPiGPBpJFSkWbIScnn6iIdh86Ew6LVpfx3OlvK34oIXPqnbufjQGVrE98vl8sSS3KCuvQDXF5L2Sj8sutaqvU77D8aBVNFRwUD2q8X1NtuUbsNwvyNTMeOyeayHm2uN2Y7kE9B/top1CaWNm8ioi3Lx5Fz/LiH++mvFZsY5oI2KVl5zSjlxnsNESn8MmyeYSCNCFJ2VB27nVNYz8GErjH4hQ5i9Mkw/c3Zf+dAdUp5TKIti55jsw3Cn2GmtTFR01FvKty6RQA9fk6BlPk6+PosaMKJMV3Z/wCnXzcTW89mWjrl5AW9cre/fUFzja1OZBjoW83gXd2Xpry0lXGxtNwqOH7SRqhFJUmzNgWLgYxA7qh/1OmmKrxSvJZuSCKjVHPbpoFeT8SzZZ2rYwCrTU7FvdtB0LEdOU/Rxmey3IORvz0DKfHwFVlzdsFz6jEDudTXi3O/UcFCmBXqRjbhXQOvCEUeMxYyl1OEN6a8bdXPf8aqa7WrkSzMC8j/AGRjoo76D//Z";
const SPECKLE = "data:image/png;base64,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";
const SHEEN = "data:image/jpeg;base64,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";

const FORE: CSSProperties = { position: "relative", zIndex: 1, minWidth: 0 };

function atHandle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function stampShadow(theme: ReturnType<typeof useGrokTheme>): string {
  return theme.kind === "dark" ? STAMP_DARK : STAMP_LIGHT;
}

function glassBox(
  theme: ReturnType<typeof useGrokTheme>,
  radius: number,
  extra?: CSSProperties,
): CSSProperties {
  const dark = theme.kind === "dark";
  return {
    boxSizing: "border-box",
    color: theme.text.primary,
    ...extra,
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    borderRadius: radius,
    background: dark ? GLASS_FILL_DARK : GLASS_FILL_LIGHT,
    backdropFilter: GLASS_BLUR,
    WebkitBackdropFilter: GLASS_BLUR,
    boxShadow: dark ? GLASS_SHADOW_DARK : GLASS_SHADOW_LIGHT,
    border: `1px solid ${GLASS_EDGE}`,
  };
}

function quietFill(theme: ReturnType<typeof useGrokTheme>): string {
  return theme.kind === "dark" ? PILL_QUIET_DARK : PILL_QUIET_LIGHT;
}

function pillFace(
  theme: ReturnType<typeof useGrokTheme>,
  fill: string,
  label: string,
  extra?: CSSProperties,
): CSSProperties {
  return {
    ...theme.font.subtext,
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    gap: 8,
    minHeight: 64,
    boxSizing: "border-box",
    padding: "0 26px",
    borderRadius: 999,
    backgroundColor: fill,
    color: label,
    border: `1px solid ${GLASS_EDGE}`,
    boxShadow: `inset 0 1px 0 ${SPEC}, inset 0 -12px 16px ${GEL_SHADE}`,
    fontSize: 15,
    fontWeight: theme.weight.semibold,
    letterSpacing: "0.04em",
    ...extra,
  };
}

function iconWell(size: number, radius: number, theme: ReturnType<typeof useGrokTheme>): CSSProperties {
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: radius,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    background: theme.fill.secondary,
    boxShadow: `inset 0 1px 0 ${SPEC}, 0 0 0 1px ${GLASS_EDGE_SOFT}`,
  };
}

const AVATAR_SIZE = 60;

function avatarRing(size: number): CSSProperties {
  return {
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    borderRadius: 9999,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    boxShadow: `0 14px 28px ${GLASS_SHADE}, inset 0 1px 0 ${SPEC}, inset 0 0 0 3px ${SPEC}, 0 0 0 3px ${GLASS_EDGE}`,
  };
}

function GlassPhoto({
  src,
  blend,
  opacity,
  imageHeight,
  top = -18,
  bottom = -18,
  height,
}: {
  src: string;
  blend: "overlay" | "screen";
  opacity: number;
  imageHeight: number;
  top?: number;
  bottom?: number;
  height?: string;
}): JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: -18,
        right: -18,
        top,
        bottom: height === undefined ? bottom : undefined,
        height,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        mixBlendMode: blend,
        opacity,
      }}
    >
      <Image src={src} alt="" width="100%" height={imageHeight} fit="cover" />
    </div>
  );
}

function GlassLayers({ tint, tintAlpha = 0.26 }: { tint?: string; tintAlpha?: number }): JSX.Element {
  return (
    <>
      {tint ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: tint,
            opacity: tintAlpha,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ) : null}
      <GlassPhoto src={FROST} blend="overlay" opacity={0.82} imageHeight={440} />
      <GlassPhoto src={SPECKLE} blend="screen" opacity={0.7} imageHeight={440} />
      <GlassPhoto src={SHEEN} blend="screen" opacity={0.96} imageHeight={210} top={0} height="62%" />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: CATCH,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: FRESNEL,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: 1.5,
          background: RIM_GRAD,
          mask: RIM_MASK,
          maskComposite: "exclude",
          WebkitMask: RIM_MASK,
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </>
  );
}

function Lumen(): JSX.Element {
  const theme = useGrokTheme();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const kind = theme.kind;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = (): void => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? 0;
      const height = parent?.clientHeight ?? 0;
      if (width === 0 || height === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const dark = kind === "dark";
      for (const spec of FIELD) {
        const color = dark ? FIELD_INK_DARK : FIELD_INK_LIGHT;
        const radius = spec.r * Math.max(width, height);
        const glow = ctx.createRadialGradient(spec.x * width, spec.y * height, 0, spec.x * width, spec.y * height, radius);
        glow.addColorStop(0, color);
        glow.addColorStop(1, CLEAR);
        ctx.globalAlpha = (dark ? 0.14 : 0.07) * spec.gain;
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.32,
        Math.min(width, height) * 0.12,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.75,
      );
      vignette.addColorStop(0, CLEAR);
      vignette.addColorStop(1, dark ? VIGNETTE_DARK : VIGNETTE_LIGHT);
      ctx.globalAlpha = 1;
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    paint();
    const parent = canvas.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver((): void => {
      paint();
    });
    observer.observe(parent);
    return (): void => {
      observer.disconnect();
    };
  }, [kind]);

  return (
    <canvas
      ref={ref}
      role="presentation"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function FieldGrain(): JSX.Element {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url("${FROST}")`,
          backgroundSize: "192px 192px",
          opacity: 0.22,
          mixBlendMode: "overlay",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url("${SPECKLE}")`,
          backgroundSize: "192px 192px",
          opacity: 0.2,
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

function pageStyle(theme: ReturnType<typeof useGrokTheme>, extra?: CSSProperties): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    minHeight: "100%",
    overflowX: "hidden",
    background: theme.bg.base,
    color: theme.text.primary,
    fontFamily: theme.font.family,
    boxSizing: "border-box",
    ...extra,
  };
}

function bandStyle(
  max: number,
  gap: number,
  align: "stretch" | "center",
  extra?: CSSProperties,
): CSSProperties {
  return {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: max,
    margin: "0 auto",
    boxSizing: "border-box",
    paddingTop: "max(24px, env(safe-area-inset-top, 0px))",
    paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
    paddingBottom: "max(28px, env(safe-area-inset-bottom, 0px))",
    paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    gap,
    minWidth: 0,
    ...extra,
  };
}

const FIELD: readonly OrbSpec[] = [
  { x: 0.5, y: 0.16, r: 0.42, gain: 0.55 },
  { x: 0.9, y: 0.72, r: 0.28, gain: 0.28 },
];

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

const NARROW_TILE = 400;

function useNarrowTile(): { narrow: boolean; ref: (node: HTMLAnchorElement | null) => void } {
  const [node, setNode] = useState<HTMLAnchorElement | null>(null);
  const [narrow, setNarrow] = useState(true);
  useEffect(() => {
    if (!node) return;
    const measure = (): void => {
      setNarrow(node.clientWidth < NARROW_TILE);
    };
    measure();
    const observer = new ResizeObserver((): void => {
      measure();
    });
    observer.observe(node);
    return (): void => {
      observer.disconnect();
    };
  }, [node]);
  return { narrow, ref: setNode };
}

function InstallTile({ bot }: { bot: Bot }): JSX.Element {
  const theme = useGrokTheme();
  const pane = useNarrowTile();
  const label = theme.text.onPrimary;
  return (
    <a
      ref={pane.ref}
      href={bot.href}
      target="_blank"
      rel="noreferrer"
      style={glassBox(theme, 28, {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 14,
        width: "100%",
        minWidth: 0,
        padding: 18,
        textDecoration: "none",
      })}
    >
      <GlassLayers />
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", minWidth: 0, ...FORE }}>
        <div style={iconWell(64, 16, theme)}>
          <Image src={bot.src} alt={`${bot.name} icon`} width={64} height={64} fit="cover" />
        </div>
        <p
          style={{
            ...theme.font.heading1,
            ...FORE,
            color: theme.text.primary,
            fontSize: "clamp(28px, 8vw, 40px)",
            lineHeight: 0.92,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            textShadow: stampShadow(theme),
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
          ...theme.font.body1,
          ...FORE,
          color: theme.text.primary,
          fontWeight: theme.weight.regular,
          letterSpacing: "0",
          textTransform: "none",
          margin: 0,
          overflowWrap: "anywhere",
        }}
      >
        {bot.desc}
      </p>
      <span
        style={pillFace(theme, theme.fill.primary, label, {
          alignSelf: pane.narrow ? "stretch" : "flex-end",
          width: pane.narrow ? "100%" : "auto",
          minWidth: pane.narrow ? 0 : 216,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        })}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "70%",
            overflow: "hidden",
            borderRadius: "inherit",
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 0.45,
          }}
        >
          <Image src={SHEEN} alt="" width="100%" height={52} fit="cover" />
        </span>
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          Install
          <Arrow color={label} />
        </span>
      </span>
    </a>
  );
}

function MiniLink({ link }: { link: Link }): JSX.Element {
  const theme = useGrokTheme();
  const showDisplay = link.display.trim().length > 0 && link.display !== link.label;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      style={glassBox(theme, 999, {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        maxWidth: "100%",
        padding: "0 14px",
        textDecoration: "none",
        color: theme.text.secondary,
        ...theme.font.subtext,
      })}
    >
      <GlassLayers />
      <span style={{ ...FORE, overflowWrap: "anywhere" }}>{link.label}</span>
      {showDisplay ? (
        <span style={{ ...FORE, color: theme.text.tertiary, overflowWrap: "anywhere" }}>{link.display}</span>
      ) : null}
    </a>
  );
}

export default function App(): JSX.Element {
  const theme = useGrokTheme();
  const handle = atHandle(HANDLE);
  return (
    <div id={LAYOUT} style={pageStyle(theme)}>
      <Lumen />
      <FieldGrain />
      <div style={bandStyle(500, 22, "stretch")}>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
            width: "100%",
            minWidth: 0,
          }}
        >
          <div style={avatarRing(AVATAR_SIZE)}>
            <Image src={AVATAR} alt={`${DISPLAY_NAME} avatar`} width={AVATAR_SIZE} height={AVATAR_SIZE} fit="cover" />
          </div>
          <h1
            style={{
              fontFamily: theme.font.family,
              color: theme.text.primary,
              fontSize: "clamp(56px, 17vw, 86px)",
              lineHeight: 0.82,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
              width: "100%",
              minWidth: 0,
              overflowWrap: "anywhere",
              textShadow: stampShadow(theme),
            }}
          >
            {DISPLAY_NAME}
          </h1>
          {handle.length > 0 ? (
            <p
              style={{
                ...theme.font.body1,
                color: theme.text.secondary,
                fontWeight: theme.weight.medium,
                letterSpacing: "0.01em",
                textAlign: "center",
                margin: 0,
                width: "100%",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {handle}
            </p>
          ) : null}
          <p
            style={{
              ...theme.font.body1,
              color: theme.text.primary,
              fontWeight: theme.weight.regular,
              letterSpacing: "0",
              textTransform: "none",
              textAlign: "center",
              margin: 0,
              width: "100%",
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
              <InstallTile key={`${bot.href}-${index}`} bot={bot} />
            ))}
          </section>
        ) : null}

        {links.length > 0 ? (
          <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, width: "100%", minWidth: 0 }}>
            {links.map((link, index) => (
              <MiniLink key={`${link.href}-${index}`} link={link} />
            ))}
          </nav>
        ) : null}

        <p
          style={{
            ...theme.font.caption,
            color: theme.text.secondary,
            fontWeight: theme.weight.medium,
            letterSpacing: "0.04em",
            textTransform: "none",
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
