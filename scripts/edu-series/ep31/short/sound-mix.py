#!/usr/bin/env python3
"""EDU-EP31-SHORT sound mix (Editor, W5.3 Draft, 2026-11-21; scene sheets EDU-EP31-SCENE-R2 (B01 retimed 21 Nov 2026), cue sheet scripts/edu-series/ep31/short/sound-cues.json, 76 placements, 1795 f at 30 fps).
Adapted from scripts/edu-series/ep30/short/sound-mix.py. Places every cue at its integer G frame (the file starts on the cue frame, as the sheet says) with ffmpeg and writes
  out/stems/{voice,bed,texture,accent}.wav  (stereo s16 per-layer stems = the cue sheet's `levels.stems`, for `python3 -I scripts/mix-levels.py scripts/edu-series/ep31/short/sound-cues.json`; Ton measures)
  public/audio/edu/EDU-EP31-SHORT-draft-stem-v1.wav  (bed + texture + accent baked, stereo s16; the narration is its own track, public/narration/EDU-EP31-SHORT-narration-v1.wav, untouched)
Gains: the cue sheet's own `gainDb` on the filed master, unchanged (Ton calibrated it against the VOICE-R1 preview: speech about -15.9 LUFS; bed 20.4, texture 21.9, accent 19.4, background 15.7 dV).
Editor adds no per-cue level of its own; a cue that fails in the mix goes back to Ton (fixlist). Sheet fields: frame (start), durationFrames (placed length; a longer file is trimmed to it,
fadeOutFrames at its end; absent = the whole file), offsetFrames (where in the file playback starts), fadeInFrames, fadeOutFrames, gainDb. Layers: bed = music, texture = ambience and foley, accent = hits and stingers.
Every source is mixed to mono and placed at centre (the narration is mono and plays on both channels, so stem and voice keep their measured distance on a phone).
Run: python3 -I scripts/edu-series/ep31/short/sound-mix.py"""
import json, os, subprocess
FPS, SR, TOTAL = 30, 48000, 1795
N = TOTAL * SR // FPS
EXT = '.wav'
SUM = 'out/stems/sum.tmp' + EXT
STEM = 'public/audio/edu/EDU-EP31-SHORT-draft-stem-v1' + EXT   # played by src/videos/edu-ep31/index.ts as audio/edu/EDU-EP31-SHORT-draft-stem-v1.wav (exempt in the cue sheet)
SHEET = json.load(open('scripts/edu-series/ep31/short/sound-cues.json'))
CUES = SHEET['cues']
NARR = 'public/narration/EDU-EP31-SHORT-narration-v1.wav'      # VOICE-R1.3 (L01 c1), store projects/edu/EDU/narration/ep31-voice-r1-3/preview.wav, 1795 f mono
# every file this mix plays (scripts/sound-cues.py reads these quoted paths; the mix asserts the cue sheet names the same files)
PLACED = [
    'public/audio/bed/bed_experiment-tick-pizz-98_01.wav',
    'public/audio/bed/bed_heist-funk-groove-98-intro_01.wav',
    'public/audio/bed/bed_heist-funk-groove-98-return_01.wav',
    'public/audio/bed/bed_heist-funk-groove-98-swagger_01.wav',
    'public/audio/bed/bed_heist-funk-sly-98-a_01.wav',
    'public/audio/bed/bed_heist-funk-sly-98-b_01.wav',
    'public/audio/bed/bed_video-tape-hiss-hum_01.wav',
    'public/audio/bed/bed_wistful-heist-groove-80_01.wav',
    'public/audio/city/city_thai-street-midday_01.wav',
    'public/audio/comedy/comedy_bonk-wood-flat_01.wav',
    'public/audio/comedy/comedy_boop-two-note-rising_01.wav',
    'public/audio/comedy/comedy_heist-glint-ting_01.wav',
    'public/audio/comedy/comedy_horn-wah-falling_01.wav',
    'public/audio/comedy/comedy_kazoo-dip-sheepish_01.wav',
    'public/audio/comedy/comedy_plastic-boing-wobble_01.wav',
    'public/audio/electric/electric_camera-broken-shutter-sputter_01.wav',
    'public/audio/electric/electric_crt-power-on-degauss_01.wav',
    'public/audio/electric/electric_crt-static-blip_01.wav',
    'public/audio/electric/electric_desk-phone-trill_01.wav',
    'public/audio/electric/electric_phone-shutter-flash_01.wav',
    'public/audio/electric/electric_rec-beep-flat_01.wav',
    'public/audio/electric/electric_spark-fizz-pok_01.wav',
    'public/audio/electric/electric_tube-flicker-steady_01.wav',
    'public/audio/foley/foley_calendar-page-tear_01.wav',
    'public/audio/foley/foley_canvas-bag-zip_01.wav',
    'public/audio/foley/foley_finger-snap-dry_01.wav',
    'public/audio/foley/foley_finger-snap-room-tail_01.wav',
    'public/audio/foley/foley_glass-door-close-bank_01.wav',
    'public/audio/foley/foley_lemon-pat-cheek_01.wav',
    'public/audio/foley/foley_lemon-rub-cheeks_01.wav',
    'public/audio/foley/foley_lemon-tip-thud_01.wav',
    'public/audio/foley/foley_lime-squeeze-papaya_01.wav',
    'public/audio/foley/foley_paper-flex-thin_01.wav',
    'public/audio/foley/foley_photo-card-flap_01.wav',
    'public/audio/foley/foley_photo-paper-slide_01.wav',
    'public/audio/foley/foley_whisper-cup-male_01.wav',
    'public/audio/impact/impact_camera-slam-table_01.wav',
    'public/audio/impact/impact_lens-crack-tik_01.wav',
    'public/audio/impact/impact_steel-door-thud_01.wav',
    'public/audio/mechanical/mechanical_cctv-motor-click_01.wav',
    'public/audio/mechanical/mechanical_print-eject-stutter_01.wav',
    'public/audio/mechanical/mechanical_servo-whirr-toy_01.wav',
    'public/audio/reveal/reveal_dream-harp-shimmer_01.wav',
    'public/audio/reveal/reveal_glass-shimmer-soft_01.wav',
    'public/audio/room/room_bank-lobby-1995_01.wav',
    'public/audio/room/room_crt-whine-dark-room_01.wav',
    'public/audio/room/room_desk-lamp-night-quiet_01.wav',
    'public/audio/room/room_kitchen-night-winter_01.wav',
    'public/audio/room/room_police-room-fluorescent-buzz_01.wav',
    'public/audio/stinger/stinger_bass-two-note-tag_01.wav',
    'public/audio/stinger/stinger_brass-stab-three-note_01.wav',
    'public/audio/stinger/stinger_local-news-sting-1990s_01.wav',
    'public/audio/tension/tension_clock-tick-accel_01.wav',
    'public/audio/ui/ui_pop_01.wav',
    'public/audio/water/water_ice-settle-tick_01.wav',
    'public/audio/whoosh/whoosh_air-swish-rising_01.wav',
]
assert set(PLACED) == {c['path'] for c in CUES}, 'cue sheet and PLACED differ'
assert all(os.path.exists(p) for p in PLACED), [p for p in PLACED if not os.path.exists(p)]
assert len(CUES) == 76 and SHEET['durationFrames'] == TOTAL

