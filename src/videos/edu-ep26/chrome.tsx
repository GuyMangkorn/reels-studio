import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAPTION_OUTLINE} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {CAPTION_SCALE, captionPose} from '../../painted/edu26/captions26';

/**
 * EDU-EP26-SHORT drawn captions (Editor, 2026-11-19, "Caption redesign"): the shared `Subtitles` look (edu outline stroke, no overlay band,
 * safe zone bottom edge y 1344) at CAPTION_SCALE, wrapped in the card pop-in of `captionPose` (pure function of the composition frame, so
 * random and backward seeks give the same pixels). The timeline captions stay as data (captionStyle.preset 'none' hides the scene draw), because
 * a scene `Subtitles` cannot animate a card across a cut or know its start frame. Prop `captions: false` hides them (measurement stills).
 */
const STYLE = {preset: 'outline', bottomEdgeY: 1344, scale: CAPTION_SCALE, ...CAPTION_OUTLINE} as const;
export const Edu26Chrome = ({captions = true}: {captions?: boolean}) => {
  const pose = captionPose(useCurrentFrame());
  if (!captions || !pose) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: pose.opacity, transform: `translateY(${pose.dy}px) scale(${pose.scale})`, transformOrigin: '540px 1272px'}}>
      <Subtitles text={pose.card.text} style={STYLE} />
    </AbsoluteFill>
  );
};
