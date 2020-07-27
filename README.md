# boyscout
Javascript module that analyzes the source files that has been changed and its test coverage

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
