import {Line} from './parse-lines';
import {CoverageLine} from './jest';

function getFile(l: Line) {
    const [file] = l.line.split('|');
    return file.trim();
}

export function toCoverageLines(lines: Line[]): CoverageLine[] {
    const coverageLines:CoverageLine[] = [];
    let lastDir:string;
    lines.forEach((l) => {
        const isAllFileLine = l.line.search(/^\S/) === 0;
        const isDir = l.line.search(/^ \S/) === 0;
        const isFile = l.line.search(/^  \S/) === 0;

        if (isDir) {
            lastDir = getFile(l);
        }

        let path = '';
        if (isAllFileLine) {
        } else if (isDir) {
            path = getFile(l);
        } else if (isFile) {
            path = `${lastDir}/${getFile(l)}`;
        }

        coverageLines.push(new CoverageLine(l.line, path));
    });

    return coverageLines;
}

