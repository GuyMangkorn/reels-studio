"""Check docs/context-map.md: every link and #anchor resolves, and every module is mentioned by some entry.

Usage: python3 -I scripts/context-map.py
A module is a tracked or new (not ignored) path cut to the depth in DEPTH below: a top-level file or folder, a doc,
a script, a src/painted/kit or src/scenes file, a src/videos/<episode> folder, a test, a skill. It is covered when the
map links to it or names it in a code span (or names a path inside it). Code spans on a line starting "- Pending" are
paths on an unmerged branch: they count as covered, and the script lists the ones that now exist so they become links.
Exits 1 on a dead link or anchor, or an uncovered module.
"""
import importlib.util, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = 'docs/context-map.md'
# Longest matching prefix sets how many path components make one module.
DEPTH = {'': 1, 'docs/': 2, 'scripts/': 2, 'tests/': 2, 'src/': 2, 'src/painted/': 3, 'src/painted/kit/': 4,
         'src/painted/shots/': 4, 'src/scenes/': 3, 'src/videos/': 3, '.claude/': 2, '.claude/skills/': 3,
         '.agents/skills/': 3, '.codex/': 2}
IGNORE = ('.gitignore', '.mcp.json')


def module(path):
    prefix = max((p for p in DEPTH if path.startswith(p)), key=len)
    unit = '/'.join(path.split('/')[:DEPTH[prefix]])
    real = os.path.relpath(os.path.realpath(unit), ROOT)  # a symlinked skill counts as its target
    if not real.startswith('..'): return real
    # Linked from the home repo, which mirrors these paths: the target's own tail names the module.
    return '/'.join(os.path.realpath(unit).split('/')[-len(unit.split('/')):])


def mentions(text):
    """Paths the map names (repo-relative) and the pending ones."""
    named, pending = set(), set()
    for target in re.findall(r'\]\(([^)\s#]+)', text):
        if not re.match(r'^(https?:|mailto:)', target):
            named.add(os.path.normpath(os.path.join(os.path.dirname(MAP), target)))
    for line in text.split('\n'):
        for span in re.findall(r'`([^`\s]+)`', line):
            if '/' in span or '.' in span:
                path = os.path.normpath(span.rstrip('/'))
                named.add(path)
                if line.startswith('- Pending'): pending.add(path)
    return named, pending


def main():
    os.chdir(ROOT)
    spec = importlib.util.spec_from_file_location('check_links', 'scripts/check-links.py')
    check_links = importlib.util.module_from_spec(spec); spec.loader.exec_module(check_links)
    dead = check_links.main([MAP])

    named, pending = mentions(check_links.prose(open(MAP, encoding='utf-8').read()))
    files = subprocess.run(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], capture_output=True, text=True).stdout.split('\n')
    units = sorted({module(f) for f in files if f and f not in IGNORE and '__pycache__' not in f and os.path.exists(f)})
    uncovered = [u for u in units if not any(m == u or m.startswith(u + '/') for m in named)]
    for u in uncovered: print(f'uncovered      {u}')
    for p in sorted(pending):
        if os.path.exists(p): print(f'landed         {p} (pending path exists: make it a link)')
    print(f'{len(units)} modules, {len(uncovered)} uncovered')
    return 1 if dead or uncovered else 0


if __name__ == '__main__':
    sys.exit(main())
