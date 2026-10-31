#!/usr/bin/env bash
# Prepares a checkout after a clone, a move to a new folder or a new machine; safe to re-run.
# Usage: bash scripts/setup.sh [--no-venvs] [--repair-worktrees]
# Does: npm ci (when node_modules is missing or stale), the three local Python venvs (.venv-whisper for
# transcribe.py, out/gemini-venv for gemini-tts.py, out/voice-venv for voice-preset.py; each rebuilt only when it
# does not run, since a venv breaks when its folder moves), store.py fetch + verify ($REELS_STORE, default
# ~/ReelsStore), and with --repair-worktrees `git worktree repair` for every registered worktree.
# Prints one line per step; full logs go to out/logs/setup-*.log.
set -u
cd "$(dirname "$0")/.."
mkdir -p out/logs
venvs=1; repair=0
for a in "$@"; do case "$a" in --no-venvs) venvs=0;; --repair-worktrees) repair=1;; *) echo "unknown option $a"; exit 2;; esac; done
fail=0
step() { local name=$1; shift; if "$@" > "out/logs/setup-$name.log" 2>&1; then echo "ok    $name"; else echo "FAIL  $name (out/logs/setup-$name.log)"; fail=1; fi; }

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then step npm npm ci; else echo "ok    npm (node_modules up to date)"; fi

venv() {  # venv <dir> <import check> <packages...>
  local dir=$1 check=$2; shift 2
  if [ -x "$dir/bin/python" ] && "$dir/bin/python" -I -c "$check" 2>/dev/null; then return 0; fi
  rm -rf "${dir:?}" && python3 -m venv "$dir" && "$dir/bin/pip" install -q "$@" && "$dir/bin/python" -I -c "$check"
}
if [ $venvs = 1 ]; then
  step venv-whisper venv .venv-whisper 'import faster_whisper' 'faster-whisper==1.2.1'
  step venv-gemini venv out/gemini-venv 'import google.genai' 'google-genai>=2.25'
  step venv-voice venv out/voice-venv 'import parselmouth, pyworld, edge_tts' praat-parselmouth pyworld numpy soundfile 'setuptools<81' edge-tts==7.3.1
fi

if [ $repair = 1 ]; then
  step worktrees sh -c 'git worktree list --porcelain | sed -n "s/^worktree //p" | tail -n +2 | tr "\n" "\0" | xargs -0 git worktree repair; git worktree list | grep -c prunable | xargs test 0 -eq'
fi

step store-fetch python3 -I scripts/store.py fetch
step store-verify python3 -I scripts/store.py verify
[ $fail = 0 ] && echo "setup done" || { echo "setup finished with failures"; exit 1; }
