"""EDU-EP14-SHORT W4 voice lock: turn the measured R4 read into the timed shot table and extend measure.json (stdlib only).
Usage: python3 -I scripts/edu-series/ep14/measure-lock.py [--write]
W5.1 (Film, EDU-EP14-ROWS-R3.0): beat gaps 0 (the natural 0.79-0.85 s pauses carry the beat changes), V02 shot = L15 end + 4 f,
more word anchors from the same Whisper pass, and the picked girl takes measured (GIRL_TAKES).
Inputs are the numbers below, taken from the locked read (store `projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-fullread.wav`):
  LINES  speech run edges (ffmpeg silencedetect -35 dB / 0.06 s, plus a 5 ms RMS envelope: onset = first level above -30 dB held 50 ms; breaths at -37..-41 dB skipped)
  WORDS  word onsets from faster-whisper large-v3-turbo (word_timestamps, array input), +-0.1 s; Whisper mis-spells some words, so only times are used
Mapping raw read second t -> global timeline second g(t) = t + offset of the segment that holds t; picture beats Film planned
(lead-in 0.35 s, W700, V01 slot, three 0.30 s beat gaps) are inserted at the real energy gaps (CUTS). Shot start = round(g(anchor) * 30) - lead
(lead = Film's shot-local line onset in ROWS-R1.0), except within-line splits, which cut at the mid-point of the real gap.
With --write the result is merged into measure.json under "lock" and the old numbers kept under "previous".
W4 re-lock (Editor, EDU-EP14-ROWS-R4.0, user pick 2026-11-09): the narration is the same locked read slowed (speech atempo 0.90, gaps 0.95; scripts/edu-series/ep14/narration-slow.py,
store `projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav`, 56.15 s). `--read slow` (default) uses the SLOW tables, `--read r4` reproduces the R3.0/R3.1 numbers on the unslowed read.
SLOW tables: line edges re-measured on the slowed file (5 ms RMS envelope, -35 dB, runs of the 17 lines picked in order by expected duration; L01 onset = silencedetect end 0.152, L13/L15 onsets = Whisper word start as before);
word anchors = the R3.1 Whisper anchors mapped linearly between the old and new edges of their line (the speech is uniformly stretched), checked against faster-whisper large-v3-turbo on the slowed file (nearest token within 0.02 s for 29 of 38 and 0.07 s for 36, 0.17 and 0.19 s on the 2 anchors whose word starts mid-token).
The picture structure is kept: the W700 slot (30 f from the L02c end) then L03 onset +4 f, V01 shot = L03 end +13 f (42 f slot, V01 file start +3, voice +9), L04 onset = V01 shot +46 f, beat gaps 0, V02 shot = L15 end +4 f (73 f)."""
import json, sys
from pathlib import Path

FPS = 30
HERE = Path(__file__).resolve().parent

# line: (onset, end) in read seconds
LINES_R4 = {
    'L01': (0.152, 5.250), 'L02a': (5.815, 7.885), 'L02': (8.555, 11.335), 'L02b': (11.760, 13.235), 'L02c': (13.995, 15.950),
    'L03': (16.570, 18.405), 'L04': (19.090, 20.585), 'L05': (21.110, 22.960), 'L06': (23.570, 25.910), 'L07': (26.570, 29.360),
    'L10': (30.200, 31.650), 'L11': (32.175, 34.965), 'L08': (35.755, 38.235), 'L12': (38.960, 41.455), 'L13': (41.920, 44.010),
    'L14': (44.860, 46.825), 'L15': (47.300, 51.105)}
# word anchors (read seconds)
WORDS_R4 = {
    'L01.akat': 1.36, 'L01b.med': 1.847, 'L01b.jetroi': 4.02, 'L02.lud': 8.86, 'L02.songkilo': 10.72, 'L02c.kilodiao': 14.42,
    'L02c.harroi': 14.94, 'L03.saep': 17.18, 'L03.ying': 18.12, 'L06.phodi': 24.60, 'L10.maidai': 30.58, 'L10.yot': 30.90,
    'L11.konbaen': 33.28, 'L11.burger': 34.44, 'L08.yai-tha-luk': 37.48, 'L12.bum': 40.36, 'L12.thungkwam': 40.92,
    'L13.kreungsen': 42.52, 'L13.taek': 43.32, 'L15.paikwanee': 50.64,
    # added at W5.1 (Film; same faster-whisper pass, re-run on the same WAV, +-0.1 s; Whisper spells some words wrong, times only)
    'L01b.reo': 3.26, 'L02.loisung': 10.14, 'L04.lokjing': 19.68, 'L05.akat': 21.88, 'L05.danklab': 22.32, 'L06.namnak': 24.04, 'L06.loekreng': 25.46,
    'L07.samsip': 28.02, 'L10.yot2': 30.90, 'L11.baen': 33.46, 'L08.lukbon': 37.80, 'L12.yingyai': 38.86, 'L13.ko': 42.98,
    'L14.akat': 45.68, 'L14.danklab': 46.18, 'L15.muekhun': 48.22, 'L15.thuk': 49.02, 'L15.brake': 49.58}
