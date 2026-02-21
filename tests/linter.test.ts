import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lintTool, lintTools, validateTools } from '../dist/linter.js';
import type { McpToolDefinition } from '../dist/types.js';

function makeTool(overrides: Partial<McpToolDefinition> = {}): McpToolDefinition {
  return {
    name: 'test_tool',
    description: 'Creates a new user account in the system',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'The unique user identifier' },
      },
      required: ['userId'],
    },
    ...overrides,
  };
}

describe('lintTool', () => {
  it('returns no issues for a well-defined tool', () => {
    const tool = makeTool();
    const result = lintTool(tool);
    assert.equal(result.tool, 'test_tool');
    assert.equal(result.issues.length, 0);
    assert.equal(result.passed, true);
  });

  it('returns issues for a poorly-defined tool', () => {
    const tool = makeTool({
      description: 'bad',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    });
    const result = lintTool(tool);
    assert.ok(result.issues.length > 0);
  });

  it('supports severity overrides', () => {
    const tool = makeTool({ description: 'Short desc here' }); // 15 chars -> warn
    const result = lintTool(tool, { severity: { 'description-length': 'info' } });
    const descIssue = result.issues.find(i => i.rule === 'description-length');
    assert.ok(descIssue);
    assert.equal(descIssue!.severity, 'info');
  });
});

describe('lintTools', () => {
  it('aggregates results for multiple tools', () => {
    const tools = [
      makeTool({ name: 'tool_a', description: 'Creates a resource in the system database' }),
      makeTool({ name: 'tool_b', description: 'bad' }),
    ];
    const results = lintTools(tools);
    assert.equal(results.length, 2);
    assert.equal(results[0].tool, 'tool_a');
    assert.equal(results[1].tool, 'tool_b');
    assert.ok(results[1].issues.length > 0);
  });

  it('detects duplicate names across tools', () => {
    const tools = [
      makeTool({ name: 'same_name' }),
      makeTool({ name: 'same_name' }),
    ];
    const results = lintTools(tools);
    const dupeIssues = results.flatMap(r => r.issues).filter(i => i.rule === 'no-duplicate-names');
    assert.ok(dupeIssues.length >= 1);
  });
});

describe('validateTools', () => {
  it('returns true for a clean set of tools', () => {
    const tools = [
      makeTool({ name: 'tool_a' }),
      makeTool({ name: 'tool_b' }),
    ];
    assert.equal(validateTools(tools), true);
  });

  it('returns false when any tool has error-severity issue', () => {
    const tools = [
      makeTool({ name: 'tool_a' }),
      makeTool({ name: 'tool_b', description: 'tiny' }), // < 10 chars -> error
    ];
    assert.equal(validateTools(tools), false);
  });

  it('returns true when tools only have warnings', () => {
    const tools = [
      makeTool({ name: 'tool_a', description: 'Short desc here' }), // 15 chars -> warn
    ];
    assert.equal(validateTools(tools), true);
  });
});
