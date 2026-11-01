"""Build the user storyboard review page from Mark's review rows (docs/mark-storyboard-workflow.md#user-storyboard-review-page).

Usage: python3 -I scripts/storyboard-page/build.py storyboards/<episode>/<variant>/review-rows.json [--out DIR]
Default DIR: out/review-pages/<deliverable>/ (one page per deliverable, republished to the same URL for every revision,
draft and final). Writes DIR/index.html from template.html and copies every preview, question image, element capture
and shot clip into DIR/pv/, downscaled to 540 px wide JPEG (videos copied as is).
Shot-by-shot fields per shot (optional): "clips": {"draft"|"final": {"src", "in", "out"}} (360x640 proxies from
scripts/storyboard-page/clips.mjs; in/out are the shot's seconds inside the padded clip) and "pinned": true once
scripts/pin.mjs pinned it. The page has three tabs (storyboard, draft, final); verdicts are stored per shot and tab.
Answers survive revisions: build.py stamps each shot, question and clip with a content hash, and the page keeps a saved
answer while its hash is unchanged. A changed item shows its old answer and asks again; an optional "changed" text on a
shot says what changed. The storyboard hash leaves out id, beat, timing, media, "pinned" and "changed", so a retime
after the voice lock keeps the answers.
Look frames (Film, W2): top-level "looks": {"<lookId>": {"src", "caption"}} and "look": "<lookId>" on each beat that
uses it; the storyboard tab is text only and shows each location's look frame in its beat header.
DIR/preview.html is a local check copy (open it through a local HTTP server); publish index.html, never preview.html.
Image and video paths in the JSON are repository-relative. Exits 1 on schema errors; prints the publish call.
"""
import hashlib, json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.html')
REQUIRED = ['deliverable', 'revision', 'title', 'source', 'beats', 'shots']
SHOT_REQUIRED = ['id', 'beat', 'start', 'end', 'title', 'seen']
CLIP_KINDS = ('draft', 'final')
# Shot fields left out of the storyboard hash: identity, timing, media and review bookkeeping.
UNHASHED = {'id', 'beat', 'start', 'end', 'clips', 'pinned', 'previews', 'previewLabel', 'video', 'changed', 'hash'}


def digest(value):
    return hashlib.sha1(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:12]


def file_digest(path):
    if not os.path.isfile(os.path.join(ROOT, path)):
        sys.exit(f'missing media file: {path}')
    with open(os.path.join(ROOT, path), 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:12]


def errors(d):
    out = [f'missing top-level field "{k}"' for k in REQUIRED if k not in d]
    if out:
        return out
    beats = {b.get('id') for b in d['beats']}
    looks = d.get('looks') or {}
    out += [f'beat {b.get("id")}: look "{b["look"]}" is not in looks' for b in d['beats'] if b.get('look') and b['look'] not in looks]
    out += [f'look {k}: needs "src"' for k, v in looks.items() if not isinstance(v, dict) or not v.get('src')]
    seen, prev_end = set(), None
    untimed = d.get('untimed') is True
    for s in d['shots']:
        sid = s.get('id', '?')
        out += [f'{sid}: missing "{k}"' for k in SHOT_REQUIRED if k not in s and not (untimed and k in ('start', 'end'))]
        if sid in seen:
            out.append(f'{sid}: duplicate shot ID')
        seen.add(sid)
        for kind, c in (s.get('clips') or {}).items():
            if kind not in CLIP_KINDS or not isinstance(c, dict) or not c.get('src'):
                out.append(f'{sid}: clips.{kind} must be one of {", ".join(CLIP_KINDS)} with a "src"')
        if s.get('beat') not in beats:
            out.append(f'{sid}: beat "{s.get("beat")}" is not in beats')
        if untimed:
            pass
        elif isinstance(s.get('start'), int) and isinstance(s.get('end'), int):
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
    out = args[args.index('--out') + 1] if '--out' in args else os.path.join(ROOT, 'out', 'review-pages', d['deliverable'])
    pv = os.path.join(out, 'pv')
    shutil.rmtree(pv, ignore_errors=True)
    os.makedirs(pv)
    used = {}  # repository path -> published path
    for s in d['shots']:
        s['hash'] = digest({k: v for k, v in s.items() if k not in UNHASHED})
        for c in (s.get('clips') or {}).values():
            c['hash'] = file_digest(c['src'])
    for q in d.get('questions', []):
        q['hash'] = digest({k: q.get(k) for k in ('question', 'detail', 'images')})
    for s in d['shots']:
        for p in s.get('previews', []):
            p['src'] = copy_media(p['src'], pv, used)
        if s.get('video'):
            s['video'] = copy_media(s['video'], pv, used)
        for c in (s.get('clips') or {}).values():
            c['src'] = copy_media(c['src'], pv, used)
    for q in d.get('questions', []):
        for i in q.get('images', []):
            i['src'] = copy_media(i['src'], pv, used)
    for v in (d.get('looks') or {}).values():
        v['src'] = copy_media(v['src'], pv, used)
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
