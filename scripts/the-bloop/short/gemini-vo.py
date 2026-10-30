"""BLOOP-EP01-SHORT: generate the R5 VO with Gemini TTS, one call per beat, one voice (Editor, 2026-10-30).

The Thai text is the R5 VO from scripts/the-bloop/short/narration-timeline.json, verbatim (no inline tags, no wording
changes). Delivery is a per-beat style only (short English phrases). Voice Charon (male, low pitch; user-approved by ear
for the Thai accent on 2026-10-30). The official scripts/gemini-tts.py (main checkout) does the call and the -16 LUFS
normalization. Each call runs under zsh with the key sourced from ~/.zshrc (the key is never printed) and a 120 s alarm.
A 429 stops the run at once (no retry); any other failure is retried once. A manifest is written beside the clips.

Run from the worktree root (in the background; the run takes about a minute):
  zsh -c 'source ~/.zshrc >/dev/null 2>&1; out/gemini-venv/bin/python -I scripts/the-bloop/short/gemini-vo.py --take 1'
"""
import argparse, hashlib, json, shlex, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
GEMINI = Path('/Users/mangkornkatawong/Documents/ChatGPT/Reels Creator/scripts/gemini-tts.py')  # official script, main checkout
VENV_PY = ROOT / 'out/gemini-venv/bin/python'
OUT = ROOT / 'out/BLOOP-EP01-SHORT/gemini-vo'
VOICE = 'Charon'
MODEL = 'gemini-3.8-flash-tts'
TIMELINE = ROOT / 'scripts/the-bloop/short/narration-timeline.json'

# Style per beat: the story arc (build tension B01–B08, reveal B09, question B10). Style is delivery only.
STYLES = {
    'B01': 'excited storyteller, hooked and wide-eyed, medium pace, a quiet hook at the start',
    'B02': 'eager and curious storyteller, medium-fast, leaning in',
    'B03': 'building excitement, breathless and rising, faster on the fact',
    'B04': 'suspenseful storyteller, rising tension, quick and animated',
    'B05': 'sudden hush, slow and deliberate, a turn in the story',
    'B06': 'measured and intrigued, explaining with curiosity, slightly hushed',
    'B07': 'tense and dramatic, slow, building toward a crack in the ice',
    'B08': 'excited then knowing, a reveal with a steady rhythm, clear and calm',
    'B09': 'calm, firm and clear, a satisfying reveal, steady pace',
    'B10': 'curious and quiet, a direct suspenseful question, slow',
}


class RateLimited(Exception):
    pass


def say(text_file, style, out_wav):
    """One official-script call under zsh (key from ~/.zshrc) with a 120 s alarm. Returns (ok, stderr_tail)."""
    inner = ' '.join(shlex.quote(str(x)) for x in [
        VENV_PY, '-I', GEMINI, 'say', '--voice', VOICE, '--style', style, '--text-file', text_file, out_wav])
    cmd = f"source ~/.zshrc >/dev/null 2>&1; perl -e 'alarm 120; exec @ARGV' -- {inner}"
    r = subprocess.run(['zsh', '-c', cmd], capture_output=True, text=True)
    err = (r.stderr or '')[-400:]
    if '429' in err or 'RESOURCE_EXHAUSTED' in err or 'quota' in err.lower():
        raise RateLimited(err)
    return r.returncode == 0, err


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='')
    ap.add_argument('--take', default='1')
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    text_dir = OUT / 'text'
    text_dir.mkdir(exist_ok=True)
    slots = json.loads(TIMELINE.read_text(encoding='utf-8'))
    wanted = [s for s in args.only.split(',') if s] or [s['beat'] for s in slots]
    manifest = {'voice': VOICE, 'model': MODEL, 'take': args.take, 'normalize': 'gemini-tts.py -16 LUFS', 'clips': []}
    for slot in slots:
        beat = slot['beat']
        if beat not in wanted:
            continue
        text = slot['subtitle']
        txt = text_dir / f'{beat}.txt'
        txt.write_text(text + '\n', encoding='utf-8')
        out_wav = OUT / f'{beat}-take{args.take}.wav'
        ok, err = say(str(txt), STYLES[beat], str(out_wav))
        if not ok:
            time.sleep(5)
            ok, err = say(str(txt), STYLES[beat], str(out_wav))
        if not ok:
            raise SystemExit(f'{beat}: Gemini TTS failed twice: {err}')
        digest = hashlib.sha256(text.encode('utf-8')).hexdigest()[:16]
        manifest['clips'].append({'beat': beat, 'wav': str(out_wav.relative_to(ROOT)), 'style': STYLES[beat], 'textSha256_16': digest})
        print(f'{beat} ok -> {out_wav.name}', flush=True)
    man_path = OUT / f'manifest-take{args.take}.json'
    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'manifest {man_path}', flush=True)


if __name__ == '__main__':
    try:
        main()
    except RateLimited as e:
        print(f'STOP: HTTP 429 / quota; not retried. {e}', file=sys.stderr, flush=True)
        sys.exit(3)
