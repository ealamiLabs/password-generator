import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'node:crypto';

const localDictionary = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'words.json'), 'utf8')
);

/** A word object that contains the word, its length, and the number of unique characters.
 *
 * @property word - The word.
 * @property length - The length of the word.
 * @property uniqueCharacters - The number of unique characters in the word.
 */
export interface Word {
  word: string;
  length: number;
  uniqueCharacters: number;
}

/** An offline password generator that generates passwords based on a dictionary of words. */
export interface OfflinePasswordGenerator {
  /** Returns currently used dictionary.
   *
   * @returns The current dictionary.
   */
  getDictionary(): Word[];

  /** Sets the dictionary to the given array of words. Each object should have the following properties:
   * - `word` (string): The word.
   * - `length` (number): The length of the word.
   * - `uniqueCharacters` (number): The number of unique characters in the word.
   *
   * @param dictionary - The dictionary to set.
   */
  setDictionary(dictionary: Word[]): void;

  /** Returns the minimum word length in the dictionary.
   *
   * @returns The minimum word length.
   */
  getMinWordLength(): number;

  /** Returns the maximum word length in the dictionary.
   *
   * @returns The maximum word length.
   */
  getMaxWordLength(): number;

  /** Returns a random word from the dictionary with the given length.
   *
   * @param length - The length of the word to get.
   * @returns A random word with the given length.
   */
  getRandomWord(length: number): Word;

  /** Sets the dictionary to the given array of words. Each string will be converted into a Word object and values for
   * `length` and `uniqueCharacters` will be calculated.
   *
   * @param words - The words to set.
   */
  setWords(words: string[]): void;

  /** Adds a word to the dictionary. The string will be converted into a Word object and values for `length` and
   * `uniqueCharacters` will be calculated.
   *
   * @param word - The word to add.
   */
  addWord(word: string): void;

  /** Adds all words from the given array to the dictionary. Each string will be converted into a Word object and values
   * for `length` and `uniqueCharacters` will be calculated.
   *
   * @param words - The words to add.
   */
  addWords(words: string[]): void;

  /** Removes a word from the dictionary.
   *
   * @param word - The word to remove.
   */
  removeWord(word: string): void;

  /** Removes all words from the given array from the dictionary.
   *
   * @param words - The words to remove.
   */
  removeWords(words: string[]): void;

  /** Checks if a word is present in the dictionary.
   *
   * @param word - The word to check.
   * @returns `true` if the word is present in the dictionary, `false` otherwise.
   */
  isPresent(word: string): boolean;

  /** Generates a random password that consists of `wordCount` words from the dictionary. Optionally, each word can be
   * separated by a `separator` and some characters can be randomly swapped for symbols.
   *
   * If `randomSymbolSwap` is `true`, the following swaps will be made:
   * - `a` -> `@` or `4` (50% chance each)
   * - `e` -> `3`
   * - `i` -> `!`
   * - `s` -> `$` or `5` (50% chance each)
   *
   * The probability of a character being swapped is 20%.
   *
   * @param wordCount - The number of words to generate.
   * @param separator - The separator to use between words.
   * @param randomSymbolSwap - Whether to randomly swap some characters for symbols.
   * */
  generate(
    wordCount: number,
    separator?: string,
    randomSymbolSwap?: boolean
  ): string;
}

/** An offline password generator that generates passwords based on a dictionary of words.
 *
 * @param dictionary - The initial dictionary to use.
 */
export function OfflinePasswordGenerator(dictionary: Word[] = localDictionary) {
  let localDict = dictionary;
  this.getDictionary = function (): Word[] {
    return localDict;
  };
  this.setDictionary = function (dictionary: Word[]): void {
    localDict = dictionary;
  };
  this.getMinWordLength = function (): number {
    return Math.min(...localDict.map((w: Word) => w.length));
  };
  this.getMaxWordLength = function (): number {
    return Math.max(...localDict.map((w: Word) => w.length));
  };
  this.getRandomWord = function (length: number): Word {
    const words = localDict.filter((w: Word) => w.length === length);

    if (words.length === 0) {
      throw new Error('No words with the given length');
    }

    return words[Math.floor(getRandomInteger(words.length))];
  };
  this.setWords = function (words: string[]): void {
    localDict = words.map((word: string) => ({
      word,
      length: word.length,
      uniqueCharacters: new Set(word.split('')).size,
    }));
  };
  this.addWord = function (word: string): void {
    localDict.push({
      word,
      length: word.length,
      uniqueCharacters: new Set(word.split('')).size,
    });
  };
  this.addWords = function (words: string[]): void {
    localDict.push(
      ...words.map((word: string) => ({
        word,
        length: word.length,
        uniqueCharacters: new Set(word.split('')).size,
      }))
    );
  };
  this.removeWord = function (word: string): void {
    localDict = localDict.filter((w: Word) => w.word !== word);
  };
  this.removeWords = function (words: string[]): void {
    localDict = localDict.filter((w: Word) => !words.includes(w.word));
  };
  this.isPresent = function (word: string): boolean {
    return localDict.find((w: Word) => w.word === word) !== undefined;
  };
  this.generate = function (
    wordCount: number = 3,
    separator?: string,
    randomSymbolSwap?: boolean
  ): string {
    if (wordCount < 1) throw new Error('Word count must be greater than 0');

    let password = '';

    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(getRandomInteger(localDict.length));

      let randomWord = localDict[randomIndex].word;

      if (separator && i < wordCount - 1) {
        randomWord += separator;
      }

      password += randomWord;
    }

    return randomSymbolSwap ? swapSymbols(password) : password;
  };
}

/** Swaps some characters in a word for symbols.
 * - `a` -> `@` or `4` (50% chance each)
 * - `e` -> `3`
 * - `i` -> `!`
 * - `s` -> `$` or `5` (50% chance each)
 *
 * @param word - The word to swap characters in.
 */
function swapSymbols(word: string): string {
  let newWord = '';

  for (const char of word) {
    if (getRandomInteger(100) < 20) {
      switch (char) {
        case 'a':
          newWord += getRandomInteger(100) < 50 ? '@' : '4';
          break;
        case 'e':
          newWord += '3';
          break;
        case 'i':
          newWord += '!';
          break;
        case 's':
          newWord += getRandomInteger(100) < 50 ? '$' : '5';
          break;
        default:
          newWord += char;
      }
    } else {
      newWord += char;
    }
  }

  return newWord;
}

/** Generates a random integer number between 0 and `max`.
 * Uses the `crypto` module to generate a random number and scales it to the desired range.
 *
 * @param max - The maximum number to generate.
 */
function getRandomInteger(max: number): number {
  const random = crypto.randomBytes(32).readUInt32BE(0);

  return Math.floor((random / 0xffffffff) * max);
}
