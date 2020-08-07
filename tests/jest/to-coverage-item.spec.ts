import {convertCoverageLinesToCoverageItems} from '../../src/lib/jest/to-coverage-item';
import {CoverageItem, CoverageLine} from '../../src/lib/jest/jest';

describe('to coverage item', () => {
    test('empty line', () => {
        expect(convertCoverageLinesToCoverageItems([new CoverageLine('', '')]))
            .toEqual([]);
    });

    test('not a line', () => {
        expect(convertCoverageLinesToCoverageItems([new CoverageLine('ABC', '')]))
            .toEqual([]);
    });

    test('all file line', () => {
        let coverageItems: CoverageItem[]= convertCoverageLinesToCoverageItems(
            [new CoverageLine('All files       |   78.26 |        0 |   76.92 |   76.19 |', '')]
        );

        expect(coverageItems[0].file).toEqual('All files');
        expect(coverageItems[0].statementPercent).toEqual(78.26);
        expect(coverageItems[0].branchPercent).toEqual(0);
        expect(coverageItems[0].functionPercent).toEqual(76.92);
        expect(coverageItems[0].linePercent).toEqual(76.19);
        expect(coverageItems[0].uncoveredLineNumbers).toEqual('');
    });

    test('file line', () => {
        let coverageItems = convertCoverageLinesToCoverageItems(
            [new CoverageLine('git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23', '')]
        );

        expect(coverageItems[0].file).toEqual('git.ts');
        expect(coverageItems[0].statementPercent).toEqual(66.67);
        expect(coverageItems[0].branchPercent).toEqual(0);
        expect(coverageItems[0].functionPercent).toEqual(62.5);
        expect(coverageItems[0].linePercent).toEqual(64.29);
        expect(coverageItems[0].uncoveredLineNumbers).toEqual('18-23');
    });
});
