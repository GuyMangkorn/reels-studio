#!/usr/bin/env python3
"""Asset store: the one home for media kept outside Git (docs/reviews/2026-10-31-asset-store-proposal.md).

Usage:
  python3 -I scripts/store.py put FILE STORE_PATH            # copy into the store (immutable), sidecar + manifest row
  python3 -I scripts/store.py use STORE_PATH PUBLIC_PATH --episode EP [--replace]
                                                             # lock it in src/videos/EP/assets.lock.json, fill the cache copy
  python3 -I scripts/store.py fetch [EP...] [--force]        # fill public/ from lock files, checking sha256
  python3 -I scripts/store.py verify                         # check manifest and lock hashes against the store
  python3 -I scripts/store.py import SRC_DIR PREFIX [--skip GLOB]   # copy a whole folder in verbatim (migration, NAS moves)
  python3 -I scripts/store.py adopt EP --project P [PUBLIC_PATH...] [--source CHECKOUT]
                                                             # lock media already in public/ (paths also from stdin)
  python3 -I scripts/store.py backfill-chat GLOB...          # store images the user attached in past chat transcripts
  python3 -I scripts/store.py archive ID... | --all-worktrees # out/<ID>/ -> projects/<PROJECT>/renders/<ID>/<commit>/
  python3 -I scripts/store.py archive --path DIR --project P --kind K   # takes, previews, samples -> projects/P/K/

$REELS_STORE sets the store root (default ~/ReelsStore). STORE_PATH is relative to it, for example
library/sound/sfx/water/water_pool-splash-small_01.wav or projects/WFOG/renders/... . A sidecar FILE.json or
FILE-without-extension.json is stored next to the file as <name>.json. Stored files are never overwritten: putting
the same content again is a no-op, different content at an existing path is refused. Metadata (.json sidecars, .md
indexes) may be replaced and is not hash-checked by verify. PROJECT is the composition ID's first segment (ALIASES). Exit 0 ok, 1 problems found,
2 bad arguments. Prints one summary line plus any problems.
"""
import argparse, base64, datetime, fnmatch, glob, hashlib, json, os, re, shutil, subprocess, sys

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


def git(*args, cwd=None):
    r = subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ''


GIT = [git('branch', '--show-current'), git('rev-parse', '--short=12', 'HEAD')]
METADATA = ('.json', '.md')  # sidecars and indexes: edited in place (selection notes, INDEX rows), so not hash-checked
MEDIA = {'.mp4', '.mov', '.webm', '.mp3', '.wav', '.m4a', '.ogg', '.flac', '.png', '.jpg', '.jpeg', '.webp', '.gif'}
SKIP_PARTS = ('bundle', 'venv', 'node_modules', 'logs', 'tmp', 'qa')  # scratch under out/ that is never archived
ALIASES = {'ZCPAINT': 'ZCONDO'}  # composition ID prefix -> project folder, only where they differ
_rows = None


def manifest():
    global _rows
    if _rows is None:
        path = os.path.join(STORE, MANIFEST); _rows = {}
        if os.path.exists(path):
            for line in list(open(path, encoding='utf-8'))[1:]:
                r = line.rstrip('\n').split('\t')
                if len(r) >= 3: _rows[r[2]] = dict(zip(HEADER, r))
    return _rows


def record(rel, digest, src, commit=None):
    path = os.path.join(STORE, MANIFEST); new = not os.path.exists(path)
    row = [digest, str(os.path.getsize(os.path.join(STORE, rel))), rel, os.path.abspath(src), GIT[0], commit or GIT[1],
           datetime.datetime.now().isoformat(timespec='seconds')]
    with open(path, 'a', encoding='utf-8') as f:
        if new: f.write('\t'.join(HEADER) + '\n')
        f.write('\t'.join(row) + '\n')
    manifest()[rel] = dict(zip(HEADER, row))


