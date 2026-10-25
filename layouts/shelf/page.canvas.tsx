import { useGrokTheme, Image, type CSSProperties } from "grok/canvas";

/**
 * Pinned .me pack — Shelf.
 * Still-faithful materials: warm oak spine / wall / ledge JPEG data URIs as
 * real <Image> fills (not CSS background wallpaper crops). Thick book spines
 * (~110×340), recessed purple icon wells, engraved serif titles, soft shadows
 * onto the ledge. Swallowtail ribbons under the ledge.
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

/** Warm oak / paper tiles (data:image JPEG). Decorative materials only. */
const WOOD_WALL = "data:image/jpeg;base64,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";
const WOOD_SPINES: readonly string[] = [
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCADIAFADASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAAAgADBQYHBAH/xABCEAABAgQCBQgEDQMFAAAAAAABAAIDBBEhBXExNUFhshIiMlFydLHBBiU20RQVFjNCRVJTVGSBkZMjRJITJmKC8P/EABkBAAMBAQEAAAAAAAAAAAAAAAABBAIDBf/EACMRAQABAwMEAwEAAAAAAAAAAAABAgQxMkGBAxETkRIUIUL/2gAMAwEAAhEDEQA/AIQFtV7UbAm4kQQ4bnkWA0KUlJSXjNleWIlY0J0R1HgUoQABZQVTFOXo0xNWHCDuXvK3KbbhMlt/1/5B7kXxPJaP6/8AIPcseWl08VSDDskQcdynRg0j1TH8g9y9GDSO34R/IPcl5KS8VSBD3A3KIE71PtwSRP4j/Me5OtwGRoLzP+Y9yPLSJ6VSvVOxE0lHOQhLT0eBDc5zYby0E6aJtpqNNV0z+uXbsrUzOlzxBBryjQq2SPSw/dLO4gqA5/KxBg3q/wAkedIW/tncSXXjt2at6vl3SzTzRVH9KqbbcBHocpVpwbEQ0b02CjG6yAdaU+w3Ga5WmpCfhm+naPJZkJDEYMNkhIxWtAiPL2ucNJFHWPWs/hO5ovT9FoWJn1Vh3bfwuWeQugKhV05RfzzKkgUxGHXr8loEgedIH8s7iCz+vrJmfkr/ACOmR7s7iC3cbM2u6WadCOt7pphojqVIuODd1og6lN6AGpsUSQONT7DU0/8AaQuZpqAumEbtO/3JSaTxPVOHdt/C5Z1Bu0UWiYofVGHU+2/hcs7g2aMlVTn0i/nmVKbrJg6itAkzz5En8K7iVBGsIefkr9J3dJd1dxBdLjZm13SbSEXKoSgbaqPSaqNcII9ybaaIwetAOtT8M1Iz81zNrRdELYB1jxSk0pilsIw2n2n8LlnUDojJaJimp8N7T+FyzqD0G5KmnPpDOnmVP+sYfVVX2T6Ul3V3EqF9YQ8/JXyUNHyPdncQW7jYrXdJDTZOHSm23REqRcNECgJpRe1qAgH2HnX3J5lahc7dIun2GpGzQlIS2KH1Nhp/5u4XLOoFOSMlouK6lw3tO4XLOZcjkjJVU59Ip08yqA1hDz8le5TpyPdjxBUT6wh9ryV6lRR8iSP7Y8S1cbFbbpJpsEdboG0skTeykhcdrZeg2QBFWyYOtNwuhho4ZrmbdwT8PSFmQmMU1HhvadwuWcwDRoyWjYpqLDa/adwuWcQCC0ZKqnKKdPMqiNYws/JXuWP9SRH5d3iqLb4whUG3yV5lfnJPu7rfqtXGxW2JSTTcL3agbWy9BuFKtGCjBTY0owbVQDjXc5dDFyjSn4RuKrMmm8U1HhnadwuWcQOgMgtGxXUOGdp3C5ZzA6AVNGZ4RTp5lUxrCHn5K8St4kn3Z3iFRxrCHn5K8y1nSVPw7vFbuNitsSkGGiQN140pGzlKtObV6ChBqvUA4CKp+FWo66rmYbrphm4zCUiE1ip9Q4X2ncLlnEEnktyWjYqPUGF9p3C5ZzB6DVTRn0inTzKqfWEPNXmWNHSfdz4qjNBGIQ81eJckRJIflz4hauNhbYlItIIuvK3SAoAkdN1KtEDUURDQmw6iKqZQcBvQLohmhBrtXM3Sn4f0RvWZNPYrqHC83cLlnEHojJaLix/2/hZHW7hcs5gE8kVVFGfSKdPMqsNYQ9GnyV3l/nJPux8QqQNYQ8/JXeW+ck+7HxC3cZgW2Jd7amhSukDoSrdSrCNkWxeJVTBxqfhm4zXMDzl0M2V60p/DT2Lez2F5u4XLOIHRC0bFvZ/C83cLlnUHoALvTmUU6eZVYawh5q7yw50p3Y+IVFFTiMPNXiWry5Sv4c8QXS42K2xLvGgdS9Nl4lVSrHtUXKuhG5e7AgCC6IezNc4sE+yzmlKcHCfxb2ewo12u4XLOIJ5oyWjYt7P4Vm7hcs5g9EZLvRmUU6eZVUWxGHmrxKjnyndz4hUnRiUMb1d5bpyY2/Bj4hdOvsdtiXcPJKyQNF5oNdylVvRpzRVQjSCvQUwJPQzcJmt09Du4ZrMnCwYt7O4Vm7hcs5gmjRktFxZ4+IMKb9Ilxp/1KzuFcDJd6MyjnTzKrxgYcy2KBXknQpqD6VSsJ0AxIEUGHDLDShrdJJVz06a8p6epVRh0/LKQ+5j/ALBL5ZSP3Mb9gkks+Ch0+xWQ9MZHZBjn9AiPpjI/cR/2CSSPBQf2KxN9MZEmgl45OQXTB9KpZ9KS0xnZJJYq6NBx165c7sSnJmfjR2xorITieRDcQSxvVXyRNsEkkvjEYHeZy//Z",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCADIAFADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgMBBgcABAX/xABFEAABAgMEBQYJCQgDAAAAAAABAAIDESEEBTGxBjVBcXMiUWF0svASEyQlMjSBg8EVI0VUZJGT0dIUM0NTY4KE4lJiof/EABkBAAMBAQEAAAAAAAAAAAAAAAABAwQCBf/EACERAQACAgIBBQEAAAAAAAAAAAABAwIyEUIxBBITIVFB/9oADAMBAAIRAxEAPwCumS4SpQH2qJHnKkAjFYW8QUgKJqZFPgOkVMiorNGJpxA5dMhEFFFLcEcEkIwgCMIN41IONVElISJyJQCuTAgUUuZAEU+ZAGMMEWykkvBHhJAEApaaqAQMUUwJIDxNex0eHCe/wS8yEhNfVNzQhbY1nNtfOEGkuEEVmJ/8l8Bjp3vZzPmVsl57t8/6fZUs5mJ+lq8YmPsgaPwZeuv/AAR+pGNHYBl5c/8AAH6l7+hGCQN6j78v1b48fx88aNwfrzz7gfqRDRqCTS3O/AH6l9MYY95pgIoj35fo+PH8fMGi8Jwn+3v/AAP9k1mibHkNbeJBNKwP9l9JjpNHfYvRBcfGNIO0BL5MimrFRXsMKNEhuIJY4tJG2RkuC0O0aHWS32Zlps7WQo8Roe4OBLXHn6Cqfelkh2aywnNhNhxBGfCeWTk6UvjNafdMccsscTzx/FSsr/GXpAIwDgFcRry3+77KolyP8Zb4bpmsVXn6dt/u+yuLY4yVo+8XsnQFHM4pZqAinSSi0nNNK96pgOG9JYad+dMaaVSBrDQTPeS9EI8sb/yXmaaHd8E+EeW2u38lya53fq+z8MZLMr+/ct63GWm3fq+z8NuSzG/z8w3rcbNa8urzau7PtHq2qFP+b8FfByr9vCQ/l9lUTR31iCeeKr0wyvu3nh9lK/eV/T6PU8yRgyS3SlWdUQNFCGk5pCMGlUoFGDMe0JGc0iRToRHhtPSvOCfBp0p0KXhtPSkF3u7V9n4bclmN/wAvENl9bjZrTru1fZ+G3JZhfxlCGB8qjZrXl1edV3UHR31iDPDxivGF+Xh7vsqjaPVtEPiq8fTt4UH8Psrm7eV6NHqcZlHzTG1LdRwR8yg0GtPMibSSUKSqmDAIdGtcZBOhUe0DvVIBk3cmwnctu9cya93dq6zcNuSy7SCkJvWo2a1G7tXWbhtyWW3/APum9ajZrXl1ebV3UPRz1mHxFd5+e7f7vsqkaOnymHxVdZ+erf8A2dlK7eV6NHqdVwRzwnRL2pjq/eoNIxKYTBgErpRA4ApA0GnQmwjympIkQmQjN4Sk2gXbq2zcJuSyy/vQHWo2a1O7dW2XhNyWWX/6DetRc1py6vOq7qJo4PKYXFV1E/ly8BT+H2VStHqWiHxVdJ+ereeH2UXbSv6fR6nY+xFNATVEoNAxginOU0E6+xSCZDeEDk5homQz84N6S3CqNh5Q3rmTaLdurbLwm5LK7/JLGj7TFzWp3Zq2y8JuSyrSA8gS+sxs1qy6vPq7qPo8Z2iHxVdBW+bd7vJUrR2lph8RXQHzzb/7OyldtK1GkPSTUVRTpPvsQEVCME9/YoNIgdklOwd9iD8kRrIII0GSNhPhDelHYmQjygekLmXTRrr1ZZeE3JZVf9QB9pjZrVbs1ZZeE3JZRf4Mh1qNmtU+cXn1eclI0eaDaIYw+cVyaZ3vbugs7Kp2jp8ph8RXH6Xt0v8ApkldvK1Gj04oh07EBMiUWyai0iOJmURx3IJ1POiJmkDHURsMiN6U52aNmI9qUhpV16rsnCbksov93JHWo2a1e69WWXhNyWT3/wCj/kxc1pnqwVdlK0eE7QziK3it8W7fD7KqWj3rLOJ8FbAfPFu3w+yldvK1GkPS7HpmpaTJA41/9U8yi0GCczMohign4RKkOzQDTWQ6UbfTalNP3z+CNmySUm0y6tV2ThNyWTX/AOjtHlUXNazddLrso/pNyWTaQehL7VFzWifOLBV2UzR/1mHxPgrc2XyvbuclnZVR0f8AWYfEVtB88W7ezJK3eVqNIPdUop0CA1M0QwUmkbSPCMudcN65prLpUN2oI1HDxHsS5y+9Sw1C5k2oXVqqycJuSyTSDDb61FzWt3VqqycJuSyPSHD/ACYuavPnFgq7Kho9Lx0PifBWz6Xt29mS5ci3aVqNIONXKdgXLlJoS0ETRD0Vy5BjJr96lhmQuXJSTUbr1VZOE3JZFpCaHrUXNcuVp/jDX3f/2Q==",
  "data:image/jpeg;base64,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",
];
const WOOD_LEDGE_TOP = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAYAMgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAMCBAUGAf/EADMQAAIBAgIHBQYHAAAAAAAAAAABAgMRBCESMUFRcXKxBRMiM2EGJDaBkaEjMlJjc5Lw/8QAGAEBAQEBAQAAAAAAAAAAAAAAAQMEAgD/xAAhEQACAgMAAQUBAAAAAAAAAAAAAQIxAxESQRMhMlFxgf/aAAwDAQACEQMRAD8A55sXLNZ7CbIS3EiotiKlndDpvIRNngI4J+/Q4M6+HnL+KPVnH4J+/wAdyizr156X7UerM+ezTgoenfIG7ar7Q1L5gQLmpXV+zpyUXZRj4dFqMc1nHwq/zf1M+LLtaUFgpaLgnJR8Wknp6skrtq3ruKUXcrmtHGOh0NZbg8o866lODVy1B5R5kQZZHIv4uxXMjUw7/BjwRlSy9rsVzR6GphnehDlLS8fhCNssJ5fMs4Cfd4m+nGHgkryqOmv7JNoqEmCens6a2tGrXdOtLSnWw8nGMkr4qc3fZrWzcUoS+olZO4yLzyGcugitFqm8iGMd+zat/wBM+rPaTtawvGO/ZtTln1ZNWUdHPxy1DYiYsZE1mJDE9h6QTsSUgaEmr7QPEwATIbFzvrACxJipMROSswAUBDBu2NjwZ2EPOXrSiuoAZs/yNOCgnWanopfle087+X+QAdRxxaOXkluwVefpl6ElXn6fQAHiIdy+xlPEuMvEsjThK6i1qck0AEMsUqL4ZOVnJS+LsVxiaWHejhoyepRzABfj+HK8ku8d9z4EtOW/7ABbhEe5HqqSW37E1VlfX9gAOEHqSLWGq6b0dqz4nuLz7Oq8J9QAhJakaoPcfc55PMYmAGkyI9TJXABOj1MAABP/2Q==";
const WOOD_LEDGE_FACE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAoAMgDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAEFBAIG/8QANRAAAgADBgQDBgUFAAAAAAAAAAECERQEBSExQZJRVGGREjJSAyI0RIHRQnGCorFicqHh8f/EABkBAQEAAwEAAAAAAAAAAAAAAAABAgQFA//EABkRAQADAQEAAAAAAAAAAAAAAAABEVECIf/aAAwDAQACEQMRAD8A6PCp6ll0ClmFnkcl2VlhkNJJlx6l01A8pYaDw4ouBdAUkuB6l+RFFLL+CzmsswUSEpcS5aYialKWP5BTPiy54BSLOQCTlmVTxIXL/gQSbzLIJz0E8QoljgVpsT6CeGQQSK0siJ4nqbQHlplUM9QnxHiQV6UKS1EvqRMTQFxlqBhL/YCPinbrz5l7UVW285Y2n9qO6mWhaaHoe9xjXqdcNbefNftRK68+ae1HfTQ9CqzLgiXGFda4K69JSdqe1CtvSfxL2o0KaHKRKZdMS3GFda4K29Oaf0hQrr1l8VFtX2O9WZcEWmhJ5hXWs+uvTmntX2LX3plVNfpR3uzQ9C00HRC4wrrWerdevNPahW3tpa2v0o0HZYXl/IpYeCFxhXWs+tvZ4Vb2Itde3NPajQpoeCFNDPQXGFdaz1bb2fzb2IV17c29qNF2eHgiU0MskLjCutZ9de3NvahX3tzcW1fY0VZ4enclPDx/yImMK61n117c29qCt97c3FtX2NGmh1kKeHoLjCutZ1de0/i4tqLX3vzcW1GhTwy0YVmg6C4wrrXArwvaXxcW1Err1zrItqNCmhfpLTQ8ULjCutZ9ber+ci2oHerPCtUBcYV1r5OKzxT80fdkpopT8UfcA22kP2ET/FF3Yp4vVH3YAPSnilLxR9yU8Xqj3MAL7q08Xqj7sU8Un70ePUAHqqzR+HzRS/uZKaL1x92AE9KeL1xv6inil5o+7ACqvYRy88cl1YVnjeHii3MAJ6qs0c1OKPcxFZo8vFHJ/wBTABCUkXqi7s9KzRqXvR7mABHZo8fei7sqsr1cfcAhckNla1i3M9Uzese5gFX0pXxi3M9qzPi+4BD10exs0nqADGVh/9k=";
const PAGE_EDGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCADIAAgDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAIBA//EACEQAAICAgIBBQAAAAAAAAAAAAABAxECITFBgRJRYXGh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwCFXNfoMxyXj6Bl0Rh6mgTG2vcAZHugIna1sATDaW2DcGtMEoiLKlQENVtAo5x5VpAmN0BAwXDBkeQAmPhAR6ST6ACO2uQI32wCpib+PIMib0AkInWIMw4AUjAj63oAbgn2AAP/2Q==";
const RIBBON_FABRIC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCABgACADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABcBAQEBAQAAAAAAAAAAAAAAAAABBQb/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A54wHRtKCooqQASAKKgAgqKKyoCQBRUAEgqKKyoCQVAV//9k=";

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

