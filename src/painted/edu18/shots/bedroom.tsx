import type {ReactNode} from 'react';
import type {Painter, Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {buildMosquito, drawMosquitoDot, MOSQUITO_POSES} from '../../kit/mosquito';
import {poseFor} from '../../kit/poses';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {paintBeast} from '../../survival/beast';
import {drawGirl, GIRL, girlPose} from '../girl';
import {BED, LAMP_BULB, paintBedroomBack, paintBedroomFloor, paintBlanket, type BedMode} from '../bedroom';
import {OnQuad} from '../fpov';
import {cam, LF03_LIE, LF03L_HIPS} from '../looks-cams';
import {openT} from '../looks';
import {MACRO, paintMacroField} from '../macro';
import {paintPhoneBody, PostScreen, SCREEN_H, SCREEN_W} from '../Post';
import {clamp, k01, lerp, lerpArm, makeShot, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT bedroom shots (Editor W5 draft): B05-SH01/SH02 (bedtime, the buzz), B05-SH03 (macro), B06-SH01 (lamp), B06-SH04 (her face), B06-SH05 (tableau).
const DEF = GIRL['home-lounge-night'];
const lie = (p: Painter, c: YCam, face: Parameters<typeof drawGirl>[5], seed = 873) => {
  const g = camPoint(c, LF03_LIE), u = camUnit(c, LF03_LIE);
  if (g) drawGirl(p, 'home-lounge-night', g, u, poseFor('P37', DEF, g, u, 'front'), face, openT(seed), seed);
};

// ------------------------------------------------------------------------------------------------ B05-SH01 bedtime
export const B05_SH01 = makeShot('B05-SH01', (L, G): Frame => {
  const e = k01(L, 0, 64, (x) => x), c = mixYCam(cam([-0.15, 0.55, -1.0], -5, 2.35, 1.45, 880, 700), cam([-0.15, 0.55, -1.0], 0, 2.1, 1.45, 880, 700), e);
  const back: Pass = (p) => {
    paintBedroomBack(p, c, {mode: 'night', t: G / 30});
    paintBedroomFloor(p, c, 'night');
    lie(p, c, L < 40 ? 'relieved' : L < 52 ? 'sleepy' : 'asleep');
    paintBlanket(p, c, lerp(-0.2, -0.5, k01(L, 0, 20)), 0.85, -1.1, lerp(0.7, 0.78, k01(L, 0, 20)), 'night');
  };
  return {paper: BED.night, back, grain: 0.07};
});

// ------------------------------------------------------------------------------------------------ B05-SH02 the buzz returns (the dot circles her head, 30 f period from L4)
export const B05_SH02 = makeShot('B05-SH02', (L, G): Frame => {
  const e = k01(L, 0, 62, (x) => x), c = mixYCam(cam([-0.75, 0.62, -1.15], 0, 0.9, 0.75, 1100, 820), cam([-0.75, 0.62, -1.15], -6, 0.8, 0.75, 1100, 820), e);
  const back: Pass = (p) => {
    paintBedroomBack(p, c, {mode: 'night', t: G / 30});
    paintBedroomFloor(p, c, 'night');
    lie(p, c, L < 6 ? 'asleep' : L < 10 ? 'surprised' : 'scared');
    paintBlanket(p, c, lerp(-0.45, -0.66, k01(L, 14, 28)), 0.85, -1.1, lerp(0.78, 0.86, k01(L, 14, 28)), 'night');
    if (L >= 4) {
      const a = ((L - 4) / 30) * Math.PI * 2, o: V3 = [-0.75 + 0.2 * Math.cos(a), 0.78 + 0.2 * Math.sin(a) * 0.8, -1.15 + 0.08 * Math.sin(a)];
      const q = camPoint(c, o), a2 = a - 0.25, q2 = camPoint(c, [-0.75 + 0.2 * Math.cos(a2), 0.78 + 0.16 * Math.sin(a2), -1.15 + 0.08 * Math.sin(a2)]);
      if (q && q2) { const d: Pt = [q2[0] - q[0], q2[1] - q[1]], n = Math.hypot(d[0], d[1]) || 1; drawMosquitoDot(p, 72200, q, 5, [d[0] / n, d[1] / n], 2); }
    }
  };
  return {paper: BED.night, back, grain: 0.07};
});

// ------------------------------------------------------------------------------------------------ B05-SH03 the mosquito alone (macro, mm)
const MQ_ARC = (L: number): YCam => {
  const a = k01(L, 0, 75, (x) => x), drift = 4 * a;
  return {...cam([drift, 8, 0], -20 + 40 * a, 22 + 4 * a, 8, 1100, 700), near: 2};
};
export const B05_SH03 = makeShot('B05-SH03', (L, G): Frame => {
  const pull = k01(L, 86, 173, (x) => x);
  const c = L < 86 ? MQ_ARC(L) : {...cam([4, 8, 0], 20, Math.exp(lerp(Math.log(26), Math.log(1100), pull)), 8, 1100, 700), near: 2};
  const drift = 4 * k01(L, 0, 75, (x) => x);
  const back: Pass = (p) => {
    paintMacroField(p, 560, c.hy);
    const big = ((c as YCam & {d?: number}).d ?? 0) || 0; void big;
    const r = L < 86 ? 22 : Math.exp(lerp(Math.log(26), Math.log(1100), pull));
    if (r < 420) paintBeast(p, c, buildMosquito(MOSQUITO_POSES.hover(G / 30)), {at: [drift, 0], heading: 0, ground: 0, seed: 72000});
    else { const q = camPoint(c, [drift, 8, 0]); if (q) drawMosquitoDot(p, 72300, q, 6, [-1, 0.2], 2, '#8d98a6' as '#2a2624'); }
  };
  return {paper: MACRO.outer, back, grain: 0.08};
});

// ------------------------------------------------------------------------------------------------ lamp lights (LF03L method)
const lampLight = (c: YCam, k: number, hipsGlow?: V3): ReactNode => {
  const l = camPoint(c, LAMP_BULB) ?? [200, 900];
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: k, mixBlendMode: 'screen', background: `radial-gradient(ellipse 1100px 950px at ${l[0]}px ${l[1]}px, rgba(255,214,150,0.5), rgba(255,207,138,0.22) 35%, rgba(255,207,138,0.06) 70%, rgba(255,207,138,0) 100%)`}} />
      {hipsGlow ? null : null}
    </>
  );
};
const faceGlow = (c: YCam, at: V3, k: number, rx = 150, ry = 170): ReactNode => {
  const f = camPoint(c, at) ?? [540, 700];
  return <div style={{position: 'absolute', inset: 0, opacity: k, mixBlendMode: 'screen', background: `radial-gradient(ellipse ${rx}px ${ry}px at ${f[0]}px ${f[1] + 30}px, rgba(207,224,255,0.35), rgba(207,224,255,0) 100%)`}} />;
};

