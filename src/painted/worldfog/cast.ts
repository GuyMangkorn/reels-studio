import {drawFigure as kitDrawFigure, shoulderHeight as kitShoulderHeight, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import type {Pt, Painter} from '../kit/painter';

export * from '../kit/cast';

export type Who = 'narrator' | 'worker' | 'shopworker' | 'occupant';

/** Cast designs (user-approved sheet 29 Oct; narrator a woman per WFOG-SCRIPT-R2 / VD03 R2; occupant age lines, user Q3). */
export const CAST: Record<Who, CastDef> = {
  narrator: {
    height: 1.7, seed: 610, head: {skin: '#e2b084', hair: '#262422', cut: 'long'},
    outfit: {shoulder: 0.38, shirt: '#e9e6dc', sleeve: '#6b7a5a', longSleeves: true, jacket: '#6b7a5a', pants: '#3f5672', shoes: '#d9d4c8'},
  },
  worker: {
    height: 1.7, seed: 620, head: {skin: '#c48c5c', hair: '#1f1d1b', cut: 'hood', hood: '#2f4a5e'},
    outfit: {shoulder: 0.42, shirt: '#2f4a5e', sleeve: '#2f4a5e', longSleeves: true, coat: '#2f4a5e', pants: '#2c3034', shoes: '#1c1e20', boots: true},
  },
  shopworker: {
    height: 1.7, seed: 630, head: {skin: '#efc39a', hair: '#2a2420', cut: 'tied'},
    outfit: {shoulder: 0.36, shirt: '#3d6f8f', sleeve: '#3d6f8f', longSleeves: false, apron: '#e8dcc2', pants: '#2b2d30', shoes: '#1f2022'},
  },
  occupant: {
    height: 1.6, seed: 640, head: {skin: '#e6b48c', hair: '#8f8a84', cut: 'bob', lines: true},
    outfit: {shoulder: 0.37, shirt: '#d8c9b0', sleeve: '#a5735a', longSleeves: true, jacket: '#a5735a', skirt: '#4c4a5e', pants: '#e6b48c', shoes: '#5a4636'},
  },
};

/** WFOG cast by story role: the kit rig drawn with this episode's `CAST` entry. */
export const drawFigure = (p: Painter, who: Who, g: Pt, unit: number, pose: FigPose, t: number, seed = CAST[who].seed): FigAnchors => kitDrawFigure(p, CAST[who], g, unit, pose, t, seed);
export const shoulderHeight = (who: Who, crouch = 0): number => kitShoulderHeight(CAST[who], crouch);
