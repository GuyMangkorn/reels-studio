#!/bin/sh
# ZCPAINT-SHORT chunked MP4 render (Editor pass 2). Bundles src/index.ts fresh, renders frame chunks with the Remotion CLI
# (--gl=angle for painted scenes; h264 crf 18 yuv420p as scripts/render.mjs). Chunks are .mov files with PCM audio, because
# AAC chunks decode a few ms longer or shorter than their frames and the joins drifted (pass 2 first tries, 60 ms and 2 frames).
# Join: video copied, PCM audio joined sample-exactly, one AAC encode (320k, 48 kHz stereo); frame count is checked against the
# composition. Then loudness is normalized in place with scripts/loudness.mjs and the result is probed.
# Output: out/<ID>/<ID>_A_fade.mp4. Progress: out/logs/<ID>-chunks.log (per chunk) and out/logs/<ID>-chunk<NN>.log (Remotion).
# A chunk renders to a .part file and is renamed when complete; rerun the same command to resume (finished chunks are kept).
# Usage: scripts/zombie-condo-paint/render-chunks.sh ZCPAINT-SHORT-TH [FRAMES_PER_CHUNK=534]
set -e
ID=$1; CHUNK=${2:-534}
LOG=out/logs/$ID-chunks.log
CH=out/$ID/chunks-pass2
OUT=out/$ID/${ID}_A_fade.mp4
BUNDLE=out/zcpaint-editor/bundle
mkdir -p out/logs "$CH"
log() { echo "$(date '+%H:%M:%S') $*" | tee -a "$LOG"; }

npx remotion bundle src/index.ts --out-dir "$BUNDLE" > "out/logs/$ID-bundle.log" 2>&1
TOTAL=$(npx remotion compositions "$BUNDLE" 2>/dev/null | awk -v id="$ID" '$1 == id {print $4}')
[ -n "$TOTAL" ] || { log "composition $ID not found in $BUNDLE"; exit 1; }
log "start $ID frames=$TOTAL chunk=$CHUNK bundle=$BUNDLE"
START=$(date +%s)
first=0; n=0
while [ "$first" -lt "$TOTAL" ]; do
  n=$((n + 1)); NN=$(printf '%02d' "$n")
  last=$((first + CHUNK - 1)); [ "$last" -ge "$TOTAL" ] && last=$((TOTAL - 1))
  f="$CH/c$NN.mov"
  if [ -f "$f" ]; then
    log "chunk $NN frames $first-$last kept ($f)"
  else
    t0=$(date +%s)
    log "chunk $NN frames $first-$last render"
    npx remotion render "$BUNDLE" "$ID" "$f.part.mov" --frames="$first-$last" --props='{"ending":"A_fade"}' --gl=angle \
      --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=pcm-16 --concurrency=4 --overwrite > "out/logs/$ID-chunk$NN.log" 2>&1
    mv "$f.part.mov" "$f"
    log "chunk $NN done in $(( $(date +%s) - t0 ))s; last: $(tr '\r' '\n' < "out/logs/$ID-chunk$NN.log" | grep -E 'Rendered|Encoded' | tail -1) (elapsed $(( $(date +%s) - START ))s)"
  fi
  first=$((last + 1))
done

LIST="$CH/list.txt"; ALIST="$CH/alist.txt"; : > "$LIST"; : > "$ALIST"
i=1; while [ "$i" -le "$n" ]; do
  NN=$(printf '%02d' "$i")
  rem=$((TOTAL - (i - 1) * CHUNK)); fr=$CHUNK; [ "$rem" -lt "$CHUNK" ] && fr=$rem
  secs=$(awk -v f="$fr" 'BEGIN {printf "%.6f", f / 30}')
  ffmpeg -v error -y -i "$CH/c$NN.mov" -map 0:a:0 -t "$secs" -ar 48000 -ac 2 -c:a pcm_s16le "$CH/a$NN.wav"
  printf "file 'c%s.mov'\n" "$NN" >> "$LIST"; printf "file 'a%s.wav'\n" "$NN" >> "$ALIST"
  i=$((i + 1))
done
ffmpeg -v error -y -f concat -safe 0 -i "$ALIST" -c:a pcm_s16le "$CH/audio.wav"
ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -map 0:v:0 -c:v copy -an "$CH/video.mp4"
ffmpeg -v error -y -i "$CH/video.mp4" -i "$CH/audio.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 \
  -t "$(awk -v f="$TOTAL" 'BEGIN {printf "%.6f", f / 30}')" -movflags +faststart "$OUT.joined.mp4"
GOT=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$OUT.joined.mp4")
if [ "$GOT" != "$TOTAL" ]; then log "FRAME COUNT $GOT != $TOTAL; not published"; rm -f "$OUT.joined.mp4"; exit 1; fi
mv "$OUT.joined.mp4" "$OUT"
log "joined $n chunks ($TOTAL frames, PCM seams) -> $OUT"

node --input-type=module -e "import {normalizeLoudness, describeLoudness} from './scripts/loudness.mjs'; console.log(describeLoudness(await normalizeLoudness(process.argv[1])));" "$OUT" | tee -a "$LOG"
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,sample_rate,channels,start_time,nb_frames,duration -of compact "$OUT" | tee -a "$LOG"
GOT=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$OUT")
if [ "$GOT" != "$TOTAL" ]; then log "FINAL FRAME COUNT $GOT != $TOTAL after loudness; check $OUT"; exit 1; fi
log "done in $(( $(date +%s) - START ))s"
