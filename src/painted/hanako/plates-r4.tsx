import {loadFont} from '@remotion/fonts';
import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import type {Camera} from '../kit/camera';
import {capsule, ell, hardFill, INK, inkLine, rectPts, washAt} from '../kit/draw';
import {paintPovHand, wristAtKnuckles, type HandTone} from '../kit/hands';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {ribbon} from './assets';
import {HANAKO_HAND, HK} from './look';

// HANAKO-SHORT-SCENE-R4 plates (Boss S1-R4): B02-SH01 viewer's fist (screen layer, VD29) and B03-SH01 FPOV-CHEST
// (VD24–VD27, film-r5.md). Plate-local frames: f = F − start (B02 start 304, B03 start 443), 30 fps. No timeline here.

const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
const sineInOut = (u: number) => (1 - Math.cos(Math.PI * clamp01(u))) / 2;
const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 2;

// ------------------------------------------------------------------ B02-SH01 viewer's fist (VD29)

const dim = (c: string) => mixColor(c, '#060c0d', 0.5);
/** VD29 `HANAKO_HAND_B02`: HANAKO_HAND blended 50% toward the VD21 dip colour, so no ivory rim sits on the knuckles. */
export const HANAKO_HAND_B02: HandTone = {
  skin: dim(HANAKO_HAND.skin), shade: dim(HANAKO_HAND.shade), deep: dim(HANAKO_HAND.deep), nail: dim(HANAKO_HAND.nail),
  crease: dim(HANAKO_HAND.crease), sleeve: dim(HANAKO_HAND.sleeve), sleeveShade: dim(HANAKO_HAND.sleeveShade),
};
/** Hand size 0.80 and dir −2.9 rad (wrist-corner fix); base is the seed range of this plate's fist (no other plate uses it). */
export const FIST = {base: 1200, size: 0.8, dir: -2.9};
/**
 * Knuckle anchor at B02 frame f (= F − 304): F304 (990, 745); sinks +6 px in y, linear, to F409 (f105); still to F417;
 * flinch F417–F421 (f113–f117, ease-out) +10 px x, +6 px y, then held to the cut.
 */
export const fistKnuckles = (f: number): Pt => {
  const flinch = easeOut((f - 113) / 4);
  return [990 + 10 * flinch, 745 + 6 * clamp01(f / 105) + 6 * flinch];
};
// Taper-pass elbow and sleeve preserve Film's B02 envelope.
export const B02_ELBOW: Pt = [1115, 1000];
export const paintFistB02 = (p: Painter, f: number) => {
  const knuckles = fistKnuckles(f);
  paintPovHand(p, {
    base: FIST.base, side: 1, size: FIST.size, dir: FIST.dir, wrist: wristAtKnuckles(knuckles, FIST.dir, FIST.size),
    curl: 1, thumb: [95, 70], elbow: B02_ELBOW, sleeveFrom: [1140, 1250], forearmElbowScale: 1.8, tone: HANAKO_HAND_B02,
  });
  // Subtle cool edge and cuff: both remain below the reply seam in value.
  const [x, y] = knuckles;
  inkLine(p, 1265, [[x - 15, y - 62], [x - 35, y - 56], [x - 48, y - 40], [x - 56, y - 23]], {color: '#83908a', weight: 1.5, closed: false, still: true});
  inkLine(p, 1268, [[x + 5, y + 68], [x + 21, y + 72], [x + 32, y + 85], [x + 34, y + 99]], {color: '#a18b78', weight: 1.5, closed: false, still: true});
};

// ------------------------------------------------------------------ B03-SH01 FPOV-CHEST (VD24–VD27)

