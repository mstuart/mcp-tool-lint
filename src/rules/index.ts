// biome-ignore-all lint/performance/noBarrelFile: This module defines the public rules registry.
import type { Rule } from "../types.js";
import { descriptionHasVerb } from "./description-has-verb.js";
import { descriptionLength } from "./description-length.js";
import { noDuplicateNames } from "./no-duplicate-names.js";
import { noVagueVerbs } from "./no-vague-verbs.js";
import { requireParamDescriptions } from "./require-param-descriptions.js";
import { requireRequiredArray } from "./require-required-array.js";

export const allRules: Rule[] = [
  descriptionLength,
  requireParamDescriptions,
  noVagueVerbs,
  requireRequiredArray,
  descriptionHasVerb,
  noDuplicateNames,
];

export { descriptionHasVerb } from "./description-has-verb.js";
export { descriptionLength } from "./description-length.js";
export { noDuplicateNames } from "./no-duplicate-names.js";
export { noVagueVerbs } from "./no-vague-verbs.js";
export { requireParamDescriptions } from "./require-param-descriptions.js";
export { requireRequiredArray } from "./require-required-array.js";
