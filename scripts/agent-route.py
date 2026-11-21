"""Runtime role routing: which provider and model runs a role agent, switched without a commit.

The switch is one JSON file outside Git, read by every worktree and harness:
$REELS_ROUTING, default ~/.config/reels-studio/agent-routing.json

    {"version": 1, "routes": {"boss-apply": {"provider": "codex", "model": "gpt-6.2-sol", "effort": "medium"}}}

A role with no route runs as its pinned Claude Code agent (.claude/agents/<role>.md). A `claude` route overrides
the pinned model or effort for the Agent call. Any other provider runs the role through that provider's CLI.

  python3 -I scripts/agent-route.py show
  python3 -I scripts/agent-route.py set boss-apply codex [--model M] [--effort E]
  python3 -I scripts/agent-route.py clear boss-apply
  python3 -I scripts/agent-route.py run boss-apply BRIEF.md [--read-only] [--image F ...] [--dry-run]
  python3 -I scripts/agent-route.py hook      (PreToolUse hook on the Agent tool, .claude/settings.json)
  python3 -I scripts/agent-route.py serve [--port 8791]   (the switch page, http://127.0.0.1:8791)

`run` sends the role's instructions plus the brief to the provider, prints only the final message, keeps the full
log under out/logs/ and exits 75 on the provider's usage limit. On a usage limit it also takes every role off that
provider in the routing file (back to the pinned agent) and notes why under `bounced`, so the page shows it. The hook denies an Agent call that does not match
the role's route and says what to run instead; an Agent prompt containing `routing-fallback: <reason>` passes
(the provider hit its limit or failed). The hook never blocks on its own errors.

`serve` is a local page over the same file (scripts/agent-route.html): one row per role, a change saves at once.

Adding a provider: one PROVIDERS entry (default model and effort, the models the page offers, the argv builder,
the usage-limit pattern).
"""
import argparse, datetime, http.server, json, os, re, subprocess, sys

ROUTING = os.path.expanduser(os.environ.get('REELS_ROUTING') or '~/.config/reels-studio/agent-routing.json')
FALLBACK = 'routing-fallback:'
CLAUDE_MODELS = ('sonnet', 'opus', 'haiku', 'fable')  # what the Agent tool's `model` accepts
EFFORTS = ('low', 'medium', 'high', 'xhigh', 'max', 'ultra')


def codex_argv(model, effort, write, cwd, last, images):
    """The brief goes on stdin (`-`): `-i` takes several files and would swallow a prompt argument."""
    argv = ['codex', 'exec', '-m', model, '-c', f'model_reasoning_effort="{effort}"',
            '-s', 'workspace-write' if write else 'read-only', '-C', cwd, '-o', last]
    for image in images: argv += ['-i', image]
    return argv + ['-']


# argv(model, effort, write, cwd, last, images) -> command that reads the prompt on stdin and writes its
# final message to `last`. `limit` matches the provider's usage-limit message in the log.
PROVIDERS = {
    'claude': None,  # the pinned Claude Code agent, through the Agent tool
    'codex': dict(model='gpt-6.2-sol', effort='medium', models=['gpt-6.2-sol', 'gpt-6.1-terra'], argv=codex_argv,
                  limit=r'usage limit'),
}


def load_all():
    """(routes, bounced): bounced notes each role a usage limit sent back to its pin, until its route is set again."""
    try: data = json.load(open(ROUTING, encoding='utf-8'))
    except FileNotFoundError: return {}, {}
    part = lambda key: data[key] if isinstance(data, dict) and isinstance(data.get(key), dict) else {}
    return part('routes'), part('bounced')


def load():
    return load_all()[0]


def save(routes, bounced):
    os.makedirs(os.path.dirname(ROUTING), exist_ok=True)
    tmp = ROUTING + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(dict(version=1, routes=routes, **(dict(bounced=bounced) if bounced else {})), f, ensure_ascii=False, indent=2)
        f.write('\n')
    os.replace(tmp, ROUTING)


def role_file(project, role):
    return os.path.join(project, '.claude', 'agents', role + '.md')


