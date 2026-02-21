export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, {
      type?: string;
      description?: string;
      enum?: string[];
      [key: string]: unknown;
    }>;
    required?: string[];
  };
}

export type Severity = 'error' | 'warn' | 'info';

export interface LintIssue {
  rule: string;
  severity: Severity;
  message: string;
  tool: string;
  field?: string;
}

export interface LintResult {
  tool: string;
  issues: LintIssue[];
  passed: boolean;
}

export interface Rule {
  name: string;
  description: string;
  check(tool: McpToolDefinition, allTools?: McpToolDefinition[]): LintIssue[];
}
