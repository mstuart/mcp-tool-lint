import assert from "node:assert/strict";
import { it } from "node:test";
import { lintTool } from "../dist/linter.js";
import type { LintIssue, McpToolDefinition, Rule } from "../dist/types.js";

const tool: McpToolDefinition = {
  description: "Example tool",
  inputSchema: { type: "object" },
  name: "example",
};
function ruleFor(issue: LintIssue): Rule {
  return {
    check: () => [issue],
    description: "Reusable custom issue",
    name: issue.rule,
  };
}

it("severity overrides do not alter reusable custom rule findings", () => {
  const issue: LintIssue = {
    message: "Bad tool",
    rule: "custom",
    severity: "error",
    tool: tool.name,
  };
  const rule = ruleFor(issue);
  const first = lintTool(tool, { rules: [rule], severity: { custom: "info" } });
  assert.equal(first.passed, true);
  assert.equal(first.issues[0].severity, "info");
  assert.equal(issue.severity, "error");
  assert.equal(lintTool(tool, { rules: [rule] }).passed, false);
});

it("supports frozen custom findings when overriding severity", () => {
  const issue = Object.freeze<LintIssue>({
    message: "Bad tool",
    rule: "custom",
    severity: "error",
    tool: tool.name,
  });
  const result = lintTool(tool, {
    rules: [ruleFor(issue)],
    severity: { custom: "warn" },
  });
  assert.equal(result.issues[0].severity, "warn");
  assert.equal(issue.severity, "error");
});
