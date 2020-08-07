import {CoverageLine} from '../../src/lib/jest/jest';
import {Line} from '../../src/lib/jest/parse-lines';
import {toCoverageLines} from '../../src/lib/jest/to-coverage-lines';

describe('convert to coverage lines', () => {
    test('', () => {
        const coverageLines: CoverageLine[] = toCoverageLines([
            new Line('All files                 |   71.05 |    59.57 |   70.59 |   70.09 |                   |'),
            new Line(' campsite                 |   66.67 |        0 |    62.5 |   64.29 |                   |'),
            new Line('  git.ts                  |   66.67 |        0 |    62.5 |   64.29 | 18-23             |'),
            new Line(' campsite/src/lib/jest    |   71.72 |    62.22 |   73.08 |   70.97 |                   |'),
            new Line('  compare-baseline.ts     |      25 |        0 |       0 |   28.57 | 5-9               |'),
        ]);

        expect(coverageLines).toEqual([
            new CoverageLine('All files                 |   71.05 |    59.57 |   70.59 |   70.09 |                   |', ''),
            new CoverageLine(' campsite                 |   66.67 |        0 |    62.5 |   64.29 |                   |', 'campsite'),
            new CoverageLine('  git.ts                  |   66.67 |        0 |    62.5 |   64.29 | 18-23             |', 'campsite/git.ts'),
            new CoverageLine(' campsite/src/lib/jest    |   71.72 |    62.22 |   73.08 |   70.97 |                   |', 'campsite/src/lib/jest'),
            new CoverageLine('  compare-baseline.ts     |      25 |        0 |       0 |   28.57 | 5-9               |', 'campsite/src/lib/jest/compare-baseline.ts'),
        ]);
    });
});
