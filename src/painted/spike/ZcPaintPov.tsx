import {AbsoluteFill} from 'remotion';
import {BrushCanvas, hash, type Brush, type PaintContext} from '../BrushCanvas';
import {applyCamera, pushCamera} from '../kit/camera';
import {ramp} from '../kit/painter';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import type {Cast} from './CastSheet';
import {paintHead, type Face} from './FaceSheet';
import {makePaint, paintBodySide} from './SideSheet';
import {Subtitles} from '../../scenes/Subtitles';
import {Grade, Grain} from './WfogShop';

// ZCPAINT Film feasibility spike for VB-ZCPAINT-SHORT-R2 (29 Oct 2026, user look-check answers): (1) the B02 first-person
// barricade (his hands pushing the cabinet flush, the door shaking under the pounding) and (2) the infected's rage face
// close, both in the cream condo palette, on the WORLD FOG decal head (FaceSheet paintHead, unchanged). Own entry point
// (zcpaint-pov-index.ts); nothing registered elsewhere. Fills follow the WORLD FOG rule: opaque zero-bleed passes, no
// brush.wash(). 1080x1920, top-left origin.

const INK = '#2b211c';

/** Opaque decal fill (n seeded passes) and boiling rotring ink, with their own seed spaces. */
const kit = (ctx: PaintContext, base: number) => {
  let seed = base, line = base + 900;
  const ink = (pts: Pt[], weight = 1.1, curve = 0.15, color = INK) => {
    ctx.boil(++line);
    ctx.brush.set('rotring', color, weight);
    ctx.brush.spline(pts, curve);
  };
  const part = (color: string, pts: Pt[], outline = false, passes = 4, texture = 0.08) => {
    for (let p = 0; p < passes; p++) {
      ctx.still(++seed);
      ctx.brush.noStroke();
      ctx.brush.fill(color, 255);
      ctx.brush.fillBleed(0);
      ctx.brush.fillTexture(texture, 0.2);
      ctx.brush.polygon(pts);
      ctx.brush.noFill();
    }
    if (outline) ink([...pts, pts[0]]);
  };
  /** Translucent soft veil (shadow, light, smear). */
  const veil = (color: string, opacity: number, pts: Pt[], bleed = 0.3) => {
    ctx.still(++seed);
    ctx.brush.noStroke();
    ctx.brush.fill(color, opacity);
    ctx.brush.fillBleed(bleed);
    ctx.brush.fillTexture(0.4, 0.4);
    ctx.brush.polygon(pts);
    ctx.brush.noFill();
  };
  return {part, ink, veil};
};

// Cream condo palette (user, 29 Oct 2026: “โทนสีคอนโด สีครีมได้นะ”), lowered for the horror read.
const CREAM = {wall: '#d9ccb0', wallShade: '#b9aa8c', door: '#c4b392', doorShade: '#a8977a', jamb: '#e6dbc2', cab: '#cdb48c', cabTop: '#e2cfa8', cabShade: '#9c8664', floor: '#8c7c62', dark: '#2a2420'};
const SKIN = '#e2b084', SKIN_SHADE = '#c99468', TEE = '#2f5a5c';

// --- B02 POV: first-person barricade, modelled on the WORLD FOG phone insert (src/painted/spike/WfogPhone.tsx, S02-SH02;
// user, 29 Oct 2026: “ถ้าดูจาก wordfog ไอ first person ของโทรศัพย์ ผมชอบมาก”). Same layering: L0 a soft, defocused
// painted background (door, wall, cabinet top) under a defocus veil; L1 the hands in front, crisp: solid seeded fills,
// two-bone thumb, capsule fingers with short natural nails, one cel shade, rotring ink, knuckle creases. His hands:
// adult man (broader palm and fingers than the phone hand), bare forearms, teal short sleeves at the frame corners.
// Composed POV layout POV-2D: verticals stay vertical; the door fills the top, the cabinet top the middle band; the
// hands press its front edge above the caption zone. WfogPhone helpers are copied, not imported (they are not exported).

