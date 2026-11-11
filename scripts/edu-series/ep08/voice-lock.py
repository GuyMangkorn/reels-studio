#!/usr/bin/env python3
"""EDU-EP08-SHORT W4 voice lock (Editor, 2026-11-08). Local only, no API calls.
Input: the approved Kore A full read (store) = script R1.1 NAR lines L01-L13. Voiced runs come from ffmpeg silencedetect (-35 dB / 0.08 s) and every
anchor below is a run onset or a gap edge of that read (Whisper large-v3-turbo word times were used to assign runs to words, +-0.1-0.2 s inside a run).
Does: (1) cuts the 13 line files at mid-gap into out/ep08-voice/lines/, (2) writes measure.json (read-time anchors) and timeline.json (integer 30 fps frames,
re-gapped by the rules below, shot table), (3) prints the shot table.
Rules and frame table: see voice-measure.md W4 section.
Run: python3 -I scripts/edu-series/ep08/voice-lock.py [--tempo 0.95]
--tempo T (Film W5.1 re-time, 2026-11-08; user decision: speech atempo 0.95 per file, gaps between lines NOT stretched, L13 0.9 s qsin fade-out):
every edge is RE-MEASURED with the same silencedetect (-35 dB / 0.08 s) on the read run through atempo=T; each hard-coded edge keeps its offset from the
1.0 detection (divided by T), Whisper anchors scale from their line onset. V01/V02 are re-measured through atempo the same way; the V01 slot keeps the
1.0 safety (silence frame >= voiced end + 25 ms, then 6 f of silence) and the V02 slot keeps 13 f after its voiced end. The re-gap rules (TAIL/LEAD,
silent beats, CLOSE) are unchanged, so line-to-line gaps keep their 1.0 length. Without --tempo the output is byte-identical to the W4 lock."""
import json, os, subprocess, sys, re, math
FPS = 30
READ = os.path.expanduser('~/ReelsStore/projects/edu/EDU/narration/ep08/2026-11-08_ep08-nar-kore-A-fullread.wav')
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = 'out/ep08-voice/lines'
# line -> (voiced start, voiced end) in the read, seconds (energy edges)
L = {'L01': (0.186, 1.675), 'L02': (2.103, 5.989), 'L03': (6.258, 7.866), 'L04': (8.456, 10.626), 'L05': (11.059, 14.936),
     'L06': (15.413, 21.451), 'L07': (22.079, 27.358), 'L08': (28.023, 32.163), 'L09': (32.523, 34.787), 'L10': (34.990, 40.639),
     'L11': (0.050, 1.186), 'L12': (42.367, 43.914), 'L13': (0.2035, 4.929)}
