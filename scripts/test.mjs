#!/usr/bin/env node
// Test runner: shared tests always; an episode's tests only when that episode changed.
//
//   node scripts/test.mjs            shared tests + tests of episodes changed since main
//   node scripts/test.mjs --all      every test (run before a PR)
//   node scripts/test.mjs --list     print the selection and exit
//   node scripts/test.mjs <files>    exactly these files
//
// An episode test is one that imports an episode directory: src/painted/<dir> other than
// kit/ and shots/, or src/videos/<dir> other than kit-*. It runs when a file under one of
// those directories, or the test file itself, differs from the merge base with main
// (committed, uncommitted or untracked). A first line `// test-scope: shared` keeps a
// test in the shared set whatever it imports.
import {execFileSync, spawnSync} from 'node:child_process';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const all = args.includes('--all');
const listOnly = args.includes('--list');
const explicit = args.filter((a) => !a.startsWith('--'));

const isDir = (p) => {
  try {
    return statSync(path.join(root, p)).isDirectory();
  } catch {
    return false;
  }
};

/** Episode directories a test imports, as repo-relative paths. */
export const episodeDirs = (source) => {
  if (/^\/\/ test-scope: shared/m.test(source.split('\n', 3).join('\n'))) return [];
  const dirs = new Set();
  for (const m of source.matchAll(/['"]\.\.\/src\/(painted|videos)\/([\w-]+)/g)) {
    const [, area, name] = m;
    if (area === 'painted' && (name === 'kit' || name === 'shots')) continue;
    if (area === 'videos' && name.startsWith('kit-')) continue;
    const dir = `src/${area}/${name}`;
    if (isDir(dir)) dirs.add(dir);
  }
  return [...dirs];
};

const git = (...a) => execFileSync('git', a, {cwd: root, encoding: 'utf8'}).trim();

/** Files that differ from the merge base with main, or null when git cannot tell. */
const changedFiles = () => {
  try {
    let base;
    for (const ref of ['origin/main', 'main']) {
      try {
        base = git('merge-base', 'HEAD', ref);
        break;
      } catch {
        // try the next ref
      }
    }
    if (!base) return null;
    const tracked = git('diff', '--name-only', base);
    const untracked = git('ls-files', '--others', '--exclude-standard');
    return `${tracked}\n${untracked}`.split('\n').filter(Boolean);
  } catch {
    return null;
  }
};

const testFiles = readdirSync(path.join(root, 'tests'))
  .filter((f) => f.endsWith('.test.ts'))
  .sort()
  .map((f) => `tests/${f}`);

let selected;
let skipped = [];
if (explicit.length > 0) {
  selected = explicit;
} else if (all) {
  selected = testFiles;
} else {
  const changed = changedFiles();
  selected = [];
  for (const file of testFiles) {
    const dirs = episodeDirs(readFileSync(path.join(root, file), 'utf8'));
    const run =
      dirs.length === 0 ||
      changed === null ||
      changed.includes(file) ||
      dirs.some((d) => changed.some((c) => c.startsWith(`${d}/`)));
    (run ? selected : skipped).push(file);
  }
}

console.log(
  `tests: running ${selected.length} of ${testFiles.length} files` +
    (skipped.length > 0
      ? `; skipped ${skipped.length} tests of unchanged episodes (npm run test:all runs them)`
      : ''),
);
if (listOnly) {
  for (const f of selected) console.log(`run   ${f}`);
  for (const f of skipped) console.log(`skip  ${f}`);
  process.exit(0);
}

const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', ...selected], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
