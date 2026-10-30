"""Pixel metrics for BLOOP plate QA (Boss): PSNR between two frames, and dark-pixel coverage of a rectangle.

Usage:
  python3 -I scripts/the-bloop/frame-metrics.py psnr A.png B.png
  python3 -I scripts/the-bloop/frame-metrics.py dark FRAME.png --rect x0 y0 x1 y1 [--exclude x0 y0 x1 y1 ...] [--thr 8]
Decodes PNG through ffmpeg (rgb24, 1080x1920 expected). Prints one JSON object. Reads only the paths it is given.
PSNR is 'inf' for identical frames. Dark coverage counts pixels with max(R, G, B) <= thr inside --rect and outside every
--exclude rectangle, reported as a fraction of the counted pixels.
"""
import argparse
import json
import math
import subprocess
import sys

W, H = 1080, 1920


def rgb(path):
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    data = subprocess.run(cmd, check=True, capture_output=True).stdout
    if len(data) != W * H * 3:
        sys.exit(f"{path}: expected {W}x{H}, got {len(data) // 3} pixels")
    return data


def psnr(a, b):
    total = 0
    worst = 0
    for x, y in zip(a, b):
        d = x - y
        total += d * d
        if abs(d) > worst:
            worst = abs(d)
    mse = total / len(a)
    value = float("inf") if mse == 0 else 10 * math.log10(255 * 255 / mse)
    return {"psnrDb": value if value == float("inf") else round(value, 2), "maxLevelDiff": worst}


def dark(data, rect, excludes, thr):
    x0, y0, x1, y1 = rect
    counted = 0
    dark_count = 0
    for y in range(max(0, y0), min(H, y1)):
        row = y * W
        for x in range(max(0, x0), min(W, x1)):
            if any(ex0 <= x < ex1 and ey0 <= y < ey1 for ex0, ey0, ex1, ey1 in excludes):
                continue
            i = (row + x) * 3
            counted += 1
            if max(data[i], data[i + 1], data[i + 2]) <= thr:
                dark_count += 1
    return {"rect": rect, "excludes": excludes, "thr": thr, "counted": counted, "darkFraction": round(dark_count / counted, 4) if counted else None}


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="mode", required=True)
    p = sub.add_parser("psnr")
    p.add_argument("a")
    p.add_argument("b")
    d = sub.add_parser("dark")
    d.add_argument("frame")
    d.add_argument("--rect", type=int, nargs=4, required=True)
    d.add_argument("--exclude", type=int, nargs=4, action="append", default=[])
    d.add_argument("--thr", type=int, default=8)
    args = parser.parse_args()
    if args.mode == "psnr":
        out = {"a": args.a, "b": args.b, **psnr(rgb(args.a), rgb(args.b))}
    else:
        out = {"frame": args.frame, **dark(rgb(args.frame), args.rect, args.exclude, args.thr)}
    print(json.dumps(out))


if __name__ == "__main__":
    main()
