#!/bin/sh
# EDU-EP05 W5.2 element check stills: w52-stills.sh <outdir> <COMP:frame>...   e.g. w52-stills.sh out/edu05/w52/g2 DROP2:0 DROP4:108
# Renders EDU5-CHK-<COMP> at <frame> to <outdir>/<COMP>_<frame>.png on one Chrome (scripts/stills.mjs).
out=$1; shift
mkdir -p "$out"
for a in "$@"; do printf 'EDU5-CHK-%s %s %s/%s_%s.png\n' "${a%%:*}" "${a##*:}" "$out" "${a%%:*}" "${a##*:}"; done | node scripts/stills.mjs src/painted/edu05/check-index.ts
