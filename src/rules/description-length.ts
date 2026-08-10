import type { LintIssue, McpToolDefinition, Rule } from "../types.js";

export const descriptionLength: Rule = {
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const desc = (tool.description || "").trim();
    const len = desc.length;

    if (len < 10) {
      issues.push({
        field: "description",
        message: `Description is too short (${len} chars, min 10)`,
        rule: "description-length",
        severity: "error",
        tool: tool.name,
      });
    } else if (len < 20) {
      issues.push({
        field: "description",
        message: `Description is too short (${len} chars, min 20)`,
        rule: "description-length",
        severity: "warn",
        tool: tool.name,
      });
    }

    return issues;
  },
  description:
    "Tool description must be at least 20 characters (error if < 10)",
  name: "description-length",
};
