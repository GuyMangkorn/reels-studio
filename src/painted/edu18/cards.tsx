// EDU-EP18-SHORT comp cards (model sheets) for the user's design check before any look frame (user, 15 Nov 2026; Boss pre-W3 pass B):
//   EDU18-GIRL-CARD   the girl (kit woman-long) in the four travel outfits: views, height ruler in heads, the brief's faces
//   EDU18-GIRL-POSES  the six N6 poses (paddle-sit in the canoe, front and profile; selfie-peace, swat-neck, frozen-hand, step-freeze,
//                     sit-up-phone) beside the kit poses the brief uses (P10, P07, P37)
//   EDU18-PROPS-CARD  dugout canoe (heading 90 and 135, cut at the waterline), the 1.4 m paddle, the phone body with the post (1.2K, 58K)
// Own entry, outside src/Root.tsx (README videos-and-parallel-work):
//   printf 'EDU18-GIRL-CARD 0 out/edu18-cards/EDU18-GIRL-CARD.png\n' | node scripts/stills.mjs src/painted/edu18/cards.tsx
import {loadFont} from '@remotion/fonts';
import {createElement, Fragment, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Composition, registerRoot, staticFile} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {CANOE, PADDLE, paddleGrips, paintCanoeBack, paintCanoeFront, paintPaddle, seatGround, type CanoeOpts} from '../kit/canoe';
import {H, type FigPose} from '../kit/cast';
import {hardFill, inkLine, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {blinking, paintHeadFront} from '../kit/head';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {poseArms, poseFor} from '../kit/poses';
import {WARDROBE_TRAVEL_INFO, type TravelOutfitId} from '../kit/wardrobe-travel';
import {camPoint, type YCam} from '../kit/ycam';
import {drawGirl, GIRL, GIRL_BASE, GIRL_POSES, girlPose, paddleSitArms, sitHipV, type GirlPoseId} from './girl';
import {paintPhoneBody, PostScreen, SCREEN_H, SCREEN_W} from './Post';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const h = createElement;
const PAPER = '#efe6d2';
const label: CSSProperties = {position: 'absolute', fontFamily: 'Noto Sans Thai, sans-serif', color: '#2b211c', lineHeight: 1.2};
const Text = ({x, y, w, size, weight = 400, color, align = 'left', children}: {x: number; y: number; w: number; size: number; weight?: number; color?: string; align?: 'left' | 'center'; children: ReactNode}) => (
  <div style={{...label, left: x, top: y, width: w, fontSize: size, fontWeight: weight, color: color ?? '#2b211c', textAlign: align}}>{children}</div>
);
/** A plate time at which a figure drawn with `seed` has its eyes open (drawFigure blinks on seed + 1, as people-sheet.tsx). */
const openT = (seed: number) => [0.4, 0.9, 1.4, 1.9, 2.4].find((t) => !blinking(t, seed + 1)) ?? 0.4;
const hLine = (p: Painter, id: number, x0: number, x1: number, y: number, color = '#b9ad9d', weight = 0.7) => inkLine(p, id, [[x0, y], [x1, y]], {closed: false, weight, curve: 0, color, still: true});

// ------------------------------------------------------------------------------------------------ EDU18-GIRL-CARD
const CARD_W = 2400, CARD_H = 1800;
const A_GROUND = 760, B_GROUND = 1400, CARD_UNIT = 330;
type Cell = {outfit: TravelOutfitId; view: FigPose['view']; quarter?: 'left' | 'right'; label: string};
const ROW_A: Cell[] = [
  {outfit: 'travel-safari', view: 'front', label: 'front · P01'},
  {outfit: 'travel-safari', view: 'front', quarter: 'left', label: 'front 3/4 (quarter left)'},
  {outfit: 'travel-safari', view: 'right', label: 'right'},
  {outfit: 'travel-safari', view: 'left', label: 'left'},
  {outfit: 'travel-safari', view: 'back', label: 'back'},
];
const ROW_B: Cell[] = [
  {outfit: 'life-vest', view: 'front', label: 'life-vest · front'},
  {outfit: 'life-vest', view: 'right', label: 'life-vest · right'},
  {outfit: 'travel-backpack', view: 'front', label: 'backpack · front'},
  {outfit: 'travel-backpack', view: 'right', label: 'backpack · right'},
  {outfit: 'travel-backpack', view: 'back', label: 'backpack · back'},
  {outfit: 'home-lounge-night', view: 'front', label: 'night · front'},
  {outfit: 'home-lounge-night', view: 'right', label: 'night · right'},
];
const rowX = (n: number, i: number, x0 = 200, x1 = CARD_W - 40) => x0 + ((x1 - x0) / n) * (i + 0.5);
/** The brief's faces for the girl (VD02 face list, in story order, plus neutral). */
const CARD_FACES: ExpressionId[] = ['surprised', 'smug', 'shock', 'relieved', 'happy', 'scared', 'sleepy', 'suspicious', 'worried', 'neutral'];

const cellPose = (c: Cell, g: Pt, unit: number): Omit<FigPose, 'face'> => {
  const def = GIRL[c.outfit];
  if (c.view === 'front' || c.view === 'back') return {view: c.view, ...(c.quarter ? {quarter: c.quarter} : {}), ...poseArms('P01', def, g, unit)};
  return poseFor('P01', def, g, unit, c.view);
};

const GirlCard = () => (
  <AbsoluteFill>
    <BrushCanvas paper={PAPER} paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      for (const [row, ground] of [[ROW_A, A_GROUND], [ROW_B, B_GROUND]] as const) {
        hLine(p, 9000 + ground, 40, CARD_W - 40, ground + 6, '#2b211c', 0.8);
        // Head ruler: 0.425 m steps (the 4-head rig) and the 1.64 m height.
        for (let k = 1; k <= 4; k++) hLine(p, 9010 + ground + k, 60, 175, ground - k * H * CARD_UNIT);
        hLine(p, 9020 + ground, 60, CARD_W - 40, ground - GIRL_BASE.height * CARD_UNIT, '#9a8f84', 0.5);
        row.forEach((c, i) => {
          const g: Pt = [rowX(row.length, i), ground], seed = 820 + i * 3 + (ground === B_GROUND ? 40 : 0);
          drawGirl(p, c.outfit, g, CARD_UNIT, cellPose(c, g, CARD_UNIT), 'neutral', openT(seed), seed);
        });
      }
      CARD_FACES.forEach((f, i) => {
        const cx = rowX(CARD_FACES.length, i, 60), s = 600 + i;
        paintHeadFront(p, s, cx, 1590, 52, EXPRESSIONS[f], GIRL_BASE.head, openT(s - 1));
      });
    }} />
    <Text x={36} y={18} w={2300} size={42} weight={700}>EDU18-GIRL-CARD · GIRL = kit woman-long (unchanged head, 1.64 m, seed 820) + EP18 travel outfits</Text>
    <Text x={36} y={72} w={2330} size={20} color="#4a3f38">Casting (brief VD02): woman-long + new: travel-safari (Africa) · + new: life-vest (canoe, B01) · + backpack (gate, B03) · home-lounge-night = home-lounge with the cardigan off (bed, B05-B06). Rig 4-head: head 0.425 m (rules at 1-4 heads), 1.64 m = 3.86 heads. {CARD_UNIT} px/m. Cross-body pouch, vest chest strap and pack straps are painted over the rig (paintTravelGear). Comp card for the user's design check: not approved.</Text>
    {[1, 2, 3, 4].map((k) => <Text key={k} x={8} y={A_GROUND - k * H * CARD_UNIT - 12} w={60} size={15} color="#7a6f64">{`${k} H`}</Text>)}
    <Text x={CARD_W - 110} y={A_GROUND - GIRL_BASE.height * CARD_UNIT - 22} w={100} size={15} color="#7a6f64">1.64 m</Text>
    {ROW_A.map((c, i) => <Text key={c.label} x={rowX(ROW_A.length, i) - 200} y={A_GROUND + 14} w={400} size={19} align="center">{c.label}</Text>)}
    {ROW_B.map((c, i) => <Text key={c.label} x={rowX(ROW_B.length, i) - 160} y={B_GROUND + 14} w={320} size={18} align="center">{c.label}</Text>)}
    <Text x={36} y={1470} w={600} size={22} weight={700}>faces (brief VD02 order)</Text>
    <Text x={36} y={1722} w={2330} size={14} color="#4a3f38">{(['travel-safari', 'life-vest', 'travel-backpack', 'home-lounge-night'] as TravelOutfitId[]).map((id) => `${id}: ${WARDROBE_TRAVEL_INFO[id].description}`).join('  |  ')}</Text>
    {CARD_FACES.map((f, i) => <Text key={f} x={rowX(CARD_FACES.length, i, 60) - 110} y={1690} w={220} size={19} align="center">{f}</Text>)}
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ EDU18-GIRL-POSES
const POSE_W = 2400, POSE_H = 2680;
const WATER = {near: '#6b6a5e', mid: '#8a7f6a', glint: '#e8c08e'};

