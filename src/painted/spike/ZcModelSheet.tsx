import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type Brush, type PaintContext} from '../BrushCanvas';
import {paintPovHand, ring, ZC_HAND} from '../hands';
import {makePainter, type Pt} from '../painter';
import {INFECTED, INFECTED_LEAN, INFECTED_SCALE, INFECTED_STOOP, YOU, YOU_DAY3, ZC_FACES, paintDay3Face, paintDay3Shirt, paintInfectedSide, paintRageFront} from '../zcpaint/cast';
import {paintBodyBack, paintSeatedFloor, paintSeatedSofa} from '../zcpaint/figure';
import {paintBodyFront} from './CastSheet';
import {CHIN, HEAD_SPAN, INK, paintHead} from './FaceSheet';
import {skeleton} from './ProportionSheet';
import {makePaint, paintBodySide, paintHeadSide, rotated} from './SideSheet';

// ZCPAINT model sheet S-P01 (Boss, 30 Oct 2026): calibration and the `zc-you` / `zc-infected` model sheets on the WORLD
// FOG 4-head base (1.70 m, head 0.425 m, 447 px/m at scale 1). Three review pages: A calibration, B standing views and
// faces, C seated poses and POV hands. Spike entry only (zcpaint-model-index.ts); serves no shot.

const H = 190, K = H / HEAD_SPAN, PX_M = 447;
const PAPER = '#efe6d2';
const scaleXY = (brush: Brush, x: number, y: number) => (brush.scale as unknown as (a: number, b: number) => void)(x, y);

/** Run `draw` in a local frame: origin at (gx, gy), `k` scale, `dir` -1 mirrors to face left. */
const place = (ctx: PaintContext, gx: number, gy: number, k: number, dir: 1 | -1, draw: () => void) => {
  ctx.brush.push();
  ctx.brush.translate(gx, gy);
  scaleXY(ctx.brush, dir * k, k);
  draw();
  ctx.brush.pop();
};
const frontHeadY = (ground: number) => ground - (4 - 1) * H - CHIN * K;
const guide = (ctx: PaintContext, id: number, x0: number, x1: number, y: number, color = '#9fb3c4', w = 0.8) => {
  ctx.still(id);
  ctx.brush.set('HB', color, w);
  ctx.brush.line(x0, y, x1, y);
};
const box = (p: ReturnType<typeof makePaint>, color: string, x0: number, y0: number, x1: number, y1: number, passes = 4) => p.part(color, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], true, passes);

// ------------------------------------------------------------------ page A: calibration

const A_GROUND1 = 960, A_GROUND2 = 1800;