# R1.2 re-lock (user, 2026-11-08): L12 = the cut2 take trimmed before 'แต่ข้อมูล…' (same start, ends 43.914 read s = 1.66 s into the cut2 file; stored ...-L12-kore-A-trim.wav);
# L13 = the new 'comma' take (a separate Gemini file, NOT part of the read): its L entry is in its OWN file time (voiced 0.2035-4.929 s of ...-L13-kore-A-comma.wav, file starts at 0)
# R1.3 (user, 2026-11-08): L11 = new take 'ปล่อยลมหายใจออกมา…' (Gemini A, trimmed 0.222 s so 0.05 s of lead stays, as the cut2 file had; a separate file, NOT part of the read): its L entry is in its OWN file time
# (voiced 0.050-1.186 s of ...-L11-kore-A-r13-trim.wav at 1.0). L11_READ keeps the old read times only for the neighbours' cut windows.
L11_READ = (41.108, 41.800)
# inner anchors (read seconds): id -> (line, time, what). 'gap' = onset after an energy gap; 'whisper' = word time inside a run (+-0.15 s)
A = [('L02.balloon', 'L02', 2.60, 'whisper', 'ไม่ระเบิด (balloon pops)'), ('L02.but', 'L02', 3.801, 'gap', 'แต่อาจมีสติ'),
     ('L02.range', 'L02', 5.00, 'whisper', 'สิบถึงสิบห้า (card text)'),
     ('L03a', 'L03', 6.258, 'gap', 'หมวกจริงล็อกแน่นนะ (latch)'), ('L03b', 'L03', 7.429, 'gap', 'นี่แค่สมมติ'), ('L03.stamp', 'L03', 7.56, 'whisper', 'สมมติ (stamp lands)'),
     ('L04.puff', 'L04', 9.418, 'gap', 'แต่ผิวหนังยังรั้งไว้ได้'),
     ('L05b', 'L05', 12.482, 'gap', 'เหมือนกระติกน้ำร้อน (flask card)'),
     ('L06.boil', 'L06', 16.766, 'gap', 'เริ่มเดือดจริง ๆ นะ'), ('L06b', 'L06', 18.052, 'gap', 'ไม่มีอากาศกด (drop card)'), ('L06.warm', 'L06', 20.456, 'gap', 'แค่ด้วยความอุ่นในตัว'),
     ('L07.year', 'L07', 22.70, 'whisper', 'ปี 1966'), ('L07.tester', 'L07', 24.118, 'gap', 'คนทดสอบชุดของนาซ่า'), ('L07.pop', 'L07', 25.595, 'gap', 'เจอชุดเสียแรงดัน (hose pops)'),
     ('L08.last', 'L08', 28.793, 'gap', 'สิ่งสุดท้ายที่จำได้'), ('L08.foam', 'L08', 30.02, 'whisper', 'น้ำลายบนลิ้นเริ่มเป็นฟอง'), ('L08.out', 'L08', 31.62, 'whisper', 'ก่อนจะหมดสติ'),
     ('L09.air', 'L09', 33.604, 'gap', 'ตอนห้องมีอากาศกลับมา'),
     ('L10b', 'L10', 36.735, 'gap', 'อากาศในปอดจะดันออก (chest card)'), ('L10.outside', 'L10', 38.050, 'gap', 'เพราะข้างนอกไม่มีอากาศดันกลับ'),
     ('L10.hurt', 'L10', 39.675, 'gap', 'ปอดอาจบาดเจ็บได้'), ('L10.amber', 'L10', 40.08, 'whisper', 'บาดเจ็บ (amber glow)'),
     ('L12.maybe', 'L12', 43.392, 'gap', 'ก็อาจรอด'),
     ('L13.but', 'L13', 1.7341, 'gap', 'แต่ในที่ที่ไม่มีอากาศ'), ('L13.help', 'L13', 2.9710, 'gap', 'สิ่งที่ช่วยปอดคุณ'), ('L13.exhale', 'L13', 4.2176, 'gap', 'คือหายใจออก')]
