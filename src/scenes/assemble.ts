import type {PaintedShotCue, SceneSoundCue, Timeline} from './types';

type Cut = {id: string; start: number; end: number};
type Timed<T> = {at: number; cue: T};
type Assembly = {
  cuts: readonly Cut[];
  /** Native absolute clock units per second: 30 for frames, 1 for seconds. */
  clockRate: number;
  /** Round local seconds after subtraction only; omit to retain frame-clock arithmetic. */
  precision?: number;
  shots: readonly Timed<Omit<PaintedShotCue, 'atSec'>>[];
  captions: readonly {at: number; text: string}[];
  sounds?: readonly Timed<Omit<SceneSoundCue, 'atSec'>>[];
};

/**
 * Build painted scenes from absolute-clock tracks. A cut owns onsets in [start,end); no cue is carried, trimmed or
 * sorted. Projects prepare retiming and caption-gap events before assembly, then add their own scrims/overlays.
 * The shared renderer remains responsible for interpreting the resulting existing Timeline contract.
 */
export function assemblePaintedTimeline({cuts, clockRate, precision, shots, captions, sounds = []}: Assembly): Timeline {
  if (!Number.isFinite(clockRate) || clockRate <= 0) throw new Error('assembly.clockRate must be finite and positive');
  if (precision !== undefined && (!Number.isInteger(precision) || precision < 0 || precision > 15)) throw new Error('assembly.precision must be an integer from 0 to 15');
  if (cuts.length === 0) throw new Error('assembly.cuts must not be empty');
  cuts.forEach((cut, i) => {
    if (!Number.isFinite(cut.start) || !Number.isFinite(cut.end) || cut.end <= cut.start || (i > 0 && cut.start !== cuts[i - 1].end)) {
      throw new Error(`${cut.id}: cuts must be finite, positive-length and contiguous`);
    }
  });
  for (const [name, events] of [['painted', shots], ['caption', captions], ['sound', sounds]] as const) {
    if (events.some(event => !Number.isFinite(event.at))) throw new Error(`assembly.${name} onset must be finite`);
  }
  const seconds = (units: number) => {
    const value = units / clockRate;
    return precision === undefined ? value : Math.round(value * 10 ** precision) / 10 ** precision;
  };
  const within = (at: number, cut: Cut) => at >= cut.start && at < cut.end;
  const localize = <T,>(events: readonly Timed<T>[], cut: Cut) => events
    .filter(event => within(event.at, cut))
    .map(({at, cue}) => ({...cue, atSec: seconds(at - cut.start)}));

  return cuts.map(cut => {
    const sceneShots = localize(shots, cut);
    const subtitleCues = captions.filter(cue => within(cue.at, cut)).map(cue => ({atSec: seconds(cue.at - cut.start), text: cue.text}));
    const sfx = localize(sounds, cut);
    if (!sceneShots.length || sceneShots[0].atSec !== 0) throw new Error(`${cut.id}: first painted cue must start at the scene start`);
    if (!subtitleCues.length || subtitleCues[0].atSec !== 0) throw new Error(`${cut.id}: first caption must start at the scene start`);
    return {
      durationSec: seconds(cut.end - cut.start), bg: 'none', actors: [],
      subtitle: subtitleCues.map(cue => cue.text).filter(Boolean).join(' '),
      subtitleCues, painted: {shots: sceneShots}, ...(sfx.length ? {sfx} : {}),
    };
  });
}
