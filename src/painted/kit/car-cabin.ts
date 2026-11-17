import {bodyFrame, type CastDef} from './cast';
import {paintFigureAt} from './figure-at';
import type {ExpressionId} from './expressions';
import type {FaceState} from './head';
import {inkLine} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {paintBox, qy, qz, wFill, wInk} from './world';
import {camPoint, type YCam} from './ycam';

/** Cabin look primitives, Film W3 prototype. Metres: +x front, +y up, +z near side.
 * One yaw projector owns all geometry. No clocks, episode staging or renderer changes.
 * W5.2 (Boss, 16 Nov 2026): restrained upper-torso lean about the fixed hip, a torso-following shoulder belt, a fixed-length
 * tether solved from the neck offset `u`, and `cabinDriveAt`, a pure frame function that turns accelerate / cruise / brake keys
 * into those two numbers. Every default (lean 0, u 0) paints exactly the approved LF20-CABIN-B look. */
export type CabinPalette = {shell: string; seat: string; seatShade: string; floor: string; trim: string; sky: string; land: string; sun: string};
export type PassengerPlacement = {root: V3; person: CastDef};
export type TetheredBalloon = {anchor: V3; centre: V3; radius: number; color: string};
export const passengerSupport = ({root: [x, y, z], person}: PassengerPlacement) => {
  const b = bodyFrame(person, {view: 'right', sit: 1});
  return {hip: [x + b.hipU, y + b.hipV, z] as V3, cushion: y + b.hipV - 0.048};
};
const shape = (p: Painter, c: YCam, id: number, color: string, pts: V3[]) => wFill(p, c, id, color, pts);
const line = (p: Painter, c: YCam, id: number, pts: V3[], color: string, weight = 0.8) => wInk(p, c, id, pts, {closed: false, color, weight});
const quad = (z: number, pts: Pt[]): V3[] => pts.map(([x, y]) => [x, y, z]);

/** Far-window ground band (x, y on the z = -0.83 plane): the land wash, and the clip of the moving road strip. */
const LAND_Z = -0.83;
const LAND: Pt[] = [[-0.51, 0.78], [2.20, 0.78], [2.05, 0.98], [-0.46, 0.98]];

/** Moving exterior seen through the closed far window (W5.2b, Boss, 16 Nov 2026). `offset` is the distance travelled in
 * metres on the window plane (scenery moves toward -x, the rear, by that much); `speed` is metres per frame. The strip's
 * look never depends on speed except a fade-in below `ROAD_SPEED_FULL`, so a stopped car (speed 0) paints exactly the
 * still look and, above that, acceleration, steady speed and braking read only through how fast the strip scrolls. */
