import {lookUp} from '../../kit/poses-seated-reach';
import {ease, ramp} from '../clock';
import {RF} from '../roof';
import {makeShot} from '../shot';
import {orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';
import {paintBubble, paintDots} from '../thought';

// S01-B02-SH05 L03 [234, 316) (sheet #5; label off). Camera continues SH04's end (no cut), then -> orbit((-0.02, 0.88, -0.02), r 0.62, az -47, eye
// 0.70, f 1000, hy 860, pitch +12): a tiny push +0..+59 (15 % of the move), the push to her eyes +59..+81 (the rest). Staging: happy -> worried, the smile
// thins +10..+40 (flat from +26, brows worry from +31, gone by "คุณไม่มีทางรู้เลย" +31); her gaze drops from the sky to the middle distance at +47
// (look-up eases out +42..+52). Thought entry (VD09): three dotted circles rise from her head top at +61, +65, +69, and the ragged circle opens from
// the last dot at +73 (12 f bloom), becoming SH06's dissolve; dots and bubble keep the edu14 bubble language, darker (thought.ts palette).
const A: Orbit = {at: [0.02, 0.88, -0.02], r: 0.9, az: -47, eye: 0.62, f: 950, hy: 900, pitch: 17};
// Boss re-key (W5.2 r2, feasibility; Film to confirm): the kit's 4-head woman stands about 0.17 m taller in picture than the sheet's `est` head
// (head top 1.12 m): at hy 860 her head top left the frame (measured y 72) and the thought dots rose off-frame; hy 860 -> 1110 lowers the framing
// 250 px (camera position, direction and lens unchanged) so the head top sits about y 320 and the dots and bubble open inside the frame.
const B: Orbit = {at: [-0.02, 0.88, -0.02], r: 0.62, az: -47, eye: 0.7, f: 1000, hy: 1110, pitch: 12};
export const shot = makeShot('S01-B02-SH05', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const k = 0.15 * ease(L, 0, 59) + 0.85 * ease(L, 59, 81);
    const up = lookUp('front', 1 - 0.75 * ease(L, 42, 52), {lookX: -0.55 + 0.4 * ease(L, 42, 52)});
    const worried = L >= 31;
    const a = paintRoofWoman(p, orbitMix(A, B, k), roofState('S01-B02-SH05', G), {
      w: {view: 'front', t: 0.4 + G / 30, warm: 0.45, face: worried ? 'worried' : 'happy', look: up.look, fig: up.fig, faceState: {mouth: L < 10 ? 'grin' : L < 26 ? 'smile' : 'flat'}},
      fall: [1120, 98], // caption zone (as SH04; the push brings the shirt up into the band)
    });
    if (!a) return;
    // dots from the head top up and frame-left (away from the label, top-right), then the bubble opening from the last dot
    const top: [number, number] = [a.head[0] - 60, a.headTop - 10], end: [number, number] = [top[0] - 280, top[1] - 90];
    paintDots(p, {from: top, to: end, pop: ramp(L, 57, 69), size: 1.6});
    paintBubble(p, {at: [end[0] - 20, end[1] - 120], rx: 300, ry: 260, pop: ease(L, 73, 85)});
  },
});
