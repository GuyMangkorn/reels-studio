import {AbsoluteFill} from 'remotion';
import {CameraLayer, type Camera} from '../kit/camera';
import {blob, washAt} from '../kit/draw';
import {Spot} from '../kit/glow';
import {Grain} from '../kit/screen';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {ROOM, paintBedroom, paintDoctor, paintDreamCliff, paintIdeaSpace, paintQuestion, paintTriggerIcons, type IconState, IDEA, paintPaperGround} from './set';
import {paintBrain, paintBubble, paintDreamAir, paintFaller, paintMiniSleeper, paintSideQuestion, paintStreaks, paintSwitch} from './parts';

// EDU-EP01-SHORT W5.2 plates (Boss, 4 Nov 2026): scene sheets EDU-SHEETS-R1.1 (scripts/edu-series/short/scene-sheets.md), 23 shots,
// 1860 f at 30 fps, one shot = one timeline scene. `plateOf(shotId, f)` is a pure function of the shot-local frame `f`: the world
// marks (`paint`), the camera, and the screen layers (grade, glow, dim, flash). The registry adapter is `src/painted/shots/edu01.tsx`.
// No narration, captions, tag or sound here (W5.3, Editor).

export const FPS = 30;

/** Shot ID and length in frames, in timeline order (= review-rows.json start/end; `tests/edu01.test.ts` checks the sum 1860). */
export const EDU1_SHOTS: readonly (readonly [string, number])[] = [
  ['S01-B01-SH01', 124], ['S01-B01-SH02', 37], ['S01-B02-SH01', 113], ['S01-B02-SH02', 57], ['S01-B03-SH01', 80], ['S01-B03-SH02', 79],
  ['S01-B03-SH03', 45], ['S01-B03-SH04', 15], ['S01-B03-SH05', 29], ['S01-B04-SH01', 34], ['S01-B04-SH02', 106], ['S01-B05-SH01', 123],
  ['S01-B05-SH02', 40], ['S01-B05-SH03', 126], ['S01-B05-SH04', 145], ['S01-B05-SH05', 45], ['S01-B05-SH06', 71], ['S01-B06-SH01', 146],
  ['S01-B06-SH02', 68], ['S01-B07-SH01', 99], ['S01-B07-SH02', 55], ['S01-B07-SH03', 109], ['S01-B08-SH01', 114],
];
export const EDU1_TOTAL = EDU1_SHOTS.reduce((a, [, n]) => a + n, 0);
const START: Record<string, number> = {};
EDU1_SHOTS.reduce((a, [id, n]) => ((START[id] = a), a + n), 0);
export const edu1Start = (id: string) => START[id];

export type Kind = 'night' | 'dream' | 'paper';
export const PAPER: Record<Kind, string> = {night: '#22345a', dream: '#f3e9f0', paper: '#efe6d6'};
/** Screen grade per location (look frames): a soft cool vignette at night (never black, UT03), a pale lift in the dream, warm paper edges. */
export const GRADE: Record<Kind, string> = {
  night: 'radial-gradient(ellipse 90% 70% at 55% 42%, rgba(16,24,48,0) 58%, rgba(16,24,48,0.28) 100%)',
  dream: 'radial-gradient(ellipse 90% 75% at 50% 40%, rgba(255,240,246,0.06) 0%, rgba(80,60,130,0) 60%, rgba(80,60,130,0.16) 100%)',
  paper: 'radial-gradient(ellipse 90% 75% at 50% 42%, rgba(255,250,240,0) 60%, rgba(120,96,64,0.14) 100%)',
};

export type Plate = {
  paper: string;
  cam: Camera;
  /** Weights of the three screen grades (a dissolve crossfades them). */
  grade: Partial<Record<Kind, number>>;
  /** Clock glow level (0..1) for the amber spot over the bedside clock. */
  spot: number;
  /** Whole-picture value and saturation, 1 = as painted, 0.78 = the dim of B02-SH02 / B05-SH04. */
  dim: number;
  /** The dim leans cool (lilac shade) instead of neutral grey: paper locations, so the cream stays clean (UT04). */
  dimCool?: boolean;
  /** Room flash (B03-SH05 L0-2), 0..0.3. */
  flash: number;
  /** Warm light lift (B07-SH01), 0..1. */
  warm: number;
  paint: (p: Painter) => void;
};