export type RoadStrip = {offset: number; speed: number};
export type RoadKey = {at: number; speed: number};
/** Speed (m/frame) at and above which the strip is at full (still low) contrast; below it the strip fades toward the land. */
export const ROAD_SPEED_FULL = 0.0004;
/** Repeat length of the roadside pattern (m). Marks enter and leave only through the band clip, so the wrap never pops. */
export const ROAD_TILE = 1.6;
const ROAD_MARKS: {x: number; w: number; y0: number; h: number; tint: 'sky' | 'trim'; amt: number; round?: boolean}[] = [
  // Far-lane dashes on the road surface.
  {x: 0.10, w: 0.22, y0: 0.800, h: 0.010, tint: 'sky', amt: 0.5},
  {x: 0.90, w: 0.22, y0: 0.800, h: 0.010, tint: 'sky', amt: 0.5},
  // Verge posts and two unequal low shrubs, so the repeat does not read as a metronome.
  {x: 0.35, w: 0.025, y0: 0.835, h: 0.05, tint: 'trim', amt: 0.32},
  {x: 1.15, w: 0.025, y0: 0.835, h: 0.05, tint: 'trim', amt: 0.32},
  {x: 0.55, w: 0.30, y0: 0.835, h: 0.07, tint: 'trim', amt: 0.14, round: true},
  {x: 1.32, w: 0.19, y0: 0.835, h: 0.045, tint: 'trim', amt: 0.12, round: true},
];
const ssr = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x * x * (3 - 2 * x); };
/** Convex clip (Sutherland-Hodgman) of a polygon by the land band, in window-plane x-y. */
const clipToLand = (poly: Pt[]): Pt[] => {
  let out = poly;
  for (let i = 0; i < LAND.length && out.length; i++) {
    const a = LAND[i], b = LAND[(i + 1) % LAND.length];
    // LAND is counter-clockwise (y up), so inside is to the left of a->b.
    const side = (q: Pt) => (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
    const src = out; out = [];
    for (let j = 0; j < src.length; j++) {
      const p0 = src[j], p1 = src[(j + 1) % src.length], s0 = side(p0), s1 = side(p1);
      if (s0 >= 0) out.push(p0);
      if ((s0 >= 0) !== (s1 >= 0)) { const t = s0 / (s0 - s1); out.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]); }
    }
  }
  return out;
};
/** Low-contrast straight road strip in the far window's land band. Painted only for a moving car (see `RoadStrip`). */
export const paintRoadStrip = (p: Painter, c: YCam, pal: CabinPalette, road: RoadStrip) => {
  const k = ssr(Math.abs(road.speed) / ROAD_SPEED_FULL);
  if (!(k > 0)) return 0;
  let n = 0;
  // Road surface along the bottom of the band (static: a uniform strip shows no motion).
  shape(p, c, 4000, mixColor(pal.land, pal.trim, 0.2 * k), quad(LAND_Z, clipToLand([[-1, 0.78], [3, 0.78], [3, 0.835], [-1, 0.835]])));
  const x0 = LAND[0][0] - 0.35, x1 = LAND[1][0] + 0.05;
  ROAD_MARKS.forEach((m, i) => {
    const color = mixColor(pal.land, m.tint === 'sky' ? pal.sky : pal.trim, m.amt * k);
    // Instance j of mark i sits at m.x + j * ROAD_TILE - offset; j is its stable identity (and seed) while it crosses.
    for (let j = Math.ceil((x0 - m.x + road.offset) / ROAD_TILE); m.x + j * ROAD_TILE - road.offset <= x1; j++) {
      const x = m.x + j * ROAD_TILE - road.offset;
      const pts: Pt[] = m.round
        ? Array.from({length: 9}, (_, s): Pt => [x + m.w / 2 - Math.cos(s / 8 * Math.PI) * m.w / 2, m.y0 + Math.sin(s / 8 * Math.PI) * m.h])
        : [[x, m.y0], [x + m.w, m.y0], [x + m.w, m.y0 + m.h], [x, m.y0 + m.h]];
      const q = clipToLand(pts);
      if (q.length >= 3) { shape(p, c, 4001 + i * 100 + (((j % 100) + 100) % 100), color, quad(LAND_Z, q)); n++; }
    }
  });
  return n;
};
/** Speed (m/frame, never below 0) at `frame` for speed `keys`: held before the first and after the last key, smoothstep
 * between consecutive keys (equal neighbours hold). */
export const roadSpeedAt = (frame: number, keys: RoadKey[]): number => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (!ks.length) return 0;
  const v = (k: RoadKey) => Math.max(0, k.speed);
  if (frame <= ks[0].at) return v(ks[0]);
  for (let i = 1; i < ks.length; i++) if (frame <= ks[i].at) return v(ks[i - 1]) + (v(ks[i]) - v(ks[i - 1])) * ssr((frame - ks[i - 1].at) / (ks[i].at - ks[i - 1].at));
  return v(ks[ks.length - 1]);
};
/** Road strip state at `frame`: the exact integral of `roadSpeedAt` from frame 0 (offset 0 at frame 0), in closed form, so
 * any frame is evaluated directly (seek parity) and the offset never decreases. */
