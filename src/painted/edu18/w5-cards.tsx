import {useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, staticFile, useCurrentFrame} from 'remotion';
import type {CanoeOpts} from '../kit/canoe';
import {ANIMALS} from '../kit/animals';
import {camPoint, camUnit, mixYCam, type YCam} from '../kit/ycam';
import {paintSnake} from '../kit/snake';
import type {Painter} from '../kit/painter';
import {drawDog18} from './dog';
import {fpovPushTo500, fpovScreenQuad, FpovPost, line500Box, paintFpovPhone, quadScale, type Quad} from './fpov';
import {drawGirl, GIRL, girlPose} from './girl';
import {HippoInSet} from './hippo-set';
import {b01sh02CanoeX, HIPPO_SHOT_START, HIPPO_SHOTS, paintHippoFxBack, paintHippoFxFront, RIVER_HIPPO_KEY} from './hippo-shots';
import {cam, LF02B_P0} from './looks-cams';
import {openT, paintPaddler} from './looks';
import {DOG18_LICK, SNAKE_SHOTS} from './path-shots';
import {paintPaddyBack, paintPaddyFront, PADDY, SUN_F} from './paddy';
import {postViewBox, PostScreen, SCREEN_H, SCREEN_W, shareAt, SHARE_STEPS_B02, SHARE_STEPS_B06} from './Post';
import {selfieCam} from './post-photo';
import {paintRiverBack, RIVER} from './river';
import {wCircle, wStroke} from './scenery';
import {PaintedStack, type Pass} from './stack';
import {paintVillageBack, paintVillageFront, VILLAGE} from './village';

// EDU-EP18-SHORT W5 Boss QA cards (Boss, 16 Nov 2026; sheet EDU-EP18-SHEETS-R1.0 items B1-B6). NOT the Editor's shots: each card plays one
// asset family's movement by shot ID at the sheet's camera and marks, with the cast reduced to what the check needs (BLOCKOUT staging:
// canoe + paddler at a fixed paddle phase, the girl in a held pose; no captions, mark or sound). The frame is the shot-local frame L.
// Stills entry: w5-index.tsx; render: sh scripts/edu-series/ep18/short/render-w5.sh <version> (one Chrome, --gl=angle).

const ease = Easing.inOut(Easing.sin), outCubic = Easing.out(Easing.cubic);
const k01 = (L: number, a: number, b: number, e: (x: number) => number = ease) => e(Math.min(1, Math.max(0, (L - a) / (b - a))));
const tc = (g: number) => { const s = g / 30; return `TH ${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`; };
const Label = ({shot, L, g, note}: {shot: string; L: number; g: number; note?: string}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: 'rgba(20,18,24,0.72)', color: '#f4efe6', font: '600 26px/32px sans-serif', padding: '8px 18px'}}>
    {`${shot} · EDU-EP18-SHORT ${tc(g)} · f${L} (F${g}) · W5 Boss QA, BLOCKOUT staging${note ? ` · ${note}` : ''}`}
  </div>
);