/** Push s 1.00 → 1.04 (F443–F513, sine in-out), lean-in 1.04 → 1.12 (F513–F528, sine in-out), 1.12 → 1.14 (F528–F645, linear). Focus (560, 640). */
export const fpovCamera = (f: number): Camera => ({
  s: f <= 70 ? 1 + 0.04 * sineInOut(f / 70) : f <= 85 ? 1.04 + 0.08 * sineInOut((f - 70) / 15) : 1.12 + 0.02 * clamp01((f - 85) / 117),
  fx: 560, fy: 640, dx: 0, dy: 0,
});
/** Page angle to the viewer in radians: 70° until F467 (f24), ease-out to 8° at F479 (f36). Hinge on the bottom edge. */
export const notebookTilt = (f: number) => ((70 - 62 * easeOut((f - 24) / 12)) * Math.PI) / 180;

const PAPER = '#d8dccf', CARDIGAN = '#26303a', SLEEVE = '#1f2a33', CEL = '#1c2730', COLLAR = '#1f2a36', BLOUSE = '#b4bbb1';
const SCARF = '#3c5d5b', SCARF_SHADE = '#2c4645';
const PAGE = {x0: 300, spine: 540, x1: 800, bottom: 815, height: 350};
/** Mirror about the centre line x 540 (the torso, sleeves, arms and hands are symmetric; the tag is screen-right only). */
const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]): Pt => [1080 - x, y]);
const SIDES = [(pts: Pt[]) => pts, mirror] as const;

const HALF_TORSO: Pt[] = [[430, -80], [425, 35], [350, 100], [245, 165], [205, 240], [215, 410], [234, 610], [265, 782], [300, 850]];
/** Cropped neckline and tapered cardigan; the hem ends above the low-detail skirt. */
export const TORSO: Pt[] = [[540, -80], ...HALF_TORSO, ...mirror(HALF_TORSO).reverse()];
const COLLAR_OUTER: Pt[] = [[245, 165], [350, 100], [425, 35], [430, -80], [650, -80], [655, 35], [730, 100], [835, 165]];
const COLLAR_INNER: Pt[] = [[830, 245], [725, 190], [650, 135], [540, 205], [430, 135], [355, 190], [250, 245]];
const COLLAR_LINE: Pt[] = [[250, 245], [355, 190], [430, 135], [540, 205], [650, 135], [725, 190], [830, 245]];
/**
 * Left arm (screen-left), plate px. Shoulder joint, elbow, wrist: the upper arm hangs behind the torso (CP-P02, a shade
 * darker); the authored elbow sits just inside the torso edge and a little below the hand; the forearm comes toward the viewer
 * (short, widening to the wrist); the blouse cuff and the heel of the hand sit at the wrist end.
 */
export const ARM = {
  shoulder: [245, 300] as Pt, elbow: [265, 745] as Pt, wrist: [320, 670] as Pt,
  upperWidth: [150, 94] as const, foreWidth: [80, 124] as const,
  heel: [310, 699] as Pt, heelRadius: [30, 28] as const,
  thumb: [[299, 727], [309, 715], [326, 702]] as Pt[], thumbWidth: [27, 21] as const,
};
/** Blouse cuff: a band across the wrist end of the forearm (the hand emerges from under it). */
export const cuffAt = (E: Pt, W: Pt): Pt[] => {
  const len = Math.hypot(W[0] - E[0], W[1] - E[1]), dx = (W[0] - E[0]) / len, dy = (W[1] - E[1]) / len;
  const px = -dy * 59, py = dx * 59;
  const a: Pt = [W[0] - dx * 24, W[1] - dy * 24], b: Pt = [W[0] + dx * 8, W[1] + dy * 8];
  return [[a[0] + px, a[1] + py], [b[0] + px, b[1] + py], [b[0] - px, b[1] - py], [a[0] - px, a[1] - py]];
};
/** Hand and thumb polygons (left side, before mirroring): the heel of the hand on the cuff, thumb on the page front, fingers behind the page. */
export const handPolygons = (side: 0 | 1): Pt[][] => [
  ell(ARM.heel[0], ARM.heel[1], ARM.heelRadius[0], ARM.heelRadius[1], 20),
  ribbon(ARM.thumb, ARM.thumbWidth[0], ARM.thumbWidth[1]),
].map(SIDES[side]);

