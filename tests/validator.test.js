'use strict';

const { validateRepo, validateCommand } = require('../src/validator');

describe('validateRepo', () => {
  test('accepts valid owner/repo format', () => {
    const result = validateRepo('user/my-repo');
    expect(result.valid).toBe(true);
    expect(result.owner).toBe('user');
    expect(result.name).toBe('my-repo');
    expect(result.full).toBe('user/my-repo');
  });

  test('accepts repos with dots, underscores, and hyphens', () => {
    expect(validateRepo('my.org/repo_name-v2').valid).toBe(true);
    expect(validateRepo('user_1/skill.js').valid).toBe(true);
  });

  test('trims whitespace', () => {
    const result = validateRepo('  user/repo  ');
    expect(result.valid).toBe(true);
    expect(result.full).toBe('user/repo');
  });

  test('rejects empty input', () => {
    expect(validateRepo('').valid).toBe(false);
    expect(validateRepo(null).valid).toBe(false);
    expect(validateRepo(undefined).valid).toBe(false);
  });

  test('rejects non-string input', () => {
    expect(validateRepo(123).valid).toBe(false);
    expect(validateRepo({}).valid).toBe(false);
  });

  test('rejects missing slash', () => {
    const result = validateRepo('justaname');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid repository format');
  });

  test('rejects command injection attempts', () => {
    expect(validateRepo('user/repo; rm -rf /').valid).toBe(false);
    expect(validateRepo('user/repo && echo pwned').valid).toBe(false);
    expect(validateRepo('user/repo | cat /etc/passwd').valid).toBe(false);
    expect(validateRepo('$(whoami)/repo').valid).toBe(false);
    expect(validateRepo('user/`id`').valid).toBe(false);
  });

  test('rejects names exceeding 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(validateRepo(`user/${longName}`).valid).toBe(false);
    expect(validateRepo(`${longName}/repo`).valid).toBe(false);
  });
});

describe('validateCommand', () => {
  const allowed = ['add', 'remove', 'list'];

  test('accepts valid commands', () => {
    expect(validateCommand('add', allowed).valid).toBe(true);
    expect(validateCommand('remove', allowed).valid).toBe(true);
    expect(validateCommand('list', allowed).valid).toBe(true);
  });

  test('rejects unknown commands', () => {
    const result = validateCommand('delete', allowed);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unknown command');
    expect(result.error).toContain('delete');
  });
});
