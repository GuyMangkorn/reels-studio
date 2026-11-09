import {Img, staticFile, useCurrentFrame} from 'remotion';
import {seg} from '../kit/motions';
import {camPoint} from '../kit/ycam';
import {OX} from './room';
import {AbsoluteFill} from 'remotion';
import {CAM_TR_SKY} from './scenes';
import {ARROW_AT, counterAt, DIAL_AT, drainAt, flea02At, HOP, ICON_AT, iconAt14, padPoint, paintSH01, paintSH02, paintSH03, paintSH04, paintSH05, paintSH05T, paintSH06, paintSH07, paintSH09, paintSH10, paintSH11, paintSH12, paintSH13, paintSH14, paintSH15, paintSH16, shotCamera, SKY, skyPos, SPRING, TAG10, trailAt} from './shots';
import {Lbl, Painted, ScaleBar, stroke, Text, TRAILER_VIGNETTE, TrailerCard} from './look';

// EDU-EP13-SHORT timed shots, group 1 (W5.2): React wrappers of shots.ts. One component = one timeline scene (scene ID = shot ID); the local frame
// is `useCurrentFrame()`, so Editor mounts each in a Sequence at its G start. Screen layers here are the sheets' DOM layers (ring marker, slingshot
// icon, "?", truth band, tag, trailer inset). No captions, voice, channel mark or sound: Editor owns those.

const INK = '#1d2129';
/** Pop curve: 0 -> 1.1 -> 1 over `n` frames from `at` (scale 0 before). */
const pop = (l: number, at: number, n = 6) => { const u = (l - at) / n; return u < 0 ? 0 : u >= 1 ? 1 : u < 0.6 ? 1.1 * (u / 0.6) : 1.1 - 0.1 * ((u - 0.6) / 0.4); };

/** The slingshot icon (N10, "the B04 drawing"): a wooden Y-fork with a coral elastic band pulled back to a leather pouch holding a pebble. Readable at 60 px and in grey (R10: it stays on, never crossed out):
 * a white halo under the ink, a light wood against a darker, saturated elastic (so the two grey apart), thick tips and a distinct pouch. `grey` 0..1 desaturates it. */
