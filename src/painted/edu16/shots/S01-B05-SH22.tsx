import {tintPainter} from '../../kit/painter';
import {lookUp} from '../../kit/poses-seated-reach';
import type {YCam} from '../../kit/ycam';
import {ease, mix, ramp} from '../clock';
import {LogbookText} from '../logbook';
import {RF} from '../roof';
import {camSH22, lowFalloff, MEASURE_MODE, paintSH22Pages} from '../scenes-roof';
import {makeShot} from '../shot';
import {LF_WOMAN, paintRoofWoman, roofState} from '../stage';

// S01-B05-SH22 L15 [1495, 1628) (sheet #23; label off from +0). Camera camSH22 {x -0.56, y 0.66, z 0.56, yaw -8, pitch -47, f 1050, hy 820, near
// 0.05} (W3 v8 approved start) held +0..+63, then pan and tilt up from the same point -> {yaw +40, pitch +22, hy 800} +63..+105, hold +105..+132. The
// full roof is painted (lamp off, flat trace, night grade) so the pan finds her; the logbook pages keep the W3 cold page light (paintSH22Pages) and the
// rows are DOM text mapped through the moving camera (LogbookText c). "เงียบ" readable through "ยังเงียบ" (+64); +73 her eyes go up (look-up eased
// +73..+84); the camera arrives on her face looking at the sky over "แต่ถ้ามันใช่" (+79..+117).
// Boss re-key (W5.2 r3, feasibility; Film to confirm): at the sheet's end {yaw +40, f 1050, hy 800} the kit woman's head fills the frame (measured head
// centre (711, 540), chin 930, top cropped; sheet est head top 664, chin 1122). The pan now also eases the lens f 1050 -> 580 and ends at yaw +43,
// hy 1040, so her face lands near the sheet's (head centre ~ (600, 890)) with sky above her. The roof is darkened toward the W3 SH22 start (tint 0.45).
const DEG = Math.PI / 180;
export const camSH22At = (L: number): YCam => {
  const k = ease(L, 63, 105);
  return {...camSH22, yaw: mix(-8, 43, k) * DEG, pitch: mix(-47, 22, k) * DEG, hy: mix(820, 1040, k), f: mix(1050, 580, k)};
};
// W5.5 (caption zone, Requirement): mid-pan (+74..+86) the lit logbook page swept the band y 1176-1344 while C17 shows (p95 0.67). A low falloff from
// y 1100 eases in +66..+73 (after the approved +63 frame, the pan already moving), holds while the page crosses, and eases out +88..+98 (page gone,
// before the arrival frame +105). Pan, lens and look-up timing unchanged.
const PAN_FALL = 110;
export const shot = makeShot('S01-B05-SH22', {
  paper: '#14161e',
  paint: (p, L, G) => {
    const c = camSH22At(L), up = lookUp('front', ease(L, 73, 84), {lookX: -0.2});
    paintRoofWoman(MEASURE_MODE.on ? p : tintPainter(p, '#14161e', 0.45, {brush: true}), c, roofState('S01-B05-SH22', G, {lamp: false}), {
      w: {view: 'front', face: 'neutral', t: 0.4 + G / 30, reach: undefined, night: 0.55, rim: '#c98a4e', warm: 0, look: up.look, fig: up.fig, mitts: [...(LF_WOMAN.mitts ?? []), {hand: 'r', kind: 'rest', side: 1, skin: '#b39e8b'}]}, point: null, fall: null,
    });
    paintSH22Pages(p, c);
    const fa = PAN_FALL * ramp(L, 66, 73) * (1 - ramp(L, 88, 98)); // W5.5: caption band during the pan only (0 to +66 and from +98)
    if (fa > 0 && !MEASURE_MODE.on) lowFalloff(p, 53090, 1100, fa);
  },
  overlay: (L) => <LogbookText c={camSH22At(L)} />,
});
