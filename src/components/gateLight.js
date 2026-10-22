/*
 * A luz andando pelas linhas de prata do portão (WebGL, um desenho por quadro).
 *
 * Entram as três camadas do portão fechado (as mesmas <img> da página, cada uma com o seu
 * recorte) e o mapa src/assets/gate-moria/luz.webp: em cima, quando a luz passa por cada pixel,
 * seguindo as linhas das raízes até as estrelas; embaixo, o halo (as linhas borradas). O shader
 * monta a arte, apaga as linhas que a luz ainda não alcançou, acende a ponta que está passando e
 * deixa um brilho azulado em volta. Em t = 1 o brilho já se apagou e o quadro é igual às imagens:
 * aí o canvas sai e as camadas assumem.
 *
 * O preparo é dividido em etapas (uma por quadro), para nenhuma passar de uns poucos
 * milissegundos na thread principal. Devolve null se o navegador não tiver WebGL.
 */

const VERTEX = `
attribute vec2 pos;
varying vec2 uv;
void main() {
  uv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D layer0;
uniform sampler2D layer1;
uniform sampler2D layer2;
uniform vec4 box0;
uniform vec4 box1;
uniform vec4 box2;
uniform sampler2D luz;
uniform float t;
varying vec2 uv;

// uma camada no seu recorte (box: x, y, largura, altura, em fração do quadro)
vec4 layer(sampler2D tex, vec4 box) {
  vec2 p = (uv - box.xy) / box.zw;
  if (p.x < 0.0 || p.y < 0.0 || p.x > 1.0 || p.y > 1.0) return vec4(0.0);
  return texture2D(tex, p);
}

// "c por cima de base", com alpha pré-multiplicado
vec4 over(vec4 c, vec4 base) {
  return c + base * (1.0 - c.a);
}

void main() {
  vec4 c = over(layer(layer2, box2), over(layer(layer1, box1), layer(layer0, box0)));
  vec3 rgb = c.a > 0.0 ? c.rgb / c.a : vec3(0.0);
  // quanto o pixel é linha de prata (o painel é azul-escuro, a moldura cinza médio)
  float line = smoothstep(0.42, 0.75, dot(rgb, vec3(0.299, 0.587, 0.114)));
  float at = texture2D(luz, vec2(uv.x, uv.y * 0.5)).r;
  float halo = texture2D(luz, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  float settle = 1.0 - smoothstep(0.92, 1.0, t); // perto do fim o brilho some e sobra a arte

  float lit = smoothstep(at - 0.015, at + 0.005, t);
  float tip = exp(-pow((t - at) / 0.018, 2.0));
  float near = exp(-pow((t - at) / 0.035, 2.0));

  vec3 dark = rgb * mix(1.0, 0.1, line); // linha apagada: quase da cor da pedra
  vec3 col = mix(dark, rgb, lit);
  vec3 moon = vec3(0.7, 0.85, 1.0);
  float shine = (tip * line * 1.4 + near * halo * 0.9 + lit * halo * 0.22) * settle;
  col += moon * shine;
  float alpha = clamp(max(c.a, (near * 0.7 + lit * 0.2) * halo * settle), 0.0, 1.0);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

function texture(gl, unit, source) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

// canvas: onde desenhar; layers: [{ img, box }] na ordem de pintura (box em pixels da arte 1024 x 1536);
// map: a <img> do mapa da luz. Resolve com { draw(t), dispose() } ou null sem WebGL.
export async function createGateLight(canvas, layers, map) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  // do tamanho em que aparece na tela, até 1,5x (o brilho não precisa de mais). Mede o quadro:
  // o canvas ainda está escondido e não tem tamanho
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, "pos");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.viewport(0, 0, canvas.width, canvas.height);

  // uma textura por quadro
  for (const [i, { img, box }] of layers.entries()) {
    await nextFrame();
    texture(gl, i, img);
    const [x0, y0, x1, y1] = box;
    gl.uniform1i(gl.getUniformLocation(program, `layer${i}`), i);
    gl.uniform4f(gl.getUniformLocation(program, `box${i}`), x0 / 1024, y0 / 1536, (x1 - x0) / 1024, (y1 - y0) / 1536);
  }
  await nextFrame();
  texture(gl, layers.length, map);
  gl.uniform1i(gl.getUniformLocation(program, "luz"), layers.length);
  const uT = gl.getUniformLocation(program, "t");

  return {
    draw(t) {
      gl.uniform1f(uT, t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    // libera a memória da GPU assim que o desenho termina
    dispose() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
