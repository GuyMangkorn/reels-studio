import {ell} from './draw';
import type {Pt} from './painter';

// Headwear shapes of the job wardrobe (`wardrobe.ts`, `Gear.hat` in `cast.ts`): plain geometry in head units (head.ts frame: x across,
// y down, eyes at y 0.05, brows near -0.24, forehead top -1.05, chin 1.22; profile: face toward +x, ear at (-0.12, 0.12)).
// `cast.ts` paints the parts over the head with its own fill / ink calls; `tone` picks the colour from the hat spec.

/** `main` the hat colour, `band` the band colour (the spec's `band`, else a dark shade), `dark` a dark shade of main (visor, strap), `white` a badge. */
export type HatPart = {tone: 'main' | 'band' | 'dark' | 'white'; pts: Pt[]};
/** `top` 1850s top hat, `bonnet` 1850s bonnet with a ribbon (EDU-EP11 look frames LF03/LF04, kit intake proposed). */
export type HatKind = 'cap' | 'helmet' | 'nurse' | 'top' | 'bonnet';

const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 16): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

export const hatFront = (kind: HatKind): HatPart[] => {
  switch (kind) {
    case 'cap':
      return [
        {tone: 'main', pts: arc(0, -0.5, 1.12, 0.92, Math.PI, 2 * Math.PI)},
        {tone: 'band', pts: [[-1.14, -0.64], [1.14, -0.64], [1.12, -0.42], [-1.12, -0.42]]},
        {tone: 'dark', pts: ell(0, -0.41, 0.88, 0.09, 20)},
        {tone: 'white', pts: ell(0, -0.54, 0.11, 0.07, 12)},
      ];
    case 'helmet':
      return [
        {tone: 'main', pts: [...arc(0, -0.1, 1.2, 1.28, Math.PI, 2 * Math.PI, 20), [1.2, 0.3], [1.0, 0.36], [0.82, -0.28], [0.42, -0.46], [0, -0.5], [-0.42, -0.46], [-0.82, -0.28], [-1.0, 0.36], [-1.2, 0.3]]},
        {tone: 'band', pts: [[-0.16, -1.36], [0.16, -1.36], [0.14, -0.5], [-0.14, -0.5]]},
        {tone: 'dark', pts: [[-0.82, -0.28], [-0.42, -0.46], [0, -0.5], [0.42, -0.46], [0.82, -0.28], [0.8, -0.2], [0.42, -0.38], [0, -0.42], [-0.42, -0.38], [-0.8, -0.2]]},
      ];
    case 'nurse':
      return [
        {tone: 'main', pts: [[-0.66, -0.66], [0.66, -0.66], [0.76, -1.26], [0.4, -1.34], [0, -1.28], [-0.4, -1.34], [-0.76, -1.26]]},
        {tone: 'band', pts: [[-0.66, -0.66], [0.66, -0.66], [0.68, -0.78], [-0.68, -0.78]]},
      ];
    case 'top':
      return [
        {tone: 'main', pts: [[-0.66, -0.82], [0.66, -0.82], [0.62, -2.0], [0.5, -2.08], [-0.5, -2.08], [-0.62, -2.0]]},
        {tone: 'band', pts: [[-0.66, -0.82], [0.66, -0.82], [0.65, -1.1], [-0.65, -1.1]]},
        {tone: 'dark', pts: ell(0, -0.82, 1.18, 0.11, 24)},
      ];
    case 'bonnet':
      return [
        {tone: 'main', pts: [...arc(0, -0.28, 1.1, 1.0, Math.PI, 2 * Math.PI, 20), [1.1, 0.5], [0.86, 0.5], [0.8, -0.1], [0.6, -0.5], [0, -0.6], [-0.6, -0.5], [-0.8, -0.1], [-0.86, 0.5], [-1.1, 0.5]]},
        {tone: 'band', pts: [[-1.1, -0.2], [-0.86, -0.2], [-0.86, 0.5], [-1.1, 0.5]]},
        {tone: 'dark', pts: [[0.86, -0.2], [1.1, -0.2], [1.1, 0.5], [0.86, 0.5]]},
      ];
  }
};

export const hatSide = (kind: HatKind): HatPart[] => {
  switch (kind) {
    case 'cap':
      return [
        {tone: 'main', pts: [[1.0, -0.46], [1.08, -0.78], [0.86, -1.22], [0.24, -1.46], [-0.5, -1.34], [-1.04, -0.9], [-1.14, -0.5], [-1.0, -0.4]]},
        {tone: 'band', pts: [[1.04, -0.64], [-1.15, -0.64], [-1.1, -0.4], [1.02, -0.4]]},
        {tone: 'dark', pts: [[0.96, -0.5], [1.62, -0.42], [1.6, -0.32], [0.96, -0.36]]},
        {tone: 'white', pts: ell(0.9, -0.55, 0.08, 0.07, 10)},
      ];
    case 'helmet':
      return [
        {tone: 'main', pts: [[1.0, -0.46], [1.1, -0.8], [0.82, -1.3], [0.1, -1.52], [-0.72, -1.36], [-1.24, -0.7], [-1.28, 0.3], [-1.02, 0.68], [-0.6, 0.52], [-0.38, 0.32], [0.12, 0.3], [0.32, 0.08], [0.5, -0.32], [0.8, -0.46]]},
        {tone: 'band', pts: [[0.1, -1.52], [0.3, -1.46], [0.2, -0.4], [0.0, -0.38]]},
        {tone: 'dark', pts: [[0.5, -0.32], [0.8, -0.46], [1.0, -0.46], [1.0, -0.38], [0.8, -0.38], [0.54, -0.22]]},
      ];
    case 'nurse':
      return [
        {tone: 'main', pts: [[-0.3, -0.7], [0.9, -0.66], [0.96, -1.22], [0.5, -1.34], [-0.06, -1.26], [-0.34, -1.2]]},
        {tone: 'band', pts: [[-0.3, -0.7], [0.9, -0.66], [0.9, -0.78], [-0.3, -0.82]]},
      ];
    case 'top':
      return [
        {tone: 'main', pts: [[-0.7, -0.84], [0.72, -0.84], [0.66, -2.0], [0.5, -2.08], [-0.54, -2.08], [-0.7, -2.0]]},
        {tone: 'band', pts: [[-0.7, -0.84], [0.72, -0.84], [0.71, -1.1], [-0.7, -1.1]]},
        {tone: 'dark', pts: ell(0.04, -0.84, 1.3, 0.11, 24)},
      ];
    case 'bonnet':
      return [
        {tone: 'main', pts: [[0.8, -0.4], [0.5, -1.1], [-0.2, -1.36], [-0.9, -1.0], [-1.1, -0.2], [-0.96, 0.62], [-0.5, 0.5], [-0.3, 0.1], [0.3, -0.1]]},
        {tone: 'band', pts: [[-0.2, -0.66], [0.7, -0.52], [0.8, -0.34], [-0.2, -0.5]]},
        {tone: 'dark', pts: [[-0.5, 0.5], [-0.3, 0.9], [-0.18, 0.88], [-0.34, 0.46]]},
      ];
  }
};
