#!/bin/sh
# Offload a task to Codex (`codex exec`) so its reading, logs and retries stay out of the Claude session's context.
# Usage: scripts/codex-run.sh [--write] "PROMPT"   (default read-only sandbox; --write allows edits inside this checkout)
# Model and effort default to gpt-6.1-sol / medium; override with CODEX_MODEL and CODEX_EFFORT.
# Prints only Codex's final message; the full log goes to out/logs/. Exit 75 = Codex usage limit: the caller does the task itself.
set -e
sandbox=read-only
[ "$1" = --write ] && { sandbox=workspace-write; shift; }
[ $# -eq 1 ] || { echo "usage: $0 [--write] \"PROMPT\"" >&2; exit 2; }
model=${CODEX_MODEL:-gpt-6.1-sol}
effort=${CODEX_EFFORT:-medium}
mkdir -p out/logs
stamp=$(date +%Y%m%d-%H%M%S)
log=out/logs/codex-$stamp.log
last=out/logs/codex-$stamp.last.txt
status=0
codex exec -m "$model" -c model_reasoning_effort="\"$effort\"" -s "$sandbox" -o "$last" "$1" >"$log" 2>&1 </dev/null || status=$?
# Only a run without a final message counts: the log also echoes the prompt, which may itself mention limits.
if { [ "$status" -ne 0 ] || [ ! -s "$last" ]; } && grep -qi "usage limit" "$log"; then
  echo "codex: usage limit reached ($log)" >&2
  exit 75
fi
if [ "$status" -ne 0 ]; then
  echo "codex: exit $status ($log)" >&2
  tail -5 "$log" >&2
  exit "$status"
fi
cat "$last"
echo
echo "(log: $log)"