// ------------------------------------------------------------------------------------------------ B06-SH01 the lamp (click L4, flood L4-10, sit-up L8-32, phone L28-44)
export const B06_SH01 = makeShot('B06-SH01', (L, G): Frame => {
  const e = k01(L, 0, 51, (x) => x), c = mixYCam(cam([-0.6, 0.8, -1.0], -20, 2.0, 1.2, 1150, 640), cam([-0.6, 0.8, -1.0], -12, 1.75, 1.2, 1150, 640), e);
  const mode: BedMode = L < 4 ? 'night' : 'lamp', flood = k01(L, 4, 10, (x) => x);
  const back: Pass = (p) => {
    paintBedroomBack(p, c, {mode, t: G / 30});
    if (L < 10) {
      const g = camPoint(c, LF03_LIE), u = camUnit(c, LF03_LIE);
      if (g) drawGirl(p, 'home-lounge-night', g, u, poseFor('P37', DEF, g, u, 'front'), 'tired', openT(870), 870);
      if (mode === 'night') paintBlanket(p, c, -0.5, 0.85, -1.1, 0.78, 'night');
      else paintBlanket(p, c, -0.5, 0.85, -1.1, 0.78, 'lamp');
    } else {
      const up = k01(L, 8, 32), at: V3 = [LF03L_HIPS[0], LF03L_HIPS[1] - 0.12 * (1 - up), LF03L_HIPS[2]], g = camPoint(c, at), u = camUnit(c, at);
      if (g) {
        const pose = girlPose('sit-up-phone', DEF, g, u, 'front'), hold = L >= 28;
        drawGirl(p, 'home-lounge-night', g, u, {...pose, ...(hold ? {} : {rArm: undefined, lArm: undefined, rHold: undefined, lHold: undefined}), lean: -0.2 * (1 - up)}, L < 28 ? 'tired' : 'neutral', openT(870), 870);
      }
    }
  };
  const flash = L >= 4 && L < 6 ? <div style={{position: 'absolute', inset: 0, background: 'rgba(255,230,190,0.28)'}} /> : null;
  return {
    paper: mode === 'night' ? BED.night : BED.shadow, back, grain: 0.06,
    overlay: <>{lampLight(c, flood)}{L >= 44 ? faceGlow(c, [LF03L_HIPS[0], LF03L_HIPS[1] + 0.68, LF03L_HIPS[2]], k01(L, 44, 48)) : null}{flash}</>,
  };
});

// ------------------------------------------------------------------------------------------------ B06-SH04 her face
export const B06_SH04 = makeShot('B06-SH04', (L, G): Frame => {
  const e = k01(L, 0, 71, (x) => x), c = mixYCam(cam([-0.55, 1.22, -1.30], -8, 0.95, 1.30, 1150, 740), cam([-0.55, 1.22, -1.30], 0, 0.85, 1.30, 1150, 740), e);
  const back: Pass = (p) => {
    paintBedroomBack(p, c, {mode: 'lamp', t: G / 30});
    const g = camPoint(c, LF03L_HIPS), u = camUnit(c, LF03L_HIPS);
    if (g) drawGirl(p, 'home-lounge-night', g, u, girlPose('sit-up-phone', DEF, g, u, 'front'), L >= 6 && L < 9 ? 'asleep' : L < 20 ? 'suspicious' : L < 40 ? 'suspicious' : 'worried', openT(871), 871);
  };
  return {paper: BED.shadow, back, grain: 0.06, overlay: <>{lampLight(c, 1)}{faceGlow(c, [-0.55, 1.2, -1.35], 1, 220, 260)}</>};
});

