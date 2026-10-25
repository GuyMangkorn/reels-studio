import {Composition} from 'remotion';
import {SceneRenderer, type SceneRendererProps} from './scenes/SceneRenderer';
import amplitude from './amplitude.json';
import demo from '../scripts/demo.json';
import {timelineFrames, validateTimeline} from './scenes/timeline';
import type {Timeline} from './scenes/types';
const input: unknown = demo;
validateTimeline(input);
const demoTimeline: Timeline = input;
const narration = {src: 'narration.mp3', amplitude, fps: 30};
const Demo = (props: SceneRendererProps) => <SceneRenderer {...props}/>;
export const Root = () => <>
  <Composition id="Short" component={Demo} width={1080} height={1920} fps={30} durationInFrames={600} defaultProps={{timeline: demoTimeline, narration, ending: 'B_loop' as const}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? demoTimeline, 30)})}/>
  <Composition id="Long" component={Demo} width={1920} height={1080} fps={30} durationInFrames={600} defaultProps={{timeline: demoTimeline, narration, ending: 'B_loop' as const}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? demoTimeline, 30)})}/>
</>;
