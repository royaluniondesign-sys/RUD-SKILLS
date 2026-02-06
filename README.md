# RUD-SKILLS

[![CI](https://github.com/royaluniondesign-sys/RUD-SKILLS/actions/workflows/ci.yml/badge.svg)](https://github.com/royaluniondesign-sys/RUD-SKILLS/actions)
![Stars](https://img.shields.io/github/stars/royaluniondesign-sys/RUD-SKILLS)
![Forks](https://img.shields.io/github/forks/royaluniondesign-sys/RUD-SKILLS)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

CLI platform for managing, adding, and organizing developer skills from GitHub repositories.

## Installation

```bash
# Install globally
npm install -g rud-skills

# Or use directly with npx
npx rud-skills <command>
```

## Usage

### CLI

```bash
# Add a skill from a GitHub repository
rud-skills add <owner/repo>

# Remove a skill
rud-skills remove <owner/repo>

# List all installed skills
rud-skills list

# Show help
rud-skills --help

# Enable verbose logging
rud-skills add user/my-skill --verbose
```

### Programmatic API

```javascript
const { SkillsManager } = require('rud-skills');

const manager = new SkillsManager();

// Add a skill
const result = await manager.add('user/my-skill');
console.log(result); // { success: true, message: '...' }

// Remove a skill
await manager.remove('user/old-skill');

// List skills
const skills = await manager.list();
console.log(skills.message);
```

## Project Structure

```
RUD-SKILLS/
├── bin/
│   └── rud-skills.js       # CLI entry point
├── src/
│   ├── skills-manager.js   # Core skill management logic
│   ├── validator.js         # Input validation and security
│   └── logger.js            # Structured logging utility
├── tests/
│   ├── validator.test.js    # Validator unit tests
│   ├── skills-manager.test.js # Manager unit tests
│   └── logger.test.js       # Logger unit tests
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── index.js                 # Module entry point
├── package.json             # Project configuration
├── .eslintrc.json           # Linting rules
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
└── README.md
```

## Development

```bash
# Clone the repository
git clone https://github.com/royaluniondesign-sys/RUD-SKILLS.git
cd RUD-SKILLS

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Lint and fix automatically
npm run lint:fix

# Run full validation (lint + tests)
npm run validate
```

## Security

- All repository identifiers are validated against a strict pattern (`owner/repo`)
- Uses `execFile` instead of `exec` to prevent shell injection
- Input length limits prevent buffer-based attacks
- Command injection patterns are rejected by the validator

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes and add tests
4. Run `npm run validate` to ensure lint and tests pass
5. Commit with clear messages (`git commit -m 'Add my feature'`)
6. Push to your branch (`git push origin feature/my-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