INNER = {'L03': 7.429, 'L05': 12.482, 'L06': 18.052, 'L10': 36.735, 'L13': 2.9710}   # within-line shot cuts: onset after the inner gap (read s)
GAPS = {'L03': 7.218, 'L05': 12.188, 'L06': 17.658, 'L10': 36.374, 'L13': 2.7727}    # start of that inner gap (read s)
# Re-gap rules (integer frames, 30 fps). A cut sits TAIL f after the last word of a shot; the next word starts LEAD f after the cut, so a line-to-line gap is
# TAIL+LEAD = 9 f = 0.30 s (project pause rule: gaps capped at 0.2-0.3 s) even where the read left 0.4-0.7 s. Lines are placed WHOLE (inner pauses stay as read).
# Exceptions: first word on frame 4; L07 lead 8 (flashback in, gap 0.40 s); L13 lead 15 (R1.2: Film wants 15 f of picture-only after the SH03 cut; gap 0.63 s); glitter hold TAIL 12 after L11.
# Silent beats (storyboard): V01 shot 44 f, show beats 30 f before L06 and L10 (the word lands at the end of the silent beat), exhale 24 f before L11, V02 shot 39 f.
TAIL, LEAD, LEAD_L01 = 4, 5, 4
LEAD_OVR = {'L07': 8, 'L13': 15}; TAIL_OVR = {'L11': 12}
V01, SHOW, EXH, V02, CLOSE = 44, 30, 24, 39, 66   # V01 44 f: the picked gasp (aoede-B) is voiced 0.14-1.25 s = frames 4-38 of its file, placed whole from the slot start
f = lambda s: int(round(s * FPS))
SEQ = ['L01', 'V01', 'L02', 'L03', 'L04', 'L05', 'SHOW', 'L06', 'L07', 'L08', 'L09', 'SHOW', 'L10', 'EXH', 'L11', 'V02', 'L12', 'L13']
SILENT = {'V01': V01, 'V02': V02, 'SHOW': SHOW, 'EXH': EXH}
def place():
    pos, silent = {}, []; ep = 0; kind = prev = None
    for k in SEQ:
        if k in SILENT:
            cut = ep + TAIL_OVR.get(prev, TAIL); silent.append((k, cut)); ep = cut + SILENT[k]; kind = k
        else:
            on, off = L[k]
            if k == 'L01': s = LEAD_L01
            elif kind in ('SHOW', 'EXH'): s = ep                      # the word lands at the end of the silent beat
            elif kind in ('V01', 'V02'): s = ep + LEAD
            else: s = ep + TAIL_OVR.get(prev, TAIL) + LEAD_OVR.get(k, LEAD)
            pos[k] = s; ep = s + f(off - on); kind = 'line'; prev = k
    return pos, silent
def vt(pos, line, rs):   # video frame of read time rs inside a line
    return pos[line] + f(rs - L[line][0])
def shots(pos, silent):
    sv = dict((k + str(i), c) for i, (k, c) in enumerate(silent))
    end = lambda k: pos[k] + f(L[k][1] - L[k][0])
    mid = lambda k: (vt(pos, k, GAPS[k]) + vt(pos, k, INNER[k])) // 2
    cut = lambda k: end(k) + TAIL_OVR.get(k, TAIL)
    S = [('S01-B01-SH01', 0, sv['V010'], 'L01'), ('S01-B01-SH02', sv['V010'], sv['V010'] + V01, 'V01 + silence'),
         ('S01-B01-SH03', sv['V010'] + V01, cut('L02'), 'L02'), ('S01-B01-SH04', cut('L02'), mid('L03'), 'L03a'), ('S01-B01-SH05', mid('L03'), cut('L03'), 'L03b'),
         ('S01-B02-SH01', cut('L03'), cut('L04'), 'L04'), ('S01-B02-SH02', cut('L04'), mid('L05'), 'L05a'), ('S01-B02-SH03', mid('L05'), cut('L05'), 'L05b'),
         ('S01-B03-SH01', cut('L05'), mid('L06'), 'show + L06a'), ('S01-B03-SH02', mid('L06'), cut('L06'), 'L06b'),
         ('S01-B03-SH03', cut('L06'), cut('L07'), 'L07'), ('S01-B03-SH04', cut('L07'), cut('L08'), 'L08'), ('S01-B03-SH05', cut('L08'), cut('L09'), 'L09'),
         ('S01-B04-SH01', cut('L09'), mid('L10'), 'show + L10a'), ('S01-B04-SH02', mid('L10'), cut('L10'), 'L10b'),
         ('S01-B04-SH03', cut('L10'), cut('L11'), 'exhale + L11'), ('S01-B05-SH01', cut('L11'), cut('L11') + V02, 'V02'),
         ('S01-B05-SH02', cut('L11') + V02, cut('L12'), 'L12a'), ('S01-B05-SH03', cut('L12'), mid('L13'), 'silent beat + L13a'),
         ('S01-B05-SH04', mid('L13'), cut('L13'), 'L13b')]
    S.append(('S01-B05-SH05', cut('L13'), cut('L13') + CLOSE, 'closing (no line)'))
    return S
