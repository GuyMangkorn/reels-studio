#!/usr/bin/env python3
"""Copy gitignored render/audio media from every git worktree into one permanent folder.

Default destination: $REELS_RENDER_DIR or ~/Movies/ReelsCreator/renders. Copies (never moves), de-duplicates by
SHA-256 and writes manifest.tsv (with the producing commit; '~' marks a backfilled estimate, '+dirty' uncommitted
changes). A full run also mirrors the shared sound library into <dest>/_sound-library. Scratch (qa frames, bundles, venvs, logs, tmp) is skipped.

  python3 -I scripts/archive-renders.py [--dest DIR] [--dry-run] [--regroup] [--only COMPOSITION_ID]

Layout: <PROJECT>/{renders,audio,previews,painted,...}; see ROUTES.
"""
import argparse, hashlib, os, shutil, subprocess, sys, time

MEDIA = {'.mp4', '.mov', '.mp3', '.wav', '.m4a', '.ogg', '.flac'}
SKIP_PARTS = ('bundle', 'venv', 'node_modules', 'logs', 'tmp', 'qa')
KEEP_DIRS = ('logs/sources',)  # source recordings kept although under a skipped dir
SOUND_LIBRARY = os.environ.get('SOUND_LIBRARY') or os.path.expanduser('~/Documents/ChatGPT/sound-library')


# (prefix of the path under out/ or _public-ignored/, destination prefix); first match wins, unmatched -> _misc/
ROUTES = [
    ('WFOG-EP01-SHORT/', 'WFOG/renders/'), ('editor/world-fog/WFOG-EP01-SHORT/', 'WFOG/audio/'),
    ('handoffs/world-fog/WFOG-EP01-SHORT/', 'WFOG/previews/'), ('gemini-tts/', 'WFOG/audio/gemini-tts/'),
    ('painted/wfog/', 'WFOG/painted/'), ('_public-ignored/public/narration/WFOG', 'WFOG/audio/narration/WFOG'),
    ('ZCPAINT-SHORT', 'ZCONDO/renders/ZCPAINT-SHORT'), ('zcpaint/', 'ZCONDO/audio/'), ('painted/zcpaint/', 'ZCONDO/painted/'),
    ('_public-ignored/public/narration/ZCPAINT', 'ZCONDO/audio/narration/ZCPAINT'),
    ('_public-ignored/public/assets/blender/zc-corridor/', 'ZCONDO/blender/'),
    ('BLOOP-EP01-SHORT/', 'BLOOP/renders/'), ('the-bloop/', 'BLOOP/audio/'), ('_public-ignored/public/audio/bloop/', 'BLOOP/audio/'),
    ('_public-ignored/build/', 'BLOOP/audio/build/'), ('_public-ignored/public/narration/botnoi/', 'BLOOP/audio/botnoi/'),
    ('_public-ignored/public/narration.mp3', 'BLOOP/audio/narration.mp3'),
    ('POOLDEPTH-SHORT', 'POOLDEPTH/renders/POOLDEPTH-SHORT'), ('pooldepth-full/', 'POOLDEPTH/renders/pooldepth-full/'),
    ('_public-ignored/public/pool-depth', 'POOLDEPTH/shots/pool-depth'),
    ('_public-ignored/public/narration/POOLDEPTH', 'POOLDEPTH/audio/narration/POOLDEPTH'),
    ('SHIPWRECK-SHORT/', 'SHIPWRECK/renders/'), ('Short/', 'SHIPWRECK/renders/Short/'), ('painted-spike/', 'SHIPWRECK/painted/'),
    ('painted-boss/', 'SHIPWRECK/painted/'), ('voice-samples/oldest-shipwreck/', 'SHIPWRECK/audio/'),
    ('_public-ignored/public/narration/SHIPWRECK', 'SHIPWRECK/audio/narration/SHIPWRECK'),
    ('lake-nyos/', 'LAKENYOS/'), ('hanako-voice/', 'HANAKO/audio/'),
    ('CATBOX-', 'CATBOX/renders/CATBOX-'), ('catboxes', 'CATBOX/audio/catboxes'), ('haunted', 'HAUNTED/haunted'), ('bedroom-pov', 'HAUNTED/bedroom-pov'),
    ('logs/sources/bloop', 'BLOOP/audio/sources/bloop'), ('_untracked/claude/pool-depth-short/', 'POOLDEPTH/audio/untracked/'),
    ('gemini-tts-test/', 'WFOG/audio/gemini-tts-test/'), ('painted/face/', '_shared/painted-spikes/face/'),
]


