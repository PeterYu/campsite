import {exec} from 'child_process';
import {parseLines} from './parse-lines';
import {parseCoverageLine} from './coverage-line-parser';
import {toCoverageItem} from './to-coverage-item';

export function jestCoverage() {
    exec('jest --coverage', (error, stdout, stderr) => {
        console.log(`jest output: ${stdout}`);
        const coverageTable = parseCoverageOutput(stdout);
        console.log('coverage output:', coverageTable);
    });
}

export interface CoverageItem {
    file: string;
    statementPercent: number;
    branchPercent: number;
    functionPercent: number;
    linePercent: number;
    uncoveredLineNumbers: string;
}

export interface CoverageTable {
    allFiles: CoverageItem;
    items?: CoverageItem[]
}

export function parseCoverageOutput(rawOutput: string): CoverageTable {
    const lines = parseLines(rawOutput);

    let coverageLines = parseCoverageLine(lines);

    let coverageItems = coverageLines.map(toCoverageItem);

    return {
        allFiles: coverageItems[0],
        items: coverageItems.splice(1)
    };
}
