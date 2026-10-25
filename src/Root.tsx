import {Composition} from 'remotion';
import {SceneRenderer, type SceneRendererProps} from './scenes/SceneRenderer';
import hauntedHouse from '../scripts/haunted-house-p1.json';
import {timelineFrames, validateTimeline} from './scenes/timeline';
import type {Timeline} from './scenes/types';
const input: unknown = hauntedHouse;
validateTimeline(input);
const hauntedHouseTimeline: Timeline = input;
const Demo = (props: SceneRendererProps) => <SceneRenderer {...props} />;
export const Root = () => (
  <>
    <Composition
      id="Short"
      component={Demo}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={timelineFrames(hauntedHouseTimeline, 30)}
      defaultProps={{timeline: hauntedHouseTimeline, narration: null, ending: 'B_loop' as const}}
      calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({
        durationInFrames: timelineFrames(props.timeline ?? hauntedHouseTimeline, 30),
      })}
    />
    <Composition
      id="Long"
      component={Demo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={timelineFrames(hauntedHouseTimeline, 30)}
      defaultProps={{timeline: hauntedHouseTimeline, narration: null, ending: 'B_loop' as const}}
      calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({
        durationInFrames: timelineFrames(props.timeline ?? hauntedHouseTimeline, 30),
      })}
    />
  </>
);
