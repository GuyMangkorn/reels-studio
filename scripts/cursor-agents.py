"""Write .cursor/agents/<role>.md from .claude/agents/<role>.md so Cursor runs the same role agents.

Usage: python3 -I scripts/cursor-agents.py
Copies name, description and instructions unchanged. Maps Claude model + effort to Cursor's
model[effort=...] form (see https://cursor.com/docs/subagents.md). Drops the Claude-only tools
allowlist: Cursor subagent front matter has no tools field. Cursor also reads .claude/agents/ for
compatibility; .cursor/agents/ takes precedence when both exist. tests/agents.test.ts checks the
copies match.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def convert(text):
    m = re.match(r'---\n(.*?)\n---\n\n(.*)$', text, re.S)
    fm = dict(re.findall(r'^(\w+): (.*)$', m.group(1), re.M))
    lines = ['---', f'name: {fm["name"]}', f'description: {fm["description"]}']
    if 'model' in fm:
        model = fm['model']
        if 'effort' in fm:
            model = f'{model}[effort={fm["effort"]}]'
        lines.append(f'model: {model}')
    return '\n'.join(lines + ['---', '', m.group(2)])


def main():
    out = os.path.join(ROOT, '.cursor', 'agents')
    os.makedirs(out, exist_ok=True)
    for src in sorted(glob.glob(os.path.join(ROOT, '.claude', 'agents', '*.md'))):
        with open(src, encoding='utf-8') as f: text = convert(f.read())
        path = os.path.join(out, os.path.basename(src))
        with open(path, 'w', encoding='utf-8') as f: f.write(text)
        print(os.path.relpath(path, ROOT))


if __name__ == '__main__':
    main()
