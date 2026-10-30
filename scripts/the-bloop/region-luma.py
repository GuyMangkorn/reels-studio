"""Display luma of named regions in a BLOOP frame (Boss, pass 3 acceptance: FR04 band lumas, FR09 haze, FR10 hydrophone).

Usage: python3 -I scripts/the-bloop/region-luma.py FRAME.png REGIONS.json
REGIONS.json: {"name": {"polys": [[[x, y], ...], ...], "minus": [[[x, y], ...], ...], "bands": [0, 0.17, 0.45, 0.72, 0.86, 1]}}
- polys: the region is the union of these polygons (even-odd within each polygon, union across polygons);
- minus: polygons removed from the region (for rings: outer minus inner);
- bands: optional depth fractions over the first polygon's y range; each band reports its own mean.
Luma is Rec. 709 on the display (sRGB) values: Y = 0.2126 R + 0.7152 G + 0.0722 B, scaled to 0..1 (not linearised).
Rasterises with pixel centres (x + 0.5, y + 0.5). Decodes the PNG through ffmpeg (rgb24, 1080 x 1920). Prints one JSON object.
"""
import json
import subprocess
import sys

W, H = 1080, 1920


def rgb(path):
    data = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
    if len(data) != W * H * 3:
        sys.exit(f"{path}: expected {W}x{H}")
    return data


def spans(poly, y):
    """Filled x-intervals of one polygon on the scanline at pixel row y (pixel centre y + 0.5)."""
    yc = y + 0.5
    xs = []
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 <= yc < y2) or (y2 <= yc < y1):
            xs.append(x1 + (yc - y1) * (x2 - x1) / (y2 - y1))
    xs.sort()
    return [(xs[k], xs[k + 1]) for k in range(0, len(xs) - 1, 2)]


def mask_rows(polys, y):
    """Set of pixel x indices covered by the union of polygons at row y."""
    cover = set()
    for poly in polys:
        for a, b in spans(poly, y):
            for x in range(max(0, int(a + 0.5)), min(W, int(b + 0.5))):
                cover.add(x)
    return cover


def bbox(polys):
    xs = [p[0] for poly in polys for p in poly]
    ys = [p[1] for poly in polys for p in poly]
    return min(xs), min(ys), max(xs), max(ys)


def region_stats(data, spec, y_lo=None, y_hi=None):
    polys = spec["polys"]
    minus = spec.get("minus", [])
    x0, y0, x1, y1 = bbox(polys)
    if y_lo is not None:
        y0, y1 = y_lo, y_hi
    total = 0.0
    count = 0
    for y in range(max(0, int(y0)), min(H, int(y1) + 1)):
        cover = mask_rows(polys, y)
        if not cover:
            continue
        drop = mask_rows(minus, y) if minus else set()
        row = y * W * 3
        for x in cover:
            if x in drop:
                continue
            i = row + x * 3
            total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
            count += 1
    return (total / count / 255.0) if count else None, count


def main():
    frame, regions_path = sys.argv[1], sys.argv[2]
    data = rgb(frame)
    with open(regions_path, encoding="utf-8") as fh:
        regions = json.load(fh)
    out = {"frame": frame, "regions": {}}
    for name, spec in regions.items():
        mean, n = region_stats(data, spec)
        entry = {"mean": round(mean, 4) if mean is not None else None, "pixels": n}
        if spec.get("bands"):
            ys = [p[1] for p in spec["polys"][0]]
            lo, hi = min(ys), max(ys)
            bands = []
            fr = spec["bands"]
            for a, b in zip(fr, fr[1:]):
                m, c = region_stats(data, spec, lo + a * (hi - lo), lo + b * (hi - lo))
                bands.append({"from": a, "to": b, "mean": round(m, 4) if m is not None else None, "pixels": c})
            entry["bands"] = bands
        out["regions"][name] = entry
    print(json.dumps(out))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main()
