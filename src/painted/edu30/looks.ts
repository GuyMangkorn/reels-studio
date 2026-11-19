import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {shoulderPoint, type CastDef} from '../kit/cast';
import type {Pt} from '../kit/painter';
import {paintCrew, paintSeatedGunner, GUNNER1, GUNNER2, MEREDITH} from './cast';
import {paintEmu, flockIn, paintFarFlock, type EmuMember} from './flock';
import {EMU_POSES, emuHop, wingMix, WING_FLAP_OUT, WING_FOLD} from './emu';
import {CLEARING, setNoClearing, paintKpPatch, paintWheatRidges, paintCamp, paintClearing, paintFarmhouse, paintFence, paintGum, paintNearStalks, paintPadGround, paintPadSky, paintScrub, paintWheatTexture, SUN, type PadLight} from './paddock';
import {withSquash} from '../kit/figure-at';
import {buildLewisGun, paintGear, paintTruck, placeBuild} from './props';
import type {NewsreelTint} from './newsreel';
import {DAM, paintDam, southBankY} from './dam';
import {paintArms, paintArmsSky, paintSandstoneWall, paintWattleBed} from './arms';

// EDU-EP30-SHORT W3 look frames and thumbnails (EDU-EP30-BRIEF-R1 VD30-01..05; Film, 2026-11-19). React-free so a headless measure can run
// them with a null painter. Cameras are the brief's spaces (P paddock, D dam, A arms wall); every number is a look-frame estimate for the
// timed scene-sheet pass to confirm with scripts/shot-projection.py.

export type LookDef = {
  shot: string; cam: YCam; t: number; paper: string;
  /** newsreel layer (absent = today, full colour) */
  reel?: {tint: NewsreelTint; amount: number; strength?: number};
  /** newsreel title overlay text (VD30-09), top third */
  title?: string;
  caption?: string;
  /** a word painted on the relief (the scroll), drawn as DOM text at its projected point */
  word?: {at: V3; text: string; h: number};
  paint: (p: Painter) => void;
};
export type Lead = {name: string; top: number; bottom: number; h: number; x?: number};
export const MEASURE: Record<string, Lead[]> = {};
const lead = (id: string, name: string, a: {top: number; bottom: number; head?: [number, number]; left?: number; right?: number} | null) => {
  if (!a) return;
  (MEASURE[id] ??= []).push({name, top: Math.round(a.top), bottom: Math.round(a.bottom), h: Math.round(a.bottom - a.top), x: Math.round(a.head ? a.head[0] : ((a.left ?? 0) + (a.right ?? 0)) / 2)});
};
const DEG = Math.PI / 180;
/** yaw (rad) of a camera at `from` looking at `to` (yaw 0 looks -z, + turns toward +x). */
export const yawTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], -(to[2] - from[2]));

// ------------------------------------------------------------------ space P set stack
export type PadOpts = {light?: PadLight; eaten?: number; flock?: EmuMember[]; far?: {n: number; x: [number, number]; z: [number, number]}; stalks?: V3[]; truck?: V3 | null; texture?: [number, number]};
export const paintPaddock = (p: Painter, c: YCam, o: PadOpts, cast: () => void) => {
  const light = o.light ?? 'morning', sun = SUN[light];
  paintPadSky(p, c, light);
  paintScrub(p, c, 30100, 300);
  paintScrub(p, c, 30200, 170, '#7a8264');
  paintPadGround(p, c, 30300, {eaten: o.eaten, light});
  paintFarmhouse(p, c, 30400, [-90, 0, -160]);
  if (o.far) paintFarFlock(p, c, 30500, o.far.n, o.far.x, o.far.z);
  paintWheatRidges(p, c, 30600, {light});
  // the far side of the camp and track (behind the fence from the paddock side)
  paintGum(p, c, 30700, [-22, 0, -38], 14, light);
  paintGum(p, c, 30720, [36, 0, -70], 12, light);
  paintGum(p, c, 30740, [18, 0, 22], 10, light);
  paintCamp(p, c, 30800, light);
  if (o.truck !== null) paintTruck(p, c, 30900, o.truck ?? [-7, 0, 9.5], 1);
  paintFence(p, c, 31000);
  paintClearing(p, c, 31200);
  (o.flock ?? []).slice().sort((a, b) => Math.hypot(b.at[0] - c.x, b.at[2] - c.z) - Math.hypot(a.at[0] - c.x, a.at[2] - c.z)).forEach((m) => paintEmu(p, c, m, {sun, shadowOp: 70}));
  cast();
  if (o.stalks) paintNearStalks(p, c, 31800, o.stalks);
};

