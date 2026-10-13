// transliteração simples para o futhark antigo (alfabeto histórico, domínio público)
const MAP = {
  a: "ᚨ", b: "ᛒ", c: "ᚲ", d: "ᛞ", e: "ᛖ", f: "ᚠ", g: "ᚷ", h: "ᚺ", i: "ᛁ",
  j: "ᛃ", k: "ᚲ", l: "ᛚ", m: "ᛗ", n: "ᚾ", o: "ᛟ", p: "ᛈ", q: "ᚲ", r: "ᚱ",
  s: "ᛊ", t: "ᛏ", u: "ᚢ", v: "ᚹ", w: "ᚹ", x: "ᚲᛊ", y: "ᛃ", z: "ᛉ",
};

export const FUTHARK = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

export function toRunes(text) {
  return [...text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()]
    .map((ch) => MAP[ch] ?? (ch === " " ? " " : ch === "·" ? "᛫" : ""))
    .join("");
}

// inscrições usadas em anéis, bordas e divisores
export const NAME_RUNES = toRunes("Lucas de Oliveira");
export const RING_INSCRIPTION = `${toRunes("Lucas de Oliveira")} ᛫ ${toRunes("back end python")} ᛫ ${toRunes("forjado em Minas")} ᛫ `;
