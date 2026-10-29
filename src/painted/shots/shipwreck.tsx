import {CameraLayer, easeOver, pushCamera, type Camera} from '../camera';
import {drawDiver} from '../diver';
import {Bubbles, Flash, Shafts, Spot, Vignette} from '../glow';
import {hash} from '../hash';
import {drawJar, type JarLook} from '../jar';
import {lerp, ramp, range, ring, rot, type Painter, type Pt} from '../painter';
import {
  SAND, SITE_LAYOUT, bands, hazeAt, paintCaustics, paintParticles, paintRain, paintRockShelves, paintSeabed, paintStormFarSea,
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

/** SH01 camera; its value at 0 is the B_loop seam framing that SH09b eases back to. */
export const SH01_LEN = 6;
const sh01Camera = (tl: number) => pushCamera(tl, SH01_LEN, {s0: 1, s1: 1.05, fx: 540, fy: 850});
/** SH01 (B01, 6.0 s): the jar scatter, nothing else. Push 1 -> 1.05 about the field's base so the leads stay above the band. */
const SH01: PaintedShot = {
  id: 'SHIPWRECK-SH01',
  serves: ['SH01'],
  paper: SITE_PAPER,
  camera: sh01Camera,
  paint: (p, ctx) => paintSite(p, ctx),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl),
  Overlay: siteOverlay(800),
};

/** SH04a (B04, 3.4 s): the SH01 field from a slightly lower angle; sand settles over the jars, light slides across. */
export const SH04A_LEN = 3.4;
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

/** SH03a (B03, 2.43 s): the ship heels in the storm, the small sail tears and flaps, rain. Lead (incl. mast) >= 480 px. */
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
export const SH03B = {flashAt: 0.35, sinkFrom: 0.4, sinkTo: 1.27, freezeAt: 1.27, drainFrom: 1.33, drainTo: 2.8};
/** SH03b (B03, 2.83 s): closer swell; the ship heels further and slips behind it; the picture freezes and drains. */
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
export const SH06 = {mixFrom: 0.5, mixTo: 1.75, pushFrom: 2.3, length: 5.7};
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


// ---------------------------------------------------------------- Editor plates (29 Oct 2026): SH02, SH04b, SH05, SH07a, SH07b, SH08, SH09a, SH09b
// Staging and timing only; art comes from the shared modules. Event times are shot-local seconds on the Premwadee +5%
// read (scripts/oldest-shipwreck/short/narration-timeline.json); src/videos/oldest-shipwreck/ places the plates.

type SiteDiver = {x: number; y: number; s: number; a: number; mirror: boolean; color: string; seed: number};
/** Hover drift and fin kick of a distant diver (no acting, VD03/B05). */
const diverPose = (d: SiteDiver, tl: number) => ({
  x: d.x + 10 * Math.sin(tl * 0.35 + d.seed), y: d.y + 6 * Math.sin(tl * 0.5 + d.seed * 2), kick: 0.05 * Math.sin(tl * 2.6 + d.seed),
});
/** Regulator point (front of the head) in world pixels: where the bubbles start. */
const diverHead = (d: SiteDiver, tl: number): Pt => {
  const {x, y} = diverPose(d, tl);
  return rot(x, y, d.s, d.a)([d.mirror ? -0.86 : 0.86, -0.1]);
};
const paintDivers = (p: Painter, divers: SiteDiver[], tl: number) => {
  p.group(2000);
  divers.forEach((d) => {
    const {x, y, kick} = diverPose(d, tl);
    drawDiver(p, x, y, d.s, d.a, kick, d.color, d.mirror);
  });
};
const DiverBubbles = ({divers, tl}: {divers: SiteDiver[]; tl: number}) => (
  <>
    {divers.map((d) => {
      const [x, y] = diverHead(d, tl);
      return <Bubbles key={d.seed} tl={tl} x={x} y={y} seed={d.seed * 40} count={10} rise={360} level={0.26} />;
    })}
  </>
);

