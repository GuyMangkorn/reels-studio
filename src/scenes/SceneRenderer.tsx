import {exteriorPlacement} from '../assets/backgrounds/OldHouseExterior';
import {lieFloorAnchor, interiorPlacement} from '../assets/backgrounds/layout';
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
import {renderToStaticMarkup} from 'react-dom/server';
import {sofaSeat} from '../assets/props/Sofa';
import {poseWeightAt} from '../rig/poses';
import {Background} from '../assets/Background';
import {SceneProp} from '../assets/Props';
import {Character, CharacterArt, Cat, CatArt, Dog, DogArt, type PoseName} from '../rig';
import {ThreeStage} from '../three/ThreeStage';
import type {CutoutPlaneData} from '../three/CutoutPlane';
import {threeBackgroundComponents} from '../three/backgrounds/components';
import {resolveThreeBackground} from '../three/backgrounds/registry';
import {createSceneTextureLayers} from '../three/textureLayers';
import {setLayout} from '../assets/backgrounds/layout';
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
  const threeBackground = resolveThreeBackground(scene);
  const night = scene.time === 'night' || scene.time === 'moonlight' || pov;
  const final = index === total - 1;
  const state = endingState(frame, duration, fps, ending);
  const poseFrame = final ? state.poseFrame : frame;
  const audioFrame =
    ((start + frame - (narration?.startFrame ?? 0)) * (narration?.fps ?? fps)) / fps;
  const mouth = narration ? mouthAt(narration.amplitude, audioFrame) : 0;
  const ink = night ? '#fff1da' : '#49445c';
  const povState = bedroomPOVAt(poseFrame, fps, duration, scene.background?.blanketPull);
  const textureLayers = threeBackground
    ? createSceneTextureLayers(scene, width, height, poseFrame, fps, duration)
    : [];
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
  const cutouts: CutoutPlaneData[] = [];
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
    const scenePosition =
      pov && actor.depth === 'bedEnd'
        ? bedEndPlacement(basePosition, actor, height, povState)
        : scene.bg === 'oldHouseExterior'
          ? exteriorPlacement(
              basePosition,
              actor,
              width,
              height,
              threeBackground === 'exterior' ? 0.82 : undefined,
            )
          : scene.bg === 'houseInterior'
            ? interiorPlacement(basePosition, actor, width, height)
            : basePosition;
    const windowLayout = setLayout(width, height);
    const position =
      scene.bg === 'houseInterior' &&
      scene.background?.variant === 'window' &&
      actor.depth === 'window'
        ? {
            ...scenePosition,
            x: windowLayout.x + 790 * windowLayout.scale,
            y: 840 * windowLayout.scale,
            scale: (actor.scale ?? 1) * windowLayout.scale,
          }
        : scene.bg === 'houseInterior' && scene.background?.variant === 'staircase'
          ? {...scenePosition, scale: scenePosition.scale, y: (actor.y ?? 0.5) * height}
          : scenePosition;
    if (actor.type === 'narrator') {
      const lying = poseWeightAt(actorPoseTrack(actor, fps, previousPose), 'lie', poseFrame, fps);
      position.y = lieFloorAnchor(position.y, position.scale, lying);
    }
    const crawler = actor.type === 'ghost' && actor.ghostVariant === 'crawler';
    const artworkWidth =
      actor.type === 'narrator' ? 320 : actor.type === 'ghost' ? (crawler ? 420 : 380) : 300;
    const artworkHeight =
      actor.type === 'narrator' ? 430 : actor.type === 'ghost' ? (crawler ? 450 : 280) : 210;
    const footOffset =
      actor.type === 'narrator' ? 200 : actor.type === 'ghost' ? (crawler ? 225 : 120) : 95;
    const rigPosition = threeBackground
      ? {
          ...position,
          x: (artworkWidth / 2) * position.scale,
          y:
            (actor.type === 'narrator'
              ? 415
              : actor.type === 'ghost'
                ? crawler
                  ? 300
                  : 260
                : 200) * position.scale,
        }
      : position;
    const pose = poseAt(actor, poseFrame, fps, previousPose);
    const figure =
      actor.type === 'ghost' ? (
        <Ghost
          {...rigPosition}
          variant={actor.ghostVariant}
          opacity={actor.opacity}
          frame={poseFrame}
          fps={fps}
        />
      ) : actor.type === 'narrator' ? (
        threeBackground ? (
          <CharacterArt
            {...(actor.character ? costumes[actor.character] : {})}
            {...actor}
            {...rigPosition}
            pose={pose}
            frame={poseFrame}
            fps={fps}
            mouth={mouth}
          />
        ) : (
          <Character
            {...(actor.character ? costumes[actor.character] : {})}
            {...actor}
            {...position}
            pose={pose}
            frame={poseFrame}
            mouth={mouth}
          />
        )
      ) : actor.type === 'cat' ? (
        threeBackground ? (
          <CatArt
            {...rigPosition}
            color={actor.color}
            pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
            frame={poseFrame}
            fps={fps}
          />
        ) : (
          <Cat
            key={identity}
            {...position}
            color={actor.color}
            pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
            frame={poseFrame}
          />
        )
      ) : threeBackground ? (
        <DogArt
          {...rigPosition}
          color={actor.color}
          pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
          frame={poseFrame}
          fps={fps}
        />
      ) : (
        <Dog
          {...position}
          color={actor.color}
          pose={pose.to as 'idle' | 'walk' | 'sit' | 'wave'}
          frame={poseFrame}
        />
      );
    const silhouetteFilter =
      scene.camera?.lighting === 'silhouette' && actor.type === 'ghost'
        ? 'brightness(0.68)'
        : undefined;
    const actorContent = (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: silhouetteFilter,
        }}
      >
        {figure}
      </div>
    );
    if (threeBackground) {
      const svg = renderToStaticMarkup(figure);
      const z =
        actor.depth === 'window'
          ? -9.2
          : actor.depth === 'bedEnd'
            ? 3.4
            : scene.bg === 'houseInterior' && scene.background?.variant === 'staircase'
              ? -2.8
              : threeBackground === 'exterior'
                ? 2.4
                : 1.4;
      cutouts.push({
        id: identity,
        width,
        height,
        x: position.x,
        y: position.y,
        z,
        scale: position.scale,
        artworkWidth,
        artworkHeight,
        footOffset,
        svg: svg.replace(/style="([^"]*)"/, (_match, style: string) => {
          const opacity = /(?:^|;)\s*opacity:\s*([^;]+)/.exec(style)?.[1];
          const textureStyles = [
            opacity ? `opacity:${opacity}` : undefined,
            silhouetteFilter ? 'filter:brightness(0.68)' : undefined,
          ].filter(Boolean);
          return textureStyles.length ? `style="${textureStyles.join(';')}"` : '';
        }),
      });
      return null;
    }
    return <div key={identity}>{actorContent}</div>;
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
      {threeBackground ? (
        <ThreeStage
          width={width}
          height={height}
          frame={poseFrame}
          fps={fps}
          duration={duration}
          camera={scene.camera}
          impact={scene.impact}
          lamp={
            threeBackground === 'drawingRoom'
              ? {x: 0.82, y: 0.55, z: -2.42}
              : threeBackground === 'window'
                ? {x: 0.2, y: 0.63}
                : undefined
          }
          cutouts={cutouts}
          textureLayers={textureLayers}
        >
          {(() => {
            const Background3D = threeBackgroundComponents[threeBackground];
            return (
              <>
                <Background3D
                  width={width}
                  height={height}
                  frame={poseFrame}
                  fps={fps}
                  duration={duration}
                  time={scene.time ?? 'day'}
                  background={scene.background}
                  camera={scene.camera}
                  impact={scene.impact}
                />
                {actors}
              </>
            );
          })()}
        </ThreeStage>
      ) : (
        <Camera
          camera={scene.camera}
          frame={poseFrame}
          duration={duration}
          fps={fps}
          impact={pov ? scene.impact : undefined}
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
              impact={scene.impact}
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
      )}
      {(scene.eyebrow || scene.title) && (
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
      )}
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