def read_role(project, role):
    """(front matter model/effort, instructions) of a role, or None when the role does not exist."""
    try: text = open(role_file(project, role), encoding='utf-8').read()
    except OSError: return None
    m = re.match(r'---\n(.*?)\n---\n?(.*)', text, re.S)
    if not m: return {}, text.strip()
    return dict(re.findall(r'^(model|effort):\s*(\S+)', m.group(1), re.M)), m.group(2).strip()


def resolved(route):
    """A route with the provider's defaults filled in."""
    provider = route.get('provider', 'claude')
    spec = PROVIDERS.get(provider) or {}
    return provider, route.get('model') or spec.get('model'), route.get('effort') or spec.get('effort')


def cmd_show(args):
    routes, bounced = load_all()
    print(f'routing file: {ROUTING}')
    names = sorted(f[:-3] for f in os.listdir(os.path.join(args.project, '.claude', 'agents')) if f.endswith('.md'))
    for role in names:
        fm, _ = read_role(args.project, role)
        if role in routes:
            provider, model, effort = resolved(routes[role])
            print(f'{role:12} {provider:7} {model or fm.get("model", "inherit"):18} {effort or fm.get("effort", "inherit"):7} (routed)')
        else:
            note = f' (back from {bounced[role].get("provider")}: {bounced[role].get("reason")})' if role in bounced else ''
            print(f'{role:12} {"claude":7} {fm.get("model", "inherit"):18} {fm.get("effort", "inherit"):7}{note}')
    for role in sorted(set(routes) - set(names)): print(f'{role:12} unknown role in the routing file')


def set_route(project, role, provider, model=None, effort=None):
    """Writes one route; returns the error text when the input is refused."""
    if read_role(project, role) is None: return f'unknown role: {role}'
    if provider not in PROVIDERS: return f'unknown provider: {provider} (known: {", ".join(PROVIDERS)})'
    if effort and effort not in EFFORTS: return f'effort is one of: {", ".join(EFFORTS)}'
    if model and not re.fullmatch(r'[\w.:/-]{1,80}', model): return 'model: letters, digits and . : / - _ only'
    if provider == 'claude' and model and model not in CLAUDE_MODELS:
        return f'claude model is one of: {", ".join(CLAUDE_MODELS)}'
    if provider == 'claude' and not (model or effort):
        return 'a claude route needs a model or an effort; clear the route to return to the pinned agent'
    routes, bounced = load_all()
    routes[role] = {k: v for k, v in dict(provider=provider, model=model, effort=effort).items() if v}
    bounced.pop(role, None)
    save(routes, bounced)


def cmd_set(args):
    error = set_route(args.project, args.role, args.provider, args.model, args.effort)
    if error: sys.exit(error)
    print(f'{args.role}: {" / ".join(str(v) for v in resolved(load()[args.role]) if v)}')


def clear_route(role):
    routes, bounced = load_all()
    if (routes.pop(role, None), bounced.pop(role, None)) != (None, None): save(routes, bounced)


def bounce(provider, ts):
    """The provider is out of usage: every role routed to it returns to its pinned agent, with a note for the page."""
    routes, bounced = load_all()
    for role in [r for r, route in routes.items() if resolved(route)[0] == provider]:
        bounced[role] = dict(routes.pop(role), provider=provider, reason='usage limit', ts=ts)
    save(routes, bounced)


def cmd_clear(args):
    clear_route(args.role)
    print(f'{args.role}: pinned Claude agent')