/** G1 crew at the gun position (space P, all facing -z), sorted far to near by the caller's camera. */
export const crewAtGun = (p: Painter, c: YCam, id: string, t: number, o: {hero?: EmuMember; extra?: EmuMember[]; gear?: boolean} = {}) => {
  type It = {at: V3; f: () => void};
  const sun = SUN.morning;
  const items: It[] = [
    {at: [-0.6, 0, 1.05], f: () => lead(id, 'MEREDITH', paintCrew(p, c, MEREDITH, [-0.6, 0, 1.05], {view: 'front', pose: 'P30', t, seed: 33100, hat: 'slouch', upLeft: true}))},
    {at: [0, 0, 0.85], f: () => lead(id, 'GUNNER-1', paintSeatedGunner(p, c, GUNNER1, [0, 0, 0.85], {view: 'front', t, seed: 33200}))},
    {at: [0, 0, 0], f: () => { placeBuild(p, c, buildLewisGun(), [0, 0, 0], -Math.PI / 2, {seed: 33300, sun}); }},
    {at: [0.75, 0, 0.45], f: () => lead(id, 'GUNNER-2', paintCrew(p, c, GUNNER2, [0.75, 0, 0.45], {view: 'front', pose: 'P34', t, seed: 33400, hat: 'slouch'}))},
    ...(o.hero ? [{at: o.hero.at, f: () => { const a = paintEmu(p, c, o.hero!, {sun}); lead(id, 'EMU-HERO', a); }}] : []),
    ...(o.extra ?? []).map((m) => ({at: m.at, f: () => { paintEmu(p, c, m, {sun}); }})),
  ];
  if (o.gear) items.push({at: [-1.3, 0, -1.8], f: () => paintGear(p, c, 33600, {sheet: [-1.3, 0, -1.8], box: [0.55, 0, 1.35], mags: [1.05, 0, 0.25], bag: [-0.95, 0, -2.25]})});
  items.sort((a, b) => Math.hypot(b.at[0] - c.x, b.at[2] - c.z) - Math.hypot(a.at[0] - c.x, a.at[2] - c.z)).forEach((it) => it.f());
};

// ------------------------------------------------------------------ LF01 / thumbnails, space P
const EYE_LF01: V3 = [-3.2, 0.95, -3.4];
/** Heroic low three-quarter from the front-left: the barrel reads at three-quarters (not end-on), the crew stands against the sky. */
export const CAM_LF01: YCam = {x: EYE_LF01[0], y: EYE_LF01[1], z: EYE_LF01[2], yaw: 134.5 * DEG, pitch: 6 * DEG, f: 1450, hy: 640};
/** EMU-HERO beside the gun, facing -x, neck lowered so its head is just in front of the muzzle with its left eye to the bore (birds look
 *  with one eye): the hook's "inspecting the barrel". BOARD-R1 had it at (+0.6, 0, -1.6) screen right; W3 moves it so the lens sees it. */
