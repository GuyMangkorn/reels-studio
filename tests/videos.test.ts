import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, existsSync} from 'node:fs';
import path from 'node:path';
import {collectEpisodes} from '../src/videos/registry';
import {CHANNEL_MARKS, type ChannelId, type EpisodeVideos} from '../src/videos/types';
import {defaultChrome} from '../src/scenes/media';

// Mirrors Root.tsx discovery: one `src/videos/<episode>/index.ts` per episode.
const dir = path.resolve('src/videos');
const loadEpisodes = async () => Promise.all(readdirSync(dir, {withFileTypes: true})
  .filter(entry => entry.isDirectory() && existsSync(path.join(dir, entry.name, 'index.ts')))
  .map(async entry => ((await import(path.join(dir, entry.name, 'index.ts'))) as {default: EpisodeVideos}).default));

test('every episode registry validates and composition IDs are unique', async () => {
  const episodes = collectEpisodes(await loadEpisodes());
  assert.ok(episodes.some(({episode}) => episode === 'cat-boxes'));
  for (const {episode, videos} of episodes) assert.ok(videos.length > 0, `${episode} registers no videos`);
});

test('existing CATBOX composition IDs stay stable', async () => {
  const ids = collectEpisodes(await loadEpisodes()).flatMap(({videos}) => videos.map(({id}) => id));
  for (const id of ['Short', 'Long', 'CATBOX-C01-Short', 'CATBOX-C06-Short']) assert.ok(ids.includes(id), id);
});

test('a composition ID claimed by two episodes is rejected', () => {
  const video = {id: 'X', format: 'short' as const, timeline: [{durationSec: 1, bg: 'room' as const, actors: [], subtitle: ''}]};
  assert.throws(() => collectEpisodes([{episode: 'a', videos: [video]}, {episode: 'b', videos: [video]}]), /registered by both a and b/);
});

test('an episode channel sets the mark of videos that leave it unset', () => {
  const video = (id: string, chrome?: EpisodeVideos['videos'][number]['chrome']) => ({id, format: 'short' as const, timeline: [{durationSec: 1, bg: 'room' as const, actors: [], subtitle: ''}], chrome});
  assert.equal(CHANNEL_MARKS.edu, defaultChrome.channelLabel);
  const [{videos}] = collectEpisodes([{episode: 'f', channel: 'fiction', videos: [video('A'), video('B', {progressBar: true}), video('C', {channelLabel: false}), video('D', {channelLabel: 'x'})]}]);
  assert.deepEqual(videos.map(({chrome}) => chrome?.channelLabel), ['@mg.fiction', '@mg.fiction', false, 'x']);
  assert.equal(videos[1].chrome?.progressBar, true);
  const plain = {episode: 'e', videos: [video('E')]};
  assert.equal(collectEpisodes([plain])[0], plain);
  assert.throws(() => collectEpisodes([{episode: 'z', channel: 'nope' as ChannelId, videos: [video('F')]}]), /unknown channel "nope"/);
});
