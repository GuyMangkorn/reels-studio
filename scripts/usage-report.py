"""Token usage report for this project's Claude Code transcripts (main sessions and role subagents).

Usage: python3 -I scripts/usage-report.py [--since YYYY-MM-DD] [--top N] [--by-model] [--rework]

Reads ~/.claude/projects/<this checkout and its worktrees>/. Costs are input-token equivalents weighted by the
API price ratios (cache read 0.1, 5 min cache write 1.25, 1 h cache write 2, output 5); compare runs, not invoices.
Context attribution estimates 3.5 characters per token and 1,600 tokens per image.

--by-model: role agent runs per role, model and effort, in API dollars (PRICE, per call, Haiku long-context rate
above 100K). Effort comes from the Agent call's override, else from out/logs/agent-runs.jsonl written by the
PreToolUse hook (scripts/hooks/agent-run-log.py), else '?'.
--rework: repeat runs of the same role on the same branch, and runs whose description reads as a fix or redo.
Shot-group splits also count as repeats, so read it as an upper bound and compare models, not absolute values.
"""
import argparse, collections, glob, json, os, re, subprocess

W = dict(inp=1.0, cw5=1.25, cw1h=2.0, cr=0.1, out=5.0)
IMG_TOK, CHARS_PER_TOK = 1600, 3.5
# $ per 1M tokens (input, output), first-party API rates checked 30 Oct 2026; cache rates follow the W ratios.
PRICE = {'claude-fable-5-1': (10, 50), 'claude-opus-5-5': (4, 20), 'claude-opus-5': (5, 25),
         'claude-sonnet-5-5': (2, 10), 'claude-sonnet-5': (2, 10), 'claude-haiku-5-5': (0.10, 0.50)}
HAIKU_LONG = (0.50, 2.50)  # Haiku 5.5 prompts above 100K tokens
REWORK = re.compile(r'\b(fix|redo|re-?run|retry|rework|revis\w*|again|r\d+)\b', re.I)


def main_root():
    """The main checkout, also when this script runs from one of its worktrees."""
    here = os.path.dirname(os.path.abspath(__file__))
    try:
        common = subprocess.run(['git', '-C', here, 'rev-parse', '--path-format=absolute', '--git-common-dir'],
                                capture_output=True, text=True, check=True).stdout.strip()
        return os.path.dirname(common)
    except (OSError, subprocess.CalledProcessError): return os.path.dirname(here)


def project_dirs():
    slug = re.sub(r'[^A-Za-z0-9]', '-', main_root())
    return [d for d in glob.glob(os.path.expanduser('~/.claude/projects/*')) if os.path.basename(d).startswith(slug)]


def category(name, inp):
    if name == 'Read':
        fp = inp.get('file_path', '')
        if re.search(r'/docs/|AGENTS\.md|CLAUDE\.md', fp): return 'read docs/'
        if '/storyboards/' in fp or '/scripts/' in fp and fp.endswith('.md'): return 'read storyboards/scripts md'
        return 'read other files'
    if name == 'Bash':
        cmd = inp.get('command', '')
        if re.search(r'MacOS/Blender|"\$B"| -b --python|render_sp\d|run_all|run_worst|_check\.py', cmd): return 'run blender'
        if re.search(r'remotion (render|still)|render\.mjs|ffmpeg|ffprobe', cmd): return 'run render/ffmpeg'
        if re.search(r'(cat|sed -n|head|tail|awk)[^|;]*(docs/|AGENTS)', cmd): return 'read docs/'
        if re.search(r'(cat|sed -n|head|tail|awk)[^|;]*(storyboards/|scripts/[^ ]*\.md)', cmd): return 'read storyboards/scripts md'
        if re.search(r'\b(grep|rg)\b', cmd): return 'grep'
        if re.search(r'(cat|sed -n|head|tail)\b', cmd): return 'read other files'
        if re.search(r'\b(git|gh)\b', cmd): return 'git/gh'
        return 'other bash'
    if name.startswith('mcp__'): return 'mcp ' + name.split('__')[1]
    if name in ('WebSearch', 'WebFetch'): return 'web'
    return 'other tools'


