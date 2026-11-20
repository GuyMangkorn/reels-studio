import type {Brush} from './BrushCanvas';

/**
 * Opaque flat fills drawn straight to the canvas (DF-20261120-opaque-fill-composite).
 *
 * p5.brush paints a `wash` polygon into a mask and, at every colour change or switch between line and fill, runs a composite
 * pass (copy the canvas to a framebuffer, spectral pigment mix over the dirty rect, clear the mask): about 0.7 ms each, where the
 * polygon itself costs 0.05 ms. For an opaque wash the pigment mix returns the fill colour, so the pass buys nothing. This wrapper
 * takes those polygons out of the library: a `polygon()` call whose only active mode is a wash of opacity >= 255 is queued here
 * with its colour and its device-space vertices, and the queue is drawn with plain alpha blending just before the next call that
 * lets the library draw. Call order is kept: the library's pending marks are composited (`render()`) before a queue starts, and the
 * queue is drawn before the library paints again.
 *
 * Same coverage as the library's wash: four sub-pixel offsets, each blended at alpha 0.9 (the library sums -ln(1 - 0.9999) / 4 per
 * sample and composites 1 - e^-sum, which is 1 - 0.1^k for k covered samples). Only the edge pixels differ: they mix linearly in
 * RGB instead of by pigment. Convex polygons (drawn as a fan, every pixel covered once) go out as one draw call per run whatever
 * their colours; other polygons use stencil-then-cover as the library does, and go back to the library when the canvas has no
 * stencil buffer. `rotring` splines join the same queue as flat ribbons (`inkRibbon`,
 * DF-20261121-flat-ink-lines). Everything else (other brushes' lines, textured fills, washes under 255, a polygon with a stroke) is passed through untouched.
 */

export type Mat = {a: number; b: number; c: number; d: number; x: number; y: number};
type Modes = Record<'fill' | 'stroke' | 'hatch' | 'mass', boolean | null>;
type Wash = {on: boolean; opaque: boolean; rgb: [number, number, number]};

/** Calls that change brush state but paint nothing: they neither draw the queue nor mark the library as having painted. */
const QUIET = new Set(['noStroke', 'noFill', 'noHatch', 'noMass', 'noWash', 'wash', 'fill', 'fillBleed', 'fillTexture', 'push', 'pop', 'translate', 'scale', 'rotate',
  'seed', 'noiseSeed', 'set', 'pick', 'stroke', 'strokeWeight', 'hatch', 'hatchStyle', 'mass', 'angleMode', 'getAngleMode']);
/** Calls the library may take while its stroke state is still held back (flat ink lines). */
const LAZY_OK = new Set(['noFill', 'noHatch', 'noMass', 'noWash', 'wash', 'fill', 'fillBleed', 'fillTexture', 'translate', 'scale', 'rotate', 'seed', 'noiseSeed', 'hatch', 'hatchStyle', 'mass', 'angleMode', 'getAngleMode']);
const MODE_ON: Record<string, keyof Modes> = {fill: 'fill', set: 'stroke', stroke: 'stroke', hatch: 'hatch', mass: 'mass'};
const MODE_OFF: Record<string, keyof Modes> = {noFill: 'fill', noStroke: 'stroke', noHatch: 'hatch', noMass: 'mass'};
const unknownModes = (): Modes => ({fill: null, stroke: null, hatch: null, mass: null});

// The library's wash antialiasing: a rotated grid of four samples (p5.brush src/fill/gl_fill.js JITTER[4]), in device pixels, y down.
const JITTER = [[0.125, 0.375], [0.375, -0.125], [-0.125, -0.375], [-0.375, 0.125]];
/** 1 - (1 - 0.9999)^(1/4): four samples at this alpha give the library's opaque-wash coverage. */
const SAMPLE_ALPHA = 0.9;
const WORDS = 5; // x, y (device px), r, g, b

