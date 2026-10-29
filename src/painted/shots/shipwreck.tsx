import {CameraLayer, easeOver, pushCamera, type Camera} from '../camera';
import {drawDiver} from '../diver';
import {Flash, Shafts} from '../glow';
import {hash} from '../hash';
import {drawJar, type JarLook} from '../jar';
import {ramp, range, type Painter, type Pt} from '../painter';
import {
  SAND, SITE_LAYOUT, bands, hazeAt, paintCaustics, paintParticles, paintRain, paintSeabed, paintStormFarSea,
  paintStormNearSea, paintStormSky, paintWater, span, type SeabedLayout,
} from '../sea';
import {drawShip} from '../ship';
import type {PaintedShot, ShotContext} from '../shot';

// SHIPWRECK-SHORT painted plates (brief VB-SHIPWRECK-SHORT-R1). Shot IDs follow the brief's timed shot list.
// Event times inside a shot are constants here; re-time them to the Premwadee read in this one place.

// ---------------------------------------------------------------- the jar field (SH01, SH04a, SH08 family)

/** cx, cy, length px, angle (mouth -> base), broken, depth layer (0 far, 1 mid, 2 near). Back to front. */
type FieldJar = [number, number, number, number, boolean, number];
/**
 * VD05 site scatter, 11 jars on the slope. The two far jars sit high on the upper-left slope, so the group spans
 * y ~370-853 (>= 480 px lead, Film scale baseline +/- slope deviation); every sand line stays above the band (860).
 */
export const SITE_JARS: FieldJar[] = [
  [215, 386, 92, 0.18, false, 0],
  [380, 424, 100, Math.PI - 0.3, false, 0],
  [720, 486, 108, 0.42, false, 0],
  [215, 566, 160, 1.2, false, 1],
  [650, 590, 170, 0.15, false, 1],
  [430, 604, 176, Math.PI + 0.2, false, 1],
  [880, 628, 150, Math.PI - 0.5, false, 1],
  [575, 700, 250, 1.12, false, 2],
  [285, 742, 262, -0.2, false, 2],
  [800, 752, 250, Math.PI + 0.1, true, 2],
  [500, 806, 214, 0.12, true, 2],
];
const JAR_LOOK: JarLook[] = [
  {body: '#6f7466', shade: '#4d5a55', ink: '#33433f'},
  {body: '#94603f', shade: '#563c31', ink: '#2a1e1a'},
  {body: '#a05a36', shade: '#523127', ink: '#22160f'},
];
const SAND_BY_LAYER = [SAND.far, SAND.mid, SAND.near];

/** Paint the jar field; `settle` 0..1 raises the sand line (B04 time-lapse), `squash` < 1 lowers the view angle. */
export const paintJarField = (p: Painter, jars: FieldJar[], o: {settle?: number; squash?: number; pivotY?: number} = {}) => {
  const squash = o.squash ?? 1, pivot = o.pivotY ?? 850;
  p.group(1000);
  jars.forEach(([cx, cy0, len, a, broken, layer], i) => {
    const cy = pivot - (pivot - cy0) * squash;
    const look = JAR_LOOK[layer];
    const bury = cy + len * (0.1 + 0.08 * hash(i + 120) - 0.07 * (o.settle ?? 0));
    p.wash('#4a5648', 150, [[cx - len * 0.5, bury - 4], [cx + len * 0.5, bury - 4], [cx + len * 0.42, bury + 18], [cx - len * 0.42, bury + 18]], 0.08, 0.5);
    drawJar(p, 300 + i * 10, cx, cy, len, a, {...look, broken, detail: layer > 0, bury});
    p.wash(SAND_BY_LAYER[layer], 225, [[cx - len * 0.62, bury + 6], ...range(8, (u) => [cx - len * 0.56 + u * len * 1.12, bury - 6 * Math.sin(u * 3.14) - 3 * hash(i * 9 + u * 8)] as Pt), [cx + len * 0.62, bury + 8], [cx + len * 0.4, bury + 20], [cx - len * 0.4, bury + 20]], 0.06, 0.5);
  });
};

const SITE_SHAFTS = [120, 330, 560, 760, 940];
const SITE_PAPER = '#2b4446';