const NAIL = '#f1d6c2', SKIN_DEEP = '#b98257', TEE_SHADE = '#24484a';
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 18): Pt[] => Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);
/** A rounded segment a-b, width w0 at a and w1 at b (WfogPhone `capsule`). */
const capsule = (a: Pt, b: Pt, w0: number, w1: number): Pt[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const arc = (c: Pt, r: number, from: number): Pt[] => Array.from({length: 9}, (_, i): Pt => [c[0] + r * Math.cos(from + (Math.PI * i) / 8), c[1] + r * Math.sin(from + (Math.PI * i) / 8)]);
  return [...arc(b, w1 / 2, ang - Math.PI / 2), ...arc(a, w0 / 2, ang + Math.PI / 2)];
};
/** Solid seeded fill, no watercolour border (WfogPhone `solid`). */
const solid = (p: Painter, seed: number, color: string, pts: Pt[], n = 6, texture = 0.06) => {
  for (let k = 0; k < n; k++) {
    p.brush.seed(seed * 16 + k);
    p.brush.noiseSeed(seed * 16 + k);
    p.brush.noStroke();
    p.brush.fill(color, 255);
    p.brush.fillBleed(0);
    p.brush.fillTexture(texture, 0.15);
    p.brush.polygon(pts);
    p.brush.noFill();
  }
};
const inkLine = (p: Painter, id: number, pts: Pt[], w = 1.1, curve = 0.2, closed = true, color = INK) => {
  p.ink(id, 'rotring', color, w);
  p.brush.spline(closed ? [...pts, pts[0]] : pts, curve);
};

/** L0: the door (shaking), wall and cabinet top, soft. `jolt` is the door's sideways kick in px. */
const paintBarricade = (p: Painter, jolt: number) => {
  // Opaque decal fills (WORLD FOG rule) so the door and cabinet keep their shapes; softness comes from the veil.
  solid(p, 100, CREAM.wall, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]], 3);
  solid(p, 101, CREAM.wallShade, [[-100, -100], [120, -100], [120, 600], [-100, 600]], 3);
  solid(p, 102, CREAM.jamb, [[100, -100], [1000, -100], [1000, 600], [100, 600]], 4);
  inkLine(p, 100, [[100, -100], [100, 600]], 1.2, 0, false);
  inkLine(p, 101, [[1000, -100], [1000, 600]], 1.2, 0, false);
  p.brush.push();
  p.brush.translate(jolt, 0);
  solid(p, 103, CREAM.door, [[150, -100], [940, -100], [940, 600], [150, 600]], 4);
  solid(p, 104, CREAM.doorShade, [[150, 330], [940, 330], [940, 600], [150, 600]], 3);
  inkLine(p, 102, [[150, -100], [150, 600]], 1.3, 0, false);
  inkLine(p, 103, [[230, 40], [860, 40], [860, 300], [230, 300]], 0.9, 0.05, true, '#8a7a60'); // plain recessed panel, no peephole
  solid(p, 105, '#6f665a', ring(850, 420, 26, 26, 16), 6); // thumb-turn deadbolt
  solid(p, 106, '#4f483f', [[840, 408], [860, 408], [860, 432], [840, 432]], 6);
  inkLine(p, 104, ring(850, 420, 26, 26, 16), 1.0, 0.3);
  p.brush.pop();
  solid(p, 107, CREAM.dark, [[940 + jolt, -100], [956, -100], [956, 600], [940 + jolt, 600]], 6, 0); // latch gap, dark
  // Cabinet: top slab seen from above, its front edge, then the front face falling away into shadow.
  solid(p, 110, CREAM.cabTop, [[110, 560], [970, 560], [1040, 770], [40, 770]], 4);
  solid(p, 111, '#c2a67c', [[110, 560], [970, 560], [980, 600], [100, 600]], 3); // back edge in the door's shadow
  solid(p, 112, '#b0956c', [[40, 770], [1040, 770], [1040, 800], [40, 800]], 4); // edge thickness
  inkLine(p, 110, [[110, 560], [970, 560], [1040, 770], [40, 770]], 1.2, 0.05);
  solid(p, 113, CREAM.cab, [[40, 800], [1040, 800], [1100, 2100], [-20, 2100]], 4);
  p.wash(CREAM.cabShade, 200, [[-40, 960], [1120, 960], [1120, 2100], [-40, 2100]], 0.3, 0.45); // keeps the caption band dark
  p.wash('#3a3128', 150, [[-40, 1150], [1120, 1150], [1120, 2100], [-40, 2100]], 0.3, 0.45);
  // Defocus veil over the far plane (door), which sits behind the hands (WfogPhone L0).
  p.wash('#d6c9ad', 70, [[-100, -100], [1200, -100], [1200, 560], [-100, 560]], 0.4, 0.4);
};

