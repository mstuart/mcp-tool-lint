import { Rule, McpToolDefinition, LintIssue } from '../types.js';

export const noDuplicateNames: Rule = {
  name: 'no-duplicate-names',
  description: 'Tool names must be unique across the set',
  check(tool: McpToolDefinition, allTools?: McpToolDefinition[]): LintIssue[] {
    const issues: LintIssue[] = [];

    if (!allTools || allTools.length <= 1) return issues;

    const duplicates = allTools.filter(t => t !== tool && t.name === tool.name);

    if (duplicates.length > 0) {
      issues.push({
        rule: 'no-duplicate-names',
        severity: 'error',
        message: `Duplicate tool name "${tool.name}" found`,
        tool: tool.name,
        field: 'name',
      });
    }

    return issues;
  },
};
