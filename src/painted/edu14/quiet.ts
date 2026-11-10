// EDU-EP14 compact caption quiet patch: the pure layout rule (see look.tsx `QuietPatches`).
import {CAPTION_LINE_HEIGHT} from '../../scenes/captionLayout';
import {clamp01} from './clock';

export const QUIET = {pad: 18, feather: 22, ramp: 3, stroke: 14, bottom: 1344, font: 51, weight: 700, family: 'Noto Sans Thai'} as const;
/** Caption block rectangle for the lines of `text` given a width measurer (px per string at the caption font): the pure layout rule, tested without a browser. */
export const quietRect = (text: string, width: (line: string) => number) => {
  const lines = text.split('\n'), lh = QUIET.font * CAPTION_LINE_HEIGHT, h = lines.length * lh + 2 * QUIET.pad, w = Math.max(...lines.map(width)) + QUIET.stroke + 2 * QUIET.pad;
  return {x: 540 - w / 2, y: QUIET.bottom - lines.length * lh - QUIET.pad, w, h, lines: lines.length};
};
/** Opacity of a cue's patch at global frame `f` (0 outside; 1 while the caption shows, ramps over QUIET.ramp frames either side of its in and out). */
export const quietOpacity = (f: number, from: number, to: number) => clamp01(Math.min((f - (from - QUIET.ramp)) / QUIET.ramp, (to - f) / QUIET.ramp));
