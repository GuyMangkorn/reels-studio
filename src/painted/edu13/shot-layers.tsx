import {Img, staticFile, useCurrentFrame} from 'remotion';
import {seg} from '../kit/motions';
import {camPoint} from '../kit/ycam';
import {OX} from './room';
import {ICON_AT, iconAt14, paintSH03, paintSH05, paintSH13, paintSH14, shotCamera} from './shots';
import {Painted, stroke, Text} from './look';

// EDU-EP13-SHORT timed shots, group 1 (W5.2): React wrappers of shots.ts. One component = one timeline scene (scene ID = shot ID); the local frame
// is `useCurrentFrame()`, so Editor mounts each in a Sequence at its G start. Screen layers here are the sheets' DOM layers (ring marker, slingshot
// icon, "?", truth band, tag, trailer inset). No captions, voice, channel mark or sound: Editor owns those.

const INK = '#1d2129';
/** Pop curve: 0 -> 1.1 -> 1 over `n` frames from `at` (scale 0 before). */
const pop = (l: number, at: number, n = 6) => { const u = (l - at) / n; return u < 0 ? 0 : u >= 1 ? 1 : u < 0.6 ? 1.1 * (u / 0.6) : 1.1 - 0.1 * ((u - 0.6) / 0.4); };

/** The slingshot icon (N10, "the B04 drawing"): a wooden Y-fork with a coral elastic and a pebble in the pouch. `grey` 0..1 desaturates it (R10: it stays on, never crossed out). */
export const SlingIcon = ({x, y, size, grey = 0, scale = 1}: {x: number; y: number; size: number; grey?: number; scale?: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${scale})`, filter: `grayscale(${grey}) ${grey > 0 ? `brightness(${1 - 0.1 * grey})` : ''}`, overflow: 'visible'}}>
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M50 94 L50 56 L24 16 M50 56 L76 16" stroke={INK} strokeWidth={17} />
      <path d="M50 94 L50 56 L24 16 M50 56 L76 16" stroke="#b9824f" strokeWidth={10} />
      <path d="M24 16 Q50 74 76 16" stroke={INK} strokeWidth={9} />
      <path d="M24 16 Q50 74 76 16" stroke="#ec8f78" strokeWidth={4.5} />
    </g>
    <circle cx={50} cy={46} r={9} fill={INK} /><circle cx={50} cy={46} r={6} fill="#d9d4c8" />
  </svg>
);

/** World anchor -> picture point at local frame l of the shot. */
const at = (id: Parameters<typeof shotCamera>[0], l: number, w: [number, number, number]) => camPoint(shotCamera(id, l), w) ?? [540, 960];

// ---- S01-B01-SH03: ring marker on the floor where the giant will stand, +0..+8 (and gone before the body is big)
export const SH03Layers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B01_SH03', l), g = camPoint(c, [OX + 1.35, 0, 0.35]), a = 1 - seg(l, 4, 8);
  if (!g || a <= 0) return null;
  const rx = 60, ry = 18;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: a}}>
      <ellipse cx={g[0]} cy={g[1]} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={12} /><ellipse cx={g[0]} cy={g[1]} rx={rx} ry={ry} fill="none" stroke="#ff5a3c" strokeWidth={6} />
    </svg>
  );
};
export const S01_B01_SH03 = () => <Painted paint={(p, f) => paintSH03(p, f)} band><SH03Layers /></Painted>;
export const S01_B01_SH05 = () => <Painted paint={(p, f) => paintSH05(p, f)} band />;

// ---- S01-B04-SH01: icon + "?" pop at +5, "?" off at +80, icon greys +80..+92 and stays; re-projected every frame
export const SH13Layers = () => {
  const l = useCurrentFrame(), q = at('S01_B04_SH01', l, ICON_AT), grey = seg(l, 80, 92);
  const s = pop(l, 5), qs = l >= 80 ? 0 : s;
  return (
    <>
      {s > 0 && <SlingIcon x={q[0]} y={q[1]} size={90} grey={grey} scale={s} />}
      {qs > 0 && <div style={{position: 'absolute', left: q[0] + 36, top: q[1] - 76, width: 40, height: 52, transform: `scale(${qs})`, fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 52, color: INK, textAlign: 'center', lineHeight: '52px'}}>?</div>}
    </>
  );
};
export const S01_B04_SH01 = () => <Painted paint={(p, f) => paintSH13(p, f)} band><SH13Layers /></Painted>;

// ---- S01-B04-SH02: truth band (fade +18..+24, out +112..+124), tag with leader (pop +24), grey icon, trailer inset +86..+112
const TRUTH_Z = 0.35;
export const TruthLayers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B04_SH02', l);
  const a = camPoint(c, [OX - 0.5, 0.1, TRUTH_Z]), b = camPoint(c, [OX + 2.42, 0.5, TRUTH_Z]), ic = camPoint(c, iconAt14(l));
  const bandA = seg(l, 18, 24) * (1 - seg(l, 112, 124)), tag = pop(l, 24, 6) * (1 - seg(l, 112, 124));
  return (
    <>
      {a && b && bandA > 0 && (
        <div style={{opacity: bandA}}>
          <div style={{position: 'absolute', left: a[0], top: b[1], width: b[0] - a[0], height: a[1] - b[1], background: 'rgba(242,217,122,0.35)', borderTop: '3px solid rgba(255,255,255,0.8)', borderBottom: '3px solid rgba(255,255,255,0.8)'}} />
          <Text x={24} y={a[1] - 68} text="หลักสิบเซน" size={40} />
        </div>
      )}
      {a && tag > 0 && (
        <>
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, tag)}}>
            <line x1={46} x2={46} y1={300} y2={b ? b[1] : 970} stroke={INK} strokeWidth={9} strokeDasharray="2 16" strokeLinecap="round" /><line x1={46} x2={46} y1={300} y2={b ? b[1] : 970} stroke="#fff" strokeWidth={4.5} strokeDasharray="2 16" strokeLinecap="round" />
          </svg>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, transform: `scale(${tag})`, transformOrigin: '540px 230px'}}><Text x={540} y={200} text="สูงพอ ๆ กัน" size={64} anchor="middle" /></div>
        </>
      )}
      {ic && <SlingIcon x={ic[0]} y={ic[1]} size={60} grey={1} />}
      <TrailerInset l={l} />
    </>
  );
};
/** The shot-6 apex frame (SH04C), tape-stopped grey, with its card inside; upper right, clear of tag, band and the actors (rows 340-600). */
export const TrailerInset = ({l}: {l: number}) => {
  if (l < 86 || l >= 112) return null;
  const s = 0.8 + 0.2 * Math.min(1, (l - 86) / 4), W = 440, H = 260;
  return (
    <div style={{position: 'absolute', left: 600, top: 340, width: W, height: H, transform: `scale(${s})`, transformOrigin: '100% 0', border: '5px solid #fff', boxShadow: `0 0 0 3px ${INK}`, overflow: 'hidden', background: '#444'}}>
      <Img src={staticFile('edu13/tr-apex-f12.png')} style={{position: 'absolute', left: 0, top: 0, width: W, filter: 'grayscale(1) contrast(0.85) brightness(0.95)'}} />
      <div lang="th" style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 34, letterSpacing: 3, color: '#fff'}}><span style={stroke}>ถ้าคิดแบบง่าย ๆ</span></div>
    </div>
  );
};
export const S01_B04_SH02 = () => <Painted paint={(p, f) => paintSH14(p, f)} band><TruthLayers /></Painted>;
