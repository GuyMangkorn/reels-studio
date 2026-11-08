// Hand macro check stills (KIT-HAND-MACRO; EDU-EP09 SP1-SP3): one 1080x1920 still per spec id, rendered with
//   node scripts/painted-kit/hand-macro.mjs --out=DIR [--only=POV-flat,TRY-tp] [--list]
// then tiled at 270 px with `scripts/qa-sheet.sh`. Specs: SP1 (CAM-POV and CAM-TRY x the poses), SP2 spike (see-through hand with
// throw-away cords at DIAG-W / DIAG-B: scale check only, the real layer is the episode's tendon module), SP3 (rig wrist -> macro).
// Own entry (kept out of src/Root.tsx), like poses-sheet.tsx.
import {createElement, Fragment, type ComponentType} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {hardFill} from './draw';
import {HAND_CAMS, HAND_SPECS, SP1_CAMS, SP3} from './hands-macro-specs';
import {BOY_WRIST, boy} from './hands-macro-specs';
import {inkLine, macroHandTarget, macroSkeleton, paintHandMacro, type HandMacro} from './hands';
import {makePainter, type Painter, type Pt} from './painter';
import {paintFigureAt} from './figure-at';
import {PEOPLE} from './people';
import type {V3} from './space';
import {camPoint, camPoly, type YCam} from './ycam';

const paintTable = (p: Painter, cam: YCam) => {
  const w = hardFill, T = (x: number, z: number): V3 => [x, 0, z];
  w(p, 1, '#a86f45', camPoly(cam, [T(-300, -300), T(300, -300), T(300, 300), T(-300, 300)]));
  for (let i = 0; i < 16; i++) {
    const x = -30 + i * 4 + ((i * 7) % 5) * 0.4;
    const pts = [T(x, -60), T(x + ((i % 3) - 1) * 0.8, 0), T(x - 0.4, 60)].map((v) => camPoint(cam, v));
    if (pts.every(Boolean)) inkLine(p, 100 + i, pts as Pt[], 1.3, 0.3, false, i % 2 ? '#8a5634' : '#97603c');
  }
};

// SP2 spike: cords + ties as throw-away capsules over the see-through hand, to check sizes and layering (the real tendon layer is an episode module).
const paintSpikeCords = (p: Painter, cam: YCam, h: HandMacro, tautRing: boolean) => {
  const sk = macroSkeleton(h), S = sk.S;
  const px = (v: V3) => camPoint(cam, v);
  const mid = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  const belly = [0.5, 3.3, 18] as V3;
  const wr = h.wrist;
  // shared muscle belly: coral ellipse along the forearm
  const e = h.elbow!;
  const b0 = mid(wr, e, 0.35), b1 = mid(wr, e, 0.95);
  const bp = [b0, b1].map(px);
  if (bp[0] && bp[1]) {
    const w = Math.hypot(bp[1][0] - bp[0][0], bp[1][1] - bp[0][1]);
    const r = camPoint(cam, [b0[0] + 2.4 / 2, b0[1], b0[2]]);
    const rw = r ? Math.abs(r[0] - bp[0][0]) : 30;
    const ang = Math.atan2(bp[1][1] - bp[0][1], bp[1][0] - bp[0][0]);
    const poly: Pt[] = Array.from({length: 20}, (_, i) => { const t = (i / 20) * 2 * Math.PI, ex = (w / 2) * Math.cos(t), ey = rw * Math.sin(t); return [(bp[0]![0] + bp[1]![0]) / 2 + ex * Math.cos(ang) - ey * Math.sin(ang), (bp[0]![1] + bp[1]![1]) / 2 + ex * Math.sin(ang) + ey * Math.cos(ang)]; });
    hardFill(p, 2001, '#e88f6f', poly);
    inkLine(p, 2001, poly, 1.4, 0.3, true, '#7a5a3c');
  }
  const fingers = ['index', 'middle', 'ring', 'little'] as const;
  const cordW = (v: V3, wcm: number) => { const a = camPoint(cam, v), b = camPoint(cam, [v[0] + wcm * S, v[1], v[2]]); return a && b ? Math.max(2, Math.abs(b[0] - a[0])) : 4; };
  fingers.forEach((id, i) => {
    const c = sk.fingers[id], up = sk.normal, taut = tautRing && id === 'ring';
    const lat = c.joints[0][0] - wr[0];
    const pts: V3[] = [
      [belly[0] + lat * 0.25, h.wrist[1] + 1.8, h.wrist[2] + 6], [wr[0] + lat * 0.7, h.wrist[1] + 1.1 * S, h.wrist[2] - 0.5],
      [c.joints[0][0] + up[0] * c.radii[0], c.joints[0][1] + up[1] * c.radii[0], c.joints[0][2]],
      ...[0, 1, 2].map((k) => [c.joints[k + 1][0] + c.dorsal[k][0] * c.radii[k + 1] * 0.95, c.joints[k + 1][1] + c.dorsal[k][1] * c.radii[k + 1] * 0.95, c.joints[k + 1][2] + c.dorsal[k][2] * c.radii[k + 1] * 0.95] as V3),
    ];
    const P = pts.map(px);
    if (P.some((v) => !v)) return;
    const wpx = cordW(pts[2], 0.35) * (taut ? 1.5 : 1);
    if (taut) inkLine(p, 2100 + i, P as Pt[], wpx * 2.4, 0.2, false, '#fff3c4');
    inkLine(p, 2110 + i, P as Pt[], wpx + 2.2, 0.2, false, '#7a5a3c');
    inkLine(p, 2120 + i, P as Pt[], wpx, 0.2, false, taut ? '#fffbea' : '#fbf3e2');
  });
  // ties: middle-ring at z 2.5, ring-little at z 3.0 (cm in hand-close coordinates: relative to the middle MCP z = 0), 0.5 x 1.6 cm
  ([['middle', 'ring', 2.5], ['ring', 'little', 3.0]] as const).forEach(([a, b, z], i) => {
    const A = sk.fingers[a].joints[0], B = sk.fingers[b].joints[0], u = (A[2] - (BOY_WRIST[1] - 6.5) - z) / 1; void u;
    const y = A[1] + sk.fingers[a].radii[0] * 1.05, zz = A[2] + z * S;
    const ends = [[A[0], y, zz], [B[0], y, zz]] as V3[];
    const pa = px(ends[0]), pb = px(ends[1]);
    const tall = px([A[0], y, zz - 0.8 * S]), tall2 = px([A[0], y, zz + 0.8 * S]);
    if (pa && pb && tall && tall2) {
      const hpx = Math.hypot(tall[0] - tall2[0], tall[1] - tall2[1]);
      const wcm = Math.max(6, hpx * 0.28);
      const ang = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), nx = -Math.sin(ang), ny = Math.cos(ang), hw = hpx / 2;
      const poly: Pt[] = [[pa[0] + nx * hw, pa[1] + ny * hw], [pb[0] + nx * hw, pb[1] + ny * hw], [pb[0] - nx * hw, pb[1] - ny * hw], [pa[0] - nx * hw, pa[1] - ny * hw]];
      hardFill(p, 2200 + i, '#ff7a5c', poly);
      inkLine(p, 2200 + i, poly, 1.2, 0.1, true, '#7a3a2c');
      void wcm;
    }
  });
};

