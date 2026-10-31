import {loadFont} from '@remotion/fonts';
import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import type {Camera} from '../kit/camera';
import {ell, hardFill, INK, inkLine, rectPts, washAt} from '../kit/draw';
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

/** Push s 1.00 → 1.04 (F443–F513, sine in-out), lean-in 1.04 → 1.12 (F513–F528, sine in-out), 1.12 → 1.14 (F528–F645, linear). Focus (540, 620). */
export const fpovCamera = (f: number): Camera => ({
  s: f <= 70 ? 1 + 0.04 * sineInOut(f / 70) : f <= 85 ? 1.04 + 0.08 * sineInOut((f - 70) / 15) : 1.12 + 0.02 * clamp01((f - 85) / 117),
  fx: 540, fy: 620, dx: 0, dy: 0,
});
/** Page angle to the viewer in radians: 70° until F467 (f24), ease-out to 8° at F479 (f36). Hinge on the grip line. */
export const notebookTilt = (f: number) => ((70 - 62 * easeOut((f - 24) / 12)) * Math.PI) / 180;

const PAPER = '#d8dccf', CARDIGAN = '#26303a', CEL = '#202932', COLLAR = '#1f2a36', BLOUSE = '#b4bbb1';
const SCARF = '#3c5d5b', SCARF_SHADE = '#2c4645';
export const B03_GROUP_RISE = 100;
const PAGE = {x0: 270, spine: 540, x1: 810, grip: 599, bottom: 719, height: 360};
/** Mirror about the centre line x 540 (the torso, sleeves, arms and hands are symmetric; the tag is screen-right only). */
const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]): Pt => [1080 - x, y]);
const SIDES = [(pts: Pt[]) => pts, mirror] as const;

export const B03_HEM_Y = 1180;
/** Pass 7: garment-only 14% narrowing; held props and hand anchors do not move. */
export const B03_TORSO_SCALE = 0.86;
const slimTorso = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [540 + (x - 540) * B03_TORSO_SCALE, y]);
/** Upper sleeve width is 73% of pass 6, with its outer contour inset 40px from the new shoulder. */
const slimUpper = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [150 + (x - 80) * 0.73, y]);
const HALF_TORSO: Pt[] = [[400, -80], [400, 0], [300, 90], [40, 235], [95, 450], [105, 700], [118, 818], [135, 930], [115, 1180]];
export const TORSO: Pt[] = [[540, -80], ...slimTorso(HALF_TORSO), ...mirror(slimTorso(HALF_TORSO)).reverse()];
const COLLAR_OUTER: Pt[] = slimTorso([[40, 235], [300, 90], [400, 0], [400, -80], [680, -80], [680, 0], [780, 90], [1040, 235]]);
const COLLAR_INNER: Pt[] = slimTorso([[1030, 200], [540, 339], [50, 200]]);
const COLLAR_LINE: Pt[] = slimTorso([[50, 200], [540, 339], [1030, 200]]);
/**
 * Left arm (screen-left), plate px. Both sleeve sections overlap the torso; the low elbow and broad near cuff suggest a foreshortened forearm coming toward the viewer.
 */
export const ARM = {
  shoulder: [110, 235] as Pt, elbow: [160, 815] as Pt, wrist: [195, 607] as Pt,
  upperWidth: [73, 51.1] as const, foreWidth: [8, 85] as const,
  heel: [240, 550] as Pt, heelRadius: [33, 45] as const,
  thumb: [[258, 756], [279, 746], [298, 731]] as Pt[], thumbWidth: [24, 18] as const,
};
/** Blouse cuff: a band across the wrist end of the forearm (the hand emerges from under it). */
export const cuffAt = (E: Pt, W: Pt): Pt[] => {
  const len = Math.hypot(W[0] - E[0], W[1] - E[1]), dx = (W[0] - E[0]) / len, dy = (W[1] - E[1]) / len;
  const px = -dy * 38, py = dx * 38;
  const a: Pt = [W[0] - dx * 18, W[1] - dy * 18], b: Pt = [W[0] + dx * 12, W[1] + dy * 12];
  return [[a[0] + px, a[1] + py], [b[0] + px, b[1] + py], [b[0] - px, b[1] - py], [a[0] - px, a[1] - py]];
};
/** Four fingers curl over the page face; the thumb stays hidden behind the notebook. */
export const handPolygons = (side: 0 | 1): Pt[][] => [
  [[184, 700], [180, 666], [184, 624], [194, 588], [211, 574], [235, 575], [254, 588], [268, 603], [281, 618], [286, 641], [280, 670], [265, 700], [245, 719], [218, 723], [197, 715]],
  [[238, 578], [257, 577], [282, 585], [303, 594], [311, 603], [306, 614], [295, 614], [269, 606], [246, 604]],
  [[241, 604], [262, 602], [292, 610], [312, 619], [317, 629], [311, 640], [300, 639], [275, 630], [247, 629]],
  [[242, 630], [264, 627], [295, 635], [314, 644], [317, 654], [309, 664], [298, 661], [273, 653], [246, 654]],
  [[238, 656], [259, 652], [287, 660], [303, 669], [305, 679], [297, 687], [285, 684], [263, 677], [241, 681]],
].map((poly) => SIDES[side](poly.map(([x, y]): Pt => [x, y - B03_GROUP_RISE])));

