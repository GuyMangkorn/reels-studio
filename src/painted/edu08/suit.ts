import {PEOPLE} from '../kit/people';
import {EVA, evaSuit, paintEva, ZG_NEUTRAL, type EvaAnchors, type EvaOpts, type Helmet, type ArmM} from '../kit/eva';

// EDU-EP08-SHORT: the suit and helmet look moved into the kit (`kit/eva.ts`, wardrobe `eva-suit`; Boss B2). This module keeps the
// episode's names and its cast.
export const SUIT = EVA;
export {evaSuit, ZG_NEUTRAL, type Helmet, type ArmM};
/** Measurement hook (QA scripts, not painting): the anchors of the last figure painted per cast member. */
export const MEAS: {ast?: EvaAnchors | null; crew?: EvaAnchors | null; tech?: EvaAnchors | null} = {};
export const paintSuited: typeof paintEva = (p, c, def, o) => {
  const a = paintEva(p, c, def, {...o, fig: {sideCloth: false, ...o.fig}}); // keeps the delivered turned side (KIT-RUN-ARMS, 13 Nov 2026)
  if (def === AST_DEF) MEAS.ast = a; else if (def === CREW_DEF) MEAS.crew = a; else if (def === TECH_DEF) MEAS.tech = a;
  return a;
};
export type SuitedOpts = EvaOpts;
export type SuitedAnchors = EvaAnchors;
export const AST_DEF = evaSuit(PEOPLE['woman-bob']);
export const CREW_DEF = evaSuit(PEOPLE['man-crop']);
export const TECH_DEF = evaSuit(PEOPLE['man-parted'], {tint: EVA.silver});
