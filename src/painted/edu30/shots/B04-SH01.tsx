import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';
import {crewAtDam, LF02_DAM, MEASURE} from '../looks';
import {paintDam} from '../dam';
import type {YCam} from '../../kit/ycam';

// B04-SH01 (Boss T26, 2026-11-20): the ambush waits. Frame 0 is the locked LF02 (R4) composition (`crewAtDam` + `LF02_DAM`); motion is the 0.3 m push (ease-in-out, L 0-55), the windmill wheel
// (0.25 rev/s) and the ripple dashes on the ambient clock (L / 30 s), and a breath idle on the three men (0.006 m rise, 75 f sine, seeded phase each; heads and hands fixed).
// The "แผน 2" title is the adapter's TITLES row. Space D, morning, newsreel warm strength 1 (DEFAULT_REEL).
const N = 56;
const ease = (u: number) => u * u * (3 - 2 * u);
const A = camLine({eye: [0.5, 0.85, -6.4], yaw: -110, pitch: 0, f: 950, hy: 810}), B = camLine({eye: [0.22, 0.85, -6.3], yaw: -110, pitch: 0, f: 950, hy: 810});
const CAM = (L: number): YCam => { const k = ease(Math.max(0, Math.min(1, L / 55))); return {...A, x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k, z: A.z + (B.z - A.z) * k}; };

export const def: Shot30 = {
  id: 'B04-SH01', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    MEASURE['B04-SH01'] = [];
    paintDam(p, c, 38000, {...LF02_DAM, ambient: L / 30, reflect: () => crewAtDam(p, c, 'B04-SH01-mirror', 2, true, L)});
    crewAtDam(p, c, 'B04-SH01', 2, false, L);
    if (pr) MEASURE['B04-SH01'].forEach((m) => pr.lead(m.name, {top: m.top, bottom: m.bottom, x: m.x}));
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
