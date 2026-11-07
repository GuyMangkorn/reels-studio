#!/usr/bin/env python3
"""EDU-EP06-SHORT review sound stem v1 (Editor, W5.3, 2026-11-07), per scene-sheets.md "Sound plan" (SHEETS-R1.1). Library files only (incl. the EDU-EP06
files generated and filed 2026-11-07: cat mrrp/purr, night room tone, felt-piano M1/M2, single felt note). Every file is generated and unlistened;
levels are by number, not ear. NG-S3..S8 foley (thump, paw steps, sniffs, rubs, creak, settle) are NOT generated: placeholders, silent. NG-M3 second note = the single note
pitched up a fifth. Writes public/audio/edu/EDU-EP06-SHORT-review-stem-v2.wav (1685 f, 48 kHz mono). Needs public/narration/EDU-EP06-SHORT.wav as duck key.
Closing: layers fade to zero from the last word's end G1612, then the EP02 pizz tag (stinger_pizz-tag-ending_01) rings from G1612.
Policy: B04-SH01 (G787-847) music out, room tone + tick only, chime on G832; L13 clause G1522-1599 no one-shot, resolve onset G1606 on "รัก"; fade to silence G1661-1684.
Run: python3 -I scripts/edu-series/ep06/sound-mix.py"""
import os, subprocess
L = os.path.expanduser('~/ReelsStore/library/sound')
FPS, TOTAL = 30, 1685
DUR = TOTAL / FPS
ins, g, mix, mus = [], [], [], []
def add(rel, loop=False):
    ins.append((['-stream_loop', '-1'] if loop else []) + ['-i', f'{L}/{rel}']); return len(ins) - 1
def cue(rel, fr, db, trim=None, ex='', bus=None):   # one-shot at global frame fr
    i = add(rel); k = len(g)
    chain = [f'atrim=0:{trim}' if trim else '', ex, f'volume={db}dB', f'adelay={int(round(fr / FPS * 1000))}:all=1']
    g.append(f'[{i}:a]' + ','.join(c for c in chain if c) + f'[c{k}]'); (bus if bus is not None else mix).append(f'[c{k}]')
def bed(rel, a, b, db, ex='', fin=0.15, fout=0.15, bus=None, ss=0):   # looped bed over [a, b) frames
    i = add(rel, True); k = len(g); n = (b - a) / FPS
    chain = [f'atrim={ss}:{ss + n}' if ss else f'atrim=0:{n}', 'asetpts=PTS-STARTPTS', ex, f'volume={db}dB', f'afade=t=in:d={fin}', f'afade=t=out:st={max(0, n - fout)}:d={fout}', f'adelay={int(round(a / FPS * 1000))}:all=1']
    g.append(f'[{i}:a]' + ','.join(c for c in chain if c) + f'[b{k}]'); (bus if bus is not None else mix).append(f'[b{k}]')
