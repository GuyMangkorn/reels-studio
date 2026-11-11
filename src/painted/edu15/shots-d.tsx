// EDU-EP15 B04 + B05 shots 14-20 (storyboard EDU-EP15-ROWS-R2.0): she leans in and the tokay starts to walk, the toe and the tape peel, the hairs let go row by row and the foot snaps
// free, the hang swing and the curl, his shout, the moth catch, her smile and the crane to the tokay by the lamp.
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camUnit, mixYCam, type YCam} from '../kit/ycam';
import {paintWomanLap, paintWomanProfile} from './cast';
import {camBetween, eo, lin, mix, sm, type CamKey} from './clock';
import {defShot} from './frame';
import {hangPoseA, paintHang} from './hang';
import {CalmBand, Lbl, Vignette} from './look';
import {paintMicroContact} from './micro';
import {C, CEIL, lookCam, W0_FEET} from './palette';
import {paintSpeck, type Speck} from './plunger';
import {paintCeilingFan, paintMoth, paintSlippers, paintSofaSide, paintTable} from './room';
import {restPose, roomBack} from './scenes';
import {fanAngle, LAMP_C, mothAt} from './shots-a';
import {T1} from './shots-b';
import {paintTape} from './tape';
import {ceilingFrame, paintTokay, paintTokayShadow, type Frame, type TokayPose} from './tokay';
import {walkAt, type WalkCfg} from './walk';

const calm = (level: number, id: string, vig = 0.3) => <><Vignette level={vig} id={`v-${id}`} />{level > 0 && <CalmBand level={level} id={`calm-${id}`} />}</>;
const mixV = (a: V3, b: V3, e: number): V3 => [mix(a[0], b[0], e), mix(a[1], b[1], e), mix(a[2], b[2], e)];
const toW = (f: Frame, l: V3): V3 => [f.o[0] + f.U[0] * l[0] + f.V[0] * l[1] + f.N[0] * l[2], f.o[1] + f.U[1] * l[0] + f.V[1] * l[1] + f.N[1] * l[2], f.o[2] + f.U[2] * l[0] + f.V[2] * l[1] + f.N[2] * l[2]];

// ---- B04 walk. One tokay path for shots 14-16, in B04 time tb = frame - 1216 (shot 14 L = tb, shot 15 L = tb - 77, shot 16 L = tb - 160). Shot 14 turns off T1 (+49 first step, pair A
// then B every 9 f); shot 15 holds the end of that walk (foot planted for the peel); shot 16 snaps the hero foot free and the walk goes on (steps at +60 and +69).
// The brief's T1 -> T2 line runs against T1's heading (225): the tokay turns on the spot while it walks, so the path is a small arc (see task.md, W5.2 notes).
export const T2: V3 = [0.3, CEIL, -0.25];
export const T3: V3 = [0.2, CEIL, -0.18];
const P_MID: V3 = [0.17, CEIL, -0.36];
export const WALK_B04A: WalkCfg = {from: {at: T1, heading: 225}, to: {at: P_MID, heading: 255}, m0: 44, m1: 78, steps: [49, 58, 67, 76]};
export const WALK_B04B: WalkCfg = {from: {at: P_MID, heading: 255}, to: {at: [0.23, CEIL, -0.3], heading: 320}, m0: 209, m1: 234, steps: [220, 229]};
const TB16 = 160;

