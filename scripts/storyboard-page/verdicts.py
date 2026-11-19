"""Read the user's storyboard-page verdicts from reviews.json, checked against the current rows (.agents/skills/review-page/SKILL.md).

Usage: python3 -I scripts/storyboard-page/verdicts.py storyboards/<episode>/<variant>/review-rows.json [--json] [--pull FILE]
       --pull FILE         first copy the artifact db's reviews collection into reviews.json: FILE holds the docs that
                           db_list returned (JSON lines or a JSON array of {"id", "data", "version"}; ids with or
                           without the "reviews/" prefix)
       ... --pass-open <board|draft> --round YYYY-MM-DD
       ... --drafts-passed     exit 0 when every shot has a draft clip with a current "ok", else list the rest, exit 1
A verdict is current when its hash matches what build.py stamps now (the shot's storyboard text, the clip file or the
question); otherwise it is stale: the item changed after the user answered and is asked again. Shots are answered on the
storyboard and draft tabs; the Final tab has one answer for the whole delivery file, key "video@final".
--pass-open records "ok" with the note "default (round <date>)" for every shot on that tab that has no current answer
(the review-round rule, after the user confirms). serve.py may keep running; it re-reads the file on every save.
With --pull, --pass-open also prints the db_write ops (with ifVersion for docs that exist) that record the same passes
in the artifact db.
"""
import importlib.util, json, os, sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('sb_build', os.path.join(HERE, 'build.py'))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)
spec = importlib.util.spec_from_file_location('sb_serve', os.path.join(HERE, 'serve.py'))
serve = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serve)
STAGES = ('board', 'draft')
FINAL_KEY = 'video@final'


def expected(d):
    """Map every answerable key to the hash a current verdict carries."""
    want = {}
    for s in d['shots']:
        want[s['id'] + '@board'] = s['hash']
        if (s.get('clips') or {}).get('draft'):
            want[s['id'] + '@draft'] = s['clips']['draft']['hash']
    if d.get('finalCut'):
        want[FINAL_KEY] = d['finalCut']['hash']
    for q in d.get('questions', []):
        want[q['id']] = q['hash']
    return want


def read_pull(path):
    """Docs from a saved db_list result -> {key: (data, version)}."""
    with open(path, encoding='utf-8') as f:
        text = f.read().strip()
    docs = json.loads(text) if text.startswith('[') else [json.loads(x) for x in text.splitlines() if x.strip().startswith('{')]
    out = {}
    for doc in docs:
        key = doc['id'].split('/')[-1]
        if doc.get('data'):
            out[key] = ({k: v for k, v in doc['data'].items() if k in serve.FIELDS}, doc.get('version'))
    return out


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith('-'):
        sys.exit(__doc__)
    rows_path = args[0]
    with open(rows_path, encoding='utf-8') as f:
        d = json.load(f)
    build.stamp(d)
    want = expected(d)
    path = os.path.join(os.path.dirname(os.path.abspath(rows_path)), 'reviews.json')
    pulled = read_pull(args[args.index('--pull') + 1]) if '--pull' in args else {}
    if pulled:
        with serve.LOCK:
            reviews = serve.read_reviews(path)
            reviews.update({k: data for k, (data, _) in pulled.items()})
            serve.write_reviews(path, reviews)
    reviews = serve.read_reviews(path)
    current = {k: v for k, v in reviews.items() if v.get('hash') and v.get('hash') == want.get(k)}

    if '--drafts-passed' in args:
        open_ = [s['id'] for s in d['shots'] if (current.get(s['id'] + '@draft') or {}).get('status') != 'ok']
        if open_:
            sys.exit(f'drafts not passed: {len(open_)} of {len(d["shots"])} ({" ".join(open_[:20])}{" ..." if len(open_) > 20 else ""})')
        print(f'drafts passed: {len(d["shots"])} of {len(d["shots"])}')
        return

    if '--pass-open' in args:
        stage = args[args.index('--pass-open') + 1]
        day = args[args.index('--round') + 1] if '--round' in args else sys.exit('--pass-open needs --round YYYY-MM-DD')
        if stage not in STAGES:
            sys.exit(f'stage must be one of {", ".join(STAGES)}')
        now = datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
        added = []
        with serve.LOCK:
            reviews = serve.read_reviews(path)
            for s in d['shots']:
                key = f'{s["id"]}@{stage}'
                if key not in want or (current.get(key) or {}).get('status'):
                    continue
                reviews[key] = {'shot': s['id'], 'stage': stage, 'status': 'ok', 'note': f'default (round {day})', 'rev': d['revision'],
                                'hash': want[key], 'clip': '' if stage == 'board' else want[key], 'updatedAt': now}
                added.append(s['id'])
            serve.write_reviews(path, reviews)
        if '--pull' in args and added:
            ops = []
            for sid in added:
                key = f'{sid}@{stage}'
                op = {'op': 'set', 'path': 'reviews/' + key, 'data': reviews[key]}
                if pulled.get(key, (None, None))[1]:
                    op['ifVersion'] = pulled[key][1]
                ops.append(op)
            print('db_write ops: ' + json.dumps(ops, ensure_ascii=False))
        print(f'{stage}: recorded ok for {len(added)} open shots' + (': ' + ' '.join(added) if added else ''))
        return

    if '--json' in args:
        out = {k: {**v, 'current': k in current} for k, v in reviews.items()}
        print(json.dumps({'deliverable': d['deliverable'], 'revision': d['revision'], 'reviews': out}, ensure_ascii=False, indent=1))
        return

    print(f'{d["deliverable"]} {d["revision"]} · {os.path.relpath(path)}')
    for stage in STAGES:
        keys = [f'{s["id"]}@{stage}' for s in d['shots'] if f'{s["id"]}@{stage}' in want]
        if not keys:
            continue
        st = [(current.get(k) or {}).get('status') for k in keys]
        open_ = [k.split('@')[0] for k, x in zip(keys, st) if not x]
        print(f'{stage}: ok {st.count("ok")}/{len(keys)} · change {st.count("change")} · open {len(open_)}'
              + (f' ({" ".join(open_)})' if open_ else ''))
    if FINAL_KEY in want:
        print(f'final: {(current.get(FINAL_KEY) or {}).get("status") or "open"} · {d["finalCut"]["label"]}')
    for k in sorted(reviews):
        v = reviews[k]
        if not (v.get('status') or v.get('note')):
            continue
        tag = 'current' if k in current else 'stale' if k in want else 'orphan'
        note = ' '.join((v.get('note') or '').split())
        print(f'{k}\t{v.get("status") or "-"}\t{tag}\t{v.get("rev", "")}\t{note}')


if __name__ == '__main__':
    main()
