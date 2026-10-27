import {measureText} from '@remotion/layout-utils';

export const LABEL_FONT = 'Noto Sans Thai';
export const LABEL_LINE_HEIGHT = 1.45;

const wordSegmenter = new Intl.Segmenter('th', {granularity: 'word'});
const graphemeSegmenter = new Intl.Segmenter('th', {granularity: 'grapheme'});

export type MeasureWidth = (text: string, size: number) => number;

const widthCache = new Map<string, number>();

/** Rendered width in the browser; falls back to a grapheme estimate when the font or DOM is unavailable. */
export const measureLabelWidth: MeasureWidth = (text, size) => {
  const key = `${size}|${text}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  let width: number;
  try {
    width = measureText({text, fontFamily: LABEL_FONT, fontSize: size, fontWeight: 700, validateFontIsLoaded: true}).width;
  } catch {
    width = Array.from(graphemeSegmenter.segment(text)).length * size * 0.6;
  }
  widthCache.set(key, width);
  return width;
};

/** Thai words (ICU dictionary) with spaces kept as separators, so a line never breaks inside a word. */
const tokens = (text: string) => Array.from(wordSegmenter.segment(text), part => part.segment);

const isPunctuation = (token: string) => /^[\p{P}\p{S}]+$/u.test(token.trim());

/** Greedy line fill by measured width. A single word wider than the box is split by grapheme as a last resort. */
const fillLines = (text: string, maxWidth: number, size: number, measure: MeasureWidth): string[] => {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    const push = () => { const trimmed = line.trim(); if (trimmed) lines.push(trimmed); line = ''; };
    for (const token of tokens(paragraph)) {
      if (measure(token.trim(), size) > maxWidth) {
        push();
        for (const {segment} of graphemeSegmenter.segment(token)) {
          if (line && measure(line + segment, size) > maxWidth) push();
          line += segment;
        }
        continue;
      }
      if (line && !isPunctuation(token) && measure((line + token).trim(), size) > maxWidth) push();
      line += token;
    }
    push();
  }
  return lines.length ? lines : [''];
};

/** Fill greedily, then narrow the measure while the line count holds so lines come out even instead of leaving an orphan word. */
export const breakLines = (text: string, maxWidth: number, size: number, measure: MeasureWidth = measureLabelWidth): string[] => {
  const lines = fillLines(text, maxWidth, size, measure);
  if (lines.length < 2) return lines;
  let low = 0; let high = maxWidth; let best = lines;
  for (let i = 0; i < 8; i++) {
    const mid = (low + high) / 2;
    const candidate = fillLines(text, mid, size, measure);
    if (candidate.length === lines.length && candidate.every(line => measure(line, size) <= maxWidth)) { best = candidate; high = mid; }
    else low = mid;
  }
  return best;
};

/** Height needed by a label of `lineCount` lines, including vertical padding. */
export const labelHeight = (lineCount: number, size: number, padding: number) => Math.round(lineCount * size * LABEL_LINE_HEIGHT + padding * 2);

/** Baseline of the first line so the whole text block is centred vertically in a box starting at `top`. */
export const firstBaseline = (top: number, boxHeight: number, lineCount: number, size: number) =>
  top + boxHeight / 2 - ((lineCount - 1) * size * LABEL_LINE_HEIGHT) / 2 + size * 0.34;
