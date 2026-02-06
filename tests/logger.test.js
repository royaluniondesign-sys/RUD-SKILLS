'use strict';

const { Logger } = require('../src/logger');

describe('Logger', () => {
  let originalWrite;
  let output;

  beforeEach(() => {
    output = '';
    originalWrite = process.stderr.write;
    process.stderr.write = (msg) => { output += msg; };
  });

  afterEach(() => {
    process.stderr.write = originalWrite;
  });

  test('logs error messages at info level', () => {
    const logger = new Logger('info');
    logger.error('test error');
    expect(output).toContain('[ERROR]');
    expect(output).toContain('test error');
  });

  test('logs info messages at info level', () => {
    const logger = new Logger('info');
    logger.info('test info');
    expect(output).toContain('[INFO]');
    expect(output).toContain('test info');
  });

  test('suppresses debug messages at info level', () => {
    const logger = new Logger('info');
    logger.debug('test debug');
    expect(output).toBe('');
  });

  test('shows debug messages at debug level', () => {
    const logger = new Logger('debug');
    logger.debug('test debug');
    expect(output).toContain('[DEBUG]');
    expect(output).toContain('test debug');
  });

  test('suppresses info messages at error level', () => {
    const logger = new Logger('error');
    logger.info('should not appear');
    expect(output).toBe('');
  });
});