export type Spec = {paint: (p: Painter) => void; measure?: () => Record<string, number | string>};
const specs: Record<string, Spec> = {};
for (const cam of SP1_CAMS) {
  for (const [id, mk] of Object.entries(HAND_SPECS)) {
    specs[`${cam}-${id}`] = {paint: (p) => { paintTable(p, HAND_CAMS[cam]); paintHandMacro(p, HAND_CAMS[cam], mk()); }};
  }
}
specs['PLAN-flat'] = {paint: (p) => { paintTable(p, HAND_CAMS.PLAN); paintHandMacro(p, HAND_CAMS.PLAN, boy('flat')); }};
specs['PLAN-tp'] = {paint: (p) => { paintTable(p, HAND_CAMS.PLAN); paintHandMacro(p, HAND_CAMS.PLAN, boy('test-fold-middle')); }};
specs['DIAG-W-flat-alpha'] = {paint: (p) => {
  const h = {...boy('flat'), skinAlpha: 0.28, shadowAlpha: 0.12};
  paintTable(p, HAND_CAMS['DIAG-W']); paintHandMacro(p, HAND_CAMS['DIAG-W'], h); paintSpikeCords(p, HAND_CAMS['DIAG-W'], h, false);
}};
specs['DIAG-B-flat-alpha'] = {paint: (p) => {
  const h = {...boy('flat'), skinAlpha: 0.28, shadowAlpha: 0.12};
  paintTable(p, HAND_CAMS['DIAG-B']); paintHandMacro(p, HAND_CAMS['DIAG-B'], h); paintSpikeCords(p, HAND_CAMS['DIAG-B'], h, false);
}};
specs['TRY-tp-alpha-taut'] = {paint: (p) => {
  const h = {...boy('test-fold-middle', {lift: {ring: 0.3}}), skinAlpha: 0.28, shadowAlpha: 0.12};
  paintTable(p, HAND_CAMS.TRY); paintHandMacro(p, HAND_CAMS.TRY, h); paintSpikeCords(p, HAND_CAMS.TRY, h, true);
}};

const sp3 = (key: keyof typeof SP3): Spec => ({
  paint: (p) => {
    const {cam, person, seat, arm} = SP3[key], handW = SP3[key].hand();
    const T = (x: number, z: number): V3 => [x, 0.72, z];
    hardFill(p, 1, '#a86f45', camPoly(cam, [T(-0.7, -0.4), T(0.7, -0.4), T(0.7, 0.4), T(-0.7, 0.4)]));
    const target = macroHandTarget(cam, handW);
    // the rig's hand target is the macro palm centre; the macro hand is drawn after the figure and hides the mitten
    paintFigureAt(p, cam, PEOPLE[person], {at: seat, t: 0, fig: target ? {[arm]: {to: target as Pt, out: 1}} : {}, shadow: false});
    paintHandMacro(p, cam, handW);
  },
});
specs['SP3-B01SH04'] = sp3('B01SH04');
specs['SP3-B02SH02'] = sp3('B02SH02');

export const SPEC_IDS = Object.keys(specs);
const Still = ({spec}: {spec: string}) => (
  <AbsoluteFill style={{background: '#efe6d2'}}>
    <BrushCanvas paint={({brush}) => { const p = makePainter(brush, {t: 0.37, frame: 11}); specs[spec]?.paint(p); }} />
  </AbsoluteFill>
);

registerRoot(() => createElement(Fragment, null, createElement(Composition as unknown as ComponentType<Record<string, unknown>>, {
  id: 'KIT-HAND-MACRO', component: Still, defaultProps: {spec: 'POV-flat'}, width: 1080, height: 1920, fps: 30, durationInFrames: 30,
})));
