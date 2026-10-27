import {AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {sofaSeat} from '../assets/props/Sofa';
import {poseWeightAt} from '../rig/poses';
import {Background} from '../assets/Background';
import {SceneProp} from '../assets/Props';
import {Character, Cat, Dog, type PoseName} from '../rig';
import {Subtitles} from './Subtitles';
import {actorIdentity, actorPoseTrack, actorPosition, layoutActor, layoutSceneProp, pictureMoveAt, poseAt, propVisibleAt, sceneFrames, subtitleAt, validateTimeline} from './timeline';
import {layoutWorldActor, layoutWorldProp, orthographicViewAt, worldPositionAt, worldPropPositionAt} from './projection';
import {mouthAt} from '../rig/drivers';
import {endingState, type Ending} from './endings';
import type {Timeline, Scene} from './types';
import {visualAt} from '../assets/visuals/types';
import {VisualStage} from '../assets/visuals/VisualStage';

export type Narration = {src: string; amplitude: readonly number[]; fps: number; startFrame?: number};
export type SceneRendererProps = {timeline: Timeline; narration?: Narration; ending?: Ending; sceneTransitionFrames?: number; loopFadeFrames?: number};

const transitionOpacityAt = (frame: number, timeline: Timeline, fps: number, transitionFrames: number) => {
  if (transitionFrames <= 0 || timeline.length < 2) return 0;
  const radius = Math.max(1, transitionFrames / 2);
  let boundary = 0;
  let opacity = 0;
  for (let i = 0; i < timeline.length - 1; i++) {
    boundary += sceneFrames(timeline[i].durationSec, fps);
    const progress = Math.max(0, 1 - Math.abs(frame - boundary) / radius);
    opacity = Math.max(opacity, progress * 0.75);
  }
  return opacity;
};

const loopFadeOpacityAt = (frame: number, duration: number, ending: Ending, fadeFrames: number) => {
  if (ending !== 'B_loop' || fadeFrames <= 0) return 0;
  const start = Math.max(0, 1 - frame / fadeFrames);
  const end = Math.max(0, 1 - (duration - 1 - frame) / fadeFrames);
  return Math.min(1, Math.max(start, end));
};

const ProjectedSceneStage = ({scene, previous, poseFrame, width, height, fps, mouth}: {
  scene: Scene; previous?: Scene; poseFrame: number; width: number; height: number; fps: number; mouth: number;
}) => {
  const projection = scene.projection!;
  const portrait = height > width;
  const stageFrame = poseFrame;
  const view = orthographicViewAt(projection, width, height, stageFrame, fps, portrait);
  const pictureMove = pictureMoveAt(scene, stageFrame, fps);
  const duration = sceneFrames(scene.durationSec, fps);
  const night = scene.time === 'night';
  const worldProps = (layer: 'back' | 'front') => scene.props?.map((prop, i) => {
    if (prop.space !== 'world' || !propVisibleAt(prop, stageFrame, fps, duration)) return null;
    const splitBox = prop.type === 'catbox-old';
    if (!splitBox && (prop.layer ?? 'back') !== layer) return null;
    const layout = layoutWorldProp({...prop, world: worldPropPositionAt(prop, stageFrame, fps)}, view);
    return <SceneProp key={`world-${layer}-${i}`} type={prop.type} part={splitBox ? layer === 'back' ? 'rear' : 'front' : undefined} x={layout.x} y={layout.y} width={layout.width} height={layout.height} color={prop.color} night={night} label={prop.label} detail={prop.detail} variant={prop.variant} tone={prop.tone}/>;
  });
  return <div style={{position: 'absolute', inset: 0, transform: `translate3d(${pictureMove.x * width}px, ${pictureMove.y * height}px, 0) scale(${pictureMove.scale})`, transformOrigin: '50% 50%', willChange: 'transform'}}>
    <Background kind={scene.bg} time={scene.time} physicalStage={projection.stage} physicalView={view.view}/>
    {worldProps('back')}
    {scene.actors.map((actor, i) => {
      const identity = actorIdentity(actor, i);
      const prev = previous?.actors.find((candidate, j) => actorIdentity(candidate, j) === identity);
      const previousPose: PoseName = prev ? (prev.poses?.at(-1)?.pose ?? prev.pose ?? 'idle') : 'idle';
      const track = actorPoseTrack(actor, fps, previousPose);
      const point = worldPositionAt(actor.world!.keys, poseFrame, fps);
      const layout = layoutWorldActor(actor, point, view);
      const pose = poseAt(actor, poseFrame, fps, previousPose);
      const sitWeight = actor.type === 'cat' ? poseWeightAt(track, 'sit', poseFrame, fps) : 0;
      const walkWeight = actor.type === 'cat' ? poseWeightAt(track, 'walk', poseFrame, fps) : 0;
      return actor.type === 'narrator' ? <Character key={identity} {...actor} {...layout} pose={pose} frame={poseFrame} mouth={mouth} seatWeight={layout.seatWeight}/> : actor.type === 'cat' ? <Cat key={identity} {...layout} color={actor.color} pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'} frame={poseFrame} physicalPose physicalSitWeight={sitWeight} physicalWalkWeight={walkWeight}/> : <Dog key={identity} {...layout} color={actor.color} pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'} frame={poseFrame}/>;
    })}
    {worldProps('front')}
  </div>;
};

