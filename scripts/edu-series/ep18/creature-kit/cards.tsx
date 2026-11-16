// EDU-EP18 creature comp cards (Boss, 15 Nov 2026, pre-W3 pass A): model sheets for the hippo (N3), snake (N11), mosquito (N13), hen (N7) and the kit dog-thai (N8, shown as it is),
// so the user can judge each design before any look frame is painted. Method: the EP16 creature-kit cards (scripts/edu-series/ep16/creature-kit/cards.tsx), plus water for the hippo.
import type {CSSProperties} from 'react';
import {hardFill, inkLine, washAt} from '../../../../src/painted/kit/draw';
import {mixColor, type Painter, type Pt} from '../../../../src/painted/kit/painter';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import {FONT, Painted} from '../../../../src/painted/survival/frame';
import {paintBeast, type Build, type BeastPlace} from '../../../../src/painted/survival/beast';
import {animSamples, BEAST_KIT, type BeastKitEntry} from '../../../../src/painted/survival/beast-kit';
import {waterCut} from '../../../../src/painted/survival/beast-hippo';
import {buildSnake, paintSnake, SNAKE_POSES} from '../../../../src/painted/kit/snake';
import {EXTRA_CARDS} from './cards-2d';

const D2R = Math.PI / 180;
export type View = {name: string; heading: number; alpha: number};
export const TURN_VIEWS: View[] = [
  {name: 'front', heading: 90 * D2R, alpha: 0}, {name: 'front 3/4', heading: 45 * D2R, alpha: 0}, {name: 'side', heading: 0, alpha: 0},
  {name: 'rear 3/4', heading: -135 * D2R, alpha: 0}, {name: 'back', heading: -90 * D2R, alpha: 0}, {name: 'top-down (high angle 65 deg)', heading: 0, alpha: 65},
];
export type Cell = {x: number; y: number; w: number; h: number};
export const paper = '#d9e2cc';
export const tag = (x: number, y: number, size = 26, color = '#2b211c'): CSSProperties => ({position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color});
export const grid = (cols: number, rows: number, x0: number, y0: number, w: number, h: number): Cell[] => Array.from({length: cols * rows}, (_, i) => ({x: x0 + (i % cols) * (w / cols), y: y0 + Math.floor(i / cols) * (h / rows), w: w / cols, h: h / rows}));
export const cellBg = (p: Painter, c: Cell, seed: number, tone: number, col = '#b9a87e') => hardFill(p, seed, col === '#2a2e36' ? mixColor('#1d2027', col, tone - 0.4) : mixColor(col, paper, tone), [[c.x + 6, c.y + 6], [c.x + c.w - 6, c.y + 6], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]]);

/** Card camera: looks at (0, hc, 0) from 6 x size away, pitched down `alpha`; `scale` px per m at the look point. */
const cam = (e: BeastKitEntry, alpha: number, scale: number, cx: number, hy: number, hc = e.hc): YCam => {
  const D = e.size * 6, al = alpha * D2R;
  return {x: 0, y: hc + D * Math.sin(al), z: D * Math.cos(al), yaw: 0, f: scale * D, hy, pitch: -al, cx};
};
type Item = {B: Build; v: View; cell: Cell};
/** One shared scale for all items so views compare; each item centred in its cell (high angles centred, the rest on the cell floor; water items centred on their waterline). */
const fit = (e: BeastKitEntry, items: Item[], place: Partial<BeastPlace>, hc: number, fill = 0.9) => {
  const s0 = 20, ref = (it: Item) => { const b = paintBeast(null, cam(e, it.v.alpha, s0, 0, 960, hc), it.B, {at: [0, 0], heading: it.v.heading, ...place}); return Number.isFinite(b.left) ? b : paintBeast(null, cam(e, it.v.alpha, s0, 0, 960, hc), e.stand(), {at: [0, 0], heading: it.v.heading}); };
  const bs = items.map(ref);
  const scale = Math.min(...items.map((it, i) => Math.min((it.cell.w * fill) / ((bs[i].right - bs[i].left) / s0), (it.cell.h * fill * 0.86) / ((bs[i].bottom - bs[i].top) / s0))));
  return items.map((it) => {
    const b = ref({...it, B: it.B}), k = scale / s0, w = place.waterline !== undefined;
    const bl = 540 + (b.left - 540) * k, br = 540 + (b.right - 540) * k, bt = 960 + (b.top - 960) * k, bb = 960 + (b.bottom - 960) * k;
    const cx = it.cell.x + it.cell.w / 2 - (bl + br) / 2;
    const hy = w ? 960 + (it.cell.y + it.cell.h * 0.62 - 960) : it.v.alpha > 30 ? 960 + (it.cell.y + it.cell.h / 2 - (bt + bb) / 2) : 960 + (it.cell.y + it.cell.h * 0.93 - bb);
    return cam(e, it.v.alpha, scale, cx, hy, hc);
  });
};
const hull = (pts: Pt[]): Pt[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const grow = (q: Pt[], k: number, ky = k * 0.5): Pt[] => { const mx = q.reduce((a, v) => a + v[0], 0) / q.length, my = q.reduce((a, v) => a + v[1], 0) / q.length; return q.map(([x, y]) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * k, y + (dy / l) * ky]; }); };
export const WATER = {near: '#6b6a5e', mid: '#8a7f6a', glint: '#e8c08e', foam: '#e9dccb'} as const;

