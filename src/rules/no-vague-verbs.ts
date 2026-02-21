import { Rule, McpToolDefinition, LintIssue } from '../types.js';

const VAGUE_PATTERNS = [
  'does',
  'handles',
  'manages',
  'works with',
  'interacts with',
  'deals with',
  'takes care of',
  'is responsible for',
  'processes',
];

const SPECIFIC_VERB_SUGGESTIONS = [
  'creates', 'returns', 'searches', 'deletes', 'updates',
  'fetches', 'sends', 'validates', 'transforms', 'filters',
];

export const noVagueVerbs: Rule = {
  name: 'no-vague-verbs',
  description: 'Description should not use vague verbs like "handles", "manages", "does"',
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const desc = (tool.description || '').toLowerCase();

    for (const pattern of VAGUE_PATTERNS) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(desc)) {
        issues.push({
          rule: 'no-vague-verbs',
          severity: 'warn',
          message: `Description uses vague verb "${pattern}". Use specific verbs like: ${SPECIFIC_VERB_SUGGESTIONS.join(', ')}`,
          tool: tool.name,
          field: 'description',
        });
        break; // One issue per tool is enough
      }
    }

    return issues;
  },
};
