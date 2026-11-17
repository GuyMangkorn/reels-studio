import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {BoardText, CardText} from './board-text';
import {LOOK_DEFS} from './looks';
import {sepia} from './palette';

// EDU-EP24-SHORT W3 look frames LF01-LF04 (Film, 2026-11-17; brief #look-frames): one BrushCanvas per still (DF-20261116-brush-scale-cumulative),
// the board/card DOM text on camera quads, the edu outline caption at bottomEdgeY 1344 and the @TamMaiLa mark (outline look, as EDU-EP20/21)
// drawn in so the zones are judged. Props: {"caption": false} drops caption and mark (caption-zone background measure); {"guides": true}
// adds the dashed caption band and mark box. Render: sh scripts/edu-series/ep24/short/render-looks.sh <version> [LF01 ...]

/** B04 fact inserts (N9, Remotion SVG, picture space): the "1971" stamp (landed) and the dashed "ค่าแบงก์" line with the arrow rising
 *  through it. No other number, no axis (truth limits 3-4). Inks #2a2620, accent red #c8323a. */
const B04Inserts = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
    <g transform="translate(540 262) rotate(-5)">
      <rect x={-190} y={-84} width={380} height={168} rx={14} fill="rgba(246,239,224,0.9)" stroke="#c8323a" strokeWidth={9} />
      <rect x={-172} y={-66} width={344} height={132} rx={8} fill="none" stroke="#c8323a" strokeWidth={3} />
      <text x={0} y={40} textAnchor="middle" fontFamily="'Noto Sans Thai', sans-serif" fontWeight={800} fontSize={118} fill="#c8323a" letterSpacing={4}>1971</text>
    </g>
    <g>
      <line x1={170} y1={960} x2={880} y2={960} stroke="#2a2620" strokeWidth={8} strokeDasharray="30 20" strokeLinecap="round" />
      <text x={180} y={928} fontFamily="'Noto Sans Thai', sans-serif" fontWeight={700} fontSize={50} fill="#2a2620" stroke="#f6efe0" strokeWidth={10} paintOrder="stroke fill">ค่าแบงก์</text>
      <path d="M 250 1125 C 400 1100, 520 1000, 640 810" fill="none" stroke="#f6efe0" strokeWidth={26} strokeLinecap="round" />
      <path d="M 250 1125 C 400 1100, 520 1000, 640 810" fill="none" stroke="#c8323a" strokeWidth={14} strokeLinecap="round" />
      <path d="M 596 818 L 656 786 L 658 856 Z" fill="#c8323a" stroke="#f6efe0" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke fill" />
    </g>
  </svg>
);

const Still = ({id}: {id: string}) => {
  useCurrentFrame();
  const look = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame}: PaintContext) => look.paint(makePainter(brush, {t: look.t, frame, fade: '#b9ab92'})), [look]);
  const props = getInputProps() as {caption?: boolean; guides?: boolean};
  const ink = look.sepia ? sepia : undefined;
  const paper = look.sepia ? sepia(look.paper) : look.paper;
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      {look.board && <BoardText c={look.cam} s={look.board} ink={ink} />}
      {look.card && <CardText c={look.cam} flapDown={look.card.flapDown} ink={ink} />}
      <Grain opacity={0.04} />
      {look.b04 && <B04Inserts />}
      {props.caption !== false && <>
        <Subtitles text={look.caption} style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE}} />
        <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 22, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c')}}>{defaultChrome.channelLabel}</span>
      </>}
      {props.guides && <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.75)', borderBottom: '2px dashed rgba(255,255,255,0.75)'}} />
        <div style={{position: 'absolute', left: 40, top: 60, width: 320, height: 100, border: '2px dashed rgba(255,255,255,0.55)'}} />
      </>}
    </AbsoluteFill>
  );
};

export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
