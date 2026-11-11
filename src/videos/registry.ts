import {validateTimeline} from '../scenes/timeline';
import {validateVideoStyle} from '../scenes/media';
import {CHANNEL_MARKS, FORMATS, type EpisodeVideos} from './types';

/** An episode with a channel: videos that leave `chrome.channelLabel` unset take the channel's mark. No channel = unchanged (the `edu` code default applies). */
const withChannelMark = (entry: EpisodeVideos): EpisodeVideos => entry.channel === undefined ? entry : {
  ...entry,
  videos: entry.videos.map(video => video.chrome?.channelLabel !== undefined ? video : {...video, chrome: {...video.chrome, channelLabel: CHANNEL_MARKS[entry.channel!]}}),
};

/** Validate every episode's timelines, reject composition IDs claimed by two videos and give each video its channel's mark. */
export const collectEpisodes = (episodes: EpisodeVideos[]): EpisodeVideos[] => {
  const owners = new Map<string, string>();
  for (const {episode, channel, videos} of episodes) {
    if (channel !== undefined && !Object.hasOwn(CHANNEL_MARKS, channel)) throw new Error(`Episode ${episode} names unknown channel "${channel}" (src/videos/types.ts CHANNEL_MARKS)`);
    for (const video of videos) {
      const owner = owners.get(video.id);
      if (owner) throw new Error(`Composition ID "${video.id}" is registered by both ${owner} and ${episode}`);
      owners.set(video.id, episode);
      validateTimeline(video.timeline, FORMATS[video.format].fps);
      validateVideoStyle(video, video.id);
      const lastSec = video.timeline.at(-1)!.durationSec;
      if (video.loopBlendFrames !== undefined && video.loopBlendFrames >= Math.round(lastSec * FORMATS[video.format].fps)) throw new Error(`Video ${video.id} loopBlendFrames must be shorter than the last scene`);
    }
  }
  return episodes.map(withChannelMark).sort((a, b) => a.episode.localeCompare(b.episode));
};
