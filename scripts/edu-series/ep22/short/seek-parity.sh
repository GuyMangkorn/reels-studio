#!/bin/sh
# EDU-EP22-SHORT W5.1 seek-parity and determinism check (Boss): renders the first, middle and last frame of every shot clean (no guides, no tag)
# three ways on one Chrome each: A = the shot's own composition EDU22-<shot> at L, B = EDU22-SEQ at G = start + L in reverse order (direct seek,
# no state), C = A again (A/A noise floor); then compares A-B and A-C with scripts/paint-bench-compare.mjs (PSNR, max channel difference).
#   sh scripts/edu-series/ep22/short/seek-parity.sh <version>
V=${1:-p1}
D=out/edu22/parity/$V
mkdir -p "$D/A" "$D/B" "$D/C" out/logs
D=$D node --import tsx -e '
import("./src/painted/edu22/shots/index.ts").then((m) => {
  const S = m.EDU22_SHOTS ?? m.default.EDU22_SHOTS, d = process.env.D, a = [], b = [], c = [];
  for (const r of S) for (const L of [...new Set([0, Math.floor((r.len - 1) / 2), r.len - 1])]) {
    const G = String(r.start + L).padStart(4, "0");
    a.push(`EDU22-${r.id} ${L} ${d}/A/f${G}.png`); c.push(`EDU22-${r.id} ${L} ${d}/C/f${G}.png`); b.push(`EDU22-SEQ ${r.start + L} ${d}/B/f${G}.png`);
  }
  const fs = require("node:fs");
  fs.writeFileSync(`${d}/A.txt`, a.join("\n") + "\n"); fs.writeFileSync(`${d}/B.txt`, b.reverse().join("\n") + "\n"); fs.writeFileSync(`${d}/C.txt`, c.join("\n") + "\n");
});' 
P='{"guides":false,"tag":false}'
for k in A B C; do node scripts/stills.mjs src/painted/edu22/shots-index.tsx --props="$P" < "$D/$k.txt" > "out/logs/edu22-parity-$V-$k.log" 2>&1; done
node scripts/paint-bench-compare.mjs "$D/A" "$D/B" > "$D/A-B.txt" 2>&1; node scripts/paint-bench-compare.mjs "$D/A" "$D/C" > "$D/A-C.txt" 2>&1
echo "A-B:"; tail -4 "$D/A-B.txt"; echo "A-C:"; tail -4 "$D/A-C.txt"
