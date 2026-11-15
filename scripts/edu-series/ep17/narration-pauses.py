#!/usr/bin/env python3
"""EDU-EP17-SHORT W4 voice lock: build the NAR read from the one raw Kore take (store projects/edu/EDU/audio/2026-11-15_ep17-nar-kore-fullread-raw.wav).
Every script '…' and every line boundary (26 pauses, positions found with ffmpeg silencedetect -25 dB / 0.08 s and checked against Whisper word times) is
set to 0.40 s of raw silence: a shorter gap gets silence added at its middle, a longer one has its middle removed (0.20 s kept on each side), 8 ms fades at each splice.
The L04 '…' (10.28 s) has no real gap in the take: silence is inserted inside the shallow dip. Output is raw-time map + measure data; atempo 1.05 is applied by ffmpeg afterwards.
Run: python3 -I scripts/edu-series/ep17/narration-pauses.py RAW.wav OUT_PAUSED_RAW.wav OUT_MAP.json"""
import array, json, sys, wave
SR, TARGET, FADE = 48000, 0.40, 0.008
# (id, gap_start, gap_end) in raw seconds; id 'Lxx|Lyy' = boundary, 'Lxx…' = ellipsis
P = [('L01…',1.725708,1.938438),('L01|L02',3.526021,3.762437),('L02|L03',5.693271,6.069208),('L03|L04',8.440396,8.844625),('L04…',10.28,10.28),
('L04|L05',11.120188,11.656854),('L05…',12.583083,12.737396),('L05|L06',14.034208,14.466792),('L06|L07',17.279333,17.754542),('L07…',18.686354,18.985688),
('L07|L09',22.016542,22.405229),('L09|L10',23.468271,24.054312),('L10…',24.678771,24.824042),('L10|L12',27.612646,28.037396),('L12…',29.035083,29.399354),
('L12|L13',32.035937,32.526958),('L13…',33.599583,33.971896),('L13|L14',34.745583,35.334063),('L14…',37.153896,37.470292),('L14|L15',40.382167,40.820083),
('L15…',41.736438,42.309417),('L15|L17',45.888021,46.22025),('L17|L18',49.679583,50.03625),('L18…',50.685104,50.793437),('L18|L19',52.406062,52.767021),('L19…',53.865292,54.071896)]
w = wave.open(sys.argv[1]); assert w.getframerate() == SR and w.getnchannels() == 1
a = array.array('h'); a.frombytes(w.readframes(w.getnframes()))
def seg(t0, t1, fin, fout):
    s = [float(x) for x in a[round(t0 * SR):round(t1 * SR)]]; n = round(FADE * SR)
    for i in range(min(n, len(s))):
        if fin: s[i] *= i / n
        if fout: s[-1 - i] *= i / n
    return s
out = []; pos = 0.0; mp = []; cur = 0.0   # cur = raw time already consumed
for k, (pid, gs, ge) in enumerate(P):
    d = ge - gs
    if d <= 0: a0, b0 = gs, gs                       # no real gap: split at gs
    elif d < TARGET: a0, b0 = (gs + ge) / 2, (gs + ge) / 2
    else: a0, b0 = gs + TARGET / 2, ge - TARGET / 2  # keep 0.2 s of gap each side
    out += seg(cur, a0, k > 0, True)
    sil = TARGET - max(d, 0) if d < TARGET else 0.0
    t_a0 = len(out) / SR                             # new time of the splice point
    ps = t_a0 - (min(d, TARGET) / 2 if d > 0 else 0)  # pause start = end of the previous speech
    out += [0.0] * round(sil * SR)
    mp.append({'new_pause_start': round(ps, 3), 'new_pause_end': round(ps + TARGET, 3), 'id': pid, 'raw_gap': [round(gs, 3), round(ge, 3)], 'raw_gap_s': round(max(d, 0), 3), 'added_s': round(sil, 3), 'trimmed_s': round(max(d - TARGET, 0), 3)})
    cur = b0
out += seg(cur, len(a) / SR, True, False)
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(array.array('h', [max(-32768, min(32767, round(x))) for x in out]).tobytes()); w.close()
json.dump({'total_raw_s': round(len(out) / SR, 3), 'pauses': mp}, open(sys.argv[3], 'w'), indent=1)
print('paused raw', round(len(out) / SR, 3), 's')
