"""Transcribe Thai speech with faster-whisper, to take in supplied audio/video or to QA narration against its captions.
Setup (once): python3 -m venv .venv-whisper && .venv-whisper/bin/pip install faster-whisper
  The first run downloads the chosen model from Hugging Face (large-v3-turbo about 1.6 GB, small about 0.5 GB) into the user cache.
Transcribe:  .venv-whisper/bin/python scripts/transcribe.py <audio-or-video> [--model small] [--language th]
  writes out/transcripts/<name>.srt and <name>.json (segments with word times) and prints the text.
Check:       .venv-whisper/bin/python scripts/transcribe.py public/narration/<ID>.mp3 --timeline scripts/<episode>/<variant>/narration-timeline.json
  assigns each recognised word to the slot whose time window holds it (cumulative durationSec) and prints, per slot,
  text similarity to its spoken text and how far speech starts after / ends before the slot window.
  Use the narration timeline (the spoken text), not the caption timeline: captions are usually shorter than the speech.
  small mis-hears Thai badly (similarity 0.0-0.6 on the pool-depth narration); large-v3-turbo reached 0.84-1.00.
Whisper's Thai word times are rough and it spells numbers and loanwords its own way: use the report to find lines to listen to,
not as proof that a line is wrong, and never as final caption word timing.
"""
import argparse
import difflib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOISE = re.compile(r'[\s\.\,\!\?…"\'()\-“”‘’]+')


def normalise(text):
    return NOISE.sub('', text).lower()


def srt_time(seconds):
    ms = round(seconds * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'


def transcribe(path, model_name, language):
    from faster_whisper import WhisperModel
    model = WhisperModel(model_name, device='cpu', compute_type='int8')
    segments, info = model.transcribe(str(path), language=language, word_timestamps=True, vad_filter=True, condition_on_previous_text=False)
    result = [{'start': s.start, 'end': s.end, 'text': s.text.strip(), 'words': [{'start': w.start, 'end': w.end, 'word': w.word} for w in s.words or []]} for s in segments]
    return result, info


def check(segments, timeline):
    words = [w for s in segments for w in s['words']]
    start = 0.0
    for index, scene in enumerate(timeline):
        end = start + scene['durationSec']
        inside = [w for w in words if start <= (w['start'] + w['end']) / 2 < end]
        heard = ''.join(w['word'] for w in inside)
        expected = scene.get('subtitle', '')
        if not normalise(expected) and not inside:
            print(f'Slot {index + 1}: {start:5.1f}-{end:5.1f} s  silent, no subtitle')
        else:
            ratio = difflib.SequenceMatcher(None, normalise(expected), normalise(heard)).ratio()
            first = f'{inside[0]["start"] - start:+.2f}' if inside else 'n/a'
            last = f'{end - inside[-1]["end"]:+.2f}' if inside else 'n/a'
            flag = '  <- listen' if ratio < 0.7 else ''
            print(f'Slot {index + 1}: {start:5.1f}-{end:5.1f} s  match {ratio:.2f}  speech starts {first} s after slot start, ends {last} s before slot end{flag}')
            if ratio < 0.7:
                print(f'    subtitle: {expected}\n    heard:    {heard}')
        start = end
    print(f'Slots cover {start:.1f} s; recognised audio ends at {segments[-1]["end"]:.1f} s' if segments else 'No speech recognised')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('media')
    parser.add_argument('--model', default='large-v3-turbo', help='faster-whisper model name (large-v3-turbo, large-v3, small)')
    parser.add_argument('--language', default='th')
    parser.add_argument('--timeline', help='narration timeline whose subtitles are the spoken text (check mode)')
    args = parser.parse_args()
    media = Path(args.media)
    segments, info = transcribe(media, args.model, args.language)
    out = ROOT / 'out' / 'transcripts'
    out.mkdir(parents=True, exist_ok=True)
    (out / f'{media.stem}.json').write_text(json.dumps({'model': args.model, 'language': info.language, 'duration': info.duration, 'segments': segments}, ensure_ascii=False, indent=1) + '\n')
    (out / f'{media.stem}.srt').write_text(''.join(f'{i}\n{srt_time(s["start"])} --> {srt_time(s["end"])}\n{s["text"]}\n\n' for i, s in enumerate(segments, 1)))
    for s in segments:
        print(f'[{s["start"]:6.2f}-{s["end"]:6.2f}] {s["text"]}')
    print(f'Wrote {out / (media.stem + ".srt")} and .json ({args.model}, {info.language}, {info.duration:.1f} s)')
    if args.timeline:
        print()
        check(segments, json.loads(Path(args.timeline).read_text()))


if __name__ == '__main__':
    main()
