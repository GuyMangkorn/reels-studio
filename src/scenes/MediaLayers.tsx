import type {ReactNode} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipVisibleAt, duckGainAt, entryTransitionStyle, resolveSrc, trackFadeAt} from './media';
import {quadAt, quadMatrix3d, quadTextEnterAt, quadTextVisibleAt} from './quadText';
import type {AudioTrack, MediaClip, QuadText, SceneSoundCue, SceneTransition} from './types';

type NarrationClock = {amplitude: readonly number[]; fps: number; startFrame?: number};

/** Footage and stills for one layer of a scene; `frame` is the scene-local clock. */
export const MediaLayer = ({clips, layer, frame}: {clips?: MediaClip[]; layer: 'back' | 'front'; frame: number}) => {
  const {width, height, fps} = useVideoConfig();
  return <>{clips?.map((clip, i) => {
    if ((clip.layer ?? 'back') !== layer || !clipVisibleAt(clip, frame, fps)) return null;
    const box = clip.box ?? {x: 0, y: 0, width: 1, height: 1};
    const style = {position: 'absolute' as const, left: box.x * width, top: box.y * height, width: box.width * width, height: box.height * height, objectFit: clip.fit ?? 'cover', opacity: clip.opacity ?? 1};
    const src = resolveSrc(clip.src, staticFile);
    if (clip.kind === 'image') return <Img key={i} src={src} style={style}/>;
    return <Sequence key={i} from={Math.round((clip.startSec ?? 0) * fps)} layout="none">
      <OffthreadVideo src={src} style={style} trimBefore={Math.round((clip.trimStartSec ?? 0) * fps)} playbackRate={clip.playbackRate ?? 1} volume={clip.volume ?? 0} muted={!clip.volume}/>
    </Sequence>;
  })}</>;
};

/** One-shot cues of a scene, mounted on the composition clock at the scene start. */
export const SceneSounds = ({cues, sceneStart}: {cues?: SceneSoundCue[]; sceneStart: number}) => {
  const {fps} = useVideoConfig();
  return <>{cues?.map((cue, i) => <Sequence key={i} from={sceneStart + Math.round(cue.atSec * fps)} durationInFrames={cue.durationSec === undefined ? undefined : Math.max(1, Math.round(cue.durationSec * fps))} layout="none">
    <Audio src={resolveSrc(cue.src, staticFile)} trimBefore={Math.round((cue.trimStartSec ?? 0) * fps)} volume={cue.volume ?? 1}/>
  </Sequence>)}</>;
};

/** Music/ambience on the composition clock with fades and optional ducking under narration. */
export const AudioTracks = ({tracks, narration}: {tracks?: AudioTrack[]; narration?: NarrationClock}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return <>{tracks?.map((track, i) => {
    const start = Math.round((track.startSec ?? 0) * fps);
    const end = Math.min(durationInFrames, track.endSec === undefined ? durationInFrames : Math.round(track.endSec * fps));
    if (end <= start) return null;
    const length = end - start;
    const volume = (f: number) => {
      const duck = track.duckUnderNarration !== undefined && narration ? duckGainAt(narration.amplitude, (start + f - (narration.startFrame ?? 0)) * narration.fps / fps, track.duckUnderNarration) : 1;
      return (track.volume ?? 1) * trackFadeAt(track, f, length, fps) * duck;
    };
    return <Sequence key={i} from={start} durationInFrames={length} layout="none">
      <Audio src={resolveSrc(track.src, staticFile)} loop={track.loop} trimBefore={Math.round((track.trimStartSec ?? 0) * fps)} volume={volume}/>
    </Sequence>;
  })}</>;
};

/** Wraps the incoming scene while it enters over the previous one. */
export const EntryTransition = ({entry, children}: {entry: SceneTransition; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={entryTransitionStyle(entry, frame)}>{children}</AbsoluteFill>;
};

/** Text warped onto a per-frame screen quad; `frame` is the scene-local clock. */
export const QuadTextLayer = ({overlays, frame}: {overlays?: QuadText[]; frame: number}) => <>{overlays?.map((overlay, i) => {
  if (!quadTextVisibleAt(overlay, frame)) return null;
  const {width, height} = overlay.box ?? {width: 640, height: 400};
  const enter = quadTextEnterAt(overlay, frame);
  return <div key={i} lang="th" style={{position: 'absolute', left: 0, top: 0, width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '0 0', transform: quadMatrix3d(width, height, quadAt(overlay, frame - (overlay.startFrame ?? 0))), color: overlay.color ?? '#1B3A57', fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: overlay.fontWeight ?? 800, fontSize: overlay.fontSize ?? 180, lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', ...(enter < 1 ? {opacity: enter} : {})}}>{enter < 1 ? <span style={{display: 'inline-block', transform: `scale(${0.88 + 0.12 * enter})`}}>{overlay.text}</span> : overlay.text}</div>;
})}</>;
