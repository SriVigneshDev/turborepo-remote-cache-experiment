// commitlint.config.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const Dirname = path.dirname(fileURLToPath(import.meta.url))

const getDirectories = (src) => {
  try {
    if (!fs.existsSync(src)) {
      return []
    }
    return fs
      .readdirSync(src, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name)
  } catch {
    return []
  }
}

const apps = getDirectories(path.resolve(Dirname, 'apps'))
const packages = getDirectories(path.resolve(Dirname, 'packages'))
const utilityScopes = [
  'deps',
  'config',
  'ci',
  'readme',
  'release',
  'workspace',
  'tooling',
]
const scopes = [...apps, ...packages, ...utilityScopes]

export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // ═══════════════════════════════════════════════════════
    // TYPE RULES
    // ═══════════════════════════════════════════════════════
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],

    // ═══════════════════════════════════════════════════════
    // SCOPE RULES - REQUIRED
    // ═══════════════════════════════════════════════════════
    'scope-enum': [2, 'always', scopes],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],

    // ═══════════════════════════════════════════════════════
    // SUBJECT RULES
    // ═══════════════════════════════════════════════════════
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 10],

    // ═══════════════════════════════════════════════════════
    // BODY RULES - REQUIRED
    // ═══════════════════════════════════════════════════════
    'body-empty': [2, 'never'],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'body-min-length': [2, 'always', 20],

    // ═══════════════════════════════════════════════════════
    // HEADER & FOOTER RULES
    // ═══════════════════════════════════════════════════════
    'header-max-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
    'footer-empty': [2, 'never'], // ← ⚡ UPDATED: Now REQUIRED for team traceability
  },

  prompt: {
    // ═══════════════════════════════════════════════════════
    // ALIASES FOR QUICK COMMITS
    // ═══════════════════════════════════════════════════════
    alias: {
      fd: 'docs(readme): fix typos',
      ud: 'docs(readme): update documentation',
      b: 'build(deps): bump dependencies',
    },

    // ═══════════════════════════════════════════════════════
    // CUSTOM MESSAGES
    // ═══════════════════════════════════════════════════════
    messages: {
      type: '📝 Select the type of change (required):',
      scope: '📦 Select the scope (required):',
      subject: '✏️  Write a SHORT, imperative description (required):\n',
      body: '📄 Write a DETAILED description (required):\n',
      breaking: '💥 List any BREAKING CHANGES (press Enter if none):\n',
      footerPrefix: '🔗 Select issue link type (required):',
      footer: '🎫 Enter issue number(s) - REQUIRED (e.g., #123, #456):\n',
      confirmCommit: '✅ Confirm this commit?',
    },

    // ═══════════════════════════════════════════════════════
    // COMMIT TYPES WITH EMOJI
    // ═══════════════════════════════════════════════════════
    types: [
      { value: 'feat', name: 'feat:     ✨ New feature', emoji: '✨' },
      { value: 'fix', name: 'fix:      🐛 Bug fix', emoji: '🐛' },
      { value: 'docs', name: 'docs:     📝 Documentation', emoji: '📝' },
      {
        value: 'style',
        name: 'style:    💄 Code style (no logic change)',
        emoji: '💄',
      },
      { value: 'refactor', name: 'refactor: ♻️  Code refactoring', emoji: '♻️' },
      {
        value: 'perf',
        name: 'perf:     ⚡ Performance improvement',
        emoji: '⚡',
      },
      {
        value: 'test',
        name: 'test:     ✅ Adding/updating tests',
        emoji: '✅',
      },
      {
        value: 'build',
        name: 'build:    📦 Build system/dependencies',
        emoji: '📦',
      },
      { value: 'chore', name: 'chore:    🔧 Maintenance tasks', emoji: '🔧' },
      { value: 'ci', name: 'ci:       👷 CI/CD changes', emoji: '👷' },
      { value: 'revert', name: 'revert:   ⏪ Reverting changes', emoji: '⏪' },
    ],

    // ═══════════════════════════════════════════════════════
    // SCOPES - DYNAMICALLY GENERATED FROM MONOREPO
    // ═══════════════════════════════════════════════════════
    scopes: [
      ...apps.map((a) => ({ value: a, name: `📱 ${a} (app)` })),
      ...packages.map((p) => ({ value: p, name: `📦 ${p} (package)` })),
      { value: 'deps', name: '⬆️  deps (dependencies)' },
      { value: 'config', name: '⚙️  config (configuration)' },
      { value: 'ci', name: '🔄 ci (continuous integration)' },
      { value: 'readme', name: '📖 readme (documentation)' },
      { value: 'release', name: '🚀 release (versioning)' },
      { value: 'workspace', name: '🏗️  workspace (monorepo root)' },
      { value: 'tooling', name: '🛠️  tooling (dev tools)' },
    ],

    // ═══════════════════════════════════════════════════════
    // ISSUE LINK TYPES
    // ═══════════════════════════════════════════════════════
    issuePrefixes: [
      { value: 'closes', name: 'closes:   ✅ Closes issue' },
      { value: 'fixes', name: 'fixes:    🐛 Fixes issue' },
      { value: 'resolves', name: 'resolves: ✔️  Resolves issue' },
      { value: 'refs', name: 'refs:     🔗 References issue' },
    ],

    // ═══════════════════════════════════════════════════════
    // ALL STEPS REQUIRED - NO SKIPPING
    // ═══════════════════════════════════════════════════════
    skipQuestions: [], // ← EMPTY = NO SKIPPING

    // ═══════════════════════════════════════════════════════
    // SCOPE SETTINGS - REQUIRED
    // ═══════════════════════════════════════════════════════
    allowCustomScopes: false,
    allowEmptyScopes: false,

    // ═══════════════════════════════════════════════════════
    // ISSUE SETTINGS - REQUIRED
    // ═══════════════════════════════════════════════════════
    allowCustomIssuePrefix: false, // ← Must use predefined prefixes
    allowEmptyIssuePrefix: false, // ← Cannot skip issue prefix

    // ═══════════════════════════════════════════════════════
    // BREAKING CHANGES
    // ═══════════════════════════════════════════════════════
    allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf', 'build'],

    // ═══════════════════════════════════════════════════════
    // EMOJI SETTINGS
    // ═══════════════════════════════════════════════════════
    useEmoji: true,
    emojiAlign: 'center',

    // ═══════════════════════════════════════════════════════
    // LINE BREAKING
    // ═══════════════════════════════════════════════════════
    breaklineNumber: 100,
    breaklineChar: '|',

    // ═══════════════════════════════════════════════════════
    // ADDITIONAL SETTINGS
    // ═══════════════════════════════════════════════════════
    upperCaseSubject: false,
    markBreakingChangeMode: true,
    confirmColorize: true,
    minSubjectLength: 10,
    defaultScope: '',
    defaultSubject: '',
    defaultBody: '',
    defaultIssues: '',
  },
}
