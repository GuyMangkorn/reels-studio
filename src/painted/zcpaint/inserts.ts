import type {PaintContext} from '../BrushCanvas';
import {ramp, type Pt} from '../painter';
import {capsule} from '../hands';
import {ell, placeAt} from './ctx';
import {handParts, paintPart, washPaint, type HandKind, type HU} from './body6';
import {YOU} from './cast';
import {keyTravel} from './bust';
import {castTone, cel} from './light';
import {flatKit, type Flat} from './sets';

// ZCPAINT insert plates (Boss pass 10; sheets `sc01-b04-b05.md` and `sc01-b06-b08.md`, SS-R1.3). Painted close inserts with no full figure;
// the hands are the WORLD FOG mitten, fist or pinch (`HD-03`, `HD-04`), drawn by `handParts`. Flat washes, one ink line per object, the cel
// tone on the side away from the key (`LT-02`), the flat cast tone on the floor or the ledge (`LT-03`). Water is a lighter flat band with a
// surface ellipse. Text overlays (the B06 device, the B05-SH03 condition labels) are Editor's; the painted icons are here.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const SKIN = YOU.head.skin;
const FLOOR_SHADOW = castTone('#b9ad9a');

/** Aqua wainscot behind the containers (RM-02, grout RM-05): flat tile and thin grout lines. */
const tileWall = (f: Flat, y0 = -100, y1 = 1300) => {
  f.fill('#bfd9d4', [[-100, y0], [1200, y0], [1200, y1], [-100, y1]]);
  for (let y = y0 + 60; y < y1; y += 120) f.line([[-100, y], [1200, y]], 0.5, '#a9c4bf', false);
  for (let x = 0; x < 1200; x += 180) f.line([[x, y0], [x, y1]], 0.5, '#a9c4bf', false);
};

