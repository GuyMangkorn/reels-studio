import {Composition} from 'remotion';
import {SceneRenderer, type SceneRendererProps} from './scenes/SceneRenderer';
import catboxBlockout from '../scripts/cat-boxes/blockout.json';
import catboxLongBlockout from '../scripts/cat-boxes/blockout-long.json';
import catboxShortC01 from '../scripts/cat-boxes/short-c01.json';
import catboxShortC02 from '../scripts/cat-boxes/short-c02.json';
import catboxShortC03 from '../scripts/cat-boxes/short-c03.json';
import catboxShortC04 from '../scripts/cat-boxes/short-c04.json';
import catboxShortC05 from '../scripts/cat-boxes/short-c05.json';
import catboxShortC06 from '../scripts/cat-boxes/short-c06.json';
import {timelineFrames, validateTimeline} from './scenes/timeline';
import type {Timeline} from './scenes/types';
const input: unknown = catboxBlockout;
validateTimeline(input);
const catboxTimeline: Timeline = input;
const Episode = (props: SceneRendererProps) => <SceneRenderer {...props}/>;
const catboxShorts: Array<{id: string; timeline: Timeline}> = [
  {id: 'CATBOX-C01-Short', timeline: catboxShortC01 as Timeline},
  {id: 'CATBOX-C02-Short', timeline: catboxShortC02 as Timeline},
  {id: 'CATBOX-C03-Short', timeline: catboxShortC03 as Timeline},
  {id: 'CATBOX-C04-Short', timeline: catboxShortC04 as Timeline},
  {id: 'CATBOX-C05-Short', timeline: catboxShortC05 as Timeline},
  {id: 'CATBOX-C06-Short', timeline: catboxShortC06 as Timeline},
];
catboxShorts.forEach(short => validateTimeline(short.timeline));
export const Root = () => <>
  <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={16200} defaultProps={{timeline: catboxTimeline, ending: 'B_loop' as const, sceneTransitionFrames: 12, loopFadeFrames: 12}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? catboxTimeline, 30)})}/>
  <Composition id="Long" component={Episode} width={1920} height={1080} fps={30} durationInFrames={16200} defaultProps={{timeline: catboxLongBlockout as Timeline, ending: 'B_loop' as const}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? (catboxLongBlockout as Timeline), 30)})}/>
  {catboxShorts.map(({id, timeline}) => <Composition key={id} id={id} component={Episode} width={1080} height={1920} fps={30} durationInFrames={1350} defaultProps={{timeline, ending: 'A_fade' as const, loopFadeFrames: 12, sceneTransitionFrames: 12}} calculateMetadata={({props}: {props: {timeline?: Timeline}}) => ({durationInFrames: timelineFrames(props.timeline ?? timeline, 30)})}/>)}
</>;
