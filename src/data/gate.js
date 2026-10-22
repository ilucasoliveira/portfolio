/*
 * As três camadas do Portão de Moria, num lugar só: o componente (src/components/Gate.jsx)
 * monta as <img> com elas e o scripts/prerender.mjs escreve o preload no HTML da /oficina
 * com o mesmo srcset e sizes (assim o navegador baixa a mesma versão que a página usa).
 *
 * box: recorte da camada na arte original (1024 x 1536), em pixels.
 * widths: largura de cada versão (1x, 1,5x e 2x), na ordem dos arquivos src/assets/gate-moria/<nome>-<densidade>.webp.
 * sizes: largura da camada na tela. O quadro tem min(62vh, 600px) de altura (min(50vh, 440px)
 * no celular) e proporção 2:3; a moldura ocupa 84% da largura e cada folha 36%.
 *
 * O mapa da luz nas linhas (src/assets/gate-moria/luz.webp) não entra aqui: o Gate.jsx o pede
 * sozinho, com prioridade baixa, depois que o portão aparece.
 */

export const GATE_DENSITIES = ["1x", "15x", "2x"];

const FRAME_SIZES = "(max-width: 700px) min(28vh, 246px), min(34.7vh, 336px)";
const LEAF_SIZES = "(max-width: 700px) min(11.9vh, 105px), min(14.8vh, 143px)";

export const GATE_LAYERS = [
  { name: "folha-esquerda", box: [147, 176, 512, 1394], widths: [183, 274, 365], sizes: LEAF_SIZES },
  { name: "folha-direita", box: [512, 176, 879, 1394], widths: [184, 275, 367], sizes: LEAF_SIZES },
  // a moldura por último: fica por cima das folhas e é a maior imagem da tela (o LCP)
  { name: "moldura", box: [82, 64, 941, 1409], widths: [430, 644, 859], sizes: FRAME_SIZES },
];
