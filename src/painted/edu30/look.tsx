import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, camUnit} from '../kit/ycam';
import {LOOK_DEFS, type LookDef} from './looks';
import {NewsreelOverlay, NewsreelPicture} from './newsreel';

// EDU-EP30-SHORT W3 look frames, thumbnails and KP-EMU stills (Film, 2026-11-19): one BrushCanvas per still, the newsreel layer (VD30-01)
// around the canvas, the title overlay (VD30-09), the edu outline caption at bottomEdgeY 1344 and the @TamMaiLa mark with the reconstruction
// label (VD30-10, outside the newsreel layer). Props: {"caption": false} drops caption, title and chrome (caption-zone background measure);
// {"guides": true} adds the dashed caption band. Render: sh scripts/edu-series/ep30/short/render-looks.sh <version> [IDs]

const LABEL = 'แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง';

/** VD30-09 newsreel title: cream Thai display text in a thin double-rule art-deco frame, top third. */
export const ReelTitle = ({text}: {text: string}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(28,20,12,0.72)', border: '3px solid #efe2c2', outline: '1.5px solid #efe2c2', outlineOffset: 7, padding: '18px 54px 24px', borderRadius: 6}}>
      <span lang="th" style={{fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 800, fontSize: 84, color: '#f3e7c8', letterSpacing: 2}}>{text}</span>
    </div>
  </div>
);

/** A word on the relief (the scroll), projected: centred at the word's world point, cap height `h` metres. */
const ReliefWord = ({look}: {look: LookDef}) => {
  const w = look.word;
  if (!w) return null;
  const at = camPoint(look.cam, w.at), u = camUnit(look.cam, w.at);
  if (!at) return null;
  return <div style={{position: 'absolute', left: at[0] - 600, top: at[1] - w.h * u * 0.85, width: 1200, textAlign: 'center', fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: w.h * u * 1.35, letterSpacing: w.h * u * 0.25, color: '#5a3c1c', textShadow: `${0.01 * u}px ${0.012 * u}px 0 rgba(120,90,50,0.6)`}}>{w.text}</div>;
};

const Still = ({id}: {id: string}) => {
  const frame = useCurrentFrame();
  const look = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame: f}: PaintContext) => look.paint(makePainter(brush, {t: look.t, frame: f, fade: '#b9ab92'})), [look]);
  const props = getInputProps() as {caption?: boolean; guides?: boolean};
  const canvas = <BrushCanvas paint={fn} paper={look.paper} />;
  const reel = look.reel;
  return (
    <AbsoluteFill style={{background: look.paper}}>
      {reel ? <NewsreelPicture frame={frame + 7} tint={reel.tint} tintAmount={reel.amount} strength={reel.strength ?? 1}>{canvas}</NewsreelPicture> : canvas}
      <ReliefWord look={look} />
      <Grain opacity={reel ? 0.07 : 0.04} />
      {reel && <NewsreelOverlay frame={frame + 7} tint={reel.tint} strength={reel.strength ?? 1} />}
      {props.caption !== false && <>
        {look.title && <ReelTitle text={look.title} />}
        {look.caption && <Subtitles text={look.caption} style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE}} />}
        <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 22, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c')}}>{defaultChrome.channelLabel}</span>
        <span lang="th" style={{position: 'absolute', top: 160, left: 120, fontSize: 17, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c'), WebkitTextStroke: '4px #2b1a12'}}>{LABEL}</span>
      </>}
      {props.guides && <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 194, borderTop: '2px dashed rgba(255,255,255,0.75)', borderBottom: '2px dashed rgba(255,255,255,0.75)'}} />}
    </AbsoluteFill>
  );
};

export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
