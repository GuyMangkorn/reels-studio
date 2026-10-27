import {Composition, Folder} from 'remotion';
import {SceneRenderer, type SceneRendererProps} from './scenes/SceneRenderer';
import {timelineFrames} from './scenes/timeline';
import {collectEpisodes} from './videos/registry';
import {FORMATS, type EpisodeVideos} from './videos/types';

// Every `src/videos/<episode>/index.ts` registers itself; adding an episode never edits this file.
const context = require.context('./videos', true, /^\.\/[^/]+\/index\.ts$/);
const episodes = collectEpisodes(context.keys().map(key => (context(key) as {default: EpisodeVideos}).default));

const Episode = (props: SceneRendererProps) => <SceneRenderer {...props}/>;

export const Root = () => <>
  {episodes.map(({episode, videos}) => <Folder key={episode} name={episode}>
    {videos.map(({id, format, timeline, ...props}) => {
      const {fps, ...size} = FORMATS[format];
      return <Composition key={id} id={id} component={Episode} {...size} fps={fps} durationInFrames={timelineFrames(timeline, fps)} defaultProps={{timeline, ...props}} calculateMetadata={({props: input}: {props: {timeline?: SceneRendererProps['timeline']}}) => ({durationInFrames: timelineFrames(input.timeline ?? timeline, fps)})}/>;
    })}
  </Folder>)}
</>;
