"""Measure the speech span of single-line TTS clips for the WDG-EP01-SHORT voice lock (not for NARR; see narration/align-full.py).

Same rule as scripts/narration/align-full.py and cut-gaps.py: 10 ms blocks, peak >= 300 of 32767 counts as speech.
Prints JSON: per clip the file duration, the first and last speech time and frames at 30 fps (round(s * 30)).

Run (repo root): python3 -I scripts/wendigo/short/voice-lock/measure-clips.py clip1.wav clip2.wav ... > measure-clips.json
"""
import array, json, subprocess, sys
from pathlib import Path

RATE, THRESHOLD, BLOCK, FPS = 48000, 300, 480, 30


def decode(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    s = array.array('h')
    s.frombytes(out)
    return s


def speech_span(samples):
    blocks = [i for i in range(0, len(samples), BLOCK) if max(abs(v) for v in samples[i:i + BLOCK]) >= THRESHOLD]
    if not blocks:
        return None, None
    return blocks[0] / RATE, (blocks[-1] + BLOCK) / RATE


def main(paths):
    rows = []
    for p in paths:
        s = decode(p)
        on, end = speech_span(s)
        dur = len(s) / RATE
        rows.append({'clip': Path(p).name, 'durationSec': round(dur, 3),
                     'speechOnSec': None if on is None else round(on, 3),
                     'speechEndSec': None if end is None else round(end, 3),
                     'speechOnFrame': None if on is None else round(on * FPS),
                     'speechEndFrame': None if end is None else round(end * FPS),
                     'speechDurSec': None if on is None else round(end - on, 3)})
    json.dump(rows, sys.stdout, ensure_ascii=False, indent=1)
    print()


if __name__ == '__main__':
    main(sys.argv[1:])
