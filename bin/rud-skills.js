#!/usr/bin/env node

'use strict';

const { SkillsManager, COMMANDS } = require('../src/skills-manager');
const { validateCommand } = require('../src/validator');
const { version } = require('../package.json');

const HELP_TEXT = `
rud-skills v${version}
CLI platform for managing developer skills from GitHub repositories.

Usage:
  rud-skills <command> [options]

Commands:
  add <owner/repo>      Add a skill from a GitHub repository
  remove <owner/repo>   Remove a previously added skill
  list                  List all installed skills

Options:
  --help, -h            Show this help message
  --version, -v         Show version number
  --verbose             Enable debug logging

Examples:
  rud-skills add user/my-awesome-skill
  rud-skills remove user/old-skill
  rud-skills list
`;

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {};
  const positional = [];

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    } else if (arg === '--verbose') {
      flags.verbose = true;
    } else if (arg.startsWith('-')) {
      process.stderr.write(`Unknown flag: ${arg}\n`);
      process.exit(1);
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

async function main() {
  const { flags, positional } = parseArgs(process.argv);

  if (flags.help || positional.length === 0) {
    process.stdout.write(HELP_TEXT);
    process.exit(flags.help ? 0 : 1);
  }

  if (flags.version) {
    process.stdout.write(`rud-skills v${version}\n`);
    process.exit(0);
  }

  const [command, ...rest] = positional;

  const commandCheck = validateCommand(command, COMMANDS);
  if (!commandCheck.valid) {
    process.stderr.write(`${commandCheck.error}\n`);
    process.exit(1);
  }

  const manager = new SkillsManager({
    logLevel: flags.verbose ? 'debug' : 'info',
  });

  let result;

  switch (command) {
    case 'add':
      if (!rest[0]) {
        process.stderr.write('Error: repository argument required. Usage: rud-skills add <owner/repo>\n');
        process.exit(1);
      }
      result = await manager.add(rest[0]);
      break;

    case 'remove':
      if (!rest[0]) {
        process.stderr.write('Error: repository argument required. Usage: rud-skills remove <owner/repo>\n');
        process.exit(1);
      }
      result = await manager.remove(rest[0]);
      break;

    case 'list':
      result = await manager.list();
      break;
  }

  if (result.success) {
    if (result.message) {
      process.stdout.write(`${result.message}\n`);
    }
  } else {
    process.stderr.write(`${result.message}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Unexpected error: ${err.message || err}\n`);
  process.exit(1);
});
