import {diffBaseline, Percentages} from '../../src/lib/jest/diff-baseline';
import {FileStatus} from '../../src/lib/jest/jest';

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
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages3,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43',
                    path: 'git.ts',
                    fileStatus: FileStatus.REMAINS
                }
            ]

        };

        const diff = diffBaseline(undefined, newStats);

        expect(diff).toEqual(newStats);
    });
    
    test('baseline exists compare stats', () => {
        const baselineStats = {
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3',
                    path: 'git.ts'
                }
            ]

        };
        const newStats = {
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43',
                    path: 'git.ts'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            columnWidths: [],
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers,
                path: ''
            },
            items: [
                {
                    file: newStats.items[0].file,
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers,
                    path: newStats.items[0].path,
                    fileStatus: FileStatus.REMAINS
                }
            ]
        });
    });

    test('files only in baseline (delete file)', () => {
        const baselineStats = {
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3',
                    path: 'git.ts'
                },
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3',
                    path: 'jest.ts'
                }
            ]
        };

        const newStats = {
            columnWidths: [],
            allFiles: {
                columnWidths: [],
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43',
                    path: 'git.ts'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            columnWidths: [],
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers,
                path: ''
            },
            items: [
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3',
                    path: 'jest.ts',
                    fileStatus: FileStatus.DELETED
                },
                {
                    file: 'git.ts',
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers,
                    path: 'git.ts',
                    fileStatus: FileStatus.REMAINS
                }
            ]
        });

    });

    test('files only in new stats (new file)', () => {
        const baselineStats = {
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages1,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages1,
                    uncoveredLineNumbers: '12-3',
                    path: 'git.ts'
                }
            ]
        };

        const newStats = {
            columnWidths: [],
            allFiles: {
                file: 'All files',
                ...percentages2,
                uncoveredLineNumbers: '',
                path: ''
            },
            items: [
                {
                    file: 'git.ts',
                    ...percentages3,
                    uncoveredLineNumbers: '23-43',
                    path: 'git.ts'
                },
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3',
                    path: 'jest.ts'
                }
            ]
        };

        const diff = diffBaseline(baselineStats, newStats);

        expect(diff).toEqual({
            columnWidths: [],
            allFiles: {
                file: newStats.allFiles.file,
                ...percentages1,
                uncoveredLineNumbers: newStats.allFiles.uncoveredLineNumbers,
                path: ''
            },
            items: [
                {
                    file: 'jest.ts',
                    ...percentages2,
                    uncoveredLineNumbers: '12-3',
                    path: 'jest.ts',
                    fileStatus: FileStatus.ADDED
                },
                {
                    file: 'git.ts',
                    ...percentages2,
                    uncoveredLineNumbers: newStats.items[0].uncoveredLineNumbers,
                    path: 'git.ts',
                    fileStatus: FileStatus.REMAINS
                },
            ]
        });

    });

});
