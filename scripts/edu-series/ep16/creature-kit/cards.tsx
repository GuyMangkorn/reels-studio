// EDU-EP16 creature kit comp cards (Boss, 14 Nov 2026): turnaround, rig overlay and animation strips for every BEAST_KIT creature, through one Chrome.
import type {CSSProperties} from 'react';
import {hardFill} from '../../../../src/painted/kit/draw';
import {mixColor, type Painter} from '../../../../src/painted/kit/painter';
import type {YCam} from '../../../../src/painted/kit/ycam';
import {FONT, Painted} from '../../../../src/painted/survival/frame';
import {paintBeast, type Build, type BeastPlace} from '../../../../src/painted/survival/beast';
import {animSamples, BEAST_KIT, type BeastKitEntry} from '../../../../src/painted/survival/beast-kit';

const D2R = Math.PI / 180;
type View = {name: string; heading: number; alpha: number};
export const TURN_VIEWS: View[] = [
  {name: 'front', heading: 90 * D2R, alpha: 0}, {name: 'front 3/4', heading: 45 * D2R, alpha: 0}, {name: 'side', heading: 0, alpha: 0},
  {name: 'rear 3/4', heading: -135 * D2R, alpha: 0}, {name: 'back', heading: -90 * D2R, alpha: 0}, {name: 'top-down (high angle 65 deg)', heading: 0, alpha: 65},
];
type Cell = {x: number; y: number; w: number; h: number};
const cam = (e: BeastKitEntry, alpha: number, scale: number, cx: number, hy: number): YCam => {
  const D = e.size * 6, al = alpha * D2R;
  return {x: 0, y: e.hc + D * Math.sin(al), z: D * Math.cos(al), yaw: 0, f: scale * D, hy, pitch: -al, cx};
};
const bounds = (e: BeastKitEntry, B: Build, v: View, scale: number, place: Partial<BeastPlace>) => paintBeast(null, cam(e, v.alpha, scale, 0, 960), B, {at: [0, 0], heading: v.heading, ...place});
/** One shared scale for all items so views compare; each item then centred in its cell (top-down centred vertically, the rest sitting on the cell floor). */
const fit = (e: BeastKitEntry, items: {B: Build; v: View; cell: Cell}[], place: Partial<BeastPlace>, fill = 0.9) => {
  const s0 = 20, bs = items.map((it) => bounds(e, it.B, it.v, s0, place));
  const scale = Math.min(...items.map((it, i) => Math.min((it.cell.w * fill) / ((bs[i].right - bs[i].left) / s0), (it.cell.h * fill * 0.9) / ((bs[i].bottom - bs[i].top) / s0)))) ;
  return items.map((it) => {
    const b = bounds(e, it.B, it.v, scale, place), cx = it.cell.x + it.cell.w / 2 - (b.left + b.right) / 2;
    const hy = it.v.alpha > 30 ? 960 + (it.cell.y + it.cell.h / 2 - (b.top + b.bottom) / 2) : 960 + (it.cell.y + it.cell.h * 0.93 - b.bottom);
    return cam(e, it.v.alpha, scale, cx, hy);
  });
};
const paper = '#d9e2cc';
const cellBg = (p: Painter, c: Cell, seed: number, tone: number) => hardFill(p, seed, mixColor('#b9a87e', paper, tone), [[c.x + 6, c.y + 6], [c.x + c.w - 6, c.y + 6], [c.x + c.w - 6, c.y + c.h - 6], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]]);
const tag = (x: number, y: number, size = 26): CSSProperties => ({position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#2b211c'});

const grid = (cols: number, rows: number, x0: number, y0: number, w: number, h: number): Cell[] => Array.from({length: cols * rows}, (_, i) => ({x: x0 + (i % cols) * (w / cols), y: y0 + Math.floor(i / cols) * (h / rows), w: w / cols, h: h / rows}));

const Sheet = ({title, sub, items, cells, labels, e, place = {}, rig = false}: {title: string; sub: string; items: {B: Build; v: View}[]; cells: Cell[]; labels: string[]; e: BeastKitEntry; place?: Partial<BeastPlace>; rig?: boolean}) => {
  const its = items.map((it, i) => ({...it, cell: cells[i]})), cams = fit(e, its, place);
  return (
    <Painted band={false} paper={paper} paint={(p) => {
      hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
      cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.45 + 0.1 * (i % 2)));
      its.forEach((it, i) => paintBeast(p, cams[i], it.B, {at: [0, 0], heading: it.v.heading, seed: 70000 + i * 1500, shadowOp: 80, rig, ...place}));
    }}>
      <div style={tag(30, 22, 40)}>{title}</div>
      <div style={tag(30, 72, 24)}>{sub}</div>
      {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24)}>{labels[i]}</div>)}
    </Painted>
  );
};

