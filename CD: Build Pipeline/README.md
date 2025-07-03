
# 📦 Build Pipeline in GitHub Actions

This repository is a **template** for building CI/CD pipelines using **GitHub Actions**, demonstrated with a simple Node.js server.

---

## 🚀 What this project does

- Runs a Node.js server (`server.js`) that responds with `Hello World` on port `3000`.
- Has tests written with **Jest** and **Supertest** to verify HTTP responses.
- Enforces code quality with **Prettier** for formatting and **ESLint** for linting.
- Sets up CI using **GitHub Actions** to automate these checks.

---

## 🏗️ GitHub Actions Pipeline

### Original pipeline example

```
name: Build the Pipeline Baby

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Format check
        run: npm run format

      - name: Lint code
        run: npm run lint

      - name: Compile code (noop)
        run: echo "No compile step needed"

      - name: Run tests
        run: npm test
```

### Improved step reuse (composite action)

```
name: "Format and Lint Code"
description: "Runs Prettier to check formatting and ESLint to lint code"

runs:
  using: "composite"
  steps:
    - name: Format check
      run: npm run format
      shell: bash

    - name: Lint code
      run: npm run lint
      shell: bash
```

Just so that we can re-ues it in other workflows as well, but just wanted to practice the action stuff

---

## 🧪 Scripts available

- `npm start` - start the Node server on port 3000
- `npm test` - run tests with Jest and Supertest
- `npm run lint` - check code with ESLint
- `npm run format` - check formatting with Prettier

---

## 📝 License

ISC

---

✅ **Author**:Ruby Tubes
