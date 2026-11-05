// PARALLAX-TEST spike (coordinator, 4 Nov 2026; user: "the clips look too plain 2D"). Not a deliverable and not wired to any
// timeline. It asks one question: does moving the 3D camera inside a set built in world metres read as more depth than the
// usual flat push? Shot under test: EG-EP02 S01-B01-SH01 (Yaowarat wide, empty, 128 f).
//   - PARALLAX-BEFORE: the shipped plate (`ShotPlate`), a 2D push s 1 -> 1.008 of the whole picture.
//   - PARALLAX-AFTER: the same set and seeds, the 2D push removed, the 3D camera dollies 2 m down the street and trucks
//     0.5 m left (eased), so near poles, signs and kerbs slide faster than the far haze: true perspective parallax.
// `paintYaowarat` paints the street details only for the `YW_CAM` object itself (`o.cam === YW_CAM`), so this spike moves that
// object's fields for the duration of one paint call and restores them; no production module is changed.
import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {StateGrade} from '../everyone-gone/ep02/look';
import {YW_CAM, YW_YOU, paintYaowarat} from '../everyone-gone/ep02/places';
import {ShotPlate, paintYouHood} from '../everyone-gone/ep02/shots';
import {STILL_CAMERA, applyCamera, type Camera} from '../kit/camera';
import {Painted} from '../everyone-gone/look';
import {proj, type Cam} from '../everyone-gone/space';
import {STALL_CAM, paintStall} from '../everyone-gone/stall';

const FPS = 30;
const PAPER = '#e9e6e0';
export const PARALLAX_FRAMES = 128;
const BASE = {...YW_CAM};
/** Camera travel over the shot (metres): forward down the street (-z) and to the left (-x). */
export const DOLLY = 2.0, TRUCK = -0.5;

const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));

export const ParallaxBefore = () => <ShotPlate id="S01-B01-SH01" />;

// Test 3 (character, user 4 Nov 2026 "ขอดูตัวละคร"): `คุณ` (YOU2, back view, kit `hood-pull` via `paintYouHood`) stands at YW_YOU in
// the empty Yaowarat street. BEFORE = the camera stays at YW_CAM and the picture zooms 1 -> 2.4 about her feet (a digital zoom).
// AFTER = the 3D camera walks up behind her (5 m -> 2 m) so she grows by the same amount while the shopfronts rush past. She is
// still a flat back-view card: the camera stays behind her, inside the angle where a card reads (scale doc §4.4).
const HOOD_AT = 40; // the hood pull starts at f 68 of this test (HOOD_PULL_START 28 + 40)
const ZOOM = 2.4;
export const YouBefore = () => {
  const f = useCurrentFrame();
  const e = ease(f / (PARALLAX_FRAMES - 1));
  const [gx, gy] = proj(BASE, YW_YOU);
  const c: Camera = {s: 1 + (ZOOM - 1) * e, fx: gx, fy: gy - 300, dx: 0, dy: 0};
  const fn = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    brush.push();
    applyCamera(brush, c);
    paintYaowarat(p, 'empty', {you: false});
    paintYouHood(p, YW_CAM, f - HOOD_AT);
    brush.pop();
  }, [f]); // eslint-disable-line react-hooks/exhaustive-deps
  return <Graded fn={fn} />;
};
export const YouAfter = () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const e = ease(f / (PARALLAX_FRAMES - 1));
    const p = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    Object.assign(YW_CAM, {x: BASE.x - 0.7 * e, y: BASE.y - 0.1 * e, z: BASE.z - 3.0 * e});
    try {
      paintYaowarat(p, 'empty', {you: false});
      paintYouHood(p, YW_CAM, f - HOOD_AT);
    } finally {
      Object.assign(YW_CAM, BASE);
    }
  }, [f]);
  return <Graded fn={fn} />;
};
// Test 4 (orbit, user 4 Nov 2026 "ลองเดินวนรอบตัว"): the camera arcs around `คุณ` at 2.6 m, from 35 deg behind her left to 35 deg
// behind her right, eye 1.5 m. `proj` has no yaw, so the turn is the lens shift `cx = f * tan(theta)` that keeps her centred, as
// EG-EP01 S01-B02-SH01 does for its 30 deg turn; planes stay axis-aligned. Beyond about 45 deg this stand-in breaks down and the
// back-view card would need the profile view, so the arc stops at 35 deg.
export const ORBIT_FRAMES = 150;
const ORBIT_R = 2.6, ORBIT_DEG = 35;
export const YouOrbit = () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const th = ((-1 + 2 * ease(f / (ORBIT_FRAMES - 1))) * ORBIT_DEG * Math.PI) / 180;
    const p = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    // Depth along -z held at ORBIT_R (proj divides by z distance only, so a true circle would pulse her size by 1/cos theta).
    Object.assign(YW_CAM, {x: YW_YOU[0] + ORBIT_R * Math.tan(th), y: 1.5, z: YW_YOU[2] + ORBIT_R, cx: BASE.f * Math.tan(th)});
    try {
      paintYaowarat(p, 'empty', {you: false});
      paintYouHood(p, YW_CAM, f - 32);
    } finally {
      Object.assign(YW_CAM, BASE);
      delete (YW_CAM as Cam).cx;
    }
  }, [f]);
  return <Graded fn={fn} />;
};
const Graded =({fn}: {fn: (c: PaintContext) => void}) => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={fn} paper={PAPER} />
    <StateGrade state="empty" />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);

// Test 2 (stall, EG-EP01 set `paintStall`, framing STALL_CAM = LF03): a slider shot. BEFORE = the usual 2D push 1 -> 1.05 about
// the table; AFTER = the 3D camera slides 1.0 m left-to-right and eases 0.4 m in, with a lens shift that pins the table centre
// on screen, so the stools (nearer) slide one way and the shophouse wall (farther) the other way around it.
const TABLE: [number, number, number] = [-0.4, 0.75, 0.35];
const stallCam = (f: number): Cam => {
  const e = ease(f / (PARALLAX_FRAMES - 1));
  const x = -0.7 + 1.0 * e, z = 3.6 - 0.4 * e, pin = proj(STALL_CAM, TABLE)[0] - 540; // keep the table where LF03 has it
  return {...STALL_CAM, x, z, cx: (STALL_CAM.f * (x - TABLE[0])) / (z - TABLE[2]) + pin};
};
export const StallBefore = () => {
  const f = useCurrentFrame();
  const e = ease(f / (PARALLAX_FRAMES - 1));
  const [tx, ty] = proj(STALL_CAM, TABLE);
  const c: Camera = {s: 1 + 0.05 * e, fx: tx, fy: ty, dx: 0, dy: 0};
  return <Painted cam={() => c} paint={(p) => paintStall(p, f / FPS, STALL_CAM)} />;
};
export const StallAfter = () => {
  const f = useCurrentFrame();
  return <Painted cam={() => STILL_CAMERA} paint={(p) => paintStall(p, f / FPS, stallCam(f))} />;
};

export const ParallaxAfter = () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const e = ease(f / (PARALLAX_FRAMES - 1));
    const p = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    Object.assign(YW_CAM, {x: BASE.x + TRUCK * e, z: BASE.z - DOLLY * e});
    try {
      paintYaowarat(p, 'empty', {you: false});
    } finally {
      Object.assign(YW_CAM, BASE);
    }
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <StateGrade state="empty" />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};
