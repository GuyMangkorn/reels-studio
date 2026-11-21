#!/usr/bin/env python3
"""EDU-EP32-SHORT sound mix (Editor, W5.3 pass 1, 2026-11-21; scene sheet EDU-EP32-SHEET-R1, cue sheet scripts/edu-series/ep32/sound-cues.json, 51 placements, 1689 f at 30 fps, 48 kHz).
Adapted from scripts/edu-series/ep30/short/sound-mix.py. Places every cue at its integer G frame (the file starts on the cue frame, as the sheet says) with ffmpeg and writes
  out/stems/{voice,music,ambience,texture,accent}.wav  (stereo s16 per-layer stems = the cue sheet's levels.stems, for `python3 -I scripts/mix-levels.py scripts/edu-series/ep32/sound-cues.json`; Ton measures)
  public/audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav    (music + ambience + texture + accent baked, stereo s16; the narration is its own track, public/narration/EDU-EP32-SHORT-narration-v1.wav, untouched)
Layers: music = M1-M6 beds; ambience = A1-A4 room/outdoor tones; texture = continuous or soft foley (static bed, purr, pencil line, steps, typewriter, paper settles; levels rows >= 18 dV);
accent = hits and stingers (levels rows >= 12 dV over speech, or -6..3 peak rows in a gap: C02-a, C10, C26, M7). Every source is mixed to mono and placed at centre.
Gain per cue = voice active level - dV - the file's active level (+ sheet gainDb); dV table below. Not listened to: set by number. Further under the narration than the sheet's floors
(EP30 precedent, user 21 Nov 2026 "music and effects covered the narration"): music 20, ambience 20, texture 20-22, accents 12-16 over words.
Run: python3 -I scripts/edu-series/ep32/short/sound-mix.py"""
import array, json, math, os, subprocess
EXT = '.wav'
FPS, SR, TOTAL = 30, 48000, 1689
N = TOTAL * SR // FPS
SHEET = json.load(open('scripts/edu-series/ep32/sound-cues.json'))
CUES = SHEET['cues']
NARR = 'public/narration/EDU-EP32-SHORT-narration-v1.wav'      # VOICE-R2 x1.00, 56.31 s mono (store projects/edu/EDU/narration/ep32-voice-r2/)
# every file this mix plays (scripts/sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = [
    'public/audio/bed/bed_spy-brass-pompous-swell_01.wav',
    'public/audio/bed/bed_spy-jazz-mission-ticks_01.wav',
    'public/audio/bed/bed_spy-jazz-sly-bass-brushes_01.wav',
    'public/audio/bed/bed_spy-jazz-sly-bass-brushes_02.wav',
    'public/audio/bed/bed_spy-jazz-theme-full_01.wav',
    'public/audio/bed/bed_spy-trumpet-lone-amused_01.wav',
    'public/audio/nature/nature_training-field-afternoon_01.wav',
    'public/audio/outdoor/outdoor_park-birds-breeze_01.wav',
    'public/audio/room/room_corridor-fluorescent-hum_01.wav',
    'public/audio/room/room_office-night-lamp-hum_01.wav',
    'public/audio/tone/tone_bowed-bass-drone-d_01.wav',
    'public/sfx/comedy/comedy_brass-wah-droop-short_01.wav',
    'public/sfx/comedy/comedy_trumpet-smug-tada_01.wav',
    'public/sfx/creature/creature_cat-mrrp-bored_02.wav',
    'public/sfx/creature/creature_cat-paw-thump-turf_01.wav',
    'public/sfx/creature/creature_cat-purr_01.wav',
    'public/sfx/creature/creature_cat-yawn-squeak_01.wav',
    'public/sfx/creature/creature_sparrow-flutter-chirp_01.wav',
    'public/sfx/electric/electric_radio-keyup-squelch_01.wav',
    'public/sfx/electric/electric_radio-squelch-out_01.wav',
    'public/sfx/electric/electric_radio-static-bed_01.wav',
    'public/sfx/foley/foley_card-flaps-popup-snap_01.wav',
    'public/sfx/foley/foley_card-folder-slide-felt_01.wav',
    'public/sfx/foley/foley_card-slot-slide_01.wav',
    'public/sfx/foley/foley_card-tap-wood_01.wav',
    'public/sfx/foley/foley_cat-steps-turf_01.wav',
    'public/sfx/foley/foley_cat-tail-paper-brush_01.wav',
    'public/sfx/foley/foley_door-swing-latch-corridor_01.wav',
    'public/sfx/foley/foley_folder-cover-drop_01.wav',
    'public/sfx/foley/foley_highlighter-squeak_01.wav',
    'public/sfx/foley/foley_kibble-pour-steel-bowl_01.wav',
    'public/sfx/foley/foley_paper-settle-folder_01.wav',
    'public/sfx/foley/foley_pen-scratch-ping_01.wav',
    'public/sfx/foley/foley_pen-scratch-ping_02.wav',
    'public/sfx/foley/foley_pen-scratch-ping_03.wav',
    'public/sfx/foley/foley_pencil-dotted-line_01.wav',
    'public/sfx/foley/foley_printout-drop-desk_01.wav',
    'public/sfx/foley/foley_stamp-heavy-thud_01.wav',
    'public/sfx/foley/foley_steel-bowl-slide-lino_01.wav',
    'public/sfx/foley/foley_typewriter-bell-carriage_01.wav',
    'public/sfx/foley/foley_typewriter-keys-run_01.wav',
    'public/sfx/reveal/reveal_sun-shimmer-soft_01.wav',
    'public/sfx/stinger/stinger_trumpet-lazy-tag-ending_01.wav',
    'public/sfx/whoosh/whoosh_paper-sheet-fall-through_01.wav',
]
SRC = {os.path.splitext(os.path.basename(p))[0]: p for p in PLACED}
# Draft round 1 (21 Nov 2026): M7's file ends in a baked 70 ms fade (the last note's bend-down and decay: -6 to -52 dB in 80 ms), which reads as cut off.
# The mix keeps the file up to 0.80 s and slows the last 0.16 s to 0.3x (bend-down and decay over about 0.53 s), 20 ms crossfade: derived file in out/, the cue sheet's file is unchanged.
os.makedirs('out/sfx-derived', exist_ok=True)
M7_SRC = SRC['stinger_trumpet-lazy-tag-ending_01']; M7_TAIL = 'out/sfx-derived/stinger_trumpet-lazy-tag-ending_01_tail.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', M7_SRC, '-filter_complex',
    '[0:a]asplit[a][b];[a]atrim=end=0.80,asetpts=PTS-STARTPTS[h];[b]atrim=start=0.80,asetpts=PTS-STARTPTS,atempo=0.5,atempo=0.6[t];[h][t]acrossfade=d=0.02:c1=tri:c2=tri', '-ar', '48000', M7_TAIL], check=True)