// ------------------------------------------------------------------------------------------------ B06-SH05 the tableau and the hold
// Draft v2 (user: "the action is all strange"): v1 lowered both hands behind her raised knees to the ankles, so the arms read as legs and the phone as a
// small thing at her feet. Now she keeps the sit-up-phone grip (both hands on the phone, elbows back), lowers it a hand's width from the chest during L0-30,
// holds it below her chin tilted a few degrees with the zoomed "500 คน/ปี" across it (the phone is drawn about 2x its true width so the number reads, as the
// sheet's >= 80 % screen width asks), then a breath out and shrug L104-140 (shoulders up and down) into the half-smile (L120) and the still hold from L154.
const SH05_TILT = -6;
export const B06_SH05 = makeShot('B06-SH05', (L, G): Frame => {
  const e = k01(L, 0, 154, (x) => x), c = mixYCam(cam([-0.5, 1.0, -1.15], -6, 0.95, 1.25, 1100, 640, {pitch: -14}), cam([-0.5, 1.0, -1.15], -3, 0.90, 1.25, 1100, 640, {pitch: -14}), e);
  const lower = k01(L, 0, 30), breath = Math.sin(Math.PI * clamp((L - 104) / 36)), shrug = 0.03 * breath;
  const rig = (g: Pt, u: number) => {
    const pose = girlPose('sit-up-phone', DEF, g, u, 'front'), rh = pose.rArm!.to, lh = pose.lArm!.to;
    const drop = 0.07 * u * lower - 0.035 * u * breath, w = Math.max(150, Math.abs(rh[0] - lh[0]) + 56), ph = (w * SCREEN_H) / SCREEN_W * 0.64;
    const cx = (rh[0] + lh[0]) / 2, cy = (rh[1] + lh[1]) / 2 + drop + ph * 0.1;
    return {pose, drop, w, ph, cx, cy};
  };
  const quadOf = (cx: number, cy: number, w: number, ph: number): [Pt, Pt, Pt, Pt] => {
    const a = (SH05_TILT * Math.PI) / 180, rot = (x: number, y: number): Pt => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
    return [rot(-w / 2, -ph / 2), rot(w / 2, -ph / 2), rot(w / 2, ph / 2), rot(-w / 2, ph / 2)];
  };
  const g0 = camPoint(c, LF03L_HIPS), u0 = camUnit(c, LF03L_HIPS);
  const r0 = g0 ? rig(g0, u0) : null;
  const back: Pass = (p) => {
    paintBedroomBack(p, c, {mode: 'lamp', t: G / 30});
    if (!g0 || !r0) return;
    const {pose, drop, w, ph, cx, cy} = r0;
    // hands follow the phone sides (behind the phone body); elbows follow half the drop
    const grip = (a: typeof pose.rArm, side: 1 | -1) => a ? {...a, to: [cx + side * (w / 2 - 14), cy + 10] as Pt, ...(a.via ? {via: [a.via[0], a.via[1] + drop * 0.6] as Pt} : {})} : a;
    drawGirl(p, 'home-lounge-night', g0, u0, {...pose, rise: shrug, rArm: grip(pose.rArm, 1), lArm: grip(pose.lArm, -1), rHold: undefined, lHold: undefined}, L < 120 ? 'neutral' : 'relieved', openT(872), 872);
    if (lower > 0.05) paintPhoneBody(p, quadOf(cx, cy, w + 14, ph + 22), 8800);
  };
  const postOp = k01(L, 4, 12);
  const q = r0 ? quadOf(r0.cx, r0.cy, r0.w, r0.ph) : null;
  return {
    paper: BED.shadow, back, grain: 0.06,
    overlay: <>{lampLight(c, 1)}{faceGlow(c, [-0.5, 1.15, -1.3], 1, 220, 260)}
      {q && postOp > 0 ? <div style={{opacity: postOp, position: 'absolute', inset: 0, transformOrigin: `${r0!.cx}px ${r0!.cy}px`, transform: `rotate(${SH05_TILT}deg)`}}>
        <OnQuad quad={[[r0!.cx - r0!.w / 2, r0!.cy - r0!.ph / 2], [r0!.cx + r0!.w / 2, r0!.cy - r0!.ph / 2], [r0!.cx + r0!.w / 2, r0!.cy + r0!.ph / 2], [r0!.cx - r0!.w / 2, r0!.cy + r0!.ph / 2]]}>
          <div style={{position: 'absolute', left: 0, width: r0!.w, height: (r0!.w * SCREEN_H) / SCREEN_W, top: -((r0!.w * SCREEN_H) / SCREEN_W - r0!.ph) / 2}}><PostScreen shares={59600} zoom={1} width={r0!.w} height={(r0!.w * SCREEN_H) / SCREEN_W} /></div>
        </OnQuad></div> : null}</>,
  };
});
