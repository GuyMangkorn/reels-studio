"""Before/after pixel diff for paired 1080x1920 PNG stills (HANAKO polish passes; render-g1.mjs evidence folders).
Usage: python3 -I scripts/hanako/pixel-diff.py BEFORE_DIR AFTER_DIR OUT.json
Pairs files with the same basename and runs ffmpeg blend=difference per pair. Per pair it counts RGB channel bytes whose
absolute difference is >=1, >=2, >=8 and >=32 (channels, not pixels) and the max delta. Prints one summary line.
Needs ffmpeg at /opt/homebrew/bin/ffmpeg (same decoder as scripts/caption-zone.py).
"""
import json, os, subprocess, sys

FFMPEG = '/opt/homebrew/bin/ffmpeg'
W, H = 1080, 1920
T = {thr: bytes(1 if v >= thr else 0 for v in range(256)) for thr in (1, 2, 8, 32)}


def diff_bytes(a, b):
    return subprocess.run([FFMPEG, '-loglevel', 'error', '-i', a, '-i', b, '-lavfi', 'blend=all_mode=difference',
                           '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                          check=True, capture_output=True).stdout


def main() -> None:
    before, after, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    names = sorted(n for n in os.listdir(before) if n.endswith('.png') and os.path.exists(os.path.join(after, n)))
    rows = {}
    for n in names:
        d = diff_bytes(os.path.join(before, n), os.path.join(after, n))
        assert len(d) == W * H * 3, (n, len(d))
        rows[n] = {
            'changed_channels': len(d) - d.count(0),
            'ge2': d.translate(T[2]).count(1),
            'ge8': d.translate(T[8]).count(1),
            'ge32': d.translate(T[32]).count(1),
            'max': max(d),
        }
    with open(out_path, 'w') as fh:
        json.dump(rows, fh, indent=1)
    changed = [n for n, r in rows.items() if r['changed_channels']]
    print(json.dumps({'pairs': len(rows), 'identical_pairs': len(rows) - len(changed),
                      'changed_pairs': len(changed), 'out': out_path}))


if __name__ == '__main__':
    main()
