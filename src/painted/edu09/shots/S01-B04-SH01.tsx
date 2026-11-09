import {pianoCam, paintPiano, paintPianist, pianistHand, pressDepth, keysOf, PIANO_TUNE, tuneAt, TUNE_END} from '../piano';
import {TopLight, makeShot} from '../stage';

// S01-B04-SH01 (G 1214-1355) LF04 the pianist (L12). cam: pianoCam (yaw 80->74, r 34->31). SD05 tune: presses at PIANO_TUNE onsets (= the note onsets of the sound stem's M2, scripts/edu-series/ep09/sound-mix.py). Label on.
const N = 141;
export const shot = makeShot('S01-B04-SH01', {
  paper: '#2a2320', label: true,
  paint: (p, L) => {
    const cam = pianoCam(Math.min(1, L / TUNE_END)), press = tuneAt(L), onset = [...PIANO_TUNE].reverse().find((n) => n.f <= L)?.f ?? 0;
    paintPiano(p, cam, {pressed: keysOf(press)});
    paintPianist(p, cam, pianistHand(press, 2000, press.length ? pressDepth(L, onset) : 0));
  },
  overlay: () => <TopLight />,
});
void N;
