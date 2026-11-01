import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

test('docs/context-map.md links resolve and cover every module', () => {
  const r = spawnSync('python3', ['-I', path.resolve('scripts/context-map.py')], {encoding: 'utf8'});
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
