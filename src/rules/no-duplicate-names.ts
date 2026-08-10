import type { LintIssue, McpToolDefinition, Rule } from "../types.js";

export const noDuplicateNames: Rule = {
  check(tool: McpToolDefinition, allTools?: McpToolDefinition[]): LintIssue[] {
    const issues: LintIssue[] = [];

    if (!allTools || allTools.length <= 1) {
      return issues;
    }

    const duplicates = allTools.filter(
      (t) => t !== tool && t.name === tool.name
    );

    if (duplicates.length > 0) {
      issues.push({
        field: "name",
        message: `Duplicate tool name "${tool.name}" found`,
        rule: "no-duplicate-names",
        severity: "error",
        tool: tool.name,
      });
    }

    return issues;
  },
  description: "Tool names must be unique across the set",
  name: "no-duplicate-names",
};