// ---- 14. S01-B04-SH01 [1216, 1293): low profile two-plane. She leans in +3-+19 (P32, head raised, `suspicious`); the tokay above starts to walk on "เดิน" (+49).
export const KEY14A: CamKey = {pos: [0.9, 0.72, 0.15], at: [-0.25, 1.4, -0.2], f: 650, hy: 860};
export const KEY14B: CamKey = {pos: [0.88, 0.74, 0.1], at: [-0.25, 1.4, -0.2], f: 650, hy: 860};
export const camSH14 = (L: number) => camBetween(KEY14A, KEY14B, lin(0, 77, L));
defShot('S01-B04-SH01', (L, g) => {
  const c = camSH14(L), t = g / 30, w = walkAt(WALK_B04A, L);
  return {
    paint: (p) => {
      roomBack(p, c);
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, w.frame, 61990, [0.004, 0.006]);
      paintTokay(p, c, w.frame, w.pose, {t});
      const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
      paintSofaSide(p, c);
      paintWomanProfile(p, c, {at: W0_FEET, t, lean: sm(3, 19, L), tint: 0.05});
      paintSlippers(p, c);
      paintTable(p, c);
    },
    children: calm(0.62, 'sh14'),
  };
});

// ---- 15. S01-B04-SH02 [1293, 1376): ceiling-level side close, the hero front-left foot planted (end of the walk, shot 14), tape 30 mm beside it. Roll 0 -> 1 over +10-+54 (slow motion),
// the tape's free end curls back in sync on the same radius. The camera sits at the tokay's left like shot 3's end (camLF02), relative to the foot, slow truck 1 cm.
const S15 = walkAt(WALK_B04A, 92);
export const roll15 = (L: number) => sm(10, 54, L);
export const camSH15 = (L: number): YCam => {
  const f = S15.frame, palm = S15.palms.fl, k = -0.01 * lin(0, 83, L);
  const at = (du: number, dv: number, y: number): V3 => [palm[0] + f.U[0] * (du + k) + f.V[0] * dv, CEIL + y, palm[2] + f.U[2] * (du + k) + f.V[2] * dv];
  return lookCam(at(0.01, 0.065, -0.022), at(0.012, 0, -0.003), 1300, {hy: 860, near: 0.01}); // W5-F1 item 6: f 1300, about 20 000 px/m at the palm
};
defShot('S01-B04-SH02', (L, g) => {
  const c = camSH15(L), f = S15.frame, r = roll15(L), t = g / 30, pl = S15.pose.legs.fl.palm;
  const pose: TokayPose = {...S15.pose, roll: {...S15.pose.roll, fl: r}};
  return {
    paint: (p) => {
      roomBack(p, c, {focus: S15.palms.fl, stippleR: 0.28, stippleStep: 0.0075, halo: 0.6});
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, f, 61990, [0.004, 0.006]);
      paintTokay(p, c, f, pose, {t});
      paintTape(p, c, f, {uA: pl[0] - 0.03, uB: pl[0] + 0.04, v: pl[1] + 0.027, curl: r});
    },
    children: calm(0.74, 'sh15'),
  };
});

