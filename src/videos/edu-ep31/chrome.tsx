import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {CAPTION_SCALE, captionPose} from '../../painted/edu31/captions31';

/**
 * EDU-EP31-SHORT episode chrome (Editor, W5.3 Draft, 2026-11-21), above every plate on the composition clock G:
 * (1) the drawn captions: the shared `Subtitles` look (edu outline stroke, no band, bottom edge y 1344) at CAPTION_SCALE (71.4 px) in the EP26 pop-in
 *     (`captionPose`, pure function of G, seek-safe); the timeline captions stay as data (captionStyle.preset 'none');
 * (2) the reconstruction label VD31-17 "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง", frame 0 to the end, small under the @TamMaiLa mark
 *     (mark top 128, 22 px; label top 170, 24 px, the mark's own outline look), one line x 120 - about 760, above the joke label (plate top y 215).
 * Props `captions: false` / `label: false` hide a layer (measurement stills).
 */
const STYLE = {preset: 'outline', bottomEdgeY: 1344, scale: CAPTION_SCALE, ...CAPTION_OUTLINE} as const;
export const RECON_LABEL = 'แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง';
export const Edu31Chrome = ({captions = true, label = true}: {captions?: boolean; label?: boolean}) => {
  const pose = captionPose(useCurrentFrame());
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {label && <span lang="th" style={{position: 'absolute', top: 170, left: 120, fontSize: 24, lineHeight: 1.3, whiteSpace: 'nowrap', ...channelLabelLook('outline', '#fff1da')}}>{RECON_LABEL}</span>}
      {captions && pose && (
        <AbsoluteFill style={{opacity: pose.opacity, transform: `translateY(${pose.dy}px) scale(${pose.scale})`, transformOrigin: '540px 1272px'}}>
          <Subtitles text={pose.card.text} style={STYLE} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
