"""Build the user storyboard review page from Film's review rows (docs/mark-storyboard-workflow.md#user-storyboard-review-page).

Usage: python3 -I scripts/storyboard-page/build.py storyboards/<episode>/<variant>/review-rows.json [--out DIR]
Default DIR: out/review-pages/<deliverable>/ (one page per deliverable, rebuilt into the same folder for every revision,
draft and final). Writes DIR/index.html from template.html and copies every preview, question image, element capture
and shot clip into DIR/pv/, downscaled to 540 px wide JPEG (videos copied as is).
Shot-by-shot fields per shot (optional): "clips": {"draft": {"src", "in", "out"}} (from scripts/storyboard-page/clips.mjs;
in/out are the shot's seconds inside the clip) and "pinned": true once scripts/pin.mjs pinned it. With top-level
"draftCut": {"src"} (clips.mjs --full --draft) the Draft tab shows that one cut, and each shot's draft clip points into it;
a clip "key" (the shot's scene-cache keys) replaces the file hash, so a re-cut keeps the answers of unchanged shots.
Top-level "finalCut": {"src"} is the delivery render itself (render.mjs --rows writes it): the Final tab shows that one
file whole, with one verdict for the video (key "video@final"). The page has three tabs (storyboard, draft, final);
storyboard and draft verdicts are stored per shot. Per-shot "clips.final" from older rows is accepted and not shown.
Answers survive revisions: build.py stamps each shot, question and clip with a content hash, and the page keeps a saved
answer while its hash is unchanged. A changed item shows its old answer and asks again; an optional "changed" text on a
shot says what changed. The storyboard hash leaves out id, beat, timing, media, "pinned" and "changed", so a retime
after the voice lock keeps the answers.
Look frames (Film, W3, added after the first storyboard pass): top-level "looks": {"<lookId>": {"src", "caption"}} and "look": "<lookId>" on each beat that
uses it; the storyboard tab is text only and shows each location's look frame in its beat header.
DIR/index.html is published as a Claude Artifact (index.html plus every pv/ file, db capability); the page saves verdicts
to the artifact's db under reviews/<key>. Without the artifact tools, serve.py serves the same page and saves to
reviews.json beside the rows. Image and video paths in the JSON are repository-relative. Exits 1 on schema errors;
prints the publish files and the serve fallback.
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
    for key in ('draftCut', 'finalCut'):
        if key in d and not (isinstance(d[key], dict) and d[key].get('src')):
            out.append(f'{key} must be an object with a "src"')
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


def stamp(d):
    """Add the content hashes a verdict is checked against (shots, clips, questions); media paths still repository-relative."""
    for s in d['shots']:
        s['hash'] = digest({k: v for k, v in s.items() if k not in UNHASHED})
        for c in (s.get('clips') or {}).values():
            c['hash'] = c.get('key') or file_digest(c['src'])
    for q in d.get('questions', []):
        q['hash'] = digest({k: q.get(k) for k in ('question', 'detail', 'images')})
    if d.get('finalCut'):
        d['finalCut'].setdefault('label', d['finalCut']['src'])
        d['finalCut']['hash'] = d['finalCut'].get('key') or file_digest(d['finalCut']['src'])


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
    stamp(d)
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
    for key in ('draftCut', 'finalCut'):
        if d.get(key):
            d[key]['src'] = copy_media(d[key]['src'], pv, used)
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
    stale = os.path.join(out, 'preview.html')
    if os.path.exists(stale):
        os.remove(stale)

    files = sorted(used.values())
    print(f'wrote {os.path.relpath(out, ROOT)}/index.html · {len(d["shots"])} shots · {len(files)} media files')
    print('publish: Claude Artifact, files index.html + ' + ' '.join(files) + f' from {os.path.relpath(out, ROOT)}/'
          + '; declare capabilities {"db": {}} after the first publish; republish to the same artifact for every revision')
    serve = f'python3 -I scripts/storyboard-page/serve.py {os.path.relpath(os.path.abspath(rows_path), ROOT)}'
    print(f'fallback (no artifact tools): {serve}' + (f' --out {out}' if '--out' in args else '') + ' [--lan]  (an open page reloads itself)')


if __name__ == '__main__':
    main()
