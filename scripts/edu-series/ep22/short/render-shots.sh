#!/bin/sh
# Renders EDU-EP22-SHORT plate QA stills (Boss W5.1) on one Chrome: start, middle and end of every shot plus its sheet event frames (`keys` in
# src/painted/edu22/shots/index.ts), then one 270 px qa-sheet per shot set of four shots.
#   sh scripts/edu-series/ep22/short/render-shots.sh <version> [B01-SH01 B03-SH11 ...]
# Clean frames (no guides, no tag) for scripts/caption-zone.py: GUIDES=0 sh scripts/edu-series/ep22/short/render-shots.sh <version>-clean
V=${1:-v1}; shift
OUT=out/edu22/shots/$V
mkdir -p "$OUT" out/logs
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false,"tag":false}'
OUT=$OUT node --import tsx -e '
import("./src/painted/edu22/shots/index.ts").then((m) => { const EDU22_SHOTS = m.EDU22_SHOTS ?? m.default.EDU22_SHOTS;
  const want = process.argv.slice(1), out = process.env.OUT;
  for (const r of EDU22_SHOTS) {
    if (want.length && !want.includes(r.id)) continue;
    const ks = [...new Set([0, Math.floor((r.len - 1) / 2), r.len - 1, ...r.keys])].sort((a, b) => a - b);
    for (const k of ks) console.log(`EDU22-${r.id} ${k} ${out}/${r.id}_L${String(k).padStart(3, "0")}.png`);
  }
});' "$@" > "$OUT/jobs.txt"
node scripts/stills.mjs src/painted/edu22/shots-index.tsx --props="$PROPS" < "$OUT/jobs.txt" > "out/logs/edu22-shots-$V.log" 2>&1
tail -2 "out/logs/edu22-shots-$V.log"
# one sheet per shot (its frames in order)
for id in $(cut -d' ' -f1 "$OUT/jobs.txt" | sort -u | sed 's/^EDU22-//'); do
  sh scripts/qa-sheet.sh "$OUT/sheet_$id.png" --cols 6 "$OUT/${id}"_L*.png > /dev/null 2>&1
done
ls "$OUT"/sheet_*.png | wc -l
