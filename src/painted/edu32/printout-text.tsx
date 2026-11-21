import type {CSSProperties, ReactNode} from 'react';
import {quadMatrix3d, type Quad} from '../../scenes/quadText';
import type {Pt} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import {PRINTOUT, printoutCorners, printoutShadow, type PrintoutPose} from './b06-sh01';

// EDU-EP32-SHORT printout W (VD32-13; Boss G6, 2026-11-21): a modern web page printed on cool white paper, camera-mapped DOM on the plate's YCam
// (QuadText homography). A generic browser frame (tabs, an empty address bar), a plain header band, greeked title and body lines; the only real
// text is the two SRC004 fragments (Boat addendum, binding): "…had a mind of its own…" and "…something all cat owners are quite familiar
// with…" (ellipsis, no full stop). No site name, URL, logo or the word "Acoustikitty" (page text is not shown). Highlighter sweeps are per
// character, pure functions of the shot frame. The lamp pool is a radial falloff in page space around the hot spot (world origin).

const K = 1000;
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const FRAG1 = '…had a mind of its own…';
export const FRAG2 = '…something all cat owners are quite familiar with…';
/** Fragment type: cap height 0.06 model m (as the memo body); Helvetica caps are about 0.72 em. */
const FONT = (0.06 / 0.72) * K;
const GREEK = '#c9ccd1', GREEK_DARK = '#8e939b', HL = 'rgba(255, 226, 40, 0.78)';

const quad = (c: YCam, pts: [number, number, number][]): Quad | null => {
  const q = pts.map((v) => camPoint(c, v));
  return q.every(Boolean) ? (q as Pt[] as unknown as Quad) : null;
};

/** Greeked line: a rounded grey bar `w` page px wide. */
const G = ({w, dark = false, h = 0.4}: {w: number; dark?: boolean; h?: number}) => (
  <span style={{display: 'inline-block', width: w, height: FONT * h, borderRadius: FONT * 0.1, background: dark ? GREEK_DARK : GREEK, verticalAlign: '0.1em', marginRight: FONT * 0.35}} />
);

