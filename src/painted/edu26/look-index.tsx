import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {CaptionShade, Grade, Grain} from '../kit/screen';
import {paintWorkshopReceipt, PAPER} from './workshop';

const paint = ({brush, frame}: PaintContext) => {
  paintWorkshopReceipt(makePainter(brush, {t: 0, frame, fade: PAPER}));
};

const WorkshopLook = ({chrome = true}: {chrome?: boolean}) => (
  <AbsoluteFill style={{background: PAPER}}>
    <BrushCanvas paint={paint} paper={PAPER} />
    <Grade />
    <Grain opacity={0.10} />
    <CaptionShade tl={0.25} cues={[[0, 1, 1]]} strength={0.35} bottomEdgeY={1344} />
    {chrome && <>
      <span style={{position: 'absolute', top: 128, left: 120, fontSize: 22, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#514338')}}>{defaultChrome.channelLabel}</span>
      <span lang="th" style={{position: 'absolute', top: 170, right: 186, color: '#fbefda', background: '#4e4036', padding: '8px 16px', fontSize: 31, fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 650, borderRadius: 6}}>เรื่องสมมุติ</span>
      <Subtitles text="วันแรกที่คุณทำงานร้านซักผ้า" style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE}} />
    </>}
  </AbsoluteFill>
);

registerRoot(() => <>
  <Composition id="EDU26-LF01" component={WorkshopLook} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{chrome: true}} />
  <Composition id="EDU26-LF01-Background" component={WorkshopLook} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{chrome: false}} />
</>);