def seconds(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout)

filters, labels, inputs, log = [], {'bed': [], 'texture': [], 'accent': []}, [], []
for i, c in enumerate(CUES):
    inputs += ['-i', c['path']]
    start, off = c['frame'], c.get('offsetFrames', 0)
    avail = seconds(c['path']) * FPS - off
    span = c.get('durationFrames', avail)
    assert span <= avail + 1.5, (c['cue'], 'file shorter than its placed span', span, avail)
    span = min(span, TOTAL - start)
    chain = ['aformat=channel_layouts=mono', 'aresample=48000', f'atrim=start={off / FPS:.5f}:end={(off + span) / FPS:.5f}', 'asetpts=PTS-STARTPTS', f'volume={c["gainDb"]:.3f}dB']
    fin, fout = c.get('fadeInFrames', 0), c.get('fadeOutFrames', 0)
    if fin: chain.append(f'afade=t=in:d={fin / FPS:.4f}:curve=tri')
    if fout: chain.append(f'afade=t=out:st={max(0, span / FPS - fout / FPS):.4f}:d={fout / FPS:.4f}:curve=tri')
    d = round(start * SR / FPS)
    chain += ['pan=stereo|c0=c0|c1=c0', f'adelay={d}S|{d}S', f'apad=whole_len={N}', f'atrim=end_sample={N}']
    filters.append(f'[{i}:a]' + ','.join(chain) + f'[c{i}]')
    labels[c['layer']].append(f'[c{i}]')
    log.append(f"{c['cue']:22s} G{start:5d}-{start + int(round(span)):<5d} {c['layer']:8s} gain {c['gainDb']:+6.1f} dB fade {fin}/{fout} off {off}")
