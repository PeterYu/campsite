import {Line} from './parse-lines';
import {CoverageItem} from './jest';

export function toCoverageItem(line: Line): CoverageItem | undefined {
    let columns = line.line.split('|');

    if (columns.length != 6) {
        return undefined;
    }

    return {
        file: columns[0].trim(),
        statementPercent: Number.parseFloat(columns[1].trim()),
        branchPercent: Number.parseFloat(columns[2].trim()),
        functionPercent: Number.parseFloat(columns[3].trim()),
        linePercent: Number.parseFloat(columns[4].trim()),
        uncoveredLineNumbers: columns[5].trim()
    };
}
