import {diffBaseline, Percentages} from '../../src/lib/diff-baseline';

describe('Compare Against Baseline', () => {
    const percentages1: Percentages = {
        branchPercent: 1,
        functionPercent: 1,
        linePercent: 1,
        statementPercent: 1
    };

    const percentages2: Percentages = {
        branchPercent: 2,
        functionPercent: 2,
        linePercent: 2,
        statementPercent: 2
    };

    const percentages3: Percentages = {
        branchPercent: 3,
        functionPercent: 3,
        linePercent: 3,
        statementPercent: 3
    };

    test('no baseline to compare against', () => {
        const newStats = {
            allFiles: {
                file: 'All files',
                ...percentages3,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43'
                }
            ]

        };

        const diff = diffBaseline(undefined, newStats);

        expect(diff).toEqual(newStats);
    });
    
    test('baseline exists compare stats', () => {
        const baselineStats = {
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3'
                }
            ]

        };
        const newStats = {
            allFiles: {
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers
            },
            items: [
                {
                    file: newStats.items[0].file,
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers
                }
            ]
        });
    });

    test('files only in baseline (delete file)', () => {
        const baselineStats = {
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3'
                },
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3'
                }
            ]
        };

        const newStats = {
            allFiles: {
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers
                }
            ]
        });

    });

    test('files only in new stats (new file)', () => {
        const baselineStats = {
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3'
                }
            ]
        };

        const newStats = {
            allFiles: {
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43'
                },
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers
                }
            ]
        });

    });

});