def cmd_run(args):
    role = read_role(args.project, args.role)
    if role is None: sys.exit(f'unknown role: {args.role}')
    provider, model, effort = resolved(load().get(args.role, {}))
    if provider not in PROVIDERS: sys.exit(f'unknown provider in the routing file: {provider}')
    if provider == 'claude': sys.exit(f'{args.role} is routed to Claude: invoke the Agent tool (subagent_type {args.role})')
    spec = PROVIDERS[provider]
    brief = sys.stdin.read() if args.brief == '-' else open(args.brief, encoding='utf-8').read()
    prompt = (f'You are running as the role agent `{args.role}` of this repository, routed to {provider} '
              f'({model}, {effort}) by scripts/agent-route.py. Your role instructions:\n\n{role[1]}\n\n'
              'End with the role\'s handoff as your final message: every path, revision, evidence item and open '
              f'question, and the line `Ran on: {provider} / {model} / {effort}`.\n\n--- Brief ---\n\n{brief}\n')
    logs = os.path.join(args.project, 'out', 'logs')
    os.makedirs(logs, exist_ok=True)
    stem = os.path.join(logs, f'route-{args.role}-{datetime.datetime.now():%Y%m%d-%H%M%S}')
    log, last = stem + '.log', stem + '.last.txt'
    open(stem + '.prompt.md', 'w', encoding='utf-8').write(prompt)
    argv = spec['argv'](model, effort, not args.read_only, args.project, last, args.image or [])
    if args.dry_run:
        print(json.dumps(dict(argv=argv, prompt=stem + '.prompt.md'), ensure_ascii=False))
        return
    started = datetime.datetime.now(datetime.timezone.utc)
    with open(log, 'w', encoding='utf-8') as out:
        status = subprocess.run(argv, input=prompt, text=True, stdout=out, stderr=subprocess.STDOUT).returncode
    done = os.path.exists(last) and os.path.getsize(last) > 0
    # Only a run without a final message counts as limited: the log also echoes prompts that mention limits.
    limited = not done and re.search(spec['limit'], open(log, encoding='utf-8', errors='replace').read(), re.I)
    with open(os.path.join(logs, 'route-runs.jsonl'), 'a', encoding='utf-8') as f:
        f.write(json.dumps(dict(ts=started.isoformat(timespec='seconds'), role=args.role, provider=provider,
                                model=model, effort=effort, status=75 if limited else status, log=log,
                                seconds=round((datetime.datetime.now(datetime.timezone.utc) - started).total_seconds())),
                           ensure_ascii=False) + '\n')
    if limited:
        bounce(provider, started.isoformat(timespec='seconds'))
        print(f'{provider}: usage limit reached ({log}); roles on {provider} are back on their pinned agents', file=sys.stderr)
        sys.exit(75)
    if status != 0 or not done:
        print(f'{provider}: exit {status}, {"no final message" if not done else "final message kept"} ({log})', file=sys.stderr)
        sys.exit(status or 1)
    print(open(last, encoding='utf-8').read())
    print(f'(log: {log})')


def deny(reason):
    print(json.dumps(dict(hookSpecificOutput=dict(hookEventName='PreToolUse', permissionDecision='deny',
                                                  permissionDecisionReason=reason))))


def cmd_hook(args):
    d = json.load(sys.stdin)
    if d.get('tool_name') not in ('Agent', 'Task'): return
    inp = d.get('tool_input') or {}
    role = inp.get('subagent_type')
    route = load().get(role) if role else None
    if not route or FALLBACK in (inp.get('prompt') or ''): return
    project = os.environ.get('CLAUDE_PROJECT_DIR') or d.get('cwd') or '.'
    provider, model, effort = resolved(route)
    where = f'(routing file {ROUTING}, set by the user)'
    if provider != 'claude':
        deny(f'{role} is routed to {provider} / {model} / {effort} {where}. Do not use the Agent tool for it: write '
             f'the same brief to a file and run `python3 -I scripts/agent-route.py run {role} <brief.md>` in the '
             f'background (docs/coordinator.md#runtime-routing). Exit 75 (usage limit) returns the role to its pinned '
             f'agent in the routing file: call the Agent tool again and tell the user. Only if the run fails another '
             f'way, call the Agent tool again with a first prompt line `{FALLBACK} <reason>`.')
        return
    fm = (read_role(project, role) or ({}, ''))[0]
    wrong = []
    if model and model not in (inp.get('model') or fm.get('model') or ''): wrong.append(f'model: "{model}"')
    if effort and effort != (inp.get('effort') or fm.get('effort')): wrong.append(f'effort: "{effort}"')
    if wrong: deny(f'{role} is routed to Claude with {" and ".join(wrong)} {where}. Send the same Agent call again '
                   f'with {" and ".join(wrong)}.')


