"""Print Whisper words with times for a WAV. Run: /Users/mangkornkatawong/Developer/reels-creator/.venv-whisper/bin/python -I voice-words.py <wav>"""
import subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
segs, _ = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8').transcribe(np.frombuffer(pcm, dtype=np.float32), language='th', word_timestamps=True, vad_filter=False, temperature=0)
print(' '.join(f'{w.word}[{w.start:.2f}-{w.end:.2f}]' for s in segs for w in s.words))
