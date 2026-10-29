"""Measure the jar lead's vertical extent in SHIPWRECK-SHORT frames (TL02, episode-only).
Usage: python3 -I scripts/oldest-shipwreck/short/lead-height.py FRAME.png...  (bare plates, 1080x1920)
Clay mask: R > G + 22 and R > B + 45 and R > 90 (the jar washes); a row counts when it has >= 8 mask pixels.
Prints top, bottom and height in px per frame. Divers and the ship are not clay: report them separately.
"""
import subprocess, sys
for path in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    W, H = 1080, len(raw) // (1080 * 3)
    rows = []
    for y in range(H):
        row = raw[y * W * 3:(y + 1) * W * 3]
        n = sum(1 for x in range(0, W * 3, 6) if row[x] > 90 and row[x] > row[x + 1] + 22 and row[x] > row[x + 2] + 45)
        if n >= 4: rows.append(y)
    print(f"{path.split('/')[-1]}: " + (f"top {rows[0]} bottom {rows[-1]} height {rows[-1] - rows[0]}" if rows else "no clay"))
