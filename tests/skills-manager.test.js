'use strict';

const { SkillsManager } = require('../src/skills-manager');

describe('SkillsManager', () => {
  let manager;

  beforeEach(() => {
    manager = new SkillsManager({ logLevel: 'error' });
  });

  describe('add', () => {
    test('rejects invalid repo format', async () => {
      const result = await manager.add('invalid-format');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid repository format');
    });

    test('rejects empty repo', async () => {
      const result = await manager.add('');
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    test('rejects command injection in repo', async () => {
      const result = await manager.add('user/repo; rm -rf /');
      expect(result.success).toBe(false);
    });
  });

  describe('remove', () => {
    test('rejects invalid repo format', async () => {
      const result = await manager.remove('not-valid');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid repository format');
    });

    test('rejects empty repo', async () => {
      const result = await manager.remove('');
      expect(result.success).toBe(false);
    });
  });

  describe('_exec', () => {
    test('resolves with stdout on success', async () => {
      const output = await manager._exec('echo', ['hello']);
      expect(output).toBe('hello');
    });

    test('rejects on command failure', async () => {
      await expect(manager._exec('false', [])).rejects.toBeDefined();
    });
  });
});