export const roadStripAt = (frame: number, keys: RoadKey[]): RoadStrip => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (!ks.length) return {offset: 0, speed: 0};
  const v = (k: RoadKey) => Math.max(0, k.speed);
  // Distance from the first key to f; smoothstep integral: int_0^x (3s^2 - 2s^3) ds = x^3 - x^4 / 2.
  const dist = (f: number) => {
    if (f <= ks[0].at) return v(ks[0]) * (f - ks[0].at);
    let d = 0;
    for (let i = 1; i < ks.length; i++) {
      const a = v(ks[i - 1]), b = v(ks[i]), D = ks[i].at - ks[i - 1].at;
      const x = D > 0 ? Math.min(1, (f - ks[i - 1].at) / D) : 1;
      d += D * (a * x + (b - a) * (x ** 3 - x ** 4 / 2));
      if (f <= ks[i].at) return d;
    }
    return d + v(ks[ks.length - 1]) * (f - ks[ks.length - 1].at);
  };
  return {offset: dist(frame) - dist(0), speed: roadSpeedAt(frame, ks)};
};

/** Far enclosure, exterior and seats. Near side is a labelled illustrative cutaway. Without `road` (or with a stopped
 * road, speed 0) the exterior is the still approved land band. */
export const paintCabinBack = (p: Painter, c: YCam, pal: CabinPalette, passenger: PassengerPlacement, finished = false, road?: RoadStrip) => {
  // Far door: the sky is contained within its closed, continuous pane perimeter.
  shape(p, c, 201, pal.shell, qz(-0.85, -0.65, 2.45, 0, 1.65));
  const pane = quad(-0.84, [[-0.52, 0.77], [2.21, 0.77], [1.87, 1.52], [-0.42, 1.52]]);
  shape(p, c, 202, pal.sky, pane);
  shape(p, c, 203, pal.land, quad(LAND_Z, LAND));
  if (road) paintRoadStrip(p, c, pal, road);
  line(p, c, 204, [[-0.42, 1.52, -0.82], [1.87, 1.52, -0.82], [2.21, 0.77, -0.82], [-0.52, 0.77, -0.82], [-0.42, 1.52, -0.82]], pal.trim, 1.1);
  shape(p, c, 205, pal.shell, qz(-0.81, 0.82, 0.89, 0.77, 1.54));
  // Small edge sheen only: never a veil across the rope, belt or face.
  line(p, c, 206, [[0.94, 1.48, -0.80], [1.81, 1.48, -0.80]], pal.sun, 1);
  line(p, c, 207, [[-0.5, 0.66, -0.80], [2.2, 0.66, -0.80]], pal.trim);
  paintBox(p, c, 210, {x0: 0.44, x1: 0.69, y0: 0.57, y1: 0.62, z0: -0.81, z1: -0.76}, pal.trim);
  shape(p, c, 220, pal.floor, qy(0, -0.65, 2.45, -0.85, 2.3));
  const {hip, cushion} = passengerSupport(passenger);
  const rearX = hip[0] - 0.21;
  paintBox(p, c, 230, {x0: rearX, x1: hip[0] + 0.34, y0: cushion - 0.16, y1: cushion, z0: -0.64, z1: 0.22}, pal.seat);
  // Curved seat back/headrest silhouettes remain world-space polygons.
  shape(p, c, 240, pal.seatShade, quad(-0.10, [[rearX - 0.09, cushion], [rearX + 0.13, cushion], [rearX + 0.10, 1.05], [rearX - 0.06, 1.07]]));
  paintBox(p, c, 245, {x0: rearX - 0.07, x1: rearX + 0.11, y0: 1.02, y1: 1.22, z0: -0.40, z1: -0.08}, pal.seat);
  line(p, c, 248, [[rearX, cushion - 0.06, 0.23], [hip[0] + 0.30, cushion - 0.06, 0.23]], pal.seatShade);
  // Front seat back is the unambiguous front/right cue, set behind the hero.
  shape(p, c, 250, pal.seatShade, quad(-0.17, [[1.23, 0.12], [1.49, 0.12], [1.44, 0.22], [1.34, 1.01], [1.29, 1.08], [1.12, 1.08], [1.10, 1.01]]));
  line(p, c, 252, [[1.18, 1.05, -0.16], [1.18, 1.16, -0.16]], pal.trim, 1.5);
  line(p, c, 253, [[1.28, 1.05, -0.16], [1.28, 1.16, -0.16]], pal.trim, 1.5);
  shape(p, c, 255, pal.seat, quad(-0.16, [[1.08, 1.13], [1.34, 1.13], [1.37, 1.16], [1.37, 1.30], [1.34, 1.33], [1.08, 1.33], [1.05, 1.30], [1.05, 1.16]]));
  // Roof and rear shell are continuous, without an open-window gap.
  shape(p, c, 260, pal.shell, quad(0.12, [[-0.65, 1.65], [1.99, 1.65], [2.45, 0.94], [2.35, 0.88], [1.88, 1.53], [-0.54, 1.53], [-0.57, 0.05], [-0.65, 0.05]]));
  // Floor-mat ribs/contact landmarks, subdued and entirely below the hands.
  for (let i = 0; i < 5; i++) line(p, c, 270 + i, [[0.16 + i * 0.12, 0.004, -0.08], [0.16 + i * 0.12, 0.004, 0.38]], pal.trim, 0.5);
  if (finished) {
    // Upholstery seams and a quiet warm window reflection describe materials.
    line(p, c, 281, [[rearX + 0.04, 0.99, -0.09], [rearX + 0.07, cushion + 0.10, -0.09]], mixColor(pal.seat, pal.shell, 0.25), 1.1);
    line(p, c, 282, [[rearX + 0.03, cushion + 0.006, 0.23], [hip[0] + 0.28, cushion + 0.006, 0.23]], mixColor(pal.seat, pal.shell, 0.22), 1.2);
    line(p, c, 284, [[1.22, 0.27, -0.155], [1.15, 0.98, -0.155]], mixColor(pal.seat, pal.shell, 0.23), 1.2);
    // Small floor mat and broad contact shadow stay below the passenger.
    shape(p, c, 285, mixColor(pal.floor, '#151e28', 0.3), qy(0.006, -0.06, 0.58, -0.12, 0.24));
    line(p, c, 286, [[-0.02, 0.008, 0.24], [0.55, 0.008, 0.24]], mixColor(pal.floor, pal.seat, 0.2), 1);
  }
};

