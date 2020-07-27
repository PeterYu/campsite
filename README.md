# Campsite
Campsite is a developer productivity tool that offers metrics and insight of code and test quality.

# Installation

```
npm install
npm run build:js
```

# Usage

1. Take a baseline
    ```
    node dist/index.js --baseline
    ```

2. Measure against baseline
    ```
    node dist/index.js
    ```

    It will generate the following coverage statistics against baseline.
    ```
    > node dist/index.js

    All files:  -2.84%
     jest.ts: -2.13%    ... Uncovered lines: 13-24,58-70,75-83
     to-coverage-item.ts: -20%    ... Uncovered lines: 8
    ```
