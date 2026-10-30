"""BLOOP-EP01-SHORT: assemble a narration track from per-beat clips and a slot plan (Editor, 2026-10-30).

Same rules as scripts/narration.py, for clips that are not Edge output: each clip is decoded (48 kHz mono), its audible
start (first sample >= 300 of 32767) is kept with `trimHeadSec` of room, `leadSec` of silence is added before it, and
the slot is padded to `durationSec` at 30 fps. The result is one MP3 (192k) plus a 30 fps RMS amplitude JSON (peak
normalized), written beside the outputs. It is a listening/QA track, not a composition asset.

Run (worktree root):
  python3 -I scripts/the-bloop/short/assemble-narration.py --clips out/BLOOP-EP01-SHORT/gemini-vo/take2/segments \
      --timeline scripts/the-bloop/short/narration-timeline-gemini-take2.json --out out/BLOOP-EP01-SHORT/gemini-vo/BLOOP-gemini-take2-listen.mp3
"""
import argparse, array, json, math, subprocess, tempfile
from pathlib import Path

RATE, FPS, THRESHOLD = 48000, 30, 300


def decode(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    s = array.array('h')
    s.frombytes(out)
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--clips', required=True, help='directory with <BEAT>.wav')
    ap.add_argument('--timeline', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    clips, slots = Path(args.clips), json.loads(Path(args.timeline).read_text(encoding='utf-8'))
    out_mp3 = Path(args.out)
    amp_path = out_mp3.with_suffix('.amplitude.json')
    combined = array.array('h')
    for index, slot in enumerate(slots):
        samples = decode(clips / f"{slot['beat']}.wav")
        head = slot.get('trimHeadSec', 0.0)
        first = next((i for i, v in enumerate(samples) if abs(v) >= THRESHOLD), 0)
        drop = first - round(head * RATE)
        if drop > 0:
            samples = samples[drop:]
        count = round(slot['durationSec'] * FPS) * (RATE // FPS)
        lead = round(slot.get('leadSec', 0) * RATE)
        audible = max((i for i, v in enumerate(samples) if abs(v) >= THRESHOLD), default=-1) + 1
        if lead + audible > count:
            raise SystemExit(f"{slot['beat']}: speech pushes past the slot ({(lead + audible) / RATE:.2f} s > {count / RATE:.2f} s)")
        samples = array.array('h', [0] * lead) + samples[:count - lead]
        samples.extend([0] * (count - len(samples)))
        combined.extend(samples)
        print(f"{slot['beat']}: slot {count / RATE:.3f} s, speech starts {(lead + head) if drop > 0 else lead:.3f} s into the slot", flush=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / 'narration.pcm'
        raw.write_bytes(combined.tobytes())
        out_mp3.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(raw),
                        '-c:a', 'libmp3lame', '-b:a', '192k', str(out_mp3)], check=True)
    delivered = decode(out_mp3)
    block = RATE // FPS
    rms = [math.sqrt(sum(v * v for v in delivered[i:i + block]) / len(delivered[i:i + block])) for i in range(0, len(combined), block)]
    peak = max(rms) or 1
    amp_path.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
    print(f'wrote {out_mp3} ({len(combined) / RATE:.3f} s) and {amp_path} ({len(rms)} amplitude frames)', flush=True)


if __name__ == '__main__':
    main()
