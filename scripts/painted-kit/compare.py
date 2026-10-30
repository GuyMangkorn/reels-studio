"""Compare two stills folders by name: byte-identical, else ffmpeg PSNR (all planes). One summary line + per-file lines on --verbose.
Usage: python3 -I scripts/painted-kit/compare.py OLD_DIR NEW_DIR"""
import hashlib, os, re, shutil, subprocess, sys

FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
old, new = sys.argv[1:3]
rows = []
for name in sorted(os.listdir(old)):
    if not name.endswith('.png'): continue
    a, b = os.path.join(old, name), os.path.join(new, name)
    if not os.path.exists(b): rows.append((name, 'MISSING')); continue
    h = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
    if h(a) == h(b): rows.append((name, 'identical')); continue
    r = subprocess.run([FFMPEG, '-v', 'info', '-i', a, '-i', b, '-lavfi', 'psnr', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.search(r'average:(\S+)', r.stderr)
    rows.append((name, 'psnr ' + (m.group(1) if m else '?')))
for n, s in rows: print(f'{n}\t{s}')
same = sum(1 for _, s in rows if s == 'identical')
print(f'SUMMARY {same}/{len(rows)} byte-identical; others: {[(n, s) for n, s in rows if s != "identical"]}')
