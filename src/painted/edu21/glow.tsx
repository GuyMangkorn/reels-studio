import {washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {wp} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {mirrorCam} from './road';
import {beltLipPts, bodyFaces, carSilhouette, clipPolyPainter, facing, ghQuad, greenhouseFaces, HIGH_LENS_Y, isBeltTop, PROF, WINDOWS, windowPolys} from './car';

// VD06 explanatory route glow (brief N6) and its label chip (N7). Film W3.1 look-frame build 2026-11-16, round 3 redesign (ROWS-R4 viewer
// note on R3: "neon sticker outline", "streaks, not a pool"): NO outline stroke anywhere. The warm light is a coat on the metal itself,
// graded by surface (roof rails, pillars and the bonnet/deck tops brightest, the flank bright at the shoulder and falling off to the sill,
// the nose/tail ends between), with soft brighter ridges INSIDE the silhouette; then one broad soft pool on the wet road under and beside
// the whole car and its smeared mirror image in the wet surface. Truth limits 2-4: whole skin, no single path, no exit at the wheels,
// no roof entry point, DRIVER and the glass unlit. In-canvas part: low warm washes per face (brush texture). Screen part (`GlowLight`,
// proposed to Boss): SVG gradients and blurs clipped to the projected metal of the same camera (no registration, no halo outside).

export const GLOW = {band: '#ffbe6e', ridge: '#fff0d4', level: 0.6};

type GlowOpts = {phase: 'road'; /** Paint the road spread (call before the car); otherwise the shell coat (call after the car). */ under?: boolean; level?: number;
  /** Boss W5.2 BG3: animated state (absent = LF03, everything full). */ stage?: GlowStage; /** Boss W5.2 BG3 plate design (absent = LF03). */ plate?: GlowPlate};

/** Boss W5.2 BG3 (EDU-EP21-SHEETS-R1 SH06/SH10/SH13): the route glow's animated state, every field 0..1. Absent = the LF03 look frame. */
export type GlowStage = {
  /** Roof and greenhouse frame (faces `top`, `gh`), the first to light ("กระแสไฟ"). */
  roof: number;
  /** The light running nose -> tail along the roof rails and the near shoulder line (ridge stroke travel, "ไหลไปตาม"). */
  run: number;
  /** Flank and ends (faces `side`, `end`), "เปลือกโลหะด้านนอก". */
  flank: number;
  /** Greenhouse ridges around her window +20 % at 1 ("รอบคนข้างใน"); she and the glass stay unlit. */
  ridge?: number;
  /** The flank gradient reaching down to the sill ("แล้วลงดิน"). */
  sill?: number;
  /** The road pool and its mirror in the wet surface, 0 -> full ("แล้วลงดิน"). */
  pool: number;
};
/** Boss W5.2 BG3 plate design of the glow (opt-in; the LF03 look frame keeps none of it):
 *  - `redOrange` (LF03 known defect 3): the flank light is a deeper red-orange so the desaturated red flank reads red-orange, not beige.
 *  - `fresnel` [yFull, yNone]: the wet road reflects less where the lens looks down steeply at it (near the camera), so the pool and the
 *    mirror fade from full at picture y `yFull` to none at `yNone` (fixes the LF03 caption band fail, 0.417 / 0.524).
 *  - `tight`: the pool sits under the car and beside its ends, with a narrow near-side lip (LF03's pool reached z 2.55, into the band). */
export type GlowPlate = {redOrange?: boolean; fresnel?: [number, number]; tight?: boolean;
  /** World height (m) under which the near flank falls into shade: the coat (canvas and screen) is cut there with a soft edge (SH10's push
   *  brings the lower door into the caption band). Absent or 0 = the coat to the sill. */
  flankFloor?: number;
  /** Boss W5.2 BG4 (B04-SH10 with the sag): picture y under which the coat on the metal is cut (screen: faded over the 40 px above it;
   *  canvas: clipped there). The sagged nose brought the lit bonnet into the caption band at the end of the push. Absent = unchanged. */
  coatMaxY?: number};
/** The near flank (side face on the lens side) split at world height `h`: the part above (`up`) or below. Sutherland-Hodgman on y. */
export const flankPart = (c: YCam, h: number, up = true): V3[] => {
  const s = c.z > 0 ? 1 : -1, pts = PROF.map(([x, y]) => [x, y, s * 0.851] as V3), out: V3[] = [];
  const inside = (v: V3) => (up ? v[1] >= h : v[1] <= h);
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) { const t = (h - a[1]) / (b[1] - a[1]); out.push([a[0] + t * (b[0] - a[0]), h, a[2] + t * (b[2] - a[2])]); }
  });
  return out;
};
/** Inner branch (SH10, SD13): a thin dim line from the cowl at the windscreen base inward along the dash top (surface y 0.93 at x 1.03
 *  rising to 1.0 at x 0.52) to the cluster wiring (0.52, 0.97, 0.38). Boss deviation: it leaves the cowl at z 0.55, not the sheet's 0.80:
 *  from the SH10 lens the 0.80 start is the A-pillar's foot and the whole route ran along behind the lit pillar (probe in build notes).
 *  Boss W5.2f FX2 (SHEETS-R2 D-Q13): the route rides 4-7 cm over the dash top (start (1.0, 0.98) at the windscreen base, over the hood to
 *  the top of the cluster face (0.52, 1.04)): with the eye at 0.78-1.07 m over L51-78 the dash top itself projects onto the glass's lower
 *  edge and below it (behind the door), so the R1 route was hidden; now it reads through the glass (`BranchLight` clips to it). */
