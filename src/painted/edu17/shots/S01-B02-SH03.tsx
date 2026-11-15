import {hardFill, inkLine} from '../../kit/draw';
import {mixColor, type Pt} from '../../kit/painter';
import {ellBand, paintBubble, paintHeli, paintMotorway} from '../analogy';
import {lin, mix, sine} from '../clock';
import {C, sheetCam} from '../palette';
import {makeShot} from '../stage';
import {paintYardShot} from '../yardshot';

// S01-B02-SH03 (G 380-541, 161 f) helicopter vs motorway (L05, L06; sheet EDU-EP17-SHEETS-R1.2, LF04, SD30: every event at or after L56 -12 f). MAN from behind, head and shoulder lower right
// (hose-flow arms as the LF04 look, left hand on the slack; FLOW). Bubble (LF04: centre (520, 540), 450 x 340) pops L0-6 with its tail to his head. Inside (screen plane, px): the toy helicopter lifts one
// crate of four glowing cubes off the ground L14-30 and bobs, drifting left to right (L10-66); the crate swings L44-62; page-turn wipe L66-77 (right to left);
// motorway (20 light lanes) from L77; the lanes squeeze to the centre line L121-138 and roll into one thin glowing cable by L158; hold to L161.
// Picture-stage push of the contents 1.0 -> 1.10 (L0-66), 1.0 -> 1.08 (L77-161). Camera sheet((-0.1, 1.5, -3), yaw 2 -> 6, r 4.1, eye 1.85, 760, 740).
const N = 161;
const AT: Pt = [520, 540], RX = 450, RY = 340, IX = RX * 0.86, IY = RY * 0.86;
const cam = (L: number) => sheetCam([-0.1, 1.5, -3], mix(2, 6, sine(L, 0, N)), 4.1, 1.85, {f: 760, hy: 740});
export const shot = makeShot('S01-B02-SH03', {
  paper: '#a9cfe6',
  paint: (p, L) => {
    const t = L / 30;
    const {man} = paintYardShot(p, cam(L), {t, arms: 'hose-flow', hose: {state: 'flow', amt: 1, lHold: true}, view: 'back', face: 'neutral'});
    const tail: Pt = man ? [man.head[0] - 60, man.headTop - 10] : [800, 1000];
    const pop = lin(L, 0, 6);
    paintBubble(p, AT, RX, RY, tail, {pop: L >= 6 ? undefined : pop});
    if (L < 6) return;
    const xw = L < 66 ? 1e9 : mix(AT[0] + IX, AT[0] - IX - 30, sine(L, 66, 77));
    if (L < 77) {
      // helicopter scene: a strip of ground, the toy helicopter with its crate
      const k = mix(1, 1.1, sine(L, 0, 66)), s = Math.min(RX, RY) * 0.3 * k, ground = AT[1] + RY * 0.78;
      const g = ellBand(AT, IX, IY, ground, AT[1] + IY);
      if (g.length) hardFill(p, 9190, mixColor(C.sand, C.bubSky, 0.3), g);
      const lift = sine(L, 14, 30), hubY0 = ground - 3.25 * s, hubY1 = AT[1] - RY * 0.5;
      const bob = L > 30 ? 7 * Math.sin((L - 30) / 30 * Math.PI * 2 * 0.9) : 0;
      const hx = AT[0] + RX * 0.08 + mix(-50, 50, sine(L, 10, 66)), hy = mix(hubY0, hubY1, lift) + bob;
      const swing = 0.08 * Math.sin(t * 2.2) + (L >= 44 && L <= 62 ? 0.7 * Math.sin(((L - 44) / 18) * Math.PI * 2) * (1 - lin(L, 44, 62)) : 0);
      paintHeli(p, [AT[0] + (hx - AT[0]) * k, AT[1] + (hy - AT[1]) * k], s, swing);
    }
    if (L >= 66) {
      const k = L < 77 ? 1 : mix(1, 1.08, sine(L, 77, N));
      paintMotorway(p, AT, IX, IY, {t, k, xFrom: xw, squeeze: sine(L, 121, 138), roll: sine(L, 138, 158)});
      if (L < 77) {
        // the turning page: a pale strip trailing the edge, ink on the edge
        const strip = ellBand(AT, IX, IY, AT[1] - IY, AT[1] + IY, xw - 22, xw);
        if (strip.length) hardFill(p, 9180, mixColor(C.bubFill, '#ffffff', 0.4), strip);
        const e = ellBand(AT, IX, IY, AT[1] - IY, AT[1] + IY, xw - 1.2, xw);
        if (e.length) inkLine(p, 9181, e, {closed: true, color: C.bubEdge, weight: 1, still: true, curve: 0});
      }
    }
  },
});
