import {sine} from '../clock';
import {paintCutaway} from '../cutaway';
import {cutCam} from '../looks-cams';
import {makeShot} from '../stage';

// S01-B04-SH05 (G 993-1064, 71 f) the rule (L13; sheet EDU-EP17-SHEETS-R1.2, SD08 = the locked LF07 strip camera, SD34). cutCam(u), u = easeInOutSine(L / 71)
// (LF07S1 -> LF07). L21-27: the deep cable's glow lifts a touch and holds; the shallow half dims slightly. L39-63: the four boats bob once in sequence
// (SD34 -7 f: L39, L43, L47, L51 from "มันกลัวเรือ" L39; 12 f each), each chain tugs taut on the rise and hangs slack on the settle. Ambient: ripple on the top face, slow bob, particles
// in the shallow water only. No number or label.
const N = 71;
/** One bob: rise 0 -> 1 over 5 f (chain taut), settle to -0.6 (slack) by 9 f, back to 0 by 12 f. */
const bob = (L: number, a: number) => { const k = L - a; return k < 0 || k > 12 ? 0 : k < 5 ? Math.sin((k / 5) * Math.PI / 2) : k < 9 ? 1 - 1.6 * sine(k, 5, 9) : -0.6 * (1 - sine(k, 9, 12)); };
export const shot = makeShot('S01-B04-SH05', {
  paper: '#e9f2f6',
  paint: (p, L) => paintCutaway(p, cutCam(sine(L, 0, N)), {t: L / 30, deepGlow: sine(L, 21, 27), shallowDim: sine(L, 21, 27), bob: [39, 43, 47, 51].map((a) => bob(L, a))}),
});
