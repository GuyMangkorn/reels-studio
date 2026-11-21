import type {CastDef, FigAnchors} from '../kit/cast';
import {paintFigureAt} from '../kit/figure-at';
import {tintPainter, type Painter} from '../kit/painter';
import {paperCard, type PaperCardOut} from '../kit/paper-card';
import type {V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {bandRamp, easeInOut, paintPageP, paintPageShade} from './b02-page';
import {AGENT, paintFedora} from './cast';
import {LAMP} from './desk';
import {lead} from './looks';

// EDU-EP32-SHORT B02-SH02 "ไม่มีใครระแวงแมวหรอก" (timed sheet EDU-EP32-SHEET-R1, G [436, 500), 64 f; VD32-08, VD32-16; Boss G2, 2026-11-21).
// One plate EDU32-B02-SH02, Space D, paper. The smug AGENT paper card `man-parted + new: agent-1960s, P09, smug` (charcoal suit, narrow black tie,
// white shirt, grey fedora; empty mittens on the hips) stands front on page P at (-1.6, 0, +1.0); the finished pop-up (LF02 state) behind him
// screen right with the cat small and lit on the bench. Talk L4-L48 (L04 G440-G484), one eyebrow lift at L40 (brow flat -> quirk). Camera eases
// L0 -> L63. Shot-local frame L = round(tl * 30).

export const B02SH02_N = 64;
const DEG = Math.PI / 180;
export const B02SH02 = {talk: [4, 48], brow: [38, 42]} as const;
export const B02SH02_AGENT_AT: V3 = [-1.6, 0, 1.0];
export const B02SH02_CAM0: YCam = {x: -1.5, y: 1.25, z: 3.2, yaw: -3 * DEG, pitch: 0, f: 900, hy: 560};
export const B02SH02_CAM1: YCam = {x: -1.35, y: 1.25, z: 2.9, yaw: -6 * DEG, pitch: 0, f: 900, hy: 560};
export const b02sh02Cam = (L: number): YCam => mixYCam(B02SH02_CAM0, B02SH02_CAM1, easeInOut(L / (B02SH02_N - 1)));
/** Caption-band shade on the near page and the felt: [picture row, opacity]. */
export const B02SH02_SHADE = {color: '#1c1820', steps: bandRamp(1100, 1320, 16, 20, 58)};

/** The AGENT as a standing paper card (P09 hands on hips, smug), fedora from the head anchors; returns his lead span and card. */
export const paintAgentCard = (p: Painter, c: YCam, def: CastDef, o: {at: V3; t: number; talk: boolean; browMix: number}) => {
  let a: FigAnchors | null = null;
  const draw = (q0: Painter) => {
    const q = tintPainter(q0, '#30384a', 0.1, {brush: true});
    a = paintFigureAt(q, c, def, {at: o.at, view: 'front', pose: 'P09', face: 'smug', t: o.t, seed: 34300, shadow: false,
      faceState: {brow: 'flat', browTo: 'quirk', browMix: o.browMix}, activity: o.talk ? 'talk' : false,
      held: (qq, an) => paintFedora(qq, an, 34390)});
  };
  const card: PaperCardOut | null = paperCard(p, c, {foot: o.at, light: LAMP, seed: 34350}, draw);
  const A = a as FigAnchors | null;
  if (!A) return null;
  const hh = A.chin - A.headTop;
  return {top: A.headTop - 0.2 * hh, bottom: A.bottom, faceTop: A.headTop, chin: A.chin, card};
};

/** The B02-SH02 plate at shot frame L. */
export const paintB02SH02 = (p: Painter, L: number, id = 'B02-SH02') => {
  const c = b02sh02Cam(L), t = 3.0 + L / 30;
  paintPageP(p, c, id, t);
  const talk = L >= B02SH02.talk[0] && L < B02SH02.talk[1];
  const browMix = easeInOut((L - B02SH02.brow[0]) / (B02SH02.brow[1] - B02SH02.brow[0]));
  const ag = paintAgentCard(p, c, AGENT, {at: B02SH02_AGENT_AT, t, talk, browMix});
  if (ag) lead(id, 'AGENT', {top: ag.top, bottom: ag.bottom, card: ag.card});
  paintPageShade(p, c, 37500, B02SH02_SHADE.color, B02SH02_SHADE.steps);
};
