import {latchDeg, camRingClose, paintRingClose} from '../ring-close';
import {makeShot} from '../shot';

// S01-B01-SH04 (G 233-272, R2) RING-CLOSE, a real ring locks (L03a). Latch latchDeg(0.95 * L / 30): stage 1 at L9, locked at L18 (G251). cam = camRingClose(L / 39).
const N = 39;
export const shot = makeShot('S01-B01-SH04', {
  paper: '#05070d',
  paint: (p, L) => paintRingClose(p, camRingClose(L / N), {latch: latchDeg((0.95 * L) / 30)}),
});
