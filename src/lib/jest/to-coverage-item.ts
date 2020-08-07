import {CoverageItem, CoverageLine} from './jest';

export function convertCoverageLinesToCoverageItems(coverageLines: CoverageLine[]) {
    return coverageLines
        .filter(isValidCoverageLine)
        .map(toCoverageItem);
}

function isValidCoverageLine(cl: CoverageLine) {
    return cl.line.split('|').length >= 6;
}

function toCoverageItem(line: CoverageLine): CoverageItem {
    let columns = line.line.split('|');

    return {
        file: columns[0].trim(),
        statementPercent: Number.parseFloat(columns[1].trim()),
        branchPercent: Number.parseFloat(columns[2].trim()),
        functionPercent: Number.parseFloat(columns[3].trim()),
        linePercent: Number.parseFloat(columns[4].trim()),
        uncoveredLineNumbers: columns[5].trim(),
        path: line.path
    };
}
