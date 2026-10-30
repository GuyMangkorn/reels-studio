<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261026-duplicate-types

- Owner: Boss for development revalidation; recorded by the coordinator from actual command results during documentation task #36.
- First observed: 26 October 2026; last checked: 26 October 2026; status: `workaround`; type: `unknown` (local dependency environment); tags: tooling / typecheck.
- Scope: checkout `codex/36-dev-findings`, baseline `1ab2ca1`, with documentation/agent-instruction changes only; Node `24.5.0`, npm `11.5.1`, TypeScript `5.8.3`; `tsconfig.json`, `node_modules/@types/`. Duplicate-directory origin remains unknown.
- Consumers: code checks in this checkout; no visually affected brief decisions/board shots yet.

<a id="อาการและหลักฐาน"></a>
## Symptoms and evidence

`npm run typecheck` exited 2 with TS2688: missing definitions for 14 implicit type libraries whose names ended in ` 2`, including `react 2`, `node 2`, `three 2` and `stats 2.js`. All 14 directories existed in `node_modules/@types/` without root `index.d.ts` or `package.json`. `tsconfig.json` did not specify a `types` list.

Reproduce with `npm run typecheck`; inspect directories using the Python recipe below. These are local results on the stated date, not a guarantee of identical behavior after clean install or in another checkout.

```bash
python3 - <<'PYCODE'
from pathlib import Path
for p in sorted(Path('node_modules/@types').glob('* 2*')):
    print(p, (p / 'index.d.ts').exists(), (p / 'package.json').exists())
PYCODE
```

`npm run lint` passed in the same run. Dependency directories were not modified to prove the cause. Directory origin and clean-install outcome remain `unverified`; this documentation task did not inspect Studio, render, seeking, Short or Long.

<a id="ผลต่อการวางแผนและตรวจซ้ำ"></a>
## Planning impact and revalidation

- Film: this finding does not establish 2D/3D/hybrid feasibility. Inspect the dependency environment before using typecheck failure to justify a medium change.
- Mark: no framing/staging change is warranted by this finding; shot feasibility requires separate blockout/render evidence.
- Follow-up: Boss inspects dependency tree/clean-install state during runtime work in this checkout and reruns typecheck before changing status. Do not conceal an environment issue by changing runtime contracts.
- Rechecked: 2026-10-26 / `codex/33-catbox-foundation` HEAD `906a85e`, base `ce2a0b1`; `npm ls --depth=0` showed matching Remotion packages `4.0.538`; scanning `node_modules/@types/* 2*` found none; `npm run typecheck` and `npm run lint` exited 0; `npm test` passed 26/26.
- Result: TS2688/duplicate declarations did not occur in this checkout. Current dependency setup is a checkout-specific workaround, not proof of the original root cause or a `main` fix.
- History: 2026-10-26 / `1ab2ca1` + documentation diff → typecheck failed, lint passed → `open`; 2026-10-26 / `906a85e` after current dependency setup → no duplicate directories, typecheck/lint passed, 26 tests passed → `workaround`. No fix PR or brief/board changes yet.
- 2026-10-30 r7 (`claude/world-fog-next-steps-2817bc`, uncommitted): `npm run typecheck` exited 2 with TS2688 on `node_modules/@types/react 2`, an empty directory (no `index.d.ts` or `package.json`). Removed with `rmdir` (empty only); typecheck exit 0, lint exit 0, `npm test` 125 of 125. Same class as the 2026-10-26 entry; origin of the stray directory still unknown; status stays `workaround`.
