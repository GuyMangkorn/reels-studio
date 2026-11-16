// EDU-EP18 three.js hippo spike comp cards (Boss, 15 Nov 2026, AS-HIPPO3D-SPIKE, output creature-kit-v7-three; round 2 papercut look v8-three, 16 Nov 2026). Same key cards as the v6 hippo
// (HEAD, READ, LINEUP) plus TURN and STATES; the hippo is src/painted/edu18/hippo3d.tsx in transparent WebGL canvases over a painted card.
//   sh scripts/edu-series/ep18/creature-kit/render-three.sh <version> [IDS]   -> out/ep18/kit/<version>/<ID>.png
import {useCurrentFrame} from 'remotion';
import {Painted} from '../../../../src/painted/survival/frame';
import {hardFill, inkLine} from '../../../../src/painted/kit/draw';
import {mixColor, type Pt} from '../../../../src/painted/kit/painter';
import {ANIMALS} from '../../../../src/painted/kit/animals';
import {drawDog18} from '../../../../src/painted/edu18/dog';
import {drawHen, HENS} from '../../../../src/painted/edu18/hen';
import {drawMosquitoDot} from '../../../../src/painted/kit/mosquito';
import {Hippo3DView, type View3D} from '../../../../src/painted/edu18/hippo3d';
import {HIPPO3D_POSES, HIPPO3D_WATER, type Hippo3DPose, type Hippo3DState} from '../../../../src/painted/edu18/hippo3d-sdf';
import {cellBg, grid, paper, tag, WATER, type Cell} from './cards';

const ID = 'AS-HIPPO3D-SPIKE';
const at = (c: Cell): React.CSSProperties => ({position: 'absolute', left: c.x + 6, top: c.y + 6});
const inner = (c: Cell) => ({w: Math.round(c.w - 12), h: Math.round(c.h - 12)});
const Bg = ({cells, children, title, sub, labels, dark = false}: {cells: Cell[]; children: React.ReactNode; title: string; sub: string; labels: string[]; dark?: boolean}) => (
  <Painted band={false} paper={paper} paint={(p) => { hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); cells.forEach((c, i) => cellBg(p, c, 10 + i, 0.45 + 0.1 * (i % 2), dark ? '#2a2e36' : '#b9a87e')); }}>
    {children}
    <div style={tag(30, 22, 40)}>{title}</div>
    <div style={tag(30, 72, 22)}>{sub}</div>
    {cells.map((c, i) => <div key={i} style={tag(c.x + 14, c.y + 10, 24)}>{labels[i]}</div>)}
  </Painted>
);
const POSE = (s: Hippo3DState, t: number): Hippo3DPose => HIPPO3D_POSES[s](t);
const out: Record<string, () => JSX.Element> = {};

// HEAD: head and neck only, closed and yawn peak, front 3/4 and side (the v6 HIPPO-HEAD layout).
out['HEAD'] = () => {
  const cells = grid(2, 2, 0, 110, 1080, 1790), closed = POSE('stand', 0), yawn = {...POSE('yawn', 0.55), lift: 0, pitch: 0, float: 0};
  const its: [Hippo3DPose, View3D, string][] = [[closed, {yawDeg: 40, elevDeg: 6}, 'closed, front 3/4'], [closed, {yawDeg: 0, elevDeg: 6}, 'closed, side'], [yawn, {yawDeg: 40, elevDeg: 6}, 'yawn peak, front 3/4'], [yawn, {yawDeg: 0, elevDeg: 6}, 'yawn peak, side']];
  return <Bg cells={cells} title={`${ID} head close (head and neck only)`} sub="v8 papercut: 3 flat tones, cut-edge rim, offset drop shadow, no ink, no glint · boxy head, lip pads, turrets · yawn: palate, tongue, tusks" labels={its.map((x) => x[2])}>
    {its.map(([P, v], i) => { const {w, h} = inner(cells[i]); return <Hippo3DView key={i} style={at(cells[i])} width={w} height={h} pose={P} part="head" res={120} view={v} fit={{fill: 0.8, cy: h * 0.55}} />; })}
  </Bg>;
};

