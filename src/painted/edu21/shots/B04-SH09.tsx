import {camMove, camOf} from '../../kit/cam-moves';
import {paintCabin, RADIO_BUTTON} from '../cabin';
import {B04_DRIVER, paintDriverAt} from '../driver';
import {paintRoadSet, paintStormSky, TONE_LIVE} from '../road';
import {makeShot} from '../shot';

// B04-SH09 · G765-822 · pressed, dead (L08). EDU-EP21-SHEETS-R1 shot block (SD03); Boss W5.2 BG2, 2026-11-16.
// Camera `cam((0.52, 0.92, 0.20), -102->-98, 1.34->1.24, 1.28, 700, 760, -14)` over L0-57, linear: rear-seat centre, over her LEFT
// shoulder (right-hand drive), the same rear vantage family as SH04, higher and tighter on the console.
// DRIVER back three-quarter (the eight views from her facing +x), `suspicious` (no face from behind), head turned down-left to the
// radio L5-57; N4 `new: radio reach` on the B04 track (driver.ts `B04_DRIVER`): left hand off the thigh L9, reach L9-28, fingertip on
// RADIO_BUTTON at L29 (G794), held to L39, back to the thigh L40-56; upper body 10 deg forward and 8 deg toward -z (screen left here) with
// the reach. Radio screen 20 % at L32-33 and L35, dead from L36. Cluster dark. Cabin a shade darker than pre-strike (tint 0.16).

const CAM = camMove([0.52, 0.92, 0.2], [-102, -98], [1.34, 1.24], 1.28, {f: 700, hy: 760, pitch: [-14, -14]});
const N = 57;

export const shot = makeShot({
  id: 'B04-SH09', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = {...camOf(CAM, L / N), near: 0.12}, t = G / 30, o = {t, tone: TONE_LIVE};
    const b = B04_DRIVER(G, RADIO_BUTTON);
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    paintCabin(p, c, {t, dashGlow: false, rainRun: true, radio: {light: b.light, press: b.press},
      driver: (q, cc) => paintDriverAt(q, cc, {...b.s, lean: -0.14 * b.reach.lean, tint: 0.16}, {t})});
  },
});
