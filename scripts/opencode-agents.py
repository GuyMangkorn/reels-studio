"""Write .opencode/agents/<role>.md from .claude/agents/<role>.md so OpenCode runs the same role agents.

Usage: python3 -I scripts/opencode-agents.py
Copies description and instructions unchanged, maps model + effort to an anthropic/<model>#<effort> reference, and maps
the Claude tools allowlist to OpenCode permissions: web tools and skill loading are denied unless listed, and launching
subagents is always denied (a role agent never invokes the next role). tests/agents.test.ts checks the copies match.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GATED = {'WebSearch': 'websearch', 'WebFetch': 'webfetch', 'Skill': 'skill'}


def convert(text):
    m = re.match(r'---\n(.*?)\n---\n\n(.*)$', text, re.S)
    fm = dict(re.findall(r'^(\w+): (.*)$', m.group(1), re.M))
    tools = {t.strip() for t in fm['tools'].split(',')}
    lines = ['---', f'description: {fm["description"]}', 'mode: subagent']
    if 'model' in fm:
        lines.append(f'model: anthropic/{fm["model"]}' + (f'#{fm["effort"]}' if 'effort' in fm else ''))
    lines.append('permissions:')
    for action in [a for t, a in GATED.items() if t not in tools] + ['subagent']:
        lines += [f'  - action: {action}', '    resource: "*"', '    effect: deny']
    return '\n'.join(lines + ['---', '', m.group(2)])


def main():
    out = os.path.join(ROOT, '.opencode', 'agents')
    os.makedirs(out, exist_ok=True)
    for src in sorted(glob.glob(os.path.join(ROOT, '.claude', 'agents', '*.md'))):
        with open(src, encoding='utf-8') as f: text = convert(f.read())
        with open(os.path.join(out, os.path.basename(src)), 'w', encoding='utf-8') as f: f.write(text)
        print(os.path.relpath(os.path.join(out, os.path.basename(src)), ROOT))


if __name__ == '__main__':
    main()
