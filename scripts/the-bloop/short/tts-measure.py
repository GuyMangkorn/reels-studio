"""BLOOP-EP01-SHORT: measure Niwat phrase onsets from the R5 VO (Editor, O-1, 2026-10-30).

Reads the verbatim VO of each beat from script.md (`BLOOP-SCRIPT-R5`, "Full spoken script") and the phrase anchors
(est onset/end G) from storyboards/the-bloop/short/index.md. Synthesizes each beat with the same voice and rate as
scripts/narration.py (th-TH-NiwatNeural, +5%) with Edge `WordBoundary` events, decodes the clip like narration.py and
writes the measured speech window and each anchor's onset/end in clip seconds to scripts/the-bloop/short/tts-measure.json.
Clips go to out/the-bloop/narration-measure/ (local only). Run: python3 -I scripts/the-bloop/short/tts-measure.py
Requires edge-tts (narration.py's install line) and the Remotion ffmpeg from node_modules.
"""
import asyncio, json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts'))
import edge_tts  # noqa: E402
from narration import pcm, THRESHOLD, SAMPLE_RATE  # noqa: E402  (same decode and threshold as the narration build)

VOICE, RATE = 'th-TH-NiwatNeural', '+5%'
SCRIPT = ROOT / 'scripts/the-bloop/short/script.md'
INDEX = ROOT / 'storyboards/the-bloop/short/index.md'
OUT = ROOT / 'out/the-bloop/narration-measure'
RESULT = ROOT / 'scripts/the-bloop/short/tts-measure.json'


def vo_by_beat():
    beats, current, in_vo = {}, None, False
    in_section = False
    for line in SCRIPT.read_text(encoding='utf-8').splitlines():
        if line.startswith('## Full spoken script'):
            in_section = True
        elif line.startswith('## ') and in_section:
            break
        if not in_section:
            continue
        m = re.match(r'### BLOOP-EP01-SHORT-(B\d\d)\b', line)
        if m:
            current = m.group(1)
        if line.strip() == '**VO:**':
            in_vo = True
            continue
        if in_vo and line.startswith('> '):
            beats[current] = line[2:].strip()
            in_vo = False
    return beats


def anchors():
    rows = []
    for line in INDEX.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^\| `(B\d\d-a\d)` \| (.+?) \| (\d+) \| (\d+) \|$', line)
        if m:
            rows.append({'id': m.group(1), 'beat': m.group(1)[:3], 'text': re.sub(r'\s*\(.*?\)', '', m.group(2)).strip(), 'estOn': int(m.group(3)), 'estEnd': int(m.group(4))})
    return rows


def norm(text):
    """Thai text without spaces and punctuation; digits kept. Used only to align anchors to Edge word events."""
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


async def synth(text, path):
    words, audio = [], bytearray()
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary')
    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            audio.extend(chunk['data'])
        elif chunk['type'] == 'WordBoundary':
            words.append({'on': chunk['offset'] / 1e7, 'dur': chunk['duration'] / 1e7, 'text': chunk['text']})
    path.write_bytes(bytes(audio))
    return words


def audible(path):
    samples = pcm(path)
    idx = [i for i, v in enumerate(samples) if abs(v) >= THRESHOLD]
    return idx[0] / SAMPLE_RATE, (idx[-1] + 1) / SAMPLE_RATE


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    vo = vo_by_beat()
    anc = anchors()
    report = {'voice': VOICE, 'rate': RATE, 'beats': {}, 'anchors': []}
    for beat in sorted(vo):
        text = vo[beat]
        path = OUT / f'{beat}.mp3'
        words = await synth(text, path)
        on, off = audible(path)
        word_text = ''.join(norm(w['text']) for w in words)
        base_text = norm(text)
        if word_text != base_text:
            raise SystemExit(f'{beat}: word events do not cover the VO text: {word_text!r} != {base_text!r}')
        # first word offset vs decoded onset (encoder delay): kept for the record
        report['beats'][beat] = {'vo': text, 'speechOnRaw': round(on, 4), 'speechOffRaw': round(off, 4), 'firstWordOffset': round(words[0]['on'], 4), 'words': [{'on': round(w['on'], 4), 'end': round(w['on'] + w['dur'], 4), 'text': w['text']} for w in words]}
        # map each anchor to the word events covering its first and last normalized character
        starts, pos = [], 0
        for w in words:
            starts.append(pos)
            pos += len(norm(w['text']))
        cursor = 0
        for a in [x for x in anc if x['beat'] == beat]:
            target = norm(a['text'])
            at = base_text.find(target, cursor)
            if at < 0:
                raise SystemExit(f"{a['id']}: anchor text not found in {beat} VO: {a['text']}")
            cursor = at + len(target)
            first = max(i for i, s in enumerate(starts) if s <= at)
            last = max(i for i, s in enumerate(starts) if s <= at + len(target) - 1)
            on_w, end_w = words[first], words[last]
            report['anchors'].append({'id': a['id'], 'beat': beat, 'text': a['text'], 'estOn': a['estOn'], 'estEnd': a['estEnd'],
                                      'onRaw': round(on_w['on'], 4), 'endRaw': round(end_w['on'] + end_w['dur'], 4), 'firstWord': on_w['text']})
        print(f"{beat}: speech {on:.3f}-{off:.3f} s raw, first word {words[0]['on']:.3f} s, {len(words)} word events", flush=True)
    RESULT.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {RESULT} ({len(report["anchors"])} anchors)')


if __name__ == '__main__':
    asyncio.run(main())