// ---- 16. S01-B04-SH03 [1376, 1454): micro section along toe 3, the hair rows let go back to front (+0-+38) and their glints go out; LBL +0-+39; loupe out +39-+50 to the room, the foot
// snaps free on "หลุด" (+39), lifts at +51, steps on at +60.
const rowSettle = (L: number): [number, number, number] => [1 - sm(0, 14, L), 1 - sm(10, 26, L), 1 - sm(24, 38, L)];
export const camSH16 = (): YCam => {
  const w = walkAt(WALK_B04B, TB16), f = w.frame, p0 = w.palms.fl;
  const at = (du: number, dv: number, y: number): V3 => [p0[0] + f.U[0] * du + f.V[0] * dv, CEIL + y, p0[2] + f.U[2] * du + f.V[2] * dv];
  return lookCam(at(0.01, 0.16, -0.08), at(0.02, 0, -0.02), 1000, {hy: 900, near: 0.02});
};
export const poseSH16 = (L: number) => {
  const w = walkAt(WALK_B04B, L + TB16), hold = 1 - sm(39, 44, L);
  const pose: TokayPose = {...w.pose, roll: {...w.pose.roll, fl: Math.max(w.pose.roll?.fl ?? 0, hold)}};
  return {w, pose};
};
defShot('S01-B04-SH03', (L, g) => {
  const t = g / 30, c = camSH16(), {w, pose} = poseSH16(L);
  const aMicro = L < 39 ? 1 : Math.pow(1 - sm(39, 44, L), 1.3); // W5-F2 item 3: micro 1 -> 0 over +39-+44 (ease-in: <= 0.35 at +42, <= 0.10 at +43) while it loupes out (S 12 -> 36 about the toe point), room beneath from +34
  return {
    paint: (p) => {
      if (L >= 34) {
        roomBack(p, c, {focus: w.palms.fl, stippleR: 0.25, stippleStep: 0.008, halo: 0.7});
        paintTokayShadow(p, c, w.frame, 61990, [0.004, 0.006]);
        paintTokay(p, c, w.frame, pose, {t});
      }
      if (aMicro > 0.01) paintMicroContact(aMicro < 1 ? p.layer(aMicro, 94100) : p, {t, glints: 0.45, truck: 20, settle: 1, settleRows: rowSettle(L), S: mix(12, 36, sm(39, 44, L)), shaftMax: L >= 39 ? 150 : undefined, capLen: L >= 39});
    },
    children: calm(0.34 + 0.4 * sm(41, 47, L), 'sh16', 0.3),
    overlay: L < 39 ? <Lbl /> : undefined,
  };
});

// ---- 17. S01-B05-SH01 [1454, 1490): shot 2's end wide, then the whip push (H1): an orbit about the moving look-at, yaw, distance and eye height eased together +6-+16, onto camLF05B.
// The whole front-right foot curls (+18-+30, roll 0 -> 0.6, heel pad down); the front-left stays flat, the hind feet keep his wrists.
type OrbitKey = {at: V3; pos: V3; f: number; hy: number};
const H1A: OrbitKey = {pos: [-1.5, 1.0, 2.2], at: [0.33, 1.5, 0.38], f: 1000, hy: 960};
const H1B: OrbitKey = {pos: [0.33, 2.4, 0.68], at: [0.33, 2.57, 0.38], f: 1450, hy: 800};
const polar = (k: OrbitKey) => { const r: V3 = [k.pos[0] - k.at[0], k.pos[1] - k.at[1], k.pos[2] - k.at[2]]; return {th: Math.atan2(r[0], r[2]), d: Math.hypot(r[0], r[2]), h: r[1]}; };
export const camSH17 = (L: number): YCam => {
  const e = sm(6, 16, L);
  if (e <= 0) return lookCam(H1A.pos, H1A.at, H1A.f, {hy: H1A.hy});
  const a = polar(H1A), b = polar(H1B), at = mixV(H1A.at, H1B.at, e), th = mix(a.th, b.th, e), d = Math.exp(mix(Math.log(a.d), Math.log(b.d), e)), h = mix(a.h, b.h, e);
  return lookCam([at[0] + d * Math.sin(th), at[1] + h, at[2] + d * Math.cos(th)], at, mix(H1A.f, H1B.f, e), {hy: mix(H1A.hy, H1B.hy, e), near: mix(0.3, 0.02, e)});
};
export const curl17 = (L: number) => 0.45 * sm(18, 30, L);
defShot('S01-B05-SH01', (L, g) => {
  const c = camSH17(L);
  return {
    paint: (p) => { paintHang(p, c, hangPoseA({roll: {hl: 0.75, hr: 0.75, fr: curl17(L)}}), {t: g / 30, face: 'scared'}); },
    grade: lin(0, 3, L),
    children: calm(L < 10 ? 0.7 : 0.6, 'sh17'),
    overlay: <Lbl />,
  };
});

