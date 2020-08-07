import {Line} from './parse-lines';

export function parseCoverageLine(lines: Line[]): Line[] {
    const coverages: Line[] = [];

    let isTableBorder = false;
    let isTableHeader = false;
    let isDataRow = false;

    let hasTableHeader = false;
    let hasDataRows = false;

    let continueParsing = true;

    lines.forEach((l) => {
        isTableBorder = l.line.search(/^-+\|/) >= 0;
        isTableHeader = l.line.search(/File\s+\|\s+% Stmts\s+\|/) >= 0;

        if (!isTableBorder && !hasTableHeader) {
            hasTableHeader = isTableHeader;
        }

        isDataRow = hasDataRows && !isTableBorder && !isTableHeader;

        if (continueParsing && hasTableHeader && !isTableBorder && !isTableHeader) {
            coverages.push(l);
            isDataRow = true;
            hasDataRows = true;
        }

        if (hasDataRows && !isDataRow) {
            continueParsing = !isTableBorder;
        }
    });

    return coverages;
}
