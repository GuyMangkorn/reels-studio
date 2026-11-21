import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP31-SHORT-PIC-COVERS, Film pick 1, 2026-11-21 (cover-design skill sections 1-2, 6-7). Hook sheet, picture ideas, bands and scores:
 * scripts/edu-series/ep31/short/cover.md (COVER-R1). Inputs EDU-EP31-SCRIPT-R2, EDU-EP31-FACT-R1 and the plates of the Final cut
 * (out/EDU-EP31-SHORT/EDU-EP31-SHORT.mp4, 21 Nov 2026). All five are episode plates at a chosen shot-local frame (no cover paintings this
 * round: a cover-shot module would add a src/painted/registry.ts line and move the pinned Final's shared render-input hash).
 * Channel mark redrawn over the grade.
 */
const INK = '#1b222b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#f2f6ff'},
];
const P = (id: string, plate: string, local: number): Cover => ({id, plate, local, scrim: false, lines: []});
const L = (vignette: number) => ({grade: {vignette}, elements: MARK});
export const EDU31_PICS: Cover[] = [
  {...P('P1-wink-lemon', 'EDU31-B01-SH03', 41), layout: L(0.4)},
  {...P('P2-cctv-face', 'EDU31-B04-SH02', 66), layout: L(0.4)},
  {...P('P3-blank-polaroid', 'EDU31-B03-SH03', 50), layout: L(0.4)},
  {...P('P4-barefaced-loot', 'EDU31-B01-SH02', 80), layout: L(0.4)},
  {...P('P5-lemon-cheeks', 'EDU31-B03-SH02', 19), layout: L(0.4)},
];
export const EDU31_COVER_STYLE: CoverStyle = {accent: '#ffd21f'};