export const BRANCH: V3[] = [[1.0, 0.98, 0.52], [0.84, 1.03, 0.48], [0.66, 1.06, 0.43], [0.52, 1.04, 0.38]];
/** Flank light colour of the `redOrange` plate (LF03 defect 3). */
export const FLANK = '#ff6420';
type GFace = {q: Pt[]; kind: 'side' | 'top' | 'end' | 'gh'; y0: number; y1: number};

/** Visible outer metal per surface kind (no glass, no underside), projected; y0/y1 the picture top/bottom for the face's gradient. */
export const glowFaces = (c: YCam): GFace[] => {
  const out: GFace[] = [];
  const push = (q: Pt[], kind: GFace['kind']) => { if (q.length < 3) return; const ys = q.map((v) => v[1]); out.push({q, kind, y0: Math.min(...ys), y1: Math.max(...ys)}); };
  // Boss W5.2 BG3: a lens above the beltline sees the open cabin tub, so the belt top is the two door lips there (as car.ts paints it)
  const high = c.y > HIGH_LENS_Y;
  bodyFaces().filter((f) => facing(c, f) && f.kind !== 'bottom' && !(high && isBeltTop(f))).forEach((f) => push(wp(c, f.pts), f.kind === 'side' ? 'side' : f.kind === 'top' ? 'top' : 'end'));
  // only the near lip: the far one lies behind what is inside the cabin (painted before her in car.ts), so its coat would cross her face
  if (high) push(wp(c, beltLipPts(c.z > 0 ? 1 : -1)), 'top');
  greenhouseFaces().filter((f) => facing(c, f)).forEach((f) => {
    const wins = WINDOWS[f.kind] ?? [];
    if (!wins.length) { push(wp(c, f.pts), 'gh'); return; }
    const cuts = [0, ...wins.flatMap(([a, b]) => [a, b]), 1];
    for (let k = 0; k < cuts.length; k += 2) if (cuts[k + 1] - cuts[k] > 0.001) push(wp(c, ghQuad(f.kind, cuts[k], cuts[k + 1], 0, 1)), 'gh');
    wins.forEach(([s0, s1, v0, v1]) => { push(wp(c, ghQuad(f.kind, s0, s1, v1, 1)), 'gh'); push(wp(c, ghQuad(f.kind, s0, s1, 0, v0)), 'gh'); });
  });
  return out;
};

const GH = {F: [1.05, 0.92], R: [-1.55, 0.96], TF: [0.4, 1.49], TR: [-0.98, 1.49]} as const;
/** The ridges where light gathers (roof rails, near pillars, the near shoulder line over nose, bonnet, deck and tail), as open polylines. */
export const glowRidges = (c: YCam): Pt[][] => {
  const s = c.z > 0 ? 1 : -1, P = (v: V3) => camPoint(c, v), keep = (q: (Pt | null)[]) => q.filter((v): v is Pt => !!v);
  const g = (k: keyof typeof GH, side: number): V3 => [GH[k][0], GH[k][1], side * (k.startsWith('T') ? 0.64 : 0.8)];
  return [
    keep([g('F', s), g('TF', s), g('TR', s), g('R', s)].map(P)),
    keep([g('TF', -s), g('TR', -s)].map(P)),
    keep(PROF.slice(3, 11).map(([x, y]) => P([x, y, s * 0.85]))),
  ].filter((q) => q.length > 1);
};

