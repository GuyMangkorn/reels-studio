"""Whisper check of isolated clips (Editor, 31 Oct 2026). Proxy only, not listening.
Beat clips: difflib ratio of the normalised transcript vs the beat TTS text. Reply clips: exact check for the particle «ค่ะ».
Run: "<main>/.venv-whisper/bin/python" -I out/hanako-voice/final/clip-asr.py [--segments DIR] [--json OUT]
Defaults: the current lock's segments (out/hanako-voice/final/segments), no JSON. --json writes the per-beat ratios and
heard text (read by write-measure.py for the current lock, and used to compare a superseded lock's segments).
"""
import argparse, difflib, json, unicodedata
from pathlib import Path
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[3]
FINAL, KA = ROOT / 'out/hanako-voice/final', ROOT / 'out/hanako-voice'


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


ap = argparse.ArgumentParser()
ap.add_argument('--segments', default=str(FINAL / 'segments'))
ap.add_argument('--json')
args = ap.parse_args()

model = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')


def heard(path):
    segs, _ = model.transcribe(str(path), language='th', vad_filter=False, beam_size=5)
    return ' '.join(s.text.strip() for s in segs)


tts = json.loads((FINAL / 'tts-beats.json').read_text(encoding='utf-8'))
out = {'segments': args.segments, 'beats': {}, 'reply': {}}
for beat in sorted(tts):
    text = heard(Path(args.segments) / f'{beat}.wav')
    ratio = difflib.SequenceMatcher(None, norm(tts[beat]), norm(text), autojunk=False).ratio()
    out['beats'][beat] = {'ratio': round(ratio, 2), 'heard': text}
    print(f'{beat} ratio {ratio:.2f} heard: {text[:110]}', flush=True)
for name in ['KA-T1', 'KA-T2']:
    text = heard(KA / f'{name}.wav')
    out['reply'][name] = {'heard': text, 'norm': norm(text), 'pass_karnkha': norm(text) == 'ค่ะ'}
    print(f'{name} heard: {text!r} norm={norm(text)!r} pass_karnkha={norm(text) == "ค่ะ"}', flush=True)
if args.json:
    Path(args.json).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print('wrote', args.json, flush=True)
