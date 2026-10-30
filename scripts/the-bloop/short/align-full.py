"""BLOOP-EP01-SHORT take 2: align one continuous Gemini read to the R5 VO and cut it into beat segments (Editor, 2026-10-30).

The whole VO is one TTS call (one speaker, one style), so the audio has no per-beat clips. This script:
1. transcribes the full WAV with faster-whisper (large-v3-turbo, th, word timestamps; estimates, not boundary-accurate);
2. aligns the joined TTS text (per-beat texts in out/.../take2/tts-beats.json) to the Whisper characters with difflib;
3. maps every index.md anchor phrase to its first and last Whisper word;
4. cuts the file at the midpoint between each beat's last anchor end and the next beat's first anchor onset, writing
   out/BLOOP-EP01-SHORT/gemini-vo/take2/segments/B0N.wav, and measures speech inside each segment (narration.py rule).
Output: scripts/the-bloop/short/gemini-measure-take2.json (schema of tts-measure.json; times relative to each segment).

Run with the Whisper venv of the main checkout (from the worktree root):
  "/Users/mangkornkatawong/Documents/ChatGPT/Reels Creator/.venv-whisper/bin/python" -I scripts/the-bloop/short/align-full.py
"""
import array, difflib, json, re, subprocess, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TAKE = ROOT / 'out/BLOOP-EP01-SHORT/gemini-vo/take2'
FULL = TAKE / 'FULL-take2.wav'
SEG = TAKE / 'segments'
INDEX = ROOT / 'storyboards/the-bloop/short/index.md'
TIMELINE = ROOT / 'scripts/the-bloop/short/narration-timeline.json'
RESULT = ROOT / 'scripts/the-bloop/short/gemini-measure-take2.json'
RATE, THRESHOLD = 48000, 300


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
    s = array.array('h')
    s.frombytes(out)
    return s


def speech_window(samples):
    idx = [i for i, v in enumerate(samples) if abs(v) >= THRESHOLD]
    return (idx[0] / RATE, (idx[-1] + 1) / RATE) if idx else (0.0, 0.0)


