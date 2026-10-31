"""Per-beat Whisper check of the final read (Editor, 31 Oct 2026). Proxy only, not listening.

For each beat: the Whisper words whose start lies inside the beat's cut segment, normalised (letters and Thai marks only),
compared with the beat's TTS text (normalised) by difflib ratio. Reads whisper-words.json and measure-take1.json
(after cut-gaps.py). Run: python3 -I out/hanako-voice/final/beat-qa.py
"""
import difflib
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FINAL = ROOT / 'out/hanako-voice/final'


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


words = json.loads((FINAL / 'segments/whisper-words.json').read_text(encoding='utf-8'))
measure = json.loads((FINAL / 'measure-take1.json').read_text(encoding='utf-8'))
tts = json.loads((FINAL / 'tts-beats.json').read_text(encoding='utf-8'))
for beat, info in measure['beats'].items():
    start, end = info['segStart'], info['segEnd']
    heard = ''.join(norm(w['text']) for w in words if start <= w['on'] < end)
    target = norm(tts[beat])
    ratio = difflib.SequenceMatcher(None, target, heard, autojunk=False).ratio()
    print(f'{beat} ratio {ratio:.2f} target {len(target)} chars heard {len(heard)} chars  heard: {heard[:90]}')
