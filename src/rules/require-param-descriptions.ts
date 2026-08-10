import type { LintIssue, McpToolDefinition, Rule } from "../types.js";

export const requireParamDescriptions: Rule = {
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const { properties } = tool.inputSchema;

    if (!properties) {
      return issues;
    }

    for (const [paramName, paramDef] of Object.entries(properties)) {
      if (!paramDef.description || paramDef.description.trim().length === 0) {
        issues.push({
          field: `inputSchema.properties.${paramName}.description`,
          message: `Parameter '${paramName}' has no description`,
          rule: "require-param-descriptions",
          severity: "warn",
          tool: tool.name,
        });
      }
    }

    return issues;
  },
  description:
    "Every property in inputSchema.properties should have a description",
  name: "require-param-descriptions",
};
