"""Measure sound candidates for cue selection (Editor, sound-generation skill step 4). Agents cannot listen.

Usage: python3 -I scripts/zombie-condo-paint/measure-sfx.py FILE.wav [FILE.wav ...]
Decodes each file to mono 48 kHz float32 with ffmpeg on PATH and prints one TSV row:
  file, seconds, peak_dBFS, rms_dBFS, onset_s (first 10 ms block within 30 dB of peak), peak_at_s,
  tail_s (time after the peak until the envelope stays 30 dB below it), env (dB per 0.1 s, from 0 s).
No sound is judged by ear here: a measured pick is not an audio approval (sound-generation skill step 4).
"""
import array
import math
import shutil
import subprocess
import sys
from pathlib import Path

FFMPEG = shutil.which('ffmpeg') or 'ffmpeg'  # the Remotion-bundled ffmpeg needs its DYLD path (narration.py); PATH ffmpeg is simpler here
RATE = 48000
BLOCK = RATE // 100  # 10 ms


def decode(path):
    out = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    samples = array.array('f')
    samples.frombytes(out)
    return samples


def db(v):
    return 20 * math.log10(max(v, 1e-9))


def main(paths):
    print('file\tseconds\tpeak_dBFS\trms_dBFS\tonset_s\tpeak_at_s\ttail_s\tenv_dB_per_0.1s')
    for raw in paths:
        s = decode(raw)
        blocks = [math.sqrt(sum(v * v for v in s[i:i + BLOCK]) / max(1, len(s[i:i + BLOCK]))) for i in range(0, len(s), BLOCK)]
        peak_lin = max(max(abs(v) for v in s), 1e-9)
        rms = math.sqrt(sum(v * v for v in s) / max(1, len(s)))
        env = [db(b) for b in blocks]
        peak_block = max(range(len(blocks)), key=lambda i: blocks[i])
        onset = next((i for i, b in enumerate(blocks) if db(b) >= db(blocks[peak_block]) - 30), 0)
        tail_end = peak_block
        for i in range(peak_block, len(blocks)):
            if env[i] >= db(blocks[peak_block]) - 30:
                tail_end = i
        per = [round(max(env[i:i + 10] or [-120]), 1) for i in range(0, len(env), 10)]
        print('\t'.join([Path(raw).name, f'{len(s) / RATE:.2f}', f'{db(peak_lin):.1f}', f'{db(rms):.1f}', f'{onset * 0.01:.2f}',
                         f'{peak_block * 0.01:.2f}', f'{(tail_end - peak_block) * 0.01:.2f}', ' '.join(str(p) for p in per[:40])]))


if __name__ == '__main__':
    main(sys.argv[1:])