const paintA = (ctx: PaintContext) => {
  for (let m = 0; m <= 2; m += 0.5) guide(ctx, 100 + m * 10, 20, 1060, A_GROUND1 - m * PX_M, m % 1 === 0 ? '#7f93a3' : '#b3c3cf', m % 1 === 0 ? 1.1 : 0.7);
  guide(ctx, 140, 20, 1060, A_GROUND2, INK, 1.4);
  for (let m = 0; m <= 1.5; m += 0.5) guide(ctx, 150 + m * 10, 20, 1060, A_GROUND2 - m * PX_M, m % 1 === 0 ? '#7f93a3' : '#b3c3cf', m % 1 === 0 ? 1.1 : 0.7);
  guide(ctx, 141, 20, 1060, A_GROUND1, INK, 1.4);
  // Row 1: zc-you front, profile; zc-infected profile (silhouette-lit), door 0.90 x 2.10.
  place(ctx, 120, A_GROUND1, 1, 1, () => paintBodyFront(ctx, YOU, 0, 0, 0));
  place(ctx, 300, A_GROUND1, 1, 1, () => paintBodySide(makePaint(ctx, 21000), YOU, 0, 0));
  place(ctx, 470, A_GROUND1, INFECTED_SCALE, 1, () => {
    const {head, tilt} = paintBodySide(makePaint(ctx, 22000), INFECTED, 0, 0, undefined, {stoop: INFECTED_LEAN});
    paintInfectedSide(rotated(makePaint(ctx, 22500), [head.x, head.y], tilt), head.x, head.y, head.K, true);
  });
  const door = makePaint(ctx, 23000);
  const dx = 620, dw = 0.9 * PX_M, dh = 2.1 * PX_M;
  box(door, '#c4b392', dx, A_GROUND1 - dh, dx + dw, A_GROUND1);
  box(door, '#d6c9ad', dx + 0.1 * PX_M, A_GROUND1 - dh + 0.15 * PX_M, dx + dw - 0.1 * PX_M, A_GROUND1 - dh + 0.9 * PX_M, 3);
  door.part('#6f665a', ring(dx + dw - 0.08 * PX_M, A_GROUND1 - 1.05 * PX_M, 14, 14, 14), true, 5); // thumb-turn
  door.part('#4f483f', [[dx + dw - 0.45 * PX_M, A_GROUND1 - 1.0 * PX_M], [dx + dw - 0.2 * PX_M, A_GROUND1 - 1.0 * PX_M], [dx + dw - 0.2 * PX_M, A_GROUND1 - 0.97 * PX_M], [dx + dw - 0.45 * PX_M, A_GROUND1 - 0.97 * PX_M]], true, 4); // lever
  // Row 2: cabinet 0.8 x 1.2, fridge 0.6 x 1.7, bucket O0.28 x 0.30, PET 0.09 x 0.33, stove case 0.36 x 0.12.
  const props = makePaint(ctx, 24000);
  box(props, '#cdb48c', 30, A_GROUND2 - 1.2 * PX_M, 30 + 0.8 * PX_M, A_GROUND2);
  props.ink([[30 + 0.4 * PX_M, A_GROUND2 - 1.1 * PX_M], [30 + 0.4 * PX_M, A_GROUND2 - 0.05 * PX_M]], 1.0, 0);
  box(props, '#e6e3da', 410, A_GROUND2 - 1.7 * PX_M, 410 + 0.6 * PX_M, A_GROUND2);
  props.ink([[410, A_GROUND2 - 1.7 * PX_M + 0.55 * PX_M], [410 + 0.6 * PX_M, A_GROUND2 - 1.7 * PX_M + 0.55 * PX_M]], 1.0, 0);
  const bx = 700, bw = 0.28 * PX_M, bh = 0.3 * PX_M;
  props.part('#5f87a8', [[bx, A_GROUND2 - bh], [bx + bw, A_GROUND2 - bh], [bx + bw * 0.92, A_GROUND2], [bx + bw * 0.08, A_GROUND2]], true, 4);
  box(props, '#7aa0be', bx - 3, A_GROUND2 - bh - 12, bx + bw + 3, A_GROUND2 - bh, 3);
  box(props, '#d8e6ee', 845, A_GROUND2 - 0.33 * PX_M, 845 + 0.09 * PX_M, A_GROUND2, 3);
  box(props, '#3a5a8a', 845, A_GROUND2 - 0.33 * PX_M - 8, 845 + 0.09 * PX_M, A_GROUND2 - 0.33 * PX_M, 3);
  box(props, '#5c5f63', 900, A_GROUND2 - 0.12 * PX_M, 900 + 0.36 * PX_M, A_GROUND2);
};

// ------------------------------------------------------------------ page B: standing views, infected, faces

const B_K = 0.62; // sheet scale of the standing rows
const B_ROW1 = 590, B_ROW2 = 1130;
const B_COLS = [100, 270, 450, 640, 810, 990];
const B_COLS2 = [90, 235, 380, 525, 700, 985];
const FACE_NAMES = ['neutral', 'startle', 'fear', 'focused', 'listening', 'frozen', 'tired', 'rage'] as const;
const B_FACE_Y1 = 1410, B_FACE_Y2 = 1600, B_FACE_K = 46, B_FACE_DX = 135;
const faceX = (i: number) => 70 + i * B_FACE_DX;

