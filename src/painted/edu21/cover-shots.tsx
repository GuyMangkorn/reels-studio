import {camMove, camOf, type CamMove} from '../kit/cam-moves';
import {STILL_CAMERA} from '../kit/camera';
import {Flash} from '../kit/glow';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {Bolt, BOLT_W, boltEnv, boltPaths, paintStrikeRim, type BoltOpts} from './bolt';
import {paintCabin} from './cabin';
import {B01_DRIVER, paintDriverAt, type DriverState} from './driver';
import {paintExterior, paintRain} from './exterior';
import {paintRoadSet, paintStormSky, TONE_LIVE} from './road';

// EDU-EP21-SHORT-PIC-COVERS cover-only plates (Film, 2026-11-17; cover-design skill pick 1, docs/cover-principles.md CV07).
// Reason for new plates: the film's strike frames (B01-SH01 G12-16, B05-SH13 L143/L161) hold the car at ~600 px wide with a thin bolt and
// no readable face; at 120 px the strike reads as a grey line. These plates reuse the locked SET-ROAD21 / CAR21 / DRIVER / bolt assembly
// (paintExterior, paintCabin, paintDriverAt, Bolt, paintStrikeRim; same palette and seeds) with a cover camera only. Every event is in the
// film: the bolt on the near rear roof edge with her inside (B01-SH01 G12, double stroke), her startle with hands near the face (B01-SH02,
// B01_DRIVER G37), the bonnet strike seen with her in the cabin (B05-SH13 E2, L161). Cover-only push (CV07): her startle is drawn on
// the stroke frame (in the film it peaks ~0.8 s after it). Never shown (CV04): the route glow on the shell (B02-SH06, B05-SH13 echo),
// the chip, the damaged tyre (B03-SH08), the dead dash (B04). The tyre stays intact (SH01 shows no damage, SD12).
// Kept in its own inventory (src/painted/shots/edu21-covers.tsx) so the episode's shot inventory does not import it.

const W = (...p: [number, number, number][]): V3[] => p;
/** B01-SH01 strike: tip T on the near rear roof edge and the same channel and branches (copied, shot files are not imported). */
const T: V3 = [-0.7, 1.49, 0.62];
const ROOF_BOLT: BoltOpts = {
  top: 70, seed: 41000,
  path: W(T, [-0.62, 1.95, 0.6], [-0.78, 2.45, 0.55], [-0.5, 2.95, 0.5], [-0.58, 3.45, 0.4], [-0.25, 4.0, 0.3], [-0.3, 4.6, 0.2], [0.05, 5.4, 0.1], [0.2, 6.5, 0]),
  branches: [
    W([-0.5, 2.95, 0.5], [-1.15, 2.25, 0.55], [-1.35, 1.95, 0.5]),
    W([-0.25, 4.0, 0.3], [-0.1, 3.25, 0.4], [0.2, 2.95, 0.35], [0.35, 2.7, 0.35]),
    W([-0.3, 4.6, 0.2], [-0.85, 3.85, 0.3], [-1.2, 3.55, 0.3]),
    W([0.05, 5.4, 0.1], [0.4, 4.45, 0.2], [0.8, 4.1, 0.2]),
  ],
};
/** B05-SH13 E2 bonnet strike (copied): tip on the bonnet top at x 1.60. */
const T2: V3 = [1.6, 0.873, 0.7];
const BONNET_BOLT: BoltOpts = {
  top: 70, seed: 43600,
  path: W(T2, [1.7, 1.3, 0.55], [1.55, 1.75, 0.5], [1.85, 2.25, 0.45], [1.75, 2.8, 0.4], [2.05, 3.4, 0.3], [1.95, 4.0, 0.2], [2.3, 4.8, 0.1]),
  branches: [W([1.85, 2.25, 0.45], [2.25, 2.05, 0.45], [2.55, 1.9, 0.4]), W([2.05, 3.4, 0.3], [2.5, 3.15, 0.3], [2.8, 3.05, 0.25]), W([1.95, 4.0, 0.2], [2.45, 3.95, 0.2], [2.85, 3.75, 0.15])],
};
/** Full return stroke (d 0 of the envelope). */
const FULL = boltEnv('double', 0);
/** Composition clock for rain and her figure boil: the strike frame of B01-SH01. */
const G = 12;
const STARTLE: DriverState = {...B01_DRIVER(37), tint: 0.1};

