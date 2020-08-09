import {CoverageItem, CoverageTable, DiffTable, FileStatus} from './jest';

export function diffBaseline(baseline: CoverageTable|undefined, newStats: CoverageTable): DiffTable {
    if (!baseline) {
        return {
            allFiles: newStats.allFiles,
            columnWidths: newStats.columnWidths,
            items: newStats.items.map(i => {
                return {...i, fileStatus: FileStatus.REMAINS};
            })
        };
    } else {
        const newStatsAllFiles = newStats.allFiles;
        const baselineAllFiles = baseline.allFiles;
        const newStatsItems = newStats && newStats.items ? newStats.items : [];
        const baselineItems = baseline && baseline.items ? baseline.items : [];

        const newStatsFiles = newStatsItems.map(ni => ni.file.trim());
        const baselineStatsFiles = baselineItems.map(bi => bi.file.trim());

        const deletedStatsItems = baselineItems.filter(bi => !newStatsFiles.includes(bi.file.trim()));
        const addedStatsItems = newStatsItems.filter(ni => !baselineStatsFiles.includes(ni.file.trim()));

        return {
            columnWidths: newStats.columnWidths,
            allFiles: {
                file: newStatsAllFiles.file,
                ...diff(baselineAllFiles, newStatsAllFiles),
                uncoveredLineNumbers: newStatsAllFiles.uncoveredLineNumbers,
                path: newStatsAllFiles.path,
            },
            items:
                addedStatsItems.map(ai => ({...ai, fileStatus: FileStatus.ADDED}))
                    .concat(
                        deletedStatsItems.map(di => ({...di, fileStatus: FileStatus.DELETED}))
                    )
                    .concat(
                        newStatsItems
                        .filter(ni => baselineItems.map(i => i.file).includes(ni.file))
                        .map(ni => {
                            const bi = baselineItems.find(bi => bi.path === ni.path);
                            return {
                                file: ni.file,
                                ...diff(bi ? bi : ni, ni),
                                uncoveredLineNumbers: ni.uncoveredLineNumbers,
                                path: ni.path,
                                fileStatus: FileStatus.REMAINS
                            };
                        })
                    )
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
