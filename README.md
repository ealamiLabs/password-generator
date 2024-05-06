<img src="https://avatars.githubusercontent.com/u/168830368?s=200&v=4" width="100" />

# ealamiLabs - Password generator 🔒

`@ealamilabs/password-generator` is a simple password generator library that can be used to generate random passwords. The library allows you to use existing dictionary [10,000+ most common English words](https://github.com/ealamiLabs/words) or feed your own dictionary (or even list of words) and generate a random password based on some parameters provided.

Currently, the library supports the following parameters:

- number of words in the password
- separator symbol
- random substitutions of some characters
  - `a` -> `@` or `4`
  - `e` -> `3`
  - `i` -> `1`
  - `s` -> `$` or `5`

---

## Installation

If you're using `npm`:

```bash
npm install @ealamilabs/password-generator
```

If you're using `yarn`:

```bash
yarn add @ealamilabs/password-generator
```

---

## Usage

### Setting up a generator

Below you can find instructions on the basic package usage.

#### Setting up generator with default dictionary

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();
```

#### Setting up generator with custom dictionary

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const myCustomDictionary = [
  { word: 'test', length: 4, uniqueCharacters: 3 },
  { word: 'password', length: 8, uniqueCharacters: 6 },
];

const generator = new OfflinePasswordGenerator(myCustomDictionary);
```

#### Updating dictionary on the fly

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.setDictionary([
  { word: 'test', length: 4, uniqueCharacters: 3 },
  { word: 'password', length: 8, uniqueCharacters: 6 },
]);
```

#### Generates and sets dictionary from the list of strings

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.setWords(['test', 'password']);
```

#### Adding single word

Adds the word to the dictionary.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.addWord('test');
```

#### Adding multiple words

Adds all words from the given array to the dictionary.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.addWords(['test', 'password']);
```

#### Removing single word

Removes the word from the dictionary.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.removeWord('test');
```

#### Removing multiple words

Removes all words from the given array from the dictionary.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.removeWords(['test', 'password']);
```

#### Checking if word exists

Returns `true` if the word exists in the dictionary, otherwise `false`.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();

generator.isPresent('test');
```

### Generating passwords

#### Generate a password of the given length

This will generate a random password without any separators consisting of 3 random words.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();
const randomPasssword = generator.generate(3);
```

#### Generate a password of the given length with separators

This will generate a random password with given string separators between each word.

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();
const randomPasssword = generator.generate(3, '-');
```

#### Generate a password of the given length with separators and swaps

This will generate a random password with given string separators between each word. It will also randomly swap some characters in the words (e.g. `a` -> `@` or `4`, `e` -> `3`, `i` -> `1`, `s` -> `$` or `5`).

```javascript
import { OfflinePasswordGenerator } from '@ealamilabs/password-generator';

const generator = new OfflinePasswordGenerator();
const randomPasssword = generator.generate(3, '-', true);
```

## Roadmap

- [ ] Add more built-in languages (currently only English, but you can extend yourself with your own dictionary)
- [ ] Add smarter substitutions
- [ ] Add ability to set minimum and maximum password lengths
- [ ] Add ability to set minimum and maximum word lengths
- [ ] Add ability to set minimum and maximum unique characters in the word
- [ ] Add ability to set minimum and maximum number of words in the password
- [ ] Add ability to use online dictionary (e.g. provided from the [10,000+ most common English words](https://github.com/ealamiLabs/words))
