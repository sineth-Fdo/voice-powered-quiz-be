module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat!',
          'feat',
          'fix',
          'patch',
          'chore',
          'build',
          'debug',
          'refactor',
          'revert',
          'ci',
          'perf',
          'style',
          'test',
          'docs',
          'wip'
        ]
      ],
      'type-case': [0],
      'subject-case': [2, 'always', 'sentence-case'],
      'footer-max-line-length': [0]
    }
  };
  