# Project Tree Generator

A CLI tool to generate a Markdown file with the project directory structure, ignoring common build and package folders across various tech stacks (e.g., Node.js, Laravel, Flutter, Django, Angular). Supports custom ignore lists via command-line options or a `.projectignore` file.

## Installation

Install globally to use the `project-tree` command from any directory:

```bash
npm install -g project-tree-generator
```

## Usage

Run the `project-tree` command with options to specify the project path, output file, and directories to ignore:

```bash
project-tree --path "<path-to-project>" --output <output-file> --ignore <dir1,dir2>
```

### Options

- `--path <path>`: Project root directory (default: current directory, `.`).
- `--output <file>`: Output Markdown file (default: `project_structure.md`).
- `--ignore <dirs>`: Comma-separated list of directories to ignore (e.g., `cache,logs`). Must be simple names, not paths (e.g., `cache`, not `cache/` or `path/to/cache`).

You can also create a `.projectignore` file in the project root with one directory per line to ignore additional folders.

## Examples

### Basic Usage (Current Directory)

Generate `project_structure.md` in the current directory, ignoring default folders (e.g., `node_modules`, `dist`) and custom folders `cache` and `logs`:

```bash
project-tree --ignore cache,logs
```

**Output** (`project_structure.md`):
```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js
├── package.json
├── README.md
```

### Specify Project Path (Windows)

Generate `project_structure.md` for a directory with spaces in the path:

```bash
project-tree --path "D:\All\code\office code\Fruity-Chat\social" --ignore cache,logs
```

**Output** (`D:\All\code\office code\Fruity-Chat\social\project_structure.md`):
```
social/
├── src/
│   ├── components/
│   │   ├── Chat.js
├── package.json
```

**Note**: Use double quotes around paths with spaces on Windows.

### Custom Output File (Cross-Platform)

Generate a custom output file `tree.md` in a Laravel project directory:

```bash
# Windows
project-tree --path "C:\Projects\laravel-app" --output tree.md --ignore cache,storage

# macOS/Linux
project-tree --path "/home/user/laravel-app" --output tree.md --ignore cache,storage
```

**Output** (`tree.md`):
```
laravel-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── UserController.php
├── routes/
│   ├── web.php
├── composer.json
```

### Using `.projectignore`

Create a `.projectignore` file in the project root:

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

Below are common errors, their causes, and solutions:

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `Error: Directory does not exist: <path>` | The specified `--path` doesn't exist. | Verify the path with `dir "<path>"` (Windows) or `ls <path>` (macOS/Linux) and use quotes for spaces. |
| `Error: Path is not a directory: <path>` | The `--path` points to a file, not a directory. | Ensure the path is a directory, not a file. |
| `Error: Permission denied accessing directory: <path>` | No read access to the directory. | Run Command Prompt as Administrator or check directory permissions with `icacls "<path>"` (Windows). |
| `Error: Output directory does not exist: <dir>` | The parent directory for `--output` doesn't exist. | Create the output directory with `mkdir "<dir>"` or use a valid path. |
| `Error: Permission denied writing to <file>` | No write access for the output file. | Ensure write permissions or run as Administrator. |
| `Error: Invalid ignore directories: <dirs>` | `--ignore` includes paths (e.g., `logs/` or `path/to/logs`) or empty entries. | Use simple directory names (e.g., `cache,logs`) without slashes. |
| `Warning: Could not read .projectignore: <error>` | `.projectignore` exists but is unreadable. | Check file permissions with `icacls .projectignore` (Windows) or delete `.projectignore` if not needed. |

## Troubleshooting

- **Command not recognized**:
  - Ensure `project-tree` is installed globally:
    ```bash
    npm install -g project-tree-generator
    ```
  - Verify `%USERPROFILE%\AppData\Roaming\npm` is in your PATH:
    ```bash
    echo %PATH%  # Windows
    echo $PATH   # macOS/Linux
    ```
  - Re-link the package:
    ```bash
    cd D:\All\code\project-tree-generator
    npm link
    ```
- **Unexpected output**:
  - Check ignored folders in `.projectignore` or `--ignore`.
  - Default ignored folders include `node_modules`, `dist`, `build`, etc.
- **Test directly**:
  - Run the script without the CLI to isolate issues:
    ```bash
    node index.js --path "<path>" --ignore cache,logs
    ```

## Development

To contribute or modify:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmad5599/project-tree-generator.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up test environment**:
   - Tests use Jest. Ensure dev dependencies are installed.
   - Create a mock test directory:
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
   - Tests are located in `__tests__/project-tree.test.js` and cover directory traversal, ignore lists, and error handling.
4. **Test locally**:
   - Link the package to test changes globally:
     ```bash
     npm link
     ```
   - Run the CLI:
     ```bash
     project-tree --path . --ignore cache,logs
     ```
5. **Add new tests**:
   - Create or modify test files in `__tests__`.
   - Example test:
     ```javascript
     test('ignores node_modules', async () => {
       await generateProjectTree({ startPath: './test-data/test-dir', outputFile: 'test.md' });
       const content = await fs.readFile('test.md', 'utf-8');
       expect(content).not.toContain('node_modules');
     });
     ```
6. **Submit changes**:
   - Follow [CONTRIBUTING.md](CONTRIBUTING.md) (if available) for pull request guidelines.
   - Ensure `README.md` and essential files are included in the package (see `.npmignore`).

**Requirements**: Node.js >=14.0.0 (tested with Node.js v20.3.0).

## License

MIT