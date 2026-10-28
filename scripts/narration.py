"""Generate local Niwat (+5%) audio and a committed 30fps RMS envelope.
Install edge-tts==7.3.1, then run npm run narration. Each subtitle starts with its scene.
Per video: npm run narration -- --timeline scripts/<episode>/<variant>/timeline.json --name <CompositionId>
writes public/narration/<CompositionId>.mp3 and <CompositionId>.amplitude.json beside the timeline,
so videos never overwrite each other. Without arguments it regenerates the demo files.
Optional per-scene "leadSec" delays that scene's speech inside its slot (to line it up with a fixed picture event);
the overrun check then uses the end of audible speech (trailing TTS silence ignored) instead of the clip length.
"""
import argparse
import asyncio
import array
import json
import math
import os
import io
import wave
from pathlib import Path
import subprocess
import tempfile
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SAMPLE_RATE = 48000
FFMPEG = next((ROOT / 'node_modules/@remotion').glob('compositor-darwin-*/ffmpeg'), None)
FFMPEG = str(FFMPEG) if FFMPEG else 'ffmpeg'
FFMPEG_ENV = {**os.environ, 'DYLD_LIBRARY_PATH': str(Path(FFMPEG).parent.resolve())}


def pcm(path):
    result = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(SAMPLE_RATE), '-c:a', 'pcm_s16le', '-f', 'wav', '-'], capture_output=True, env=FFMPEG_ENV)
    if result.returncode:
        raise RuntimeError(result.stderr.decode())
    samples = array.array('h')
    with wave.open(io.BytesIO(result.stdout), 'rb') as decoded:
        samples.frombytes(decoded.readframes(decoded.getnframes()))
    return samples


def paths():
    parser = argparse.ArgumentParser()
    parser.add_argument('--timeline', default='scripts/demo.json')
    parser.add_argument('--name', help='composition ID; omit for the demo paths')
    args = parser.parse_args()
    timeline = ROOT / args.timeline
    if not args.name:
        return timeline, ROOT / 'public/narration.mp3', ROOT / 'src/amplitude.json'
    return timeline, ROOT / f'public/narration/{args.name}.mp3', timeline.parent / f'{args.name}.amplitude.json'


async def main():
    source, target, amplitude = paths()
    target.parent.mkdir(parents=True, exist_ok=True)
    timeline = json.loads(source.read_text())
    with tempfile.TemporaryDirectory() as directory:
        combined = array.array('h')
        for index, scene in enumerate(timeline):
            clip = Path(directory) / f'{index}.mp3'
            await edge_tts.Communicate(scene['subtitle'], 'th-TH-NiwatNeural', rate='+5%').save(str(clip))
            samples = pcm(clip)
            count = round(scene['durationSec'] * FPS) * (SAMPLE_RATE // FPS)
            lead = round(scene.get('leadSec', 0) * SAMPLE_RATE)
            if lead:
                audible = max((i for i, v in enumerate(samples) if abs(v) >= 300), default=-1) + 1
                if lead + audible > count:
                    raise ValueError(f'Scene {index + 1}: leadSec pushes narration past the scene duration')
                samples = array.array('h', [0] * lead) + samples[:count - lead]
            elif len(samples) > count:
                raise ValueError(f'Scene {index + 1}: narration exceeds scene duration; shorten the subtitle')
            combined.extend(samples)
            combined.extend([0] * (count - len(samples)))
            print(f'Scene {index + 1}: {len(samples) / SAMPLE_RATE:.2f}s speech in {count / SAMPLE_RATE:.2f}s slot', flush=True)
        raw = Path(directory) / 'narration.pcm'
        raw.write_bytes(combined.tobytes())
        subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', str(raw), '-c:a', 'libmp3lame', '-b:a', '192k', str(target)], check=True, env=FFMPEG_ENV)
        delivered = pcm(target)
        block = SAMPLE_RATE // FPS
        rms = [math.sqrt(sum(v * v for v in delivered[i:i + block]) / len(delivered[i:i + block])) for i in range(0, len(combined), block)]
        peak = max(rms) or 1
        amplitude.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
        print(f'Wrote {target} and {amplitude} ({len(rms)} amplitude frames)')


if __name__ == '__main__':
    asyncio.run(main())
