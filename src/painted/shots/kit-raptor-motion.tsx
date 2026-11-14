import {hardFill, rectPts} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';
import {paintBeast} from '../survival/beast';
import {buildRaptor, RAPTOR_POSES, RAPTOR_POUNCE, RAPTOR_WALK, raptorWalkPads, type RaptorPose} from '../survival/beast-raptor';

// KIT-RAPTOR-MOTION plate (motion check, not an episode; kit test 14 Nov 2026): the RAPTOR kit creature (src/painted/survival/beast-raptor.ts) side-on on the plain
// creature-card background, a static camera so foot skating shows against the ground: WALK 3 cycles (the body moves `RAPTOR_WALK.speed` m/s, so planted feet stay put),
// STAND 1 s with the feet where the walk left them, POUNCE once at its natural length, then the landing held 0.5 s. Video: src/videos/kit-raptor-motion/index.ts.
// Render: `node scripts/render.mjs KIT-RAPTOR-MOTION --draft`.

export const RAPTOR_MOTION = {walkCycles: 3, standSec: 1, holdSec: 0.5} as const;
const WALK_SEC = RAPTOR_MOTION.walkCycles * RAPTOR_WALK.sec, STAND_END = WALK_SEC + RAPTOR_MOTION.standSec, POUNCE_END = STAND_END + RAPTOR_POUNCE.sec;
export const RAPTOR_MOTION_SEC = POUNCE_END + RAPTOR_MOTION.holdSec;
/** start x of the body origin (m) and the static side camera: 170 px per m at the subject, ground at y 1150 */
const X0 = -2.0, PXM = 170, D = 10, CAM: YCam = {x: -0.25, y: 0.45, z: D, yaw: 0, f: PXM * D, hy: 1150 - PXM * 0.45, pitch: 0, cx: 0};
const PAPER = '#d9e2cc', CELL = mixColor('#b9a87e', PAPER, 0.45);
const sm = (a: number, b: number, t: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };

/** Segment, pose and body x at shot second `tl`. */
export const raptorMotionAt = (tl: number): {seg: string; local: number; pose: RaptorPose; x: number} => {
  const endX = X0 + RAPTOR_MOTION.walkCycles * RAPTOR_WALK.perCycle, pads = raptorWalkPads(RAPTOR_MOTION.walkCycles);
  if (tl < WALK_SEC) { const ph = tl / RAPTOR_WALK.sec; return {seg: 'WALK', local: tl, pose: RAPTOR_POSES.walk(ph), x: X0 + ph * RAPTOR_WALK.perCycle}; }
  if (tl < STAND_END) { const ts = tl - WALK_SEC; return {seg: 'STAND', local: ts, pose: {...RAPTOR_POSES.stand(pads), bob: -0.012 * (1 - sm(0, 0.3, ts)), jaw: 0.1 + 0.02 * sm(0, 0.3, ts)}, x: endX}; }
  const tp = Math.min(1, (tl - STAND_END) / RAPTOR_POUNCE.sec);
  return {seg: tl < POUNCE_END ? 'POUNCE' : 'HOLD', local: tl - STAND_END, pose: RAPTOR_POSES.pounce(tp, pads), x: endX};
};

const paint = (p: Painter, {tl}: ShotContext) => {
  hardFill(p, 1, PAPER, rectPts(0, 0, 1080, 1920));
  hardFill(p, 2, CELL, rectPts(6, 300, 1074, 1620));
  // ground ticks every 0.5 m: a fixed world reference for the skating check
  for (let i = -8; i <= 8; i++) { const x = 540 + (i * 0.5 - CAM.x) * PXM; hardFill(p, 10 + i + 8, mixColor(CELL, '#2b211c', i % 2 ? 0.2 : 0.35), rectPts(x - 1.5, 1150, x + 1.5, 1150 + (i % 2 ? 14 : 26))); }
  const m = raptorMotionAt(tl);
  paintBeast(p, CAM, buildRaptor(m.pose), {at: [m.x, 0], heading: 0, seed: 70000, shadowOp: 80});
};

const Label = ({tl, width}: ShotContext) => {
  const m = raptorMotionAt(tl);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#2b211c'}}>
      <div style={{position: 'absolute', left: 40, top: 150, fontSize: 52, fontWeight: 800}}>AS-RAPTOR-R1 motion</div>
      <div style={{position: 'absolute', left: 40, top: 220, fontSize: 28}}>side view · WALK x3 · STAND 1 s · POUNCE · hold 0.5 s</div>
      <div style={{position: 'absolute', left: 40, width: width - 80, top: 1660, fontSize: 40, fontWeight: 700}}>{`${m.seg}  t = ${m.local.toFixed(2)} s`}</div>
    </div>
  );
};

export const raptorMotionShots: PaintedShot[] = [{
  id: 'kit-raptor-motion',
  serves: ['KIT-RAPTOR-MOTION'],
  paper: PAPER,
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: (props) => <Label {...props} />,
}];