const paintWash = (p: Painter) => {
  // Continuous dim corridor wash: pigment contours extend beyond the exposed side margins.
  // No bright window, hard floor boundary, or new side elements.
  washAt(p, 5200, '#304442', 255, rectPts(-180, -180, 1260, 2100), 0.3, 0.35);
  washAt(p, 5201, '#425b59', 225, ell(540, 250, 1600, 2500, 36), 0.5, 0.5);
  washAt(p, 5202, '#243438', 230, ell(540, 1650, 1800, 2500, 36), 0.5, 0.4);
};

// WORLD FOG-style seeded pigment and ink; repeat pigment for readable dark garments over the wet ground.
const paintFigure = (p: Painter, seed: number, color: string, pts: Pt[], passes = 3) => {
  for (let pass = 0; pass < passes; pass++) washAt(p, seed * 4 + pass, color, 245, pts, 0.08, 0.24);
};

const paintNotebook = (p: Painter, theta: number) => {
  const c = Math.cos(theta);
  const y = (yFace: number): number => PAGE.grip + (yFace - PAGE.grip) * c;
  const pt = (q: number[]): Pt => [q[0], y(q[1] - B03_GROUP_RISE)];
  const top = y(PAGE.bottom - PAGE.height);
  hardFill(p, 5300, HK.ink, rectPts(264, top - 6, 816, y(PAGE.bottom) + 6));
  hardFill(p, 5301, PAPER, rectPts(PAGE.x0, top, PAGE.spine, y(PAGE.bottom)));
  hardFill(p, 5302, PAPER, rectPts(PAGE.spine, top, PAGE.x1, y(PAGE.bottom)));
  hardFill(p, 5303, '#bfc6b7', rectPts(528, top, PAGE.spine, y(PAGE.bottom)));
  inkLine(p, 5304, [[540, top], [540, y(PAGE.bottom)]], {color: '#71887f', weight: 0.7, closed: false, still: true});
  // The foreshortened drawing resolves as the paper rolls toward the viewer.
  const visibility = clamp01((c - Math.cos(70 * Math.PI / 180)) / 0.38);
  const doodleColor = (color: string) => mixColor(PAPER, color, visibility);
  // DOODLE-HANAKO (VD06), drawn face-on on the right page (box x 590–730, y 520–740) and foreshortened with the page.
  paintFigure(p, 5310, doodleColor(HK.ink), [[612, 640], [606, 596], [616, 552], [634, 524], [660, 516], [686, 524], [704, 552], [714, 596], [708, 640]].map(pt));
  paintFigure(p, 5311, PAPER, ell(660, 582, 30, 36, 20).map(pt));
  inkLine(p, 5312, ell(660, 582, 30, 36, 20).map(pt), {color: doodleColor(INK), weight: 0.9});
  paintFigure(p, 5313, doodleColor('#c4ccbd'), [[640, 616], [680, 616], [700, 700], [620, 700]].map(pt));
  inkLine(p, 5314, [[628, 640], [606, 690], [610, 706]].map(pt), {color: doodleColor(INK), weight: 0.9, closed: false});
  inkLine(p, 5315, [[692, 640], [714, 690], [710, 706]].map(pt), {color: doodleColor(INK), weight: 0.9, closed: false});
  paintFigure(p, 5316, doodleColor(HK.red), [[620, 700], [700, 700], [728, 740], [592, 740]].map(pt));
};

