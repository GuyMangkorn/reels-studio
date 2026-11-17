import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {THUMBS} from './looks';

// EDU-EP22-SHORT W3 thumbnails (Boss W3.1, 2026-11-16; docs/sequence-workflow.md#look-thumbnails): draft paintings (flat washes, no hatching) of
// the HALL from its first storyboard shot B01-SH01 (EDU-EP22-STORYBOARD-R1), each a different framing or light balance, plus one draft of LF02
// (B04-SH14). The user picks one; the finished look frames LF01 / LF01b / LF02 are painted from the pick (not yet). Guides: dashed caption band
// y 1176-1344 and the mark zone; off with --props='{"guides":false}' for the caption-zone measure.

const Still = ({id}: {id: string}) => {
  const th = THUMBS[id];
  const fn = useCallback(({brush, frame}: PaintContext) => th.paint(makePainter(brush, {t: frame / 30, frame, fade: th.paper ?? '#d9c7a6'})), [th]);
  const g = (getInputProps() as {guides?: boolean}).guides, guides = th.final ? g === true : g !== false;
  return (
    <AbsoluteFill style={{background: th.paper ?? '#d9c7a6'}}>
      <BrushCanvas paint={fn} paper={th.paper ?? '#d9c7a6'} />
      <Grain opacity={0.04} />
      {guides && <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.75)', borderBottom: '2px dashed rgba(255,255,255,0.75)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 330, height: 140, border: '2px dashed rgba(255,255,255,0.55)'}} />
        <div style={{position: 'absolute', right: 16, top: 16, font: '700 40px sans-serif', lineHeight: '48px', textAlign: 'right', color: '#fff', background: 'rgba(20,16,12,0.6)', padding: '6px 14px'}}>{`${id} · ${th.shot}`}<br />{id.startsWith('CHK') ? 'EDU-EP22-SHORT · ASSET CHECK' : th.final ? 'EDU-EP22-SHORT · LOOK FRAME' : 'EDU-EP22-SHORT · DRAFT THUMBNAIL'}</div>
      </>}
    </AbsoluteFill>
  );
};
export const THUMB_STILLS = Object.fromEntries(Object.keys(THUMBS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
