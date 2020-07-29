import {CoverageItem, CoverageTable} from './jest';

export function diffBaseline(baseline: CoverageTable, newStats: CoverageTable): CoverageTable {
    if (!baseline) {
        return newStats;
    } else {
        const newStatsAllFiles = newStats.allFiles;
        const baselineAllFiles = baseline.allFiles;
        return {
            allFiles: {
                file: newStatsAllFiles.file,
                ...diff(baselineAllFiles, newStatsAllFiles),
                uncoveredLineNumbers: newStatsAllFiles.uncoveredLineNumbers
            },
            items: newStats.items
                .filter(ni => baseline.items.map(i => i.file).includes(ni.file))
                .map(ni => {
                    const bi = baseline.items.find(bi => bi.file === ni.file);
                    return {
                        file: ni.file,
                        ...diff(bi, ni),
                        uncoveredLineNumbers: ni.uncoveredLineNumbers
                    };
                })
        }
    }
}

export type Percentages = Pick<CoverageItem, 'branchPercent' | 'functionPercent' | 'linePercent' | 'statementPercent'>;

function diff(baselineStats: Percentages, newStats: Percentages): Percentages {
    return {
        branchPercent: newStats.branchPercent - baselineStats.branchPercent,
        functionPercent: newStats.functionPercent - baselineStats.functionPercent,
        linePercent: newStats.linePercent - baselineStats.linePercent,
        statementPercent: newStats.statementPercent - baselineStats.statementPercent,
    }
}
