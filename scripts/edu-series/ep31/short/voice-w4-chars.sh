#!/bin/zsh
# EDU-EP31 W4 character lines (ANCHOR L11, POLICE L13, WHEELER L14). Fixed bound: 3 calls, stops on first failure, no retry.
# Run: zsh -ic 'zsh scripts/edu-series/ep31/short/voice-w4-chars.sh out/ep31-voice'
set -e
PY=/Users/mangkornkatawong/Developer/reels-creator/out/gemini-venv/bin/python; O=$1; mkdir -p $O
g() { [ -f $O/$1.wav ] || $PY -I scripts/gemini-tts.py say --voice $2 --style "$3" --text "$4" $O/$1.wav; }
g L11 Charon "brisk, serious 1990s local TV news anchor, clear and even" 'ใครจำชายคนนี้ได้ แจ้งตำรวจเลยครับ'
g L13 Alnilam "flat, matter-of-fact police officer, calm and quiet" 'นี่คุณใช่ไหม'
g L14 Algenib "flat and sincere, a little confused, speaking at a normal pace" 'แต่ผมทาน้ำมะนาวแล้วนะ, ผมทาน้ำมะนาวแล้ว'
# alt take for L13 (the first take's ASR check read "เนี่ คุณจะม่ะ"): 1 extra call
g L13_b Alnilam "flat, matter-of-fact police officer asking a question, calm and quiet, speaking normally" 'นี่คุณใช่ไหม?'
