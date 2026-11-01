import {useId} from 'react';
import {capsule, hardFill, inkLine, rectPts, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {streetP} from './space';

// The street set (brief VD03, `street` space): one-lane residential street, dark houses both sides, power pole with wires,
// one streetlight whose source is cropped above the frame, and a far vending machine. Washes for the sky and houses; hard
// fills for the straight road and kerb edges. Night key: deep blue-black, one warm cone (the lamp), a cool far glow.

const q = (pts: V3[]): Pt[] => pts.map(streetP);
const WALL_X = 3.1, TOP = 6.8, NEAR_Z = 0.5, FAR_Z = -60, ROAD = 2.25;

/** Paint the street set (plate px, world = metres through `streetP`). Call inside the plate's camera transform. */
export const paintStreet = (p: Painter) => {
  washAt(p, 6_100_001, '#0b1321', 255, rectPts(-300, -300, 1380, 470), 0.1, 0.2);
  washAt(p, 6_100_002, '#17283e', 150, rectPts(-300, 330, 1380, 470), 0.3, 0.3);

  // Houses: a facade per side with windows and doors in rows (near rows only are drawn in full).
  for (const side of [-1, 1] as const) {
    const x = side * WALL_X;
    hardFill(p, 6_100_010 + (side > 0 ? 1 : 0), '#132237', q([[x, 0, NEAR_Z], [x, 0, FAR_Z], [x, TOP, FAR_Z], [x, TOP, NEAR_Z]]));
    for (let k = 0; k < 10; k++) {
      const zc = -1.6 - 4.2 * k;
      const win = (z0: number, z1: number, y0: number, y1: number, color: string, id: number) =>
        hardFill(p, 6_100_100 + id, color, q([[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]]));
      const base = side > 0 ? 500 : 0;
      win(zc - 0.5, zc + 0.5, 2.3, 3.2, '#21344d', base + k * 4);
      if (k % 2 === 0) win(zc - 2.6, zc - 1.7, 0, 2.1, '#0a111d', base + k * 4 + 1);
    }
  }

  // Road and kerbs: straight edges, flat fills.
  hardFill(p, 6_100_020, '#0f1a2b', q([[-ROAD, 0, 3], [ROAD, 0, 3], [ROAD, 0, FAR_Z], [-ROAD, 0, FAR_Z]]));
  for (const side of [-1, 1] as const) {
    hardFill(p, 6_100_021 + (side > 0 ? 1 : 0), '#1b2a3d', q([[side * ROAD, 0.15, 3], [side * WALL_X, 0.15, 3], [side * WALL_X, 0.15, FAR_Z], [side * ROAD, 0.15, FAR_Z]]));
    inkLine(p, 6_100_030 + (side > 0 ? 1 : 0), q([[side * ROAD, 0.15, 3], [side * ROAD, 0.15, FAR_Z]]), {color: '#2a3b52', weight: 1.0, closed: false});
  }

  // Far vending machine (cool panel), left sidewalk, about 25 m away.
  hardFill(p, 6_100_040, '#18243a', q([[-3.05, 0, -20], [-2.15, 0, -20], [-2.15, 1.8, -20], [-3.05, 1.8, -20]]));
  hardFill(p, 6_100_041, '#2d4a5c', q([[-2.95, 1.0, -20], [-2.25, 1.0, -20], [-2.25, 1.6, -20], [-2.95, 1.6, -20]]));

  // Power pole (right) with a cross-arm, and three wires that sag across the sky.
  hardFill(p, 6_100_050, '#0a0f18', q([[2.5, 0, -3], [2.7, 0, -3], [2.7, 8.5, -3], [2.5, 8.5, -3]]));
  hardFill(p, 6_100_051, '#0a0f18', q([[1.9, 7.7, -3], [3.3, 7.7, -3], [3.3, 7.95, -3], [1.9, 7.95, -3]]));
  [6.8, 6.5, 6.2].forEach((h, i) => {
    const pts: V3[] = Array.from({length: 13}, (_, j): V3 => {
      const u = j / 12;
      return [2.6 + (-3.4 - 2.6) * u, h + (6.0 - h) * u - 0.45 * Math.sin(Math.PI * u), -3 + (-40 + 3) * u];
    });
    inkLine(p, 6_100_060 + i, q(pts), {color: '#2b3d55', weight: 1.2, curve: 0.3, closed: false});
  });

  // Streetlight pole (left, behind the woman) and its arm to the lamp head, above the frame.
  hardFill(p, 6_100_070, '#0a0f18', q([[-3.0, 0, -0.6], [-2.8, 0, -0.6], [-2.8, 5.5, -0.6], [-3.0, 5.5, -0.6]]));
  const arm = [streetP([-2.9, 5.2, -0.6]), streetP([-0.45, 4.75, -0.1])];
  washAt(p, 6_100_071, '#0a0f18', 255, capsule(arm[0], arm[1], 10, 8), 0.02, 0.05);
};

/** The lamp source, cropped above the frame (world point). */
export const LAMP_SOURCE = streetP([-0.45, 4.7, -0.1]);

/**
 * Screen-blend glow layers of the street (brief VD02, peak <= 0.3): the warm lamp cone from above the frame onto the
 * woman, a soft pool at her feet, and the cool far vending glow. Drawn in plate px inside the shot camera.
 */
export const StreetGlow = () => {
  const id = useId();
  const [lx, ly] = LAMP_SOURCE;
  return (
    <>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1="0" y1={ly} x2="0" y2={900}>
          <stop offset="0" stopColor="#e8c079" stopOpacity={0.3} />
          <stop offset="0.45" stopColor="#e8c079" stopOpacity={0.2} />
          <stop offset="1" stopColor="#e8c079" stopOpacity={0.1} />
        </linearGradient>
        <radialGradient id={`${id}p`}>
          <stop offset="0" stopColor="#e8c079" stopOpacity={0.16} />
          <stop offset="1" stopColor="#e8c079" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}v`}>
          <stop offset="0" stopColor="#9fd0d8" stopOpacity={0.28} />
          <stop offset="1" stopColor="#9fd0d8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <polygon points={`${lx - 30},${ly} ${lx + 30},${ly} 880,900 200,900`} fill={`url(#${id}c)`} />
      <ellipse cx={540} cy={884} rx={380} ry={46} fill={`url(#${id}p)`} />
      <circle cx={392} cy={470} r={80} fill={`url(#${id}v)`} />
    </>
  );
};