def cutfiles(T=1.0, L0=None):
    if T != 1.0:   # files are not re-cut: the mix applies atempo=T to the 1.0 cut2 files (pace-095-preview.py recipe); in-file times scale by 1/T
        keys = list(L0); res = {}
        for i, k in enumerate(keys):
            on, off = L0[k]
            NB = dict(L0); NB['L11'] = L11_READ
            lo = max(on - 0.05, (NB[keys[i - 1]][1] + on) / 2 if i else 0.0); hi = min(off + 0.06, (off + NB[keys[i + 1]][0]) / 2 if i < len(keys) - 1 else 99)
            if k in ('L11', 'L13'):   # new take: own file, starts at 0 (L[k] is already in file time at tempo T)
                res[k] = {'file': os.path.basename(NEW_FILES[k]), 'atempo': T, 'src_start': 0.0, 'src_end': None, 'onset_in_file': round(L[k][0], 3), 'voiced_end_in_file': round(L[k][1], 3)}; continue
            res[k] = {'file': f'2026-11-08_ep08-nar-{k}-kore-A-cut2.wav', 'atempo': T, 'src_start': round(lo, 3), 'src_end': round(hi, 3),
                      'onset_in_file': round((on - lo) / T, 3), 'voiced_end_in_file': round((L[k][1] - L[k][0]) + (on - lo) / T, 3)}
            if k in NEW_FILES: res[k]['file'] = os.path.basename(NEW_FILES[k])   # L12: trimmed cut2 take, same start (src_end is the original cut2 window; the trim is in the stored file)
        return res
    os.makedirs(OUT, exist_ok=True); keys = list(L); res = {}
    for i, k in enumerate(keys):
        on, off = L[k]
        lo = max(on - 0.05, (L[keys[i - 1]][1] + on) / 2 if i else 0.0); hi = min(off + 0.06, (off + L[keys[i + 1]][0]) / 2 if i < len(keys) - 1 else 99)
        name = f'{OUT}/2026-11-08_ep08-nar-{k}-kore-A-cut2.wav'
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{lo:.3f}', '-t', f'{hi - lo:.3f}', '-i', READ, '-af',
                        f'afade=t=in:d=0.008,afade=t=out:st={hi - lo - 0.012:.3f}:d=0.012', '-ar', '48000', '-ac', '1', name], check=True)
        res[k] = {'file': os.path.basename(name), 'src_start': round(lo, 3), 'src_end': round(hi, 3), 'onset_in_file': round(on - lo, 3), 'voiced_end_in_file': round(off - lo, 3)}
    return res
def silences(path, af='', d=0.08, join=None):
    r = subprocess.run(['ffmpeg', '-v', 'info', '-nostats', '-i', path, '-af', (af + ',' if af else '') + f'silencedetect=n=-35dB:d={d}', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.e-]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.e-]+)', r)]
    if join is not None:   # the L13 comma take has 4 ms / 20 us click blips (-45 dB) inside its pauses: silences separated by < join s are one silence
        S, E = [st[0]], []
        for i in range(len(en) - 1):
            if st[i + 1] - en[i] >= join: E.append(en[i]); S.append(st[i + 1])
        E.append(en[-1]); st, en = S, E
    return st, en
