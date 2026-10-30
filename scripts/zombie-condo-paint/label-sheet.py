#!/usr/bin/env python3
"""Labelled review sheet (preview-label rule, docs/boss-asset-workflow.md#preview-labels): tiles of frames at a fixed width, each with its
own label lines, rendered by headless Chrome (this worktree has no ffmpeg drawtext and no PIL; DF-20261030-zcpaint-qa-label-sheet).
Usage: python3 -I scripts/zombie-condo-paint/label-sheet.py MANIFEST.tsv OUT.png [--cols 3] [--width 540] [--title TEXT]
MANIFEST.tsv: one tile per line, TAB-separated: FRAME.png <TAB> label line 1 <TAB> label line 2. Lines starting with # are skipped.
Frames are 1080x1920 (9:16). Writes OUT.html beside OUT.png (the page the screenshot was taken from)."""
import argparse
import html
import os
import subprocess

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PAD = 16
LABEL_H = 64


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('manifest')
    ap.add_argument('out')
    ap.add_argument('--cols', type=int, default=3)
    ap.add_argument('--width', type=int, default=540)
    ap.add_argument('--title', default='')
    a = ap.parse_args()

    with open(a.manifest, encoding='utf-8') as fh:
        rows = [line.rstrip('\n').split('\t') for line in fh if line.strip() and not line.startswith('#')]
    if any(len(r) != 3 for r in rows):
        raise SystemExit('each manifest line needs FRAME, label line 1, label line 2 (TAB-separated)')

    tile_h = round(a.width * 16 / 9)
    nrows = -(-len(rows) // a.cols)
    head = 52 if a.title else 0
    win_w = a.cols * (a.width + PAD) + PAD
    win_h = head + nrows * (LABEL_H + tile_h + PAD) + PAD + 40

    cells = []
    for frame, l1, l2 in rows:
        src = os.path.abspath(frame)
        cells.append(
            f'<div class="t"><div class="l"><b>{html.escape(l1)}</b><br>{html.escape(l2)}</div>'
            f'<img src="file://{src}" style="width:{a.width}px;height:{tile_h}px"></div>'
        )
    style = (
        'body{margin:0;background:#fff;font:15px -apple-system,Helvetica,Arial,sans-serif;color:#111}'
        f'.h{{padding:12px {PAD}px;font-size:18px;font-weight:600}}'
        f'.g{{display:grid;grid-template-columns:repeat({a.cols},{a.width}px);gap:{PAD}px;padding:0 {PAD}px {PAD}px}}'
        f'.t{{width:{a.width}px}}.l{{height:{LABEL_H - 8}px;line-height:1.3;overflow:hidden}}'
        'img{display:block;border:1px solid #888}'
    )
    title = f'<div class="h">{html.escape(a.title)}</div>' if a.title else ''
    page = f'<!doctype html><meta charset="utf-8"><style>{style}</style>{title}<div class="g">{"".join(cells)}</div>'

    out = os.path.abspath(a.out)
    page_path = os.path.splitext(out)[0] + '.html'
    with open(page_path, 'w', encoding='utf-8') as fh:
        fh.write(page)
    subprocess.run(
        [CHROME, '--headless', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=3000',
         f'--window-size={win_w},{win_h}', f'--screenshot={out}', 'file://' + page_path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    print(out)


if __name__ == '__main__':
    main()