outs = []
for layer, ls in labels.items():
    filters.append(''.join(ls) + f'amix=inputs={len(ls)}:normalize=0:duration=longest,atrim=end_sample={N}[{layer}]')
    outs.append(layer)
os.makedirs('out/stems', exist_ok=True); os.makedirs('out/logs', exist_ok=True); os.makedirs('public/audio/edu', exist_ok=True)
open('out/logs/ep31-sound-filter.txt', 'w').write(';'.join(filters))
open('out/logs/ep31-sound-placements.txt', 'w').write('\n'.join(log) + '\n')
cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-/filter_complex', 'out/logs/ep31-sound-filter.txt']
for layer in outs: cmd += ['-map', f'[{layer}]', '-c:a', 'pcm_f32le', '-ar', str(SR), f'out/stems/{layer}.f32{EXT}']
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', NARR, '-af', f'aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0,apad=whole_len={N},atrim=end_sample={N}', '-c:a', 'pcm_f32le', '-ar', str(SR), 'out/stems/voice.f32' + EXT], check=True)
def dither(src, dst):   # stems only: -90 dBFS white noise keeps mix-levels.py's ebur128 from seeing all-zero 400 ms windows; s16
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-f', 'lavfi', '-i', f'anoisesrc=a=0.00003:c=white:r={SR}:d={TOTAL / FPS}', '-filter_complex',
                    '[1:a]aformat=channel_layouts=stereo[n];[0:a][n]amix=inputs=2:normalize=0:duration=first', '-c:a', 'pcm_s16le', '-ar', str(SR), dst], check=True)
for layer in outs + ['voice']: dither(f'out/stems/{layer}.f32{EXT}', f'out/stems/{layer}{EXT}')
mix = ''.join(f'[{k}:a]' for k in range(len(outs)))
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + sum((['-i', f'out/stems/{l}.f32{EXT}'] for l in outs), []) + ['-filter_complex', f'{mix}amix=inputs={len(outs)}:normalize=0:duration=longest[a]', '-map', '[a]', '-c:a', 'pcm_f32le', SUM], check=True)
def peak(*files):
    fl = sum((['-i', f] for f in files), [])
    flt = ''.join(f'[{k}:a]' for k in range(len(files))) + f'amix=inputs={len(files)}:normalize=0:duration=longest,astats=measure_overall=Peak_level'
    pk = subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + fl + ['-filter_complex', flt, '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [l for l in pk.splitlines() if 'Peak level dB' in l][-1].strip()
print('sound stem (no voice):', peak(SUM))
print('voice + sound sum:', peak(SUM, 'out/stems/voice.f32' + EXT))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SUM, '-c:a', 'pcm_s16le', STEM], check=True)
print('stems in out/stems, sound stem', STEM, '; placements out/logs/ep31-sound-placements.txt')
