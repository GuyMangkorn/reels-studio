import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync, realpathSync} from 'node:fs';

const roles = readdirSync('.claude/agents').filter(file => file.endsWith('.md')).map(file => file.replace(/\.md$/, ''));

const readClaude = (role: string) => {
  const match = readFileSync(`.claude/agents/${role}.md`, 'utf8').match(/^---\nname: (.+)\ndescription: "(.+)"\ntools: .+\n(?:model: (?:sonnet|opus|haiku|claude-[a-z]+-[\d-]+)\n)?(?:effort: (?:low|medium|high|xhigh|max)\n)?---\n\n([\s\S]+)$/);
  assert.ok(match, `${role}.md has name/description/tools(/model/effort) front matter`);
  return {name: match[1], description: match[2], instructions: match[3].trim()};
};
const readCodex = (role: string) => {
  const match = readFileSync(`.codex/agents/${role}.toml`, 'utf8').match(/^name = "(.+)"\ndescription = "(.+)"\ndeveloper_instructions = """\n([\s\S]+?)"""\s*$/);
  assert.ok(match, `${role}.toml has name/description/developer_instructions`);
  return {name: match[1], description: match[2], instructions: match[3].trim()};
};

test('every role exists for Claude Code and Codex', () => {
  const codex = readdirSync('.codex/agents').filter(file => file.endsWith('.toml')).map(file => file.replace(/\.toml$/, ''));
  assert.deepEqual([...roles].sort(), [...codex].sort());
  assert.ok(roles.length >= 5);
});

test('Claude and Codex role instructions are identical', () => {
  for (const role of roles) assert.deepEqual(readClaude(role), readCodex(role), role);
});

test('OpenCode role agents match Claude (python3 -I scripts/opencode-agents.py)', () => {
  for (const role of roles) {
    const claude = readClaude(role);
    const match = readFileSync(`.opencode/agents/${role}.md`, 'utf8').match(/^---\ndescription: "(.+)"\nmode: subagent\n[\s\S]*?\n---\n\n([\s\S]+)$/);
    assert.ok(match, `.opencode/agents/${role}.md exists with description/mode front matter`);
    assert.deepEqual({description: match[1], instructions: match[2].trim()}, {description: claude.description, instructions: claude.instructions}, role);
  }
});

test('ZCode role agents match Claude (python3 -I scripts/zcode-agents.py)', () => {
  for (const role of roles) {
    const match = readFileSync(`.zcode/agents/${role}.md`, 'utf8').match(/^---\nname: (.+)\ndescription: "(.+)"\nmodel: .+\nthoughtLevel: (?:low|high|max)\ntools: \[.+\]\n---\n\n([\s\S]+)$/);
    assert.ok(match, `.zcode/agents/${role}.md exists with name/description/model/thoughtLevel/tools front matter`);
    assert.deepEqual({name: match[1], description: match[2], instructions: match[3].trim()}, readClaude(role), role);
  }
  assert.equal(realpathSync('.agents/mcp.json'), realpathSync('.mcp.json'), '.agents/mcp.json links to .mcp.json');
});

test('every document an agent references exists', () => {
  for (const role of roles) {
    for (const doc of new Set(readClaude(role).instructions.match(/docs\/[a-z-]+\.md|\.agents\/skills\/[a-z-]+\/SKILL\.md/g) ?? [])) assert.ok(existsSync(doc), `${role} references missing ${doc}`);
  }
});

test('every project skill is shared by Claude Code and Codex', () => {
  for (const skill of readdirSync('.agents/skills')) {
    const match = readFileSync(`.agents/skills/${skill}/SKILL.md`, 'utf8').match(/^---\nname: (.+)\ndescription: .+\n---\n/);
    assert.ok(match, `${skill}/SKILL.md has name/description front matter`);
    assert.equal(match[1], skill);
    assert.equal(realpathSync(`.claude/skills/${skill}`), realpathSync(`.agents/skills/${skill}`), `.claude/skills/${skill} links to .agents/skills/${skill}`);
  }
});
