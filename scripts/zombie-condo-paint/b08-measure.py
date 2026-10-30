"""B08-SH01 hero plate measures (VD-ZC-08 Boss acceptance, items 1-4) from one 1080 x 1920 frame.
Usage: python3 -I scripts/zombie-condo-paint/b08-measure.py FRAME.png [FRAME.png ...]
Use the bare canvas frame (`ZCPAINT-B08-SH01-BARE`, no SVG, Grade or Grain) so colours are exact; one JSON line per frame.
Masks: warm = R >= 110 and R - B >= 80 (flame tips; also lit tower faces, so never used for "fire" counts); flame core =
warm and Rec.709 luma > 0.5 and R - B >= 100 (the bright tongues FIRE[2]-[3]); silhouette = #06080a (+-1 per channel), counted
in x >= 400, y >= 1200 only; rim = R >= 180, 100 <= G <= 190, B <= 120. The silhouette/rim zone (x >= 480, y >= 1330) and the
rail top band (y 1700-1745) are excluded from the fire counts. `far_windows_core_px` counts flame-core pixels in the two far
fire windows (x 40-170 and 930-1080, y 780-900): 0 means the far fires are hidden by the near towers.
"""
import json, shutil, subprocess, sys

FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
W, H = 1080, 1920


def decoded(path):
    return subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout


def measure(path):
    raw = decoded(path)
    tip = H
    core_below_860 = 0
    core_max_y = -1
    core_below_1040 = 0
    far_core = 0
    sil = 0
    sil_min_x = sil_min_y = 10 ** 9
    for y in range(H):
        rail = 1700 <= y <= 1745
        for x in range(W):
            i = 3 * (y * W + x)
            r, g, b = raw[i], raw[i + 1], raw[i + 2]
            if abs(r - 6) <= 1 and abs(g - 8) <= 1 and abs(b - 10) <= 1 and x >= 400 and y >= 1200:
                sil += 1
                sil_min_x = min(sil_min_x, x)
                sil_min_y = min(sil_min_y, y)
            if r < 110 or r - b < 80:
                continue
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
            core = luma > 127.5 and r - b >= 100
            if (40 <= x <= 170 or 930 <= x <= 1080) and 780 <= y <= 900 and core:
                far_core += 1
            if (x >= 480 and y >= 1330) or rail:
                continue
            if 230 <= x <= 500 and y <= 470:
                tip = min(tip, y)
            if y >= 1040 and core:
                core_below_1040 += 1
            if y >= 860 and core:
                core_below_860 += 1
                core_max_y = max(core_max_y, y)
    # Rim: left edge at row 1600 (count of warm pixels left of the dark mass), top edge at column 884, right edge at row 1600.
    def rimlike(i):
        return raw[i] >= 180 and 100 <= raw[i + 1] <= 190 and raw[i + 2] <= 120
    left = sum(1 for x in range(640, 760) if rimlike(3 * (1600 * W + x)))
    right = sum(1 for x in range(1000, 1080) if rimlike(3 * (1600 * W + x)))
    top = sum(1 for y in range(1300, 1400) if rimlike(3 * (y * W + 884)))
    return {
        'frame': path,
        'flame_tip_main_y': tip,
        'flame_core_px_y_ge_860': core_below_860,
        'flame_core_max_y': core_max_y,
        'flame_core_px_y_ge_1040': core_below_1040,
        'far_windows_core_px': far_core,
        'silhouette_px_exact_in_region': sil,
        'silhouette_min_x': sil_min_x,
        'silhouette_min_y': sil_min_y,
        'rim_left_px_row1600': left,
        'rim_right_px_row1600': right,
        'rim_top_px_col884': top,
    }


for p in sys.argv[1:]:
    print(json.dumps(measure(p)))