# SLOW read (user pick 2026-11-09): same lines/words on the slowed file (see docstring); read seconds of out/ep14-slow/nar-kore-x0.90speech-x0.95gaps-full.wav
LINES_SLOW = {"L01": (0.152, 5.815), "L02a": (6.395, 8.69), "L02": (9.38, 12.47), "L02b": (12.895, 14.525), "L02c": (15.31, 17.475), "L03": (18.11, 20.165), "L04": (20.86, 22.505),
    "L05": (23.05, 25.11), "L06": (25.725, 28.315), "L07": (29.0, 32.115), "L10": (32.965, 34.575), "L11": (35.115, 38.205), "L08": (39.01, 41.765), "L12": (42.495, 45.255),
    "L13": (45.74, 48.105), "L14": (48.925, 51.105), "L15": (51.54, 55.81)}
WORDS_SLOW = {"L01.akat": 1.49, "L01b.med": 2.03, "L01b.jetroi": 4.45, "L02.lud": 9.72, "L02.songkilo": 11.79, "L02c.kilodiao": 15.78, "L02c.harroi": 16.36, "L03.saep": 18.79, "L03.ying": 19.85,
    "L06.phodi": 26.87, "L10.maidai": 33.39, "L10.yot": 33.74, "L11.konbaen": 36.34, "L11.burger": 37.62, "L08.yai-tha-luk": 40.93, "L12.bum": 44.04, "L12.thungkwam": 44.66, "L13.kreungsen": 46.42,
    "L13.taek": 47.32, "L15.paikwanee": 55.29, "L01b.reo": 3.6, "L02.loisung": 11.14, "L04.lokjing": 21.51, "L05.akat": 23.91, "L05.danklab": 24.4, "L06.namnak": 26.25, "L06.loekreng": 27.82,
    "L07.samsip": 30.62, "L10.yot2": 33.74, "L11.baen": 36.54, "L08.lukbon": 41.28, "L12.yingyai": 42.38, "L13.ko": 46.94, "L14.akat": 49.83, "L14.danklab": 50.39, "L15.muekhun": 52.57,
    "L15.thuk": 53.47, "L15.brake": 54.1}
# picked girl takes (user, 2026-11-09), measured with ffmpeg silencedetect -35 dB / 0.06 s: (file length, voice onset, voice end) in file seconds
GIRL_TAKES = {
    'V01': ('projects/EDU/audio/2026-11-09_ep14-girl-v01-a-leda.wav', 0.880, 0.204, 0.625),  # 0.000-0.054 s click/blip before the voice: trim
    'V02': ('projects/EDU/audio/2026-11-09_ep14-girl-v02-a-leda.wav', 2.120, 0.190, 0.678)}  # 1.239-1.273 s short blip after: Editor listens, trims if a click
LEAD_IN = 0.35
READ = sys.argv[sys.argv.index('--read') + 1] if '--read' in sys.argv else 'slow'
LINES, WORDS = (LINES_R4, WORDS_R4) if READ == 'r4' else (LINES_SLOW, WORDS_SLOW)
BEAT_GAP = 0.0  # R2.0 had 0.30 s; Film W5.1 (R3.0) removed them: -27 f
# cuts in the read (mid-points of the real energy gaps) where inserted time starts a new offset segment
if READ == 'r4':
    CUTS = [('W700', 16.26), ('V01', 18.75), ('B03', 29.78), ('B04', 35.36), ('B05', 44.435)]
    WITHIN = {'SH02': (1.660, 1.847), 'SH05': (9.504, 9.991)}  # within-line splits: real gap (read s)
else:
    CUTS = [('W700', 17.7925), ('V01', 20.5125), ('B03', 32.54), ('B04', 38.6075), ('B05', 48.515)]
    WITHIN = {'SH02': (1.815, 2.020), 'SH05': (10.415, 10.960)}  # silencedetect -35 dB / 0.06 s on the slowed file
