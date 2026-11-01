"""KSO voice lock v2: per-line ASR proxy (Whisper large-v3-turbo, CPU int8, as scripts/narration/align-full.py).
Proxy only, not a listening test: Thai ASR is rough, so a low score means "listen to this line", not "this line is wrong".
Each line: the R2 text (tags, ellipses and punctuation removed), the Whisper text, and a difflib ratio on letters only.
NARR clips also score each anchor phrase of anchors.md against its best-matching window of the Whisper text.
The Japanese WOMAN line is not scored (Whisper writes kanji and kana, the script gives kana): transcript only.

Run (worktree root): HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/asr-check.py
Writes out/kso-ep01-short/voice-lock-r2/qa/asr-r2.json.
"""
import difflib, json, re, unicodedata
from pathlib import Path
from faster_whisper import WhisperModel

OUT = Path('out/kso-ep01-short/voice-lock-r2')
VL = Path('scripts/kuchisake-onna/short/voice-lock')
TAG = re.compile(r'<[^>]+>')


def letters(text):
    text = TAG.sub('', text)
    keep = []
    for ch in text:
        c = unicodedata.category(ch)[0]
        if c in 'LN' or '฀' <= ch <= '๿' or '぀' <= ch <= 'ヿ' or '一' <= ch <= '鿿':
            keep.append(ch.lower())
    return ''.join(keep)


beats = json.loads((VL / 'tts-beats.json').read_text(encoding='utf-8'))
anchors = {}
for line in (VL / 'anchors.md').read_text(encoding='utf-8').splitlines():
    m = re.match(r'\| `([^`]+)` \| ([^|]+?) \|', line)
    if m:
        anchors.setdefault(m.group(1).split('-')[0], []).append((m.group(1), m.group(2).strip(), letters(m.group(2))))

# (line id, file, language, expected R2 text, scored)
LINES = [
    ('W01_hook', OUT / 'segments/W01_hook.wav', 'th', 'ฉัน… สวยไหม?', True),
    ('B01', OUT / 'segments/B01.wav', 'th', beats['B01'], True),
    ('W02_jp', OUT / 'segments/W02_jp.wav', 'ja', 'わたし… きれい?', False),
    ('B02', OUT / 'segments/B02.wav', 'th', beats['B02'], True),
    ('W03_th', OUT / 'segments/W03_th.wav', 'th', 'ฉัน… สวยไหม?', True),
    ('SLIP', OUT / 'segments/SLIP.wav', 'th', 'ส… สวย—', True),
    ('B04', OUT / 'segments/B04.wav', 'th', beats['B04'], True),
    ('W04_mask', OUT / 'segments/W04_mask.wav', 'th', 'แล้วตอนนี้ล่ะ… ยังสวยอยู่ไหม?', True),
    ('B05', OUT / 'segments/B05.wav', 'th', beats['B05'], True),
    ('B06', OUT / 'segments/B06.wav', 'th', beats['B06'], True),
    ('W05_final', OUT / 'segments/W05_final.wav', 'th', 'ถึงตาเธอแล้ว…', True),
    ('FULL_TRACK', OUT / 'final/KSO-EP01-SHORT_narration_voicelock-v2.mp3', 'th', None, False),
]


def padded(path):
    """Short clips are padded with 0.5 s of silence at both ends (ASR input only, under out/); a fixed temperature of 0
    makes reruns identical (the default fallback sampling changed the B01 transcript between two runs)."""
    import array, subprocess, wave
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', '48000', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    pad = bytes(int(0.5 * 48000) * 2)
    dst = OUT / 'qa/padded' / (Path(path).stem + '.wav')
    dst.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(dst), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000)
        w.writeframes(pad + raw + pad)
    return dst


def best_window(phrase, text):
    best = 0.0
    n = len(phrase)
    for size in range(max(1, n - 2), n + 3):
        for i in range(0, max(1, len(text) - size + 1)):
            r = difflib.SequenceMatcher(None, phrase, text[i:i + size]).ratio()
            if r > best:
                best = r
    return round(best, 3)


def main():
    model = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
    results = []
    for lid, path, lang, expected, scored in LINES:
        src = path if lid == 'FULL_TRACK' else padded(path)
        segs, info = model.transcribe(str(src), language=lang, vad_filter=False, temperature=0.0)
        asr = ''.join(s.text for s in segs).strip()
        row = {'line': lid, 'file': str(path), 'asrInput': str(src), 'language': lang, 'asr': asr, 'scored': scored}
        if expected is not None:
            row['expected'] = expected
            e, a = letters(expected), letters(asr)
            row['ratio'] = round(difflib.SequenceMatcher(None, e, a).ratio(), 3)
        if lid.startswith('B') and lid in anchors:
            row['anchors'] = [{'id': aid, 'phrase': ph, 'window': best_window(p, letters(asr))} for aid, ph, p in anchors[lid]]
        if lid == 'FULL_TRACK':
            # whole track: all scored lines in slot order (JP excluded); the score is a rough cross-check of order and gaps
            expected_full = ''.join(letters(e) for lid2, _, _, e, sc in LINES if sc and e is not None and lid2 != 'FULL_TRACK')
            row['expected'] = expected_full
            row['ratio'] = round(difflib.SequenceMatcher(None, letters(expected_full), letters(asr)).ratio(), 3)
            row['note'] = 'whole track vs all scored lines concatenated in slot order (JP line excluded); cross-check only'
        results.append(row)
        flag = f" ratio {row['ratio']}" if 'ratio' in row else ''
        print(f"{lid:<10}{flag} | {asr[:90]}")
    (OUT / 'qa').mkdir(parents=True, exist_ok=True)
    (OUT / 'qa/asr-r2.json').write_text(json.dumps({'model': 'large-v3-turbo', 'device': 'cpu', 'compute_type': 'int8',
                                                   'vad_filter': False, 'lines': results}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