/** Acting on the seated passenger. `lean` is the shoulder offset in metres along the car's +x (front) relative to the fixed
 * hip: + forward (braking), - rearward into the seat (acceleration). Pelvis, feet, lap hands and seat never move. */
export type PassengerAct = {lean?: number; face?: ExpressionId; faceState?: Partial<FaceState>};
/** Largest supported shoulder offset (m): the belt and lap reach hold to about 10 degrees of torso tilt. */
export const PASSENGER_LEAN_MAX = 0.09;
/** Shoulder anchor height above the seated hip (m) for this person: the radius the lean turns about. */
export const passengerTorsoRadius = (person: CastDef): number => {
  const b = bodyFrame(person, {view: 'right', sit: 1});
  return b.shV - 0.03 - b.hip0;
};
/** Torso tilt (radians, `FigPose.lean`, + toward screen right = car front) that moves the shoulder by `offset` metres. */
export const passengerLeanAngle = (person: CastDef, offset = 0): number => {
  const r = passengerTorsoRadius(person), d = Math.max(-PASSENGER_LEAN_MAX, Math.min(PASSENGER_LEAN_MAX, offset));
  return Math.asin(d / r);
};
/** A world point carried by the torso: `v` (upright) turned about the fixed hip by the lean, in the car's x-y plane. */
export const torsoPoint = (passenger: PassengerPlacement, v: V3, offset = 0): V3 => {
  if (!offset) return v;
  const {hip} = passengerSupport(passenger), a = passengerLeanAngle(passenger.person, offset);
  const dx = v[0] - hip[0], dy = v[1] - hip[1];
  return [hip[0] + dx * Math.cos(a) + dy * Math.sin(a), hip[1] - dx * Math.sin(a) + dy * Math.cos(a), v[2]];
};

