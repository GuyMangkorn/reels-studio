"""Build the user storyboard review page from Mark's review rows (docs/mark-storyboard-workflow.md#user-storyboard-review-page).

Usage: python3 -I scripts/storyboard-page/build.py storyboards/<episode>/<variant>/review-rows.json [--out DIR]
Default DIR: out/review-pages/<deliverable>/<revision>/. Writes DIR/index.html from template.html and copies every
preview, question image and element capture into DIR/pv/, downscaled to 540 px wide JPEG (videos copied as is).
DIR/preview.html is a local check copy (open it through a local HTTP server); publish index.html, never preview.html.
Image and video paths in the JSON are repository-relative. Exits 1 on schema errors; prints the publish call.
"""
import json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.html')
REQUIRED = ['deliverable', 'revision', 'title', 'source', 'beats', 'shots']
SHOT_REQUIRED = ['id', 'beat', 'start', 'end', 'title', 'seen']


def errors(d):
    out = [f'missing top-level field "{k}"' for k in REQUIRED if k not in d]
    if out:
        return out
    beats = {b.get('id') for b in d['beats']}
    seen, prev_end = set(), None
    for s in d['shots']:
        sid = s.get('id', '?')
        out += [f'{sid}: missing "{k}"' for k in SHOT_REQUIRED if k not in s]
        if sid in seen:
            out.append(f'{sid}: duplicate shot ID')
        seen.add(sid)
        if s.get('beat') not in beats:
            out.append(f'{sid}: beat "{s.get("beat")}" is not in beats')
        if isinstance(s.get('start'), int) and isinstance(s.get('end'), int):
            if s['end'] <= s['start']:
                out.append(f'{sid}: end {s["end"]} <= start {s["start"]}')
            if prev_end is not None and s['start'] != prev_end:
                out.append(f'{sid}: starts at {s["start"]}, previous shot ends at {prev_end} (gap or overlap)')
            prev_end = s['end']
        else:
            out.append(f'{sid}: start/end must be integer frames')
    for q in d.get('questions', []):
        if not q.get('id') or not q.get('question'):
            out.append(f'question {q.get("id", "?")}: needs "id" and "question"')
    return out


def copy_media(path, dest_dir, used):
    """Copy one repository file into dest_dir once; return its published path."""
    if path in used:
        return used[path]
    src = os.path.join(ROOT, path)
    if not os.path.isfile(src):
        sys.exit(f'missing media file: {path}')
    stem, ext = os.path.splitext(os.path.basename(path))
    video = ext.lower() in ('.mp4', '.webm', '.mov')
    name = stem + (ext if video else '.jpg')
    while 'pv/' + name in used.values():
        name = '_' + name
    dest = os.path.join(dest_dir, name)
    if video:
        shutil.copyfile(src, dest)
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'scale=540:-2', '-q:v', '4', dest], check=True)
    used[path] = 'pv/' + name
    return used[path]


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith('-'):
        sys.exit(__doc__)
    rows_path = args[0]
    with open(rows_path, encoding='utf-8') as f:
        d = json.load(f)
    errs = errors(d)
    if errs:
        print('\n'.join(errs), file=sys.stderr)
        sys.exit(1)
    out = args[args.index('--out') + 1] if '--out' in args else os.path.join(ROOT, 'out', 'review-pages', d['deliverable'], d['revision'])
    pv = os.path.join(out, 'pv')
    shutil.rmtree(pv, ignore_errors=True)
    os.makedirs(pv)
    used = {}  # repository path -> published path
    for s in d['shots']:
        for p in s.get('previews', []):
            p['src'] = copy_media(p['src'], pv, used)
        if s.get('video'):
            s['video'] = copy_media(s['video'], pv, used)
    for q in d.get('questions', []):
        for i in q.get('images', []):
            i['src'] = copy_media(i['src'], pv, used)
    for e in d.get('elements', []):
        e['src'] = copy_media(e['src'], pv, used)

    with open(TEMPLATE, encoding='utf-8') as f:
        html = f.read()
    data = json.dumps(d, ensure_ascii=False).replace('</', '<\\/')
    html = html.replace('__TITLE__', d.get('pageTitle', d['deliverable'] + ' Storyboard')).replace('__DATA__', data)
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    # Local check copy: the Artifact tool adds this skeleton at publish time; preview.html is never published.
    with open(os.path.join(out, 'preview.html'), 'w', encoding='utf-8') as f:
        f.write('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">'
                '<style>body{margin:0}</style></head><body>' + html + '</body></html>')

    files = sorted(used.values())
    print(f'wrote {os.path.relpath(out, ROOT)}/index.html · {len(d["shots"])} shots · {len(files)} media files')
    print('publish: Artifact file_path=<that index.html>, root=<that folder>, files=' + json.dumps(files)
          + ', capabilities={"db": {}} on the first publish; same file_path on republish')


if __name__ == '__main__':
    main()
