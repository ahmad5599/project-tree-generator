Project Tree Generator
A CLI tool to generate a Markdown file with the project directory structure, ignoring common build and package folders across various tech stacks (e.g., Node.js, Laravel, Flutter, Django, Angular). Supports custom ignore lists via command-line options or a .projectignore file.
Installation
Install globally to use the project-tree command from any directory:
npm install -g project-tree-generator

Usage
Run the project-tree command with options to specify the project path, output file, and directories to ignore:
project-tree --path "<path-to-project>" --output <output-file> --ignore <dir1,dir2>

Options

--path <path>: Project root directory (default: current directory, .).
--output <file>: Output Markdown file (default: project_structure.md).
--ignore <dirs>: Comma-separated list of directories to ignore (e.g., cache,logs).

You can also create a .projectignore file in the project root with one directory per line to ignore additional folders.
Examples
Basic Usage (Current Directory)
Generate project_structure.md in the current directory, ignoring default folders (e.g., node_modules, dist) and custom folders cache and logs:
project-tree --ignore cache,logs

Output (project_structure.md):
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js
├── package.json
├── README.md

Specify Project Path (Windows)
Generate project_structure.md for a specific directory with spaces in the path (Windows example):
project-tree --path "D:\All\code\office code\Fruity-Chat\social" --ignore cache,logs

Output (D:\All\code\office code\Fruity-Chat\social\project_structure.md):
social/
├── src/
│   ├── components/
│   │   ├── Chat.js
├── package.json

Note: Use double quotes around paths with spaces on Windows.
Custom Output File (Cross-Platform)
Generate a custom output file tree.md in a Laravel project directory:
# Windows
project-tree --path "C:\Projects\laravel-app" --output tree.md --ignore cache,storage

# macOS/Linux
project-tree --path "/home/user/laravel-app" --output tree.md --ignore cache,storage

Output (tree.md):
laravel-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── UserController.php
├── routes/
│   ├── web.php
├── composer.json

Using .projectignore
Create a .projectignore file in the project root:
cache
logs
temp

Run without --ignore:
project-tree --path .

This ignores cache, logs, temp, and default folders.
Possible Errors
Below are common errors, their causes, and solutions:



Error Message
Cause
Solution



Error: Directory does not exist: <path>
The specified --path doesn't exist.
Verify the path (e.g., dir "D:\All\code\office code\Fruity-Chat\social" on Windows) and use quotes for spaces.


Error: Path is not a directory: <path>
The --path points to a file, not a directory.
Ensure the path is a directory, not a file.


Error: Permission denied accessing directory: <path>
No read access to the directory.
Run Command Prompt as Administrator or check directory permissions.


Error: Output directory does not exist: <dir>
The parent directory for --output doesn't exist.
Create the output directory (e.g., mkdir D:\output) or use a valid path.


Error: Permission denied writing to <file>
No write access for the output file.
Ensure write permissions or run as Administrator.


Error: Invalid ignore directories: <dirs>
--ignore includes paths (e.g., logs/) or empty entries.
Use simple directory names (e.g., cache,logs) without slashes.


Warning: Could not read .projectignore: <error>
.projectignore exists but is unreadable.
Check file permissions or delete .projectignore if not needed.


Troubleshooting

Command not recognized: Ensure project-tree is installed globally (npm install -g project-tree-generator) and %USERPROFILE%\AppData\Roaming\npm is in your PATH.
Check: echo %PATH% (Windows) or echo $PATH (macOS/Linux).
Re-link: cd D:\All\code\project-tree-generator && npm link.


Unexpected output: Verify ignored folders in .projectignore or --ignore. Default ignored folders include node_modules, dist, build, etc.
Test directly: Run node index.js --path "<path>" --ignore cache,logs to bypass CLI issues.

Development
To contribute or modify:

Clone the repository: git clone https://github.com/your-username/project-tree-generator.git
Install dependencies: npm install
Test locally: npm link
Run tests: npm test (add tests to scripts.test in package.json)

License
MIT
