import {Footer} from './Footer';
import {resolveChannelName, type ChannelName} from '../config/channel';
import {BedroomPOV, bedroomPOVAt, bedEndPlacement} from '../assets/backgrounds/BedroomPOV';
import {Camera, cameraAt} from '../camera/Camera';
import {costumes} from '../rig/costumes';
import {Ghost} from '../rig/Ghost';
import {
  AbsoluteFill,
  Freeze,
  Audio,
  staticFile,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {sofaSeat} from '../assets/props/Sofa';
import {poseWeightAt} from '../rig/poses';
import {Background} from '../assets/Background';
import {SceneProp} from '../assets/Props';
import {Character, Cat, Dog, type PoseName} from '../rig';
import {Subtitles} from './Subtitles';
import {
  actorIdentity,
  actorPoseTrack,
  actorPosition,
  layoutActor,
  poseAt,
  sceneFrames,
  validateTimeline,
} from './timeline';
import {mouthAt} from '../rig/drivers';
import {endingState, type Ending} from './endings';
import type {Timeline, Scene} from './types';

export type Narration = {
  src: string;
  amplitude: readonly number[];
  fps: number;
  startFrame?: number;
};
export type SceneRendererProps = {
  timeline: Timeline;
  narration?: Narration | null;
  ending?: Ending;
  channelName?: ChannelName;
};

const SceneView = ({
  scene,
  index,
  total,
  previous,
  start,
  narration,
  ending,
  channelName,
}: {
  scene: Scene;
  index: number;
  total: number;
  previous?: Scene;
  start: number;
  narration?: Narration | null;
  ending: Ending;
  channelName?: ChannelName;
}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const portrait = height > width;
  const duration = sceneFrames(scene.durationSec, fps);
  const pov = scene.bg === 'houseInterior' && scene.background?.variant === 'bedroomPOV';
  const night = scene.time === 'night' || scene.time === 'moonlight' || pov;
  const final = index === total - 1;
  const state = endingState(frame, duration, fps, ending);
  const poseFrame = final ? state.poseFrame : frame;
  const audioFrame =
    ((start + frame - (narration?.startFrame ?? 0)) * (narration?.fps ?? fps)) / fps;
  const mouth = narration ? mouthAt(narration.amplitude, audioFrame) : 0;
  const ink = night ? '#fff1da' : '#49445c';
  const povState = bedroomPOVAt(poseFrame, fps, duration, scene.background?.blanketPull);
  const props = scene.props?.map((p, i) => (
    <SceneProp
      key={i}
      type={p.type}
      x={p.x * width}
      y={(p.y ?? 0.8) * height}
      size={(p.size ?? 240) * (portrait ? 1.1 : 1)}
      color={p.color}
      smoke={p.smoke}
      night={night}
    />
  ));
  const actors = scene.actors.map((actor, i) => {
    const identity = actorIdentity(actor, i);
    const prev = previous?.actors.find((a, j) => actorIdentity(a, j) === identity);
    const previousPose: PoseName = prev
      ? (prev.poses?.at(-1)?.pose ?? prev.pose ?? 'idle')
      : 'idle';
    const seat =
      actor.seat === 'sofa'
        ? {
            y: sofaSeat(width, height).y,
            amount: poseWeightAt(actorPoseTrack(actor, fps, previousPose), 'sit', poseFrame, fps),
          }
        : undefined;
    const basePosition = layoutActor(
      actor,
      actorPosition(actor, poseFrame, duration),
      width,
      height,
      seat,
    );
    const position =
      pov && actor.depth === 'bedEnd'
        ? bedEndPlacement(basePosition, actor, height, povState)
        : basePosition;
    const pose = poseAt(actor, poseFrame, fps, previousPose);
    const figure =
      actor.type === 'ghost' ? (
        <Ghost {...position} variant={actor.ghostVariant} opacity={actor.opacity} />
      ) : actor.type === 'narrator' ? (
        <Character
          {...(actor.character ? costumes[actor.character] : {})}
          {...actor}
          {...position}
          pose={pose}
          frame={poseFrame}
          mouth={mouth}
        />
      ) : actor.type === 'cat' ? (
        <Cat
          key={identity}
          {...position}
          color={actor.color}
          pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
          frame={poseFrame}
        />
      ) : (
        <Dog
          {...position}
          color={actor.color}
          pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
          frame={poseFrame}
        />
      );
    return (
      <div
        key={identity}
        style={{
          position: 'absolute',
          inset: 0,
          filter:
            scene.camera?.lighting === 'silhouette'
              ? 'brightness(0.18)'
              : pov && actor.depth === 'bedEnd'
                ? 'brightness(0.72) blur(0.7px)'
                : undefined,
        }}
      >
        {figure}
      </div>
    );
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: night ? '#424668' : '#f6e8d5',
        opacity: final ? state.opacity : 1,
        overflow: 'hidden',
        fontFamily: 'Noto Sans Thai, sans-serif',
      }}
    >
      <Camera
        camera={scene.camera}
        frame={poseFrame}
        duration={duration}
        width={width}
        height={height}
      >
        {pov ? (
          <BedroomPOV
            width={width}
            height={height}
            frame={poseFrame}
            fps={fps}
            duration={duration}
            options={scene.background}
          >
            {props}
            {actors}
          </BedroomPOV>
        ) : (
          <>
            <Background
              kind={scene.bg}
              time={scene.time}
              options={scene.background}
              view={scene.camera?.view}
              parallax={scene.camera?.parallax}
              panX={cameraAt(scene.camera, poseFrame, duration).x}
            />
            {props}

            {actors}
          </>
        )}
      </Camera>
      <div
        style={{
          position: 'absolute',
          left: width * 0.075,
          top: height * (portrait ? 0.085 : 0.067),
          color: ink,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [0, 18], [15, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
        }}
      >
        {scene.eyebrow && (
          <div style={{fontSize: portrait ? 24 : 21, fontWeight: 600, letterSpacing: 4}}>
            {scene.eyebrow}
          </div>
        )}
        {scene.title && (
          <div
            style={{
              fontFamily: 'Noto Sans Thai, sans-serif',
              fontSize: portrait ? 105 : 76,
              lineHeight: 1.13,
              fontWeight: 800,
              letterSpacing: -4,
              whiteSpace: 'pre-line',
              marginTop: 24,
            }}
          >
            {scene.title}
          </div>
        )}
        <div
          style={{
            width: 65,
            height: 7,
            borderRadius: 8,
            background: night ? '#ffdba4' : '#e5a08c',
            marginTop: 25,
          }}
        />
      </div>
      <Subtitles text={scene.subtitle} />
      <Footer
        width={width}
        height={height}
        index={index}
        total={total}
        progress={(frame + 1) / duration}
        night={night}
        channelName={scene.channelName === undefined ? channelName : scene.channelName}
      />
    </AbsoluteFill>
  );
};
/** Scenes are intentionally data-driven: edit JSON, never duplicate layout for aspect ratios. */
export const SceneRenderer = ({
  timeline,
  narration,
  ending = 'B_loop',
  channelName,
}: SceneRendererProps) => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  validateTimeline(timeline);
  const footerName = resolveChannelName(channelName);
  let start = 0;
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {narration && (
        <Sequence from={narration.startFrame ?? 0} premountFor={fps}>
          <Audio src={staticFile(narration.src)} />
        </Sequence>
      )}
      <Freeze frame={0} active={ending === 'B_loop' && frame === durationInFrames - 1}>
        {timeline.map((scene, index) => {
          const from = start;
          const duration = sceneFrames(scene.durationSec, fps);
          start += duration;
          return (
            <Sequence
              key={index}
              name={scene.eyebrow ?? scene.bg}
              from={from}
              durationInFrames={duration}
              premountFor={fps}
            >
              <SceneView
                scene={scene}
                index={index}
                total={timeline.length}
                previous={timeline[index - 1]}
                start={from}
                narration={narration}
                ending={ending}
                channelName={footerName}
              />
            </Sequence>
          );
        })}
      </Freeze>
    </AbsoluteFill>
  );
};
