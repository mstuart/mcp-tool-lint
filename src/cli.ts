#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lintTools } from "./linter.js";
import type { LintResult, McpToolDefinition } from "./types.js";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";

interface CliOptions {
  fileArg?: string;
  json: boolean;
}

function colorize(severity: string): string {
  switch (severity) {
    case "error":
      return RED;
    case "warn":
      return YELLOW;
    case "info":
      return CYAN;
    default:
      return RESET;
  }
}

function getVersion(): string {
  const packageJsonPath = new URL("../package.json", import.meta.url);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
    version?: unknown;
  };
  return typeof packageJson.version === "string"
    ? packageJson.version
    : "unknown";
}

function parseArgs(args: string[]): CliOptions {
  const json = args.includes("--json");
  const fileArg = args.find((arg) => arg !== "--json");
  return { fileArg, json };
}

function printHelp(): void {
  console.log(
    `${BOLD}mcp-tool-lint${RESET} - Static linter for MCP tool definitions\n`
  );
  console.log("Usage: mcp-tool-lint [--json] <tools.json|->\n");
  console.log("Options:");
  console.log("  --json         Print stable JSON output");
  console.log("  -h, --help     Show this help message");
  console.log("  -v, --version  Show version\n");
  console.log(
    "The JSON input should contain a single tool object or an array of tool objects."
  );
  console.log("Use - to read JSON from stdin.");
}

function readInput(fileArg: string): { content: string; label: string } {
  if (fileArg === "-") {
    return { content: readFileSync(0, "utf-8"), label: "stdin" };
  }

  const filePath = resolve(fileArg);
  return { content: readFileSync(filePath, "utf-8"), label: filePath };
}

function getSummary(results: LintResult[]): {
  errorCount: number;
  issueCount: number;
  passed: boolean;
  toolCount: number;
  warningCount: number;
} {
  const errorCount = results.reduce(
    (count, result) =>
      count +
      result.issues.filter((issue) => issue.severity === "error").length,
    0
  );
  const warningCount = results.reduce(
    (count, result) =>
      count + result.issues.filter((issue) => issue.severity === "warn").length,
    0
  );
  const issueCount = results.reduce(
    (count, result) => count + result.issues.length,
    0
  );
  const passed = results.every((result) => result.passed);

  return {
    errorCount,
    issueCount,
    passed,
    toolCount: results.length,
    warningCount,
  };
}

function printTextResults(results: LintResult[]): void {
  for (const result of results) {
    const resultIssueCount = result.issues.length;
    const icon = result.passed
      ? `${GREEN}\u2713${RESET}`
      : `${RED}\u2717${RESET}`;
    const countLabel =
      resultIssueCount === 1 ? "1 issue" : `${resultIssueCount} issues`;

    console.log(`${icon} ${BOLD}${result.tool}${RESET} (${countLabel})`);

    for (const issue of result.issues) {
      const color = colorize(issue.severity);
      const severity = issue.severity.padEnd(5);
      console.log(
        `  ${color}${severity}${RESET} [${issue.rule}] ${issue.message}`
      );
    }
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(getVersion());
    process.exit(0);
  }

  const { fileArg, json } = parseArgs(args);
  if (!fileArg) {
    printHelp();
    process.exit(0);
  }

  let input: { content: string; label: string };
  try {
    input = readInput(fileArg);
  } catch {
    console.error(
      `${RED}Error: Could not read file "${fileArg === "-" ? "stdin" : resolve(fileArg)}"${RESET}`
    );
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(input.content);
  } catch {
    console.error(`${RED}Error: Invalid JSON in "${input.label}"${RESET}`);
    process.exit(1);
  }

  const tools: McpToolDefinition[] = Array.isArray(parsed) ? parsed : [parsed];
  const results = lintTools(tools);
  const summary = getSummary(results);

  if (json) {
    console.log(
      JSON.stringify(
        {
          results,
          source: input.label,
          summary,
          version: getVersion(),
        },
        null,
        2
      )
    );
    process.exit(summary.passed ? 0 : 1);
  }

  printTextResults(results);

  process.exit(summary.passed ? 0 : 1);
}

main();