const VERT = `#version 300 es
in vec2 a_pos; in vec3 a_color;
uniform vec2 u_size; uniform vec2 u_jitter;
out vec3 v_color;
void main() {
  vec2 p = a_pos + u_jitter;
  gl_Position = vec4(2.0 * p.x / u_size.x - 1.0, 1.0 - 2.0 * p.y / u_size.y, 0.0, 1.0);
  v_color = a_color;
}`;
const FRAG = `#version 300 es
precision highp float;
in vec3 v_color; out vec4 outColor;
uniform float u_ink;
// u_ink > 0: the per-sample alpha of an ink run (a hairline is lighter than a wash).
void main() { outColor = u_ink > 0.0 ? vec4(v_color, u_ink) : vec4(v_color, ${SAMPLE_ALPHA}); }`;

/** Convex and wound once: all turns one way, and the outline changes x direction and y direction at most twice each. */
export const isConvex = (pts: readonly (readonly number[])[]) => {
  const n = pts.length;
  let turn = 0, sx = 0, sy = 0, flipsX = 0, flipsY = 0;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n], r = pts[(i + 2) % n];
    const dx = q[0] - p[0], dy = q[1] - p[1], cross = dx * (r[1] - q[1]) - dy * (r[0] - q[0]);
    if (cross !== 0) { const s = cross > 0 ? 1 : -1; if (turn && s !== turn) return false; turn = s; }
    if (dx !== 0) { const s = dx > 0 ? 1 : -1; if (sx && s !== sx) flipsX++; sx = s; }
    if (dy !== 0) { const s = dy > 0 ? 1 : -1; if (sy && s !== sy) flipsY++; sy = s; }
  }
  // The walk is cyclic, so a direction held at the start and met again at the end counts once.
  return flipsX <= 2 && flipsY <= 2;
};

type Pen = {name: string; rgb: [number, number, number]; weight: number; col: unknown[]};
/** p5.brush's `rotring` (stroke.js): tip weight 0.15, at BrushCanvas's default `scaleBrushes(5)`. */
export const ROTRING_TIP = 0.75;
const QUAD = [0, 1, 2, 0, 2, 3];
const unit = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

/**
 * One `rotring` spline as a flat ribbon in device pixels (DF-20261121-flat-ink-lines): quads [ax, ay, bx, by, cx, cy, dx, dy], the ink's
 * opacity and how far (0..1) the pigment mix deepens its colour. It follows what the library's stroke does, without the stamped dots:
 *  - corners are rounded over `curvature` * half the shorter side (primitives.js `_createSpline`);
 *  - the width is pressure^2 * tip * weight, pressure 1 through a flat middle and 1.3 toward the ends (stroke.js `gauss`, min_max [1.3, 1]),
 *    plus the dots' scatter on a wide stroke; an open stroke wide enough to show it ends in a round cap;
 *  - a hairline's dots barely overlap, so it is lighter; a wide stroke's dots pile up and the pigment mix deepens its colour.
 * `seed` moves the pressure peak, the edge wobble and the width jitter, so a boiling line still boils.
 */
