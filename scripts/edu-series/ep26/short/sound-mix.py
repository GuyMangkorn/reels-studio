#!/usr/bin/env python3
"""EDU-EP26-SHORT sound mix (Editor, W5 Draft, 2026-11-19; scene sheets SHEET-R2, cue sheet EDU-EP26-SOUND-R1 = scripts/edu-series/ep26/sound-cues.json, 53 placements).
Places the cues of the cue sheet at their integer G frames (1894 f at 30 fps, 48 kHz) with ffmpeg and writes
  out/stems/{voice,bed,ambience,accent}.wav  (per-layer stems for `python3 -I scripts/mix-levels.py scripts/edu-series/ep26/sound-cues.json`)
  public/audio/edu/EDU-EP26-SHORT-draft-stem-v1.wav  (bed + ambience + accent baked, s16; the narration is its own track)
  public/narration/EDU-EP26-SHORT-narration-v1.wav   (the locked EP26-narration-full-r3.wav at G 0, mono, padded with the 2.0 s hold to 1894 f)
The cue sheet gives sounds and frames, not gains. Gain per cue = (voice active level - dV - the file's active level) + TWEAK[cue]: dV is the target
distance under the voice (docs/editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice; table DV below), TWEAK holds the offsets
decided from mix-levels.py on the draft stems (sound-tweak.json, every non-zero value with its reason in build-notes.md). The sheet's own
gainDb (C13-squelch-b -6) is added. Not listened to: the mix is set by number; the ear-check is open.
Run: python3 -I scripts/edu-series/ep26/short/sound-mix.py"""
import array, json, math, os, subprocess
EXT = '.wav'
FPS, SR, TOTAL = 30, 48000, 1894
N = TOTAL * SR // FPS
SHEET = json.load(open('scripts/edu-series/ep26/sound-cues.json'))
CUES = SHEET['cues']
NARR = 'out/EP26-narr/EP26-narration-full-r3' + EXT           # the locked R3 read (store projects/edu/EDU/narration/EP26-narration-full-r3.wav), 61.13 s
# every file this mix plays (scripts/sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/bed/bed_comic-plod-squelch-groove_01.wav',
    'public/audio/bed/bed_comic-roman-pluck-groove-120_01.wav',
    'public/audio/bed/bed_hopeful-evening-pad_01.wav',
    'public/audio/bed/bed_mock-brass-held-chord_01.wav',
    'public/audio/bed/bed_mock-fanfare-intro_01.wav',
    'public/audio/city/city_roman-street-dusk-murmur_01.wav',
    'public/audio/city/city_roman-street-evening-murmur_01.wav',
    'public/audio/room/room_marble-hall-hush_01.wav',
    'public/audio/room/room_roman-workshop-tub-tone_01.wav',
    'public/sfx/comedy/comedy_brass-stab-woodblock-button_01.wav',
    'public/sfx/comedy/comedy_deadpan-record-stop-tick_01.wav',
    'public/sfx/comedy/comedy_double-stomp-pluck-stab_01.wav',
    'public/sfx/comedy/comedy_phew-resolve-pluck_01.wav',
    'public/sfx/comedy/comedy_pluck-bend-down-two-note_01.wav',
    'public/sfx/comedy/comedy_sly-pluck-smirk_01.wav',
    'public/sfx/comedy/comedy_tuba-wobble-smell_01.wav',
    'public/sfx/comedy/comedy_woodblock-tension-tick_01.wav',
    'public/sfx/creature/creature_dog-bark-far_01.wav',
    'public/sfx/foley/foley_bare-toes-wet-rim-pat_01.wav',
    'public/sfx/foley/foley_bronze-coin-palm-clink_01.wav',
    'public/sfx/foley/foley_jar-base-clunk_01.wav',
    'public/sfx/foley/foley_jar-lid-scrape-pop_02.wav',
    'public/sfx/foley/foley_jar-slide-stone_01.wav',
    'public/sfx/foley/foley_linen-snap-bright_01.wav',
    'public/sfx/foley/foley_nervous-swallow-close_01.wav',
    'public/sfx/foley/foley_sandal-threshold-street-swell_01.wav',
    'public/sfx/foley/foley_sandals-stone-two-steps-stop_01.wav',
    'public/sfx/foley/foley_sniff-close-dry_01.wav',
    'public/sfx/foley/foley_wet-foot-stomp-wool_01.wav',
    'public/sfx/foley/foley_wet-foot-stomp-wool_02.wav',
    'public/sfx/foley/foley_wet-foot-stomp-wool_03.wav',
    'public/sfx/nature/nature_swifts-chirps-evening_01.wav',
    'public/sfx/comedy/comedy_bassoon-sag-sigh_01.wav',
    'public/sfx/stinger/stinger_brass-ta-da-pompous_01.wav',
    'public/sfx/stinger/stinger_bronze-coin-chime_01.wav',
    'public/sfx/stinger/stinger_coin-glint-shimmer_01.wav',
    'public/sfx/stinger/stinger_soft-horn-wry-note_01.wav',
    'public/sfx/water/water_deep-tub-stomp-wool_01.wav',
    'public/sfx/water/water_deep-tub-stomp-wool_02.wav',
    'public/sfx/water/water_deep-tub-stomp-wool_03.wav',
    'public/sfx/water/water_foot-murky-slow-squelch_01.wav',
    'public/sfx/water/water_foot-murky-squelch-short_01.wav',
    'public/sfx/whoosh/whoosh_bronze-coin-spin-by_01.wav',
    'public/sfx/whoosh/whoosh_whip-pan-swish_01.wav',
}
SRC = {os.path.splitext(os.path.basename(p))[0]: p for p in PLACED}
assert set(SRC) == {c['id'] for c in CUES}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]

