export interface McpToolDefinition {
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<
      string,
      {
        type?: string;
        description?: string;
        enum?: string[];
        [key: string]: unknown;
      }
    >;
    required?: string[];
  };
  name: string;
}

export type Severity = "error" | "warn" | "info";

export interface LintIssue {
  field?: string;
  message: string;
  rule: string;
  severity: Severity;
  tool: string;
}

export interface LintResult {
  issues: LintIssue[];
  passed: boolean;
  tool: string;
}

export interface Rule {
  check: (
    tool: McpToolDefinition,
    allTools?: McpToolDefinition[]
  ) => LintIssue[];
  description: string;
  name: string;
}
