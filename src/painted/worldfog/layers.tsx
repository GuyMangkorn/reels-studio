import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {GLOW_PEAK} from '../glow';
import {hash} from '../hash';
import {lerp, type Pt} from '../painter';
import {fieldFrame, type AsmPose, type Part} from './assembly';
import {FOG, LAMPS} from './outside';
import {ease, lampAt, smoothstep, type Proj, type V3} from './space';

// Remotion layers of the WFOG plates (brief VD01, VD06, VD07, VD17): lamp halos, the warm outer rim of the dark mass,
// the FW-B fog veil, torch beams, glass condensation, the CAM-GLASS-OUT foreground architecture (SVG Overlay through
// CameraLayer, window plates with no inside actor nearer than the glass), screen grade and paper grain. Every glow
// opacity stays at or under GLOW_PEAK 0.3 (production lighting rule). Promoted from the spike `WfogShop.tsx`.

const pts = (q: Pt[]) => q.map((v) => v.join(',')).join(' ');

/** Canopy lamp halos (screen blend), each scaled by its S04-SH03 level. */
/** Lamp halos. `haze` (default on) is the broad warm haze over the sky; the clear front-mode plates turn it off. */
/** Lamp halos at story frame G; `ambient` is the continuous clock of the shimmer (SS-R5.1: G when unheld). */
export const Halos = ({proj, G, haze = true, ambient = G}: {proj: Proj; G: number; haze?: boolean; ambient?: number}) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={GLOW_PEAK} />
          <stop offset="0.25" stopColor="#ffc98a" stopOpacity={GLOW_PEAK * 0.45} />
          <stop offset="1" stopColor="#ffb870" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}s`}>
          <stop offset="0" stopColor="#f0d9b0" stopOpacity={0.12} />
          <stop offset="1" stopColor="#f0d9b0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}r`}>
          <stop offset="0" stopColor="#ffcf90" stopOpacity={0.14} />
          <stop offset="1" stopColor="#ffcf90" stopOpacity={0} />
        </radialGradient>
      </defs>
      {haze && <ellipse cx={540} cy={260 + ((proj.setup?.yh ?? 700) - 700)} rx={760} ry={420} fill={`url(#${id}s)`} opacity={Math.max(...LAMPS.map((_, i) => lampAt(G, i)))} />}
      {LAMPS.map((l, i) => {
        const lv = lampAt(G, i);
        if (lv <= 0 || proj.rawDepth(l) < 0.5) return null;
        const [x, y] = proj.P(l), r = (i < 2 ? 2.4 : 2.0) * proj.k(l) * (1 + 0.04 * Math.sin((ambient / 30) * 0.6 + i));
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.78} fill={`url(#${id}h)`} opacity={lv} />;
      })}
      {LAMPS.slice(2).map((l, i) => {
        const lv = lampAt(G, i + 2);
        if (lv <= 0 || proj.rawDepth(l) < 0.5) return null;
        const [x] = proj.P(l), y = proj.P([l[0], -l[1], l[2]])[1];
        return <ellipse key={`r${i}`} cx={x} cy={y - 60} rx={34} ry={110} fill={`url(#${id}r)`} opacity={lv} />;
      })}
    </>
  );
};

/** Thin warm outer rim from the canopy lamps behind (VD03/VD05): the outline band of the merged mass, top-weighted. */
export const Rim = ({parts}: {parts: Part[]}) => {
  const id = useId();
  const outline = parts.filter((x) => !x.inner);
  const ys = outline.flatMap((x) => x.pts.map((q) => q[1]));
  const top = Math.min(...ys), bottom = Math.max(...ys);
  return (
    <>
      <defs>
        <filter id={`${id}f`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius={2.4} result="er" />
          <feComposite in="SourceAlpha" in2="er" operator="out" result="band" />
          <feGaussianBlur in="band" stdDeviation={0.8} result="soft" />
          <feFlood floodColor="#ffe0a8" result="c" />
          <feComposite in="c" in2="soft" operator="in" />
        </filter>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1={top} x2="0" y2={bottom}>
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.1} />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-200} y={-300} width={1500} height={2600}>
          <rect x={-200} y={-300} width={1500} height={2600} fill={`url(#${id}g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}m)`}>
        <g filter={`url(#${id}f)`}>
          {outline.map((x, i) => <polygon key={i} points={pts(x.pts)} fill="#000" stroke="#000" strokeWidth={3} strokeLinejoin="round" />)}
        </g>
      </g>
    </>
  );
};

