#!/usr/bin/env python3
"""EDU-EP17-SHORT voice re-lock (Editor, 2026-11-15): measures the user-picked NAR candidate B (store projects/edu/EDU/audio/2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav,
50.256 s, Kore, atempo 1.05, no pause surgery) and writes scripts/edu-series/ep17/measure-v2.json (schema of measure.json plus anchors, confidence and the placement proposal).
Method: ffmpeg silencedetect -25 dB / 0.10 s, gaps mapped to the 26 script pause slots in script order (11 ellipses + 15 line boundaries); the order and the word-internal gaps were
checked against a syllable count of every phrase and faster-whisper word times (rough, Thai garbles). Placement proposal = the v1 slot gaps (scene-sheets.md placement table) applied to the new
gaps. Run: python3 -I scripts/edu-series/ep17/measure-v2.py"""
import json, os, re, subprocess
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/')
NAR = '2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav'
D = os.path.dirname(os.path.abspath(__file__))
FPS = 30
def gaps(th, d=0.10):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', R + NAR, '-af', 'silencedetect=n=%ddB:d=%s' % (th, d), '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', e)]; du = [float(x) for x in re.findall(r'silence_duration: ([\d.]+)', e)]
    return [(a, a + b) for a, b in zip(s, du)]
G = gaps(-25)
assert len(G) == 35, len(G)          # 0 = lead, 1-33 = pauses/internal gaps, 34 = trailing
# gap index -> label (the L04 ellipsis has no gap; "int" = word-internal or comma-less phrase gap, not a script pause)
LAB = {1: 'L01…', 2: 'L01|L02', 3: 'L02|L03', 4: 'L03|L04', 5: 'L04|L05', 6: 'int', 7: 'L05…', 8: 'L05|L06', 9: 'int', 10: 'L06|L07', 11: 'L07…', 12: 'int', 13: 'L07|L09', 14: 'L09|L10',
       15: 'L10…', 16: 'int', 17: 'L10|L12', 18: 'L12…', 19: 'int', 20: 'L12|L13', 21: 'L13…', 22: 'L13|L14', 23: 'L14…', 24: 'int', 25: 'L14|L15', 26: 'L15…', 27: 'int', 28: 'L15|L17',
       29: 'L17|L18', 30: 'L18…', 31: 'int', 32: 'L18|L19', 33: 'L19…', 34: 'tail'}
LINES = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L09', 'L10', 'L12', 'L13', 'L14', 'L15', 'L17', 'L18', 'L19']
r3 = lambda x: round(x, 3)
pause = {LAB[i]: G[i] for i in LAB if LAB[i] not in ('int', 'tail')}
onset, end = {'L01': G[0][1]}, {'L19': G[34][0]}
for a, b in zip(LINES, LINES[1:]):
    onset[b] = pause['%s|%s' % (a, b)][1]; end[a] = pause['%s|%s' % (a, b)][0]
internal = [(i, r3(G[i][0]), r3(G[i][1])) for i in LAB if LAB[i] == 'int']
# confidence per anchor
conf = {k: 'high' for k in pause}
conf['L01|L02'] = 'medium: gap only 0.125 s at -25 dB (0.114 s at -35 dB); dip real, order and whisper word "มัน" 3.2 s agree'
conf['L01…'] = 'high'; conf['L19…'] = 'high'
V = {'V01': dict(file='2026-11-15_ep17-char-v01-algenib.wav', voiced=(0.152, 1.793), trim=(0.10, 1.85), fin=3, fout=3),
     'V02': dict(file='2026-11-15_ep17-char-v02-algenib.wav', voiced=(0.302, 1.406), trim=(0.25, 1.46), fin=3, fout=3),
     'V03': dict(file='2026-11-15_ep17-char-v03-algenib.wav', voiced=(0.292, 0.880), trim=(0.24, 0.88), fin=1, fout=2)}
LAUGH = dict(file='2026-11-15_ep17-sister-laugh-aoede.wav', voiced=(0.258, 1.867))
# v1 slot gaps in frames (voiced end -> voiced onset), scene-sheets.md "Gaps set by placement"; V voiced lengths as v1 (49.2 / 33.1 / 17.6 f)
VLEN = {'V01': 49.2, 'V02': 33.1, 'V03': 17.6}
SLOTS = [  # cut after line, before-gap (to V), V, after-gap, v1 pause label
    ('L03', 'L04', 'L03|L04', 'V01', 8.6, 7.8), ('L04', 'L05', 'L04|L05', None, 33.8, None), ('L07', 'L09', 'L07|L09', 'V02', 7.3, 7.9),
    ('L10', 'L12', 'L10|L12', 'V03', 10.4, 6.4), ('L15', 'L17', 'L15|L17', None, 31.6, None)]
