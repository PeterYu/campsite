import {Line, parseLines} from '../../src/lib/parse-lines';

describe('Line Parser', () => {

    test('comparing lines', () => {
        expect(new Line('hello')).toEqual(new Line('hello'));
        expect(new Line('hello')).not.toEqual(new Line('world'));
    });

    test('no lines', () => {
        const lines = parseLines('');
        expect(lines.length).toEqual(0);
    });

    test('empty lines', () => {
        const lines = parseLines(`

`);
        expect(lines.length).toEqual(0);
    });

    test('one line', () => {
        const lines = parseLines('hello world');
        expect(lines).toEqual([new Line('hello world')]);
    });

    test('trim white spaces', () => {
        const lines = parseLines("\thello world   ");
        expect(lines).toEqual([new Line('hello world')]);
    });

    test('multiple lines', () => {
        const lines = parseLines(`
hello
world
`);
        expect(lines).toEqual([
            new Line('hello'),
            new Line('world'),
        ]);
    });

});
