"""BLOOP-EP01-SHORT: measure generated/library sounds for label windows and candidate picks (Editor, sound QA).

Prints, per WAV: duration, peak dBFS, and the audible window measured on a 10 ms RMS envelope: first and last time
the envelope is within `--db` dB of its peak (default -30 dB, i.e. the sound is clearly above room tone). Also the
time of the envelope peak and the mean level of the last 0.5 s. Decodes with the system ffmpeg to mono 16-bit 48 kHz PCM, so it reads 24-bit 44.1 kHz candidates too.
Run: python3 -I scripts/the-bloop/short/measure-audio.py [--db -30] FILE.wav ...
"""
import argparse, array, math, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
import os, shutil
# System ffmpeg first: the Remotion bundle cannot read every candidate WAV (audio-studio needs the system build too).
FFMPEG = shutil.which('ffmpeg') or 'ffmpeg'
ENV = dict(os.environ)
RATE, BLOCK = 48000, 480  # 10 ms


def decode(path):
    out = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-c:a', 'pcm_s16le', '-f', 's16le', '-'],
                         capture_output=True, env=ENV, check=True).stdout
    samples = array.array('h')
    samples.frombytes(out)
    return samples


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', type=float, default=-30.0)
    parser.add_argument('files', nargs='+')
    args = parser.parse_args()
    for name in args.files:
        s = decode(name)
        dur = len(s) / RATE
        peak = max(abs(v) for v in s) or 1
        env = []
        for i in range(0, len(s), BLOCK):
            block = s[i:i + BLOCK]
            rms = math.sqrt(sum(v * v for v in block) / max(1, len(block)))
            env.append(rms)
        top = max(env) or 1
        ref = top
        thr = ref * 10 ** (args.db / 20)
        idx = [i for i, v in enumerate(env) if v >= thr]
        first = idx[0] * 0.01 if idx else 0
        last = (idx[-1] + 1) * 0.01 if idx else 0
        pk_t = env.index(top) * 0.01
        tail = env[int(max(0, len(env) - 50)):]
        tail_db = 20 * math.log10(max(1e-9, sum(tail) / len(tail)) / top)
        print(f"{Path(name).name}: dur {dur:.3f}s peak {20*math.log10(peak/32768):.2f} dBFS env-peak@{pk_t:.2f}s "
              f"audible[{args.db:.0f}dB] {first:.2f}-{last:.2f}s last0.5s {tail_db:.1f} dB rel")


if __name__ == '__main__':
    main()