/** L1: one hand pressing on the cabinet's top front edge; side -1 left hand, +1 right hand; `press` 0..1 on impact. */
const paintHandPov = (p: Painter, side: -1 | 1, press: number, base: number) => {
  const X = (u: number) => 540 + side * u;
  // Forearm from the bottom corner to the wrist, teal short sleeve at the frame edge.
  const wrist: Pt = [X(225), 770], elbow: Pt = [X(400), 1520];
  solid(p, base + 1, TEE, capsule([X(560), 2080], [X(470), 1700], 330, 280));
  solid(p, base + 2, TEE_SHADE, [[X(470), 1700], [X(600), 1760], [X(640), 2100], [X(520), 2100]], 4);
  solid(p, base + 3, SKIN_SHADE, capsule([X(470), 1730], elbow, 170, 150));
  solid(p, base + 4, SKIN, capsule(elbow, wrist, 150, 128));
  inkLine(p, base + 1, capsule(elbow, wrist, 150, 128), 1.1, 0.2);
  // Back of the hand, flat on the top, fingers pointing toward the door.
  const sq = 1 + 0.03 * press;
  const palm: Pt[] = [[X(140 * sq), 760], [X(320 * sq), 760], [X(340 * sq), 660], [X(305 * sq), 610], [X(155 * sq), 610], [X(122 * sq), 680]];
  solid(p, base + 5, SKIN, palm);
  solid(p, base + 6, SKIN_SHADE, [[X(140 * sq), 760], [X(320 * sq), 760], [X(334 * sq), 715], [X(130 * sq), 722]], 4);
  inkLine(p, base + 2, palm, 1.1, 0.3);
  // Four fingers: capsule + nail toward the camera (seen from behind and above), outer finger shortest.
  const fingers: [number, number, number][] = [[172, 560, 44], [218, 548, 46], [264, 552, 45], [306, 572, 40]];
  fingers.forEach(([u, tipY, w], i) => {
    const a: Pt = [X(u * sq), 620], b: Pt = [X(u * sq + side * (i - 1.5) * 6), tipY];
    const shape = capsule(a, b, w, w * 0.92);
    solid(p, base + 10 + i, SKIN, shape);
    solid(p, base + 20 + i, NAIL, ring(b[0], b[1] + 14, w * 0.3, w * 0.36, 12), 4, 0.02);
    inkLine(p, base + 10 + i, shape, 1.0, 0.3);
    inkLine(p, base + 20 + i, [[b[0] - w * 0.24, 604 + i * 2], [b[0] + w * 0.24, 604 + i * 2]], 0.8, 0.4, false, '#9c6f52'); // knuckle crease
  });
  // Thumb along the edge toward the centre: two-bone, cel shade underneath, nail.
  const B: Pt = [X(135 * sq), 720], K: Pt = [X(92), 700], T: Pt = [X(50), 668];
  const thumb = [capsule(B, K, 62, 52), capsule(K, T, 52, 46)];
  thumb.forEach((sh, i) => solid(p, base + 30 + i, SKIN, sh));
  solid(p, base + 32, SKIN_DEEP, [[K[0], K[1] + 18], [T[0], T[1] + 16], [T[0], T[1] + 6], [K[0], K[1] + 8]], 3);
  solid(p, base + 33, NAIL, ring(T[0] + side * 4, T[1] - 4, 15, 12, 12), 4, 0.02);
  thumb.forEach((sh, i) => inkLine(p, base + 30 + i, sh, 1.0, 0.3));
  // Contact shadow under the hand on the cabinet top (pressed: tighter, darker).
  solid(p, base + 40, '#a48a64', [[X(130), 762], [X(335), 762], [X(325), 784], [X(140), 784]], 3, 0.1);
};

/** Screen-space dark falloff over the lower frame (stacked soft fills, seeded), shared by both spike shots. */
const falloff = (ctx: PaintContext) => {
  for (const [y, op] of [[840, 225], [900, 225], [980, 200], [1060, 160]] as const) {
    ctx.still(8000 + y);
    ctx.brush.noStroke();
    ctx.brush.fill('#1a1612', op);
    ctx.brush.fillBleed(0.35);
    ctx.brush.fillTexture(0.15, 0.3);
    ctx.brush.polygon([[-60, y], [1140, y], [1140, 1990], [-60, 1990]]);
    ctx.brush.noFill();
  }
};