/** One canoe strip: water from the horizon down, the hull, the paddler (life vest) in `paddle-sit`, the near-side paddle. */
const paintCanoeStrip = (p: Painter, cam: YCam, o: CanoeOpts, view: FigPose['view'], y0: number, y1: number, phase: number, face: ExpressionId, seed: number, x0 = 0, x1 = POSE_W) => {
  washAt(p, seed, WATER.mid, 255, [[x0, cam.hy], [x1, cam.hy], [x1, (cam.hy + y1) / 2], [x0, (cam.hy + y1) / 2]], 0.1, 0.15);
  washAt(p, seed + 1, WATER.near, 255, [[x0, (cam.hy + y1) / 2 - 4], [x1, (cam.hy + y1) / 2 - 4], [x1, y1], [x0, y1]], 0.1, 0.15);
  void y0;
  const anc = paintCanoeBack(p, cam, {...o, seed: seed + 10});
  const def = GIRL['life-vest'];
  const sg = seatGround(cam, anc.seat, sitHipV(def, view));
  const grips = paddleGrips(o, anc.near, phase);
  if (sg) {
    const top = camPoint(cam, grips.top), lower = camPoint(cam, grips.lower);
    const body = girlPose('paddle-sit', def, sg.g, sg.unit, view);
    const arms = top && lower ? paddleSitArms(def, sg.g, sg.unit, view, {top, lower}, anc.near) : {};
    drawGirl(p, 'life-vest', sg.g, sg.unit, {...body, ...arms}, face, openT(seed + 40), seed + 40);
  }
  paintCanoeFront(p, cam, {...o, seed: seed + 10});
  paintPaddle(p, cam, grips, {waterY: o.at[1], seed: seed + 60, widthDir: anc.fwd});
};

