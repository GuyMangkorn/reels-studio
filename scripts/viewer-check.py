"""Viewer-check bundle: everything the first-time-viewer critic needs in one text file plus a few sheets.

Usage:
  python3 -I scripts/viewer-check.py bundle <review-rows.json> --stage draft|final|look [--shots ID,ID] [--recheck]
  python3 -I scripts/viewer-check.py record <review-rows.json> --stage draft|final|look <verdicts.json>

bundle: pulls start/middle/end frames of each shot from the stage's clip (looks: the look frame itself), hashes them,
and skips shots whose frames are unchanged since a recorded pass (--recheck checks them anyway). It tiles the rest
four shots per sheet (one row per shot, 270 px tiles, scripts/qa-sheet.sh) and writes bundle.md with the shot rows,
casting lines from the scene sheets, the named poses' descriptions and docs/user-taste.md, so the critic reads
bundle.md and the sheets and needs no other file. Output: out/<deliverable>/viewer-check/<stage>/.
record: stores the critic's verdicts.json ({"<id>": "pass"|"fail", ...}) with the frame hashes in
viewer-check-<stage>.json next to review-rows.json (in Git), so the next bundle carries the passes over.
Rule: docs/sequence-workflow.md#viewer-check.
"""
import argparse, hashlib, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PER_SHEET = 4


def pose_descriptions():
    out = {}
    src = open(os.path.join(ROOT, 'src/painted/kit/poses.ts'), encoding='utf-8').read()
    for pid, desc in re.findall(r"\b(P[0-3]\d): '((?:[^'\\]|\\.)*)'", src):
        out.setdefault(pid, desc)
    more = open(os.path.join(ROOT, 'src/painted/kit/poses-more.ts'), encoding='utf-8').read()
    for pid, name, desc in re.findall(r"\b(P[3-9]\d): \{\s*name: '([^']*)'.*?description: '((?:[^'\\]|\\.)*)'", more, re.S):
        out[pid] = f'{name}: {desc}'
    return out


def scene_sections(rows_dir):
    """Shot id -> its scene-sheet section text (the '## <id>' heading up to the next '## ')."""
    sec = {}
    for f in sorted(os.listdir(rows_dir)):
        if not f.endswith('.md') or f.startswith(('viewer-check', 'user-review')):
            continue
        text = open(os.path.join(rows_dir, f), encoding='utf-8').read()
        for m in re.finditer(r'^## (\S+)[^\n]*\n(.*?)(?=^## |\Z)', text, re.M | re.S):
            sec.setdefault(m.group(1).strip('`'), m.group(2))
    return sec


def casting(section):
    lines = [l for l in section.splitlines() if re.match(r'(Direction|Staging):', l)]
    return ' '.join(lines)[:900]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'failed: {" ".join(cmd[:4])}...\n{r.stderr[-600:]}')


def grab(src, t, dest):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(t, 0):.3f}', '-i', src, '-frames:v', '1', '-update', '1', dest])


def sha(paths):
    h = hashlib.sha256()
    for p in paths:
        h.update(open(p, 'rb').read())
    return h.hexdigest()[:16]


def items(rows, stage, only):
    """(id, title, seen, frame sources) per shot or look in the stage."""
    if stage == 'look':
        for lid, look in (rows.get('looks') or {}).items():
            if not only or lid in only:
                yield lid, lid, look.get('caption', ''), [('img', look['src'])]
        return
    for s in rows['shots']:
        clip = (s.get('clips') or {}).get(stage)
        if not clip or (only and s['id'] not in only):
            continue
        a, b = clip['in'], clip['out']
        ts = [a + 0.1, (a + b) / 2, b - 0.1]
        yield s['id'], s.get('title', ''), s.get('seen', ''), [('clip', clip['src'], t) for t in ts]