/** Fixed veil-patch field per camera setup, PLATE px at camera scale 1. */
export const VEIL_BOX = {'CAM-GLASS-OUT': {x0: 330, y0: 380, x1: 850, y1: 1060}};
const VEIL = {n: 6, fadeIn: 0.18, fadeOut: 0.18, rMin: 55, rMax: 105, vyMin: 14, vyMax: 32, vx: 20};

/** Veil patches at story frame G: centre, radius, envelope (0..1) and cycle index; pure function of G. */
export const veilPatches = (G: number, box = VEIL_BOX['CAM-GLASS-OUT']) => {
  const t = G / 30, w = box.x1 - box.x0, h = box.y1 - box.y0;
  return Array.from({length: VEIL.n}, (_, i) => {
    const vy = VEIL.vyMin + (VEIL.vyMax - VEIL.vyMin) * hash(i + 910);
    const T = h / vy;
    const pos = t / T + hash(i + 930);
    const n = Math.floor(pos), u = pos - n;
    const vx = (hash(i * 31 + n * 7 + 900) - 0.5) * 2 * VEIL.vx;
    const sx = (((w * hash(i * 31 + n * 7 + 920) + vx * u * T) % (2 * w)) + 2 * w) % (2 * w);
    const px = box.x0 + (sx <= w ? sx : 2 * w - sx);
    const py = box.y1 - u * h;
    const env = smoothstep(0, VEIL.fadeIn, u) * (1 - smoothstep(1 - VEIL.fadeOut, 1, u));
    return {px, py, r: VEIL.rMin + (VEIL.rMax - VEIL.rMin) * hash(i * 31 + n * 7 + 940), env, cycle: n, u};
  });
};

/**
 * VD17 FW-B veil (brief fog-lens illusion): a fog-coloured band straddling the merged outline (dilate 9 / erode 7 px,
 * blur 5) shown through drifting patches in a box fixed per setup (fade-in/out envelope per pass, no wrap pop) and
 * weighted like FW-A (height smoothstep 0.30-0.75, none within 15-70 px of the umbrella tip). Opacity 0.75 A. Window
 * plates with no inside actor only (VD07).
 */
export const FogVeil = ({proj, parts, pose}: {proj: Proj; parts: Part[]; pose: AsmPose}) => {
  const id = useId();
  const amp = pose.warp;
  if (amp <= 0) return null;
  const outline = parts.filter((x) => !x.inner);
  const patches = veilPatches(pose.g);
  const {yG, H, tip: [tx, ty]} = fieldFrame(proj, pose.S, pose.umbrella.tip);
  const yAt = (h: number) => yG - h * H;
  const hs = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
  const ds = [0, 0.2, 0.4, 0.6, 0.8, 1];
  return (
    <>
      <defs>
        <filter id={`${id}v`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius={9} result="d" />
          <feMorphology in="SourceAlpha" operator="erode" radius={7} result="e" />
          <feComposite in="d" in2="e" operator="out" result="band" />
          <feGaussianBlur in="band" stdDeviation={5} result="soft" />
          <feFlood floodColor={FOG.veil} result="c" />
          <feComposite in="c" in2="soft" operator="in" />
        </filter>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <linearGradient id={`${id}h`} gradientUnits="userSpaceOnUse" x1="0" y1={yAt(0.3)} x2="0" y2={yAt(0.75)}>
          {hs.map((u) => <stop key={u} offset={u} stopColor="#fff" stopOpacity={ease(u)} />)}
        </linearGradient>
        <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={tx} cy={ty} r={70}>
          <stop offset={0} stopColor="#000" stopOpacity={1} />
          {ds.map((u) => <stop key={u} offset={(15 + 55 * u) / 70} stopColor="#000" stopOpacity={1 - ease(u)} />)}
        </radialGradient>
        <mask id={`${id}w`} maskUnits="userSpaceOnUse" x={-200} y={-300} width={1500} height={2600}>
          <rect x={-200} y={-300} width={1500} height={2600} fill={`url(#${id}h)`} />
          <circle cx={tx} cy={ty} r={70} fill={`url(#${id}t)`} />
        </mask>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-200} y={-300} width={1500} height={2600}>
          <g filter={`url(#${id}b)`}>
            {patches.map((q, i) => (q.env > 0 ? <ellipse key={i} cx={q.px} cy={q.py} rx={q.r} ry={q.r * 0.7} fill="#fff" fillOpacity={q.env} /> : null))}
          </g>
        </mask>
      </defs>
      <g mask={`url(#${id}w)`}>
        <g mask={`url(#${id}m)`} opacity={0.75 * amp}>
          <g filter={`url(#${id}v)`}>
            {outline.map((x, i) => <polygon key={i} points={pts(x.pts)} fill="#000" />)}
          </g>
        </g>
      </g>
    </>
  );
};

