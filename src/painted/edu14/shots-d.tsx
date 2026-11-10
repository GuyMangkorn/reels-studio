// EDU-EP14 B03-B05 shots 13-21 (storyboard EDU-EP14-ROWS-R4.1): the false teardrop, the lip release, the bun, the thought bubble, the bag, the burst, the hand out, the palm and the laugh.
import {camMove, camOf} from '../kit/cam-moves';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {Painter, Pt} from '../kit/painter';
import {ell, washAt} from '../kit/draw';
import {Edge, CalmBand} from './look';
import {Lbl, TeardropIcon, DashedOutline, Ruler, PressArrows} from './diagram';
import {dropOutline, dropStateFor, paintDrop14, REFRACT_REAL, type DropState} from './drop';
import {GIRL_AT} from './palette';
import {LEAD_X, motionFig, paintBus} from './bus';
import {paintDropMacro, PAVEMENT_Y} from './dropmacro';
import {paintBubble, wobble} from './bubble';
import {handOutPalmUp, palmHeldOut} from './girl-motions';
import {camSH20, paintPalm} from './palm';
import {defShot} from './frame';
import {lin, sm} from './clock';

const near = (c: YCam, n: number): YCam => ({...c, near: n});
const dropPx = (st: DropState, at: Pt, u: number): Pt[] => dropOutline(st).map(([x, y]): Pt => [at[0] + x * u, at[1] - y * u]);
const AT: Pt = [540, 700];

// ---- 13. S01-B03-SH01 [1039, 1076): a 2 mm round drop at 100 px/mm, the false teardrop icon beside it, red cross on "ไม่ได้" (+27).
defShot('S01-B03-SH01', (L) => ({
  paint: (p) => { paintDropMacro(p, {t: L / 30 + 0.3, yaw: 4 * lin(0, 36, L)}); paintDrop14(p, [380, 760], 100, dropStateFor('S01-B03-SH01', L)!, {refract: REFRACT_REAL, seed: 51000}); },
  children: <><Edge color="#10181b" level={0.3} id="sh13edge" /><CalmBand level={0.4} id="sh13calm" /></>,
  overlay: <><Lbl /><TeardropIcon x={760} y={760} h={220} cross={lin(27, 33, L)} /></>,
}));

// ---- 14. S01-B03-SH02 [1076, 1113): the lip close of shot 1 +0; the middle pendant lets go at +12, rounds into a ball and falls out of frame (+12..+24).
export const camSH14 = (L: number): YCam => near(camOf(camMove([LEAD_X, 2.38, 0.10], [14, 16], 0.10, 2.36, {f: 1200, hy: 700}), L / 36), 0.02);
defShot('S01-B03-SH02', (L) => {
  const c = camSH14(L), fall = L >= 12 ? 1.2 * (L - 12) ** 2 : 0;
  return {
    paint: (p) => paintBus(p, c, {world: 'real', t: L / 30 + 0.4, face: 'tired', rain: 260, lead: {swell: 1, release: sm(12, 20, L), fall}}),
    children: <><Edge color="#10181b" level={0.4} id="sh14edge" /><CalmBand level={0.62} id="sh14calm" /></>,
  };
});

// ---- 15. S01-B03-SH03 [1113, 1221): the 4 mm drop, up-arrows press from +10, the bottom flattens to 0.35 by +41, the bun outline flashes beside it on +80.
defShot('S01-B03-SH03', (L) => {
  const u = 100 - (14 * L) / 107, st = dropStateFor('S01-B03-SH03', L)!, yaw = 4 + 4 * lin(0, 107, L);
  const ghost: DropState = {kind: 'bun', size: 4, flat: 0.35};
  return {
    paint: (p) => { paintDropMacro(p, {t: L / 30 + 0.6, yaw}); paintDrop14(p, AT, u, st, {refract: REFRACT_REAL, seed: 52000}); },
    children: <><Edge color="#10181b" level={0.3} id="sh15edge" /><CalmBand level={0.4} id="sh15calm" /></>,
    overlay: <><Lbl />{L >= 10 && <PressArrows x={AT[0]} y0={1090} len={150} grow={sm(10, 18, L)} />}{L >= 80 && <DashedOutline pts={dropPx(ghost, [AT[0] + 330, AT[1]], u)} pop={lin(80, 86, L)} />}</>,
  };
});

