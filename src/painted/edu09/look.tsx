import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {camOf} from '../kit/cam-moves';
import {LAMP} from './dining';
import {povCam} from './handclose';
import {camD01, D01_LAMP_Y, camLF02, camLF03, paintLF01, paintLF01b, paintLF01m, paintLF02, paintLF03, paintLF04, paintQAGrin, paintQAPiano, paintQAStop, paintQADangle, paintQALifts, paintQADiag3, paintQADiag4, camSH03End, camSH04End, SH04_MOVE, SH07_MOVE, SH08_MOVE} from './scenes';

export {LF_FRAMES} from './scenes';

// EDU-EP09-SHORT look frames (W3): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption or channel
// mark; `band` marks the caption band y 1176-1344, `label` mocks the Remotion "ภาพประกอบ" pill (top-right x 816-1020, y 148-204).
// Render: printf 'EDU9-LF01 0 out/edu09/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu09/look-index.ts

const FPS = 30;
const Painted = ({paint, paper = '#e8dfcc', band = true, label = false, children}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; label?: boolean; children?: React.ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.06} />
      {children}
      {label && <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.85)', color: '#2b211c',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 30}}>ภาพประกอบ</div>}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Lamp pool (brief: warm #ffe2ae glow pool on the table at about 35 %) as a soft screen-space glow at the lamp's floor point, and the fall-off
 * away from it; `level` scales both (B03 dims the room). */
export const LampPool = ({cam, at, r = 900, level = 1, squash = 1}: {cam: YCam; at: V3; r?: number; level?: number; squash?: number}) => {
  const c = camPoint(cam, at) ?? [200, 300];
  const tf = `translate(${c[0]} ${c[1]}) scale(1 ${squash}) translate(${-c[0]} ${-c[1]})`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="pool" gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1]} r={r} gradientTransform={tf}>
          <stop offset="0" stopColor="#ffe2ae" stopOpacity={0.42 * level} /><stop offset="0.45" stopColor="#ffd08a" stopOpacity={0.16 * level} /><stop offset="1" stopColor="#ffd08a" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="falloff" gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1]} r={r * 1.9}>
          <stop offset="0.45" stopColor="#1a0f08" stopOpacity={0} /><stop offset="1" stopColor="#1a0f08" stopOpacity={0.32 * level} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#pool)" style={{mixBlendMode: 'soft-light'}} />
      <rect width={1080} height={1920} fill="url(#pool)" style={{mixBlendMode: 'screen'}} opacity={0.5} />
      <rect width={1080} height={1920} fill="url(#falloff)" />
    </svg>
  );
};

export const LF01 = () => <Painted paint={paintLF01}><LampPool cam={povCam(0)} at={[-14, 0, -11]} /></Painted>;
export const LF01b = () => <Painted paint={paintLF01b}><LampPool cam={povCam(1)} at={[-14, 0, -11]} /></Painted>;
export const LF01m = () => <Painted paint={paintLF01m} paper="#ffffff" band={false} />;
/** Room light of SET-DINING: a warm bloom round the lamp opening (screen) and a soft fall-off to the frame edges, so the pendant reads as the key. */
const RoomLight = ({cam, lamp}: {cam: YCam; lamp: V3}) => {
  const c = camPoint(cam, [lamp[0], lamp[1] - 0.08, lamp[2]]) ?? [540, 0];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="bloom" gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1]} r={420}><stop offset="0" stopColor="#ffe9b8" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd08a" stopOpacity={0} /></radialGradient>
        <radialGradient id="edge" gradientUnits="userSpaceOnUse" cx={c[0]} cy={c[1] + 700} r={1250}><stop offset="0.5" stopColor="#2a1c14" stopOpacity={0} /><stop offset="1" stopColor="#2a1c14" stopOpacity={0.4} /></radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#bloom)" style={{mixBlendMode: 'screen'}} />
      <rect width={1080} height={1920} fill="url(#edge)" />
    </svg>
  );
};

export const LF02 = () => <Painted paint={paintLF02}><LampPool cam={camLF02} at={[0, 0.72, -0.15]} r={700} squash={0.4} level={0.9} /><RoomLight cam={camLF02} lamp={LAMP} /></Painted>;
/** B03 room dim: the room at about 70 % so the diagram leads (brief light arc). */
const Dim = ({level = 0.3}: {level?: number}) => <div style={{position: 'absolute', inset: 0, background: `rgba(20,14,10,${level})`}} />;
export const LF03 = () => <Painted paint={paintLF03} label><LampPool cam={camLF03} at={[-14, 0, -11]} level={0.5} /></Painted>;
/** PIANO-CLOSE top light: a soft cool pool from above on the keys and the hand, the surround falling off to dark (brief B04 light). */
const TopLight = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs>
      <radialGradient id="top" gradientUnits="userSpaceOnUse" cx={560} cy={820} r={900}><stop offset="0" stopColor="#e8eef6" stopOpacity={0.22} /><stop offset="1" stopColor="#e8eef6" stopOpacity={0} /></radialGradient>
      <radialGradient id="dark" gradientUnits="userSpaceOnUse" cx={560} cy={860} r={1200}><stop offset="0.45" stopColor="#120e0c" stopOpacity={0} /><stop offset="1" stopColor="#120e0c" stopOpacity={0.6} /></radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#top)" style={{mixBlendMode: 'screen'}} />
    <rect width={1080} height={1920} fill="url(#dark)" />
  </svg>
);
export const LF04 = () => <Painted paint={paintLF04} label paper="#2a2320"><TopLight /></Painted>;
/** W5.2 QA stills: the SD05 tune at a shot-local frame (render frames 5, 50, 120) and ELDER's D01 grin. */
export const QAPIANO = () => <Painted paint={paintQAPiano} label paper="#2a2320"><TopLight /></Painted>;
export const QAGRIN = () => <Painted paint={paintQAGrin}><LampPool cam={camD01} at={[0, 0.72, -0.15]} r={700} squash={0.4} level={0.9} /><RoomLight cam={camD01} lamp={[LAMP[0], D01_LAMP_Y, LAMP[2]]} /></Painted>;
export const QASTOP = () => <Painted paint={paintQAStop}><LampPool cam={camOf(SH04_MOVE, 0.5)} at={[0, 0.72, -0.15]} r={700} squash={0.4} level={0.9} /><RoomLight cam={camOf(SH04_MOVE, 0.5)} lamp={[LAMP[0], D01_LAMP_Y, LAMP[2]]} /></Painted>;
export const QADANGLE = () => <Painted paint={paintQADangle} label><LampPool cam={camOf(SH07_MOVE, 0.5)} at={[0, 0.72, -0.15]} r={700} squash={0.4} level={0.9} /><RoomLight cam={camOf(SH07_MOVE, 0.5)} lamp={LAMP} /></Painted>;
export const QALIFTS = () => <Painted paint={paintQALifts} label><LampPool cam={camOf(SH08_MOVE, 0.5)} at={[0, 0.72, -0.15]} r={700} squash={0.4} level={0.9} /><RoomLight cam={camOf(SH08_MOVE, 0.5)} lamp={LAMP} /></Painted>;
export const QADIAG3 = () => <Painted paint={paintQADiag3} label><LampPool cam={camSH03End} at={[-14, 0, -11]} level={0.5} /></Painted>;
export const QADIAG4 = () => <Painted paint={paintQADiag4} label><LampPool cam={camSH04End} at={[-14, 0, -11]} level={0.5} /></Painted>;
