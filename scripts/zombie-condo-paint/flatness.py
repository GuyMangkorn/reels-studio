"""Flatness of painted areas: luma standard deviation inside boxes of a frame (lower = cleaner fill, no mottling).
Usage: python3 -I scripts/zombie-condo-paint/flatness.py FRAME.png X0 Y0 X1 Y1 [X0 Y0 X1 Y1 ...]
Prints mean luma (0-1), luma std dev (0-1, x 1000 in brackets) and the box. Reads the frame with ffmpeg (rawvideo RGB)."""
import shutil, subprocess, sys

def main():
    png, nums = sys.argv[1], [int(v) for v in sys.argv[2:]]
    ffmpeg = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
    raw = subprocess.run([ffmpeg, '-v', 'error', '-i', png, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    W = 1080
    H = len(raw) // (W * 3)
    for i in range(0, len(nums), 4):
        x0, y0, x1, y1 = nums[i:i + 4]
        vals = []
        for y in range(y0, min(y1, H)):
            row = y * W * 3
            for x in range(x0, min(x1, W)):
                o = row + x * 3
                vals.append((0.2126 * raw[o] + 0.7152 * raw[o + 1] + 0.0722 * raw[o + 2]) / 255)
        n = len(vals)
        mean = sum(vals) / n
        sd = (sum((v - mean) ** 2 for v in vals) / n) ** 0.5
        print(f'mean {mean:.3f} sd {sd:.4f} [x1000 {sd * 1000:.1f}] box {x0},{y0}-{x1},{y1}')

main()
