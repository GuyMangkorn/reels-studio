#!/usr/bin/env python3
"""Plan the one-time move of $REELS_STORE/projects/ into the project layout (README.md#project-layout).

Usage: python3 -I scripts/store-layout-plan.py > out/store-layout-plan.tsv
       python3 -I scripts/store.py mv --plan out/store-layout-plan.tsv [--apply]

Writes one OLD<TAB>NEW line per file whose path breaks the layout, and prints a summary per old folder on stderr.
Owner ID: a known composition ID in the path, then the folder's episode (EDU-EP03, ep03, EP05), then the series'
single deliverable, else _series. The old folder name is kept as the label so nothing loses its context.
"""
import collections, importlib.util, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('store', os.path.join(HERE, 'store.py'))
store = importlib.util.module_from_spec(spec); spec.loader.exec_module(store)

WHOLE = {  # old prefix -> new prefix, moved as is
    'projects/library/pose-sheet': 'projects/KIT/pose-sheets/library-pose-sheet',
    'projects/workflow': 'projects/_shared/workflow',
    'projects/HAUNTED': 'projects/_legacy/HAUNTED',
    'projects/ZOMBIE-7ELEVEN': 'projects/_unsorted/ZOMBIE-7ELEVEN',
    'projects/POOLDEPTH/blender': 'projects/_legacy/POOLDEPTH/blender',
    'projects/POOLDEPTH/shots': 'projects/_legacy/POOLDEPTH/shots',
    'projects/POOLDEPTH/renders/pooldepth-full': 'projects/_legacy/POOLDEPTH/renders/pooldepth-full',
    'projects/ZCONDO/blender': 'projects/_legacy/ZCONDO/blender',
}
TOP = {'EDU-EP03': ('EDU', 'EDU-EP03-SHORT'), 'EDU-EP03-SHORT': ('EDU', 'EDU-EP03-SHORT'), 'EDU-EP05': ('EDU', 'EDU-EP05-SHORT'),
       'WDG-EP01-SHORT': ('WDG', 'WDG-EP01-SHORT'), 'alvarenga': ('ALVARENGA', None)}
KIND = {'clips': 'review', 'review': 'review', 'review-page': 'review', 'samples': 'review', 'stills-e2': 'review',
        'ep05-r111': 'review', 'previews': 'previews', 'look-frames': 'previews', 'painted': 'previews', 'spike': 'previews',
        'w52-element-stills': 'previews', 'audio': 'audio', 'narration': 'audio', 'narr-samples': 'audio',
        'narration-samples': 'audio', 'vo': 'audio', 'voice-sample': 'audio', 'covers': 'covers', 'references': 'references',
        'reference': 'references'}
DEFAULT = {'HANAKO': 'HANAKO-SHORT', 'BLOOP': 'BLOOP-EP01-SHORT', 'WFOG': 'WFOG-EP01-SHORT', 'SHIPWRECK': 'SHIPWRECK-SHORT',
           'KSO': 'KSO-EP01-SHORT', 'ZCONDO2': 'ZCONDO2-SHORT-TH', 'WDG': 'WDG-EP01-SHORT'}


def known_ids():
    ids = set(DEFAULT.values())
    out = subprocess.run(['grep', '-rhoE', "id: '[A-Z][A-Za-z0-9-]*'", os.path.join(HERE, '..', 'src', 'videos')],
                         capture_output=True, text=True).stdout
    ids |= {m[5:-1] for m in out.split()} | {l[5:-1] for l in out.splitlines()}
    for rel in store.manifest():
        p = rel.split('/')
        if len(p) > 4 and p[0] == 'projects' and p[2] in ('renders', 'reference') and store.COMPOSITION_ID.match(p[3]): ids.add(p[3])
    return sorted((i for i in ids if store.COMPOSITION_ID.match(i)), key=len, reverse=True)


def owner(series, hint, rest, ids):
    for i in ids:
        if store.project_of(i) == series and re.search(rf'(^|[^A-Za-z0-9]){re.escape(i)}([^A-Za-z0-9]|$)', rest): return i
    if hint: return hint
    m = re.search(r'(?i)(?:^|[^a-z])ep[-_]?0?(\d{1,2})(?:[^0-9]|$)', rest)
    if m and f'{series}-EP{int(m[1]):02d}-SHORT' in ids: return f'{series}-EP{int(m[1]):02d}-SHORT'
    return DEFAULT.get(series, '_series')


def plan_for(rel, ids):
    for old, new in WHOLE.items():
        if rel == old or rel.startswith(old + '/'): return new + rel[len(old):]
    parts = rel.split('/'); top = parts[1]
    series, hint = TOP.get(top, (top, None))
    rest = parts[2:]
    if any(store.scratch_segment(s) for s in rest[:-1]) or (rest and store.scratch_segment(rest[0])):
        return '/'.join(['projects', '_legacy', top] + rest)
    folder = rest[0] if len(rest) > 1 else ''
    if folder == 'renders':  # loose files or non-ID folders directly under renders/
        who = owner(series, hint, '/'.join(rest), ids)
        if os.path.splitext(rel)[1].lower() in ('.wav', '.mp3', '.m4a', '.ogg', '.flac'):
            return '/'.join(['projects', series, 'audio', who] + rest[1:])
        return '/'.join(['projects', series, 'renders', who, '_loose'] + rest[1:])
    kind = KIND.get(folder) or ('review' if re.match(r'w\d+-', folder) else None)
    if not kind: return None
    label = rest[1:] if folder == kind else rest
    who = owner(series, hint, '/'.join(rest), ids)
    return '/'.join(['projects', series, kind, who] + label)


def main():
    ids = known_ids(); root = os.path.join(store.STORE, 'projects'); lines = []; summary = collections.Counter(); left = []
    for dirpath, _dirs, files in os.walk(root):
        for name in files:
            if name == '.DS_Store': continue
            rel = os.path.relpath(os.path.join(dirpath, name), store.STORE)
            if not store.layout_error(rel): continue
            new = plan_for(rel, ids)
            if not new or store.layout_error(new): left.append(rel); continue
            lines.append(f'{rel}\t{new}')
            o, n = rel.split('/'), new.split('/')
            summary['/'.join(o[1:3]) + ' -> ' + '/'.join(n[1:4]) + ('/' + n[4] if len(n) > 5 else '')] += 1
    print('\n'.join(sorted(lines)))
    for k, v in sorted(summary.items()): print(f'{v:6d}  {k}', file=sys.stderr)
    print(f'{len(lines)} files planned, {len(left)} not placed', file=sys.stderr)
    for l in left[:20]: print(f'  not placed: {l}', file=sys.stderr)
    return 1 if left else 0


if __name__ == '__main__':
    sys.exit(main())
