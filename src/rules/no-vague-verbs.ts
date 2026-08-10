import type { LintIssue, McpToolDefinition, Rule } from "../types.js";

const VAGUE_PATTERNS = [
  "does",
  "handles",
  "manages",
  "works with",
  "interacts with",
  "deals with",
  "takes care of",
  "is responsible for",
  "processes",
];

const SPECIFIC_VERB_SUGGESTIONS = [
  "creates",
  "returns",
  "searches",
  "deletes",
  "updates",
  "fetches",
  "sends",
  "validates",
  "transforms",
  "filters",
];

export const noVagueVerbs: Rule = {
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const desc = (tool.description || "").toLowerCase();

    for (const pattern of VAGUE_PATTERNS) {
      const regex = new RegExp(`\\b${pattern}\\b`, "i");
      if (regex.test(desc)) {
        issues.push({
          field: "description",
          message: `Description uses vague verb "${pattern}". Use specific verbs like: ${SPECIFIC_VERB_SUGGESTIONS.join(", ")}`,
          rule: "no-vague-verbs",
          severity: "warn",
          tool: tool.name,
        });
        break; // One issue per tool is enough
      }
    }

    return issues;
  },
  description:
    'Description should not use vague verbs like "handles", "manages", "does"',
  name: "no-vague-verbs",
};
