import {exec} from 'child_process';
import {Line} from './parse-lines';
import * as fs from 'fs';
import {bold, green, red} from 'colors/safe';
import {compareBaseline} from './compare-baseline';
import {parseCoverageOutput} from './parse-coverage';

export interface Args {
    baseline?: boolean;
}

export function jestCoverage(bsArgs: Args) {
    exec('npx jest --coverage', (error, stdout, stderr) => {

        console.log(stdout);
        console.error(stderr);

        const coverageTable = parseCoverageOutput(stdout);
        // console.log('coverage output:', coverageTable);
        // console.log('argments:', bsArgs);
        if (bsArgs.baseline) {
            fs.writeFileSync('campsite.baseline', JSON.stringify(coverageTable, null, '\t'));
        } else {
            if (fs.existsSync('campsite.baseline')) {
                const baselineBuffer = fs.readFileSync('campsite.baseline', {encoding: 'utf8'});

                const diffTable = compareBaseline(JSON.parse(baselineBuffer), coverageTable);

                console.log('Comparing line coverage % against baseline');
                console.log('All files: ', colorizeDiff(diffTable.allFiles.linePercent));
                diffTable.items.forEach(diff => {
                    console.log(` ${diff.file}: ${colorizeDiff(diff.linePercent)} ${uncoveredLines(diff)}`);
                });
            }
        }
    });
}

export class CoverageLine extends Line {
    constructor(public line: string, public path: string) {
        super(line);
    }
}

export interface CoverageItem {
    file: string;
    statementPercent: number;
    branchPercent: number;
    functionPercent: number;
    linePercent: number;
    uncoveredLineNumbers: string;
    path: string;
}

export interface CoverageTable {
    allFiles: CoverageItem;
    items: CoverageItem[]
}

function colorizeDiff(diff: number) {
    const roundedDiff = parseFloat(diff.toFixed(2));
    if (roundedDiff > 0) {
        return bold(green(`+${roundedDiff}%`));
    } else if (roundedDiff < 0) {
        return bold(red(`${roundedDiff}%`));
    } else {
        return `${roundedDiff}%`;
    }
}

function uncoveredLines(diff: CoverageItem) {
    if (diff.linePercent < 0) {
        return `   ${red('... Uncovered lines: ')}${bold(red(diff.uncoveredLineNumbers))}`;
    } else {
        return '';
    }
}
