// S01 hit/transformation checks on the built stems (Editor, round 3): RMS per 6 frames G1070-1262, first/last non-zero sample, max sample step at the cuts.
/* global console */
import {SR, decode, db} from './audio-lib.mjs';
const D = 'out/wendigo/audio/', sound = decode(`${D}WDG-EP01-SHORT_sound.wav`, {ch: 2}), voice = decode(`${D}WDG-EP01-SHORT_voice.wav`);
const fr = (g) => Math.round(g * SR / 30);
const rms = (a, ch, g0, g1) => { let t = 0, n = 0; for (let i = fr(g0); i < fr(g1); i++) for (let c = 0; c < ch; c++) { t += a[i * ch + c] ** 2; n++; } return db(Math.sqrt(t / n)); };
const row = []; for (let g = 1070; g < 1262; g += 6) row.push(`${g}:${rms(sound, 2, g, g + 6).toFixed(0)}/${rms(voice, 1, g, g + 6).toFixed(0)}`);
console.log('G:soundRMS/voiceRMS dBFS per 6 frames\n' + row.join(' '));
let last = 0; for (let i = fr(1262) - 1; i >= fr(1000); i--) if (Math.abs(sound[2 * i]) > 1e-7 || Math.abs(sound[2 * i + 1]) > 1e-7) { last = i; break; }
console.log('last non-zero sound sample before NARR: G', (last * 30 / SR).toFixed(2), '(zero for', (1262 - last * 30 / SR).toFixed(1), 'frames before G1262)');
let step = 0, at = 0; for (let i = fr(1060); i < fr(1262) - 1; i++) { const d = Math.abs(sound[2 * i + 2] - sound[2 * i]); if (d > step) { step = d; at = i; } }
console.log('max sample step G1060-1262', step.toExponential(2), 'at G', (at * 30 / SR).toFixed(2), '| step at the G1250 cut (max over +-3 ms)', (() => { let m = 0; for (let i = fr(1250) - 144; i < fr(1250) + 144; i++) m = Math.max(m, Math.abs(sound[2 * i + 2] - sound[2 * i])); return m.toExponential(2); })());
let pk = 0; for (let i = fr(1070); i < fr(1262); i++) pk = Math.max(pk, Math.abs(sound[2 * i]), Math.abs(sound[2 * i + 1]));
console.log('peak G1070-1262', db(pk).toFixed(1), 'dBFS');
