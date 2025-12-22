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

    'scope-enum': [2, 'always', scopes],
    'scope-empty': [0], // ← Cleaned
    'scope-case': [2, 'always', 'kebab-case'],

    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [1, 'always', 5], // ← Warning, more lenient

    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [1, 'always', 100],
    'footer-leading-blank': [2, 'always'],
  },

  prompt: {
    alias: {
      fd: 'docs: fix typos',
      ud: 'docs: update documentation',
      b: 'build(deps): bump dependencies',
    },
    messages: {
      type: 'Select the type of change:',
      scope: 'Select scope (optional):',
      subject: 'Write a SHORT, imperative description:\n',
      body: 'Detailed description (optional):\n',
      breaking: 'List BREAKING CHANGES (optional):\n',
      footer: 'List issues (e.g., #31, #34):\n',
      confirmCommit: 'Confirm?',
    },
    types: [
      { value: 'feat', name: 'feat:     ✨ New feature', emoji: '✨' },
      { value: 'fix', name: 'fix:      🐛 Bug fix', emoji: '🐛' },
      { value: 'docs', name: 'docs:     📝 Documentation', emoji: '📝' },
      { value: 'style', name: 'style:    💄 Code style', emoji: '💄' },
      { value: 'refactor', name: 'refactor: ♻️  Refactoring', emoji: '♻️' },
      { value: 'perf', name: 'perf:     ⚡ Performance', emoji: '⚡' },
      { value: 'test', name: 'test:     ✅ Tests', emoji: '✅' },
      { value: 'build', name: 'build:    📦 Build/deps', emoji: '📦' },
      { value: 'chore', name: 'chore:    🔧 Maintenance', emoji: '🔧' },
      { value: 'ci', name: 'ci:       👷 CI/CD', emoji: '👷' },
      { value: 'revert', name: 'revert:   ⏪ Revert', emoji: '⏪' },
    ],
    scopes: [
      ...apps.map((a) => ({ value: a, name: `📱 ${a}` })),
      ...packages.map((p) => ({ value: p, name: `📦 ${p}` })),
      { value: 'deps', name: '⬆️  deps' },
      { value: 'config', name: '⚙️  config' },
      { value: 'ci', name: '🔄 ci' },
      { value: 'readme', name: '📖 readme' },
      { value: 'release', name: '🚀 release' },
      { value: 'workspace', name: '🏗️  workspace' },
      { value: 'tooling', name: '🛠️  tooling' },
    ],
    allowCustomScopes: false,
    allowEmptyScopes: true,
    emptyScopesAlias: 'none',
    useEmoji: true,
    emojiAlign: 'center',
    skipQuestions: ['body', 'breaking', 'footer'],
    allowBreakingChanges: ['feat', 'fix', 'refactor'],
    breaklineNumber: 100,
    breaklineChar: '|',
  },
}
