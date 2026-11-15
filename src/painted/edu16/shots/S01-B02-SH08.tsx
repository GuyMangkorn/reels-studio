import {capsule, ell, hardFill, inkLine, washAt} from '../../kit/draw';
import type {FigAnchors} from '../../kit/cast';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import {paintMitten} from '../cast';
import {ease} from '../clock';
import {paintRoof, paintStool, RF, ROOF} from '../roof';
import {lowFalloff} from '../scenes-roof';
import {makeShot} from '../shot';
import {orbitMix, roofState, type Orbit} from '../stage';

// S01-B02-SH08 L06 [489, 571) (sheet #8). Camera: orbit((-0.38, 0.38, 0.26), r 0.85 -> 0.75, az 77 -> 74, eye 0.85 -> 0.82, f 950, hy 900, pitch -29),
// push +12..+81: behind her LEFT shoulder (D5), the button (471, 955), the screen seen 28 deg off its normal (trace readable), her face out of frame.
// Back-left three-quarter of her: the kit P31 rig has no back three-quarter view, so this shot paints her as world-placed masses: the back of her head
// (bob hair, headphone band and near cup) and her left shoulder (coral cardigan) as a soft out-of-focus mass at frame right (near the lens, value
// pulled toward the night), and her right arm (shoulder -> elbow -> wrist capsules in world metres, coral sleeve) reaching across to the button with the
// UT14 pointing mitten, fingertip still about 1 cm over the lit button (unmoved since SH03). Trace on the blip clock (n 24-27: f504, f525, f546, f567).
const A: Orbit = {at: [-0.38, 0.38, 0.26], r: 0.85, az: 77, eye: 0.85, f: 950, hy: 900, pitch: -29};
const B: Orbit = {...A, r: 0.75, az: 74, eye: 0.82};
const SHO_R: V3 = [-0.04, 0.7, -0.06], ELB_R: V3 = [-0.16, 0.5, 0.13], WRI_R: V3 = [ROOF.button[0] + 0.02, ROOF.button[1] + 0.075, ROOF.button[2] - 0.01];
const HEAD: V3 = [0.02, 0.92, -0.02], SHO_L: V3 = [0.03, 0.72, 0.13];
const CARD = '#b8645a', HAIR = '#2a2630', SKIN = '#c9ad95';

const tube = (p: Painter, c: YCam, seed: number, a: V3, b: V3, ra: number, rb: number, col: string) => {
  const pa = camPoint(c, a), pb = camPoint(c, b);
  if (!pa || !pb) return null;
  const sh = capsule(pa, pb, 2 * ra * camUnit(c, a), 2 * rb * camUnit(c, b));
  hardFill(p, seed, col, sh);
  hardFill(p, seed + 1, mixColor(col, '#1a1420', 0.3), capsule([pa[0] + 3, pa[1] + ra * camUnit(c, a) * 0.4], [pb[0] + 3, pb[1] + rb * camUnit(c, b) * 0.4], ra * camUnit(c, a), rb * camUnit(c, b)));
  inkLine(p, seed + 2, sh, {color: '#2a2224', weight: 1.2, closed: true, curve: 0.2});
  return {pa, pb};
};

