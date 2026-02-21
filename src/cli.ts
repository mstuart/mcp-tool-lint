#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { McpToolDefinition } from './types.js';
import { lintTools } from './linter.js';

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

function colorize(severity: string): string {
  switch (severity) {
    case 'error': return RED;
    case 'warn': return YELLOW;
    case 'info': return CYAN;
    default: return RESET;
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`${BOLD}mcp-tool-lint${RESET} - Static linter for MCP tool definitions\n`);
    console.log('Usage: mcp-tool-lint <tools.json>\n');
    console.log('Options:');
    console.log('  -h, --help     Show this help message');
    console.log('  -v, --version  Show version\n');
    console.log('The JSON file should contain a single tool object or an array of tool objects.');
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('0.1.0');
    process.exit(0);
  }

  const filePath = resolve(args[0]);
  let fileContent: string;

  try {
    fileContent = readFileSync(filePath, 'utf-8');
  } catch {
    console.error(`${RED}Error: Could not read file "${filePath}"${RESET}`);
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fileContent);
  } catch {
    console.error(`${RED}Error: Invalid JSON in "${filePath}"${RESET}`);
    process.exit(1);
  }

  const tools: McpToolDefinition[] = Array.isArray(parsed) ? parsed : [parsed];
  const results = lintTools(tools);

  let hasErrors = false;

  for (const result of results) {
    const issueCount = result.issues.length;
    const icon = result.passed ? `${GREEN}\u2713${RESET}` : `${RED}\u2717${RESET}`;
    const countLabel = issueCount === 1 ? '1 issue' : `${issueCount} issues`;

    console.log(`${icon} ${BOLD}${result.tool}${RESET} (${countLabel})`);

    for (const issue of result.issues) {
      const color = colorize(issue.severity);
      const severity = issue.severity.padEnd(5);
      console.log(`  ${color}${severity}${RESET} [${issue.rule}] ${issue.message}`);
    }

    if (!result.passed) hasErrors = true;
  }

  process.exit(hasErrors ? 1 : 0);
}

main();