const zn0 = (c: YCam) => (c.z > 0 ? 1 : -1);
const ring = (x: number, z: number, rx: number, rz: number, n = 32): V3[] => Array.from({length: n}, (_, i) => [x + rx * Math.cos((i / n) * 6.283), 0.004, z + rz * Math.sin((i / n) * 6.283)] as V3);
/** Nested world ellipses of the road pool, under the whole car and out past its near side and both ends (outer first). */
export const poolRings = (c: YCam, tight = false): Pt[][] => (tight ? POOL_TIGHT : POOL_LF03).map(([rx, rz, z]) => wp(c, ring(-0.05, zn0(c) * z, rx, rz))).filter((q) => q.length > 2);
const POOL_LF03 = [[3.7, 2.1, 0.45], [3.2, 1.7, 0.45], [2.8, 1.35, 0.45], [2.45, 1.05, 0.45]];
// Boss W5.2 BG3 `tight`: the same lengths (beside both ends), centred under the car with a near-side reach of z 1.35-1.55 (was 1.5-2.55)
const POOL_TIGHT = [[3.7, 1.55, 0], [3.2, 1.4, 0], [2.8, 1.25, 0], [2.45, 1.1, 0]];

export const paintRouteGlow = (p: Painter, c: YCam, o: GlowOpts) => {
  const lv = o.level ?? GLOW.level, st = o.stage, pl = o.plate ?? {};
  if (o.under) {
    // a broad warm tint in the road under and beside the whole car (the soft pool itself is screen light, `GlowLight`)
    const q = pl.tight ? wp(c, ring(-0.05, 0, 3.2, 1.3)) : wp(c, ring(-0.05, zn0(c) * 0.45, 3.2, 1.7));
    if (q.length > 2 && (st?.pool ?? 1) > 0) washAt(p, 35000, GLOW.band, 60 * lv * (st?.pool ?? 1), q, pl.tight ? 0.3 : 0.6, 0.2);
    return;
  }
  // brush-textured warm coat on each visible metal face, by surface (tops brightest); low bleed so nothing spills past the silhouette
  const op = {top: 60, gh: 55, end: 30, side: 16};
  const floor = pl.flankFloor ?? 0;
  const pc = pl.coatMaxY ? clipPolyPainter(p, [[-10, -10], [1090, -10], [1090, pl.coatMaxY], [-10, pl.coatMaxY]]) : p;
  glowFaces(c).forEach((f, i) => {
    const k = kindLevel(f.kind, st);
    // with a flank floor the near side face's wash covers only the part above it (the one `side` face facing the lens)
    const q = floor > 0 && f.kind === 'side' ? wp(c, flankPart(c, floor)) : f.q;
    if (k > 0 && q.length > 2) washAt(pc, 35050 + i, f.kind === 'side' && pl.redOrange ? FLANK : GLOW.band, (f.kind === 'side' && pl.redOrange ? 40 : op[f.kind]) * lv * k, q, 0.03, 0.3);
  });
};

/** Stage level of a face kind (1 without a stage); the greenhouse frame takes the +20 % ridge boost. */
const kindLevel = (kind: GFace['kind'], st?: GlowStage) => (!st ? 1 : kind === 'top' ? st.roof : kind === 'gh' ? st.roof * (1 + 0.2 * (st.ridge ?? 0)) : st.flank);

const d = (q: Pt[], close = true) => `M${q.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}${close ? 'Z' : ''}`;
const STOPS: Record<GFace['kind'], [number, number, number]> = {top: [0.95, 0.8, 0.6], gh: [0.95, 0.85, 0.7], end: [0.7, 0.45, 0.25], side: [0.95, 0.3, 0.0]};

/** Screen light of the route glow for one camera: the graded coat and ridges clipped to the metal, the road pool (masked by the car) and
 *  its mirror in the wet surface (`wet`: picture polygons of the water the mirror may show in). `c` is the shot's camera.
 *  Boss W5.2 BG3 (opt-in, absent = LF03 unchanged): `stage` animates the coat, ridges and pool; `plate` the plate design (`GlowPlate`);
 *  `ids` a prefix so two GlowLights on one frame do not share SVG ids. */