# target distance under the voice in dB (active level to active level), by cue name prefix; first match wins
DV = [('S01', 20), ('S02', 18), ('S03', 20.5), ('S04-fanfare', 19), ('S04-held', 20.5), ('A1', 22), ('A2-evening', 22), ('A3', 19), ('A4', 21),
      ('C01', 21), ('C02', 14), ('C03', 21), ('C04', 5), ('C05', 20), ('C06', 17), ('C07', 7.5), ('C08', 20), ('C09', 14), ('C10', 18), ('C11', 15),
      ('C12', 19), ('C13', 19), ('C14', 17), ('C15', 17), ('A2-chirps', 21), ('C16', 20), ('C17', 18), ('C18', 17), ('C19', 8), ('C20', 7),
      ('C21', 19), ('C22', 14), ('C23', 14), ('C24', 19), ('C25', 8), ('C26', 7), ('C27', 21), ('C28', 6), ('C29', 5), ('X2', 19)]
def layer_of(name):
    if name.startswith('S0'): return 'bed'
    if name.startswith('A') and not name.startswith('A2-chirps'): return 'ambience'
    return 'accent'

# Editor placement decisions (cue name -> value); each is listed in build-notes.md "W5 Editor integration"
DROP = {'C01-6'}                                         # the sheet's note: C02 at G78 carries that step (C01-6 sits one frame after it)
MOVE = {'C06-lid-scrape-pop': 433}                       # the 0.22 s file puts its last transient at 0.16 s: starts at G433 so the pop lands on G438 (sheet: pop at G438)
LOOP = {'A1-workshop-tone', 'A2-evening-street', 'A3-palace-hush'}
# end frame (cue sheet endFrame/cutFrame) and fades in frames (in, out); a loop or long bed ends at its end frame
FADE = {                                                 # name: (fadeIn f, fadeOut f)
    'S01-groove': (0, 0),                                # cut dead at G438 (a 2 ms de-click only)
    'S02-plod': (0, 6),                                  # drops at G920 with a 6 f release
    'S03-hopeful-pad': (6, 15),                          # out by G1350: the sniff's near-silence G1350-1380 holds no music (levels check B05-sniff)
    'S04-fanfare-intro': (0, 9),                         # 300 ms fade-out into the held chord
    'S04-held-chord': (0, 6),                            # cut at G1730 with a 6 f release into C26
    'A1-workshop-tone': (0, 8),                          # ends G1042 under the dissolve
    'A2-evening-street': (10, 8),                        # enters across the dissolve G1037-1047, ends G1446
    'A3-palace-hush': (10, 24),                          # from G1446; 24 f release G1766-1790 so it is silent at G1790 (a 6 f release leaves 0.4 s of it in the check's 400 ms meter)
    'A4-dusk-street': (8, 6),                            # G1800-1893, end fade inside the last 6 f
}
# volume ramps in dB: name -> [(frame, offset dB)] linear in dB between points
RAMP = {'S03-hopeful-pad': [(1177, 0), (1181, -9), (1187, -9), (1191, 0)]}   # "thins G1181-1187" for the half-beat hold
TWEAK = json.load(open('scripts/edu-series/ep26/short/sound-tweak.json')) if os.path.exists('scripts/edu-series/ep26/short/sound-tweak.json') else {}
MASTER_DB = -2.3                                          # on the two delivered files: the unscaled voice + sound sum peaks +0.3 dBTP (mix-levels), this brings it to about -2.0 dBTP before render.mjs normalises

