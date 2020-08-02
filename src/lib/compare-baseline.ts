import {diffBaseline} from './diff-baseline';
import {CoverageTable} from './jest';

export function compareBaseline(baseline: CoverageTable, newStats: CoverageTable): CoverageTable {
    const diff = diffBaseline(baseline, newStats);
    const items = diff.items ? diff.items : [];
    const containsLinePercentage = items.filter(i => i.linePercent !== 0);
    const diffItems = containsLinePercentage ? containsLinePercentage : []
    return {
        allFiles: {...diff.allFiles},
        items: [...diffItems]
    };
}