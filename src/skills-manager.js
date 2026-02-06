'use strict';

const { execFile } = require('child_process');
const { validateRepo } = require('./validator');
const { Logger } = require('./logger');

const COMMANDS = ['add', 'remove', 'list'];

class SkillsManager {
  constructor(options = {}) {
    this.logger = options.logger || new Logger(options.logLevel || 'info');
  }

  /**
   * Add a skill from a GitHub repository.
   * @param {string} repo - Repository identifier in owner/repo format.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async add(repo) {
    const validation = validateRepo(repo);
    if (!validation.valid) {
      this.logger.error(validation.error);
      return { success: false, message: validation.error };
    }

    this.logger.info(`Adding skill from ${validation.full}...`);

    try {
      const output = await this._exec('npx', ['skills', 'add', validation.full]);
      this.logger.info(`Skill added successfully: ${validation.full}`);
      return { success: true, message: output };
    } catch (err) {
      this.logger.error(`Failed to add skill: ${err}`);
      return { success: false, message: String(err) };
    }
  }

  /**
   * Remove a previously added skill.
   * @param {string} repo - Repository identifier in owner/repo format.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async remove(repo) {
    const validation = validateRepo(repo);
    if (!validation.valid) {
      this.logger.error(validation.error);
      return { success: false, message: validation.error };
    }

    this.logger.info(`Removing skill ${validation.full}...`);

    try {
      const output = await this._exec('npx', ['skills', 'remove', validation.full]);
      this.logger.info(`Skill removed successfully: ${validation.full}`);
      return { success: true, message: output };
    } catch (err) {
      this.logger.error(`Failed to remove skill: ${err}`);
      return { success: false, message: String(err) };
    }
  }

  /**
   * List all installed skills.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async list() {
    this.logger.info('Listing installed skills...');

    try {
      const output = await this._exec('npx', ['skills', 'list']);
      return { success: true, message: output };
    } catch (err) {
      this.logger.error(`Failed to list skills: ${err}`);
      return { success: false, message: String(err) };
    }
  }

  /**
   * Execute a shell command safely using execFile (no shell interpolation).
   */
  _exec(command, args) {
    return new Promise((resolve, reject) => {
      execFile(command, args, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}

module.exports = { SkillsManager, COMMANDS };
