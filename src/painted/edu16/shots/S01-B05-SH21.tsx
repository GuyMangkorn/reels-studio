import {ramp} from '../clock';
import {RF} from '../roof';
import {paintSH21, SH21_GLOW} from '../scenes-roof';
import {makeShot} from '../shot';

// S01-B05-SH21 W-OFF b [1472, 1495) (sheet #22). Camera camSH21 (W3 v11 approved wide), held. WOMAN `left`, right index on the rocker (SH21_HAND).
// +0..+5 lit (the SH21-ON state); +6 click (f1478): lamp and button off; +6..+13 the warm pool collapses to the 0.15 m remnant (pool 1 -> 0.3) and the
// filament glows orange and dies (SH21_GLOW 0.85 -> 0); the orange city rim takes her back and arm; +14..+22 dark, held.
export const SH21_CLICK = 6;
export const shot = makeShot('S01-B05-SH21', {
  paper: RF.zen,
  paint: (p, L) => {
    if (L < SH21_CLICK) { paintSH21(p, {on: true}); return; }
    const k = ramp(L, SH21_CLICK, 13);
    paintSH21(p, {pool: 1 - 0.7 * k, glow: SH21_GLOW * (1 - k)});
  },
});