/** Wide site (SH02, SH08): the SH01 field and slope painted at WIDE about its base, under a surface glow, so the field reads smaller and farther while the camera stays at s >= 1. */
const WIDE = 0.8;
const WIDE_PIVOT: Pt = [540, 850];
const paintSurface = (p: Painter, W: number, tl: number) => {
  // The surface seen from below: pale glow bands at the top of the water column, rippled light lines drifting.
  // Stacked translucent washes with wavy lower edges (no flat underlayer), so the glow fades into the water column.
  ['#cdeee2', '#b8e4d7', '#a2d7ca', '#8fcabe'].forEach((c, i) => {
    const bottom = 210 - i * 45;
    p.wash(c, 120, [[-160, -300], [W + 160, -300], ...range(12, (u) => [W + 160 - u * (W + 320), bottom + 18 * Math.sin(u * 7 + i * 1.3)] as Pt)], 0.08, 0.4);
  });
  p.inkStill(31, 'HB', '#f3fbf5', 1.3);
  for (let i = 0; i < 16; i++) {
    const y = 18 + hash(i + 60) * 110;
    const x0 = ((hash(i + 61) * (W + 300) + tl * (8 + 6 * hash(i + 62))) % (W + 300)) - 150;
    const len = 110 + 120 * hash(i + 63);
    p.brush.spline(range(4, (u) => [x0 + u * len, y + 7 * Math.sin(u * 6 + tl * 1.2 + i)] as Pt), 0.7);
  }
};
const paintWide = (p: Painter, {tl, width: W}: ShotContext, divers: SiteDiver[]) => {
  paintWater(p, W, 520);
  paintSurface(p, W, tl);
  const {brush} = p;
  brush.push();
  brush.translate(WIDE_PIVOT[0], WIDE_PIVOT[1]);
  brush.scale(WIDE);
  brush.translate(-WIDE_PIVOT[0], -WIDE_PIVOT[1]);
  // Shelves painted to y 2400 (inner) so the scaled set still reaches below the frame.
  paintSeabed(p, W, 2400, SITE_LAYOUT, tl);
  paintCaustics(p, W, hazeAt(SITE_LAYOUT, W, W) + 20, SITE_LAYOUT.shelfTop - 30, tl);
  paintJarField(p, SITE_JARS);
  brush.pop();
  paintDivers(p, divers, tl);
};
const wideOverlay = (divers: SiteDiver[], shift: (tl: number) => number) => {
  const WideOverlay = ({tl, camera, width, height, opacity}: ShotContext & {camera: Camera; opacity: number}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
      <Shafts tl={tl} xs={[90, 300, 520, 740, 950]} fadeY={760} shift={shift(tl)} />
      <DiverBubbles divers={divers} tl={tl} />
    </CameraLayer>
  );
  return WideOverlay;
};

/** SH02 (B02): wider view, surface glow above, the same field smaller, two distant divers (no faces), bubbles; slow pull-back (the brief's tilt dropped: it pushed sand into the band). */
export const SH02_LEN = 6.87;
const SH02_DIVERS: SiteDiver[] = [
  {x: 330, y: 330, s: 64, a: 0.22, mirror: false, color: '#173840', seed: 1},
  {x: 770, y: 262, s: 54, a: -0.18, mirror: true, color: '#21454d', seed: 2},
];
const SH02: PaintedShot = {
  id: 'SHIPWRECK-SH02',
  serves: ['SH02'],
  paper: SITE_PAPER,
  // Pull back about the field base (y 820), so the lit sand never enters the caption band (VD07).
  camera: (tl) => pushCamera(tl, SH02_LEN, {s0: 1.08, s1: 1.0, fx: 540, fy: 820}),
  paint: (p, ctx) => paintWide(p, ctx, SH02_DIVERS),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 70),
  Overlay: wideOverlay(SH02_DIVERS, () => 0),
};

/** SH08 (B08): pull back over the whole field on the slope; divers elsewhere (time has passed); shafts slide. */
export const SH08_LEN = 5.5;
const SH08_DIVERS: SiteDiver[] = [
  {x: 250, y: 330, s: 56, a: 0.1, mirror: false, color: '#21454d', seed: 3},
  {x: 830, y: 400, s: 64, a: -0.3, mirror: true, color: '#173840', seed: 4},
];
const SH08: PaintedShot = {
  id: 'SHIPWRECK-SH08',
  serves: ['SH08'],
  paper: SITE_PAPER,
  camera: (tl) => pushCamera(tl, SH08_LEN, {s0: 1.3, s1: 1.0, fx: 540, fy: 820}),
  paint: (p, ctx) => paintWide(p, ctx, SH08_DIVERS),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 70),
  Overlay: wideOverlay(SH08_DIVERS, (tl) => -90 + 180 * easeOver(tl, SH08_LEN)),
};

