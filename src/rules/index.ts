import { Rule } from '../types.js';
import { descriptionLength } from './description-length.js';
import { requireParamDescriptions } from './require-param-descriptions.js';
import { noVagueVerbs } from './no-vague-verbs.js';
import { requireRequiredArray } from './require-required-array.js';
import { descriptionHasVerb } from './description-has-verb.js';
import { noDuplicateNames } from './no-duplicate-names.js';

export const allRules: Rule[] = [
  descriptionLength,
  requireParamDescriptions,
  noVagueVerbs,
  requireRequiredArray,
  descriptionHasVerb,
  noDuplicateNames,
];

export {
  descriptionLength,
  requireParamDescriptions,
  noVagueVerbs,
  requireRequiredArray,
  descriptionHasVerb,
  noDuplicateNames,
};
