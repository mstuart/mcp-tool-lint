import { Rule, McpToolDefinition, LintIssue } from '../types.js';

const ACTION_VERBS = [
  'accept', 'add', 'aggregate', 'analyze', 'append', 'apply', 'authenticate',
  'build', 'calculate', 'cancel', 'capture', 'check', 'clear', 'clone', 'close',
  'collect', 'combine', 'compare', 'compile', 'compose', 'compute', 'configure',
  'connect', 'convert', 'copy', 'count', 'create', 'decode', 'decrypt', 'delete',
  'deliver', 'deploy', 'detect', 'determine', 'disable', 'disconnect', 'display',
  'download', 'emit', 'enable', 'encode', 'encrypt', 'establish', 'evaluate',
  'execute', 'export', 'extract', 'fetch', 'filter', 'find', 'flush', 'format',
  'forward', 'generate', 'get', 'grant', 'group', 'import', 'index', 'initialize',
  'inject', 'insert', 'inspect', 'install', 'invoke', 'iterate', 'join', 'launch',
  'link', 'list', 'listen', 'load', 'locate', 'log', 'look', 'map', 'match',
  'measure', 'merge', 'migrate', 'modify', 'monitor', 'move', 'normalize',
  'notify', 'open', 'optimize', 'orchestrate', 'output', 'override', 'parse',
  'patch', 'pause', 'perform', 'persist', 'ping', 'poll', 'populate', 'post',
  'print', 'provision', 'publish', 'pull', 'purge', 'push', 'put', 'query',
  'queue', 'read', 'receive', 'record', 'redirect', 'reduce', 'refresh',
  'register', 'reject', 'reload', 'remove', 'rename', 'render', 'replace',
  'replicate', 'report', 'request', 'reset', 'resize', 'resolve', 'restart',
  'restore', 'retrieve', 'return', 'revoke', 'rollback', 'rotate', 'route',
  'run', 'save', 'scan', 'schedule', 'scrape', 'search', 'select', 'send',
  'serialize', 'set', 'shut', 'sign', 'snapshot', 'sort', 'spawn', 'split',
  'start', 'stop', 'store', 'stream', 'submit', 'subscribe', 'summarize',
  'suspend', 'sync', 'terminate', 'test', 'toggle', 'trace', 'track',
  'transfer', 'transform', 'translate', 'trigger', 'truncate', 'uninstall',
  'unlink', 'unlock', 'unsubscribe', 'update', 'upgrade', 'upload', 'upsert',
  'validate', 'verify', 'watch', 'write',
  // Past tense / -s / -ing forms will be matched by stemming below
  'creates', 'returns', 'searches', 'deletes', 'updates', 'fetches', 'sends',
  'validates', 'transforms', 'filters', 'reads', 'writes', 'lists', 'finds',
  'checks', 'runs', 'sets', 'gets', 'adds', 'removes', 'moves', 'copies',
  'loads', 'saves', 'starts', 'stops', 'opens', 'closes', 'connects',
  'disconnects', 'enables', 'disables', 'parses', 'formats', 'converts',
  'computes', 'calculates', 'generates', 'extracts', 'inserts', 'selects',
];

const verbSet = new Set(ACTION_VERBS);

export const descriptionHasVerb: Rule = {
  name: 'description-has-verb',
  description: 'Description should contain at least one action verb',
  check(tool: McpToolDefinition): LintIssue[] {
    const issues: LintIssue[] = [];
    const desc = (tool.description || '').toLowerCase();
    const words = desc.split(/\s+/);

    const hasVerb = words.some(word => {
      const cleaned = word.replace(/[^a-z]/g, '');
      return verbSet.has(cleaned);
    });

    if (!hasVerb) {
      issues.push({
        rule: 'description-has-verb',
        severity: 'warn',
        message: 'Description should contain at least one action verb (e.g., "creates", "returns", "searches")',
        tool: tool.name,
        field: 'description',
      });
    }

    return issues;
  },
};
