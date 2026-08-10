import type { LintIssue, McpToolDefinition, Rule } from "../types.js";

export const requireRequiredArray: Rule = {
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const { properties } = tool.inputSchema;

    if (
      properties &&
      Object.keys(properties).length > 0 &&
      !Array.isArray(tool.inputSchema.required)
    ) {
      issues.push({
        field: "inputSchema.required",
        message:
          'inputSchema has properties but no "required" array — declare required fields explicitly (even if empty)',
        rule: "require-required-array",
        severity: "warn",
        tool: tool.name,
      });
    }

    return issues;
  },
  description:
    "inputSchema should declare a required array when properties are defined",
  name: "require-required-array",
};