/** The site plate shared by SH01 and the style test; `divers` adds the spike's two divers (S3 look test). */
export const paintSite = (p: Painter, {tl, width: W, height: H}: ShotContext, o: {layout?: SeabedLayout; settle?: number; squash?: number; divers?: boolean} = {}) => {
  const L = o.layout ?? SITE_LAYOUT;
  paintWater(p, W, hazeAt(L, W, 0) + 60);
  paintSeabed(p, W, H, L, tl);
  paintCaustics(p, W, hazeAt(L, W, W) + 20, L.shelfTop - 30, tl);
  paintJarField(p, SITE_JARS, {settle: o.settle, squash: o.squash});
  if (o.divers) {
    // Two divers above the cluster; fins kept inside the caption-safe box (x 120-888), the near one reaching a tape
    // down to the broken jar.
    p.group(2000);
    const kick = 0.05 * Math.sin(tl * 3);
    drawDiver(p, 330, 372, 72, 0.25, -kick, '#3d6c72', false);
    const hand = drawDiver(p, 610, 505, 150, -0.5, kick, '#0f2b33', true);
    p.ink(42, 'HB', '#e6cf5c', 1.5);
    p.brush.spline([hand, [hand[0] + 40, hand[1] + 90], [790, 735]], 0.4);
  }
};

const siteOverlay = (fadeY: number, shift?: (tl: number) => number) => {
  const SiteOverlay = ({tl, camera, width, height, opacity}: ShotContext & {camera: Camera; opacity: number}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
      <Shafts tl={tl} xs={SITE_SHAFTS} fadeY={fadeY} shift={shift?.(tl) ?? 0} />
    </CameraLayer>
  );
  return SiteOverlay;
};

/** SH01 (B01, 6.0 s): the jar scatter, nothing else. Push 1 -> 1.05 about the field's base so the leads stay above the band. */
const SH01: PaintedShot = {
  id: 'SHIPWRECK-SH01',
  serves: ['SH01', 'SH09b'],
  paper: SITE_PAPER,
  camera: (tl) => pushCamera(tl, 6, {s0: 1, s1: 1.05, fx: 540, fy: 850}),
  paint: (p, ctx) => paintSite(p, ctx),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl),
  Overlay: siteOverlay(800),
};

/** SH04a (B04, 3.6 s): the SH01 field from a slightly lower angle; sand settles over the jars, light slides across. */
const SH04A_LEN = 3.6;
const SH04a: PaintedShot = {
  id: 'SHIPWRECK-SH04a',
  serves: ['SH04a'],
  paper: SITE_PAPER,
  camera: (tl) => pushCamera(tl, SH04A_LEN, {s0: 1.04, s1: 1.07, fx: 540, fy: 845}),
  paint: (p, ctx) => {
    const settle = easeOver(ctx.tl, SH04A_LEN);
    paintSite(p, ctx, {settle, squash: 0.97});
    // Settling sand: still specks sinking onto the field.
    p.inkStill(60, 'pen', '#9aa88a', 1.2);
    for (let i = 0; i < 60; i++) {
      const x = hash(i + 700) * ctx.width;
      const y = 420 + ((hash(i + 701) * 420 + ctx.tl * (30 + 40 * hash(i + 702))) % 420);
      p.brush.line(x, y, x + 2, y + 4);
    }
  },
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 60),
  Overlay: siteOverlay(780, (tl) => -160 + 320 * easeOver(tl, SH04A_LEN)),
};

// ---------------------------------------------------------------- storm (B03, labelled reconstruction)

const BOLT_X = 850;
/** One cold-light moment: a strike at `at`, a dip, a re-strike (above 0.3 for about 6 frames). */
export const flashAt = (tl: number, at: number) => {
  if (tl < at || tl > at + 0.4) return 0;
  const a = Math.exp(-(tl - at) * 14);
  const b = tl > at + 0.08 ? 0.7 * Math.exp(-(tl - at - 0.08) * 10) : 0;
  return Math.min(1, a + b);
};
const STORM_SHIP = {hull: '#1c1714', sail: '#8d877a', sailShade: '#4e4a44', ink: '#0f0c0b'};

