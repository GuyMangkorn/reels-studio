#!/usr/bin/env python3 -I
"""W5.2 caption-zone check at the cue frames: for each ZC2D shot render the middle and the second-last frame of every caption cue (draft-spec.tsx),
measure the band where the text sits (columns = the caption's text width CAP_W; 1-line shot 1164:1248, 2-line 1080:1248; `lines` of draft-spec.tsx) with scripts/caption-zone.py, print one row per frame and the failures. Usage: draft-caption.py [SHOT_SUBSTR...]; out/zc2d/cap/"""
import json, os, re, subprocess, sys
src = open('src/painted/zc2kit/draft-spec.tsx').read()
ids = re.findall(r"^  '(ZC2-B\d\d-SH\w+)': \{n: (\d+)", src, re.M)
cues = {}
for m in re.finditer(r"^  '(ZC2-B\d\d-SH\w+)': \{.*?cues: (\[[^\n]*?\]), peak", src, re.M | re.S):
    cues[m.group(1)] = json.loads(m.group(2))
two = set(re.findall(r"'(ZC2-B\d\d-SH\w+)'", re.search(r"TWO_LINE = new Set\(\[(.*?)\]\)", src).group(1)))
sel = sys.argv[1:]
jobs, files = [], []
os.makedirs('out/zc2d/cap', exist_ok=True)
for sid, n in ids:
    if sel and not any(s in sid for s in sel): continue
    for a, b in cues.get(sid, []):
        for f in sorted({(a + b) // 2, min(b, int(n)) - 2}):
            o = f'out/zc2d/cap/{sid[4:]}-{f}.png'; jobs.append(f'ZC2D-{sid[4:]} {f} {o}'); files.append(o)
r = subprocess.run(['node', 'scripts/stills.mjs', 'src/painted/zc2kit/draft-index.ts'], input='\n'.join(jobs) + '\n', text=True, capture_output=True)
open('out/logs/draft-caption.log', 'w').write(r.stdout + r.stderr)
capw = {k: int(v) for k, v in re.findall(r"'(ZC2-B\d\d-SH\w+)': (\d+)", re.search(r"CAP_W: Record<string, number> = \{(.*?)\};", src, re.S).group(1))}
res, groups = {}, {}
for f in files:
    b = os.path.basename(f).split('-'); sid = f'ZC2-{b[0]}-{b[1]}'
    w = capw.get(sid, 760); x = f'{max(0, 540 - w // 2)}:{min(1080, 540 + w // 2)}'  # measured columns = the caption's text width (CAP_W)
    groups.setdefault(('1080:1248' if sid in two else '1164:1248', x), []).append(f)
for (band, x), fs in groups.items(): res.update(json.loads(subprocess.run(['python3', '-I', 'scripts/caption-zone.py', '--band', band, '--x', x] + fs, text=True, capture_output=True).stdout))
bad = 0
for f in files:
    v = res[f]; ok = v.get('pass', v.get('ok'))
    print(os.path.basename(f), {k: (round(x, 3) if isinstance(x, float) else x) for k, x in v.items()})
    bad += 0 if ok else 1
print('FAIL' if bad else 'ALL PASS', bad, 'of', len(files))