V01_FILE = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/EDU-EP08-SHORT/vocal-samples/2026-11-08_ep08-V01-aoede-B.wav')
V02_FILE = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/EDU-EP08-SHORT/vocal-samples/2026-11-08_ep08-V02-algenib-A.wav')
LD = os.path.expanduser('~/ReelsStore/projects/edu/EDU/narration/ep08/lines')
NEW_FILES = {'L11': f'{LD}/2026-11-08_ep08-nar-L11-kore-A-r13-trim.wav', 'L12': f'{LD}/2026-11-08_ep08-nar-L12-kore-A-trim.wav', 'L13': f'{LD}/2026-11-08_ep08-nar-L13-kore-A-comma.wav'}
L13_FILE = NEW_FILES['L13']
V01_MARGIN, V01_SIL, V02_TAIL = 0.025, 6, 13   # 1.0 values: V01 voiced end 1.2415 s, silence frame L38 (G91 = end + 25 ms), 6 f silence; V02 L26 + 13 = 39
def retime(T):
    """Re-measure every edge at atempo=T; returns (L, A, INNER, GAPS, V01, V02, vocal voiced frames, report)."""
    s1, e1 = silences(READ); s2, e2 = silences(READ, f'atempo={T}')
    assert len(s1) == len(s2) and len(e1) == len(e2), ('silence count differs at tempo', len(s1), len(s2), len(e1), len(e2))
    def mp(v, ref, new):   # nearest 1.0 edge -> its re-measured edge at tempo T
        i = min(range(len(ref)), key=lambda j: abs(ref[j] - v)); assert abs(ref[i] - v) < 0.03, (v, ref[i])
        return round(new[i] + (v - ref[i]) / T, 3)
    on = lambda v: mp(v, e1, e2); off = lambda v: mp(v, s1, s2)
    # L13 (new take): same detection on its own file, own time base
    OWN = {}   # own-file lines (L11 R1.3, L13 R1.2): re-measured edges at tempo on the line's own file
    for ok in ('L11', 'L13'):
        o_s, o_e = silences(NEW_FILES[ok], f'atempo={T}', d=0.04, join=0.01); OWN[ok] = (o_s, o_e)
    # (short sub-0.07 s dips inside words differ in count at tempo; the match asserts every mapped edge is within 40 ms)
    def mp13(v, new):   # counts differ (sub-word dips), so match by time: the re-measured edge nearest v / T
        w = min(new, key=lambda x: abs(x - v / T)); assert abs(w - v / T) < 0.04, (v, w); return round(w, 3)
    ona = lambda ln, v: mp13(v, OWN[ln][1]) if ln in OWN else on(v); offa = lambda ln, v: mp13(v, OWN[ln][0]) if ln in OWN else off(v)
    Lt = {k: (ona(k, a), offa(k, b)) for k, (a, b) in L.items()}
    At = [(i, ln, ona(ln, t) if kd == 'gap' else round(Lt[ln][0] + (t - L[ln][0]) / T, 3), kd, tx) for i, ln, t, kd, tx in A]
    It = {k: ona(k, v) for k, v in INNER.items()}; Gt = {k: offa(k, v) for k, v in GAPS.items()}
    a1s, a1e = silences(V01_FILE, f'atempo={T}'); a2s, a2e = silences(V02_FILE, f'atempo={T}')
    v1on, v1off = a1e[0], a1s[-1]; v2on, v2off = a2e[0], a2s[-1]
    sil = math.ceil((v1off + V01_MARGIN) * FPS); v01 = sil + V01_SIL; v02 = f(v2off) + V02_TAIL
    d13 = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', L13_FILE], capture_output=True, text=True).stdout)
    fs, fe = silences(L13_FILE, f'atempo={T},afade=t=out:st={d13 / T - 0.9:.3f}:d=0.9:curve=qsin')
    rep = {'V01': {'voiced_s': [round(v1on, 3), round(v1off, 3)], 'voiced_frames_in_file': [f(v1on), f(v1off)], 'silence_frame_in_slot': sil, 'slot': v01},
           'V02': {'voiced_s': [round(v2on, 3), round(v2off, 3)], 'voiced_frames_in_file': [f(v2on), f(v2off)], 'slot': v02},
           'L13_fade': {'file_dur_s': round(d13 / T, 3), 'fade_start_in_file': round(d13 / T - 0.9, 3), 'fade_s': 0.9, 'curve': 'qsin',
                        'voiced_end_in_file_faded': round(fs[-1], 3) if fs else None}}
    return Lt, At, It, Gt, v01, v02, rep
