#!/bin/sh
# SP02 renders: geometry check, six stills, 60-frame truck (existing PNGs of the truck are skipped; delete out/blender/zc-unit/sp02 to redo).
# Then: Blender's python -I assets/blender/zc-unit/sp02_check.py caps|caption
cd "$(dirname "$0")/../../.."
B=/Applications/Blender.app/Contents/MacOS/Blender
run() { "$B" -b --python assets/blender/zc-unit/build_sp02.py -- "$@" 2>&1 | grep -E "zc-unit\]|Traceback|Error:" | grep -v "Not freed"; }
run geometry
for s in B02 B09SH01 B09SH03 B07SH02 B07SH02mid B07SH02start; do run still $s || run still $s; done
run truck || run truck