function Spine({ bot, index = 0 }: { bot: Bot; index?: number }): JSX.Element {
  const theme = useGrokTheme();
  const wood = WOOD_SPINES[index % WOOD_SPINES.length];
  const { base, suffix } = splitBotName(bot.name);
  const accent = theme.text.accent;
  const box: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flex: "0 0 110px",
    width: 110,
    minWidth: 100,
    maxWidth: 120,
    height: 340,
    minHeight: 340,
    boxSizing: "border-box",
    padding: "14px 10px 12px",
    paddingRight: 18,
    borderRadius: 12,
    border: `1px solid ${theme.border.strong}`,
    backgroundColor: "#8a5520",
    boxShadow: `0 18px 36px ${theme.border.subtle}, 0 6px 12px ${theme.border.default}, 2px 2px 0 ${theme.border.strong}`,
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
    minHeight: 48,
    boxSizing: "border-box",
    padding: "8px 4px",
    borderRadius: 8,
    border: `1px solid ${theme.border.strong}`,
    background: theme.bg.base,
    color: theme.text.primary,
    fontWeight: theme.weight.medium,
    position: "relative",
    zIndex: 2,
  };
  return (
    <a href={bot.href} target="_blank" rel="noreferrer" style={box}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          borderRadius: 12,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Image src={wood} alt="" width={110} height={340} fit="cover" />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 9,
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
          boxShadow: `inset 2px 0 4px ${theme.border.subtle}`,
        }}
      >
        <Image src={PAGE_EDGE} alt="" width={9} height={340} fit="cover" />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${theme.border.subtle} 0%, transparent 18%, transparent 72%, ${theme.border.strong} 100%), linear-gradient(180deg, ${theme.border.subtle} 0%, transparent 12%, transparent 82%, ${theme.border.strong} 100%)`,
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: 12,
        }}
      />
      <div
        style={{
          width: 44,
          height: 44,
          flex: "0 0 44px",
          borderRadius: 10,
          overflow: "hidden",
          background: accent,
          boxShadow: `inset 0 2px 4px ${theme.border.strong}, inset 0 -1px 0 ${theme.border.subtle}, 0 1px 0 ${theme.border.subtle}`,
          border: `1px solid ${theme.border.strong}`,
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 7,
            overflow: "hidden",
            background: theme.bg.base,
          }}
        >
          <Image src={bot.src} alt={`${bot.name} icon`} width={36} height={36} fit="cover" />
        </div>
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
          minHeight: 160,
          position: "relative",
          zIndex: 2,
          paddingRight: 2,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 17,
            fontWeight: theme.weight.semibold,
            writingMode: "vertical-rl",
            letterSpacing: "0.02em",
            overflowWrap: "anywhere",
            maxHeight: 210,
            textAlign: "center",
            color: theme.text.secondary,
            opacity: 0.92,
            textShadow: `0 1px 0 ${theme.border.subtle}, 0 -1px 0 ${theme.border.strong}`,
          }}
        >
          {base.length > 0 ? <span>{base}</span> : null}
          {suffix.length > 0 ? (
            <span style={{ color: accent, opacity: 0.92 }}>{suffix}</span>
          ) : null}
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
    flex: "0 1 48px",
    width: 48,
    minWidth: 42,
    maxWidth: 56,
    minHeight: 160,
    height: 160,
    boxSizing: "border-box",
    padding: "18px 6px 30px",
    backgroundColor: theme.text.accent,
    color: theme.bg.base,
    textDecoration: "none",
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 18px), 50% 100%, 0 calc(100% - 18px))",
    boxShadow: `2px 14px 22px ${theme.border.subtle}, 0 4px 8px ${theme.border.default}`,
    ...theme.font.caption,
    fontFamily: theme.font.family,
    fontWeight: theme.weight.semibold,
    position: "relative",
    overflow: "hidden",
  };
  return (
    <a href={link.href} target="_blank" rel="noreferrer" style={ribbon} title={text}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        <Image src={RIBBON_FABRIC} alt="" width={48} height={160} fit="cover" />
      </div>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${theme.border.strong} 0%, transparent 35%, transparent 65%, ${theme.border.subtle} 100%)`,
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <span
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.06em",
          overflowWrap: "anywhere",
          maxHeight: 118,
          textAlign: "center",
          color: theme.bg.base,
          fontSize: 11,
          position: "relative",
          zIndex: 2,
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
          height: 18,
          borderRadius: "6px 6px 0 0",
          overflow: "hidden",
          border: `1px solid ${theme.border.strong}`,
          borderBottom: "none",
          backgroundColor: "#a8662a",
          boxShadow: `inset 0 1px 0 ${theme.border.subtle}`,
        }}
      >
        <Image src={WOOD_LEDGE_TOP} alt="" width={440} height={18} fit="cover" />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 42,
          padding: "12px 14px",
          boxSizing: "border-box",
          borderRadius: "0 0 6px 6px",
          overflow: "hidden",
          backgroundColor: "#8a5520",
          boxShadow: `0 18px 32px ${theme.border.subtle}, 0 4px 10px ${theme.border.default}`,
          border: `1px solid ${theme.border.strong}`,
          borderTop: "none",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Image src={WOOD_LEDGE_FACE} alt="" width={440} height={42} fit="cover" />
        </div>
        {showLinksLabel ? (
          <>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 11,
                letterSpacing: "0.22em",
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
    backgroundColor: "#a8662a",
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
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <Image src={WOOD_WALL} alt="" width={440} height={900} fit="cover" />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,200,120,0.28) 0%, rgba(168,102,42,0.15) 40%, rgba(40,18,6,0.55) 100%)",
          mixBlendMode: "soft-light",
          zIndex: 0,
        }}
      />
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
                  gap: 14,
                  width: "100%",
                  minWidth: 0,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 0,
                  marginBottom: -6,
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
                  gap: 12,
                  width: "100%",
                  minWidth: 0,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingTop: 0,
                  marginTop: -4,
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
