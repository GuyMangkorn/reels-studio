// WDG-EP01-SHORT sound build (Editor, D17; mix-v7 (store dir; round 5: W2 `หิว` +4 semitones; before that mix-v6: M2 phrase 2 retime + beat bed on top of mix-v4 R2.5d crawl retime)). Places the locked voices (with the E1/E2 breath edits), beds, ambience and
// cues on the composition clock (30 fps, 2861 frames) and writes two stems:
//   out/wendigo/audio/WDG-EP01-SHORT_voice.wav   mono, all voices (the Remotion `narration` track)
//   out/wendigo/audio/WDG-EP01-SHORT_sound.wav   stereo, beds + ambience + cues (the Remotion `audio[]` track)
// Run (repo root): node scripts/wendigo/build-audio.mjs
// Levels are dB gains on the source files; every envelope node is a composition frame. Null = silence.
// Nothing here was listened to (the Editor cannot listen): levels and edit points come from measurements.
/* global console */
import {mkdirSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import {SR, blendSpan, decode, lin, pitchUp, writeWav} from './audio-lib.mjs';

const FPS = 30, FRAMES = 2861, N = Math.round(FRAMES * SR / FPS);
const store = `${os.homedir()}/ReelsStore`;
const V1 = `${store}/projects/WDG-EP01-SHORT/audio/voice-lock-v1/WDG-EP01-SHORT_voice-lock-v1_S01-`;
const NARR = `${store}/projects/WDG-EP01-SHORT/audio/voice-lock-v2/WDG-EP01-SHORT_voice-lock-v2_alt-NARR-Achernar_mysterious_atempo108_R3_pTIGHT3_full.wav`;
const LIB = `${store}/library/sound`;
const OUT = 'out/wendigo/audio';
mkdirSync(OUT, {recursive: true});
const s = (g) => Math.round(g * SR / FPS);

// ---- voices -------------------------------------------------------------------------------------------------
const voice = new Float32Array(N);
/** Delete [a0, a1) seconds with an equal-power crossfade of `xf` seconds; the result is exactly (a1 - a0) shorter. */
const cutOut = (a, a0, a1, xf = 0.006) => {
  const i0 = Math.round(a0 * SR), i1 = Math.round(a1 * SR), x = Math.round(xf * SR);
  const out = new Float32Array(a.length - (i1 - i0));
  out.set(a.subarray(0, i0 - x));
  for (let k = 0; k < x; k++) { const t = (k + 0.5) / x; out[i0 - x + k] = a[i0 - x + k] * Math.cos(t * Math.PI / 2) + a[i1 - x + k] * Math.sin(t * Math.PI / 2); }
  out.set(a.subarray(i1), i0);
  return out;
};
/** Zero [t0, t1) seconds with `fade`-second ramps at both edges (a hard silence). */
const gate = (a, t0, t1, fade = 0.01) => {
  const i0 = Math.round(t0 * SR), i1 = Math.round(t1 * SR), f = Math.round(fade * SR);
  for (let i = i0 - f; i < i0; i++) a[i] *= (i1 > i0 ? (i0 - i) / f : 1);
  for (let i = i0; i < i1; i++) a[i] = 0;
  for (let i = i1; i < i1 + f; i++) a[i] *= (i - i1) / f;
  return a;
};
const edits = [];
const place = (dst, a, startG, gainDb, offsetSec = 0) => {
  const g = lin(gainDb), o = Math.round(offsetSec * SR), at = s(startG);
  for (let i = 0; i + o < a.length && at + i < N; i++) dst[at + i] += a[i + o] * g;
};
const clip = (id, startG, gainDb, o = {}) => {
  let a = decode(id === 'NARR' ? NARR : `${V1}${id}-Algenib.wav`);
  if (o.cut) { a = cutOut(a, ...o.cut); edits.push({clip: id, cut: o.cut, gate: o.gate ?? null}); }
  if (o.gate) a = gate(a, ...o.gate);
  if (o.pitch) { a = blendSpan(a, pitchUp(a, o.pitch.semis), o.pitch.t0, o.pitch.t1, o.pitch.xf ?? 0.02); edits.push({clip: id, pitch: o.pitch}); }
  place(voice, a, startG, gainDb, o.offsetSec ?? 0);
  return a.length / SR;
};
const M = (n, beat) => `${beat}-M${n}_MAN`;
clip('B01-W1_WHISPER', 0, -3, {offsetSec: 7 / FPS});           // cut the first 7 frames
// E1: breath before the words. Source dips: in 0.55 s (-48 dBFS), out 1.15 s (-61), words start 1.22 s.
clip(M(1, 'B01'), 45, 0, {cut: [0.55, 1.15]});
// FIX-1 (2 Nov 2026): M2 regenerated (voice-lock-v3, Algenib, style "hoarse but alert, low and firm ... not tired", no <short pause>),
// cut at its 0.56 s gap into two pieces. Phrase 1 keeps the sheet onset (G197); phrase 2 is placed so the voice-less tail before M3 is shortest.
const V3 = `${store}/projects/WDG-EP01-SHORT/audio/voice-lock-v3/WDG-EP01-SHORT_voice-lock-v3_S01-`;
/** Slice [t0, t1) seconds with `fade`-second ramps, and place it so that its sample t0 sits at composition time `atSec`. */
const piece = (file, t0, t1, atSec, gainDb = 0, fade = 0.004) => {
  const a = decode(file), i0 = Math.round(t0 * SR), i1 = Math.min(a.length, Math.round(t1 * SR)), f = Math.round(fade * SR), g = lin(gainDb), at = Math.round(atSec * SR);
  for (let i = i0; i < i1; i++) { const e = Math.min(1, (i - i0 + 1) / f, (i1 - i) / f); if (at + i - i0 < N) voice[at + i - i0] += a[i] * e * g; }
};
const M2F = `${V3}B02-M2_MAN-Algenib_firm.wav`;
piece(M2F, 0, 3.0, 189 / FPS);                  // phrase 1: onset 0.26 s -> G196.8
piece(M2F, 3.0, 5.0, 350 / FPS - 0.28);         // phrase 2 (mix-v5): onset 3.28 s -> G350 (ends G~392); beat to the M3 breath (G424) = ~32 frames. Was G316 (mix-v4).
// M3 starts 18 frames earlier than v2 so its words land on the sheet's G449 (breath at G439, 7 frames before the cut to SH04)
clip(M(3, 'B02'), 424, 0);
clip(M(4, 'B03'), 594, 0);
// FIX-2 (2 Nov 2026): M5 regenerated without the inline <whispering> tag, which Gemini had spoken aloud (ASR: "วิสปริง" / "I whispered").
// Take c has three phrases separated by floor-level gaps (-50 dBFS): cut into pieces, placed on the sheet: G823 `แล้วผมก็ได้ยิน`, G921 `เสียงนั้นอีก`, G987 `จาก...`.
const M5C = `${V3}B03-M5_MAN-Algenib_notag.wav`;
piece(M5C, 0, 2.40, 816 / FPS, 1);                 // onset 0.22 s -> G822.6 (ends G~875; caption `แล้วผมก็ได้ยิน…` G795-908)
piece(M5C, 2.40, 3.70, 921 / FPS - 0.24, 1);       // onset 2.64 s -> G921 (ends G953)
piece(M5C, 5.10, 6.96, 987 / FPS - 0.08, 1);       // onset 5.18 s -> G987.0; the silence G978-987 is the take's own floor, gated below
// round 5 (user, Draft SH04): the whisper `หิว` is raised +4 semitones at the same duration. Span 0.56-1.40 s of the clip (word 0.60-1.35 s, floor -43 dBFS around it), 20 ms crossfades.
clip('B03-W2_WHISPER', 1039, 0, {pitch: {semis: 4, t0: 0.56, t1: 1.40}});
gate(voice, 978 / FPS, 987 / FPS - 0.012, 0.004); // hard silence G978-987 (digital zero)
clip('NARR', 1262, -1);

// ---- sound stem ---------------------------------------------------------------------------------------------
const L = new Float32Array(N), R = new Float32Array(N);
/** Piecewise-linear gain (linear amplitude between nodes) over frames; nodes are [frame, dB | null]. Holds the end values. */
const envOf = (nodes) => (g) => {
  const amp = (d) => d === null ? 0 : lin(d);
  if (g <= nodes[0][0]) return amp(nodes[0][1]);
  for (let i = 1; i < nodes.length; i++) if (g < nodes[i][0]) { const [g0, d0] = nodes[i - 1], [g1, d1] = nodes[i]; const t = (g - g0) / (g1 - g0); return amp(d0) + (amp(d1) - amp(d0)) * t; }
  return amp(nodes.at(-1)[1]);
};
const stereo = (file, o = {}) => decode(file, {ch: 2, ss: o.ss, t: o.t});
/** Loop `src` (interleaved stereo) over composition frames [from, to), file position = (n - origin) mod length. */
const loop = (src, from, to, nodes, originG = from) => {
  const env = envOf(nodes), len = src.length / 2, org = s(originG);
  for (let n = s(from); n < Math.min(s(to), N); n++) {
    const g = n * FPS / SR, e = env(g); if (e === 0) continue;
    const p = ((n - org) % len + len) % len;
    L[n] += src[2 * p] * e; R[n] += src[2 * p + 1] * e;
  }
};
const shot = (src, startG, gainDb, {fadeIn = 0.004, fadeOut = 0.02, env} = {}) => {
  const len = src.length / 2, at = s(startG), g = lin(gainDb), fi = Math.round(fadeIn * SR), fo = Math.round(fadeOut * SR);
  for (let i = 0; i < len && at + i < N; i++) {
    const e = Math.min(1, (i + 1) / fi, (len - i) / fo) * (env ? env((at + i) * FPS / SR) : 1) * g;
    L[at + i] += src[2 * i] * e; R[at + i] += src[2 * i + 1] * e;
  }
};
const mute = (g0, g1) => { for (let i = s(g0); i < Math.min(s(g1), N); i++) { L[i] = 0; R[i] = 0; } };

const wind = stereo(`${LIB}/ambience/weather/weather_blizzard-canvas-wind_01.wav`);
const SEAM = -18; // wind gain at the loop seam (G0 and G2702-2861)
// AMB-WIND, fiction: levels per the sheets (seam -18; +2 over S01-B02-SH01; -3 tin; low sleeper; -8 ring; low walk; near nothing at the fit;
// fades to nothing G966-978; hard silence G978-1100; far wind fades in 1100-1130; thins from 1210; hard cut 1250).
const windFiction = [[0, SEAM], [192, SEAM], [200, -16], [287, -16], [291, -21], [402, -21], [406, -24], [446, -24], [476, -26], [600, -26], [606, -28], [713, -28], [733, -44], [966, -44], [978, null], [1100, null], [1130, -26], [1210, -26], [1249, -38], [1250, null]];
loop(wind, 0, 1250, windFiction, 0);
// far storm wind under S02-B03 (stopgap -34): in 1781-1811, out 2064-2086
loop(wind, 1781, 2086, [[1781, null], [1811, -34], [2064, -34], [2086, null]], 0);
// seam wind: from nothing at G2536 to the seam level at G2702 (linear), then to the end. Phase runs on into G0 (origin = FRAMES).
loop(wind, 2536, FRAMES, [[2536, null], [2702, SEAM]], FRAMES);
// the loop-closing phase must meet the opening: the first wind sample is file position 0 = (FRAMES - FRAMES) mod len.

const drone = stereo(`${LIB}/music/tension/tension_drone-sparse-piano_01.wav`);
// mix-v5: the drone swells +4-5 dB over the voice-less beats around M2 phrase 2 (G271 -> G330, peak G404) and eases back before the M3 words (G439)
loop(drone, 192, 612, [[192, null], [222, -24], [271, -24], [330, -20], [404, -19], [424, -21], [446, -24], [600, -24], [612, null]], 192); // MUS-DRONE
const doc = stereo(`${LIB}/music/bed/bed_sad-aftermath-ambient_01.wav`);
// MUS-DOC: in 1350-1395; -3 dB from 1781; to -24 dB below its level over 2086-2108 (near silence); fades out 2536-2740
loop(doc, 1350, 2740, [[1350, null], [1395, -22], [1781, -22], [1790, -25], [2086, -25], [2108, -49], [2536, -49], [2740, null]], 1350);

const stg = stereo(`${LIB}/sfx/stinger/stinger_low-muted-hit_01.wav`);
shot(stg, 996, -7);                                                                        // STG, the one stinger, on `ปาก`
const swell = stereo(`${LIB}/sfx/tension/tension_rumble-distant-muffled_01.wav`);
shot(swell, 1942, -20, {fadeIn: 0.3, fadeOut: 0.3});                                      // FX-SWELL (not a stinger)
const step = stereo(`${LIB}/sfx/foley/foley_snow-boot-step_01.wav`);
for (const [g, d] of [[525, -12], [626, -10], [655, -11], [684, -10], [710, -11]]) shot(step, g, d);
// heavy press at G732: the step pitched down 15% (repeat samples at 0.85 rate) and louder
{ const len = Math.floor(step.length / 2 / 0.85), out = new Float32Array(len * 2);
  for (let i = 0; i < len; i++) { const p = i * 0.85, a = Math.floor(p), f = p - a, b = Math.min(a + 1, step.length / 2 - 1); out[2 * i] = step[2 * a] * (1 - f) + step[2 * b] * f; out[2 * i + 1] = step[2 * a + 1] * (1 - f) + step[2 * b + 1] * f; }
  shot(out, 732, -5); }
const flap = stereo(`${LIB}/sfx/foley/foley_tent-flap-rustle_01.wav`);
shot(flap, 1106, -10);                                                                     // FX-FLAP
const sleeper = stereo(`${LIB}/sfx/foley/foley_sleeper-breath-tent_01.wav`, {t: 40 / FPS});
shot(sleeper, 406, 4, {fadeIn: 0.3, fadeOut: 0.3});                                        // FX-BREATH-SLEEP [406, 446) (WDG-SS-R2.3)

// SN01: wendigo texture under `หิวไหม…`. Under the whisper (G6-28) 6 dB lower, strongest G28-60, out by 90.
const sn01 = stereo(`${LIB}/sfx/creature/creature_wendigo-rasp-texture_01.wav`);
shot(sn01, 0, -10, {fadeIn: 0.15, fadeOut: 0.3, env: envOf([[0, -40], [5, -6], [6, -6], [28, -6], [34, 0], [60, 0], [90, null]])});
// SN02 (round 3, 3 Nov 2026 user feedback): the "crack" layer (W2's vowel tail replayed with a rising rate, a chipmunk sound) is removed entirely:
// no speed-up or pitch-up of any voice sample. The scream is a ghost wail: `creature_wendigo-wail-ghost_01` (Stable Audio bowed-metal / creaking-wood
// candidates, pitched up with a slow rising glide by scripts/wendigo/make-wail.mjs; centroid ~3.6 kHz, partial 2 -> 4 kHz). It turns out of the whisper
// (W2 ends G1078) as a thin wail from G1082, stays under the dread, and its second, high entry lands on the leap; hard stop G1250, silence to NARR G1262.
// DREAD (G1100-1250, under the morph G1112-1232, crouch G1196-1220, leap G1220-1234): a low drone swell (rate 1 -> 1.12), bowed-metal creak tension,
// a sub pulse that accelerates to the crouch, a hit at the leap, and a release (everything but the wail drops at G1228).
{
  const raw = `${LIB}/sfx/creature/creature_wendigo-wail-ghost_01.wav`;
  const wl = stereo(raw);
  shot(wl, 1082, -13, {fadeIn: 0.25, fadeOut: 0.05, env: envOf([[1082, -30], [1112, -4], [1150, 0], [1190, -10], [1212, -22], [1250, null]])}); // wail 1, turns out of the whisper, ducks under the dread
  // R2.5d (no leap, slow crawl from G1190, head behind the right wall ~G1203, hidden G1242): wail 2 enters as the crawl starts (G1192, full by G1204),
  // holds while the torso goes, then tapers to nothing by G1248 so the tail resolves before the hard stop at G1250.
  shot(wl, 1192, -7, {fadeIn: 0.1, fadeOut: 0.05, env: envOf([[1192, -30], [1204, 0], [1228, 0], [1240, -14], [1248, -40], [1250, null]])});  // wail 2, with the crawl
  // low drone swell: riser candidate v1 (steady, 5.9 s) shaped by an envelope, read at a slowly rising rate
  const dr = stereo(`${store}/library/sound/_raw/wdg-dread-riser_v1.wav`), nIn = dr.length / 2, out = [];
  for (let pos = Math.round(0.4 * SR), i = 0; pos < nIn - 2 && i < s(150); i++) { const r = 1 + 0.12 * Math.min(1, i / s(130)); const a = Math.floor(pos), f = pos - a; out.push(dr[2 * a] * (1 - f) + dr[2 * a + 2] * f, dr[2 * a + 1] * (1 - f) + dr[2 * a + 3] * f); pos += r; }
  shot(Float32Array.from(out), 1100, -14, {fadeIn: 0.2, fadeOut: 0.04, env: envOf([[1100, -40], [1160, -22], [1196, -12], [1227, -9], [1229, null]])});
  // bowed-metal creak tension: a mid-pitch ghost wail candidate (centroid ~1.4 kHz) low under the morph, rising to the crouch
  shot(stereo(`${store}/library/sound/_raw/wdg-ghost-wail-b_v4.wav`, {ss: 0.3}), 1118, -24, {fadeIn: 0.3, fadeOut: 0.04, env: envOf([[1118, -30], [1196, -8], [1227, -4], [1229, null]])});
  // sub pulse: sine thumps 46 -> 34 Hz (+ 2nd harmonic), interval 0.95 s -> 0.30 s from G1110 to the crouch G1196, level -34 -> -14 dB
  for (let t = 1110 / FPS, iv = 0.95; t < 1227 / FPS; t += iv, iv = Math.max(0.3, iv * 0.82)) {
    const lvl = lin(-34 + 20 * Math.min(1, (t * FPS - 1110) / 86)), len = Math.round(0.32 * SR), at = Math.round(t * SR);
    for (let k = 0; k < len && at + k < N; k++) { const tt = k / SR, ph = 2 * Math.PI * (34 * tt + 12 * (1 - Math.exp(-tt * 14)) / 14 * 1 + 0), e = Math.min(1, k / 96) * Math.exp(-tt * 11);
      const v = (Math.sin(ph) + 0.35 * Math.sin(2 * ph)) * e * lvl; L[at + k] += v; R[at + k] += v; }
  }
  // R2.5d: the hit on the leap is removed (no push-off any more; a slow crawl has no impact). The release at G1229 stays.
  console.log('dread + wail', {wailSec: (wl.length / 2 / SR).toFixed(2), drone: (out.length / 2 / SR).toFixed(2)});
}
// the S01 world ends on a hard cut at G1250: everything from the fiction is out before the documentary (S02-B01 L0-L12 near silence)
for (let i = s(1250); i < s(1262); i++) { L[i] = 0; R[i] = 0; } // wail, dread and pulse are out at G1250 (hard stop, 12 frames before NARR G1262)
mute(978, 987); // hard silence: wind, breath and room tone out (the stinger starts at 996)

// ---- write --------------------------------------------------------------------------------------------------
writeWav(`${OUT}/WDG-EP01-SHORT_voice.wav`, voice, 1);
const inter = new Float32Array(N * 2); for (let i = 0; i < N; i++) { inter[2 * i] = L[i]; inter[2 * i + 1] = R[i]; }
writeWav(`${OUT}/WDG-EP01-SHORT_sound.wav`, inter, 2);
// per-frame voice amplitude (RMS of each 1/30 s window, scaled to the loudest) for the Remotion narration track
const w = SR / FPS, amp = []; let mx = 0;
for (let f = 0; f < FRAMES; f++) { let sum = 0; for (let i = Math.round(f * w); i < Math.min(N, Math.round((f + 1) * w)); i++) sum += voice[i] ** 2; const r = Math.sqrt(sum / w); amp.push(r); mx = Math.max(mx, r); }
writeFileSync(`${OUT}/WDG-EP01-SHORT.amplitude.json`, JSON.stringify(amp.map((r) => +(r / mx).toFixed(4))));
writeFileSync(`${OUT}/edits.json`, JSON.stringify({edits, frames: FRAMES, samples: N}, null, 1));
console.log('built', {frames: FRAMES, voiceSec: N / SR, edits});
