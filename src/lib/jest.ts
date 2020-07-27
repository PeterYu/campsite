import {exec} from 'child_process';
import {parseLines} from './parse-lines';
import {parseCoverageLine} from './coverage-line-parser';
import {toCoverageItem} from './to-coverage-item';
import * as fs from 'fs';
import {bold, green, red} from 'colors/safe';

export interface Args {
    baseline?: boolean;
}

export function jestCoverage(bsArgs: Args) {
    exec('jest --coverage', (error, stdout, stderr) => {
        // console.log(`jest output: ${stdout}`);
        const coverageTable = parseCoverageOutput(stdout);
        // console.log('coverage output:', coverageTable);
        // console.log('argments:', bsArgs);
        if (bsArgs.baseline) {
            fs.writeFileSync('campsite.baseline', JSON.stringify(coverageTable, null, '\t'));
        } else {
            if (fs.existsSync('campsite.baseline')) {
                const baselineBuffer = fs.readFileSync('campsite.baseline', {encoding: 'utf8'});
                // console.log('about to diff baseline', baselineBuffer);
                compareBaseline(JSON.parse(baselineBuffer), coverageTable);
            }
        }
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

function uncoveredLines(newStat: CoverageItem, baselineStat: CoverageItem) {
    if (newStat.linePercent - baselineStat.linePercent < 0) {
        return `   ${red('... Uncovered lines: ')}${bold(red(newStat.uncoveredLineNumbers))}`;
    } else {
        return '';
    }
}

export function compareBaseline(baseline: CoverageTable, newStats: CoverageTable) {
    const allFileLinePercentDiff = newStats.allFiles.linePercent - baseline.allFiles.linePercent;
    console.log('Comparing line coverage % against baseline');
    console.log('All files: ', colorizeDiff(allFileLinePercentDiff));

    newStats.items.forEach(newStat => {
        const baselineStat = baseline.items.find(item => item.file === newStat.file);
        if (baselineStat) {
            const diff = newStat.linePercent - baselineStat.linePercent;
            if (diff !== 0) {
                console.log(` ${baselineStat.file}: ${colorizeDiff(diff)} ${uncoveredLines(newStat, baselineStat)}`);
            }
        }
    })


}
