import {ease, ramp} from '../clock';
import {forestCam, paintForest} from '../forest';
import {FOREST} from '../palette';
import {thCam} from '../scenes';
import {makeShot} from '../shot';
import {withStage} from '../stage';
import {paintFrameRim, paintVoid} from '../thought';

// S01-B05-SH18 L11 IM4 forest [1171, 1323) (sheet #19). Bubble dissolve in [1171, 1185) is the timeline's. +4..+31 the star dust thickens into ground
// mist and the black trunks rise through it: the thought void with its dust (dust 1 -> 1.6) under the forest, which fades in (layer 0 -> 1) while it
// rises 120 px into place. Camera forestCam(k), k 0 -> 1 over +14..+151 (W3 LF-FOREST approved at k 0.5); mist drifts on the ambient clock; nothing
// else moves, no eyes, figures, lights or animals; fully formed by "ป่า" (+75). Bubble rim stays on.
export const shot = makeShot('S01-B05-SH18', {
  paper: FOREST.sky,
  paint: (p, L, G) => {
    const t = 0.4 + G / 30, a = ramp(L, 4, 31), rise = 1 - ease(L, 4, 31);
    if (a < 1) paintVoid(p, {cam: thCam(0, 0.2), t, dust: 1 + 0.6 * a});
    const f = a < 1 ? p.layer(a, 9200) : p;
    if (a > 0) withStage(f, [540, 960], 1, [0, 120 * rise], () => paintForest(f, forestCam(ease(L, 14, 151)), t));
    paintFrameRim(p, {t});
  },
});