export const HERO_LF01: EmuMember = {at: [0.75, 0, -0.95], heading: Math.PI, pose: {head: [0.7, 0.68, 0], neckMid: [0.52, 1.02, 0], headDir: [1, -0.08, 0], pitch: -0.06}, scale: 1, seed: 34000, hero: true};
const lf01 = (amount: number, id: string) => (): LookDef => {
  const c = CAM_LF01, t = 1.2;
  return {shot: 'B01-SH01 frame 0 (L01)', cam: c, t, paper: '#efe6d0', reel: {tint: 'warm', amount}, caption: 'ออสเตรเลียเคยส่งทหาร\nพร้อมปืนกลไปรบกับนกอีมู…', paint: (p) => {
    MEASURE[id] = [];
    paintPaddock(p, c, {eaten: 0.3, truck: [-7, 0, 9.5], far: {n: 0, x: [0, 0], z: [0, 0]}}, () => crewAtGun(p, c, id, t, {hero: HERO_LF01, gear: true}));
  }};
};

/** Thumbnail P2: the establishing high wide over the fence (B02-SH01 crane end region): plain, flock as dark marks, gun position, camp. */
const CAM_P2: YCam = {x: 6, y: 7.5, z: 16, yaw: yawTo([6, 7.5, 16], [-2, 0, -30]), pitch: -12 * DEG, f: 900, hy: 760};
const tP2 = (): LookDef => {
  const c = CAM_P2, t = 3;
  const flock = flockIn(301, 24, [-22, 22], [-58, -26], {mix: [0.55, 0.3, 0.15]});
  return {shot: 'thumb P2 · B02-SH01 crane (high wide)', cam: c, t, paper: '#efe6d0', reel: {tint: 'warm', amount: 1}, caption: 'ปี 1932 นกอีมูราว ๆ สองหมื่นตัว', paint: (p) => {
    MEASURE.TP2 = [];
    paintPaddock(p, c, {eaten: 0.5, flock, far: {n: 200, x: [-90, 90], z: [-200, -62]}}, () => crewAtGun(p, c, 'TP2', t));
  }};
};

/** Thumbnail P3: the retreat vantage in low west light (B05-SH03): backs of the emus at the fence, the truck leaving on the track. */
const EYE_P3: V3 = [-1.0, 1.55, 2.4];
const CAM_P3: YCam = {x: EYE_P3[0], y: EYE_P3[1], z: EYE_P3[2], yaw: 163 * DEG, f: 820, hy: 820};
const tP3 = (): LookDef => {
  const c = CAM_P3, t = 4;
  const fence: EmuMember[] = [-5.5, -3.2, -1.0, 1.4, 3.6, 6.0].map((x, i) => ({at: [x * 0.8 - 1.2, 0, 5.25 + (i % 2) * 0.3], heading: Math.PI / 2 + (i % 3 - 1) * 0.15, pose: EMU_POSES.stand({tone: (i % 3 - 1) * 0.3}), scale: 0.95 + (i % 2) * 0.08, seed: 35000 + i * 77, hero: i === 2}));
  return {shot: 'thumb P3 · B05-SH03 retreat vantage (west light, cool tint)', cam: c, t, paper: '#e8e2d4', reel: {tint: 'cool', amount: 1}, caption: 'ถอนทัพ… รอบที่หนึ่ง', title: 'ถอนทัพ รอบที่ 1', paint: (p) => {
    MEASURE.TP3 = [];
    paintPaddock(p, c, {light: 'west', eaten: 0.7, truck: [9, 0, 9.6]}, () => {
      fence.forEach((m) => lead('TP3', m.hero ? 'EMU-HERO' : 'emu', paintEmu(p, c, m, {sun: SUN.west})));
    });
  }};
};


// ------------------------------------------------------------------ LF02 / thumbnails, space D (farm dam)
/** B04-SH01 (ROWS-R4 redesign, Film): a low lens just over the water at the east end of the dam, looking WSW along the south bank. The
 *  bank's lit inner slope rises from the waterline (dark wet rim) to the crest at frame left; the water fills the lower right and mirrors
 *  the sky, the dead trees, the windmill and the crew. MEREDITH crouches at the waterline in profile and points across the water;
 *  GUNNER-2 half-crouched beyond his hand (near hand on the hip, far hand shading his eyes); GUNNER-1 seated at G1 beyond. ROWS-R3's
 *  lens behind the crew (three backs, the water a thin grazing band that read as a road) failed two viewer checks. */