const paintB = (ctx: PaintContext) => {
  guide(ctx, 200, 20, 1060, B_ROW1, INK, 1.2);
  guide(ctx, 201, 20, 1060, B_ROW2, INK, 1.2);
  // Row 1: zc-you day 1 (front, profile, back) then day 3 (front, profile, back).
  [YOU, YOU_DAY3].forEach((c, d) => {
    const cx0 = d * 3;
    place(ctx, B_COLS[cx0], B_ROW1, B_K, 1, () => {
      paintBodyFront(ctx, c, d * 2, 0, 0, {face: ZC_FACES.neutral});
      if (d) {
        const sk = skeleton(0, 4, 0, H, c.outfit.shoulder);
        paintDay3Face(ctx, makePaint(ctx, 41000), 'front', 0, frontHeadY(0), K);
        paintDay3Shirt(makePaint(ctx, 41500), 0, sk.shoulderY, sk.hipY, H);
      }
    });
    place(ctx, B_COLS[cx0 + 1], B_ROW1, B_K, 1, () => {
      const p = makePaint(ctx, 42000 + d * 1000);
      const {head} = paintBodySide(p, c, 0, 0, undefined, {});
      if (d) paintDay3Face(ctx, p.fork(800), 'side', head.x, head.y, head.K);
    });
    place(ctx, B_COLS[cx0 + 2], B_ROW1, B_K, 1, () => {
      const p = makePaint(ctx, 44000 + d * 1000);
      const r = paintBodyBack(p, c, 0, 0);
      if (d) paintDay3Shirt(p.fork(800), 0, r.shoulderY, r.hipY, H);
    });
  });
  // Row 2: zc-infected rage front, profile lit, profile silhouette (B01), back; zc-you front bucket lift; mirrored profile grip.
  const inf = INFECTED_SCALE * B_K;
  place(ctx, B_COLS2[0], B_ROW2, inf, 1, () => {
    paintBodyFront(ctx, INFECTED, 4, 0, 0, {face: ZC_FACES.rage, stoop: INFECTED_STOOP});
    paintRageFront(ctx, makePaint(ctx, 46000), 0, frontHeadY(0) + 0.17 * H * INFECTED_STOOP, K);
  });
  place(ctx, B_COLS2[1], B_ROW2, inf, 1, () => {
    const {head, tilt} = paintBodySide(makePaint(ctx, 47000), INFECTED, 0, 0, undefined, {stoop: INFECTED_LEAN});
    paintInfectedSide(rotated(makePaint(ctx, 47500), [head.x, head.y], tilt), head.x, head.y, head.K, true);
  });
  place(ctx, B_COLS2[2], B_ROW2, inf, 1, () => {
    const sil = makePaint(ctx, 48000, '#21272a');
    const {head, tilt} = paintBodySide(sil, INFECTED, 0, 0, undefined, {stoop: INFECTED_LEAN});
    paintInfectedSide(rotated(sil.fork(500), [head.x, head.y], tilt), head.x, head.y, head.K, false);
  });
  place(ctx, B_COLS2[3], B_ROW2, inf, 1, () => paintBodyBack(makePaint(ctx, 49000), INFECTED, 0, 0, {stoop: INFECTED_STOOP}));
  // zc-you front bucket lift (B05-SH01): both hands under the rim, bucket at the belly.
  place(ctx, B_COLS2[4], B_ROW2, B_K, 1, () => {
    const sk = skeleton(0, 4, 0, H, YOU.outfit.shoulder);
    const by = sk.shoulderY + 0.62 * H, bw = 0.28 * PX_M, bh = 0.3 * PX_M;
    paintBodyFront(ctx, YOU, 6, 0, 0, {
      face: ZC_FACES.focused,
      lift: {handsX: bw / 2 + 4, handsY: by + 0.45 * bh},
      beforeArms: () => {
        const p = makePaint(ctx, 50000);
        p.part('#5f87a8', [[-bw / 2, by], [bw / 2, by], [bw * 0.46, by + bh], [-bw * 0.46, by + bh]], true, 4);
        p.part('#7aa0be', [[-bw / 2 - 3, by - 12], [bw / 2 + 3, by - 12], [bw / 2 + 3, by], [-bw / 2 - 3, by]], true, 3);
      },
    });
  });
  // Mirrored profile with a grip: hand on the cabinet's side at 0.95 m; cabinet face drawn in local px.
  place(ctx, B_COLS2[5] + 20, B_ROW2, B_K, -1, () => {
    const gripLocal: Pt = [0.62 * H, -0.95 * PX_M];
    const cab = makePaint(ctx, 51000);
    cab.part('#cdb48c', [[0.62 * H, -1.2 * PX_M], [0.62 * H + 0.4 * PX_M, -1.2 * PX_M], [0.62 * H + 0.4 * PX_M, 0], [0.62 * H, 0]], true, 4);
    paintBodySide(makePaint(ctx, 52000), YOU, 0, 0, gripLocal);
  });
  // Face controls (front and profile) and the front-head blink switch (MK-ZCP-B1) at one frame.
  FACE_NAMES.forEach((name, i) => {
    const f = ZC_FACES[name];
    paintHead(ctx, 200 + i, faceX(i), B_FACE_Y1, B_FACE_K, f, name === 'rage' ? INFECTED.head : YOU.head, {blink: false});
    paintHeadSide(makePaint(ctx, 53000 + i * 300), faceX(i) - 6, B_FACE_Y2, B_FACE_K, f, name === 'rage' ? INFECTED.head : YOU.head);
  });
  // Blink switch pair: both heads' blink phase forced to 0.5 s; "blink on" shows shut at 0.5-0.63 s, "off" stays open.
  paintHead(ctx, 300, 330, 1810, 52, ZC_FACES.neutral, YOU.head, {blink: true, blinkAt: 0.5});
  paintHead(ctx, 301, 700, 1810, 52, ZC_FACES.neutral, YOU.head, {blink: false, blinkAt: 0.5});
  paintHead(ctx, 302, 900, 1810, 52, ZC_FACES.neutral, YOU.head, {blink: true, blinkAt: 0.5});
};