def scan(path, since):
    """One transcript: usage totals, first-call context, and tool-result tokens with the call index they entered at."""
    u = collections.Counter(); seen = set(); id2cat = {}; events = []; first_ctx = None; first_ts = None; images = 0
    models = collections.Counter(); usd = 0.0; branch = None; agent_calls = {}
    for line in open(path, errors='replace'):
        try: d = json.loads(line)
        except ValueError: continue
        if since and d.get('timestamp', '9999') < since: continue
        m = d.get('message') or {}
        content = m.get('content') if isinstance(m.get('content'), list) else []
        if d.get('type') == 'assistant':
            branch = branch or d.get('gitBranch')
            for c in content:
                if isinstance(c, dict) and c.get('type') == 'tool_use':
                    id2cat[c.get('id')] = category(c.get('name', ''), c.get('input') or {})
                    if c.get('name') in ('Agent', 'Task'): agent_calls[c.get('id')] = c.get('input') or {}
            us = m.get('usage')
            if us and m.get('id') not in seen:
                seen.add(m.get('id')); first_ts = first_ts or d.get('timestamp')
                cw1h = (us.get('cache_creation') or {}).get('ephemeral_1h_input_tokens', 0)
                cw = us.get('cache_creation_input_tokens', 0)
                c = dict(inp=us.get('input_tokens', 0), cw5=cw - cw1h, cw1h=cw1h,
                         cr=us.get('cache_read_input_tokens', 0), out=us.get('output_tokens', 0))
                u['calls'] += 1; u.update(c); models[m.get('model')] += 1; usd += dollars(m.get('model'), c)
                if first_ctx is None: first_ctx = c['inp'] + cw + c['cr']
        elif d.get('type') == 'user':
            for c in content:
                if not (isinstance(c, dict) and c.get('type') == 'tool_result'): continue
                cat = id2cat.get(c.get('tool_use_id'), 'other tools'); body = c.get('content'); chars = 0; imgs = 0
                if isinstance(body, str): chars = len(body)
                elif isinstance(body, list):
                    for x in body:
                        if x.get('type') == 'text': chars += len(x.get('text', ''))
                        elif x.get('type') == 'image': imgs += 1
                if chars: events.append((u['calls'], cat, chars / CHARS_PER_TOK))
                if imgs: events.append((u['calls'], 'images', imgs * IMG_TOK)); images += imgs
    model = next((k for k, _ in models.most_common() if k and k != '<synthetic>'), '?')
    return dict(u=u, first_ctx=first_ctx or 0, events=events, first_ts=first_ts, images=images,
                model=model, usd=usd, branch=branch or '?', agent_calls=agent_calls)


def cost(u):
    return sum(u[k] * w for k, w in W.items())


def dollars(model, c):
    """API dollars for one call's usage dict; 0 for unpriced models (e.g. <synthetic>)."""
    if model not in PRICE: return 0.0
    pin, pout = PRICE[model]
    if model == 'claude-haiku-5-5' and c['inp'] + c['cw5'] + c['cw1h'] + c['cr'] > 100_000: pin, pout = HAIKU_LONG
    return (sum(c[k] * w for k, w in W.items() if k != 'out') * pin + c['out'] * pout) / 1e6


def run_log():
    """tool_use_id -> hook record from <main checkout>/out/logs/agent-runs.jsonl (shared by all worktrees)."""
    out = {}
    try:
        for line in open(os.path.join(main_root(), 'out', 'logs', 'agent-runs.jsonl')):
            try: r = json.loads(line)
            except ValueError: continue
            if r.get('tool_use_id'): out[r['tool_use_id']] = r
    except OSError: pass
    return out


def by_model(runs):
    print('\nRole agents by role, model, effort: runs, calls/run, output/run, $/run, $ total')
    g = collections.defaultdict(lambda: collections.Counter())
    for r in runs:
        k = (r['role'], r['model'], r['effort']); g[k]['n'] += 1; g[k]['usd'] += r['usd']
        g[k]['calls'] += r['u']['calls']; g[k]['out'] += r['u']['out']
    for (role, model, effort), c in sorted(g.items(), key=lambda kv: (kv[0][0], -kv[1]['usd'])):
        n = c['n']
        print(f"  {role:16} {model.replace('claude-', ''):12} {effort:7} n={n:3}  {c['calls']/n:5.0f}"
              f"  {c['out']/n/1e3:6.1f}K  ${c['usd']/n:7.2f}  ${c['usd']:8.2f}")


