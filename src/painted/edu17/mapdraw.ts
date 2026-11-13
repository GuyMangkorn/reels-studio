// EDU-EP17 map plate (N3, group 3): the painted G map stack in Film's approved look (LF01A, LF01B, LF07; palette `LOOK_COL`), composed by altitude with the LOD alphas of
// `lodAlpha`. Flat washes only (hardFill: wash-only, DF-20261031-paint-seed-defer); a pure function of the camera, phi and the ambient clock `t`.
//   h < 2 km     L3 neighbourhood (`paintL3Look`: K02 bowl, shophouse rows, streams) alone
//   h 2-6 km     L3 over L2 (the size cull in `paintL3Look` keeps the rise cheap)
//   h 6-1,000    L2 metro (`paintMetroLook`: fields, urban grain, rivers, roads, the fill N4) over the regional base from h 25 km
//   h 100-1,000  L2 fades over the regional base (L1 look: Gulf, land, Thailand lifted, borders, rivers, shelf, cloud wisps) which keeps the crowd patch
//   h 1,000-2,000  the globe look fades in over the base (`globeMix`); from h 2,000 the globe alone, the patch becomes the 18 px dot (canvas, not a DOM div)
// The caption-band shade `bottomShade(p, 1100, 0.40)` is on every map shot; it fades with L3 (LF01A is measured without it) and with the globe (which brings its own shade).
import {hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {builtUpAlpha} from './builtup';
import {fillShare, phiAt} from './fill';
import {G_ANCHORS, gProject, gProjectPath, gShotCam, lodAlpha, pxPerKm, smooth, type GCam} from './geo';
import {bottomShade, globeRadius, LOOK_COL, paintDot, paintGlobeLook, paintL3Look, paintMetroLook, paintStreamPass, ribbon, type GlobeOpts, type L3Opts, type MetroOpts} from './look-a-map';
import {MAP_L0, MAP_L1, province, type Flat} from './map';

export {LOOK_COL, ribbon};

/** Layer alphas below this are skipped: under one level of 255, and a wash at an alpha under 1/255 is not guaranteed to round to nothing (it gave a 9.9 diff at the h 1,000 seam). */
const EPS = 0.004;
const W = 1080, H = 1920;
const FULL: Pt[] = [[-30, -30], [W + 30, -30], [W + 30, H + 30], [-30, H + 30]];
/** Closed polygon bbox test against the picture with a margin. */
const touches = (pts: Pt[], m = 60) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return x1 >= -m && x0 <= W + m && y1 >= -m && y0 <= H + m;
};
const logSmooth = (h: number, a: number, b: number) => smooth((Math.log(h) - Math.log(a)) / (Math.log(b) - Math.log(a)));
/** Weight of the globe look over the regional base: 0 up to h 1,000 km, 1 from h 2,000 km. */
export const globeMix = (h: number) => logSmooth(h, 1000, 2000);
/** Default weight of the dot (and of the patch's disappearance) over h 2,400-6,400 km (shot 22 reaches 6,400 km at +80). */
export const dotMix = (h: number) => logSmooth(h, 2400, 6400);

const lineSet = (p: Painter, seed: number, cam: GCam, lines: Flat[], color: string, w: number) => {
  let k = 0;
  for (const xy of lines) {
    if (xy.length < 4) continue;
    const {pts} = gProjectPath(cam, xy);
    if (!touches(pts, 20)) continue;
    const keep: Pt[] = [pts[0]]; // drop sub-pixel vertices so a far line stays a clean ribbon
    for (let i = 1; i < pts.length - 1; i++) if (Math.hypot(pts[i][0] - keep[keep.length - 1][0], pts[i][1] - keep[keep.length - 1][1]) >= 0.6) keep.push(pts[i]);
    keep.push(pts[pts.length - 1]);
    if (keep.length >= 2) hardFill(p, seed + k++, color, ribbon(keep, w));
  }
};
const ringSet = (p: Painter, seed: number, cam: GCam, rings: Flat[], color: string, o: {maxDeg?: number} = {}) => {
  let k = 0;
  for (const xy of rings) {
    const {pts, hidden} = gProjectPath(cam, xy, {close: true, maxDeg: o.maxDeg});
    if (hidden === pts.length || pts.length < 3 || !touches(pts)) continue; // a ring wholly beyond the horizon draws nothing (it would otherwise collapse onto the limb)
    hardFill(p, seed + (k++ % 9000), color, pts);
  }
};

/** Neighbouring countries muted, Thailand one step lighter (brief: "neighbouring countries muted"). */
export const REGION_COL = {neighbour: '#4d5839', thailand: '#6d7652', adm1: '#8b8571', adm0: '#cfc7b0', cloud: '#e8eef2'};