const EYE_LF02: V3 = [0.5, 0.85, -6.4];
export const CAM_LF02: YCam = {x: EYE_LF02[0], y: EYE_LF02[1], z: EYE_LF02[2], yaw: -110 * DEG, pitch: 0, f: 950, hy: 810};
export const onBank = (x: number, z: number): V3 => [x, southBankY(z), z];
/** LF02 crew marks (ground from `southBankY`): all three at the waterline: MEREDITH nearest (the lead), GUNNER-2, GUNNER-1 seated at G1.
 *  West of the queue's path: the queue (B04-SH02) comes in from the east approach along the shore and its head stops at (3.0, 0.6, -5.2). */
export const LF02_MARKS = {mer: onBank(-1.25, -4.95), g2: onBank(-3.6, -4.95), g1: onBank(-6.2, -4.75), gun: onBank(-5.6, -5.0)};
/** Arm target from a shoulder: `via` and `to` in metres (x forward toward the facing side, y up), `u` px per metre, `d` +1 facing right. */
const armRel = (sh: Pt, u: number, via: Pt, to: Pt, d = 1) => ({via: [sh[0] + d * via[0] * u, sh[1] - via[1] * u] as Pt, to: [sh[0] + d * to[0] * u, sh[1] - to[1] * u] as Pt});
/** The LF02 crew, far to near. `mirror`: paint their reflections in the water instead (flipped about the waterline under each mark, toned
 *  toward the water, no lead measure). */
