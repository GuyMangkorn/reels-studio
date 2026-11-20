#!/usr/bin/env python3
"""EDU-EP30-SHORT sound mix (Editor, W5.3 pass 2, 2026-11-20; scene sheets EDU-EP30-SCENE-R2 (Sound lines identical in R2.2), cue sheet scripts/edu-series/ep30/sound-cues.json, 90 placements, 1977 f at 30 fps, 48 kHz).
Adapted from scripts/edu-series/ep26/short/sound-mix.py. Places every cue at its integer G frame (the file starts on the cue frame, as the sheet says) with ffmpeg and writes
  out/stems/{voice,bed,texture,accent}.wav  (stereo s16 per-layer stems for `python3 -I scripts/mix-levels.py scripts/edu-series/ep30/sound-cues.json`; Ton measures, Editor never grades the own mix)
  public/audio/edu/EDU-EP30-SHORT-draft-stem-v1.wav  (bed + texture + accent baked, stereo s16; the narration is its own track, public/narration/EDU-EP30-SHORT-narration-v1.wav, untouched)
Layers: bed = music + the room/plain/dam/city ambiences + the projector whirr; texture = foley, creature, vehicle and gate clacks (levels row "texture" >= 18 dV under speech);
accent = hits, bursts, stingers, bells, whistles (levels rows "accent"). Every source is mixed to mono then placed at centre (1,1), left (1,0) or right (0,1) so one channel carries the source's own
amplitude (the narration is mono and plays on both channels at 1.0, so stem and voice keep the measured distance on a phone).
The cue sheet gives sounds and frames, not gains. Gain per cue = voice active level - dV - the file's active level (+ sheet gainDb): dV is the target distance under the voice
(docs/editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice; table DV below, each value with its reason in build-notes.md "W5.3 Editor pass 2"). Not listened to: set by number.
Run: python3 -I scripts/edu-series/ep30/short/sound-mix.py"""
import array, json, math, os, subprocess
EXT = '.wav'
FPS, SR, TOTAL = 30, 48000, 1977
N = TOTAL * SR // FPS
SHEET = json.load(open('scripts/edu-series/ep30/sound-cues.json'))
CUES = SHEET['cues']
NARR = 'public/narration/EDU-EP30-SHORT-narration-v1.wav'      # VOICE-R2.2, store projects/edu/EDU/narration/ep30-voice-r2-2/preview.wav, 65.90 s mono
# every file this mix plays (scripts/sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = [
    'public/audio/action/action_galop-chase_01.wav',
    'public/audio/bed/bed_anthem-brass-pad_01.wav',
    'public/audio/bed/bed_brass-chorale-admiring_01.wav',
    'public/audio/bed/bed_brass-held-chord_01.wav',
    'public/audio/bed/bed_newsreel-march-jaunty_01.wav',
    'public/audio/bed/bed_newsreel-march-reentry_01.wav',
    'public/audio/bed/bed_tired-march-detuned_01.wav',
    'public/audio/ep30r2-proc/city_plaza-morning-magpie_01.wav',
    'public/audio/ep30r2-proc/comedy_brass-fanfare-sputter_01.wav',
    'public/audio/ep30r2-proc/comedy_bugle-retreat-flat_01.wav',
    'public/audio/ep30r2-proc/comedy_parade-drum-tap_01.wav',
    'public/audio/ep30r2-proc/comedy_slide-whistle-cheeky-down_01.wav',
    'public/audio/ep30r2-proc/comedy_slide-whistle-cheeky-up_01.wav',
    'public/audio/ep30r2-proc/comedy_tuba-slide-down_01.wav',
    'public/audio/ep30r2-proc/creature_emu-beak-click_01.wav',
    'public/audio/ep30r2-proc/creature_emu-boom_01.wav',
    'public/audio/ep30r2-proc/creature_emu-curious-grunt_01.wav',
    'public/audio/ep30r2-proc/creature_emu-feet-patter-off_01.wav',
    'public/audio/ep30r2-proc/creature_emu-flock-scatter_01.wav',
    'public/audio/ep30r2-proc/creature_emu-flock-startled-dam_01.wav',
    'public/audio/ep30r2-proc/creature_emu-flock-startled-plain_01.wav',
    'public/audio/ep30r2-proc/creature_emu-foot-tap_01.wav',
    'public/audio/ep30r2-proc/creature_emu-step-padded_01.wav',
    'public/audio/ep30r2-proc/creature_emu-wing-flick_01.wav',
    'public/audio/ep30r2-proc/crowd_polite-applause-far_01.wav',
    'public/audio/ep30r2-proc/foley_brass-casing-tinkle_01.wav',
    'public/audio/ep30r2-proc/foley_brass-casings-dirt_01.wav',
    'public/audio/ep30r2-proc/foley_brass-casings-water_01.wav',
    'public/audio/ep30r2-proc/foley_emu-column-shuffle_01.wav',
    'public/audio/ep30r2-proc/foley_emu-flock-run-loop_01.wav',
    'public/audio/ep30r2-proc/foley_emu-slowmo-steps_01.wav',
    'public/audio/ep30r2-proc/foley_emu-unison-step_01.wav',
    'public/audio/ep30r2-proc/foley_feather-cloth-swish_01.wav',
    'public/audio/ep30r2-proc/foley_wheat-peck-loop_01.wav',
    'public/audio/ep30r2-proc/foley_wheat-peck-single_01.wav',
    'public/audio/ep30r2-proc/impact_lewis-burst-plain-23_01.wav',
    'public/audio/ep30r2-proc/impact_lewis-burst-wet-11_01.wav',
    'public/audio/ep30r2-proc/impact_lewis-single-shot-deflated_01.wav',
    'public/audio/ep30r2-proc/impact_trailer-hit-cymbal_01.wav',
    'public/audio/ep30r2-proc/mechanical_gun-jam-click-offaxis_01.wav',
    'public/audio/ep30r2-proc/mechanical_gun-jam-click_01.wav',
    'public/audio/ep30r2-proc/mechanical_gun-smoke-puff_01.wav',
    'public/audio/ep30r2-proc/mechanical_lewis-bolt-open_01.wav',
    'public/audio/ep30r2-proc/mechanical_lewis-cocking-rack_01.wav',
    'public/audio/ep30r2-proc/mechanical_projector-speed-up-down_01.wav',
    'public/audio/ep30r2-proc/mechanical_projector-whirr-bed_01.wav',
    'public/audio/ep30r2-proc/mechanical_projector-wind-down_01.wav',
    'public/audio/ep30r2-proc/mechanical_truck-engine-labouring-loop_01.wav',
    'public/audio/ep30r2-proc/mechanical_watch-tick-pair_01.wav',
    'public/audio/ep30r2-proc/outdoor_wheat-wind-plain_01.wav',
    'public/audio/ep30r2-proc/stinger_brass-parade-end-button_01.wav',
    'public/audio/ep30r2-proc/tension_ear-ring-dam_01.wav',
    'public/audio/ep30r2-proc/tension_ear-ring-tail_01.wav',
    'public/audio/ep30r2-proc/ui_brass-counter-bell_01.wav',
    'public/audio/ep30r2-proc/ui_polite-ting_01.wav',
    'public/audio/ep30r2-proc/ui_shop-door-bell_01.wav',
    'public/audio/ep30r2-proc/vehicle_leaf-spring-creak-bang_01.wav',
    'public/audio/ep30r2-proc/vehicle_tank-track-clank_01.wav',
    'public/audio/ep30r2-proc/vehicle_truck-1930s-arrive-brakes_01.wav',
    'public/audio/ep30r2-proc/vehicle_truck-1930s-pull-up-short_01.wav',
    'public/audio/ep30r2-proc/vehicle_truck-1930s-putter-away_01.wav',
    'public/audio/ep30r2-proc/water_dam-lap-windmill_01.wav',
    'public/audio/ep30r2-proc/water_rounds-strike-mud_01.wav',
    'public/audio/stinger/stinger_march-roll-hit_01.wav',
    'public/audio/stinger/stinger_newsreel-march-intro_01.wav',
    'public/audio/tension/tension_ambush-pizzicato-vamp_01.wav',
    'public/sfx/mechanical/mechanical_projector-shutter-click_01.wav',
]
SRC = {os.path.splitext(os.path.basename(p))[0]: p for p in PLACED}
assert set(SRC) == {c['id'] for c in CUES}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]
assert len(CUES) == 90

