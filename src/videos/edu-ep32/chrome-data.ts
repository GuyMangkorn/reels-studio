import type {CaptionCue} from '../../painted/kit/screen';
import {EDU32_CARDS} from './captions32';
import {FPS, SHADE} from './shots32';

// Pure data and timing of the EDU-EP32-SHORT chrome (chrome.tsx draws it): no React or font imports, so tests read it directly.
export const LABEL_TEXT = 'เรื่องจริง เล่าแบบขำ · ภาพและบทพูดจำลอง';
export const MARK_TEXT = '@TamMaiLa';
export const LABEL_FULL_TO = 90, LABEL_GONE_AT = 98;
export const labelOpacity = (g: number): number => g < LABEL_FULL_TO ? 1 : g >= LABEL_GONE_AT ? 0 : 1 - (g - LABEL_FULL_TO + 1) / (LABEL_GONE_AT - LABEL_FULL_TO + 1);

const lines = (text: string) => text.split('\n').length;
/** Shade cues of a shot in the shot's own seconds (cards clipped to the shot span). */
export const shadeCuesOf = (start: number, len: number): CaptionCue[] => EDU32_CARDS.filter((c) => c.to > start && c.from < start + len).map((c) => [
  Math.max(0, c.from - start) / FPS, (Math.min(start + len, c.to) - start) / FPS, lines(c.text),
] as const);
/** Peak strength at G: a ramp of the shot (linear between its [G, strength] points, held outside them) or the shot's value or the default. */
export const shadeStrengthAt = (shot: string, g: number): number => {
  const r = SHADE.ramps[shot];
  if (r) {
    if (g <= r[0][0]) return r[0][1];
    for (let i = 1; i < r.length; i++) if (g <= r[i][0]) return r[i - 1][1] + (r[i][1] - r[i - 1][1]) * (g - r[i - 1][0]) / (r[i][0] - r[i - 1][0]);
    return r[r.length - 1][1];
  }
  return SHADE.shots[shot] ?? SHADE.default;
};