def store_file(src, rel, sidecar=True, commit=None):
    """Copy src to the store path rel. Returns 'stored', 'already' (same bytes there; recorded if the manifest lacked
    it), 'updated' (a metadata file replaced) or 'conflict' (media with other bytes: stored files are immutable)."""
    rel, dest = store_path(rel)
    digest = sha256(src); status = 'stored'
    if os.path.exists(dest):
        if sha256(dest) == digest:
            if rel not in manifest(): record(rel, digest, src, commit)
            return 'already'
        if not rel.endswith(METADATA): return 'conflict'
        status = 'updated'
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(src, dest)
    if sidecar:
        for side in (src + '.json', os.path.splitext(src)[0] + '.json'):
            if os.path.isfile(side) and side != src:
                shutil.copy2(side, os.path.splitext(dest)[0] + '.json'); break
    record(rel, digest, src, commit)
    return status


def put(a):
    rel, _ = store_path(a.store_path)
    if not os.path.isfile(a.file): return fail(f'no such file: {a.file}')
    status = store_file(a.file, rel)
    if status == 'conflict': return fail(f'{rel} exists with other content; stored files are immutable, use a new ID or number')
    print(f'{status} {rel}')
    return 0


def import_dir(a):
    """Copy every file under SRC_DIR to PREFIX/<same relative path>, verbatim (sidecars are ordinary files here)."""
    counts = {'stored': 0, 'already': 0, 'updated': 0, 'conflict': 0}; conflicts = []
    for root, dirs, files in os.walk(a.src_dir):
        dirs[:] = sorted(d for d in dirs if not any(fnmatch.fnmatch(os.path.relpath(os.path.join(root, d), a.src_dir), g) for g in a.skip))
        for name in sorted(files):
            src = os.path.join(root, name); rel = os.path.relpath(src, a.src_dir)
            if name == '.DS_Store' or any(fnmatch.fnmatch(rel, g) for g in a.skip): continue
            status = store_file(src, os.path.join(a.prefix, rel), sidecar=False); counts[status] += 1
            if status == 'conflict': conflicts.append(rel)
    print(f"{a.src_dir} -> {a.prefix}: stored {counts['stored']}, already {counts['already']}, updated {counts['updated']}, "
          f"conflicts {counts['conflict']}")
    for c in conflicts: print(f'  conflict: {c}')
    return 1 if conflicts else 0


def rank(rel):
    """Order store paths holding the same bytes: filed copies before _raw/_unsorted/_legacy, library before projects."""
    return (any(part.startswith('_') for part in rel.split('/')), not rel.startswith('library/'), rel)


def adopt(a):
    """Lock media an episode already has in public/: reuse a stored file with the same bytes, else store it under
    projects/PROJECT/public/<path>. Paths come from the arguments or one per line on stdin."""
    by_hash = {}
    for rel, row in manifest().items(): by_hash.setdefault(row['sha256'], []).append(rel)
    paths = a.paths or [l.strip() for l in sys.stdin if l.strip()]
    path = lock_file(a.episode); lock = read_lock(path); counts = {'reused': 0, 'stored': 0, 'missing': 0}; missing = []
    for p in paths:
        pub = public_path(p if p.startswith('public/') else 'public/' + p.lstrip('/'))
        src = os.path.join(a.source, pub)
        if not os.path.isfile(src): counts['missing'] += 1; missing.append(pub); continue
        digest = sha256(src); same = sorted(by_hash.get(digest, []), key=rank)
        if same: rel = same[0]; counts['reused'] += 1
        else:
            rel = os.path.join('projects', a.project, pub)
            if store_file(src, rel, sidecar=False) == 'conflict': return fail(f'{rel} exists with other content')
            by_hash[digest] = [rel]; counts['stored'] += 1
        lock[pub] = {'store': rel, 'sha256': digest}
    with open(path, 'w', encoding='utf-8') as f: json.dump(dict(sorted(lock.items())), f, indent=2); f.write('\n')
    print(f"{a.episode}: reused {counts['reused']}, stored {counts['stored']}, missing {counts['missing']}")
    for m in missing: print(f'  missing: {m}')
    return 1 if missing else 0