SRC['stinger_trumpet-lazy-tag-ending_01'] = M7_TAIL
assert set(SRC) == {c['id'] for c in CUES}, set(SRC) ^ {c['id'] for c in CUES}
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]
assert len(CUES) == 51

# cue -> (layer, dV under the voice in dB active-to-active). Reasons in build-notes.md "W5.3 Editor pass 1":
# first pass 20/20/20/14 over words measured 2-5 LU further under than set (mix-levels.py reads momentary M, my gain uses the file's active level): re-set so the measured music and ambience
# land at 18-21 (sheet: 15-20, warn above 20; EP30 precedent further under), background >= 15 where the accents allow (B02: accents 15-20, A2 24), texture 20, accents on or beside a word 12-17;
# peak rows (accent -6..3 in a gap): C02-a 5.5 (3 pushed the mrrp tail into B02's first speech window: B02 background FAIL), C10 3, C26 0, M7 0; C30 is the tail-tip brush with no picture (the stamp insert is top-down, no cat in frame): kept in the mix at 32 dV,
# near-inaudible, so the cue sheet stays exact; Film or the user can drop it.
L = {
 'M1': ('music', 17.5), 'M2a': ('music', 20), 'M2b': ('music', 20), 'M3': ('music', 15), 'M4': ('music', 18.5), 'M5': ('music', 19), 'M6': ('music', 18), 'M7': ('accent', 0),
 'A1-B01': ('ambience', 19.5), 'A1-B05': ('ambience', 20), 'A2': ('ambience', 24), 'A3': ('ambience', 20.5), 'A4': ('ambience', 22),
 'C01-a': ('accent', 14), 'C01-b': ('accent', 14), 'C01-c': ('accent', 14), 'C02-a': ('accent', 5.5), 'C02-b': ('accent', 8),
 'C04': ('accent', 20), 'C05': ('accent', 18.5), 'C06': ('accent', 20), 'C07': ('accent', 15), 'C08': ('accent', 19), 'C09': ('accent', 16),
 'C10': ('accent', 3), 'C10b': ('accent', 14), 'C11': ('texture', 20), 'C12': ('accent', 16), 'C13': ('accent', 16), 'C14': ('accent', 15),
 'C15-a': ('texture', 20), 'C15-b': ('texture', 20), 'C16-a': ('texture', 20), 'C16-b': ('texture', 20), 'C17': ('accent', 16), 'C18': ('texture', 20),
 'C19': ('accent', 13), 'C20-a': ('accent', 14), 'C20-b': ('accent', 14), 'C21': ('accent', 14), 'C22': ('accent', 14), 'C23': ('texture', 20),
 'C24-a': ('texture', 20), 'C24-b': ('texture', 20), 'C25': ('accent', 12), 'C26': ('accent', 0), 'C27': ('texture', 18), 'C28': ('accent', 12),
 'C29-a': ('accent', 16), 'C29-b': ('accent', 16), 'C30': ('texture', 32),
}
assert set(L) == {c['cue'] for c in CUES}, set(L) ^ {c['cue'] for c in CUES}
# fades (in f, out f): beds and ambiences ramp, a cut-dead music cue gets 2 f, accents none unless the sheet bakes one
FADE = {
 'M1': (0, 2), 'M2a': (0, 4), 'M2b': (4, 4), 'M3': (0, 2), 'M4': (12, 12), 'M5': (0, 2), 'M6': (0, 0), 'M7': (0, 0), 'C17': (0, 6),
 'A1-B01': (0, 6), 'A1-B05': (6, 0), 'A2': (0, 16), 'A3': (12, 8), 'A4': (6, 6), 'C11': (0, 8), 'C15-a': (10, 10), 'C15-b': (6, 0),
 'C16-a': (0, 2), 'C16-b': (0, 4), 'C24-a': (0, 2), 'C24-b': (0, 4),
}
LOOP = {'A1-B05'}                         # 13 s file, 557 f = 18.6 s span: the sheet says loop once and a half (seam crossfade baked in the file)
OFFSET = {'C15-b': 5.0, 'C16-b': 0.5, 'C24-b': 2.0}   # source offset (s) the cue sheet gives
HIGHPASS = {'A2': 900}                     # Hz, the sheet's "thin" outdoor bed
# volume ramps in dB, linear in dB between points: name -> [(global frame, offset dB)]
RAMP = {
 'M3': [(614, 0), (697, 4)],                                                       # sheet: the source pulse is steady, ride it up over the 2.8 s
 'M6': [(1496, 0), (1500, -4), (1512, -4), (1516, 0)],                             # pull back on "มีความคิดของมันเอง"... (L89-L101)
 'A2': [(329, 0), (432, 0), (440, -5), (574, -5), (598, -3)],                      # lower in B02-SH02/03
 'A3': [(614, 0), (780, 0), (790, -3), (880, -3), (895, -6)],                      # low in B03-SH04 and B04-SH01
 'C15-b': [(1583, 0), (1651, 5)],                                                  # raised toward the stamp insert
}
MASTER_DB = 0.0
PEAK_CEIL = -3.0
PEAK_CEIL_CUE = {'C10': -1.1, 'C26': -0.5, 'M7': -1.5}   # the three rows that judge a short hit's momentary level (accent peak -6..3): nearer full scale; the render's limiter and loudnorm follow
#                                      # a placed cue's own sample peak stays under this (dBFS): hits stack with beds and voice

