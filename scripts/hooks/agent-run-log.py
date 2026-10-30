"""PreToolUse hook for the Agent tool: appends one line per role agent run to <main checkout>/out/logs/agent-runs.jsonl.

Records the model and effort the run starts with (the call's override, else the role's .claude/agents/<role>.md
front matter, else 'inherit'), so scripts/usage-report.py --by-model can show effort, which transcripts do not keep.
Never blocks the call: every failure is ignored and nothing is printed.
"""
import datetime, json, os, re, subprocess, sys


def front_matter(path):
    try: text = open(path, encoding='utf-8').read()
    except OSError: return {}
    m = re.match(r'---\n(.*?)\n---', text, re.S)
    return dict(re.findall(r'^(model|effort):\s*(\S+)', m.group(1), re.M)) if m else {}


def main():
    d = json.load(sys.stdin)
    if d.get('tool_name') not in ('Agent', 'Task'): return
    inp = d.get('tool_input') or {}
    project = os.environ.get('CLAUDE_PROJECT_DIR') or d.get('cwd') or '.'
    role = inp.get('subagent_type') or 'general-purpose'
    fm = front_matter(os.path.join(project, '.claude', 'agents', role + '.md'))
    common = subprocess.run(['git', '-C', project, 'rev-parse', '--path-format=absolute', '--git-common-dir'],
                            capture_output=True, text=True, check=True).stdout.strip()
    logs = os.path.join(os.path.dirname(common), 'out', 'logs')
    os.makedirs(logs, exist_ok=True)
    rec = dict(ts=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
               session_id=d.get('session_id'), tool_use_id=d.get('tool_use_id'), role=role,
               description=inp.get('description', ''),
               model=inp.get('model') or fm.get('model') or 'inherit',
               effort=inp.get('effort') or fm.get('effort') or 'inherit',
               branch=subprocess.run(['git', '-C', project, 'branch', '--show-current'],
                                     capture_output=True, text=True).stdout.strip())
    with open(os.path.join(logs, 'agent-runs.jsonl'), 'a', encoding='utf-8') as f:
        f.write(json.dumps(rec, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    try: main()
    except Exception: pass