const STAND_IDS: {id: GirlPoseId | 'P10' | 'P07'; outfit: TravelOutfitId; face: ExpressionId; peace?: boolean; label: string}[] = [
  {id: 'selfie-peace', outfit: 'travel-safari', face: 'happy', peace: true, label: 'new: selfie-peace · happy'},
  {id: 'swat-neck', outfit: 'travel-safari', face: 'smug', label: 'new: swat-neck · smug'},
  {id: 'frozen-hand', outfit: 'travel-backpack', face: 'scared', label: 'new: frozen-hand · scared'},
  {id: 'step-freeze', outfit: 'travel-safari', face: 'scared', label: 'new: step-freeze · scared'},
  {id: 'P10', outfit: 'travel-safari', face: 'happy', label: 'kit P10 hold_phone_chest · happy'},
  {id: 'P07', outfit: 'travel-backpack', face: 'happy', label: 'kit P07 wave · happy'},
];
const R1 = {top: 110, bottom: 820}, R2 = {top: 850, bottom: 1460}, R3 = {ground: 2070}, R4 = {ground: 2560};
const STAND_UNIT = 300;

const camRow1: YCam = {x: 0.9, y: 0.8, z: 5.0, yaw: 0, f: 1500, hy: 330, cx: 660};
const canoeRow1: CanoeOpts = {at: [0.5, 0, 0], heading: 135};
const camRow2: YCam = {x: 0, y: 0.9, z: 4.2, yaw: 0, f: 1250, hy: 1010, cx: 660};
const canoeRow2: CanoeOpts = {at: [0, 0, 0], heading: 90};

