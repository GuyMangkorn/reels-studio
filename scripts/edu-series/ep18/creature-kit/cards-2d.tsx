// EDU-EP18 flat-card comp cards (Boss, 15 Nov 2026, pre-W3 pass A): the hen (N7, new), the dog-thai (N8, EP18 papercut copy since fix round 1), the room-scale mosquito dot (N13)
// and a lineup of every EP18 creature at one scale with the girl's height for reference.
import {hardFill, inkLine} from '../../../../src/painted/kit/draw';
import {mixColor, type Painter, type Pt} from '../../../../src/painted/kit/painter';
import type {YCam} from '../../../../src/painted/kit/ycam';
import {FONT, Painted} from '../../../../src/painted/survival/frame';
import {paintBeast} from '../../../../src/painted/survival/beast';
import {BEAST_KIT} from '../../../../src/painted/survival/beast-kit';
import {ANIMALS, type AnimalPose} from '../../../../src/painted/kit/animals';
import {drawDog18} from '../../../../src/painted/edu18/dog';
import {animalMotion, animalMotionDuration, type AnimalMotionId} from '../../../../src/painted/kit/animal-motions';
import {drawMosquitoDot, MOSQ} from '../../../../src/painted/kit/mosquito';
import {paintSnake} from '../../../../src/painted/kit/snake';
import {drawHen, HEN_HEIGHT, HEN_WALK, HENS, type HenPose} from '../../../../src/painted/edu18/hen';

type Cell = {x: number; y: number; w: number; h: number};
const paper = '#d9e2cc';
const tag = (x: number, y: number, size = 24, color = '#2b211c'): React.CSSProperties => ({position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color});
const grid = (cols: number, rows: number, x0: number, y0: number, w: number, h: number): Cell[] => Array.from({length: cols * rows}, (_, i) => ({x: x0 + (i % cols) * (w / cols), y: y0 + Math.floor(i / cols) * (h / rows), w: w / cols, h: h / rows}));
const cellBg = (p: Painter, c: Cell, seed: number, col: string) => hardFill(p, seed, col, [[c.x + 6, c.y + 6], [c.x + c.w - 6, c.y + 6], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]]);
const ground = (p: Painter, c: Cell, y: number, seed: number) => inkLine(p, seed, [[c.x + 30, y], [c.x + c.w - 30, y]], {closed: false, weight: 0.8, color: '#7a6a50', still: true});
const Card = ({title, sub, cells, labels, paint}: {title: string; sub: string; cells: Cell[]; labels: string[]; paint: (p: Painter) => void}) => (
  <Painted band={false} paper={paper} paint={(p) => { hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); cells.forEach((c, i) => cellBg(p, c, 10 + i, mixColor('#c9a77a', paper, 0.55 + 0.08 * (i % 2)))); paint(p); }}>
    <div style={tag(30, 22, 40)}>{title}</div>
    <div style={tag(30, 72, 22)}>{sub}</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10)}>{labels[i]}</div>)}
  </Painted>
);
const T0 = 0.7;
export const EXTRA_CARDS: Record<string, () => JSX.Element> = {};

// ---------------------------------------------------------------- HEN (new, N7)
const HEN_UNIT = 1100;   // px per m: a 0.40 m hen ~440 px tall in a cell
EXTRA_CARDS['HEN-TURN'] = () => {
  const cells = grid(2, 3, 0, 110, 1080, 1790), views: HenPose['view'][] = ['right', 'left', 'front'], ids = ['hen-brown', 'hen-buff'] as const;
  const items = views.flatMap((v) => ids.map((id) => ({id, v})));
  return <Card title="new: hen (EDU-EP18 N7) views" sub="two village hens, 0.40 m to the comb · right, left, front · stand (flat cards like the kit ANIMALS; a turn is a cut)" cells={cells} labels={items.map((it) => `${it.id}, ${it.v}`)} paint={(p) => {
    items.forEach((it, i) => { const c = cells[i], gy = c.y + c.h * 0.86; ground(p, c, gy, 200 + i); drawHen(p, HENS[it.id].seed * 10 + i, HENS[it.id], [c.x + c.w / 2, gy], HEN_UNIT, {view: it.v, state: 'stand'}, T0); });
  }} />;
};
for (const [st, label] of [['walk', 'walk cycle (0.5 s, legs alternate, head holds then thrusts)'], ['peck', 'peck (head to the ground ahead and back, body tips forward)']] as const) {
  EXTRA_CARDS[`HEN-${st.toUpperCase()}`] = () => {
    const cells = grid(2, 4, 0, 110, 1080, 1790), ts = Array.from({length: 8}, (_, i) => (st === 'walk' ? (i / 8) * HEN_WALK.sec : i / 7));
    return <Card title={`new: hen ${st}`} sub={`hen-brown, right · ${label} · 8 samples`} cells={cells} labels={ts.map((t) => (st === 'walk' ? `walk ${t.toFixed(3)} s` : `peck ${t.toFixed(2)}`))} paint={(p) => {
      ts.forEach((t, i) => { const c = cells[i], gy = c.y + c.h * 0.86; ground(p, c, gy, 300 + i); drawHen(p, HENS['hen-brown'].seed * 10 + i, HENS['hen-brown'], [c.x + c.w / 2, gy], HEN_UNIT * 0.85, st === 'walk' ? {view: 'right', state: 'walk', walk: t} : {view: 'right', state: 'peck', peck: t}, T0 + i * 0.1); });
    }} />;
  };
}