export const inkRibbon = (pts: readonly (readonly number[])[], curvature: number, m: Mat, [w, h]: readonly [number, number], weight: number, tip: number, seed: number) => {
  const none = {quads: [] as number[][], alpha: 1, deepen: 0};
  const n0 = pts.length;
  if (n0 < 2) return none;
  const closed = n0 > 3 && pts[0][0] === pts[n0 - 1][0] && pts[0][1] === pts[n0 - 1][1];
  const P = closed ? pts.slice(0, -1) : pts, n = P.length;
  const k = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  const rnd = (i: number) => unit(i + (seed % 9973) * 2.4537);
  const xs: number[] = [], ys: number[] = [];
  const add = (x: number, y: number) => { xs.push(m.a * x + m.c * y + m.x + w / 2); ys.push(m.b * x + m.d * y + m.y + h / 2); };
  for (let i = 0; i < n; i++) {
    const [x, y] = P[i];
    if ((!closed && (i === 0 || i === n - 1)) || n < 3 || curvature <= 0) { add(x, y); continue; }
    const [px, py] = P[(i + n - 1) % n], [nx, ny] = P[(i + 1) % n];
    const d1 = Math.hypot(px - x, py - y), d2 = Math.hypot(nx - x, ny - y), c = curvature * 0.5 * Math.min(d1, d2);
    if (c * k < 1.5 || !d1 || !d2) { add(x, y); continue; }
    const ax = x + ((px - x) / d1) * c, ay = y + ((py - y) / d1) * c, bx = x + ((nx - x) / d2) * c, by = y + ((ny - y) / d2) * c;
    add(ax, ay); add(0.25 * ax + 0.5 * x + 0.25 * bx, 0.25 * ay + 0.5 * y + 0.25 * by); add(bx, by);
  }
  const N = xs.length, len = new Array<number>(N).fill(0);
  for (let i = 1; i < N; i++) len[i] = len[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
  if (!(len[N - 1] > 0)) return none;
  const mid = weight * tip * k, scatter = 0.2 * Math.min(1, Math.max(0, (mid - 1) / 3));
  const peak = 0.5 + 0.35 * (rnd(901) * 2 - 1), spread = 1 - 0.2 * (1 + 0.5 * rnd(902)), shape = 3 + 0.5 * rnd(903);
  const widthAt = (i: number) => {
    const t = len[i] / len[N - 1], half = (t < peak ? spread * 1.2 : spread * 0.8) / 2, pressure = 1.3 - 0.3 / (1 + Math.pow(Math.abs((t - peak) / half), 2 * shape));
    return Math.max(0.6, weight * (tip * pressure * pressure + scatter) * k);
  };
  const lx = new Array<number>(N), ly = new Array<number>(N), rx = new Array<number>(N), ry = new Array<number>(N);
  for (let i = 0; i < N; i++) {
    const a = closed ? (i + N - 1) % N : Math.max(0, i - 1), b = closed ? (i + 1) % N : Math.min(N - 1, i + 1);
    let ux = xs[i] - xs[a], uy = ys[i] - ys[a], vx = xs[b] - xs[i], vy = ys[b] - ys[i];
    const ul = Math.hypot(ux, uy), vl = Math.hypot(vx, vy);
    if (ul) { ux /= ul; uy /= ul; } else { ux = vx / (vl || 1); uy = vy / (vl || 1); }
    if (vl) { vx /= vl; vy /= vl; } else { vx = ux; vy = uy; }
    let tx = ux + vx, ty = uy + vy; const tl = Math.hypot(tx, ty);
    if (tl < 1e-6) { tx = ux; ty = uy; } else { tx /= tl; ty /= tl; }
    // Mitred join, capped at twice the width on a sharp turn.
    const half = (widthAt(i) / 2) * Math.min(2, 1 / Math.max(0.5, tx * ux + ty * uy)) * (0.9 + 0.2 * rnd(i + 77)), off = (rnd(i) - 0.5) * 0.6;
    lx[i] = xs[i] - ty * (half + off); ly[i] = ys[i] + tx * (half + off); rx[i] = xs[i] + ty * (half - off); ry[i] = ys[i] - tx * (half - off);
  }
  const quads: number[][] = [];
  for (let i = 0; i < (closed ? N : N - 1); i++) { const j = (i + 1) % N; quads.push([lx[i], ly[i], lx[j], ly[j], rx[j], ry[j], rx[i], ry[i]]); }
  // Round caps: a half octagon beyond each end, which does not overlap the ribbon.
  if (!closed && Math.max(widthAt(0), widthAt(N - 1)) > 3) for (const [e, o] of [[0, 1], [N - 1, N - 2]]) {
    const cx = (lx[e] + rx[e]) / 2, cy = (ly[e] + ry[e]) / 2, ax = lx[e] - cx, ay = ly[e] - cy;
    const s = ax * (ys[e] - ys[o]) - ay * (xs[e] - xs[o]) > 0 ? 1 : -1;
    const arc = [0.25, 0.5, 0.75].map((t) => { const c = Math.cos(t * Math.PI), sn = Math.sin(t * Math.PI) * s; return [cx + ax * c - ay * sn, cy + ay * c + ax * sn]; });
    quads.push([lx[e], ly[e], arc[0][0], arc[0][1], arc[1][0], arc[1][1], arc[2][0], arc[2][1]], [lx[e], ly[e], arc[2][0], arc[2][1], rx[e], ry[e], rx[e], ry[e]]);
  }
  return {quads, alpha: Math.round(Math.min(1, Math.max(0.5, 0.45 + 0.3 * mid)) * 20) / 20, deepen: Math.min(1, Math.max(0, (mid - 1) / 3))};
};

/** `lines: false` (paint-bench A/B, `paintFlatLinesOff`) leaves ink lines to p5.brush. `tip`: the rotring's tip in px per unit of stroke weight, as scaled by `scaleBrushes`. */
export type FlatOptions = {lines?: boolean; tip?: () => number};
export const flatFills = (base: Brush, getCanvas: () => HTMLCanvasElement | null, opt: FlatOptions = {}) => {
  const lines = opt.lines !== false, tip = opt.tip ?? (() => ROTRING_TIP);
  let pen: Pen = {name: '', rgb: [0, 0, 0], weight: 1, col: ['#000']};
  // What the library itself holds. With flat lines on, stroke setters stop here and are sent only before a call that may draw with them.
  let libPen: Pen | null = null, libStroke: boolean | null = null;
  const sync = () => {
    if (on.stroke === true && (libPen !== pen || libStroke !== true)) {
      const b = base as unknown as Record<string, (...a: unknown[]) => void>;
      b.pick(pen.name); b.stroke(...pen.col); b.strokeWeight(pen.weight);
      libPen = pen; libStroke = true;
    } else if (on.stroke === false && libStroke !== false) { base.noStroke(); libStroke = false; }
  };
  /** The seed of the next ink line (the deferred-seeding wrapper hands it over instead of seeding the library). */
  let seed = 0;
  let m: Mat = {a: 1, b: 0, c: 0, d: 1, x: 0, y: 0};
  let wash: Wash = {on: false, opaque: false, rgb: [0, 0, 0]};
  let on = unknownModes();
  const stack: {m: Mat; wash: Wash; on: Modes; pen: Pen}[] = [];
  /** The library has painted since its last `render()`: composite that before a queue starts, so the queue lands over it. */
  let libraryPainted = true;
  const colors = new Map<string, [number, number, number]>();
  const stats = {flat: 0, stencil: 0, draws: 0, flushes: 0, lines: 0};

  // Queue: vertex data for all four samples of each polygon, and runs of [first vertex, vertex count, stencil?].
  let data = new Float32Array(1 << 16), used = 0;
  const runs: number[] = [];
  let gl: WebGL2RenderingContext | null = null, program: WebGLProgram | null = null, vao: WebGLVertexArrayObject | null = null, buffer: WebGLBuffer | null = null;
  let uSize: WebGLUniformLocation | null = null, uJitter: WebGLUniformLocation | null = null, uInk: WebGLUniformLocation | null = null, hasStencil = false;

  const context = () => {
    const canvas = getCanvas();
    const next = canvas?.getContext('webgl2') as WebGL2RenderingContext | null | undefined;
    if (!next) return null;
    if (next === gl && program) return gl;
    gl = next;
    const shader = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; };
    program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(program, 0, 'a_pos');
    gl.bindAttribLocation(program, 1, 'a_color');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`flatFill shader: ${gl.getProgramInfoLog(program)}`);
    uSize = gl.getUniformLocation(program, 'u_size');
    uJitter = gl.getUniformLocation(program, 'u_jitter');
    uInk = gl.getUniformLocation(program, 'u_ink');
    vao = gl.createVertexArray();
    buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, WORDS * 4, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, WORDS * 4, 8);
    gl.bindVertexArray(null);
    hasStencil = gl.getContextAttributes()?.stencil === true;
    return gl;
  };

  const grow = (vertices: number) => {
    if ((used + vertices) * WORDS <= data.length) return;
    let size = data.length * 2;
    while (size < (used + vertices) * WORDS) size *= 2;
    const next = new Float32Array(size);
    next.set(data.subarray(0, used * WORDS));
    data = next;
  };

  /** Queue one polygon. Returns false when it must go to the library instead (not convex and no stencil buffer). */
  const queue = (pts: readonly (readonly number[])[]) => {
    const n = pts.length;
    if (n < 3) return true;
    const g = context();
    if (!g) return false;
    const convex = isConvex(pts);
    if (!convex && !hasStencil) return false;
    // Device pixels, y down, as the library's fill transform (canvas centre origin, density 1).
    const w = g.drawingBufferWidth, h = g.drawingBufferHeight, [r, gr, b] = wash.rgb;
    let cx = 0, cy = 0, area = 0;
    const xs = new Array<number>(n), ys = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i], [x1, y1] = pts[(i + 1) % n];
      cx += x; cy += y; area += x * y1 - x1 * y;
      xs[i] = m.a * x + m.c * y + m.x + w / 2; ys[i] = m.b * x + m.d * y + m.y + h / 2;
    }
    if (area === 0) return true; // the library drops a polygon without area
    cx /= n; cy /= n;
    const fx = m.a * cx + m.c * cy + m.x + w / 2, fy = m.b * cx + m.d * cy + m.y + h / 2;
    if (libraryPainted) { base.render(); libraryPainted = false; }
    // Convex: the four samples follow each other in one buffer, so a whole run of polygons is one draw. Stencil: one sample, offset by uniform.
    const samples = convex ? JITTER : [[0, 0]];
    grow(n * 3 * samples.length);
    const first = used;
    let o = used * WORDS;
    for (const [jx, jy] of samples) {
      for (let i = 0; i < n; i++) {
        const j = i + 1 < n ? i + 1 : 0;
        data[o] = fx + jx; data[o + 1] = fy + jy; data[o + 2] = r; data[o + 3] = gr; data[o + 4] = b;
        data[o + 5] = xs[i] + jx; data[o + 6] = ys[i] + jy; data[o + 7] = r; data[o + 8] = gr; data[o + 9] = b;
        data[o + 10] = xs[j] + jx; data[o + 11] = ys[j] + jy; data[o + 12] = r; data[o + 13] = gr; data[o + 14] = b;
        o += 15;
      }
    }
    used += n * 3 * samples.length;
    const last = runs.length - 3;
    if (convex && last >= 0 && runs[last + 2] === 0) runs[last + 1] += used - first;
    else runs.push(first, used - first, convex ? 0 : 1);
    if (convex) stats.flat++; else stats.stencil++;
    return true;
  };

  /** Queue one spline as ink: the ribbon's quads, two triangles per sample each, in a run of their own opacity. */
  const line = (pts: readonly (readonly number[])[], curvature: number) => {
    const g = context();
    if (!g) return false;
    const {quads, alpha, deepen} = inkRibbon(pts, curvature, m, [g.drawingBufferWidth, g.drawingBufferHeight], pen.weight, tip(), seed);
    if (!quads.length) return true;
    if (libraryPainted) { base.render(); libraryPainted = false; }
    // A wide stroke's piled-up dots come out about a third darker than the ink's nominal colour (matched by eye on EDU-EP30 wheat, light and dark).
    const f = 1 - 0.32 * deepen, r = pen.rgb[0] * f, gr = pen.rgb[1] * f, b = pen.rgb[2] * f, kind = 2 + alpha;
    grow(quads.length * 24);
    const first = used;
    let o = used * WORDS;
    for (const q of quads) for (const [jx, jy] of JITTER) for (const i of QUAD) {
      data[o] = q[i * 2] + jx; data[o + 1] = q[i * 2 + 1] + jy; data[o + 2] = r; data[o + 3] = gr; data[o + 4] = b; o += 5;
    }
    used += quads.length * 24;
    const last = runs.length - 3;
    if (last >= 0 && runs[last + 2] === kind) runs[last + 1] += used - first; else runs.push(first, used - first, kind);
    stats.lines++;
    // A frame of some 20,000 lines would otherwise hold its whole vertex data until the next library call.
    if (used > 1 << 19) flush();
    return true;
  };

  const flush = () => {
    if (!used) return;
    const g = gl!;
    const depth = g.isEnabled(g.DEPTH_TEST), cull = g.isEnabled(g.CULL_FACE), blend = g.isEnabled(g.BLEND);
    g.bindFramebuffer(g.FRAMEBUFFER, null);
    g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
    g.disable(g.DEPTH_TEST); g.disable(g.CULL_FACE); g.disable(g.SCISSOR_TEST);
    g.enable(g.BLEND);
    g.blendEquation(g.FUNC_ADD);
    g.blendFuncSeparate(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA, g.ONE, g.ONE_MINUS_SRC_ALPHA);
    g.colorMask(true, true, true, true);
    g.useProgram(program);
    g.uniform2f(uSize, g.drawingBufferWidth, g.drawingBufferHeight);
    g.uniform2f(uJitter, 0, 0);
    g.uniform1f(uInk, 0);
    g.bindVertexArray(vao);
    g.bindBuffer(g.ARRAY_BUFFER, buffer);
    g.bufferData(g.ARRAY_BUFFER, data.subarray(0, used * WORDS), g.STREAM_DRAW);
    for (let k = 0; k < runs.length; k += 3) {
      const first = runs[k], count = runs[k + 1];
      if (!runs[k + 2]) { g.drawArrays(g.TRIANGLES, first, count); stats.draws++; continue; }
      if (runs[k + 2] >= 2) {
        const a = runs[k + 2] - 2;
        g.uniform1f(uInk, a >= 1 ? SAMPLE_ALPHA : 1 - Math.pow(1 - a, 0.25));
        g.drawArrays(g.TRIANGLES, first, count); stats.draws++;
        g.uniform1f(uInk, 0);
        continue;
      }
      // Stencil-then-cover, as p5.brush's flushFill: count the winding number, then paint where it is non-zero and reset it.
      g.enable(g.STENCIL_TEST);
      g.stencilMask(0xff);
      for (const [jx, jy] of JITTER) {
        g.uniform2f(uJitter, jx, jy);
        g.colorMask(false, false, false, false);
        g.stencilFunc(g.ALWAYS, 0, 0xff);
        g.stencilOpSeparate(g.FRONT, g.KEEP, g.KEEP, g.INCR_WRAP);
        g.stencilOpSeparate(g.BACK, g.KEEP, g.KEEP, g.DECR_WRAP);
        g.drawArrays(g.TRIANGLES, first, count);
        g.colorMask(true, true, true, true);
        g.stencilFunc(g.NOTEQUAL, 0, 0xff);
        g.stencilOp(g.KEEP, g.KEEP, g.ZERO);
        g.drawArrays(g.TRIANGLES, first, count);
        stats.draws += 2;
      }
      g.disable(g.STENCIL_TEST);
      g.uniform2f(uJitter, 0, 0);
    }
    // Leave GL as the library leaves it after its own direct draws (standalone renderer.js).
    g.bindVertexArray(null);
    g.bindBuffer(g.ARRAY_BUFFER, null);
    g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
    if (!blend) g.disable(g.BLEND);
    if (depth) g.enable(g.DEPTH_TEST);
    if (cull) g.enable(g.CULL_FACE);
    used = 0; runs.length = 0; stats.flushes++;
  };

  const rgbOf = (args: unknown[]): [number, number, number] => {
    const key = args.length < 3 && typeof args[0] === 'string' ? args[0] : null;
    const hit = key !== null ? colors.get(key) : undefined;
    if (hit) return hit;
    const Color = (base as unknown as {Color: new (...a: unknown[]) => {_array: number[]}}).Color;
    const c = (args[0] as {_array?: number[]})?._array ?? new Color(...(args.length < 3 ? [args[0]] : args.slice(0, 3)))._array;
    const rgb: [number, number, number] = [c[0], c[1], c[2]];
    if (key !== null) colors.set(key, rgb);
    return rgb;
  };
  const mul = (t: Mat): Mat => ({a: m.a * t.a + m.c * t.b, b: m.b * t.a + m.d * t.b, c: m.a * t.c + m.c * t.d, d: m.b * t.c + m.d * t.d, x: m.a * t.x + m.c * t.y + m.x, y: m.b * t.x + m.d * t.y + m.y});

  const takesLine = () => lines && on.stroke === true && pen.name === 'rotring';
  const wrap = {} as Record<string, unknown>;
  for (const [name, fn] of Object.entries(base)) {
    if (typeof fn !== 'function' || name === 'Color' || name === 'Polygon' || name === 'Plot') { wrap[name] = fn; continue; }
    const call = fn as (...a: unknown[]) => unknown;
    wrap[name] = (...args: unknown[]) => {
      if (name === 'polygon' && wash.on && wash.opaque && on.fill === false && on.stroke === false && on.hatch === false && on.mass === false
        && Array.isArray(args[0]) && queue(args[0] as number[][])) return undefined;
      if (name === 'spline' && takesLine() && Array.isArray(args[0]) && line(args[0] as number[][], (args[1] as number | undefined) ?? 0.5)) return undefined;
      if (name === 'seed') seed = Number(args[0]) || 0;
      else if (name === 'set') pen = {name: String(args[0]), rgb: rgbOf([args[1]]), weight: (args[2] as number | undefined) ?? 1, col: [args[1]]};
      else if (name === 'pick') pen = {...pen, name: String(args[0])};
      else if (name === 'stroke') pen = {...pen, rgb: rgbOf(args), col: args};
      else if (name === 'strokeWeight') pen = {...pen, weight: args[0] as number};
      if (lines) {
        if (name === 'set' || name === 'stroke') { on.stroke = true; return undefined; }
        if (name === 'pick' || name === 'strokeWeight') return undefined;
        if (name === 'noStroke') { on.stroke = false; return undefined; }
        // `pop` needs no sync: the library's own pop puts back what it held at the matching push, which was synced.
        if (!LAZY_OK.has(name) && name !== 'pop') sync();
      }
      if (name === 'clear') { used = 0; runs.length = 0; libraryPainted = true; return call(...args); }
      if (!QUIET.has(name)) { flush(); libraryPainted = true; }
      if (name === 'push') stack.push({m, wash, on: {...on}, pen});
      else if (name === 'pop') { const s = stack.pop(); if (s) { ({m, wash, on, pen} = s); if (lines) { libPen = pen; libStroke = on.stroke; } } }
      else if (name === 'translate') m = mul({a: 1, b: 0, c: 0, d: 1, x: args[0] as number, y: args[1] as number});
      else if (name === 'scale') m = mul({a: args[0] as number, b: 0, c: 0, d: (args[1] ?? args[0]) as number, x: 0, y: 0});
      else if (name === 'rotate') {
        const t = (base as unknown as {getAngleMode: () => string}).getAngleMode() === 'radians' ? (args[0] as number) : ((args[0] as number) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
        m = mul({a: c, b: s, c: -s, d: c, x: 0, y: 0});
      } else if (name === 'wash') wash = {on: true, opaque: (((args.length < 4 ? args[1] : args[3]) as number | undefined) ?? 150) >= 255, rgb: rgbOf(args)};
      else if (name === 'noWash') wash = {...wash, on: false};
      else if (MODE_ON[name]) on[MODE_ON[name]] = true;
      else if (MODE_OFF[name]) on[MODE_OFF[name]] = false;
      return call(...args);
    };
  }
  return {
    brush: wrap as Brush,
    /** For the deferred-seeding wrapper: will the next spline be drawn here (then the library needs no seed), and that line's seed. */
    lines: lines ? {takes: takesLine, hint: (n: number) => { seed = n; }} : undefined,
    /** Per-frame counts for the paint profile: polygons drawn flat (convex / stencil), GL draw calls and queue flushes. */
    stats: () => { const s = {...stats}; stats.flat = stats.stencil = stats.draws = stats.flushes = stats.lines = 0; return s; },
  };
};
