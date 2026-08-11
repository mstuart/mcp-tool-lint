import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

const cliPath = join(process.cwd(), "dist", "cli.js");

const validTool = {
  description: "Retrieves a user record by unique identifier",
  inputSchema: {
    properties: {
      userId: { description: "The unique user identifier", type: "string" },
    },
    required: ["userId"],
    type: "object",
  },
  name: "get_user",
};

const invalidTool = {
  description: "bad",
  inputSchema: {
    properties: {
      id: { type: "string" },
    },
    type: "object",
  },
  name: "bad_tool",
};

function runCli(args: string[], input?: string) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf-8",
    input,
  });
}

describe("CLI", () => {
  it("prints the version from package metadata", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8")) as {
      version: string;
    };
    const result = runCli(["--version"]);

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), packageJson.version);
  });

  it("reads tool definitions from stdin when path is -", () => {
    const result = runCli(["-"], JSON.stringify(validTool));

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes("get_user"));
    assert.ok(result.stdout.includes("(0 issues)"));
  });

  it("prints stable JSON output and preserves error exit semantics", () => {
    const result = runCli(
      ["--json", "-"],
      JSON.stringify([validTool, invalidTool])
    );

    assert.equal(result.status, 1);
    const output = JSON.parse(result.stdout) as {
      version: string;
      source: string;
      summary: {
        toolCount: number;
        issueCount: number;
        errorCount: number;
        warningCount: number;
        passed: boolean;
      };
      results: Array<{ tool: string; passed: boolean }>;
    };
    assert.deepEqual(Object.keys(output), [
      "results",
      "source",
      "summary",
      "version",
    ]);
    assert.equal(output.source, "stdin");
    assert.equal(output.summary.toolCount, 2);
    assert.equal(output.summary.passed, false);
    assert.ok(output.summary.errorCount >= 1);
    assert.deepEqual(
      output.results.map((lintResult) => lintResult.tool),
      ["get_user", "bad_tool"]
    );
  });

  it("reads JSON output from a file path", () => {
    const fixture = join(
      mkdtempSync(join(tmpdir(), "mcp-tool-lint-")),
      "tools.json"
    );
    writeFileSync(fixture, JSON.stringify(validTool));

    const result = runCli(["--json", fixture]);

    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout) as {
      source: string;
      summary: { passed: boolean };
    };
    assert.equal(output.source, fixture);
    assert.equal(output.summary.passed, true);
  });
});
