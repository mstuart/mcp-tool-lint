// biome-ignore-all lint/performance/noBarrelFile: This is the package's public API entry point.
export type { LintOptions } from "./linter.js";
export { lintTool, lintTools, validateTools } from "./linter.js";
export {
  allRules,
  descriptionHasVerb,
  descriptionLength,
  noDuplicateNames,
  noVagueVerbs,
  requireParamDescriptions,
  requireRequiredArray,
} from "./rules/index.js";
export type {
  LintIssue,
  LintResult,
  McpToolDefinition,
  Rule,
  Severity,
} from "./types.js";