LEAD_F, HOLD_F, LASER = 12, 60.7, 4   # L01 onset G12, L19 end -> end 60.7 f, laugh voiced onset = L19 onset - 4 f (sheet B06)
# v1 numbers for the delta table
v1 = json.load(open(os.path.join(D, 'measure.json')))
CS = {'A': 5.4, 'B': 59.6, 'C': 81.7, 'D': 118.6, 'E': 141.3, 'F': 161.8}
SEG = {'A': ['L01', 'L02', 'L03'], 'B': ['L04'], 'C': ['L05', 'L06', 'L07'], 'D': ['L09', 'L10'], 'E': ['L12', 'L13', 'L14', 'L15'], 'F': ['L17', 'L18', 'L19']}
segof = {l: s for s, ls in SEG.items() for l in ls}
old_on = {l: 30 * v1['line_onsets_s'][l] + CS[segof[l]] for l in LINES}; old_end = {l: 30 * v1['line_end_s'][l] + CS[segof[l]] for l in LINES}
# new timeline (seconds on the timeline = file time + offset of its segment)
off = {'A': LEAD_F / FPS - onset['L01']}; place = []; cuts = []
tl_on, tl_end = {}, {}; vtl = {}
segs = ['A', 'B', 'C', 'D', 'E', 'F']
for k, (la, lb, lab, v, g1, g2) in enumerate(SLOTS):
    cur = segs[k]; nxt = segs[k + 1]
    endtl = end[la] + off[cur]
    if v:
        von = endtl + g1 / FPS; vend = von + VLEN[v] / FPS; nxt_on = vend + g2 / FPS
        vtl[v] = (von, vend, von - V[v]['voiced'][0])
    else:
        nxt_on = endtl + g1 / FPS
    off[nxt] = nxt_on - onset[lb]
    natural = (G[[i for i in LAB if LAB[i] == lab][0]][1] - G[[i for i in LAB if LAB[i] == lab][0]][0])
    need = (nxt_on - endtl) - natural   # seconds of room tone to insert at the cut
    cuts.append(dict(after=la, before=lb, cut_file_s=r3(sum(pause[lab]) / 2), natural_gap_f=round(natural * FPS, 1), needed_gap_f=round((nxt_on - endtl) * FPS, 1),
                     insert_f=round(need * FPS, 1), v1_inserted_f={'V01': 52, 'L04|L05': 22, 'V02': 36, 'V03': 23, 'L15|L17': 20}[v or lab], take=v))
for l in LINES:
    tl_on[l] = onset[l] + off[segof[l]]; tl_end[l] = end[l] + off[segof[l]]
ONG = {l: round(30 * tl_on[l], 1) for l in LINES}; ENG = {l: round(30 * tl_end[l], 1) for l in LINES}
total = round(30 * tl_end['L19'] + HOLD_F)
laugh_on_tl = tl_on['L19'] - LASER / FPS
laugh = dict(voiced_G=[round(30 * laugh_on_tl, 1), round(30 * (laugh_on_tl + LAUGH['voiced'][1] - LAUGH['voiced'][0]), 1)], file_start_s=r3(laugh_on_tl - LAUGH['voiced'][0]))
segtab = {}
for s, ls in SEG.items():
    segtab[s] = dict(lines=ls, c_s=r3(off[s]), old_first_onset_G=round(old_on[ls[0]], 1), new_first_onset_G=ONG[ls[0]], delta_onset_f=round(ONG[ls[0]] - old_on[ls[0]], 1),
                     old_last_end_G=round(old_end[ls[-1]], 1), new_last_end_G=ENG[ls[-1]], delta_end_f=round(ENG[ls[-1]] - old_end[ls[-1]], 1),
                     old_content_f=round(old_end[ls[-1]] - old_on[ls[0]], 1), new_content_f=round(ENG[ls[-1]] - ONG[ls[0]], 1))
    segtab[s]['delta_content_f'] = round(segtab[s]['new_content_f'] - segtab[s]['old_content_f'], 1)