// ---- 18. S01-B05-SH02 [1490, 1550): close from below. His eyes snap up +0-+4 (`shock`), V02 shout +8-+49 (mouth moves with the line), the foot uncurls +45-+57, `relieved` +53.
export const camSH18 = (L: number): YCam => lookCam([0.5, 2.05, 1.9 - 0.03 * lin(0, 59, L)], [0.36, 1.98, 0.38], 1250);
export const face18 = (L: number) => {
  const talk = L >= 8 && L < 49 ? 0.4 + 0.5 * Math.abs(Math.sin(L * 0.55)) : L >= 4 && L < 53 ? 0.12 : 0;
  if (L >= 53) return {face: 'relieved' as const, state: {look: [0, -0.4] as [number, number]}};
  if (L >= 4) return {face: 'shock' as const, state: {look: [0, -0.7] as [number, number], open: talk}};
  return {face: 'scared' as const, state: {look: [0, mix(0.35, -0.7, sm(0, 4, L))] as [number, number]}};
};
defShot('S01-B05-SH02', (L, g) => {
  const c = camSH18(L), fc = face18(L), curl = 0.45 * (1 - sm(45, 57, L));
  return {
    paint: (p) => { paintHang(p, c, hangPoseA({roll: {hl: 0.75, hr: 0.75, fr: curl}}), {t: g / 30, face: fc.face, faceState: fc.state}); },
    grade: 1,
    children: calm(0.6, 'sh18'),
    overlay: <Lbl />,
  };
});

// ---- 19. S01-B05-SH03 [1550, 1588): up at the lamp, push in on the head. The tokay at T2 peels all four feet (+5-+19), lunges to T3 (+12-+19), jaws close on the moth at +20, the moth lies whole across
// the jaws +20-+31, one throat bob +31-+35 swallows it, two wing-scale motes drift down from +35.
export const WALK19: WalkCfg = {from: {at: T2, heading: 180}, to: {at: T3, heading: 180}, m0: 12, m1: 18, steps: [18, 20], stance: 12, peel: 0.9, leadK: 0};
export const KEY19A: CamKey = {pos: [0.05, 2.05, 0.45], at: [0.2, 2.7, -0.2], f: 1000};
export const KEY19B: CamKey = {pos: [0.05, 2.05, 0.45], at: [0.11, 2.7, -0.18], f: 1350};
export const camSH19 = (L: number) => camBetween(KEY19A, KEY19B, eo(14, 28, L));
const T3F: Frame = ceilingFrame(T3, 180);
const JAW19 = toW(T3F, [0.1384, 0, 0.056]);
export const pose19 = (L: number): {w: ReturnType<typeof walkAt>; pose: TokayPose} => {
  const w = walkAt(WALK19, L);
  const hp = 34 * sm(14, 20, L) - 5 * Math.sin(Math.PI * sm(31, 35, L)), open = L < 20 ? 0.9 * sm(13, 18, L) : L < 31 ? 0.25 : 0.25 * (1 - sm(31, 35, L));
  const moth = L >= 20 && L < 35 ? 0.098 * (1 - sm(31, 35, L)) : 0;
  const mothFold = L >= 20 && L < 26 ? 35 * Math.sin((Math.PI * (L - 20)) / 6) : L >= 26 && L < 31 ? 17.5 * Math.sin((Math.PI * (L - 26)) / 5) : 0; // flutter: 0 -> 35 -> 0 over +20-+26, then half that over +26-+31
  return {w, pose: {...w.pose, headPitch: hp, jaw: open, moth, mothFold}};
};
const MOTES19: Speck[] = [0, 1].map((i) => ({id: 19900 + i * 10, from: [JAW19[0] + (i ? 0.006 : -0.004), JAW19[1] - 0.004, JAW19[2] + (i ? -0.005 : 0.004)], t0: 35, r: 0.0022, vx: i ? 0.012 : -0.01, vz: 0.006}));
defShot('S01-B05-SH03', (L, g) => {
  const c = camSH19(L), t = g / 30, {w, pose} = pose19(L);
  return {
    paint: (p) => {
      roomBack(p, c, {focus: T3, stippleR: 0.3, stippleStep: 0.01, halo: 0.9});
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, w.frame, 61990, [0.004, 0.006]);
      paintTokay(p, c, w.frame, pose, {t});
      if (L < 20) { const mo = mothAt(g), e = sm(2, 19, L); paintMoth(p, c, mixV(mo.at, JAW19, e), mo.phase); }
      if (L >= 35) for (const s of MOTES19) paintSpeck(p, c, s, L);
    },
    children: calm(0.6, 'sh19'),
  };
});

