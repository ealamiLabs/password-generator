import * as fs from 'fs';
import * as path from 'path';

const localDictionary = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'words.json'), 'utf8')
);

export interface Word {
  word: string;
  length: number;
  uniqueCharacters: number;
}

export interface OfflinePasswordGenerator {
  dictionary: Word[];

  getDictionary(): Word[];

  setDictionary(dictionary: Word[]): void;

  addWord(word: Word): void;

  removeWord(word: Word): void;

  isPresent(word: string): boolean;

  generate(length: number): string;
}

export function OfflinePasswordGenerator(dictionary: Word[] = localDictionary) {
  this.dictionary = dictionary;
  this.getDictionary = function (): Word[] {
    return this.dictionary;
  };
  this.setDictionary = function (dictionary: Word[]): void {
    this.dictionary = dictionary;
  };
  this.setWords = function (words: string[]): void {
    this.dictionary = words.map((word: string) => ({
      word,
      length: word.length,
      uniqueCharacters: new Set(word.split('')).size,
    }));
  };
  this.addWord = function (word: string): void {
    this.dictionary.push({
      word,
      length: word.length,
      uniqueCharacters: new Set(word.split('')).size,
    });
  };
  this.addWords = function (words: string[]): void {
    this.dictionary.push(
      ...words.map((word: string) => ({
        word,
        length: word.length,
        uniqueCharacters: new Set(word.split('')).size,
      }))
    );
  };
  this.removeWord = function (word: string): void {
    this.dictionary = this.dictionary.filter((w: Word) => w.word !== word);
  };
  this.removeWords = function (words: string[]): void {
    this.dictionary = this.dictionary.filter(
      (w: Word) => !words.includes(w.word)
    );
  };
  this.isPresent = function (word: string): boolean {
    return this.dictionary.find((w: Word) => w.word === word) !== undefined;
  };
  this.generate = function (
    wordCount: number = 3,
    separator?: string,
    randomSymbolSwap?: boolean
  ): string {
    if (wordCount < 1) throw new Error('Word count must be greater than 0');

    let password = '';

    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * this.dictionary.length);

      let randomWord = this.dictionary[randomIndex].word;

      if (separator && i < wordCount - 1) {
        randomWord += separator;
      }

      password += randomWord;
    }

    return randomSymbolSwap ? swapSymbols(password) : password;
  };
}

function swapSymbols(word: string): string {
  let newWord = '';

  for (const char of word) {
    if (Math.random() < 0.2) {
      switch (char) {
        case 'a':
          newWord += Math.random() < 0.5 ? '@' : '4';
          break;
        case 'e':
          newWord += '3';
          break;
        case 'i':
          newWord += '!';
          break;
        case 's':
          newWord += Math.random() < 0.5 ? '$' : '5';
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