// ---- 16. S01-B04-SH01 [1221, 1332): she squints up with a hand at her chin; on +71 a thought bubble shows a ball-sized drop wobbling.
export const moveSH16 = camMove([0.25, 1.0, 0.05], [-10, -6], [1.8, 1.65], 0.8, {pitch: [12, 12], f: 1100, hy: 800});
export const camSH16 = (L: number): YCam => camOf(moveSH16, L / 110);
const BALL_AT: [number, number, number] = [0.9, 2.1, 1.3];
export const bubbleAnchor = (c: YCam): {from: Pt; at: Pt} => {
  const h = camPoint(c, [GIRL_AT[0], 1.5, GIRL_AT[2]]) ?? [540, 400], b = camPoint(c, BALL_AT) ?? [800, 300];
  const at: Pt = [Math.max(240, Math.min(740, b[0])), Math.max(300, Math.min(560, b[1]))];
  return {from: [h[0] + 30, h[1] - 40], at};
};
defShot('S01-B04-SH01', (L) => {
  const c = camSH16(L), a = bubbleAnchor(c);
  return {
    paint: (p) => paintBus(p, c, {world: 'real', t: L / 30 + 0.2, pose: 'P02', face: 'suspicious', faceState: {look: [0.3, 0.7]}, fig: undefined, rain: 364,
      extra: (q) => paintBubble(q, {...a, r: 150, pop: lin(71, 78, L), L, dropPx: 140})}),
    children: <><Edge color="#10181b" level={0.4} id="sh16edge" /><CalmBand level={0.45} id="sh16calm" /></>,
  };
});

// ---- 17. S01-B04-SH02 [1332, 1432): +0..+8 push into the bubble, match cut at +8 to the 5 mm drop (75 px/mm); the underside hollows (0 -> 0.6, 0.35 at +53), bag outline on +72.
const pushMove = camMove([[0.25, 1.0, 0.05], [0.9, 2.0, 1.2]], [-6, -6], [1.65, 1.2], [0.8, 1.7], {pitch: [12, 12], f: 1100, hy: 800, ease: [0, 1]});
defShot('S01-B04-SH02', (L) => {
  if (L < 8) {
    const c = camOf(pushMove, L / 8), a = bubbleAnchor(c);
    return {
      paint: (p) => paintBus(p, c, {world: 'real', t: L / 30 + 3.6, pose: 'P02', face: 'suspicious', faceState: {look: [0.3, 0.7]}, rain: 364, extra: (q) => paintBubble(q, {...a, r: 150 + 40 * L, pop: 1, L: 101, dropPx: 140 + 30 * L})}),
      children: <Edge color="#10181b" level={0.4} id="sh17aedge" />,
    };
  }
  const st = dropStateFor('S01-B04-SH02', L)!, u = 75, ghost: DropState = {kind: 'bag', size: 5, hollow: 0.6};
  return {
    paint: (p) => { paintDropMacro(p, {t: L / 30 + 1.1, yaw: -6 + 4 * lin(8, 99, L)}); paintDrop14(p, AT, u, st, {refract: REFRACT_REAL, seed: 53000}); },
    children: <><Edge color="#10181b" level={0.3} id="sh17edge" /><CalmBand level={0.4} id="sh17calm" /></>,
    overlay: <><Lbl /><PressArrows x={AT[0]} y0={1120} len={190} grow={1} />{L >= 72 && <DashedOutline pts={dropPx(ghost, [AT[0] + 330, AT[1]], u)} pop={lin(72, 78, L)} />}</>,
  };
});

// ---- 18. S01-B04-SH03 [1432, 1520): ruler under the 5 mm drop at +25; the underside balloons +46..+52 and bursts on +52 into 16 pieces that fall to the wet pavement.
defShot('S01-B04-SH03', (L) => {
  const u = 50 - 6 * lin(0, 52, L), st = dropStateFor('S01-B04-SH03', L)!, at: Pt = [540, 760];
  return {
    paint: (p) => { paintDropMacro(p, {t: L / 30 + 1.4, pavement: true}); paintDrop14(p, at, u, st, {refract: REFRACT_REAL, seed: 54000}); },
    children: <><Edge color="#10181b" level={0.3} id="sh18edge" /><CalmBand level={0.3} id="sh18calm" /></>,
    overlay: <><Lbl />{L >= 25 && <Ruler x={540} y={960} len={5 * u} pop={lin(25, 31, L)} />}</>,
  };
});
void PAVEMENT_Y;

