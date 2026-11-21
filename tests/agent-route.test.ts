import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

// Runtime role routing (scripts/agent-route.py): the routing file, the Agent-tool hook and the provider command.
const dir = mkdtempSync(join(tmpdir(), 'agent-route-'));
const routing = join(dir, 'routing.json');
const run = (args: string[], input = '') =>
  spawnSync('python3', ['-I', 'scripts/agent-route.py', ...args], {
    input, encoding: 'utf8', env: {...process.env, REELS_ROUTING: routing, CLAUDE_PROJECT_DIR: process.cwd()},
  });
const hook = (tool_input: Record<string, string>) => {
  const out = run(['hook'], JSON.stringify({tool_name: 'Agent', tool_input})).stdout.trim();
  return out ? JSON.parse(out).hookSpecificOutput : null;
};

test('an unrouted role passes the hook and shows its pinned model', () => {
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'build'}), null);
  assert.match(run(['show']).stdout, /boss-apply\s+claude\s+claude-sonnet-5-5\s+medium/);
});

test('set writes the route with the provider defaults; the hook then sends the role to the provider', () => {
  assert.equal(run(['set', 'boss-apply', 'codex']).status, 0);
  assert.deepEqual(JSON.parse(readFileSync(routing, 'utf8')), {version: 1, routes: {'boss-apply': {provider: 'codex'}}});
  assert.match(run(['show']).stdout, /boss-apply\s+codex\s+gpt-6\.2-sol\s+medium\s+\(routed\)/);
  const denied = hook({subagent_type: 'boss-apply', prompt: 'build'});
  assert.equal(denied.permissionDecision, 'deny');
  assert.match(denied.permissionDecisionReason, /agent-route\.py run boss-apply/);
  assert.equal(hook({subagent_type: 'boss', prompt: 'build'}), null, 'other roles are untouched');
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'routing-fallback: usage limit\nbuild'}), null);
});

test('run builds the provider command from the route and puts the role instructions before the brief', () => {
  run(['set', 'boss-apply', 'codex', '--model', 'gpt-test', '--effort', 'high']);
  const brief = join(dir, 'brief.md');
  writeFileSync(brief, 'File the EP99 outfits.');
  const result = run(['run', 'boss-apply', brief, '--dry-run', '--image', 'a.png']);
  assert.equal(result.status, 0, result.stderr);
  const {argv, prompt} = JSON.parse(result.stdout);
  assert.deepEqual(argv.slice(0, 8), ['codex', 'exec', '-m', 'gpt-test', '-c', 'model_reasoning_effort="high"', '-s', 'workspace-write']);
  assert.deepEqual(argv.slice(-3), ['-i', 'a.png', '-']);
  const text = readFileSync(prompt, 'utf8');
  assert.match(text, /You are Boss on its second pin/);
  assert.ok(text.indexOf('You are Boss') < text.indexOf('File the EP99 outfits.'));
  assert.match(text, /Ran on: codex \/ gpt-test \/ high/);
});

test('a claude route asks for the model on the Agent call and accepts a matching call', () => {
  run(['set', 'boss-apply', 'claude', '--model', 'opus']);
  const denied = hook({subagent_type: 'boss-apply', prompt: 'build'});
  assert.match(denied.permissionDecisionReason, /model: "opus"/);
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'build', model: 'opus'}), null);
  run(['set', 'boss-apply', 'claude', '--model', 'sonnet']);
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'build'}), null, 'already the pinned model');
});

test('clear returns the role to its pinned agent; bad input is refused and a broken file never blocks', () => {
  run(['clear', 'boss-apply']);
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'build'}), null);
  assert.notEqual(run(['run', 'boss-apply', '-', '--dry-run']).status, 0, 'a role on Claude has no provider run');
  assert.notEqual(run(['set', 'boss-apply', 'nope']).status, 0);
  assert.notEqual(run(['set', 'no-such-role', 'codex']).status, 0);
  assert.notEqual(run(['set', 'boss-apply', 'codex', '--model', 'a b;rm']).status, 0, 'model ids are plain tokens');
  writeFileSync(routing, '{broken');
  assert.equal(hook({subagent_type: 'boss-apply', prompt: 'build'}), null);
});