def route(rel):
    for pre, new in ROUTES:
        if rel.startswith(pre):
            return new + rel[len(pre):]
    return os.path.join('_misc', rel)


def worktrees(cwd):
    out = subprocess.run(['git', 'worktree', 'list', '--porcelain'], cwd=cwd, capture_output=True, text=True, check=True).stdout
    paths, branch, cur = [], {}, None
    for line in out.splitlines():
        if line.startswith('worktree '):
            cur = line[9:]
            paths.append(cur)
        elif line.startswith('branch ') and cur:
            branch[cur] = line[7:].replace('refs/heads/', '')
    return paths, branch


def library_names():
    names = set()
    for r, ds, fs in os.walk(SOUND_LIBRARY):
        names.update(fs)
    return names


def candidates(w, branch, library):
    """(source path, destination relative path) for ignored media in one worktree, plus untracked public/ media
    that the shared sound library does not already hold."""
    o = os.path.join(w, 'out')
    for r, ds, fs in os.walk(o):
        ds[:] = [d for d in ds if not any(s in d for s in SKIP_PARTS)
                 or any(os.path.relpath(os.path.join(r, d), o).startswith(k) or k.startswith(os.path.relpath(os.path.join(r, d), o))
                        for k in KEEP_DIRS)]
        for f in fs:
            if os.path.splitext(f)[1].lower() in MEDIA:
                p = os.path.join(r, f)
                yield p, os.path.relpath(p, o)
    ign = subprocess.run(['git', 'ls-files', '-o', '-i', '--exclude-standard'], cwd=w, capture_output=True, text=True).stdout
    for rel in ign.splitlines():
        if rel.startswith('out/') or 'node_modules' in rel or os.path.splitext(rel)[1].lower() not in MEDIA:
            continue
        yield os.path.join(w, rel), os.path.join('_public-ignored', rel)
    new = subprocess.run(['git', 'ls-files', '-o', '--exclude-standard', 'public'], cwd=w, capture_output=True, text=True).stdout
    for rel in new.splitlines():
        if os.path.splitext(rel)[1].lower() in MEDIA and os.path.basename(rel) not in library:
            yield os.path.join(w, rel), os.path.join('_untracked', branch, rel)


def git(cwd, *args):
    r = subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ''


def commit_of(w):
    """HEAD of the worktree that produced a file; '+dirty' when tracked files differ from it."""
    head = git(w, 'rev-parse', '--short=12', 'HEAD')
    return head + ('+dirty' if git(w, 'status', '--porcelain', '--untracked-files=no') else '') if head else 'unknown'


def approx_commit(cwd, paths, branch, mtime, src):
    """Backfill for rows archived before the commit column: last commit on the source branch (or the source
    worktree's HEAD) before the file's mtime, prefixed '~'."""
    w = next((p for p in sorted(paths, key=len, reverse=True) if src.startswith(p + os.sep)), None)
    for ref in ([branch] if branch not in ('?', 'detached') else []) + ([git(w, 'rev-parse', 'HEAD')] if w else []):
        c = git(cwd, 'rev-list', '-1', f'--before={mtime}', ref) if ref else ''
        if c:
            return '~' + c[:12]
    return 'unknown'


