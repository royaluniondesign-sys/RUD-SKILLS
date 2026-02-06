'use strict';

const LEVELS = {
  error: { priority: 0, label: 'ERROR', color: '\x1b[31m' },
  warn: { priority: 1, label: 'WARN', color: '\x1b[33m' },
  info: { priority: 2, label: 'INFO', color: '\x1b[36m' },
  debug: { priority: 3, label: 'DEBUG', color: '\x1b[90m' },
};

const RESET = '\x1b[0m';

class Logger {
  constructor(level = 'info') {
    this.level = level;
  }

  _log(level, message) {
    const config = LEVELS[level];
    if (!config || config.priority > LEVELS[this.level].priority) {
      return;
    }

    const timestamp = new Date().toISOString();
    const useColor = process.stderr.isTTY;
    const prefix = useColor
      ? `${config.color}[${config.label}]${RESET}`
      : `[${config.label}]`;

    process.stderr.write(`${prefix} ${timestamp} ${message}\n`);
  }

  error(message) { this._log('error', message); }
  warn(message) { this._log('warn', message); }
  info(message) { this._log('info', message); }
  debug(message) { this._log('debug', message); }
}

module.exports = { Logger, LEVELS };