// ---- 20. S01-B05-SH04 [1588, 1793): her upturned face (hold +0-+50, smile `happy` at +30), crane up past the lamp to the tokay at T3 (+50-+108), V03 call +112-+145 (jaw opens on four syllables),
// closed hold +145-+204 with ambient motion only (fan, breath, tail sway, the occasional head tremor).
export const KEY20A: CamKey = {pos: [-0.05, 0.75, 0.95], at: [-0.35, 1.1, -0.8], f: 1000};
export const KEY20B: CamKey = {pos: [0.1, 2.0, 0.4], at: [0.1, 2.7, -0.1], f: 1000};
export const camSH20 = (L: number) => { const c = camBetween(KEY20A, KEY20B, sm(50, 108, L)); return L > 108 ? {...c, f: c.f * (1 + 0.025 * lin(108, 204, L))} : c; }; // W5-F2 item 5: f 1000 -> 1025 over +108-+204
export const call20 = (L: number): {jaw: number; pitch: number} => {
  if (L < 110 || L >= 151) return {jaw: 0, pitch: 0};
  const k = L - 112, win = k >= 0 && k < 33, ph = (k % 8.25) / 8.25, ring = win ? Math.max(0, Math.sin(Math.PI * Math.min(1, ph / 0.85))) : 0;
  return {jaw: 0.8 * ring, pitch: 36 * (sm(110, 115, L) * (1 - sm(145, 151, L))) + 3 * ring};
};
export const ambient20 = (g: number, L: number): Pick<TokayPose, 'tail' | 'headYaw' | 'flank' | 'tailTip'> => ({tail: [0.012 * Math.sin(g / 21), 0.008 * Math.sin(g / 33 + 1)], headYaw: L >= 145 ? 1.2 * Math.sin(g / 17) : 0,
  flank: L >= 112 ? 0.05 * 0.5 * (1 - Math.cos((2 * Math.PI * Math.min(L - 112, 92)) / 45)) : 0, tailTip: L >= 151 && L <= 191 ? 6 * Math.sin((Math.PI * (L - 151)) / 20) : 0}); // W5-F2 item 5: flank 1.00 -> 1.05 -> 1.00, period 45 f; tail tip one slow sway +-6 deg over +150-+190
defShot('S01-B05-SH04', (L, g) => {
  const c = camSH20(L), t = g / 30, cl = call20(L);
  const happy = L >= 30;
  return {
    paint: (p) => {
      roomBack(p, c, {focus: T3, stippleR: 0.3, stippleStep: 0.01, halo: 0.9});
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, T3F, 61990, [0.004, 0.006]);
      const amb = ambient20(g, L);
      paintTokay(p, c, T3F, restPose({headPitch: cl.pitch, jaw: cl.jaw, tail: amb.tail, headYaw: amb.headYaw, flank: amb.flank, tailTip: amb.tailTip}), {t});
      paintSofaSide(p, c);
      paintWomanLap(p, c, {at: W0_FEET, t, face: happy ? 'happy' : 'neutral', faceState: {look: [0, -0.9]}, tint: 0.05});
      paintSlippers(p, c);
      paintTable(p, c);
    },
    children: calm(L < 70 ? 0.6 : 0.4, 'sh20'),
  };
});
void C; void LAMP_C; void camUnit; void mixYCam; void (undefined as unknown as Painter);