export const crewAtDam = (p: Painter, c: YCam, id: string, t: number, mirror = false) => {
  const sun = SUN.morning, m = LF02_MARKS, view = 'right' as const;
  const sh = (def: CastDef, at: V3, body: Record<string, number>, side: 'r' | 'l') => shoulderPoint(def, camPoint(c, at)!, camUnit(c, at), {view, ...body}, side);
  const tint = mirror ? {to: DAM.reflection, u: 0.7} : undefined, rec = (name: string, a: Parameters<typeof lead>[2]) => { if (!mirror) lead(id, name, a); };
  const flip = (at: V3, draw: () => void) => { if (!mirror) { draw(); return; } const w = camPoint(c, [at[0], DAM.water, at[2]]); if (w) withSquash(p, w, -1, draw); };
  // MEREDITH (lead): deep crouch at the water's edge (P35 body), near (right) arm straight out across the water and a little up: "there".
  const merBody = {squat: 1, bend: 0.3};
  // GUNNER-2: half crouch, taller in silhouette; near (right) hand on the hip, elbow back; far hand shading the eyes (P09 + P30 in profile).
  const g2Body = {squat: 0.45, bend: 0.12};
  const items: {at: V3; f: () => void}[] = [
    {at: m.gun, f: () => flip(m.gun, () => { placeBuild(p, c, buildLewisGun({elev: 0.02}), m.gun, -Math.PI / 2 + 0.55, {seed: 37300, sun}); })},
    {at: m.g1, f: () => flip(m.g1, () => { const s = sh(GUNNER1, m.g1, {floorSit: 1}, 'r'), u = camUnit(c, m.g1);
      rec('GUNNER-1', paintCrew(p, c, GUNNER1, m.g1, {view, pose: 'P33', t, tint, seed: 37200, hat: 'slouch', fig: {floorSit: 1, rArm: armRel(s, u, [0.2, -0.2], [0.42, -0.08]), lArm: armRel(s, u, [0.22, -0.22], [0.46, -0.12])}})); })},
    {at: m.g2, f: () => flip(m.g2, () => { const s = sh(GUNNER2, m.g2, g2Body, 'r'), u = camUnit(c, m.g2);
      rec('GUNNER-2', paintCrew(p, c, GUNNER2, m.g2, {view, t, tint, seed: 37400, hat: 'slouch', fig: {...g2Body, rArm: armRel(s, u, [-0.14, -0.22], [0.03, -0.41]), lArm: armRel(s, u, [0.2, 0.12], [0.12, 0.34])}})); })},
    {at: m.mer, f: () => flip(m.mer, () => { const s = sh(MEREDITH, m.mer, merBody, 'r'), u = camUnit(c, m.mer);
      rec('MEREDITH', paintCrew(p, c, MEREDITH, m.mer, {view, pose: 'P35', t, tint, seed: 37100, hat: 'slouch', fig: {...merBody, rArm: {...armRel(s, u, [0.28, 0.02], [0.58, 0.1]), finger: true}}})); })},
  ];
  items.sort((a, b) => Math.hypot(b.at[0] - c.x, b.at[2] - c.z) - Math.hypot(a.at[0] - c.x, a.at[2] - c.z)).forEach((it) => it.f());
};
/** LF02 set dressing: the two dead trees and the windmill moved into this view (world x, z, height). */
export const LF02_DAM = {trees: [[-10.6, -6.15, 5.5], [-18.4, -8.5, 7.0]] as [number, number, number][], windmill: [-33.4, -0.2, 9] as [number, number, number]};
const lf02 = (): LookDef => {
  const c = CAM_LF02, t = 2;
  return {shot: 'B04-SH01 start (L09)', cam: c, t, paper: '#efe6d0', reel: {tint: 'warm', amount: 1}, title: 'แผน 2', caption: 'แผนสอง ซุ่มที่เขื่อน', paint: (p) => {
    MEASURE.LF02 = [];
    paintDam(p, c, 38000, {...LF02_DAM, reflect: () => crewAtDam(p, c, 'LF02', t, true)});
    crewAtDam(p, c, 'LF02', t);
  }};
};
/** Thumbnail D2: the queue from the east bank (B04-SH02 region): emus walking in single file along the inner shore, far mass to the horizon. */
const EYE_D2: V3 = [8.0, 1.9, -3.6];
const CAM_D2: YCam = {x: EYE_D2[0], y: EYE_D2[1], z: EYE_D2[2], yaw: yawTo(EYE_D2, [12, 0, -30]), pitch: 0, f: 900, hy: 820};
const tD2 = (): LookDef => {
  const c = CAM_D2, t = 2;
  const q: EmuMember[] = Array.from({length: 9}, (_, i) => { const u = i / 8, x = 3 + u * 11, z = -5.4 - u * 14; return {at: [x, DAM.water + 0.2, z], heading: Math.atan2(5.4 + 14 - 5.4, -11) + Math.PI, pose: EMU_POSES.walk((i * 0.37) % 1, {tone: ((i % 3) - 1) * 0.3}), scale: 1, seed: 39000 + i * 31} as EmuMember; });
  q.forEach((m) => { m.heading = Math.atan2(14, -11) + Math.PI; });
  return {shot: 'thumb D2 · B04-SH02 the queue (east bank)', cam: c, t, paper: '#efe6d0', reel: {tint: 'warm', amount: 1}, caption: 'นกเป็นพันเดินเข้ามาเอง เหมือนต่อคิว', paint: (p) => {
    MEASURE.TD2 = [];
    paintDam(p, c, 38000);
    paintFarFlock(p, c, 39500, 70, [14, 60], [-70, -22]);
    q.slice().sort((a, b) => Math.hypot(b.at[0] - c.x, b.at[2] - c.z) - Math.hypot(a.at[0] - c.x, a.at[2] - c.z)).forEach((m) => lead('TD2', 'emu', paintEmu(p, c, m, {sun: SUN.morning})));
  }};
};

