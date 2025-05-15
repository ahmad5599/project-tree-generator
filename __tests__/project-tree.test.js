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

  test('generates tree for valid directory', async () => {
    await generateProjectTree({
      startPath: testDir,
      outputFile,
      userIgnoredDirs: ['cache']
    });

    const content = await fs.readFile(outputFile, 'utf-8');
    const expected = [
      'test-dir/',
      '├── src/',
      '│   ├── app.js',
      '├── package.json',
      '├── README.md'
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
});