export const paintCabinPassenger = (p: Painter, c: YCam, placement: PassengerPlacement, t = 0, finished = false, act: PassengerAct = {}) => {
  const lean = act.lean ? passengerLeanAngle(placement.person, act.lean) : 0;
  const a = paintFigureAt(p, c, placement.person, {at: placement.root, view: 'right', pose: 'P31', face: act.face ?? 'neutral', faceState: act.faceState, t, shadow: false, activity: false, ...(lean ? {fig: {lean}} : {})});
  if (a && finished) {
    // Two tiny finger divisions on the existing rig mitten, never extra fingers.
    const [x,y] = a.rHand;
    inkLine(p, 290, [[x-4,y+1],[x+4,y+5]], {closed:false,color:'#a87452',weight:0.9});
    inkLine(p, 291, [[x-5,y+5],[x+2,y+9]], {closed:false,color:'#a87452',weight:0.9});
  }
  return a;
};

/** Seat/hip-mounted three-point restraint, on a plane 7 cm nearer than the body.
 * The upper support, buckle and lap end are fixed world points. With a lean the drawn shoulder strap starts at `shoulder`
 * (the upper point carried by the torso, `torsoPoint`) and bends at `chest`, a point on the upright strap (BELT_CHEST along
 * upper -> latch) carried the same way, so the strap lies on the body; the hidden link from the fixed upper support to the
 * shoulder is not drawn (SS-R2 FD20-W53-02: a strap from the fixed support crossed the neck). */
export const BELT_CHEST = 0.3;
export const paintPassengerBelt = (p: Painter, c: YCam, passenger: PassengerPlacement, color = '#26313b', lean = 0) => {
  const {hip} = passengerSupport(passenger), z = passenger.root[2] + 0.07;
  const upper: V3 = [hip[0] - 0.10, 1.04, z];
  const latch: V3 = [hip[0] + 0.11, hip[1] + 0.07, z];
  const lap: V3 = [hip[0] - 0.11, hip[1] + 0.025, z];
  const chest0: V3 = [upper[0] + (latch[0] - upper[0]) * BELT_CHEST, upper[1] + (latch[1] - upper[1]) * BELT_CHEST, z];
  const chest = torsoPoint(passenger, chest0, lean), shoulder = torsoPoint(passenger, upper, lean);
  if (!lean) shape(p, c, 300, color, [[upper[0] - 0.020, upper[1], z], [upper[0] + 0.020, upper[1], z], [latch[0] + 0.02, latch[1], z], [latch[0] - 0.02, latch[1], z]]);
  else shape(p, c, 300, color, [[shoulder[0] - 0.020, shoulder[1], z], [shoulder[0] + 0.020, shoulder[1], z], [chest[0] + 0.02, chest[1], z], [latch[0] + 0.02, latch[1], z], [latch[0] - 0.02, latch[1], z], [chest[0] - 0.02, chest[1], z]]);
  shape(p, c, 301, color, [[lap[0], lap[1] + 0.022, z], [latch[0], latch[1] + 0.022, z], [latch[0], latch[1] - 0.022, z], [lap[0], lap[1] - 0.022, z]]);
  shape(p, c, 302, '#85898a', qz(z + 0.005, latch[0] - 0.035, latch[0] + 0.035, latch[1] - 0.032, latch[1] + 0.032));
  return {upper, shoulder, chest, latch, lap};
};

