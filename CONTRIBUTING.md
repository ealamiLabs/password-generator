# Contributing to Password Generator

We are delighted that you're thinking about contributing to the Password Generator project! 🎉 Before you start, please read the following guidelines.

## Dependencies

You need to use [Node.js](https://nodejs.org/) to run the project. If you don't have it installed, you can download it from the official website. We are currently using Node.js version [v20.12.2](https://nodejs.org/en/blog/release/v20.12.2). We also use `nvm` to manage the version (see `.nvmrc` file).

## Getting started

1. Fork the repository.
2. Clone the repository to your local machine.
3. Go to the project directory.
4. Install the dependencies by running `npm install`.

```bash
nvm use
npm install
```

## Development

We use [TypeScript](https://www.typescriptlang.org/) for development. All development should be done within your forked repository, once you're happy with your changes you can raise PR against the main repository.

## Testing

We use [Jest](https://jestjs.io/) for testing.

When working on the project, you should write tests for the code you're adding or changing. The coverage should not be lower than 90%.

You can run the tests by running the following command:

```bash
npm test # to run the tests
npm test:watch # to run the tests in watch mode
npm test:coverage # to run the tests and generate coverage report
```

## Linting

We use [ESLint](https://eslint.org/) for linting. You can run the linter by running the following command:

```bash
npm run lint # to check the code
npm run lint:fix # to fix the code
```
