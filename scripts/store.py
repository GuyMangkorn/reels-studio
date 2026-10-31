#!/usr/bin/env python3
"""Asset store: the one home for media kept outside Git (docs/reviews/2026-10-31-asset-store-proposal.md).

Usage:
  python3 -I scripts/store.py put FILE STORE_PATH            # copy into the store (immutable), sidecar + manifest row
  python3 -I scripts/store.py use STORE_PATH PUBLIC_PATH --episode EP [--replace]
                                                             # lock it in src/videos/EP/assets.lock.json, fill the cache copy
  python3 -I scripts/store.py fetch [EP...] [--force]        # fill public/ from lock files, checking sha256
  python3 -I scripts/store.py verify                         # check manifest and lock hashes against the store

$REELS_STORE sets the store root (default ~/ReelsStore). STORE_PATH is relative to it, for example
library/sound/sfx/water/water_pool-splash-small_01.wav or projects/WFOG/renders/... . A sidecar FILE.json or
FILE-without-extension.json is stored next to the file as <name>.json. Stored files are never overwritten: putting
the same content again is a no-op, different content at an existing path is refused. Exit 0 ok, 1 problems found,
2 bad arguments. Prints one summary line plus any problems.
"""
import argparse, datetime, hashlib, json, os, shutil, subprocess, sys

STORE = os.path.expanduser(os.environ.get('REELS_STORE') or '~/ReelsStore')
MANIFEST = 'manifest.tsv'
HEADER = ['sha256', 'bytes', 'path', 'source', 'branch', 'commit', 'filed']


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''): h.update(block)
    return h.hexdigest()


def store_path(rel):
    """Return the absolute path for a store-relative path, or exit 2 if it leaves the store or hits the manifest."""
    norm = os.path.normpath(rel)
    if os.path.isabs(rel) or norm.startswith('..') or norm in ('.', MANIFEST):
        sys.exit(f'bad store path: {rel}')  # main() maps 'bad ...' exits to code 2
    return norm, os.path.join(STORE, norm)


def manifest():
    path = os.path.join(STORE, MANIFEST)
    if not os.path.exists(path): return {}
    rows = [line.rstrip('\n').split('\t') for line in open(path, encoding='utf-8')][1:]
    return {r[2]: dict(zip(HEADER, r)) for r in rows if len(r) >= 3}


def git(*args):
    r = subprocess.run(['git', *args], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ''


def put(a):
    rel, dest = store_path(a.store_path)
    if not os.path.isfile(a.file): return fail(f'no such file: {a.file}')
    digest = sha256(a.file)
    if os.path.exists(dest):
        if sha256(dest) == digest: print(f'already stored: {rel}'); return 0
        return fail(f'{rel} exists with other content; stored files are immutable, use a new ID or number')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(a.file, dest)
    for side in (a.file + '.json', os.path.splitext(a.file)[0] + '.json'):
        if os.path.isfile(side) and side != a.file:
            shutil.copy2(side, os.path.splitext(dest)[0] + '.json'); break
    path = os.path.join(STORE, MANIFEST); new = not os.path.exists(path)
    with open(path, 'a', encoding='utf-8') as f:
        if new: f.write('\t'.join(HEADER) + '\n')
        f.write('\t'.join([digest, str(os.path.getsize(dest)), rel, os.path.abspath(a.file), git('branch', '--show-current'),
                           git('rev-parse', '--short=12', 'HEAD'), datetime.datetime.now().isoformat(timespec='seconds')]) + '\n')
    print(f'stored {rel} ({digest[:12]})')
    return 0


def lock_file(episode):
    folder = os.path.join('src', 'videos', episode)
    if not os.path.isdir(folder): sys.exit(f'no episode folder: {folder}')
    return os.path.join(folder, 'assets.lock.json')


def read_lock(path):
    return json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}


def public_path(rel):
    norm = os.path.normpath(rel)
    if not norm.startswith('public' + os.sep) or '..' in norm.split(os.sep): sys.exit(f'bad public path: {rel}')
    return norm


def use(a):
    rel, src = store_path(a.store_path); pub = public_path(a.public_path); path = lock_file(a.episode)
    if not os.path.isfile(src): return fail(f'not in the store: {rel}')
    lock = read_lock(path); entry = {'store': rel, 'sha256': sha256(src)}
    if pub in lock and lock[pub]['store'] != rel and not a.replace:
        return fail(f'{pub} is locked to {lock[pub]["store"]}; pass --replace to repoint it')
    lock[pub] = entry
    with open(path, 'w', encoding='utf-8') as f: json.dump(dict(sorted(lock.items())), f, indent=2); f.write('\n')
    copy_verified(src, pub, entry['sha256'])
    print(f'{a.episode}: {pub} -> {rel}')
    return 0


def copy_verified(src, dest, digest):
    if sha256(src) != digest: return False
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(src, dest)
    return True


def episodes(names):
    root = os.path.join('src', 'videos')
    return names or sorted(d for d in os.listdir(root) if os.path.exists(os.path.join(root, d, 'assets.lock.json')))


def fetch(a):
    copied = present = 0; problems = []
    for ep in episodes(a.episodes):
        for pub, entry in read_lock(lock_file(ep)).items():
            if os.path.exists(pub):
                if sha256(pub) == entry['sha256']: present += 1; continue
                if not a.force: problems.append(f'{ep}: {pub} differs from the lock (edited cache copy?); --force restores it'); continue
            src = os.path.join(STORE, entry['store'])
            if not os.path.isfile(src): problems.append(f'{ep}: {entry["store"]} missing from the store'); continue
            if not copy_verified(src, pub, entry['sha256']): problems.append(f'{ep}: {entry["store"]} hash mismatch in the store'); continue
            copied += 1
    print(f'fetched {copied}, already present {present}, problems {len(problems)}')
    for p in problems: print(f'  {p}')
    return 1 if problems else 0


def verify(a):
    rows = manifest(); problems = []
    for rel, row in rows.items():
        path = os.path.join(STORE, rel)
        if not os.path.isfile(path): problems.append(f'missing: {rel}')
        elif sha256(path) != row['sha256']: problems.append(f'hash mismatch: {rel}')
    locked = 0
    if os.path.isdir(os.path.join('src', 'videos')):
        for ep in episodes([]):
            for pub, entry in read_lock(lock_file(ep)).items():
                locked += 1; row = rows.get(entry['store'])
                if not row: problems.append(f'{ep}: {entry["store"]} not in the manifest')
                elif row['sha256'] != entry['sha256']: problems.append(f'{ep}: {pub} lock hash differs from the manifest')
    print(f'{len(rows)} stored, {locked} locked, {len(problems)} problems')
    for p in problems: print(f'  {p}')
    return 1 if problems else 0


def fail(msg):
    print(msg, file=sys.stderr)
    return 1


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('put'); p.add_argument('file'); p.add_argument('store_path'); p.set_defaults(fn=put)
    p = sub.add_parser('use'); p.add_argument('store_path'); p.add_argument('public_path')
    p.add_argument('--episode', required=True); p.add_argument('--replace', action='store_true'); p.set_defaults(fn=use)
    p = sub.add_parser('fetch'); p.add_argument('episodes', nargs='*'); p.add_argument('--force', action='store_true'); p.set_defaults(fn=fetch)
    p = sub.add_parser('verify'); p.set_defaults(fn=verify)
    a = ap.parse_args()
    try:
        return a.fn(a)
    except SystemExit as e:
        if isinstance(e.code, str): print(e.code, file=sys.stderr); return 2 if e.code.startswith('bad ') else 1
        raise


if __name__ == '__main__':
    sys.exit(main())
