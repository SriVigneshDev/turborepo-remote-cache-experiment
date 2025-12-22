// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Code style (formatting, semicolons, etc.)
        'refactor', // Refactoring (no feature change)
        'perf', // Performance improvement
        'test', // Adding tests
        'chore', // Maintenance tasks
        'ci', // CI/CD changes
        'revert', // Revert previous commit
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
  prompt: {
    messages: {
      type: 'Select the type of change:',
      scope: 'Select the scope (optional):',
      subject: 'Write a short description:',
      confirmCommit: 'Confirm commit?',
    },
    types: [
      { value: 'feat', name: 'feat:     ✨ New feature', emoji: '✨' },
      { value: 'fix', name: 'fix:      🐛 Bug fix', emoji: '🐛' },
      { value: 'docs', name: 'docs:     📝 Documentation', emoji: '📝' },
      { value: 'style', name: 'style:    💄 Code style', emoji: '💄' },
      { value: 'refactor', name: 'refactor: ♻️  Refactoring', emoji: '♻️' },
      { value: 'perf', name: 'perf:     ⚡ Performance', emoji: '⚡' },
      { value: 'test', name: 'test:     ✅ Testing', emoji: '✅' },
      { value: 'chore', name: 'chore:    🔧 Maintenance', emoji: '🔧' },
      { value: 'ci', name: 'ci:       👷 CI/CD', emoji: '👷' },
      { value: 'revert', name: 'revert:   ⏪ Revert', emoji: '⏪' },
    ],
    useEmoji: true,
    scopes: [
      // Add your app/package names here
      'web',
      'admin',
      'ui',
      'utils',
      'config',
    ],
  },
}