// READ: the brief's read sizes (N3): yawn peak 900 px tall above the water, lurk 120 px wide, heading 75 deg, on river water.
out['READ'] = () => {
  const top: Cell = {x: 0, y: 110, w: 1080, h: 1330}, bot: Cell = {x: 0, y: 1440, w: 1080, h: 480}, a = inner(top), b = inner(bot), W = HIPPO3D_WATER;
  return <Bg cells={[top, bot]} title={`${ID} read sizes (N3)`} sub="yawn peak (t 0.55, v8: body +7 cm, upper jaw 101 deg, chin at the surface): 900 px tall, heading 75 deg · lurk (t 0.25): 120 px wide, heading 75 deg · river water" labels={['', '']}>
    <Hippo3DView style={at(top)} width={a.w} height={a.h} pose={POSE('yawn', 0.55)} res={150} water={W} waterColor={WATER.near} waterFar={WATER.mid} view={{yawDeg: 75, elevDeg: 8}} fit={{px: 900, axis: 'h', aboveY: W, cy: 680}} />
    <Hippo3DView style={at(bot)} width={b.w} height={b.h} pose={POSE('lurk', 0.25)} res={128} water={W} waterColor={WATER.near} waterFar={WATER.mid} view={{yawDeg: 75, elevDeg: 4}} fit={{px: 120, axis: 'w', aboveY: W, cy: 214}} />
    <div style={tag(20, 1450, 24, '#f4ecd8')}>lurk at 120 px wide (B02 read)</div>
  </Bg>;
};

// TURN: standing out of water, side / front 3/4 / front / back 3/4 (the back view is where v6 showed a flared rim).
out['TURN'] = () => {
  const cells = grid(2, 2, 0, 110, 1080, 1790), P = POSE('stand', 0);
  const vs: [View3D, string][] = [[{yawDeg: 0, elevDeg: 8}, 'side'], [{yawDeg: 40, elevDeg: 8}, 'front 3/4'], [{yawDeg: 90, elevDeg: 8}, 'front'], [{yawDeg: 215, elevDeg: 8}, 'back 3/4']];
  return <Bg cells={cells} title={`${ID} turn (stand)`} sub="3.6 m body, shoulder 1.5 m · one smooth skin, no lofts · soft contact shadow" labels={vs.map((x) => x[1])}>
    {vs.map(([v], i) => { const {w, h} = inner(cells[i]); return <Hippo3DView key={i} style={at(cells[i])} width={w} height={h} pose={P} res={128} view={v} shadow fit={{fill: 0.82, cy: h * 0.56}} />; })}
  </Bg>;
};

// STATES: one key pose per brief state (plus stand), front 3/4, in-water states on the 1.3 m surface.
export const STATE_KEYS: [Hippo3DState, number][] = [['stand', 0], ['surface', 0.8], ['yawn', 0.55], ['swim', 0.25], ['charge', 0.25], ['halt', 0.7], ['snort', 0.4], ['lurk', 0.25]];
out['STATES'] = () => {
  const cells = grid(2, 4, 0, 110, 1080, 1790), W = HIPPO3D_WATER;
  return <Bg cells={cells} title={`${ID} states (key poses)`} sub="SURFACE, YAWN, SWIM, CHARGE, HALT, SNORT, LURK as pure functions of t (pose table copied from HIPPO_POSES) · water surface 1.3 m" labels={STATE_KEYS.map(([s, t]) => `${s.toUpperCase()} t ${t}`)}>
    {STATE_KEYS.map(([s, t], i) => { const {w, h} = inner(cells[i]), wet = s !== 'stand'; return <Hippo3DView key={i} style={at(cells[i])} width={w} height={h} pose={POSE(s, t)} res={104} water={wet ? W : null} waterColor={WATER.near} waterFar={WATER.mid} shadow={!wet} view={{yawDeg: 35, elevDeg: 10}} fit={{fill: 0.8, cy: h * 0.56, aboveY: wet ? W - 0.25 : undefined}} />; })}
  </Bg>;
};

