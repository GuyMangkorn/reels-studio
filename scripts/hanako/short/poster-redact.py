#!/usr/bin/env python3
"""B07-SH03 FILM-CARD: store copy of the user's flyer with the title, tagline and credits blurred (and, for the 1995 poster, the child's face).

Usage: python3 -I scripts/hanako/short/poster-redact.py [--poster 1995-r3|1998-r2] [--source SRC.jpg] [--out OUT.png]
Input: the user's scan in the asset store (default $REELS_STORE/projects/HANAKO/references/user/...). The scan is never
modified. Output: OUT.png (RGB, the scan's size) and OUT.json beside it (sidecar for `store.py put`).

Presets: 1995-r3 is the 1995 Shochiku poster (1000 x 1500, 2:3) used from r3 (31 Oct 2026). 1998-r2 is the 1998 flyer
(420 x 600) that r2 shipped; kept so its derived file can be rebuilt.

Method: for each sigma group, a Gaussian blur of the scan is mixed back through the union mask of that group's
REGIONS rectangles. Each rectangle is feathered FEATHER px inward, so the blur fades out at its edge. Everything
outside the regions is the untouched scan. ffmpeg does the blur and mix (no Pillow in this checkout); Python recomputes
the union mask to count pixels for the report.

Region coordinates are source pixels of the named preset's scan. Large type (tagline, title, credits) takes sigma 12;
the 1995 child's face takes sigma 6 (soft, still reads as a child peeking through a door). The keyhole silhouette, the
door edge, the cardigan and the reflection stay outside the regions.
"""
import argparse, datetime, hashlib, json, os, shutil, subprocess, sys

FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
FFPROBE = shutil.which('ffprobe') or '/opt/homebrew/bin/ffprobe'
STORE = os.path.expanduser(os.environ.get('REELS_STORE') or '~/ReelsStore')
FEATHER = 6
PRESETS = {
    '1995-r3': {
        'source': 'projects/HANAKO/references/user/2026-10-31_b07-film-poster-toire-no-hanako-san-1995.jpg',
        'size': (1000, 1500),
        'out': 'out/hanako/film-card-poster-1995-redacted.png',
        # name, x0, y0, x1, y1 in source pixels, Gaussian sigma. Edge boxes run past the frame so no edge stays sharp.
        'regions': [
            ('tagline-top', 690, -10, 1010, 660, 20),         # あっ 花子さんだ…。, top right (keyhole top ends at x about 650)
            ('title-lockup', -10, 1070, 420, 1480, 20),        # red-framed トイレの花子さん, the Hanako-san romaji and the frame's bottom line
            ('credits-logo', 760, 1190, 1010, 1510, 12),      # staff and cast block and 百年松竹 logo, bottom right
            ('child-face', 436, 530, 542, 728, 6),            # the child actor's hair, eyes, nose, mouth and chin (source y 545-720); door edge at x about 545
        ],
        'user_words': 'user sent this as the 1995 poster after Boat found the first flyer was the 1998 sequel (new-poster option A)',
        'caution': 'title lockup, tagline and credits blurred; child actor face softened (sigma 6); no year, title or 学校の怪談 on the card (F012); identity against the credits is Boat\'s check (signoff-boat-r5 P2b), on the unblurred original',
        'identification': 'Shochiku 1995 film 『トイレの花子さん』, dir. 松岡錠司 (credits, read on the unblurred scan; not readable on the card)',
    },
    '1998-r2': {
        'source': 'projects/HANAKO/references/user/2026-10-31_b07-film-poster-shinsei-toire-no-hanako-san.jpg',
        'size': (420, 600),
        'out': 'out/hanako/film-card-poster-redacted.png',
        'regions': [
            ('tagline-top', 10, -12, 412, 54, 12),          # red tagline across the top (contains the word for ghost stories, F012)
            ('copy-mid-left', 118, 190, 212, 338, 6),       # four columns of vertical marketing copy beside the ghost
            ('title-lockup', 72, 446, 360, 560, 12),        # title lockup, SCHOOL MYSTERY line (title and year not verified)
            ('credits', 74, 548, 358, 590, 6),              # small staff and cast lines
            ('logo-bottom-right', 376, 574, 414, 592, 6),   # small logo at the bottom right
        ],
        'user_words': 'partial blur is fine (31 Oct 2026); hide the year and the title on the card',
        'caution': 'the poster film title reads 新生 (Shinsei); the release year is unverified; never show 学校の怪談 on the card (F012)',
        'identification': None,
    },
}