def backup_library(dest):
    """Mirror the shared sound library into <dest>/_sound-library (new or changed files only; nothing deleted)."""
    out, n = os.path.join(dest, '_sound-library'), 0
    for r, ds, fs in os.walk(SOUND_LIBRARY):
        ds[:] = [d for d in ds if not d.startswith('.')]
        for f in fs:
            src = os.path.join(r, f)
            dst = os.path.join(out, os.path.relpath(src, SOUND_LIBRARY))
            st = os.stat(src)
            if os.path.exists(dst) and os.stat(dst).st_size == st.st_size and int(os.stat(dst).st_mtime) == int(st.st_mtime):
                continue
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
            n += 1
    return n


def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def regroup(dest):
    """Move files of an archive filed by their original path into the ROUTES layout and rewrite manifest.tsv."""
    mp = os.path.join(dest, 'manifest.tsv')
    lines = open(mp).read().splitlines()
    moved = 0
    out = [lines[0]]
    for ln in lines[1:]:
        c = ln.split('\t')
        old = c[5]
        rel = os.path.relpath(old, dest)
        new = os.path.join(dest, route(rel))
        if new != old and os.path.exists(old):
            os.makedirs(os.path.dirname(new), exist_ok=True)
            shutil.move(old, new)
            moved += 1
        c[5] = new if os.path.exists(new) else old
        out.append('\t'.join(c))
    open(mp, 'w').write('\n'.join(out) + '\n')
    for r, ds, fs in os.walk(dest, topdown=False):
        if r != dest and not os.listdir(r):
            os.rmdir(r)
    print(f'regrouped {moved} files')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dest', default=os.environ.get('REELS_RENDER_DIR') or os.path.expanduser('~/Movies/ReelsCreator/renders'))
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--only', help='archive only out/<ID>/ of the current checkout (used by render.mjs)')
    ap.add_argument('--regroup', action='store_true', help='re-file an existing archive into the ROUTES layout')
    a = ap.parse_args()
    if a.regroup:
        return regroup(a.dest)
    paths, branch = worktrees(os.getcwd())
    if a.only:
        paths = [os.getcwd()]
    seen, rows, size, library = {}, [], 0, library_names()
    mp = os.path.join(a.dest, 'manifest.tsv')
    old_rows = []
    if os.path.exists(mp):  # already-archived content (by hash) is skipped; its rows are kept
        old_rows = open(mp).read().splitlines()[1:]
        seen = {r.split('\t')[0]: r.split('\t')[5] for r in old_rows}
        for i, r in enumerate(old_rows):
            c = r.split('\t')
            if len(c) == 6:
                old_rows[i] = r + '\t' + approx_commit(os.getcwd(), paths, c[3], c[2], c[4])
    for w in paths:
        if not os.path.isdir(w):
            continue
        for src, rel in candidates(w, branch.get(w, 'detached'), library):
            if not os.path.isfile(src) or os.path.islink(src):
                continue
            if a.only and not rel.startswith(a.only + os.sep):
                continue
            h = sha(src)
            if h in seen:
                continue
            dest = os.path.join(a.dest, route(rel))
            if os.path.exists(dest):  # same name, different content: keep both
                stem, ext = os.path.splitext(rel)
                dest = os.path.join(a.dest, f'{route(stem)}__{h[:8]}{ext}')
            seen[h] = dest
            st = os.stat(src)
            size += st.st_size
            rows.append((h, st.st_size, time.strftime('%Y-%m-%d %H:%M', time.localtime(st.st_mtime)), branch.get(w, '?'), src, dest, commit_of(w)))
            if not a.dry_run:
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(src, dest)
    print(f'{len(rows)} unique files, {size / 1048576:.0f} MB -> {a.dest}{" (dry run)" if a.dry_run else ""}')
    if not a.dry_run:
        os.makedirs(a.dest, exist_ok=True)
        with open(os.path.join(a.dest, 'manifest.tsv'), 'w') as m:
            m.write('sha256\tbytes\tmtime\tbranch\tsource\tdest\tcommit\n')
            for r in old_rows:
                m.write(r + '\n')
            for r in rows:
                m.write('\t'.join(str(x) for x in r) + '\n')
        if not a.only:
            print(f'sound library: {backup_library(a.dest)} new/changed files -> {a.dest}/_sound-library')


if __name__ == '__main__':
    sys.exit(main())