/** Paints one creature item: water plane (when the anim has a waterline), ring behind, creature, front arc of the ring. */
type PaintFn = typeof paintBeast;
const paintItem = (p: Painter, c: YCam, B: Build, cell: Cell, heading: number, place: Partial<BeastPlace>, i: number, rig: boolean, pf: PaintFn = paintBeast) => {
  const wl = place.waterline, pl: BeastPlace = {at: [0, 0], heading, seed: 70000 + i * 1500, shadowOp: 80, rig, ...place};
  if (wl !== undefined) {
    const far = camPoint(c, [0, wl, -30]), yf = Math.max(cell.y + 40, far ? far[1] : cell.y + 40);
    hardFill(p, 900 + i, WATER.mid, [[cell.x + 6, yf], [cell.x + cell.w - 6, yf], [cell.x + cell.w - 6, cell.y + cell.h - 6], [cell.x + 6, cell.y + cell.h - 6]]);
    hardFill(p, 950 + i, WATER.near, [[cell.x + 6, yf + (cell.y + cell.h - yf) * 0.45], [cell.x + cell.w - 6, yf + (cell.y + cell.h - yf) * 0.45], [cell.x + cell.w - 6, cell.y + cell.h - 6], [cell.x + 6, cell.y + cell.h - 6]]);
    const cut = waterCut(c, B, pl, wl), h = cut.length > 2 ? hull(cut) : [];
    const A = paintBeast(p, c, B, pl);
    if (h.length < 3 && B.anchors.snout) {   // fully under: the surface rings over the head and back (the scene's ripples; card shows where)
      for (const [an, rr] of [['snout', 0.5], ['backTop', 0.9]] as const) {
        const w = A.toWorld(B.anchors[an]), ring = Array.from({length: 20}, (_, k) => camPoint(c, [w[0] + rr * Math.cos((k / 20) * 6.283), wl, w[2] + rr * 0.8 * Math.sin((k / 20) * 6.283)]));
        if (ring.every(Boolean)) inkLine(p, 960 + i * 3 + (an === 'snout' ? 0 : 1), ring as Pt[], {weight: 1.2, color: WATER.foam, still: true});
      }
    }
    if (h.length > 2) {
      const my = h.reduce((a, v) => a + v[1], 0) / h.length, front = grow(h, 10).filter((q) => q[1] >= my - 2).sort((a, b) => a[0] - b[0]);
      if (front.length > 1) inkLine(p, 990 + i, front, {closed: false, weight: 1.6, color: WATER.foam, still: true});
      const r2 = grow(h, 44, 16).filter((q) => q[1] >= my).sort((a, b) => a[0] - b[0]);
      if (r2.length > 1) inkLine(p, 995 + i, r2, {closed: false, weight: 0.8, color: mixColor(WATER.foam, WATER.mid, 0.4), still: true});
    }
  } else pf(p, c, B, pl);
};

