import {Composition} from 'remotion';
import {SceneRenderer} from './scenes/SceneRenderer';
import demo from '../scripts/demo.json';
import {timelineFrames, validateTimeline} from './scenes/timeline';
import type {Timeline} from './scenes/types';
const input: unknown = demo;
validateTimeline(input);
const demoTimeline: Timeline = input;
const Demo = ({timeline = demoTimeline}: {timeline?: Timeline}) => <SceneRenderer timeline={timeline}/>;
export const Root = () => <>
  <Composition id="Short" component={Demo} width={1080} height={1920} fps={30} durationInFrames={600} defaultProps={{timeline: demoTimeline}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? demoTimeline, 30)})}/>
  <Composition id="Long" component={Demo} width={1920} height={1080} fps={30} durationInFrames={600} defaultProps={{timeline: demoTimeline}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? demoTimeline, 30)})}/>
</>;
