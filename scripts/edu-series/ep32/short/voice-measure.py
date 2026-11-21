"""EDU-EP32 voice measure: per-line speech on/off (10 ms peak envelope, speech above 1500, 30 fps) and internal pauses >= 0.25 s on the built timeline.
Run: python3 -I scripts/edu-series/ep32/short/voice-measure.py [dir] [out.json]   (dir default out/ep32-voice: preview.wav + timing.json + lines.json)"""
import array, json, sys, wave
from pathlib import Path
D = Path(sys.argv[1] if len(sys.argv) > 1 else 'out/ep32-voice'); OUT = sys.argv[2] if len(sys.argv) > 2 else None
w = wave.open(str(D / 'preview.wav')); sr = w.getframerate(); a = array.array('h', w.readframes(w.getnframes())); blk = sr // 100
e = [max(abs(x) for x in a[i:i + blk]) for i in range(0, len(a), blk)]
T = json.load(open(D / 'timing.json')); L = json.load(open(Path('out/ep32-voice/lines.json')))['lines']
rows = []
for r in T['lines']:
    i0, i1 = int(r['start'] * 100), int(r['end'] * 100) + 1
    on = [j for j in range(i0, min(i1, len(e))) if e[j] > 1500]
    s, f = on[0] / 100, (on[-1] + 1) / 100
    p = [(round((x + 1) / 100, 2), round((y - 1 - x) / 100, 2)) for x, y in zip(on, on[1:]) if y - x - 1 >= 25]
    rows.append({'line': r['line'], 'who': r['who'], 'file_start': r['start'], 'file_end': r['end'], 'speech_on': round(s, 2), 'speech_off': round(f, 2), 'frame_on': round(s * 30), 'frame_off': round(f * 30), 'dur': round(f - s, 2), 'pauses': p, 'text': L[r['line']]['text']})
last = rows[-1]; res = {'tempo': T['tempo'], 'speech_end_s': last['speech_off'], 'speech_end_frame': last['frame_off'], 'total_s': T['total'], 'total_frames': round(T['total'] * 30), 'lines': rows}
if OUT: json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=1)
print('| Line | Who | File s | Speech on-off s | Frames | Dur | Pauses (at s in file? no: timeline s, len) |')
for r in rows: print(f"| {r['line']} | {r['who']} | {r['file_start']:.2f}-{r['file_end']:.2f} | {r['speech_on']:.2f}-{r['speech_off']:.2f} | {r['frame_on']}-{r['frame_off']} | {r['dur']:.2f} | {r['pauses']} |")
print('speech end', res['speech_end_s'], res['speech_end_frame'], 'total', res['total_s'], res['total_frames'])
