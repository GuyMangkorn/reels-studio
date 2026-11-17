#!/usr/bin/env python3
"""EDU-EP22-SHORT sound mix (Editor, W6.1 Draft, 2026-11-17; scene sheets SCENES-R1, cue sheet EDU-EP22-SOUND-R1, 35 cues).
Places the cues of scripts/edu-series/ep22/short/sound-cues.json at their integer G frames (1717 f, 48 kHz stereo) with ffmpeg and writes
  out/stems/{voice,bed,ambience,texture,accent}.wav  (per-layer stems for `python3 -I scripts/mix-levels.py scripts/edu-series/ep22/short/sound-cues.json`)
  public/audio/edu/EDU-EP22-SHORT-draft-stem-v1.wav  (bed + ambience + texture + accent baked, s16; the narration is its own track)
  public/narration/EDU-EP22-SHORT-narration-v1.wav   (the locked narration at G 0, mono, padded to 1717 f; not in Git until the voice is committed-locked)
Gain = the cue sheet's gainDb + TWEAK[cue] (Editor mix offsets decided by mix-levels.py on the draft stems; every non-zero one is listed below with its reason).
Trim offsets (file start in the file) and gain ramps follow the cue sheet's notes. Not listened to: the mix is by number.
Run: python3 -I scripts/edu-series/ep22/short/sound-mix.py"""
import json, os, subprocess, wave, array, math
EXT = '.wav'
FPS, SR, TOTAL = 30, 48000, 1717
N = TOTAL * SR // FPS
CUES = json.load(open('scripts/edu-series/ep22/short/sound-cues.json'))['cues']
NARR = os.path.expanduser('~/ReelsStore/projects/edu/EDU/narration/EP22_narration_kore_x0.9025.wav')
# every file this mix plays (scripts/sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = {
    'public/audio/bed/bed_court-ceremonial-brisk-104_01.wav',
    'public/audio/bed/bed_court-pizz-zither-playful-104_01.wav',
    'public/audio/room/room_palace-hall-late-morning_01.wav',
    'public/audio/room/room_small-clinical-hum_01.wav',
    'public/audio/tone/tone_bowed-bass-drone-d_01.wav',
    'public/sfx/comedy/comedy_pluck-pop-round_01.wav',
    'public/sfx/comedy/comedy_pluck-question-bend_01.wav',
    'public/sfx/foley/foley_cloth-shoes-trays-approach_01.wav',
    'public/sfx/foley/foley_porcelain-spoon-tick_01.wav',
    'public/sfx/foley/foley_silver-cover-lift-scrape-ring_01.wav',
    'public/sfx/foley/foley_silver-cover-setdown_01.wav',
    'public/sfx/foley/foley_silver-covers-ripple-left-to-right_01.wav',
    'public/sfx/foley/foley_silver-strip-egg-yolk_01.wav',
    'public/sfx/foley/foley_silver-strip-water-plink_01.wav',
    'public/sfx/foley/foley_spoon-rice-bowl-taps_01.wav',
    'public/sfx/foley/foley_spoon-sauce-dip-drip_01.wav',
    'public/sfx/foley/foley_tray-set-down-a_01.wav',
    'public/sfx/foley/foley_tray-set-down-b_01.wav',
    'public/sfx/foley/foley_tray-set-down-c_01.wav',
    'public/sfx/foley/foley_tray-set-down-d_01.wav',
    'public/sfx/reveal/reveal_silver-tarnish-dull-fall_01.wav',
    'public/sfx/stinger/stinger_riser-warm-chord-zither_01.wav',
    'public/sfx/stinger/stinger_zither-end-note1-d_01.wav',
    'public/sfx/stinger/stinger_zither-end-note2-ring_01.wav',
    'public/sfx/stinger/stinger_zither-pluck-d-a_01.wav',
    'public/sfx/stinger/stinger_zither-pluck-d-b_01.wav',
    'public/sfx/ui/ui_checkpoint-chime-dimmed_01.wav',
    'public/sfx/ui/ui_checkpoint-chime-rising-three_01.wav',
}
assert PLACED == {c['src'] for c in CUES}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]