const b02Pov = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const p = makePainter(brush, {t, frame: Math.round(t * 30), fade: CREAM.wall});
  // Pounding ~2.4/s: the door leaf jolts a few px and settles (seeded amplitude per beat); knuckles tense on impact.
  const beatT = t * 2.4, beat = Math.floor(beatT), ph = beatT - beat;
  const hit = Math.exp(-ph * 9);
  const jolt = hit * (6 + 6 * hash(beat + 3)) * (hash(beat + 11) > 0.5 ? 1 : -1);
  brush.push();
  // The last centimetres of the push: a short forward ease, then a hold.
  applyCamera(brush, pushCamera(t, 1.5, {s0: 1, s1: 1.04, fx: 540, fy: 600}));
  paintBarricade(p, jolt);
  // Shudder strokes on each impact at the door's edges (ink, boiling).
  if (ph < 0.18) {
    for (let i = 0; i < 3; i++) {
      const y = 90 + i * 130 + hash(beat * 5 + i) * 40;
      inkLine(p, 600 + i, [[130, y], [86, y - 14]], 1.6, 0, false, '#5a4a3a');
      inkLine(p, 610 + i, [[970, y + 30], [1016, y + 16]], 1.6, 0, false, '#5a4a3a');
    }
  }
  paintHandPov(p, -1, hit, 7000);
  paintHandPov(p, 1, hit, 7100);
  brush.pop();
  // Screen-space falloff: the lamp is above and behind the door, so the near cabinet face and forearms fall into shadow;
  // keeps the caption band (y 860-1248) under the luma limit on a cream set.
  falloff(ctx);
};

// --- R2.1 full-frame B02-SH02 POV (user, 29 Oct 2026: “POV แบบเห็นเกือบเต็มจอได้ไหม 80-90% ไม่เอาเงาดำ ๆ บัง และ POV
// แค่ฝั่งเราได้ไหม”): the picture fills the frame, no dark band; the door is larger, the cabinet top sits at y ~800-1060,
// the hands drag it sideways flush (x +240 -> 0 over 1.4 s with a small bob) while the door jolts on each blow. The
// caption block (bottom edge y 1248) sits over the cabinet with ZC-CAPSHADE. The bottom corners fall to dark floor tiles
// and the Grade vignette, not to a black block.

const paintBarricadeFull = (p: Painter, jolt: number, slide: number, bob: number) => {
  solid(p, 200, CREAM.wall, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]], 3);
  solid(p, 201, CREAM.wallShade, [[-100, -100], [110, -100], [110, 900], [-100, 900]], 3);
  solid(p, 202, CREAM.jamb, [[90, -100], [1010, -100], [1010, 900], [90, 900]], 4);
  inkLine(p, 200, [[90, -100], [90, 900]], 1.2, 0, false);
  inkLine(p, 201, [[1010, -100], [1010, 900]], 1.2, 0, false);
  p.brush.push();
  p.brush.translate(jolt, 0);
  solid(p, 203, CREAM.door, [[140, -100], [950, -100], [950, 900], [140, 900]], 4);
  solid(p, 204, CREAM.doorShade, [[140, 520], [950, 520], [950, 900], [140, 900]], 3);
  inkLine(p, 202, [[140, -100], [140, 900]], 1.3, 0, false);
  inkLine(p, 203, [[230, 60], [860, 60], [860, 460], [230, 460]], 0.9, 0.05, true, '#8a7a60'); // plain panel, no peephole
  solid(p, 205, '#6f665a', ring(860, 640, 30, 30, 16), 6); // thumb-turn deadbolt, turned (locked)
  solid(p, 206, '#4f483f', [[848, 612], [872, 612], [872, 668], [848, 668]], 6);
  inkLine(p, 204, ring(860, 640, 30, 30, 16), 1.0, 0.3);
  p.brush.pop();
  solid(p, 207, CREAM.dark, [[950 + jolt, -100], [966, -100], [966, 900], [950 + jolt, 900]], 6, 0); // latch gap, dark
  // Floor tiles at the bottom corners (dark, not black), seen past the cabinet.
  solid(p, 208, '#4e4134', [[-100, 1500], [1200, 1500], [1200, 2100], [-100, 2100]], 3);
  solid(p, 209, '#5f5040', [[-100, 1500], [1200, 1500], [1200, 1530], [-100, 1530]], 3);
  // Cabinet, dragged sideways toward flush.
  p.brush.push();
  p.brush.translate(slide, bob);
  solid(p, 210, CREAM.cabTop, [[120, 800], [960, 800], [1040, 1030], [40, 1030]], 4);
  solid(p, 211, '#c2a67c', [[120, 800], [960, 800], [972, 840], [108, 840]], 3);
  solid(p, 212, '#b0956c', [[40, 1030], [1040, 1030], [1040, 1062], [40, 1062]], 4);
  inkLine(p, 210, [[120, 800], [960, 800], [1040, 1030], [40, 1030]], 1.2, 0.05);
  solid(p, 213, '#8a7556', [[40, 1062], [1040, 1062], [1070, 1720], [10, 1720]], 4); // front face turned away from the lamp
  solid(p, 214, '#6e5c44', [[10, 1500], [1070, 1500], [1080, 1720], [0, 1720]], 3); // base in its own shadow
  inkLine(p, 211, [[40, 1062], [1040, 1062], [1070, 1720], [10, 1720]], 1.1, 0.05);
  inkLine(p, 212, [[470, 1100], [470, 1680]], 0.9, 0, false, '#8a7458'); // the two cabinet doors
  solid(p, 215, '#8a7458', ring(440, 1380, 10, 10, 10), 4);
  solid(p, 216, '#8a7458', ring(500, 1380, 10, 10, 10), 4);
  p.brush.pop();
  // Defocus veil over the far plane (door) behind the hands (WfogPhone L0).
  p.wash('#d6c9ad', 60, [[-100, -100], [1200, -100], [1200, 800], [-100, 800]], 0.4, 0.4);
};

