import {Line} from '../../src/lib/jest/parse-lines';
import {calculateColumnWidths} from '../../src/lib/jest/calculate-column-widths';

describe('Calculate Column Widths', () => {
    test('widths', () => {
        const line = new Line('-------------------|---------|----------|---------|---------|-------------------|');

        const widths = calculateColumnWidths(line);

        expect(widths).toEqual([19, 9, 10, 9, 9, 19, 0]);
    });
});