def active_db(path, rng):
    """Active level (dB) of a file: mean power of the 20 ms windows within `rng` dB of the loudest window, at 48 kHz (a 22 kHz decode
    under-reads the bright files: glint, coin whoosh); also returns the sample peak in dBFS."""
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True)
    a = array.array('h'); a.frombytes(r.stdout[:len(r.stdout) // 2 * 2]); s = [x / 32768 for x in a]
    w = 960; e = [sum(v * v for v in s[i * w:(i + 1) * w]) / w for i in range(len(s) // w)]
    pk = max(e); act = [x for x in e if x > pk * 10 ** (-rng / 10)]
    return 10 * math.log10(sum(act) / len(act)), 20 * math.log10(max(abs(v) for v in s) or 1e-6)
VOICE = active_db(NARR, 30)[0]
ACTPK = {i: active_db(p, 25) for i, p in SRC.items()}
ACT = {i: v[0] for i, v in ACTPK.items()}
PEAK_CEIL = -3.0                                          # a placed cue's own sample peak stays under this (dBFS): hits stack with beds and voice
def dv_of(name):
    for k, v in DV:
        if name.startswith(k): return v
    raise SystemExit('no dV target for cue ' + name)

items = []
for c in CUES:
    name = c['cue']
    if name in DROP: continue
    start = MOVE.get(name, c['frame'])
    end = c.get('endFrame') or c.get('cutFrame')
    if name == 'S03-hopeful-pad': end = 1350
    gain = VOICE - dv_of(name) - ACT[c['id']] + c.get('gainDb', 0.0) + TWEAK.get(name, 0.0)
    gain = min(gain, PEAK_CEIL - ACTPK[c['id']][1])
    if name == 'A4-dusk-street': end = TOTAL                  # the sheet's endFrame 1893 is the last frame: the bed runs to the end of the 1894 f timeline
    items.append(dict(name=name, src=SRC[c['id']], start=start, end=end, loop=name in LOOP, fade=FADE.get(name, (0, 0)), gain=gain, layer=layer_of(name), phase=0))
# A1 cools from G802 for the cooler B03-SH04 feel (cue sheet: low-pass, -3 dB): two pieces on one loop phase with a 6 f crossfade
a1 = next(i for i in items if i['name'] == 'A1-workshop-tone')
a1b = dict(a1, name='A1-workshop-tone-cool', start=802, phase=802, fade=(6, a1['fade'][1]), gain=a1['gain'] - 3.0, lowpass=2800)
a1['end'] = 808; a1['fade'] = (0, 6)
items.append(a1b)

filters, labels, inputs = [], {'bed': [], 'ambience': [], 'accent': []}, []
for i, it in enumerate(items):
    inputs += ['-i', it['src']]
    start, end, g = it['start'], it['end'], it['gain']
    chain = []
    if it['loop']: chain += ['aloop=loop=-1:size=2147483647']
    if it['phase'] or it['loop']: chain += [f"atrim=start={it['phase'] / FPS:.5f}" + (f":end={(end - start + it['phase']) / FPS:.5f}" if end else '')]
    elif end is not None: chain += [f'atrim=end={(end - start) / FPS:.5f}']
    chain += ['asetpts=PTS-STARTPTS']
    if it.get('lowpass'): chain += [f"lowpass=f={it['lowpass']}"]
    if it['name'] in RAMP:
        pts = [(((f - start) / FPS), g + d) for f, d in RAMP[it['name']]]
        expr = str(pts[-1][1])
        for (t0, g0), (t1, g1) in reversed(list(zip(pts, pts[1:]))):
            expr = f'if(lt(t,{t1:.5f}),{g0:.4f}+({g1:.4f}-{g0:.4f})*clip((t-{t0:.5f})/{t1 - t0:.5f},0,1),{expr})'
        chain += [f"volume='pow(10,({expr})/20)':eval=frame"]
    else:
        chain += [f'volume={g:.3f}dB']
    fin, fout = it['fade']
    if it['name'] == 'S01-groove': fout = 0
    if fin: chain += [f'afade=t=in:d={fin / FPS:.4f}:curve=tri']
    if it['name'] == 'S01-groove': chain += [f'afade=t=out:st={(end - start) / FPS - 0.002:.5f}:d=0.002']
    if fout:
        if end is not None: dur = (end - start) / FPS
        else: dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', it['src']], capture_output=True, text=True).stdout)
        chain += [f'afade=t=out:st={max(0, dur - fout / FPS):.4f}:d={fout / FPS:.4f}:curve=tri']
    d = round(start * SR / FPS)
    chain += [f'adelay={d}S|{d}S', f'apad=whole_len={N}', f'atrim=end_sample={N}']
    filters.append(f'[{i}:a]' + ','.join(chain) + f'[c{i}]')
    labels[it['layer']].append(f'[c{i}]')
outs = []
for layer, ls in labels.items():
    filters.append(''.join(ls) + f'amix=inputs={len(ls)}:normalize=0:duration=longest,atrim=end_sample={N}[{layer}]')
    outs.append(layer)
os.makedirs('out/stems', exist_ok=True); os.makedirs('out/logs', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True); os.makedirs('public/narration', exist_ok=True)
open('out/logs/ep26-sound-filter.txt', 'w').write(';'.join(filters))
with open('out/logs/ep26-sound-gains.txt', 'w') as f:
    f.write(f'voice active {VOICE:.1f} dB\n')
    for it in items: f.write(f"{it['name']:26s} G{it['start']:5d}-{it['end'] or '':<5} {it['layer']:8s} dV {dv_of(it['name'].replace('-cool','')):4.1f} tweak {TWEAK.get(it['name'], 0):+.1f} gain {it['gain']:+.2f} dB\n")
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-/filter_complex', 'out/logs/ep26-sound-filter.txt']
for layer in outs: cmd += ['-map', f'[{layer}]', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/' + layer + '.f32' + EXT]
subprocess.run(cmd, check=True)
# narration at G 0, padded to the composition length (the 2.0 s hold is silence); voice stem = the same
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', NARR, '-af', f'aformat=channel_layouts=mono,apad=whole_len={N}', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/narration.unscaled' + EXT], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/narration.unscaled' + EXT, '-c:a', 'pcm_f32le', 'out/stems/voice.f32' + EXT], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/narration.unscaled' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/narration/EDU-EP26-SHORT-narration-v1.wav'], check=True)
def dither(src, dst):   # stems only: -90 dBFS white noise keeps mix-levels.py's ebur128 from seeing all-zero 400 ms windows (EP15 finding); s16
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-f', 'lavfi', '-i', f'anoisesrc=a=0.00003:c=white:r={SR}:d={TOTAL / FPS}', '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0:duration=first,aformat=channel_layouts=mono,atrim=end_sample=%d[a]' % N, '-map', '[a]', '-c:a', 'pcm_s16le', dst], check=True)
for layer in outs + ['voice']: dither('out/stems/' + layer + '.f32' + EXT, 'out/stems/' + layer + EXT)
mix = ''.join(f'[{k}:a]' for k in range(len(outs)))
sum_cmd = ['ffmpeg', '-v', 'error', '-y'] + sum((['-i', 'out/stems/' + l + '.f32' + EXT] for l in outs), []) + ['-filter_complex', f'{mix}amix=inputs={len(outs)}:normalize=0:duration=longest[a]', '-map', '[a]', '-c:a', 'pcm_f32le', 'out/stems/sum.tmp' + EXT]
subprocess.run(sum_cmd, check=True)
pk = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'out/stems/sum.tmp' + EXT, '-af', 'astats=measure_overall=Peak_level', '-f', 'null', '-'], capture_output=True, text=True).stderr
print([l for l in pk.splitlines() if 'Peak level dB' in l][-1])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/sum.tmp' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/audio/edu/EDU-EP26-SHORT-draft-stem-v1.wav'], check=True)
print('stems in out/stems, sound stem public/audio/edu/EDU-EP26-SHORT-draft-stem-v1.wav, narration public/narration/EDU-EP26-SHORT-narration-v1.wav; gains out/logs/ep26-sound-gains.txt')