/**
 * Warm torch cone + spot in plate coordinates (screen blend): from `from` toward `to`, spot radius `r`. Opacities stay
 * under GLOW_PEAK; `level` 0..1 scales them (switch, sweep).
 */
export const Beam = ({from, to, level, r = 300, w0 = 40, w1 = 330, reach = 1.25}: {from: Pt; to: Pt; level: number; r?: number; w0?: number; w1?: number; reach?: number}) => {
  const id = useId();
  if (level <= 0) return null;
  const [sx, sy] = from, [cx, cy] = to;
  const ang = Math.atan2(cy - sy, cx - sx), len = Math.hypot(cx - sx, cy - sy) * reach;
  const n = [-Math.sin(ang), Math.cos(ang)], e = [sx + Math.cos(ang) * len, sy + Math.sin(ang) * len];
  const cone: Pt[] = [[sx + n[0] * w0, sy + n[1] * w0], [e[0] + n[0] * w1, e[1] + n[1] * w1], [e[0] - n[0] * w1, e[1] - n[1] * w1], [sx - n[0] * w0, sy - n[1] * w0]];
  return (
    <>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={sx} y1={sy} x2={e[0]} y2={e[1]}>
          <stop offset="0" stopColor="#ffe2b0" stopOpacity={0.26 * level} />
          <stop offset="0.7" stopColor="#ffd296" stopOpacity={0.14 * level} />
          <stop offset="1" stopColor="#ffd296" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}s`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r}>
          <stop offset="0" stopColor="#ffe6bc" stopOpacity={GLOW_PEAK * level} />
          <stop offset="1" stopColor="#ffe6bc" stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={28} />
        </filter>
      </defs>
      <polygon points={pts(cone)} fill={`url(#${id}c)`} filter={`url(#${id}b)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}s)`} />
    </>
  );
};

/** Small hot lens glow of a held torch (screen blend, <= GLOW_PEAK), plus an optional warm pool on the floor. */
export const LensGlow = ({at, r, level, pool}: {at: Pt; r: number; level: number; pool?: {c: Pt; rx: number; ry: number}}) => {
  const id = useId();
  if (level <= 0) return null;
  return (
    <>
      <defs>
        <radialGradient id={`${id}l`}>
          <stop offset="0" stopColor="#fff1cf" stopOpacity={GLOW_PEAK * level} />
          <stop offset="0.3" stopColor="#ffd9a0" stopOpacity={GLOW_PEAK * 0.5 * level} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={at[0]} cy={at[1]} r={r} fill={`url(#${id}l)`} />
      {pool && <ellipse cx={pool.c[0]} cy={pool.c[1]} rx={pool.rx} ry={pool.ry} fill={`url(#${id}l)`} opacity={0.8} />}
    </>
  );
};

