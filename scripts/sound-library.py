"""Shared sound library helper (.agents/skills/sound-generation/library.md).

Usage:
  python3 -I scripts/sound-library.py search WORD...            # ID, seconds, loop, description of matching sidecars
  python3 -I scripts/sound-library.py file PROCESSED.wav TYPE/CATEGORY/ID --description TEXT --tags "a b c"
                                   [--loop] [--first-used-by "Reels Creator / EPISODE"] [--picked CANDIDATE.wav]
  python3 -I scripts/sound-library.py index                     # report INDEX.md rows and sidecars that do not match

`file` copies the processed WAV and its `.wav.json` sidecar to TYPE/CATEGORY/ID.{wav,json}, adds the `library`
block, appends its INDEX.md row and records the WAV in the asset store manifest (scripts/store.py). It never overwrites an
existing ID. The library is $REELS_STORE/library/sound (default ~/ReelsStore); SOUND_LIBRARY overrides it.
"""
import argparse, datetime, glob, json, os, re, shutil, subprocess, sys

STORE = os.path.expanduser(os.environ.get('REELS_STORE') or '~/ReelsStore')
LIB = os.environ.get('SOUND_LIBRARY') or os.path.join(STORE, 'library', 'sound')
TYPES = ['sfx', 'ambience', 'music', 'instrument']


def sidecars():
    for path in sorted(glob.glob(os.path.join(LIB, '*', '*', '*.json'))):
        meta = json.load(open(path, encoding='utf-8'))
        if 'library' in meta: yield path, meta


def search(words):
    words = [w.lower() for w in words]
    for path, meta in sidecars():
        lib = meta['library']; text = ' '.join([lib['id'], lib['description'], *lib['tags']]).lower()
        if all(w in text for w in words):
            print(f"{lib['id']:40} {meta.get('seconds', '?'):>7}s loop={'yes' if lib['loop'] else 'no ':3} {lib['description']}")


def row(side, meta):
    lib = meta['library']; rel = os.path.relpath(side, LIB)[:-5] + '.wav'
    return f"| `{lib['id']}` | `{rel}` | {meta.get('seconds', '')} | {'yes' if lib['loop'] else 'no'} | {lib['description']} | {' '.join(lib['tags'])} |"


def index():
    """Report drift between INDEX.md and the sidecars; INDEX.md 'Use' text may be hand-edited, so nothing is rewritten."""
    text = open(os.path.join(LIB, 'INDEX.md'), encoding='utf-8').read()
    listed = set(re.findall(r'^\| `([^`]+)`', text, re.M)); have = {m['library']['id'] for _, m in sidecars()}
    for sid in sorted(have - listed): print(f'not in INDEX.md: {sid}')
    for sid in sorted(listed - have): print(f'no sidecar:      {sid}')
    print(f'{len(have)} sidecars, {len(listed)} index rows, {len(have ^ listed)} mismatches')
    return 1 if have ^ listed else 0


def add_row(side, meta):
    path = os.path.join(LIB, 'INDEX.md'); lines = open(path, encoding='utf-8').read().rstrip('\n').split('\n')
    kind = meta['library']['type']
    if f'## {kind}' not in lines:
        lines += ['', f'## {kind}', '', '| ID | Path | Sec | Loop | Use | Tags |', '|---|---|---|---|---|---|']; end = len(lines)
    else:
        end = lines.index(f'## {kind}') + 1
        while end < len(lines) and not lines[end].startswith('## '): end += 1
        while lines[end - 1] == '': end -= 1
    lines.insert(end, row(side, meta))
    open(path, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')


def file(a):
    kind, category, sid = a.target.split('/')
    if kind not in TYPES: sys.exit(f'type must be one of {TYPES}')
    if not sid.startswith(category + '_'): sys.exit(f'ID must start with "{category}_" (docs: <category>_<descriptor>_<nn>)')
    dest = os.path.join(LIB, kind, category, sid)
    if os.path.exists(dest + '.wav') or os.path.exists(dest + '.json'): sys.exit(f'{sid} already exists; IDs are never overwritten')
    meta = json.load(open(a.wav + '.json', encoding='utf-8'))
    lib = dict(id=sid, type=kind, category=category, tags=a.tags.split(), description=a.description, loop=a.loop,
               generator='audio-studio-mcp / Stable Audio 3 medium', license='Stability AI Community License (see NOTICE.md)',
               created=datetime.date.today().isoformat(), listened='no')
    if a.first_used_by: lib['first_used_by'] = a.first_used_by
    if a.picked: lib['selection'] = {'picked': a.picked}
    meta['library'] = lib
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copyfile(a.wav, dest + '.wav')
    json.dump(meta, open(dest + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    add_row(dest + '.json', meta)
    # Record the master in the asset store manifest (a no-op copy when LIB is the store's library/sound).
    put = subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'store.py'), 'put',
                          dest + '.wav', f'library/sound/{kind}/{category}/{sid}.wav'], capture_output=True, text=True)
    if put.returncode: sys.exit(f'filed, but store.py put failed: {put.stderr.strip()}')
    print(f'filed {kind}/{category}/{sid}.wav and added its INDEX.md row')


def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('search'); s.add_argument('words', nargs='+')
    sub.add_parser('index')
    f = sub.add_parser('file'); f.add_argument('wav'); f.add_argument('target')
    f.add_argument('--description', required=True); f.add_argument('--tags', required=True); f.add_argument('--loop', action='store_true')
    f.add_argument('--first-used-by'); f.add_argument('--picked')
    a = ap.parse_args()
    sys.exit({'search': lambda: search(a.words), 'index': index, 'file': lambda: file(a)}[a.cmd]())


if __name__ == '__main__':
    main()
