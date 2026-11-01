// KSO voice lock: integrated LUFS, true peak and LRA of each file, via scripts/loudness.mjs measureLoudness (measure only).
// Run (worktree root, after npm ci): node scripts/kuchisake-onna/short/voice-lock/measure-loudness.mjs <files...> > out/.../qa/loudness.jsonl
import {measureLoudness} from '../../../loudness.mjs';

for (const file of process.argv.slice(2)) {
  const m = await measureLoudness(file);
  console.log(JSON.stringify({file: file.split('/').pop(), ...m}));
}