// ------------------------------------------------------------------ curves

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
/** Linear 0..1 progress of `f` over [a, b]. */
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep value from v0 to v1 over [a, b]. */
const sm = (f: number, a: number, b: number, v0 = 0, v1 = 1) => v0 + (v1 - v0) * smooth(prog(f, a, b));
const lin = (f: number, a: number, b: number, v0 = 0, v1 = 1) => v0 + (v1 - v0) * prog(f, a, b);
const hump = (f: number, a: number, b: number) => Math.sin(Math.PI * prog(f, a, b));
/** Pop-in with a slight overshoot: 0 before `at`, 1 after `at + len`. */
const pop = (f: number, at: number, len = 7) => {
  const u = prog(f, at, at + len);
  return u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.4 * (u - 1) ** 3 + 1.4 * (u - 1) ** 2;
};
/** The shared dimming curve (B02-SH02 and B05-SH04 use the same shape, VD02 / CL01): value and saturation x1.0 -> x0.78. */
export const DIM_END = 0.78;
export const dimCurve = (f: number, a: number, b: number) => 1 - (1 - DIM_END) * smooth(prog(f, a, b));
/** Linear push over the whole shot (frame n-1 reaches s1); fx 540. */
const push = (f: number, n: number, s0: number, s1: number, fy: number): Camera => ({s: s0 + (s1 - s0) * (n > 1 ? f / (n - 1) : 0), fx: 540, fy, dx: 0, dy: 0});

/**
 * Breath phase (cycles) on the ambient clock: phase 0 at comp f0 (VD02), so B01 f0 and the loop's last frame share the state. The
 * period is 2.4 s through B01 and the start of B02, slows to 3.2 s over B02-SH01, then holds (B02-SH02 on).
 */
const breathPhase = (start: number, f: number) => {
  const c = start + f;
  if (c <= 161) return c / 72;
  const L = Math.min(c - 161, 112);
  const base = 161 / 72 + (112 / (0.8 * 30)) * Math.log((2.4 + (0.8 * L) / 112) / 2.4);
  return c <= 273 ? base : base + (c - 273) / 96;
};
const BREATH_PX = 5;
const breathAt = (start: number, f: number, amp = 1) => BREATH_PX * amp * Math.sin(2 * Math.PI * breathPhase(start, f));

// ------------------------------------------------------------------ plate builders

const base = (kind: Kind, cam: Camera, paint: Plate['paint'], o: Partial<Plate> = {}): Plate => ({
  paper: PAPER[kind], cam, grade: {[kind]: 1}, spot: 0, dim: 1, dimCool: kind === 'paper', flash: 0, warm: 0, paint, ...o,
});

type Room = Parameters<typeof paintBedroom>[2];
const room = (st: Room) => (p: Painter) => paintBedroom(p, p.t, st);

const roomPlate = (id: string, f: number, st: Room, cam: Camera, o: Partial<Plate> = {}): Plate =>
  base('night', cam, room(st), {spot: st.clock, ...o});

// ------------------------------------------------------------------ the plates

