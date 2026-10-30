"""Straight-bar scan for BLOOP map frames (Boss, pass 3 FR05 acceptance: no bar in any SH09 frame).

Usage: python3 -I scripts/the-bloop/bar-scan.py FRAME.png [FRAME.png ...]
For each frame, the map window rows (y 284-836) are split into 30 px column blocks. A horizontal edge is a row where the
block-mean luma changes by at least STEP (0.035, display luma) between the rows above and below it, with each side flat
(the rows 4 and 16 px above agree; the rows at and 20 px below agree), in a run of contiguous blocks. The longest such run is reported in px, with its row. A land-fill bar is a wide, straight edge, so a
long run (>= 300 px) is a bar; coastline strokes, dashes and water bands give short runs. Prints one JSON object per frame.
"""
import json
import subprocess
import sys

W, H = 1080, 1920
Y0, Y1 = 284, 836
BLOCK = 30
STEP = 0.035
GAP = 4
PERSIST = 20
ABOVE = 16


def luma_rows(path):
    data = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
    if len(data) != W * H * 3:
        sys.exit(f"{path}: expected {W}x{H}")
    return data


def block_means(data, y):
    row = y * W * 3
    out = []
    for b in range(W // BLOCK):
        total = 0
        for x in range(b * BLOCK, (b + 1) * BLOCK):
            i = row + x * 3
            total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
        out.append(total / (BLOCK * 255.0))
    return out


def scan(path):
    data = luma_rows(path)
    rows = {y: block_means(data, y) for y in range(Y0 - ABOVE, Y1 + PERSIST + 1)}
    best = (0, None)
    for y in range(Y0, Y1 + 1):
        a, b, c, d = rows[y], rows[y - GAP], rows[y + PERSIST], rows[y - ABOVE]
        run = 0
        for k in range(len(a)):
            # a bar edge is flat on both sides: the rows above agree (y-4, y-16), the rows below agree (y, y+20), and the
            # two sides differ. A dash of the dashed equator is flat on neither side, so it is not an edge.
            if abs(a[k] - b[k]) >= STEP and abs(b[k] - d[k]) < STEP / 2 and abs(a[k] - c[k]) < STEP / 2:
                run += 1
                if run * BLOCK > best[0]:
                    best = (run * BLOCK, y)
            else:
                run = 0
    return {"frame": path, "longestEdgeRunPx": best[0], "atRow": best[1], "bar": best[0] >= 300}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for frame in sys.argv[1:]:
        print(json.dumps(scan(frame)))