if __name__ == '__main__':
    T = float(sys.argv[sys.argv.index('--tempo') + 1]) if '--tempo' in sys.argv else 1.0
    L0 = dict(L); rep = None
    if T != 1.0:
        L, A, INNER, GAPS, V01, V02, rep = retime(T); SILENT.update({'V01': V01, 'V02': V02})
    pos, silent = place(); S = shots(pos, silent); files = cutfiles(T, L0)
    anchors = {a[0]: {'line': a[1], 'read_s': a[2], 'kind': a[3], 'text': a[4], 'video_frame': vt(pos, a[1], a[2])} for a in A}
    if T != 1.0:
        anchors = {a[0]: {'line': a[1], 'tempo_s': a[2], 'kind': a[3], 'text': a[4], 'video_frame': vt(pos, a[1], a[2])} for a in A}
    lines = {k: {('tempo_start' if T != 1.0 else 'read_start'): L[k][0], ('tempo_end' if T != 1.0 else 'read_end'): L[k][1], 'dur': round(L[k][1] - L[k][0], 3), 'video_onset_frame': pos[k], 'video_end_frame': pos[k] + f(L[k][1] - L[k][0]), **files[k]} for k in L}
    total = S[-1][2]
    v1 = dict(silent)['V01'] if False else [c for k, c in silent if k == 'V01'][0]; v2 = [c for k, c in silent if k == 'V02'][0]
    w1 = rep['V01']['voiced_frames_in_file'] if rep else [4, 38]; w2 = rep['V02']['voiced_frames_in_file'] if rep else [9, 26]
    vocal = {'V01': {'file': 'projects/edu/EDU/audio/EDU-EP08-SHORT/vocal-samples/2026-11-08_ep08-V01-aoede-B.wav', 'slot_start': v1, 'slot_end': v1 + V01, 'file_start_frame': v1,
                     'voiced_frames': [v1 + w1[0], v1 + w1[1]]},
             'V02': {'file': 'projects/edu/EDU/audio/EDU-EP08-SHORT/vocal-samples/2026-11-08_ep08-V02-algenib-A.wav', 'slot_start': v2, 'slot_end': v2 + V02, 'file_start_frame': v2,
                     'voiced_frames': [v2 + w2[0], v2 + w2[1]], 'note': 'radio filter at mix time'}}
    if rep:
        sil = v1 + rep['V01']['silence_frame_in_slot']
        for k in ('V01', 'V02'): vocal[k]['atempo'] = T; vocal[k]['voiced_s_in_file'] = rep[k]['voiced_s']
        vocal['V01']['silence'] = [sil, v1 + V01]; vocal['V01']['note'] = f'zero G{sil}-{v1 + V01 - 1} sample-exact (V01 voiced end + >= 25 ms, 6 f)'
        lines['L13']['fade'] = rep['L13_fade']
    head = {'deliverable': 'EDU-EP08-SHORT', 'script': 'EDU-EP08-SCRIPT-R1.3', 'read': '2026-11-08_ep08-nar-kore-A-fullread.wav', 'fps': FPS}
    head.update({'tempo': T, 'tempo_note': 'speech atempo per file, line gaps kept at the 1.0 length (user, 2026-11-08); times are on the atempo read', 'speech_end_tempo_s': L['L13'][1], 'note_R12': 'L12 = trimmed cut2 take, L13 = new comma take (own file time)'}
                if T != 1.0 else {'speech_end_read_s': L['L13'][1]})
    json.dump({**head, 'lines': lines, 'anchors': anchors, 'vocal': vocal}, open(os.path.join(HERE, 'measure.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump({'fps': FPS, **({'tempo': T} if T != 1.0 else {}), 'total_frames': total, 'total_s': round(total / FPS, 2), 'shots': [{'id': a, 'start': b, 'end': c, 'frames': c - b, 'covers': d} for a, b, c, d in S]},
              open(os.path.join(HERE, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print('| Shot | Start f | End f | Frames | Covers |'); print('| --- | --- | --- | --- | --- |')
    for a, b, c, d in S: print(f'| {a} | {b} | {c} | {c - b} | {d} |')
    print('total', total, round(total / FPS, 2))
    for k, v in lines.items(): print(k, v['video_onset_frame'], v['video_end_frame'], v['onset_in_file'], v['voiced_end_in_file'])