export const SlingIcon = ({x, y, size, grey = 0, scale = 1}: {x: number; y: number; size: number; grey?: number; scale?: number}) => {
  const fork = 'M50 95 L50 58 L22 14 M50 58 L78 14', band = 'M22 14 L50 66 L78 14';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${scale})`, filter: `grayscale(${grey}) ${grey > 0 ? `brightness(${1 - 0.08 * grey})` : ''}`, overflow: 'visible'}}>
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={fork} stroke="#fff" strokeWidth={30} opacity={0.85} /><path d={band} stroke="#fff" strokeWidth={22} opacity={0.85} />
        <path d={fork} stroke={INK} strokeWidth={22} />
        <path d={fork} stroke="#e0b077" strokeWidth={14} />
        <path d="M50 88 L50 60" stroke="#c78f55" strokeWidth={5} />
        <path d={band} stroke={INK} strokeWidth={14} />
        <path d={band} stroke="#d93f2c" strokeWidth={8.5} />
      </g>
      <circle cx={22} cy={14} r={9} fill={INK} /><circle cx={78} cy={14} r={9} fill={INK} /><circle cx={22} cy={14} r={5.5} fill="#8a5a3a" /><circle cx={78} cy={14} r={5.5} fill="#8a5a3a" />
      <ellipse cx={50} cy={66} rx={14} ry={9} fill={INK} /><ellipse cx={50} cy={66} rx={11} ry={6.5} fill="#7a4a2a" />
      <circle cx={50} cy={62} r={8.5} fill={INK} /><circle cx={50} cy={62} r={5.8} fill="#f2efe6" />
    </svg>
  );
};

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

// ======================= W5.2 asset group 2 =======================
export const S01_B01_SH01 = () => <Painted paint={(p, f) => paintSH01(p, f)} />;

// ---- S01-B02-SH01: "แรง ↑" at +11, weight dial pops at +49 (needle +49..+85, no numerals), "heavier" down-arrow pops at +60
export const SH09Layers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B02_SH01', l);
  const d = camPoint(c, DIAL_AT), ar = camPoint(c, ARROW_AT), lab = camPoint(c, [0.95, 0.95, 0.35]);
  const ds = pop(l, 49, 6), as = pop(l, 60, 6), ls = pop(l, 11, 6), swing = seg(l, 49, 85), ang = -65 + 130 * swing * swing * (3 - 2 * swing), R = 70;
  return (
    <>
      {lab && ls > 0 && <div style={{position: 'absolute', left: 0, top: 0, width: 1080, transform: `scale(${ls})`, transformOrigin: `${lab[0]}px ${lab[1]}px`}}><Text x={Math.max(24, lab[0] - 40)} y={lab[1] - 30} text="แรง ↑" size={54} /></div>}
      {d && ds > 0 && (
        <svg width={220} height={170} style={{position: 'absolute', left: d[0] - 110, top: d[1] - 110, transform: `scale(${ds})`, transformOrigin: '110px 110px', overflow: 'visible'}}>
          <g transform="translate(110 110)" strokeLinecap="round" fill="none">
            <path d={`M${-R} 0 A${R} ${R} 0 0 1 ${R} 0`} stroke="#fff" strokeWidth={30} /><path d={`M${-R} 0 A${R} ${R} 0 0 1 ${R} 0`} stroke={INK} strokeWidth={24} />
            <path d={`M${-R} 0 A${R} ${R} 0 0 1 ${-R * 0.35} ${-R * 0.94}`} stroke="#8fd6a8" strokeWidth={14} /><path d={`M${-R * 0.35} ${-R * 0.94} A${R} ${R} 0 0 1 ${R * 0.35} ${-R * 0.94}`} stroke="#f2d97a" strokeWidth={14} /><path d={`M${R * 0.35} ${-R * 0.94} A${R} ${R} 0 0 1 ${R} 0`} stroke="#ec8f78" strokeWidth={14} />
            <g transform={`rotate(${ang})`}><line x1={0} y1={0} x2={0} y2={-R + 6} stroke="#fff" strokeWidth={13} /><line x1={0} y1={0} x2={0} y2={-R + 6} stroke={INK} strokeWidth={8} /></g>
            <circle r={13} fill={INK} /><circle r={7} fill="#fff" />
          </g>
        </svg>
      )}
      {ar && as > 0 && (
        <svg width={80} height={120} style={{position: 'absolute', left: ar[0] - 40, top: ar[1] - 60, transform: `scale(${as})`, overflow: 'visible'}}>
          <path d="M40 8 L40 70 M12 56 L40 98 L68 56" stroke="#fff" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M40 8 L40 70 M12 56 L40 98 L68 56" stroke={INK} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M40 8 L40 70 M12 56 L40 98 L68 56" stroke="#ec8f78" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </>
  );
};
export const S01_B02_SH01 = () => <Painted paint={(p, f) => paintSH09(p, f)} band><SH09Layers /></Painted>;

// ---- S01-B03-SH03: "ภาพจำลอง" throughout; slingshot icon (colour, the B04 drawing) pops at +99 beside the empty spot
export const SH12Layers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B03_SH03', l), pad = padPoint(c), s = pop(l, SPRING.icon, 6);
  return <>{s > 0 && <SlingIcon x={Math.min(960, pad[0] + 330)} y={pad[1] - 20} size={170} scale={s} />}<Lbl /></>;
};
export const S01_B03_SH03 = () => <Painted paint={(p, f) => paintSH12(p, f)} band><SH12Layers /></Painted>;

// ---- S01-B05-SH01: shrink sparkle +4..+20; marks' tiny icons at the chart's left, no digits
const Sparkle = ({x, y, s, rot}: {x: number; y: number; s: number; rot: number}) => (
  <svg width={60} height={60} viewBox="-30 -30 60 60" style={{position: 'absolute', left: x - 30, top: y - 30, transform: `scale(${s}) rotate(${rot}deg)`}}>
    <path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
export const SH15Layers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B05_SH01', l), gb = camPoint(c, [1.3, 0.25, 0.25]);
  const f = camPoint(c, [0.14, 0.15, 0.012]), m = camPoint(c, [0.14, 0.42, 0.012]), sp = seg(l, 4, 20);
  const spark = [[-1, -0.8, 0], [0.6, -1.1, 30], [1.1, 0.2, 60], [-0.4, 0.5, 15], [0.1, -0.2, 45]] as const;
  return (
    <>
      {gb && l >= 4 && l < 21 && spark.map(([dx, dy, r], i) => <Sparkle key={i} x={gb[0] + dx * (40 + 60 * sp)} y={gb[1] + dy * (40 + 60 * sp) - 40} s={Math.max(0, (1 - sp) * (0.6 + 0.2 * i))} rot={r + 90 * sp} />)}
      {f && l >= 27 && (
        <svg width={64} height={44} viewBox="-32 -22 64 44" style={{position: 'absolute', left: f[0] - 32, top: f[1] - 22, transform: `scale(${pop(l, 27, 4)})`, overflow: 'visible'}}>
          <ellipse cx={0} cy={0} rx={22} ry={11} fill="#fff" opacity={0.85} /><ellipse cx={0} cy={0} rx={16} ry={8} fill={INK} /><ellipse cx={0} cy={0} rx={13} ry={5.6} fill="#c8643c" />
          <path d="M-12 4 L-22 12 L-26 4 M-4 6 L-8 15 M6 6 L8 15" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /><circle cx={11} cy={-2} r={2.2} fill="#fff" />
        </svg>
      )}
      {m && l >= 51 && (
        <svg width={50} height={72} viewBox="-25 -50 50 72" style={{position: 'absolute', left: m[0] - 25, top: m[1] - 50, transform: `scale(${pop(l, 51, 4)})`, transformOrigin: '25px 50px', overflow: 'visible'}}>
          <g strokeLinecap="round" fill="none"><path d="M0 -20 L0 6 M0 -10 L-12 0 M0 -10 L12 0 M0 6 L-9 22 M0 6 L9 22" stroke={INK} strokeWidth={13} /><path d="M0 -20 L0 6 M0 -10 L-12 0 M0 -10 L12 0 M0 6 L-9 22 M0 6 L9 22" stroke="#6fa3d0" strokeWidth={6} /></g>
          <circle cx={0} cy={-32} r={11} fill={INK} /><circle cx={0} cy={-32} r={8} fill="#f0d0b0" />
        </svg>
      )}
    </>
  );
};
export const S01_B05_SH01 = () => <Painted paint={(p, f) => paintSH15(p, f)} band><SH15Layers /></Painted>;

export const S01_B05_SH02 = () => <Painted paint={(p, f) => paintSH16(p, f)} />;

// ======================= W5.2 asset group 3 =======================
/** Ring marker (ink + coral), the series marker of the LF03 arc. */
const Ring = ({x, y, r, a = 1}: {x: number; y: number; r: number; a?: number}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: a, overflow: 'visible'}}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={13} /><circle cx={x} cy={y} r={r} fill="none" stroke="#ff5a3c" strokeWidth={6.5} />
  </svg>
);

// ---- S01-B01-SH02: "2 มม." bar +0..+15 (fades +16..+21), "ภาพจำลอง" throughout, ring on the flea from +36, counter pill x10..x50 (x50 on +45..+48, no digit past it)
export const SH02Layers = () => {
  const l = useCurrentFrame(), f = flea02At(l), ring = pop(l, 36, 4), cnt = counterAt(l), barA = 1 - seg(l, 16, 21);
  return (
    <>
      {barA > 0.01 && <ScaleBar cam={shotCamera('S01_B01_SH02', 0)} opacity={barA} />}
      <Lbl />
      {ring > 0 && <div style={{transform: `scale(${ring})`, transformOrigin: `${f.x}px ${f.y}px`, position: 'absolute', inset: 0}}><Ring x={f.x} y={f.y} r={Math.max(40, f.len * 0.8)} /></div>}
      {cnt && (
        <div lang="th" style={{position: 'absolute', left: 540 - 130, top: 1010, width: 260, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.94)', border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 78, color: INK, letterSpacing: 2}}>{cnt}</div>
      )}
    </>
  );
};
export const S01_B01_SH02 = () => <Painted paint={(p, f) => paintSH02(p, f)} band><SH02Layers /></Painted>;

// ---- trailer shots: grain 0.13 + the deep-blue vignette on the trailer plates only; card in TC
const TR = {vignette: TRAILER_VIGNETTE, grain: 0.13} as const;
export const S01_B01_SH04 = () => { const l = useCurrentFrame(); return <Painted paint={(p, f) => paintSH04(p, f)} band {...TR}><TrailerCard opacity={seg(l, 0, 4)} /></Painted>; };
export const S01_B01_SH04B = () => <Painted paint={(p, f) => paintSH05T(p, f)} band {...TR}><TrailerCard /></Painted>;
/** SH04C marker: ring at the silhouette's point plus the dotted trail behind it; greys with the drain. */
export const SkyLayers = () => {
  const l = useCurrentFrame(), a = camPoint(CAM_TR_SKY, skyPos(l)), tr = trailAt(l), dr = drainAt(l);
  return (
    <div style={{position: 'absolute', inset: 0, filter: `grayscale(${dr})`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: tr.a}}>
        {tr.pts.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={7} fill={INK} /><circle cx={x} cy={y} r={4.2} fill="#fff" /></g>)}
      </svg>
      {a && a[1] < 1960 && <Ring x={a[0]} y={a[1]} r={34} a={tr.a} />}
    </div>
  );
};
/** SH04C: the frame sags 2 % while the grade drains (tape-stop, N19); card off at +36. */
export const S01_B01_SH04C = () => {
  const l = useCurrentFrame(), sag = seg(l, SKY.stop, SKY.stopEnd);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#444'}}>
      <AbsoluteFill style={{transformOrigin: '50% 0', transform: `scaleY(${1 + 0.02 * sag})`}}>
        <Painted paint={(p, f) => paintSH06(p, f)} band {...TR}><SkyLayers />{l < 36 && <TrailerCard />}</Painted>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const S01_B01_SH04D = () => <Painted paint={(p, f) => paintSH07(p, f)} band vignette="rgba(40,70,100,0.18)" />;

// ---- S01-B02-SH03: "ภาพจำลอง" throughout; "x2" tags (legs +5, pack +55); dashed line at the apex feet row from +96 (pulses +145)
export const SH10Layers = () => {
  const l = useCurrentFrame(), c = shotCamera('S01_B02_SH03', l), leg = camPoint(c, TAG10.leg), pk = camPoint(c, TAG10.pack), row = camPoint(c, [0, HOP.h, 0]);
  const ls = pop(l, HOP.glow, 6), ps = pop(l, HOP.pack, 6), pulse = l >= HOP.deadpan && l < HOP.deadpan + 10 ? Math.sin(Math.PI * (l - HOP.deadpan) / 10) : 0;
  return (
    <>
      <Lbl />
      {leg && ls > 0 && <div style={{position: 'absolute', inset: 0, transform: `scale(${ls})`, transformOrigin: `${leg[0]}px ${leg[1]}px`}}><Text x={leg[0]} y={leg[1] - 40} text="×2" size={72} anchor="middle" /></div>}
      {pk && ps > 0 && <div style={{position: 'absolute', inset: 0, transform: `scale(${ps})`, transformOrigin: `${pk[0]}px ${pk[1]}px`}}><Text x={pk[0]} y={pk[1] - 40} text="×2" size={72} anchor="middle" /></div>}
      {row && l >= 96 && (
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={20} x2={1060} y1={row[1]} y2={row[1]} stroke={INK} strokeWidth={10 + 8 * pulse} strokeDasharray="26 18" strokeLinecap="round" />
          <line x1={20} x2={1060} y1={row[1]} y2={row[1]} stroke="#fff" strokeWidth={5 + 5 * pulse} strokeDasharray="26 18" strokeLinecap="round" />
        </svg>
      )}
    </>
  );
};
export const S01_B02_SH03 = () => <Painted paint={(p, f) => paintSH10(p, f)} band><SH10Layers /></Painted>;

// ---- S01-B03-SH01: "2 มม." bar (follows the push) and "ภาพจำลอง"
export const SH11Layers = () => { const l = useCurrentFrame(); return <><ScaleBar cam={shotCamera('S01_B03_SH01', l)} /><Lbl /></>; };
export const S01_B03_SH01 = () => <Painted paint={(p, f) => paintSH11(p, f)} band><SH11Layers /></Painted>;
