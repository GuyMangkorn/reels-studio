import {camMove} from '../../kit/cam-moves';
import {paintHelmetProp} from '../../kit/eva';
import {Stamp} from '../../kit/screen';
import {stampState} from '../../kit/stamp';
import {helmetAt, helmetSpin} from '../clock';
import {ast, camAt, orbitBack} from '../stage';
import {makeShot} from '../shot';

// S01-B01-SH05 (G 272-293, R2) her helmet tumbles away, "สมมติ" stamp (L03b). Stamp lands L7 (G279), holds, fades from L21 into the next shot's first 6 f.
// cam (SD04 R2, SHEETS-R2.1 +0.11 m): helmet(282) = (0.83, 4.67, 1.60), yaw 10->16, r 1.6->1.5, eye 5.75, pitch -35, f 1100, hy 760.
const N = 21, cam = (L: number) => camAt(camMove([0.83, 4.67, 1.6], [10, 16], [1.6, 1.5], 5.75, {pitch: [-35, -35], f: 1100, hy: 760}), L, N);
export const STAMP_AT = (L: number) => stampState(L, {land: 7, fadeAt: 21});
export const shot = makeShot('S01-B01-SH05', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = G / 30;
    orbitBack(p, c, G);
    ast(p.layer(0.7, 3000), c, G, {motion: {id: 'zero-g-drift', t}, face: 'surprised', faceState: {mouth: 'flat'}});
    paintHelmetProp(p, c, {at: helmetAt(G), spin: helmetSpin(G), glint: 0.6, seed: 8800});
  },
  overlay: (L) => { const s = STAMP_AT(L); return s.visible ? <Stamp scale={s.scale} opacity={s.opacity} /> : null; },
});