// LINEUP: the v6 lineup at 220 px per m with the 1.64 m girl bar, the papercut dog and hens; the hippo is an orthographic WebGL layer at the same scale.
out['LINEUP'] = () => {
  const U = 220, gy = 1500;
  return <Painted band={false} paper={paper} paint={(p) => {
    hardFill(p, 1, paper, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    hardFill(p, 2, mixColor('#c9a77a', paper, 0.5), [[0, gy], [1080, gy], [1080, 1920], [0, 1920]]);
    const gx = 90; hardFill(p, 3, '#8a8f9a', [[gx - 22, gy], [gx + 22, gy], [gx + 22, gy - 1.64 * U], [gx - 22, gy - 1.64 * U]]);
    hardFill(p, 4, '#8a8f9a', Array.from({length: 14}, (_, k) => [gx + 30 * Math.cos((k / 14) * 6.283), gy - 1.64 * U + 10 + 30 * Math.sin((k / 14) * 6.283)] as Pt));
    drawDog18(p, 9031, ANIMALS['dog-thai'], [250, gy + 120], U, {view: 'right', state: 'stand'}, 0.7);
    drawHen(p, 18011, HENS['hen-brown'], [430, gy + 120], U, {view: 'right', state: 'stand'}, 0.7);
    drawHen(p, 18111, HENS['hen-buff'], [520, gy + 120], U, {view: 'left', state: 'peck', peck: 0.5}, 0.7);
    drawMosquitoDot(p, 18200, [1030, gy - 1.85 * U], 3, [-1, 0], 0);
    for (let m = 0; m <= 4; m++) inkLine(p, 900 + m, [[40, gy - m * 0.5 * U], [56, gy - m * 0.5 * U]], {closed: false, weight: 0.8, color: '#3a3020', still: true});
  }}>
    <Hippo3DView style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920} pose={POSE('stand', 0)} res={150} shadow ortho={{pxPerM: U, at: [0, 0, 0], px: [600, gy]}} />
    <div style={tag(30, 22, 40)}>{`${ID} at one scale`}</div>
    <div style={tag(30, 72, 22)}>220 px per m · three.js hippo 3.6 m (stand, orthographic) · papercut dog-thai 0.50 m · hens 0.40 m · grey bar = GIRL 1.64 m</div>
    <div style={tag(60, gy - 1.64 * U - 70, 22)}>GIRL 1.64 m (bar)</div>
    <div style={tag(930, gy - 1.85 * U - 50, 22)}>mosquito</div>
    <div style={tag(30, 1870, 20)}>ruler ticks every 0.5 m at left · spike, not a user-approved design (15 Nov 2026)</div>
  </Painted>;
};

// YAWN-CLIP: frame-purity probe (78 frames = HIPPO_YAWN_SEC 2.6 s at 30 fps); the pose is yawn(frame / 77), nothing else changes per frame.
export const YAWN_CLIP_FRAMES = 78;
export const YawnClip = () => {
  const f = useCurrentFrame(), c: Cell = {x: 0, y: 110, w: 1080, h: 1810}, {w, h} = inner(c), W = HIPPO3D_WATER;
  const pose = HIPPO3D_POSES.yawn(f / (YAWN_CLIP_FRAMES - 1));
  return <Bg cells={[c]} title={`${ID} yawn clip (frame-purity probe)`} sub={`frame ${f} · pose = yawn(t ${(f / (YAWN_CLIP_FRAMES - 1)).toFixed(3)}) · fixed orthographic side camera, 300 px per m`} labels={['']}>
    <Hippo3DView style={at(c)} width={w} height={h} pose={pose} res={128} water={W} waterColor={WATER.near} waterFar={WATER.mid} view={{yawDeg: 40, elevDeg: 8}} ortho={{pxPerM: 300, at: [0.3, 1.6, 0], px: [w / 2, h * 0.45]}} />
  </Bg>;
};

export const CARDS_THREE = out;