def weight(x, y, regions):
    """Mask value 0..1 at source pixel (x, y): the largest feathered rectangle weight over regions."""
    w = 0.0
    for _, x0, y0, x1, y1, _ in regions:
        d = min(x - x0, x1 - x, y - y0, y1 - y)
        w = max(w, min(1.0, max(0.0, d / FEATHER)))
    return w


def mask_expr(regions):
    """The union mask of `regions` as an ffmpeg geq expression (X, Y are pixel indices), 0..255."""
    terms = []
    for _, x0, y0, x1, y1, _ in regions:
        d = f'min(min(X-{x0},{x1}-X),min(Y-({y0}),{y1}-Y))'
        terms.append(f'clip({d}/{FEATHER},0,1)')
    expr = terms[0]
    for term in terms[1:]:
        expr = f'max({expr},{term})'
    return f'255*{expr}'


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def size_of(path):
    return subprocess.run([FFPROBE, '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                           '-of', 'csv=p=0', path], check=True, capture_output=True, text=True).stdout.strip().replace(',', 'x')


def pixel_counts(regions, W, H):
    """Counts over the regions' bounding box only: weight is zero outside every rectangle."""
    bx0 = max(0, min(r[1] for r in regions)); by0 = max(0, min(r[2] for r in regions))
    bx1 = min(W, max(r[3] for r in regions)); by1 = min(H, max(r[4] for r in regions))
    touched = strong = full = 0
    for y in range(by0, by1):
        for x in range(bx0, bx1):
            w = weight(x, y, regions)
            touched += w > 0
            strong += w >= .5
            full += w >= 1
    return {'frame': W * H, 'touched': touched, 'strong_50pct': strong, 'full_strength': full}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--poster', choices=sorted(PRESETS), default='1995-r3')
    ap.add_argument('--source', default=None)
    ap.add_argument('--out', default=None)
    a = ap.parse_args()
    preset = PRESETS[a.poster]
    regions = preset['regions']
    W, H = preset['size']
    source = a.source or os.path.join(STORE, preset['source'])
    out = a.out or preset['out']
    if not os.path.isfile(source):
        sys.exit(f'source not found: {source}')
    if size_of(source) != f'{W}x{H}':
        sys.exit(f'source is {size_of(source)}, preset {a.poster} needs {W}x{H} (regions are source pixels)')
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    sigmas = sorted({r[5] for r in regions})
    labels = [f'in{k}' for k in range(len(sigmas) + 1)]
    parts = [f"[0:v]format=rgba,split={len(labels)}" + ''.join(f'[{x}]' for x in labels)]
    base = labels[0]
    for k, sigma in enumerate(sigmas):
        group = [r for r in regions if r[5] == sigma]
        parts.append(f"[{labels[k + 1]}]gblur=sigma={sigma}[b{k}]")
        parts.append(f"color=c=black:s={W}x{H},format=gray,geq=lum='{mask_expr(group)}'[m{k}]")
        parts.append(f"[b{k}][m{k}]alphamerge[ba{k}]")
        parts.append(f"[{base}][ba{k}]overlay[o{k}]")
        base = f'o{k}'
    graph = ';'.join(parts)
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', source, '-filter_complex', graph, '-map', f'[{base}]',
                    '-frames:v', '1', '-pix_fmt', 'rgb24', out], check=True)
    if size_of(out) != f'{W}x{H}': sys.exit(f'unexpected output size {size_of(out)}, want {W}x{H}')
    counts = pixel_counts(regions, W, H)
    sidecar = {
        'preset': a.poster,
        'source': preset['source'],
        'source_sha256': sha256(source),
        'derived_by': 'scripts/hanako/short/poster-redact.py',
        'method': f'gaussian blur per region (sigma {", ".join(str(s) for s in sigmas)}) mixed through feathered rectangles '
                  f'(feather {FEATHER} px inward); rest of the scan unchanged',
        'output_px': [W, H],
        'regions': [{'name': n, 'shape': 'rect', 'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 'sigma': sg}
                    for n, x0, y0, x1, y1, sg in regions],
        'pixels': counts,
        'user_words': preset['user_words'],
        'caution': preset['caution'],
        'rights': 'user-supplied flyer; copyright responsibility is the user\'s',
        'created': datetime.date.today().isoformat(),
    }
    if preset['identification']: sidecar['identification'] = preset['identification']
    with open(os.path.splitext(out)[0] + '.json', 'w', encoding='utf-8') as f:
        json.dump(sidecar, f, ensure_ascii=False, indent=2); f.write('\n')
    pct = 100 * counts['touched'] / counts['frame']
    print(f"poster-redact {a.poster}: {len(regions)} regions, {counts['touched']} px touched ({pct:.1f}% of frame), "
          f"{counts['strong_50pct']} px at >=50% blur, {counts['full_strength']} px full strength -> {out}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