/** Fixed-length tether: neck N = anchor + [u, sqrt(rope^2 - u^2), 0], centre = N + (radius + 0.035) * unit(N - anchor), so
 * the envelope continues the string line and is tilted by `tilt` = asin(u / rope) about N (SS-R2 FD20-W53-03; + leans the
 * top toward the car front). `u` (m along +x, + toward the car front) is the only motion input; the rope length never
 * changes. Held to +-BALLOON_U_MAX so that with the brake-limit lean (PASSENGER_LEAN_MAX) the tilted envelope keeps >= 25 px
 * from the face on cameras A, D, D-R and CLOSE (W5.3 measure: 0.20 -> 26.7 px at A; 0.25 -> -6.3 px, on the face). */
export const BALLOON_U_MAX = 0.20;
export const tetheredBalloonAt = (rest: TetheredBalloon, u = 0): TetheredBalloon & {neck: V3; rope: number; tilt: number} => {
  const rope = rest.centre[1] - rest.radius - 0.035 - rest.anchor[1];
  const du = Math.max(-BALLOON_U_MAX, Math.min(BALLOON_U_MAX, u));
  const neck: V3 = [rest.anchor[0] + du, rest.anchor[1] + Math.sqrt(rope * rope - du * du), rest.anchor[2]];
  if (!u) return {...rest, centre: rest.centre, neck, rope, tilt: 0};
  const d = rest.radius + 0.035, ux = (neck[0] - rest.anchor[0]) / rope, uy = (neck[1] - rest.anchor[1]) / rope;
  return {...rest, centre: [neck[0] + d * ux, neck[1] + d * uy, neck[2]], neck, rope, tilt: Math.asin(du / rope)};
};

/** Continuous envelope -> tied neck -> string -> fixed low floor ring. `u` swings the whole assembly about the fixed ring on
 * the constant rope (`tetheredBalloonAt`); envelope, knot and highlight turn rigidly with the string about the neck, so
 * envelope, neck and string always move together as one tethered body. */
export const paintTetheredBalloon = (p: Painter, c: YCam, rest: TetheredBalloon, finished = false, u = 0) => {
  const b = u ? tetheredBalloonAt(rest, u) : {...rest, tilt: 0};
  const [x, y, z] = b.centre, d = b.radius + 0.035;
  const neck: V3 = b.tilt ? (b as {neck: V3}).neck : [x, y - b.radius - 0.035, z];
  const cs = Math.cos(b.tilt), sn = Math.sin(b.tilt);
  // Points given relative to the upright centre (`at`) or neck (`atNeck`); untilted they keep the approved arithmetic exactly.
  const atNeck = (dx: number, dy: number, dz = 0): V3 => (b.tilt ? [neck[0] + dx * cs + dy * sn, neck[1] - dx * sn + dy * cs, z + dz] : [x + dx, neck[1] + dy, z + dz]);
  const at = (dx: number, dy: number, dz = 0): V3 => (b.tilt ? atNeck(dx, dy + d, dz) : [x + dx, y + dy, z + dz]);
  const envelope = Array.from({length: 40}, (_, i): V3 => {
    const a = i / 40 * Math.PI * 2;
    return at(Math.cos(a) * b.radius * 0.85, Math.sin(a) * b.radius);
  });
  line(p, c, 310, [b.anchor, neck], finished ? '#ffedbd' : '#f3e4bd', finished ? 4.5 : 1.8);
  shape(p, c, 311, b.color, envelope);
  wInk(p, c, 312, envelope, {color: '#9e4e4a', weight: 0.8});
  shape(p, c, 313, b.color, b.tilt ? [at(-0.022, -b.radius + 0.01), at(0.022, -b.radius + 0.01), neck] : [[x - 0.022, y - b.radius + 0.01, z], [x + 0.022, y - b.radius + 0.01, z], [x, neck[1], z]]);
  shape(p, c, 314, '#eb9a85', [at(-0.075, 0.09, 0.001), at(-0.035, 0.12, 0.001), at(-0.015, 0.07, 0.001), at(-0.055, 0.045, 0.001)]);
  if (finished) {
    const rim = Array.from({length: 16}, (_, i): V3 => {
      const a = -1.45 + i / 15 * 2.3;
      return at(Math.cos(a) * b.radius * 0.78, Math.sin(a) * b.radius * 0.94, 0.002);
    });
    line(p, c, 317, rim, '#bd625a', 3.2);
    line(p, c, 318, [atNeck(-0.018, 0.012), atNeck(0.018, 0.012)], '#f3b58f', 2.5);
  }
  const a = camPoint(c, b.anchor);
  if (a) {
    // Ring shape still derives its location and scale from projected world vertices.
    const ring = Array.from({length: 24}, (_, i): V3 => [b.anchor[0] + 0.033 * Math.cos(i / 24 * Math.PI * 2), b.anchor[1] + 0.020 * Math.sin(i / 24 * Math.PI * 2), b.anchor[2]]);
    wInk(p, c, 315, ring, {color: finished ? '#d2c8b1' : '#cec3ad', weight: finished ? 3.0 : 1.2});
    line(p, c, 316, [b.anchor, [b.anchor[0], 0, b.anchor[2]]], '#8c8980', 1.5);
  }
  return {neck, envelope, anchor: b.anchor};
};

