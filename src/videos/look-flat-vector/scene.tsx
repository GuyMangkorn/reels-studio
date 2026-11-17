import type {ReactNode} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

/**
 * LOOK-FLAT-NIGHTCART: a look sample of the flat vector style (flat fills, no outlines, muted night palette, grain),
 * built on a real camera: the set lives in world metres and is projected through one near-frontal long-lens camera
 * (eye 1.55 m, yawed 8 degrees to the shop row), so facades, pavement, cart, wheels and the lamp's cast shadows agree.
 * People are jointed 6-head stylised adults (body landmarks from CP-L) with two-bone IK arms and legs and mitten hands.
 * World axes: X along the shop row (right), Y up, Z from the road toward the shops. Every moving part is a pure
 * function of the frame. Reference clips: store `projects/shared/LOOKFLAT/references/user/`.
 */
const C = {
  skyTop: '#191d36', skyLow: '#272a4d', moon: '#efe3bf',
  b1: '#2f3357', b2: '#3a3b63', b3: '#343056', b4: '#40395e', trim: '#252848',
  lit: '#f2c66b', dim: '#4a4d78', shutter: '#565a86',
  pave: '#3b3759', paveLine: '#2c2948', kerb: '#57527a', kerbFace: '#44406a', road: '#24223a',
  warm: '#f6d58a', red: '#b9553f', redDark: '#8d3f31', redSide: '#9a4634', cream: '#ead9b8', creamDark: '#cdb994', teal: '#3f8c86',
  steel: '#9aa0b8', steelLight: '#b9bed3', ink: '#1a1a2c', skin: '#d9a57c', skinShade: '#bf8662', blush: '#e07f6c', mouth: '#7a3b34',
  hair: '#1d1a2a', mustard: '#c9a24a', navy: '#2b3360', brown: '#5a4a3e', cat: '#d98a45', green: '#5d8f5a',
} as const;
const thai = {fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 800} as const;