/** The crowd patch at coarse scale: Bangkok's ring at its filled share, Nonthaburi's ring at its filled share (the fine fill is `paintFill` inside the metro look). */
export const paintPatch = (p: Painter, cam: GCam, phi: number) => {
  const sh = fillShare(phi), ring = (id: 'bangkok' | 'nonthaburi') => gProjectPath(cam, province(id).ring, {close: true}).pts;
  if (sh.bangkok > EPS) hardFill(p.layer(sh.bangkok, 70900), 70900, LOOK_COL.crowd, ring('bangkok'));
  if (sh.nonthaburi > EPS) hardFill(p.layer(sh.nonthaburi, 70901), 70901, LOOK_COL.crowd, ring('nonthaburi'));
};

/** Regional base (the L0 + L1 data in the look palette): Gulf, land, Thailand lifted, borders, rivers, coast shelf, the patch, cloud wisps at altitude. */
export const paintRegionLook = (p: Painter, cam: GCam, o: {phi?: number; alphaH?: number} = {}) => {
  const hA = o.alphaH ?? cam.h, A = lodAlpha(hA), px = pxPerKm(cam);
  hardFill(p, 70500, LOOK_COL.gulf, FULL);
  if (A.l0 > EPS) ringSet(p.layer(A.l0, 71000), 71000, cam, MAP_L0.rings.map((r) => r.xy), REGION_COL.neighbour, {maxDeg: 2});
  if (A.l1 > EPS) {
    const q = p.layer(A.l1, 72000);
    // coast shelf: a wider lighter band under the land edge (the silty water), then the land
    for (const xy of MAP_L1.land) if (xy.length > 60) { const {pts} = gProjectPath(cam, xy, {close: true}); if (touches(pts)) hardFill(q.layer(0.5, 72500), 72500, LOOK_COL.gulfShelf, ribbon(pts.concat([pts[0]]), Math.max(3, Math.min(9, 3.2 * px)))); }
    ringSet(q, 73000, cam, MAP_L1.land, REGION_COL.neighbour);
    ringSet(q, 74000, cam, MAP_L1.thailand, REGION_COL.thailand);
    lineSet(q.layer(0.5, 75000), 75000, cam, MAP_L1.thaiAdm1, REGION_COL.adm1, 0.8);
    lineSet(q.layer(0.7, 76000), 76000, cam, MAP_L1.adm0Lines, REGION_COL.adm0, 1.4);
    lineSet(q, 77000, cam, MAP_L1.rivers.map((r) => r.xy), LOOK_COL.outRiver, 1.2);
  }
  if (o.phi && o.phi > 0) paintPatch(p, cam, o.phi);
  // cloud wisps at altitude (world-anchored over Thailand and the Gulf, light)
  const ca = 0.2 * logSmooth(Math.max(hA, 1), 150, 600);
  if (ca > 0.004) for (let q = 0; q < 16; q++) {
    const lat = 7 + hash(q * 5) * 14, lon = 95 + hash(q * 7 + 1) * 13, rr = 0.5 + hash(q * 11) * 1.3;
    const pts: Pt[] = Array.from({length: 16}, (_, k) => { const a = (k / 16) * Math.PI * 2, g = gProject(cam, lat + rr * 0.3 * Math.sin(a), lon + (rr * Math.cos(a)) / Math.cos((lat * Math.PI) / 180)); return [g.x, g.y] as Pt; });
    if (touches(pts)) hardFill(p.layer(ca * (0.6 + 0.6 * hash(q * 3)), 78000 + q), 78000 + q, REGION_COL.cloud, pts);
  }
};

/** Caption-band shade of the rise and dive shots (1 and 16) at altitude h: 0 at the K02 frame (h 0.58; LF01A is measured without it), 0.90 from h 0.61 to 25 km (fix pass B: was 0.64 to 12; the built-up tone lies over the stage under the band up to h 60) (the band lies over beige
 * streets and fields there, not over the Gulf: measured 0.19 / 0.37 against 0.55 / 0.76 unshaded), easing to 0.50 at h 80, where shot 3 takes over (0.50 easing to the settled 0.40). */
export const bandShade = (h: number) => {
  const u0 = logSmooth(Math.max(h, 0.001), 0.582, 0.61), up = 1 - (1 - u0) ** 3, down = logSmooth(Math.max(h, 0.001), 25, 80); // fast attack: the first frames of a rise or the last of a dive
  return up * (0.9 - 0.4 * down);
};