const b02PovFull = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const p = makePainter(brush, {t, frame: Math.round(t * 30), fade: CREAM.wall});
  const beatT = t * 2.4, beat = Math.floor(beatT), ph = beatT - beat;
  const hit = Math.exp(-ph * 9);
  const jolt = hit * (6 + 6 * hash(beat + 3)) * (hash(beat + 11) > 0.5 ? 1 : -1);
  const u = Math.min(1, t / 1.4), e = u * u * (3 - 2 * u);
  const slide = 240 * (1 - e), bob = -8 * Math.sin(Math.min(1, t / 1.4) * Math.PI * 3) * (1 - e);
  brush.push();
  applyCamera(brush, pushCamera(t, 2.5, {s0: 1, s1: 1.03, fx: 540, fy: 800}));
  paintBarricadeFull(p, jolt, slide, bob);
  if (ph < 0.18) {
    for (let i = 0; i < 3; i++) {
      const y = 120 + i * 200 + hash(beat * 5 + i) * 50;
      inkLine(p, 620 + i, [[120, y], [76, y - 14]], 1.6, 0, false, '#5a4a3a');
      inkLine(p, 630 + i, [[980, y + 30], [1026, y + 16]], 1.6, 0, false, '#5a4a3a');
    }
  }
  // Hands ride with the cabinet: same WfogPhone-style hand, moved down onto the lower cabinet top.
  brush.push();
  brush.translate(slide, 240 + bob);
  paintHandPov(p, -1, hit, 7200);
  paintHandPov(p, 1, hit, 7300);
  brush.pop();
  brush.pop();
};

// --- Infected rage face close (B01-SH02 end state): WORLD FOG front decal head, unchanged, with a ZC overlay:
// hair over one eye, blood on the face, a snarling zombie mouth with a little blood, rage brows.

const RAGE: Face = {name: 'rage', brow: 'angry', eyes: 'wide', look: [0, 0], mouth: 'flat'};