// ---- 19. S01-B05-SH01 [1520, 1605): profile at the shelter edge, camera on +x; she holds her palm out past the drip line (+15..+69); first drop lands at +64, neutral -> happy.
export const camSH19 = (L: number): YCam => camOf(camMove([0.25, 0.95, 0.10], [90, 84], [1.8, 1.65], 1.0, {f: 1100, hy: 700}), L / 84);
defShot('S01-B05-SH01', (L) => {
  const c = camSH19(L);
  return {
    paint: (p) => { const mf = motionFig(c, handOutPalmUp, L / 30, {view: 'left', pose: 'P30'}); paintBus(p, c, {world: 'real', t: L / 30 + 2, view: 'left', rain: 480, rainX: [0, 540], ...mf, fig: mf.fig}); },
    children: <><Edge color="#10181b" level={0.35} id="sh19edge" /><CalmBand level={0.4} id="sh19calm" /><div style={{position: 'absolute', inset: 0, background: '#ffb35c', opacity: 0.03}} /></>,
  };
});

// ---- 20. S01-B05-SH02 [1605, 1742): her open palm up (girl tone), small drops pat it from +5, splash crowns read at +33; beads gather.
defShot('S01-B05-SH02', (L) => {
  const c = camSH20(L);
  return {
    paint: (p) => paintPalm(p, c, {L}),
    children: <><Edge color="#10181b" level={0.25} id="sh20edge" /><CalmBand level={0.35} id="sh20calm" /><div style={{position: 'absolute', inset: 0, background: '#ffb35c', opacity: 0.05}} /></>,
  };
});

// ---- 21. S01-B05-SH03 [1742, 1815): front close, slow push; she looks at her wet palm, happy -> laugh (+3..+18) -> happy by +24; rain softens.
export const camSH21 = (L: number): YCam => camOf(camMove([0.30, 0.95, 0.15], [15, 12], [1.0, 0.94], 1.0, {pitch: [-5, -5], f: 1100, hy: 760}), L / 72);
/** B05-SH03: her own screen-right arm (the rig `lArm`, the arm that went out in SH01) is held forward from the shoulder, hand open in front of her chest (`palmHeldOut`);
 * the wet look is painted on THAT hand's anchor, no separate hand. The other arm hangs. */
const wetBeads = (p: Painter, h: Pt, u: number, L: number) => {
  // a few beads on the palm, gathering through the shot (sized from the unit so they stay small: 2-3.5 mm)
  washAt(p, 21890, '#fff4e4', 70 * sm(0, 10, L), ell(h[0], h[1], 0.036 * u, 0.02 * u, 18), 0.2, 0.2); // wet sheen on the palm
  [[-0.018, 0.004, 11, 0], [0.012, -0.006, 8, 6], [0.002, 0.014, 9, 14], [-0.006, -0.014, 6.5, 24]].forEach(([dx, dy, mm, at], i) => {
    const k = sm(at, at + 8, L); if (k <= 0) return;
    const r = (mm / 1000) * u * 0.5;
    washAt(p, 21900 + i * 7, '#6b4a36', 90, ell(h[0] + dx * u + r * 0.2, h[1] + dy * u + r * 0.5, r * 1.1 * k, r * 0.5 * k, 14), 0.2, 0.2);
    paintDrop14(p, [h[0] + dx * u, h[1] + dy * u], (r * 2 * k) / mm * 1, {kind: 'bun', size: mm, flat: 0.45}, {refract: REFRACT_REAL, seed: 21950 + i * 11});
  });
};
defShot('S01-B05-SH03', (L) => {
  const c = camSH21(L), face = L < 3 ? 'happy' : L < 18 ? 'laugh' : L < 24 ? 'happy' : 'happy';
  return {
    paint: (p) => {
      const mf = motionFig(c, palmHeldOut, L / 30, {view: 'front', pose: 'P11'});
      const a = paintBus(p, c, {world: 'real', t: L / 30 + 4, view: 'front', pose: 'P11', face: face as 'happy', faceState: {look: [0.8, 0.8]}, fig: mf.fig, rain: Math.round(200 - 100 * lin(0, 72, L))});
      const u = camUnit(c, GIRL_AT);
      if (a) wetBeads(p, a.lHand, u, L);
    },
    children: <><Edge color="#10181b" level={0.3} id="sh21edge" /><CalmBand level={0.35} id="sh21calm" /><div style={{position: 'absolute', inset: 0, background: '#ffb35c', opacity: 0.05}} /></>,
  };
});
void wobble;
