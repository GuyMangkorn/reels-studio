#!/usr/bin/env python3
"""EDU-EP16 mask / face height check (Editor, W5.3): top and bottom row of MASK-A latex pixels (#e3cf9a +-9, shading excluded) per frame; rule: masks above y 1160 (storyboard R05).
Usage: python3 -I scripts/edu-series/ep16/mask-bottom.py FRAME.png ...   (clean or guide frames; 1080x1920)"""
import subprocess, sys
W, H = 1080, 1920
for f in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    rows = []
    for y in range(H):
        r = raw[y * W * 3:(y + 1) * W * 3]
        n = sum(1 for i in range(0, len(r), 3) if abs(r[i] - 227) <= 9 and abs(r[i + 1] - 207) <= 9 and abs(r[i + 2] - 154) <= 9)
        if n >= 25: rows.append(y)
    print(f, ('mask rows %d-%d' % (rows[0], rows[-1]) + ('  OVER 1160' if rows[-1] > 1160 else '')) if rows else 'no mask pixels')