def bundle(args):
    rows_path = os.path.abspath(args.rows)
    rows = json.load(open(rows_path, encoding='utf-8'))
    rows_dir = os.path.dirname(rows_path)
    state_path = os.path.join(rows_dir, f'viewer-check-{args.stage}.json')
    state = json.load(open(state_path)) if os.path.exists(state_path) else {}
    out = os.path.join(ROOT, 'out', rows['deliverable'], 'viewer-check', args.stage)
    os.makedirs(os.path.join(out, 'frames'), exist_ok=True)
    for f in os.listdir(out):
        if f.startswith('sheet-') or f == 'verdicts.json':
            os.remove(os.path.join(out, f))
    only = set(args.shots.split(',')) if args.shots else None
    sections, poses = scene_sections(rows_dir), pose_descriptions()

    todo, carried, hashes = [], [], {}
    for sid, title, seen, srcs in items(rows, args.stage, only):
        frames = []
        for i, src in enumerate(srcs):
            path = os.path.join(ROOT, src[1])
            if not os.path.exists(path):
                sys.exit(f'missing {src[1]} for {sid}: render the {args.stage} clip first')
            dest = os.path.join(out, 'frames', f'{sid}_{i}.png')
            if src[0] == 'clip':
                grab(path, src[2], dest)
            else:
                run(['ffmpeg', '-v', 'error', '-y', '-i', path, '-frames:v', '1', '-update', '1', dest])
            frames.append(dest)
        hashes[sid] = sha(frames)
        prev = state.get(sid, {})
        if not args.recheck and prev.get('hash') == hashes[sid] and prev.get('result') == 'pass':
            carried.append(sid)
        else:
            todo.append((sid, title, seen, frames))

    cols = 1 if args.stage == 'look' else 3
    per = PER_SHEET * (3 if args.stage == 'look' else 1)
    sheets = []
    for n in range(0, len(todo), per):
        group = todo[n:n + per]
        sheet = os.path.join(out, f'sheet-{n // per + 1:02d}.png')
        tiles = [f for g in group for f in g[3]]
        run(['sh', os.path.join(ROOT, 'scripts/qa-sheet.sh'), sheet, '--cols', str(cols if cols > 1 else min(len(tiles), 4)), *tiles])
        sheets.append((sheet, [g[0] for g in group]))

    rel = lambda p: os.path.relpath(p, ROOT)
    md = [f"# Viewer check bundle: {rows['deliverable']} {args.stage} ({rows.get('revision', '')})", '',
          'You are a first-time viewer. You did not paint these pictures. Read this file and each sheet below '
          'once with the Read tool; open nothing else unless a call truly cannot be made from the sheets, and then at most two extra frames.', '',
          '## Return', '',
          f'Write `{rel(os.path.join(out, "verdicts.json"))}` as `{{"<id>": "pass" | "fail"}}` for every shot listed under Shots, '
          f'and `{rel(os.path.join(rows_dir, f"viewer-check-{args.stage}-<round>.md"))}` with one table row per shot: '
          'reads as (one line, without the narration) | pass/fail against "what is seen" | each wrong pose, arm, hand or face against the poses below | '
          'each user-taste entry it breaks, by ID. Reply with the table only.', '']
    if carried:
        md += [f'Carried over (frames unchanged since a recorded pass, not shown): {", ".join(carried)}.', '']
    md += ['## Sheets', '']
    for sheet, ids in sheets:
        layout = 'one row per shot: start, middle, end' if cols == 3 else 'one tile per look, left to right, top to bottom'
        md.append(f'- `{rel(sheet)}` ({layout}): ' + ', '.join(f'{i + 1}. {sid}' for i, sid in enumerate(ids)))
    md += ['', '## Shots', '']
    used = set()
    for sid, title, seen, _ in todo:
        cast = casting(sections.get(sid, ''))
        used |= set(re.findall(r'\bP[0-4]\d\b', cast))
        md += [f'### {sid} {title}', f'- What is seen: {seen}'] + ([f'- Direction: {cast}'] if cast else []) + ['']
    if used:
        md += ['## Poses named above', ''] + [f'- {p}: {poses.get(p, "(no description found)")}' for p in sorted(used)] + ['']
    md += ['## User taste', '', open(os.path.join(ROOT, 'docs/user-taste.md'), encoding='utf-8').read()]
    open(os.path.join(out, 'bundle.md'), 'w', encoding='utf-8').write('\n'.join(md))
    json.dump(hashes, open(os.path.join(out, 'hashes.json'), 'w'), indent=1)
    print(f'{rel(os.path.join(out, "bundle.md"))}: {len(todo)} to check, {len(carried)} carried over, {len(sheets)} sheets')


def record(args):
    rows_path = os.path.abspath(args.rows)
    rows = json.load(open(rows_path, encoding='utf-8'))
    out = os.path.join(ROOT, 'out', rows['deliverable'], 'viewer-check', args.stage)
    hashes = json.load(open(os.path.join(out, 'hashes.json')))
    verdicts = json.load(open(args.verdicts))
    state_path = os.path.join(os.path.dirname(rows_path), f'viewer-check-{args.stage}.json')
    state = json.load(open(state_path)) if os.path.exists(state_path) else {}
    for sid, result in verdicts.items():
        if result not in ('pass', 'fail') or sid not in hashes:
            sys.exit(f'bad verdict {sid}: {result} (not in the last bundle or not pass/fail)')
        state[sid] = {'hash': hashes[sid], 'result': result}
    json.dump(dict(sorted(state.items())), open(state_path, 'w'), indent=1)
    print(f'{os.path.relpath(state_path, ROOT)}: {sum(v == "pass" for v in verdicts.values())} pass, '
          f'{sum(v == "fail" for v in verdicts.values())} fail recorded')


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)
    b = sub.add_parser('bundle'); b.add_argument('rows'); b.add_argument('--stage', required=True, choices=['draft', 'final', 'look'])
    b.add_argument('--shots'); b.add_argument('--recheck', action='store_true')
    r = sub.add_parser('record'); r.add_argument('rows'); r.add_argument('--stage', required=True, choices=['draft', 'final', 'look'])
    r.add_argument('verdicts')
    args = p.parse_args()
    (bundle if args.cmd == 'bundle' else record)(args)


if __name__ == '__main__':
    main()
