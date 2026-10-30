#!/bin/sh
# ZCPAINT labelled review sheet (Boss pass 16, preview-label rule): each tile is a frame scaled to 540 px wide with an ASCII label
# (shot ID, clock and frame) burned in. This ffmpeg has no drawtext and PIL is absent, so the sheet is an HTML page captured by Chrome
# headless (DF-20261030-zcpaint-qa-label-sheet). Labels are ASCII; put Thai text on the page itself, not in this helper.
# Usage: scripts/zombie-condo-paint/label-sheet.sh OUT.png COLS "LABEL|FRAME.png" ...
# Writes OUT.png (tiles at 540 px), OUT.html (the page) and OUT-view.png (about 900 px longest side, `sips -Z 900`).
set -e
OUT=$1; COLS=$2; shift 2
HTML="${OUT%.png}.html"
VIEW="${OUT%.png}-view.png"
TILE=540; H=960; PAD=8; BAR=44
N=$#
ROWS=$(( (N + COLS - 1) / COLS ))
W=$(( COLS * (TILE + PAD) + PAD ))
HT=$(( ROWS * (H + BAR + PAD) + PAD ))
{
  echo '<!doctype html><html><head><meta charset="utf-8"><style>'
  echo "body{margin:0;background:#202020;width:${W}px;height:${HT}px;position:relative;font-family:Menlo,monospace}"
  echo ".t{position:absolute;width:${TILE}px}"
  echo ".l{height:${BAR}px;line-height:${BAR}px;color:#fff;background:#000;font-size:22px;padding-left:8px;white-space:nowrap;overflow:hidden}"
  echo ".t img{display:block;width:${TILE}px;height:${H}px}"
  echo '</style></head><body>'
  i=0
  for spec in "$@"; do
    label=${spec%%|*}; file=${spec#*|}
    case "$file" in /*) abs=$file ;; *) abs="$(pwd)/$file" ;; esac
    col=$(( i % COLS )); row=$(( i / COLS ))
    x=$(( PAD + col * (TILE + PAD) )); y=$(( PAD + row * (H + BAR + PAD) ))
    echo "<div class=\"t\" style=\"left:${x}px;top:${y}px\"><div class=\"l\">${label}</div><img src=\"file://${abs}\"></div>"
    i=$(( i + 1 ))
  done
  echo '</body></html>'
} > "$HTML"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars \
  --window-size="${W},${HT}" --allow-file-access-from-files --screenshot="$(pwd)/$OUT" "file://$(pwd)/$HTML" > /dev/null 2>&1
sips -Z 900 "$OUT" --out "$VIEW" > /dev/null
echo "$OUT"
echo "$VIEW"
