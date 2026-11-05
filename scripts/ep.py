#!/usr/bin/env python3
"""Episode record edits without one-off Python: task.md steps, Markdown table cells, review-rows.json.

  python3 -I scripts/ep.py tick  <task.md> <stepId> [--text TEXT] [--undo]
  python3 -I scripts/ep.py now   <task.md> <now> <next> [--deliverable ID]
  python3 -I scripts/ep.py cell  <file.md> <rowKey> <column> [value]      (no value: print the cell)
  python3 -I scripts/ep.py rows  <review-rows.json> list
  python3 -I scripts/ep.py rows  <review-rows.json> get <target> [key ...]
  python3 -I scripts/ep.py rows  <review-rows.json> set <target> key=value [key=value ...]

  tick   marks `- [ ] <stepId> ...` done (`--undo` reopens it); --text replaces what follows the ID.
  now    replaces the `**Now:** ... **Next:** ...` line (under `## <ID>` when the file holds several).
  cell   finds the table row whose first cell, or any cell, equals rowKey and the column by header text,
         e.g. `cell scripts/x/delivery.md EDU-EP01-SHORT "Stage / Next owner" "W6 ..."`.
  rows   target: a shot ID, a beat ID, `look:<ID>`, or `top` for the file's top-level keys. A value that
         parses as JSON (numbers, true, [..], {..}, "..") is stored as JSON, otherwise as text; `key=` with
         no value deletes the key.

Every edit must match exactly once, else nothing is written and it exits 1.
"""
import json, re, sys


def die(msg):
    print(f'ep.py: {msg}', file=sys.stderr); sys.exit(1)


def read(p):
    try: return open(p, encoding='utf-8').read()
    except OSError as e: die(str(e))


def write(p, s): open(p, 'w', encoding='utf-8').write(s)


def one(matches, what):
    if len(matches) != 1: die(f'{what}: {len(matches)} matches, need exactly 1')
    return matches[0]


def tick(path, step, text=None, undo=False):
    L = read(path).split('\n')
    rx = re.compile(r'^(\s*- \[)([ xX])(\] )' + re.escape(step) + r'(?=\s|$)(.*)$')
    i = one([k for k, l in enumerate(L) if rx.match(l)], f'step {step}')
    m = rx.match(L[i])
    rest = (' ' + text) if text is not None else m.group(4)
    L[i] = m.group(1) + (' ' if undo else 'x') + m.group(3) + step + rest
    write(path, '\n'.join(L)); print(L[i][:160])


def now(path, now_text, next_text, deliverable=None):
    L = read(path).split('\n')
    lo, hi = 0, len(L)
    if deliverable:
        lo = one([k for k, l in enumerate(L) if l.strip() == f'## {deliverable}'], f'heading ## {deliverable}')
        hi = next((k for k in range(lo + 1, len(L)) if L[k].startswith('## ')), len(L))
    i = one([k for k in range(lo, hi) if L[k].startswith('**Now:**')], '**Now:** line')
    L[i] = f'**Now:** {now_text} **Next:** {next_text}'
    write(path, '\n'.join(L)); print(L[i][:160])


def cells(line):
    return [c.strip() for c in re.split(r'(?<!\\)\|', line.strip()[1:-1] if line.strip().endswith('|') else line.strip()[1:])]


def cell(path, key, column, value=None):
    L = read(path).split('\n')
    hits = []
    for k, l in enumerate(L):
        if not l.lstrip().startswith('|'): continue
        c = cells(l)
        if key not in c: continue
        h = k  # walk up to this table's header row (the row above the --- separator)
        while h > 0 and L[h - 1].lstrip().startswith('|'): h -= 1
        head = cells(L[h])
        if column in head: hits.append((k, head.index(column), c.index(key)))
    first = [x for x in hits if x[2] == 0]
    k, col, _ = one(first or hits, f'row "{key}" with column "{column}"')
    c = cells(L[k])
    if value is None: print(c[col]); return
    if re.search(r'(?<!\\)\|', value): die('value contains "|"; escape it as \\|')
    c[col] = value
    indent = L[k][:len(L[k]) - len(L[k].lstrip())]
    L[k] = indent + '| ' + ' | '.join(c) + ' |'
    write(path, '\n'.join(L)); print(L[k][:160])


def target(d, t):
    if t == 'top': return d
    if t.startswith('look:'):
        looks = d.get('looks') or {}
        if t[5:] not in looks: die(f'no look {t[5:]}')
        return looks[t[5:]]
    found = [x for k in ('shots', 'beats') for x in d.get(k, []) if x.get('id') == t]
    return one(found, f'shot/beat {t}')


def parse(v):
    try: return json.loads(v)
    except ValueError: return v


def rows(path, op, args):
    d = json.loads(read(path))
    if op == 'list':
        for s in d.get('shots', []):
            vo = ' / '.join(x[1] for x in s.get('vo', []) if len(x) > 1)
            print(f"{s.get('id','?'):<14} {s.get('start','?'):>5}-{s.get('end','?'):<5} {s.get('title','')[:40]} | {vo[:60]}")
        return
    if not args: die('rows get/set need a target')
    obj = target(d, args[0])
    if op == 'get':
        keys = args[1:]
        out = {k: obj.get(k) for k in keys} if keys else obj
        print(json.dumps(out, ensure_ascii=False, indent=1)); return
    if op != 'set' or len(args) < 2: die('usage: rows <file> set <target> key=value ...')
    for kv in args[1:]:
        if '=' not in kv: die(f'not key=value: {kv}')
        k, v = kv.split('=', 1)
        if v == '': obj.pop(k, None)
        else: obj[k] = parse(v)
    write(path, json.dumps(d, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({k.split('=', 1)[0]: obj.get(k.split('=', 1)[0]) for k in args[1:]}, ensure_ascii=False)[:300])


def main(a):
    if len(a) < 2 or a[0] in ('-h', '--help'): print(__doc__); sys.exit(0 if a[:1] in (['-h'], ['--help']) else 1)
    cmd, path, rest = a[0], a[1], a[2:]
    opt = lambda name: rest.pop(rest.index(name) + 1) if name in rest and rest.index(name) + 1 < len(rest) else None
    if cmd == 'tick':
        text = opt('--text'); undo = '--undo' in rest
        rest = [x for x in rest if x not in ('--text', '--undo')]
        if len(rest) != 1: die('usage: tick <task.md> <stepId> [--text TEXT] [--undo]')
        tick(path, rest[0], text, undo)
    elif cmd == 'now':
        dl = opt('--deliverable'); rest = [x for x in rest if x != '--deliverable']
        if len(rest) != 2: die('usage: now <task.md> <now> <next> [--deliverable ID]')
        now(path, rest[0], rest[1], dl)
    elif cmd == 'cell':
        if len(rest) not in (2, 3): die('usage: cell <file.md> <rowKey> <column> [value]')
        cell(path, *rest)
    elif cmd == 'rows':
        if not rest: die('usage: rows <file> list|get|set ...')
        rows(path, rest[0], rest[1:])
    else: die(f'unknown command {cmd}')


if __name__ == '__main__':
    main(sys.argv[1:])