def state(project):
    """What the switch page shows: every role with its pin and route, the providers, the last provider runs."""
    (routes, bounced), roles = load_all(), []
    folder = os.path.join(project, '.claude', 'agents')
    for name in sorted(f[:-3] for f in os.listdir(folder) if f.endswith('.md')):
        text = open(os.path.join(folder, name + '.md'), encoding='utf-8').read()
        about = re.search(r'^description:\s*"?(.*?)"?$', text, re.M)
        roles.append(dict(role=name, description=about.group(1) if about else '', pinned=read_role(project, name)[0],
                          route=routes.get(name), bounced=bounced.get(name)))
    runs = []
    try: runs = [json.loads(line) for line in open(os.path.join(project, 'out', 'logs', 'route-runs.jsonl'), encoding='utf-8')][-5:]
    except (OSError, ValueError): pass
    providers = {name: dict(model=(spec or {}).get('model'), effort=(spec or {}).get('effort'),
                            models=list(CLAUDE_MODELS) if name == 'claude' else (spec or {}).get('models', []))
                 for name, spec in PROVIDERS.items()}
    return dict(file=ROUTING, roles=roles, providers=providers, efforts=EFFORTS, runs=runs[::-1])


def cmd_serve(args):
    page = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'agent-route.html')
    own = (f'127.0.0.1:{args.port}', f'localhost:{args.port}')

    class Handler(http.server.BaseHTTPRequestHandler):
        def send(self, code, body, kind='application/json'):
            data = body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode()
            self.send_response(code)
            self.send_header('Content-Type', kind + '; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.headers.get('Host') not in own: return self.send(403, dict(error='host'))
            if self.path == '/': return self.send(200, open(page, 'rb').read(), 'text/html')
            if self.path == '/api/state': return self.send(200, state(args.project))
            self.send(404, dict(error='not found'))

        def do_POST(self):
            # Only this page may write: another site's script cannot send JSON here without a preflight.
            origin = self.headers.get('Origin')
            if (self.headers.get('Host') not in own or (origin and origin.split('//')[-1] not in own)
                    or 'application/json' not in (self.headers.get('Content-Type') or '') or self.path != '/api/route'):
                return self.send(403, dict(error='refused'))
            try:
                body = json.loads(self.rfile.read(min(int(self.headers.get('Content-Length') or 0), 4096)))
                role, provider = str(body['role']), body.get('provider')
            except (ValueError, KeyError, TypeError):
                return self.send(400, dict(error='bad request'))
            if provider is None:
                error = None if read_role(args.project, role) is not None else f'unknown role: {role}'
                if not error: clear_route(role)
            else:
                error = set_route(args.project, role, str(provider), body.get('model') or None, body.get('effort') or None)
            self.send(400 if error else 200, dict(error=error) if error else state(args.project))

        def log_message(self, *a): pass

    print(f'role routing: http://127.0.0.1:{args.port}  (file {ROUTING})', flush=True)
    http.server.ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()


def main():
    p = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    p.add_argument('--project', default=os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd(), help=argparse.SUPPRESS)
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('show').set_defaults(fn=cmd_show)
    s = sub.add_parser('set'); s.set_defaults(fn=cmd_set)
    s.add_argument('role'); s.add_argument('provider'); s.add_argument('--model'); s.add_argument('--effort', choices=EFFORTS)
    s = sub.add_parser('clear'); s.set_defaults(fn=cmd_clear); s.add_argument('role')
    s = sub.add_parser('run'); s.set_defaults(fn=cmd_run)
    s.add_argument('role'); s.add_argument('brief', help='brief file, or - for stdin')
    s.add_argument('--read-only', action='store_true'); s.add_argument('--image', action='append'); s.add_argument('--dry-run', action='store_true')
    sub.add_parser('hook').set_defaults(fn=cmd_hook)
    s = sub.add_parser('serve'); s.set_defaults(fn=cmd_serve); s.add_argument('--port', type=int, default=8791)
    args = p.parse_args()
    if args.cmd == 'hook':
        try: cmd_hook(args)
        except Exception: pass  # a broken routing file never blocks an Agent call
        return
    args.fn(args)


if __name__ == '__main__':
    main()
