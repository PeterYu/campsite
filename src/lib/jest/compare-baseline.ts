import {diffBaseline} from './diff-baseline';
import {CoverageTable, DiffTable} from './jest';

export function compareBaseline(baseline: CoverageTable, newStats: CoverageTable): DiffTable {
    const diff = diffBaseline(baseline, newStats);
    const items = diff.items ? diff.items : [];
    const containsLinePercentage = items.filter(i => i.linePercent !== 0);
    const diffItems = containsLinePercentage ? containsLinePercentage : []
    return {
        columnWidths: newStats.columnWidths,
        allFiles: {...diff.allFiles},
        items: [...diffItems]
    };
}
