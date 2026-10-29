"""Compare SHIPWRECK-SHORT caption cue starts with speech onsets in the narration file (TL02, episode-only).
Usage: python3 -I scripts/oldest-shipwreck/short/check-cues.py [public/narration/SHIPWRECK-SHORT.mp3]
Reads scripts/oldest-shipwreck/short/narration-timeline.json; prints one line per cue: global frame, nearest speech onset
(10 ms RMS above -40 dBFS after >= 40 ms of silence) and the offset in ms, plus the speech end before the B_loop hold.
"""
import array, json, math, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
audio = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'public/narration/SHIPWRECK-SHORT.mp3')
slots = json.loads((ROOT / 'scripts/oldest-shipwreck/short/narration-timeline.json').read_text())
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', audio, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
a = array.array('h'); a.frombytes(raw); B = 480
db = [20 * math.log10(max(1e-9, math.sqrt(sum(v * v for v in a[i:i + B]) / B) / 32768)) for i in range(0, len(a) - B, B)]
onsets = [i / 100 for i in range(4, len(db)) if db[i] > -40 and all(x <= -40 for x in db[i - 4:i])]
last = max(i for i, v in enumerate(db) if v > -40) / 100
t, worst = 0.0, 0
for s in slots:
    for c in s.get('cues', []):
        at = round((t + c['atSec']) * 30) / 30
        near = min(onsets, key=lambda o: abs(o - at))
        worst = max(worst, abs(near - at))
        print(f"F{round(at * 30):5d} {at:6.2f}s onset {near:6.2f}s {1000 * (near - at):+5.0f} ms  {c['text']}")
    t = round((t + s['durationSec']) * 30) / 30
print(f"cues: worst |offset| {1000 * worst:.0f} ms; last speech ends {last:.2f}s; B_loop hold starts {t - 3:.2f}s; total {t:.2f}s")