// ------------------------------------------------------------------------------------------------ B1 hippo shots (river set)
type HippoStage = {cam: (L: number) => YCam; canoe?: (L: number) => CanoeOpts; phase?: (L: number) => number; face?: Parameters<typeof paintPaddler>[4]};
const HIPPO_STAGE: Record<string, HippoStage> = {
  'B01-SH01': {
    cam: (L) => { const a = cam([0.6, 0.7, -1.3], -18, 6.6, 1.0, 2100, 700), b = cam([0.6, 0.7, -1.3], -12, 6.0, 1.0, 2100, 700); return L <= 96 ? mixYCam(a, b, k01(L, 0, 96)) : cam([0.6, 0.7, -1.3], -12, 6.0 * (1 - 0.005 * (L - 96) / 31), 1.0, 2100, 700); },
    canoe: (L) => ({at: [0.05 * (L / 30), 0, 0], heading: 170, rock: 1.5}), phase: () => 0.32, face: 'surprised'},
  'B01-SH02': {
    cam: (L) => { const x = b01sh02CanoeX(L), e = k01(L, 0, 36); return cam([x, 0.7, 0], 72 + 6 * e, 3.0, 0.95, 1700, 760); },
    canoe: (L) => ({at: [b01sh02CanoeX(L), 0, 0], heading: 90, rock: 1}), phase: (L) => (((L - 2) / 9) % 1 + 1) % 1, face: 'smug'},
  'B01-SH03': {
    cam: (L) => { const e = k01(L, 0, 32, outCubic); return cam([7.5, 0.55, -0.25], 82, 9.6 - 0.5 * e, 1.2, 2100, 740); },
    canoe: (L) => ({at: [12 + 0.2 * (L / 30), 0, 0], heading: 90, rock: 1}), phase: () => 0.32, face: 'scared'},
  'B01-SH05': {
    cam: (L) => { const e = k01(L, 0, 56); return cam([12, 0, -2], 30 + 10 * e, 14 + 6 * e, 4 + 5 * e, 900, 700, {pitch: -12 - 10 * e}); },
    canoe: (L) => ({at: [13.5 + 0.8 * (L / 56), 0, 0], heading: 90, rock: 1}), phase: (L) => ((L / 14) % 1 + 1) % 1, face: 'relieved'},
  'B02-SH01': {cam: selfieCam},
  'B02-SH03': {
    cam: (L) => {
      const a = cam([59.6, 1.2, 14.5], 20, 2.4, 1.5, 1000, 600), b = cam([60.05, 1.35, 14.81], 12, 0.9, 1.55, 1000, 700, {pitch: -8});
      const e = L <= 80 ? 0.25 * k01(L, 0, 80) : 0.25 + 0.75 * k01(L, 80, 112);
      return mixYCam(a, b, e);
    }},
};
const HippoCard = ({shot}: {shot: string}) => {
  const L = useCurrentFrame(), g = HIPPO_SHOT_START[shot] + L, st = HIPPO_STAGE[shot], c = st.cam(L), s = HIPPO_SHOTS[shot](L, g);
  const back: Pass = (p) => { paintRiverBack(p, c, {t: g / 30}); paintHippoFxBack(p, c, s); };
  const front: Pass = (p) => {
    paintHippoFxFront(p, c, s);
    if (st.canoe) paintPaddler(p, c, st.canoe(L), st.phase?.(L) ?? 0.32, st.face ?? 'neutral', 820);
  };
  return (
    <AbsoluteFill>
      <PaintedStack paper={RIVER.waterNear} back={back} front={front} clock={g} guides={false}
        mid={s.visible ? <HippoInSet cam={c} pose={s.pose} at={s.at} heading={s.heading} res={150} light={RIVER_HIPPO_KEY} /> : null} />
      <Label shot={shot} L={L} g={g} note={st.canoe ? 'canoe + paddler at a held paddle phase' : 'hippo + river only (girl omitted)'} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ B2 snake shots (paddy set)
const SNAKE_STAGE: Record<string, {start: number; cam: (L: number) => YCam; girlAt: [number, number, number]}> = {
  'B04-SH02': {start: 858, cam: (L) => { const e = k01(L, 0, 41, outCubic); return cam([0, 0.7, -0.6], 0, 2.2 - 0.2 * e, 0.7, 1100, 850); }, girlAt: LF02B_P0},
  'B04-SH03': {start: 899, cam: (L) => { const e = k01(L, 0, 88); return cam([0.35, 0.45, -0.2], 40 - 8 * e, 0.9 - 0.1 * e, 0.62, 1200, 760, {pitch: -10, near: 0.05}); }, girlAt: LF02B_P0},
  'B04-SH04': {start: 987, cam: (L) => mixYCam(cam([0, 0.8, -1.0], 20, 3.0, 1.2, 900, 760, {pitch: -6}), cam([0, 0.3, -1.0], 35, 16, 9, 900, 640, {pitch: -26}), k01(L, 0, 90)), girlAt: [0, 0.35, -1.9]},
};
const SnakeCard = ({shot}: {shot: string}) => {
  const L = useCurrentFrame(), st = SNAKE_STAGE[shot], g = st.start + L, c = st.cam(L), s = SNAKE_SHOTS[shot](L);
  const pass: Pass = (p) => {
    paintPaddyBack(p, c, {t: g / 30});
    const gp = camPoint(c, st.girlAt), u = camUnit(c, st.girlAt), def = GIRL['travel-safari'];
    if (gp) drawGirl(p, 'travel-safari', gp, u, girlPose('step-freeze', def, gp, u, 'front'), 'scared', openT(850), 850);
    if (s.visible) paintSnake(p, c, s.build, {...s.place, seed: 71000, sun: SUN_F});
    s.ripples.forEach((r, i) => wStroke(p, c, 71500 + i, wCircle(s.rippleAt, r, 32), i % 2 ? '#3a3a2a' : '#d8c79a', 1.2 - 0.3 * i));
    paintPaddyFront(p, c);
  };
  return <AbsoluteFill><PaintedStack paper={PADDY.dirt} back={pass} clock={g} guides={false} /><Label shot={shot} L={L} g={g} note="girl held in step-freeze (her move is the Editor's)" /></AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------ B2 gate-leaf check (village set)
const GATE_CAMS: {shot: string; L: number; g: number; c: YCam}[] = [
  {shot: 'B03-SH02', L: 0, g: 560, c: cam([0.3, 0.6, -0.5], 190, 2.85, 0.55, 1100, 880)},
  {shot: 'B03-SH02', L: 53, g: 613, c: cam([0.3, 0.6, -0.5], 182, 2.4, 0.55, 1100, 880)},
  {shot: 'B03-SH03', L: 0, g: 614, c: cam([0.35, 0.85, -0.2], 145, 1.6, 0.85, 1100, 760)},
  {shot: 'B03-SH03', L: 140, g: 754, c: cam([0.35, 0.85, -0.2], 135, 1.4, 0.85, 1100, 760)},
];
/** frame i (0-3): the four camera ends at the adopted 110 deg leaf (user, 16 Nov 2026); frame 4 + i: the same at the old LF02 70 deg (comparison only). */
const GateCard = () => {
  const f = useCurrentFrame(), k = GATE_CAMS[f % 4], open = f >= 4 ? 70 : 110;
  const pass: Pass = (p) => { paintVillageBack(p, k.c, {leafOpen: open}); paintVillageFront(p, k.c); };
  return <AbsoluteFill><PaintedStack paper={VILLAGE.yard} back={pass} clock={k.g} guides={false} /><Label shot={k.shot} L={k.L} g={k.g} note={`gate leaf ${open} deg, set only (no cast)`} /></AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------ B2 dog lick (new: lick)
const LickCard = () => {
  const L = useCurrentFrame(), lk = DOG18_LICK(L), def = ANIMALS['dog-thai'];
  const pass: Pass = (p: Painter) => {
    drawDog18(p, 903, def, [300, 1000], 1150, {view: 'right', state: 'stand', wag: 0.8, lick: lk}, (815 + L) / 30);
    drawDog18(p, 903, def, [540, 1700], 900, {view: 'front', state: 'stand', wag: 0.8, lick: lk}, (815 + L) / 30);
  };
  return <AbsoluteFill><PaintedStack paper="#efe6d6" back={pass} clock={815 + L} guides={false} /><Label shot="B04-SH01" L={L} g={815 + L} note={`new: lick ${lk.toFixed(2)} (profile, front)`} /></AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------ B3-B5 FPOV post
const photo = staticFile('edu18/post-photo-B02-SH01-L29.png');
type FpovShot = {start: number; dur: number; quad: (L: number) => Quad; shares: (L: number) => number; zoom?: (L: number) => number; rise?: (L: number) => number; paper: string};
const FPOV_SHOTS: Record<string, FpovShot> = {
  'B02-SH02': {start: 333, dur: 56, quad: (L) => fpovScreenQuad(k01(L, 0, 56)), shares: (L) => (L < 14 ? 0 : shareAt(SHARE_STEPS_B02, (L - 14) / 30, 40 / 30)), rise: (L) => k01(L, 4, 10, outCubic), paper: '#cdb894'},
  'B06-SH02': {start: 1432, dur: 69, quad: (L) => fpovScreenQuad(k01(L, 0, 69)), shares: (L) => (L < 14 ? SHARE_STEPS_B06[0] : shareAt(SHARE_STEPS_B06, (L - 14) / 30, 55 / 30)), paper: '#3a2c26'},
  'B06-SH03': {start: 1501, dur: 86, quad: (L) => fpovPushTo500(k01(L, 0, 16, outCubic), 1 + 0.03 * k01(L, 16, 86, (x) => x)), shares: () => SHARE_STEPS_B06[SHARE_STEPS_B06.length - 1], paper: '#3a2c26'},
};
const FpovCard = ({shot}: {shot: string}) => {
  const L = useCurrentFrame(), s = FPOV_SHOTS[shot], q = s.quad(L), g = s.start + L;
  const pass: Pass = (p) => { paintFpovPhone(p, q); };
  const b = line500Box(q);
  return (
    <AbsoluteFill>
      <PaintedStack paper={s.paper} back={pass} clock={g} guides={false} overlay={<FpovPost quad={q} shares={s.shares(L)} photo={photo} zoom={s.zoom?.(L)} rise={s.rise?.(L)} />} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,80,80,0.7)', borderBottom: '2px dashed rgba(255,80,80,0.7)'}} />
      <Label shot={shot} L={L} g={g} note={`screen ${Math.round(q[3][1] - q[0][1])} px tall, bottom ${Math.round(q[3][1])}, 500 line x ${Math.round(b.x0)}-${Math.round(b.x1)} y ${Math.round(b.y0)}-${Math.round(b.y1)}, ${quadScale(q).toFixed(2)} px/u`} />
    </AbsoluteFill>
  );
};
/** B3 zoom state: the B06-SH05 phone screen (91 px wide, sheet SD11) at zoom 1, drawn at its real size (left) and 7x (right), and zoom 0.5. */
const ZoomCard = () => {
  const w = 91, h = (w * SCREEN_H) / SCREEN_W, vb = postViewBox(1);
  return (
    <AbsoluteFill style={{background: '#3a2c26'}}>
      <div style={{position: 'absolute', left: 60, top: 300}}><PostScreen shares={59600} width={w} height={h} zoom={1} /></div>
      <div style={{position: 'absolute', left: 300, top: 260}}><PostScreen shares={59600} width={w * 7} height={h * 7} zoom={1} /></div>
      <div style={{position: 'absolute', left: 40, top: 1680, width: 1000, color: '#f4efe6', font: '500 26px/34px sans-serif'}}>
        {`zoom 1 view box x ${vb.x.toFixed(0)} y ${vb.y.toFixed(0)} w ${vb.w.toFixed(0)} h ${vb.h.toFixed(0)}; 500 line ${(376 / vb.w * 100).toFixed(0)} % of the screen width; at 91 px wide the 500 glyphs are about ${(91 / vb.w * 86 * 0.72).toFixed(0)} px tall`}
      </div>
      <Label shot="B06-SH05" L={0} g={1658} note="PostScreen zoom state (B3)" />
    </AbsoluteFill>
  );
};
/** B3 probe: the 500 line's bbox in screen units (getBBox in Chrome), printed on the card; the numbers go into Post.tsx POST_500_BOX. */
const Probe500 = () => {
  const ref = useRef<HTMLDivElement>(null), [box, setBox] = useState('measuring'), [h] = useState(() => delayRender('post-500 bbox'));
  useLayoutEffect(() => {
    const t = ref.current?.querySelector('[data-id="post-500"]') as SVGTSpanElement | null;
    if (!t) { continueRender(h); return; }
    const go = () => { const b = (t as unknown as SVGGraphicsElement).getBBox(); setBox(`x ${b.x.toFixed(1)} y ${b.y.toFixed(1)} w ${b.width.toFixed(1)} h ${b.height.toFixed(1)}`); continueRender(h); };
    void document.fonts.ready.then(() => setTimeout(go, 200));
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#ddd'}}>
      <div ref={ref} style={{position: 'absolute', left: 0, top: 0}}><PostScreen shares={1200} width={SCREEN_W * 0.4} height={SCREEN_H * 0.4} /></div>
      <div style={{position: 'absolute', left: 520, top: 200, width: 540, font: '600 34px/44px monospace', color: '#111'}}>{`POST_500_BOX ${box}`}</div>
    </AbsoluteFill>
  );
};

export type W5Card = {id: string; C: () => ReactNode; dur: number};
export const W5_CARDS: W5Card[] = [
  ...Object.keys(HIPPO_STAGE).map((s) => ({id: `EDU18-W5-${s}`, C: () => <HippoCard shot={s} />, dur: {'B01-SH01': 127, 'B01-SH02': 36, 'B01-SH03': 32, 'B01-SH05': 56, 'B02-SH01': 36, 'B02-SH03': 119}[s] ?? 1})),
  ...Object.keys(SNAKE_STAGE).map((s) => ({id: `EDU18-W5-${s}`, C: () => <SnakeCard shot={s} />, dur: {'B04-SH02': 41, 'B04-SH03': 88, 'B04-SH04': 90}[s] ?? 1})),
  {id: 'EDU18-W5-GATE', C: GateCard, dur: 8},
  {id: 'EDU18-W5-LICK', C: LickCard, dur: 11},
  ...Object.keys(FPOV_SHOTS).map((s) => ({id: `EDU18-W5-${s}`, C: () => <FpovCard shot={s} />, dur: FPOV_SHOTS[s].dur})),
  {id: 'EDU18-W5-ZOOM', C: ZoomCard, dur: 1},
  {id: 'EDU18-W5-POST500', C: Probe500, dur: 1},
];
