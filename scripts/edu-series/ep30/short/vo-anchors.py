"""EDU-EP30 voice-lock anchors: speech onset/offset, internal pauses and syllable onsets per line, in timeline seconds and 30 fps frames.
Reads out/ep30-voice/timing.json and lines/Lnn.wav (store projects/edu/EDU/narration/ep30-voice-r1/). Envelope: 10 ms peak blocks;
speech > 1500, pause = >= 60 ms below 1000, syllable onset = rise above 15000 after a dip below 6000. Run from the checkout root:
python3 -I scripts/edu-series/ep30/short/vo-anchors.py"""
import array, json, subprocess
D = 'out/ep30-voice'
fr = lambda t: int(t * 30 + 0.5)
for l in json.load(open(f'{D}/timing.json'))['lines']:
    k, s = l['line'], l['start']
    pcm = array.array('h', subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{D}/lines/{k}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-']))
    e = [max(abs(x) for x in pcm[i:i + 160]) for i in range(0, len(pcm), 160)]
    on = next(i for i in range(len(e)) if all(v > 1500 for v in e[i:i + 4]))
    off = max(i for i in range(len(e)) if e[i] > 1500) + 1
    gaps, i = [], on
    while i < off:
        if e[i] < 1000:
            j = i
            while j < off and e[j] < 1000: j += 1
            if j - i >= 6: gaps.append(f'{s + i / 100:.2f}-{s + j / 100:.2f} (f{fr(s + i / 100)}-{fr(s + j / 100)})')
            i = j
        else: i += 1
    syl, low = [], True
    for i, v in enumerate(e):
        if low and v > 15000: syl.append(f'{s + i / 100:.2f}'); low = False
        elif v < 6000: low = True
    print(f"{k} file {s:.2f} speech {s + on / 100:.2f}-{s + off / 100:.2f} (f{fr(s + on / 100)}-{fr(s + off / 100)}) pauses {gaps} syllables {' '.join(syl)}")
