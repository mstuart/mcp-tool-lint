import { Rule, McpToolDefinition, LintIssue } from '../types.js';

export const requireRequiredArray: Rule = {
  name: 'require-required-array',
  description: 'inputSchema should declare a required array when properties are defined',
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const properties = tool.inputSchema?.properties;

    if (properties && Object.keys(properties).length > 0) {
      if (!Array.isArray(tool.inputSchema.required)) {
        issues.push({
          rule: 'require-required-array',
          severity: 'warn',
          message: 'inputSchema has properties but no "required" array — declare required fields explicitly (even if empty)',
          tool: tool.name,
          field: 'inputSchema.required',
        });
      }
    }

    return issues;
  },
};