# picture pins Film fixed in R3.0, kept as frame offsets (they reproduce 489 / 523 / 591 / 637 on the unslowed read):
W700_LEN, L03_AFTER_W700, V01_AFTER_L03_END, V01_TO_L04 = 30, 4, 13, 46
W700_START = int(round((LINES['L02c'][1] + LEAD_IN) * FPS))                      # the W700 slot starts when L02c ends
PIN = {'L03': W700_START + W700_LEN + L03_AFTER_W700}                              # L03 onset: W700 slot end + 4 f
off = [LEAD_IN, PIN['L03'] / FPS - LINES['L03'][0]]
V01_START = int(round((LINES['L03'][1] + off[1]) * FPS)) + V01_AFTER_L03_END       # V01 shot: L03 end + 13 f (42 f slot)
PIN['L04'] = V01_START + V01_TO_L04
off.append(PIN['L04'] / FPS - LINES['L04'][0])
off += [off[2] + BEAT_GAP, off[2] + 2 * BEAT_GAP, off[2] + 3 * BEAT_GAP]
bounds = [c[1] for c in CUTS]


def g(t):
    i = sum(1 for b in bounds if t >= b)
    return t + off[i]


def gf(t):
    return int(round(g(t) * FPS))


# (shot, lines, anchor (read s) or None, lead frames or None, fixed start or None)
SHOTS = [
    ('S01-B01-SH01', 'L01 a', None, None, 0),
    ('S01-B01-SH02', 'L01 b', None, None, ('gap', 'SH02')),
    ('S01-B01-SH03', 'L02a', LINES['L02a'][0], 5, None),
    ('S01-B01-SH04', 'L02 a', LINES['L02'][0], 7, None),
    ('S01-B01-SH05', 'L02 b', None, None, ('gap', 'SH05')),
    ('S01-B01-SH06', 'L02b', LINES['L02b'][0], 5, None),
    ('S01-B01-SH07', 'L02c, W700', LINES['L02c'][0], 12, None),
    ('S01-B01-SH08', 'L03', LINES['L03'][0], 4, None),
    ('S01-B01-SH09', 'V01', None, None, V01_START),
    ('S01-B02-SH01', 'L04', LINES['L04'][0], 4, None),
    ('S01-B02-SH02', 'L05, L06', LINES['L05'][0], 5, None),
    ('S01-B02-SH03', 'L07', LINES['L07'][0], 5, None),
    ('S01-B03-SH01', 'L10 a', LINES['L10'][0], 14, None),
    ('S01-B03-SH02', 'L10 b', WORDS['L10.yot'], 0, None),
    ('S01-B03-SH03', 'L11', LINES['L11'][0], 5, None),
    ('S01-B04-SH01', 'L08', LINES['L08'][0], 13, None),
    ('S01-B04-SH02', 'L12', LINES['L12'][0], 7, None),
    ('S01-B04-SH03', 'L13', LINES['L13'][0], 4, None),
    ('S01-B05-SH01', 'L14', LINES['L14'][0], 12, None),
    ('S01-B05-SH02', 'L15', LINES['L15'][0], 5, None),
    ('S01-B05-SH03', 'V02, hold', None, None, 'after_L15'),
]
V02_SHOT_LEN = 73  # Film's plan: L15 end + 4 f to the V02 shot, V02 voice at +3, hold to the shot's end
V02_AT = 3


def starts():
    out = []
    for name, lines, anchor, lead, fixed in SHOTS:
        if isinstance(fixed, tuple):
            a, b = WITHIN[fixed[1]]
            s = gf((a + b) / 2)
        elif fixed == 'after_L15':
            s = gf(LINES['L15'][1]) + 4
        elif fixed is not None:
            s = fixed
        else:
            s = gf(anchor) - lead
        out.append(s)
    return out


