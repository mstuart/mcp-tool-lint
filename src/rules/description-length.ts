import { Rule, McpToolDefinition, LintIssue } from '../types.js';

export const descriptionLength: Rule = {
  name: 'description-length',
  description: 'Tool description must be at least 20 characters (error if < 10)',
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const desc = (tool.description || '').trim();
    const len = desc.length;

    if (len < 10) {
      issues.push({
        rule: 'description-length',
        severity: 'error',
        message: `Description is too short (${len} chars, min 10)`,
        tool: tool.name,
        field: 'description',
      });
    } else if (len < 20) {
      issues.push({
        rule: 'description-length',
        severity: 'warn',
        message: `Description is too short (${len} chars, min 20)`,
        tool: tool.name,
        field: 'description',
      });
    }

    return issues;
  },
};