export const GlowLight = ({c, wet = [], level = GLOW.level, stage, plate = {}, ids = 'ep21'}: {c: YCam; wet?: Pt[][]; level?: number;
  stage?: GlowStage; plate?: GlowPlate; ids?: string}) => {
  const faces = glowFaces(c), ridges = glowRidges(c), sil = carSilhouette(c), pools = poolRings(c, plate.tight);
  const m: YCam = mirrorCam(c), flip = (q: Pt[]) => q.map(([x, y]) => [x, 2 * c.hy - y] as Pt);
  const mfaces = glowFaces(m).map((f) => { const q = flip(f.q), ys = q.map((v) => v[1]); return {...f, q, y0: Math.min(...ys), y1: Math.max(...ys)}; });
  const I = (n: string) => `${ids}-${n}`, U = (n: string) => `url(#${I(n)})`;
  const sill = stage?.sill ?? 0, pool = stage?.pool ?? 1, run = stage?.run ?? 1;
  const grad = (id: string, f: GFace, mirror = false) => {
    const s0 = STOPS[f.kind], s: [number, number, number] = f.kind === 'side' && sill > 0 ? [s0[0], s0[1] + 0.25 * sill, s0[2] + 0.3 * sill] : s0;
    const k = mirror ? [...s].reverse() : s, col = f.kind === 'side' && plate.redOrange ? FLANK : GLOW.band;
    return <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={f.y0} y2={f.y1}>
      <stop offset="0" stopColor={col} stopOpacity={k[0]} /><stop offset="0.45" stopColor={col} stopOpacity={k[1]} /><stop offset="1" stopColor={col} stopOpacity={k[2]} />
    </linearGradient>;
  };
  const fr = plate.fresnel;
  // the near-front window frame of her door (glassR/glassL window 0), the ridge boost "around her window"
  const side = c.z > 0 ? 'glassR' : 'glassL', w0 = (WINDOWS[side] ?? [])[0];
  const winFrame = w0 ? wp(c, ghQuad(side, w0[0], w0[1], w0[2], w0[3])) : [];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: level}}>
      <defs>
        {faces.map((f, i) => grad(I(`g${i}`), f))}
        {mfaces.map((f, i) => grad(I(`m${i}`), f, true))}
        <clipPath id={I('metal')}>{faces.map((f, i) => <path key={i} d={d(f.q)} />)}</clipPath>
        {/* LF03 known defect 1 (Boss W5.2): the wet area is a feathered mask, not a hard clip, so the smear fades out at the asphalt edge */}
        <filter id={I('wetedge')} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="16 11" /></filter>
        <mask id={I('wet')} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}><g filter={U('wetedge')} fill="#fff">{wet.map((q, i) => <path key={i} d={d(q)} />)}</g></mask>
        <filter id={I('soft')} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id={I('ridge')} x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={I('pool')} x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="46 18" /></filter>
        <filter id={I('smear')} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="7 24" /></filter>
        <filter id={I('feather')}><feGaussianBlur stdDeviation="4" /></filter>
        <mask id={I('nocar')} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#fff" /><path d={d(sil)} fill="#000" filter={U('feather')} />
        </mask>
        {(plate.flankFloor ?? 0) > 0 && <mask id={I('floor')} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#fff" /><path d={d(wp(c, flankPart(c, plate.flankFloor!, false)))} fill="#000" filter={U('floorsoft')} />
        </mask>}
        <filter id={I('floorsoft')} x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
        {fr && <>
          <linearGradient id={I('fresnel-g')} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={fr[0]} y2={fr[1]}><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
          <mask id={I('fresnel')} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}><rect width={1080} height={1920} fill={U('fresnel-g')} /></mask>
        </>}
        {plate.coatMaxY && <>
          <linearGradient id={I('maxy-g')} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={plate.coatMaxY - 40} y2={plate.coatMaxY}><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
          <mask id={I('maxy')} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}><rect width={1080} height={1920} fill={U('maxy-g')} /></mask>
        </>}
      </defs>
      <g mask={fr ? U('fresnel') : undefined} opacity={pool}>
        {/* the pool on the wet road under and beside the whole car: nested soft ellipses, brightest at the centre, never at the tyres */}
        <g mask={U('nocar')}><g filter={U('pool')} fill={GLOW.band}>{pools.map((q, i) => <path key={i} d={d(q)} opacity={0.27} />)}</g></g>
        {/* the glowing car mirrored in the wet road and the verge water, smeared down the surface */}
        <g mask={U('nocar')} opacity={0.7}><g mask={U('wet')}><g filter={U('smear')}>{mfaces.map((f, i) => {
          const k = kindLevel(f.kind, stage);
          return k > 0 ? <path key={i} d={d(f.q)} fill={`url(#${I(`m${i}`)})`} opacity={Math.min(1, k)} /> : null;
        })}</g></g></g>
      </g>
      {/* the coat on the metal, graded by surface, and the brighter ridges, all inside the metal (no halo past the body edge) */}
      <g mask={plate.coatMaxY ? U('maxy') : undefined}><g clipPath={U('metal')} mask={(plate.flankFloor ?? 0) > 0 ? U('floor') : undefined}>
        <g filter={U('soft')}>{faces.map((f, i) => {
          const k = kindLevel(f.kind, stage);
          return k > 0 ? <path key={i} d={d(f.q)} fill={`url(#${I(`g${i}`)})`} opacity={Math.min(1, k)} /> : null;
        })}</g>
        {run > 0.001 && <g filter={U('ridge')} fill="none" stroke={GLOW.ridge} strokeLinecap="round" strokeLinejoin="round" opacity={1}>{ridges.map((q, i) =>
          <path key={i} d={d(q, false)} strokeWidth={30} {...(run < 1 ? {pathLength: 1, strokeDasharray: `${run.toFixed(4)} 2`} : {})} />)}</g>}
        {(stage?.ridge ?? 0) > 0 && winFrame.length > 2 && <path d={d(winFrame)} fill="none" stroke={GLOW.ridge} strokeWidth={22} filter={U('ridge')} opacity={0.2 * (stage?.ridge ?? 0)} />}
      </g></g>
    </svg>
  );
};

