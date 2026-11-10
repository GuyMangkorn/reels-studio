// No-air grade (N3; brief VD05): a colour transform with transition `u` (0 = real colour, 1 = fully drained) over the painted canvas only (screen layers
// such as the label stay in colour). Saturation 8 % at u 1, cool tint `#a9b8bd`, blacks lifted to `#2c3134`. CSS filter + two blend layers, a pure function
// of `u`, so it is seekable and the same in Studio and render. The hero drop keeps its cyan edge by being drawn in a layer above the grade (SP1, Film).
import type {ReactNode} from 'react';

export const GRADE = {saturation: 0.08, tint: '#a9b8bd', black: '#2c3134'} as const;
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

export const NoAirGrade = ({u, children}: {u: number; children: ReactNode}) => {
  const k = Math.max(0, Math.min(1, u));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, filter: `saturate(${mix(1, GRADE.saturation, k)}) contrast(${mix(1, 0.92, k)}) brightness(${mix(1, 1.04, k)})`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: GRADE.tint, mixBlendMode: 'multiply', opacity: 0.7 * k}} />
      <div style={{position: 'absolute', inset: 0, background: GRADE.black, mixBlendMode: 'lighten', opacity: k}} />
    </div>
  );
};