def main():
    global TAKE, FULL, SEG, RESULT
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--take-dir', default=str(TAKE.relative_to(ROOT)), help='folder with the full WAV and tts-beats.json')
    ap.add_argument('--full', default='FULL-take2.wav')
    ap.add_argument('--measure', default='gemini-measure-take2.json', help='file in scripts/the-bloop/short/')
    args = ap.parse_args()
    TAKE = ROOT / args.take_dir
    FULL = TAKE / args.full
    SEG = TAKE / 'segments'
    RESULT = ROOT / 'scripts/the-bloop/short' / args.measure
    from faster_whisper import WhisperModel
    slots = json.loads(TIMELINE.read_text(encoding='utf-8'))
    beats = [s['beat'] for s in slots]
    vo = {s['beat']: s['subtitle'] for s in slots}
    tts = json.loads((TAKE / 'tts-beats.json').read_text(encoding='utf-8'))
    anc = anchors()

    # joined TTS text with each beat's character offset
    offsets, joined, pos = {}, '', 0
    for b in beats:
        offsets[b] = pos
        piece = norm(tts[b])
        joined += piece
        pos += len(piece)
    model = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
    segments, _ = model.transcribe(str(FULL), language='th', word_timestamps=True, vad_filter=False)
    words = [{'on': w.start, 'end': w.end, 'text': w.word} for seg in segments for w in (seg.words or [])]
    asr, owner = [], []
    for k, w in enumerate(words):
        for ch in norm(w['text']):
            asr.append(ch)
            owner.append(k)
    asr_norm = ''.join(asr)
    sm = difflib.SequenceMatcher(None, joined, asr_norm, autojunk=False)
    m2a, matched = {}, 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            matched += i2 - i1
            for k in range(i2 - i1):
                m2a[i1 + k] = j1 + k
    print(f'alignment: {matched}/{len(joined)} TTS characters matched ({matched / len(joined):.2f})', flush=True)

    def nearest(idx):
        for d in range(0, 60):
            for cand in (idx - d, idx + d):
                if cand in m2a:
                    return m2a[cand]
        return None

    found = []
    for b in beats:
        target_b = norm(tts[b])
        cursor = 0
        for a in [x for x in anc if x['beat'] == b]:
            target = norm(a['text'])
            at = target_b.find(target, cursor)
            if at < 0:
                raise SystemExit(f"{a['id']}: anchor not in TTS text of {b}")
            cursor = at + len(target)
            g0 = offsets[b] + at
            g1 = offsets[b] + at + len(target) - 1
            # onset: first matched character inside the phrase; end: last matched character inside the phrase.
            # (nearest-match could pick a repeated syllable in the neighbouring beat, e.g. "นี้" in B01 for B02-a1.)
            inside = [m2a[i] for i in range(g0, g1 + 1) if i in m2a]
            if inside:
                s_asr, e_asr, how = min(inside), max(inside), 'inside'
            else:
                s_asr, e_asr, how = nearest(g0), nearest(g1), 'fallback'
                if s_asr is None or e_asr is None:
                    raise SystemExit(f"{a['id']}: no alignment")
            found.append({'a': a, 'on': words[owner[s_asr]]['on'], 'end': words[owner[e_asr]]['end'], 'firstWord': words[owner[s_asr]]['text'], 'how': how})
    fallbacks = [f['a']['id'] for f in found if f['how'] != 'inside']
    print('anchors matched inside the phrase:', len(found) - len(fallbacks), 'fallback:', fallbacks, flush=True)
    (TAKE / 'whisper-words.json').write_text(json.dumps(words, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')

    first_on, last_end = {}, {}
    for f in found:
        b = f['a']['beat']
        first_on[b] = min(first_on.get(b, 1e9), f['on'])
        last_end[b] = max(last_end.get(b, 0), f['end'])
    # cut points: midpoint of the gap between one beat's last end and the next beat's first onset
    cuts = []
    for prev, nxt in zip(beats, beats[1:]):
        cuts.append((last_end[prev] + first_on[nxt]) / 2)
    total = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(FULL)],
                                 capture_output=True, text=True, check=True).stdout.strip())
    bounds = [0.0] + cuts + [total]
    SEG.mkdir(parents=True, exist_ok=True)
    report = {'method': 'one continuous Gemini read (take 2), faster-whisper large-v3-turbo word timestamps aligned to the R5 VO with difflib; estimates, not WordBoundary',
              'take': 'take2', 'full': str(FULL.relative_to(ROOT)), 'matchRatio': round(matched / len(joined), 3), 'beats': {}, 'anchors': []}
    for i, b in enumerate(beats):
        start, end = bounds[i], bounds[i + 1]
        seg = SEG / f'{b}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(FULL), '-ss', f'{start:.4f}', '-to', f'{end:.4f}', '-ac', '1', '-ar', str(RATE), '-c:a', 'pcm_s16le', str(seg)], check=True)
        on, off = speech_window(decode(seg))
        report['beats'][b] = {'vo': vo[b], 'tts': tts[b], 'segment': str(seg.relative_to(ROOT)), 'segStart': round(start, 4), 'segEnd': round(end, 4),
                              'speechOnRaw': round(on, 4), 'speechOffRaw': round(off, 4)}
        for f in [x for x in found if x['a']['beat'] == b]:
            report['anchors'].append({'id': f['a']['id'], 'beat': b, 'text': f['a']['text'], 'estOn': f['a']['estOn'], 'estEnd': f['a']['estEnd'],
                                      'onRaw': round(f['on'] - start, 4), 'endRaw': round(f['end'] - start, 4), 'firstWord': f['firstWord']})
        print(f'{b}: segment {start:.3f}-{end:.3f} s, speech {on:.3f}-{off:.3f} s (raw in segment)', flush=True)
    RESULT.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {RESULT} ({len(report["anchors"])} anchors)', flush=True)


if __name__ == '__main__':
    main()