const paintStorm = (p: Painter, {tl, width: W, height: H}: ShotContext, o: {flash: number; shipY: number; heel: number; torn: number; seaBase: number}) => {
  paintStormSky(p, W);
  if (o.flash > 0.05) {
    // The bolt is ink only (no washes), so the wash seeds below never shift when it appears.
    p.ink(20, 'marker', '#eef4ff', 1.6);
    const bolt: Pt[] = range(7, (u, i) => [BOLT_X + (i === 0 ? 0 : (hash(i + 3) * 2 - 1) * 60), u * 640] as Pt);
    for (let i = 0; i < bolt.length - 1; i++) p.brush.line(...bolt[i], ...bolt[i + 1]);
    p.brush.line(...bolt[3], bolt[3][0] + 90, bolt[3][1] + 120);
  }
  paintStormFarSea(p, W, H, tl);
  p.group(500);
  drawShip(p, 200, 540, o.shipY, 330, o.heel, {...STORM_SHIP, torn: o.torn});
  p.group(800);
  paintStormNearSea(p, W, H, tl, o.seaBase);
};

const stormBob = (tl: number) => 18 * Math.sin(tl * 1.8);
const stormCamera = (tl: number, s: number): Camera => ({s, fx: 540, fy: 700, dx: 10 * Math.sin(tl * 1.7), dy: 8 * Math.sin(tl * 2.3)});

/** SH03a (B03, 2.4 s): the ship heels in the storm, the small sail tears and flaps, rain. Lead (incl. mast) >= 480 px. */
const SH03a: PaintedShot = {
  id: 'SHIPWRECK-SH03a',
  serves: ['SH03a'],
  paper: '#26303a',
  camera: (tl) => stormCamera(tl, 1.02),
  paint: (p, ctx) => paintStorm(p, ctx, {
    flash: 0, shipY: 806 + stormBob(ctx.tl), heel: -0.22 + 0.07 * Math.sin(ctx.tl * 1.8 + 0.6), torn: 0.25 + 0.75 * ramp(ctx.tl, 0.6, 1.8), seaBase: 828,
  }),
  screen: (p, {tl, width, height}) => paintRain(p, width, height, tl),
};

/** SH03b timing (shot-local s): flash on "อาจเป็นแบบนี้", sink, freeze on "หรืออาจไม่ใช่เลย", drain to paper. */
export const SH03B = {flashAt: 0.25, sinkFrom: 0.3, sinkTo: 1.5, freezeAt: 1.5, drainFrom: 1.55, drainTo: 2.45};
/** SH03b (B03, 2.6 s): closer swell; the ship heels further and slips behind it; the picture freezes and drains. */
const SH03b: PaintedShot = {
  id: 'SHIPWRECK-SH03b',
  serves: ['SH03b'],
  // Dark slate "paper" so the drained frames still pass the caption band (mean <= 0.25).
  paper: '#363d42',
  clock: (tl) => Math.min(tl, SH03B.freezeAt),
  alpha: (tl) => 1 - ramp(tl, SH03B.drainFrom, SH03B.drainTo),
  camera: (tl) => {
    const c = stormCamera(tl, 1.04 + 0.05 * easeOver(tl, SH03B.freezeAt));
    return {...c, fy: 760};
  },
  paint: (p, ctx) => {
    const sink = ramp(ctx.tl, SH03B.sinkFrom, SH03B.sinkTo);
    paintStorm(p, ctx, {
      flash: flashAt(ctx.tl, SH03B.flashAt), shipY: 806 + stormBob(ctx.tl) + 240 * sink, heel: -0.25 - 0.4 * sink + 0.05 * Math.sin(ctx.tl * 1.8), torn: 1, seaBase: 806,
    });
  },
  screen: (p, {tl, width, height}) => paintRain(p, width, height, tl),
  Overlay: ({tl, camera, width, height, opacity}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
      <Flash level={flashAt(tl, SH03B.flashAt)} />
    </CameraLayer>
  ),
};

// ---------------------------------------------------------------- hero jar and the Egyptian match (B04-B07)

/** VD06 hero jar staging: on a rock ledge, >= 600 px long, y ~400-800, fixed across SH06's match dissolve. */
export const HERO_JAR = {cx: 540, cy: 590, len: 620, angle: Math.PI + 0.08};
const HERO_LOOK = {body: '#8e5434', shade: '#3f2418', ink: '#1e130d', highlight: '#c4875a', inkWeight: 2};

