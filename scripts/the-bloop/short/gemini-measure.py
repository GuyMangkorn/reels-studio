"""BLOOP-EP01-SHORT: measure phrase onsets of the Gemini VO clips (Editor, 2026-10-30).

Gemini TTS returns no word timings, so Edge's WordBoundary method is not available. This script uses faster-whisper
(large-v3-turbo, language th, word timestamps) on each beat clip, aligns the transcript to the R5 VO with difflib, and
maps each anchor phrase (index.md) to the Whisper word that carries its first and last character. Whisper's Thai word
times are rough (scripts/transcribe.py notes), so the result is an estimate of onsets, not a boundary-accurate read.
The speech window (first and last sample above 300 of 32767, as in narration.py) is measured from the audio itself.

Run with the Whisper venv (main checkout):
  /Users/mangkornkatawong/Documents/ChatGPT/Reels\\ Creator/.venv-whisper/bin/python -I scripts/the-bloop/short/gemini-measure.py --take 1
Input: out/BLOOP-EP01-SHORT/gemini-vo/B??-take<N>.wav and the R5 VO (narration-timeline.json).
Output: scripts/the-bloop/short/gemini-measure-take<N>.json (same schema as tts-measure.json).
"""
import argparse, array, difflib, json, re, subprocess, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
INDEX = ROOT / 'storyboards/the-bloop/short/index.md'
TIMELINE = ROOT / 'scripts/the-bloop/short/narration-timeline.json'
CLIP_DIR = ROOT / 'out/BLOOP-EP01-SHORT/gemini-vo'
THRESHOLD, RATE = 300, 48000


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


def anchors():
    rows = []
    for line in INDEX.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^\| `(B\d\d-a\d)` \| (.+?) \| (\d+) \| (\d+) \|$', line)
        if m:
            rows.append({'id': m.group(1), 'beat': m.group(1)[:3], 'text': re.sub(r'\s*\(.*?\)', '', m.group(2)).strip(),
                         'estOn': int(m.group(3)), 'estEnd': int(m.group(4))})
    return rows


def decode(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    samples = array.array('h')
    samples.frombytes(out)
    return samples


def speech_window(samples):
    idx = [i for i, v in enumerate(samples) if abs(v) >= THRESHOLD]
    return idx[0] / RATE, (idx[-1] + 1) / RATE


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--take', default='1')
    args = ap.parse_args()
    from faster_whisper import WhisperModel
    model = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
    slots = json.loads(TIMELINE.read_text(encoding='utf-8'))
    anc = anchors()
    report = {'method': 'faster-whisper large-v3-turbo word timestamps aligned to the R5 VO (difflib); not WordBoundary',
              'take': args.take, 'beats': {}, 'anchors': []}
    for slot in slots:
        beat = slot['beat']
        wav = CLIP_DIR / f'{beat}-take{args.take}.wav'
        vo = slot['subtitle']
        samples = decode(wav)
        on, off = speech_window(samples)
        segments, _ = model.transcribe(str(wav), language='th', word_timestamps=True, vad_filter=False)
        words = [{'on': w.start, 'end': w.end, 'text': w.word} for seg in segments for w in (seg.words or [])]
        asr_chars, owner = [], []
        for k, w in enumerate(words):
            for ch in norm(w['text']):
                asr_chars.append(ch)
                owner.append(k)
        vo_norm = norm(vo)
        asr_norm = ''.join(asr_chars)
        sm = difflib.SequenceMatcher(None, vo_norm, asr_norm, autojunk=False)
        vo_to_asr = {}
        matched = 0
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == 'equal':
                matched += i2 - i1
                for k in range(i2 - i1):
                    vo_to_asr[i1 + k] = j1 + k
        ratio = matched / max(1, len(vo_norm))
        report['beats'][beat] = {'vo': vo, 'speechOnRaw': round(on, 4), 'speechOffRaw': round(off, 4), 'matchRatio': round(ratio, 3),
                                 'asrText': ''.join(w['text'] for w in words), 'words': [{'on': round(w['on'], 3), 'end': round(w['end'], 3), 'text': w['text']} for w in words]}
        cursor = 0
        for a in [x for x in anc if x['beat'] == beat]:
            target = norm(a['text'])
            at = vo_norm.find(target, cursor)
            if at < 0:
                raise SystemExit(f"{a['id']}: anchor not found in {beat} VO")
            cursor = at + len(target)

            def nearest(idx):
                for d in range(0, 40):
                    for cand in (idx - d, idx + d):
                        if cand in vo_to_asr:
                            return vo_to_asr[cand]
                return None
            s_asr, e_asr = nearest(at), nearest(at + len(target) - 1)
            if s_asr is None or e_asr is None:
                raise SystemExit(f"{a['id']}: no alignment for anchor")
            on_w, end_w = words[owner[s_asr]], words[owner[e_asr]]
            report['anchors'].append({'id': a['id'], 'beat': beat, 'text': a['text'], 'estOn': a['estOn'], 'estEnd': a['estEnd'],
                                      'onRaw': round(on_w['start'], 4), 'endRaw': round(end_w['end'], 4), 'firstWord': on_w['text']})
        print(f"{beat}: speech {on:.3f}-{off:.3f} s, match {ratio:.2f}, words {len(words)}", flush=True)
    out = ROOT / f'scripts/the-bloop/short/gemini-measure-take{args.take}.json'
    out.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {out} ({len(report["anchors"])} anchors)')


if __name__ == '__main__':
    main()
