"""HANAKO-SHORT voice lock inputs (Editor, 31 Oct 2026). Reproduction input for the final Gemini read.

Source: out/hanako-voice/text/B01.txt..B09.txt (verbatim VO of HANAKO-SHORT-SCRIPT-R2 with ellipses as commas).
Changes made for the TTS input only (the script text is unchanged):
  1. «ค่ะ» removed from B02: the reply is the girl's separate clip (script B02 sound intent), not the narrator.
  2. Numerals spelled as Thai words: 1948, 1990, 80, 90 (ปี/ยุค wording kept, no ค.ศ. marker added).
Writes: tts-beats.json ({beat: TTS text}), tts-input.txt (one continuous read, beats joined by a space),
narration-timeline.json (slot list for align-full.py; subtitles keep the script digits).
Run: python3 -I out/hanako-voice/final/build-inputs.py   (from the worktree root)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / 'out/hanako-voice/text'
OUT = ROOT / 'out/hanako-voice/final'
BEATS = [f'B0{i}' for i in range(1, 10)]
NUMERALS = [('1948', 'หนึ่งพันเก้าร้อยสี่สิบแปด'), ('1990', 'หนึ่งพันเก้าร้อยเก้าสิบ')]
SHORT_NUMERALS = [(r'(?<!\d)80(?!\d)', 'แปดสิบ'), (r'(?<!\d)90(?!\d)', 'เก้าสิบ')]

OUT.mkdir(parents=True, exist_ok=True)
tts, subtitles = {}, {}
for beat in BEATS:
    raw = (SRC / f'{beat}.txt').read_text(encoding='utf-8').strip()
    subtitles[beat] = raw
    text = raw
    if beat == 'B02':
        text = text.replace(', “ค่ะ”', ',').replace('“ค่ะ”', '')
        assert 'ค่ะ' not in text, 'B02 reply must not be in the narrator read'
    for digits, words in NUMERALS:
        text = text.replace(digits, words)
    for pattern, words in SHORT_NUMERALS:
        text = re.sub(pattern, words, text)
    # v2: a beat boundary needs punctuation in one read, or Gemini runs the beats together (v1: 24-96 ms gaps).
    # The script's written pauses (…) at beat ends are restored as a sentence end; the pause length is set by the timeline.
    if text[-1] not in '.,?!”"':
        text += '.'
    assert not re.search(r'\d', text), f'{beat}: digits left in TTS input'
    tts[beat] = text

(OUT / 'tts-beats.json').write_text(json.dumps(tts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
(OUT / 'tts-input.txt').write_text(' '.join(tts[b] for b in BEATS) + '\n', encoding='utf-8')
(OUT / 'narration-timeline.json').write_text(
    json.dumps([{'beat': b, 'subtitle': subtitles[b]} for b in BEATS], ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print((OUT / 'tts-input.txt').read_text(encoding='utf-8'))
print('chars:', len((OUT / 'tts-input.txt').read_text(encoding='utf-8')))
