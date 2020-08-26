import {spawn} from 'child_process';
import process from 'process';
import {Line} from './parse-lines';
import * as fs from 'fs';
import {bold, green, red} from 'colors/safe';
import {parseCoverageOutput} from './parse-coverage';
import {diffBaseline} from './diff-baseline';
import {yellow} from 'colors';

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

    const colWidths = [...columnWidths];
    const [colWidthFiles, ...colWidthRest] = colWidths;
    const [colWidthUncoveredLines] = colWidths.reverse();

    console.log(`${fileStatusIndicator}${file}`.padEnd(colWidthFiles)
        .concat('|')
        .concat(columnContents.map((c, i) => {
            return fileStatus === FileStatus.REMAINS ?
                decoratorFunc(parseFloat(`${c}`).toFixed(2).padStart(colWidthRest[i])) :
                parseFloat(`${c}`).toFixed(2).padStart(colWidthRest[i]);
        }).join('|'))
        .concat('|')
        .concat(` ${uncoveredLines}`.padEnd(colWidthUncoveredLines))
        .concat('|'));

}

function printItems(columnWidths: number[], diffItems: DiffItem[]) {
    diffItems.forEach(diff => {
        printDataLine(
            diff.file,
            [
                diff.statementPercent,
                diff.branchPercent,
                diff.functionPercent,
                diff.linePercent
            ],
            diff.uncoveredLineNumbers,
            [...columnWidths],
            diff.fileStatus,
            colorizeDiff
        );
    });
}

export function jestCoverage(bsArgs: Args) {
    const jestProc = spawn('npx', ['jest', '--coverage']);

    jestProc.stdout.pipe(process.stdout);
    jestProc.stderr.pipe(process.stderr);
    const stdout: string[] = [];

    jestProc.on('error', error => console.error(error));
    jestProc.stdout.on('data', data => {
        const stdData = `${data}`;
        stdout.push(stdData);
    });
    jestProc.on('exit', () => {
        const coverageTable = parseCoverageOutput(stdout.join(''));
        if (bsArgs.baseline) {
            fs.writeFileSync('campsite.baseline', JSON.stringify(coverageTable, null, '\t'));
        } else {
            if (fs.existsSync('campsite.baseline')) {
                const baselineBuffer = fs.readFileSync('campsite.baseline', {encoding: 'utf8'});

                const diffTable = diffBaseline(JSON.parse(baselineBuffer), coverageTable);

                console.log();
                console.log(bold(yellow('Baseline Comparison')));
                printBorder(coverageTable.columnWidths);
                printLine(['File', '% Stmts', '% Branch', '% Funcs', '% Lines', 'Uncovered Line #s'], coverageTable.columnWidths);
                printBorder(coverageTable.columnWidths);

                const addedItems = diffTable.items.filter(i => i.fileStatus === FileStatus.ADDED);
                if (addedItems.length > 0) {
                    console.log('Added Files');
                    printItems(coverageTable.columnWidths, addedItems);
                    printBorder(coverageTable.columnWidths);
                }

                const deletedItems = diffTable.items.filter(i => i.fileStatus === FileStatus.DELETED);
                if (deletedItems.length > 0) {
                    console.log('Deleted Files');
                    printItems(coverageTable.columnWidths, deletedItems);
                    printBorder(coverageTable.columnWidths);
                }

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

                const remainsItems = diffTable.items.filter(i => i.fileStatus === FileStatus.REMAINS);
                if (remainsItems.length > 0) {
                    printItems(coverageTable.columnWidths, remainsItems);
                }

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
