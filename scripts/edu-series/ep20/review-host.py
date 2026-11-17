#!/usr/bin/env python3
"""Build EP20's unchanged storyboard template for standalone private hosting.

Usage: python3 -I scripts/edu-series/ep20/review-host.py --out <cache-directory>
Input: storyboards/edu-ep20/short/review-rows.json plus the shared builder/template.
Output: index.html and builder media, with UTF-8/mobile host metadata only.
"""
import argparse
from pathlib import Path
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[3]
    out = args.out.resolve()
    subprocess.run([
        sys.executable, '-I', str(root / 'scripts/storyboard-page/build.py'),
        str(root / 'storyboards/edu-ep20/short/review-rows.json'),
        '--out', str(out),
    ], check=True)
    page = out / 'index.html'
    fragment = page.read_text(encoding='utf-8')
    host = ('<!doctype html>\n<html lang="th">\n'
            '<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n')
    page.write_text(host + fragment + '\n</html>\n', encoding='utf-8')
    (out / 'preview.html').unlink(missing_ok=True)
    print(f'{page}: fixed template, UTF-8 and mobile viewport host metadata')


if __name__ == '__main__':
    main()
