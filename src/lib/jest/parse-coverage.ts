import {Line, parseLines} from './parse-lines';
import {parseCoverageLine} from './coverage-line-parser';
import {convertCoverageLinesToCoverageItems} from './to-coverage-item';
import {CoverageItem, CoverageLine, CoverageTable} from './jest';
import {toCoverageLines} from './to-coverage-lines';

export function parseCoverageOutput(rawOutput: string): CoverageTable {
    const lines = parseLines(rawOutput);

    let parsedLines: Line[] = parseCoverageLine(lines);

    let coverageLines: CoverageLine[] = toCoverageLines(parsedLines);

    let coverageItems: CoverageItem[] = convertCoverageLinesToCoverageItems(coverageLines);

    return {
        allFiles: coverageItems[0],
        items: coverageItems.splice(1)
    };
}

