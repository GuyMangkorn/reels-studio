import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {CaptionShade, Grain} from '../kit/screen';
import {LOOK_IDS, paintWashBenchLook, type LookId} from './wash-bench-look';
import {LIME_PAPER} from './wash-bench-set';

const CAPTIONS: Record<LookId, string> = {
  LF01: 'ลูกค้าฝากเสื้อเปื้อนน้ำมันไว้',
  LF02: 'ช่างซักผ้าใช้ฉี่เป็นตัวช่วยซักผ้าด้วย',
  LF03: 'ตรงนั้นขาวแล้ว',
};

type LookProps = {look: LookId; chrome: boolean};

const WashBenchLook = ({look = 'LF01', chrome = true}: LookProps) => {
  const paint = ({brush, frame}: PaintContext) => paintWashBenchLook(makePainter(brush, {t: 0, frame, fade: LIME_PAPER}), look);
  return (
    <AbsoluteFill style={{background: LIME_PAPER}}>
      <BrushCanvas paint={paint} paper={LIME_PAPER} />
      <Grain opacity={.13} />
      <CaptionShade tl={.25} cues={[[0, 1, 1]]} strength={.21} bottomEdgeY={1344} />
      {chrome && <>
        <span style={{position: 'absolute', top: 128, left: 120, fontSize: 23, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#27333c')}}>{defaultChrome.channelLabel}</span>
        {look === 'LF01' && <span lang="th" style={{position: 'absolute', top: 164, right: 200, color: '#fff1d9', background: '#283744', padding: '7px 14px', fontSize: 29, fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 650, borderRadius: 6}}>เรื่องสมมุติ</span>}
        <Subtitles text={CAPTIONS[look]} style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE, scale: .86}} />
      </>}
    </AbsoluteFill>
  );
};

registerRoot(() => <>
  {LOOK_IDS.flatMap((look) => [true, false].map((chrome) => {
    const id = `EDU26-R2-${look}${chrome ? '' : '-Background'}`;
    return <Composition key={id} id={id} component={WashBenchLook} width={1080} height={1920}
      fps={30} durationInFrames={1} defaultProps={{look, chrome}} />;
  }))}
</>);