// ---------------------------------------------------------------- DOG (dog-thai, N8): the EP18 papercut copy edu18/dog.ts (fix round 1); the kit dog is unchanged
const DOG_UNIT = 540;
EXTRA_CARDS['DOG-TURN'] = () => {
  const cells = grid(2, 3, 0, 110, 1080, 1790), def = ANIMALS['dog-thai'];
  const poses: [AnimalPose, string][] = [[{view: 'right', state: 'stand'}, 'right, stand'], [{view: 'left', state: 'stand'}, 'left, stand'], [{view: 'front', state: 'stand'}, 'front, stand'], [{view: 'right', state: 'stand', quarter: 0.7}, 'front 3/4 (quarter 0.7)'], [{view: 'right', state: 'sit'}, 'right, sit'], [{view: 'right', state: 'lie'}, 'right, lie']];
  return <Card title="dog-thai, EP18 papercut copy (edu18/dog.ts)" sub="EDU-EP18 N8 casting: dog-thai, walk-in, curious -> sniff -> happy-wag -> walk-out · 0.50 m at the shoulder" cells={cells} labels={poses.map((q) => q[1])} paint={(p) => {
    poses.forEach(([pose], i) => { const c = cells[i], gy = c.y + c.h * 0.86; ground(p, c, gy, 400 + i); drawDog18(p, def.seed * 10 + i, def, [c.x + c.w / 2, gy], DOG_UNIT, pose, T0); });
  }} />;
};
EXTRA_CARDS['DOG-MOTIONS'] = () => {
  const cells = grid(2, 4, 0, 110, 1080, 1790), def = ANIMALS['dog-thai'];
  const pick: [AnimalMotionId, number, string][] = [['walk-in-from-left', 0.35, 'walk-in (mid stride)'], ['walk-in-from-left', 0.98, 'walk-in (arrived)'], ['sniff', 0.4, 'sniff (head low)'], ['sniff', 0.75, 'sniff (look up)'], ['happy-wag', 0.1, 'happy-wag a'], ['happy-wag', 0.35, 'happy-wag b'], ['walk-out-to-right', 0.5, 'walk-out (mid)'], ['walk-out-to-right', 0.9, 'walk-out (late)']];
  return <Card title="dog-thai kit motions on the EP18 copy" sub="the four motions the brief casts, sampled (fraction of each motion's length); offsets dropped so each stays in its cell" cells={cells} labels={pick.map((q) => q[2])} paint={(p) => {
    pick.forEach(([id, f], i) => { const c = cells[i], gy = c.y + c.h * 0.86, ctx = {animal: 'dog-thai' as const, view: 'right' as const}, fr = animalMotion(id, f * animalMotionDuration(id, ctx), ctx); ground(p, c, gy, 500 + i); drawDog18(p, def.seed * 10 + i, def, [c.x + c.w / 2, gy - fr.offset[1] * DOG_UNIT * 0.85], DOG_UNIT * 0.85, fr.pose, T0 + f); });
  }} />;
};

