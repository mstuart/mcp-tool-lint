import { Rule, McpToolDefinition, LintIssue } from '../types.js';

export const requireParamDescriptions: Rule = {
  name: 'require-param-descriptions',
  description: 'Every property in inputSchema.properties should have a description',
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const properties = tool.inputSchema?.properties;

    if (!properties) return issues;

    for (const [paramName, paramDef] of Object.entries(properties)) {
      if (!paramDef.description || paramDef.description.trim().length === 0) {
        issues.push({
          rule: 'require-param-descriptions',
          severity: 'warn',
          message: `Parameter '${paramName}' has no description`,
          tool: tool.name,
          field: `inputSchema.properties.${paramName}.description`,
        });
      }
    }

    return issues;
  },
};