// ------------------------------------------------------------------ page C: seated poses and POV hands

const C_GROUND = 560, C_GROUND2 = 1090;
const C_K = 0.7;
const POV_Y0 = 1180, POV_CELL_W = 360, POV_CELL_H = 370;
type HandPose = {name: string; side: -1 | 1; curl: number; spread: number; thumb?: [number, number]; press?: number; pinch?: [number, number]; fingerCurl?: [number, number, number, number]; dir?: number; size?: number};
export const POV_POSES: HandPose[] = [
  {name: 'flat press (cabinet top)', side: 1, curl: 0, spread: 0.1, press: 1},
  {name: 'palm slam (left, spread)', side: -1, curl: 0.05, spread: 0.9, thumb: [100, 190], press: 1},
  {name: 'edge grip (cabinet)', side: 1, curl: 0.85, spread: 0.05, thumb: [145, 30]},
  {name: 'thumb-turn pinch (bolt)', side: 1, curl: 1, spread: 0.05, pinch: [195, 165]},
  {name: 'release (bag drops)', side: 1, curl: 0.3, spread: 0.9, thumb: [100, 200]},
  {name: 'on the knee (B09)', side: -1, curl: 0.5, spread: 0.2, thumb: [95, 120], dir: -Math.PI / 2 - 0.25},
];

const sofaBlock = (p: ReturnType<typeof makePaint>) => {
  p.part('#8a7456', [[-190, -0.9 * PX_M], [-110, -0.9 * PX_M], [-110, 0], [-190, 0]], true, 4); // back
  p.part('#a58e6b', [[-190, -0.45 * PX_M], [200, -0.45 * PX_M], [200, 0], [-190, 0]], true, 4); // seat block
};