/** Fragment with a highlighter sweep: `hl` 0..1 over its characters, one span per character so a wrapped line sweeps line by line. */
const Frag = ({text, hl}: {text: string; hl: number}) => (
  <>
    {[...text].map((ch, i) => {
      const cover = Math.max(0, Math.min(1, hl * text.length - i));
      const st: CSSProperties = cover > 0 ? {backgroundImage: `linear-gradient(${HL}, ${HL})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 55%', backgroundSize: `${(cover * 100).toFixed(1)}% 78%`} : {};
      return <span key={i} style={st}>{ch}</span>;
    })}
  </>
);

/** Page-local layout (page px from the top-left, K per model m): where the two fragments sit (for measures and tests). */
export const PRINTOUT_LAYOUT = {margin: 0.2 * K, frag1Top: 2.05 * K, frag2Top: 2.42 * K, line: FONT * 1.55, font: FONT} as const;

const Line = ({top, children}: {top: number; children: ReactNode}) => (
  <div style={{position: 'absolute', left: PRINTOUT_LAYOUT.margin, right: PRINTOUT_LAYOUT.margin, top, fontFamily: SANS, fontSize: FONT, lineHeight: `${PRINTOUT_LAYOUT.line}px`, color: '#22252a', whiteSpace: 'normal'}}>{children}</div>
);

export const PrintoutPage = ({c, pose, hl1, hl2}: {c: YCam; pose: PrintoutPose; hl1: number; hl2: number}) => {
  const q = quad(c, printoutCorners(pose));
  if (!q) return null;
  const w = Math.round(PRINTOUT.w * K), h = Math.round(PRINTOUT.h * K), Lw = w - 2 * PRINTOUT_LAYOUT.margin, lp = PRINTOUT_LAYOUT.line;
  // lamp hot spot (world origin) in page px: undo the rest pose (yaw only; the drift tilts are small)
  const dx = -pose.x, dz = -pose.z, cs = Math.cos(pose.yaw), sn = Math.sin(pose.yaw);
  const ox = (dx * cs + dz * sn + PRINTOUT.w / 2) * K, oy = (-dx * sn + dz * cs + PRINTOUT.h / 2) * K;
  const body = (top: number, ws: number[]) => ws.map((x, i) => <Line key={`${top}-${i}`} top={top + i * lp}><G w={x * Lw} /></Line>);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix3d(w, h, q), overflow: 'hidden',
      background: `radial-gradient(circle at ${ox.toFixed(0)}px ${oy.toFixed(0)}px, #fbfbf8 0px, #f1f2f0 ${1.0 * K}px, #c4c6c4 ${2.6 * K}px, #9a9c9c ${3.6 * K}px)`}}>
      {/* browser frame: tab strip, two tabs, address bar (empty), then a thin rule */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 0.15 * K, background: '#dadde2'}} />
      <div style={{position: 'absolute', left: 0.14 * K, top: 0.045 * K, width: 0.62 * K, height: 0.105 * K, background: '#f4f5f7', borderRadius: `${0.03 * K}px ${0.03 * K}px 0 0`}} />
      <div style={{position: 'absolute', left: 0.8 * K, top: 0.06 * K, width: 0.5 * K, height: 0.09 * K, background: '#c9cdd3', borderRadius: `${0.03 * K}px ${0.03 * K}px 0 0`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0.15 * K, height: 0.13 * K, background: '#f4f5f7', borderBottom: `${0.006 * K}px solid #d0d3d8`}} />
      <div style={{position: 'absolute', left: 0.36 * K, right: 0.2 * K, top: 0.175 * K, height: 0.08 * K, borderRadius: 0.04 * K, background: '#fff', border: `${0.005 * K}px solid #c9cdd3`}} />
      {[0.06, 0.15, 0.24].map((x) => <div key={x} style={{position: 'absolute', left: x * K, top: 0.195 * K, width: 0.04 * K, height: 0.04 * K, borderRadius: '50%', background: '#a8adb4'}} />)}
      {/* plain header band (no name or logo), greeked title */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0.29 * K, height: 0.16 * K, background: '#3a4656'}} />
      <div style={{position: 'absolute', left: 0.2 * K, top: 0.35 * K, width: 0.46 * K, height: 0.045 * K, background: '#8d98a8', borderRadius: 0.01 * K}} />
      <Line top={0.6 * K}><G w={0.86 * Lw} dark h={0.62} /></Line>
      <Line top={0.6 * K + lp * 1.15}><G w={0.58 * Lw} dark h={0.62} /></Line>
      {body(0.98 * K, [0.97, 0.93, 0.99, 0.62])}
      {body(1.6 * K, [0.95, 0.88])}
      <Line top={PRINTOUT_LAYOUT.frag1Top}><G w={0.18 * Lw} /><Frag text={FRAG1} hl={hl1} /> <G w={0.1 * Lw} /></Line>
      {body(PRINTOUT_LAYOUT.frag1Top + lp, [0.96])}
      <Line top={PRINTOUT_LAYOUT.frag2Top}><Frag text={FRAG2} hl={hl2} /></Line>
      {body(PRINTOUT_LAYOUT.frag2Top + lp * 2, [0.4])}
      {/* footer rule and page number dots */}
      <div style={{position: 'absolute', left: 0.2 * K, right: 0.2 * K, top: 2.82 * K, height: 0.004 * K, background: '#d6d8dc'}} />
    </div>
  );
};

/** Soft shadow of the printout on the memo and desk (cast from the lamp): darker and tighter as it lands. */
export const PrintoutShadow = ({c, pose}: {c: YCam; pose: PrintoutPose}) => {
  const {pts, lift} = printoutShadow(pose), q = quad(c, pts);
  if (!q) return null;
  const w = Math.round(PRINTOUT.w * K), h = Math.round(PRINTOUT.h * K), k = Math.min(1, lift / 2.4);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix3d(w, h, q),
      background: '#0c0806', opacity: 0.42 * (1 - 0.75 * k), filter: `blur(${(0.012 + 0.12 * k) * K}px)`, borderRadius: 0.02 * K}} />
  );
};
