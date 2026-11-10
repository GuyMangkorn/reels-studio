import type {ReactNode} from 'react';
import {Painted} from './look';
import {paintFL1, paintFL2, paintPS1, paintPS2, paintPS3, paintPS4, paintPS5, paintPS6, paintPS7, paintAE1, paintAE2, paintAE3, paintAE4, paintAE5, paintAE6, paintAE7, paintAE8, paintSD1, paintSD2, paintSD3, paintSD4, paintSD5, paintSD6, paintSD7, paintSD8, paintSD9} from './w5-scenes';
import type {Painter} from '../kit/painter';

// EDU-EP16 W5.2 asset stills (Boss). Same frame as the W3 look stills (`Painted`: dashed caption band, off with --props='{"guides":false}').
export const W5_IDS = ['FL1', 'FL2', 'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PS6', 'PS7', 'AE1', 'AE2', 'AE3', 'AE4', 'AE5', 'AE6', 'AE7', 'AE8', 'SD1', 'SD2', 'SD3', 'SD4', 'SD5', 'SD6', 'SD7', 'SD8', 'SD9'] as const;
export type W5Id = (typeof W5_IDS)[number];
const PAINT: Record<W5Id, (p: Painter) => void> = {FL1: paintFL1, FL2: paintFL2, PS1: paintPS1, PS2: paintPS2, PS3: paintPS3, PS4: paintPS4, PS5: paintPS5, PS6: paintPS6, PS7: paintPS7, AE1: paintAE1, AE2: paintAE2, AE3: paintAE3, AE4: paintAE4, AE5: paintAE5, AE6: paintAE6, AE7: paintAE7, AE8: paintAE8, SD1: paintSD1, SD2: paintSD2, SD3: paintSD3, SD4: paintSD4, SD5: paintSD5, SD6: paintSD6, SD7: paintSD7, SD8: paintSD8, SD9: paintSD9};
export const W5 = Object.fromEntries(W5_IDS.map((id) => [id, () => <Painted paint={PAINT[id]} />])) as Record<W5Id, () => ReactNode>;