# cue name -> (layer, dV under the voice in dB active-to-active, pan). Reasons: bed/ambience sit 19-22 (EP08b bed warns above 20; the sum of whirr + plain stays under it);
# music 18 (aim 18; MUS-02b 20 = Film "about 20 dB under L19"); texture 18-21 (>= 18); accents that sit on a word 12-16 (levels rows >= 12); accents in a pause 0-9 (peak rows -6..3);
# bursts full 6 and ducked 12 (VD30-11); the whirr is "the newsreel's silence" (21) and wind "lighter" in B05-B06 (22).
L = {
 'BED-01': ('bed', 21), 'AMB-P-01': ('bed', 21), 'B01-SH01-mus01': ('bed', 18), 'B01-SH01-grunt': ('accent', 16),
 'B01-SH02-putter': ('texture', 22), 'B01-SH02-step1': ('texture', 19), 'B01-SH02-step2': ('texture', 19), 'B01-SH02-step3': ('texture', 19), 'B01-SH02-step4': ('texture', 19),
 'B01-SH03-boom': ('accent', 9),
 'B02-SH01-mus02': ('bed', 18), 'B02-SH01-gate': ('texture', 19), 'B02-SH01-pecks': ('texture', 20), 'B02-SH01-bell': ('accent', 8), 'B02-SH02-peck': ('texture', 20),
 'B02-SH03-truck': ('texture', 20), 'B02-SH03-fanfare': ('accent', 13), 'B02-SH04-drum1': ('accent', 14), 'B02-SH04-drum2': ('accent', 14), 'B02-SH04-drum3': ('accent', 14),
 'B02-SH06-mus02b': ('bed', 20), 'B02-SH06-beak': ('accent', 14),
 'B03-SH05-roll-hit': ('accent', 0), 'B03-SH01-burst': ('accent', 6), 'B03-SH01-gate': ('texture', 19), 'B03-SH01-casings': ('texture', 18),
 'B03-SH01-startle1': ('texture', 18), 'B03-SH01-startle2': ('texture', 18), 'B03-SH01-bolt': ('accent', 12), 'B03-SH01-ring': ('texture', 18), 'B03-SH02-scatter': ('texture', 18),
 'B03-SH03-whistle-up': ('accent', 10), 'B03-SH03-whistle-down': ('accent', 10),
 'B03-SH03-wing1': ('texture', 18, 'left'), 'B03-SH03-wing2': ('texture', 18, 'right'), 'B03-SH03-patter1': ('texture', 18, 'left'), 'B03-SH03-patter2': ('texture', 18, 'right'),
 'B04-SH01-gate': ('texture', 19), 'B04-SH01-mus04': ('bed', 18), 'B04-SH01-amb-d': ('bed', 21), 'B04-SH02-shuffle': ('texture', 19), 'B04-SH02-unison': ('texture', 18),
 'B04-SH03-burst': ('accent', 6), 'B04-SH03-casings': ('texture', 18), 'B04-SH03-strikes': ('texture', 18), 'B04-SH03-startle': ('texture', 18), 'B04-SH03-ring': ('texture', 18),
 'B04-SH04-click': ('accent', 14), 'B04-SH04-puff': ('texture', 18), 'B04-SH04-tinkle': ('texture', 18), 'B04-SH06-rack': ('accent', 14),
 'B04-SH05-click': ('accent', 12), 'B04-SH05-tick': ('texture', 20), 'B04-SH05-tap1': ('texture', 18), 'B04-SH05-tap2': ('texture', 18), 'B04-SH05-tap3': ('texture', 18),
 'B05-SH01-gate': ('texture', 19), 'B05-SH01-mus05': ('bed', 18), 'B05-SH01-engine': ('texture', 19), 'B05-SH01-run': ('texture', 20),
 'B05-SH02-spring1': ('texture', 18), 'B05-SH02-spring2': ('texture', 18), 'B05-SH02-spring3': ('texture', 18), 'B05-SH02-spring4': ('texture', 18), 'B05-SH02-spring5': ('texture', 18),
 'B05-SH02-shot1': ('accent', 15), 'B05-SH02-shot2': ('accent', 15), 'B05-SH03-putter': ('texture', 21), 'B05-SH03-amb-p': ('bed', 22),
 'B05-SH03-tuba': ('accent', 14), 'B05-SH03-bugle': ('accent', 16), 'B05-SH04-shopbell': ('accent', 14),
 'B06-SH01-mus06': ('bed', 18), 'B06-SH01-slowmo': ('texture', 19), 'B06-SH01-tank': ('accent', 16),
 'B06-SH02-chord': ('bed', 18), 'B06-SH02-swish': ('texture', 19), 'B06-SH02-ting': ('accent', 14), 'B06-SH02-applause': ('texture', 20),
 'B06-SH03-pullup': ('texture', 20), 'B06-SH03-trailer': ('accent', 13), 'B06-SH03-mus07': ('bed', 18), 'B06-SH03-projector': ('texture', 19),
 'B06-SH04-putter': ('texture', 21), 'B06-SH04-bugle': ('accent', 15),
 'B07-SH01-windown': ('texture', 19), 'B07-SH01-amb-a': ('bed', 21), 'B07-SH01-mus08': ('bed', 17), 'B07-SH02-boom': ('accent', 12), 'B07-SH02-button': ('accent', 0),
}
assert set(L) == {c['cue'] for c in CUES}, set(L) ^ {c['cue'] for c in CUES}
# end frame = cue frame + the sheet's durationFrames (cue sheet endFrame notes: loops and cut-dead beds end there); a file shorter than its span loops
# (fade in f, fade out f): beds and ambiences ramp over a few frames, a cut-dead music cue gets 2 f, the ending button and the unrequested starts get none
FADE = {
 'BED-01': (0, 6), 'AMB-P-01': (0, 8), 'B01-SH01-mus01': (0, 2), 'B02-SH01-mus02': (0, 6), 'B02-SH06-mus02b': (4, 4), 'B03-SH05-roll-hit': (0, 0),
 'B04-SH01-mus04': (0, 2), 'B04-SH01-amb-d': (6, 6), 'B05-SH01-mus05': (0, 6), 'B05-SH01-engine': (4, 8), 'B05-SH01-run': (4, 8), 'B05-SH03-amb-p': (8, 8),
 'B06-SH01-mus06': (0, 2), 'B06-SH02-chord': (0, 6), 'B06-SH03-mus07': (0, 8), 'B06-SH04-bugle': (0, 8), 'B07-SH01-amb-a': (6, 0), 'B07-SH01-mus08': (8, 8), 'B07-SH02-button': (0, 0),
}
LOOP = {'BED-01', 'AMB-P-01', 'B05-SH01-run', 'B05-SH03-amb-p'}        # files shorter than their span (10.75, 14.6, 3.25, 14.6 s): the sheet says loop; every other cue plays once and ends early or on its file's end
CUT = {'B06-SH04-bugle': 1741}                           # sheet: the 1.0 s tail runs past the cut, faded over 1733-1741
# volume ramps in dB: name -> [(global frame, offset dB)], linear in dB between points
RAMP = {
 'B03-SH01-burst': [(690, 0), (703, 0), (705, -6), (717, -6), (719, 0), (725, 0), (727, -6), (754, -6), (756, 0)],   # full 690-704, 718-726 and from 756, 6 dB under the words between (VD30-11)
 'B04-SH03-burst': [(1003, -6), (1007, -6), (1009, 0), (1025, 0), (1027, -6), (1033, -6)],                           # same duck under L09's tail and L10's start
 'B04-SH01-mus04': [(868, 0), (1000, 0), (1003, -12)],                                                               # ducks 12 dB at 1003, stops dead at 1035
 'B06-SH01-mus06': [(1441, 0), (1526, 0), (1530, 2), (1536, 2)],                                                     # swell on "ถัง" 1530 (+2 dB)
}
MASTER_DB = 0.0
PEAK_CEIL = -3.0                                       # a placed cue's own sample peak stays under this (dBFS): hits stack with beds and voice