/** A straight-sided container (bucket, pot): top and bottom ellipses, body trapezoid, cel band on the right, one ink outline. */
type Cyl = {cx: number; yTop: number; yBot: number; rTop: number; rBot: number};
const clipR = (c: Cyl, y: number) => c.rTop + (c.rBot - c.rTop) * clamp01((y - c.yTop) / (c.yBot - c.yTop));
const cylBody = (f: Flat, c: Cyl, col: string) => {
  const {cx, yTop, yBot, rTop, rBot} = c;
  f.fill(col, [[cx - rTop, yTop], [cx + rTop, yTop], [cx + rBot, yBot], [cx - rBot, yBot]]);
  f.fill(cel(col), [[cx + 0.42 * rTop, yTop], [cx + rTop, yTop], [cx + rBot, yBot], [cx + 0.42 * rBot, yBot]]);
  f.fill(cel(col), ell(cx, yBot, rBot, rBot * 0.26, 18));
  f.line([[cx - rTop, yTop], [cx - rBot, yBot], [cx + rBot, yBot], [cx + rTop, yTop]], 1.1, undefined, false);
  f.line(ell(cx, yTop, rTop, rTop * 0.2, 18), 0.9);
};
/** Water in a container from its level `yW` down: a lighter flat band inside the walls with its surface ellipse. */
const water = (f: Flat, c: Cyl, yW: number, col: string) => {
  if (yW >= c.yBot - 4) return;
  const r = clipR(c, yW) - 4, rb = c.rBot - 6;
  f.fill(col, [[c.cx - r, yW], [c.cx + r, yW], [c.cx + rb, c.yBot - 8], [c.cx - rb, c.yBot - 8]]);
  f.fill(cel(col), [[c.cx + 0.42 * r, yW], [c.cx + r, yW], [c.cx + rb, c.yBot - 8], [c.cx + 0.42 * rb, c.yBot - 8]]);
  f.fill(lighter(col), ell(c.cx, yW, r, r * 0.2, 18));
};
/** A lighter flat tone of a colour (the water surface and the lit rims); no texture. */
const lighter = (col: string) => {
  const v = [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(col.slice(i, i + 2), 16) * 0.5 + 127)));
  return `#${v.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};
/** A stream from `a` down to `b`: a flat capsule with a lighter core. */
const stream = (f: Flat, a: Pt, b: Pt, w0: number, w1: number, col: string) => {
  f.fill(col, capsule(a, b, w0, w1));
  f.fill('#eaf6f7', capsule(a, b, w0 * 0.3, w1 * 0.3));
};
/** One hand (mitten, fist or pinch) at scale `k` with its wrist at `at` (screen px) and its fingers toward `dir` (head units, y up). */
const hand = (ctx: PaintContext, base: number, at: Pt, kind: HandKind, dir: HU, thumb: 1 | -1, k: number) => {
  placeAt(ctx.brush, at[0], at[1], k, 1, () => {
    const p = washPaint(ctx, base);
    const light = keyTravel(1, [0, 1]);
    for (const part of handParts({kind, w: [0, 0], dir, thumb}, SKIN)) paintPart(p, part, light);
  });
};
/** Forearm from a frame edge to the wrist (skin, flat). */
const forearm = (f: Flat, from: Pt, to: Pt, w = 66) => f.fill(SKIN, capsule(from, to, w, w * 0.84));

// ---------------------------------------------------------------- B04-SH03: three fill inserts

const BUCKET = '#7aa0be', POT = '#b9c0c6', WATER_AQUA = '#cfe9ef', WATER_DEEP = '#9fd0da';
/** Insert a (TH and EN [0, 39)): the bucket under the shower tap; the water rises over the insert. */
const BUCKET_A: Cyl = {cx: 540, yTop: 560, yBot: 960, rTop: 230, rBot: 200};
export const paintB04Sh03a = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 31000);
  tileWall(f);
  f.fill('#e2e0d6', [[430, 250], [650, 250], [650, 300], [430, 300]]);
  f.line([[430, 250], [650, 250], [650, 300], [430, 300]], 0.9);
  const yW = BUCKET_A.yBot - (BUCKET_A.yBot - 650) * clamp01(pf / 39);
  cylBody(f, BUCKET_A, BUCKET);
  water(f, BUCKET_A, yW, WATER_AQUA);
  stream(f, [540, 300], [540, yW], 26, 34, WATER_DEEP);
  f.fill(FLOOR_SHADOW, [[300, 960], [800, 960], [820, 1010], [280, 1010]]);
};

/** Insert b (TH and EN [39, 51)): the pot under the basin tap; the water rises over its 12 frames. */
const POT_B: Cyl = {cx: 540, yTop: 640, yBot: 960, rTop: 220, rBot: 190};
export const paintB04Sh03b = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 31500);
  tileWall(f);
  f.fill('#e2e0d6', [[400, 330], [700, 330], [700, 370], [400, 370]]);
  f.line([[400, 330], [700, 330], [700, 370], [400, 370]], 0.9);
  const yW = POT_B.yBot - (POT_B.yBot - 740) * clamp01(pf / 12);
  cylBody(f, POT_B, POT);
  water(f, POT_B, yW, WATER_AQUA);
  stream(f, [560, 370], [560, yW], 24, 32, WATER_DEEP);
  f.fill(FLOOR_SHADOW, [[290, 960], [800, 960], [820, 1010], [270, 1010]]);
};

/** A PET bottle, flat: body with shoulders, neck and cap; `level` 0-1 fills it from the base (clear with a water band). */
const bottle = (f: Flat, cx: number, yBase: number, level: number, cap: string) => {
  const w = 74, top = 620, neck = 560, capY = 530;
  const body: Pt[] = [[cx - w / 2, yBase], [cx + w / 2, yBase], [cx + w / 2, top + 40], [cx + 22, top], [cx + 22, neck], [cx - 22, neck], [cx - 22, top], [cx - w / 2, top + 40]];
  f.fill('#d6e6e4', body);
  if (level > 0) {
    const yW = yBase - (yBase - top) * level;
    f.fill(WATER_AQUA, [[cx - w / 2 + 3, yBase - 3], [cx + w / 2 - 3, yBase - 3], [cx + w / 2 - 3, yW], [cx - w / 2 + 3, yW]]);
    f.fill(cel(WATER_AQUA), [[cx + 0.25 * w, yBase - 3], [cx + w / 2 - 3, yBase - 3], [cx + w / 2 - 3, yW], [cx + 0.25 * w, yW]]);
  }
  f.line(body, 0.9);
  f.fill(cap, [[cx - 24, capY], [cx + 24, capY], [cx + 24, neck + 2], [cx - 24, neck + 2]]);
  f.line([[cx - 24, capY], [cx + 24, capY], [cx + 24, neck + 2], [cx - 24, neck + 2]], 0.8);
};

/** Insert c: two PET bottles at the basin; the first fills over the insert (TH 12 f, EN 15 f), the second stays capped. */
export const paintB04Sh03c = (ctx: PaintContext, pf: number, len: number) => {
  const f = flatKit(ctx, 31800);
  tileWall(f);
  bottle(f, 410, 1000, clamp01(pf / len) * 0.78, '#2f6fb0');
  bottle(f, 670, 1000, 0, '#d9463a');
  f.fill('#cfe0dc', [[200, 1000], [880, 1000], [880, 1040], [200, 1040]]);
  f.line([[200, 1000], [880, 1000]], 1.0);
  f.fill(FLOOR_SHADOW, [[250, 1040], [880, 1040], [900, 1070], [240, 1070]]);
};

// ---------------------------------------------------------------- B04-SH04: lids on (per-language keys)

/** The lid-on frame of buckets 2-4 (TH 0, 4, 8; EN 3, 12, 21); bucket 1 and the pot and bottles are capped from f 0. */
export const LIDS = {TH: [0, 4, 8], EN: [3, 12, 21]} as const;

/** A bucket seen from above (high angle, horizon above the frame): rim ellipse, body, bottom ellipse; `lid` adds the flat lid. */
const topBucket = (f: Flat, cx: number, yRim: number, lid: boolean) => {
  const r = 74, h = 150;
  f.fill(BUCKET, [[cx - r, yRim], [cx + r, yRim], [cx + r - 6, yRim + h], [cx - r + 6, yRim + h]]);
  f.fill(cel(BUCKET), [[cx + 0.42 * r, yRim], [cx + r, yRim], [cx + r - 6, yRim + h], [cx + 0.42 * r, yRim + h]]);
  f.fill(cel(BUCKET), ell(cx, yRim + h, r - 6, 16, 16));
  f.line([[cx - r, yRim], [cx - r + 6, yRim + h], [cx + r - 6, yRim + h], [cx + r, yRim]], 1.0, undefined, false);
  if (lid) {
    f.fill('#e8e3d6', ell(cx, yRim, r + 4, 24, 20));
    f.line(ell(cx, yRim, r + 4, 24, 20), 0.9);
  } else {
    f.fill('#4f6f8c', ell(cx, yRim, r, 24, 20)); // the open mouth: the inside of the rim
    f.line(ell(cx, yRim, r, 24, 20), 0.9);
  }
};
const topBottle = (f: Flat, cx: number, cy: number, cap: string) => {
  f.fill('#d6e6e4', ell(cx, cy, 34, 58, 16));
  f.fill(cap, ell(cx, cy - 58, 16, 10, 12));
};
/** B04-SH04 (TH 12 f, EN 33 f; per-language keys): four buckets, one pot, six capped bottles on the basin ledge and the tiles. */
export const paintB04Sh04 = (ctx: PaintContext, pf: number, lang: 'TH' | 'EN') => {
  const f = flatKit(ctx, 32000);
  f.fill('#bfd9d4', [[-100, -100], [1200, -100], [1200, 2000], [-100, 2000]]);
  for (let y = 300; y < 1100; y += 90) f.line([[-100, y], [1200, y]], 0.5, '#a9c4bf', false);
  for (let x = 0; x < 1200; x += 150) f.line([[x, 300], [x, 1100]], 0.5, '#a9c4bf', false);
  f.fill('#cfe0dc', [[180, 340], [740, 340], [740, 540], [180, 540]]);
  for (let i = 0; i < 6; i++) topBottle(f, 230 + i * 92, 430, i % 2 ? '#2f6fb0' : '#d9463a');
  const keys = LIDS[lang];
  [240, 390, 540, 690].forEach((x, i) => topBucket(f, x, 600, i === 0 || pf >= keys[i - 1]));
  f.fill(POT, ell(856, 700, 62, 56, 18));
  f.fill(cel(POT), ell(870, 720, 50, 42, 16));
  f.line(ell(856, 700, 62, 56, 18), 0.9);
  f.fill('#e8e3d6', ell(856, 700, 56, 20, 16));
  f.fill(FLOOR_SHADOW, [[160, 820], [900, 820], [900, 850], [160, 850]]);
};

// ---------------------------------------------------------------- B05-SH02: one hard pour (insert)

/** The pour (shared plate; TH pf = f + 36, EN pf = f + 15): the bucket tips from its lip at (600, 360) into the bowl, which siphons. */
const LIP: Pt = [600, 360];
const arcPts = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 12): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => { const a = a0 + ((a1 - a0) * i) / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });

export const paintB05Sh02 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 33000);
  tileWall(f, -100, 1300);
  // The bowl: white rim and body (cel on the far right), the water surface.
  f.fill('#e6e3da', [[330, 750], [750, 750], [700, 1000], [380, 1000]]);
  f.fill(cel('#e6e3da'), [[600, 750], [750, 750], [700, 1000], [560, 1000]]);
  f.fill('#e6e3da', ell(540, 750, 210, 50, 24));
  f.line(ell(540, 750, 210, 50, 24), 1.0);
  f.fill('#cfe9ec', ell(540, 915, 190, 35, 24));
  // The bucket, lidless: the pivot at the lip; it rises from pf 15 and tips by pf 36, then drains (the tilt eases back by pf 60-90).
  const tilt = -70 * ramp(pf, 15, 36) * (1 - 0.35 * ramp(pf, 60, 90));
  const th = (tilt * Math.PI) / 180;
  const R = (p: Pt): Pt => [LIP[0] + (p[0] - LIP[0]) * Math.cos(th) - (p[1] - LIP[1]) * Math.sin(th), LIP[1] + (p[0] - LIP[0]) * Math.sin(th) + (p[1] - LIP[1]) * Math.cos(th)];
  const body: Pt[] = ([[560, 355], [900, 355], [870, 60], [600, 60]] as Pt[]).map(R);
  f.fill(BUCKET, body);
  f.fill(cel(BUCKET), [R([760, 355]), R([900, 355]), R([870, 60]), R([760, 60])]);
  f.line(body, 1.1);
  f.line([R([600, 60]), R([640, 10]), R([820, 10]), R([870, 60])], 1.4, undefined, false);
  // Hands: the right wraps the handle, the left sits under the base; mittens with the forearms from the frame edge.
  const rWrist = R([842, 40]), lWrist = R([640, 360]);
  forearm(f, [1080, 300], rWrist, 66);
  forearm(f, [1080, 470], lWrist, 62);
  hand(ctx, 33500, rWrist, 'mitten', [-0.3, 1], 1, 1.9);
  hand(ctx, 33700, lWrist, 'mitten', [-1, 0.2], 1, 1.9);
  // The stream from the lip after pf 36 to the bowl water; the siphon swirl from pf 72 (ink arcs in the water).
  if (pf >= 36 && pf < 64) stream(f, LIP, [520, 900], 22, 40, WATER_DEEP);
  if (pf >= 72) for (const r of [120, 80, 40]) f.line(arcPts(540, 915, r, r * 0.18, 0.2, 1.8), 0.7, '#8fb7b8', false);
  f.fill(FLOOR_SHADOW, [[280, 1000], [800, 1000], [820, 1040], [260, 1040]]);
};

// ---------------------------------------------------------------- B05-SH03: cistern reveal, conditions (three cue parts)

const CIST = {x0: 300, x1: 780, yTop: 520, yBot: 900};
const LID = {x0: 300, x1: 780, yTop: 470, yBot: 560};
/** The lid's offset for part 1 (plate clock from the cut): lifted 180 px over pf 21-33, set aside to the right edge by pf 60. */
const lidOffset = (pf: number): Pt => [1200 * ramp(pf, 33, 60), -180 * ramp(pf, 21, 33)];

/** Part 1 (`ZCP-B05-SH03`, TH fromSec 0.7 = pf f + 21; EN fromSec 0): the pinch grips the lid's right edge, the lid lifts and is set aside,
 *  the clear water shows from pf 33. Part 3 holds this function at its end state (pf 60 or later). */
export const paintB05Sh03 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 34000);
  tileWall(f, -100, 1300);
  f.fill('#e6e3da', [[CIST.x0, CIST.yTop], [CIST.x1, CIST.yTop], [CIST.x1, CIST.yBot], [CIST.x0, CIST.yBot]]);
  f.fill(cel('#e6e3da'), [[CIST.x0 + 0.62 * (CIST.x1 - CIST.x0), CIST.yTop], [CIST.x1, CIST.yTop], [CIST.x1, CIST.yBot], [CIST.x0 + 0.62 * (CIST.x1 - CIST.x0), CIST.yBot]]);
  f.line([[CIST.x0, CIST.yTop], [CIST.x1, CIST.yTop], [CIST.x1, CIST.yBot], [CIST.x0, CIST.yBot]], 1.0);
  if (pf >= 33) {
    f.fill('#cfe9ec', [[330, 560], [750, 560], [750, 700], [330, 700]]);
    f.fill('#e4f5f6', ell(540, 560, 210, 26, 20));
  }
  const [dx, dy] = lidOffset(pf);
  const L = {x0: LID.x0 + dx, x1: LID.x1 + dx, yTop: LID.yTop + dy, yBot: LID.yBot + dy};
  f.fill('#f2efe6', [[L.x0, L.yTop], [L.x1, L.yTop], [L.x1, L.yBot], [L.x0, L.yBot]]);
  f.fill(cel('#f2efe6'), [[L.x0, L.yBot - 14], [L.x1, L.yBot - 14], [L.x1, L.yBot], [L.x0, L.yBot]]);
  f.line([[L.x0, L.yTop], [L.x1, L.yTop], [L.x1, L.yBot], [L.x0, L.yBot]], 1.0);
  // The pinch on the lid's right edge (index and thumb, a visible gap), the forearm from the right frame edge; it closes on the lid from pf 15.
  const grip: Pt = [L.x1 - 30, L.yTop + 40];
  const wrist: Pt = [grip[0] + 120 + 10 * (1 - ramp(pf, 0, 15)), grip[1] + 60];
  if (pf < 60) {
    forearm(f, [1080, wrist[1] + 160], wrist, 70);
    hand(ctx, 34500, wrist, 'pinch', [-0.9, 0.4], -1, 2.2);
  }
};

/** Part 2 (`ZCP-B05-SH03-BOWL`, held, fromSec 0): the bowl water close, the red cross painted on in 6 f from part-f 3 (never over the cistern). */
export const paintB05Sh03Bowl = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 34700);
  f.fill('#e6e3da', [[380, 380], [700, 380], [700, 700], [380, 700]]);
  f.fill('#cfe9ec', ell(540, 540, 150, 140, 28));
  f.fill('#e4f5f6', ell(540, 500, 110, 70, 24));
  f.line(ell(540, 540, 150, 140, 28), 1.0);
  const a = ramp(pf, 3, 9);
  if (a > 0) {
    const w = 320 * a;
    f.fill('#e5484d', [[540 - w / 2, 510], [540 + w / 2, 510], [540 + w / 2, 560], [540 - w / 2, 560]]);
    if (a > 0.5) f.fill('#e5484d', [[510, 430], [570, 430], [570, 640], [510, 640]]);
  }
};

/** Condition icon 1 (a clear drop) and 2 (a chemical bottle crossed out), centred on (190, 360) and (450, 360) (the label row). */
const iconDrop = (f: Flat, cx: number, cy: number) => {
  f.fill('#5aa7c4', [[cx, cy - 46], [cx + 30, cy + 8], [cx - 30, cy + 8]]);
  f.fill('#5aa7c4', ell(cx, cy + 12, 30, 30, 18));
  f.fill(cel('#5aa7c4'), ell(cx + 12, cy + 16, 18, 18, 12));
};
const iconBottle = (f: Flat, cx: number, cy: number) => {
  f.fill('#3c7a50', [[cx - 26, cy - 44], [cx + 26, cy - 44], [cx + 26, cy + 44], [cx - 26, cy + 44]]);
  f.fill('#3c7a50', [[cx - 10, cy - 60], [cx + 10, cy - 60], [cx + 10, cy - 44], [cx - 10, cy - 44]]);
  f.line([[cx - 40, cy - 50], [cx + 40, cy + 50]], 3.5, '#e5484d', false);
  f.line([[cx + 40, cy - 50], [cx - 40, cy + 50]], 3.5, '#e5484d', false);
};
/** Part 3 (`ZCP-B05-SH03-TH` / `-EN`): the cistern with its lid aside (part 1 at its end state, no hand), the icons on per-language keys. */
export const B05_ICON_KEYS = {TH: [0, 19], EN: [11, 55]} as const;
export const paintB05Sh03Part3 = (ctx: PaintContext, pf: number, lang: 'TH' | 'EN') => {
  paintB05Sh03(ctx, 60);
  const f = flatKit(ctx, 35000);
  const [k1, k2] = B05_ICON_KEYS[lang];
  if (pf >= k1) iconDrop(f, 190, 360);
  if (pf >= k2) iconBottle(f, 450, 360);
};

// ---------------------------------------------------------------- B06-SH03: order on the counter; cans last

/** Top-down counter (plan view): items left to right, the third can set down by f 3 (both), the hand leaves by f 12. */
export const paintB06Sh03 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 36000);
  f.fill('#b99c72', [[-100, 560], [1200, 560], [1200, 880], [-100, 880]]);
  for (let y = 600; y < 880; y += 26) f.line([[-100, y], [1200, y + 4]], 0.5, '#9c8058', false);
  // Fridge items (yogurt, leftovers, cheese, fruit), freezer items (bread, fruit pack): tops lit, shadows toward the left.
  const item = (x0: number, x1: number, y0: number, y1: number, col: string) => {
    f.fill(castTone('#b99c72'), [[x0 - 14, y1 - 6], [x1 - 6, y1 - 6], [x1 - 22, y1 + 8], [x0 - 26, y1 + 8]]);
    f.fill(col, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
    f.fill(cel(col), [[x0 + 0.6 * (x1 - x0), y0], [x1, y0], [x1, y1], [x0 + 0.6 * (x1 - x0), y1]]);
    f.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0.9);
  };
  item(150, 230, 640, 740, '#f1eee4'); // yogurt cup
  item(250, 370, 630, 760, '#d8c39a'); // leftovers box
  item(390, 460, 650, 730, '#e5c35a'); // cheese
  f.fill('#c46a3a', ell(510, 690, 34, 34, 14)); // fruit
  f.fill('#d8864a', ell(580, 700, 30, 30, 14));
  item(630, 720, 630, 750, '#8fb3c7'); // frozen bread (bag)
  item(745, 805, 640, 740, '#6e9bb3'); // frozen fruit pack
  // The three pull-tab cans; the third is set down at f 3 (both languages), from the bottom-right hand.
  for (const cx of [835, 880]) {
    f.fill('#9aa3a8', ell(cx, 720, 24, 22, 14));
    f.line(ell(cx, 720, 24, 22, 14), 0.8);
  }
  const setDown = ramp(pf, 0, 3);
  const cx = 930 - 40 * (1 - setDown), cy = 760 - 40 * (1 - setDown);
  if (pf >= 3) {
    f.fill(castTone('#b99c72'), ell(cx + 18, cy + 14, 26, 14, 14));
    f.fill('#9aa3a8', ell(cx, 720, 24, 22, 14));
    f.line(ell(cx, 720, 24, 22, 14), 0.8);
  }
  // His right mitten with the third can, from the bottom-right: at the can until f 3, then it leaves by f 12.
  const leave = ramp(pf, 3, 12);
  const wrist: Pt = [1090 - 180 * leave, 1040 - 260 * leave];
  forearm(f, [1100, 1120 - 100 * leave], wrist, 66);
  if (pf < 3) f.fill('#9aa3a8', ell(cx, cy, 24, 22, 14));
  hand(ctx, 36500, wrist, 'mitten', [-0.6, 0.8], 1, 2.0);
};
