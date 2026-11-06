#!/bin/sh
# EDU-EP03 W5.2 shot stills: sh scripts/edu03-w52-stills.sh <group-dir> <ID:l,l,l> ...  (one Chrome via stills.mjs; output out/edu03/shots/<group>/<shot>_l<l>.png)
g="$1"; shift
mkdir -p "out/edu03/shots/$g"
for spec in "$@"; do
  id="${spec%%:*}"; short=$(echo "$id" | sed 's/S01-//; s/-//g')
  for l in $(echo "${spec#*:}" | tr ',' ' '); do echo "EDU3-$id $l out/edu03/shots/$g/${short}_l$l.png"; done
done | node scripts/stills.mjs src/painted/edu03/shots-index.ts --gl=angle ${PROPS:+--props="$PROPS"} 2>&1 | tail -5