const paintC = (ctx: PaintContext) => {
  guide(ctx, 300, 20, 1060, C_GROUND, INK, 1.2);
  guide(ctx, 301, 20, 1060, C_GROUND2, INK, 1.2);
  // B07 sofa, seat top 0.45 m, back 0.9 m: lap pose facing right; hand-up pose mirrored (as B07 stages it, facing left).
  place(ctx, 190, C_GROUND, C_K, 1, () => {
    sofaBlock(makePaint(ctx, 60000));
    paintSeatedSofa(makePaint(ctx, 61000), YOU, -60, 0, {face: ZC_FACES.neutral});
  });
  place(ctx, 640, C_GROUND, C_K, -1, () => {
    sofaBlock(makePaint(ctx, 62000));
    paintSeatedSofa(makePaint(ctx, 63000), YOU, -60, 0, {face: ZC_FACES.neutral, grip: [95, -0.45 * PX_M - 240]});
  });
  // B09 floor, day 3, unsupported, knees up, forearms on knees, head pitched down 20 deg: facing right and mirrored (screen-left, as staged).
  place(ctx, 250, C_GROUND2, 0.85, 1, () => {
    const p = makePaint(ctx, 64000);
    const r = paintSeatedFloor(p, YOU_DAY3, 0, 0, {face: ZC_FACES.tired});
    paintDay3Face(ctx, p.fork(800), 'side', r.head.x, r.head.y, r.head.K);
  });
  place(ctx, 760, C_GROUND2, 0.85, -1, () => {
    const p = makePaint(ctx, 65000);
    const r = paintSeatedFloor(p, YOU_DAY3, 0, 0, {face: ZC_FACES.fear});
    paintDay3Face(ctx, p.fork(800), 'side', r.head.x, r.head.y, r.head.K);
  });
  // POV hands.
  const painter = makePainter(ctx.brush, {t: ctx.t, frame: ctx.frame, fade: PAPER});
  POV_POSES.forEach((pose, i) => {
    const cx = (i % 3) * POV_CELL_W + POV_CELL_W / 2, cy = POV_Y0 + Math.floor(i / 3) * POV_CELL_H + POV_CELL_H - 20;
    paintPovHand(painter, {
      side: pose.side, base: 9000 + i * 100, wrist: [cx, cy - 110], dir: pose.dir ?? -Math.PI / 2, size: 0.6, curl: pose.curl, spread: pose.spread, thumb: pose.thumb, pinch: pose.pinch, press: pose.press, fingerCurl: pose.fingerCurl,
      elbow: [cx, cy - 10], tone: ZC_HAND,
    });
  });
};

// ------------------------------------------------------------------ labels and compositions

