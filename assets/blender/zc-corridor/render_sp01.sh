#!/bin/sh
# SP01 B01-SH01 renders: full plate eevee64 + eevee32, and an eevee256 reference window (clip F60-F71) for temporal noise.
# Each command resumes (existing PNGs are skipped); a failed run is retried once.
cd "$(dirname "$0")/../../.."
B=/Applications/Blender.app/Contents/MacOS/Blender
run() { "$B" -b --python assets/blender/zc-corridor/build.py -- "$@" 2>&1 | grep -E "zc-corridor\]|Traceback|Error:" | grep -v "Not freed"; }
run measure
for job in "render eevee64 1-150" "render eevee32 1-150" "render eevee256 61-72"; do
  run $job || run $job
done
