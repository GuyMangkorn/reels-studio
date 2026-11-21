import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {CaptionShade} from '../../painted/kit/screen';
import {CAPTION_SCALE} from '../../painted/edu26/captions26';
import {captionPose32} from './captions32';
import {LABEL_TEXT, MARK_TEXT, labelOpacity, shadeCuesOf, shadeStrengthAt} from './chrome-data';
import {EDU32_SHOTS, FPS} from './shots32';

/**
 * EDU-EP32-SHORT chrome on the composition clock G (Editor, W5.3 pass 1, 21 Nov 2026), above every scene; every layer is a pure function of the frame (seek-safe).
 * 1. `CaptionShade` per shot (plates carry no shade; the EP26 plate-side shade does not exist here): cue-gated like EP26 (cards clipped to the shot, so a card that runs
 *    across a cut opens the next shot already shaded), strength per shot / span from SHADE (measured on the plates, build-notes).
 * 2. Captions: the shared `Subtitles` look (edu outline stroke, no band) at CAPTION_SCALE 1.4 (71 px), bottom edge y 1344, with the EP26 card pop-in.
 * 3. Channel mark `@TamMaiLa` top left for the whole clip (edu channel.md; same look and place as the scene chrome: outline, top 128, left 120, 22 px) and the story label
 *    "เรื่องจริง เล่าแบบขำ · ภาพและบทพูดจำลอง" under it at full opacity G0-G89, fading over G90-G97, never back (VD32-14, user Q2; Q6: no "ฉากจำลอง" tag).
 * Props (measurement stills): `captions: false` hides 1 and 2, `text: false` hides only the caption text (the shade stays, so `caption-zone.py` reads the shaded plate), `mark: false` hides 3.
 */
const STYLE = {preset: 'outline', bottomEdgeY: 1344, scale: CAPTION_SCALE, ...CAPTION_OUTLINE} as const;
export const Edu32Chrome = ({captions = true, text = true, mark = true}: {captions?: boolean; text?: boolean; mark?: boolean}) => {
  const g = useCurrentFrame();
  const shot = EDU32_SHOTS.find((s) => g >= s.start && g < s.start + s.len);
  const pose = captions && text ? captionPose32(g) : null;
  const lo = labelOpacity(g);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: "'Noto Sans Thai', sans-serif"}}>
      {captions && shot && <CaptionShade tl={(g - shot.start) / FPS} cues={shadeCuesOf(shot.start, shot.len)} strength={shadeStrengthAt(shot.id, g)} bottomEdgeY={1344} scale={CAPTION_SCALE} />}
      {pose && (
        <AbsoluteFill style={{opacity: pose.opacity, transform: `translateY(${pose.dy}px) scale(${pose.scale})`, transformOrigin: '540px 1272px'}}>
          <Subtitles text={pose.card.text} style={STYLE} />
        </AbsoluteFill>
      )}
      {mark && <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 22, ...channelLabelLook('outline', '#fff1da')}}>{MARK_TEXT}</span>}
      {mark && lo > 0 && (
        <span lang="th" style={{position: 'absolute', top: 166, left: 120, opacity: lo, padding: '4px 14px 6px', borderRadius: 14, background: 'rgba(24,34,62,0.78)', color: '#fff1da',
          fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600, fontSize: 24, lineHeight: 1.4, whiteSpace: 'nowrap'}}>{LABEL_TEXT}</span>
      )}
    </AbsoluteFill>
  );
};