const paintWash = (p: Painter) => {
  // Corridor behind the classmate: painted washes only (no outlines, no hardFill). Window light upper left, dim floor below y 900.
  washAt(p, 5200, '#3d5453', 255, rectPts(-60, -60, 1140, 1980), 0.3, 0.35);
  washAt(p, 5201, '#6f8f8c', 225, ell(130, 230, 360, 300, 24), 0.5, 0.5);
  washAt(p, 5202, '#1d2a2c', 230, rectPts(-60, 900, 1140, 1980), 0.5, 0.4);
};

// WORLD FOG-style seeded pigment and ink; repeat pigment for readable dark garments over the wet ground.
const paintFigure = (p: Painter, seed: number, color: string, pts: Pt[]) => {
  for (let pass = 0; pass < 3; pass++) washAt(p, seed * 4 + pass, color, 245, pts, 0.08, 0.24);
};

const paintNotebook = (p: Painter, theta: number) => {
  const c = Math.cos(theta);
  const y = (yFace: number): number => PAGE.bottom - (PAGE.bottom - yFace) * c;
  const pt = (q: number[]): Pt => [q[0], y(q[1])];
  const top = y(PAGE.bottom - PAGE.height);
  hardFill(p, 5300, HK.ink, rectPts(292, top - 8, 808, 818));
  hardFill(p, 5301, PAPER, rectPts(PAGE.x0, top, PAGE.spine, PAGE.bottom));
  hardFill(p, 5302, PAPER, rectPts(PAGE.spine, top, PAGE.x1, PAGE.bottom));
  hardFill(p, 5303, '#bfc6b7', rectPts(528, top, PAGE.spine, PAGE.bottom));
  inkLine(p, 5304, [[540, top], [540, PAGE.bottom]], {color: '#71887f', weight: 0.7, closed: false, still: true});
  // DOODLE-HANAKO (VD06), drawn face-on on the right page (box x 590–730, y 520–740) and foreshortened with the page.
  paintFigure(p, 5310, HK.ink, [[612, 640], [606, 596], [616, 552], [634, 524], [660, 516], [686, 524], [704, 552], [714, 596], [708, 640]].map(pt));
  paintFigure(p, 5311, PAPER, ell(660, 582, 30, 36, 20).map(pt));
  inkLine(p, 5312, ell(660, 582, 30, 36, 20).map(pt), {weight: 0.9});
  paintFigure(p, 5313, '#c4ccbd', [[640, 616], [680, 616], [700, 700], [620, 700]].map(pt));
  inkLine(p, 5314, [[628, 640], [606, 690], [610, 706]].map(pt), {weight: 0.9, closed: false});
  inkLine(p, 5315, [[692, 640], [714, 690], [710, 706]].map(pt), {weight: 0.9, closed: false});
  paintFigure(p, 5316, HK.red, [[620, 700], [700, 700], [728, 740], [592, 740]].map(pt));
};

