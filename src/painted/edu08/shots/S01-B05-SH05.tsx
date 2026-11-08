import {camMove} from '../../kit/cam-moves';
import {tintPainter, type Pt} from '../../kit/painter';
import {ease} from '../clock';
import {AL, paintAirlock} from '../rooms';
import {AST_DEF, CREW_DEF, ZG_NEUTRAL, paintSuited} from '../suit';
import {armMix, camAt, dry, openEyesT, reachTo} from '../stage';
import {makeShot} from '../shot';

// S01-B05-SH05 (G 1679-1745, SHEETS-R2.4: time shift only, +14; R2.3 1665-1731, R2.2 1696-1762; redesign SD15) air comes back, he holds on, fade (closing, A_fade). High three-quarter two-shot of SH03/SH04's staging: her bare face, his visor, the joined gloves, the gauge
// and the amber lamp on the +x wall behind him. Lamp on L6-14 (halo <= 0.3), CREW's free glove settles on the joined hands L12-36, needle 0 -> 15 % over L12-40 then 15 -> 18 % to L66; her brows settle
// L18-30 (from SH04's 35 %, SD18), lids soften from L24 (never shut: the auto blink is stepped past on every frame, SD18), small breath L24-40; warm grade 10 % toward amber by L20. The composition fade (endFadeSec 0.8) takes the last 24 f to black.
// cam (SD15): (0.18, 0.30, 0.30), yaw 216->212, r 1.30->1.22, eye 0.80, pitch -11, f 900, hy 820.
const N = 66, cam = (L: number) => camAt(camMove([0.18, 0.3, 0.3], [216, 212], [1.3, 1.22], 0.8, {pitch: [-11, -11], f: 900, hy: 820}), L, N);
const needleAt = (L: number) => (L < 40 ? 0.15 * ease(L, 12, 40) : 0.15 + 0.03 * ((L - 40) / 26));
export const shot = makeShot('S01-B05-SH05', {
  paper: '#8a97a8',
  paint: (p0, L, G) => {
    const c = cam(L), warm = 0.1 * ease(L, 0, 20), p = warm > 0 ? tintPainter(p0, AL.amber, warm, {brush: true}) : p0;
    paintAirlock(p, c, {lamp: ease(L, 6, 14), needle: needleAt(L)});
    const k = ease(L, 12, 36), breath = ease(L, 24, 32) * (1 - ease(L, 32, 40));
    // CREW as in SH03 (lean 0.12 held from SH04), view right: the visor faces screen right toward her
    const crewO = {at: [0.4, -0.79, 0.35] as [number, number, number], view: 'right' as const, helmet: 'visor' as const, stripes: true, t: G / 30, fig: {lean: 0.12}, r: {to: [0.11, -0.265] as Pt, via: [-0.12, -0.22] as Pt}, seed: 7501};
    const cp = paintSuited(dry(p), c, CREW_DEF, crewO);
    const joined: Pt | null = cp ? cp.rHand : null;
    // his free glove settles on top of the joined gloves (0.03 m above)
    const lArm = cp && joined ? armMix(ZG_NEUTRAL('l'), reachTo(cp.lShoulder, cp.u, [joined[0], joined[1] - 0.03 * cp.u], 0.05, 0.05), k) : ZG_NEUTRAL('l');
    const crew = paintSuited(p, c, CREW_DEF, {...crewO, l: lArm});
    // AST: eyes on him (screen left), brows settle L18-30, lids soften from L24, mouth o 0.12 -> 0.18 -> 0.12
    const open = 0.12 + 0.06 * breath;
    const faceState = {brow: 'worry' as const, browTo: 'flat' as const, browMix: 0.35 + 0.65 * ease(L, 18, 30), eyes: (L >= 24 ? 'half' : 'dot') as 'half' | 'dot', look: [-0.5, 0.1] as Pt, mouth: 'o' as const, open};
    const o = {at: [-0.15, -0.62 + 0.012 * breath, 0.2] as [number, number, number], view: 'front' as const, quarter: 'left' as const, helmet: 'off' as const, face: 'neutral' as const, faceState, t: openEyesT(G / 30, 7201), rim: 0 as const, seed: 7201};
    const probe = paintSuited(dry(p), c, AST_DEF, o);
    const r = crew && probe ? reachTo(probe.rShoulder, probe.u, crew.rHand, 0.07, 0.05) : {to: [-0.22, -0.22] as Pt, via: [0.03, -0.25] as Pt};
    paintSuited(p, c, AST_DEF, {...o, r, l: ZG_NEUTRAL('l')});
  },
});
