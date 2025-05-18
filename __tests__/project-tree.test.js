const fs = require('fs').promises;
const path = require('path');
const { generateProjectTree } = require('../index.js');

describe('generateProjectTree', () => {
  const testDir = path.join(__dirname, '..', 'test-data', 'test-dir');
  const outputFile = path.join(__dirname, 'test-output.md');

  beforeEach(async () => {
    // Clean up output file before each test
    try {
      await fs.unlink(outputFile);
    } catch (err) {
      // Ignore if file doesn't exist
    }
  });

  test('generates tree for valid directory with correct formatting', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      userIgnoredDirs: ['cache']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    const expected = [
      'test-dir/',
      '├── src/',
      '│   └── app.js',
      '├── package.json',
      '└── README.md'
    ].join('\n');
    expect(content).toBe(expected);
  });

  test('ignores custom directories', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      userIgnoredDirs: ['cache']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).not.toContain('cache/');
    expect(content).toContain('src/');
    expect(content).toContain('package.json');
    expect(content).toContain('README.md');
  });

  test('ignores default directories like node_modules', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      userIgnoredDirs: []
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).not.toContain('node_modules/');
  });

  test('ignores files by extension', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      ignoreExt: ['.js']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).not.toContain('app.js');
    expect(content).toContain('README.md');
    expect(content).toContain('package.json');
  });

  test('includes only specified extensions', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      onlyExt: ['.js']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).toContain('app.js');
    expect(content).not.toContain('README.md');
    expect(content).not.toContain('package.json');
  });

  test('shows only directories with --dirs-only', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      dirsOnly: true
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).toContain('test-dir/');
    expect(content).toContain('cache/');
    expect(content).toContain('src/');
    expect(content).not.toContain('app.js');
    expect(content).not.toContain('README.md');
    expect(content).not.toContain('package.json');
  });

  test('--dirs-only ignores extension filters', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      dirsOnly: true,
      onlyExt: ['.js']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).toContain('test-dir/');
    expect(content).toContain('cache/');
    expect(content).toContain('src/');
    expect(content).not.toContain('app.js');
  });

  test('throws error for non-existent directory', async () => {
    await expect(
      generateProjectTree({
        startPath: path.join(__dirname, 'nonexistent'),
        outputFile
      })
    ).rejects.toThrow('Directory does not exist');
  });

  test('throws error for invalid ignore directories', async () => {
    await expect(
      generateProjectTree({
        startPath: testDir,
        outputFile,
        userIgnoredDirs: ['invalid/path']
      })
    ).rejects.toThrow('Invalid ignore directories');
  });

  test('throws error for invalid ignore extensions', async () => {
    await expect(
      generateProjectTree({
        startPath: testDir,
        outputFile,
        ignoreExt: ['js', '.js/path']
      })
    ).rejects.toThrow('Invalid ignore extensions');
  });

  test('throws error for invalid only extensions', async () => {
    await expect(
      generateProjectTree({
        startPath: testDir,
        outputFile,
        onlyExt: ['', '.js\\path']
      })
    ).rejects.toThrow('Invalid only extensions');
  });
});