def rework(runs):
    print('\nRework by role and model: runs, tasks (branch), runs/task, repeat $ share, fix/redo-named runs')
    g = collections.defaultdict(lambda: dict(n=0, tasks=collections.defaultdict(list), named=0))
    for r in runs:
        x = g[(r['role'], r['model'])]; x['n'] += 1; x['tasks'][r['branch']].append(r)
        x['named'] += bool(REWORK.search(r['desc']))
    for (role, model), x in sorted(g.items()):
        total = sum(r['usd'] for t in x['tasks'].values() for r in t) or 1
        repeat = sum(r['usd'] for t in x['tasks'].values() for r in sorted(t, key=lambda r: r['ts'])[1:])
        print(f"  {role:16} {model.replace('claude-', ''):12} n={x['n']:3}  tasks={len(x['tasks']):3}"
              f"  {x['n']/len(x['tasks']):4.1f}  {repeat/total:4.0%}  named={x['named']}")


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--since'); ap.add_argument('--top', type=int, default=8)
    ap.add_argument('--by-model', action='store_true'); ap.add_argument('--rework', action='store_true')
    a = ap.parse_args()
    roles = collections.defaultdict(lambda: dict(u=collections.Counter(), n=0, ctx=[], images=0))
    attrib = collections.Counter(); sessions = []; runs = []; logged = run_log()
    for d in project_dirs():
        for f in glob.glob(os.path.join(d, '*.jsonl')):
            jobs = [('(main)', f, {})]
            for sf in glob.glob(os.path.join(f[:-6], 'subagents', '*.jsonl')):
                meta = sf[:-6] + '.meta.json'
                meta = json.load(open(meta)) if os.path.exists(meta) else {}
                jobs.append((meta.get('agentType', '?'), sf, meta))
            total = collections.Counter(); start = None; agent_calls = {}
            for role, path, meta in jobs:
                r = scan(path, a.since)
                if role == '(main)': agent_calls = r['agent_calls']
                if not r['u']['calls']: continue
                if role != '(main)':
                    tid = meta.get('toolUseId'); call = agent_calls.get(tid, {}); hook = logged.get(tid, {})
                    runs.append(dict(role=role, model=r['model'], u=r['u'], usd=r['usd'], branch=r['branch'],
                                     ts=r['first_ts'] or '', desc=meta.get('description', ''),
                                     effort=call.get('effort') or hook.get('effort') or '?'))
                start = start or r['first_ts']; total += r['u']
                g = roles[role]; g['u'] += r['u']; g['n'] += 1; g['ctx'].append(r['first_ctx']); g['images'] += r['images']
                calls = r['u']['calls']
                attrib['startup context'] += r['first_ctx'] * (calls * W['cr'] + W['cw1h'])
                for at, cat, tok in r['events']:
                    attrib[cat] += tok * (max(calls - at, 0) * W['cr'] + W['cw1h'])
            if total['calls']: sessions.append((cost(total), os.path.basename(f)[:8], (start or '')[:10], len(jobs) - 1))
    tot = sum((g['u'] for g in roles.values()), collections.Counter()); T = cost(tot) or 1
    print(f"Weighted total {T/1e6:.1f}M over {tot['calls']} calls"
          f" | cache read {tot['cr']*W['cr']/T:.0%}, cache write {(tot['cw5']*W['cw5']+tot['cw1h']*W['cw1h'])/T:.0%},"
          f" output {tot['out']*W['out']/T:.0%}")
    print('\nBy role: weighted, share, invocations, per invocation, median startup context, images')
    for k, g in sorted(roles.items(), key=lambda kv: -cost(kv[1]['u'])):
        c = cost(g['u']); ctx = sorted(g['ctx'])
        print(f"  {k:16} {c/1e6:6.1f}M {c/T:4.0%}  n={g['n']:3}  {c/g['n']/1e3:6.0f}K  start={ctx[len(ctx)//2]/1e3:3.0f}K  img={g['images']}")
    A = sum(attrib.values()) or 1
    print('\nWhat stays in context (input-side cost share)')
    for k, v in attrib.most_common(): print(f"  {k:28} {v/A:5.1%}")
    print(f'\nTop {a.top} sessions: weighted, id, date, subagents')
    for c, sid, day, n in sorted(sessions, reverse=True)[:a.top]: print(f"  {c/1e6:6.1f}M  {sid}  {day}  {n}")
    if a.by_model: by_model(runs)
    if a.rework: rework(runs)


if __name__ == '__main__':
    main()
