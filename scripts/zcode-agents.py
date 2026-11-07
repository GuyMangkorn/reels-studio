"""Write .zcode/agents/<role>.md from .claude/agents/<role>.md so ZCode (Z.ai) runs the same role agents.

Usage: python3 -I scripts/zcode-agents.py
Copies name, description and instructions unchanged. Every role runs GLM-5.3 on the zai-start-plan account at
thoughtLevel high (GLM has low/high/max, no medium). Claude-only tool names are mapped (ToolSearch -> Skill,
Monitor -> TaskOutput); other tools keep their names. ZCode reads MCP servers from .agents/mcp.json, a symlink to
.mcp.json. tests/agents.test.ts checks the copies match.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = 'account:zai-start-plan/GLM-5.3'
TOOLS = {'ToolSearch': 'Skill', 'Monitor': 'TaskOutput'}


def convert(text):
    m = re.match(r'---\n(.*?)\n---\n\n(.*)$', text, re.S)
    fm = dict(re.findall(r'^(\w+): (.*)$', m.group(1), re.M))
    tools = list(dict.fromkeys(TOOLS.get(t.strip(), t.strip()) for t in fm['tools'].split(',')))
    lines = ['---', f'name: {fm["name"]}', f'description: {fm["description"]}', f'model: {MODEL}', 'thoughtLevel: high',
             f'tools: [{", ".join(tools)}]']
    return '\n'.join(lines + ['---', '', m.group(2)])


def main():
    out = os.path.join(ROOT, '.zcode', 'agents')
    os.makedirs(out, exist_ok=True)
    for src in sorted(glob.glob(os.path.join(ROOT, '.claude', 'agents', '*.md'))):
        with open(src, encoding='utf-8') as f: text = convert(f.read())
        with open(os.path.join(out, os.path.basename(src)), 'w', encoding='utf-8') as f: f.write(text)
        print(os.path.relpath(os.path.join(out, os.path.basename(src)), ROOT))


if __name__ == '__main__':
    main()