const paintHeroSeabed = (p: Painter, W: number, H: number) => {
  bands(p, W, '#2c6670', ['#5d9f9c', '#468b8e', '#357680', '#2c6670'], -160, 520);
  bands(p, W, '#3e5a50', ['#55705f', '#4b6656', '#3f5a4c'], 470, 780, {bleed: 0.03});
  // The ledge under the jar, then dark shelves to the bottom (caption band stays dark).
  p.flat('#1c2828', span(W, 760, H + 160));
  p.wash('#2f423b', 235, [[-160, 770], [200, 750], [520, 780], [880, 755], [W + 160, 775], [W + 160, H + 160], [-160, H + 160]], 0.03, 0.55);
  p.wash('#435a50', 200, [[-160, 770], [200, 750], [520, 780], [880, 755], [W + 160, 775], [W + 160, 800], [880, 782], [520, 806], [200, 776], [-160, 796]], 0.04, 0.5);
  p.wash('#22322f', 230, [[-160, 1080], [400, 1050], [W + 160, 1090], [W + 160, H + 160], [-160, H + 160]], 0.03, 0.55);
  p.wash('#1a2626', 230, [[-160, 1420], [600, 1390], [W + 160, 1430], [W + 160, H + 160], [-160, H + 160]], 0.03, 0.55);
  p.wash('#4a5648', 170, [[HERO_JAR.cx - 300, 790], [HERO_JAR.cx + 300, 786], [HERO_JAR.cx + 250, 820], [HERO_JAR.cx - 250, 822]], 0.08, 0.5);
};

const paintWarmGround = (p: Painter, W: number, H: number) => {
  // Page-like ochre ground, vignetted dark below y 840 so the caption band stays readable (VD07).
  bands(p, W, '#b98a4e', ['#d9b77c', '#cfa868', '#c49a5a', '#b98a4e', '#a87a42'], -160, 780, {bleed: 0.03, texture: 0.6});
  // Faint pyramid silhouette, no text.
  p.wash('#a87c48', 150, [[600, 470], [800, 250], [1000, 470]], 0.04, 0.5);
  p.wash('#9a6e3c', 120, [[800, 250], [1000, 470], [870, 470]], 0.04, 0.5);
  bands(p, W, '#2a1a0e', ['#7a5230', '#4a3018', '#2e1c10', '#22150b', '#1a1009'], 760, H + 160, {bleed: 0.03, texture: 0.5});
};

/** SH06 timing (shot-local s): the seabed dissolves to the warm ground under the fixed jar; lands on "รูปทรงเดียวกัน". */
export const SH06 = {mixFrom: 0.6, mixTo: 2.0, pushFrom: 2.6, length: 5.5};
const SH06_SHOT: PaintedShot = {
  id: 'SHIPWRECK-SH06',
  serves: ['SH06'],
  paper: '#2c4446',
  camera: (tl) => pushCamera(Math.max(0, tl - SH06.pushFrom), SH06.length - SH06.pushFrom, {s0: 1, s1: 1.04, fx: HERO_JAR.cx, fy: HERO_JAR.cy}),
  paint: (p, {tl, width: W, height: H}) => {
    const mix = ramp(tl, SH06.mixFrom, SH06.mixTo);
    if (mix < 1) paintHeroSeabed(p.layer(1, 0), W, H);
    if (mix > 0) paintWarmGround(p.layer(mix, 3000), W, H);
    // The hero jar: opaque underlayer and still ink, so its silhouette is identical across the match.
    drawJar(p.layer(1, 6000), 900, HERO_JAR.cx, HERO_JAR.cy, HERO_JAR.len, HERO_JAR.angle, {...HERO_LOOK, hero: true, solid: true, stillInk: true});
  },
  // Sun shafts belong to the seabed and fade with it.
  Overlay: ({tl, camera, width, height, opacity}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity * (1 - ramp(tl, SH06.mixFrom, SH06.mixTo))}>
      <Shafts tl={tl} xs={[200, 470, 760]} fadeY={700} />
    </CameraLayer>
  ),
};

export const shipwreckShots: PaintedShot[] = [SH01, SH03a, SH03b, SH04a, SH06_SHOT];
