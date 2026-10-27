import {validateTimeline} from '../scenes/timeline';
import {validateVideoStyle} from '../scenes/media';
import {FORMATS, type EpisodeVideos} from './types';

/** Validate every episode's timelines and reject composition IDs claimed by two videos. */
export const collectEpisodes = (episodes: EpisodeVideos[]): EpisodeVideos[] => {
  const owners = new Map<string, string>();
  for (const {episode, videos} of episodes) {
    for (const video of videos) {
      const owner = owners.get(video.id);
      if (owner) throw new Error(`Composition ID "${video.id}" is registered by both ${owner} and ${episode}`);
      owners.set(video.id, episode);
      validateTimeline(video.timeline, FORMATS[video.format].fps);
      validateVideoStyle(video, video.id);
    }
  }
  return [...episodes].sort((a, b) => a.episode.localeCompare(b.episode));
};