def backfill_chat(a):
    """Store images the user attached in chat (user turns only, not tool screenshots) from Claude Code and Codex
    transcripts as projects/_unsorted/references/user/<date>_<session>_<n>.<ext> with a .json sidecar."""
    found = []
    for pattern in a.transcripts:
        for t in sorted(glob.glob(os.path.expanduser(pattern), recursive=True)):
            found += chat_images(t)
    counts = {'stored': 0, 'already': 0, 'updated': 0, 'conflict': 0}
    tmp = os.path.join(STORE, '.tmp'); os.makedirs(tmp, exist_ok=True)
    for t, stamp, session, harness, ext, data, text in found:
        name = f"{stamp[:10]}_{session[:8]}_{hashlib.sha256(data).hexdigest()[:8]}.{ext}"
        src = os.path.join(tmp, name); open(src, 'wb').write(data)
        json.dump({'date': stamp, 'session': session, 'harness': harness, 'transcript': t, 'user_text': text,
                   'use': 'user-supplied, internal reference only'}, open(src[:-len(ext) - 1] + '.json', 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=2)
        counts[store_file(src, f'projects/_unsorted/references/user/{name}')] += 1
    shutil.rmtree(tmp)
    print(f"chat images {len(found)}: stored {counts['stored']}, already {counts['already']}, conflicts {counts['conflict']}")
    return 1 if counts['conflict'] else 0


def chat_images(t):
    out = []; session = os.path.splitext(os.path.basename(t))[0]
    for line in open(t, encoding='utf-8', errors='replace'):
        if 'image' not in line: continue
        try: d = json.loads(line)
        except ValueError: continue
        if d.get('type') == 'user' and not d.get('isMeta') and isinstance(d.get('message', {}).get('content'), list):
            blocks = d['message']['content']; harness = 'claude-code'; stamp = d.get('timestamp', '')
            text = ' '.join(b.get('text', '') for b in blocks if b.get('type') == 'text').strip()
            for b in blocks:
                src = b.get('source', {}) if b.get('type') == 'image' else {}
                if src.get('type') == 'base64':
                    out.append((t, stamp, d.get('sessionId', session), harness, src['media_type'].split('/')[-1].replace('jpeg', 'jpg'),
                                base64.b64decode(src['data']), text))
        p = d.get('payload', {})
        if d.get('type') == 'response_item' and p.get('type') == 'message' and p.get('role') == 'user':
            text = ' '.join(b.get('text', '') for b in p.get('content', []) if b.get('type') == 'input_text').strip()
            for b in p.get('content', []):
                url = b.get('image_url', '') if b.get('type') == 'input_image' else ''
                if url.startswith('data:image/') and ';base64,' in url:
                    head, data = url.split(';base64,', 1)
                    out.append((t, d.get('timestamp', ''), session, 'codex', head[len('data:image/'):].replace('jpeg', 'jpg'),
                                base64.b64decode(data), text))
    return out


COMPOSITION_ID = re.compile(r'^[A-Z][A-Z0-9]*(-[A-Za-z0-9]+)+$')


def project_of(composition_id):
    head = composition_id.split('-')[0]
    return ALIASES.get(head, head)


def version_of(worktree):
    """<commit>, or <commit>-dirty-<time> when tracked files differ from it, so re-renders never collide."""
    head = git('rev-parse', '--short=12', 'HEAD', cwd=worktree) or 'unknown'
    dirty = git('status', '--porcelain', '--untracked-files=no', cwd=worktree)
    return head + (datetime.datetime.now().strftime('-dirty-%Y%m%d%H%M') if dirty else '')


def media_files(folder):
    for root, dirs, files in os.walk(folder):
        dirs[:] = sorted(d for d in dirs if not any(part in d for part in SKIP_PARTS))
        for name in sorted(files):
            if os.path.splitext(name)[1].lower() in MEDIA: yield os.path.join(root, name)


def dataless(path):
    """True for an iCloud Drive file evicted to the cloud (macOS SF_DATALESS): reading it starts a download."""
    return bool(getattr(os.stat(path), 'st_flags', 0) & 0x40000000)


def stored_hashes():
    return {row['sha256'] for row in manifest().values()}


def archive_folder(folder, prefix, dedupe_prefix, commit, counts):
    """Store media under folder at prefix/<rel>. Bytes already stored under dedupe_prefix are skipped; a name taken
    by other bytes gets the sha prefix appended (<stem>.<sha8><ext>) instead of failing."""
    known = {row['sha256'] for rel, row in manifest().items() if rel.startswith(dedupe_prefix)}
    for src in media_files(folder):
        if dataless(src): counts['cloud'] += 1; continue  # never block on an iCloud download; rerun once it is local
        digest = sha256(src)
        if digest in known: counts['already'] += 1; continue
        rel = os.path.join(prefix, os.path.relpath(src, folder))
        if store_file(src, rel, sidecar=False, commit=commit) == 'conflict':
            stem, ext = os.path.splitext(rel); store_file(src, f'{stem}.{digest[:8]}{ext}', sidecar=False, commit=commit)
        known.add(digest); counts['stored'] += 1


def archive(a):
    counts = {'stored': 0, 'already': 0, 'cloud': 0}; skipped = []; known = None
    if a.path:
        if not (a.project and a.kind): sys.exit('bad arguments: --path needs --project and --kind')
        archive_folder(a.path, f'projects/{a.project}/{a.kind}', f'projects/{a.project}/', GIT[1], counts)
    trees = [l[9:] for l in git('worktree', 'list', '--porcelain').splitlines() if l.startswith('worktree ')] if a.all_worktrees else ['.']
    for tree in trees:
        out = os.path.join(tree, 'out')
        names = a.ids if a.ids or not a.all_worktrees else sorted(os.listdir(out)) if os.path.isdir(out) else []
        version = version_of(tree) if names else ''
        for name in names:
            folder = os.path.join(out, name)
            if not os.path.exists(folder): skipped.append(f'{folder} (missing)'); continue
            if not os.path.isdir(folder) or not COMPOSITION_ID.match(name):
                if any(part in name for part in SKIP_PARTS): continue
                files = list(media_files(folder)) if os.path.isdir(folder) else [folder] if os.path.splitext(name)[1].lower() in MEDIA else []
                cloud = [f for f in files if dataless(f)]  # reading would download them from iCloud; report instead
                known = known if known is not None else stored_hashes()
                new = sum(1 for f in files if f not in cloud and sha256(f) not in known)
                if new or cloud:
                    skipped.append(f'{folder} ({new} of {len(files)} media files not in the store' + (f', {len(cloud)} iCloud-only not checked' if cloud else '')
                                   + '; archive with --path DIR --project P --kind K)')
                continue
            base = f'projects/{project_of(name)}/renders/{name}'
            archive_folder(folder, f'{base}/{version}', base + '/', version.split('-dirty')[0], counts)
    print(f"archived {counts['stored']}, already stored {counts['already']}, not archived {len(skipped)}"
          + (f", iCloud-only skipped {counts['cloud']} (download with `brctl download <folder>`, then rerun)" if counts['cloud'] else ''))
    for s_ in skipped: print(f'  {s_}')
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
        elif not rel.endswith(METADATA) and sha256(path) != row['sha256']: problems.append(f'hash mismatch: {rel}')
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
    p = sub.add_parser('import'); p.add_argument('src_dir'); p.add_argument('prefix')
    p.add_argument('--skip', action='append', default=[], help='glob relative to SRC_DIR; repeatable'); p.set_defaults(fn=import_dir)
    p = sub.add_parser('adopt'); p.add_argument('episode'); p.add_argument('paths', nargs='*')
    p.add_argument('--project', required=True); p.add_argument('--source', default='.', help='checkout whose public/ holds the files')
    p.set_defaults(fn=adopt)
    p = sub.add_parser('archive'); p.add_argument('ids', nargs='*', help='composition IDs: archive out/<ID>/')
    p.add_argument('--path', help='archive media under this folder instead'); p.add_argument('--project'); p.add_argument('--kind')
    p.add_argument('--all-worktrees', action='store_true', help='every out/<ID>/ in every worktree; lists the rest')
    p.set_defaults(fn=archive)
    p = sub.add_parser('backfill-chat'); p.add_argument('transcripts', nargs='+', help='transcript globs (Claude Code / Codex .jsonl)')
    p.set_defaults(fn=backfill_chat)
    a = ap.parse_args()
    try:
        return a.fn(a)
    except SystemExit as e:
        if isinstance(e.code, str): print(e.code, file=sys.stderr); return 2 if e.code.startswith('bad ') else 1
        raise


if __name__ == '__main__':
    sys.exit(main())
