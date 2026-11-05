#!/bin/sh
# File every PNG of out/edu03/shots/<group> into the asset store: projects/EDU/previews/shots/ep03/w52-<GROUP>/ (e.g. sh scripts/edu03-w52-store.sh ga GA)
d="out/edu03/shots/$1"
for f in "$d"/*.png; do python3 -I scripts/store.py put "$f" "projects/EDU/previews/shots/ep03/w52-$2/$(basename "$f")" >/dev/null || echo "FAILED $f"; done
echo "stored $(ls "$d"/*.png | wc -l) files -> ~/ReelsStore/projects/EDU/previews/shots/ep03/w52-$2/"