export const shot = makeShot('S01-B02-SH08', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const c = orbitMix(A, B, ease(L, 12, 81)), s = roofState('S01-B02-SH08', G);
    paintRoof(p, c, s, {replyAfter: true, cast: [{at: [0.04, 0, -0.08], draw: (q, cc) => paintStool(q, cc, [0.04, 0, -0.08])}]});
    // her right arm across to the button (the far arm, so the body mass painted after covers its shoulder end)
    const up = tube(p, c, 54000, SHO_R, ELB_R, 0.045, 0.04, mixColor(CARD, RF.night, 0.25));
    const fore = tube(p, c, 54010, ELB_R, WRI_R, 0.04, 0.032, mixColor(CARD, RF.night, 0.15));
    if (up && fore) {
      const a: FigAnchors = {head: [0, 0], headTop: 0, chin: 0, feet: [0, 0], rHand: fore.pb, lHand: fore.pb, rShoulder: up.pa, lShoulder: up.pa,
        rUpper: [(up.pa[0] + up.pb[0]) / 2, (up.pa[1] + up.pb[1]) / 2], lUpper: [(up.pa[0] + up.pb[0]) / 2, (up.pa[1] + up.pb[1]) / 2], top: 0, bottom: 0};
      const aim = camPoint(c, [ROOF.button[0], ROOF.button[1] + 0.01, ROOF.button[2]]);
      paintMitten(p, a, {hand: 'r', kind: 'point', side: -1, skin: SKIN, unit: camUnit(c, WRI_R), seed: 54020, aim: aim ?? undefined});
      // the button's red on the underside of the fingertip and the screen's green on the sleeve (premixed, small)
      if (aim) washAt(p, 54030, RF.button, 30, ell(aim[0], aim[1] - 6, 22, 12, 14), 0, 0);
    }
    lowFalloff(p, 53080, 1160, 50);
    // the near masses (out of focus, pulled toward the night): her left shoulder and back, then the back of her head with the headphones
    const sh = camPoint(c, SHO_L), hd = camPoint(c, HEAD);
    if (sh) {
      // a rounded out-of-focus mass, no ink: her back (a broad oval off the right edge), the shoulder cap and the upper arm hanging to the frame bottom,
      // each in three soft value steps; the lamp catches the top edge of the shoulder (premixed, UT04)
      const u = camUnit(c, SHO_L), el = camPoint(c, [0.07, 0.48, 0.2]) ?? [sh[0] + 0.05 * u, sh[1] + 0.25 * u], soft = mixColor(CARD, RF.night, 0.5);
      const steps = (seed: number, pts: (k: number) => Pt[]) => [0, 1, 2].forEach((k) => hardFill(p, seed + k, mixColor(soft, k === 2 ? '#d98a6a' : '#0e1018', k === 0 ? 0.3 : k === 1 ? 0.1 : 0.18), pts(k)));
      steps(54040, (k) => ell(sh[0] + 0.2 * u, sh[1] + 0.3 * u, 0.24 * u * (1 - 0.12 * k), 0.36 * u * (1 - 0.12 * k), 28));
      steps(54044, (k) => capsule([sh[0] + 0.01 * u * k, sh[1] + 0.01 * u * k], [el[0] + 0.01 * u * k, el[1]], 0.13 * u * (1 - 0.15 * k), 0.11 * u * (1 - 0.15 * k), 10));
      steps(54048, (k) => ell(sh[0] + 0.012 * u * k, sh[1] + 0.012 * u * k, 0.075 * u * (1 - 0.18 * k), 0.06 * u * (1 - 0.18 * k), 20));
    }
    if (hd) {
      const u = camUnit(c, HEAD), r = 0.105 * u, soft = mixColor(HAIR, RF.night, 0.2);
      hardFill(p, 54050, soft, ell(hd[0], hd[1], r * 1.02, r * 1.08, 28));
      hardFill(p, 54051, mixColor(soft, '#ffb070', 0.12), ell(hd[0] - r * 0.35, hd[1] - r * 0.25, r * 0.55, r * 0.6, 20)); // the lamp side of the bob
      const band: Pt[] = Array.from({length: 13}, (_, i): Pt => { const t = Math.PI * (1.05 + 0.9 * (i / 12)); return [hd[0] + r * 1.08 * Math.cos(t), hd[1] + r * 1.12 * Math.sin(t)]; });
      inkLine(p, 54052, band, {color: '#3a3d46', weight: 5, closed: false, curve: 0.4});
      const cup = camPoint(c, [HEAD[0] + 0.01, HEAD[1] - 0.02, HEAD[2] + 0.09]);
      if (cup) { hardFill(p, 54053, '#2a2c33', ell(cup[0], cup[1], 0.045 * u, 0.055 * u, 20)); hardFill(p, 54054, '#3a3d46', ell(cup[0] - 0.01 * u, cup[1] - 0.01 * u, 0.028 * u, 0.036 * u, 16)); }
    }
  },
});
