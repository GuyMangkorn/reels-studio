"""Token usage report for this project's Claude Code transcripts (main sessions and role subagents).

Usage: python3 -I scripts/usage-report.py [--since YYYY-MM-DD] [--top N]

Reads ~/.claude/projects/<this checkout and its worktrees>/. Costs are input-token equivalents weighted by the
API price ratios (cache read 0.1, 5 min cache write 1.25, 1 h cache write 2, output 5); compare runs, not invoices.
Context attribution estimates 3.5 characters per token and 1,600 tokens per image.
"""
import argparse, collections, glob, json, os, re

W = dict(inp=1.0, cw5=1.25, cw1h=2.0, cr=0.1, out=5.0)
IMG_TOK, CHARS_PER_TOK = 1600, 3.5


def project_dirs():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    slug = re.sub(r'[^A-Za-z0-9]', '-', root)
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
    for line in open(path, errors='replace'):
        try: d = json.loads(line)
        except ValueError: continue
        if since and d.get('timestamp', '9999') < since: continue
        m = d.get('message') or {}
        content = m.get('content') if isinstance(m.get('content'), list) else []
        if d.get('type') == 'assistant':
            for c in content:
                if isinstance(c, dict) and c.get('type') == 'tool_use':
                    id2cat[c.get('id')] = category(c.get('name', ''), c.get('input') or {})
            us = m.get('usage')
            if us and m.get('id') not in seen:
                seen.add(m.get('id')); first_ts = first_ts or d.get('timestamp')
                cw1h = (us.get('cache_creation') or {}).get('ephemeral_1h_input_tokens', 0)
                cw = us.get('cache_creation_input_tokens', 0)
                u['calls'] += 1; u['inp'] += us.get('input_tokens', 0); u['cw1h'] += cw1h; u['cw5'] += cw - cw1h
                u['cr'] += us.get('cache_read_input_tokens', 0); u['out'] += us.get('output_tokens', 0)
                if first_ctx is None: first_ctx = us.get('input_tokens', 0) + cw + us.get('cache_read_input_tokens', 0)
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
    return dict(u=u, first_ctx=first_ctx or 0, events=events, first_ts=first_ts, images=images)


def cost(u):
    return sum(u[k] * w for k, w in W.items())


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--since'); ap.add_argument('--top', type=int, default=8)
    a = ap.parse_args()
    roles = collections.defaultdict(lambda: dict(u=collections.Counter(), n=0, ctx=[], images=0))
    attrib = collections.Counter(); sessions = []
    for d in project_dirs():
        for f in glob.glob(os.path.join(d, '*.jsonl')):
            jobs = [('(main)', f)]
            for sf in glob.glob(os.path.join(f[:-6], 'subagents', '*.jsonl')):
                meta = sf[:-6] + '.meta.json'
                jobs.append((json.load(open(meta)).get('agentType', '?') if os.path.exists(meta) else '?', sf))
            total = collections.Counter(); start = None
            for role, path in jobs:
                r = scan(path, a.since)
                if not r['u']['calls']: continue
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


if __name__ == '__main__':
    main()
