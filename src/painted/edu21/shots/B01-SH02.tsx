import {camMove, camOf} from '../../kit/cam-moves';
import {washAt} from '../../kit/draw';
import {wp} from '../../kit/world';
import {B01_DRIVER, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {makeShot} from '../shot';

// B01-SH02 · G29-100 · she startles (L01b). EDU-EP21-SHEETS-R1 shot block; Boss W5.2 BG1, 2026-11-16.
// Camera `cam((-0.10, 1.05, 0.38), 25->18, 1.35->1.25, 1.12, 1100, 640)` over L0-71, linear: the lens stands outside the driver's door
// (z ~1.6), so the closed front door glass with its rain beads and sheen (<= 25 %, painted after her) is between her and the lens.
// DRIVER on the shared B01 track (match on action with SH01): hands rising L0-8 to the face (P12) and held to L40, lowered to the
// thighs L40-66 (below the beltline, never on the door frame); `surprised` -> `worried` at L44; breath L48-60. Dash dark; a light cool
// tint (the sky key only); the lower door in shade. Damage unreadable (SD12).
// Boss W5.2f FX1 (SHEETS-R2 D-Q18): `bonnetBehind` paints the end tops before her, so the rear deck edge seen through the cabin no longer
// runs as a line across her chin through the glass.

const CAM = camMove([-0.1, 1.05, 0.38], [25, 18], [1.35, 1.25], 1.12, {f: 1100, hy: 640});
const N = 71;

export const shot = makeShot({
  id: 'B01-SH02', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camOf(CAM, L / N), t = G / 30, s = B01_DRIVER(G);
    paintExterior(p, c, {t, car: {glassOp: 60, bonnetBehind: true, inside: (q, cc) => paintDriverAt(q, cc, {...s, tint: 0.1}, {t})}, tufts: []});
    // the sky key comes from above: the door under the shoulder crease falls off into shade, which also keeps the caption band (door
    // y ~0.54-0.68 m at this lens) under the edu caption luma limit (r7 clean frames: band mean 0.31-0.33 on the flat red door)
    washAt(p, 42100, '#240c0b', 170, wp(c, [[1.2, 0.28, 0.853], [-1.7, 0.28, 0.853], [-1.7, 0.7, 0.853], [1.2, 0.7, 0.853]]), 0.3, 0.3);
    washAt(p, 42101, '#240c0b', 80, wp(c, [[1.2, 0.66, 0.853], [-1.7, 0.66, 0.853], [-1.7, 0.77, 0.853], [1.2, 0.77, 0.853]]), 0.4, 0.3);
    paintRain(p, t);
  },
});