export const plateOf = (id: string, f: number): Plate => {
  const n = EDU1_SHOTS.find(([s]) => s === id)?.[1];
  if (n === undefined) throw new Error(`EDU-EP01-SHORT: unknown shot ${id}`);
  const st = START[id];
  const cam = (s0: number, s1: number, fy: number) => push(f, n, s0, s1, fy);
  const breath = (amp = 1) => breathAt(st, f, amp);
  const seam: Room = {wallSoft: 0.25, moon: 1, clock: 1, face: 'sleepy', lid: 0.6};

  switch (id) {
    // ---------------------------------------------------------------- G1 bedroom
    case 'S01-B01-SH01':
      return roomPlate(id, f, {...seam, wallSoft: lin(f, 0, 123, 0.25, 0.3), lid: lin(f, 20, 100, 0.6, 1), lift: 5 * hump(f, 112, 118), breath: breath()}, cam(1, 1.02, 820));
    case 'S01-B01-SH02': {
      // close-up crop of the same plate on the head (W5.2 repaint, UT02: zoom 2.4 -> 2.46, anchor the head (372, 846), head to screen
      // (560, 880): the face fills the frame centre, pillow and bed under it; the eye looks at the lens)
      const c: Camera = {s: 2.4 + 0.06 * (f / (n - 1)), fx: 372, fy: 846, dx: 188, dy: 34};
      return roomPlate(id, f, {...seam, wallSoft: 0.3, lid: f < 6 ? 1 : sm(f, 6, 22, 1, 0), smile: sm(f, 22, 30), lens: true, breath: breath()}, c);
    }
    case 'S01-B02-SH01':
      return roomPlate(id, f, {...seam, wallSoft: lin(f, 0, 112, 0.3, 0.4), lid: sm(f, 20, 80, 0, 0.8), smile: lin(f, 0, 20, 1, 0), breath: breath()}, cam(1, 1.015, 820));
    case 'S01-B02-SH02':
      return roomPlate(id, f, {...seam, wallSoft: 0.4, lid: sm(f, 0, 40, 0.8, 1), clock: lin(f, 4, 56, 1, 0.5), sink: sm(f, 10, 50, 0, 8), breath: breath()}, cam(1, 1.012, 820), {dim: dimCurve(f, 4, 56)});
    case 'S01-B03-SH01': {
      // room to cloud bleed: the dream paints over the bedroom (alpha rides u) while the wall turns to mist; the cliff edge shows late
      const u = sm(f, 8, 70), clock = lin(f, 0, 60, 0.5, 0);
      const ledge = lin(f, 56, 79, 0, 0.55);
      return {
        ...roomPlate(id, f, {...seam, wallSoft: lin(f, 0, 60, 0.4, 0.62), lid: 1, clock, sink: 8, breath: breathAt(st, f, 1 - u)}, cam(1, 1.015, 820), {dim: DIM_END + (1 - DIM_END) * u}),
        grade: {night: 1 - u, dream: u},
        paper: PAPER.dream, // ink of the dream layer fades toward the dream paper, not the night ground
        paint: (p) => {
          paintBedroom(p, p.t, {...seam, wallSoft: lin(f, 0, 60, 0.4, 0.62), lid: 1, clock, sink: 8, breath: breathAt(st, f, 1 - u)});
          if (u > 0.003) {
            const la = ledge / Math.max(u, 0.05);
            paintDreamCliff(p.layer(u, 9000), p.t, {figure: false, ledge: la < 0.02 ? 0.0001 : Math.min(1, la)});
          }
        },
      };
    }
    case 'S01-B03-SH02': {
      const lean = 0.1 + 0.25 * sm(f, 55, 66);
      const dy = f >= 62 ? 1650 * prog(f, 62, 78) ** 2 : 0;
      const nod = hump(f, 8, 18);
      // opens a little closer than the end of B03-SH01 (same ledge, empty) and settles back: the cut shows her arriving, no pop (viewer check)
      const open = 0.17 * (1 - smooth(prog(f, 0, 44)));
      return base('dream', {...cam(1, 1.015, 800), s: 1.015 + 0.0 * f + open + 0.0}, (p) => void paintDreamCliff(p, p.t, {lean, dy, dip: 0.14 * nod, roll: 6 + 2.5 * nod}));
    }
    case 'S01-B03-SH03':
    case 'S01-B03-SH04': {
      const L = id === 'S01-B03-SH04' ? 44 : f;
      const e = (L / 44) ** 2, drop = 260 * e;
      const c: Camera = {s: 1, fx: 540, fy: 960, dx: 0, dy: -drop};
      const deg = 12 * Math.sin((2 * Math.PI * L) / 36 + 0.6);
      return base('dream', c, (p) => {
        paintDreamAir(p);
        p.brush.push();
        p.brush.translate(0, drop); // streaks live in screen space: the camera's drop is cancelled
        paintStreaks(p, L, false);
        paintStreaks(p, L, true); // W5.2 round 2: all streaks behind her (the pale front set showed through the trousers)
        p.brush.pop();
        paintFaller(p, p.t, 540, 900 + drop, deg);
      });
    }
    case 'S01-B03-SH05': {
      const lift = f < 5 ? 56 * (1 - (1 - f / 5) ** 2) : f < 12 ? 56 - 62 * smooth((f - 5) / 7) : -6 * (1 - smooth(prog(f, 12, 18)));
      const flash = f <= 2 ? 0.24 - 0.06 * f : 0;
      return roomPlate(id, f, {wallSoft: 0, moon: 1, clock: 1, face: 'sleepy', lid: 0, wide: true, lift, jump: 24 * hump(f, 0, 12) ** 1.2}, cam(1, 1, 820), {flash});
    }
    case 'S01-B04-SH01': {
      const rot = sm(f, 0, 22);
      return roomPlate(id, f, {wallSoft: lin(f, 0, 33, 0, 0.2), moon: 1, clock: 1, face: 'sleepy', lid: 0.1, rot, arms: sm(f, 4, 14), hand: sm(f, 14, 24), breath: breath(0.8)}, cam(1, 1.01, 820));
    }
    case 'S01-B04-SH02':
      return roomPlate(id, f, {wallSoft: lin(f, 0, 105, 0.2, 0.25), moon: 1, clock: 1, face: 'sleepy', lid: 0.1, rot: 1, arms: 1, hand: 1, breath: breath(0.7)}, cam(1, 1.012, 820));
    case 'S01-B07-SH01':
      return roomPlate(id, f, {wallSoft: 0.25, moon: 1, clock: 1, face: 'sleepy', lid: 0.1, rot: 1, arms: 1, hand: 0, smile: sm(f, 20, 40, 0, 0.9), hug: sm(f, 30, 60), breath: breath(0.7)}, cam(1, 1.01, 820), {warm: sm(f, 0, 98, 0, 1)});
    case 'S01-B07-SH02':
      return roomPlate(id, f, {wallSoft: 0.25, moon: 1, clock: 1, face: 'sleepy', lid: 0.5, breath: breath()}, cam(1, 1.01, 820), {spot: 1.25});
    case 'S01-B08-SH01': {
      const amp = 1 - sm(f, 80, 98);
      const c: Camera = {s: 1.02 - 0.02 * prog(f, 0, 98), fx: 540, fy: 820, dx: 0, dy: 0};
      return roomPlate(id, f, {wallSoft: lin(f, 20, 98, 0, 0.25), moon: 1, clock: 1, face: 'sleepy', lid: sm(f, 50, 90, 0, 0.6), rot: 1 - sm(f, 10, 70), arms: 1 - sm(f, 40, 70), hand: 0, smile: lin(f, 0, 25, 0.5, 0), breath: breath(amp)}, c);
    }

    // ---------------------------------------------------------------- G3 idea space
    case 'S01-B05-SH01':
      return base('paper', cam(1, 1.015, 900), (p) => void paintIdeaSpace(p, p.t, {q: sm(f, 6, 40), tilt: sm(f, 10, 30)}));
    case 'S01-B05-SH02':
      return base('paper', cam(1, 1.01, 900), (p) => paintWideIdea(p, f, {pops: [8, 20], content: 0, strength: 1}));
    case 'S01-B05-SH03':
      return base('paper', cam(1, 1.015, 600), (p) => paintHypothesisA(p, f));
    case 'S01-B05-SH04':
    case 'S01-B05-SH05': {
      const c = id === 'S01-B05-SH05' ? {...push(0, 2, 1.012, 1.012, 600)} : cam(1, 1.012, 600);
      const sink = id === 'S01-B05-SH05' ? 8 : sm(f, 40, 110, 0, 8);
      const dim = id === 'S01-B05-SH05' ? DIM_END : dimCurve(f, 40, 110);
      return base('paper', c, (p) => paintHypothesisB(p, f, id === 'S01-B05-SH05', sink), {dim});
    }
    case 'S01-B05-SH06':
      return base('paper', cam(1, 1.012, 900), (p) => paintWideIdea(p, f, {pops: [-99, -99], content: 1 - sm(f, 0, 40), strength: 1 - 0.8 * sm(f, 10, 60), drip: sm(f, 0, 60)}), {dim: DIM_END + (1 - DIM_END) * sm(f, 0, 60)});

    // ---------------------------------------------------------------- G4 icons
    case 'S01-B06-SH01': {
      const st1: IconState = {cup: pop(f, 64), scribble: pop(f, 90), moon: pop(f, 121), dumbbell: 0};
      return base('paper', cam(1, 1.02, 600), (p) => paintTriggerIcons(p, st1));
    }
    case 'S01-B06-SH02': {
      const st2: IconState = {cup: 1, scribble: 1, moon: 1, dumbbell: pop(f, 4), dim: lin(f, 4, 20, 1, 0.6)};
      return base('paper', cam(1.02, 1.03, 600), (p) => paintTriggerIcons(p, st2));
    }

    // ---------------------------------------------------------------- G5 doctor
    case 'S01-B07-SH03': {
      const nod = 0.11 * (hump(f, 35, 45) + hump(f, 75, 85));
      return base('paper', cam(1, 1.015, 700), (p) => void paintDoctor(p, p.t, {nod, rise: 0.004 * Math.sin((2 * Math.PI * f) / 80)}));
    }
    default:
      throw new Error(`EDU-EP01-SHORT: no plate for ${id}`);
  }
};

