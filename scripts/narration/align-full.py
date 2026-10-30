"""Align one continuous TTS read (e.g. a Gemini take, which has no word timings) to the script and cut it into beats.

1. Transcribes the full WAV with faster-whisper (large-v3-turbo, Thai, word timestamps; estimates, about +-0.1-0.2 s).
2. Aligns the joined per-beat TTS text (`--tts-beats`, {beat: text}) to the Whisper characters with difflib.
3. Maps every phrase anchor in the storyboard index (rows "| `B01-a1` | phrase | estOn | estEnd |") to its first and
   last matched Whisper word inside the phrase.
4. Cuts the file at the midpoint between beats into `--segments/<BEAT>.wav` and writes a measure JSON (schema of
   tts-measure.json, times relative to each segment) for `plan-timing.py --measure`. Refine the cuts with cut-gaps.py.

Run with the Whisper venv of the main checkout (from the repo root), for example:
  "<main>/.venv-whisper/bin/python" -I scripts/narration/align-full.py --full out/EP/vo/FULL.wav \
      --tts-beats out/EP/vo/tts-beats.json --timeline scripts/EP/short/narration-timeline.json \
      --index storyboards/EP/short/index.md --segments out/EP/vo/segments --out scripts/EP/short/measure-take1.json
First used for BLOOP-EP01-SHORT (2026-10-30).
"""
import array, difflib, json, re, subprocess, unicodedata
from pathlib import Path

INDEX = FULL = SEG = TIMELINE = RESULT = TTS_BEATS = None
RATE, THRESHOLD = 48000, 300


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


def anchors():
    rows = []
    for line in INDEX.read_text(encoding='utf-8').splitlines():
        # | `B01-a1` | phrase | onset | end | ...extra columns are ignored
        m = re.match(r'^\| `(B\d\d-a\d)` \| ([^|]+?) \| (\d+) \| (\d+) \|(?: [^|]*\|)*\s*$', line)
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
    global INDEX, FULL, SEG, TIMELINE, RESULT, TTS_BEATS
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--full', required=True, help='the continuous TTS read (WAV)')
    ap.add_argument('--tts-beats', required=True, help='JSON {beat: TTS text} as sent to the TTS')
    ap.add_argument('--timeline', required=True, help='narration-timeline JSON (beat order and subtitles)')
    ap.add_argument('--index', required=True, help='storyboard index.md with the phrase-anchor table')
    ap.add_argument('--segments', required=True, help='output folder for <BEAT>.wav')
    ap.add_argument('--out', required=True, help='output measure JSON')
    args = ap.parse_args()
    FULL, SEG, TIMELINE, INDEX, RESULT, TTS_BEATS = (Path(x) for x in (args.full, args.segments, args.timeline, args.index, args.out, args.tts_beats))
    from faster_whisper import WhisperModel
    slots = json.loads(TIMELINE.read_text(encoding='utf-8'))
    beats = [s['beat'] for s in slots]
    vo = {s['beat']: s['subtitle'] for s in slots}
    tts = json.loads(TTS_BEATS.read_text(encoding='utf-8'))
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
    SEG.mkdir(parents=True, exist_ok=True)
    (SEG / 'whisper-words.json').write_text(json.dumps(words, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')

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
    report = {'method': 'one continuous TTS read, faster-whisper large-v3-turbo word timestamps aligned to the script with difflib; estimates, not WordBoundary',
              'full': str(FULL), 'matchRatio': round(matched / len(joined), 3), 'beats': {}, 'anchors': []}
    for i, b in enumerate(beats):
        start, end = bounds[i], bounds[i + 1]
        seg = SEG / f'{b}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(FULL), '-ss', f'{start:.4f}', '-to', f'{end:.4f}', '-ac', '1', '-ar', str(RATE), '-c:a', 'pcm_s16le', str(seg)], check=True)
        on, off = speech_window(decode(seg))
        report['beats'][b] = {'vo': vo[b], 'tts': tts[b], 'segment': str(seg), 'segStart': round(start, 4), 'segEnd': round(end, 4),
                              'speechOnRaw': round(on, 4), 'speechOffRaw': round(off, 4)}
        for f in [x for x in found if x['a']['beat'] == b]:
            report['anchors'].append({'id': f['a']['id'], 'beat': b, 'text': f['a']['text'], 'estOn': f['a']['estOn'], 'estEnd': f['a']['estEnd'],
                                      'onRaw': round(f['on'] - start, 4), 'endRaw': round(f['end'] - start, 4), 'firstWord': f['firstWord']})
        print(f'{b}: segment {start:.3f}-{end:.3f} s, speech {on:.3f}-{off:.3f} s (raw in segment)', flush=True)
    RESULT.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {RESULT} ({len(report["anchors"])} anchors)', flush=True)


if __name__ == '__main__':
    main()
