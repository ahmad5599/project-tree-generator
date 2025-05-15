#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

async function generateProjectTree({
  startPath = '.',
  indent = '│   ',
  prefix = '├── ',
  outputFile = 'project_structure.md',
  userIgnoredDirs = []
}) {
  // Common package and build folders across tech stacks
  const DEFAULT_IGNORED_DIRS = new Set([
    'node_modules', 'vendor', '.dart_tool', 'packages', 'target', 'deps',
    'venv', '.venv', 'env', '.env', 'site-packages', 'bower_components', 'Pods',
    'dist', 'build', '.next', 'out', 'public/build', 'storage/framework/cache',
    'storage/framework/views', 'target/debug', 'target/release', 'www', 'bin',
    'obj', '.build', 'artifacts', 'coverage', '.cache', '.nuxt', '.output',
    '.git', '__pycache__', '.DS_Store', '.idea', '.vscode', '.history',
    'tmp', 'temp', 'log', 'logs'
  ]);

  // Validate startPath
  try {
    const stats = await fs.stat(startPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${startPath}`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Directory does not exist: ${startPath}`);
    }
    if (err.code === 'EACCES') {
      throw new Error(`Permission denied accessing directory: ${startPath}`);
    }
    throw new Error(`Failed to access directory: ${err.message}`);
  }

  // Validate outputFile path
  const outputDir = path.dirname(path.resolve(outputFile));
  try {
    await fs.access(outputDir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Output directory does not exist: ${outputDir}`);
    }
    throw new Error(`Cannot access output directory: ${err.message}`);
  }

  // Load ignored directories from .projectignore file, if it exists
  let fileIgnoredDirs = new Set();
  const projectIgnoreFile = path.join(startPath, '.projectignore');
  try {
    if (await fs.access(projectIgnoreFile).then(() => true).catch(() => false)) {
      const content = await fs.readFile(projectIgnoreFile, 'utf-8');
      fileIgnoredDirs = new Set(
        content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
      );
    }
  } catch (err) {
    console.warn(`Warning: Could not read .projectignore: ${err.message}`);
  }

  // Validate and combine ignored directories
  const invalidDirs = userIgnoredDirs.filter(dir => !dir || dir.includes(path.sep) || dir.includes('/'));
  if (invalidDirs.length > 0) {
    console.log('Invalid directories detected:', invalidDirs); // Debug log
    throw new Error(`Invalid ignore directories (must be simple names, no paths): ${invalidDirs.join(', ')}`);
  }

  const ignoredDirs = new Set([
    ...DEFAULT_IGNORED_DIRS,
    ...userIgnoredDirs,
    ...fileIgnoredDirs
  ]);

  async function traverseDirectory(dirPath, level = 0, traverseIndent, traversePrefix) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      entries.sort((a, b) => {
        if (a.isDirectory() === b.isDirectory()) {
          return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        }
        return a.isDirectory() ? -1 : 1;
      });

      const lines = [];
      for (const entry of entries) {
        if (entry.isDirectory() && ignoredDirs.has(entry.name)) {
          continue;
        }

        const indentStr = level > 0 ? traverseIndent.repeat(level) : '';
        const entryStr = `${indentStr}${traversePrefix}${entry.name}${entry.isDirectory() ? '/' : ''}`;
        lines.push(entryStr);

        if (entry.isDirectory()) {
          const subLines = await traverseDirectory(
            path.join(dirPath, entry.name),
            level + 1,
            level === 0 ? traverseIndent : '    ',
            traversePrefix
          );
          lines.push(...subLines);
        }
      }
      return lines;
    } catch (err) {
      if (err.code === 'EACCES') {
        return [`${traverseIndent.repeat(level)}${traversePrefix}[Permission Denied]`];
      }
      if (err.code === 'ENOENT') {
        return [`${traverseIndent.repeat(level)}${traversePrefix}[Directory Not Found]`];
      }
      throw new Error(`Failed to read directory ${dirPath}: ${err.message}`);
    }
  }

  const rootName = path.basename(path.resolve(startPath)) + '/';
  const treeLines = [rootName, ...(await traverseDirectory(startPath, 0, indent, prefix))];

  try {
    await fs.writeFile(outputFile, treeLines.join('\n'), 'utf-8');
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Project structure has been written to ${outputFile}`);
    }
  } catch (err) {
    if (err.code === 'EACCES') {
      throw new Error(`Permission denied writing to ${outputFile}`);
    }
    if (err.code === 'ENOENT') {
      throw new Error(`Cannot write to ${outputFile}: Parent directory does not exist`);
    }
    throw new Error(`Failed to write output file: ${err.message}`);
  }
}

// CLI setup
program
  .name('project-tree')
  .description('Generate a project directory structure in Markdown format')
  .option('--ignore <dirs>', 'Comma-separated list of directories to ignore', '')
  .option('--path <path>', 'Project root directory', '.')
  .option('--output <file>', 'Output Markdown file', 'project_structure.md')
  .action(async (options) => {
    try {
      const userIgnoredDirs = options.ignore
        ? options.ignore.split(',').map(d => d.trim()).filter(d => d)
        : [];
      await generateProjectTree({
        startPath: path.resolve(options.path),
        outputFile: options.output,
        userIgnoredDirs
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Export for testing
module.exports = { generateProjectTree };