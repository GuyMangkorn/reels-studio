import {nearCam} from '../cast';
import {ease, lenOf, mix} from '../clock';
import {Card, Glow} from '../overlay';
import {makeShot} from '../shot';
import {CUS_AT, orbit, T_STALL} from '../soi';
import {paintSplit, SEAM} from '../split';
import {spaceCam} from '../space';

// S01-B03-SH04 (G647-760): nothing is faster than light; the race to 00:00 (L16, tick alone). R1.2: static street wide, CUS scrolls on the kit `hold_phone_chest` phone prop
// (thumb flicks L20, L60), then `pocket-phone` L102-112 (G749-759): the hand drops the phone into the hip pocket and returns to the knee, so L113 equals the B04-SH01 pose
// and no phone or screen glow appears in any later shot (SD14). Space az 8 -> 10; the clock card races from 00:30 on L102.
const ID = 'S01-B03-SH04', N = lenOf(ID);
const cams = (L: number) => {
  const e = ease(L, 0, N - 1);
  return {space: spaceCam([0.2, 0, 0.18], 8 + 2 * e, 40, 2.15, 740, 430), street: orbit(T_STALL, 26, 3.8, 1.3, 4, 900, 960)};
};
const flick = (L: number) => [20, 60].reduce((s, f) => s + (L >= f && L < f + 6 ? Math.sin(((L - f) / 6) * Math.PI) : 0), 0);

export const shot = makeShot(ID, {
  paper: '#e8dfcc',
  paint: (p, L, G) => {
    const c = cams(L), cam = c.street, holding = L < 105;
    const chest = nearCam(cam, CUS_AT, -0.03, 0.84 + 0.02 * flick(L), 0.24), pocket = nearCam(cam, CUS_AT, -0.15, 0.44, 0.04);
    const goPocket = ease(L, 102, 106), back = ease(L, 106, 112);
    const to = [0, 1, 2].map((i) => mix(chest[i], pocket[i], goPocket)) as [number, number, number];
    paintSplit(p, {G, camSpace: c.space, camStreet: cam, cus: {
      shadowFirst: true, face: L < 104 ? 'happy' : 'tired', hands: {r: {to, out: -1, k: 1 - back}, ...(L < 104 ? {l: {to: nearCam(cam, CUS_AT, 0.05, 0.8 + 0.02 * flick(L), 0.2), out: 1 as const}} : {})},
      fig: holding ? {rHold: {kind: 'phone'}} : undefined}});
  },
  overlay: (L, G) => <><Glow cam={cams(L).space} y1={SEAM} sun={0} /><Card G={G} /></>,
});
