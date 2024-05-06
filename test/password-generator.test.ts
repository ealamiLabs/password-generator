import { OfflinePasswordGenerator } from '../src';
import * as fs from 'fs';

const localDictionary = JSON.parse(fs.readFileSync('src/words.json', 'utf8'));

test('OfflinePasswordGenerator', () => {
  const generator = new OfflinePasswordGenerator();
  expect(generator).toBeInstanceOf(OfflinePasswordGenerator);
});

test('OfflinePasswordGenerator.getDictionary', () => {
  const generator = new OfflinePasswordGenerator();
  expect(generator.getDictionary()).toBeInstanceOf(Array);
  expect(generator.getDictionary()).toHaveLength(localDictionary.length);
});

test('OfflinePasswordGenerator.setDictionary', () => {
  const generator = new OfflinePasswordGenerator();
  generator.setDictionary([]);
  expect(generator.getDictionary()).toHaveLength(0);
  generator.setDictionary(localDictionary);
  expect(generator.getDictionary()).toHaveLength(localDictionary.length);
});

test('OfflinePasswordGenerator.setWords', () => {
  const generator = new OfflinePasswordGenerator();
  generator.setWords(['test', 'testtest']);
  expect(generator.getDictionary()).toContainEqual({
    word: 'test',
    length: 4,
    uniqueCharacters: 3,
  });
  expect(generator.getDictionary()).toContainEqual({
    word: 'testtest',
    length: 8,
    uniqueCharacters: 3,
  });
  expect(generator.getDictionary()).toHaveLength(2);
});

test('OfflinePasswordGenerator.addWord', () => {
  const generator = new OfflinePasswordGenerator();
  generator.addWord('new-word');
  expect(generator.getDictionary()).toContainEqual({
    word: 'new-word',
    length: 8,
    uniqueCharacters: 7,
  });
});

test('OfflinePasswordGenerator.addWords', () => {
  const generator = new OfflinePasswordGenerator();
  generator.addWords(['new-word', 'new-word2']);
  expect(generator.getDictionary()).toContainEqual({
    word: 'new-word',
    length: 8,
    uniqueCharacters: 7,
  });
  expect(generator.getDictionary()).toContainEqual({
    word: 'new-word2',
    length: 9,
    uniqueCharacters: 8,
  });
});

test('OfflinePasswordGenerator.removeWord', () => {
  const generator = new OfflinePasswordGenerator();
  generator.addWord('new-word');
  generator.removeWord('new-word');
  expect(generator.getDictionary()).not.toContainEqual({
    word: 'new-word',
    length: 8,
    uniqueCharacters: 7,
  });
});

test('OfflinePasswordGenerator.removeWords', () => {
  const generator = new OfflinePasswordGenerator();
  generator.addWords(['new-word', 'new-word2']);
  generator.removeWords(['new-word', 'new-word2']);
  expect(generator.getDictionary()).not.toContainEqual({
    word: 'new-word',
    length: 8,
    uniqueCharacters: 7,
  });
  expect(generator.getDictionary()).not.toContainEqual({
    word: 'new-word2',
    length: 9,
    uniqueCharacters: 8,
  });
});

test('OfflinePasswordGenerator.isPresent', () => {
  const generator = new OfflinePasswordGenerator();
  generator.addWord('test');
  expect(generator.isPresent('test')).toBe(true);
  expect(generator.isPresent('not-present')).toBe(false);
});

test('OfflinePasswordGenerator.generate', () => {
  const generator = new OfflinePasswordGenerator();
  generator.setDictionary([
    { word: 'aesi', length: 4, uniqueCharacters: 4 },
    { word: 'aesiaesi', length: 8, uniqueCharacters: 4 },
    {
      word: 'aesiaesiaesiaesiaesiaesiaesiaesiaesiaesim',
      length: 41,
      uniqueCharacters: 5,
    },
  ]);
  expect(generator.generate(3)).toMatch(/[a-z]+/);
  expect(generator.generate(3, '-')).toMatch(/[a-z]+-[a-z]+-[a-z]+/);

  const longPassword = generator.generate(3000, '', true);

  expect(longPassword).toContain('3');
  expect(longPassword).toContain('4');
  expect(longPassword).toContain('@');
  expect(longPassword).toContain('!');
  expect(longPassword).toContain('$');
  expect(longPassword).toContain('5');
  expect(longPassword).toContain('e');
  expect(longPassword).toContain('a');
  expect(longPassword).toContain('s');
  expect(longPassword).toContain('i');
  expect(longPassword).toContain('m');

  expect(() => generator.generate(0)).toThrow(
    'Word count must be greater than 0'
  );

  expect(() => generator.generate(-1)).toThrow(
    'Word count must be greater than 0'
  );
});