export const Sheet = ({title, sub, items, cells, labels, e, place = {}, rig = false, hc, bg = paper, pf}: {pf?: PaintFn; title: string; sub: string; items: {B: Build; v: View}[]; cells: Cell[]; labels: string[]; e: BeastKitEntry; place?: Partial<BeastPlace>; rig?: boolean; hc?: number; bg?: string}) => {
  const its = items.map((it, i) => ({...it, cell: cells[i]})), H = hc ?? (place.waterline !== undefined ? place.waterline : e.hc), cams = fit(e, its, place, H);
  const dark = bg !== paper;
  return (
    <Painted band={false} paper={bg} paint={(p) => {
      hardFill(p, 1, bg, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
      cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.45 + 0.1 * (i % 2), dark ? '#2a2e36' : '#b9a87e'));
      its.forEach((it, i) => paintItem(p, cams[i], it.B, it.cell, it.v.heading, place, i, rig, pf));
    }}>
      <div style={tag(30, 22, 40, dark ? '#e8ecf2' : '#2b211c')}>{title}</div>
      <div style={tag(30, 72, 22, dark ? '#c9d0da' : '#2b211c')}>{sub}</div>
      {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24, dark ? '#e8ecf2' : '#2b211c')}>{labels[i]}</div>)}
    </Painted>
  );
};

const out: Record<string, () => JSX.Element> = {};
const EP18 = ['HIPPO', 'SNAKE', 'MOSQUITO'];
for (const key of EP18) {
  const e = BEAST_KIT[key];
  if (!e) continue;
  const stand = e.stand(), bg = key === 'MOSQUITO' ? '#15181d' : paper, pf = key === 'SNAKE' ? paintSnake : undefined;
  const tv = key === 'SNAKE' ? TURN_VIEWS.map((v) => (v.alpha ? v : {...v, alpha: 30, name: `${v.name} (high 30 deg)`})) : TURN_VIEWS;
  out[`${key}-TURN`] = () => <Sheet e={e} bg={bg} pf={pf} title={`${e.id} turnaround`} sub={`${e.label} · stand pose · front, front 3/4, side, rear 3/4, back, top-down`} items={tv.map((v) => ({B: stand, v}))} cells={grid(2, 3, 0, 110, 1080, 1790)} labels={tv.map((v) => v.name)} />;
  out[`${key}-RIG`] = () => <Sheet e={e} bg={bg} pf={pf} rig title={`${e.id} skeleton`} sub="joint dots (red) and bone links (yellow) over the volume; blue = root bone" items={[tv[1], tv[2]].map((v) => ({B: stand, v}))} cells={grid(1, 2, 0, 110, 1080, 1790)} labels={['front 3/4', 'side']} />;
  for (const [an, a] of Object.entries(e.anims)) {
    const ts = animSamples(a), alpha = a.place?.waterline !== undefined ? 14 : key === 'SNAKE' ? 25 : 0;
    const mk = (v: View, id: string) => { out[`${key}-${an}${id}`] = () => <Sheet e={e} bg={bg} pf={pf} title={`${e.id} ${an}${id ? ' (side)' : ''}`} sub={`${a.note} · ${ts.length} samples ${a.cycle ? 'around the cycle' : 'across the range'}`} items={ts.map((t) => ({B: a.build(t), v}))} cells={grid(2, 4, 0, 110, 1080, 1790)} labels={ts.map((t) => `t = ${t.toFixed(3)}`)} place={a.place} />; };
    mk({name: '3/4', heading: 40 * D2R, alpha}, '');
    if (a.side) mk({name: 'side', heading: 0, alpha}, '-SIDE');
  }
}

