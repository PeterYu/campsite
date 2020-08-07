import {Line} from '../../src/lib/jest/parse-lines';
import {parseCoverageLine} from '../../src/lib/jest/coverage-line-parser';

describe('coverage line parser', () => {
    test('no lines', () => {
        const coverageLines = parseCoverageLine([]);

        expect(coverageLines).toEqual([]);
    });

    test('No coverage line', () => {
        const coverageLines = parseCoverageLine([new Line('hello')]);

        expect(coverageLines).toEqual([]);
    });


    test('One coverage line', () => {
        const coverageLines = parseCoverageLine([
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('All files |       0 |        0 |       0 |       0 |'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
        ]);

        expect(coverageLines).toEqual([
            new Line('All files |       0 |        0 |       0 |       0 |')
        ]);
    });

    test('two coverage lines', () => {
        const coverageLines = parseCoverageLine([
            new Line('----------------|---------|----------|---------|---------|-------------------'),
            new Line('File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s '),
            new Line('----------------|---------|----------|---------|---------|-------------------'),
            new Line('All files       |   78.26 |        0 |   76.92 |   76.19 |                   '),
            new Line(' git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23             '),
            new Line('----------------|---------|----------|---------|---------|-------------------'),
        ]);

        expect(coverageLines).toEqual([
            new Line('All files       |   78.26 |        0 |   76.92 |   76.19 |                   '),
            new Line(' git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23             '),
        ]);
    });

    test('Dont start parsing before start of table', () => {
        const coverageLines = parseCoverageLine([
            new Line('This is not a line'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('All files |       0 |        0 |       0 |       0 |'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
        ]);

        expect(coverageLines).toEqual([
            new Line('All files |       0 |        0 |       0 |       0 |')
        ]);
    });

    test('Stop parsing after end of table', () => {
        const coverageLines = parseCoverageLine([
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('All files |       0 |        0 |       0 |       0 |'),
            new Line('----------|---------|----------|---------|---------|-------------------'),
            new Line('This is not a line'),
        ]);

        expect(coverageLines).toEqual([
            new Line('All files |       0 |        0 |       0 |       0 |')
        ]);
    });

    test('multiple coverage lines with non table lines', () => {
        const coverageLines = parseCoverageLine([
            new Line('This line is before table'),
            new Line('----------------|---------|----------|---------|---------|-------------------'),
            new Line('File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s '),
            new Line('----------------|---------|----------|---------|---------|-------------------'),
            new Line('All files       |   78.26 |        0 |   76.92 |   76.19 |                   '),
            new Line(' git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23             '),
            new Line(' parse-lines.ts |     100 |      100 |     100 |     100 |                   '),
            new Line('----------------|---------|----------|---------|---------|-------------------'),
            new Line('This line is after table'),
        ]);

        expect(coverageLines).toEqual([
            new Line('All files       |   78.26 |        0 |   76.92 |   76.19 |                   '),
            new Line(' git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23             '),
            new Line(' parse-lines.ts |     100 |      100 |     100 |     100 |                   '),
        ]);
    });

});