const Lbl = ({x, y, w = 200, children, small}: {x: number; y: number; w?: number; children: ReactNode; small?: boolean}) => (
  <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, textAlign: 'center', fontSize: small ? 18 : 24, lineHeight: 1.15}}>{children}</div>
);
const Page = ({paint, children, title}: {paint: (ctx: PaintContext) => void; children: ReactNode; title: string}) => (
  <AbsoluteFill style={{backgroundColor: PAPER}}>
    <BrushCanvas paint={paint} paper={PAPER} />
    <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
      <div style={{position: 'absolute', left: 30, top: 24, fontSize: 32}}>{title}</div>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const ZcModelA = () => (
  <Page paint={paintA} title="S-P01 · A calibration · 447 px/m · 1.70 m = 4 heads">
    <Lbl x={120} y={A_GROUND1 + 6}><b>zc-you</b> front</Lbl>
    <Lbl x={300} y={A_GROUND1 + 6}><b>zc-you</b> profile</Lbl>
    <Lbl x={470} y={A_GROUND1 + 6} w={170}><b>zc-infected</b> 1.62 m</Lbl>
    <Lbl x={620 + 0.45 * PX_M} y={A_GROUND1 + 6} w={300}>door 0.90 × 2.10 m (no peephole)</Lbl>
    <Lbl x={30 + 0.4 * PX_M} y={A_GROUND2 + 6} w={300}>cabinet 0.8 × 1.2</Lbl>
    <Lbl x={410 + 0.3 * PX_M} y={A_GROUND2 + 6} w={200}>fridge 0.6 × 1.7</Lbl>
    <Lbl x={700 + 62} y={A_GROUND2 + 6} w={140} small>bucket Ø0.28 × 0.30</Lbl>
    <Lbl x={845 + 20} y={A_GROUND2 + 26} w={90} small>PET 1.5 L</Lbl>
    <Lbl x={980} y={A_GROUND2 + 6} w={170} small>stove case 0.36 × 0.12</Lbl>
    {[0, 0.5, 1, 1.5, 2].map((m) => <div key={m} style={{position: 'absolute', left: 4, top: A_GROUND1 - m * PX_M - 24, fontSize: 18, color: '#5d6b78'}}>{m} m</div>)}
    <div style={{position: 'absolute', left: 4, top: A_GROUND2 - 1.5 * PX_M - 24, fontSize: 18, color: '#5d6b78'}}>1.5 m</div>
    <div style={{position: 'absolute', left: 30, top: 70, fontSize: 20, color: '#5d6b78'}}>row 1 floor y {A_GROUND1}; row 2 floor y {A_GROUND2}; real-metre props next to the big-headed 1.7 m figure (stylization exception)</div>
  </Page>
);

export const ZcModelB = () => (
  <Page paint={paintB} title="S-P01 · B standing views · faces · blink switch">
    {['front', 'profile', 'back', 'front', 'profile', 'back'].map((v, i) => <Lbl key={i} x={B_COLS[i]} y={B_ROW1 + 6} w={170} small>{i < 3 ? 'day 1' : 'day 3'} {v}</Lbl>)}
    {['infected: rage front', 'profile, lit', 'silhouette (B01)', 'back', 'you: bucket lift (B05-SH01)', 'you: mirrored grip'].map((v, i) => <Lbl key={i} x={B_COLS2[i]} y={B_ROW2 + 6} w={140} small>{v}</Lbl>)}
    {FACE_NAMES.map((n, i) => <Lbl key={n} x={faceX(i)} y={B_FACE_Y1 + 70} w={130} small>{n}</Lbl>)}
    <div style={{position: 'absolute', left: 30, top: B_FACE_Y1 - 100, fontSize: 20, color: '#5d6b78'}}>face controls: front head (blink off here) over profile head (blink opt-in, off)</div>
    <Lbl x={330} y={1810 + 62} w={280} small>front blink on, blinkAt 0.5 s (shut at F15–F18)</Lbl>
    <Lbl x={700} y={1810 + 62} w={200} small>blink off (open)</Lbl>
    <Lbl x={900} y={1810 + 62} w={200} small>blink on, same phase</Lbl>
  </Page>
);

export const ZcModelC = () => (
  <Page paint={paintC} title="S-P01 · C seated poses · POV hands">
    <Lbl x={190} y={C_GROUND + 6} w={300} small>B07 sofa, hands in the lap (profile)</Lbl>
    <Lbl x={640} y={C_GROUND + 6} w={300} small>B07 sofa, hand up with food (mirrored)</Lbl>
    <Lbl x={250} y={C_GROUND2 + 6} w={420} small>B09 floor, day 3: knees up, hands over the kneecaps, head down 20°</Lbl>
    <Lbl x={760} y={C_GROUND2 + 6} w={420} small>same, mirrored (screen-left as staged), face: fear</Lbl>
    {POV_POSES.map((pose, i) => <Lbl key={pose.name} x={(i % 3) * POV_CELL_W + POV_CELL_W / 2} y={POV_Y0 + Math.floor(i / 3) * POV_CELL_H - 2} w={340} small>{pose.name} · {pose.side === 1 ? 'right' : 'left'}</Lbl>)}
  </Page>
);