const SceneView = ({scene, index, total, previous, start, narration, ending}: {scene: Scene; index: number; total: number; previous?: Scene; start: number; narration?: Narration; ending: Ending}) => {
  const frame = useCurrentFrame(); const {width, height, fps} = useVideoConfig(); const portrait = height > width;
  const duration = sceneFrames(scene.durationSec, fps); const night = scene.time === 'night';
  const final = index === total - 1;
  const state = endingState(frame, duration, fps, ending);
  const poseFrame = final ? state.poseFrame : frame;
  const sceneFrame = poseFrame;
  const pictureMove = pictureMoveAt(scene, sceneFrame, fps);
  const audioFrame = (start + frame - (narration?.startFrame ?? 0)) * (narration?.fps ?? fps) / fps;
  const mouth = narration ? mouthAt(narration.amplitude, audioFrame) : 0;
  const ink = night ? '#fff1da' : '#49445c';
  const renderProps = (layer: 'back' | 'front') => scene.props?.map((p, i) => {
    if (scene.projection) return null;
    if ((p.layer ?? 'back') !== layer || !propVisibleAt(p, sceneFrame, fps, duration)) return null;
    const placement = layoutSceneProp(p, width, height);
    return <SceneProp key={`${layer}-${i}`} type={p.type} x={placement.x} y={placement.y} size={placement.size} color={p.color} night={night} label={p.label} detail={p.detail} variant={p.variant} tone={p.tone}/>;
  });
  return <AbsoluteFill style={{backgroundColor: night ? '#424668' : '#f6e8d5', opacity: final ? state.opacity : 1, overflow: 'hidden', fontFamily: 'Noto Sans Thai, sans-serif'}}>
    {scene.projection ? <ProjectedSceneStage scene={scene} previous={previous} poseFrame={poseFrame} width={width} height={height} fps={fps} mouth={mouth}/> : <div style={{position: 'absolute', inset: 0, transform: `translate3d(${pictureMove.x * width}px, ${pictureMove.y * height}px, 0) scale(${pictureMove.scale})`, transformOrigin: '50% 50%', willChange: 'transform'}}>
      <Background kind={scene.bg} time={scene.time}/>
      {renderProps('back')}
      {scene.actors.map((actor, i) => {
        const identity = actorIdentity(actor, i);
        const prev = previous?.actors.find((a, j) => actorIdentity(a, j) === identity);
        const previousPose: PoseName = prev ? (prev.poses?.at(-1)?.pose ?? prev.pose ?? 'idle') : 'idle';
        const seat = actor.seat === 'sofa' ? {y: sofaSeat(width, height).y, amount: poseWeightAt(actorPoseTrack(actor, fps, previousPose), 'sit', poseFrame, fps)} : undefined;
        const position = layoutActor(actor, actorPosition(actor, poseFrame, duration, portrait), width, height, seat);
        const pose = poseAt(actor, poseFrame, fps, previousPose);
        return actor.type === 'narrator' ? <Character key={identity} {...actor} {...position} pose={pose} frame={poseFrame} mouth={mouth}/> : actor.type === 'cat' ? <Cat key={identity} {...position} color={actor.color} pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'} frame={poseFrame}/> : <Dog key={identity} {...position} color={actor.color} pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'} frame={poseFrame}/>;
      })}
      {renderProps('front')}
    </div>}
    {scene.projection && scene.props?.filter(prop => prop.space === 'screen').map((prop, i) => {
      if (!propVisibleAt(prop, sceneFrame, fps, duration)) return null;
      const placement = layoutSceneProp(prop, width, height);
      return <SceneProp key={`screen-${i}`} type={prop.type} x={placement.x} y={placement.y} size={placement.size} color={prop.color} night={night} label={prop.label} detail={prop.detail} variant={prop.variant} tone={prop.tone}/>;
    })}
    {visualAt(scene.visuals, sceneFrame, fps) && <VisualStage visual={visualAt(scene.visuals, sceneFrame, fps)!} frame={sceneFrame} fps={fps} width={width} height={height} physical={Boolean(scene.projection)}/>}
    {(scene.eyebrow || scene.title) && <div style={{position: 'absolute', left: width * .075, top: height * (portrait ? .085 : .067), color: ink, opacity: interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `translateY(${interpolate(frame, [0, 18], [15, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`}}>
      {scene.eyebrow && <div style={{fontSize: portrait ? 24 : 21, fontWeight: 600, letterSpacing: 4}}>{scene.eyebrow}</div>}
      {scene.title && <div style={{fontFamily: 'Noto Sans Thai, sans-serif', fontSize: portrait ? 105 : 76, lineHeight: 1.13, fontWeight: 800, letterSpacing: -4, whiteSpace: 'pre-line', marginTop: 24}}>{scene.title}</div>}
      <div style={{width: 65, height: 7, borderRadius: 8, background: night ? '#ffdba4' : '#e5a08c', marginTop: 25}}/>
    </div>}
    <Subtitles text={subtitleAt(scene, sceneFrame, fps)}/>
    <div style={{position: 'absolute', bottom: portrait ? 53 : 24, left: width * .075, right: width * .075, display: 'flex', alignItems: 'center', gap: 12}}>
      {Array.from({length: total}, (_, i) => <div key={i} style={{height: 4, flex: 1, borderRadius: 8, background: night ? '#ffffff25' : '#49445c20', overflow: 'hidden'}}><div style={{height: '100%', width: `${i < index ? 100 : i === index ? (frame + 1) / duration * 100 : 0}%`, background: night ? '#ffe0a8' : '#77718f'}}/></div>)}
      <span lang="th" style={{fontSize: 19, color: ink, marginLeft: 12}}>ทำไมล่ะ</span>
    </div>
  </AbsoluteFill>;
};
/** Scenes are intentionally data-driven: edit JSON, never duplicate layout for aspect ratios. */
export const SceneRenderer = ({timeline, narration, ending = 'B_loop', sceneTransitionFrames = 0, loopFadeFrames = 0}: SceneRendererProps) => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  validateTimeline(timeline);
  const transitionOpacity = transitionOpacityAt(frame, timeline, fps, sceneTransitionFrames);
  const loopOpacity = loopFadeOpacityAt(frame, durationInFrames, ending, loopFadeFrames);
  const pictureOpacity = Math.max(transitionOpacity, loopOpacity);
  let start = 0;
  return <AbsoluteFill style={{backgroundColor: 'black'}}>{narration && <Sequence from={narration.startFrame ?? 0} premountFor={fps}><Audio src={staticFile(narration.src)}/></Sequence>}{timeline.map((scene, index) => {
    const from = start; const duration = sceneFrames(scene.durationSec, fps); start += duration;
    return <Sequence key={index} name={scene.eyebrow ?? scene.bg} from={from} durationInFrames={duration} premountFor={fps}><SceneView scene={scene} index={index} total={timeline.length} previous={timeline[index - 1]} start={from} narration={narration} ending={ending}/></Sequence>;
  })}{pictureOpacity > 0 && <AbsoluteFill style={{backgroundColor: '#101018', opacity: pictureOpacity, pointerEvents: 'none'}}/>}</AbsoluteFill>;
};
