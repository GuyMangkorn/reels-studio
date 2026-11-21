import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import {BRIDGE_LOOKS} from './bridge';
import {CORRIDOR_LOOKS} from './corridor';
import {CORRIDOR_OVERLAYS} from './corridor-text';
import {LOOK_DEFS as BASE_LOOKS, type LookDef} from './looks';
import {OFFICE_LOOKS} from './office';
import {OFFICE_OVERLAYS} from './office-text';

const LOOK_DEFS: Record<string, () => LookDef> = {...BASE_LOOKS, ...BRIDGE_LOOKS, ...OFFICE_LOOKS, ...CORRIDOR_LOOKS};
const OVERLAYS: Record<string, (c: LookDef['cam']) => ReactNode> = {...OFFICE_OVERLAYS, ...CORRIDOR_OVERLAYS};

// EDU-EP32-SHORT W3 look frames (Boss, 2026-11-21; VD32-02 gate still LF02 = B02-SH01). One BrushCanvas per still, Grade + Grain screen layers,
// the edu outline caption at bottomEdgeY 1344 (scale 1.4 = 71 px since the user's 2026-11-21 caption note, EP26 look) and the @TamMaiLa mark (the VD32-14 label shows only the first ~3 s per Q2, so not on B02).
// Props: {"caption": false} drops caption and chrome (caption-zone background measure); {"guides": true} adds the dashed caption band.
// Render: sh scripts/edu-series/ep32/short/render-looks.sh <version> [IDs]

const Still = ({id}: {id: string}) => {
  const look = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame: f}: PaintContext) => look.paint(makePainter(brush, {t: look.t, frame: f, fade: '#2c2630'})), [look]);
  const props = getInputProps() as {caption?: boolean; guides?: boolean};
  return (
    <AbsoluteFill style={{background: look.paper}}>
      <BrushCanvas paint={fn} paper={look.paper} />
      {OVERLAYS[id]?.(look.cam)}
      <Grade />
      <Grain opacity={0.08} />
      {props.caption !== false && <>
        {look.caption && <Subtitles text={look.caption} style={{preset: 'outline', bottomEdgeY: 1344, scale: 1.4, ...CAPTION_OUTLINE}} />}
        <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 22, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c')}}>{defaultChrome.channelLabel}</span>
      </>}
      {props.guides && <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 388, borderTop: '2px dashed rgba(255,255,255,0.75)', borderBottom: '2px dashed rgba(255,255,255,0.75)'}} />}
    </AbsoluteFill>
  );
};

export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