/** Car motion phases: `accelerate` pushes the balloon toward the front and the passenger back into the seat, `brake` the
 * reverse, `cruise` (steady straight speed) lets both return: the passenger eases upright, the balloon swings and settles. */
export type DrivePhase = 'cruise' | 'accelerate' | 'brake';
export type DriveKey = {at: number; phase: DrivePhase};
export type DriveOpts = {
  /** Held balloon neck offset (m) under acceleration/braking; scene sheet SS-R1 u = 0.20. */
  u?: number;
  /** Held passenger shoulder offset (m); SS-R1 0.07 (rearward on acceleration, forward on braking). */
  lean?: number;
  /** Frames to reach the held offset (smoothstep); SS-R1 18 for both. */
  ramp?: number; leanRamp?: number;
  /** Cruise: damped swing period in frames (default 60) and the first rebound past upright as a share of the start offset
   * (default 0.15), so a settling balloon never reads as the braking result. Under 2 % after about 62 frames by default. */
  swingPeriod?: number; overshoot?: number;
};
export type DriveState = {phase: DrivePhase; since: number; u: number; lean: number; settled: boolean};
const ss = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x * x * (3 - 2 * x); };
/** Balloon offset `u` and passenger lean at `frame` for the drive `keys` (any order; before the first key: settled cruise).
 * A pure function of its arguments: each phase starts from the state the previous phase ended in, so any frame can be
 * evaluated directly (seek parity) and phase changes are continuous in position. */
