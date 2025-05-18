# Contributing to Project Tree Generator

Thank you for your interest in contributing to **Project Tree Generator**! This CLI tool generates Markdown files representing project directory structures, ignoring common build folders and offering file extension filtering and directory-only output. We welcome contributions from the community to improve functionality, fix bugs, or enhance documentation.

## Table of Contents
- [Getting Started](#getting-started)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Testing](#testing)
- [Code Style](#code-style)
- [Project Structure](#project-structure)
- [Contact](#contact)

## Getting Started

Project Tree Generator is a Node.js CLI tool that helps developers document project structures in Markdown format. It supports:
- Ignoring common build folders (e.g., `node_modules`, `dist`).
- Filtering files by extension (`--ignore-ext`, `--only-ext`).
- Showing only directories (`--dirs-only`).
- Custom ignore lists via `--ignore` or `.projectignore`.

Before contributing, please read this guide and ensure your contributions align with the project’s goals.

## Setting Up the Development Environment

To contribute, you’ll need to set up the project locally:

1. **Prerequisites**:
   - Node.js >= 14.0.0 (tested with v20.3.0).
   - npm >= 6.0.0.
   - Git.

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/ahmad5599/project-tree-generator.git
   cd project-tree-generator
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Set Up Test Environment**:
   The project uses Jest for testing. Create a mock test directory:
   ```bash
   mkdir test-data\test-dir
   mkdir test-data\test-dir\src
   mkdir test-data\test-dir\node_modules
   mkdir test-data\test-dir\cache
   echo {} > test-data\test-dir\package.json
   echo. > test-data\test-dir\README.md
   echo. > test-data\test-dir\src\app.js
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

6. **Test Locally**:
   Link the package globally to test CLI commands:
   ```bash
   npm link
   project-tree --path . --ignore cache,logs --dirs-only
   ```

## Submitting Issues

If you find bugs, have feature requests, or need clarification, please open an issue on the [GitHub Issues page](https://github.com/ahmad5599/project-tree-generator/issues).

- **Search Existing Issues**: Check if your issue already exists to avoid duplicates.
- **Use a Clear Title**: E.g., “Bug: `--dirs-only` includes ignored directories”.
- **Provide Details**:
  - Describe the issue or feature request.
  - Include steps to reproduce (for bugs).
  - Specify your environment (e.g., Node.js v20.3.0, Windows 11).
  - Attach relevant logs or screenshots.
- **Use Labels**: Apply labels like `bug`, `enhancement`, or `documentation` if possible.

Example:
```
Title: Bug: `--ignore-ext .js` doesn’t exclude `.jsx` files

Description:
The `--ignore-ext .js` flag doesn’t exclude `.jsx` files, which should be treated as JavaScript files.

Steps to Reproduce:
1. Run `project-tree --path . --ignore-ext .js`
2. Observe `.jsx` files in the output.

Expected Behavior:
`.jsx` files should be excluded.

Environment:
- Node.js: v20.3.0
- OS: Windows 11
```

## Submitting Pull Requests

We welcome pull requests (PRs) for bug fixes, features, or documentation improvements. Follow these steps:

1. **Fork the Repository**:
   Fork `https://github.com/ahmad5599/project-tree-generator` and clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-tree-generator.git
   ```

2. **Create a Branch**:
   Use a descriptive branch name:
   ```bash
   git checkout -b feature/add-new-flag
   ```

3. **Make Changes**:
   - Update code in `index.js` for CLI functionality.
   - Add or update tests in `__tests__/project-tree.test.js`.
   - Update `README.md` for new features or usage changes.
   - Ensure `.npmignore` excludes unnecessary files.

4. **Run Tests**:
   ```bash
   npm test
   ```
   All tests must pass.

5. **Commit Changes**:
   Use clear commit messages:
   ```bash
   git commit -m "Add --new-flag to support XYZ feature"
   ```

6. **Push and Open a PR**:
   ```bash
   git push origin feature/add-new-flag
   ```
   Open a PR on `https://github.com/ahmad5599/project-tree-generator/pulls` with:
   - A clear title (e.g., “Add `--new-flag` for XYZ”).
   - A description of changes, referencing related issues (e.g., “Fixes #123”).
   - Test results or screenshots if applicable.

7. **Code Review**:
   - Respond to feedback promptly.
   - Ensure your PR passes CI checks (if set up).

## Testing

All contributions must include tests to maintain code quality:
- Tests are located in `__tests__/project-tree.test.js`.
- Use Jest for writing tests.
- Test new features, bug fixes, and edge cases.
- Example test for a new flag:
  ```javascript
  test('new flag works correctly', async () => {
    await generateProjectTree({
      startPath: './test-data/test-dir',
      outputFile: 'test-output.md',
      newFlag: true
    });
    const content = await fs.readFile('test-output.md', 'utf-8');
    expect(content).toContain('expected-output');
  });
  ```

Run tests before submitting:
```bash
npm test
```

## Code Style

- **JavaScript**:
  - Follow [JavaScript Standard Style](https://standardjs.com/).
  - Use 2 spaces for indentation.
  - Avoid trailing commas.
  - Use single quotes for strings.
- **Error Handling**:
  - Include descriptive error messages (e.g., `throw new Error('Invalid path: ${path}')`).
  - Handle file system errors (e.g., `ENOENT`, `EACCES`).
- **CLI**:
  - Use `commander` for CLI options.
  - Maintain consistent flag naming (e.g., `--flag-name`).
- **Documentation**:
  - Update `README.md` for new features or changes.
  - Include examples and error cases.

## Project Structure

```
project-tree-generator/
├── __tests__/              # Jest tests
│   └── project-tree.test.js
├── test-data/              # Mock directory for testing
│   └── test-dir/
├── index.js                # Main CLI script
├── LICENSE                 # MIT License
├── package.json            # Package config for GitHub Packages
├── package-npmjs.json      # Package config for npmjs.com
├── README.md               # Project documentation
└── .npmignore              # Files to exclude from npm package
```

- **Dependencies**:
  - `commander`: CLI parsing.
  - `jest`: Testing (dev dependency).
- **Node.js**: >= 14.0.0.

## Contact

For questions or suggestions:
- Open an issue on [GitHub Issues](https://github.com/ahmad5599/project-tree-generator/issues).
- Contact Muhammad Ahmad Hamid via [GitHub](https://github.com/ahmad5599) or email (if provided in the repository).

Thank you for contributing to Project Tree Generator! 🚀