// ---------------------------------------------------------------- MOSQUITO room-scale dot (N13 / VD06)
EXTRA_CARDS['MOSQUITO-DOT'] = () => {
  const cells = grid(1, 3, 0, 110, 1080, 1790);
  const fields: [string, string, string][] = [['#d9a982', '#c48f6a', 'on skin (face close, B02-SH03): 4, 5, 6 px'], ['#d8c49c', '#6f7a66', 'on the bank / water (B02): 4, 5, 6 px'], ['#4a3a30', '#2a2420', 'bedroom night wall (B05-SH02): 4, 5, 6 px']];
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    cells.forEach((c, i) => {
      const [a, b] = fields[i];
      hardFill(p, 20 + i, a, [[c.x + 6, c.y + 6], [c.x + c.w - 6, c.y + 6], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]]);
      hardFill(p, 30 + i, b, i === 0 ? [[c.x + 6, c.y + c.h * 0.7], [c.x + c.w * 0.5, c.y + c.h * 0.62], [c.x + c.w - 6, c.y + c.h * 0.75], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]] : [[c.x + 6, c.y + c.h * 0.55], [c.x + c.w - 6, c.y + c.h * 0.5], [c.x + c.w - 6, c.y + c.h - 6], [c.x + 6, c.y + c.h - 6]]);
      [4, 5, 6].forEach((s, k) => { const at: Pt = [c.x + 180 + k * 120, c.y + c.h * 0.32]; drawMosquitoDot(p, 600 + i * 10 + k, at, s, [-1, 0.25], 2, i === 2 ? '#141214' : MOSQ.body); });
      [4, 5, 6].forEach((s, k) => { const at: Pt = [c.x + 620 + k * 140, c.y + c.h * 0.32]; drawMosquitoDot(p, 700 + i * 10 + k, at, s * 6, [-1, 0.25], 12, i === 2 ? '#141214' : MOSQ.body); });
    });
  }}>
    <div style={tag(30, 22, 40)}>AS-MOSQUITO-R1 room-scale dot (VD06)</div>
    <div style={tag(30, 72, 22)}>left: true size 4, 5, 6 px with a 2 px blur trail (drawMosquitoDot) · right: the same dots drawn x6 to show the shape</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24, i === 2 ? '#e8e0d0' : '#2b211c')}>{fields[i][2]}</div>)}
  </Painted>;
};

// ---------------------------------------------------------------- LINEUP: every EP18 creature at one scale (220 px per m) with the girl's 1.64 m for reference
EXTRA_CARDS['LINEUP'] = () => {
  const U = 220, gy = 1500, H = BEAST_KIT.HIPPO, S = BEAST_KIT.SNAKE;
  const camAt = (cx: number): YCam => ({x: 0, y: 0.8, z: 60, yaw: 0, f: U * 60, hy: gy - 0.8 * U, pitch: 0, cx: cx - 540});
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    hardFill(p, 2, mixColor('#c9a77a', paper, 0.5), [[0, gy], [1080, gy], [1080, 1920], [0, 1920]]);
    // girl height bar 1.64 m
    const gx = 90; hardFill(p, 3, '#8a8f9a', [[gx - 22, gy], [gx + 22, gy], [gx + 22, gy - 1.64 * U], [gx - 22, gy - 1.64 * U]]);
    hardFill(p, 4, '#8a8f9a', Array.from({length: 14}, (_, k) => [gx + 30 * Math.cos((k / 14) * 6.283), gy - 1.64 * U + 10 + 30 * Math.sin((k / 14) * 6.283)] as Pt));
    paintBeast(p, camAt(560), H.stand(), {at: [0, 0], heading: 0, seed: 81000, shadowOp: 70});
    paintSnake(p, {...camAt(800), y: 3, pitch: -0.05, hy: gy + 330 - 0.8 * U}, S.stand(), {at: [0, 0], heading: 0, seed: 82000, shadowOp: 90});
    drawDog18(p, 9031, ANIMALS['dog-thai'], [250, gy + 120], U, {view: 'right', state: 'stand'}, T0);
    drawHen(p, 18011, HENS['hen-brown'], [430, gy + 120], U, {view: 'right', state: 'stand'}, T0);
    drawHen(p, 18111, HENS['hen-buff'], [520, gy + 120], U, {view: 'left', state: 'peck', peck: 0.5}, T0);
    drawMosquitoDot(p, 18200, [1000, gy - 1.3 * U], 3, [-1, 0], 0);
    for (let m = 0; m <= 4; m++) inkLine(p, 900 + m, [[40, gy - m * 0.5 * U], [56, gy - m * 0.5 * U]], {closed: false, weight: 0.8, color: '#3a3020', still: true});
  }}>
    <div style={tag(30, 22, 40)}>EDU-EP18 creatures at one scale</div>
    <div style={tag(30, 72, 22)}>220 px per m · hippo 3.6 m (stand) · dog-thai 0.50 m · hens 0.40 m · snake 1.4 m (in front, lying) · mosquito 6 mm (dot, far right) · grey bar = GIRL 1.64 m</div>
    <div style={tag(60, gy - 1.64 * U - 70, 22)}>GIRL 1.64 m (bar)</div>
    <div style={tag(900, gy - 1.3 * U - 50, 22)}>mosquito</div>
    <div style={tag(30, 1870, 20)}>ruler ticks every 0.5 m at left · not user-approved designs (comp cards, 15 Nov 2026)</div>
  </Painted>;
};
void HEN_HEIGHT;
