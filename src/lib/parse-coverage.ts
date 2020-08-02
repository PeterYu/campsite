import {parseLines} from './parse-lines';
import {parseCoverageLine} from './coverage-line-parser';
import {convertCoverageLinesToCoverageItems} from './to-coverage-item';
import {CoverageItem, CoverageLine, CoverageTable} from './jest';

export function parseCoverageOutput(rawOutput: string): CoverageTable {
    const lines = parseLines(rawOutput);

    let coverageLines: CoverageLine[] = parseCoverageLine(lines);

    let coverageItems: CoverageItem[] = convertCoverageLinesToCoverageItems(coverageLines);

    return {
        allFiles: coverageItems[0],
        items: coverageItems.splice(1)
    };
}