// ------------------------------------------------------------------ renderer capability probe: a faded creature layer (N16-22 R2, 50 % opacity)
// BrushCanvas clears to an opaque `paper`, so a layer cannot be transparent; the probe paints the creature on a BLACK paper in its own BrushCanvas and lays it over the sky with CSS
// `mix-blend-mode: screen` at `opacity` 0.5 (black = no change, so only the creature shows, faded as one piece: overlaps inside it do not double up, unlike per-polygon washAt alpha).
const Apparition = ({mode}: {mode: 'layer' | 'wash'}) => {
  const e = BEAST_KIT.TREX, B = e.anims.ROAR.build(0.6), c = cam(e, 0, 38, 0, 1500);
  const sky = (p: Painter) => { hardFill(p, 2, '#c9d3e2', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); hardFill(p, 3, '#e9eef6', [[0, 900], [1080, 900], [1080, 1920], [0, 1920]]); };
  const bank = (p: Painter) => { for (let i = 0; i < 9; i++) hardFill(p, 20 + i, '#f4f6fa', Array.from({length: 16}, (_, k) => [150 + i * 105 + 120 * Math.cos((k / 16) * 6.283), 1500 + (i % 2) * 30 + 70 * Math.sin((k / 16) * 6.283)] as [number, number])); };
  const bankSvg = <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{Array.from({length: 9}, (_, i) => <ellipse key={i} cx={150 + i * 105} cy={1500 + (i % 2) * 30} rx={125} ry={72} fill="#f4f6fa" />)}</svg>;
  if (mode === 'wash') return (
    <div style={{position: 'absolute', inset: 0}}>
      <Painted band={false} paper="#c9d3e2" paint={(p) => { sky(p); paintBeast(p, c, B, {at: [0, 0], heading: 0, seed: 71000, shadowOp: 0, haze: 0.5, hazeCol: '#c9d3e2'}); }} />
      {bankSvg}
      <div style={tag(30, 22, 30)}>no true layer: colour mixed 50 % toward the sky</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, background: '#c9d3e2'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'screen'}}>
        <Painted band={false} paper="#000000" paint={(p) => { paintBeast(p, c, B, {at: [0, 0], heading: 0, seed: 71000, shadowOp: 0, amb: '#d8d0b0', ambK: 0.2}); }} />
      </div>
      {bankSvg}
      <div style={tag(30, 22, 30)}>layer opacity 0.5 (CSS screen on a black-paper BrushCanvas)</div>
    </div>
  );
};

const out: Record<string, () => JSX.Element> = {};
const TZ_YAWS = [0, 40, 90, 150, 200, 320];
out['TREX-APPARITION-LAYER'] = () => <Apparition mode="layer" />;
out['TREX-APPARITION-MIX'] = () => <Apparition mode="wash" />;
for (const [key, e] of Object.entries(BEAST_KIT)) {
  const stand = e.stand();
  out[`${key}-TURN`] = () => <Sheet e={e} title={`${e.id} turnaround`} sub={`${e.label} · stand pose · front, front 3/4, side, rear 3/4, back, top-down`} items={TURN_VIEWS.map((v) => ({B: stand, v}))} cells={grid(2, 3, 0, 110, 1080, 1790)} labels={TURN_VIEWS.map((v) => v.name)} />;
  out[`${key}-RIG`] = () => <Sheet e={e} rig title={`${e.id} skeleton`} sub="joint dots (red) and bone links (yellow) over the volume; blue = root bone" items={[TURN_VIEWS[1], TURN_VIEWS[2]].map((v) => ({B: stand, v}))} cells={grid(1, 2, 0, 110, 1080, 1790)} labels={['front 3/4', 'side']} />;
  for (const [an, a] of Object.entries(e.anims)) {
    const ts = animSamples(a), mk = (v: View, id: string) => { out[`${key}-${an}${id}`] = () => <Sheet e={e} title={`${e.id} ${an}${id ? ' (side)' : ''}`} sub={`${a.note} · ${ts.length} samples ${a.cycle ? 'around the cycle' : 'across the range'}`} items={ts.map((t) => ({B: a.build(t), v}))} cells={grid(2, 4, 0, 110, 1080, 1790)} labels={ts.map((t) => `t = ${t.toFixed(3)}`)} place={a.place} />; };
    mk({name: '3/4', heading: 40 * D2R, alpha: 0}, '');
    if (a.side) mk({name: 'side', heading: 0, alpha: 0}, '-SIDE');
  }
}

// Zoom stills for fix passes (14 Nov 2026): `<KEY>-<ANIM>-TZ<frame 00-15>-<yaw deg>` = the tail root at 70 px per m (tail-continuity strips); `...-HZ<frame>-<yaw>` = the head (skull.joint, else the tail root) at 150 px per m.
// One frame per still, for before/after strips cropped with ffmpeg.
const ZOOM = {TZ: {joint: 'tail.base', pxm: 70}, HZ: {joint: 'skull.joint', pxm: 150}} as const;
for (const [key, e] of Object.entries(BEAST_KIT)) for (const [an, a] of Object.entries(e.anims)) for (let i = 0; i < 16; i++) for (const yw of TZ_YAWS) for (const [zk, zz] of Object.entries(ZOOM)) {
  out[`${key}-${an}-${zk}${String(i).padStart(2, '0')}-${yw}`] = () => {
    const t = a.cycle ? i / 16 : i / 15, B = a.build(t), hd = yw * D2R, D = e.size * 6;
    const w = paintBeast(null, cam(e, 0, 20, 0, 960), B, {at: [0, 0], heading: hd, ...a.place}).toWorld(B.joints[zz.joint] ?? B.joints['tail.base'] ?? B.anchors.skull);
    const c: YCam = {x: w[0], y: w[1], z: w[2] + D, yaw: 0, f: zz.pxm * D, hy: 960, pitch: 0};
    return <Painted band={false} paper={paper} paint={(p) => { hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); paintBeast(p, c, B, {at: [0, 0], heading: hd, ...a.place, shadowOp: 80}); }}>
      <div style={tag(20, 20, 30)}>{`${key} ${an} t=${t.toFixed(3)} yaw ${yw}`}</div>
    </Painted>;
  };
}
export const CARDS = out;
