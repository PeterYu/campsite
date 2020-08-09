import {spawn} from 'child_process';
import {Line} from './parse-lines';
import * as fs from 'fs';
import {bold, green, red} from 'colors/safe';
import {compareBaseline} from './compare-baseline';
import {parseCoverageOutput} from './parse-coverage';

export interface Args {
    baseline?: boolean;
}

function printBorder(columnWidths: number[]) {
    console.log(columnWidths.map(w => '-'.repeat(w)).join('|').concat('|'));
}

function printLine(columnContents: string[], columnWidths: number[]) {
    console.log(columnContents.map((c, i) => ` ${c}`.padEnd(columnWidths[i], ' ')).join('|').concat('|'));
}

function printDataLine(
    file: string,
    columnContents: number[],
    uncoveredLines: string,
    columnWidths: number[],
    fileStatus: FileStatus,
    decoratorFunc: (s: string) => string
) {
    let fileStatusIndicator;
    switch (fileStatus) {
        case FileStatus.ADDED:
            fileStatusIndicator = '+';
            break;
        case FileStatus.DELETED:
            fileStatusIndicator = '-';
            break;
        default:
            fileStatusIndicator = ' ';
    }
    console.log(`${fileStatusIndicator}${file}`.padEnd(columnWidths[0])
        .concat('|')
        .concat(columnContents.map((c, i) => {
            return fileStatus === FileStatus.REMAINS ?
                decoratorFunc(parseFloat(`${c}`).toFixed(2).padStart(columnWidths[i + 1])) :
                parseFloat(`${c}`).toFixed(2).padStart(columnWidths[i + 1]);
        }).join('|'))
        .concat('|')
        .concat(` ${uncoveredLines}`.padEnd(columnWidths[columnWidths.length - 1]))
        .concat('|'));

}

export function jestCoverage(bsArgs: Args) {
    const jestProc = spawn('npx', ['jest', '--coverage']);

    const stdout: string[] = [];

    jestProc.on('error', error => console.error(error));
    jestProc.stdout.on('data', data => {
        stdout.push(`${data}`);
    });
    jestProc.on('exit', () => {
        const coverageTable = parseCoverageOutput(stdout.join(''));
        if (bsArgs.baseline) {
            fs.writeFileSync('campsite.baseline', JSON.stringify(coverageTable, null, '\t'));
        } else {
            if (fs.existsSync('campsite.baseline')) {
                const baselineBuffer = fs.readFileSync('campsite.baseline', {encoding: 'utf8'});

                const diffTable = compareBaseline(JSON.parse(baselineBuffer), coverageTable);

                console.log('Baseline comparison');

                printBorder(coverageTable.columnWidths);
                printLine(['File', '% Stmts', '% Branch', '% Funcs', '% Lines', 'Uncovered Line #s'], coverageTable.columnWidths);
                printBorder(coverageTable.columnWidths);
                printDataLine(
                    'All files',
                    [
                        diffTable.allFiles.statementPercent,
                        diffTable.allFiles.branchPercent,
                        diffTable.allFiles.functionPercent,
                        diffTable.allFiles.linePercent
                    ],
                    diffTable.allFiles.uncoveredLineNumbers,
                    coverageTable.columnWidths,
                    FileStatus.REMAINS,
                    colorizeDiff
                );

                diffTable.items.forEach(diff => {
                    printDataLine(
                        diff.file,
                        [
                            diff.statementPercent,
                            diff.branchPercent,
                            diff.functionPercent,
                            diff.linePercent
                        ],
                        diff.uncoveredLineNumbers,
                        coverageTable.columnWidths,
                        diff.fileStatus,
                        colorizeDiff
                    );
                });

                printBorder(coverageTable.columnWidths);
            }
        }
    })
}

export class CoverageLine extends Line {
    constructor(public line: string, public path: string) {
        super(line);
    }
}

export enum FileStatus {
    ADDED = 'ADDED',
    DELETED = 'DELETED',
    REMAINS = 'REMAINS'
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

export interface DiffItem extends CoverageItem {
    fileStatus: FileStatus;
}

export interface CoverageTable {
    columnWidths: number[];
    allFiles: CoverageItem;
    items: CoverageItem[]
}

export interface DiffTable {
    columnWidths: number[];
    allFiles: CoverageItem;
    items: DiffItem[];
}

function colorizeDiff(diff: string) {
    const roundedDiff = Number.parseFloat(diff.trim());
    if (roundedDiff > 0) {
        return bold(green(`+${roundedDiff}% `.padStart(diff.length)));
    } else if (roundedDiff < 0) {
        return bold(red(`${roundedDiff}% `.padStart(diff.length)));
    } else {
        return `${roundedDiff}% `.padStart(diff.length);
    }
}
