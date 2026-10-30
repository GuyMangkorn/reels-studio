"""30 fps RMS envelope of the NOAA PMEL bloop.wav (DEP05, brief VD15, index AUD-1).

Usage: python3 -I scripts/the-bloop/bake-envelope.py bloop.wav src/painted/bloop/bloop-envelope.json

Method (same as scripts/narration.py): RMS per 1/30 s frame, normalised by the peak frame so the envelope runs 0..1.
Frame i covers samples [i * sr / 30, (i + 1) * sr / 30), so frame alignment does not depend on the sample rate (the NOAA
file is 8 kHz). The envelope is a shape only: gain changes made by the Editor's copy (trim, fade, level) do not change it,
because it is normalised. The raw dBFS figures are recorded for the audit. Stdlib only.
"""
import json
import math
import struct
import sys
import wave

FPS = 30


def read_mono(path):
    with wave.open(path, "rb") as w:
        channels, width, rate, count = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        raw = w.readframes(count)
    if width != 2:
        raise SystemExit(f"expected 16-bit PCM, got {8 * width}-bit")
    values = struct.unpack("<" + "h" * (len(raw) // 2), raw)
    if channels == 2:
        values = [(values[i] + values[i + 1]) / 2 for i in range(0, len(values), 2)]
    return values, rate


def main(src, dst):
    samples, rate = read_mono(src)
    duration = len(samples) / rate
    frames = math.ceil(duration * FPS)
    rms = []
    for i in range(frames):
        a = round(i * rate / FPS)
        b = min(len(samples), round((i + 1) * rate / FPS))
        window = samples[a:b]
        rms.append(math.sqrt(sum(v * v for v in window) / len(window)) if window else 0.0)
    peak = max(rms) or 1.0
    env = [round(v / peak, 4) for v in rms]
    audible = [i for i, v in enumerate(env) if v >= 0.05]
    raw_peak = max(abs(v) for v in samples) / 32768.0
    out = {
        "id": "AUD-1-ENVELOPE",
        "source": "NOAA PMEL bloop.wav (sped up 16x by NOAA); sha256 ecc057a98dfcb0e2a35affc54e906d9a0ee8870bc9592c8fffce873bad5b374f; see NOTICE",
        "fps": FPS,
        "sampleRate": rate,
        "durationSec": round(duration, 4),
        "rawPeakDbfs": round(20 * math.log10(raw_peak), 2),
        "audibleFrames": [audible[0], audible[-1]] if audible else None,
        "audibleSec": [round(audible[0] / FPS, 3), round((audible[-1] + 1) / FPS, 3)] if audible else None,
        "normaliser": "peak frame RMS",
        "frames": env,
    }
    with open(dst, "w", encoding="utf-8") as fh:
        json.dump(out, fh, separators=(",", ":"))
        fh.write("\n")
    print(f"Wrote {dst}: {frames} frames at {FPS} fps, {duration:.3f} s, raw peak {out['rawPeakDbfs']} dBFS, audible {out['audibleSec']} s (>= 0.05)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
