import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { descriptionHasVerb } from "../dist/rules/description-has-verb.js";
import { descriptionLength } from "../dist/rules/description-length.js";
import { noDuplicateNames } from "../dist/rules/no-duplicate-names.js";
import { noVagueVerbs } from "../dist/rules/no-vague-verbs.js";
import { requireParamDescriptions } from "../dist/rules/require-param-descriptions.js";
import { requireRequiredArray } from "../dist/rules/require-required-array.js";
import type { McpToolDefinition } from "../dist/types.js";

function makeTool(
  overrides: Partial<McpToolDefinition> = {}
): McpToolDefinition {
  return {
    description: "Creates a new user account in the system",
    inputSchema: {
      properties: {
        userId: { description: "The unique user identifier", type: "string" },
      },
      required: ["userId"],
      type: "object",
    },
    name: "test_tool",
    ...overrides,
  };
}

describe("description-length", () => {
  it("flags descriptions under 20 chars as warn", () => {
    const tool = makeTool({ description: "Short desc here" }); // 15 chars
    const issues = descriptionLength.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].severity, "warn");
    assert.equal(issues[0].rule, "description-length");
  });

  it("flags descriptions under 10 chars as error", () => {
    const tool = makeTool({ description: "Too short" }); // 9 chars
    const issues = descriptionLength.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].severity, "error");
  });

  it("passes descriptions of 20+ chars", () => {
    const tool = makeTool({
      description: "Creates a new user account for the system",
    });
    const issues = descriptionLength.check(tool);
    assert.equal(issues.length, 0);
  });
});

describe("require-param-descriptions", () => {
  it("flags params without description", () => {
    const tool = makeTool({
      inputSchema: {
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
        type: "object",
      },
    });
    const issues = requireParamDescriptions.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "require-param-descriptions");
    assert.ok(issues[0].message.includes("'id'"));
  });

  it("passes when all params have descriptions", () => {
    const tool = makeTool();
    const issues = requireParamDescriptions.check(tool);
    assert.equal(issues.length, 0);
  });
});

describe("no-vague-verbs", () => {
  it('flags "handles payments"', () => {
    const tool = makeTool({
      description: "Handles payments for the checkout flow",
    });
    const issues = noVagueVerbs.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "no-vague-verbs");
    assert.ok(issues[0].message.includes("handles"));
  });

  it('flags "manages" in description', () => {
    const tool = makeTool({
      description: "Manages user sessions and authentication state",
    });
    const issues = noVagueVerbs.check(tool);
    assert.equal(issues.length, 1);
    assert.ok(issues[0].message.includes("manages"));
  });

  it('passes "creates a payment record"', () => {
    const tool = makeTool({
      description: "Creates a payment record in the billing system",
    });
    const issues = noVagueVerbs.check(tool);
    assert.equal(issues.length, 0);
  });
});

describe("require-required-array", () => {
  it("flags missing required array", () => {
    const tool = makeTool({
      inputSchema: {
        properties: {
          name: { description: "User name", type: "string" },
        },
        type: "object",
      },
    });
    const issues = requireRequiredArray.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "require-required-array");
  });

  it("passes when required array is present", () => {
    const tool = makeTool();
    const issues = requireRequiredArray.check(tool);
    assert.equal(issues.length, 0);
  });

  it("passes when required array is empty", () => {
    const tool = makeTool({
      inputSchema: {
        properties: { name: { description: "Name", type: "string" } },
        required: [],
        type: "object",
      },
    });
    const issues = requireRequiredArray.check(tool);
    assert.equal(issues.length, 0);
  });
});

describe("description-has-verb", () => {
  it("flags descriptions without action verbs", () => {
    const tool = makeTool({
      description: "A utility for user data in the system",
    });
    const issues = descriptionHasVerb.check(tool);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "description-has-verb");
  });

  it("passes descriptions with action verbs", () => {
    const tool = makeTool({ description: "Creates a new user account" });
    const issues = descriptionHasVerb.check(tool);
    assert.equal(issues.length, 0);
  });
});

describe("no-duplicate-names", () => {
  it("flags two tools with same name", () => {
    const tool1 = makeTool({ name: "get_user" });
    const tool2 = makeTool({ name: "get_user" });
    const allTools = [tool1, tool2];

    const issues = noDuplicateNames.check(tool1, allTools);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].severity, "error");
    assert.equal(issues[0].rule, "no-duplicate-names");
  });

  it("passes when all names are unique", () => {
    const tool1 = makeTool({ name: "get_user" });
    const tool2 = makeTool({ name: "create_user" });
    const allTools = [tool1, tool2];

    const issues = noDuplicateNames.check(tool1, allTools);
    assert.equal(issues.length, 0);
  });
});