/** Outside condensation beads and a faint interior reflection on the glass (normal blend, low opacity). */
/** The pane sheen (`sheen` 1 = the window default; S03-SH06 uses 0 so the jammed caster's core stays near-black). */
export const Glass = ({proj, sheen = 1}: {proj: Proj; sheen?: number}) => {
  const id = useId();
  const gb = proj.P([0, 0.05, 0])[1];
  return (
    <>
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1="0" y1={gb} x2="0" y2={gb - 320}>
          <stop offset="0" stopColor="#cfd8d6" stopOpacity={0.2 * sheen} />
          <stop offset="1" stopColor="#cfd8d6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-200} y={gb - 320} width={1500} height={320} fill={`url(#${id}c)`} />
      {Array.from({length: 45}, (_, i) => {
        const x = -60 + hash(i * 3 + 1) * 1200, y = 160 + hash(i * 3 + 2) ** 0.5 * (gb - 170), r = 1.4 + hash(i * 3 + 3) * 2.6;
        return (
          <g key={i} opacity={0.5}>
            <circle cx={x} cy={y} r={r} fill="#dfe7e5" opacity={0.35} />
            <path d={`M${x - r * 0.8} ${y + r * 0.3} A ${r} ${r} 0 0 0 ${x + r * 0.8} ${y + r * 0.3}`} stroke="#2a3132" strokeWidth={0.9} fill="none" opacity={0.45} />
          </g>
        );
      })}
      {[0, 1].map((i) => {
        const x = 160 + hash(i + 91) * 760, y0 = 700 + hash(i + 93) * 300, y1 = y0 + 90 + hash(i + 95) * 120;
        return <path key={`d${i}`} d={`M${x} ${y0} q 5 ${(y1 - y0) / 3} -2 ${(y1 - y0) / 2} t 2 ${(y1 - y0) / 2}`} stroke="#d5dddb" strokeWidth={1.2} opacity={0.12} fill="none" />;
      })}
      <rect x={-200} y={proj.P([0, 2.38, 0])[1]} width={1500} height={5} fill="#e8f0ef" opacity={0.05} />
      <rect x={-200} y={proj.P([0, 2.3, 0])[1]} width={1500} height={3} fill="#e8f0ef" opacity={0.04} />
    </>
  );
};

/**
 * Foreground architecture for CAM-GLASS-OUT (VD07): wall, head rail, door jambs, transom, the closed sliding leaf with
 * its pull handle, sill, polished floor with the panes mirrored, and the window-shelf end; solid SVG through
 * CameraLayer, a turbulence displacement gives hand-cut edges.
 */
export const Architecture = ({proj}: {proj: Proj}) => {
  const id = useId();
  const FRAME = '#1d2223', EDGE = '#0c0f10', LEAF = '#262c2d';
  const poly = (q: V3[]) => q.map((v) => proj.P(v).join(',')).join(' ');
  const quad = (x0: number, y0: number, x1: number, y1: number, z = 0): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
  const tileX = [-1.5, -1.1, -0.7, -0.3, 0.1, 0.5, 0.9, 1.3];
  const tileZ = [-0.35, -0.75, -1.15];
  return (
    <>
      <defs>
        <filter id={`${id}e`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}b`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1="0" y1={proj.P([0, -0.05, 0])[1]} x2="0" y2={proj.P([0, -0.9, 0])[1]}>
          <stop offset="0" stopColor="#a9b2ad" stopOpacity={1} />
          <stop offset="1" stopColor="#a9b2ad" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1="0" y1={proj.P([0, 0, 0])[1]} x2="0" y2={proj.P([0, 0, -1.6])[1]}>
          <stop offset="0" stopColor="#3b4544" />
          <stop offset="0.25" stopColor="#252c2d" />
          <stop offset="1" stopColor="#141819" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}e)`}>
        <polygon points={poly([[-4, 0, 0], [4, 0, 0], [4, 0, -1.7], [-4, 0, -1.7]])} fill={`url(#${id}f)`} />
        <g filter={`url(#${id}b)`} opacity={0.22}>
          {[[-1.2, -0.54], [-0.46, 0.46], [0.54, 1.2]].map(([x0, x1]) => <polygon key={x0} points={poly([[x0, -0.05, 0], [x1, -0.05, 0], [x1, -0.9, 0], [x0, -0.9, 0]])} fill={`url(#${id}r)`} />)}
        </g>
        {tileX.map((x) => <line key={`tx${x}`} x1={proj.P([x, 0, 0])[0]} y1={proj.P([x, 0, 0])[1]} x2={proj.P([x, 0, -1.7])[0]} y2={proj.P([x, 0, -1.7])[1]} stroke={EDGE} strokeWidth={2} opacity={0.22} />)}
        {tileZ.map((z) => <line key={`tz${z}`} x1={-200} y1={proj.P([0, 0, z])[1]} x2={1300} y2={proj.P([0, 0, z])[1]} stroke={EDGE} strokeWidth={2} opacity={0.22} />)}
        <polygon points={poly([[-0.6, 0, -0.04], [0.6, 0, -0.04], [0.6, 0, -0.07], [-0.6, 0, -0.07]])} fill="#3e4646" />
        <polygon points={poly([[-4, 2.5, 0], [4, 2.5, 0], [4, 4, 0], [-4, 4, 0]])} fill={FRAME} />
        <polygon points={poly(quad(-4, 2.44, 4, 2.5))} fill="#2a3031" stroke={EDGE} strokeWidth={4} />
        <polygon points={poly(quad(-4, 2.08, 4, 2.16))} fill={FRAME} stroke={EDGE} strokeWidth={4} />
        <polygon points={poly(quad(-4, 0, 4, 0.05))} fill={FRAME} stroke={EDGE} strokeWidth={3} />
        {[-0.5, 0.5].map((x) => (
          <g key={x}>
            <polygon points={poly(quad(x - 0.04, 0, x + 0.04, 2.5))} fill={FRAME} stroke={EDGE} strokeWidth={4} />
            <polygon points={poly(quad(x + (x < 0 ? 0.034 : -0.04), 0.05, x + (x < 0 ? 0.04 : -0.034), 2.44))} fill="#56605f" opacity={0.7} />
          </g>
        ))}
        <polygon points={poly(quad(-0.52, 0.05, -0.47, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(0.47, 0.05, 0.52, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 2.0, 0.52, 2.06, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 0.05, 0.52, 0.17, -0.05))} fill={LEAF} stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.52, 0.165, 0.52, 0.17, -0.05))} fill="#4c5655" opacity={0.6} />
        <polygon points={poly(quad(-0.455, 0.8, -0.43, 1.22, -0.1))} fill="#323a3b" stroke={EDGE} strokeWidth={3} />
        <polygon points={poly(quad(-0.452, 0.82, -0.447, 1.2, -0.1))} fill="#6a7675" opacity={0.8} />
        {[0.85, 1.17].map((y) => <polygon key={y} points={poly([[-0.445, y, -0.1], [-0.44, y, -0.05], [-0.44, y + 0.02, -0.05], [-0.445, y + 0.02, -0.1]])} fill={EDGE} />)}
        <polygon points={poly([[-0.7, 0, -0.5], [-0.7, 1.1, -0.5], [-0.7, 1.1, -0.9], [-0.7, 0, -0.9]])} fill="#202627" stroke={EDGE} strokeWidth={3} />
        <polygon points={poly([[-2.6, 1.1, -0.9], [-0.7, 1.1, -0.9], [-0.7, 1.1, -0.5], [-2.6, 1.1, -0.5]])} fill="#2b3233" />
        {[[-0.78, 0.16, 0.2], [-0.98, 0.2, 0.26], [-1.2, 0.18, 0.22]].map(([x, w, h], i) => (
          <polygon key={i} points={poly([[x - w, 1.1, -0.7], [x, 1.1, -0.7], [x - 0.01, 1.1 + h, -0.7], [x - w + 0.015, 1.1 + h * 0.96, -0.7]])} fill="#181c1d" />
        ))}
      </g>
    </>
  );
};

