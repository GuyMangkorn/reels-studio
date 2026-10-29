"""Check relative Markdown links and #anchors (GitHub heading slugs and <a id> tags).

Usage: python3 -I scripts/check-links.py [--all | FILE.md ...]
No arguments: Markdown files changed against origin/main plus untracked ones. --all: every tracked Markdown file.
Links inside code fences and external URLs are skipped. Exits 1 when a target file or anchor is missing.
"""
import os, re, subprocess, sys

LINK = re.compile(r'\]\(([^)\s]+)\)')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True).stdout.split('\n')


def prose(text):
    """Text with fenced code blocks removed."""
    return re.sub(r'^(```|~~~).*?^\1[^\n]*$', '', text, flags=re.M | re.S)


def anchors(path, cache={}):
    if path not in cache:
        text = prose(open(path, encoding='utf-8').read())
        found = set(re.findall(r'<a id="([^"]+)"', text)); seen = {}
        for heading in re.findall(r'^#{1,6} +(.+?) *#*$', text, re.M):
            slug = re.sub(r'[^\w\- ]', '', heading.strip().lower()).replace(' ', '-')
            n = seen.get(slug, 0); seen[slug] = n + 1
            found.add(slug if n == 0 else f'{slug}-{n}')
        cache[path] = found
    return cache[path]


def main(argv):
    if argv == ['--all']:
        files = [f for f in git('ls-files', '*.md') if f]
    elif argv:
        files = argv
    else:
        files = sorted({f for f in git('diff', '--name-only', 'origin/main...HEAD', '--', '*.md') + git('diff', '--name-only', '--', '*.md')
                        + git('ls-files', '--others', '--exclude-standard', '*.md') if f and os.path.exists(f)})
    problems = 0
    for f in files:
        for target in LINK.findall(prose(open(f, encoding='utf-8').read())):
            if re.match(r'^(https?:|mailto:)', target): continue
            path, _, anchor = target.partition('#')
            dest = f if not path else os.path.normpath(os.path.join(os.path.dirname(f), path))
            if not os.path.exists(dest):
                problems += 1; print(f'missing file   {f} -> {target}')
            elif anchor and dest.endswith('.md') and anchor not in anchors(dest):
                problems += 1; print(f'missing anchor {f} -> {target}')
    print(f'{len(files)} files checked, {problems} problems')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