/** Hero-jar feature points (world px) for spot and link staging; u along mouth (0) -> base (1), side +1 is screen-up for HERO_JAR. */
const jarPoint = (j: {cx: number; cy: number; len: number; angle: number}, u: number, side: number): Pt => rot(j.cx, j.cy, j.len, j.angle)([u - 0.5, side]);

/**
 * SH04b (B04): the hero jar (VD06) on its ledge; a soft spot moves base -> handles -> lines and each feature gets a
 * boiling trace on its word (shot-local seconds of "ก้นแบน", "หูจับสองข้าง", "มีลายขีดบนผิว").
 */
export const SH04B = {len: 4.93, base: [1.43, 1.9], handles: [2.3, 3.1], lines: [3.53, 4.4]} as const;
const SH04B_SPOTS: Pt[] = [jarPoint(HERO_JAR, 0.98, 0), jarPoint(HERO_JAR, 0.38, 0.36), jarPoint(HERO_JAR, 0.26, 0.05)];
const sh04bSpot = (tl: number): {at: Pt; level: number} => {
  const toHandles = ramp(tl, SH04B.handles[0] - 0.3, SH04B.handles[0] + 0.1);
  const toLines = ramp(tl, SH04B.lines[0] - 0.3, SH04B.lines[0] + 0.1);
  const [b, h, l] = SH04B_SPOTS;
  const at: Pt = [lerp(lerp(b[0], h[0], toHandles), l[0], toLines), lerp(lerp(b[1], h[1], toHandles), l[1], toLines)];
  return {at, level: 0.28 * ramp(tl, SH04B.base[0] - 0.5, SH04B.base[0])};
};
const SH04b: PaintedShot = {
  id: 'SHIPWRECK-SH04b',
  serves: ['SH04b'],
  paper: '#2c4446',
  camera: (tl) => pushCamera(tl, SH04B.len, {s0: 1, s1: 1.03, fx: HERO_JAR.cx, fy: HERO_JAR.cy, dx: -14}),
  paint: (p, {tl, width: W, height: H}) => {
    paintHeroSeabed(p, W, H);
    drawJar(p, 900, HERO_JAR.cx, HERO_JAR.cy, HERO_JAR.len, HERO_JAR.angle, {
      ...HERO_LOOK, hero: true, solid: true,
      trace: {base: ramp(tl, ...SH04B.base), handles: ramp(tl, ...SH04B.handles), lines: ramp(tl, ...SH04B.lines)},
    });
  },
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 50),
  Overlay: ({tl, camera, width, height, opacity}) => {
    const spot = sh04bSpot(tl);
    return (
      <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
        <Shafts tl={tl} xs={[200, 470, 760]} fadeY={700} peak={0.2} />
        <Spot x={spot.at[0]} y={spot.at[1]} r={210} level={spot.level} />
      </CameraLayer>
    );
  },
};

/** SH05 (B05): a small diver (~220 px, scale by intent) hovering above one near jar in a single shaft; drift, then hold. */
export const SH05_LEN = 7.03;
const SH05_JARS: FieldJar[] = [
  [215, 400, 92, 0.18, false, 0],
  [760, 470, 104, Math.PI - 0.3, false, 0],
  [880, 640, 150, Math.PI - 0.5, true, 1],
  [560, 772, 300, 0.22, false, 2],
];
const SH05_DIVER: SiteDiver = {x: 470, y: 392, s: 84, a: 0.32, mirror: false, color: '#0f2b33', seed: 5};
const SH05: PaintedShot = {
  id: 'SHIPWRECK-SH05',
  serves: ['SH05'],
  paper: SITE_PAPER,
  camera: (tl) => pushCamera(tl, SH05_LEN * 0.6, {s0: 1, s1: 1.035, fx: 540, fy: 700}),
  paint: (p, {tl, width: W, height: H}) => {
    paintWater(p, W, hazeAt(SITE_LAYOUT, W, 0) + 60);
    paintSeabed(p, W, H, SITE_LAYOUT, tl);
    paintCaustics(p, W, hazeAt(SITE_LAYOUT, W, W) + 20, SITE_LAYOUT.shelfTop - 30, tl, '#cfe0c0', 12);
    paintJarField(p, SH05_JARS);
    paintDivers(p, [SH05_DIVER], tl);
  },
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 60),
  Overlay: ({tl, camera, width, height, opacity}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
      <Shafts tl={tl} xs={[380]} fadeY={800} />
      <DiverBubbles divers={[SH05_DIVER]} tl={tl} />
    </CameraLayer>
  ),
};

