"""VO-lock inputs for NYOS-EP01-SHORT from the script (Editor, VS-R3, TL02). Stdlib only, no API calls.

Reads the verbatim VO of every beat in short/script.md (`### NYOS-EP01-SHORT-Bxx` then `**VO:**` then one `> ` line) and writes:
  out/lake-nyos/vo/vo-beats.json        {beat: VO text as in the script (ellipses kept)}
  out/lake-nyos/vo/tts-beats.json       {beat: TTS text: '…' and '...' become ','; nothing else changes}
  out/lake-nyos/vo/tts-full.txt         one TTS read: beats joined with one space (the single-read input)
  out/lake-nyos/vo/narration-timeline.json  [{beat, subtitle}] beat order for align-full.py (no slot durations: Mark's)
It also checks every phrase anchor in the anchor table (`| `B01-a1` | phrase | estOn | estEnd |`) is found in its beat's
TTS text in order, the same rule align-full.py applies, and exits 1 if one is missing.

Usage (repo root):
  python3 -I scripts/lake-nyos/vo-lock-inputs.py [--anchors scripts/lake-nyos/short/vo-anchors-vs-r3.md]
"""
import argparse, hashlib, json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / 'scripts/lake-nyos/short/script.md'
OUT = ROOT / 'out/lake-nyos/vo'
BEATS = [f'B{n:02d}' for n in range(14)]


def norm(text):
    # same rule as scripts/narration/align-full.py: keep letters, digits and the Thai block only
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


def read_vo(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    vo, cur = {}, None
    for i, line in enumerate(lines):
        m = re.match(r'^### NYOS-EP01-SHORT-(B\d\d) ', line)
        if m:
            cur = m.group(1)
        elif cur and line.startswith('**VO:**'):
            j = i + 1
            while not lines[j].startswith('> '):
                j += 1
            vo[cur] = lines[j][2:].strip()
            cur = None
    if list(vo) != BEATS:
        raise SystemExit(f'beats found {list(vo)}; expected {BEATS}')
    return vo


def anchor_rows(path):
    rows = []
    for line in path.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^\| `(B\d\d-a\d)` \| ([^|]+?) \| (\d+) \| (\d+) \|(?: [^|]*\|)*\s*$', line)
        if m:
            rows.append((m.group(1), m.group(1)[:3], m.group(2).strip()))
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--anchors', default=str(ROOT / 'scripts/lake-nyos/short/vo-anchors-vs-r3.md'))
    a = ap.parse_args()
    vo = read_vo(SCRIPT)
    tts = {b: vo[b].replace('…', ',').replace('...', ',') for b in BEATS}
    full = ' '.join(tts[b] for b in BEATS)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'vo-beats.json').write_text(json.dumps(vo, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (OUT / 'tts-beats.json').write_text(json.dumps(tts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (OUT / 'tts-full.txt').write_text(full + '\n', encoding='utf-8')
    (OUT / 'narration-timeline.json').write_text(
        json.dumps([{'beat': b, 'subtitle': vo[b]} for b in BEATS], ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    missing, cursor_beat, cursor = [], None, 0
    rows = anchor_rows(Path(a.anchors))
    for aid, b, phrase in rows:
        if b != cursor_beat:
            cursor_beat, cursor = b, 0
        at = norm(tts[b]).find(norm(phrase), cursor)
        if at < 0:
            missing.append(aid)
        else:
            cursor = at + len(norm(phrase))
    print(f'beats {len(BEATS)}, TTS chars {len(full)}, sha256 {hashlib.sha256(full.encode("utf-8")).hexdigest()[:16]}')
    print(f'anchors {len(rows)}, not found in order: {missing or "none"}')
    print(f'ellipses turned to commas: {sum(vo[b].count("…") + vo[b].count("...") for b in BEATS)}')
    return 1 if missing or not rows else 0


if __name__ == '__main__':
    sys.exit(main())