// ------------------------------------------------------------------ B05 compositions

const BUB_L: Pt = [270, 650], BUB_R: Pt = [810, 650];
const mix = mixColor;

/** Wide idea space (B05-SH02, SH06): she sits small on the paper, two bubbles over her head with an empty "?" inside. */
const paintWideIdea = (p: Painter, f: number, o: {pops: [number, number]; content: number; strength: number; drip?: number}) => {
  paintIdeaSpace(p, p.t, {q: 0, tilt: 0.6, g: [540, 1500], U: 330});
  const head: Pt = [540, 1500 - 1.58 * 330 * 0.88];
  ([BUB_L, BUB_R] as const).forEach(([cx, cy], i) => {
    const k = o.pops[i] < -50 ? 1 : pop(f, o.pops[i], 8);
    if (k <= 0.001) return;
    p.brush.push();
    p.brush.translate(cx, cy);
    p.brush.scale(k);
    p.brush.translate(-cx, -cy);
    paintBubble(p, 1200 + i * 60, cx, cy, 215, 185, Math.min(1, k * 2) * o.strength, head);
    if (o.content > 0.01) {
      const q = p.layer(o.content, 9200 + i * 10);
      if (i === 0) paintMiniSwitch(q, cx, cy);
      else paintBrain(q, 1300 + i * 60, cx, cy - 20, 210, 0.2, 0.9);
    } else paintQuestion(p, 1250 + i * 5, cx, cy + 20, 190 * Math.min(1, k * 2), IDEA.violet, 6);
    p.brush.pop();
    if (o.content > 0.01) paintQuestion(p, 1250 + i * 5, cx + (i ? 0 : 0), cy + 150, 80, IDEA.violet, 3);
  });
  // wet runs under the bubbles (the wash-out, B05-SH06): lilac drips that lengthen as the colour leaves
  const dr = o.drip ?? 0;
  if (dr > 0.01) {
    ([BUB_L, BUB_R] as const).forEach(([cx, cy], i) => {
      for (let j = 0; j < 4; j++) {
        const x = cx - 130 + j * 85 + (j % 2) * 14, len = (60 + 70 * ((j * 37 + i * 11) % 5) / 4) * dr;
        washAt(p, 1400 + i * 10 + j, '#b9b4dc', 150 * (1 - dr * 0.4), blob(1400 + i * 10 + j, x, cy + 170 + len / 2, 11, len / 2, 0), 0.5, 0.5);
      }
    });
  }
};

