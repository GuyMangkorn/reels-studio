import {camPoint} from '../../kit/ycam';
import {CCTV_STILL} from '../looks';
import {starGlint} from '../props31';
import {paintRevealTable, printCorners, REVEAL} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, hump} from '../stage31';
import {probeTable, revealPool} from '../reveal31';

// B07-SH02 · F [1576, 1676) · low across the table: the photo he trusted (SCENE-R1 b07). Slow push on the blank Polaroid with the lemon half in
// front of it; the CCTV print at the right edge, soft (depth of field), leaves frame right during the push (yaw 0 -> -12). On "ขนาดนี้" the B01-SH03
// star glint (same shape, 90 px) flashes on the lemon flesh L84-90, never on the Polaroid. No label. Camera prop cheat O2 (user decision, 2026-11-21:
// keep this framing): the broken camera and its flash bar are left out of this plate; the table beyond the Polaroid's top edge falls soft to dark.
const N = 100, SHOT = 'B07-SH02';
const CAM = camMove({eye: [-0.04, 0.12, 0.22], yaw: 0, pitch: -28, f: 1000, hy: 520, near: 0.05}, {eye: [-0.05, 0.11, 0.2], yaw: -14, pitch: -28, f: 1000, hy: 520, near: 0.05}, 0, N - 1);
const L_C = REVEAL.lemon.c, L_R = REVEAL.lemon.r;

/** The far table soft and falling to dark above the Polaroid's top edge (picture row `y`): a DOM gradient, no hard line. */
const FarFalloff = ({y}: {y: number}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: Math.max(0, y + 60), background: `linear-gradient(180deg, rgba(14,8,4,0.92) 0%, rgba(14,8,4,0.78) ${Math.max(10, (y - 120) / (y + 60) * 100).toFixed(0)}%, rgba(14,8,4,0) 100%)`, backdropFilter: 'blur(3px)'}} />
);

export const def: Shot31 = {
  id: SHOT, N, paper: '#1a100a', vignette: 0.6,
  cam: CAM,
  pool: (_L, c) => revealPool(c, 0.38),
  quads: () => [{src: CCTV_STILL, corners: printCorners(), border: 0.05, pos: '50% 30%', blur: 7}],
  fx: (_L, c) => {
    const P = REVEAL.polaroid, top = camPoint(c, [P.c[0], 0, P.c[2] - P.h / 2]);
    return top ? <FarFalloff y={top[1] - 20} /> : null;
  },
  paint: (p, L, c, pr) => {
    paintRevealTable(p, c, {camera: false});
    // the glint on the wet lemon flesh, upper-left of the cut face (toward the lamp)
    const g = camPoint(c, [L_C[0] - L_R * 0.3, L_C[1], L_C[2] - L_R * 0.25]);
    if (g) starGlint(p, 38500, g[0], g[1], 90, hump(L, 84, 90));
    if (pr) { probeTable(c, pr); if (g) pr.lead('GLINT', {top: g[1], bottom: g[1], x: g[0]}); }
  },
};
export const shot = makeShot(def);
