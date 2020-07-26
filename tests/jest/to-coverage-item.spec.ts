import {Line} from '../../src/lib/parse-lines';
import {toCoverageItem} from '../../src/lib/to-coverage-item';

describe('to coverage item', () => {
    test('empty line', () => {
        expect(toCoverageItem(new Line(''))).toBeFalsy();
    });

    test('not a line', () => {
        expect(toCoverageItem(new Line('ABC'))).toBeFalsy();
    });

    test('not a line', () => {
        expect(toCoverageItem(new Line('ABC'))).toBeFalsy();
    });

    test('all file line', () => {
        let coverageItem = toCoverageItem(
            new Line('All files       |   78.26 |        0 |   76.92 |   76.19 |')
        );

        expect(coverageItem.file).toEqual('All files');
        expect(coverageItem.statementPercent).toEqual(78.26);
        expect(coverageItem.branchPercent).toEqual(0);
        expect(coverageItem.functionPercent).toEqual(76.92);
        expect(coverageItem.linePercent).toEqual(76.19);
        expect(coverageItem.uncoveredLineNumbers).toEqual('');
    });

    test('file line', () => {
        let coverageItem = toCoverageItem(
            new Line('git.ts         |   66.67 |        0 |    62.5 |   64.29 | 18-23')
        );

        expect(coverageItem.file).toEqual('git.ts');
        expect(coverageItem.statementPercent).toEqual(66.67);
        expect(coverageItem.branchPercent).toEqual(0);
        expect(coverageItem.functionPercent).toEqual(62.5);
        expect(coverageItem.linePercent).toEqual(64.29);
        expect(coverageItem.uncoveredLineNumbers).toEqual('18-23');
    });
});
