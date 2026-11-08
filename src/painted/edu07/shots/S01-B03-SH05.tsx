import {nearCam} from '../cast';
import {ease, lenOf, ramp} from '../clock';
import {Card, Glow} from '../overlay';
import {paintPhone, phoneWorld, screenGlow} from '../phone';
import {makeShot} from '../shot';
import {CUS_AT, orbit} from '../soi';
import {paintSplit, SEAM} from '../split';
import {spaceCam} from '../space';

// S01-B03-SH05 (G559-647): CUS laughs at a cat clip on his phone (V01 snort-laugh L14-33, L15 "แล้วไม่มีใครเตือนเลยเหรอ" L42-76). NEW in R1.2. Split frame:
// space panel continues SH01 (az 7 -> 8, Earth on the polyline), street panel is a CLOSE on CUS (SD13 est camera, tuned to the accept numbers), clipped below the seam.
// Phone: thumb flick L0-4, the cat clip from L4 (`cat-orange-tabby`, `startle-hop` at clip time L - 6), laugh L14-33, still smiling to the cut. No alert of any kind.
/** Last frame's measured anchors (px), read by the QA probe. */
export const MEASURE_SH05: {last?: unknown} = {};
const ID = 'S01-B03-SH05', N = lenOf(ID);
const cams = (L: number) => {
  const e = ease(L, 0, N - 1);
  return {space: spaceCam([0.2, 0, 0.18], 7 + e, 40, 2.15, 740, 430), street: orbit([1.4, 1.0, 0.35], 8 + 3 * e, 1.55 - 0.05 * e, 1.05, 0, 1000, 1060)};
};
const bounce = (L: number) => (L >= 14 && L < 36 ? Math.abs(Math.sin(((L - 14) * Math.PI) / 5)) * Math.min(1, (36 - L) / 8) : 0);

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const c = cams(L), laugh = L >= 14 && L < 34, flick = L < 4 ? Math.sin((L / 4) * Math.PI) : 0;
    const pc = phoneWorld(c.street), hand = nearCam(c.street, CUS_AT, -0.2, 0.95, 0.28);
    paintSplit(p, {G, camSpace: c.space, camStreet: c.street, cus: {
      shadowFirst: true, face: laugh ? 'laugh' : 'happy', faceState: laugh ? undefined : {look: [-0.7, 0.55]}, hands: {r: {to: hand, out: -1}},
      fig: {rise: 0.012 * bounce(L), nod: [0, 0.05 * bounce(L)], headCock: -4},
      over: (q, cc, a) => {
        const ph = paintPhone(q, cc, pc, {clipT: L < 4 ? -1 : (L - 6) / 30, thumb: flick, tilt: -0.1});
        MEASURE_SH05.last = {headTop: a.headTop, chin: a.chin, head: a.head, phone: ph?.box, screen: ph?.screen};
        screenGlow(q, [a.head[0], a.chin], a.chin - a.headTop, -1, 1);
      }}});
  },
  overlay: (L, G) => <><Glow cam={cams(L).space} y1={SEAM} sun={0} /><Card G={G} /></>,
});
void ramp;
