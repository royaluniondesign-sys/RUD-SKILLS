'use strict';

const REPO_PATTERN = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

/**
 * Validates that a repository identifier follows the owner/repo format.
 * Prevents command injection by only allowing safe characters.
 */
function validateRepo(repo) {
  if (!repo || typeof repo !== 'string') {
    return { valid: false, error: 'Repository identifier is required' };
  }

  const trimmed = repo.trim();

  if (!REPO_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: `Invalid repository format: "${trimmed}". Expected format: owner/repo (e.g., user/my-skill)`,
    };
  }

  const [owner, name] = trimmed.split('/');

  if (owner.length > 100 || name.length > 100) {
    return { valid: false, error: 'Owner and repository name must be 100 characters or less' };
  }

  return { valid: true, owner, name, full: trimmed };
}

/**
 * Validates a command name against an allow-list.
 */
function validateCommand(command, allowedCommands) {
  if (!allowedCommands.includes(command)) {
    return {
      valid: false,
      error: `Unknown command: "${command}". Available commands: ${allowedCommands.join(', ')}`,
    };
  }
  return { valid: true };
}

module.exports = { validateRepo, validateCommand, REPO_PATTERN };
