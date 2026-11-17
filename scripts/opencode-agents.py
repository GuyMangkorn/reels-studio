"""Write .opencode/agents/<role>.md and <role>-gpt.md from .claude/agents/<role>.md so OpenCode runs the same role agents.

Usage: python3 -I scripts/opencode-agents.py
Copies description and instructions unchanged, maps model + effort to an anthropic/<model>#<effort> reference, and maps
the Claude tools allowlist to OpenCode permissions: web tools and skill loading are denied unless listed, and launching
subagents is always denied (a role agent never invokes the next role). Each role also gets a <role>-gpt twin on the
OpenAI model and effort of the Codex subagent default in .codex/config.toml. tests/agents.test.ts checks the copies match.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GATED = {'WebSearch': 'websearch', 'WebFetch': 'webfetch', 'Skill': 'skill'}


def codex_model():
    with open(os.path.join(ROOT, '.codex', 'config.toml'), encoding='utf-8') as f: text = f.read()
    model = re.search(r'^default_subagent_model = "(.+)"$', text, re.M).group(1)
    effort = re.search(r'^default_subagent_reasoning_effort = "(.+)"$', text, re.M)
    return f'openai/{model}' + (f'#{effort.group(1)}' if effort else '')


def convert(text, model=None):
    m = re.match(r'---\n(.*?)\n---\n\n(.*)$', text, re.S)
    fm = dict(re.findall(r'^(\w+): (.*)$', m.group(1), re.M))
    tools = {t.strip() for t in fm['tools'].split(',')}
    description = fm['description'] if model is None else fm['description'][:-1] + f' Runs on {model}."'
    lines = ['---', f'description: {description}', 'mode: subagent']
    if model:
        lines.append(f'model: {model}')
    elif 'model' in fm:
        lines.append(f'model: anthropic/{fm["model"]}' + (f'#{fm["effort"]}' if 'effort' in fm else ''))
    lines.append('permissions:')
    for action in [a for t, a in GATED.items() if t not in tools] + ['subagent']:
        lines += [f'  - action: {action}', '    resource: "*"', '    effect: deny']
    return '\n'.join(lines + ['---', '', m.group(2)])


def main():
    out = os.path.join(ROOT, '.opencode', 'agents')
    os.makedirs(out, exist_ok=True)
    gpt = codex_model()
    for src in sorted(glob.glob(os.path.join(ROOT, '.claude', 'agents', '*.md'))):
        with open(src, encoding='utf-8') as f: text = f.read()
        role = os.path.basename(src)[:-3]
        for name, body in ((role, convert(text)), (f'{role}-gpt', convert(text, gpt))):
            path = os.path.join(out, f'{name}.md')
            with open(path, 'w', encoding='utf-8') as f: f.write(body)
            print(os.path.relpath(path, ROOT))


if __name__ == '__main__':
    main()