const GirlPoses = () => (
  <AbsoluteFill>
    <BrushCanvas paper={PAPER} paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      paintCanoeStrip(p, camRow1, canoeRow1, 'front', R1.top, R1.bottom, 0.3, 'neutral', 7000);
      paintCanoeStrip(p, camRow2, canoeRow2, 'right', R2.top, R2.bottom, 0.3, 'smug', 7200);
      hardFill(p, 7390, PAPER, [[0, R1.bottom], [POSE_W, R1.bottom], [POSE_W, R2.top + 20], [0, R2.top + 20]]);
      hardFill(p, 7391, PAPER, [[0, R2.bottom], [POSE_W, R2.bottom], [POSE_W, R2.bottom + 60], [0, R2.bottom + 60]]);
      // Row 3: standing poses.
      hLine(p, 7400, 40, POSE_W - 40, R3.ground + 6, '#2b211c', 0.8);
      STAND_IDS.forEach((s, i) => {
        const g: Pt = [rowX(STAND_IDS.length, i, 40), R3.ground], def = GIRL[s.outfit], seed = 830 + i * 3;
        const pose: Omit<FigPose, 'face'> = s.id === 'P10' || s.id === 'P07' ? {view: 'front', ...poseArms(s.id, def, g, STAND_UNIT)} : girlPose(s.id, def, g, STAND_UNIT, 'front');
        drawGirl(p, s.outfit, g, STAND_UNIT, pose, s.face, openT(seed), seed, {peace: s.peace});
      });
      // Row 4: bed poses. A plain bed block and wall line for scale (bed top 0.45 m).
      const bedTop = R4.ground - 0.45 * STAND_UNIT;
      hardFill(p, 7500, '#e2d6cc', [[150, bedTop], [1250, bedTop], [1250, R4.ground], [150, R4.ground]]);
      hardFill(p, 7501, '#6a8aa8', [[150, bedTop + 4], [1250, bedTop + 4], [1250, bedTop + 40], [150, bedTop + 40]]);
      hLine(p, 7502, 40, POSE_W - 40, R4.ground + 6, '#2b211c', 0.8);
      const sitG: Pt = [330, bedTop];
      drawGirl(p, 'home-lounge-night', sitG, STAND_UNIT, girlPose('sit-up-phone', GIRL['home-lounge-night'], sitG, STAND_UNIT, 'front'), 'worried', openT(870), 870);
      const lieG: Pt = [1170, bedTop];
      const nightDef = GIRL['home-lounge-night'];
      drawGirl(p, 'home-lounge-night', lieG, STAND_UNIT, poseFor('P37', nightDef, lieG, STAND_UNIT, 'front'), 'sleepy', openT(873), 873);
    }} />
    <Text x={36} y={14} w={2300} size={40} weight={700}>EDU18-GIRL-POSES · brief N6 new poses (pose strip) + the kit poses the brief uses</Text>
    <Text x={36} y={62} w={2330} size={19} color="#4a3f38">Arms hang from the posed shoulders (girl.ts GIRL_POSES, episode code until kit intake). Row 1: paddle-sit front (squared to the lens, canoe heading 135, B01-SH01). Row 2: paddle-sit right profile (heading 90, B01-SH02). Hands on the paddle grips (paddleGrips), elbows by IK. Not approved.</Text>
    <Text x={36} y={R1.bottom - 40} w={1200} size={20} weight={700}>new: paddle-sit · front · neutral (life-vest)</Text>
    <Text x={36} y={R2.bottom - 40} w={1200} size={20} weight={700}>new: paddle-sit · right · smug (life-vest)</Text>
    {STAND_IDS.map((s, i) => <Text key={s.label} x={rowX(STAND_IDS.length, i, 40) - 190} y={R3.ground + 14} w={380} size={18} align="center">{s.label}</Text>)}
    {STAND_IDS.map((s, i) => s.id.startsWith('P') ? null : <Text key={`${s.label}-d`} x={rowX(STAND_IDS.length, i, 40) - 190} y={R3.ground + 42} w={380} size={13} color="#4a3f38" align="center">{`${GIRL_POSES[s.id as GirlPoseId].shots}`}</Text>)}
    <Text x={180} y={R4.ground + 14} w={300} size={18} align="center">new: sit-up-phone · worried</Text>
    <Text x={760} y={R4.ground + 14} w={360} size={18} align="center">kit P37 lie_on_side · sleepy</Text>
    <Text x={1250} y={R4.ground - 330} w={1100} size={17} color="#4a3f38">{`Pose notes: ${(['selfie-peace', 'swat-neck', 'frozen-hand', 'step-freeze', 'sit-up-phone'] as GirlPoseId[]).map((id) => `${id}: ${GIRL_POSES[id].description}`).join(' | ')}`}</Text>
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ EDU18-PROPS-CARD
const PROPS_W = 2400, PROPS_H = 1700;
const camP1: YCam = {x: 0, y: 1.1, z: 5.4, yaw: 0, f: 1150, hy: 300, cx: 210};
const camP2: YCam = {x: 0.6, y: 1.1, z: 5.4, yaw: 0, f: 1150, hy: 800, cx: 210};
const camPaddle: YCam = {x: 0, y: 0, z: 2.2, yaw: 0, f: 1100, hy: 1450, cx: 210};
const PHONE_U = 4600; // px per metre for the phone (0.072 x 0.150 m -> 331 x 690 px)
const phoneQuad = (x: number, y: number): [Pt, Pt, Pt, Pt] => [[x, y], [x + 0.072 * PHONE_U, y], [x + 0.072 * PHONE_U, y + 0.15 * PHONE_U], [x, y + 0.15 * PHONE_U]];
const PHONES = [{x: 1580, y: 760, shares: 1200, label: 'B02: share counter ticks 0 -> 1.2K'}, {x: 1990, y: 760, shares: 58000, label: 'B06: 58K and still ticking'}];
/** Screen rect inside the painted bezel (same math as paintPhoneBody's 0.05 / 0.024 inset). */
const screenRect = (x: number, y: number) => {
  const w = 0.072 * PHONE_U, hgt = 0.15 * PHONE_U;
  return {x: x + 0.05 * w, y: y + 0.024 * hgt, w: 0.9 * w, h: 0.952 * hgt};
};