# file start offsets in seconds (cue sheet notes); loops repeat the whole file
OFFSET = {'M1-d': 18.46, 'M1-c': 9.23}
LOOP = {'A1-a', 'A1-b', 'A2'}
# gain ramps in dB: [(frame, dB offset to the cue's base gain)] linear in dB between points
RAMP = {
    'S5': [(228, 0), (274, 11), (364, 11)],            # -20 dB at G228 rising to -9 dB at G274, hold to G364, fade out 300 ms by G377
    'M1-c': [(1304, 0), (1463, 0), (1537, -6)],        # -19 until G1463, -25 by G1537
}
# final fade overrides in frames (cue-sheet placement notes), keyed by cue: (fadeInMs, fadeOutMs, endFrame)
OVERRIDE = {
    'A1-b': (0, 20 * 1000 // FPS, 1717),               # the sheet's A1 fade runs G1697-1717 (SH20 block)
    'END1-2': (0, 20 * 1000 // FPS, 1717),             # "Editor ends it with the A1 fade at G1717 (fade it from G1697)"
    'M2': (150, 700, 1211),
}
# Editor mix offsets (dB), set from mix-levels.py on the draft stems (see the W6.1 report); empty means the cue sheet gain stands
# Master level (dB) on the two delivered files (narration track and baked stem), so the cut peaks at <= -1.0 dBTP without a post-trim (W6.2 r3; r2 needed -0.5 dB in ffmpeg outside the composition). Per-layer stems stay unscaled for mix-levels.py.
MASTER_DB = -0.5
TWEAK = json.load(open('scripts/edu-series/ep22/short/sound-tweak.json')) if os.path.exists('scripts/edu-series/ep22/short/sound-tweak.json') else {}

filters, labels = [], {'bed': [], 'ambience': [], 'texture': [], 'accent': []}
inputs = []
for i, c in enumerate(CUES):
    name = c['cue']
    inputs += ['-i', c['src']]
    fin, fout, end = c.get('fadeInMs', 0), c.get('fadeOutMs', 0), c.get('endFrame')
    if name in OVERRIDE: fin, fout, end = OVERRIDE[name]
    start = c['frame']
    off = OFFSET.get(name, 0.0)
    chain = [f'atrim=start={off}' if off else 'anull']
    if name in LOOP: chain += ['aloop=loop=-1:size=2147483647']
    if end is not None: chain += [f'atrim=end={(end - start) / FPS:.5f}']
    chain += ['asetpts=PTS-STARTPTS']
    g = c['gainDb'] + TWEAK.get(name, 0.0)
    if name in RAMP:
        pts = [(((f - start) / FPS), g + d) for f, d in RAMP[name]]
        expr = str(pts[-1][1])
        for (t0, g0), (t1, g1) in reversed(list(zip(pts, pts[1:]))):
            expr = f'if(lt(t,{t1:.5f}),{g0:.4f}+({g1:.4f}-{g0:.4f})*clip((t-{t0:.5f})/{t1 - t0:.5f},0,1),{expr})'
        chain += [f"volume='pow(10,({expr})/20)':eval=frame"]
    else:
        chain += [f'volume={g:.3f}dB']
    if fin: chain += [f'afade=t=in:d={fin / 1000:.4f}:curve=tri']
    if fout:
        # fade-out ends at the cue's end: the explicit end frame, else the file's own end (probed)
        if end is not None: dur = (end - start) / FPS
        else:
            dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', c['src']], capture_output=True, text=True).stdout) - off
        chain += [f'afade=t=out:st={max(0, dur - fout / 1000):.4f}:d={fout / 1000:.4f}:curve=tri']
    d = round(start * SR / FPS)
    chain += [f'adelay={d}S|{d}S', f'apad=whole_len={N}', f'atrim=end_sample={N}']
    filters.append(f'[{i}:a]' + ','.join(chain) + f'[c{i}]')
    labels[c['layer']].append(f'[c{i}]')
outs = []
for layer, ls in labels.items():
    filters.append(''.join(ls) + f'amix=inputs={len(ls)}:normalize=0:duration=longest,atrim=end_sample={N}[{layer}]')
    outs.append(layer)
os.makedirs('out/stems', exist_ok=True); os.makedirs('out/logs', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True); os.makedirs('public/narration', exist_ok=True)
fg = ';'.join(filters)
open('out/logs/ep22-sound-filter.txt', 'w').write(fg)
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-/filter_complex', 'out/logs/ep22-sound-filter.txt']
for layer in outs: cmd += ['-map', f'[{layer}]', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/' + layer + '.f32' + EXT]
subprocess.run(cmd, check=True)
# narration at G 0, padded to the composition length; voice stem = the same, stereo-free mono
# V01 child "หืม?" (user pick C, child-boy +5%, 2026-11-17) at G 247, -1.5 dB with S7 tweak -3 dB so the coincident G249 peak stays under the -1 dBTP ceiling (Final cut r1 raw peak was -0.4), mixed into the voice track (not subtitled)
V01 = 'public/narration/EDU-EP22-SHORT-V01-child-boy-v1.wav'; V01_G = 247
d01 = round(V01_G * SR / FPS)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', NARR, '-i', V01, '-filter_complex', f'[0:a]aformat=channel_layouts=mono[n];[1:a]aformat=channel_layouts=mono,volume=-1.5dB,adelay={d01}S[v];[n][v]amix=inputs=2:normalize=0:duration=longest,apad=whole_len={N},atrim=end_sample={N}[a]', '-map', '[a]', '-ac', '1', '-c:a', 'pcm_f32le', 'out/stems/' + 'narration.unscaled' + EXT], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/' + 'narration.unscaled' + EXT, '-c:a', 'pcm_f32le', 'out/stems/' + 'voice.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/' + 'narration.unscaled' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/narration/EDU-EP22-SHORT-narration-v1.wav'], check=True)
# stems: float files re-written as s16 with +-1 LSB dither (mix-levels' ebur128 never sees all-zero windows, EP15 finding) is skipped here: ebur128 reads float fine
def dither(src, dst):   # stems only: -90 dBFS white noise keeps mix-levels.py's ebur128 from seeing all-zero 400 ms windows (EP15 finding); s16
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-f', 'lavfi', '-i', f'anoisesrc=a=0.00003:c=white:r={SR}:d={TOTAL / FPS}', '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0:duration=first,aformat=channel_layouts=stereo[a]' if 'voice' not in dst else '[0:a][1:a]amix=inputs=2:normalize=0:duration=first[a]', '-map', '[a]', '-c:a', 'pcm_s16le', dst], check=True)
for layer in outs: dither('out/stems/' + layer + '.f32' + EXT, 'out/stems/' + layer + EXT)
dither('out/stems/' + 'voice' + EXT, 'out/stems/' + 'voice.d' + EXT); os.replace('out/stems/' + 'voice.d' + EXT, 'out/stems/' + 'voice' + EXT)
mix = ''.join(f'[{k}:a]' for k in range(len(outs)))
sum_cmd = ['ffmpeg', '-v', 'error', '-y'] + sum((['-i', 'out/stems/' + l + '.wav'] for l in outs), []) + ['-filter_complex', f'{mix}amix=inputs={len(outs)}:normalize=0:duration=longest[a]', '-map', '[a]', '-c:a', 'pcm_f32le', 'out/stems/' + 'sum.tmp' + EXT]
subprocess.run(sum_cmd, check=True)
pk = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', 'out/stems/' + 'sum.tmp' + EXT, '-af', 'astats=measure_overall=Peak_level', '-f', 'null', '-'], capture_output=True, text=True).stderr
print([l for l in pk.splitlines() if 'Peak level dB' in l][-1])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/' + 'sum.tmp' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/audio/edu/EDU-EP22-SHORT-draft-stem-v1.wav'], check=True)
print('stems in out/stems, sound stem public/audio/edu/EDU-EP22-SHORT-draft-stem-v1.wav, narration public/narration/EDU-EP22-SHORT-narration-v1.wav')