def decode(path):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True)
    a = array.array('h'); a.frombytes(r.stdout[:len(r.stdout) // 2 * 2]); return [x / 32768 for x in a]
def active_db(path, rng, skip=0.0, take=None):
    """Active level (dB): mean power of the 20 ms windows within `rng` dB of the loudest window, over the used part of the file; also the sample peak (dBFS) and the length in seconds."""
    s = decode(path); s = s[int(skip * 48000):int((skip + take) * 48000) if take else None]
    w = 960; e = [sum(v * v for v in s[i * w:(i + 1) * w]) / w for i in range(len(s) // w)]
    pk = max(e); act = [x for x in e if x > pk * 10 ** (-rng / 10)]
    return 10 * math.log10(sum(act) / len(act)), 20 * math.log10(max(abs(v) for v in s) or 1e-6), len(decode(path)) / 48000
VOICE = active_db(NARR, 30)[0]

items = []
for c in CUES:
    name = c['cue']; layer, dv = L[name]
    start = c['frame']; end = start + c['durationFrames']
    act, peak, dur = active_db(SRC[c['id']], 25, OFFSET.get(name, 0.0), c['durationFrames'] / FPS)
    loop = name in LOOP
    assert loop or (end - start) <= (dur - OFFSET.get(name, 0.0)) * FPS + 4, (name, 'file shorter than its span: add to LOOP')
    gain = VOICE - dv - act + c.get('gainDb', 0.0)
    clipped = gain > PEAK_CEIL_CUE.get(name, PEAK_CEIL) - peak
    gain = min(gain, PEAK_CEIL_CUE.get(name, PEAK_CEIL) - peak)
    items.append(dict(name=name, src=SRC[c['id']], start=start, end=min(end, TOTAL), loop=loop, fade=FADE.get(name, (0, 0)), gain=gain, layer=layer, dv=dv, clipped=clipped, off=OFFSET.get(name, 0.0)))

filters, labels, inputs = [], {'music': [], 'ambience': [], 'texture': [], 'accent': []}, []
for i, it in enumerate(items):
    inputs += ['-i', it['src']]
    start, end, g = it['start'], it['end'], it['gain']
    span = (end - start) / FPS
    chain = ['aformat=channel_layouts=mono', 'aresample=48000']
    if it['off']: chain += [f"atrim=start={it['off']:.4f}", 'asetpts=PTS-STARTPTS']
    if it['loop']: chain += ['aloop=loop=-1:size=2147483647']
    if it['name'] in HIGHPASS: chain += [f"highpass=f={HIGHPASS[it['name']]}"]
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
    d = round(start * SR / FPS)
    chain += ['pan=stereo|c0=c0|c1=c0', f'adelay={d}S|{d}S', f'apad=whole_len={N}', f'atrim=end_sample={N}']
    filters.append(f'[{i}:a]' + ','.join(chain) + f'[c{i}]')
    labels[it['layer']].append(f'[c{i}]')
outs = []
for layer, ls in labels.items():
    filters.append(''.join(ls) + f'amix=inputs={len(ls)}:normalize=0:duration=longest,atrim=end_sample={N}[{layer}]')
    outs.append(layer)
os.makedirs('out/stems', exist_ok=True); os.makedirs('out/logs', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
open('out/logs/ep32-sound-filter.txt', 'w').write(';'.join(filters))
with open('out/logs/ep32-sound-gains.txt', 'w') as f:
    f.write(f'voice active {VOICE:.1f} dB\n')
    for it in items: f.write(f"{it['name']:8s} G{it['start']:5d}-{it['end']:<5} {it['layer']:8s} loop {int(it['loop'])} fade {it['fade']} dV {it['dv']:4.1f} gain {it['gain']:+6.2f} dB{'  PEAK-LIMITED' if it['clipped'] else ''}\n")
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-/filter_complex', 'out/logs/ep32-sound-filter.txt']
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
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/stems/sum.tmp' + EXT, '-af', f'volume={MASTER_DB}dB', '-c:a', 'pcm_s16le', 'public/audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav'], check=True)
print('stems in out/stems, sound stem public/audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav; gains out/logs/ep32-sound-gains.txt')