/** Chest-only FPOV plate of the classmate telling the story (B03-SH01): frame top below the chin, no head at any frame. */
export const paintFpovChest = (p: Painter, f: number) => {
  paintWash(p);
  // Skirt is a low-detail dark value, separate from the tapered cardigan hem.
  paintFigure(p, 5099, '#1d292f', [[300, 820], [780, 820], [930, 1930], [150, 1930]]);
  // Upper arms hang behind the torso (a shade darker, CP-P02); only their outer edges show.
  SIDES.forEach((m, i) => paintFigure(p, 5120 + i, SLEEVE, m(capsule(ARM.shoulder, ARM.elbow, ARM.upperWidth[0], ARM.upperWidth[1]))));
  paintFigure(p, 5100, CARDIGAN, TORSO);
  paintFigure(p, 5101, CEL, [[765, 260], [860, 250], [865, 410], [846, 610], [815, 782], [780, 850], [790, 620]]);
  inkLine(p, 5102, [[205, 240], [215, 410], [234, 610], [265, 782]], {color: '#141d24', weight: 1.1, closed: false});
  inkLine(p, 5103, [[205, 240], [245, 165], [350, 100], [425, 35]], {color: '#7f9a98', weight: 2, closed: false});
  paintFigure(p, 5104, COLLAR, [...COLLAR_OUTER, ...COLLAR_INNER]);
  inkLine(p, 5105, COLLAR_LINE, {color: '#cfd3c8', weight: 1.5, closed: false});
  paintFigure(p, 5106, BLOUSE, [[430, 135], [540, 205], [650, 135], [540, 700]]);
  paintFigure(p, 5107, SCARF, ell(540, 195, 40, 24, 18));
  paintFigure(p, 5108, SCARF_SHADE, [[556, 175], [578, 187], [572, 219], [554, 215]]);
  paintFigure(p, 5109, SCARF, ribbon([[524, 213], [512, 300], [504, 385]], 34, 30));
  paintFigure(p, 5110, SCARF, ribbon([[556, 213], [568, 300], [578, 385]], 34, 30));
  // Forearms and cuffs come toward the viewer from the elbows; the hands follow after the notebook (in front of it).
  SIDES.forEach((m, i) => {
    paintFigure(p, 5130 + i * 4, '#344651', m(ribbon([ARM.elbow, ARM.wrist], ARM.foreWidth[0], ARM.foreWidth[1])));
  });
  // Hand heels are behind the paper; only the thumbs are painted over its front.
  ([0, 1] as const).forEach((side) => {
    const [heel] = handPolygons(side);
    paintFigure(p, 5140 + side * 4, HANAKO_HAND.skin, heel);
  });
  SIDES.forEach((m, i) => paintFigure(p, 5131 + i * 4, BLOUSE, m(cuffAt(ARM.elbow, ARM.wrist))));
  paintNotebook(p, notebookTilt(f));
  ([0, 1] as const).forEach((side) => {
    const [, thumb] = handPolygons(side), s = side * 4;
    paintFigure(p, 5141 + s, HANAKO_HAND.skin, thumb);
    inkLine(p, 5143 + s, thumb, {color: INK, weight: 1});
  });
};

/** NAMETAG-B03 (VD26): SVG on the plate camera, screen x 700–900 y 375–445 at s 1.00. Text 「3年2組」 small, 「たなか」 main. */
export const FpovTag = () => {
  // The Noto Sans JP face is also registered by look.tsx; this gate keeps the first frame from falling back to another face.
  const [handle] = useState(() => delayRender('NAMETAG-B03 font: Noto Sans JP'));
  useEffect(() => {
    loadFont({family: 'Noto Sans JP', url: staticFile('fonts/NotoSansJP.ttf'), weight: '100 900'})
      .then(() => continueRender(handle))
      .catch((err: unknown) => cancelRender(err instanceof Error ? err : new Error(String(err))));
  }, [handle]);
  return <g>
    <rect x={700} y={375} width={200} height={70} rx={4} fill="#cdd1c3" stroke="#5d6f7a" strokeWidth={2} />
    <rect x={893} y={379} width={5} height={62} fill="#b3b9aa" />
    <circle cx={712} cy={389} r={3.5} fill="#5d6f7a" />
    <text x={806} y={397} textAnchor="middle" lang="ja" fontFamily="Noto Sans JP" fontWeight={500} fontSize={20} fill="#1d2a2c">3年2組</text>
    <text x={806} y={436} textAnchor="middle" lang="ja" fontFamily="Noto Sans JP" fontWeight={700} fontSize={40} fill="#1d2a2c">たなか</text>
  </g>;
};
