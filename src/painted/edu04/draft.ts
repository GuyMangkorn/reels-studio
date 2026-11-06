import {getInputProps} from 'remotion';
import type {Painter} from '../kit/painter';

// EDU-EP04-SHORT Draft flicker fix (user, 6 Nov 2026: "use the draft brush so no layers flicker"). The Draft brush (BrushCanvas `drafted`,
// input prop `paintDraft`) already turns textured fills into flat washes, which follow the polygon exactly, but it leaves ink lines
// alone, and `p.ink` re-seeds every `boilEvery` plate frames: every outline redraws on a new stroke path twice per 4 frames. In the
// Draft that reads as flickering layers. Episode-local, so no other episode's picture or scene-cache key changes; the final grade keeps
// its boil (the painter is returned untouched).

/** True while the render carries `paintDraft` (scripts/storyboard-page/clips.mjs --draft, render.mjs --draft). */
export const isDraft = (): boolean => {
  try { return Boolean((getInputProps() as {paintDraft?: boolean}).paintDraft); } catch { return false; }
};

/** The same painter with every ink held still (`inkStill`: one seed per mark id), sub-layers included. */
export const stillInk = (p: Painter): Painter => ({...p, ink: p.inkStill, layer: (a, base) => stillInk(p.layer(a, base))});

/** `p` as is at final grade, with held ink in the Draft. */
export const forDraft = (p: Painter): Painter => (isDraft() ? stillInk(p) : p);