const paintMiniSwitch = (p: Painter, cx: number, cy: number) => {
  paintBrain(p, 1310, cx, cy - 50, 180, 0, 0.8);
  paintSwitch(p, 1330, cx, cy + 70, 130, 0.5);
};

/** B05-SH03: hypothesis A. The left bubble fills the frame: a brain-cloud over a sun/moon switch; "?" beside the bubble. */
const paintHypothesisA = (p: Painter, f: number) => {
  paintPaperGround(p, 400);
  const settle = sm(f, 0, 20), k = 0.9 + 0.1 * settle, dy = 14 * (1 - settle);
  paintBubble(p, 1500, 470, 560, 380, 380, 1);
  paintBrain(p, 1520, 470, 395 + dy, 430 * k, 0, 0.8);
  // the knob slides L40-95 to a few px short of the moon end, jolts and sticks (stall L95-110)
  const u = f < 95 ? sm(f, 40, 95, 0, 0.965) : 0.965 - 0.006 * Math.sin(Math.PI * prog(f, 95, 99)) - 0.004 * hump(f, 99, 110);
  paintSwitch(p, 1560, 470, 745, 330, u);
  paintSideQuestion(p, 1600, 930, 470, 250);
};

/** B05-SH04, SH05: hypothesis B. The right bubble fills the frame; the brain-cloud looks down at the relaxed mini-figure; in SH05 it sends a line down and she twitches once. */
const paintHypothesisB = (p: Painter, f: number, line: boolean, sink: number) => {
  paintPaperGround(p, 400);
  paintBubble(p, 1700, 610, 560, 380, 380, 1);
  paintBrain(p, 1720, 610, 385, 400, 0.2, 1);
  const tw = line ? hump(f, 8, 16) : 0;
  paintMiniSleeper(p, p.t, 760, 805 + sink, 190, tw);
  if (line) {
    const grow = prog(f, 6, 14), fade = prog(f, 22, 32);
    if (grow > 0.01 && fade < 1) {
      const y1 = 520 + (730 - 520) * grow;
      p.inkStill(1780, 'marker', mix('#8a5a86', '#c9c6ec', fade), 4);
      p.brush.spline([[612, 520], [600, 520 + (y1 - 520) * 0.4], [622, 520 + (y1 - 520) * 0.7], [610, y1]], 0.6);
    }
  }
  const wob = !line ? 0.08 * Math.sin((2 * Math.PI * (f - 120)) / 12) * (f >= 120 && f <= 132 ? 1 : 0) : 0;
  paintSideQuestion(p, 1740, 165, 470, 250, wob);
};

