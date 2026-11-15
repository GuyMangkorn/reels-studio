import {lookUp} from '../../kit/poses-seated-reach';
import {ease} from '../clock';
import {paintRoof, RF} from '../roof';
import {woman} from '../scenes-roof';
import {makeShot} from '../shot';
import {orbitMix, roofState, type Orbit} from '../stage';

// S01-B05-SH23 L16 + hold [1628, 1800) (sheet #24; label off, no title). Camera: orbit((0, 0.65, 0), r 1.6, az -20, eye 1.0, f 700, hy 760, pitch +12)
// -> orbit((0, 0.50, 0.80), r 15, az -20, eye 9, f 700, hy 560, pitch +22) (= camSH23, W3 v7 approved end), orbit parameters eased in-out +0..+127,
// then the 45 f hold +127..+171 is plate-owned ambient motion (the star twinkle and haze on the composition clock), not a frozen frame. WOMAN `left`,
// `neutral`, look-up, night 0.55, orange city rim; roof dark (lamp off, flat trace), the same stars as all film; nothing changes in the sky.
const A: Orbit = {at: [0, 0.65, 0], r: 1.6, az: -20, eye: 1.0, f: 700, hy: 760, pitch: 12};
const B: Orbit = {at: [0, 0.5, 0.8], r: 15, az: -20, eye: 9, f: 700, hy: 560, pitch: 22};
export const shot = makeShot('S01-B05-SH23', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const c = orbitMix(A, B, ease(L, 0, 127)), up = lookUp('left', 1);
    const s = roofState('S01-B05-SH23', G, {lamp: false});
    paintRoof(p, c, s, {sprawl: true, cast: [woman(c, {face: 'neutral', view: 'left', t: 0.4 + G / 30, look: up.look, fig: up.fig, night: 0.55, rim: '#c98a4e'}, {})]});
  },
});