type Ext = {id: string; cam: CamMove; driver?: DriverState; flash?: number; w?: number; flare?: {r: number; glow: number}; rain?: number};
const ext = (o: Ext): PaintedShot => {
  const c: YCam = camOf(o.cam, 0), t = G / 30, s = o.driver ?? STARTLE;
  return {
    id: o.id, serves: ['B01-SH01'], paper: '#262e38', camera: () => STILL_CAMERA,
    paint: (p) => {
      paintExterior(p, c, {t, car: {dashGlow: false, inside: (q, cc) => paintDriverAt(q, cc, s, {t})}});
      paintStrikeRim(p, c, camPoint(c, T), 1);
      paintRain(p, t, {count: o.rain ?? 260, color: '#eef4ff'});
    },
    Overlay: ({opacity}) => {
      const k = o.w ?? 1, w = {...BOLT_W, core: [BOLT_W.core[0] * k, BOLT_W.core[1] * k] as [number, number], body: BOLT_W.body * k, halo: BOLT_W.halo * k};
      return <div style={{position: 'absolute', inset: 0, opacity}}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Flash level={o.flash ?? 0.4} /></svg>
        <Bolt b={boltPaths(c, ROOF_BOLT)} env={FULL} w={w} flare={o.flare ?? {r: 26, glow: 140}} id={`${o.id}-bolt`} />
        <Grain opacity={0.05} />
      </div>;
    },
  };
};

/** Picture point of the bonnet strike as a CSS position (the windscreen's lightning glow is centred on it). */
const glowAt = (c: YCam): string => { const q = camPoint(c, T2); return q ? `${q[0].toFixed(0)}px ${q[1].toFixed(0)}px` : '50% 40%'; };

/** Near half of the windscreen (car.ts GH: F (1.05, 0.92, 0.80) -> TF (0.40, 1.49, 0.64), to the centreline z 0) as a CSS clip polygon
 *  through `c`; the far corners sit on the passenger lens's image plane, and the bolt lands on the near side. */
const windscreenClip = (c: YCam): string => {
  const q: V3[] = [[1.05, 0.92, 0.8], [0.4, 1.49, 0.64], [0.4, 1.49, 0], [1.05, 0.92, 0]];
  const pts = q.map((v) => camPoint(c, v)).filter((v): v is [number, number] => !!v);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`;
};

/** C5 odd view: the passenger-seat lens (SH12 family) turned toward the windscreen: her startled profile, the bonnet strike outside. */
const INSIDE_CAM = camMove([0.46, 1.05, 0.57], [207, 207], 1.05, 1.12, {f: 420, hy: 900, pitch: [2, 2]});
const inside = (): PaintedShot => {
  const c: YCam = {...camOf(INSIDE_CAM, 0), near: 0.12}, t = G / 30, o = {t, tone: TONE_LIVE};
  return {
    id: 'EDU21-COVER-INSIDE', serves: ['B05-SH13'], paper: '#262e38', camera: () => STILL_CAMERA,
    paint: (p) => {
      paintStormSky(p, c, o);
      paintRoadSet(p, c, o);
      paintCabin(p, c, {t, dashGlow: false, rainRun: true, lens: 'side', sheen: 0.6, radio: {light: 0, press: 0},
        driver: (q, cc) => paintDriverAt(q, cc, {...STARTLE, tint: 0.05}, {t})});
    },
    Overlay: ({opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Flash level={0.35} /></svg>
      <div style={{position: 'absolute', inset: 0, clipPath: windscreenClip(c)}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at ' + glowAt(c) + ', rgba(235,242,255,0.75) 0, rgba(200,215,255,0.35) 220px, rgba(200,215,255,0) 520px)', mixBlendMode: 'screen'}} />
        <Bolt b={boltPaths(c, BONNET_BOLT)} env={FULL} w={{...BOLT_W, core: [12, 8], body: 30, halo: 90}} flare={{r: 40, glow: 240}} id="edu21-cv-inside-bolt" />
      </div>
      <Grain opacity={0.05} />
    </div>,
  };
};

export const edu21CoverShots: PaintedShot[] = [
  // C1 danger moment: low poster lens under the rear quarter, the car looming, the bolt filling the sky onto the roof above her.
  ext({id: 'EDU21-COVER-STRIKE', cam: camMove([-0.15, 1.0, 0.4], [28, 28], 3.6, 0.4, {f: 820, hy: 1150, pitch: [10, 10]}), w: 1.6}),
  // C2 face and emotion: her startled face through the side glass, the bolt landing on the roof edge just above and behind her head.
  ext({id: 'EDU21-COVER-FACE', cam: camMove([-0.3, 1.2, 0.5], [22, 22], 1.7, 1.2, {f: 1000, hy: 900, pitch: [6, 6]}), w: 1.8, flare: {r: 34, glow: 180}}),
  // C3 subject close: the near rear tyre huge and intact at the strike (the rubber of L01), the bolt on the roof above.
  ext({id: 'EDU21-COVER-TYRE', cam: camMove([-1.3, 0.55, 0.85], [24, 24], 1.45, 0.18, {f: 760, hy: 1100, pitch: [24, 24]}), w: 1.6}),
  // C4 scale shock: the whole car small at the foot of a giant bolt under the storm sky.
  ext({id: 'EDU21-COVER-WIDE', cam: camMove([-3.2, 3.5, 0], [35, 35], 13, 1.0, {f: 1000, hy: 1330, pitch: [8, 8]}), w: 1.4, flare: {r: 22, glow: 110}, rain: 200}),
  // C5 odd view: from the passenger seat (SH12 lens family), her startled profile and the bonnet strike through the windscreen.
  inside(),
];
