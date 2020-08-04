import {parseCoverageOutput} from '../../src/lib/parse-coverage';

describe('jest module', () => {
    test('no item', () => {
        const coverageOutput = `
 PASS  tests/jest/no-report.spec.ts
  No report test
    ✓ simple test (2 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.924 s
Ran all test suites matching /tests\\/jest\\/no-report.spec.ts/i.
`;

        const coverageReport = parseCoverageOutput(coverageOutput);

        expect(coverageReport.allFiles).toBeTruthy();
        expect(coverageReport.items).toEqual([]);
    });

    test('select coverage table', () => {
        const jestCoverageOutput = `

> boyscout@1.0.0 test /Users/peyu/Documents/boyscout
> jest --coverage

 PASS  tests/git/git.spec.ts
  git module
    ✓ no modified files (3 ms)
    ✓ new file
    ✓ modified file
    ✓ deleted file (1 ms)
    ○ skipped untracked file

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   66.67 |        0 |    62.5 |   64.29 |                   
 git.ts   |   66.67 |        0 |    62.5 |   64.29 | 18-23             
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 skipped, 4 passed, 5 total
Snapshots:   0 total
Time:        0.805 s, estimated 1 s
Ran all test suites.
        `;

        const coverageReport = parseCoverageOutput(jestCoverageOutput);

        expect(coverageReport.allFiles).toBeTruthy();
    });

    test('extra columns are okay', () => {
        const jestCoverageOutput = `
----------|---------|----------|---------|---------|-------------------|
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
----------|---------|----------|---------|---------|-------------------|
All files |   66.67 |        0 |    62.5 |   64.29 |                   |
 git.ts   |   66.67 |        0 |    62.5 |   64.29 | 18-23             |
----------|---------|----------|---------|---------|-------------------|
        `;

        const coverageReport = parseCoverageOutput(jestCoverageOutput);

        expect(coverageReport.allFiles).toBeTruthy();
    });
})
