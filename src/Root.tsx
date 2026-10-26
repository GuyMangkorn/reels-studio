import {Composition} from 'remotion';
import {SceneRenderer, type SceneRendererProps} from './scenes/SceneRenderer';
import catboxBlockout from '../scripts/cat-boxes/blockout.json';
import {timelineFrames, validateTimeline} from './scenes/timeline';
import type {Timeline} from './scenes/types';
const input: unknown = catboxBlockout;
validateTimeline(input);
const catboxTimeline: Timeline = input;
const Episode = (props: SceneRendererProps) => <SceneRenderer {...props}/>;
export const Root = () => <>
  <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={16200} defaultProps={{timeline: catboxTimeline, ending: 'B_loop' as const}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? catboxTimeline, 30)})}/>
  <Composition id="Long" component={Episode} width={1920} height={1080} fps={30} durationInFrames={16200} defaultProps={{timeline: catboxTimeline, ending: 'B_loop' as const}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? catboxTimeline, 30)})}/>
</>;