// ------------------------------------------------------------------ LF03 / thumbnails, space A (arms today, full colour)
const EYE_LF03: V3 = [-0.3, 2.6, 4.5];
/** B07-SH01 end: the whole coat of arms in frame, kangaroo left, emu right, sunlit sandstone, blue sky (no newsreel layer). */
export const CAM_LF03: YCam = {x: EYE_LF03[0], y: EYE_LF03[1], z: EYE_LF03[2], yaw: 0, pitch: 20 * DEG, f: 1200, hy: 760};
export const armsLook = (c: YCam, id: string, shot: string, caption: string, emuYaw?: number) => (): LookDef => ({shot, cam: c, t: 0, paper: '#e8d8b8', caption, word: {at: [0, 2.94, 0.17], text: 'AUSTRALIA', h: 0.13}, paint: (p) => {
  MEASURE[id] = [];
  paintArmsSky(p, c);
  paintSandstoneWall(p, c, 41000);
  paintWattleBed(p, c, 41800);
  const r = paintArms(p, c, 42000, emuYaw === undefined ? {} : {emuPose: EMU_POSES.stand({head: [0.36, 1.62, 0], headYaw: emuYaw, lid: 0.15})});
  lead(id, 'EMU-RELIEF', r.emu);
  lead(id, 'ROO-RELIEF', r.roo);
}});
/** Thumbnail A2: the B07-SH02 push-in end on the emu supporter, head turned to the lens (the callback of B01-SH03). */
const EYE_A2: V3 = [0.95, 3.9, 2.4];
export const CAM_A2: YCam = {x: EYE_A2[0], y: EYE_A2[1], z: EYE_A2[2], yaw: 4 * DEG, pitch: 16 * DEG, f: 1000, hy: 900};

// ------------------------------------------------------------------ KP-EMU key poses (look check), plain paddock ground, caption band shown
export const KP_EYE: V3 = [0, 1.05, 2.5];
const KP_CAM: YCam = {x: KP_EYE[0], y: KP_EYE[1], z: KP_EYE[2], yaw: 0, pitch: 0, f: 1000, hy: 760};
export const kp = (name: string, member: () => EmuMember, caption: string) => (): LookDef => ({shot: `KP-EMU ${name}`, cam: KP_CAM, t: 0, paper: '#efe6d0', reel: {tint: 'warm', amount: 1}, caption, paint: (p) => {
  const c = KP_CAM, id = `KP-${name}`;
  setNoClearing(true);
  MEASURE[id] = [];
  paintPadSky(p, c);
  paintScrub(p, c, 30100, 300);
  paintPadGround(p, c, 30300, {eaten: 0});
  paintKpPatch(p, c, 30650);
  paintWheatRidges(p, c, 30600, {r0: 6});
  paintGum(p, c, 30700, [16, 0, -60], 14);
  lead(id, 'EMU-HERO', paintEmu(p, c, member(), {sun: SUN.morning}));
  setNoClearing(false);
}});
/** Head yaw that turns the head toward the lens, held `off` rad short of square (a three-quarter look reads the bill; square-on reads as an owl). */
const lensYaw = (at: V3, heading: number, off = 0.45) => { const toCam = Math.atan2(KP_EYE[2] - at[2], KP_EYE[0] - at[0]); let d = toCam - heading; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return -d - Math.sign(-d) * off; };
export const KP_AT: V3 = [0, 0, -0.2];