// ------------------------------------------------------------------ screen layers

/** The whole-picture dim: multiply (value) and a grey `saturation` layer, both riding `dim` (1 = none). `cool` (paper): the multiply
 *  leans lilac and the saturation pull is light, so warm cream dims to a soft lilac-cream, not a grey-taupe. */
export const DimLayer = ({dim, cool}: {dim: number; cool?: boolean}) => {
  if (dim >= 0.999) return null;
  const d = 1 - dim;
  const rgb = cool ? `rgb(${Math.round(255 * (1 - 0.55 * d))},${Math.round(255 * (1 - 0.75 * d))},${Math.round(255 * (1 - 0.3 * d))})` : `rgb(${Math.round(255 * dim)},${Math.round(255 * dim)},${Math.round(255 * dim)})`;
  return (
    <>
      <AbsoluteFill style={{pointerEvents: 'none', background: rgb, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{pointerEvents: 'none', background: '#808080', mixBlendMode: 'saturation', opacity: cool ? 0.25 * d : d}} />
    </>
  );
};

/** Grade, clock glow, flash, warm lift, dim and grain of one plate. */
export const PlateLayers = ({plate, camera, width, height}: {plate: Plate; camera: Camera; width: number; height: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {plate.spot > 0.01 ? (
      <CameraLayer camera={camera} width={width} height={height}>
        <Spot x={ROOM.clock.x + 10} y={ROOM.clock.y + 20} r={150} level={0.24 * plate.spot} color="#f0a050" />
      </CameraLayer>
    ) : null}
    {(Object.keys(plate.grade) as Kind[]).map((k) => <AbsoluteFill key={k} style={{background: GRADE[k], opacity: plate.grade[k] ?? 0}} />)}
    {plate.warm > 0.01 ? <AbsoluteFill style={{background: '#f0b070', mixBlendMode: 'soft-light', opacity: 0.22 * plate.warm}} /> : null}
    {plate.flash > 0 ? <AbsoluteFill style={{background: '#e4ecff', mixBlendMode: 'screen', opacity: plate.flash}} /> : null}
    <DimLayer dim={plate.dim} cool={plate.dimCool} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);