# room tone: night G0-1046, day birds G1040-1112 (crossfade 6 f), night again G1112-1685 (NG-A1); tick low under every night shot
bed('ambience/room/room_condo-night-quiet_01.wav', 0, 1046, -34, fout=0.2)
bed('ambience/room/room_soi-morning-quiet_01.wav', 1040, 1112, -30, 'lowpass=f=1800', 0.2, 0.2)
bed('ambience/room/room_condo-night-quiet_01.wav', 1112, 1685, -34, fin=0.2, fout=0.8)
bed('sfx/tension/tension_clock-pulse_01.wav', 0, 787, -44, fout=0.3)
bed('sfx/tension/tension_clock-pulse_01.wav', 787, 847, -42, fin=0.1, fout=0.3)      # B04-SH01: room tone + tick only
bed('sfx/tension/tension_clock-pulse_01.wav', 847, 1040, -46, fin=0.3, fout=0.5)
# tension: drone G62-522, thin tone G294-522 (fades G495-522)
bed('ambience/bed/bed_sub-drone-fade-in_01.wav', 62, 522, -30, fin=1.0, fout=0.8, bus=mus)
bed('music/tone/tone_thin-unresolved_01.wav', 294, 522, -31, fin=0.4, fout=0.9, bus=mus)
# M1 theme G0-294 (out on "ลองนึก"); returns very low from G542 (B03-SH01 L20) as a sparse tail, out by G787
bed('music/bed/bed_edu06-felt-piano-theme_01.wav', 0, 294, -25, fin=0.4, fout=0.15, bus=mus)
bed('music/bed/bed_edu06-felt-piano-theme_01.wav', 542, 787, -31, fin=1.0, fout=0.4, bus=mus, ss=12)
# count notes on "หนึ่ง" G717 and "สอง" G733 (second a fifth up); chime on the half-close G832; reverse swell into "ลองนึก"
cue('music/stinger/stinger_felt-note-single_01.wav', 717, -20)
cue('music/stinger/stinger_felt-note-single_01.wav', 733, -20, ex='asetrate=48000*1.4983,aresample=48000')
cue('sfx/reveal/reveal_glass-shimmer-soft_01.wav', 832, -16)
cue('sfx/reveal/reveal_reverse-swell-airy_01.wav', 286, -18)
cue('sfx/reveal/reveal_glass-shimmer-soft_01.wav', 1639, -22)                          # optional quieter closing-blink chime (Editor's call)
# V01 mrrp over the cat's walk-away (shot L86 = G242); V02 purr in G1194 over 45 f, steady under the voice, out with the picture
cue('sfx/creature/creature_cat-mrrp_01.wav', 242, -14)
bed('sfx/creature/creature_cat-purr_01.wav', 1194, 1685, -29, fin=1.5, fout=0.8, bus=mus)
# warm return: pad under L03b from G877 (8 s), M2 from G877, resolve on "รัก" G1606 (fallback stinger; M2 stays at bed level G1522-1599)
cue('music/bed/bed_warm-pad-felt-third_01.wav', 868, -27, ex='afade=t=in:d=0.6,afade=t=out:st=6.5:d=1.5', bus=mus)
bed('music/bed/bed_edu06-felt-piano-warm_01.wav', 877, 1685, -26, fin=1.0, fout=0.8, bus=mus)
cue('music/stinger/stinger_outro-resolve_01.wav', 1606, -23)
nar = len(ins); ins.append(['-i', 'public/narration/EDU-EP06-SHORT.wav'])
g.append(f'[{nar}:a]asplit=1[key]')
g.append(f'{"".join(mus)}amix=inputs={len(mus)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[musraw]')
g.append('[musraw][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=400:makeup=1[musd]'); mix.append('[musd]')
# closing (user, 2026-11-07, "closing sound like EP02/EP03"): every layer above fades to zero from the last word's end (G1612, 53.75 s, measured), and the library tag
# EP02 closes on (sfx/stinger/stinger_pizz-tag-ending_01.wav, peak -1 dB -> -10 dB, 2.2 s with a 0.5 s fade) starts on that frame; it is finished by G1682, before the A_fade black.
END_F, TAG = 1612, 'sfx/stinger/stinger_pizz-tag-ending_01.wav'
g.append(f'{"".join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=6dB,afade=t=out:st={END_F / FPS}:d={DUR - 1 / FPS - END_F / FPS}:curve=hsin,atrim=0:{DUR - 1 / FPS},apad=whole_dur={DUR}[body]')
ti = add(TAG); g.append(f'[{ti}:a]atrim=0:2.2,volume=-9dB,afade=t=out:st=1.7:d=0.5,adelay={int(round(END_F / FPS * 1000))}:all=1,apad=whole_dur={DUR}[tag]')
g.append(f'[body][tag]amix=inputs=2:normalize=0:duration=longest,atrim=0:{DUR - 1 / FPS},apad=whole_dur={DUR}[out]')
cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
for x in ins: cmd += x
os.makedirs('public/audio/edu', exist_ok=True)
subprocess.run(cmd + ['-filter_complex', ';'.join(g), '-map', '[out]', '-ar', '48000', '-ac', '1', '-t', str(DUR), 'public/audio/edu/EDU-EP06-SHORT-review-stem-v2.wav'], check=True)
print('ok')