/** Screen-space grade: cool, darker corners (vignette) so the eye stays on the subject. */
export const Grade = ({strength = 0.38, at = '52% 40%'}: {strength?: number; at?: string}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 75% 60% at ${at}, rgba(8,12,14,0) 55%, rgba(8,12,14,${strength}) 100%)`}} />
);

/**
 * VD18 interior air (screen space, above the canvas, under captions): the floor falls off toward the bottom edge and
 * the ceiling toward the top, so the eye settles on the faces and the caption band sits on a dark ground. `floorFrom` is
 * the frame fraction where the floor falloff starts.
 */
export const InteriorAir = ({floorFrom = 0.6, floor = 0.42, top = 0.3, pool}: {floorFrom?: number; floor?: number; top?: number;
  /** Tube-light pool (screen blend, frame px): centre, radii and peak opacity (kept at or under GLOW_PEAK 0.3). */
  pool?: {x: number; y: number; rx: number; ry: number; a: number}}) => (
  <>
    {pool && <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', background: `radial-gradient(ellipse ${pool.rx}px ${pool.ry}px at ${pool.x}px ${pool.y}px, rgba(214,224,219,${Math.min(pool.a, 0.3)}) 0%, rgba(214,224,219,0) 100%)`}} />}
    <AbsoluteFill style={{pointerEvents: 'none', background: `linear-gradient(to bottom, rgba(6,9,10,${top}) 0%, rgba(6,9,10,0) 14%, rgba(6,9,10,0) ${floorFrom * 100}%, rgba(6,9,10,${floor}) 100%)`}} />
  </>
);

/** Paper grain over the whole picture so painted and SVG layers share one surface. */
export const Grain = ({opacity = 0.09}: {opacity?: number}) => {
  const id = useId();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

export {lerp};