def build():
    st = starts()
    END = st[-1] + V02_SHOT_LEN
    v02len = round((GIRL_TAKES['V02'][3] - GIRL_TAKES['V02'][2]) * FPS)
    shots = []
    for i, (name, lines, anchor, lead, fixed) in enumerate(SHOTS):
        end = st[i + 1] if i + 1 < len(st) else END
        shots.append({'shot': name, 'lines': lines, 'start_frame': st[i], 'end_frame': end, 'len_frames': end - st[i],
                      'start_s': round(st[i] / FPS, 2), 'len_s': round((end - st[i]) / FPS, 2)})
        assert end > st[i], name
    lines = {k: {'read_onset_s': v[0], 'read_end_s': v[1], 'global_onset_frame': gf(v[0]), 'global_end_frame': gf(v[1])} for k, v in LINES.items()}
    words = {k: {'read_s': v, 'global_frame': gf(v)} for k, v in WORDS.items()}
    return {
        'status': 'audio-measured', 'script': 'EDU-EP14-SCRIPT-R4', 'storyboard': 'EDU-EP14-ROWS-R3.0' if READ == 'r4' else 'EDU-EP14-ROWS-R4.0',
        'narration': {'file': 'projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-fullread.wav' if READ == 'r4' else 'projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav', 'length_s': 51.44 if READ == 'r4' else 56.147,
                      'recipe': 'locked R4 Kore read, no atempo' if READ == 'r4' else 'locked R4 Kore read; speech atempo 0.90, gaps and lead-in 0.95, tail unchanged (scripts/edu-series/ep14/narration-slow.py); 0 new Gemini requests'},
        'read_reused_from_w1_4': True, 'gemini_requests_in_w4_for_narration': 0,
        'method': 'Line edges: ffmpeg silencedetect -35 dB / 0.06 s plus a 5 ms RMS envelope (onset = first level above -30 dB held 50 ms; breaths at -37..-41 dB before L07, L10, L15 skipped; L13 and L15 onsets set to the Whisper word start, the plosive attack is quiet). Word anchors: faster-whisper large-v3-turbo word_timestamps on the same WAV (venv of the main checkout; scripts/transcribe.py fails on the installed av, so the WAV was passed as an array), +-0.1 s. Not listened.' + ('' if READ == 'r4' else ' R4.0 re-lock on the slowed file: line edges re-measured by the same energy method (L01 0.152 = silencedetect end; L13 and L15 onsets = Whisper word start); word anchors = the R3.x anchors mapped linearly between the old and new line edges and checked against faster-whisper on the slowed file (29 of 38 within 0.02 s, 36 within 0.07 s, +0.17 and +0.19 s at L03.saep and L04.lokjing where the token starts mid-word). Picture pins kept as offsets: W700 slot 30 f from the L02c end, L03 onset +4 f, V01 shot = L03 end +13 f, L04 onset = V01 shot +46 f.'),
        'offsets_s': {'lead_in_A': off[0], 'after_W700_B': round(off[1], 4), 'after_V01_C': round(off[2], 4), 'B03_D': round(off[3], 4), 'B04_E': round(off[4], 4), 'B05_F': round(off[5], 4)},
        'cuts_read_s': {k: v for k, v in CUTS},
        'timeline': {'fps': FPS, 'total_frames': END, 'total_s': round(END / FPS, 2), 'speech_end_global_frame': gf(LINES['L15'][1]), 'limit_s': 63, 'target_s': '40-60'},
        'picture_beats_global_frames': {'W700': [W700_START, W700_START + W700_LEN], 'V01_sound': V01_START + 9, 'V02_sound': st[-1] + V02_AT, 'end_hold': [st[-1] + V02_AT + v02len, END]},
        'girl_takes': {k: {'store': v[0], 'file_s': v[1], 'voice_s': [v[2], v[3]], 'voice_frames': round((v[3] - v[2]) * FPS),
                           'voice_onset_global_frame': V01_START + 9 if k == 'V01' else st[-1] + V02_AT} for k, v in GIRL_TAKES.items()},
        'lines': lines, 'words': words, 'shots': shots}


if __name__ == '__main__':
    lock = build()
    print(json.dumps({'total': lock['timeline'], 'shots': [(s['shot'][4:], s['start_frame'], s['len_frames']) for s in lock['shots']]}))
    if '--write' in sys.argv:
        p = HERE / 'measure.json'
        d = json.loads(p.read_text())
        if 'lock' not in d:
            old = {k: d.pop(k) for k in list(d) if k not in ('deliverable', 'previous')}
            d['previous'] = {'w1_4_r4_length_check': old, 'w1_3_r3_read': d['previous']}
        elif d['lock'].get('storyboard') != lock['storyboard']:
            d['previous']['lock_' + d['lock']['storyboard'].split('-')[-1]] = d['lock']  # e.g. lock_R2.0
        d['lock'] = lock
        d['timing_status'] = 'audio-measured'
        p.write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
