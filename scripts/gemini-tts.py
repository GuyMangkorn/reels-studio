"""Thai speech with emotion from Gemini TTS (Interactions API), for the gemini-tts skill.
Usage: out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Kore --style "sad, slow and quiet" --text "..." OUT.wav
       out/gemini-venv/bin/python -I scripts/gemini-tts.py voices [--gender female] [--pitch low] [--search warm]
       out/gemini-venv/bin/python -I scripts/gemini-tts.py design --name "grandma-noi" --gender female --text "..." SAMPLE.wav
Needs GEMINI_API_KEY in the environment and the local venv (not a project requirement):
  python3 -m venv out/gemini-venv && out/gemini-venv/bin/pip install 'google-genai>=2.25'
say: 48 kHz mono WAV, two-pass loudnorm to -16 LUFS (same as voice-preset.py), plus OUT.json with model, voice, style, text.
design: creates a stored prompted voice (voice_... ID, 1-year TTL from last use, 200 per project) and saves its preview.
Every call makes one attempt with no SDK retries and a --timeout (seconds, default 180). HTTP 429 / quota errors exit 3
at once with the server message (paid-tier rate limit); a timeout exits 4. Callers must not loop on either.
"""
import argparse, base64, json, subprocess, sys, tempfile
from pathlib import Path
from google import genai
from google.genai import types

MODEL = 'gemini-3.8-flash-tts'  # Flash-Lite has no Thai
LN = 'loudnorm=I=-16:TP=-1.5:LRA=11'

def status(e):
    return getattr(e, 'status_code', None) or getattr(e, 'code', None)

def is_quota(e):
    text = f'{e} {getattr(e, "body", "")}'
    return status(e) == 429 or 'RESOURCE_EXHAUSTED' in text or 'quota' in text.lower()

def is_timeout(e):
    return 'timeout' in type(e).__name__.lower() or isinstance(e, TimeoutError)

def normalize(src, out):
    probe = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', LN + ':print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
    m = json.loads(probe[probe.rindex('{'):probe.rindex('}') + 1])
    two = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af', two, '-ar', '48000', '-ac', '1', out], check=True)

def say(client, a):
    text = a.text or Path(a.text_file).read_text().strip()
    part = {'type': 'text', 'text': text}
    if a.style:
        part['annotations'] = [{'type': 'speech_metadata', 'style': a.style}]
    r = client.interactions.create(model=a.model, input=[{'type': 'user_input', 'content': [part]}],
                                   response_format={'type': 'audio'},
                                   generation_config={'speech_config': [{'voice': a.voice}]})
    with tempfile.NamedTemporaryFile(suffix='.wav') as raw:
        raw.write(base64.b64decode(r.output_audio.data)); raw.flush()
        normalize(raw.name, a.out)
    Path(a.out).with_suffix('.json').write_text(json.dumps(
        dict(model=a.model, voice=a.voice, style=a.style, text=text), ensure_ascii=False, indent=1))
    print(a.out)

def voices(client, a):
    kw = {k: [v] for k, v in (('language_code', a.lang), ('gender', a.gender), ('pitch', a.pitch)) if v}
    r = client.voices.list(**kw, **({'search': a.search} if a.search else {}), page_size=200)
    for v in r.voices or []:
        print(v.id, v.display_name, v.gender, v.pitch, getattr(v, 'accent', ''), (v.description or '')[:80], sep=' | ')

def design(client, a):
    v = client.voices.create(store=True, voice={'model': a.model, 'type': 'prompted', 'display_name': a.name,
                                                'gender': a.gender, 'language_code': 'th-TH', 'prompted': {'input': a.text}})
    Path(a.out).write_bytes(base64.b64decode(v.sample_audio.data))
    print(v.id, a.out)

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest='cmd', required=True)
s = sub.add_parser('say'); s.add_argument('out'); s.add_argument('--voice', default='Kore'); s.add_argument('--style')
g = s.add_mutually_exclusive_group(required=True); g.add_argument('--text'); g.add_argument('--text-file')
s = sub.add_parser('voices'); s.add_argument('--lang'); s.add_argument('--gender'); s.add_argument('--pitch'); s.add_argument('--search')
s = sub.add_parser('design'); s.add_argument('out'); s.add_argument('--name', required=True)
s.add_argument('--gender', required=True); s.add_argument('--text', required=True, help='voice description: age, gender, timbre, accent, baseline delivery')
for s in sub.choices.values():
    s.add_argument('--model', default=MODEL)
    s.add_argument('--timeout', type=float, default=180, help='seconds per request, no retries (default 180)')
a = p.parse_args()
# google-genai 2.34 raises attempts=0 to 1 and its interactions/voices layer counts that as one retry, so retries are
# limited to a status the API never sends (599): 429 and 5xx fail on the first response.
client = genai.Client(http_options=types.HttpOptions(timeout=int(a.timeout * 1000),
                                                     retry_options=types.HttpRetryOptions(attempts=1, http_status_codes=[599])))
try:
    {'say': say, 'voices': voices, 'design': design}[a.cmd](client, a)
except Exception as e:
    if is_quota(e):
        print(f'gemini-tts: quota or rate limit (HTTP {status(e) or 429}); not retrying. Wait for the rate limit to reset, then rerun once by hand; do not loop.\n{e}'[:1200], file=sys.stderr); sys.exit(3)
    if is_timeout(e):
        print(f'gemini-tts: no response within {a.timeout:g} s; not retrying.\n{e}', file=sys.stderr); sys.exit(4)
    raise
