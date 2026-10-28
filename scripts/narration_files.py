"""Assemble narration from supplied per-beat audio files (e.g. Botnoi MP3s) into one track plus the 30fps RMS envelope.
Run: python3 scripts/narration_files.py --timeline scripts/<episode>/<variant>/narration-timeline-<voice>.json --name <CompositionId> --dir public/narration/<voice>
Each timeline entry: {durationSec, subtitle, file, ...}; the words are never edited. Optional per entry, applied in this order:
  closeGaps [[rawSec, keepSec]]  shorten the silent run nearest rawSec (raw file time) to keepSec (same helper as narration.py)
  trimHeadSec                    keep only this much leading silence
  tempo                          pitch-preserving ffmpeg atempo factor (1.04 = 4% faster), whole beat
  gainDb                         level correction for a measured loudness mismatch between beats
  leadSec                        delay of the speech inside its slot
  marks {name: rawSec}           raw-file times to track through the edits; printed as slot-local seconds/frames
Uses the Remotion-bundled ffmpeg and narration.py helpers; writes public/narration/<name>.mp3 and <name>.amplitude.json beside the timeline.
"""
import argparse
import array
import json
import io
import math
import subprocess
import tempfile
import wave
from pathlib import Path

from narration import FFMPEG, FFMPEG_ENV, FPS, ROOT, SAMPLE_RATE, THRESHOLD, pcm, shorten, silent_runs


def tempo_pcm(samples, factor, directory):
    raw = Path(directory) / 'tempo-in.pcm'
    raw.write_bytes(samples.tobytes())
    out = subprocess.run([FFMPEG, '-v', 'error', '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', str(raw), '-af', f'atempo={factor}', '-c:a', 'pcm_s16le', '-f', 'wav', '-'], capture_output=True, env=FFMPEG_ENV, check=True)
    result = array.array('h')
    with wave.open(io.BytesIO(out.stdout), 'rb') as decoded:
        result.frombytes(decoded.readframes(decoded.getnframes()))
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--timeline', required=True)
    parser.add_argument('--name', required=True)
    parser.add_argument('--dir', required=True)
    args = parser.parse_args()
    source = ROOT / args.timeline
    target = ROOT / f'public/narration/{args.name}.mp3'
    amplitude = source.parent / f'{args.name}.amplitude.json'
    timeline = json.loads(source.read_text())
    with tempfile.TemporaryDirectory() as directory:
        combined = array.array('h')
        for index, scene in enumerate(timeline):
            samples = pcm(ROOT / args.dir / scene['file'])
            marks = {k: round(v * SAMPLE_RATE) for k, v in scene.get('marks', {}).items()}
            for at, keep in sorted(scene.get('closeGaps', []), reverse=True):
                runs = [r for r in silent_runs(samples, SAMPLE_RATE * 10 // 100) if r[0] / SAMPLE_RATE - 0.15 <= at <= r[1] / SAMPLE_RATE + 0.15]
                if not runs:
                    raise ValueError(f'{scene["file"]}: no silent gap near {at}s to close')
                begin, end = runs[0]
                cut = (end - begin) - round(keep * SAMPLE_RATE)
                if cut > 0:
                    samples = shorten(samples, begin, end, round(keep * SAMPLE_RATE))
                    marks = {k: (v - cut if v >= end else min(v, begin + round(keep * SAMPLE_RATE) // 2) if v > begin else v) for k, v in marks.items()}
            head = scene.get('trimHeadSec')
            if head is not None:
                first = next((i for i, v in enumerate(samples) if abs(v) >= THRESHOLD), 0)
                drop = first - round(head * SAMPLE_RATE)
                if drop > 0:
                    samples = samples[drop:]
                    marks = {k: v - drop for k, v in marks.items()}
            factor = scene.get('tempo', 1.0)
            if factor != 1.0:
                samples = tempo_pcm(samples, factor, directory)
                marks = {k: round(v / factor) for k, v in marks.items()}
            gain = 10 ** (scene.get('gainDb', 0) / 20)
            if gain != 1.0:
                samples = array.array('h', [max(-32768, min(32767, round(v * gain))) for v in samples])
            lead = round(scene.get('leadSec', 0) * SAMPLE_RATE)
            count = round(scene['durationSec'] * FPS) * (SAMPLE_RATE // FPS)
            idx = [i for i, v in enumerate(samples) if abs(v) >= THRESHOLD]
            first, last = (idx[0], idx[-1] + 1) if idx else (0, 0)
            if lead + last > count:
                raise ValueError(f'{scene["file"]}: speech ends {(lead + last) / SAMPLE_RATE:.2f}s, past the {count / SAMPLE_RATE:.2f}s slot')
            samples = array.array('h', [0] * lead) + samples
            combined.extend(samples)
            combined.extend([0] * (count - len(samples)))
            print(f'{scene["file"]}: speech {(lead + first) / SAMPLE_RATE:.3f}-{(lead + last) / SAMPLE_RATE:.3f} s (F{(lead + first) * FPS / SAMPLE_RATE:.0f}-F{(lead + last) * FPS / SAMPLE_RATE:.0f}) in {count / SAMPLE_RATE:.2f}s slot, slack {(count - lead - last) / SAMPLE_RATE:.2f} s', flush=True)
            for name, value in marks.items():
                print(f'    mark {name}: {(value + lead) / SAMPLE_RATE:.3f} s = F{(value + lead) * FPS / SAMPLE_RATE:.1f}', flush=True)
        raw = Path(directory) / 'narration.pcm'
        raw.write_bytes(combined.tobytes())
        target.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', str(raw), '-c:a', 'libmp3lame', '-b:a', '192k', str(target)], check=True, env=FFMPEG_ENV)
        delivered = pcm(target)
        block = SAMPLE_RATE // FPS
        rms = [math.sqrt(sum(v * v for v in delivered[i:i + block]) / len(delivered[i:i + block])) for i in range(0, len(combined), block)]
        peak = max(rms) or 1
        amplitude.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
        print(f'Wrote {target} and {amplitude} ({len(rms)} amplitude frames)')


if __name__ == '__main__':
    main()