/** Boss W5.2f FX2 (SHEETS-R2 SD16, D-Q13): the SH10 inner branch as its own screen layer (it was a near-white 6 px stroke inside
 *  `GlowLight` at the coat's 0.6 opacity and did not read). The core is the coat's hue (`GLOW.band`) at `alpha` (0.62: its value is
 *  0.78-0.91 of the outer coat's peak value on the L55/69/78 frames, >= 0.7 and still dimmer), `width` px wide (4-6 at the end lens, <= a quarter of the coat's lit
 *  rim), drawn as far as `k` (0..1 travel), faded by `level`, with an arrival bloom of radius `bloomR` px at the cluster end at `arrive`
 *  (0..1). Branch and bloom are clipped to the near side windows and the windscreen: where the route passes behind the A-pillar foot it is
 *  hidden by the metal instead of painted over it (it reads inside). `c` the (sagged) body camera. */
export const BranchLight = ({c, k, level, arrive = 0, alpha = 0.62, width = 5, bloomR = 20, ids = 'ep21-br'}: {c: YCam; k: number; level: number;
  arrive?: number; alpha?: number; width?: number; bloomR?: number; ids?: string}) => {
  if (level <= 0 || (k <= 0 && arrive <= 0)) return null;
  const br = BRANCH.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v), end = camPoint(c, BRANCH[BRANCH.length - 1]);
  const glass = [...windowPolys(c.z > 0 ? 'glassR' : 'glassL'), ...windowPolys('windscreen')].map((w) => wp(c, w)).filter((q) => q.length >= 3);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: level}}>
      <defs>
        <clipPath id={`${ids}-gl`}>{glass.map((q, i) => <path key={i} d={d(q)} />)}</clipPath>
        <filter id={`${ids}-f`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="0.8" /></filter>
        {end && <radialGradient id={`${ids}-bl`} cx={end[0]} cy={end[1]} r={bloomR} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GLOW.band} stopOpacity={0.9} /><stop offset="0.5" stopColor={GLOW.band} stopOpacity={0.4} /><stop offset="1" stopColor={GLOW.band} stopOpacity={0} />
        </radialGradient>}
      </defs>
      <g clipPath={`url(#${ids}-gl)`}>
        {k > 0 && br.length > 1 && <path d={d(br, false)} fill="none" stroke={GLOW.band} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${ids}-f)`}
          opacity={alpha} pathLength={1} strokeDasharray={`${Math.min(1, k).toFixed(4)} 2`} />}
        {end && arrive > 0 && <circle cx={end[0]} cy={end[1]} r={bloomR} fill={`url(#${ids}-bl)`} opacity={Math.min(1, arrive)} />}
      </g>
    </svg>
  );
};

/** N7 label chip, top-left under the mark (wording "ภาพอธิบายแบบง่าย", final: the user chose it 2026-11-17, Q1 closed). Editor fixes the box against the mark. */
export const CHIP_TEXT = 'ภาพอธิบายแบบง่าย';
export const LabelChip = ({text = CHIP_TEXT}: {text?: string}) => (
  <div lang="th" style={{position: 'absolute', left: 60, top: 196, height: 60, padding: '0 22px', display: 'flex', alignItems: 'center', borderRadius: 30,
    background: 'rgba(22,26,32,0.72)', border: '2px solid rgba(255,242,204,0.85)', color: '#fff7e2', fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 700, fontSize: 34, lineHeight: 1}}>{text}</div>
);