/** SH07a (B07): two upright jars side by side, teal seabed jar left, ochre reference right; three pale links on "เทียบรูปทรงและลาย". */
export const SH07A = {len: 4.0, links: [1.5, 2.6]} as const;
const SH07A_JARS = {left: {cx: 300, cy: 560, len: 500, angle: Math.PI / 2}, right: {cx: 780, cy: 560, len: 500, angle: Math.PI / 2}};
const WARM_LOOK = {body: '#c3925a', shade: '#7f5530', ink: '#3a2414', highlight: '#e6c287', inkWeight: 2};
const box = (x0: number, x1: number, y0: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const paintSplitGround = (p: Painter, W: number, H: number) => {
  // Left: the teal seabed key; right: the warm page-like ochre key (B06's ground); both dark below y ~820 (VD07).
  p.flat('#2c6670', box(-160, 552, -160, 840));
  ['#5d9f9c', '#468b8e', '#357680', '#2c6670'].forEach((c, i) => p.wash(c, 220, box(-160, 552, -160 + i * 170 - 50, -160 + (i + 1) * 170 + 50), 0.03, 0.45));
  p.wash('#4b6656', 220, box(-160, 552, 520, 840), 0.03, 0.45);
  p.flat('#b98a4e', box(528, W + 160, -160, 840));
  ['#d9b77c', '#cfa868', '#c49a5a', '#b98a4e', '#a87a42'].forEach((c, i) => p.wash(c, 220, box(528, W + 160, -160 + i * 200 - 60, -160 + (i + 1) * 200 + 60), 0.03, 0.6));
  p.flat('#1c2828', box(-160, 552, 810, H + 160));
  p.wash('#2f423b', 230, box(-160, 552, 812, 900), 0.03, 0.55);
  p.wash('#1a2626', 230, box(-160, 552, 1080, H + 160), 0.03, 0.55);
  p.flat('#22150b', box(528, W + 160, 810, H + 160));
  p.wash('#4a3018', 230, box(528, W + 160, 812, 900), 0.03, 0.5);
  p.wash('#1a1009', 230, box(528, W + 160, 1080, H + 160), 0.03, 0.5);
  // Contact shadows under both bases.
  [300, 780].forEach((x) => p.wash('#121a1a', 170, ring(x, 812, 150, 18, 16), 0.06, 0.5));
};
const SH07A_LINKS: [number, number][] = [[1, 0], [0.38, 0.36], [0.25, 0.25]];
const SH07a: PaintedShot = {
  id: 'SHIPWRECK-SH07a',
  serves: ['SH07a'],
  paper: '#2a2a24',
  camera: (tl) => pushCamera(Math.max(0, tl - SH07A.links[0]), SH07A.len - SH07A.links[0], {s0: 1, s1: 1.035, fx: 540, fy: 560}),
  paint: (p, {tl, width: W, height: H}) => {
    paintSplitGround(p, W, H);
    const link = ramp(tl, SH07A.links[0], SH07A.links[1]);
    const trace = {base: link, handles: link, lines: link};
    const {left: L, right: R} = SH07A_JARS;
    drawJar(p, 900, L.cx, L.cy, L.len, L.angle, {...HERO_LOOK, hero: true, solid: true, trace});
    drawJar(p, 950, R.cx, R.cy, R.len, R.angle, {...WARM_LOOK, hero: true, solid: true, trace, traceColor: '#fff3cf'});
    if (link <= 0) return;
    // Links from the left jar's right side to the right jar's left side (local side -1 is screen-right for an upright jar).
    p.ink(77, 'HB', '#f4e6b8', 1.8);
    SH07A_LINKS.forEach(([u, side], k) => {
      const a = jarPoint(L, u, -side), b = jarPoint(R, u, side);
      const e = ramp(tl, SH07A.links[0] + k * 0.25, SH07A.links[1] + k * 0.25);
      if (e > 0) p.brush.line(a[0], a[1], lerp(a[0], b[0], e), lerp(a[1], b[1], e));
    });
  },
};

/** SH07b (B07): back to the hero jar on the seabed in sunlight; shafts brighten (<= 0.3) toward the number. */
export const SH07B_LEN = 3.7;
const SH07b: PaintedShot = {
  id: 'SHIPWRECK-SH07b',
  serves: ['SH07b'],
  paper: '#2c4446',
  camera: (tl) => pushCamera(tl, SH07B_LEN, {s0: 1.01, s1: 1.05, fx: HERO_JAR.cx, fy: HERO_JAR.cy}),
  paint: (p, {width: W, height: H}) => {
    paintHeroSeabed(p, W, H);
    drawJar(p, 900, HERO_JAR.cx, HERO_JAR.cy, HERO_JAR.len, HERO_JAR.angle, {...HERO_LOOK, hero: true, solid: true});
  },
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 50),
  Overlay: ({tl, camera, width, height, opacity}) => (
    <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
      <Shafts tl={tl} xs={[200, 470, 760]} fadeY={700} peak={0.16 + 0.14 * ramp(tl, 0.6, 1.3)} />
    </CameraLayer>
  ),
};

