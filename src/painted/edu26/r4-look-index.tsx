import {useCallback, useMemo} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {Hands3D} from '../kit/hand3d';
import {makePainter} from '../kit/painter';
import {CaptionShade, Grain} from '../kit/screen';
import {R4_STILLS} from './r4-looks';

// EDU-EP26-SHORT W3 look proposals on BRIEF-R4 (Film, 2026-11-18). Standalone entry, outside src/Root.tsx and the episode registry.
// Render on one Chrome: printf 'EDU26-R4-LF04 0 out/edu26-r4/LF04.png\n' | node scripts/stills.mjs src/painted/edu26/r4-look-index.tsx
// A still with `hands` gets `Hands3D` layers over the plate (finger close-ups: LF06, KP-MARCUS-CLOSE). KP-INSET-PLATE is the VD26-12 inset
// plate alone; the KP-INSET review still is LF05's plate with that plate laid in its circle by ffmpeg (two BrushCanvas in one composition
// do not both paint; the runtime inset is Boss's, BRIEF-R4 seam table).
// `<id>` carries the chrome (mark, story label, a sample caption on look frames, the draft tag on thumbnails); `<id>-Background` none.

type Props = {id: string; chrome: boolean};
const LABEL = 'แต่งเติมจากเรื่องจริง';

const Still = ({id, chrome}: Props) => {
  const s = R4_STILLS[id];
  const paint = useCallback(({brush, frame}: PaintContext) => s.paint(makePainter(brush, {t: 0, frame, fade: s.paper})), [s]);
  const layers = useMemo(() => s.hands?.() ?? [], [s]);
  return (
    <AbsoluteFill style={{background: s.paper}}>
      <BrushCanvas paint={paint} paper={s.paper} />
      {layers.map((l, i) => <AbsoluteFill key={i}><Hands3D cam={l.cam} arms={l.arms} props={l.props} /></AbsoluteFill>)}
      <Grain opacity={0.08} />
      {chrome && s.caption && <CaptionShade tl={0.25} cues={[[0, 1, 1]]} strength={0.2} bottomEdgeY={1344} />}
      {chrome && <>
        <span style={{position: 'absolute', top: 128, left: 120, fontSize: 23, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#27333c')}}>{defaultChrome.channelLabel}</span>
        {s.kind !== 'sheet' && <span lang="th" style={{position: 'absolute', top: 164, left: 120, color: '#fff3dc', background: 'rgba(40,30,24,0.72)', padding: '5px 12px', fontSize: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 600, borderRadius: 6}}>{LABEL}</span>}
        {s.caption && <Subtitles text={s.caption} style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE, scale: 0.86}} />}
        {s.kind === 'thumb' && <div style={{position: 'absolute', right: 24, top: 120, font: '700 30px sans-serif', color: '#fff', background: 'rgba(20,16,12,0.6)', padding: '6px 12px', textAlign: 'right'}}>{id}<br />DRAFT THUMBNAIL</div>}
        {s.kind === 'sheet' && <div style={{position: 'absolute', right: 24, top: 120, font: '700 30px sans-serif', color: '#fff', background: 'rgba(20,16,12,0.6)', padding: '6px 12px'}}>{id}</div>}
      </>}
    </AbsoluteFill>
  );
};

registerRoot(() => <>
  {Object.keys(R4_STILLS).flatMap((id) => [true, false].map((chrome) => {
    const cid = `EDU26-R4-${id}${chrome ? '' : '-Background'}`;
    return <Composition key={cid} id={cid} component={Still} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{id, chrome}} />;
  }))}
</>);