// HIPPO-READ: the brief's read sizes (N3 acceptance): the lurk at 120 px wide (B02) and the yawn peak at 900 px tall (B01), on river water, front 3/4.
const readCam = (e: BeastKitEntry, B: Build, heading: number, place: Partial<BeastPlace>, target: number, axis: 'w' | 'h', cx: number, cy: number, alpha = 8): YCam => {
  const probe = cam(e, alpha, 20, 0, 960, place.waterline ?? e.hc), b = paintBeast(null, probe, B, {at: [0, 0], heading, ...place}), k = target / (axis === 'w' ? b.right - b.left : b.bottom - b.top);
  const c = cam(e, alpha, 20 * k, 0, 960, place.waterline ?? e.hc), b2 = paintBeast(null, c, B, {at: [0, 0], heading, ...place});
  return {...c, cx: cx - (b2.left + b2.right) / 2, hy: 960 + cy - (b2.top + b2.bottom) / 2};
};
out['HIPPO-READ'] = () => {
  const e = BEAST_KIT.HIPPO, lurk = e.anims.LURK, yawn = e.anims.YAWN, Bl = lurk.build(0.25), By = yawn.build(0.55), hd = 75 * D2R;
  const cy = readCam(e, By, hd, yawn.place!, 900, 'h', 540, 790), cl = readCam(e, Bl, hd, lurk.place!, 120, 'w', 540, 1660, 4);
  const top: Cell = {x: 0, y: 110, w: 1080, h: 1330}, bot: Cell = {x: 0, y: 1440, w: 1080, h: 480};
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    paintItem(p, cy, By, top, hd, yawn.place!, 0, false);
    paintItem(p, cl, Bl, bot, hd, lurk.place!, 1, false);
  }}>
    <div style={tag(30, 22, 40)}>AS-HIPPO-R1 read sizes (N3)</div>
    <div style={tag(30, 72, 22)}>yawn peak (t 0.55): visible hippo 900 px tall, heading 75 deg · lurk (t 0.25): 120 px wide, heading 75 deg · river water</div>
    <div style={tag(20, 1450, 24, '#f4ecd8')}>lurk at 120 px wide (B02 read)</div>
  </Painted>;
};
// HIPPO-HEAD: the head close (eyes, ears, nostrils, flush, mouth, tusks): closed and yawn peak, front 3/4 and side, out of water so the jaw reads.
out['HIPPO-HEAD'] = () => {
  const e = BEAST_KIT.HIPPO, Bc = e.stand(), By = e.anims.YAWN.build(0.55), cells = grid(2, 2, 0, 110, 1080, 1790), only = (b: string) => /^(neck|skull|jaw|eye|ear)/.test(b);
  const its: [Build, number, string][] = [[Bc, 40, 'closed, front 3/4'], [Bc, 0, 'closed, side'], [By, 40, 'yawn peak, front 3/4'], [By, 0, 'yawn peak, side']];
  const cams = its.map(([B, h], i) => {
    const c0 = cam(e, 6, 20, 0, 960, 1.3), b = paintBeast(null, c0, B, {at: [0, 0], heading: h * D2R, only}), cell = cells[i];
    const k = Math.min((cell.w * 0.8) / (b.right - b.left), (cell.h * 0.72) / (b.bottom - b.top)), c = cam(e, 6, 20 * k, 0, 960, 1.3), b2 = paintBeast(null, c, B, {at: [0, 0], heading: h * D2R, only});
    return {...c, cx: cell.x + cell.w / 2 - (b2.left + b2.right) / 2, hy: 960 + cell.y + cell.h * 0.55 - (b2.top + b2.bottom) / 2};
  });
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.45 + 0.1 * (i % 2)));
    its.forEach(([B, h], i) => paintBeast(p, cams[i], B, {at: [0, 0], heading: h * D2R, seed: 76000 + i * 1500, shadowOp: 0, only}));
  }}>
    <div style={tag(30, 22, 40)}>AS-HIPPO-R1 head close (head and neck only)</div>
    <div style={tag(30, 72, 22)}>eyes on turrets, ears, nostril bumps on top, pink flush · yawn: palate, tongue, tusks, peg incisors</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24)}>{its[i][2]}</div>)}
  </Painted>;
};
// Close cards: snake head (lie, head-lift with tongue; front 3/4 and side) and the mosquito macro (hover, front 3/4 and side, rim light on black).
const Close = ({e, title, sub, its, only, bg = paper, frac = 0.8, pf = paintBeast}: {e: BeastKitEntry; title: string; sub: string; its: [Build, number, number, string][]; only?: (b: string) => boolean; bg?: string; frac?: number; pf?: PaintFn}) => {
  const cells = grid(2, 2, 0, 110, 1080, 1790), dark = bg !== paper;
  const cams = its.map(([B, h, al], i) => {
    const c0 = cam(e, al, 20, 0, 960), b = paintBeast(null, c0, B, {at: [0, 0], heading: h * D2R, only}), cell = cells[i];
    const k = Math.min((cell.w * frac) / (b.right - b.left), (cell.h * 0.7) / (b.bottom - b.top)), c = cam(e, al, 20 * k, 0, 960), b2 = paintBeast(null, c, B, {at: [0, 0], heading: h * D2R, only});
    return {...c, cx: cell.x + cell.w / 2 - (b2.left + b2.right) / 2, hy: 960 + cell.y + cell.h * 0.55 - (b2.top + b2.bottom) / 2};
  });
  return <Painted band={false} paper={bg} paint={(p) => {
    hardFill(p, 1, bg, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.45 + 0.1 * (i % 2), dark ? '#2a2e36' : '#b9a87e'));
    its.forEach(([B, h], i) => pf(p, cams[i], B, {at: [0, 0], heading: h * D2R, seed: 76000 + i * 1500, shadowOp: 90, only}));
  }}>
    <div style={tag(30, 22, 40, dark ? '#e8ecf2' : '#2b211c')}>{title}</div>
    <div style={tag(30, 72, 22, dark ? '#c9d0da' : '#2b211c')}>{sub}</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24, dark ? '#e8ecf2' : '#2b211c')}>{its[i][3]}</div>)}
  </Painted>;
};
if (BEAST_KIT.SNAKE) out['SNAKE-HEAD'] = () => {
  const e = BEAST_KIT.SNAKE, Bl = buildSnake({...SNAKE_POSES.lie(0), trim: 0.84}), Bh = buildSnake({...SNAKE_POSES.headLift(0.57), trim: 0.84});
  return <Close e={e} frac={0.8} pf={paintSnake} title="AS-SNAKE-R1 head close (front 0.22 m)" sub="plain round head, no hood, small dark eye without a highlight, mouth line, forked tongue (head-lift t 0.57)" its={[[Bl, 40, 20, 'lie, front 3/4 (high 20 deg)'], [Bl, 0, 5, 'lie, side'], [Bh, 60, 10, 'head-lift + tongue, front 3/4'], [Bh, 0, 5, 'head-lift + tongue, side']]} />;
};
if (BEAST_KIT.MOSQUITO) out['MOSQUITO-MACRO'] = () => {
  const e = BEAST_KIT.MOSQUITO, Bh = e.anims.HOVER.build(0.25), Br = e.stand();
  return <Close e={e} bg="#15181d" frac={0.85} title="AS-MOSQUITO-R1 macro (space M, mm)" sub="hover with wing-beat blur, cool rim light on black · rest pose with folded wings for the body read" its={[[Bh, 40, 8, 'hover, front 3/4'], [Bh, 0, 4, 'hover, side'], [Br, 140, 18, 'rest, rear 3/4 (high 18 deg)'], [Br, 90, 4, 'rest, front']]} />;
};
// SNAKE-READ: 300 px long across the frame (B04 path, brief N11 acceptance) on bund dirt, and the head-lift at the same scale.
if (BEAST_KIT.SNAKE) out['SNAKE-READ'] = () => {
  const e = BEAST_KIT.SNAKE, cells = grid(1, 3, 0, 110, 1080, 1790), its: [Build, number, number, string][] = [[e.stand(), 20, 25, 'lie, 300 px long, high 25 deg'], [e.anims.HEADLIFT.build(0.57), 30, 12, 'head-lift, same scale, low 12 deg'], [e.anims.SLITHER.build(0.4), 10, 35, 'slither t 0.4, same scale, high 35 deg']];
  const cams = its.map(([B, h, al], i) => { const c0 = cam(e, al, 20, 0, 960), b = paintBeast(null, c0, B, {at: [0, 0], heading: h * D2R}), k = 300 / (b.right - b.left), c = cam(e, al, 20 * k, 0, 960), b2 = paintBeast(null, c, B, {at: [0, 0], heading: h * D2R}), cell = cells[i];
    return {...c, cx: cell.x + cell.w / 2 - (b2.left + b2.right) / 2, hy: 960 + cell.y + cell.h * 0.55 - (b2.top + b2.bottom) / 2}; });
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.2, '#a88058'));
    its.forEach(([B, h], i) => paintSnake(p, cams[i], B, {at: [0, 0], heading: h * D2R, seed: 78000 + i * 1500, shadowOp: 100}));
  }}>
    <div style={tag(30, 22, 40)}>AS-SNAKE-R1 read size (N11)</div>
    <div style={tag(30, 72, 22)}>body drawn 300 px across on bund dirt #a88058 · no species read, belly on the ground</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24)}>{its[i][3]}</div>)}
  </Painted>;
};
Object.assign(out, EXTRA_CARDS);
export const CARDS = out;