export type PlateOpts = {
  phi?: number; t?: number;
  /** Takes the layer alphas at another altitude than the camera's (seam pair test only). */
  alphaH?: number;
  /** Streams of people along the highways (metro) and the avenues (L3): 0..1 (default 1). */
  streams?: number;
  /** Caption-band shade at the frame bottom: total darkening (default 0.40 `bandShade(h)`) from `shadeFrom` (default y 1100); it fades out with the globe. */
  shade?: number; shadeFrom?: number;
  l3?: L3Opts; metro?: MetroOpts; globe?: GlobeOpts;
  /** Dot weight 0..1 (default `dotMix(h)`); the patch gives way to it. */
  dot?: number;
  /** 0..1: the city is full, the stream paths read as solid crowd (shots 9 and 16). */
  solid?: number;
  /** Skip the L3 patch (structure tests). */
  noL3?: boolean;
};

/** The whole map plate at the camera's altitude. */
export const paintMapPlate = (p: Painter, cam: GCam, o: PlateOpts = {}) => {
  const hA = o.alphaH ?? cam.h, A = lodAlpha(hA), g = globeMix(hA), phi = o.phi ?? 0, t = o.t ?? 0, streams = o.streams ?? 1;
  if (g < 1) {
    const base = hA > 25;
    if (base) paintRegionLook(p, cam, {phi, alphaH: hA});
    if (A.l3 < 0.996 && A.l2 > EPS) paintMetroLook(base ? p.layer(A.l2, 1000) : p, cam, {outDim: 'mid', builtUp: builtUpAlpha(hA), ...o.metro, phi, overlay: base});
    if (A.l3 > EPS && !o.noL3) paintL3Look(p.layer(A.l3, 50000), cam, {gridDeg: 24, light: 'sun', streams, t, noStreams: hA >= 2, ...o.l3, fade: A.l3});
    if (hA < 90 && hA >= 0.5 && streams > 0 && !o.noL3) paintStreamPass(p, cam, {amount: streams, phi, solid: o.solid ?? 0, t, h: hA});
    const amt = (o.shade ?? bandShade(hA)) * (1 - g);
    if (amt > 0.003) bottomShade(p, o.shadeFrom ?? 1100, amt);
  }
  if (g > EPS) {
    paintGlobeLook(p.layer(g, 60000), cam, {t, sun: [-0.5, -0.866], shade: 1.2, ...o.globe, alphaH: hA}); // LF07 pick a
    const d = o.dot ?? dotMix(hA), dot = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
    // while the disc fills the frame (h 2,000-4,000 km) the band lies over lit land and sea: the same falloff, fading out as the disc shrinks to its 500 px radius
    const gs = 0.85 * smooth((globeRadius(cam) - 500) / 60) * g; // x g: it takes over from the metro band shade as the disc fades in (no step at h 1,000)
    if (gs > 0.003) bottomShade(p, 1100, gs);
    if (d < 0.996) paintPatch(p.layer(g * (1 - d), 61000), cam, phi);
    if (d > EPS) paintDot(p.layer(d, 62000), dot.x, dot.y, t);
  }
};

/** Per-shot plate options of the G shots (ROWS-R2.2): the fill clock, the staging switches and the caption-band shade (what the band measure needs over each shot's content: the
 * Gulf under it at shots 3 and 6 keeps the approved 0.40; the crowd, the land and the L1 map at shots 7-9 and 22 take up to 0.60). Editor extends it; the scene never re-derives phi. */
export const plateFor = (shot: string, f: number): PlateOpts => {
  switch (shot) {
    case 'S01-B01-SH01': return {phi: phiAt(shot, f), streams: 1, l3: {standsFull: 0.55}};
    case 'S01-B01-SH03': return {phi: phiAt(shot, f), streams: 1, shade: 0.4 + 0.1 * (1 - smooth(f / 40))};
    case 'S01-B02-SH01': return {phi: phiAt(shot, f), streams: 1, shade: 0.4};
    case 'S01-B02-SH02': return {phi: phiAt(shot, f), streams: f < 48 ? Math.max(0, 1 - f / 48) * 0.6 : 0, shade: 0.4 + 0.2 * smooth(f / 48)}; // the last trickle thins out and stops at +48
    case 'S01-B02-SH03': return {phi: 1, streams: 0, shade: 0.6};
    case 'S01-B03-SH01': return {phi: 1, streams: 1, solid: 1, shade: Math.max(0.6, bandShade(gShotCam(shot, f).h)), l3: {streams: 0}}; // the dive's last frames: the paths read as solid crowd (B-MR4)
    case 'S01-B04-SH01': return {phi: 1, streams: 1, solid: 1, l3: {streams: 0, standsFull: 1, solid: 1}}; // the filled map, the bowl packed, streets solid crowd
    case 'S01-B05-SH01': return {phi: 1, streams: 0, shade: 0.4 + 0.2 * logSmooth(gShotCam(shot, f).h, 80, 150)};
    default: return {phi: 1, streams: 0};
  }
};