/** Chest-only FPOV plate of the classmate telling the story (B03-SH01): frame top below the chin, no head at any frame. */
export const paintFpovChest = (p: Painter, f: number) => {
  paintWash(p);
  // Pass 7: waist/hem height stays fixed; the shorter cardigan ends at y1180.
  // Pleats remain in the dark garment family throughout the caption band.
  paintFigure(p, 5099, '#1d292f', slimTorso([[115, 1150], [965, 1150], [1030, 1980], [50, 1980]]));
  for (let i = 0; i < 7; i++) {
    const x = 180 + i * 120;
    paintFigure(p, 5290 + i, '#19252c', slimTorso([[x, 1170], [x + 28, 1170], [x + 44, 1980], [x - 24, 1980]]), 2);
  }
  paintFigure(p, 5100, CARDIGAN, TORSO);
  paintFigure(p, 5101, CEL, slimTorso([[850, 300], [980, 250], [985, 450], [975, 700], [945, 930], [965, 1180], [850, 1180]]));
  // Construction compressed below the unchanged waist; pockets sit above the hem.
  paintFigure(p, 5160, '#2c3940', slimTorso([[502, 850], [516, 865], [508, 1090], [494, 1130]]), 2);
  paintFigure(p, 5161, '#303c42', slimTorso([[210, 955], [390, 990], [228, 977]]), 2);
  paintFigure(p, 5162, '#202b32', slimTorso([[650, 950], [838, 982], [675, 972]]), 2);
  SIDES.forEach((m, i) => {
    inkLine(p, 5164 + i, m(slimTorso([[230, 1000], [400, 1005], [390, 1100], [245, 1095], [230, 1000]])), {color: '#344047', weight: 1.2, closed: false, still: true});
  });
  for (const [i, y] of [850, 985, 1110].entries()) paintFigure(p, 5270 + i, '#202a32', ell(540, y, 7, 7, 12), 2);
  paintFigure(p, 5111, '#303b44', slimTorso([[115, 1150], [965, 1150], [965, 1180], [115, 1180]]));
  for (let x = 130; x < 965; x += 24) inkLine(p, 5320 + x, slimTorso([[x, 1155], [x, 1176]]), {color: '#26313a', weight: 0.8, closed: false, still: true});
  inkLine(p, 5103, slimTorso([[40, 235], [300, 90], [400, 0]]), {color: '#7f9a98', weight: 2, closed: false});
  paintFigure(p, 5104, COLLAR, [...COLLAR_OUTER, ...COLLAR_INNER]);
  inkLine(p, 5105, COLLAR_LINE, {color: '#cfd3c8', weight: 1.5, closed: false});
  paintFigure(p, 5106, BLOUSE, slimTorso([[400, 0], [680, 0], [540, 339]]));
  paintFigure(p, 5107, SCARF, ell(540, 330, 35, 20, 18));
  paintFigure(p, 5108, SCARF_SHADE, slimTorso([[550, 311], [575, 320], [570, 350], [550, 348]]));
  paintFigure(p, 5109, SCARF, ribbon([[525, 344], [520, 410], [515, 470]], 30, 27));
  paintFigure(p, 5110, SCARF, ribbon([[555, 344], [560, 410], [565, 470]], 30, 27));
  // A soft cast shadow ties the raised page to the cardigan as the page opens.
  const pageBottom = PAGE.grip + (PAGE.bottom - PAGE.grip) * Math.cos(notebookTilt(f));
  washAt(p, 5129, '#202932', 90, ell(540, pageBottom + 8, 270, 8, 24), 0.2, 0.2);
  // Both sleeves lie in front of the cardigan. The low elbow is kept above the
  // projected caption band; the broad near cuff and hand suggest depth toward camera.
  SIDES.forEach((m, i) => {
    // Sleeve cap lies inward of the shoulder joint, clear of the locked camera crop.
    // Outer edge turns inward toward the ribs; no shoulder-width wing.
    paintFigure(p, 5120 + i, '#1a232b', m(slimUpper([[80, 235], [118, 272], [167, 435], [172, 640], [159, 774], [141, 821], [100, 826], [88, 789], [82, 590], [82, 300]])), 5);
    paintFigure(p, 5180 + i, '#303b42', m(slimUpper([[79, 285], [111, 300], [142, 500], [148, 710], [137, 790], [116, 745], [112, 510]])), 2);
    inkLine(p, 5182 + i, m(slimUpper([[151, 365], [161, 585], [147, 755], [129, 805]])), {color: '#151c23', weight: 1.4, closed: false});
  });
  paintNotebook(p, notebookTilt(f));
  const gripDy = 60 * (1 - Math.cos(notebookTilt(f)));
  const sleeveDepth = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [x + 60 * clamp01((y - 660) / 166), y + gripDy * clamp01((815 - y) / 200)]);
  SIDES.forEach((m, i) => {
    // P10 low elbow + P11 near-lens cuff: narrow elbow, tall rising wedge.
    washAt(p, 5190 + i, '#121c23', 90, m(sleeveDepth([[90, 825], [125, 700], [184, 567], [276, 604], [285, 665], [174, 825]] as Pt[])), 0.35, 0.3);
    paintFigure(p, 5130 + i * 4, '#34434b', m(sleeveDepth([[85, 811], [96, 751], [115, 665], [133, 601], [155, 566], [208, 562], [253, 590], [275, 625], [256, 665], [199, 719], [135, 810], [106, 826]] as Pt[])));
    paintFigure(p, 5170 + i, '#29363d', m(sleeveDepth([[106, 817], [164, 722], [224, 666], [264, 624], [275, 625], [256, 665], [199, 719], [135, 810]] as Pt[])), 2);
    inkLine(p, 5150 + i, m(sleeveDepth([[104, 801], [144, 741], [187, 696], [229, 658]] as Pt[])), {color: '#1b272d', weight: 1.7, closed: false});
    // Ellipse mouth: far rim is covered by the bent wrist; dark cavity remains
    // visible on either side. The light crescent belongs only to the near lip.
    paintFigure(p, 5131 + i * 4, '#596e70', m(ell(195, 607 + gripDy, 80, 49, 28)));
    paintFigure(p, 5132 + i * 4, '#14232b', m(ell(195, 601 + gripDy, 70, 39, 28)));
  });
  ([0, 1] as const).forEach((side) => {
    // Follow the page midpoint as its projected height changes during the opening.
    const dy = 60 * (1 - Math.cos(notebookTilt(f)));
    const [palm, ...fingers] = handPolygons(side).map((poly) => poly.map(([x, y]): Pt => [x, y + dy])), seed = side * 16;
    hardFill(p, 5140 + seed, '#c99777', palm);
    // A single hard cel plane keeps the palm volume readable without wet blobs.
    hardFill(p, 5210 + seed, HANAKO_HAND.skin, SIDES[side]([[191, 493 + dy], [211, 477 + dy], [238, 479 + dy], [266, 512 + dy], [263, 560 + dy], [236, 588 + dy], [202, 591 + dy]]));
    fingers.forEach((finger, i) => {
      hardFill(p, 5141 + seed + i, HANAKO_HAND.skin, finger);
      inkLine(p, 5200 + seed + i, finger.slice(2, 8), {color: '#684f42', weight: 1.3, closed: false, still: true});
      const crease = SIDES[side]([[252, 504 + i * 26 + dy], [266, 508 + i * 26 + dy], [275, 514 + i * 26 + dy]]);
      inkLine(p, 5240 + seed + i, crease, {color: '#b48568', weight: 0.7, closed: false, still: true});
      hardFill(p, 5260 + seed + i, '#f1d1b0', SIDES[side](ell(282, 497 + i * 26 + dy, 11, 3, 10)));
    });
    // Near cuff lip is in front of the wrist; never outline the full bracelet.
    const lip = [[120, 615], [132, 635], [156, 649], [191, 656], [226, 649], [255, 633], [267, 615], [257, 626], [224, 639], [191, 644], [159, 638], [137, 627]] as Pt[];
    paintFigure(p, 5280 + side, '#71817f', SIDES[side](lip.map(([x, y]): Pt => [x, y + dy])), 2);

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
  return <g transform="translate(0 -35)">
    <rect x={720} y={305} width={220} height={75} rx={4} fill="#cdd1c3" stroke="#5d6f7a" strokeWidth={2} />
    <rect x={933} y={309} width={5} height={67} fill="#b3b9aa" />
    <circle cx={732} cy={319} r={3.5} fill="#5d6f7a" />
    <text x={836} y={327} textAnchor="middle" lang="ja" fontFamily="Noto Sans JP" fontWeight={500} fontSize={20} fill="#1d2a2c">3年2組</text>
    <text x={836} y={366} textAnchor="middle" lang="ja" fontFamily="Noto Sans JP" fontWeight={700} fontSize={42} fill="#1d2a2c">たなか</text>
  </g>;
};
