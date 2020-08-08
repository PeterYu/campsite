import {CoverageItem, CoverageTable} from './jest';

export function diffBaseline(baseline: CoverageTable|undefined, newStats: CoverageTable): CoverageTable {
    if (!baseline) {
        return newStats;
    } else {
        const newStatsAllFiles = newStats.allFiles;
        const baselineAllFiles = baseline.allFiles;
        const newStatsItems = newStats && newStats.items ? newStats.items : [];
        const baselineItems = baseline && baseline.items ? baseline.items : [];
        return {
            columnWidths: newStats.columnWidths,
            allFiles: {
                file: newStatsAllFiles.file,
                ...diff(baselineAllFiles, newStatsAllFiles),
                uncoveredLineNumbers: newStatsAllFiles.uncoveredLineNumbers,
                path: newStatsAllFiles.path
            },
            items: newStatsItems
                .filter(ni => baselineItems.map(i => i.file).includes(ni.file))
                .map(ni => {
                    const bi = baselineItems.find(bi => bi.path === ni.path);
                    return {
                        file: ni.file,
                        ...diff(bi ? bi : ni, ni),
                        uncoveredLineNumbers: ni.uncoveredLineNumbers,
                        path: ni.path
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
