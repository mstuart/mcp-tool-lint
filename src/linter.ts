import { allRules } from "./rules/index.js";
import type {
  LintIssue,
  LintResult,
  McpToolDefinition,
  Rule,
  Severity,
} from "./types.js";

export interface LintOptions {
  rules?: Rule[];
  severity?: {
    [ruleName: string]: Severity;
  };
}

export function lintTool(
  tool: McpToolDefinition,
  opts?: LintOptions,
  allTools?: McpToolDefinition[]
): LintResult {
  const rules = opts?.rules ?? allRules;
  const severityOverrides = opts?.severity ?? {};

  const issues: LintIssue[] = [];

  for (const rule of rules) {
    const ruleIssues = rule.check(tool, allTools);
    for (const issue of ruleIssues) {
      if (severityOverrides[issue.rule]) {
        issue.severity = severityOverrides[issue.rule];
      }
      issues.push(issue);
    }
  }

  return {
    issues,
    passed: !issues.some((i) => i.severity === "error"),
    tool: tool.name,
  };
}

export function lintTools(
  tools: McpToolDefinition[],
  opts?: LintOptions
): LintResult[] {
  return tools.map((tool) => lintTool(tool, opts, tools));
}

export function validateTools(
  tools: McpToolDefinition[],
  opts?: LintOptions
): boolean {
  const results = lintTools(tools, opts);
  return results.every((r) => r.passed);
}