/** SH09a (B09): close on one jar mouth: dark interior with a stain inside the rim; slow push in; vignette into the mouth. */
export const SH09A_LEN = 1.67;
const MOUTH = {x: 540, y: 470, rx: 210, ry: 104};
const paintJarMouth = (p: Painter, W: number, H: number) => {
  const {brush} = p;
  bands(p, W, '#264f57', ['#3f7d80', '#336c72', '#2a5d64', '#244f57'], -160, 760);
  p.wash('#3e5a50', 220, span(W, 690, 860), 0.03, 0.45);
  paintRockShelves(p, W, H, 850, 0);
  // Shoulder and neck of an upright jar seen from above, sitting on the ledge (body continues behind the shelf edge).
  const body: Pt[] = [[MOUTH.x - 180, MOUTH.y + 20], [MOUTH.x - 160, MOUTH.y + 110], [MOUTH.x - 330, MOUTH.y + 260], [MOUTH.x - 400, 862], [MOUTH.x + 400, 862], [MOUTH.x + 330, MOUTH.y + 260], [MOUTH.x + 160, MOUTH.y + 110], [MOUTH.x + 180, MOUTH.y + 20]];
  p.group(3000);
  p.flat('#8e5434', body);
  p.wash('#8e5434', 240, body, 0.05, 0.45);
  p.wash('#3f2418', 190, [[MOUTH.x + 120, MOUTH.y + 120], [MOUTH.x + 330, MOUTH.y + 260], [MOUTH.x + 400, 862], [MOUTH.x + 60, 862], [MOUTH.x + 180, MOUTH.y + 260]], 0.08, 0.4);
  p.wash('#c4875a', 130, [[MOUTH.x - 150, MOUTH.y + 130], [MOUTH.x - 300, MOUTH.y + 260], [MOUTH.x - 330, MOUTH.y + 330], [MOUTH.x - 160, MOUTH.y + 220]], 0.08, 0.5);
  // Rim, then the dark opening, then the stain band on the far inner wall.
  p.wash('#a8683f', 245, ring(MOUTH.x, MOUTH.y, MOUTH.rx, MOUTH.ry, 28), 0.04, 0.4);
  const inner = ring(MOUTH.x, MOUTH.y + 6, MOUTH.rx - 38, MOUTH.ry - 26, 28);
  p.flat('#140d0a', inner);
  p.wash('#3a2416', 200, range(14, (u) => [MOUTH.x + (MOUTH.rx - 40) * Math.cos(Math.PI + u * Math.PI), MOUTH.y + 4 + (MOUTH.ry - 28) * Math.sin(Math.PI + u * Math.PI)] as Pt).concat(range(14, (u) => [MOUTH.x + (MOUTH.rx - 70) * Math.cos(-u * Math.PI), MOUTH.y + 26 + (MOUTH.ry - 58) * Math.sin(Math.PI + (1 - u) * Math.PI)] as Pt)), 0.05, 0.5);
  p.wash('#4d4a2a', 170, range(16, (u) => [MOUTH.x - 120 + u * 240, MOUTH.y - 34 + 10 * Math.sin(u * 9) + 26 * Math.sin(u * Math.PI)] as Pt).concat([[MOUTH.x + 110, MOUTH.y - 8], [MOUTH.x - 110, MOUTH.y - 8]]), 0.1, 0.7);
  p.ink(910, 'pen', '#1e130d', 2);
  brush.noFill();
  brush.polygon(ring(MOUTH.x, MOUTH.y, MOUTH.rx, MOUTH.ry, 28));
  brush.polygon(inner);
  brush.spline([[MOUTH.x - 180, MOUTH.y + 20], [MOUTH.x - 160, MOUTH.y + 110], [MOUTH.x - 330, MOUTH.y + 260], [MOUTH.x - 400, 860]], 0.5);
  brush.spline([[MOUTH.x + 180, MOUTH.y + 20], [MOUTH.x + 160, MOUTH.y + 110], [MOUTH.x + 330, MOUTH.y + 260], [MOUTH.x + 400, 860]], 0.5);
  p.ink(911, 'HB', '#1e130d', 1.1);
  brush.spline(range(10, (u) => [MOUTH.x - 300 + u * 600, MOUTH.y + 300 + 40 * Math.sin(u * Math.PI)] as Pt), 0.5);
  brush.spline(range(10, (u) => [MOUTH.x - 290 + u * 580, MOUTH.y + 326 + 40 * Math.sin(u * Math.PI)] as Pt), 0.5);
};
const SH09a: PaintedShot = {
  id: 'SHIPWRECK-SH09a',
  serves: ['SH09a'],
  paper: '#1c2828',
  camera: (tl) => pushCamera(tl, SH09A_LEN + 1, {s0: 1, s1: 1.07, fx: MOUTH.x, fy: MOUTH.y}),
  paint: (p, {width: W, height: H}) => paintJarMouth(p, W, H),
  screen: (p, {tl, width, height}) => paintParticles(p, width, height, tl, 40),
  Overlay: ({tl, camera, width, height, opacity}) => (
    <>
      <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
        <Shafts tl={tl} xs={[260, 620]} fadeY={640} peak={0.18} />
      </CameraLayer>
      <CameraLayer camera={camera} width={width} height={height} opacity={opacity} blend="normal">
        <Vignette x={MOUTH.x} y={MOUTH.y} r={1150 - 260 * easeOver(tl, SH09A_LEN + 1)} strength={0.55} />
      </CameraLayer>
    </>
  ),
};