out = {
 'deliverable': 'EDU-EP17-SHORT', 'step': 'W4 voice re-lock', 'script_revision': 'EDU-EP17-SCRIPT-R1.2.1', 'date': '2026-11-15', 'supersedes': 'measure.json (v1 lock, 53.82 s)',
 'read': {'store': 'projects/edu/EDU/audio/' + NAR, 'raw_take': 'projects/edu/EDU/audio/2026-11-15_ep17-nar-v2-B-fullread-raw.wav (+ .json sidecar)', 'model': 'gemini-3.8-flash-tts', 'voice': 'Kore',
          'style': 'warm, friendly, smiling storyteller, speaking rapidly', 'atempo': 1.05, 'pauses': 'the take as spoken: no pause surgery, no inserted silence',
          'lines': 'L01-L07, L09, L10, L12-L15, L17-L19 (16 NAR rows; L08, L11, L16 retired); ellipsis sent as comma; L14 year spoken as words', 'listened': False,
          'note': 'user picked candidate B on 2026-11-15; NOT LISTENED by the Editor agent'},
 'measured': {'file_s': 50.256, 'speech_start_s': r3(onset['L01']), 'speech_end_s': r3(end['L19']),
              'method': 'ffmpeg silencedetect -25 dB / 0.10 s; line onset = end of the preceding gap, line end = start of the following gap (as v1); 35 gaps mapped to the 26 script pause slots in script order, confirmed by a per-phrase syllable count (cumulative position within +-0.3 s at every gap) and faster-whisper word times (rough); times in the x1.05 file'},
 'line_onsets_s': {l: r3(onset[l]) for l in LINES}, 'line_end_s': {l: r3(end[l]) for l in LINES},
 'ellipsis_pause_s': {k: [r3(v[0]), r3(v[1])] for k, v in pause.items() if k.endswith('…')},
 'line_boundary_pause_s': {k: [r3(v[0]), r3(v[1])] for k, v in pause.items() if '|' in k},
 'ellipsis_without_gap': ['L04…'],
 'word_internal_gaps_s': [dict(gap=i, start=a, end=b) for i, a, b in internal],
 'confidence': conf,
 'min_gap_before_line_start_s': r3(min(v[1] - v[0] for k, v in pause.items() if '|' in k)),
 'character_takes': {k: dict(store='projects/edu/EDU/audio/' + v['file'], voiced_span_s=list(v['voiced'])) for k, v in V.items()},
 'sister_laugh': dict(store='projects/edu/EDU/audio/' + LAUGH['file'], voiced_span_s=list(LAUGH['voiced'])),
 'placement_proposal': {
   'rule': 'v1 slot gaps kept (voiced end -> voiced onset, frames): L03->V01 8.6, V01->L04 7.8, L04->L05 33.8, L07->V02 7.3, V02->L09 7.9, L10->V03 10.4, V03->L12 6.4, L15->L17 31.6; lead L01 onset G12; W-HOLD 60.7 f after L19; laugh voiced onset = L19 onset - 4 f. Each gap extension is crossfaded room tone (quietest 0.16 s of the cut gap, tiled with 40 ms crossfades), never digital silence. A proposal for Film to retime against, not a decision.',
   'cuts': cuts,
   'V_voiced_G': {k: [round(30 * v[0], 1), round(30 * v[1], 1)] for k, v in vtl.items()}, 'V_file_start_s': {k: r3(v[2]) for k, v in vtl.items()},
   'sister_laugh': laugh, 'segment_offset_s': {s: r3(off[s]) for s in segs},
   'line_onset_G': ONG, 'line_end_G': ENG, 'old_line_onset_G': {l: round(old_on[l], 1) for l in LINES}, 'old_line_end_G': {l: round(old_end[l], 1) for l in LINES},
   'segments': segtab, 'total_f': total, 'total_s': r3(total / FPS), 'old_total_f': 1829, 'delta_total_f': total - 1829}}
json.dump(out, open(os.path.join(D, 'measure-v2.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps({'cuts': cuts, 'segments': segtab, 'total_f': total, 'laugh': laugh, 'V': out['placement_proposal']['V_voiced_G']}, indent=1, ensure_ascii=False))
