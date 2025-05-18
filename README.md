# Project Tree Generator

A CLI tool to generate a Markdown file with the project directory structure, ignoring common build and package folders across various tech stacks (e.g., Node.js, Laravel, Flutter, Django, Angular). Supports custom ignore lists for directories and file extensions, as well as options to show only specific file extensions or directories.

## Installation

Install globally to use the `project-tree` command from any directory:

### From npmjs.com
```bash
npm install -g project-tree-generator
```

### From GitHub Packages
```bash
# Configure .npmrc for GitHub Packages
echo @ahmad5599:registry=https://npm.pkg.github.com >> ~/.npmrc
echo //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN >> ~/.npmrc
npm install -g @ahmad5599/project-tree-generator
```
Replace `YOUR_GITHUB_TOKEN` with a GitHub Personal Access Token with `read:packages` scope.

## Usage

Run the `project-tree` command with options to customize the project path, output file, and filtering:

```bash
project-tree --path "<path-to-project>" --output <output-file> --ignore <dir1,dir2> --ignore-ext <ext1,ext2> --only-ext <ext1> --dirs-only
```

### Options

- `--path <path>`: Project root directory (default: current directory, `.`).
- `--output <file>`: Output Markdown file (default: `project_structure.md`).
- `--ignore <dirs>`: Comma-separated list of directories to ignore (e.g., `cache,logs`). Must be simple names, not paths.
- `--ignore-ext <extensions>`: Comma-separated list of file extensions to ignore (e.g., `.js,.ts`).
- `--only-ext <extensions>`: Comma-separated list of file extensions to include exclusively (e.g., `.js`). Overrides `--ignore-ext`.
- `--dirs-only`: Show only directories, excluding all files. Overrides `--ignore-ext` and `--only-ext` for files.

You can also create a `.projectignore` file in the project root with one directory per line to ignore additional folders.

## Examples

### Basic Usage (Current Directory)

Generate `project_structure.md`, ignoring `cache` and `logs`:

```bash
project-tree --ignore cache,logs
```

**Output** (`project_structure.md`):
```
my-project/
├── src/
│   └── components/
│       └── Button.js
├── package.json
└── README.md
```

### Ignore JavaScript Files

Exclude `.js` files:

```bash
project-tree --ignore cache,logs --ignore-ext .js
```

**Output** (`project_structure.md`):
```
my-project/
├── src/
│   └── components/
├── package.json
└── README.md
```

### Show Only JavaScript Files

Include only `.js` files:

```bash
project-tree --ignore cache,logs --only-ext .js
```

**Output** (`project_structure.md`):
```
my-project/
├── src/
│   └── components/
│       └── Button.js
```

### Show Only Directories

Show only directories:

```bash
project-tree --dirs-only
```

**Output** (`project_structure.md`):
```
my-project/
├── src/
│   └── components/
```

### Specify Project Path (Windows)

Generate `tree.md` for a directory with spaces:

```bash
project-tree --path "D:\All\code\office code\Fruity-Chat\social" --output tree.md --dirs-only
```

**Output** (`tree.md`):
```
social/
├── src/
│   └── components/
```

### Custom Output File (Cross-Platform)

Generate `tree.md` in a Laravel project, ignoring `.php` files:

```bash
# Windows
project-tree --path "C:\Projects\laravel-app" --output tree.md --ignore cache,storage --ignore-ext .php

# macOS/Linux
project-tree --path "/home/user/laravel-app" --output tree.md --ignore cache,storage --ignore-ext .php
```

**Output** (`tree.md`):
```
laravel-app/
├── app/
│   └── Http/
│       └── Controllers/
├── routes/
├── composer.json
```

### Using `.projectignore`

Create a `.projectignore` file:

```
cache
logs
temp
```

Run without `--ignore`:

```bash
project-tree --path .
```

This ignores `cache`, `logs`, `temp`, and default folders.

## Possible Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `Error: Directory does not exist: <path>` | The `--path` doesn't exist. | Verify with `dir "<path>"` (Windows) or `ls <path>` (macOS/Linux). |
| `Error: Path is not a directory: <path>` | The `--path` is a file. | Ensure the path is a directory. |
| `Error: Permission denied accessing directory: <path>` | No read access. | Run as Administrator or check permissions with `icacls "<path>"` (Windows). |
| `Error: Output directory does not exist: <dir>` | Parent directory for `--output` doesn't exist. | Create with `mkdir "<dir>"`. |
| `Error: Permission denied writing to <file>` | No write access for output file. | Ensure permissions or run as Administrator. |
| `Error: Invalid ignore directories: <dirs>` | `--ignore` includes paths or empty entries. | Use simple names (e.g., `cache,logs`). |
| `Error: Invalid ignore extensions: <exts>` | `--ignore-ext` includes invalid extensions. | Use extensions like `.js,.ts`. |
| `Error: Invalid only extensions: <exts>` | `--only-ext` includes invalid extensions. | Use extensions like `.js`. |
| `Warning: Could not read .projectignore: <error>` | `.projectignore` is unreadable. | Check permissions or delete `.projectignore`. |

## Troubleshooting

- **Command not recognized**:
  - Ensure global installation:
    ```bash
    npm install -g project-tree-generator
    ```
  - Verify PATH:
    ```bash
    echo %PATH%  # Windows
    echo $PATH   # macOS/Linux
    ```
  - Re-link:
    ```bash
    cd D:\All\code\project-tree-generator
    npm link
    ```
- **Unexpected output**:
  - Check `.projectignore`, `--ignore`, `--ignore-ext`, `--only-ext`, or `--dirs-only`.
  - Default ignored folders include `node_modules`, `dist`, etc.
- **Test directly**:
  - Run without CLI:
    ```bash
    node index.js --path "<path>" --ignore cache,logs --dirs-only
    ```

## Development

To contribute:

1. **Clone**:
   ```bash
   git clone https://github.com/ahmad5599/project-tree-generator.git
   ```
2. **Install**:
   ```bash
   npm install
   ```
3. **Set up tests**:
   - Uses Jest.
   - Create `test-data/test-dir`:
     ```bash
     mkdir test-data\test-dir
     mkdir test-data\test-dir\src
     mkdir test-data\test-dir\node_modules
     mkdir test-data\test-dir\cache
     echo {} > test-data\test-dir\package.json
     echo. > test-data\test-dir\README.md
     echo. > test-data\test-dir\src\app.js
     ```
   - Run tests:
     ```bash
     npm test
     ```
   - Tests in `__tests__/project-tree.test.js`.
4. **Test locally**:
   - Link package:
     ```bash
     npm link
     ```
   - Run:
     ```bash
     project-tree --path . --ignore cache,logs --dirs-only
     ```
5. **Add tests**:
   - Example:
     ```javascript
     test('ignores node_modules', async () => {
       await generateProjectTree({ startPath: './test-data/test-dir', outputFile: 'test.md' });
       const content = await fs.readFile('test.md', 'utf-8');
       expect(content).not.toContain('node_modules');
     });
     ```
6. **Submit**:
   - Follow [CONTRIBUTING.md](CONTRIBUTING.md) for pull requests.
   - Ensure `README.md` and files are included (see `.npmignore`).

**Requirements**: Node.js >=14.0.0 (tested with v20.3.0).

## License

MIT