const rageFace = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const k = kit(ctx, 1000);
  brush.push();
  applyCamera(brush, pushCamera(t, 3, {s0: 1, s1: 1.03, fx: 540, fy: 560}));
  // Corridor behind her, cream under cool fluorescent light, far window glow; values lowered.
  k.part('#b9b19b', [[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], false, 3);
  k.part('#e9e4d4', [[60, 160], [250, 160], [250, 620], [60, 620]], false, 4); // far window, off her head
  k.veil('#7e7a6c', 120, [[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], 0.5);
  // Shoulders: pale sleep shirt with dried blood on the front.
  const shirt: Pt[] = [[150, 2000], [210, 1020], [380, 880], [700, 880], [870, 1020], [930, 2000]];
  k.part('#c9c5b8', shirt, true, 4);
  k.part('#5a1d1a', [[470, 905], [600, 905], [585, 990], [540, 1040], [480, 975]], false, 5); // dried blood on the collar
  k.part('#b4ae9f', [[465, 760], [615, 760], [630, 905], [450, 905]], false, 6); // neck
  // Head: WORLD FOG paintHead, pale skin, dark bob, angry brows, wide eyes.
  const cx = 540, cy = 560, K = 220;
  const H = (u: number, v: number): Pt => [cx + u * K, cy + v * K];
  paintHead(ctx, 7, cx, cy, K, RAGE, {skin: '#bdb9a6', hair: '#151314', cut: 'bob'});
  const z = kit(ctx, 5000);
  // Bloodshot rims around the visible eye (screen left), and the angry pupil stays as drawn.
  z.ink([[cx - 0.62 * K, cy + 0.05 * K], [cx - 0.4 * K, cy - 0.12 * K], [cx - 0.18 * K, cy + 0.05 * K]], 1.4, 0.4, '#7a1f1f');
  // Hair lock over the other eye (screen right): from the fringe down past the cheek.
  z.part('#151314', [H(0.12, -0.5), H(0.55, -0.48), H(0.78, -0.1), H(0.74, 0.38), H(0.6, 0.62), H(0.5, 0.3), H(0.2, -0.05)], true, 8);
  // Zombie mouth: open snarl, dark, ragged teeth top and bottom, a little blood at the corners and on the chin.
  const mouth: Pt[] = [H(-0.32, 0.55), H(-0.12, 0.5), H(0.12, 0.51), H(0.3, 0.56), H(0.24, 0.76), H(0, 0.8), H(-0.24, 0.75)];
  z.part('#2a0f0f', mouth, true, 8);
  for (let i = 0; i < 5; i++) {
    const u = -0.22 + i * 0.11;
    z.part('#e8e2cf', [H(u - 0.04, 0.52 + Math.abs(u) * 0.08), H(u + 0.04, 0.52 + Math.abs(u) * 0.08), H(u, 0.6 + 0.02 * (i % 2))], false, 8);
    if (i % 2 === 0) z.part('#e8e2cf', [H(u - 0.03, 0.77 - Math.abs(u) * 0.08), H(u + 0.03, 0.77 - Math.abs(u) * 0.08), H(u, 0.7)], false, 8);
  }
  z.part('#5a1414', [H(-0.34, 0.6), H(-0.28, 0.62), H(-0.3, 0.86), H(-0.35, 0.84)], false, 6); // drip, left corner
  z.part('#5a1414', [H(0.04, 0.8), H(0.12, 0.8), H(0.1, 1.08), H(0.05, 1.12)], false, 6); // drip to the chin
  z.veil('#5a1414', 140, [H(-0.6, 0.3), H(-0.42, 0.26), H(-0.36, 0.48), H(-0.58, 0.5)]); // smear on the cheek
  z.veil('#5a1414', 120, [H(-0.2, 1.0), H(0.25, 0.98), H(0.2, 1.2), H(-0.15, 1.2)]); // chin
  brush.pop();
  // Backlit by the corridor window behind her: her front falls into shadow below the face (caption band).
  falloff(ctx);
};

// --- B02-SH02 wide section with the lowered floor (R2, user 29 Oct 2026: “ที่หน้าประตูพื้น condo มันสูงไปหน่อย สุดขอบ
// safeArea ก็ได้”): SEC-2D R2 = 380 px/m on the cut plane, cut-plane floor line y 1230 (caption-safe box bottom 1248),
// vanishing point (540, 860). Cream unit, dark floor tiles and a shadowed wall base under the low caption block.
// Figures: SideSheet paintBodySide as on disk (profile head: Boss, in progress).

const YOU: Cast = {name: 'you', role: 'zc-you', face: 6, head: {skin: '#e2b084', hair: '#262422', cut: 'short'},
  outfit: {shoulder: 0.4, shirt: '#2f5a5c', sleeve: '#2f5a5c', longSleeves: false, pants: '#6c7072', shoes: '#e2b084'}};
const INFECTED: Cast = {name: 'infected', role: 'zc-infected', face: 5, head: {skin: '#bdb9a6', hair: '#151314', cut: 'bob'},
  outfit: {shoulder: 0.37, shirt: '#c9c5b8', sleeve: '#c9c5b8', longSleeves: false, pants: '#bdb9a6', shoes: '#bdb9a6', coat: '#c9c5b8'}};
const scaleXY = (brush: Brush, x: number, y: number) => (brush.scale as unknown as (a: number, b: number) => void)(x, y);
const figure = (ctx: PaintContext, base: number, c: Cast, gx: number, gy: number, pxPerM: number, face: 1 | -1, grip?: Pt) => {
  const k = pxPerM / 447;
  const local = grip ? ([(face * (grip[0] - gx)) / k, (grip[1] - gy) / k] as Pt) : undefined;
  ctx.brush.push();
  ctx.brush.translate(gx, gy);
  scaleXY(ctx.brush, face * k, k);
  paintBodySide(makePaint(ctx, base), c, 0, 0, local);
  ctx.brush.pop();
};

const CAP = '#1c1f24';
const LU = 380, LFLOOR = 1230, LVP: Pt = [540, 860], LDOOR = 360;
const lsd = (d: number) => 1 / (1 + d / 6);
const LS = (y: number, z: number, d: number): Pt => {
  const fx = LDOOR + y * LU, fy = LFLOOR - z * LU, s = lsd(d);
  return [LVP[0] + (fx - LVP[0]) * s, LVP[1] + (fy - LVP[1]) * s];
};
const q4 = (a: Pt, b: Pt, c: Pt, d: Pt): Pt[] => [a, b, c, d];

const b02Low = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const p = makePainter(brush, {t, frame: Math.round(t * 30), fade: CREAM.wall});
  let sd = 2000;
  const f = (color: string, pts: Pt[], n = 4) => solid(p, ++sd, color, pts, n);
  brush.push();
  applyCamera(brush, pushCamera(t, 3, {s0: 1, s1: 1.02, fx: 540, fy: 800}));
  const back = 3.2;
  // Corridor: cool cream under fluorescent light, a deep tunnel, darker floor.
  f('#8f897a', q4(LS(-1.8, 2.6, 0), LS(0, 2.6, 0), LS(0, 0, 0), LS(-1.8, 0, 0)));
  f('#aaa392', q4(LS(-1.8, 2.6, 0), LS(0, 2.6, 0), LS(0, 2.6, 9), LS(-1.8, 2.6, 9)));
  f('#3f3a33', q4(LS(-1.8, 0, 0), LS(0, 0, 0), LS(0, 0, 9), LS(-1.8, 0, 9)));
  f('#b9b19b', q4(LS(0, 0, 0), LS(0, 2.6, 0), LS(0, 2.6, 9), LS(0, 0, 9)));
  f('#4a463d', q4(LS(-1.8, 2.6, 9), LS(0, 2.6, 9), LS(0, 0, 9), LS(-1.8, 0, 9)));
  f('#eef1ea', q4(LS(-1.0, 2.59, 0.4), LS(-0.8, 2.59, 0.4), LS(-0.8, 2.59, 2.0), LS(-1.0, 2.59, 2.0)));
  f(CREAM.door, q4(LS(0, 0, 0.3), LS(0, 2.1, 0.3), LS(0, 2.1, 1.2), LS(0, 0, 1.2)));
  // Entry and bathroom: cream walls under the warm lamp, dark floor tiles, shadowed wall base.
  const room = (y0: number, y1: number, wall: string) => {
    f(wall, q4(LS(y0, 2.6, back), LS(y1, 2.6, back), LS(y1, 0, back), LS(y0, 0, back)));
    f('#c9bb9d', q4(LS(y0, 2.6, 0), LS(y1, 2.6, 0), LS(y1, 2.6, back), LS(y0, 2.6, back)));
    f('#4e4134', q4(LS(y0, 0, 0), LS(y1, 0, 0), LS(y1, 0, back), LS(y0, 0, back)));
    f('#6d5f4c', q4(LS(y0, 0.35, back), LS(y1, 0.35, back), LS(y1, 0, back), LS(y0, 0, back)), 3); // wall base in shadow
  };
  room(0.18, 1.68, CREAM.wall);
  room(1.78, 3.4, '#cfc6b2');
  p.wash('#f0dcae', 70, [LS(0.4, 2.6, 1.2), LS(1.5, 2.6, 1.2), LS(1.6, 0.9, 1.2), LS(0.3, 0.9, 1.2)], 0.6, 0.3); // lamp pool, upper wall only
  // Caps: ceiling slab, floor slab, door wall, partition; dark neighbours above and below.
  f('#2a2622', [[-100, -100], [1200, -100], [1200, 160], [-100, 160]]);
  f(CAP, [[-100, 160], [1200, 160], [1200, 242], [-100, 242]]);
  f(CAP, [[-100, LFLOOR], [1200, LFLOOR], [1200, LFLOOR + 95], [-100, LFLOOR + 95]]);
  f('#211e1b', [[-100, LFLOOR + 95], [1200, LFLOOR + 95], [1200, 2100], [-100, 2100]]);
  f(CAP, [[LDOOR, 160], [LDOOR + 68, 160], [LDOOR + 68, LFLOOR + 95], [LDOOR, LFLOOR + 95]]);
  f(CAP, [[LDOOR + 1.68 * LU, 160], [LDOOR + 1.78 * LU, 160], [LDOOR + 1.78 * LU, LFLOOR + 95], [LDOOR + 1.68 * LU, LFLOOR + 95]]);
  // Cabinet slides flush.
  const slide = 0.87 * (1 - ramp(t, 0.4, 2.2));
  const y0 = 0.18 + slide, y1 = y0 + 0.4, d0 = 0.35, d1 = 1.15;
  f(CREAM.cabShade, q4(LS(y1, 1.2, d0), LS(y1, 1.2, d1), LS(y1, 0, d1), LS(y1, 0, d0)));
  f(CREAM.cabTop, q4(LS(y0, 1.2, d0), LS(y1, 1.2, d0), LS(y1, 1.2, d1), LS(y0, 1.2, d1)));
  const front = q4(LS(y0, 1.2, d0), LS(y1, 1.2, d0), LS(y1, 0, d0), LS(y0, 0, d0));
  f(CREAM.cab, front);
  inkLine(p, 2900, front, 1.2, 0.05);
  // Her (pounding) and him (pushing), profile, d 0.75.
  const d = 0.75, s = lsd(d);
  const beat = Math.abs(Math.sin(t * Math.PI * 2.4));
  const [hx, hy] = LS(-0.42, 0, d);
  figure(ctx, 5000, INFECTED, hx, hy, LU * s, 1, LS(0, 1.35 + 0.25 * (1 - beat), d));
  const [mx, my] = LS(y1 + 0.36, 0, d);
  figure(ctx, 6000, YOU, mx, my, LU * s, -1, LS(y1, 0.95, d));
  brush.pop();
};

