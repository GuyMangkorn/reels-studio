"""WFOG-EP01-SHORT one-second pass: manifest, two 11-column sheets and a byte comparison with the previous pass.

Usage: python3 -I scripts/world-fog/pass-sheets.py --dir OUT/1s [--prev PREV/1s] [--sheets OUT]
  --dir    folder of <shot>_G<frame>.png from scripts/world-fog/stills.mjs (SS-R4: frames 0..2970 step 30, plus 2999)
  --prev   previous pass folder; prints each tile as identical / changed / new (cmp, byte-for-byte)
  --sheets folder for sheet_1s_A.png (tiles 1-44) and sheet_1s_B.png (tiles 45-88); default: the parent of --dir
Writes manifest.txt in --dir (tile order, shot IDs, G, TH review time) so every sheet tile can be named.
Tiles are 180 px wide (scripts/qa-sheet.sh), 11 columns. Labels are not burned in (no drawtext on this machine).
"""
import argparse, filecmp, os, re, subprocess, sys

ROWS = [('S01-SH01', 0), ('S01-SH02', 126), ('S02-SH01', 240), ('S02-SH02', 354), ('S02-SH03', 444), ('S02-SH04', 540),
        ('S02-SH05', 738), ('S02-SH06', 792), ('S02-SH07', 900), ('S02-SH08', 1029), ('S02-SH09', 1230), ('S02-SH10', 1410),
        ('S03-SH01', 1530), ('S03-SH02', 1656), ('S03-SH03', 1800), ('S03-SH04', 1920), ('S03-SH05', 1962), ('S03-SH06', 2034),
        ('S03-SH06A', 2070), ('S03-SH07', 2190), ('S04-SH01', 2340), ('S04-SH02', 2670), ('S04-SH03', 2790)]


def shot_of(g):
    return [s for s, g0 in ROWS if g >= g0][-1]


def review_time(g):
    s = g / 30
    return f'{int(s // 60)}:{s % 60:05.1f}'


def main():
    ap = argparse.ArgumentParser(description='WFOG-EP01-SHORT one-second pass: manifest, sheets, comparison')
    ap.add_argument('--dir', required=True)
    ap.add_argument('--prev')
    ap.add_argument('--sheets')
    a = ap.parse_args()
    files = sorted((f for f in os.listdir(a.dir) if re.fullmatch(r'S\d\d-SH\d\d[A-Z]?_G\d+\.png', f)), key=lambda f: int(re.search(r'_G(\d+)', f).group(1)))
    tiles = [(f, int(re.search(r'_G(\d+)', f).group(1))) for f in files]
    lines = [f'# WFOG-EP01-SHORT 1 s pass (production entry src/index.ts, composition WFOG-EP01-SHORT, picture only).',
             f'# sheet_1s_A.png = tiles 01-{(len(tiles) + 1) // 2:02d}, sheet_1s_B.png = tiles {(len(tiles) + 1) // 2 + 1:02d}-{len(tiles):02d} (11 columns, 180 px tiles). Clock: G composition frame at 30 fps; TH = review time.']
    for i, (f, g) in enumerate(tiles, 1):
        lines.append(f'tile {i:02d}\t{shot_of(g)}\tG{g}\tTH {review_time(g)}\t{f}')
    with open(os.path.join(a.dir, 'manifest.txt'), 'w', encoding='utf-8') as m:
        m.write('\n'.join(lines) + '\n')
    sheets = a.sheets or os.path.dirname(os.path.abspath(a.dir))
    here = os.path.dirname(os.path.abspath(__file__))
    qa_sheet = os.path.join(here, '..', 'qa-sheet.sh')
    half = (len(tiles) + 1) // 2
    for name, part in (('sheet_1s_A.png', tiles[:half]), ('sheet_1s_B.png', tiles[half:])):
        subprocess.run(['sh', qa_sheet, os.path.join(sheets, name), '--cols', '11', '--width', '180'] + [os.path.join(a.dir, f) for f, _ in part], check=True, capture_output=True)
        print('sheet', os.path.join(sheets, name), f'{len(part)} tiles')
    if a.prev:
        same = changed = new = 0
        changed_list = []
        for f, g in tiles:
            p = os.path.join(a.prev, f)
            if not os.path.exists(p):
                new += 1
            elif filecmp.cmp(os.path.join(a.dir, f), p, shallow=False):
                same += 1
            else:
                changed += 1
                changed_list.append(f'{shot_of(g)}\tG{g}')
        print(f'vs {a.prev}: identical {same}, changed {changed}, new {new}')
        shots = {}
        for f, g in tiles:
            p = os.path.join(a.prev, f)
            if os.path.exists(p):
                shots.setdefault(shot_of(g), [0, 0])[0 if filecmp.cmp(os.path.join(a.dir, f), p, shallow=False) else 1] += 1
        for s, (ok, ch) in shots.items():
            print(f'  {s}: identical {ok}, changed {ch}')


if __name__ == '__main__':
    sys.exit(main())