export const cabinDriveAt = (frame: number, keys: DriveKey[], o: DriveOpts = {}): DriveState => {
  const U = o.u ?? 0.2, L = o.lean ?? 0.07, ramp = o.ramp ?? 18, leanRamp = o.leanRamp ?? ramp;
  const period = o.swingPeriod ?? 60, w = (2 * Math.PI) / period;
  const k = (-2 * Math.log(Math.max(0.01, Math.min(0.9, o.overshoot ?? 0.15)))) / period;
  const step = (phase: DrivePhase, t: number, u0: number, l0: number): [number, number] => {
    // Damped pendulum released at rest from u0: zero start velocity, so the change from a held offset is smooth.
    if (phase === 'cruise') return [u0 * Math.exp(-k * t) * (Math.cos(w * t) + (k / w) * Math.sin(w * t)), l0 * (1 - ss(t / leanRamp))];
    const s = phase === 'accelerate' ? 1 : -1;
    return [u0 + (s * U - u0) * ss(t / ramp), l0 + (-s * L - l0) * ss(t / leanRamp)];
  };
  const ks = [...keys].sort((a, b) => a.at - b.at);
  let phase: DrivePhase = 'cruise', since = -Infinity, u = 0, lean = 0;
  for (let i = 0; i < ks.length && ks[i].at <= frame; i++) {
    if (i > 0) [u, lean] = step(phase, ks[i].at - since, u, lean);
    phase = ks[i].phase; since = ks[i].at;
  }
  if (since === -Infinity) return {phase, since, u: 0, lean: 0, settled: true};
  const [uf, lf] = step(phase, frame - since, u, lean);
  return {phase, since, u: uf, lean: lf, settled: phase === 'cruise' && Math.abs(uf) < 0.004 && Math.abs(lf) < 0.002};
};

/** Dark lower near-side door, still painted to the bottom; no empty/black strip. */
export const paintCabinFore = (p: Painter, c: YCam, pal: CabinPalette, finished = false) => {
  shape(p, c, 330, pal.trim, qz(0.85, -0.65, 2.45, -1.9, -0.04));
  shape(p, c, 331, pal.floor, qz(0.86, -0.60, 2.40, -1.9, -0.19));
  // Seam and pocket are low contrast, away from caption glyphs and hero.
  line(p, c, 332, [[-0.57, -0.72, 0.87], [2.0, -0.72, 0.87]], pal.trim, 0.8);
  if (!finished) shape(p, c, 333, pal.trim, quad(0.88, [[-0.38, -1.10], [1.88, -1.10], [1.77, -1.54], [-0.28, -1.54]]));
  // Near window corner and curved A-pillar: visible car enclosure, not a rectangular room.
  shape(p, c, 340, pal.trim, quad(0.70, [[-0.62, 1.63], [0.94, 1.63], [1.44, 0.76], [1.34, 0.72], [0.86, 1.52], [-0.62, 1.52]]));
  // Near door armrest/pocket: broad subdued material shapes, low edge density.
  if (finished) {
    // Rounded moulded door insert, armrest, storage pocket and speaker: all
    // share the near door's world plane and remain low contrast under captions.
    const lift = mixColor(pal.floor, pal.seat, 0.2);
    shape(p, c, 350, lift, quad(0.88, [[-0.48,-0.20],[1.78,-0.20],[1.9,-0.28],[1.84,-0.86],[1.65,-0.94],[-0.45,-0.94]]));
    shape(p, c, 351, mixColor(pal.floor, pal.trim, 0.5), quad(0.89, [[-0.4,-0.24],[1.48,-0.24],[1.55,-0.30],[1.48,-0.35],[-0.4,-0.35]]));
    shape(p, c, 352, mixColor(pal.floor, '#141e29', 0.22), quad(0.90, [[-0.30,-0.62],[1.40,-0.62],[1.30,-0.82],[-0.20,-0.82]]));
    line(p, c, 353, [[-0.30,-0.62,0.91],[1.40,-0.62,0.91]], mixColor(pal.floor, pal.seat, 0.28), 1.2);
    for (let i = 0; i < 6; i++) line(p, c, 360+i, [[1.57,-0.48-i*0.03,0.91],[1.77,-0.48-i*0.03,0.91]], mixColor(lift, pal.floor, 0.38), 1.1);
  } else {
    shape(p, c, 345, pal.seatShade, quad(0.88, [[-0.59, -0.42], [1.53, -0.42], [1.60, -0.52], [1.51, -0.61], [-0.59, -0.61]]));
    shape(p, c, 347, pal.seatShade, quad(0.90, [[-0.50, -1.12], [1.65, -1.12], [1.60, -1.20], [-0.42, -1.20]]));
  }
};
