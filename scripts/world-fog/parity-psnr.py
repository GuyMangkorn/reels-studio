"""WFOG-EP01-SHORT picture parity (chrome off): luma PSNR of the picture band between two stills folders.

Usage: python3 -I scripts/world-fog/parity-psnr.py --old DIR_OLD --new DIR_NEW --pairs PAIRS.json [--tsv OUT.tsv]
  --old / --new  folders of <shot>_G<frame>.png from scripts/world-fog/stills.mjs (WFOG-QA entry, labelled, chrome off)
  --pairs        JSON list of {"shot": "S02-SH04", "f": 12, "old": 849, "new": 894}; shot-local f is the same on both sides
  --tsv          full table (shot, f, old, new, PSNR y, identical); the summary goes to stdout
The label band (y < 300) and the caption-scrim band (y 1000–1300, the scrim box of the timeline's caption scrims, which
the WFOG-QA entry still draws where a caption window is) are excluded by a black box on both frames. PSNR 'inf' means the
rest of the picture band is byte-identical in decoded luma.
Stdlib only; uses ffmpeg (psnr filter). One summary line on stdout.
"""
import argparse, json, os, re, shutil, subprocess

FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
BAND = 'crop=1080:1620:0:300'
MASK = 'drawbox=x=0:y=1000:w=1080:h=300:color=black:t=fill'


def psnr_y(a, b):
    res = subprocess.run([FFMPEG, '-v', 'info', '-i', a, '-i', b, '-lavfi',
                          f'[0:v]{MASK},{BAND},format=gray[a];[1:v]{MASK},{BAND},format=gray[b];[a][b]psnr', '-f', 'null', '-'],
                         capture_output=True, text=True)
    m = re.search(r'PSNR y:(\S+)', res.stderr)
    if not m:
        raise SystemExit(f'ffmpeg gave no PSNR for {a} / {b}')
    return m.group(1)


def main():
    ap = argparse.ArgumentParser(description='WFOG-EP01-SHORT picture-band PSNR between two stills folders')
    ap.add_argument('--old', required=True)
    ap.add_argument('--new', required=True)
    ap.add_argument('--pairs', required=True)
    ap.add_argument('--tsv')
    args = ap.parse_args()
    pairs = json.load(open(args.pairs))
    rows, missing = [], 0
    for p in pairs:
        a = os.path.join(args.old, f"{p['shot']}_G{p['old']}.png")
        b = os.path.join(args.new, f"{p['shot']}_G{p['new']}.png")
        if not (os.path.exists(a) and os.path.exists(b)):
            missing += 1
            continue
        v = psnr_y(a, b)
        rows.append((p['shot'], p['f'], p['old'], p['new'], v, v == 'inf'))
    same = sum(1 for r in rows if r[5])
    finite = sorted((float(r[4]), r) for r in rows if not r[5])
    print(f'pairs {len(pairs)} compared {len(rows)} missing {missing} identical {same} '
          f'lowest {finite[0][0]:.1f} dB ({finite[0][1][0]} f{finite[0][1][1]} G{finite[0][1][3]})' if finite else
          f'pairs {len(pairs)} compared {len(rows)} missing {missing} identical {same}')
    if args.tsv:
        with open(args.tsv, 'w') as fh:
            fh.write('shot\tf\told_G\tnew_G\tpsnr_y300plus\tidentical\n')
            for r in rows:
                fh.write('\t'.join([r[0], str(r[1]), str(r[2]), str(r[3]), r[4], 'yes' if r[5] else 'no']) + '\n')


if __name__ == '__main__':
    main()
