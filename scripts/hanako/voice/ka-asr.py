"""Whisper particle check for «ค่ะ» reply clips (Editor, 31 Oct 2026). Pass = normalised transcript equals «ค่ะ». Proxy only.
Run: <main>/.venv-whisper/bin/python -I out/hanako-voice/final/ka-asr.py <wav> [<wav> ...]
"""
import sys, unicodedata
from faster_whisper import WhisperModel

def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')

model = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
for path in sys.argv[1:]:
    segs, _ = model.transcribe(path, language='th', vad_filter=False, beam_size=5)
    text = ' '.join(s.text.strip() for s in segs)
    print(f'{path.rsplit("/", 1)[-1]} heard={text!r} norm={norm(text)!r} pass={norm(text) == "ค่ะ"}', flush=True)
