import {GUNFIRE_PRESETS, casingKeyed, paintCasing, paintSmoke, type CasingKey} from '../../kit/gunfire';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {STONE_AT, paintDam, paintStone} from '../dam';
import {SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, lewisJamNudge, lewisPanTurn, paintLewisPanTicks, paintLewisPuff, placeBuild} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B04-SH04 (Boss T27, 2026-11-20): extreme close on the jam, hero object only (no hand, no face): the pan nudges +2 degrees over local 4..11 and stops (T13), a click at local 12
// (no flash; the puff from the port starts), the jam puff local 12..21, the jam casing (T05 `casingKeyed`, r5 keys) from the port at 13 to the stone at 17, bouncing at 19, at rest on
// its side at 21 (T10 `paintStone`), smoke wisps from the burst drifting through local 0..11 (T04 smoke at local + 47, the B04-SH03 rounds).
const N = 22;
const CAM = camLine({eye: [-5.68, 1.0, -4.45], yaw: -5, pitch: -32, f: 1100, hy: 860});
const PRE = GUNFIRE_PRESETS.B04_SH03, ROUNDS = [...PRE.rounds];
const G1: V3 = [-5.6, 0.32, -5.0], H = 0;
const SMOKE = {...PRE.smoke, seed: 7100};
const A = lewisAnchors(G1, H);
const top = (dy: number): V3 => [STONE_AT[0], STONE_AT[1] + dy, STONE_AT[2]];
const KEYS: CasingKey[] = [{L: 13, pos: A.port, angle: 0}, {L: 17, pos: top(0.05), angle: 5.8}, {L: 19, pos: top(0.09), angle: 6.78}, {L: 21, pos: top(0.05), angle: 9.42}];

export const def: Shot30 = {
  id: 'B04-SH04', N, paper: '#efe6d0',
  cam: () => CAM,
  paint: (p, L, c, pr) => {
    paintDam(p, c, 38000, {nearSlope: true});
    paintStone(p, c, STONE_AT, 8200);
    if (L >= 13) { const k = casingKeyed(KEYS, L); paintCasing(p, c, k.pos, k.angle, 0, 8400); }
    placeBuild(p, c, buildLewisGun(), G1, H, {seed: 35300, sun: SUN.morning});
    paintLewisPanTicks(p, c, 35400, G1, H, lewisPanTurn(1000, ROUNDS) + lewisJamNudge(L));
    paintSmoke(p, c, A.muzzle, L + 47, ROUNDS, SMOKE);
    paintLewisPuff(p, c, A.port, 'B04-SH04', L);
    const pp = camPoint(c, A.pan), rp = camPoint(c, A.port);   // probe leads: pan centre and port
    if (pp) pr?.lead('pan', {top: pp[1], bottom: pp[1], x: pp[0]});
    if (rp) pr?.lead('port', {top: rp[1], bottom: rp[1], x: rp[0]});
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