// ---- Camera: near-frontal long lens ("near 3D"): small yaw, pulled back BACK metres with a long focal length so
// sizes match a close camera but receding lines converge only slightly. No pitch (verticals stay vertical).
const YAW = (8 * Math.PI) / 180, CY = Math.cos(YAW), SY = Math.sin(YAW);
const BACK = 6, PAN = 1.75, FOCAL = 2590, HORIZON = 1250, EYE = 1.55;
type V2 = [number, number];
type V3 = [number, number, number];
const depth = ([x, , z]: V3) => x * SY + z * CY + BACK;
const P = (p: V3): V2 => {
  const zc = depth(p);
  return [540 + (FOCAL * (p[0] * CY - p[2] * SY - PAN)) / zc, HORIZON - (FOCAL * (p[1] - EYE)) / zc];
};
const pts = (ps: V3[]) => ps.map(p => P(p).map(v => v.toFixed(1)).join(',')).join(' ');
const Poly = ({ps, fill, opacity}: {ps: V3[]; fill: string; opacity?: number}) => <polygon points={pts(ps)} fill={fill} opacity={opacity}/>;
const Line = ({a, b, stroke, w, opacity}: {a: V3; b: V3; stroke: string; w: number; opacity?: number}) => {
  const [p, q] = [P(a), P(b)];
  return <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={stroke} strokeWidth={w} strokeLinecap="round" opacity={opacity}/>;
};
/** Rectangles in the three world planes. */
const faceZ = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const faceX = (z0: number, z1: number, y0: number, y1: number, x: number): V3[] => [[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]];
const faceY = (x0: number, x1: number, z0: number, z1: number, y: number): V3[] => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
const ring = (n: number, f: (a: number) => V3) => Array.from({length: n}, (_, i) => f((i / n) * Math.PI * 2));
const circleY = (cx: number, cz: number, r: number, y: number) => ring(36, a => [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
const circleZ = (cx: number, cy: number, r: number, z: number) => ring(36, a => [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
/** Affine frame for flat art on a world plane: local metres, x along `ux`, y down (against `up`), origin `o`. */
const onPlane = (o: V3, ux: V3, up: V3) => {
  const O = P(o), X = P([o[0] + ux[0], o[1] + ux[1], o[2] + ux[2]]), D = P([o[0] - up[0], o[1] - up[1], o[2] - up[2]]);
  return `matrix(${X[0] - O[0]} ${X[1] - O[1]} ${D[0] - O[0]} ${D[1] - O[1]} ${O[0]} ${O[1]})`;
};
const Cylinder = ({x, z, r, y0, y1, body, top, inner}: {x: number; z: number; r: number; y0: number; y1: number; body: string; top: string; inner?: string}) => {
  const lo = circleY(x, z, r, y0).map(P), hi = circleY(x, z, r, y1).map(P);
  const ext = (a: V2[], pick: (u: number, v: number) => boolean) => a.reduce((m, p) => (pick(p[0], m[0]) ? p : m));
  const [l0, r0, l1, r1] = [ext(lo, (u, v) => u < v), ext(lo, (u, v) => u > v), ext(hi, (u, v) => u < v), ext(hi, (u, v) => u > v)];
  const str = (a: V2[]) => a.map(p => p.join(',')).join(' ');
  return <g>
    <polygon points={str(lo)} fill={body}/>
    <polygon points={`${l0} ${r0} ${r1} ${l1}`} fill={body}/>
    <polygon points={str(hi)} fill={top}/>
    {inner && <polygon points={str(circleY(x, z, r * 0.84, y1).map(P))} fill={inner}/>}
  </g>;
};

// ---- Light: the street lamp is a point light; shadows fall on the ground plane ----
const LAMP: V3 = [3.3, 4.4, 6.0];
const shadowOf = (p: V3): V3 => {
  const t = LAMP[1] / (LAMP[1] - p[1]);
  return [LAMP[0] + (p[0] - LAMP[0]) * t, 0, LAMP[2] + (p[2] - LAMP[2]) * t];
};

// ---- Jointed person ----
/** Stylised head count (user, 15 Nov 2026: 6 heads). Realistic is 7.5 (CP-A05). */
const HEADS = 6;
/** Scale of the realistic body (neck base 0.83 under a 1/7.5 head) so its neck base sits 0.03 below the 1/HEADS chin. */
const BODY_K = (1 - 1 / HEADS - 0.03) / 0.83;
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${Math.round(((n >> 16) & 255) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`;
};
/** Two-bone IK in the screen-down local frame: returns [middle joint, end]. `bend` +1/-1 picks the elbow/knee side. */
const ik = (r: V2, t: V2, l1: number, l2: number, bend: number): [V2, V2] => {
  const dx = t[0] - r[0], dy = t[1] - r[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
  const phi = Math.atan2(dy, dx), a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  return [[r[0] + Math.cos(phi + bend * a) * l1, r[1] + Math.sin(phi + bend * a) * l1], [r[0] + Math.cos(phi) * d, r[1] + Math.sin(phi) * d]];
};
const lerp2 = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Tapered capsule from a (radius ra) to b (radius rb). */
const Limb = ({a, b, ra, rb, fill}: {a: V2; b: V2; ra: number; rb: number; fill: string}) => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6, nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l;
  return <g fill={fill}>
    <polygon points={`${a[0] + nx * ra},${a[1] + ny * ra} ${b[0] + nx * rb},${b[1] + ny * rb} ${b[0] - nx * rb},${b[1] - ny * rb} ${a[0] - nx * ra},${a[1] - ny * ra}`}/>
    <circle cx={a[0]} cy={a[1]} r={ra}/><circle cx={b[0]} cy={b[1]} r={rb}/>
  </g>;
};
/** Mitten hand at the wrist, pointing along the forearm: one tapered mass plus a thumb lump. */
const Mitten = ({elbow, wrist, h, fill}: {elbow: V2; wrist: V2; h: number; fill: string}) => {
  const l = Math.hypot(wrist[0] - elbow[0], wrist[1] - elbow[1]) || 1e-6, u: V2 = [(wrist[0] - elbow[0]) / l, (wrist[1] - elbow[1]) / l];
  const n: V2 = u[0] >= 0 ? [u[1], -u[0]] : [-u[1], u[0]];
  const c: V2 = [wrist[0] + u[0] * h * 0.04, wrist[1] + u[1] * h * 0.04];
  return <g fill={fill}>
    <ellipse cx={c[0]} cy={c[1]} rx={h * 0.048} ry={h * 0.026} transform={`rotate(${(Math.atan2(u[1], u[0]) * 180) / Math.PI} ${c[0]} ${c[1]})`}/>
    <circle cx={wrist[0] + n[0] * h * 0.022 + u[0] * h * 0.012} cy={wrist[1] + n[1] * h * 0.022 + u[1] * h * 0.012} r={h * 0.013}/>
  </g>;
};

type PersonProps = {
  at: V3; h: number; look: 1 | -1; female?: boolean; shirt: string; pants: string; apron?: string; bun?: boolean;
  mouth?: 'smile' | 'o'; blink?: boolean;
  /** Wrist targets in local metres (x right, y down from the feet). */
  nearHand: V2; farHand: V2;
  /** Local-metre art drawn after the head and before the near arm (a held bowl), and after the near arm (chopsticks). */
  held?: ReactNode; inHand?: ReactNode;
};
/** Screen frame of a person standing at `at`: feet point and pixels per metre. */
const frameAt = (at: V3) => ({feet: P(at), s: FOCAL / depth(at)});
/** A world point in a person's local metre frame (same depth assumed). */
const toLocal = (at: V3, w: V3): V2 => {
  const {feet, s} = frameAt(at), p = P(w);
  return [(p[0] - feet[0]) / s, (p[1] - feet[1]) / s];
};
const Person = ({at, h: total, look: L, female, shirt, pants, apron, bun, mouth = 'smile', blink, nearHand, farHand, held, inHand}: PersonProps) => {
  const {feet, s} = frameAt(at);
  // Body landmarks and limbs are the realistic table (CP-L) squeezed under a larger head: H is the body scale.
  const H = total * BODY_K;
  const k = female ? {sh: 0.1, wa: 0.064, hip: 0.1, limb: 0.9} : {sh: 0.113, wa: 0.075, hip: 0.094, limb: 1};
  const side = (sd: number, v: number) => sd * v * H * (sd === L ? 1 : 0.8); // the far side is foreshortened in 3/4
  const cxT = L * 0.01 * H;
  const yNeck = -0.83 * H, ySh = -0.805 * H, yWaist = -0.62 * H, yHip = -0.53 * H, yHem = -0.485 * H;
  const shoulder = (sd: number): V2 => [side(sd, k.sh) * 0.82 + cxT, ySh + 0.025 * H];
  const hipJ = (sd: number): V2 => [sd * (sd === L ? 0.048 : 0.036) * H, yHip];
  const ankle = (sd: number): V2 => sd === L ? [L * 0.06 * H, -0.045 * H] : [-L * 0.045 * H, -0.053 * H];
  const leg = (sd: number) => ik(hipJ(sd), ankle(sd), 0.255 * H, 0.235 * H, -L);
  // Elbows hang: take the IK solution whose elbow is lower; when both are level, the one behind the body.
  const arm = (sd: number, t: V2): [V2, V2] => {
    const a = ik(shoulder(sd), t, 0.186 * H, 0.146 * H, 1), b = ik(shoulder(sd), t, 0.186 * H, 0.146 * H, -1);
    if (Math.abs(a[0][1] - b[0][1]) > 0.02 * H) return a[0][1] > b[0][1] ? a : b;
    return (a[0][0] - b[0][0]) * L < 0 ? a : b;
  };
  const r = (v: number) => v * H * k.limb;

  const Leg = ({sd, tone}: {sd: number; tone: number}) => {
    const [knee, ank] = leg(sd), col = shade(pants, tone);
    const toe = ank[0] + L * 0.11 * H, heel = ank[0] - L * 0.035 * H;
    return <g>
      <Limb a={hipJ(sd)} b={knee} ra={r(0.05)} rb={r(0.034)} fill={col}/>
      <Limb a={knee} b={ank} ra={r(0.034)} rb={r(0.024)} fill={col}/>
      <path d={`M${heel} ${ank[1] - 0.01 * H} L${toe - L * 0.03 * H} ${ank[1] + 0.005 * H} Q${toe} ${ank[1] + 0.012 * H} ${toe} ${ank[1] + 0.045 * H} L${heel} ${ank[1] + 0.045 * H} Z`} fill={shade(C.ink, tone)}/>
    </g>;
  };
  const Arm = ({sd, t, tone}: {sd: number; t: V2; tone: number}) => {
    const [elbow, wrist] = arm(sd, t), sh = shoulder(sd);
    return <g>
      <Limb a={sh} b={elbow} ra={r(0.027)} rb={r(0.022)} fill={shade(C.skin, tone)}/>
      <Limb a={elbow} b={wrist} ra={r(0.021)} rb={r(0.016)} fill={shade(C.skin, tone)}/>
      <Limb a={sh} b={lerp2(sh, elbow, 0.55)} ra={r(0.036)} rb={r(0.03)} fill={shade(shirt, tone)}/>
      <Mitten elbow={elbow} wrist={wrist} h={H * k.limb} fill={shade(C.skin, tone)}/>
    </g>;
  };

  // Torso outline: neck, shoulder caps, armpits, waist, hem; near side full width, far side foreshortened.
  const sx = (sd: number, v: number) => side(sd, v) + cxT;
  const torso = `M${cxT - 0.03 * H} ${yNeck} Q${sx(-L, k.sh) * 0.9} ${ySh - 0.01 * H} ${sx(-L, k.sh)} ${ySh + 0.03 * H}
    L${sx(-L, k.sh * 0.86)} ${ySh + 0.11 * H} Q${sx(-L, k.wa)} ${yWaist - 0.04 * H} ${sx(-L, k.wa)} ${yWaist}
    Q${sx(-L, k.hip)} ${yHip} ${sx(-L, k.hip)} ${yHem} L${sx(L, k.hip)} ${yHem} Q${sx(L, k.hip)} ${yHip} ${sx(L, k.wa)} ${yWaist}
    Q${sx(L, k.wa)} ${yWaist - 0.04 * H} ${sx(L, k.sh * 0.86)} ${ySh + 0.11 * H} L${sx(L, k.sh)} ${ySh + 0.03 * H}
    Q${sx(L, k.sh) * 0.9} ${ySh - 0.01 * H} ${cxT + 0.03 * H} ${yNeck} Z`;

  // Head: 1/7.5 of height, turned 3/4 toward `look`.
  const ry = total / HEADS / 2, rx = ry * 0.75, hx = cxT + L * 0.012 * H, hy = -total + ry;
  const mid = hx + L * rx * 0.38;
  const fringe = `M${hx - rx * 1.03} ${hy + ry * 0.15} C${hx - rx * 0.9} ${hy - ry * 0.35} ${hx - rx * 0.25} ${hy - ry * 0.2} ${hx + rx * 0.3} ${hy - ry * 0.4} C${hx + rx * 0.6} ${hy - ry * 0.5} ${hx + rx * 0.9} ${hy - ry * 0.3} ${hx + rx * 1.03} ${hy - ry * 0.05} A${rx * 1.03} ${ry * 1.03} 0 0 0 ${hx - rx * 1.03} ${hy + ry * 0.15} Z`;

  return <g transform={`translate(${feet[0]} ${feet[1]}) scale(${s})`}>
    <Arm sd={-L} t={farHand} tone={0.82}/>
    <Leg sd={-L} tone={0.82}/>
    <Leg sd={L} tone={1}/>
    <rect x={-k.hip * H * 0.85} y={-0.55 * H} width={k.hip * H * 1.7} height={0.09 * H} rx={0.03 * H} fill={pants}/>
    <path d={torso} fill={shirt}/>
    {apron && <path d={`M${sx(-L, k.wa * 0.8)} ${yWaist - 0.08 * H} L${sx(L, k.wa * 0.85)} ${yWaist - 0.08 * H} L${sx(L, k.hip * 0.9)} ${-0.33 * H} L${sx(-L, k.hip * 0.85)} ${-0.33 * H} Z
      M${cxT - 0.055 * H} ${yWaist - 0.08 * H} L${cxT - 0.05 * H} ${-0.74 * H} L${cxT + 0.05 * H} ${-0.74 * H} L${cxT + 0.055 * H} ${yWaist - 0.08 * H} Z`} fill={apron}/>}
    <polygon points={`${cxT - 0.025 * H},${yNeck + 0.012 * H} ${cxT + 0.025 * H},${yNeck + 0.012 * H} ${hx + 0.021 * H},${hy + ry * 0.75} ${hx - 0.021 * H},${hy + ry * 0.75}`} fill={C.skin}/>
    <ellipse cx={hx + L * 0.004 * H} cy={yNeck - 0.012 * H} rx={0.022 * H} ry={0.01 * H} fill={C.skinShade} opacity={0.6}/>
    {/* head: back hair mass, cranium, forward jaw, bun, fringe, ear on the back side, features */}
    <ellipse cx={hx - L * rx * 0.22} cy={hy - ry * 0.12} rx={rx * 0.92} ry={ry * 0.9} fill={C.hair}/>
    <ellipse cx={hx} cy={hy} rx={rx} ry={ry} fill={C.skin}/>
    <ellipse cx={hx + L * rx * 0.32} cy={hy + ry * 0.7} rx={rx * 0.48} ry={ry * 0.3} fill={C.skin}/>
    {bun && <circle cx={hx - L * rx * 0.85} cy={hy - ry * 0.75} r={rx * 0.42} fill={C.hair}/>}
    <path d={fringe} fill={C.hair} transform={L < 0 ? `translate(${2 * hx} 0) scale(-1 1)` : undefined}/>
    <ellipse cx={hx - L * rx * 0.42} cy={hy + ry * 0.14} rx={rx * 0.16} ry={ry * 0.21} fill={C.skinShade}/>
    {[-1, 1].map(sd => {
      const far = sd === -L, ex = mid + sd * rx * (far ? 0.28 : 0.34), ey = hy + ry * 0.12, sq = far ? 0.8 : 1;
      return <g key={sd}>
        <rect x={ex - rx * 0.19 * sq} y={ey - ry * 0.36} width={rx * 0.38 * sq} height={ry * 0.075} rx={ry * 0.035} fill={C.hair}/>
        {blink
          ? <rect x={ex - rx * 0.11 * sq} y={ey - ry * 0.02} width={rx * 0.22 * sq} height={ry * 0.05} rx={ry * 0.025} fill={C.ink}/>
          : <><ellipse cx={ex} cy={ey} rx={rx * 0.095 * sq} ry={ry * 0.12} fill={C.ink}/><circle cx={ex + rx * 0.035} cy={ey - ry * 0.045} r={rx * 0.032} fill="#fff"/></>}
        {!far && <ellipse cx={ex + L * rx * 0.05} cy={ey + ry * 0.3} rx={rx * 0.15} ry={ry * 0.075} fill={C.blush} opacity={0.5}/>}
      </g>;
    })}
    <path d={`M${mid + L * rx * 0.1} ${hy + ry * 0.16} l${L * rx * 0.16} ${ry * 0.24} l${-L * rx * 0.17} ${ry * 0.03}`} fill="none" stroke={C.skinShade} strokeWidth={rx * 0.075} strokeLinecap="round" strokeLinejoin="round"/>
    {mouth === 'o'
      ? <ellipse cx={mid + L * rx * 0.04} cy={hy + ry * 0.6} rx={rx * 0.085} ry={ry * 0.075} fill={C.mouth}/>
      : <path d={`M${mid - rx * 0.16} ${hy + ry * 0.57} q${rx * 0.16} ${ry * 0.15} ${rx * 0.32} 0`} fill="none" stroke={C.mouth} strokeWidth={rx * 0.075} strokeLinecap="round"/>}
    {held}
    <Arm sd={L} t={nearHand} tone={1}/>
    {inHand}
  </g>;
};

/** Ground shadow of a standing person from the lamp: contact pool plus a tapered cast shadow. */
const PersonShadow = ({at, h}: {at: V3; h: number}) => {
  const head = shadowOf([at[0], h, at[2]]), dx = head[0] - at[0], dz = head[2] - at[2], l = Math.hypot(dx, dz) || 1;
  const nx = -dz / l, nz = dx / l;
  return <g>
    <Poly ps={[[at[0] + nx * 0.17, 0, at[2] + nz * 0.17], [head[0] + nx * 0.1, 0, head[2] + nz * 0.1], [head[0] - nx * 0.1, 0, head[2] - nz * 0.1], [at[0] - nx * 0.17, 0, at[2] - nz * 0.17]]} fill="#000" opacity={0.22}/>
    <Poly ps={circleY(at[0], at[2], 0.24, 0)} fill="#000" opacity={0.25}/>
  </g>;
};

const HOUSES = [
  {x0: -1.5, x1: 1.6, h: 5.95, fill: C.b1, lit: [false, true], laundry: false},
  {x0: 1.6, x1: 4.7, h: 6.3, fill: C.b2, lit: [true, false], laundry: false},
  {x0: 4.7, x1: 7.6, h: 6.0, fill: C.b3, lit: [false, false], laundry: true},
  {x0: 7.6, x1: 10.8, h: 6.2, fill: C.b4, lit: [false, true], laundry: false},
];
const FACADE = 7.5;

const House = ({x0, x1, h, fill, lit, laundry}: (typeof HOUSES)[number]) => {
  const z = FACADE;
  return <g>
    <Poly ps={faceZ(x0, x1, 0, h, z)} fill={fill}/>
    <Poly ps={faceZ(x0, x1, h - 0.3, h, z - 0.01)} fill={C.trim}/>
    {[0, 1].map(i => { const wx = i ? x1 - 1.35 : x0 + 0.45; return <g key={i}>
      <Poly ps={faceZ(wx, wx + 0.9, 4.0, 5.6, z - 0.01)} fill={lit[i] ? C.lit : C.dim}/>
      <Poly ps={faceZ(wx + 0.42, wx + 0.48, 4.0, 5.6, z - 0.02)} fill={fill}/>
      <Poly ps={faceZ(wx - 0.1, wx + 1.0, 3.86, 4.0, z - 0.02)} fill={C.trim}/>
    </g>; })}
    <Poly ps={faceZ(x0 + 0.15, x1 - 0.15, 2.95, 3.15, z - 0.01)} fill={C.trim}/>
    {laundry
      ? <><Poly ps={faceZ(x0 + 0.5, x1 - 0.5, 0, 2.7, z - 0.01)} fill={C.lit} opacity={0.88}/>
        <Poly ps={faceZ((x0 + x1) / 2 - 0.04, (x0 + x1) / 2 + 0.04, 0, 2.7, z - 0.02)} fill={fill}/></>
      : Array.from({length: 13}, (_, i) => <Poly key={i} ps={faceZ(x0 + 0.35, x1 - 0.35, 0.1 + i * 0.2, 0.22 + i * 0.2, z - 0.01)} fill={C.shutter} opacity={0.55}/>)}
  </g>;
};

export const FlatNightCart = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 14) * 6;
  const steam = (i: number) => ((frame * 1.1 + i * 47) % 150) / 150;
  // Loops on the 90-frame clip: stirring 3 turns, one noodle lift, bulb sway 2 swings, one blink each.
  const stirA = (frame / 30) * Math.PI * 2;
  const ladleTop: V3 = [1.45 + Math.cos(stirA) * 0.06, 1.28, 4.68 + Math.sin(stirA) * 0.05];
  const lift = 0.5 - 0.5 * Math.cos((frame / 90) * Math.PI * 2);
  const bulbDeg = Math.sin((frame / 45) * Math.PI * 2) * 5;

  const VENDOR: V3 = [0.92, 0, 4.9], CUSTOMER: V3 = [3.85, 0, 4.05];
  const cust = frameAt(CUSTOMER);
  // Customer: bowl in the far hand at chest height; chopsticks in the near hand lift noodles toward the mouth.
  const bowl: V2 = [-0.36, -1.1];
  const chopHand: V2 = lerp2([-0.27, -1.24], [-0.31, -1.3], lift);
  const chopAng = ((124 + (320 - 124) * lift) * Math.PI) / 180; // tips swing out and up, ending at the mouth
  const tip: V2 = [chopHand[0] + Math.cos(chopAng) * 0.22, chopHand[1] + Math.sin(chopAng) * 0.22];

  const potTop = P([1.45, 1.24, 4.68]), bulbPivot = P([2.0, 2.1, 4.35]), bulbAt = P([2.0, 1.86, 4.35]);
  const cartS = FOCAL / depth([2.0, 0, 4.6]);
  const pool = circleY(3.1, 5.6, 2.3, 0).map(P);
  const poolL = pool.reduce((m, p) => (p[0] < m[0] ? p : m)), poolR = pool.reduce((m, p) => (p[0] > m[0] ? p : m)), head = P(LAMP);
  const cartBox: V3[] = [[1.2, 0.3, 4.3], [2.8, 0.3, 4.3], [2.8, 0.3, 5.0], [1.2, 0.3, 5.0], [1.2, 0.97, 4.3], [2.8, 0.97, 4.3], [2.8, 0.97, 5.0], [1.2, 0.97, 5.0]].map(p => shadowOf(p as V3));
  const boxFaces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];

  return <AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <defs>
        <radialGradient id="lfv-vignette" cx="50%" cy="58%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity={0}/><stop offset="100%" stopColor="#000" stopOpacity={0.5}/></radialGradient>
      </defs>

      {/* Sky, moon, stars; road fills everything below the horizon first */}
      <rect width={1080} height={1920} fill={C.skyTop}/>
      <rect y={420} width={1080} height={830} fill={C.skyLow}/>
      <rect y={HORIZON} width={1080} height={1920 - HORIZON} fill={C.road}/>
      <circle cx={820} cy={170} r={118} fill={C.moon} opacity={0.07}/>
      <circle cx={820} cy={170} r={62} fill={C.moon}/>
      <circle cx={842} cy={152} r={11} fill="#d9cba3"/><circle cx={802} cy={192} r={7} fill="#d9cba3"/>
      {Array.from({length: 46}, (_, i) => <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 420} r={1.4 + random(`sr${i}`) * 1.8} fill={C.moon} opacity={0.35 + random(`so${i}`) * 0.5}/>)}

      {/* Shop row on one facade plane, AC box, laundry awning and sign */}
      {HOUSES.map(hs => <House key={hs.x0} {...hs}/>)}
      <Poly ps={faceX(7.05, 7.5, 4.9, 5.45, 8.6)} fill="#7d82a0"/>
      <Poly ps={faceY(8.6, 9.45, 7.05, 7.5, 4.9)} fill="#6a6f8e"/>
      <Poly ps={faceZ(8.6, 9.45, 4.9, 5.45, 7.05)} fill={C.steel}/>
      {[0, 1, 2, 3].map(i => <Poly key={i} ps={faceZ(8.7, 9.35, 5.0 + i * 0.11, 5.04 + i * 0.11, 7.04)} fill="#7d82a0"/>)}
      <Poly ps={faceZ(4.75, 5.8, 3.28, 3.68, FACADE - 0.02)} fill={C.cream}/>
      <text transform={onPlane([5.275, 3.39, FACADE - 0.03], [1, 0, 0], [0, 1, 0])} fontSize={0.25} textAnchor="middle" fill={C.redDark} style={thai}>ซัก อบ รีด</text>
      <Poly ps={[[4.8, 2.95, FACADE], [6.6, 2.95, FACADE], [6.6, 2.6, FACADE - 0.8], [4.8, 2.6, FACADE - 0.8]]} fill={C.teal}/>
      <Poly ps={faceX(FACADE - 0.8, FACADE, 2.6, 2.95, 4.8)} fill={shade(C.teal, 0.75)}/>
      {Array.from({length: 5}, (_, i) => <Poly key={i} ps={faceZ(4.8 + i * 0.36, 4.98 + i * 0.36, 2.45, 2.6, FACADE - 0.8)} fill={i % 2 ? C.teal : C.cream}/>)}

      {/* Pavement with a converging tile grid, kerb */}
      <Poly ps={faceY(-3, 14, 2.8, FACADE, 0)} fill={C.pave}/>
      {Array.from({length: 7}, (_, i) => <Line key={`z${i}`} a={[-3, 0, 3.4 + i * 0.6]} b={[14, 0, 3.4 + i * 0.6]} stroke={C.paveLine} w={2}/>)}
      {Array.from({length: 22}, (_, i) => <Line key={`x${i}`} a={[-2.4 + i * 0.7, 0, 3.05]} b={[-2.4 + i * 0.7, 0, FACADE]} stroke={C.paveLine} w={2}/>)}
      <Poly ps={faceY(-3, 14, 2.8, 3.05, 0)} fill={C.kerb}/>
      <Poly ps={faceZ(-3, 14, -0.15, 0, 2.8)} fill={C.kerbFace}/>
      {[3, 6, 9, 12].map(x => <Poly key={x} ps={faceY(x, x + 1.4, 1.5, 1.62, -0.15)} fill={C.cream} opacity={0.3}/>)}
      <Poly ps={circleY(5.8, 2.0, 0.75, -0.15)} fill="#34365c"/>

      {/* Lamp: light pool, cone, post on the facade line, arm over the pavement */}
      <polygon points={pool.map(p => p.join(',')).join(' ')} fill={C.warm} opacity={0.13}/>
      <polygon points={`${head[0] - 14},${head[1]} ${head[0] + 14},${head[1]} ${poolR[0]},${poolR[1]} ${poolL[0]},${poolL[1]}`} fill={C.warm} opacity={0.07}/>
      <Poly ps={faceZ(3.24, 3.36, 0, 4.6, 7.3)} fill={C.ink}/>
      <Poly ps={[[3.28, 4.5, 7.3], [3.32, 4.5, 7.3], [3.32, 4.56, 6.0], [3.28, 4.56, 6.0]]} fill={C.ink}/>
      <Line a={[3.3, 4.5, 6.0]} b={[3.3, 4.45, 6.0]} stroke={C.ink} w={18}/>
      <circle cx={head[0]} cy={head[1]} r={9} fill={C.warm}/><circle cx={head[0]} cy={head[1]} r={40} fill={C.warm} opacity={0.2}/>

      {/* Cast shadows of the cart and people (one opacity per group so overlaps do not stack) */}
      <g opacity={0.24}>{boxFaces.map((f, i) => <Poly key={i} ps={f.map(j => cartBox[j])} fill="#000"/>)}</g>
      <PersonShadow at={VENDOR} h={1.6}/>
      <PersonShadow at={CUSTOMER} h={1.7}/>

      {/* Cart: back poles, canopy underside, body faces, counter, case, pot, wheels, front poles, valance, bulb */}
      {[1.22, 2.78].map(x => <Poly key={x} ps={faceZ(x - 0.02, x + 0.02, 0.97, 2.1, 4.98)} fill={C.ink}/>)}
      <Poly ps={faceY(1.0, 3.0, 4.1, 5.2, 2.1)} fill={C.creamDark}/>
      <Poly ps={faceX(4.3, 5.0, 0.3, 0.92, 1.2)} fill={C.redSide}/>
      <Poly ps={faceZ(1.2, 2.8, 0.3, 0.92, 4.3)} fill={C.red}/>
      <Poly ps={faceZ(1.2, 2.8, 0.3, 0.38, 4.29)} fill={C.redDark}/>
      <Poly ps={faceZ(1.2, 2.8, 0.8, 0.84, 4.29)} fill={C.cream} opacity={0.85}/>
      <text transform={onPlane([1.2, 0.47, 4.28], [1, 0, 0], [0, 1, 0])} x={0.8} fontSize={0.25} textAnchor="middle" fill={C.cream} style={thai}>ก๋วยเตี๋ยว</text>
      <Poly ps={faceY(1.15, 2.85, 4.25, 5.05, 0.97)} fill={C.cream}/>
      <Poly ps={faceZ(1.15, 2.85, 0.92, 0.97, 4.25)} fill={C.creamDark}/>
      <Poly ps={faceX(4.25, 5.05, 0.92, 0.97, 1.15)} fill={C.creamDark}/>
      {[1.06, 1.18, 1.3].map((y, row) => Array.from({length: row === 1 ? 3 : 5}, (_, i) => {
        const x = row === 1 ? 2.12 + i * 0.22 : 2.08 + i * 0.14, p = P([x, y, 4.75]);
        return <ellipse key={`${row}${i}`} cx={p[0]} cy={p[1]} rx={(row === 1 ? 0.08 : row === 0 ? 0.055 : 0.04) * cartS} ry={(row === 1 ? 0.035 : row === 0 ? 0.05 : 0.038) * cartS} fill={row === 0 ? C.cream : row === 1 ? C.green : '#b98a6a'}/>;
      }))}
      <Poly ps={faceY(2.0, 2.72, 4.5, 4.95, 1.37)} fill="#bcd3e0" opacity={0.18}/>
      <Poly ps={faceX(4.5, 4.95, 0.97, 1.37, 2.0)} fill="#bcd3e0" opacity={0.22}/>
      <Poly ps={faceZ(2.0, 2.72, 0.97, 1.37, 4.5)} fill="#bcd3e0" opacity={0.2}/>
      {([[[2.0, 1.37, 4.5], [2.72, 1.37, 4.5]], [[2.0, 0.97, 4.5], [2.0, 1.37, 4.5]], [[2.72, 0.97, 4.5], [2.72, 1.37, 4.5]], [[2.0, 1.37, 4.5], [2.0, 1.37, 4.95]], [[2.0, 1.37, 4.95], [2.72, 1.37, 4.95]], [[2.72, 1.37, 4.5], [2.72, 1.37, 4.95]]] as [V3, V3][]).map(([a, b], i) => <Line key={i} a={a} b={b} stroke={C.ink} w={5}/>)}
      <Cylinder x={1.45} z={4.68} r={0.16} y0={0.97} y1={1.24} body={C.steel} top={C.steelLight} inner="#6f7590"/>
      <Line a={ladleTop} b={[ladleTop[0] + 0.02, 1.12, ladleTop[2]]} stroke={C.steelLight} w={0.014 * cartS}/>
      {[0, 1, 2, 3].map(i => { const t = steam(i); return <circle key={i} cx={potTop[0] + Math.sin(t * 6 + i) * 16} cy={potTop[1] - 10 - t * 200} r={18 + t * 28} fill="#fff" opacity={0.15 * (1 - t)}/>; })}
      {[1.55, 2.45].map(x => <g key={x}>
        <Poly ps={circleZ(x, 0.21, 0.21, 4.27)} fill={C.ink}/>
        <Poly ps={circleZ(x, 0.21, 0.13, 4.26)} fill="#2c2a44"/>
        <Poly ps={circleZ(x, 0.21, 0.05, 4.25)} fill={C.steel}/>
      </g>)}
      {[1.22, 2.78].map(x => <Poly key={x} ps={faceZ(x - 0.02, x + 0.02, 0.97, 2.1, 4.32)} fill={C.ink}/>)}
      {Array.from({length: 10}, (_, i) => { const x = 1.0 + i * 0.2; return <g key={i} fill={i % 2 ? C.red : C.cream}>
        <Poly ps={faceZ(x, x + 0.2, 1.96, 2.12, 4.1)} fill={i % 2 ? C.red : C.cream}/>
        <polygon points={pts(Array.from({length: 13}, (_, j) => { const a = (j / 12) * Math.PI; return [x + 0.1 + Math.cos(a) * 0.1, 1.96 - Math.sin(a) * 0.1, 4.1] as V3; }))}/>
      </g>; })}
      {Array.from({length: 5}, (_, i) => { const z = 4.1 + i * 0.22; return <g key={i} fill={i % 2 ? C.cream : C.red}>
        <Poly ps={faceX(z, z + 0.22, 1.96, 2.12, 1.0)} fill={shade(i % 2 ? C.cream : C.red, 0.85)}/>
        <polygon points={pts(Array.from({length: 13}, (_, j) => { const a = (j / 12) * Math.PI; return [1.0, 1.96 - Math.sin(a) * 0.11, z + 0.11 + Math.cos(a) * 0.11] as V3; }))} fill={shade(i % 2 ? C.cream : C.red, 0.85)}/>
      </g>; })}
      <Poly ps={faceZ(1.0, 3.0, 2.1, 2.16, 4.1)} fill={C.redDark}/>
      <g transform={`rotate(${bulbDeg} ${bulbPivot[0]} ${bulbPivot[1]})`}>
        <line x1={bulbPivot[0]} y1={bulbPivot[1]} x2={bulbAt[0]} y2={bulbAt[1]} stroke={C.ink} strokeWidth={4}/>
        <circle cx={bulbAt[0]} cy={bulbAt[1] + 10} r={11} fill={C.warm}/><circle cx={bulbAt[0]} cy={bulbAt[1] + 10} r={44} fill={C.warm} opacity={0.22}/>
      </g>

      {/* Vendor: stirs with the near hand (IK to the ladle), far hand on the counter */}
      <Person at={VENDOR} h={1.6} look={1} female bun shirt={C.teal} pants={C.navy} apron={C.cream}
        nearHand={toLocal(VENDOR, ladleTop)} farHand={toLocal(VENDOR, [1.25, 1.0, 4.42])} blink={frame >= 28 && frame < 32}/>

      {/* Customer behind a folding table: bowl in the far hand, chopsticks in the near hand */}
      <Person at={CUSTOMER} h={1.7} look={-1} shirt={C.mustard} pants={C.brown} mouth="o" blink={frame >= 66 && frame < 70}
        nearHand={chopHand} farHand={[bowl[0] + 0.02, bowl[1] + 0.02]}
        held={<g>
          {[0, 1].map(i => { const t = steam(i + 5); return <circle key={i} cx={bowl[0] + Math.sin(t * 5 + i) * 0.04} cy={bowl[1] - 0.05 - t * 0.45} r={0.04 + t * 0.07} fill="#fff" opacity={0.14 * (1 - t)}/>; })}
          <path d={`M${bowl[0] - 0.085} ${bowl[1] - 0.04} h0.17 a0.085 0.07 0 0 1 -0.17 0 z`} fill="#f3efe6"/>
          <ellipse cx={bowl[0]} cy={bowl[1] - 0.04} rx={0.085} ry={0.018} fill="#e2d3b0"/>
          <rect x={bowl[0] - 0.088} y={bowl[1] - 0.045} width={0.176} height={0.012} rx={0.006} fill="#5c7fb8"/>
          {lift > 0.12 && [0, 1, 2].map(i => <path key={i} d={`M${tip[0] - 0.01 + i * 0.01} ${tip[1]} Q${tip[0] - 0.02 + i * 0.02} ${(tip[1] + bowl[1]) / 2} ${bowl[0] + 0.02 - i * 0.02} ${bowl[1] - 0.04}`} fill="none" stroke={C.cream} strokeWidth={0.008}/>)}
        </g>}
        inHand={<path d={`M${chopHand[0]} ${chopHand[1] - 0.01} L${tip[0]} ${tip[1]} M${chopHand[0] + 0.012} ${chopHand[1] + 0.01} L${tip[0] + 0.012} ${tip[1] + 0.006}`} stroke={C.cream} strokeWidth={0.009} strokeLinecap="round"/>}/>
      {cust.s > 0 && <g>
        <Poly ps={faceY(3.05, 3.65, 3.45, 4.0, 0.72)} fill={C.steelLight}/>
        <Poly ps={faceZ(3.05, 3.65, 0.69, 0.72, 3.45)} fill={C.steel}/>
        <Line a={[3.1, 0.69, 3.47]} b={[3.6, 0, 3.47]} stroke={C.steel} w={6} opacity={0.8}/>
        <Line a={[3.6, 0.69, 3.47]} b={[3.1, 0, 3.47]} stroke={C.steel} w={6} opacity={0.8}/>
        <Cylinder x={3.18} z={3.62} r={0.035} y0={0.72} y1={0.83} body="#c4553f" top="#d9775f"/>
        <Cylinder x={3.28} z={3.7} r={0.03} y0={0.72} y1={0.86} body="#8fae6a" top="#a9c584"/>
      </g>}

      {/* Cat in the foreground, sitting on the pavement */}
      <g transform={`translate(${P([0.8, 0, 3.2])[0] - 226 * 0.6} ${P([0.8, 0, 3.2])[1] - 1474 * 0.6}) scale(0.6)`}>
        <ellipse cx={226} cy={1474} rx={58} ry={10} fill="#000" opacity={0.25}/>
        <path d={`M252 1460 q52 4 ${46 + sway} -46`} fill="none" stroke={C.cat} strokeWidth={13} strokeLinecap="round"/>
        <ellipse cx={220} cy={1428} rx={36} ry={46} fill={C.cat}/>
        <circle cx={228} cy={1366} r={29} fill={C.cat}/>
        <polygon points="204,1352 210,1318 228,1342" fill={C.cat}/><polygon points="232,1342 250,1318 254,1352" fill={C.cat}/>
        <circle cx={222} cy={1364} r={3.4} fill={C.ink}/><circle cx={242} cy={1364} r={3.4} fill={C.ink}/>
        <ellipse cx={222} cy={1444} rx={16} ry={24} fill="#f0d2ad"/>
      </g>

      {/* Vignette and grain */}
      <rect width={1080} height={1920} fill="url(#lfv-vignette)"/>
      {Array.from({length: 1500}, (_, i) => <circle key={i} cx={random(`gx${i}`) * 1080} cy={random(`gy${i}`) * 1920} r={0.9 + random(`gr${i}`) * 1.5} fill={i % 3 ? '#fff' : '#000'} opacity={0.08 + random(`go${i}`) * 0.14}/>)}
    </svg>
  </AbsoluteFill>;
};