def decode(path):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True)
    a = array.array('h'); a.frombytes(r.stdout[:len(r.stdout) // 2 * 2]); return [x / 32768 for x in a]
def active_db(path, rng):
    """Active level (dB): mean power of the 20 ms windows within `rng` dB of the loudest window; also the sample peak (dBFS) and the length in seconds."""
    s = decode(path); w = 960; e = [sum(v * v for v in s[i * w:(i + 1) * w]) / w for i in range(len(s) // w)]
    pk = max(e); act = [x for x in e if x > pk * 10 ** (-rng / 10)]
    return 10 * math.log10(sum(act) / len(act)), 20 * math.log10(max(abs(v) for v in s) or 1e-6), len(s) / 48000
VOICE = active_db(NARR, 30)[0]
INFO = {i: active_db(p, 25) for i, p in SRC.items()}

items = []
for c in CUES:
    name = c['cue']; spec = L[name]; layer, dv = spec[0], spec[1]; pan = spec[2] if len(spec) > 2 else 'centre'
    act, peak, dur = INFO[c['id']]
    start = c['frame']
    end = start + c['durationFrames'] if 'durationFrames' in c else start + math.ceil(dur * FPS)
    end = min(CUT.get(name, end), TOTAL)
    if name == 'B07-SH01-amb-a': end = TOTAL
    loop = name in LOOP
    assert loop or (end - start) <= dur * FPS + 4, (name, 'file shorter than its span: add to LOOP')
    gain = VOICE - dv - act + c.get('gainDb', 0.0)
    clipped = gain > PEAK_CEIL - peak
    gain = min(gain, PEAK_CEIL - peak)
    items.append(dict(name=name, src=SRC[c['id']], start=start, end=end, loop=loop, fade=FADE.get(name, (0, 2 if (end - start) < dur * FPS - 1.5 else 0)), gain=gain, layer=layer, dv=dv, pan=pan, clipped=clipped, dur=dur))

filters, labels, inputs = [], {'bed': [], 'texture': [], 'accent': []}, []
for i, it in enumerate(items):
    inputs += ['-i', it['src']]
    start, end, g = it['start'], it['end'], it['gain']
    span = (end - start) / FPS
    chain = ['aformat=channel_layouts=mono', 'aresample=48000']
    if it['loop']: chain += ['aloop=loop=-1:size=2147483647']
    chain += [f'atrim=end={span:.5f}', 'asetpts=PTS-STARTPTS']
    if it['name'] in RAMP:
        pts = [((f - start) / FPS, g + d) for f, d in RAMP[it['name']]]
        expr = str(pts[-1][1])
        for (t0, g0), (t1, g1) in reversed(list(zip(pts, pts[1:]))):
            expr = f'if(lt(t,{t1:.5f}),{g0:.4f}+({g1:.4f}-{g0:.4f})*clip((t-{t0:.5f})/{t1 - t0:.5f},0,1),{expr})'
        expr = f'if(lt(t,{pts[0][0]:.5f}),{pts[0][1]:.4f},{expr})'
        chain += [f"volume='pow(10,({expr})/20)':eval=frame"]
    else:
        chain += [f'volume={g:.3f}dB']
    fin, fout = it['fade']
    if fin: chain += [f'afade=t=in:d={fin / FPS:.4f}:curve=tri']
    if fout: chain += [f'afade=t=out:st={max(0, span - fout / FPS):.4f}:d={fout / FPS:.4f}:curve=tri']
    lg, rg = {'centre': (1, 1), 'left': (1, 0), 'right': (0, 1)}[it['pan']]
    d = round(start * SR / FPS)
    chain += [f'pan=stereo|c0={lg}*c0|c1={rg}*c0', f'adelay={d}S|{d}S', f'apad=whole_len={N}', f'atrim=end_sample={N}']
    filters.append(f'[{i}:a]' + ','.join(chain) + f'[c{i}]')
    labels[it['layer']].append(f'[c{i}]')
outs = []
for layer, ls in labels.items():
    filters.append(''.join(ls) + f'amix=inputs={len(ls)}:normalize=0:duration=longest,atrim=end_sample={N}[{layer}]')
    outs.append(layer)
os.makedirs('out/stems', exist_ok=True); os.makedirs('out/logs', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
open('out/logs/ep30-sound-filter.txt', 'w').write(';'.join(filters))
with open('out/logs/ep30-sound-gains.txt', 'w') as f:
    f.write(f'voice active {VOICE:.1f} dB\n')
    for it in items: f.write(f"{it['name']:22s} G{it['start']:5d}-{it['end']:<5} {it['layer']:8s} {it['pan']:6s} loop {int(it['loop'])} fade {it['fade']} dV {it['dv']:4.1f} gain {it['gain']:+6.2f} dB{'  PEAK-LIMITED' if it['clipped'] else ''}\n")
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-/filter_complex', 'out/logs/ep30-sound-filter.txt']
for layer in outs: cmd += ['-map', f'[{layer}]', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/' + layer + '.f32' + EXT]
subprocess.run(cmd, check=True)
# voice stem: the narration at G 0, mono on both channels (same amplitude as the delivered track), padded or trimmed to the composition length
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', NARR, '-af', f'aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0,apad=whole_len={N},atrim=end_sample={N}', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/voice.f32' + EXT], check=True)
def dither(src, dst):   # stems only: -90 dBFS white noise keeps mix-levels.py's ebur128 from seeing all-zero 400 ms windows (EP15 finding); s16
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-f', 'lavfi', '-i', f'anoisesrc=a=0.00003:c=white:r={SR}:d={TOTAL / FPS}', '-filter_complex', '[1:a]aformat=channel_layouts=stereo[n];[0:a][n]amix=inputs=2:normalize=0:duration=first,atrim=end_sample=%d[a]' % N, '-map', '[a]', '-c:a', 'pcm_s16le', dst], check=True)
for layer in outs + ['voice']: dither('out/stems/' + layer + '.f32' + EXT, 'out/stems/' + layer + EXT)
mix = ''.join(f'[{k}:a]' for k in range(len(outs)))
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + sum((['-i', 'out/stems/' + l + '.f32' + EXT] for l in outs), []) + ['-filter_complex', f'{mix}amix=inputs={len(outs)}:normalize=0:duration=longest[a]', '-map', '[a]', '-c:a', 'pcm_f32le', 'out/stems/sum.tmp' + EXT], check=True)
def peak(*files):
    fl = sum((['-i', f] for f in files), [])
    flt = ''.join(f'[{k}:a]' for k in range(len(files))) + f'amix=inputs={len(files)}:normalize=0:duration=longest,astats=measure_overall=Peak_level'
    pk = subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + fl + ['-filter_complex', flt, '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [l for l in pk.splitlines() if 'Peak level dB' in l][-1]
print('sound stem (no voice):', peak('out/stems/sum.tmp' + EXT))
print('voice + sound sum:', peak('out/stems/sum.tmp' + EXT, 'out/stems/voice.f32' + EXT))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/sum.tmp' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/audio/edu/EDU-EP30-SHORT-draft-stem-v1.wav'], check=True)
print('stems in out/stems, sound stem public/audio/edu/EDU-EP30-SHORT-draft-stem-v1.wav; gains out/logs/ep30-sound-gains.txt')
