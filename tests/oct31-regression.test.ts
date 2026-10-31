import assert from "node:assert/strict";
import { it } from "node:test";
import { lintTool, lintTools } from "../dist/linter.js";
import { noDuplicateNames } from "../dist/rules/no-duplicate-names.js";
import type { McpToolDefinition, Rule } from "../dist/types.js";

const tool: McpToolDefinition = {
  description: "Returns an example result",
  inputSchema: { type: "object" },
  name: "example",
};
it("detects duplicate registrations of the same tool reference", () => {
  const results = lintTools([tool, tool], { rules: [noDuplicateNames] });
  assert.ok(results.every((result) => !result.passed));
});
it("does not inherit severity overrides for prototype-named rules", () => {
  const rule: Rule = {
    check: () => [
      {
        message: "Rejected",
        rule: "constructor",
        severity: "error",
        tool: tool.name,
      },
    ],
    description: "Custom rule",
    name: "constructor",
  };
  const result = lintTool(tool, { rules: [rule] });
  assert.equal(result.passed, false);
  assert.equal(result.issues[0].severity, "error");
});