/**
 * SH09b (B09): ease back from one SH01 jar mouth to the exact SH01 frame-0 framing (VD09, B_loop seam). The plate
 * clock runs `tl - SH09B.end`, so at the B_loop hold (shot-local `end`) it paints SH01 at tl 0 with SH01's camera:
 * same paper, seeds, boil step, particles and shafts.
 */
export const SH09B = {ease: 1.8, end: 1.8} as const;
const SEAM_JAR = SITE_JARS[7];
const SEAM_MOUTH: Pt = rot(SEAM_JAR[0], SEAM_JAR[1], SEAM_JAR[2], SEAM_JAR[3])([-0.5, 0]);
const sh09bCamera = (c: number): Camera => {
  if (c >= 0) return sh01Camera(0);
  const e = easeOver(c + SH09B.ease, SH09B.ease);
  const end = sh01Camera(0);
  // Start on the mouth at screen (540, 420), s 1.9: tight enough to read as the same close-up, loose enough that the
  // lit sand stays out of the caption band during the ease (VD07).
  const start: Camera = {s: 1.9, fx: SEAM_MOUTH[0], fy: SEAM_MOUTH[1], dx: MOUTH.x - SEAM_MOUTH[0], dy: 420 - SEAM_MOUTH[1]};
  return {s: lerp(start.s, end.s, e), fx: lerp(start.fx, end.fx, e), fy: lerp(start.fy, end.fy, e), dx: lerp(start.dx, end.dx, e), dy: lerp(start.dy, end.dy, e)};
};
const SH09b: PaintedShot = {
  id: 'SHIPWRECK-SH09b',
  serves: ['SH09b'],
  paper: SITE_PAPER,
  clock: (tl) => Math.min(0, tl - SH09B.end),
  camera: sh09bCamera,
  paint: SH01.paint,
  screen: SH01.screen,
  Overlay: SH01.Overlay,
};

export const shipwreckShots: PaintedShot[] = [SH01, SH02, SH03a, SH03b, SH04a, SH04b, SH05, SH06_SHOT, SH07a, SH07b, SH08, SH09a, SH09b];
