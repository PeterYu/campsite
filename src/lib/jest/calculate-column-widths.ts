import {Line} from './parse-lines';

export function calculateColumnWidths(line: Line): number[] {
    return line.line.split('|').map(c => c.length);
}