/** ZC-CAPSHADE (proposed): a soft local shadow behind the low caption block only (y ~1000-1300), screen space, so a
 * light cream floor or pale legs under the caption keep the outline captions readable without a box. */
const CaptionShade = ({strength = 0.62}: {strength?: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `linear-gradient(to bottom, rgba(20,16,12,0) 990px, rgba(20,16,12,${strength}) 1080px, rgba(20,16,12,${strength}) 1250px, rgba(20,16,12,0) 1330px)`}} />
);

/** R2.1 ZC-CAPSHADE variant for full-frame POV: an elliptical soft shade centred under the caption text, fading out
 * toward the frame edges and above/below the block, so it reads as a soft vignette rather than a horizontal band. */
const CaptionShadeSoft = ({strength = 0.5}: {strength?: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 560px 190px at 540px 1170px, rgba(20,16,12,${strength}) 0%, rgba(20,16,12,${strength * 0.7}) 55%, rgba(20,16,12,0) 100%)`}} />
);

/** Mock of the proposed low caption placement: the existing outline Subtitles, moved so the block's bottom edge sits at
 * y 1248 (the shared `bottom` position ends at 1786). Spike only; the runtime position is a Boss need (S-09 c). */
const LowCaption = ({text}: {text: string}) => (
  <AbsoluteFill style={{transform: 'translateY(-538px)'}}>
    <Subtitles text={text} style={{preset: 'outline', position: 'bottom'}} />
  </AbsoluteFill>
);

const Shot = ({paint, paper}: {paint: (ctx: PaintContext) => void; paper: string}) => (
  <AbsoluteFill>
    <BrushCanvas paint={paint} paper={paper} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
export const ZcPaintB02Pov = () => <Shot paint={b02Pov} paper="#d9ccb0" />;
export const ZcPaintRage = () => <Shot paint={rageFace} paper="#b9b19b" />;
export const ZcPaintB02Low = () => <Shot paint={b02Low} paper="#d9ccb0" />;
export const ZcPaintB02LowCap = () => (
  <AbsoluteFill>
    <Shot paint={b02Low} paper="#d9ccb0" />
    <CaptionShade />
    <LowCaption text="แต่ต้องรื้อออกได้เร็ว เผื่อไฟไหม้" />
  </AbsoluteFill>
);
export const ZcPaintB02LowShade = () => (
  <AbsoluteFill>
    <Shot paint={b02Low} paper="#d9ccb0" />
    <CaptionShade />
  </AbsoluteFill>
);
export const ZcPaintB02PovFull = () => (
  <AbsoluteFill>
    <Shot paint={b02PovFull} paper="#d9ccb0" />
    <CaptionShadeSoft />
  </AbsoluteFill>
);
export const ZcPaintB02PovFullBare = () => <Shot paint={b02PovFull} paper="#d9ccb0" />;
export const ZcPaintB02PovFullCap = () => (
  <AbsoluteFill>
    <Shot paint={b02PovFull} paper="#d9ccb0" />
    <CaptionShadeSoft />
    <LowCaption text="ลากตู้มาดัน" />
  </AbsoluteFill>
);
