# Campsite
Campsite is a developer productivity tool that offers metrics and insight of code and test quality.


# Installation

```
npm install @nexxspace/campsite jest
```

# Usage

## Measuring test coverage difference against a baseline measurement

Step 1. Take a baseline
    ```
    campsite --baseline
    ```

Step 2. Measure against baseline in Step 1. It will generate the following coverage statistics against baseline.

```
campsite
```

Output:
    
```
> campsite

All files:  -2.84%
 jest.ts: -2.13%    ... Uncovered lines: 13-24,58-70,75-83
 to-coverage-item.ts: -20%    ... Uncovered lines: 8
```
