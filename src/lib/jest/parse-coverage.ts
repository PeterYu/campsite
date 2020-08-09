import {Line, parseLines} from './parse-lines';
import {parseCoverageLine} from './coverage-line-parser';
import {convertCoverageLinesToCoverageItems} from './to-coverage-item';
import {CoverageItem, CoverageLine, CoverageTable} from './jest';
import {toCoverageLines} from './to-coverage-lines';
import {calculateColumnWidths} from './calculate-column-widths';

export function parseCoverageOutput(rawOutput: string): CoverageTable {
    const lines = parseLines(rawOutput);

    const parsedLines: Line[] = parseCoverageLine(lines);

    const coverageLines: CoverageLine[] = toCoverageLines(parsedLines);

    const coverageItems: CoverageItem[] = convertCoverageLinesToCoverageItems(coverageLines);

    return {
        columnWidths: calculateColumnWidths(lines[0]),
        allFiles: coverageItems[0],
        items: coverageItems.splice(1)
    };
}

