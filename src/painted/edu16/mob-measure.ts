import {mobMin, MAN6, MOB13, MOB6, WOMAN13} from './mob';

// EDU-EP16 W5.2: per-frame minimum crow-to-head distance for shot 6 (S01-B01-SH06, global 339-407, masked MAN) and shot 13 (S01-B03-SH03, global 733-837,
// masked WOMAN). Rule: every following crow stays > 10 m (straight line in P) from the masked walker's head on every frame. Feet point perched, body centre
// in the air. Usage: npx tsx src/painted/edu16/mob-measure.ts [--all]   (--all prints every frame; default prints every 6th and the minimum)
const all = process.argv.includes('--all');
let fail = 0;
for (const [name, g0, birds, head, len] of [['S01-B01-SH06', 339, MOB6, MAN6, 69], ['S01-B03-SH03', 733, MOB13, WOMAN13, 105]] as const) {
  const rows = mobMin(birds, head, len);
  const m = rows.reduce((a, r) => (r.minM < a.minM ? r : a));
  console.log(`${name} (global ${g0}-${g0 + len - 1}), ${birds.length} birds: min over all frames ${m.minM.toFixed(2)} m at +${m.n} (global ${g0 + m.n}), bird ${m.who}; ${m.minM > 10 ? 'PASS (> 10 m)' : 'FAIL (<= 10 m)'}`);
  for (const r of rows) if (all || r.n % 6 === 0 || r.n === len - 1 || r.minM <= 10.2) console.log(`  +${String(r.n).padStart(3)}  g${g0 + r.n}  min ${r.minM.toFixed(2)} m  (${r.who})${r.minM <= 10 ? '  <= 10 m !!' : ''}`);
  if (m.minM <= 10) fail++;
}
process.exit(fail ? 1 : 0);