export const LOOK_DEFS: Record<string, () => LookDef> = {
  LF01a: lf01(1, 'LF01a'),
  LF01b: lf01(0.45, 'LF01b'),
  TP2: tP2,
  TP3: tP3,
  LF02: lf02,
  TD2: tD2,
  LF03: armsLook(CAM_LF03, 'LF03', 'B07-SH01 end (L17)', 'ส่วนนกอีมู อยู่บนตราแผ่นดินออสเตรเลีย\nมาตั้งแต่ปี 1908'),
  TA2: armsLook(CAM_A2, 'TA2', 'thumb A2 · B07-SH02 push-in end, relief emu looks to the lens', 'ไม่เคยถอยสักรอบ', -1.25),
  'KP-stand': kp('stand', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}), 'stand'),
  'KP-walk': kp('walk', () => ({at: KP_AT, heading: Math.PI + 0.25, pose: EMU_POSES.walk(0.3), scale: 1, seed: 36000, hero: true}), 'walk'),
  'KP-peck': kp('peck', () => ({at: KP_AT, heading: Math.PI - 0.35, pose: EMU_POSES.peck(), scale: 1, seed: 36000, hero: true}), 'peck'),
  'KP-run': kp('run', () => ({at: [0.2, 0, -0.6], heading: 0.2, pose: EMU_POSES.run(0.62), scale: 1, seed: 36000, hero: true}), 'run'),
  'KP-bow': kp('bow', () => ({at: KP_AT, heading: Math.PI / 2 - 0.5, pose: EMU_POSES.bow(), scale: 1, seed: 36000, hero: true}), 'bow'),
  'KP-face': (): LookDef => {   // B01-SH03 close: head and neck fill the upper half, front three-quarter, deadpan half-lid
    const c: YCam = {x: 0.1, y: 1.58, z: 1.05, yaw: 0, pitch: -2 * DEG, f: 1000, hy: 640}, id = 'KP-face';
    return {shot: 'KP-EMU face (B01-SH03 close)', cam: c, t: 0, paper: '#efe6d0', reel: {tint: 'warm', amount: 1}, caption: 'สองรอบ', paint: (p) => {
      MEASURE[id] = [];
      setNoClearing(true);
      paintPadSky(p, c); paintScrub(p, c, 30100, 300); paintPadGround(p, c, 30300, {eaten: 0}); paintWheatRidges(p, c, 30600, {r0: 6});
      lead(id, 'EMU-HERO', paintEmu(p, c, {at: [0, 0, -0.2], heading: Math.PI / 2 - 0.4, pose: EMU_POSES.stand({lid: 0.32, headYaw: 0.25}), scale: 1, seed: 36000, hero: true}, {sun: SUN.morning}));
      setNoClearing(false);
    }};
  },
  /** T06 proof: KP-stand with the wing at FOLD (must equal KP-stand: the folded wing hides in the plumage) */
  'KP-fold': kp('fold', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.stand({wing: WING_FOLD}), scale: 1, seed: 36000, hero: true}), 'stand'),
  // T06 reaction stills: startle, duck, hop (f 3 of emuHop, side +1, 0.6 m), flap (the duck pose with wing w 0.9), flap-back (the same at heading -pi/2, back to the lens)
  'KP-startle': kp('startle', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.startle(), scale: 1, seed: 36000, hero: true}), 'startle'),
  'KP-duck': kp('duck', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.duck(), scale: 1, seed: 36000, hero: true}), 'duck'),
  'KP-hop': kp('hop', () => { const {pose, offset} = emuHop(3, {side: 1, dist: 0.6}); return {at: [KP_AT[0] + offset[2] * Math.sin(Math.PI), offset[1], KP_AT[2] - offset[2] * Math.cos(Math.PI)], heading: Math.PI, pose, scale: 1, seed: 36000, hero: true}; }, 'hop'),
  'KP-flap': kp('flap', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.duck({wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.9)}), scale: 1, seed: 36000, hero: true}), 'flap'),
  'KP-flap-back': kp('flap-back', () => ({at: KP_AT, heading: -Math.PI / 2, pose: EMU_POSES.duck({wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.9)}), scale: 1, seed: 36000, hero: true}), 'flap back'),
  'KP-look': kp('look', () => ({at: KP_AT, heading: Math.PI, pose: EMU_POSES.look(lensYaw(KP_AT, Math.PI)), scale: 1, seed: 36000, hero: true}), 'look to lens'),
};

export const picture = (c: YCam, v: V3) => camPoint(c, v);
void CLEARING;
