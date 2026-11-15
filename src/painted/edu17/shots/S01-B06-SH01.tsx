import {lin, mix, sine} from '../clock';
import {paintGlobe} from '../globe';
import {makeShot} from '../stage';

// S01-B06-SH01 (G 1388-1491, 103 f) breaks every week (L17; sheet EDU-EP17-SHEETS-R1.2, SD36). Warm light lift; red sparks flicker on 7 near-coast line
// segments at L23, L38, L51, L63, L75, L88, L96 (SD36: spark 7 L99 -> L96 so it completes by L101; 6 f each, two-beat flicker); slow 8 deg orbit {540, 640, 490, lon 112 -> 120, lat 10} over L0-103 (R1.2: N 110 -> 103).
// Sparks are illustrative positions on the code lines next to a coast (F016 "mostly near coasts"), no numbers.
const N = 103;
const SPARKS: [number, [number, number]][] = [
  [23, [104.5, 10.2]], // L16 off the Mekong delta
  [38, [117.1, 22.7]], // L5 off the south China coast
  [51, [106.6, -5.6]], // L11 off Jakarta
  [63, [119.6, 15.6]], // L8 off Luzon
  [75, [103.6, 4.6]], // L1 off the Malay coast
  [88, [133.4, 32.3]], // L5 off Shikoku
  [96, [113.4, -8.9]], // L3 off Java / Bali
];
/** Spark strength: up over 2 f, a dip at 3, a second peak, gone by 6. */
const flick = (L: number, a: number) => { const k = L - a; return k < 0 || k >= 6 ? 0 : [0.55, 1, 0.45, 0.9, 0.5, 0.2][Math.floor(k)]; };
export const shot = makeShot('S01-B06-SH01', {
  paper: '#0e1830',
  paint: (p, L) => paintGlobe(p, {cx: 540, cy: 640, r: 490, lon: mix(112, 120, sine(L, 0, N)), lat: 10}, {t: L / 30, lit: mix(1, 1.15, lin(L, 0, 20)), sparks: SPARKS.map(([a, at]) => ({at, a: flick(L, a)}))}),
});