const paintWaterStrip = (p: Painter, cam: YCam, y1: number, seed: number) => {
  washAt(p, seed, WATER.mid, 255, [[0, cam.hy], [1500, cam.hy], [1500, y1], [0, y1]], 0.1, 0.15);
};

const PropsCard = () => (
  <AbsoluteFill>
    <BrushCanvas paper={PAPER} paint={({brush}) => {
      const p = makePainter(brush, {t: 0, frame: 0});
      paintWaterStrip(p, camP1, 640, 7600);
      const o1: CanoeOpts = {at: [0, 0, 0], heading: 90};
      paintCanoeBack(p, camP1, {...o1, seed: 7610});
      paintCanoeFront(p, camP1, {...o1, seed: 7610});
      paintWaterStrip(p, camP2, 1190, 7700);
      const o2: CanoeOpts = {at: [0, 0, 0], heading: 135};
      paintCanoeBack(p, camP2, {...o2, seed: 7710});
      paintCanoeFront(p, camP2, {...o2, seed: 7710});
      // Flat paddle at true length (dry), laid along x.
      paintPaddle(p, camPaddle, {top: [-0.7, 0, 0], lower: [-0.3, 0, 0]}, {waterY: -10, seed: 7800, widthDir: [0, 1, 0]});
      hLine(p, 7810, 540 + 210 - 0.7 * 500, 540 + 210 + 0.7 * 500, 1560, '#7a6f64');
      PHONES.forEach((ph, i) => paintPhoneBody(p, phoneQuad(ph.x, ph.y), 7900 + i * 5));
    }} />
    {PHONES.map((ph) => {
      const r = screenRect(ph.x, ph.y);
      return <div key={ph.label} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', borderRadius: 10, background: '#ffffff'}}><PostScreen shares={ph.shares} width={r.w} height={r.h} /></div>;
    })}
    <Text x={36} y={14} w={2300} size={40} weight={700}>EDU18-PROPS-CARD · dugout canoe + paddle (N2, kit/canoe.ts) · phone + post (N4, edu18/Post.tsx)</Text>
    <Text x={36} y={62} w={1450} size={19} color="#4a3f38">{`Canoe ${CANOE.length} x ${CANOE.beam} m, gunwale ${CANOE.gunwale} m above the water, draft ${CANOE.draft} m, cut at the waterline (only the hull above y 0 is painted; glint line at the cut). Wood ${CANOE.wood}, light ${CANOE.light}, inside ${CANOE.inside}. Camera 5.4 m, eye 1.1 m, f 1150.`}</Text>
    <Text x={36} y={650} w={1400} size={20} weight={700}>heading 90 (profile, B01-SH02)</Text>
    <Text x={36} y={1200} w={1400} size={20} weight={700}>heading 135 (three-quarter, bow toward the lens, B01-SH01)</Text>
    <Text x={36} y={1580} w={1400} size={20} weight={700}>{`paddle ${PADDLE.length} m (blade ${PADDLE.blade} x ${PADDLE.bladeW} m, T-grip), ${PADDLE.color}`}</Text>
    <Text x={1560} y={130} w={820} size={20} color="#4a3f38">{`Phone 0.150 x 0.072 m (painted body) + PHONE-SVG post in screen space P (${SCREEN_W} x ${SCREEN_H}). Fictional handle, caption verbatim (500 starts line 2), share counter. No clock, battery %, like or comment counts, brand or logo (VD12). Photo slot: placeholder until the B02-SH01 freeze still exists.`}</Text>
    {PHONES.map((ph) => <Text key={`${ph.label}-l`} x={ph.x - 40} y={ph.y + 0.15 * PHONE_U + 14} w={0.072 * PHONE_U + 80} size={18} align="center">{ph.label}</Text>)}
  </AbsoluteFill>
);

registerRoot(() => h(Fragment, null,
  h(Composition, {id: 'EDU18-GIRL-CARD', component: GirlCard, width: CARD_W, height: CARD_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'EDU18-GIRL-POSES', component: GirlPoses, width: POSE_W, height: POSE_H, fps: 30, durationInFrames: 30}),
  h(Composition, {id: 'EDU18-PROPS-CARD', component: PropsCard, width: PROPS_W, height: PROPS_H, fps: 30, durationInFrames: 30}),
));
