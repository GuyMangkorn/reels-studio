"""Drift check of a continuous narrator read (Editor, 31 Oct 2026). Proxy only, not listening.

Reuses the metrics of scripts/narration/voice-match.py (F0 median and spread, spectral centroid, TTS characters per
active second) so the numbers match the gemini-tts skill's drift check. Reports per beat (segment WAVs) and in 10 s
windows over the whole read (the drift curve: a late climb in F0 or centroid shows as the window values rise).
Run with the Whisper venv (numpy):
  "<main>/.venv-whisper/bin/python" -I out/hanako-voice/final/beat-drift.py --full <read.wav> --segments <dir> \
      --tts-beats out/hanako-voice/final/tts-beats.json --out <drift.json>
"""
import argparse, importlib.util, json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[3]
_spec = importlib.util.spec_from_file_location('voice_match', ROOT / 'scripts/narration/voice-match.py')
vm = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vm)
BEATS = [f'B0{i}' for i in range(1, 10)]
WINDOW = 10.0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--full', required=True)
    ap.add_argument('--segments', required=True)
    ap.add_argument('--tts-beats', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    tts = json.loads(Path(a.tts_beats).read_text(encoding='utf-8'))
    seg_dir = Path(a.segments)
    beats = {}
    for b in BEATS:
        x = vm.decode(seg_dir / f'{b}.wav')
        m = vm.metrics(x, tts[b])
        beats[b] = m
    ref = beats['B01']
    for b in BEATS:
        beats[b]['f0_vs_B01_pct'] = round(100 * (beats[b]['f0_median_hz'] / ref['f0_median_hz'] - 1), 1)
        beats[b]['centroid_vs_B01_pct'] = round(100 * (beats[b]['centroid_hz'] / ref['centroid_hz'] - 1), 1)
        beats[b]['rate_vs_B01_pct'] = round(100 * (beats[b]['chars_per_active_s'] / ref['chars_per_active_s'] - 1), 1)
    full = vm.decode(Path(a.full))
    rate = 48000
    windows = []
    t = 0.0
    total = len(full) / rate
    while t < total - 1.0:
        seg = full[int(t * rate):int(min(t + WINDOW, total) * rate)]
        med, spread, voiced = vm.f0_stats(seg)
        windows.append({'t0_s': round(t, 1), 'f0_median_hz': round(med, 1), 'f0_spread_hz': round(spread, 1),
                        'voiced_frames': voiced, 'centroid_hz': round(vm.centroid(seg), 1)})
        t += WINDOW
    out = {'full': str(a.full), 'segments': str(a.segments), 'beats': beats, 'windows_10s': windows,
           'note': 'F0 and centroid from voice-match.py metrics; rate is chars per active second (B01 = reference)'}
    Path(a.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    for b in BEATS:
        m = beats[b]
        print(f"{b} F0 {m['f0_median_hz']:.1f} Hz (vs B01 {m['f0_vs_B01_pct']:+.1f}%) spread {m['f0_spread_hz']:.1f} "
              f"centroid {m['centroid_hz']:.0f} Hz ({m['centroid_vs_B01_pct']:+.1f}%) rate {m['chars_per_active_s']:.2f} c/s ({m['rate_vs_B01_pct']:+.1f}%)")
    for w in windows:
        print(f"t={w['t0_s']:5.1f}s F0 {w['f0_median_hz']} spread {w['f0_spread_hz']} centroid {w['centroid_hz']} voiced {w['voiced_frames']}")


if __name__ == '__main__':
    main()
